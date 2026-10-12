(function(scope){
'use strict';
function install(G){
const base={start:G.start,restore:G.restore,advance:G.advance};
const metric=(id,name,direction=1,help='')=>({id,name,group:'생활과 행정',unit:'점',direction,max:100,help});
const support=(id,name,help)=>({id,name,group:'여론',unit:'%',direction:1,max:100,help});
// Keep this order stable: saved rows use numeric columns to fit the save limit.
const definitions=[
 metric('capacity','행정 집행력',1,'공무원이 주민 기록을 확인하고 정부 정책을 실행할 수 있는 능력입니다. 높을수록 좋습니다.'),
 metric('infra','기반시설',1,'전력, 주택과 물류 시설의 복구 정도입니다. 높을수록 주민과 기업이 시설을 안정적으로 이용할 수 있습니다.'),
 metric('poverty','빈곤',-1,'주민이 식량과 생활비를 구하기 어려운 정도입니다. 빈곤 인구의 비율이 아니라 게임 속 지수이며, 낮을수록 좋습니다.'),
 {...metric('jobs','실업률',-1,'일할 의사가 있는 사람 중 일자리를 구하지 못한 사람의 비율입니다. 낮을수록 좋습니다.'),unit:'%',max:50},
 metric('unity','지역 신뢰',1,'서로 다른 지역의 주민이 통합정부와 협력할 수 있는 정도입니다. 높을수록 지역 갈등을 줄이기 쉽습니다.'),
 metric('army','군 통합',1,'기존 군부대가 새 정부의 지휘체계를 받아들인 정도입니다. 높을수록 군 불복종 위험을 줄이기 쉽습니다.'),
 metric('health','의료 대응력',1,'병원과 방역 조직이 환자를 치료하고 감염 확산에 대응할 수 있는 능력입니다. 높을수록 좋습니다.'),
 metric('foreign','외교 신뢰',1,'다른 나라가 통합정부를 믿고 협력하려는 정도입니다. 높을수록 원조와 협력 기회를 얻기 쉽습니다.'),
 ...G.riskDefs.map(r=>({id:r.id,name:r.name+' 위험',group:'위기',unit:'점',direction:-1,max:100,help:'위험 수치는 사건이 발생할 확률 자체가 아닙니다. 0점에 가까울수록 안정적이고, 50점부터 경보, 75점부터 심각한 위험으로 봅니다.'})),
 support('approval','국민 지지율','정부의 국정 운영을 지지하는 주민의 비율입니다. 선거 예상 득표율과는 다릅니다.'),
 support('worker','노동자 지지율','노동자는 일자리와 생활 여건의 변화에 민감하게 반응합니다.'),
 support('business','기업인 지지율','기업인은 법인세 부담과 고용 여건의 변화를 평가합니다.'),
 support('low','저소득층 지지율','저소득층은 생계 지원과 빈곤 완화에 민감하게 반응합니다.'),
 support('middle','중산층 지지율','중산층은 소득세 부담과 일자리 문제를 평가합니다.'),
 {...metric('mediaTrust','정부 발표 신뢰',1,'주민이 정부의 설명을 믿는 정도입니다. 높아지면 정부가 야당의 공격에 대응하고 유권자를 설득하기 쉬워집니다.'),group:'여론'},
 {...metric('assembly','의회 협조',1,'의원들이 정부 정책에 협조하는 정도입니다. 높아지면 정책을 바꾸는 데 필요한 정치력이 줄어들 수 있습니다.'),group:'여론'},
 {id:'income',name:'세입',group:'재정',unit:'조',direction:0,help:'현재 세율과 위기 상황을 기준으로 정부가 다음 턴에 거둘 것으로 예상하는 돈입니다. 세금을 올려 늘어난 수입에는 주민의 반발이 따를 수 있습니다.'},
 {id:'spending',name:'지출',group:'재정',unit:'조',direction:0,help:'현재 정책을 유지할 때 정부가 다음 턴에 쓸 것으로 예상하는 돈입니다. 사업비, 기존 운영비와 이자를 포함합니다. 지출이 늘거나 줄었다는 사실만으로 정책의 성공을 판단할 수는 없습니다.'},
 {id:'deficit',name:'재정 적자',group:'재정',unit:'조',direction:-1,help:'다음 턴 예상 지출에서 세입을 뺀 금액입니다. 0보다 크면 부족한 돈을 빌려야 하고, 0보다 작으면 흑자입니다.'},
 {id:'debt',name:'국가 부채',group:'재정',unit:'조',direction:-1,help:'정부가 지금까지 빌린 돈의 잔액입니다. 매 턴 적자와 사건의 긴급 지출에 따라 늘어나고, 원조나 흑자가 생기면 줄어들 수 있습니다.'},
 support('gov','대통령 예상 득표율','현재 지지율과 두 진영의 조직력, 신뢰, 공세를 함께 계산한 선거 전망입니다. 임기가 끝나면 최종 득표율을 표시합니다.')
];
const rounded=n=>Math.round(n*10)/10;
function values(s){const f=G.finance(s),v=G.votes(s);const data={...G.metrics(s),...s.risk,...v.groups,...f,approval:v.all,mediaTrust:s.mediaTrust,assembly:v.assembly,debt:s.debt,gov:(s.election||G.polls(s)).gov};return definitions.map(d=>rounded(data[d.id]));}
function fresh(s,origin){return {v:1,from:s.turn,origin,initial:values(s),rows:[]};}
function valid(p,s){const vector=v=>Array.isArray(v)&&v.length===definitions.length&&v.every(Number.isFinite);return p?.v===1&&Number.isInteger(p.from)&&p.from>=0&&p.from<=s.turn&&['new','resumed'].includes(p.origin)&&vector(p.initial)&&Array.isArray(p.rows)&&p.rows.length<=G.termLimit(s)+1&&p.rows.every((r,i)=>Array.isArray(r)&&Number.isInteger(r[0])&&r[0]>=p.from&&r[0]<=s.turn&&(i===0||r[0]>p.rows[i-1][0])&&vector(r.slice(1)));}
function record(s){if(s.phase==='setup')return;if(!valid(s.progress,s))s.progress=fresh(s,'resumed');const row=[s.turn,...values(s)],last=s.progress.rows.at(-1);if(last?.[0]===s.turn)s.progress.rows[s.progress.rows.length-1]=row;else s.progress.rows.push(row);}
G.start=(...args)=>{const s=base.start(...args);s.progress=fresh(s,'new');record(s);return s;};
G.restore=v=>{const s=base.restore(v);if(s.phase!=='setup')record(s);return s;};
G.advance=s=>{if(s.phase!=='planning'||s.turn>=G.termLimit(s)||s.outcome)return false;record(s);const ok=base.advance(s);if(ok)record(s);return ok;};
for(const name of ['resolve','applyPolicy','usePower','politicalAction','declareMartial','liftMartial','dispatchAdviser']){const action=G[name];G[name]=(s,...args)=>{const ok=action(s,...args);if(ok)record(s);return ok;};}
function series(s,id){const column=definitions.findIndex(d=>d.id===id);if(column<0||s.phase==='setup')return null;const definition=definitions[column],p=valid(s.progress,s)?s.progress:fresh(s,'resumed');const current=values(s)[column],initial=p.initial[column];const points=[{turn:p.from,label:p.origin==='new'?'취임 직후':p.from+'턴 기록 시작',value:initial,baseline:true}];
 const rows=p.rows.filter(r=>r[0]<s.turn).concat([[s.turn,...values(s)]]);
 for(const r of rows){if(r[0]===p.from&&r[column+1]===initial&&s.turn>p.from)continue;if(r[0]===p.from&&r[column+1]===initial&&rows.length===1)continue;points.push({turn:r[0],label:r[0]===0?'취임 당일':r[0]+'턴',value:r[column+1],baseline:false});}
 const previous=rows.find(r=>r[0]===s.turn-1),delta=rounded(current-initial),lastDelta=previous?rounded(current-previous[column+1]):null;
 const status=delta===0?'same':definition.direction===0?'neutral':delta*definition.direction>0?'better':'worse';
 return {definition,points,current,initial,delta,lastDelta,status,from:p.from,origin:p.origin,comparison:p.origin==='new'?'취임 대비':'기록 시작 대비'};
}
Object.assign(G,{progressDefinitions:definitions,progressSeries:series});
return G;
}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else install(scope.UnificationGame);
})(globalThis);
