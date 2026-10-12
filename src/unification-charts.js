(function(scope){
'use strict';
const G=scope.UnificationGame;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number(n).toFixed(1),unit=d=>d.unit==='%'?'%p':d.unit;
const change=(n,d)=>n===null?'비교 기록 없음':(n>0?'+':'')+number(n)+unit(d);
const tone=(n,d)=>n===null||n===0?'same':d.direction===0?'neutral':n*d.direction>0?'better':'worse';
const words=(n,d)=>n===0?'변화 없음':d.direction===0?(n>0?'증가':'감소'):n*d.direction>0?'개선':'악화';
const value=(n,d)=>number(n)+d.unit;
function geometry(data){const d=data.definition,all=data.points.map(p=>p.value),lo=Math.min(0,...all),hi=Math.max(1,...all);let min=0,max=d.max||100;if(!d.max){const range=hi-lo,raw=range/4,power=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].map(n=>n*power).find(n=>n>=raw);min=Math.floor(lo/step)*step;max=Math.ceil(hi/step)*step;}const left=48,right=654,top=25,bottom=205;return {min,max,left,right,top,bottom,x:i=>left+(right-left)*(data.points.length===1?0:i/(data.points.length-1)),y:n=>bottom-(n-min)/(max-min)*(bottom-top)};}
function pointText(s,data,index){const p=data.points[index],d=data.definition,delta=Math.round((p.value-data.initial)*10)/10;const log=p.baseline?[]:s.history.filter(h=>h.turn===p.turn).slice(-2);return `<div class="g-chart-inspection-head"><b>${esc(p.label)}${index===data.points.length-1?' / 현재':''}</b><strong>${value(p.value,d)}</strong><span class="g-change-${tone(delta,d)}">${data.comparison} ${change(delta,d)}</span></div>${log.length?`<p>같은 턴에 내린 결정: ${log.map(h=>esc(h.choice)).join(' / ')}</p>`:`<p>${p.baseline?(data.origin==='new'?'취임 직후, 첫 사건에 대응하기 전의 상태입니다.':'이 저장에서 처음으로 수치를 기록한 시점입니다.'):'정책 집행, 사건 대응과 정치 활동이 반영된 상태입니다.'}</p>`}`;}
function markup(s,id){const data=G.progressSeries(s,id);if(!data)return '';const d=data.definition,g=geometry(data),points=data.points,last=points.length-1,groups=['생활과 행정','위기','여론','재정'];const ticks=Array.from({length:5},(_,i)=>g.min+(g.max-g.min)*i/4);const line=points.map((p,i)=>`${g.x(i)},${g.y(p.value)}`).join(' ');const pointLabel=i=>i===0||i===last||points.length<9||i%2===0;
 const related=G.policies.filter(p=>p.links.some(([key])=>key===id));
 return `<section class="g-progress" data-progress-chart="${d.id}">
 <nav class="g-chart-groups" aria-label="지표 종류">${groups.map(group=>`<button type="button" data-progress-pick="${G.progressDefinitions.find(x=>x.group===group).id}" aria-pressed="${group===d.group}">${group}</button>`).join('')}</nav>
 <nav class="g-chart-picker" aria-label="변화 그래프 선택">${G.progressDefinitions.filter(x=>x.group===d.group).map(x=>`<button type="button" data-progress-pick="${x.id}" aria-pressed="${x.id===id}">${x.name}</button>`).join('')}</nav>
 <div class="g-chart-stats"><div><span>현재 ${d.group==='재정'&&id!=='debt'?'예상 금액':'수치'}</span><strong>${value(data.current,d)}</strong><small>${s.turn===0?'취임 당일':s.turn+'턴'} 기준</small></div><div class="g-change-${data.status}"><span>${data.comparison}</span><strong>${change(data.delta,d)}</strong><small>${words(data.delta,d)}</small></div><div class="g-change-${tone(data.lastDelta,d)}"><span>지난 턴 대비</span><strong>${data.lastDelta===null?'—':change(data.lastDelta,d)}</strong><small>${data.lastDelta===null?'아직 비교 기록이 없습니다':words(data.lastDelta,d)}</small></div></div>
 <p class="g-chart-direction">${esc(d.help)}${d.unit==='%'?' 변화량의 %p는 두 비율의 차이입니다. 예를 들어 22%에서 18%로 줄면 4%p 내려간 것입니다.':''}</p>
 ${data.origin==='resumed'?`<p class="g-chart-note">이전 수치가 없는 저장입니다. ${data.from===0?'이번 취임 당일':data.from+'턴'}에 처음 기록한 상태부터 비교합니다.</p>`:''}
 <figure class="g-chart-figure g-change-${data.status}"><svg viewBox="0 0 710 245" role="img" aria-label="${d.name} 변화 그래프. ${points[0].label} ${value(data.initial,d)}에서 현재 ${value(data.current,d)}. ${data.comparison} ${change(data.delta,d)}.">
 <title>${d.name} 변화</title>
 ${ticks.map(t=>`<line x1="${g.left}" y1="${g.y(t)}" x2="${g.right}" y2="${g.y(t)}" class="g-chart-grid"/><text x="${g.left-10}" y="${g.y(t)+4}" text-anchor="end" class="g-chart-axis">${Number.isInteger(t)?t:number(t)}</text>`).join('')}
 <text x="${g.left}" y="13" class="g-chart-axis">${d.unit==='조'?'단위: 조 원':d.unit==='%'?'단위: %':'단위: 점'}</text>
 ${d.group==='위기'?`<line x1="${g.left}" x2="${g.right}" y1="${g.y(75)}" y2="${g.y(75)}" class="g-chart-danger"/><text x="${g.right-4}" y="${g.y(75)-7}" text-anchor="end" class="g-chart-danger-label">위험 75</text>`:''}
 <line x1="${g.left}" y1="${g.y(data.initial)}" x2="${g.right}" y2="${g.y(data.initial)}" class="g-chart-baseline"/>
 ${points.length>1?`<polyline points="${line}" class="g-chart-line"/>`:''}
 <line data-chart-tracker x1="${g.x(last)}" x2="${g.x(last)}" y1="${g.top}" y2="${g.bottom}" class="g-chart-tracker"/>
 ${points.map((p,i)=>`<circle cx="${g.x(i)}" cy="${g.y(p.value)}" r="5" class="g-chart-dot ${i===last?'is-selected':''}" data-progress-point="${i}"><title>${esc(p.label)}: ${value(p.value,d)}</title></circle><circle cx="${g.x(i)}" cy="${g.y(p.value)}" r="14" fill="transparent" data-progress-point="${i}"/>${pointLabel(i)?`<text x="${g.x(i)}" y="228" text-anchor="${i===0?'start':i===last?'end':'middle'}" class="g-chart-axis">${p.baseline?(data.origin==='new'?'취임':'기록 시작'):p.turn===0?'당일':p.turn+'턴'}</text>`:''}`).join('')}
 </svg><figcaption><span class="g-chart-line-key">실제 수치</span><span class="g-chart-base-key">${data.origin==='new'?'취임 당시':'기록 시작 당시'} ${value(data.initial,d)}</span>${d.direction!==0?`<span>${d.direction>0?'높을수록 좋음':'낮을수록 좋음'}</span>`:''}</figcaption></figure>
 <div class="g-chart-scrubber"><label for="g-progress-turn">${points.length===1?'첫 비교 기록을 기다리고 있습니다':'점을 누르거나 아래 막대를 움직여 시점을 확인하세요'}</label><input id="g-progress-turn" type="range" data-progress-scrub min="0" max="${Math.max(1,last)}" step="1" value="${last}" aria-label="그래프에서 확인할 시점" aria-valuetext="${esc(points[last].label)} ${value(points[last].value,d)}" ${points.length===1?'disabled':''}></div>
 <div class="g-chart-inspection" data-chart-inspection role="status" aria-live="polite">${pointText(s,data,last)}</div>
 <p class="g-chart-note">${points.length===1?'사건에 대응하거나 다음 턴을 집행하면 그래프에서 변화를 확인할 수 있습니다. ':''}각 턴에는 그 턴의 마지막 상태를 남깁니다. 현재 턴에는 방금 내린 결정도 반영됩니다.${d.group==='재정'&&id!=='debt'?' 세입, 지출과 적자는 그 시점의 다음 턴 예상 금액입니다.':''}</p>
 ${related.length?`<h3 class="g-section-label">이 지표에 영향을 주는 정책</h3><div class="g-related">${related.map(p=>`<button type="button" data-policy="${p.id}">${p.name}</button>`).join('')}</div>`:''}
 ${d.group==='위기'?`<button type="button" class="g-chart-detail" data-risk-detail="${id}">위험 기준과 관련 정책 설명</button>`:''}
 ${d.group==='재정'?'<button type="button" class="g-chart-detail" data-open="finance">세입과 지출의 상세 내역</button>':''}
 </section>`;
}
function inspect(root,s,index){const chart=root.querySelector('[data-progress-chart]');if(!chart)return;const data=G.progressSeries(s,chart.dataset.progressChart);index=Math.max(0,Math.min(data.points.length-1,Number(index)||0));const g=geometry(data),p=data.points[index],slider=chart.querySelector('[data-progress-scrub]');slider.value=index;slider.setAttribute('aria-valuetext',p.label+' '+value(p.value,data.definition));chart.querySelector('[data-chart-inspection]').innerHTML=pointText(s,data,index);const tracker=chart.querySelector('[data-chart-tracker]');tracker.setAttribute('x1',g.x(index));tracker.setAttribute('x2',g.x(index));chart.querySelectorAll('.g-chart-dot').forEach((dot,i)=>dot.classList.toggle('is-selected',i===index));}
Object.assign(G,{progressMarkup:markup,inspectProgress:inspect});
})(globalThis);
