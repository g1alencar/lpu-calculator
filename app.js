const serviceDescriptions = {
  "PLA-001": "Definição de escopo, cronograma, responsabilidades, pontos de contato, requisitos de infra (rede, energia, rack). Essencial para qualquer projeto.",
  "PLA-002": "Análise do ambiente de origem (servidores, volumes, permissões, tipos de arquivos), definição da estratégia e ferramenta de migração. Para ambientes complexos.",
  "INF-001": "Montagem física do equipamento, conexão de energia/rede, verificação HA. Considera 2 técnicos com rack e rede disponíveis.",
  "CFG-001": "Inicialização do ONTAP, configuração de cluster, redes, LIFs, DNS, AutoSupport. Requer ambiente preparado.",
  "CFG-002": "Criação de SVM com integração AD, configuração de CIFS e permissões básicas. AD complexo pode exigir tempo adicional.",
  "CFG-003": "Criação de SVM com exportações NFS para hosts Linux/Unix. LDAP/NIS pode demandar esforço adicional.",
  "CFG-004": "Criação de volumes FlexVol (até 5), thin provisioning. Para até 60TB, pode ser simples.",
  "DOC-001": "Documentação com topologia, rede, volumes e credenciais conforme acordado.",
  "TKT-001": "Sessão para apresentar solução, boas práticas e operação. Não é treinamento oficial NetApp.",
  "MIG-001": "Instalação de Robocopy/XCP, configuração de endpoints. Início da preparação da migração.",
  "MIG-002": "Migração até 10TB: cópia inicial, sincronização, cutover. HSE não inclui tempo de cópia. Até 2 fontes.",
  "MIG-003": "Migração de 10-30TB. Idem MIG-002, para 2 a 4 fontes.",
  "MIG-004": "Migração de 30-60TB. Idem MIG-002, para 5 a 6 fontes.",
  "MIG-HRA": "Para contingências, remediação de problemas complexos, migração de fontes adicionais não previstas, ou se a complexidade superar o pacote básico.",
  "SUP-001": "Suporte remoto (até 8h) nos primeiros 5 dias após go-live. Para garantir estabilidade inicial.",
  "ADV-001": "Configuração de home directories, shadow copies (VSS), FPolicy básico, auditoria básica.",
  "ADV-002": "Integração com LDAP/NIS para mapeamento de usuários, kerberização NFS (se aplicável e ambiente preparado).",
  "ADV-003": "Configuração de relação de SnapMirror para um destino NetApp existente (não inclui instalação do destino). Até 2 volumes.",
  "PM-001": "Acompanhamento dedicado do projeto, comunicação, gestão de cronograma e riscos para projetos com múltiplos componentes ou duração estendida (além do kick-off básico)."
};

const services = [
  {code:"PLA-001",desc:"Kick-off",unit:"Projeto",hours:{gp:4,jr:0,pl:0,sr:0}},
  {code:"PLA-002",desc:"Assessment migração",unit:"Projeto",hours:{gp:2,jr:0,pl:2,sr:4}},
  {code:"PLA-001",desc:"Instalação física",unit:"Chassi",hours:{gp:0,jr:4,pl:0,sr:4}},
  {code:"CFG-001",desc:"Configuração ontap",unit:"Cluster",hours:{gp:0,jr:0,pl:4,sr:4}},
  {code:"CFG-002",desc:"Cifs básico",unit:"SVM",hours:{gp:0,jr:0,pl:4,sr:2}},
  {code:"CFG-003",desc:"NFS básico",unit:"SVM",hours:{gp:0,jr:0,pl:3,sr:1}},
  {code:"CFG-004",desc:"Volumes/Luns",unit:"Cluster",hours:{gp:0,jr:0,pl:3,sr:1}},
  {code:"ADV-001",desc:"Configuração avançada cifs/smb",unit:"Serviço",hours:{gp:0,jr:0,pl:0,sr:6}},
  {code:"ADV-002",desc:"Configuração avançada nfs",unit:"Serviço",hours:{gp:0,jr:0,pl:0,sr:8}},
  {code:"ADV-003",desc:"Configuração de snapmirror",unit:"Serviço",hours:{gp:0,jr:0,pl:0,sr:6}},
  {code:"DOC-001",desc:"Documentação",unit:"Projeto",hours:{gp:1,jr:0,pl:1,sr:2}},
  {code:"TKT-001",desc:"Transferência conhecimento",unit:"Projeto",hours:{gp:1,jr:0,pl:1,sr:2}},
  {code:"MIG-001",desc:"Prep ferramenta",unit:"Projeto",hours:{gp:0,jr:0,pl:2,sr:2}},
  {code:"MIG-002",desc:"Migração ≤10tb",unit:"Pacote",hours:{gp:1,jr:0,pl:10,sr:5}},
  {code:"MIG-003",desc:"Migração 10‑30tb",unit:"Pacote",hours:{gp:1,jr:0,pl:16,sr:7}},
  {code:"MIG-004",desc:"Migração 30‑60tb",unit:"Pacote",hours:{gp:1,jr:0,pl:22,sr:9}},
  {code:"MIG-HRA",desc:"Hora técnica adicional migração",unit:"Hora",hours:{gp:0,jr:0,pl:0,sr:1}},
  {code:"SUP-001",desc:"Suporte inicial",unit:"Pacote",hours:{gp:0,jr:0,pl:2,sr:6}},
  {code:"PM-001",desc:"Gerenciamento projeto pequeno porte",unit:"Pacote",hours:{gp:0,jr:0,pl:0,sr:16}}
];

