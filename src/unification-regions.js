(function(scope){
'use strict';
function install(G){
const base={start:G.start,restore:G.restore,advance:G.advance,resolve:G.resolve,eventTitle:G.eventTitle,snapshot:G.snapshot};
const clamp=n=>Math.max(0,Math.min(100,n));
const sources={
 industry:{name:'통일부 북한정보포털: 금속 공업',url:'https://nkinfo.unikorea.go.kr/nkp/pge/view.do?menuId=MENU_54'},
 ports:{name:'통일부 북한정보포털: 조선업',url:'https://nkinfo.unikorea.go.kr/nkp/pge/view.do?menuId=MENU_58'},
 grain:{name:'통일부 북한정보포털: 식료품 공업',url:'https://nkinfo.unikorea.go.kr/nkp/pge/view.do?menuId=MENU_61'},
 water:{name:'UNICEF: DPR Korea 식수와 위생',url:'https://www.unicef.org/dprk/water-sanitation-hygiene'},
 paju:{name:'경기도: 파주와 개성 물류 연계',url:'https://gnews.gg.go.kr/briefing/brief_gongbo_view.do?BS_CODE=S017&number=41587'}
};
const scene=(place,desk,title,body,source,severe)=>({place,desk,title,body,source,severe});
const stories={
 vacuum:[scene('평양시','행정안전부 현지 인수단','평양의 주민등록 창구가 멈췄다','시청 인수단이 도착했지만 급여를 받지 못한 직원들이 출근하지 않습니다. 종이 대장과 전산 기록이 맞지 않아 거주 확인서 발급이 중단됐습니다. 배급을 신청하려는 가족들이 구청 앞에서 기다립니다.',null)],
 autonomy:[scene('개성시와 파주시','통일부 공동행정협의회','개성 물류 통행증, 누가 발급할 것인가','개성과 파주를 오가는 화물차에 두 행정조직이 서로 다른 통행증을 요구합니다. 연방 합의문에는 권한 이전 시점이 없습니다. 창고는 차고, 운송업체는 단일 창구를 요구합니다.','paju')],
 promise:[scene('서울 여의도','재정경제부 예산실','통합연금 약속의 첫 청구서','첫 통합 예산안에 연금과 생계 지원 청구가 함께 올라왔습니다. 사전 합의한 지급 수준을 지키려면 추가 국채가 필요합니다. 국회 앞에서는 약속 이행을 요구하는 집회가 열립니다.',null)],
 ceasefire:[scene('원산시','국방부 통합지원단','원산의 무장 경비대가 지휘권 이양을 미룬다','항만 주변을 지키던 경비대가 급여와 전역 뒤의 생계를 보장하라며 통합 지휘체계 편입을 미룹니다. 구호 트럭이 검문소에서 대기하고 있습니다. 새 정부의 명령이 현장에서 처음 시험받습니다.','ports')],
 disease:[scene('함경북도 회령시','보건복지부 현장대응반','회령 임시주거지에서 집단 설사 신고','집중호우 뒤 임시주거지의 급수 펌프가 멈췄습니다. 주민들이 주변 물을 끓이지 않고 마신 뒤 보건소에 비슷한 증상이 접수됩니다. 진료 인력과 안전한 식수를 함께 보내야 합니다.','water','회령의 급수 중단이 집단 감염으로 번졌다'),scene('평안북도 신의주시','보건복지부 현장대응반','신의주 대피시설의 식수 검사에서 이상 신호','오래된 급수관을 다시 가동한 뒤 대피시설 여러 곳에서 환자가 늘고 있습니다. 전력 복구만으로 급수 위생까지 회복되지는 않았습니다. 현장팀은 정수와 진료를 동시에 요청합니다.','water','신의주 대피시설 집단 감염 비상')],
 blackout:[scene('청진시 송평구역','국토교통부 전력복구단','청진 제철지구의 전력이 끊겼다','송평구역의 철강 공장으로 전기를 보내던 변전시설이 멈췄습니다. 김책제철과 항만을 잇는 생산 흐름이 끊기면서 협력업체도 작업을 중단합니다. 병원 예비전원까지 복구 수요가 겹칩니다.','industry','청진 제철과 항만이 동시에 멈췄다'),scene('남포항','국토교통부 항만복구단','남포항 하역 장비가 정전으로 멈췄다','수입 곡물을 내리던 하역 장비가 전력 불안으로 정지했습니다. 선박 대기료가 늘고 제분공장은 원료를 받지 못합니다. 임시 전력을 확보할지 변전시설을 우선 복구할지 결정해야 합니다.','grain','남포항 정전, 곡물 반출까지 중단')],
 food:[scene('남포항과 평양시','보건복지부 식량수송반','남포에 도착한 곡물이 평양으로 가지 못한다','곡물은 항구에 도착했지만 하역과 운송 배정이 엇갈려 제분공장으로 넘어가지 못합니다. 평양 소매시장에서는 밀가루 가격이 오르고 사재기가 시작됐습니다. 정부는 배급망의 마지막 구간을 책임져야 합니다.','grain','남포 곡물 적체, 평양 급식 중단 위기')],
 unrest:[scene('청진시','고용노동부 노사조정단','청진 노동자들이 체불 급여를 요구한다','재가동을 기다리던 철강과 조선업 노동자들이 공장 밖으로 나왔습니다. 생산은 멈췄는데 생활비 지원은 늦어졌다는 주장입니다. 야당 조직도 현장에 합류해 대통령의 답을 요구합니다.','industry','청진의 체불 급여 시위가 항만까지 번졌다'),scene('파주시 문산읍','행정안전부 정착지원반','문산 임시주거단지, 입주 순번을 둘러싼 시위','정착 가구와 기존 거주민이 임대주택 배정 순서를 놓고 충돌합니다. 대기 명단이 여러 기관에 흩어져 있어 설명도 일치하지 않습니다. 시청 앞 집회에 지역 상인들이 합류합니다.','paju','문산 주거 갈등으로 도로 통행이 막혔다')],
 military:[scene('원산시','국방부 통합지원단','원산 경비대가 새 급여 명단을 거부했다','통합 급여 명단에서 빠진 인원들이 부대 전환을 중단했습니다. 지휘관들은 생계 보장과 신분 확인을 먼저 요구합니다. 늦어질수록 무장조직과 민간 행정 사이의 긴장이 커집니다.','ports','원산 통합 지휘체계에 집단 불복종')],
 coup:[scene('평양시와 서울시','국방부 비상연락실','평양의 지휘 불복종, 서울로 번진 정변 경보','통합 지휘체계를 거부한 일부 무장조직이 임시정부의 퇴진을 요구했습니다. 현지 행정기관과 중앙정부 사이의 연락도 불안정합니다. 이번 결정에서 버티지 못하면 임기가 끝날 수 있습니다.',null)],
 corruption:[scene('남포항','행정안전부 재건감사단','남포항 복구 계약서에 같은 장비가 두 번 적혔다','항만 복구비 청구서에서 중복 장비와 불명확한 하청 계약이 발견됐습니다. 현장에서는 장비가 부족하다고 하는데 예산 집행률은 높습니다. 감사와 공사 속도 사이에서 결정을 내려야 합니다.','ports','남포항 재건 계약 의혹이 대통령실로 번졌다')],
 credit:[scene('서울 여의도','재정경제부 국채상황실','여의도 채권시장, 통합국채 인수를 꺼린다','재건 지출과 인수 부채가 쌓이자 통합국채 입찰에 빈자리가 생겼습니다. 투자자들은 재원 계획과 더 높은 금리를 요구합니다. 오늘의 선택이 다음 턴 이자와 현장 예산을 함께 바꿉니다.',null,'통합국채 입찰 부진, 차환 경보')],
 property:[scene('개성시 공단 인근','통일부 재산권조정반','개성의 공장 부지, 계약서가 세 장이다','이전 운영기업, 현 거주민과 새 행정기관이 같은 부지에 서로 다른 권리를 주장합니다. 재가동 계약을 서두르면 주민 이주 문제가 남고, 조정을 기다리면 고용 회복이 늦어집니다.','paju')],
 resettle:[scene('파주시 문산읍','행정안전부 정착지원반','문산 환승시설에 정착 신청자가 몰렸다','개성에서 이동한 가족들의 임시 숙소가 부족합니다. 파주시는 서울과 인천의 분산 입주 협약을 요청합니다. 지역 학교와 상인들은 인력 지원과 명확한 일정부터 요구합니다.','paju')],
 rights:[scene('파주시와 청진시','행정안전부 독립조사단','집회 해산 영상이 국회 청문회에 올라왔다','앞선 강제 해산 현장의 영상과 주민 진술이 제출됐습니다. 빠른 진압의 성과 뒤에 과잉 대응 의혹이 남았습니다. 정부는 현장 자료와 피해 구제 계획을 제출해야 합니다.',null)],
 leak:[scene('남포항','행정안전부 재건감사단','미뤄 둔 남포항 계약 자료가 언론에 공개됐다','조사를 미뤘던 항만 복구 사업의 계약 원본이 취재진에게 전달됐습니다. 실제 반입된 장비와 지급액이 맞지 않는다는 보도가 나왔습니다. 국회가 책임자 출석을 요구합니다.','ports')],
 energy:[scene('청진시','외교부 에너지협상단','청진 비상 전력 계약의 청구액이 올랐다','외부 전력으로 버티던 공장에 계약 변경 통보가 도착했습니다. 공급국은 추가 비용을 요구하고, 현장에서는 국내 복구에 재원을 돌리자는 의견이 나옵니다. 이번 계약은 다음 생산 계획과 연결됩니다.','industry')],
 aid:[scene('서울시','외교부 국제재건회의','서울 재건회의에서 공동 지원안이 나왔다','국제 재건기금이 남포 항만과 회령 급수 사업에 자금을 제안했습니다. 현장 집행을 외부 감사에 공개하는 조건입니다. 자율성을 얼마나 나눌지 결정해야 합니다.','water')],
 investment:[scene('개성시와 파주시','고용노동부 투자협의단','개성 공장 재가동, 파주 물류업체도 복귀를 타진','전력과 통행 절차가 안정되자 제조업체가 채용을 전제로 복귀 의사를 밝혔습니다. 파주 운송업체도 노선 재개를 검토합니다. 현지 고용 조건과 신속 허가 가운데 우선순위를 정해야 합니다.','paju')],
 returnees:[scene('함흥시','보건복지부 인력협력반','함흥의 진료소를 다시 열자는 귀환 인력의 제안','해외에서 일하던 의료인과 기술자들이 함흥에 정착해 진료소 복구를 돕겠다고 제안했습니다. 자격 인정과 주거 지원이 결정되지 않으면 계획은 멈춥니다.','water')],
 curriculum:[scene('평양시와 서울시','통일부 교육협의회','평양과 서울 교사들이 같은 교과서에 합의하지 못했다','첫 공동 수업안을 검토하던 교사들이 역사 서술과 용어에서 부딪혔습니다. 학부모는 시험 기준부터 알려 달라고 요구합니다. 공동 집필과 단일 기준 중 어느 쪽을 먼저 시행할지 결정해야 합니다.',null)]
};
Object.assign(stories,{
 op_press:[scene('서울 여의도','대통령실 공보실','여의도 생방송 토론에 대통령을 부른다','야당대표가 여의도 공개토론장에서 정부의 복구 실적을 따지겠다고 예고했습니다. 청진의 공장 재가동률과 남포의 물류 지연이 질문 목록에 올랐습니다. 현장 자료를 보낼지 직접 토론에 나설지 결정해야 합니다.','industry')],
 op_legislative:[scene('서울 여의도','대통령실 의회협력실','회령 급수 예산까지 멈춘 국회 보이콧','야당이 재건 예산의 감시권을 요구하며 의사일정 합의를 거부했습니다. 회령의 급수와 남포의 항만 사업 담당자들이 집행 일정을 재촉합니다. 방치하면 이번 계획 단계의 정책 변경 비용이 늘어납니다.','water')],
 op_audit:[scene('남포항','행정안전부 재건감사단','야당 현장단이 남포항 계약 원본을 요구한다','남포항을 찾은 야당 의원들이 실제 반입 장비와 복구비 청구액을 대조하겠다고 발표했습니다. 취재진도 계약 원본을 요구합니다. 정부의 공개 방식이 재건 사업과 발표 신뢰를 함께 시험합니다.','ports')],
 op_protest:[scene('청진시 송평구역','고용노동부 노사조정단','야당대표가 청진 체불 급여 집회에 합류했다','철강 공장 재가동을 기다리던 노동자들의 집회에 야당대표가 방문했습니다. 주민은 체불 급여와 생활비를 요구하고, 상대 진영은 대통령의 현장 방문을 압박합니다. 중재를 하더라도 정치적 성과를 나눠야 합니다.','industry')],
 op_tax:[scene('서울 여의도','재정경제부 세제실','여의도 기업 간담회에서 통합세 감면 공약이 나왔다','야당이 기업 간담회에서 통일 비용을 줄이겠다며 감세안을 발표했습니다. 기업인과 중산층이 호응하지만 재건 예산의 재원은 줄어듭니다. 정부는 지금 세율을 유지할 이유를 설명해야 합니다.',null)],
 op_diplomacy:[scene('서울 국제재건회의장','외교부 협상지원실','회령 급수 원조의 조건이 외교 쟁점이 됐다','야당이 국제 재건회의에서 회령 급수 사업의 감사 조건과 주민 의견 수렴을 문제 삼았습니다. 지원국도 답변을 기다립니다. 초당적 대응은 협상력을 높이지만 상대의 입지도 키웁니다.','water')],
 press_viral:[scene('함경북도 회령시','대통령실 공보실','회령 현장 발언을 자른 영상이 퍼졌다','회령 급수 현장을 점검하며 한 대통령 발언의 앞뒤가 잘려 확산 중입니다. 주민의 요구를 무시했다는 해석이 붙었지만 원본 전체는 공개되지 않았습니다. 야당과 취재진이 해명을 요구합니다.','water')],
 press_follow:[scene('남포항','대통령실 공보실','남포항 감사 자료가 탐사보도로 공개됐다','공개를 미뤘던 남포항 복구 계약서가 탐사보도에 등장했습니다. 장비 인수 기록과 지급액의 차이가 쟁점입니다. 설명이 늦어지는 동안 정부 발표 신뢰가 떨어지고 있습니다.','ports')],
 op_debate:[scene('서울 여의도','선거방송 공동토론장','마지막 TV 토론이 시작됐다','청진의 일자리, 남포의 물류와 회령의 식수 문제가 마지막 토론의 의제로 올랐습니다. 유권자는 약속과 실제 집행을 대조합니다. 정부의 성과와 발표 신뢰, 상대의 설득력이 최종 득표율을 바꿉니다.',null)]
});
function ensure(s){if(s.phase==='setup')return s;if(!s.council)s.council={orderedTurn:-1,tasks:[],available:{},lastReport:null};for(const p of [s.pending,...s.presidency.deferred].filter(Boolean)){if(!p.scene&&stories[p.id])p.scene={id:p.id,index:Math.floor(s.turn/2)%stories[p.id].length};}return s;}
function eventBrief(s){const p=s.pending;if(!p)return null;const list=stories[p.scene?.id||p.id],story=list?list[p.scene?.index??Math.floor(s.turn/2)%list.length]:null;if(story)return {...story,title:story.severe&&s.risk[G.events[p.id].family]>=75?story.severe:story.title};return {place:p.id==='op_protest'?'서울 광화문':p.id==='op_tax'?'서울 여의도':'서울 국회와 대통령실',desk:['constitutional','intrigue'].includes(G.events[p.id].family)?'대통령실 정무상황실':'대통령실 공보실',title:base.eventTitle(s),body:G.events[p.id].body,source:null};}
const missions={
 marshall:[{id:'corridor',name:'남포 수송로 복구 지휘',place:'남포항',pp:2,cash:1.2,risk:{blackout:-12,food:-8},boost:{infra:3},effect:'전력 위험 -12, 식량 위험 -8, 기반시설 +3',trade:'부채 +1.2조',method:'항만과 복구 부처의 작업 순서를 조정합니다.'},{id:'integration',name:'원산 군 통합 협약',place:'원산시',pp:3,cash:.6,risk:{military:-16,unrest:3},boost:{army:5},effect:'군 불복종 -16, 군 통합 +5',trade:'부채 +0.6조, 소요 +3',method:'급여와 전역 지원 합의를 현장에서 이끕니다.'}],
 bismarck:[{id:'coalition',name:'여의도 초당적 합의',place:'서울 여의도',pp:2,cash:0,risk:{},boost:{assembly:9},rival:3,effect:'의회 협조 +9',trade:'상대 조직력 +3',method:'공개 협상으로 다음 예산안의 협조를 얻습니다.'},{id:'mediation',name:'문산 주민 중재회의',place:'파주시 문산읍',pp:3,cash:.3,risk:{unrest:-14},boost:{unity:4,assembly:-2},effect:'사회 소요 -14, 지역 신뢰 +4',trade:'부채 +0.3조, 의회 협조 -2',method:'정착 주민과 기존 거주민의 요구를 조정합니다.'}],
 keynes:[{id:'jobs',name:'청진 한시 고용계획',place:'청진시',pp:2,cash:1.8,risk:{unrest:-8,credit:5},boost:{jobs:-1.5},effect:'실업률 -1.5%p, 사회 소요 -8',trade:'부채 +1.8조, 신용 위험 +5',method:'복구 일자리로 가계 소득의 급락을 완화합니다.'},{id:'bonds',name:'통합국채 재원 설명회',place:'서울 여의도',pp:3,cash:0,risk:{credit:-14},boost:{approval:-2},effect:'신용 위험 -14',trade:'국민 지지 -2',method:'시장에 재원 계획을 제시하지만 유권자는 부담을 체감합니다.'}],
 nightingale:[{id:'water',name:'회령 식수와 방역 점검',place:'회령시',pp:2,cash:.8,risk:{disease:-18,food:-4},boost:{},effect:'감염병 위험 -18, 식량 위험 -4',trade:'부채 +0.8조',method:'급수와 임시주거지 위생을 함께 점검합니다.'},{id:'clinics',name:'신의주 순회진료 지원',place:'신의주시',pp:2,cash:1.3,risk:{disease:-12},boost:{capacity:3,poverty:-2},effect:'감염병 위험 -12, 행정 집행력 +3, 빈곤 -2',trade:'부채 +1.3조',method:'의료 인력과 주민 등록 업무를 함께 지원합니다.'}]
};
const personalities={marshall:{short:'마셜',line:'계획보다 현장의 병목을 먼저 본다.',strength:'군 통합과 복구 조정',weakness:'속도를 내는 만큼 사업비가 든다.'},bismarck:{short:'비스마르크',line:'좋은 연설보다 통과될 합의안을 찾는다.',strength:'의회 협상과 갈등 중재',weakness:'합의의 대가로 정치적 양보가 남는다.'},keynes:{short:'케인스',line:'일자리 회복이 늦으면 재정도 회복되지 않는다.',strength:'고용 회복과 재원 설계',weakness:'경기 부양은 부채 부담을 키운다.'},nightingale:{short:'나이팅게일',line:'환자 수 뒤에 있는 식수와 주거를 살핀다.',strength:'방역과 현장 진료',weakness:'의료 지원만으로 전력과 주택을 고칠 수 없다.'}};
function adviserBlocked(s,id,action){const m=missions[id]?.find(m=>m.id===action);if(!m)return '없는 임무입니다';ensure(s);if(!['planning','incident'].includes(s.phase)||s.turn>=G.turnLimit)return '임기가 종료됐습니다';if(s.presidency.impeachment.stage==='review')return '대통령 직무가 정지됐습니다';if(s.council.tasks.some(t=>t.adviser===id))return '현장 임무 수행 중';if((s.council.available[id]||0)>s.turn)return (s.council.available[id]-s.turn)+'턴 뒤 다시 지시 가능';if(s.council.orderedTurn===s.turn)return '이번 턴의 참모 지시를 사용했습니다';if(s.pp<m.pp)return '정치력 '+m.pp+' 필요';return '';}
function dispatchAdviser(s,id,action){if(adviserBlocked(s,id,action))return false;const m=missions[id].find(m=>m.id===action);s.pp-=m.pp;s.debt+=m.cash;s.council.orderedTurn=s.turn;s.council.tasks.push({adviser:id,action,due:s.turn+1});s.history.push({turn:s.turn,title:personalities[id].short+'에게 임무 지시',choice:m.name,result:'정치력 -'+m.pp+' / '+m.trade+' / 다음 턴 완료',type:'adviser'});return true;}
function completeTasks(s){for(const t of s.council.tasks.filter(t=>t.due<=s.turn+1)){const m=missions[t.adviser].find(m=>m.id===t.action);for(const[k,v]of Object.entries(m.risk))s.risk[k]=clamp(s.risk[k]+v);for(const[k,v]of Object.entries(m.boost))s.boost[k]+=v;if(m.rival)s.rival.organization=clamp(s.rival.organization+m.rival);s.council.available[t.adviser]=s.turn+2;s.council.lastReport={turn:s.turn+1,adviser:t.adviser,place:m.place,text:m.name+' 완료 / '+m.effect};s.history.push({turn:s.turn+1,title:personalities[t.adviser].short+'의 현장 보고',choice:m.name,result:m.effect,type:'adviser'});}s.council.tasks=s.council.tasks.filter(t=>t.due>s.turn+1);}
G.start=(...a)=>ensure(base.start(...a));G.restore=v=>ensure(base.restore(v));
G.eventTitle=s=>eventBrief(s)?.title||base.eventTitle(s);
G.advance=s=>{if(s.phase!=='planning'||s.turn>=G.turnLimit||s.outcome)return false;ensure(s);const due=s.flags.filter(f=>f.due<=s.turn+1&&f.scene).map(f=>({...f}));completeTasks(s);if(!base.advance(s))return false;for(const pending of [s.pending,...s.presidency.deferred].filter(Boolean)){const f=due.find(f=>f.id===pending.id);if(f)pending.scene=f.scene;}ensure(s);return true;};
G.resolve=(s,id)=>{if(!s.pending)return false;ensure(s);const brief=regionalEvent(s),sceneRef=s.pending.scene,oldFlags=new Set(s.flags),historyLength=s.history.length;if(!base.resolve(s,id))return false;const h=s.history[historyLength];if(h){h.title=brief.title;h.place=brief.place;}for(const f of s.flags)if(!oldFlags.has(f))f.scene={...sceneRef,place:brief.place};ensure(s);return true;};
// Follow-ups retain the location, while keeping their own incident narrative.
const originalBrief=eventBrief;
function regionalEvent(s){const b=originalBrief(s);if(!b)return b;const p=s.pending;if(p.scene&&p.scene.id!==p.id&&stories[p.id]){const own={...stories[p.id][0]},place=p.scene.place||b.place;if(p.id==='energy'){own.title=place+' 비상 전력 계약의 청구액이 올랐다';own.body=place+'에 도입했던 외부 전력의 공급 계약 변경 통보가 도착했습니다. 공급국은 추가 비용을 요구합니다. 현장에서는 국내 전력망 복구와 계약 연장을 함께 검토해 달라고 요청합니다.';own.source=stories[p.scene.id]?.[p.scene.index||0]?.source||null;}return {...own,place};}return {...b,place:p.scene?.place||b.place};}
G.eventTitle=s=>regionalEvent(s)?.title||base.eventTitle(s);
G.snapshot=s=>base.snapshot(s);
G.scenarios.find(c=>c.id==='collapse').desc='평양의 행정 공백, 남포의 구호 적체, 청진의 생산 중단. 붕괴한 정권의 업무를 새 정부가 한꺼번에 인수합니다.';
G.scenarios.find(c=>c.id==='federal').desc='개성 통행증부터 평양의 지방 예산까지 권한이 겹칩니다. 두 행정조직이 협상으로 하나의 정부를 만들어갑니다.';
G.scenarios.find(c=>c.id==='gradual').desc='개성의 생산시설과 파주의 물류망은 준비됐습니다. 이제 서울의 국회와 채권시장이 통합 비용의 부담을 묻습니다.';
G.scenarios.find(c=>c.id==='war').desc='원산의 지휘체계, 청진의 전력, 회령의 임시주거지를 동시에 복구해야 합니다. 전쟁은 끝났지만 현장은 멈춰 있습니다.';
G.policies.find(p=>p.id==='training').desc='청진의 실직 노동자와 원산의 전역 인력에게 전환 교육을 제공합니다. 실업과 생활 불안을 줄이지만 교육이 끝날 시간이 필요합니다.';
G.events.op_tax.body='서울 여의도에서 야당이 통합 비용의 부담을 앞세워 감세안을 발표했습니다. 기업과 중산층이 호응합니다. 감세를 수용하면 재원이 줄고, 현 세율을 지키려면 사용처를 납득시켜야 합니다.';
G.events.resettle.options.find(o=>o.id==='limit').title='이동을 제한하고 개성 복귀 권고';
const originalAdvice=G.advice;
G.advice=s=>originalAdvice(s).map(a=>a.id==='bismarck'&&a.text.includes('공개 협상으로 8')?{...a,text:'의회 협조 '+Math.round(G.votes(s).assembly)+'. 여의도 합의 임무는 다음 턴에 의회 협조를 9 높이지만 상대 조직력도 3 높입니다.'}:a);
Object.assign(G,{regionalStories:stories,regionalSources:sources,regionalEvent,adviserMissions:missions,adviserProfiles:personalities,adviserBlocked,dispatchAdviser});return G;
}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else install(scope.UnificationGame);
})(globalThis);
