/* Área restrita · documentos: proposta (modelo MATO, PDF), contrato revisado (.docx) e revisão jurídica */
(function(){
"use strict";
var S=window.SIS,esc=S.esc,num=S.num;

/* ================= PROPOSTA ================= */
var MATO='<svg viewBox="-4 -4 222 222" aria-hidden="true"><g fill="none" stroke="#111" stroke-width="3.4"><path d="M4 100V2L50 68L96 2V100"/><path d="M112 100L162 4L212 100M126.6 70H197.4"/><path d="M8 116H86M47 116V212"/></g><circle cx="161" cy="163" r="50" fill="#111"/></svg>';
function mato(){return '<div class="mato">'+MATO+'<span class="sl__prod">produção</span></div>';}
var PINO='<svg class="pino" viewBox="0 0 20 46" aria-hidden="true"><circle cx="10" cy="8" r="6" fill="none" stroke="#111" stroke-width="3"/><path d="M10 14V46" stroke="#111" stroke-width="3"/></svg>';
var OBJETIVO={mostra:"qualificar a exposição do projeto e a funcionalidade dos ambientes",foto:"preparar os ambientes para o registro fotográfico do projeto, com composição e acabamento pensados para a câmera",cliente:"deixar os ambientes prontos para o dia a dia, com identidade, conforto e funcionalidade"};
function dataProposta(iso){var p=String(iso||"").split("-").map(Number);if(p.length<3||!p[0])return "";return S.pad(p[2])+" / "+S.MESES[p[1]-1].toUpperCase()+" / "+p[0];}
function telModelo(t){var d=S.soDig(t);if(d.length===13)return "+ "+d.slice(0,2)+" "+d.slice(2,4)+" "+d.slice(4,5)+" "+d.slice(5,9)+"-"+d.slice(9);return t||"";}
function telCurto(t){var d=S.soDig(t);if(d.length>=11){d=d.slice(-11);return "("+d.slice(0,2)+") "+d.slice(2,3)+" "+d.slice(3,7)+"-"+d.slice(7);}return t||"";}
function nomesAmbientes(p){return (p.ambientes||[]).map(function(a){return String(a.nome||"").trim();}).filter(Boolean);}

function slidesHTML(p){
  var c=S.cfg().contratado,cli=p.cliente||{},ambs=nomesAmbientes(p);
  var nomeCli=(cli.nome||"Cliente").toUpperCase();
  var titulo="CLIENTE "+nomeCli+(cli.empresa?" - "+cli.empresa.toUpperCase():"");
  var dias=Math.max(1,Math.round(num(p.dias)||1)),aj=Math.max(1,Math.round(num(p.ajudantes)||1));
  var obs=String(p.observacoes||"").split(/\n+/).map(function(s){return s.trim();}).filter(Boolean);
  var tituloInv=p.tituloInvest||((ambs.join(", ")||"Ambientes")+(cli.empresa?" "+cli.empresa:"")+(cli.nome?" - "+cli.nome:""));
  var intro="Apresentamos as condições para a produção de ambiente dos ambientes mencionados na proposta"+(p.contexto?" "+p.contexto.replace(/\.$/,""):"")+".<br>O objetivo é "+(OBJETIVO[p.finalidade]||OBJETIVO.foto)+".";
  return ''+
  '<section class="sl sl--capa"><span class="sl__bola"></span><span class="sl__prod">produção</span></section>'+
  '<section class="sl sl--marca">'+mato()+'<p class="sl__rod"><i></i>/ '+esc(cli.nome||"Cliente")+'<small>Arquiteto, Urbanista e Produtor Shylton Mavie, '+esc(String(p.data||S.hoje()).slice(0,4))+'</small></p></section>'+
  '<section class="sl sl--dados"><span class="sl__bola"></span><div class="sl__col">'+
    '<p class="t">'+esc(titulo)+(cli.codigo?'<br>'+esc(cli.codigo.toUpperCase()):'')+'</p>'+
    '<p class="t">'+esc(S.FINALIDADE_CAPS[p.finalidade]||"PRODUÇÃO")+'<small>Produção de Ambiente</small></p>'+
    '<p class="t">ETAPAS<small>'+esc(p.etapas||"")+'</small></p>'+
    '<p class="t">AMBIENTES CONSIDERADOS NA PROPOSTA:<small>'+esc(ambs.join(", ")||"—")+'</small></p>'+
    '<p class="t">'+esc(dataProposta(p.data))+'</p>'+
    '<p class="t t--min">'+esc(telModelo(c.telefone))+'<br>'+esc(c.instagram||"")+'<br>'+esc(c.email||"")+'</p>'+
  '</div></section>'+
  '<section class="sl sl--escopo"><span class="sl__bola"></span><div class="sl__txt"><p>'+intro.split("<br>").map(esc).join("<br>")+'</p>'+
    '<p><b>Escopo e Metodologia:</b></p><ul><li>Produção completa de todos os ambientes da proposta.</li><li>Organização estética dos elementos.</li>'+
    '<li>Prazo de Execução: Média de <b>'+S.pad(dias)+' dia'+(dias>1?'s':'')+'</b>.</li>'+
    '<li>Logística: O serviço será realizado com o suporte operacional de '+aj+' ajudante'+(aj>1?'s':'')+' (dependendo da demanda).</li></ul>'+
    '<p><b>Exclusões</b>: '+esc(String(p.exclusoes||"").replace(/^Exclusões:\s*/i,""))+'</p></div></section>'+
  '<section class="sl sl--abre"><p class="sl__h"><b>01</b>INVESTIMENTO</p><p class="sl__sub">/ '+esc(tituloInv)+'</p></section>'+
  '<section class="sl sl--valor">'+mato()+'<div class="sl__cen"><p class="k1">PRODUÇÃO</p>'+PINO+'<p class="k2">INVESTIMENTO</p><p class="rs">R$'+esc(S.fmtValor(p.valor))+'</p><p class="k3">FORMA DE PAGAMENTO:</p><p class="k4">'+esc(p.pagamento||"")+'</p></div>'+
    '<div class="obs"><h3>OBSERVAÇÕES:</h3>'+obs.map(function(o){return '<p>- '+esc(o)+'</p>';}).join("")+(p.creditos?'<p class="cred">- '+esc(p.creditos)+'</p>':'')+'</div></section>'+
  '<section class="sl sl--fim"><p class="sl__h">obrigado!</p><div class="sl__ct"><span>Email: '+esc(c.email||"")+'</span><span>'+esc(c.instagram||"")+'</span><span>'+esc(c.cidade||"")+'</span><span>'+esc(telCurto(c.telefone))+'</span></div><span class="sl__bola"></span></section>';
}
function nomeArq(s){return S.normal(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"documento";}
function carregar(src){
  return new Promise(function(ok,erro){
    var ja=document.querySelector('script[data-src="'+src+'"]');
    if(ja){if(ja.getAttribute("data-ok"))ok();else{ja.addEventListener("load",function(){ok();});ja.addEventListener("error",erro);}return;}
    var s=document.createElement("script");s.src=src;s.setAttribute("data-src",src);
    s.onload=function(){s.setAttribute("data-ok","1");ok();};s.onerror=function(){erro(new Error("script"));};document.head.appendChild(s);
  });
}
function propostaPDF(p){
  var aviso=document.createElement("div");aviso.className="gerando";aviso.textContent="Gerando o PDF da proposta…";
  var box=document.createElement("div");box.className="sl-render";box.innerHTML=slidesHTML(p);
  document.body.appendChild(box);document.body.appendChild(aviso);
  function fim(){box.remove();aviso.remove();}
  return carregar("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js")
    .then(function(){return carregar("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");})
    .then(function(){return document.fonts?document.fonts.ready:null;})
    .then(function(){
      var pdf=new window.jspdf.jsPDF({orientation:"landscape",unit:"px",format:[1280,720],hotfixes:["px_scaling"],compress:true});
      var sls=S.$$(".sl",box),i=0;
      function prox(){
        if(i>=sls.length)return Promise.resolve();
        return window.html2canvas(sls[i],{scale:1.5,backgroundColor:"#ffffff",logging:false,useCORS:true}).then(function(cv){
          if(i)pdf.addPage([1280,720],"landscape");
          pdf.addImage(cv.toDataURL("image/jpeg",0.9),"JPEG",0,0,1280,720);i++;return prox();
        });
      }
      return prox().then(function(){return pdf.output("blob");});
    })
    .then(function(blob){fim();var cli=p.cliente||{};return S.salvarArquivo((cli.nome||"cliente").toUpperCase()+" - PROPOSTA PRODUÇÃO - MATO PRODUÇÃO - "+String(p.data||S.hoje()).split("-").reverse().join("")+".pdf",blob);})
    .catch(function(e){fim();if(window.console)console.error(e);S.toast("Não foi possível gerar o PDF aqui. Use Imprimir e escolha Salvar como PDF.");});
}
function imprimirProposta(p){
  var box=document.createElement("div");box.className="sl-print";box.innerHTML=slidesHTML(p);document.body.appendChild(box);
  document.body.classList.add("imprimindo");
  function fim(){document.body.classList.remove("imprimindo");box.remove();window.removeEventListener("afterprint",fim);}
  window.addEventListener("afterprint",fim);
  setTimeout(function(){try{window.print();}catch(e){S.toast("A impressão não está disponível aqui. Use Baixar PDF.");}setTimeout(fim,1500);},120);
}

/* ================= CONTRATO ================= */
var FIN_CONTRATO={foto:"preparar os ambientes para registro fotográfico",mostra:"expor os ambientes em mostra, evento ou exposição",cliente:"uso dos ambientes pelo próprio CONTRATANTE (cliente final)"};
var A="⟦",F="⟧";
function falta(r){return A+r+F;}
function v(x,r){x=x==null?"":String(x).trim();return x?x:falta(r);}
function enderecoCli(c){
  if(!c)return "";
  var linha=[c.endereco,c.numero].filter(Boolean).join(", ");
  if(c.complemento)linha+=(linha?", ":"")+c.complemento;
  var rest=[c.bairro,c.cidade&&c.uf?c.cidade+"/"+c.uf:(c.cidade||c.uf)].filter(Boolean).join(", ");
  var s=[linha,rest].filter(Boolean).join(", ");
  if(c.cep)s+=(s?", ":"")+"CEP "+c.cep;
  return s;
}
function qualifContratante(c){
  if(!c)return falta("dados do contratante: escolha um cliente");
  if(c.tipo==="PJ"){
    return v(c.nome,"razão social")+", pessoa jurídica de direito privado, inscrita no CNPJ sob o nº "+v(c.doc,"CNPJ")+", com sede em "+v(enderecoCli(c),"endereço")+
      ", neste ato representada por "+v(c.representante,"representante legal")+", inscrito(a) no CPF sob o nº "+v(c.repCpf,"CPF do representante")+", e-mail "+v(c.email,"e-mail")+", telefone "+v(c.telefone,"telefone")+".";
  }
  return v(c.nome,"nome")+", "+v(c.nacionalidade,"nacionalidade")+", "+v(c.estadoCivil,"estado civil")+", "+v(c.profissao,"profissão")+", inscrito(a) no CPF sob o nº "+v(c.doc,"CPF")+
    (c.rg?", portador(a) do RG nº "+c.rg:"")+", residente e domiciliado(a) em "+v(enderecoCli(c),"endereço completo")+", e-mail "+v(c.email,"e-mail")+", telefone "+v(c.telefone,"telefone")+".";
}
function qualifContratado(k){
  return v(k.nome,"nome do contratado")+", "+v(k.nacionalidade,"nacionalidade")+", "+v(k.profissao,"profissão")+", inscrito no CAU sob o nº "+v(k.cau,"registro CAU")+", inscrito no CPF sob o nº "+v(k.cpf,"CPF do contratado")+
    ", com endereço profissional em "+v(k.endereco,"endereço profissional")+", e-mail "+v(k.email,"e-mail")+", telefone "+v(k.telefone,"telefone")+", que atua sob a marca "+v(k.marca,"marca")+".";
}
function formaPagamento(c){
  var total=num(c.valor);
  if(c.pagamentoTipo==="vista")return "à vista, na assinatura deste contrato";
  if(c.pagamentoTipo==="outro")return v(c.pagamentoOutro,"forma de pagamento");
  var s=num(c.sinal)||50,a=total*s/100;
  return S.fmtNum(s)+"% ("+S.brl(a)+") na assinatura deste contrato, para reserva da data, e "+S.fmtNum(100-s)+"% ("+S.brl(total-a)+") até o primeiro dia da produção";
}
function contexto(ct){
  var c=ct.campos||{},cli=ct.clienteId?S.Store.get("clientes",ct.clienteId):null,k=S.cfg().contratado;
  var prop=ct.propostaId?S.Store.get("propostas",ct.propostaId):null;
  var dias=Math.max(1,Math.round(num(c.dias)||1));
  return {
    marca:(k.marca||"MATO Produção").toUpperCase(),
    numero:v(ct.num,"número"),
    contratante:qualifContratante(cli),
    contratado:qualifContratado(k),
    proposta:prop?prop.num:falta("nº da proposta"),
    finalidade:FIN_CONTRATO[c.finalidade]?FIN_CONTRATO[c.finalidade]:falta("finalidade"),
    ambientes:v(c.ambientes,"ambientes"),
    endereco:v(c.enderecoServico||enderecoCli(cli),"endereço da produção"),
    inicio:c.dataInicio?S.dataExtenso(c.dataInicio):falta("data de início"),
    dias:S.pad(dias)+" ("+S.extenso(dias).replace(/ reais?$/,"")+") dia"+(dias>1?"s":""),
    ajudantes:String(Math.max(0,Math.round(num(c.ajudantes)))),
    desmontagem:c.dataDesmontagem?S.dataExtenso(c.dataDesmontagem):falta("data de desmontagem"),
    valor:num(c.valor)?S.brl(c.valor):falta("valor"),
    valorExtenso:num(c.valor)?S.extenso(c.valor):falta("valor por extenso"),
    pagamento:formaPagamento(c),
    pix:v(c.pix||k.pix,"chave PIX"),
    limite:S.brl(c.limiteDespesa),diaria:S.brl(c.diaria),
    prazoConceito:String(num(c.prazoConceito)),prazoAprovacao:String(num(c.prazoAprovacao)),revisoes:String(num(c.revisoes)),
    diasCancel:String(num(c.diasCancel)),retencao:S.fmtNum(c.retencao),retencaoMax:S.fmtNum(c.retencaoMax),
    prazoFotos:String(num(c.prazoFotos)),multaFotos:S.fmtNum(c.multaFotos),
    foro:v(c.foro,"foro"),cidade:v(c.cidade,"cidade"),data:c.dataAssinatura?S.dataExtenso(c.dataAssinatura):falta("data da assinatura"),
    instagram:k.instagram||"@shyltu",
    nomeCli:cli?v(cli.nome,"nome do contratante"):falta("nome do contratante"),
    docCli:cli?(cli.tipo==="PJ"?"CNPJ ":"CPF ")+v(cli.doc,cli.tipo==="PJ"?"CNPJ":"CPF"):"",
    nomeK:v(k.nome,"nome do contratado"),cpfK:"CPF "+v(k.cpf,"CPF do contratado")
  };
}
/* Modelo revisado. **negrito**; {chave} vem do contexto. */
var MODELO=[
 ["marca","{marca}"],
 ["titulo","CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO DE AMBIENTES"],
 ["centro","Contrato nº {numero}"],
 ["p","**CONTRATANTE:** {contratante}"],
 ["p","**CONTRATADO:** {contratado}"],
 ["p","As partes acima identificadas celebram este contrato, que se rege pelas cláusulas a seguir e pela Proposta Comercial nº {proposta} (Anexo I), que faz parte dele."],
 ["h","CLÁUSULA 1 — OBJETO"],
 ["p","1.1. O CONTRATADO prestará ao CONTRATANTE o serviço de produção de ambientes, nas etapas de conceito, pré-produção e produção, com a finalidade de {finalidade}, nos seguintes ambientes: {ambientes}."],
 ["p","1.2. A produção compreende a curadoria, a reserva, o transporte combinado e a disposição de mobiliário, objetos decorativos, iluminação de apoio, tecidos e demais itens de ambientação, dentro do conceito aprovado pelo CONTRATANTE na forma da Cláusula 3."],
 ["p","1.3. Não estão incluídos: projetos estruturais, de arquitetura ou de engenharia; detalhamento de marcenaria executiva; obras e instalações; compra de mobiliário, flores ou folhagens; serviços de fotografia; e qualquer serviço não descrito nesta cláusula ou na proposta. Serviços adicionais dependem de orçamento e de aceite por escrito."],
 ["h","CLÁUSULA 2 — LOCAL, PRAZO E CRONOGRAMA"],
 ["p","2.1. A produção será executada em {endereco}, com início em {inicio} e duração estimada de {dias} de trabalho, com apoio de {ajudantes} ajudante(s), conforme a demanda."],
 ["p","2.2. A desmontagem e a devolução das peças emprestadas ocorrerão em {desmontagem}."],
 ["p","2.3. Os prazos dependem do envio, pelo CONTRATANTE, das informações e aprovações previstas neste contrato. Atrasos causados pelo CONTRATANTE ou por terceiros contratados por ele (obra inacabada, falta de acesso, falta de liberação do condomínio ou da organização da mostra) prorrogam os prazos pelo mesmo período, e os dias adicionais de trabalho serão cobrados conforme a Cláusula 4.5."],
 ["h","CLÁUSULA 3 — ETAPAS E APROVAÇÕES"],
 ["p","3.1. Conceito: o CONTRATADO apresentará a proposta de ambientação, com referências e lista preliminar de peças, em até {prazoConceito} dias após a assinatura. O CONTRATANTE terá {prazoAprovacao} dias para aprovar ou pedir ajustes. Estão incluídas {revisoes} rodada(s) de ajustes."],
 ["p","3.2. Pré-produção: após a aprovação do conceito, o CONTRATADO fará a seleção, a reserva e a logística das peças junto a lojas, marcas e parceiros."],
 ["p","3.3. Produção: montagem e organização estética no local, nas datas da Cláusula 2."],
 ["p","3.4. Aprovações e pedidos de ajuste podem ser feitos por e-mail ou WhatsApp e valem como manifestação por escrito."],
 ["h","CLÁUSULA 4 — VALOR E FORMA DE PAGAMENTO"],
 ["p","4.1. Pelos serviços, o CONTRATANTE pagará ao CONTRATADO {valor} ({valorExtenso}), da seguinte forma: {pagamento}."],
 ["p","4.2. Os pagamentos serão feitos por PIX (chave {pix}) ou transferência para conta de titularidade do CONTRATADO, que emitirá recibo ou nota fiscal de cada pagamento."],
 ["p","4.3. O atraso no pagamento sujeita a parcela em atraso a multa de 2% (dois por cento), juros de 1% (um por cento) ao mês e correção monetária pelo IPCA, calculados dia a dia."],
 ["p","4.4. Despesas extras de produção não reembolsáveis (folhagens, fretes, embalagens, materiais de consumo, estacionamento) dependem de aprovação prévia do CONTRATANTE e serão reembolsadas em até 5 (cinco) dias úteis após a apresentação dos comprovantes. Despesas acima de {limite} por item exigem aprovação por escrito."],
 ["p","4.5. Cada dia adicional de trabalho além do previsto na Cláusula 2.1, por motivo não atribuível ao CONTRATADO, será cobrado à razão de {diaria} por dia."],
 ["h","CLÁUSULA 5 — OBRIGAÇÕES DO CONTRATANTE"],
 ["p","5.1. Fornecer plantas, projeto ou arquivo SketchUp, fotos e demais informações necessárias à produção."],
 ["p","5.2. Garantir acesso ao local, energia elétrica, limpeza e condições de trabalho nas datas combinadas, bem como as liberações do condomínio ou da organização da mostra (elevador, vaga para carga e descarga e horários)."],
 ["p","5.3. Zelar pelas peças emprestadas enquanto estiverem sob sua guarda, na forma da Cláusula 7."],
 ["p","5.4. Pagar as parcelas e os reembolsos nos prazos combinados."],
 ["h","CLÁUSULA 6 — OBRIGAÇÕES DO CONTRATADO"],
 ["p","6.1. Executar os serviços com técnica e cuidado, dentro do conceito aprovado."],
 ["p","6.2. Responder pelos atos de seus ajudantes e da equipe que contratar, sem qualquer vínculo empregatício destes com o CONTRATANTE."],
 ["p","6.3. Entregar ao CONTRATANTE, na montagem, o inventário das peças emprestadas (Anexo II), com a origem e o valor de reposição de cada uma, assinado pelas partes."],
 ["p","6.4. Manter sigilo sobre as informações pessoais do CONTRATANTE e sobre o imóvel."],
 ["h","CLÁUSULA 7 — PEÇAS EMPRESTADAS, COMPRAS E AVARIAS"],
 ["p","7.1. As peças cedidas por lojas, marcas e parceiros para a produção são emprestadas e serão devolvidas na data de desmontagem. A compra de qualquer peça pelo CONTRATANTE é feita diretamente com o fornecedor, que emite a nota fiscal e responde pela entrega e pela garantia do produto."],
 ["p","7.2. O CONTRATANTE responde pelo valor de reposição, conforme o inventário, das peças perdidas ou danificadas por ele, por seus familiares, funcionários, convidados, visitantes ou terceiros sob sua responsabilidade, ou enquanto as peças estiverem sob sua guarda."],
 ["p","7.3. O CONTRATADO responde pelos danos causados por ele ou por sua equipe durante o transporte, a montagem e a desmontagem."],
 ["p","7.4. Nenhuma das partes responde por caso fortuito ou força maior, nos termos do art. 393 do Código Civil. Para mostras e eventos, recomenda-se seguro das peças."],
 ["p","7.5. A conferência de entrada e de saída das peças será registrada com fotos e assinada no inventário."],
 ["h","CLÁUSULA 8 — CANCELAMENTO, REAGENDAMENTO E RESCISÃO"],
 ["p","8.1. Se o CONTRATANTE cancelar com mais de {diasCancel} dias de antecedência do início da produção, o CONTRATADO devolverá os valores pagos, descontados {retencao}% do valor total, referentes à reserva da agenda e ao conceito, e as despesas já feitas e comprovadas. Com menos de {diasCancel} dias, será devido o valor das etapas já executadas, limitado a {retencaoMax}% do valor total, mais as despesas comprovadas."],
 ["p","8.2. O reagendamento pedido pelo CONTRATANTE com mais de {diasCancel} dias de antecedência não gera multa e depende da agenda do CONTRATADO."],
 ["p","8.3. Se o CONTRATADO cancelar sem justa causa, devolverá integralmente os valores pagos em até 10 (dez) dias."],
 ["p","8.4. O descumprimento de qualquer cláusula, não corrigido em até 5 (cinco) dias após notificação por escrito, permite à parte prejudicada rescindir o contrato, pagando-se o que for devido até a data."],
 ["h","CLÁUSULA 9 — IMAGENS, CRÉDITOS E FOTOGRAFIAS"],
 ["p","9.1. O CONTRATANTE autoriza o CONTRATADO a usar imagens do ambiente produzido em portfólio, site e redes sociais, sem divulgar endereço, dados pessoais ou elementos que identifiquem o CONTRATANTE ou sua família, salvo autorização expressa."],
 ["p","9.2. Toda publicação de fotos ou materiais visuais do ambiente pelo CONTRATANTE deverá creditar a produção (Produção: Shylton Mavie, {instagram}) e o(a) fotógrafo(a)."],
 ["p","9.3. Quando houver sessão de fotos contratada pelo CONTRATANTE, ele enviará ao CONTRATADO as fotos em alta resolução em até {prazoFotos} dias após recebê-las e obterá do(a) fotógrafo(a) a autorização para uso em portfólio, com o devido crédito, nos termos da Lei nº 9.610/1998."],
 ["p","9.4. Se as fotos não forem enviadas no prazo, o CONTRATADO poderá, à sua escolha: (a) fotografar o ambiente em data combinada, com acesso garantido pelo CONTRATANTE; ou (b) cobrar multa de {multaFotos}% do valor deste contrato."],
 ["h","CLÁUSULA 10 — DADOS PESSOAIS"],
 ["p","10.1. Os dados pessoais das partes serão usados apenas para a execução deste contrato e para o cumprimento de obrigações legais, nos termos da Lei nº 13.709/2018 (LGPD), e guardados pelo prazo legal."],
 ["h","CLÁUSULA 11 — DISPOSIÇÕES GERAIS"],
 ["p","11.1. Este contrato vigora até a conclusão dos serviços e o cumprimento de todas as obrigações, inclusive as das Cláusulas 7 e 9."],
 ["p","11.2. Alterações só valem por escrito, em aditivo assinado pelas partes."],
 ["p","11.3. A tolerância de uma parte com o descumprimento da outra não significa renúncia nem novação."],
 ["p","11.4. As comunicações serão feitas aos e-mails indicados na qualificação das partes."],
 ["p","11.5. Este contrato será assinado eletronicamente, nos termos da Medida Provisória nº 2.200-2/2001, por plataforma que garanta a autoria e a integridade das assinaturas, o que dispensa testemunhas (art. 784, § 4º, do Código de Processo Civil)."],
 ["p","11.6. Fica eleito o foro da comarca de {foro}. Se o CONTRATANTE for consumidor pessoa física, poderá propor ação no foro do seu domicílio (art. 101, I, do Código de Defesa do Consumidor)."],
 ["p","E, por estarem de acordo, as partes assinam este contrato eletronicamente."],
 ["centro","{cidade}, {data}."],
 ["assin",""],
 ["h","ANEXO I — Proposta Comercial nº {proposta}"],
 ["p","Anexar a proposta aprovada pelo CONTRATANTE."],
 ["h","ANEXO II — Inventário de peças"],
 ["p","Preenchido e assinado na montagem: peça, fornecedor, quantidade, estado na entrada, valor de reposição e estado na saída."]
];
function preencher(t,ctx){return t.replace(/\{(\w+)\}/g,function(_,k){return ctx[k]!=null?ctx[k]:falta(k);});}
function htmlTexto(t){
  return esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(new RegExp(A+"(.+?)"+F,"g"),'<mark>[$1]</mark>');
}
function contratoHTML(ct){
  var ctx=contexto(ct);
  return '<article class="folha">'+MODELO.map(function(b){
    var t=preencher(b[1],ctx);
    if(b[0]==="marca")return '<p class="marca">'+htmlTexto(t)+'</p>';
    if(b[0]==="titulo")return '<h1>'+htmlTexto(t)+'</h1>';
    if(b[0]==="centro")return '<p class="centro">'+htmlTexto(t)+'</p>';
    if(b[0]==="h")return '<h2'+(/^ANEXO I —/.test(t)?' class="anexo"':'')+'>'+htmlTexto(t)+'</h2>';
    if(b[0]==="assin")return '<div class="assin"><div><b>CONTRATANTE</b><span>'+htmlTexto(ctx.nomeCli)+'<br>'+htmlTexto(ctx.docCli)+'</span></div><div><b>CONTRATADO</b><span>'+htmlTexto(ctx.nomeK)+'<br>'+htmlTexto(ctx.cpfK)+'</span></div></div>';
    return '<p>'+htmlTexto(t)+'</p>';
  }).join("")+'</article>';
}
function faltando(ct){
  var ctx=contexto(ct),txt=MODELO.map(function(b){return preencher(b[1],ctx);}).join(" ")+ctx.nomeCli+ctx.docCli+ctx.cpfK;
  var r=[],re=new RegExp(A+"(.+?)"+F,"g"),m;
  while((m=re.exec(txt))){if(r.indexOf(m[1])<0)r.push(m[1]);}
  return r;
}

/* ---------- .docx (Office Open XML, montado no navegador) ---------- */
function xesc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function runs(t,base){
  base=base||"";var out="",partes=t.split(/(\*\*.+?\*\*|⟦.+?⟧)/g);
  partes.forEach(function(p){
    if(!p)return;
    var rpr=base,txt=p;
    if(/^\*\*.+\*\*$/.test(p)){txt=p.slice(2,-2);rpr+="<w:b/>";}
    else if(p.charAt(0)===A){txt="["+p.slice(1,-1)+"]";rpr+='<w:highlight w:val="yellow"/>';}
    out+="<w:r>"+(rpr?"<w:rPr>"+rpr+"</w:rPr>":"")+'<w:t xml:space="preserve">'+xesc(txt)+"</w:t></w:r>";
  });
  return out;
}
function par(t,o){
  o=o||{};
  var ppr=(o.jc?'<w:jc w:val="'+o.jc+'"/>':"")+(o.antes!=null||o.depois!=null?'<w:spacing w:before="'+(o.antes||0)+'" w:after="'+(o.depois!=null?o.depois:120)+'"/>':"")+(o.junto?"<w:keepNext/>":"");
  return "<w:p>"+(ppr?"<w:pPr>"+ppr+"</w:pPr>":"")+runs(t,o.rpr||"")+"</w:p>";
}
function documentoXML(ct){
  var ctx=contexto(ct),corpo="";
  MODELO.forEach(function(b){
    var t=preencher(b[1],ctx);
    if(b[0]==="marca")corpo+=par(t,{rpr:'<w:sz w:val="40"/><w:spacing w:val="20"/>',depois:360});
    else if(b[0]==="titulo")corpo+=par("**"+t+"**",{jc:"center",depois:60});
    else if(b[0]==="centro")corpo+=par(t,{jc:"center",antes:120,depois:240});
    else if(b[0]==="h")corpo+=par("**"+t+"**",{antes:/^ANEXO/.test(t)?360:240,depois:80,junto:true});
    else if(b[0]==="assin"){
      [["CONTRATANTE",ctx.nomeCli,ctx.docCli],["CONTRATADO",ctx.nomeK,ctx.cpfK]].forEach(function(s){
        corpo+=par("**"+s[0]+":**",{antes:480,depois:600,junto:true})+par("______________________________________",{depois:0,junto:true})+par(s[1],{depois:0,junto:true})+par(s[2],{depois:120});
      });
    }
    else corpo+=par(t,{jc:"both"});
  });
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>'+corpo+
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>';
}
var ESTILOS='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style></w:styles>';
var TIPOS='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
var RELS='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
var DOCRELS='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
var CRC=(function(){var t=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(u){var c=0xFFFFFFFF;for(var i=0;i<u.length;i++)c=CRC[(c^u[i])&0xFF]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function zip(arqs){
  var enc=new TextEncoder(),partes=[],central=[],off=0,d=new Date();
  var tm=(d.getHours()<<11)|(d.getMinutes()<<5)|Math.floor(d.getSeconds()/2),dt=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  arqs.forEach(function(a){
    var nome=enc.encode(a[0]),dados=enc.encode(a[1]),crc=crc32(dados);
    var l=new DataView(new ArrayBuffer(30));
    l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x0800,true);l.setUint16(8,0,true);l.setUint16(10,tm,true);l.setUint16(12,dt,true);
    l.setUint32(14,crc,true);l.setUint32(18,dados.length,true);l.setUint32(22,dados.length,true);l.setUint16(26,nome.length,true);l.setUint16(28,0,true);
    partes.push(new Uint8Array(l.buffer),nome,dados);
    var c=new DataView(new ArrayBuffer(46));
    c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,tm,true);c.setUint16(14,dt,true);
    c.setUint32(16,crc,true);c.setUint32(20,dados.length,true);c.setUint32(24,dados.length,true);c.setUint16(28,nome.length,true);
    c.setUint16(30,0,true);c.setUint16(32,0,true);c.setUint16(34,0,true);c.setUint16(36,0,true);c.setUint32(38,0,true);c.setUint32(42,off,true);
    central.push(new Uint8Array(c.buffer),nome);
    off+=30+nome.length+dados.length;
  });
  var tam=central.reduce(function(s,u){return s+u.length;},0),e=new DataView(new ArrayBuffer(22));
  e.setUint32(0,0x06054b50,true);e.setUint16(4,0,true);e.setUint16(6,0,true);e.setUint16(8,arqs.length,true);e.setUint16(10,arqs.length,true);e.setUint32(12,tam,true);e.setUint32(16,off,true);e.setUint16(20,0,true);
  return new Blob(partes.concat(central,[new Uint8Array(e.buffer)]),{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}
function contratoDocx(ct){
  var blob=zip([["[Content_Types].xml",TIPOS],["_rels/.rels",RELS],["word/document.xml",documentoXML(ct)],["word/_rels/document.xml.rels",DOCRELS],["word/styles.xml",ESTILOS]]);
  var cli=ct.clienteId?S.Store.get("clientes",ct.clienteId):null;
  return S.salvarArquivo("Contrato "+(ct.num||"")+" - "+((cli&&cli.nome)||"cliente")+".docx",blob);
}

/* ================= REVISÃO JURÍDICA DO CONTRATO BASE ================= */
var REVISAO=[
 {t:"Partes e marca",n:"Ajuste",antes:"Cabeçalho “ESTÚDIO MATO”, mas quem assina é a pessoa física, sem endereço, sem registro no CAU e sem contato.",prob:"A marca não é parte do contrato. Sem endereço e sem CAU, a qualificação fica incompleta para cobrança e notificações.",agora:"Qualificação completa das duas partes (CPF ou CNPJ, endereço, e-mail, telefone e CAU do contratado) e a frase “que atua sob a marca MATO Produção”. Há versão para cliente empresa, com representante legal."},
 {t:"Objeto vago e contraditório",n:"Importante",antes:"1.1 diz “conforme projeto aprovado pelo Contratante”; 1.2 diz “itens escolhidos pelo Contratado”.",prob:"Não fica claro quem decide o quê, nem quais ambientes e qual finalidade (foto, mostra ou cliente final) estão incluídos.",agora:"Objeto com finalidade e ambientes, proposta como Anexo I, lista do que está incluído e do que não está (as mesmas exclusões da proposta)."},
 {t:"Etapas e aprovações",n:"Importante",antes:"Não existiam.",prob:"Sem prazo de aprovação e sem limite de ajustes, o trabalho pode se arrastar sem cobrança extra.",agora:"Cláusula 3: conceito com prazo, prazo para o cliente aprovar, número de rodadas de ajuste e aprovação válida por e-mail ou WhatsApp."},
 {t:"Pagamento no passado",n:"Importante",antes:"3.1 “o Contratante pagou… no dia 27 de junho”.",prob:"Serve só para um caso já pago; não prevê sinal, saldo, atraso nem recibo.",agora:"Valor por extenso, sinal para reservar a data e saldo até o primeiro dia (ou à vista), PIX, recibo ou nota, multa de 2%, juros de 1% ao mês e correção pelo IPCA."},
 {t:"Despesas extras sem aprovação",n:"Importante",antes:"3.2 o cliente reembolsa “quaisquer gastos extras”.",prob:"O Código de Defesa do Consumidor (arts. 39 e 40) exige orçamento e autorização prévios; cobrar depois gera conflito.",agora:"Despesas aprovadas antes, limite por item que exige aprovação por escrito, reembolso em 5 dias úteis com comprovantes e valor de diária extra."},
 {t:"Quebra e avarias amplas demais",n:"Crítico",antes:"4.1 o cliente paga qualquer peça quebrada “durante a execução dos serviços”.",prob:"Inclui até danos causados pela própria equipe. Com cliente pessoa física, a cláusula pode ser anulada como abusiva (CDC, art. 51).",agora:"Cliente responde pelo que acontecer por ele, convidados ou enquanto as peças estão sob sua guarda; o contratado responde por sua equipe no transporte, montagem e desmontagem. Inventário com fotos na entrada e na saída e recomendação de seguro em mostras."},
 {t:"Valores “não serão restituídos”",n:"Crítico",antes:"4.2 nada é devolvido em nenhuma hipótese.",prob:"A perda total do valor pago tende a ser considerada abusiva (CDC, art. 51) e não diferencia cancelamento com antecedência de desistência na véspera.",agora:"Cláusula 8 de cancelamento: retenção proporcional (reserva de agenda e conceito), limite máximo, reagendamento sem multa com antecedência e devolução integral se o contratado desistir."},
 {t:"Peças compradas pelo cliente",n:"Ajuste",antes:"Não existia.",prob:"Quando o cliente compra peças usadas na produção, não ficava claro quem vende, quem emite nota e quem dá garantia.",agora:"A compra é direta com o fornecedor, que emite a nota fiscal e responde pela entrega e garantia (cláusula 7.1)."},
 {t:"Fotos do fotógrafo",n:"Importante",antes:"6.1 a 6.3: o cliente entrega as fotos “da fotógrafa contratada” em 6 meses; multa de 100%.",prob:"As fotos pertencem a quem fotografou (Lei 9.610/98); o cliente não pode ceder o que não é dele. Multa de 100% é desproporcional e o juiz pode reduzir (Código Civil, art. 413).",agora:"Cliente envia as fotos e consegue a autorização do(a) fotógrafo(a) com crédito; se não enviar, o contratado escolhe fotografar o ambiente ou cobrar multa menor (padrão 20%). Prazo ajustável."},
 {t:"Créditos",n:"Ajuste",antes:"Só aparecia na proposta.",prob:"Uma regra da proposta precisa estar no contrato para ser exigida.",agora:"Toda publicação do cliente credita “Produção: Shylton Mavie” e o fotógrafo (cláusula 9.2)."},
 {t:"Rescisão e força maior",n:"Importante",antes:"Não existiam.",prob:"Sem regra de rescisão, qualquer descumprimento vira discussão; chuva, doença ou interdição da mostra não tinham tratamento.",agora:"Notificação com 5 dias para corrigir, rescisão pela parte prejudicada e caso fortuito ou força maior (Código Civil, art. 393)."},
 {t:"Dados pessoais",n:"Ajuste",antes:"Não existia.",prob:"O contrato guarda CPF, endereço e contatos; a LGPD pede finalidade clara.",agora:"Cláusula 10: dados usados só para o contrato e obrigações legais."},
 {t:"Assinatura e testemunhas",n:"Ajuste",antes:"7.1 “assinaturas válidas”, sem dizer como.",prob:"Sem plataforma que comprove autoria e integridade, o contrato perde força para cobrança direta.",agora:"Assinatura por plataforma que garanta autoria e integridade (gov.br ou serviço de assinatura), o que dispensa testemunhas (CPC, art. 784, § 4º)."},
 {t:"Foro",n:"Ajuste",antes:"Florianópolis, com renúncia a qualquer outro.",prob:"Com cliente consumidor, ele pode processar no próprio domicílio (CDC, art. 101, I); a cláusula fixa pode ser ignorada. Shylton também atende em São Paulo.",agora:"Foro editável por contrato e ressalva para o consumidor."},
 {t:"Fora do contrato: % de ART por parceiro",n:"Atenção",antes:"O sistema registra a porcentagem de ART de cada parceiro nas peças compradas pelo cliente.",prob:"Se essa porcentagem for comissão paga por lojas (reserva técnica), o Código de Ética do CAU (Resolução CAU/BR nº 52/2013, regra 3.2.16) proíbe o arquiteto de receber vantagens de fornecedores dos seus contratantes.",agora:"O dado fica visível só para o administrador. Vale confirmar com um advogado ou com o CAU como enquadrar essa receita antes de usá-la."}
];
var NIVEL={"Crítico":"#9A3B2E","Importante":"#B08A3E","Ajuste":"#5F6F7A","Atenção":"#3B3733"};
function revisaoHTML(){
  return '<div class="rev">'+REVISAO.map(function(r){
    return '<div class="rev__item"><div><h3>'+esc(r.t)+'</h3><span class="tag rev__nivel" style="--c:'+NIVEL[r.n]+'">'+esc(r.n)+'</span></div><dl>'+
      '<dt>Antes</dt><dd>'+esc(r.antes)+'</dd><dt>Problema</dt><dd>'+esc(r.prob)+'</dd><dt>Como ficou</dt><dd>'+esc(r.agora)+'</dd></dl></div>';
  }).join("")+'</div>';
}

Object.assign(S,{slidesHTML:slidesHTML,propostaPDF:propostaPDF,imprimirProposta:imprimirProposta,
  contratoHTML:contratoHTML,contratoDocx:contratoDocx,faltando:faltando,enderecoCli:enderecoCli,revisaoHTML:revisaoHTML,REVISAO:REVISAO,nomeArq:nomeArq,
  _docx:{documentoXML:documentoXML,zip:zip,TIPOS:TIPOS,RELS:RELS,DOCRELS:DOCRELS,ESTILOS:ESTILOS}});
})();