const profiles = ["gp","jr","pl","sr"];
const bodyTbl = document.getElementById("servicesBody");

// Função para renderizar a tabela de serviços com filtro
function renderServicesTable(filterText = "") {
  bodyTbl.innerHTML = "";
  const ft = filterText.trim().toLowerCase();
  services.forEach(s => {
    if (
      ft === "" ||
      s.code.toLowerCase().includes(ft) ||
      s.desc.toLowerCase().includes(ft)
    ) {
      const tooltip = serviceDescriptions[s.code] || s.desc;
      bodyTbl.insertAdjacentHTML("beforeend",
        `<tr>
          <td>${s.code}</td>
          <td title="${tooltip}"><strong>${s.desc}</strong><br><small>${tooltip}</small></td>
          <td>${s.unit}</td>
          <td><input name='${s.code}' type='number' min='0' value='0' title="Quantidade de ${s.desc}"></td>
        </tr>`
      );
    }
  });
}
// Inicializa a tabela
renderServicesTable();

// Evento para busca dinâmica
document.getElementById('serviceSearch').addEventListener('input', function() {
  renderServicesTable(this.value);
});

const fmt = v => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(v);
const val = id => parseFloat(document.getElementById(id).value)||0;

function calculate(){
  const totals={gp:0,jr:0,pl:0,sr:0}; let sel=[];
  services.forEach(s=>{
    const qty=parseFloat(document.forms.lpuForm.elements[s.code].value)||0;
    if(qty>0){ sel.push({...s,qty}); profiles.forEach(p=>totals[p]+=s.hours[p]*qty); }
  });
  const months=val('supportMonths'); if(months>0) totals.sr+=months*1.5;
  const hb=document.getElementById('hoursBody'); hb.innerHTML='';
  profiles.forEach(p=> hb.insertAdjacentHTML('beforeend', `<tr><td>${p}</td><td>${totals[p].toFixed(1)}</td></tr>`));
  const totalH=profiles.reduce((a,p)=>a+totals[p],0);
  document.getElementById('totalHours').textContent=totalH.toFixed(1);
  const rates={gp:val('rate-gp'),jr:val('rate-jr'),pl:val('rate-pl'),sr:val('rate-sr')};
  const costBody=document.getElementById('costBody'); costBody.innerHTML='';
  let totalCost=0; const supExp=months*80;
  const showCost=Object.values(rates).some(n=>n>0)||months>0;
  document.getElementById('costSection').style.display= showCost ? 'block' : 'none';
  if(showCost){
    if(Object.values(rates).some(n=>n>0)){
      profiles.forEach(p=>{ const sub=totals[p]*rates[p]; totalCost+=sub;
        costBody.insertAdjacentHTML('beforeend', `<tr><td>${p}</td><td>${totals[p].toFixed(1)}</td><td>${rates[p].toFixed(2)}</td><td>${fmt(sub)}</td></tr>`);
      });
    }
    if(months>0){ totalCost+=supExp;
      costBody.insertAdjacentHTML('beforeend', `<tr><td colspan='3'>Despesa suporte (${months}m × 80)</td><td>${fmt(supExp)}</td></tr>`);
    }
    document.getElementById('totalCost').textContent = fmt(totalCost);
  }
  let txt=`Cliente: ${document.getElementById('clientName').value||'[cliente]'}\nData: ${new Date().toLocaleDateString()}\n\nItens:`;
  sel.forEach(s=> txt+=`\n- ${s.code} (${s.desc}) ×${s.qty}`);
  if(months>0) txt+=`\n- Suporte continuado: ${months} mês(es)`;
  txt+="\n\nHoras:";
  profiles.forEach(p=> txt+=`\n  ${p}: ${totals[p].toFixed(1)}h`);
  txt+=`\nTotal horas: ${totalH.toFixed(1)}h`;
  if(months>0) txt+=`\nHoras SR suporte: ${(months*1.5).toFixed(1)}h\nDespesa suporte: ${fmt(supExp)}`;
  document.getElementById('summary').value = txt;
  document.getElementById('output').style.display = 'block';
}
document.getElementById('calcBtn').addEventListener('click', calculate);
document.getElementById('copyBtn').addEventListener('click', () => {
  const t = document.getElementById('summary'); t.select(); document.execCommand('copy');
  alert('Resumo copiado');
});
