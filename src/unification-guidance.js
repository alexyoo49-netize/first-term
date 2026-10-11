(function(scope){
'use strict';
function install(G){
const base={start:G.start,restore:G.restore,advice:G.advice};
const round=n=>Math.round(n),fmt=n=>Number(n).toFixed(1);
const briefings={
 collapse:{story:'북한 정권이 갑자기 무너진 뒤, 대한민국 정부가 현지 행정을 인수했습니다. 당신은 통일 직후 취임한 대통령입니다. 평양에서는 공무원 급여와 주민등록 업무가 멈췄고, 남포항의 구호품은 주민에게 전달되지 못하고 있습니다. 돈을 배정해도 명령을 실행할 직원과 기록이 없으면 복구가 늦어집니다.',focus:'첫 과제는 주민이 다시 행정 창구를 이용하게 만드는 것입니다. 첫 보고에 대응한 뒤 행정과 치안 복구를 살펴보세요. 행정 집행력이 45보다 낮으면 전력과 주택 재건의 효과도 줄어듭니다.',policy:'admin'},
 federal:{story:'남북이 협상 끝에 하나의 나라를 만들었지만, 두 행정조직은 아직 그대로 남아 있습니다. 당신은 공동정부를 이끌 대통령으로 취임했습니다. 개성과 파주를 오가는 화물차는 양쪽 기관에 각각 허가를 받아야 하고, 지방정부는 중앙정부가 어디까지 지시할 수 있는지 묻고 있습니다.',focus:'첫 과제는 누가 허가하고 누가 비용을 내는지 합의하는 것입니다. 강제로 통합하면 업무는 빨라져도 지역 반발이 커질 수 있습니다. 첫 사건 뒤 지역 화해와 협의, 의회 협상을 살펴보세요.',policy:'cohesion'},
 gradual:{story:'수년간의 준비 끝에 통일이 이뤄졌습니다. 개성의 생산시설과 파주의 물류망은 비교적 안정적이지만, 새 정부는 통합연금과 생계 지원 약속도 넘겨받았습니다. 당신의 취임과 동시에 지급일이 돌아왔고, 국회와 채권시장은 그 돈을 어떻게 마련할지 묻고 있습니다.',focus:'첫 과제는 약속을 지키면서 빚이 불어나는 속도를 관리하는 것입니다. 재정 화면에서 매 턴 적자를 확인하세요. 복지 예산을 깎으면 지출은 줄지만 반발과 추가 정치력 비용이 생깁니다.',policy:'income'},
 war:{story:'전쟁은 끝났지만 정부의 명령이 모든 지역에 닿지는 않습니다. 당신은 전후 통합정부의 대통령으로 취임했습니다. 원산에는 새 지휘체계를 받아들이지 않은 무장 경비대가 있고, 청진의 공장과 회령의 임시주거지는 전력과 식수를 기다리고 있습니다.',focus:'첫 과제는 군의 복귀 협상과 민간 구호 사이에서 순서를 정하는 것입니다. 첫 사건을 수습한 뒤 군 통합과 전역 지원, 전력과 주택 재건을 확인하세요. 군 불복종 위험이 85 이상으로 두 턴 이어지면 쿠데타 시도가 일어납니다.',policy:'security'}
};
for(const c of G.scenarios)c.desc=briefings[c.id].story;
// These explanations describe the fictional game rules, not real legal standards.
const contexts={
 vacuum:['주민등록 확인이 막히면 배급 대상과 지원금을 받을 사람도 확인할 수 없습니다. 단순히 창구가 불편한 문제가 아니라, 식량 지원과 복구 사업 전체가 멈추기 시작한 상황입니다.','직원과 돈을 바로 투입할지, 현지 주민 조직과 권한을 나눌지 결정합니다. 기다리면 지금 정치력은 아끼지만 생활 불안이 커집니다.','admin'],
 autonomy:['같은 나라 안에서 허가권이 둘로 나뉘어 물건이 움직이지 못합니다. 중앙정부가 일방적으로 처리하면 빠를 수 있지만, 통일 합의를 무시했다는 반발이 생길 수 있습니다.','협상에 정치력을 쓸지, 비용과 반발을 감수하고 중앙정부가 직접 집행할지 고르세요.','cohesion'],
 promise:['국채는 정부가 돈을 빌릴 때 발행하는 채권입니다. 약속한 지원금을 지금 지급하면 주민 불안은 줄지만 빚이 늘고, 미루면 돈을 기다리던 주민들이 반발합니다.','전액 지급, 합의한 단계 지급, 지급 동결 가운데 재정과 신뢰를 어디까지 감수할지 정하세요.','income'],
 ceasefire:['경비대가 복귀하지 않으면 구호품을 실은 트럭도 안전하게 통과하기 어렵습니다. 급여와 전역 뒤 생계를 보장하는 협상, 당장 필요한 민간 구호가 동시에 돈을 요구합니다.','군의 복귀를 먼저 이끌지, 피란민 구호를 먼저 할지 결정하세요. 기다리는 선택에도 군 불복종과 식량 위험이 따릅니다.','security'],
 disease:['같은 물을 마신 주민들이 함께 아프기 시작한 상황입니다. 환자만 치료해도 오염된 물과 주거 환경이 남으면 다시 번질 수 있습니다.','당장 환자와 식수를 지원할 방법을 고르세요. 이후 의료와 방역 예산, 전력과 주택 재건을 함께 살펴보는 편이 좋습니다.','health'],
 blackout:['정전은 공장 생산뿐 아니라 병원의 장비와 급수 펌프도 멈춥니다. 전력 부족이 길어지면 실업과 감염 위험으로 피해가 번집니다.','돈을 들여 시설을 고칠지, 외부 전력으로 시간을 벌지, 일부 전력 사용을 줄일지 결정합니다.','rebuild'],
 food:['식량이 있어도 하역과 운송이 막히거나 주민에게 살 돈이 없으면 굶주림이 생깁니다. 배급을 줄여 시간을 벌면 시위와 감염 위험이 커질 수 있습니다.','수송과 급식을 직접 지원할지, 국제 구호를 받을지, 비축분을 아낄지 선택하세요.','welfare'],
 unrest:['주민들의 요구는 일자리와 생활비입니다. 거리의 시위만 잠잠하게 만들어도 실업과 빈곤이 그대로면 다시 모일 수 있습니다.','협상, 긴급 생활 지원, 강제 해산은 각각 정치력, 재정, 주민 신뢰를 소모합니다. 무엇을 지키고 무엇을 감수할지 보세요.','training'],
 military:['기존 무장조직이 새 정부의 지시를 따르지 않고 있습니다. 급여와 전역 이후 처우를 정리하지 못하면 군 통합 예산이 있어도 불복종이 계속될 수 있습니다.','급여 보장과 협상, 강제 교체 중 수습 방식을 정하세요. 군 불복종 위험 85 이상이 두 턴 이어지면 쿠데타로 번집니다.','security'],
 coup:['경고 단계를 넘어 실제로 대통령의 권한을 빼앗으려는 움직임이 시작됐습니다. 평소 예산을 늘리는 것만으로 이번 결정을 대신할 수 없습니다.','지금 결재안 중 수습 방법을 선택해야 합니다. 사임을 고르면 이번 게임이 즉시 끝납니다.','security'],
 corruption:['정부가 돈을 지급했다는 기록과 현장에 도착한 장비가 맞지 않습니다. 예산을 더 줘도 새는 돈을 막지 못하면 복구가 늦어집니다.','감사와 공개로 책임을 물을지, 담당자를 바꿔 공사를 이어갈지 결정하세요. 조사를 미루면 뒤에 폭로 사건이 이어집니다.','admin'],
 credit:['정부가 빌리려는 돈에 비해 국채를 사려는 투자자가 부족합니다. 더 높은 이자를 약속하면 당장은 버티지만 이후 사업에 쓸 돈이 줄어듭니다.','재건을 줄여 지출을 낮출지, 국제 보증을 구할지, 비싼 이자로 빚을 돌려막을지 선택합니다.','income'],
 property:['같은 땅에 여러 권리 주장이 겹쳐 공장 재가동이 막혔습니다. 공사부터 시작하면 고용 회복은 빨라져도 주민들의 권리와 신뢰를 잃을 수 있습니다.','보상, 권리 조정, 공사 우선, 보류 중 속도와 주민 보호의 균형을 고르세요.','cohesion'],
 resettle:['생활 기반을 잃은 가족들이 새 거처를 찾으면서, 이미 살던 주민의 주택과 행정서비스에도 부담이 생겼습니다.','주거와 취업을 직접 지원할지, 지자체와 부담을 나눌지 결정하세요. 이동 제한은 비용을 아껴도 지역 불신을 키웁니다.','welfare'],
 rights:['앞선 강제 해산이 지금 조사 대상으로 돌아온 것입니다. 빠르게 시위를 끝낸 선택의 후속 결과이므로, 당장의 소요 수치만으로 해결 여부를 판단하면 안 됩니다.','자료 공개와 피해 구제에 비용을 쓸지, 정부 조치를 방어하며 신뢰와 외교 부담을 감수할지 정하세요.','cohesion'],
 leak:['이전에 미룬 조사의 자료가 정부 밖으로 나왔습니다. 이제 계약 문제에 더해 대통령실이 왜 조사를 늦췄는지도 쟁점입니다.','특별 감사를 수용해 비리를 줄일지, 자료를 부인하며 더 큰 신뢰 하락을 감수할지 선택합니다.','admin'],
 energy:['앞서 외부 전력을 빌려 급한 불을 껐지만, 공급을 계속 받으려면 새 조건을 받아들여야 합니다. 임시 대응의 후속 비용이 돌아온 상황입니다.','더 비싼 계약을 유지할지, 국내 시설 복구에 투자할지, 정전 위험을 감수하고 계약을 끝낼지 고르세요.','rebuild'],
 aid:['국제기금이 자금을 제공하는 대신 집행 내역을 살펴보겠다고 합니다. 지원금은 재정 부담을 줄이지만 정부의 재량도 일부 제한합니다.','외부 감사를 받아들이고 큰 지원을 받을지, 규모가 작은 지원을 택할지, 자율성을 위해 거절할지 정합니다.','diplomacy'],
 investment:['전기와 행정서비스가 돌아오자 기업들이 다시 사람을 고용할 수 있다고 판단했습니다. 위기 대응이 투자 기회로 이어진 상황입니다.','현지 고용 조건을 붙일지, 지원금과 빠른 허가로 속도를 낼지 선택하세요. 빠른 허가는 비리 위험을 키울 수 있습니다.','training'],
 returnees:['진료소를 운영할 사람이 돌아오려 하지만 자격과 거처가 정해지지 않았습니다. 인력이 실제로 일할 수 있게 만드는 결정입니다.','직접 정착을 지원할지, 적은 비용으로 원격 협력을 시작할지 고르세요.','health'],
 curriculum:['같은 시험과 수업을 시작하려 해도 지역마다 배우던 내용과 용어가 다릅니다. 단일 기준은 업무를 빠르게 만들지만 합의 없이 적용하면 불신을 키울 수 있습니다.','공동 집필, 즉시 통일, 지역별 병행 가운데 통합 속도를 정하세요.','cohesion'],
 op_press:['공개토론은 상대를 설득하는 자리가 아니라 유권자가 정부를 평가하는 자리입니다. 말솜씨뿐 아니라 지금까지 쌓인 정부 발표 신뢰도 결과에 영향을 줍니다.','선택지에 나온 비용과 성공 확률을 보고 대응 방식을 정하세요. 토론의 결과는 확정돼 있지 않습니다.','political'],
 op_legislative:['국회가 협조하지 않으면 예산안을 실행하는 데 더 많은 정치력이 듭니다. 현장 문제와 의회 협상을 따로 볼 수 없는 상황입니다.','감시권을 나누고 합의를 얻을지, 정부 입장을 지키며 표결 방해를 감수할지 판단하세요.','political'],
 op_audit:['야당이 정부의 복구 성과를 계약 자료로 검증하겠다고 나섰습니다. 실제 비리 위험과 자료 공개 방식이 함께 정치적 문제가 됩니다.','자료 공개와 조사 협조의 비용, 거부했을 때 신뢰 하락을 비교하세요.','admin'],
 op_protest:['생활고에 대한 항의가 야당의 정치적 공세와 결합했습니다. 주민 요구를 해결해도 상대가 성과를 가져갈 수 있는 상황입니다.','주민과 협상할지, 지원에 돈을 쓸지, 다른 대응을 택할지 정하세요. 생활 문제와 정치적 손익을 함께 보세요.','welfare'],
 op_tax:['감세는 주민과 기업에 반갑지만 정부가 매 턴 거두는 돈도 줄어듭니다. 지금의 세율로 어떤 복구 사업을 유지하는지 설명해야 합니다.','인기 있는 감세를 수용할지, 재원을 지킬지 선택합니다. 세율 변화가 있으면 재정 화면에서 이후 적자를 확인하세요.','income'],
 op_diplomacy:['원조 조건을 둘러싼 국내 논쟁이 지원국의 판단에도 영향을 주고 있습니다. 야당과 협력하면 협상력이 생겨도 상대의 입지도 높아집니다.','외교 신뢰와 국내 정치적 양보 가운데 무엇을 감수할지 정하세요.','diplomacy'],
 press_viral:['앞뒤가 잘린 영상이 정부 전체에 대한 평가로 번지고 있습니다. 발표 신뢰가 낮을수록 해명을 해도 믿어주는 사람이 적어집니다.','원본과 자료로 설명할지, 다른 대응을 택할지 고르세요. 신뢰는 이후 토론과 선거에도 영향을 줍니다.','political'],
 press_follow:['공개를 늦췄던 자료가 언론을 통해 먼저 나왔습니다. 처음의 대응이 신뢰 문제로 이어진 후속 사건입니다.','자료와 책임 범위를 밝힐지, 방어를 계속할지 결정하세요.','political'],
 op_debate:['임기 마지막 토론입니다. 유권자들은 통일 직후의 약속과 실제 성과를 비교하고 있으며, 이 결정을 마치면 선거 결과가 정해집니다.','남은 정치력과 토론 성공 확률을 확인하고 마지막 대응을 고르세요.','political'],
 op_shadow:['공격 영상과 의회 이탈이 겹쳤지만 상대가 지시했다는 증거는 아직 없습니다. 표시된 피해는 이미 지지와 신뢰에 반영된 상태입니다.','출처 검증은 성공 여부가 갈립니다. 자료 브리핑은 신뢰 회복을 노립니다. 대응을 미루면 추가 손해가 생깁니다.','political'],
 gate_break:['당신이 승인했던 비밀 행동이 드러났습니다. 지지와 신뢰는 이미 하락했고, 이제 조사에 어떻게 응할지가 이후 탄핵 심사에 영향을 줍니다.','조사 수용은 증거를 지우지는 않지만 심사에서 유리하게 작용합니다. 전면 부인은 위법성 증거를 더 늘립니다.','emergency'],
 gate_hearing:['청문회는 공개된 공작 문건의 책임을 따지는 절차입니다. 조사에 협조한 정도는 파면 심사 점수에서 차감되지만 확인된 증거 자체는 남습니다.','출석해 설명할지, 출석을 거부할지 정하세요. 위법성 증거 60 이상이면 탄핵안이 발의될 수 있습니다.','emergency'],
 martial_review:['당신이 선포한 계엄을 끝내라는 의회의 요구입니다. 계엄은 거리와 군의 불복종을 일시적으로 낮추지만 고용, 식량, 주민 신뢰의 원인을 해결하지 않습니다.','해제하면 발표 신뢰와 외교 신뢰를 각각 3 회복합니다. 연장하면 위법성 증거가 38 늘어나고 탄핵 위험이 커집니다.','emergency'],
 impeachment_motion:['탄핵안 발의는 곧 파면을 뜻하지 않습니다. 먼저 의회에서 찬성 67% 이상을 얻어야 대통령 직무가 정지됩니다.','정치력 3으로 예상 찬성표를 12%p 낮출지, 지금의 표결 결과를 받아들일지 결정하세요.','emergency'],
 impeachment_review:['의회 표결을 통과해 현재 대통령 직무가 정지돼 있습니다. 이 단계에서는 지지율 대신 위법성 증거에서 조사 협조를 뺀 심사 점수를 봅니다.','추가 자료를 제출하면 심사 점수가 10 낮아집니다. 최종 점수 60 이상이면 파면으로 게임이 끝납니다.','emergency']
};
function eventExplanation(s){const e=G.events[s.pending?.id];if(!e)return null;const x=contexts[s.pending.id]||['현장에서 발생한 문제가 정부의 예산과 신뢰에 영향을 주고 있습니다.','선택지의 즉시 효과와 이후 부담을 비교한 뒤 결재하세요.','admin'];return {meaning:x[0],decision:x[1],target:x[2]};}
function completeAdvice(a,situation,recommendation,tradeoff,target,priority){return {...a,situation,recommendation,tradeoff,target,priority,text:situation+' '+recommendation+' '+tradeoff};}
function policyAdvice(s,a,id,situation,why,priority,missionId){
 const i=G.policies.findIndex(p=>p.id===id),p=G.policies[i],left=G.termLimit(s)-s.turn,cost=G.policyCost(s,i,Math.min(4,s.levels[i]+1)),delay=G.delay(s,i);
 const task=s.council.tasks.find(t=>t.adviser===a.id),mission=G.adviserMissions[a.id]?.find(m=>m.id===missionId);
 let action,trade;
 if(s.presidency.impeachment.stage==='review')return completeAdvice(a,situation,'지금은 직무가 정지돼 예산 변경과 참모 지시를 할 수 없습니다. 먼저 탄핵 심사에 대응하십시오.','심사 점수 60 미만이어야 직무에 복귀합니다.','emergency',priority);
 if(s.phase==='ended')return completeAdvice(a,situation,'임기가 끝났습니다. 국정 기록에서 어떤 결정이 이 수치를 바꿨는지 확인하십시오.','다음 게임에서는 같은 위험의 원인을 더 일찍 줄일 수 있습니다.','history',priority);
 if(s.levels[i]>=4){action=p.name+' 예산은 이미 최대입니다. 더 올리는 대신 기존 사업을 유지하고 현장 임무로 빈틈을 메우십시오.';trade='추가 예산을 계속 눌러도 더 확대할 수는 없습니다.';}
 else if(s.remaining[i]>0){action=p.name+'은 이미 변경한 예산이 '+s.remaining[i]+'턴 동안 반영되는 중입니다. 같은 예산을 다시 올리기 전에 집행 결과를 보십시오.';trade='예산 지출은 계속되지만 효과는 나눠서 나타납니다.';}
 else if(delay>left){action=p.name+'은 효과 반영에 '+delay+'턴이 필요해 남은 '+left+'턴 안에 전부 반영되지는 않습니다. 지금은 즉시 대응과 현장 임무를 먼저 보십시오.';trade='추가 예산의 일부 효과는 선거 전에 충분히 나타나지 못합니다.';}
 else if(cost>s.pp){action=p.name+'을 한 단계 늘리려면 정치력 '+cost+'가 필요하지만 지금은 '+s.pp+'입니다. 남은 고유 행동이나 다음 턴 확보량을 확인하십시오.';trade='사건 대응에 쓸 정치력도 남겨야 합니다. 돈과 정치력은 서로 다른 자원입니다.';}
 else{action=p.name+'을 한 단계 늘리는 안을 먼저 검토하십시오. '+why;trade='정치력 '+cost+'가 들고, '+(p.tax?'세입이 늘지만 납세자의 지지는 낮아질 수 있습니다.':'매 턴 지출이 늘어 적자와 부채가 커질 수 있습니다.')+' 효과 반영에는 '+delay+'턴이 필요합니다.';}
 if(task)trade+=' 저는 이미 '+G.adviserMissions[a.id].find(x=>x.id===task.action).place+'에 파견 중이며 '+Math.max(1,task.due-s.turn)+'턴 뒤 보고합니다.';
 else if(mission&&!G.adviserBlocked(s,a.id,mission.id)){trade+=' 제게 '+mission.name+'을 지시하면 다음 턴 '+mission.effect+' 효과를 얻습니다. 대신 '+mission.trade+'입니다.';}
 return completeAdvice(a,situation,action,trade,id,priority);
}
function advice(s){if(s.phase==='setup')return [];const m=G.metrics(s),v=G.votes(s),p=s.presidency,f=G.finance(s);return G.advisers.map(a=>{
 if(a.id==='marshall'){
  if(p.martial.active)return completeAdvice(a,'계엄으로 거리와 군의 움직임을 누르고 있지만, 민간정부로 돌아갈 절차가 남아 있습니다.','상단 계엄 메뉴에서 해제를 검토하십시오. 다음 턴에는 의회가 해제를 요구합니다.','연장하면 위법성 증거가 38 더 쌓입니다. 계엄을 해제해도 이전 조치의 책임은 남습니다.','emergency',120);
  const military=s.risk.military>=s.risk.blackout;
  return policyAdvice(s,a,military?'security':'rebuild',military?'군 불복종 위험은 '+round(s.risk.military)+'입니다. 급여와 전역 뒤 처우가 정리되지 않으면 새 지휘체계를 받아들이기 어렵습니다.':'전력 붕괴 위험은 '+round(s.risk.blackout)+'입니다. 공장이 멈추면 일자리도 줄고 병원과 급수 시설도 함께 흔들립니다.',military?'군 통합과 전역 지원으로 불복종의 원인을 줄여야 합니다.':'전력과 주거를 복구하면 정전뿐 아니라 실업과 감염의 원인도 줄어듭니다.',Math.max(s.risk.military,s.risk.blackout),military?'integration':'corridor');
 }
 if(a.id==='nightingale'){
  const food=s.risk.food>s.risk.disease;
  if(Math.max(s.risk.food,s.risk.disease)<35)return completeAdvice(a,'감염병 위험 '+round(s.risk.disease)+', 식량 부족 위험 '+round(s.risk.food)+'로 아직 급한 경보는 아닙니다.','현재 의료와 생계 지원을 유지하고 더 높은 위험에 정치력을 먼저 쓰십시오.','지원 예산을 갑자기 줄이면 빈곤과 의료 대응이 나빠져 위험이 다시 오를 수 있습니다.','health',Math.max(s.risk.food,s.risk.disease));
  return policyAdvice(s,a,food?'welfare':'health',food?'식량 부족 위험은 '+round(s.risk.food)+'입니다. 주민에게 식량을 살 돈과 전달할 수송망이 함께 부족합니다.':'감염병 위험은 '+round(s.risk.disease)+'이고 의료 대응력은 '+round(m.health)+'입니다. 진료소만 늘려도 식수와 임시주거지가 불안정하면 감염은 다시 번질 수 있습니다.',food?'생계 지원으로 빈곤을 낮추면 식량 부족과 시위 압력을 함께 줄일 수 있습니다.':'의료와 방역을 유지하면서 재건 사업으로 급수와 주거 환경도 회복해야 합니다.',Math.max(s.risk.food,s.risk.disease)+4,food?'clinics':'water');
 }
 if(a.id==='keynes'){
  if(s.risk.credit>=65||f.deficit>=5)return policyAdvice(s,a,'income','이번 예산의 예상 '+(f.deficit>=0?'적자는 '+fmt(f.deficit):'흑자는 '+fmt(-f.deficit))+'조이고 부채는 '+fmt(s.debt)+'조입니다. 신용 위험은 '+round(s.risk.credit)+'로, 75부터 이자 부담이 더 커집니다.','재원을 늘리되 주민이 왜 세금을 더 내야 하는지 설명할 필요가 있습니다.',Math.max(s.risk.credit,70),'bonds');
  return policyAdvice(s,a,'training','실업률은 '+fmt(m.jobs)+'%입니다. 청진의 생산 중단과 전역 인력의 구직 문제가 겹쳐, 일자리가 없으면 생활비 지원만으로 버티는 주민이 늘어납니다.','훈련을 마친 사람이 취업하면 실업과 빈곤이 함께 낮아집니다.',m.jobs*2.5,'jobs');
 }
 if(p.impeachment.stage==='review')return completeAdvice(a,'탄핵안이 가결돼 직무가 정지됐습니다. 현재 심사 점수는 '+G.courtScore(s)+'입니다.','현재 심사 결정에서 자료 제출을 검토하십시오. 제출하면 점수가 '+G.courtScore(s,true)+'로 낮아집니다.','파면선은 60입니다. 지지율이 높아도 이 단계의 심사 점수를 대신하지는 못합니다.','emergency',140);
 if(p.evidence>=40||s.pending?.id==='impeachment_motion')return completeAdvice(a,'위법성 증거가 '+p.evidence+'이고 예상 탄핵 찬성은 '+G.motionVotes(s)+'%입니다. 의회 가결선은 67%입니다.','추가 공작을 멈추고 조사와 청문회에 협조하십시오. 탄핵 표결에서는 정치력 3으로 찬성표를 12%p 낮출 수 있습니다.','조사 협조는 심사 점수에서 차감되지만 확인된 증거를 없애지는 않습니다.','emergency',130);
 if(v.all<35||s.mediaTrust<40)return completeAdvice(a,'국민 지지는 '+fmt(v.all)+'%, 정부 발표 신뢰는 '+round(s.mediaTrust)+'입니다. 설명을 해도 믿어주는 사람이 줄고 있습니다.','정치 메뉴의 자료 공개 브리핑을 먼저 검토하십시오. 정치력 2로 발표 신뢰를 8, 국민 지지 보정치를 1 높입니다.','이번 턴 정치 행동은 한 번뿐입니다. 지지 30% 미만이 두 턴 이어지면 탄핵안이 발의됩니다.','political',110);
 return completeAdvice(a,'의회 협조는 '+round(v.assembly)+'입니다. 정부 혼자서는 예산과 법안을 밀어붙이기 어려우며, 협조가 달라지면 정책 변경에 드는 정치력도 달라집니다.','제게 여의도 초당적 합의를 지시하면 다음 턴 의회 협조가 9 높아집니다. 즉시 협조가 필요하면 정치 메뉴의 공개 의회 협상으로 8을 높일 수 있습니다.','참모 지시는 정치력 2, 공개 협상은 3이 들며 모두 상대 조직력도 3 높입니다. '+(s.council.orderedTurn===s.turn?'이번 턴 참모 지시는 이미 사용했습니다.':''),'political',100-v.assembly);
 }).sort((a,b)=>b.priority-a.priority);}
const eventPriorities={vacuum:['staff','council','wait'],autonomy:['pact','central','wait'],promise:['phase','pay','freeze'],ceasefire:['join','relief','wait'],disease:['clinic','international','wait'],blackout:['repair','import','ration'],food:['relief','trade','ration'],unrest:['talk','jobs','force','wait'],military:['mediate','pay','ultimatum','wait'],coup:['unity','concede','resign'],corruption:['audit','replace','bury'],credit:['guarantee','cut','roll'],gate_break:['disclose','deny'],gate_hearing:['testify','refuse'],martial_review:['lift','extend'],impeachment_motion:['persuade','vote'],impeachment_review:['defense','review']};
function eventAdvice(s){if(!s.pending)return advice(s)[0];const e=G.events[s.pending.id],x=eventExplanation(s),a=advice(s).find(a=>a.id===({vacuum:'bismarck',autonomy:'bismarck',promise:'keynes',ceasefire:'marshall',coup:'marshall',martial_review:'marshall'})[s.pending.id])||advice(s).find(a=>a.id===({disease:'nightingale',food:'nightingale',blackout:'marshall',military:'marshall',credit:'keynes',unrest:'bismarck',corruption:'bismarck',constitutional:'bismarck',politics:'bismarck',media:'bismarck',intrigue:'bismarck'})[e.family])||advice(s)[0];
 const ranked=(eventPriorities[s.pending.id]||e.options.map(o=>o.id)).map(id=>e.options.find(o=>o.id===id)).filter(Boolean),o=ranked.find(o=>!G.optionAllowed(s,o));
 if(!o)return completeAdvice(a,x.meaning,'지금 정치력으로 가능한 결재안이 없습니다. 아직 사용하지 않은 고유 행동으로 정치력을 확보할 수 있는지 확인하십시오.','상단의 정치력 수치와 각 결재안의 필요 조건을 비교하세요.',x.target,150);
 const c=G.optionCost(s,o),first=ranked[0],fallback=o.id!==first.id;
 const negatives=[...Object.entries(o.risk||{}).filter(([,n])=>n>0).map(([k,n])=>G.names[k]+' +'+n),...Object.entries(o.boost||{}).filter(([k,n])=>['jobs','poverty'].includes(k)?n>0:n<0).map(([k,n])=>G.names[k]+' '+(n>0?'+':'')+n)];
 let trade='정치력 '+c.pp+(c.cash>0?', 추가 부채 '+fmt(c.cash)+'조':c.cash<0?', 부채 '+fmt(-c.cash)+'조 감소':'')+'. '+(negatives.length?negatives.join(', ')+'. ':'');
 if(o.follow)trade+='이 선택의 후속 사건이 2턴 뒤 예정됩니다. ';
 if(o.contest)trade+='설득은 실패할 수도 있습니다. ';
 if(o.ending)trade+='이 결정을 승인하면 임기가 즉시 끝납니다. ';
 if(o.presidency)trade+=G.impactText(s,o)+'. ';
 const situation=Object.hasOwn(s.risk,e.family)?G.names[e.family]+'은 '+round(s.risk[e.family])+'입니다. 지금 쓸 수 있는 정치력은 '+s.pp+'입니다.':e.family==='constitutional'||e.family==='intrigue'?'위법성 증거 '+s.presidency.evidence+', 예상 탄핵 찬성 '+G.motionVotes(s)+'%입니다. 지금 결정이 다음 심사에도 영향을 줍니다.':'국민 지지 '+fmt(G.votes(s).all)+'%, 발표 신뢰 '+round(s.mediaTrust)+'입니다. 이번 대응은 이후 협상과 선거에도 영향을 줍니다.';
 const aim={admin:'현장 행정이 돌아가야 다음 구호와 재건도 집행할 수 있습니다.',health:'이번 환자 대응 뒤에도 식수와 진료망을 함께 유지해야 재발을 줄입니다.',welfare:'지금 생활 기반을 지켜야 불안이 거리의 시위로 번지는 것을 줄입니다.',security:'지휘체계 복귀와 생계 보장을 함께 다뤄야 불복종의 원인을 줄입니다.',rebuild:'임시 공급으로 시간을 버는 것과 시설을 고치는 것은 효과가 다릅니다.',income:'당장 쓸 돈과 다음 턴부터 누적될 적자를 함께 비교하십시오.',cohesion:'빠른 집행만큼 주민과 지방정부가 결정을 받아들이는지도 중요합니다.',political:'정부 발표를 믿게 만드는 대응인지 먼저 따져보십시오.',emergency:'의회 표결과 위법성 심사는 서로 다른 절차입니다.'}[x.target]||'즉시 효과와 이후 부담을 함께 보십시오.';
 return {...completeAdvice(a,situation,(fallback?'우선 검토한 안은 '+G.optionAllowed(s,first)+' 조건 때문에 지금 고를 수 없습니다. 가능한 안 중 ':'이번 사건에서는 ')+ '“'+o.title+'” 안을 먼저 검토하십시오. '+aim,trade.trim(),x.target,150),choice:o.id};
}
G.start=(...args)=>({...base.start(...args),tutorial:{step:0,done:false}});
G.restore=v=>{const s=base.restore(v);if(s.phase!=='setup')s.tutorial={step:Math.max(0,Math.min(3,Number.isInteger(v?.tutorial?.step)?v.tutorial.step:0)),done:v?.tutorial?!!v.tutorial.done:true};return s;};
Object.assign(G,{briefings,eventExplanation,eventAdvice,advice});
return G;
}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else install(scope.UnificationGame);
})(globalThis);
