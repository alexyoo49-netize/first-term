(function(scope){
'use strict';
function install(G){
const base={start:G.start,restore:G.restore,advice:G.advice};
const round=n=>Math.round(n),fmt=n=>Number(n).toFixed(1);
const briefings={
 collapse:{"story":"북한 정권이 갑자기 무너진 뒤, 대한민국 정부가 기존 북한 지역의 행정을 맡았습니다. 당신은 통일 직후 취임한 대통령입니다. 평양시청은 직원에게 급여를 지급하지 못했고, 일부 직원은 출근하지 않고 있습니다. 담당 공무원이 부족해 주민들은 거주 사실을 확인받거나 식량 배급을 신청하지 못하고 있습니다.","focus":"먼저 평양시청의 업무를 정상화해야 합니다. 첫 사건에서 대응 방법을 선택한 뒤, 행정안전부의 ‘행정과 치안 복구’ 예산을 확인하세요. 행정 집행력은 공무원이 정부 정책을 실행할 수 있는 능력입니다. 이 수치가 45보다 낮으면 정부가 재건 예산을 늘려도 복구 효과가 줄어듭니다.","policy":"admin"},
 federal:{"story":"남북 정부는 협상을 통해 하나의 나라를 만들기로 합의했습니다. 다만 기존 남북 행정기관은 각 지역의 업무를 계속 맡고 있습니다. 당신은 이 공동정부의 대통령입니다. 개성과 파주를 오가는 운송업체는 양쪽 기관에서 각각 통행 허가를 받아야 합니다. 두 기관은 어느 쪽이 최종 허가를 내줄지 아직 합의하지 못했습니다.","focus":"먼저 중앙정부와 지방정부가 통행 허가 업무를 누가 맡을지 정해야 합니다. 중앙정부가 권한을 가져오면 결정을 빨리 내릴 수 있지만, 지방정부와 주민은 자치권을 빼앗겼다고 반발할 수 있습니다. 첫 사건 이후에는 통일부의 ‘지역 화해와 협의’ 예산을 확인하세요.","policy":"cohesion"},
 gradual:{"story":"남북 정부는 수년간 준비한 끝에 통일을 이뤘습니다. 개성의 공장과 파주의 운송시설은 비교적 안정적으로 운영되고 있습니다. 새 정부는 주민에게 연금과 생계비를 지원하기로 약속했지만, 준비 과정에서 이미 많은 돈을 빌렸습니다. 당신이 취임하자 지원금 지급일이 돌아왔고, 국회는 정부에 필요한 돈을 어떻게 마련할지 설명하라고 요구합니다.","focus":"첫 사건에서는 약속한 지원금을 언제, 얼마나 지급할지 결정해야 합니다. 이후 재정 화면에서 세입과 지출을 비교하세요. 세입은 정부가 거두는 돈이며, 적자는 지출이 세입보다 많은 금액입니다. 정부는 부족한 돈을 빌리므로 적자가 나면 부채가 늘어납니다.","policy":"income"},
 war:{"story":"전쟁이 끝난 뒤 남북 지역을 함께 관리할 정부가 세워졌고, 당신이 대통령으로 취임했습니다. 원산의 일부 무장 경비대는 새 정부의 명령을 거부하고 있습니다. 경비대가 검문소에서 구호 차량을 세워 둔 탓에 주민들은 식량을 받지 못하고 있습니다. 청진의 공장에는 전기가 부족하고, 회령의 임시주거지에는 안전한 식수가 부족합니다.","focus":"첫 사건에서는 경비대와 협상할지, 주민에게 구호품을 먼저 보낼지 결정합니다. 이후 국방부의 ‘군 통합과 전역 지원’, 국토교통부의 ‘전력과 주택 재건’ 예산을 확인하세요. 게임에서 군 불복종 위험이 85 이상으로 두 턴 이어지면 일부 군인이 정부를 무너뜨리려는 쿠데타를 시도합니다.","policy":"security"}
};
for(const c of G.scenarios)c.desc=briefings[c.id].story;
// These explanations describe the fictional game rules, not real legal standards.
const contexts={
 vacuum:["담당 공무원이 주민의 거주 기록을 확인하지 못해 식량과 지원금을 지급하지 못하고 있습니다. 정부가 지원 예산을 마련해도 시청이 업무를 처리하지 못하면 주민들은 지원을 받을 수 없습니다.","대통령은 공무원 급여를 지급하고 인력을 보낼지, 주민위원회와 시청 업무를 나누어 맡을지 결정해야 합니다. 기존 부처의 처리를 기다리면 정치력을 아낄 수 있지만, 주민들은 그동안 지원을 받지 못합니다.","admin"],
 autonomy:["개성과 파주의 행정기관이 운송업체에 서로 다른 통행증을 요구하고 있습니다. 운송업체는 두 기관의 허가를 모두 받지 못해 화물차를 출발시키지 못하고 있습니다. 그동안 창고에는 배송하지 못한 화물이 쌓이고 있습니다.","대통령은 두 기관과 협상해 허가 절차를 통일할지, 중앙정부가 허가 업무를 직접 맡을지 결정해야 합니다. 중앙정부가 협상 없이 권한을 가져오면 지방정부와 주민이 반발할 수 있습니다.","cohesion"],
 promise:["정부가 약속한 연금과 생계비를 지급하려면 현재 예산보다 많은 돈이 필요합니다. 정부는 국채를 발행해 투자자에게 돈을 빌릴 수 있지만, 나중에 원금과 이자를 갚아야 합니다.","대통령은 지원금을 전액 지급할지, 주민과 합의해 나누어 지급할지, 지급을 중단할지 결정해야 합니다. 지급을 줄이면 정부 지출은 감소하지만 지원금을 기다리던 주민들이 반발합니다.","income"],
 ceasefire:["원산 경비대는 정부가 급여와 전역 후 생계 대책을 보장하기 전까지 새 지휘관의 명령을 따르지 않겠다고 밝혔습니다. 경비대는 검문소에서 구호 차량도 통과시키지 않고 있습니다.","대통령은 경비대와 협상해 복귀를 유도할지, 민간 구호를 먼저 지원할지 결정해야 합니다. 정부가 대응을 미루면 경비대의 불복종과 주민의 식량 부족이 더 심해집니다.","security"],
 disease:["급수시설이 고장 난 뒤 주민들이 안전한 물을 구하지 못하고 있습니다. 보건소는 같은 지역에서 비슷한 증상의 환자가 늘었다고 보고했습니다. 의료진이 환자를 치료하더라도 주민들이 오염된 물을 계속 마시면 감염이 다시 발생할 수 있습니다.","대통령은 의료진과 식수를 직접 지원할지, 국제기구의 도움을 받을지 결정해야 합니다. 사건을 처리한 뒤에도 의료와 방역 예산, 상수도를 복구하는 재건 예산을 확인하세요.","health"],
 blackout:["정전 때문에 공장은 제품을 만들지 못하고 병원은 의료장비를 사용하기 어렵습니다. 수도시설의 펌프도 전기가 필요하므로 정전이 길어지면 주민들이 물을 공급받지 못할 수 있습니다.","대통령은 변전시설을 복구할지, 주변국에서 전기를 살지, 공장 가동을 줄일지 결정해야 합니다. 공장 가동을 줄이면 전력 사용량은 감소하지만 노동자들이 일자리를 잃을 수 있습니다.","rebuild"],
 food:["항만 운영기관이 곡물을 내리는 일정과 운송업체의 차량 배차 일정을 맞추지 못했습니다. 운송업체가 곡물을 제분공장으로 보내지 못하면서 평양의 밀가루 공급이 줄고 있습니다.","대통령은 정부 예산으로 식량 수송을 지원할지, 국제 구호를 요청할지, 남은 식량의 배급량을 줄일지 결정해야 합니다. 배급량을 줄이면 주민들이 받는 식량도 줄어듭니다.","welfare"],
 unrest:["주민들은 정부가 생활비 지원이나 주거 문제를 해결하지 못했다며 시위에 나섰습니다. 경찰이 시위대를 해산해도 주민들의 생활이 나아지지 않으면 시위가 다시 일어날 수 있습니다.","대통령은 주민 대표와 협상할지, 일자리와 생활비를 지원할지, 경찰을 투입할지 결정해야 합니다. 각 선택에 필요한 정치력과 예산, 주민 신뢰의 변화를 비교하세요.","training"],
 military:["원산 경비대의 일부 인원이 새 급여 명단에서 빠졌습니다. 이들은 정부가 군인 신분과 급여를 보장하기 전까지 새 지휘관의 명령을 따르지 않겠다고 밝혔습니다.","대통령은 급여를 보장하며 협상할지, 지휘관을 강제로 교체할지 결정해야 합니다. 군 불복종 위험이 85 이상으로 두 턴 이어지면 일부 군인이 쿠데타를 시도합니다.","security"],
 coup:["새 정부에 반대하는 일부 군인이 대통령의 퇴진을 요구하고 있습니다. 군의 지휘체계가 갈라지면 정부는 행정기관과 주민을 보호하기 어려워집니다. 이번에는 장기적인 예산 조정보다 당장 쿠데타를 막을 결정이 필요합니다.","대통령은 아래 대응안 가운데 하나를 선택해야 합니다. 군과 정치세력을 설득할지, 군의 요구를 받아들일지 결정하세요. 사임을 선택하면 대통령이 물러나면서 게임이 즉시 끝납니다.","security"],
 corruption:["항만 담당자가 같은 장비의 비용을 두 번 청구한 계약서를 발견했습니다. 정부는 예산을 지급했지만 현장에는 필요한 장비가 도착하지 않았습니다. 누군가 복구비를 빼돌렸을 가능성이 있습니다.","대통령은 감사관에게 계약과 지급 내역을 조사하게 할지, 사업 담당자를 교체할지 결정해야 합니다. 조사를 미루면 나중에 언론이 계약 자료를 공개하는 사건이 발생합니다.","admin"],
 credit:["투자자들이 정부의 상환 능력을 의심해 국채를 사지 않고 있습니다. 정부가 돈을 빌리지 못하면 예정된 복구비를 지급하기 어렵습니다. 높은 이자를 약속하면 돈을 빌릴 수 있지만 이후 이자 지출이 늘어납니다.","대통령은 재건 예산을 줄일지, 다른 나라에 상환 보증을 요청할지, 높은 이자로 다시 돈을 빌릴지 결정해야 합니다. 예산을 줄이면 복구가 늦어지고, 대출을 늘리면 부채 부담이 커집니다.","income"],
 property:["과거 공장 운영기업과 현재 거주민이 같은 부지에 대한 권리를 주장하고 있습니다. 새 행정기관도 해당 부지를 사용할 권한이 있다고 주장합니다. 정부가 공장 재가동부터 허가하면 주민들은 거처를 잃을 수 있습니다.","대통령은 주민에게 보상할지, 각자의 권리를 조사할지, 공사부터 허가할지 결정해야 합니다. 권리 조정을 기다리면 주민을 보호할 수 있지만 공장 재가동과 채용은 늦어집니다.","cohesion"],
 resettle:["개성에서 파주로 이동한 가족들이 머물 임시 숙소가 부족합니다. 파주시는 이들을 혼자 수용하기 어렵다며 서울시와 인천시에 주택과 행정 인력을 지원해 달라고 요청했습니다.","대통령은 주거와 취업 지원에 예산을 쓸지, 여러 지방자치단체가 주민을 나누어 수용하도록 협의할지 결정해야 합니다. 이동을 제한하면 당장 드는 비용은 줄지만 주민들이 정부를 불신하게 됩니다.","welfare"],
 rights:["국회가 앞선 시위 진압 과정에서 경찰이 주민에게 과도한 힘을 사용했는지 조사하고 있습니다. 시위가 끝났더라도 정부는 진압 과정에서 발생한 피해에 답해야 합니다.","대통령은 현장 자료를 공개하고 피해자를 지원할지, 경찰의 조치를 옹호할지 결정해야 합니다. 조사를 거부하면 국내외에서 정부를 신뢰하는 정도가 낮아질 수 있습니다.","cohesion"],
 leak:["언론이 정부가 조사를 미뤘던 남포항 복구 계약서를 입수했습니다. 기자들은 정부가 지급한 금액과 실제 장비 가격이 맞지 않는다고 보도했습니다. 국회는 담당자가 왜 조사를 늦췄는지도 조사하려 합니다.","대통령은 특별 감사를 받아들여 계약을 조사할지, 보도 내용을 부인할지 결정해야 합니다. 정부가 자료를 공개하지 않으면 주민들은 정부의 설명을 더 의심하게 됩니다.","admin"],
 energy:["정부는 앞선 정전 때 주변국에서 전기를 사 왔습니다. 이제 전력 공급국이 가격을 올리겠다고 통보했습니다. 정부가 새 계약을 거부하면 청진의 공장은 전기를 공급받지 못할 수 있습니다.","대통령은 인상된 가격으로 전기를 계속 살지, 국내 발전시설 복구에 예산을 쓸지, 계약을 끝낼지 결정해야 합니다. 국내 시설을 고치는 동안에도 공장에 필요한 전기를 확보해야 합니다.","rebuild"],
 aid:["국제 재건기금이 항만과 급수시설 복구비를 지원하겠다고 제안했습니다. 대신 외부 감사관이 정부의 계약과 지출 내역을 확인할 수 있어야 한다는 조건을 붙였습니다.","대통령은 외부 감사를 받아들이고 보조금을 받을지, 나중에 갚아야 하는 차관을 받을지, 지원을 거절할지 결정해야 합니다. 각 선택이 정부 부채와 복구 사업에 미치는 영향을 확인하세요.","diplomacy"],
 investment:["정부가 전력과 통행 절차를 복구하자 기업들이 개성 공장을 다시 운영하겠다고 제안했습니다. 파주의 운송업체도 화물 운송을 재개하려 합니다. 공장이 문을 열면 주민들이 취업할 수 있습니다.","대통령은 기업에 현지 주민 채용을 요구할지, 허가를 빨리 내주고 보조금을 지급할지 결정해야 합니다. 허가 심사를 줄이면 채용은 빨라지지만 부정한 계약을 걸러내기 어렵습니다.","training"],
 returnees:["해외에서 일하던 의료인과 기술자들이 함흥의 진료소 복구를 돕겠다고 제안했습니다. 이들이 현지에서 일하려면 정부가 자격을 인정하고 머물 집을 마련해야 합니다.","대통령은 정착비와 자격 인정을 지원할지, 이들이 해외에서 원격으로 지역 대학을 돕게 할지 결정해야 합니다. 직접 정착을 지원하면 비용은 더 들지만 현장에서 일할 사람이 늘어납니다.","health"],
 curriculum:["남북 교사들이 공동 교과서를 만들고 있지만 역사 설명과 용어를 통일하지 못했습니다. 학부모들은 학생들이 어떤 내용으로 수업을 받고 시험을 치를지 정해 달라고 요구합니다.","대통령은 교사들이 함께 교과서를 집필하도록 지원할지, 하나의 기준을 즉시 적용할지, 지역별 교육과정을 유지할지 결정해야 합니다. 합의 없이 기준을 정하면 일부 주민들이 반발합니다.","cohesion"],
 op_press:["야당대표가 방송 토론에서 정부의 복구 성과를 따지겠다고 밝혔습니다. 유권자들은 대통령의 답변과 공개된 자료를 보고 정부를 평가합니다. 게임에서는 토론 능력과 정부 발표 신뢰가 설득 성공 확률에 영향을 줍니다.","대통령은 실무진이 자료를 설명하게 할지, 직접 토론에 참석할지, 참석을 거절할지 결정해야 합니다. 직접 토론하는 안은 실패할 수도 있으므로 선택지의 성공 확률을 확인하세요.","political"],
 op_legislative:["야당이 정부 예산을 감시할 권한을 요구하며 표결 일정에 합의하지 않고 있습니다. 정부가 야당의 협조를 얻지 못하면 정책을 변경할 때 더 많은 정치력을 써야 합니다.","대통령은 야당과 감시 권한을 나눌지, 청문회에서 의원들을 설득할지, 합의 없이 정책 변경을 추진할지 결정해야 합니다.","political"],
 op_audit:["야당 의원들이 정부가 지급한 복구비와 현장에 도착한 장비를 대조하려 합니다. 계약서를 확인하면 부정한 지출을 찾을 수 있지만 정부의 잘못도 드러날 수 있습니다.","대통령은 독립 감사관에게 조사를 맡길지, 여야 공동위원회를 만들지, 자료 공개를 미룰지 결정해야 합니다. 공개를 미루면 정부 발표 신뢰가 낮아지고 후속 보도가 나옵니다.","admin"],
 op_protest:["야당대표가 급여와 생활비 지원을 요구하는 노동자 집회에 참석했습니다. 노동자들은 정부에 지원을 요구하고, 야당은 정부의 대응을 비판하며 지지자를 모으고 있습니다.","대통령은 주민 대표와 협상할지, 생계비를 지급할지, 경찰로 집회를 해산할지 결정해야 합니다. 협상으로 시위를 줄이더라도 야당이 자신의 성과라고 홍보할 수 있습니다.","welfare"],
 op_tax:["야당이 소득세를 낮추겠다고 공약했습니다. 주민들은 세금을 덜 내게 되지만 정부는 그만큼 복구 사업에 쓸 돈을 덜 거두게 됩니다.","대통령은 세금 사용처를 설명하며 현재 세율을 유지할지, 소득세를 낮출지 결정해야 합니다. 세율을 내리면 다음 턴 세입이 줄어드므로 재정 화면에서 예상 적자를 확인하세요.","income"],
 op_diplomacy:["야당이 국제회의에서 원조 조건과 주민 권리 문제를 제기했습니다. 지원국들은 정부가 이에 어떻게 답하는지 지켜보고 있습니다.","대통령은 야당과 공동 외교단을 구성할지, 원조 협약을 공개할지, 야당을 비판할지 결정해야 합니다. 공동 외교단은 정부의 협상을 돕지만 야당의 신뢰도 함께 높입니다.","diplomacy"],
 press_viral:["누군가 대통령 발언의 앞뒤를 잘라 영상으로 퍼뜨렸습니다. 영상을 본 일부 주민은 대통령이 자신들의 요구를 무시했다고 생각합니다.","대통령은 원본 영상과 설명 자료를 공개할지, 생방송에서 직접 해명할지, 대응을 미룰지 결정해야 합니다. 정부 발표 신뢰가 낮으면 주민들이 해명을 믿지 않을 수 있습니다.","political"],
 press_follow:["기자들이 정부가 공개를 미뤘던 계약 자료를 입수해 보도했습니다. 주민들은 계약 문제뿐 아니라 정부가 자료를 숨기려 했는지도 의심하고 있습니다.","대통령은 공개가 늦었다는 점을 인정하고 감사에 착수할지, 보도를 정치적 공격이라고 반박할지 결정해야 합니다.","political"],
 op_debate:["선거를 앞두고 대통령과 야당대표가 마지막 TV 토론에 참석했습니다. 유권자들은 정부가 약속한 복구 사업과 실제 성과를 비교하고 있습니다. 이번 사건을 처리하면 게임이 최종 득표율을 계산합니다.","대통령은 사업 실적을 설명할지, 상대 후보와 직접 논쟁할지, 준비한 연설만 할지 결정해야 합니다. 남은 정치력과 각 선택의 성공 확률을 확인하세요.","political"],
 op_shadow:["대통령을 공격하는 영상, 일부만 공개된 문건, 여당 의원들의 표결 불참이 정치적 문제가 되고 있습니다. 야당이 어느 행동을 지시했는지는 아직 확인되지 않았습니다. 이번 공격으로 인한 수치 변화는 이미 적용됐습니다.","대통령은 조사팀에 출처 확인을 맡길지, 확인된 사실을 공개 설명할지, 대응을 미룰지 결정해야 합니다. 조사팀이 야당과의 연계를 입증하지 못할 수도 있습니다.","political"],
 gate_break:["당신이 승인한 비밀 공작을 기록한 대통령실 문건이 공개됐습니다. 주민과 의원들의 지지가 이미 하락했고, 국회는 대통령실의 책임을 조사하려 합니다.","대통령은 책임을 인정하고 독립 조사를 받을지, 공작을 부인할지 결정해야 합니다. 조사에 협조하면 이후 심사에서 유리하지만 이미 확인된 증거가 없어지지는 않습니다.","emergency"],
 gate_hearing:["국회가 대통령실 관계자를 불러 비밀 공작의 경위를 묻는 청문회를 열었습니다. 의원들은 대통령이 공작에 얼마나 관여했는지, 조사에 협조했는지 확인하려 합니다.","대통령은 청문회에 출석해 설명할지, 출석을 거부할지 결정해야 합니다. 게임에서 위법성 증거가 60 이상이면 국회가 탄핵안을 발의할 수 있습니다.","emergency"],
 martial_review:["국회가 대통령에게 계엄을 해제하라고 요구했습니다. 계엄으로 군과 경찰의 통제가 강화됐지만 주민들의 실업, 식량 부족, 주거 문제는 남아 있습니다.","대통령은 계엄을 끝낼지, 국회의 요구를 거부하고 한 턴 더 유지할지 결정해야 합니다. 해제하면 발표 신뢰와 외교 신뢰가 각각 3 높아집니다. 연장하면 위법성 증거가 38 늘어납니다.","emergency"],
 impeachment_motion:["국회가 대통령의 법 위반 책임을 묻는 탄핵안을 표결하려 합니다. 탄핵안이 제출됐다는 이유만으로 대통령이 파면되지는 않습니다. 게임에서는 의원 67% 이상이 찬성해야 대통령의 직무가 정지됩니다.","대통령은 정치력 3을 써서 의원들을 설득할지, 추가 설득 없이 표결을 받을지 결정해야 합니다. 설득하면 탄핵에 찬성할 것으로 예상되는 의원 비율이 12%p 낮아집니다.","emergency"],
 impeachment_review:["국회가 탄핵안을 통과시켜 대통령은 현재 직무를 수행할 수 없습니다. 심사기관은 대통령의 법 위반 증거와 조사 협조 정도를 검토합니다. 게임은 위법성 증거에서 조사 협조를 뺀 값을 심사 점수로 계산합니다.","대통령은 추가 자료를 제출할지, 현재 기록만으로 심사를 받을지 결정해야 합니다. 자료를 제출하면 심사 점수가 10 낮아집니다. 최종 점수가 60 이상이면 대통령이 파면되면서 게임이 끝납니다.","emergency"]
};
const terms={
 autonomy:[["통행증","행정기관이 차량의 통과를 허가했다는 증명서입니다."],["자치권","지방정부가 지역의 일을 스스로 결정할 권한입니다."]],
 promise:[["국채","정부가 돈을 빌리면서 원금과 이자를 갚겠다고 약속하는 증서입니다."]],
 credit:[["국채 입찰","투자자들이 정부에 빌려줄 금액과 원하는 이자율을 제시하는 절차입니다."],["상환 보증","정부가 빚을 갚지 못할 때 다른 나라나 기관이 대신 갚겠다는 약속입니다."]],
 corruption:[["감사","공공기관이 규정에 맞게 업무를 처리하고 예산을 썼는지 조사하는 절차입니다."]],
 leak:[["특별 감사","특정한 의혹을 조사하기 위해 별도로 실시하는 감사입니다."]],
 aid:[["보조금","정해진 목적에 맞게 쓰면 원칙적으로 갚지 않아도 되는 지원금입니다."],["차관","다른 나라나 국제기구에서 빌려 나중에 갚아야 하는 돈입니다."]],
 op_legislative:[["보이콧","상대에게 요구를 받아들이게 하려고 회의나 표결 참여를 거부하는 행동입니다."]],
 op_audit:[["독립 감사","사업을 담당한 부처와 별도의 조사자가 예산 사용을 확인하는 절차입니다."]],
 gate_break:[["게이트","권력자가 연루된 비리나 불법 행위가 드러나 큰 논란이 된 사건입니다."]],
 gate_hearing:[["청문회","국회가 관계자를 불러 질문하고 증언과 자료를 확인하는 공개 회의입니다."]],
 martial_review:[["계엄","대통령이 비상사태를 이유로 군에 치안 등의 특별한 권한을 맡기는 조치입니다."]],
 impeachment_motion:[["탄핵안 발의","국회에서 대통령 등의 법 위반 책임을 심사하자고 정식으로 제안하는 일입니다."],["직무 정지","자리를 곧바로 잃는 것은 아니지만 권한을 행사할 수 없는 상태입니다."]],
 impeachment_review:[["파면","책임을 물어 공직에서 물러나게 하는 결정입니다."]]
};
const choiceTitles={
 "vacuum": {
  "staff": "공무원 급여를 지급하고 인력을 보낸다",
  "council": "주민위원회와 시청 업무를 나누어 맡는다",
  "wait": "기존 부처가 업무를 처리할 때까지 기다린다"
 },
 "autonomy": {
  "pact": "통행 허가와 비용 분담을 협의한다",
  "central": "중앙정부가 허가와 운송 업무를 맡는다",
  "wait": "두 기관이 합의할 때까지 기다린다"
 },
 "promise": {
  "pay": "약속한 지원금을 전액 지급한다",
  "phase": "지원 대상자와 나누어 지급하기로 합의한다",
  "freeze": "지원금 지급을 일시 중단한다"
 },
 "ceasefire": {
  "join": "경비대에 급여를 보장하고 복귀를 협상한다",
  "relief": "주민에게 구호품과 임시 거처를 먼저 지원한다"
 },
 "disease": {
  "clinic": "이동 진료소를 보내고 식수를 지원한다",
  "international": "국제 의료단의 도움을 받는다",
  "wait": "추가 지원 없이 현재 의료 예산으로 대응한다"
 },
 "military": {
  "pay": "군인의 급여와 전역 후 생계를 지원한다",
  "mediate": "국회와 함께 경비대의 복귀를 협상한다",
  "ultimatum": "복귀를 명령하고 지휘관을 교체한다"
 },
 "coup": {
  "unity": "국회와 정부를 지지하는 부대가 함께 대응한다",
  "concede": "군인의 급여와 복지를 보장해 복귀를 유도한다",
  "resign": "유혈 충돌을 피하기 위해 대통령이 사임한다"
 },
 "blackout": {
  "repair": "고장 난 변전소를 긴급 복구한다",
  "import": "주변국에서 전기를 수입한다",
  "ration": "공장 가동을 줄이고 지역별로 번갈아 전기를 끊는다"
 },
 "food": {
  "relief": "정부가 급식과 식량 운송을 지원한다",
  "trade": "국제 구호단체가 식량을 보내도록 허용한다",
  "ration": "식량을 오래 쓰기 위해 주민 배급량을 줄인다"
 },
 "unrest": {
  "talk": "노동자, 기업, 주민 대표와 협상한다",
  "jobs": "임시 일자리와 생계비를 지원한다",
  "force": "경찰을 투입해 시위대를 해산한다"
 },
 "corruption": {
  "audit": "외부 감사관에게 조사를 맡기고 계약을 공개한다",
  "replace": "담당자를 바꾸고 공사 업체를 다시 선정한다"
 },
 "credit": {
  "cut": "재건 예산을 한 단계 줄여 지출을 낮춘다",
  "guarantee": "국제기구에 대출과 상환 보증을 요청한다",
  "roll": "높은 이자로 다시 돈을 빌려 기존 빚을 갚는다"
 },
 "property": {
  "compensate": "주민의 임시 거주를 허용하고 보상한다",
  "panel": "지역 합의기구에 토지 권리 조정을 맡긴다",
  "build": "공익사업으로 지정해 공사를 먼저 시작한다",
  "defer": "토지 권리 조사와 공사를 모두 미룬다"
 },
 "resettle": {
  "housing": "여러 지역의 주택과 일자리를 지원한다",
  "local": "지방자치단체들이 정착 지원을 나누어 맡는다",
  "limit": "주민 이동을 제한하고 개성으로 돌아가도록 권한다"
 },
 "rights": {
  "open": "독립 조사를 받고 피해자를 지원한다",
  "defend": "정부의 시위 진압이 정당했다고 주장한다"
 },
 "leak": {
  "admit": "정부의 책임을 인정하고 특별 감사를 받는다",
  "deny": "공개된 문건을 믿을 수 없다고 반박한다"
 },
 "energy": {
  "renew": "오른 가격으로 전력 수입을 계속한다",
  "domestic": "국내 전력시설을 복구해 수입을 줄인다",
  "end": "전력 수입 계약을 끝낸다"
 },
 "aid": {
  "transparent": "외부 감사를 받아들이고 보조금을 받는다",
  "loan": "복구비를 빌리고 나중에 갚기로 한다",
  "decline": "정부의 결정권을 지키기 위해 지원을 거절한다"
 },
 "investment": {
  "local": "현지 주민을 채용하는 조건으로 투자를 받는다",
  "fast": "기업에 허가를 빨리 내주고 보조금을 지급한다",
  "wait": "공개 심사를 먼저 하고 투자는 나중에 받는다"
 },
 "returnees": {
  "settle": "해외 자격을 인정하고 정착비를 지원한다",
  "mentor": "전문가들이 원격으로 지역 대학을 돕게 한다"
 },
 "curriculum": {
  "common": "남북 교사가 함께 교과서를 쓰고 단계적으로 바꾼다",
  "uniform": "모든 지역에 같은 교육 기준을 바로 적용한다",
  "regional": "각 지역의 교육과정을 유지한다"
 },
 "op_legislative": {
  "deal": "야당과 예산 감시 권한을 나누고 표결에 합의한다",
  "hearing": "공개 청문회에서 의원들에게 예산안을 설명한다",
  "defer": "야당과 합의하지 않고 정책을 바꾼다"
 },
 "op_audit": {
  "audit": "독립 감사를 받고 계약서 원본을 공개한다",
  "joint": "여야 의원이 함께 조사할 위원회를 만든다",
  "delay": "조사 중이라는 이유로 자료 공개를 미룬다"
 },
 "op_protest": {
  "talk": "시민 대표와 공개적으로 협상한다",
  "relief": "주민에게 임시 생계비를 바로 지급한다",
  "force": "경찰을 투입해 집회를 해산한다"
 },
 "op_diplomacy": {
  "joint": "여야가 함께 참여하는 외교단을 만든다",
  "publish": "원조 조건과 주민 권리 보호 대책을 공개한다",
  "attack": "야당이 국가의 이익을 해친다고 비판한다"
 },
 "press_viral": {
  "original": "원본 영상을 공개하고 사실관계를 설명한다",
  "interview": "생방송에 출연해 직접 해명한다",
  "ignore": "영상에 대한 관심이 줄 때까지 기다린다"
 },
 "op_shadow": {
  "trace": "조사팀에 정치적 공격의 출처를 확인하게 한다",
  "brief": "정부가 확인한 사실을 공개적으로 설명한다"
 },
 "gate_break": {
  "disclose": "대통령실의 책임을 인정하고 독립 조사를 받는다",
  "deny": "야당의 정치적 공격이라며 공작을 부인한다"
 },
 "gate_hearing": {
  "testify": "청문회에 출석해 책임과 재발 방지책을 설명한다",
  "refuse": "청문회 출석을 거부한다"
 },
 "impeachment_review": {
  "defense": "자료를 제출하고 심사에 협조한다",
  "review": "추가 자료 없이 현재 기록으로 심사를 받는다"
 }
};
for(const [id,titles] of Object.entries(choiceTitles))for(const o of G.events[id].options)if(titles[o.id])o.title=titles[o.id];
function eventExplanation(s){const e=G.events[s.pending?.id];if(!e)return null;const x=contexts[s.pending.id]||['현장에서 발생한 문제가 정부의 예산과 신뢰에 영향을 주고 있습니다.','선택지의 즉시 효과와 이후 부담을 비교한 뒤 결재하세요.','admin'];let meaning=x[0];if(s.pending.id==='op_shadow'){const op=s.presidency.opponentOps.filter(o=>o.turn<=s.turn).at(-1);const detail={spin:'누군가 대통령을 공격하는 영상을 인터넷에 퍼뜨렸습니다. 영상이 확산되면서 국민 지지와 정부 발표 신뢰가 낮아졌습니다.',deal:'여당 의원들이 같은 날 국회 표결에 불참하겠다고 밝혔습니다. 정부에 협조하는 의원이 줄고 야당의 영향력이 커졌습니다.',leak:'누군가 정부 문건의 일부만 여러 언론사에 전달했습니다. 문건을 접한 주민들이 정부의 설명을 의심하면서 정부 발표 신뢰가 낮아졌습니다.'}[op?.kind];if(detail)meaning=detail+' 야당이 이 행동을 지시했는지는 아직 확인되지 않았습니다. 이번 공격으로 인한 수치 변화는 이미 적용됐습니다.';}return {meaning,decision:x[1],target:x[2],terms:terms[s.pending.id]||[]};}
function completeAdvice(a,situation,recommendation,tradeoff,target,priority){return {...a,situation,recommendation,tradeoff,target,priority,text:situation+' '+recommendation+' '+tradeoff};}
function policyAdvice(s,a,id,situation,why,priority,missionId){
 const i=G.policies.findIndex(p=>p.id===id),p=G.policies[i],left=G.termLimit(s)-s.turn,cost=G.policyCost(s,i,Math.min(4,s.levels[i]+1)),delay=G.delay(s,i);
 const task=s.council.tasks.find(t=>t.adviser===a.id),mission=G.adviserMissions[a.id]?.find(m=>m.id===missionId);
 const change=p.tax?'세율을':'사업 예산을';
 let action,trade;
 if(s.presidency.impeachment.stage==='review')return completeAdvice(a,situation,'대통령님의 직무가 정지되어 예산을 바꾸거나 참모에게 새 임무를 지시할 수 없습니다. 먼저 탄핵 심사에서 제출할 자료를 결정하십시오.','심사 점수가 60 미만이어야 대통령님이 직무에 복귀할 수 있습니다.','emergency',priority);
 if(s.phase==='ended')return completeAdvice(a,situation,'임기가 끝났습니다. 국정 기록을 열어 어떤 결정이 현재 결과를 만들었는지 확인하십시오.','다음 게임에서는 관련 정책을 일찍 바꾸면 위험이 커지는 것을 줄일 수 있습니다.','history',priority);
 if(s.levels[i]>=4){action='‘'+p.name+'’ 정책은 이미 최대 단계입니다. 현재 단계를 유지하고 참모가 수행할 수 있는 현장 임무를 확인하십시오.';trade='정부는 이 정책의 '+change+' 더 높일 수 없습니다.';}
 else if(s.remaining[i]>0){action='정부가 바꾼 ‘'+p.name+'’ 정책의 효과가 아직 반영되는 중입니다. 앞으로 '+s.remaining[i]+'턴이 더 필요하므로, 다시 바꾸기 전에 집행 결과를 확인하십시오.';trade='정부는 현재 정한 예산을 매 턴 지출하지만, 주민들은 정책 효과를 여러 턴에 걸쳐 받습니다.';}
 else if(delay>left){action='‘'+p.name+'’ 정책의 효과가 모두 나타나려면 '+delay+'턴이 필요한데 임기는 '+left+'턴 남았습니다. 당장 처리할 사건과 다음 턴에 완료되는 참모 임무부터 확인하십시오.';trade='지금 정책을 바꾸더라도 선거 전에 효과가 모두 나타나지는 않습니다.';}
 else if(cost>s.pp){action='대통령님이 ‘'+p.name+'’ 정책의 단계를 올리려면 정치력 '+cost+'점이 필요하지만 지금은 '+s.pp+'점만 있습니다. 아직 사용하지 않은 고유 행동으로 정치력을 얻을 수 있는지 확인하십시오.';trade='정치력은 정책을 바꾸고 사건에 대응할 때 쓰는 행동 점수입니다. 예산이 충분해도 정치력이 부족하면 이 결정을 할 수 없습니다.';}
 else{action='대통령님은 ‘'+p.name+'’ 정책의 '+change+' 한 단계 올리는 안을 검토하십시오. '+why;trade='이 변경에는 정치력 '+cost+'점이 필요합니다. '+(p.tax?'정부가 거두는 세금은 늘지만, 세금을 더 내는 주민들의 지지가 낮아질 수 있습니다.':'정부가 매 턴 지출하는 돈이 늘어나므로 적자와 부채가 커질 수 있습니다.')+' 정책 효과는 '+delay+'턴에 걸쳐 나타납니다.';}
 if(task)trade+=' 저는 현재 '+G.adviserMissions[a.id].find(x=>x.id===task.action).place+'에서 임무를 수행 중이며 '+Math.max(1,task.due-s.turn)+'턴 뒤에 결과를 보고하겠습니다.';
 else if(mission&&!G.adviserBlocked(s,a.id,mission.id)){trade+=' 제게 ‘'+mission.name+'’ 임무를 지시하실 수도 있습니다. 다음 턴 효과는 '+mission.effect+'이며, 정부가 감수할 비용은 '+mission.trade+'입니다.';}
 return completeAdvice(a,situation,action,trade,id,priority);
}
function advice(s){if(s.phase==='setup')return [];const m=G.metrics(s),v=G.votes(s),p=s.presidency,f=G.finance(s);return G.advisers.map(a=>{
 if(a.id==='marshall'){
  if(p.martial.active)return completeAdvice(a,'대통령님이 계엄을 선포해 군과 경찰이 비상 통제를 시행하고 있습니다. 그러나 계엄만으로 주민들의 생활 문제를 해결할 수는 없습니다.','상단 ‘계엄’ 메뉴에서 해제를 검토하십시오. 다음 턴에는 국회가 대통령님에게 계엄 해제를 요구합니다.','대통령님이 연장하면 위법성 증거가 38 늘어납니다. 해제하더라도 국회는 계엄 중 정부가 한 조치의 책임을 계속 물을 수 있습니다.','emergency',120);
  const military=s.risk.military>=s.risk.blackout;
  return policyAdvice(s,a,military?'security':'rebuild',military?'군 불복종 위험은 '+round(s.risk.military)+'입니다. 정부가 군인들의 급여와 전역 후 지원을 정하지 못하면 일부 군인이 새 지휘관의 명령을 거부할 수 있습니다.':'전력 붕괴 위험은 '+round(s.risk.blackout)+'입니다. 정전이 발생하면 기업은 공장을 가동하지 못하고 병원은 의료장비를 사용하기 어렵습니다.',military?'정부가 급여와 전역 후 생계를 지원하면 군인들이 새 지휘체계를 받아들이기 쉬워집니다.':'정부가 전력과 주택을 복구하면 기업은 생산을 재개하고 주민들은 안전한 집과 식수를 확보할 수 있습니다.',Math.max(s.risk.military,s.risk.blackout),military?'integration':'corridor');
 }
 if(a.id==='nightingale'){
  const food=s.risk.food>s.risk.disease;
  if(Math.max(s.risk.food,s.risk.disease)<35)return completeAdvice(a,'현재 감염병 위험은 '+round(s.risk.disease)+', 식량 부족 위험은 '+round(s.risk.food)+'입니다. 두 수치 모두 당장 긴급 대응이 필요한 수준은 아닙니다.','정부는 현재 의료와 생계 지원 예산을 유지하고, 대통령님은 더 높은 위험을 줄이는 데 정치력을 먼저 쓰십시오.','정부가 지원을 갑자기 줄이면 주민들이 진료나 식량을 구하기 어려워져 위험이 다시 높아질 수 있습니다.','health',Math.max(s.risk.food,s.risk.disease));
  return policyAdvice(s,a,food?'welfare':'health',food?'식량 부족 위험은 '+round(s.risk.food)+'입니다. 주민들은 식량을 살 돈이 부족하거나, 운송이 늦어져 배급을 받지 못할 수 있습니다.':'감염병 위험은 '+round(s.risk.disease)+'이고 의료 대응력은 '+round(m.health)+'입니다. 의료진이 환자를 치료해도 주민들이 오염된 물을 마시거나 과밀한 숙소에서 지내면 감염이 다시 발생할 수 있습니다.',food?'정부가 생계비를 지원하면 주민들이 식량을 구할 수 있어 식량 부족과 시위 위험을 함께 낮출 수 있습니다.':'보건복지부는 진료와 방역을 담당하고, 국토교통부는 상수도와 주거시설을 복구해야 합니다. 두 사업을 함께 확인하십시오.',Math.max(s.risk.food,s.risk.disease)+4,food?'clinics':'water');
 }
 if(a.id==='keynes'){
  if(s.risk.credit>=65||f.deficit>=5)return policyAdvice(s,a,'income','현재 예산대로 집행하면 다음 턴에 '+(f.deficit>=0?fmt(f.deficit)+'조의 적자가':fmt(-f.deficit)+'조의 흑자가')+' 예상됩니다. 정부가 갚아야 할 부채는 '+fmt(s.debt)+'조입니다. 신용 위험은 '+round(s.risk.credit)+'이며, 75 이상이면 투자자들이 더 높은 이자를 요구합니다.','세율을 높이면 정부가 사업비를 마련할 수 있습니다. 주민들에게 세금을 어디에 쓸지도 설명해야 합니다.',Math.max(s.risk.credit,70),'bonds');
  return policyAdvice(s,a,'training','실업률은 '+fmt(m.jobs)+'%입니다. 정부가 주민들의 취업을 돕지 못하면 더 많은 가구가 생계비 지원에 의존하게 됩니다.','정부가 주민과 전역 군인에게 직업 교육을 제공하면 이들이 일자리를 구할 수 있어 실업과 빈곤을 줄일 수 있습니다.',m.jobs*2.5,'jobs');
 }
 if(p.impeachment.stage==='review')return completeAdvice(a,'국회가 탄핵안을 통과시켜 대통령님의 직무가 정지됐습니다. 게임이 계산한 현재 심사 점수는 '+G.courtScore(s)+'입니다.','탄핵 심사에서 추가 자료를 제출하는 안을 검토하십시오. 제출하면 심사 점수가 '+G.courtScore(s,true)+'로 낮아집니다.','최종 점수가 60 이상이면 심사기관이 대통령님을 파면합니다. 이 심사는 지지율이 아니라 법 위반 증거와 조사 협조를 기준으로 합니다.','emergency',140);
 if(p.evidence>=40||s.pending?.id==='impeachment_motion')return completeAdvice(a,'대통령님의 위법성 증거는 '+p.evidence+'입니다. 현재 탄핵 표결이 열리면 의원 '+G.motionVotes(s)+'%가 찬성할 것으로 예상됩니다. 67% 이상이 찬성하면 탄핵안이 통과됩니다.','새로운 비밀 공작을 승인하지 마시고, 조사가 열리면 자료 제출과 출석에 협조하십시오. 탄핵 표결에서는 정치력 3점으로 의원들을 설득해 찬성 비율을 12%p 낮출 수 있습니다.','심사기관은 조사 협조를 유리한 사정으로 고려하지만, 이미 확인된 법 위반 증거를 없애 주지는 않습니다.','emergency',130);
 if(v.all<35||s.mediaTrust<40)return completeAdvice(a,'국민 지지율은 '+fmt(v.all)+'%이고 정부 발표 신뢰는 '+round(s.mediaTrust)+'입니다. 정부가 해명하더라도 주민들이 그 설명을 믿지 않을 수 있습니다.','정치 메뉴에서 ‘자료 공개 브리핑’을 검토하십시오. 정부가 확인된 자료를 설명하면 정치력 2점을 쓰고 발표 신뢰를 8, 국민 지지 계산에 더하는 값을 1 높입니다.','대통령님은 이번 턴에 정치 행동을 한 번만 할 수 있습니다. 게임에서는 지지율이 30% 미만으로 두 턴 이어지면 국회가 탄핵안을 발의합니다.','political',110);
 return completeAdvice(a,'의회 협조는 '+round(v.assembly)+'입니다. 이 수치는 의원들이 정부의 정책에 얼마나 협조하는지를 나타냅니다. 협조가 높아지면 대통령님이 정책을 바꾸는 데 필요한 정치력이 줄어듭니다.','제게 ‘여의도 초당적 합의’를 지시하시면 여야 의원들과 협상해 다음 턴 의회 협조를 9 높이겠습니다. 이번 턴에 바로 높이려면 정치 메뉴의 ‘공개 의회 협상’으로 8을 높일 수 있습니다.','참모 임무에는 정치력 2점, 공개 협상에는 3점이 필요합니다. 정부가 야당에 양보하므로 두 선택 모두 상대 조직력을 3 높입니다. '+(s.council.orderedTurn===s.turn?'다만 대통령님은 이번 턴의 참모 지시를 이미 사용하셨습니다.':''),'political',100-v.assembly);
 }).sort((a,b)=>b.priority-a.priority);}

function eventAlert(s){
 if(!s.pending)return null;
 const e=G.events[s.pending.id];
 if(e.family==='opportunity')return {level:'notice',label:'새 제안 도착',instruction:'정부에 새로운 제안이 접수됐습니다. 조건을 읽고 대응안을 선택하세요.'};
 const critical=['coup','gate_break','martial_review','impeachment_motion','impeachment_review'].includes(s.pending.id)||s.risk[e.family]>=75;
 return {level:critical?'critical':'warning',label:critical?'긴급 상황 발생':'새 사건 발생',instruction:'현장에서 대통령의 결정을 기다리고 있습니다. 보고를 읽고 대응안을 선택하세요.'};
}
const eventPriorities={vacuum:['staff','council','wait'],autonomy:['pact','central','wait'],promise:['phase','pay','freeze'],ceasefire:['join','relief','wait'],disease:['clinic','international','wait'],blackout:['repair','import','ration'],food:['relief','trade','ration'],unrest:['talk','jobs','force','wait'],military:['mediate','pay','ultimatum','wait'],coup:['unity','concede','resign'],corruption:['audit','replace','bury'],credit:['guarantee','cut','roll'],gate_break:['disclose','deny'],gate_hearing:['testify','refuse'],martial_review:['lift','extend'],impeachment_motion:['persuade','vote'],impeachment_review:['defense','review']};
function eventAdvice(s){if(!s.pending)return advice(s)[0];const e=G.events[s.pending.id],x=eventExplanation(s),a=advice(s).find(a=>a.id===({vacuum:'bismarck',autonomy:'bismarck',promise:'keynes',ceasefire:'marshall',coup:'marshall',martial_review:'marshall'})[s.pending.id])||advice(s).find(a=>a.id===({disease:'nightingale',food:'nightingale',blackout:'marshall',military:'marshall',credit:'keynes',unrest:'bismarck',corruption:'bismarck',constitutional:'bismarck',politics:'bismarck',media:'bismarck',intrigue:'bismarck'})[e.family])||advice(s)[0];
 const ranked=(eventPriorities[s.pending.id]||e.options.map(o=>o.id)).map(id=>e.options.find(o=>o.id===id)).filter(Boolean),o=ranked.find(o=>!G.optionAllowed(s,o));
 if(!o)return completeAdvice(a,x.meaning,'지금 정치력으로 가능한 결재안이 없습니다. 아직 사용하지 않은 고유 행동으로 정치력을 확보할 수 있는지 확인하십시오.','상단의 정치력 수치와 각 결재안의 필요 조건을 비교하세요.',x.target,150);
 const c=G.optionCost(s,o),first=ranked[0],fallback=o.id!==first.id;
 const negatives=[...Object.entries(o.risk||{}).filter(([,n])=>n>0).map(([k,n])=>G.names[k]+' +'+n),...Object.entries(o.boost||{}).filter(([k,n])=>['jobs','poverty'].includes(k)?n>0:n<0).map(([k,n])=>G.names[k]+' '+(n>0?'+':'')+n)];
 let trade='이 선택에는 정치력 '+c.pp+'점이 필요합니다. '+(c.cash>0?'정부가 비용을 빌려 조달하므로 부채가 '+fmt(c.cash)+'조 늘어납니다. ':c.cash<0?'정부가 받는 지원금으로 부채가 '+fmt(-c.cash)+'조 줄어듭니다. ':'')+(negatives.length?negatives.join(', ')+'. ':'');
 if(o.follow)trade+='이 선택의 후속 사건이 2턴 뒤 예정됩니다. ';
 if(o.contest)trade+='설득은 실패할 수도 있습니다. ';
 if(o.ending)trade+='이 결정을 승인하면 임기가 즉시 끝납니다. ';
 if(o.presidency)trade+=G.impactText(s,o)+'. ';
 const situation=Object.hasOwn(s.risk,e.family)?G.names[e.family]+' 수치는 '+round(s.risk[e.family])+'입니다. 대통령님이 지금 쓸 수 있는 정치력은 '+s.pp+'점입니다.':['gate_break','gate_hearing','martial_review','impeachment_motion','impeachment_review'].includes(s.pending.id)?'현재 위법성 증거는 '+s.presidency.evidence+'입니다. 탄핵 표결이 열리면 의원 '+G.motionVotes(s)+'%가 찬성할 것으로 예상됩니다. 대통령님의 조사 협조 여부와 추가 위법 행위가 이후 심사에 영향을 줍니다.':'현재 국민 지지율은 '+fmt(G.votes(s).all)+'%이고 정부 발표 신뢰는 '+round(s.mediaTrust)+'입니다. 이번 대응은 이후 협상과 선거에도 영향을 줍니다.';
 const aim=({op_shadow:'조사팀이 야당의 개입을 입증하기 전까지는 확인된 사실과 의혹을 구분해서 설명해야 합니다.',blackout:o.id==='repair'?'국토교통부가 고장 난 변전소와 송전선을 고쳐야 전력 공급을 안정시킬 수 있습니다.':o.id==='import'?'정부가 전기를 수입하면 정전을 빨리 줄일 수 있지만 국내 시설은 별도로 수리해야 합니다.':'정부가 전기 사용을 제한하면 가정과 기업이 당장 사용할 수 있는 전력이 줄어듭니다.',martial_review:'계엄을 해제하면 군과 경찰의 비상 통제를 끝내고 주민 생활과 시설 복구에 집중할 수 있습니다.'})[s.pending.id]||{admin:'담당 공무원이 주민 기록과 사업 신청을 처리할 수 있어야 정부가 식량을 배급하고 복구비를 지급할 수 있습니다.',health:'보건복지부가 환자를 치료하고 주민들에게 안전한 물을 공급해야 감염이 다시 발생하는 것을 줄일 수 있습니다.',welfare:'정부가 주민들에게 식량과 생활비를 지원하면 생활고 때문에 시위에 나서는 주민을 줄일 수 있습니다.',security:'정부가 군인들의 급여와 전역 후 지원을 정해야 이들이 새 지휘관의 명령을 받아들이기 쉬워집니다.',rebuild:'정부가 전기를 수입하면 정전을 빨리 줄일 수 있지만, 국내 시설이 고장 난 문제는 남습니다.',income:'정부가 지금 지급해야 할 돈뿐 아니라 다음 턴에 부족해질 예산도 확인하십시오.',cohesion:'정부가 정책을 빨리 실행하더라도 주민과 지방정부가 반발하면 추가 협상이 필요합니다.',political:'주민들이 정부의 설명을 확인할 수 있도록 원본 자료와 처리 결과를 공개하는 방안을 검토하십시오.',emergency:'국회는 탄핵안 통과 여부를 표결하고, 이후 심사기관은 법 위반 증거와 조사 협조를 검토합니다.'}[x.target]||'즉시 효과와 이후 부담을 함께 보십시오.';
 return {...completeAdvice(a,situation,(fallback?'우선 검토한 안은 '+G.optionAllowed(s,first)+' 조건 때문에 지금 고를 수 없습니다. 가능한 안 중 ':'이번 사건에서는 ')+ '“'+o.title+'” 안을 먼저 검토하십시오. '+aim,trade.trim(),x.target,150),choice:o.id};
}
G.start=(...args)=>({...base.start(...args),tutorial:{step:0,done:false}});
G.restore=v=>{const s=base.restore(v);if(s.phase!=='setup')s.tutorial={step:Math.max(0,Math.min(3,Number.isInteger(v?.tutorial?.step)?v.tutorial.step:0)),done:v?.tutorial?!!v.tutorial.done:true};return s;};
Object.assign(G,{briefings,eventExplanation,eventAdvice,advice,eventAlert});
return G;
}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else install(scope.UnificationGame);
})(globalThis);
