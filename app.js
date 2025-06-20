// ========== Variáveis e Dados ==========
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

// ========== MONTAGEM DA TABELA ==========
const bodyTbl = document.getElementById("servicesBody");
services.forEach(s => {
  const tooltip = serviceDescriptions[s.code] || s.desc;
  bodyTbl.insertAdjacentHTML("beforeend",
    `<tr>
      <td>${s.code}</td>
      <td title="${tooltip}"><strong>${s.desc}</strong><br><small>${tooltip}</small></td>
      <td>${s.unit}</td>
      <td><input name='${s.code}' type='number' min='0' value='0' title="Quantidade de ${s.desc}"></td>
    </tr>`
  );
});

// ========== BUSCA DINÂMICA ==========
document.getElementById("serviceSearch").addEventListener("input", function() {
  const search = this.value.trim().toLowerCase();
  const trs = bodyTbl.querySelectorAll("tr");
  trs.forEach(tr => {
    const txt = tr.textContent.toLowerCase();
    tr.style.display = txt.includes(search) ? "" : "none";
  });
});

// ========== CÁLCULO ==========
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
  document.getElementById('formMessage').innerHTML = "<span style='color:green;'>Cálculo realizado!</span>";
}
document.getElementById('calcBtn').addEventListener('click', calculate);

// ========== COPIAR RESUMO ==========
document.getElementById('copyBtn').addEventListener('click', () => {
  const t = document.getElementById('summary'); t.select(); document.execCommand('copy');
  document.getElementById('formMessage').innerHTML = "Resumo copiado!";
  setTimeout(() => { document.getElementById('formMessage').innerHTML = ""; }, 1500);
});

// ========== MULTIPROJETOS (LocalStorage) ==========
function getAllProjects() {
  return JSON.parse(localStorage.getItem("lpu_projects") || "{}");
}
function saveAllProjects(obj) {
  localStorage.setItem("lpu_projects", JSON.stringify(obj));
}
function fillProjectList(selected) {
  const sel = document.getElementById("projectsList");
  const projects = getAllProjects();
  sel.innerHTML = "";
  Object.keys(projects).forEach(name => {
    sel.insertAdjacentHTML("beforeend", `<option ${name===selected?'selected':''}>${name}</option>`);
  });
}
function readProjectForm() {
  const servicesObj = {};
  services.forEach(s => {
    servicesObj[s.code] = document.forms.lpuForm.elements[s.code].value;
  });
  return {
    clientName: document.getElementById('clientName').value,
    rates: {
      gp: val('rate-gp'),
      jr: val('rate-jr'),
      pl: val('rate-pl'),
      sr: val('rate-sr'),
    },
    supportMonths: val('supportMonths'),
    services: servicesObj
  };
}
function applyProjectToForm(project) {
  document.getElementById('clientName').value = project.clientName || "";
  document.getElementById('rate-gp').value = project.rates.gp || "";
  document.getElementById('rate-jr').value = project.rates.jr || "";
  document.getElementById('rate-pl').value = project.rates.pl || "";
  document.getElementById('rate-sr').value = project.rates.sr || "";
  document.getElementById('supportMonths').value = project.supportMonths || 0;
  services.forEach(s => {
    document.forms.lpuForm.elements[s.code].value = project.services[s.code] || 0;
  });
}
function validateProjectName(name) {
  return !!name && /^[A-Za-z0-9 _-]{2,30}$/.test(name);
}
document.getElementById('saveBtn').onclick = function() {
  const name = document.getElementById("projectName").value.trim();
  if (!validateProjectName(name)) {
    document.getElementById('formMessage').innerHTML = "Nome do projeto inválido.";
    return;
  }
  const projects = getAllProjects();
  projects[name] = readProjectForm();
  saveAllProjects(projects);
  fillProjectList(name);
  document.getElementById('formMessage').innerHTML = "Projeto salvo!";
};
document.getElementById('loadBtn').onclick = function() {
  const name = document.getElementById("projectsList").value;
  const projects = getAllProjects();
  if (!name || !projects[name]) {
    document.getElementById('formMessage').innerHTML = "Selecione um projeto para carregar.";
    return;
  }
  applyProjectToForm(projects[name]);
  document.getElementById('formMessage').innerHTML = "Projeto carregado!";
  setTimeout(() => { document.getElementById('formMessage').innerHTML = ""; }, 1400);
};
document.getElementById('deleteBtn').onclick = function() {
  const name = document.getElementById("projectsList").value;
  if (!name) return;
  const projects = getAllProjects();
  if (!projects[name]) return;
  if (!confirm("Tem certeza que deseja excluir o projeto '"+name+"'?")) return;
  delete projects[name];
  saveAllProjects(projects);
  fillProjectList("");
  document.getElementById('formMessage').innerHTML = "Projeto excluído!";
  setTimeout(() => { document.getElementById('formMessage').innerHTML = ""; }, 1400);
};
// Inicializa lista ao carregar
fillProjectList("");

