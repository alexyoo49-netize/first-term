const assert=require('assert');
let G=require('./src/unification-engine.js');
for(const name of ['politics','presidency','regions','guidance','progress'])G=require('./src/unification-'+name+'.js')(G);
const settle=s=>{let n=0;while(s.pending&&s.phase!=='ended'){assert(++n<12,'event chain loop');const o=G.events[s.pending.id].options.find(o=>!G.optionAllowed(s,o));assert(o,`No available choice ${s.pending.id}`);assert(G.resolve(s,o.id));}return n;};
const start=(leader='johnson',scenario='gradual',seed=7)=>{const s=G.start(leader,scenario,seed);settle(s);return s;};
let runs=0,maxBytes=0,scandals=0,removals=0,political=0;
for(const l of G.leaders)for(const c of G.scenarios)for(let seed=1;seed<=10;seed++){
 const s=start(l.id,c.id,seed);assert.equal(s.version,6);
 for(let t=0;t<G.turnLimit&&s.phase!=='ended';t++){
  if(seed<=3){const id=t%2?'deal':'spin';G.politicalAction(s,id,Math.min(2,Math.max(0,s.pp-3)));}
  else if(seed===4&&t===1)G.declareMartial(s);
  else for(const i of [6,4,8,2,7,3,5,9])if(s.levels[i]<3&&G.policyCost(s,i,s.levels[i]+1)<=s.pp){G.applyPolicy(s,i,s.levels[i]+1);break;}
  assert(G.advance(s));assert(!G.advance(s));assert.deepEqual(G.restore(G.snapshot(s)).presidency,s.presidency);political+=settle(s);
  for(const obj of [s.risk,s.boost,G.metrics(s),G.finance(s),G.polls(s)])for(const n of Object.values(obj))assert(Number.isFinite(n));
  assert(s.pp>=0);assert(s.presidency.deferred.length===0||s.phase==='ended');
  const bytes=Buffer.byteLength(JSON.stringify({modelContent:{leader:G.leader(s).name,rival:G.rivalLeader(s).name,risks:s.risk,latestChoice:s.history.slice(-1)},privateContent:{game:G.snapshot(s)}}));maxBytes=Math.max(maxBytes,bytes);assert(bytes<16384,bytes);
 }
 assert.equal(s.phase,'ended');assert(!G.advance(s));scandals+=s.presidency.cases.filter(c=>c.status==='exposed').length;removals+=s.presidency.impeachment.stage==='removed';runs++;
}
// Political investment affects real two-check discovery odds; each action consumes its displayed cost once.
const s=start();s.pp=30;const high=G.discoveryChance(s,'spin',0),low=G.discoveryChance(s,'spin',5);assert(low<high&&low>=12);assert(G.politicalAction(s,'spin',5));assert.equal(s.pp,22);const c=s.presidency.cases[0];assert(Math.abs((1-(1-c.perCheck)**c.checks)*100-low)<1e-8);assert(!G.politicalAction(s,'deal'));assert.equal(s.pp,22);
// Save/restore never re-rolls the case or loses the scheduled original event.
const copy=G.restore(G.snapshot(s));G.advance(s);G.advance(copy);assert.deepEqual(s,copy);settle(s);settle(copy);assert.deepEqual(s,copy);
// Guaranteed fixture verifies disclosure, hearing and persistent evidence.
const gate=start();G.politicalAction(gate,'spin',0);gate.presidency.cases[0].perCheck=1;G.advance(gate);assert.equal(gate.pending.id,'gate_break');assert.equal(gate.presidency.evidence,40);assert.equal(gate.presidency.gate.stage,'investigation');const original=gate.presidency.deferred[0].id;G.resolve(gate,'disclose');assert.equal(gate.pending.id,original);settle(gate);G.advance(gate);assert.equal(gate.pending.id,'gate_hearing');settle(gate);assert.equal(gate.presidency.cooperation,16);assert.equal(gate.presidency.evidence,40);
// Unexposed cases close after exactly two checks.
const clean=start();G.politicalAction(clean,'spin');clean.presidency.cases[0].perCheck=0;G.advance(clean);settle(clean);assert.equal(clean.presidency.cases[0].status,'watch');G.advance(clean);settle(clean);assert.equal(clean.presidency.cases[0].status,'closed');
// Opponent acts immediately and can be exposed, with a distinct tactic for each personality.
const kinds=new Set();for(const id of G.leaders.map(l=>l.id)){const op=start(id==='johnson'?'macron':'johnson','gradual',4);op.rival.id=id;G.advance(op);assert.equal(op.pending.id,'op_shadow');assert(op.rival.lastAction.result.includes('검증 가능'));assert.equal(op.presidency.opponentOps.length,1);kinds.add(op.presidency.opponentOps[0].kind);}assert.equal(kinds.size,3);
// Military crisis grants a short-term intervention, then the legislature demands a decision.
const martial=start();martial.risk.unrest=90;const pp=martial.pp;assert(G.declareMartial(martial));assert.equal(martial.risk.unrest,65);assert.equal(martial.pp,pp-5);assert.equal(martial.presidency.evidence,12);assert(!G.declareMartial(martial));G.advance(martial);assert.equal(martial.pending.id,'martial_review');G.resolve(martial,'lift');assert(!martial.presidency.martial.active);settle(martial);
const unlawful=start();unlawful.pp=30;unlawful.risk.unrest=20;unlawful.risk.military=20;G.declareMartial(unlawful);assert.equal(unlawful.presidency.evidence,48);G.advance(unlawful);G.resolve(unlawful,'extend');assert.equal(unlawful.presidency.evidence,86);assert.equal(unlawful.pending.id,'impeachment_motion');
const menuLift=start();menuLift.risk.unrest=90;G.declareMartial(menuLift);G.advance(menuLift);const trustBefore=menuLift.mediaTrust;assert(G.liftMartial(menuLift));assert.notEqual(menuLift.pending?.id,'martial_review');assert(!G.liftMartial(menuLift));assert.equal(menuLift.mediaTrust,trustBefore+3);
// Approval alone can lead to a vote but cannot produce a removal at constitutional review.
const unpopular=start();unpopular.boost.approval=-100;unpopular.boost.assembly=-100;G.advance(unpopular);settle(unpopular);assert.equal(unpopular.presidency.lowApprovalTurns,1);G.advance(unpopular);assert.equal(unpopular.pending.id,'impeachment_motion');G.resolve(unpopular,'vote');assert.equal(unpopular.pending.id,'impeachment_review');assert(!G.usePower(unpopular));assert(!G.declareMartial(unpopular));assert(!G.applyPolicy(unpopular,4,3));G.resolve(unpopular,'review');assert.equal(unpopular.presidency.impeachment.stage,'dismissed');assert.notEqual(unpopular.phase,'ended');settle(unpopular);
// Evidence-heavy impeachment removes the president and never fabricates an election.
const removed=start();removed.boost.assembly=-100;removed.presidency.evidence=90;G.advance(removed);assert.equal(removed.pending.id,'impeachment_motion');G.resolve(removed,'vote');G.resolve(removed,'review');assert.equal(removed.phase,'ended');assert.equal(removed.outcome,'탄핵 인용, 대통령 파면');assert.equal(removed.election,null);assert.equal(removed.pending,null);
// Parliamentary support and paid lobbying can stop an impeachment even with serious evidence.
const survives=start();survives.presidency.evidence=65;survives.boost.assembly=20;G.advance(survives);assert.equal(survives.pending.id,'impeachment_motion');G.resolve(survives,'persuade');assert.equal(survives.presidency.impeachment.stage,'dismissed');settle(survives);
// Advisers respond to real current state and lead to functional destinations.
const advise=start();advise.risk.disease=100;advise.risk.food=0;assert.equal(G.advice(advise)[0].id,'nightingale');assert.equal(G.advice(advise)[0].target,'health');advise.risk.unrest=80;G.declareMartial(advise);assert.equal(G.advice(advise).find(a=>a.id==='marshall').target,'emergency');

