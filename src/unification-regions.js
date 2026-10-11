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
 vacuum:[scene('평양시','행정안전부 현지 인수단','평양의 주민등록 창구가 멈췄다','정부 인수단이 평양시청의 업무를 넘겨받았습니다. 그러나 시청이 급여를 지급하지 못해 일부 직원이 출근하지 않고 있습니다. 남아 있는 직원들도 종이 대장과 전산 기록이 달라 주민의 거주 사실을 확인하지 못합니다. 주민들은 식량 배급을 신청하려고 구청 앞에서 기다리고 있습니다.',null)],
 autonomy:[scene('개성시와 파주시','통일부 공동행정협의회','개성 물류 통행증, 누가 발급할 것인가','개성의 행정기관과 파주의 행정기관이 화물차 운전자에게 각각 통행증을 요구하고 있습니다. 두 기관은 통일 합의문에 최종 허가 기관이 적혀 있지 않다며 상대 기관의 허가만으로는 차량을 통과시킬 수 없다고 주장합니다. 운송업체들은 하나의 기관에서 허가를 처리해 달라고 정부에 요청했습니다.','paju')],
 promise:[scene('서울 여의도','재정경제부 예산실','통합연금 약속의 첫 청구서','재정경제부가 첫 통합 예산안을 작성하면서 약속한 연금과 생계비를 모두 지급하기에는 예산이 부족하다고 보고했습니다. 부족한 돈을 마련하려면 정부가 국채를 발행해 추가로 돈을 빌려야 합니다. 지원금을 기다리던 주민들은 국회 앞에서 약속대로 지급하라고 요구하고 있습니다.',null)],
 ceasefire:[scene('원산시','국방부 통합지원단','원산 경비대가 새 정부의 명령을 거부했다','원산항을 지키던 무장 경비대가 새 정부의 지휘관에게 복종하지 않겠다고 밝혔습니다. 경비대원들은 밀린 급여를 받고 전역 후 생활을 보장받아야 복귀하겠다고 요구합니다. 경비대가 검문소에서 구호 차량을 세워 두어 주민들은 지원 물자를 받지 못하고 있습니다.','ports')],
 disease:[scene('함경북도 회령시','보건복지부 현장대응반','회령 임시주거지에서 집단 설사 신고','집중호우로 회령 임시주거지의 급수 펌프가 고장 났습니다. 안전한 물을 구하지 못한 주민들이 주변 물을 끓이지 않고 마신 뒤 설사 증상을 보이고 있습니다. 현지 보건소는 정부에 의료진과 식수를 함께 보내 달라고 요청했습니다.','water','회령의 급수 중단이 집단 감염으로 번졌다'),scene('평안북도 신의주시','보건복지부 현장대응반','신의주 대피시설의 식수 검사에서 이상 신호','신의주시가 오래된 급수관을 다시 가동한 뒤 여러 대피시설에서 설사 환자가 늘었습니다. 보건소는 급수관을 통과한 물이 오염됐을 가능성을 조사하고 있습니다. 현장 의료진은 환자를 치료할 인력과 물을 정수할 장비가 모두 부족하다고 보고했습니다.','water','신의주 대피시설 집단 감염 비상')],
 blackout:[scene('청진시 송평구역','국토교통부 전력복구단','청진 제철지구의 전력이 끊겼다','청진시 송평구역의 변전시설이 고장 나 철강 공장에 전기가 공급되지 않고 있습니다. 김책제철이 생산을 멈추자 원료와 제품을 운반하던 협력업체들도 작업을 중단했습니다. 인근 병원은 예비 발전기에 필요한 연료가 부족하다며 정부에 지원을 요청했습니다.','industry','청진 제철과 항만이 동시에 멈췄다'),scene('남포항','국토교통부 항만복구단','남포항 하역 장비가 정전으로 멈췄다','남포항의 정전으로 항만 작업자들이 곡물을 내리는 장비를 사용하지 못하고 있습니다. 선박이 항구에 오래 머물수록 정부가 부담할 대기 비용도 늘어납니다. 곡물을 기다리던 제분공장들은 원료가 부족해 밀가루 생산을 줄이고 있습니다.','grain','남포항 정전, 곡물 반출까지 중단')],
 food:[scene('남포항과 평양시','보건복지부 식량수송반','남포에 도착한 곡물이 평양으로 가지 못한다','남포항에 곡물은 도착했지만 항만 운영기관과 운송업체가 작업 일정을 맞추지 못했습니다. 일부 곡물은 배에서 내리지 못했고, 나머지는 운송 차량이 없어 창고에 쌓여 있습니다. 평양의 제분공장은 원료를 받지 못하고 있으며, 밀가루 가격이 오르자 주민들이 식량을 사재기하기 시작했습니다.','grain','남포 곡물 적체, 평양 급식 중단 위기')],
 unrest:[scene('청진시','고용노동부 노사조정단','청진 노동자들이 체불 급여를 요구한다','청진의 철강과 조선업 노동자들이 공장 앞에서 시위를 시작했습니다. 노동자들은 회사가 밀린 급여를 지급하지 않고 정부의 생계비 지원도 늦어졌다고 주장합니다. 현장에 합류한 야당 관계자들은 대통령에게 해결책을 발표하라고 요구합니다.','industry','청진의 체불 급여 시위가 항만까지 번졌다'),scene('파주시 문산읍','행정안전부 정착지원반','문산 임시주거단지, 입주 순번을 둘러싼 시위','개성에서 이주한 가족들과 문산의 기존 주민들이 임대주택 배정 순서를 놓고 다투고 있습니다. 담당 기관들이 서로 다른 대기 명단을 사용하면서 일부 가구는 배정 결과를 통보받지 못했습니다. 주민들과 상인들은 시청 앞에서 정부가 배정 기준을 공개하라고 요구합니다.','paju','문산 주거 갈등으로 도로 통행이 막혔다')],
 military:[scene('원산시','국방부 통합지원단','원산 경비대가 새 급여 명단을 거부했다','국방부가 작성한 통합 급여 명단에서 원산 경비대의 일부 인원이 빠졌습니다. 해당 대원들과 지휘관들은 정부가 군인 신분과 급여를 보장하기 전까지 부대 개편에 참여하지 않겠다고 밝혔습니다. 현지 행정기관은 무장한 경비대와 협의하기 어렵다며 중앙정부에 지원을 요청합니다.','ports','원산 통합 지휘체계에 집단 불복종')],
 coup:[scene('평양시와 서울시','국방부 비상연락실','평양의 일부 군인이 정부 퇴진을 요구했다','통합군의 명령을 거부한 일부 군인이 평양에서 정부 퇴진을 요구했습니다. 현지 행정기관은 무장 병력이 이동하면서 서울의 중앙정부와 연락하기 어렵다고 보고했습니다. 대통령은 정부에 남은 군과 정치세력의 지지를 확보하거나 반란 세력과 협상해야 합니다.',null)],
 corruption:[scene('남포항','행정안전부 재건감사단','남포항 복구 계약서에 같은 장비가 두 번 적혔다','감사관이 남포항 복구 계약서를 검토하다가 같은 장비의 비용이 두 번 청구된 사실을 발견했습니다. 정부는 상당한 예산을 지급했지만 현장 작업자들은 장비가 부족해 공사를 진행하지 못한다고 보고합니다. 감사단은 담당 공무원과 계약업체가 복구비를 빼돌렸는지 조사할 필요가 있다고 밝혔습니다.','ports','남포항 재건 계약 의혹이 대통령실로 번졌다')],
 credit:[scene('서울 여의도','재정경제부 국채상황실','투자자들이 정부에 돈을 빌려주지 않는다','재정경제부가 복구비를 마련하려고 국채를 발행했지만 투자자들이 예상보다 적은 금액만 사겠다고 나섰습니다. 투자자들은 정부 부채가 계속 늘어나 원금과 이자를 돌려받지 못할까 걱정하고 있습니다. 이들은 정부에 구체적인 상환 계획이나 더 높은 이자율을 요구합니다.',null,'정부가 빚을 갚을 돈을 구하지 못한다')],
 property:[scene('개성시 공단 인근','통일부 재산권조정반','개성의 공장 부지, 계약서가 세 장이다','개성의 한 공장 부지를 두고 과거 운영기업, 현재 거주민, 새 행정기관이 서로 다른 계약서를 제시했습니다. 모두 자신에게 부지를 사용하거나 처분할 권리가 있다고 주장합니다. 기업은 공장 재가동 허가를 요구하지만, 거주민들은 공사가 시작되면 어디로 이사해야 하는지 먼저 정해 달라고 요구합니다.','paju')],
 resettle:[scene('파주시 문산읍','행정안전부 정착지원반','문산 환승시설에 정착 신청자가 몰렸다','개성에서 이동한 가족들이 파주 문산의 정착지원 창구에 몰렸습니다. 파주시는 임시 숙소가 부족하다며 서울시와 인천시에도 일부 가족이 입주할 수 있게 해 달라고 요청했습니다. 지역 학교와 상인들은 학생 수와 주민 수가 늘어날 것에 대비해 정부의 인력 지원과 입주 일정을 요구합니다.','paju')],
 rights:[scene('파주시와 청진시','행정안전부 독립조사단','집회 해산 영상이 국회 청문회에 올라왔다','국회가 경찰의 집회 해산 영상과 현장 주민들의 진술을 접수했습니다. 일부 주민은 경찰이 필요 이상으로 폭력을 사용했다고 주장합니다. 국회는 정부에 진압 명령과 현장 기록을 제출하고 피해자를 어떻게 지원할지 설명하라고 요구했습니다.',null)],
 leak:[scene('남포항','행정안전부 재건감사단','미뤄 둔 남포항 계약 자료가 언론에 공개됐다','기자들이 정부가 조사를 미뤘던 남포항 복구 계약서 원본을 입수했습니다. 언론은 정부가 지급한 금액에 비해 현장에 들어온 장비가 부족하다고 보도했습니다. 국회는 사업 책임자를 불러 계약과 지급 과정을 묻겠다고 밝혔습니다.','ports')],
 energy:[scene('청진시','외교부 에너지협상단','청진 비상 전력 계약의 청구액이 올랐다','청진 공장에 전기를 팔던 주변국이 공급 가격을 올리겠다고 통보했습니다. 공장들은 전력 수입이 끊기면 생산을 다시 중단해야 한다고 보고합니다. 국내 복구팀은 수입 대금 일부를 발전시설 수리에 쓰면 장기적으로 외부 전력 의존을 줄일 수 있다고 제안했습니다.','industry')],
 aid:[scene('서울시','외교부 국제재건회의','서울 재건회의에서 공동 지원안이 나왔다','국제 재건기금이 서울 회의에서 남포항과 회령 급수시설의 복구비를 지원하겠다고 제안했습니다. 기금은 외부 감사관에게 정부의 계약과 지출 내역을 공개하라는 조건을 붙였습니다. 외교부는 보조금을 받을지, 상환 의무가 있는 차관을 받을지 대통령의 결정을 요청했습니다.','water')],
 investment:[scene('개성시와 파주시','고용노동부 투자협의단','개성 공장 재가동, 파주 물류업체도 복귀를 타진','개성과 파주의 전력 공급과 통행 허가 절차가 안정되자 제조업체들이 개성 공장을 다시 운영하겠다고 제안했습니다. 파주의 운송업체들도 공장 화물을 운반할 준비가 됐다고 밝혔습니다. 정부는 기업에 현지 주민 채용을 요구할지, 빠른 허가와 보조금으로 투자를 유도할지 결정해야 합니다.','paju')],
 returnees:[scene('함흥시','보건복지부 인력협력반','함흥의 진료소를 다시 열자는 귀환 인력의 제안','해외에서 일하던 의료인과 기술자들이 함흥으로 돌아와 진료소를 복구하겠다고 제안했습니다. 이들은 정부가 해외 자격을 인정하고 거처를 지원해 달라고 요청합니다. 보건복지부는 직접 정착을 지원하는 방안과 원격으로 지역 대학을 돕게 하는 방안을 제시했습니다.','water')],
 curriculum:[scene('평양시와 서울시','통일부 교육협의회','평양과 서울 교사들이 같은 교과서에 합의하지 못했다','평양과 서울의 교사들이 공동 교과서를 만들다가 역사 설명과 용어를 놓고 합의하지 못했습니다. 학부모들은 수업 내용이 정해지지 않으면 학생들이 시험을 준비하기 어렵다고 호소합니다. 교육협의회는 공동 집필을 계속할지, 통일된 기준을 먼저 정할지 대통령에게 결정을 요청했습니다.',null)]
};
Object.assign(stories,{
 op_press:[scene('서울 여의도','대통령실 공보실','여의도 생방송 토론에 대통령을 부른다','야당대표가 생방송 토론에서 정부의 복구 성과를 검증하겠다고 밝혔습니다. 야당은 청진 공장이 얼마나 재가동됐는지, 남포항의 운송 지연을 왜 해결하지 못했는지 질문할 예정입니다. 대통령실은 실무진을 보내 자료를 설명하거나 대통령이 직접 참석하는 방안을 준비했습니다.','industry')],
 op_legislative:[scene('서울 여의도','대통령실 의회협력실','회령 급수 예산까지 멈춘 국회 보이콧','야당이 정부의 재건 예산을 감시할 권한을 요구하며 표결 일정에 합의하지 않고 있습니다. 회령 급수시설과 남포항 담당 부처는 예산 처리가 늦어지면 사업 일정도 미뤄진다고 보고했습니다. 대통령은 야당과 협상하거나 의원들을 공개적으로 설득해야 합니다.','water')],
 op_audit:[scene('남포항','행정안전부 재건감사단','야당 현장단이 남포항 계약 원본을 요구한다','남포항을 방문한 야당 의원들이 정부의 장비 구매 계약서와 지급 내역을 요구했습니다. 의원들은 현장에 도착한 장비와 청구서에 적힌 장비를 비교하겠다고 밝혔습니다. 취재진도 자료 공개를 요구하고 있어 정부는 조사 주체와 공개 범위를 결정해야 합니다.','ports')],
 op_protest:[scene('청진시 송평구역','고용노동부 노사조정단','야당대표가 청진 체불 급여 집회에 합류했다','청진 노동자들이 밀린 급여와 생활비 지원을 요구하는 집회에 야당대표가 참석했습니다. 야당대표는 정부가 주민을 방치했다며 대통령에게 현장을 방문하라고 요구합니다. 정부가 협상으로 시위를 해결하더라도 야당은 자신이 양보를 이끌어 냈다고 주장할 수 있습니다.','industry')],
 op_tax:[scene('서울 여의도','재정경제부 세제실','여의도 기업 간담회에서 통합세 감면 공약이 나왔다','야당대표가 여의도 기업 간담회에서 통일 비용 때문에 높아진 세금을 낮추겠다고 공약했습니다. 기업인과 중산층 유권자들은 세금 부담이 줄어든다는 이유로 호응하고 있습니다. 재정경제부는 소득세를 내리면 재건 사업에 쓸 세입이 줄어든다고 보고했습니다.',null)],
 op_diplomacy:[scene('서울 국제재건회의장','외교부 협상지원실','회령 급수 원조의 조건이 외교 쟁점이 됐다','야당이 국제 재건회의에서 회령 급수시설의 원조 계약을 비판했습니다. 야당은 정부가 외부 감사 조건을 충분히 공개하지 않았고 주민 의견도 듣지 않았다고 주장합니다. 지원국들은 정부의 설명을 기다리고 있으며, 외교부는 야당과 공동 대응할지 협약 내용을 공개할지 검토하고 있습니다.','water')],
 press_viral:[scene('함경북도 회령시','대통령실 공보실','회령 현장 발언을 자른 영상이 퍼졌다','누군가 대통령이 회령 급수시설에서 한 발언의 일부만 잘라 온라인에 게시했습니다. 원래 발언의 앞뒤 내용이 빠진 탓에 일부 주민은 대통령이 식수 지원 요구를 무시했다고 생각합니다. 야당과 취재진은 대통령실에 원본 영상과 해명을 요구합니다.','water')],
 press_follow:[scene('남포항','대통령실 공보실','남포항 감사 자료가 탐사보도로 공개됐다','탐사보도팀이 정부가 공개를 미뤘던 남포항 계약서를 입수해 보도했습니다. 기자들은 장비를 받은 기록과 정부가 지급한 금액이 맞지 않는다고 지적합니다. 주민들은 정부가 자료를 늦게 공개한 이유도 설명하라고 요구합니다.','ports')],
 op_debate:[scene('서울 여의도','선거방송 공동토론장','마지막 TV 토론이 시작됐다','대통령과 야당대표가 마지막 TV 토론에 참석했습니다. 사회자는 청진의 일자리, 남포항의 운송 지연, 회령의 식수 문제를 질문할 예정입니다. 유권자들은 두 후보의 설명과 정부가 공개한 실적을 비교해 투표할 후보를 정합니다.',null)]
});
function ensure(s){if(s.phase==='setup')return s;if(!s.council)s.council={orderedTurn:-1,tasks:[],available:{},lastReport:null};for(const p of [s.pending,...s.presidency.deferred].filter(Boolean)){if(!p.scene&&stories[p.id])p.scene={id:p.id,index:Math.floor(s.turn/2)%stories[p.id].length};}return s;}
function eventBrief(s){const p=s.pending;if(!p)return null;const list=stories[p.scene?.id||p.id],story=list?list[p.scene?.index??Math.floor(s.turn/2)%list.length]:null;if(story)return {...story,title:story.severe&&s.risk[G.events[p.id].family]>=75?story.severe:story.title};return {place:p.id==='op_protest'?'서울 광화문':p.id==='op_tax'?'서울 여의도':'서울 국회와 대통령실',desk:['constitutional','intrigue'].includes(G.events[p.id].family)?'대통령실 정무상황실':'대통령실 공보실',title:base.eventTitle(s),body:G.events[p.id].body,source:null};}
const missions={
 marshall:[{id:'corridor',name:'남포 수송로 복구 지휘',place:'남포항',pp:2,cash:1.2,risk:{blackout:-12,food:-8},boost:{infra:3},effect:'전력 위험 -12, 식량 위험 -8, 기반시설 +3',trade:'부채 +1.2조',method:'마셜이 항만 운영기관과 복구 담당 부처를 모아 전력 복구와 곡물 수송의 작업 순서를 정합니다.'},{id:'integration',name:'원산 군 통합 협약',place:'원산시',pp:3,cash:.6,risk:{military:-16,unrest:3},boost:{army:5},effect:'군 불복종 -16, 군 통합 +5',trade:'부채 +0.6조, 소요 +3',method:'마셜이 원산 경비대 지휘관과 만나 급여 지급과 전역 후 생계 지원 조건을 협상합니다.'}],
 bismarck:[{id:'coalition',name:'여의도 초당적 합의',place:'서울 여의도',pp:2,cash:0,risk:{},boost:{assembly:9},rival:3,effect:'의회 협조 +9',trade:'상대 조직력 +3',method:'비스마르크가 여야 의원들과 공개적으로 협상해 정부 예산안을 지지해 달라고 요청합니다.'},{id:'mediation',name:'문산 주민 중재회의',place:'파주시 문산읍',pp:3,cash:.3,risk:{unrest:-14},boost:{unity:4,assembly:-2},effect:'사회 소요 -14, 지역 신뢰 +4',trade:'부채 +0.3조, 의회 협조 -2',method:'비스마르크가 문산의 기존 주민과 새로 이주한 주민을 만나 주택 배정에 관한 합의를 중재합니다.'}],
 keynes:[{id:'jobs',name:'청진 한시 고용계획',place:'청진시',pp:2,cash:1.8,risk:{unrest:-8,credit:5},boost:{jobs:-1.5},effect:'실업률 -1.5%p, 사회 소요 -8',trade:'부채 +1.8조, 신용 위험 +5',method:'케인스가 청진의 실업자를 복구 공사에 임시로 고용하는 계획을 마련해 주민의 소득을 늘립니다.'},{id:'bonds',name:'통합국채 재원 설명회',place:'서울 여의도',pp:3,cash:0,risk:{credit:-14},boost:{approval:-2},effect:'신용 위험 -14',trade:'국민 지지 -2',method:'케인스가 투자자에게 정부의 세금 수입과 부채 상환 계획을 설명합니다. 세금 부담이 늘어날 것을 우려하는 주민들은 반발합니다.'}],
 nightingale:[{id:'water',name:'회령 식수와 방역 점검',place:'회령시',pp:2,cash:.8,risk:{disease:-18,food:-4},boost:{},effect:'감염병 위험 -18, 식량 위험 -4',trade:'부채 +0.8조',method:'나이팅게일이 회령의 급수시설을 검사하고 임시주거지 주민에게 식수와 위생용품을 지원합니다.'},{id:'clinics',name:'신의주 순회진료 지원',place:'신의주시',pp:2,cash:1.3,risk:{disease:-12},boost:{capacity:3,poverty:-2},effect:'감염병 위험 -12, 행정 집행력 +3, 빈곤 -2',trade:'부채 +1.3조',method:'나이팅게일이 신의주 주민에게 순회 진료를 제공하고, 지원에서 빠진 주민을 담당 기관에 등록합니다.'}]
};
const personalities={marshall:{short:'마셜',line:'복구가 늦어지는 이유를 현장에서 찾아 해결한다.',strength:'군 통합과 복구 조정',weakness:'속도를 내는 만큼 사업비가 든다.'},bismarck:{short:'비스마르크',line:'좋은 연설보다 통과될 합의안을 찾는다.',strength:'의회 협상과 갈등 중재',weakness:'협상을 성사시키려면 야당의 요구도 일부 받아들여야 한다.'},keynes:{short:'케인스',line:'주민이 다시 일해야 정부도 세금을 거둘 수 있다.',strength:'고용 회복과 재원 설계',weakness:'경기 부양은 부채 부담을 키운다.'},nightingale:{short:'나이팅게일',line:'주민이 왜 병에 걸렸는지 식수와 주거 환경부터 확인한다.',strength:'방역과 현장 진료',weakness:'의료 지원만으로 전력과 주택을 고칠 수 없다.'}};
function adviserBlocked(s,id,action){const m=missions[id]?.find(m=>m.id===action);if(!m)return '없는 임무입니다';ensure(s);if(!['planning','incident'].includes(s.phase)||s.turn>=G.termLimit(s))return '임기가 종료됐습니다';if(s.presidency.impeachment.stage==='review')return '대통령 직무가 정지됐습니다';if(s.council.tasks.some(t=>t.adviser===id))return '현장 임무 수행 중';if((s.council.available[id]||0)>s.turn)return (s.council.available[id]-s.turn)+'턴 뒤 다시 지시 가능';if(s.council.orderedTurn===s.turn)return '이번 턴의 참모 지시를 사용했습니다';if(s.pp<m.pp)return '정치력 '+m.pp+' 필요';return '';}
function dispatchAdviser(s,id,action){if(adviserBlocked(s,id,action))return false;const m=missions[id].find(m=>m.id===action);s.pp-=m.pp;s.debt+=m.cash;s.council.orderedTurn=s.turn;s.council.tasks.push({adviser:id,action,due:s.turn+1});s.history.push({turn:s.turn,title:personalities[id].short+'에게 임무 지시',choice:m.name,result:'정치력 -'+m.pp+' / '+m.trade+' / 다음 턴 완료',type:'adviser'});return true;}
function completeTasks(s){for(const t of s.council.tasks.filter(t=>t.due<=s.turn+1)){const m=missions[t.adviser].find(m=>m.id===t.action);for(const[k,v]of Object.entries(m.risk))s.risk[k]=clamp(s.risk[k]+v);for(const[k,v]of Object.entries(m.boost))s.boost[k]+=v;if(m.rival)s.rival.organization=clamp(s.rival.organization+m.rival);s.council.available[t.adviser]=s.turn+2;s.council.lastReport={turn:s.turn+1,adviser:t.adviser,place:m.place,text:m.name+' 완료 / '+m.effect};s.history.push({turn:s.turn+1,title:personalities[t.adviser].short+'의 현장 보고',choice:m.name,result:m.effect,type:'adviser'});}s.council.tasks=s.council.tasks.filter(t=>t.due>s.turn+1);}
G.start=(...a)=>ensure(base.start(...a));G.restore=v=>ensure(base.restore(v));
G.eventTitle=s=>eventBrief(s)?.title||base.eventTitle(s);
G.advance=s=>{if(s.phase!=='planning'||s.turn>=G.termLimit(s)||s.outcome)return false;ensure(s);const due=s.flags.filter(f=>f.due<=s.turn+1&&f.scene).map(f=>({...f}));completeTasks(s);if(!base.advance(s))return false;for(const pending of [s.pending,...s.presidency.deferred].filter(Boolean)){const f=due.find(f=>f.id===pending.id);if(f)pending.scene=f.scene;}ensure(s);return true;};
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