// ========== EXPORTAÇÃO PDF ==========
document.getElementById('pdfBtn').onclick = function() {
  const name = document.getElementById('projectsList').value;
  const projects = getAllProjects();
  if (!name || !projects[name]) {
    alert("Selecione um projeto salvo para exportar em PDF!");
    return;
  }
  const project = projects[name];

  const doc = new window.jspdf.jsPDF({orientation: "portrait", unit: "pt", format: "a4"});
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título e informações do projeto
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Proposta de Serviços NetApp", pageWidth / 2, 50, {align: "center"});
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Projeto: ${name}`, 40, 80);
  doc.text(`Cliente: ${project.clientName || '[cliente]'}`, 40, 100);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 40, 120);

  let lastY = 150;

  // Tabela de serviços
  let servRows = [];
  for (const cod in project.services) {
    if (+project.services[cod] > 0) {
      const desc = (services.find(s => s.code === cod)?.desc || cod);
      servRows.push([cod, desc, project.services[cod]]);
    }
  }
  if (servRows.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Serviços Selecionados:", 40, lastY);
    doc.autoTable({
      startY: lastY + 10,
      head: [['Código', 'Descrição', 'Qtd.']],
      body: servRows,
      styles: {font: "helvetica", fontSize: 11},
      margin: {left: 40, right: 40},
      headStyles: {fillColor: [0,91,150]},
    });
    lastY = doc.lastAutoTable.finalY + 30;
  }

  // Tabela de valores hora
  doc.setFont("helvetica", "bold");
  doc.text("Valores de Hora por Perfil:", 40, lastY);
  doc.autoTable({
    startY: lastY + 10,
    head: [['Perfil', 'R$/h']],
    body: [
      ["gp", project.rates.gp || "0"],
      ["jr", project.rates.jr || "0"],
      ["pl", project.rates.pl || "0"],
      ["sr", project.rates.sr || "0"]
    ],
    styles: {font: "helvetica", fontSize: 11},
    margin: {left: 40, right: 40},
    headStyles: {fillColor: [0,91,150]},
  });
  lastY = doc.lastAutoTable.finalY + 30;

  // Resumo do projeto
  doc.setFont("helvetica", "bold");
  doc.text("Resumo do Projeto:", 40, lastY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const resumo = document.getElementById('summary').value || "";
  const splitText = doc.splitTextToSize(resumo, 500);
  doc.text(splitText, 40, lastY + 18);

  // Salva PDF
  doc.save(`Proposta_${project.clientName||'cliente'}.pdf`);
};

// ========== EXPORTAÇÃO CSV ==========
document.getElementById('csvBtn').onclick = function() {
  const name = document.getElementById('projectsList').value;
  const projects = getAllProjects();
  if (!name || !projects[name]) {
    alert("Selecione um projeto salvo para exportar em CSV!");
    return;
  }
  const project = projects[name];
  let csv = `Projeto,${name}\nCliente,${project.clientName}\nData,${new Date().toLocaleDateString()}\n\nServiços Selecionados:\nCódigo,Descrição,Quantidade\n`;
  for (const cod in project.services) {
    if (+project.services[cod] > 0) {
      const desc = (services.find(s => s.code === cod)?.desc || cod);
      csv += `"${cod}","${desc}",${project.services[cod]}\n`;
    }
  }
  csv += `\nValores por Hora\nPerfil,R$/h\n`;
  ["gp","jr","pl","sr"].forEach(p => {
    csv += `${p},${project.rates[p] || "0"}\n`;
  });
  csv += `\nResumo do Projeto:\n"${(document.getElementById('summary').value || "").replace(/\n/g, "\\n")}"\n`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Proposta_${project.clientName||'cliente'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