// New games end at ten; existing saves keep their original twenty-turn horizon.
assert.equal(G.turnLimit,10);
const newGame=start();assert.equal(G.termLimit(newGame),10);
const legacy=G.snapshot(start());delete legacy.termLimit;delete legacy.tutorial;
legacy.turn=11;const restored=G.restore(legacy);
assert.equal(G.termLimit(restored),20);assert.equal(restored.turn,11);assert(restored.tutorial.done);
assert(G.advance(restored));assert.equal(restored.turn,12);settle(restored);assert.notEqual(restored.phase,'ended');
const final=start();final.turn=9;G.advance(final);settle(final);assert.equal(final.turn,10);assert.equal(final.phase,'ended');
const oldFinal=G.restore({...legacy,turn:19});G.advance(oldFinal);settle(oldFinal);assert.equal(oldFinal.turn,20);assert.equal(oldFinal.phase,'ended');
// Tutorial progress survives reload and does not reset a resumed game.
const guided=G.start('macron','collapse',9);guided.tutorial.step=2;
assert.deepEqual(G.restore(G.snapshot(guided)).tutorial,{step:2,done:false});
guided.tutorial.done=true;assert(G.restore(G.snapshot(guided)).tutorial.done);
// Every event gives an affordable recommendation, including zero political capital.
let adviceChecks=0;
for(const id of Object.keys(G.events))for(const pp of [0,2,30]){
 const e=G.start('johnson','collapse',4);e.pending={id,cause:'test'};e.pp=pp;
 const a=G.eventAdvice(e);assert(a.situation&&a.recommendation&&a.tradeoff);
 assert(!a.text.includes('undefined'));assert(G.eventExplanation(e).meaning.length>20);
 if(a.choice)assert(!G.optionAllowed(e,G.events[id].options.find(o=>o.id===a.choice)));
 adviceChecks++;
}
const limited=start();limited.risk.disease=100;limited.risk.food=0;limited.levels[4]=4;
assert(G.advice(limited).find(a=>a.id==='nightingale').recommendation.includes('최대'));
limited.levels[4]=2;limited.remaining[4]=1;
assert(G.advice(limited).find(a=>a.id==='nightingale').recommendation.includes('반영되는 중'));
limited.remaining[4]=0;limited.pp=0;
assert(G.advice(limited).find(a=>a.id==='nightingale').recommendation.includes('필요하지만'));
// Final-turn martial review must not bypass the election or strand a deferred event.
const lastMartial=start();lastMartial.turn=9;lastMartial.risk.unrest=90;G.declareMartial(lastMartial);
G.advance(lastMartial);assert.equal(lastMartial.pending.id,'martial_review');G.resolve(lastMartial,'lift');settle(lastMartial);
assert.equal(lastMartial.phase,'ended');assert.equal(lastMartial.turn,10);
// A baseline is captured before the first decision and never rewritten by it.
const tracked=G.start('johnson','collapse',8),before=G.progressSeries(tracked,'capacity');
const baseline=JSON.stringify(tracked.progress.initial);
assert(G.resolve(tracked,'staff'));
assert.equal(JSON.stringify(tracked.progress.initial),baseline);
assert.equal(G.progressSeries(tracked,'capacity').delta,8);
assert.equal(G.progressSeries(tracked,'capacity').status,'better');
assert.equal(G.progressSeries(tracked,'capacity').lastDelta,null);
assert.equal(tracked.progress.rows.length,1);
// Refused actions and repeated reads do not create fake samples.
const unchanged=JSON.stringify(tracked.progress);assert(!G.resolve(tracked,'staff'));
G.progressSeries(tracked,'capacity');G.snapshot(tracked);assert.equal(JSON.stringify(tracked.progress),unchanged);
// Freeze the previous turn only after all its decisions; record adviser results too.
assert(G.dispatchAdviser(tracked,'nightingale','water'));
const previousDisease=G.progressSeries(tracked,'disease').current;
assert(G.advance(tracked));settle(tracked);
const diseaseProgress=G.progressSeries(tracked,'disease');
assert.equal(diseaseProgress.lastDelta,Math.round((diseaseProgress.current-previousDisease)*10)/10);
assert.equal(diseaseProgress.current,Math.round(tracked.risk.disease*10)/10);
assert.deepEqual(G.restore(G.snapshot(tracked)).progress,tracked.progress);
// A lower unemployment rate is an improvement; extra spending is not scored as a failure.
const jobsBefore=G.progressSeries(tracked,'jobs').initial;tracked.boost.jobs-=2;
assert(G.progressSeries(tracked,'jobs').current<jobsBefore);
assert.equal(G.progressSeries(tracked,'jobs').status,'better');
assert.equal(G.progressSeries(tracked,'spending').definition.direction,0);
// Old saves begin at their real current state instead of inventing earlier values.
const previousSave=G.snapshot(tracked);delete previousSave.progress;previousSave.turn=7;
const resumed=G.restore(previousSave),firstRecord=G.progressSeries(resumed,'infra');
assert.equal(firstRecord.origin,'resumed');assert.equal(firstRecord.from,7);
assert.equal(firstRecord.delta,0);assert.equal(firstRecord.lastDelta,null);assert.equal(firstRecord.points.length,1);
assert.deepEqual(G.restore(G.snapshot(resumed)).progress,resumed.progress);
// Invalid or incomplete chart data cannot break loading an otherwise valid game.
const malformed=G.restore({...previousSave,progress:{v:1,from:0,origin:'new',initial:[null],rows:[[0]]}});
assert.equal(G.progressSeries(malformed,'infra').from,7);
// Complete a legacy twenty-turn game with all chart records within the save budget.
const longGame=start();longGame.termLimit=20;
while(longGame.phase!=='ended'){assert(G.advance(longGame));settle(longGame);assert(longGame.progress.rows.length<=21);}
assert.equal(longGame.turn,20);assert.equal(longGame.progress.rows.length,21);
const longBytes=Buffer.byteLength(JSON.stringify(G.snapshot(longGame)));assert(longBytes<16384,longBytes);
console.log(JSON.stringify({passed:true,runs,maxBytes,longBytes,scandals,removals,politicalDecisions:political,adviceChecks,progressChecks:true}));
