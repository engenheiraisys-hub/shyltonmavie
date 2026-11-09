/* Área restrita · módulos: início, propostas, produções, financeiro, contratos, clientes, calendário, parceiros, tarefas, equipe, ajustes */
(function(){
"use strict";
var S=window.SIS,M=S.mod,St=S.Store,esc=S.esc,num=S.num,brl=S.brl,$=S.$,$$=S.$$;

/* ---------- peças comuns ---------- */
/* Cabeçalho de tela: ‹ Voltar, título, ações à direita e descrição embaixo */
function cab(t,sub,dir,voltar){
  var v=voltar||(S.ehAdm()&&t!=="Início"?["#adm/inicio","Início"]:null);
  return '<header class="sis-cab">'+(v?'<a class="sis-voltar" href="'+v[0]+'" aria-label="Voltar para '+esc(v[1])+'">‹ Voltar</a>':'')+
    '<div class="sis-cab__lin"><h1>'+esc(t)+'</h1>'+(dir?'<div class="sis-ferr">'+dir+'</div>':'')+'</div>'+(sub?'<p class="sis-cab__sub">'+sub+'</p>':'')+'</header>';
}
/* Ícones de traço (grade 24) dos indicadores, busca e cartões */
var IK={
  doc:'<path d="M14 3.5H5.5v17h13V8z"/><path d="M14 3.5V8h4.5"/>',
  ok:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  ampulheta:'<path d="M7 3.5h10M7 20.5h10"/><path d="M8 3.5c0 4.5 8 4.5 8 8.5s-8 4-8 8.5M16 3.5c0 4.5-8 4.5-8 8.5s8 4 8 8.5"/>',
  x:'<circle cx="12" cy="12" r="8.5"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
  envio:'<path d="M20.5 3.5 3.5 10.5l7 3 3 7z"/><path d="M20.5 3.5l-10 10"/>',
  relogio:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  grafico:'<path d="M3.5 20.5h17"/><path d="M7 17v-5M12 17V6.5M17 17V9.5"/>',
  saida:'<path d="M12 3.5v12M7 10.5l5 5 5-5"/><path d="M4 20.5h16"/>',
  tarefa:'<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 12.5l3 3 5.5-6"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  lupa:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
  link:'<path d="M10.5 13.5a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1"/><path d="M13.5 10.5a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/>',
  seta:'<path d="M9.5 6l6 6-6 6"/>'
};
function ik(n,cl){return '<svg class="'+(cl||"ik")+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+IK[n]+'</svg>';}
/* Abas em pílula: [valor, rótulo, cor do ponto]; a contagem é preenchida em contarPil */
function pilulas(lista,ativo,attr,rot){
  return '<div class="pil" role="group" aria-label="'+esc(rot||"Filtrar")+'">'+lista.map(function(f){
    return '<button type="button" '+attr+'="'+esc(f[0])+'" aria-pressed="'+(String(f[0])===String(ativo))+'" style="--c:'+(f[2]||"var(--tinta-forte)")+'"><i aria-hidden="true"></i>'+esc(f[1])+'<span class="pil__n"></span></button>';
  }).join("")+'</div>';
}
function ligarPil(m,attr,fn){$$("["+attr+"]",m).forEach(function(b){b.addEventListener("click",function(){var v=b.getAttribute(attr);$$("["+attr+"]",m).forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});fn(v);});});}
function contarPil(m,attr,fn){$$("["+attr+"]",m).forEach(function(b){var s=b.querySelector(".pil__n");if(s)s.textContent=fn(b.getAttribute(attr));});}
function comCor(grupo,todos){return (todos?[todos]:[]).concat(Object.keys(S.ST[grupo]).map(function(k){return [k,S.ST[grupo][k][0],S.ST[grupo][k][1]];}));}
function corSt(grupo,v){return ((S.ST[grupo]||{})[v]||[0,"var(--pedra)"])[1];}
function busca(v,ph){return '<label class="sis-busca">'+ik("lupa")+'<input type="search" data-q value="'+esc(v||"")+'" placeholder="'+esc(ph||"Buscar…")+'" aria-label="Buscar"></label>';}
/* Seleção em pílula (período, ano, categoria) */
function selPil(rot,attrs,opts,v){return '<label class="sis-sel"><span class="vh">'+esc(rot)+'</span>'+selectHTML(attrs,opts,v)+'</label>';}
/* Indicadores: [{r, v, chip, cor, ico, href}] */
function kpis(l){
  return '<div class="kpis">'+l.map(function(k){var tg=k.href?"a":"div";
    return '<'+tg+' class="kpi"'+(k.href?' href="'+k.href+'"':'')+' style="--c:'+k.cor+'"><span class="kpi__topo"><span class="kpi__r">'+esc(k.r)+'</span><span class="kpi__ico">'+ik(k.ico)+'</span></span><b class="kpi__v">'+k.v+'</b>'+(k.chip?'<span class="kpi__chip">'+k.chip+'</span>':'')+'</'+tg+'>';
  }).join("")+'</div>';
}
function iniciais(n){return String(n||"?").split(/\s+/).filter(Boolean).slice(0,2).map(function(p){return p.charAt(0);}).join("").toUpperCase()||"?";}
function av(n,cl){return '<span class="av'+(cl?" "+cl:"")+'" aria-hidden="true">'+esc(iniciais(n))+'</span>';}
function plural(n,s,p){return n+" "+(n===1?s:(p||s+"s"));}
/* Lista em cartões: cada linha é um cartão branco com a cor do status na borda esquerda */
function tabela(cols,linhas,vazio,cor){
  if(!linhas.length)return '<p class="vazio-sis">'+esc(vazio)+'</p>';
  return '<table class="tab"><thead><tr>'+cols.map(function(c){return '<th class="'+(c.cl||"")+'">'+esc(c.r)+'</th>';}).join("")+'<th class="tab__seta"><span class="vh">Abrir</span></th></tr></thead><tbody>'+
    linhas.map(function(l){return '<tr data-id="'+esc(l.id)+'" style="--c:'+(cor?cor(l):"var(--pedra)")+'">'+cols.map(function(c,i){var v=c.v(l);return '<td class="'+(c.cl||"")+'" data-r="'+esc(c.r)+'">'+(i===0?'<button type="button" class="tab__abrir">'+v+'</button>':v)+'</td>';}).join("")+'<td class="tab__seta">'+ik("seta")+'</td></tr>';}).join("")+'</tbody></table>';
}
function aoClicarLinha(caixa,fn){caixa.addEventListener("click",function(e){var tr=e.target.closest("tr[data-id]");if(tr&&!e.target.closest("a"))fn(tr.getAttribute("data-id"));});}
function contem(q,campos){q=S.normal(q);if(!q)return true;return campos.some(function(c){return S.normal(c).indexOf(q)>=0;});}
function porData(a,b,k){return String(b[k]||"").localeCompare(String(a[k]||""));}
function nomeCliente(id){var c=id?St.get("clientes",id):null;return c?c.nome:"";}
function nomeParceiro(id){var p=id?St.get("parceiros",id):null;return p?(p.fornecedor||p.marca||p.produto||"Parceiro"):"";}
function soma(l,k){return l.reduce(function(s,x){return s+num(x[k]);},0);}
function linkCadastro(h){var u=S.cfg().siteUrl.replace(/#.*$/,"");return u+"#"+h;}
function caixaLink(rot,h){
  var u=linkCadastro(h);
  return '<section class="sis-link"><div><h2>'+esc(rot)+'</h2><p>Compartilhe este link: quando o cliente preencher, ele entra na lista abaixo.</p></div>'+
    '<div class="acoes"><a class="lnk" href="#'+h+'">Ver o formulário</a><button type="button" class="btn btn--escuro" data-copiar-link="'+esc(u)+'">'+ik("link")+'Copiar link</button></div>'+
    '<p class="sis-link__url">'+esc(u)+'</p></section>';
}
function ligarCopiarLink(raiz){$$("[data-copiar-link]",raiz).forEach(function(b){b.addEventListener("click",function(){S.copiar(b.getAttribute("data-copiar-link"));});});}
function carregando(m,vista,cols){
  cols=[].concat(cols);
  if(St.modo==="db"&&cols.some(function(c){return !St.carregado[c];})){m.innerHTML='<p class="vazio-sis" style="margin-top:var(--s-32)">Carregando…</p>';vista.vivo=true;return true;}
  return false;
}
function opcoesClientes(){return [["","— escolha um cliente —"]].concat(St.list("clientes").sort(function(a,b){return String(a.nome).localeCompare(String(b.nome));}).map(function(c){return [c.id,c.nome+(c.cidade?" · "+c.cidade:"")];}));}
var CATS_PARC=[["projeto","Projeto","#7D7A75"],["execucao","Execução","#6E7B62"],["loja","Loja","#5F6F7A"],["online","Online","#9A5B4E"],["marcas","Marcas","#7A7570"]];
function opcoesParceiros(){
  var todos=St.list("parceiros");
  return [["","— parceiro —"]].concat(CATS_PARC.map(function(c){
    return {grupo:c[1],itens:todos.filter(function(p){return p.cat===c[0];}).map(function(p){return [p.id,nomeParceiro(p.id)];})};
  }).filter(function(g){return g.itens.length;}));
}
function selectHTML(attrs,opts,v){
  return '<select '+attrs+'>'+opts.map(function(o){
    if(o&&o.grupo)return '<optgroup label="'+esc(o.grupo)+'">'+o.itens.map(function(x){return '<option value="'+esc(x[0])+'"'+(String(x[0])===String(v)?" selected":"")+'>'+esc(x[1])+'</option>';}).join("")+'</optgroup>';
    return '<option value="'+esc(o[0])+'"'+(String(o[0])===String(v)?" selected":"")+'>'+esc(o[1])+'</option>';
  }).join("")+'</select>';
}

/* ================= INÍCIO ================= */
M.inicio={vivo:true,render:function(m){
  var h=S.hoje(),lim=S.somaDias(h,30),mes=h.slice(0,7);
  var props=St.list("propostas"),cons=St.list("contratos"),prods=St.list("producoes"),tars=St.list("tarefas"),fin=St.list("financeiro");
  var avs=St.list("avisos").filter(function(a){return !a.enviado;}).sort(function(a,b){return porData(a,b,"criadoEm");});
  var novas=props.filter(function(p){return stProp(p)==="nova";}).length;
  var aAssinar=cons.filter(function(c){return c.status==="rascunho"||c.status==="enviado";}).length;
  var proxP=prods.filter(function(p){return p.status!=="cancelada"&&p.dataInicio>=h&&p.dataInicio<=lim;}).length;
  var abertas=tars.filter(function(t){return t.coluna!=="concluida";}).length;
  var doMes=fin.filter(function(f){return String(f.data).slice(0,7)===mes;});
  var ent=soma(doMes.filter(function(f){return f.tipo==="entrada"&&f.status==="pago";}),"valor"),sai=soma(doMes.filter(function(f){return f.tipo==="saida"&&f.status==="pago";}),"valor");
  var receber=soma(fin.filter(function(f){return f.tipo==="entrada"&&f.status==="pendente";}),"valor");
  var eventos=proximosEventos(6);
  var recentes=props.sort(function(a,b){return porData(a,b,"criadaEm");}).slice(0,5);
  m.innerHTML=cab("Início",esc(S.dataExtenso(h)))+
    kpis([
      {r:"Propostas novas",v:novas,chip:"Ver propostas",cor:"#5F6F7A",ico:"envio",href:"#adm/propostas"},
      {r:"Contratos sem assinatura",v:aAssinar,chip:"Ver contratos",cor:"#B08A3E",ico:"doc",href:"#adm/contratos"},
      {r:"Produções em 30 dias",v:proxP,chip:"Ver produções",cor:"#3E6B48",ico:"cal",href:"#adm/producoes"},
      {r:"Tarefas abertas",v:abertas,chip:"Ver tarefas",cor:"#7D7A75",ico:"tarefa",href:"#adm/tarefas"}])+
    '<section class="sis-sec"><h2>WhatsApp para enviar<small>Mensagens criadas pelos pedidos do site. No site com servidor, saem sozinhas.</small></h2><div class="itens">'+
      (avs.length?avs.map(function(a){
        var tel=a.tipo==="adm"?S.cfg().whatsappAdm:a.para;
        return '<div class="item"><b>'+(a.tipo==="adm"?"Para Shylton":"Para o cliente"+(a.nome?" · "+esc(a.nome):""))+' · '+esc(a.num||"")+'</b><span>'+esc(S.dataBR(a.criadoEm))+'</span><pre>'+esc(a.texto)+'</pre>'+
          '<div class="acoes"><a class="btn btn--linha" href="'+esc(S.waLink(tel,a.texto))+'" target="_blank" rel="noopener">Abrir no WhatsApp ↗</a><button type="button" class="lnk" data-enviado="'+esc(a.id)+'">Marcar como enviada</button>'+(a.propostaId?'<a class="lnk" href="#adm/proposta/'+esc(a.propostaId)+'">Ver proposta</a>':'')+'</div></div>';
      }).join(""):'<p class="nota">Nenhuma mensagem pendente.</p>')+'</div></section>'+
    '<section class="sis-sec"><h2>Próximos compromissos</h2><div class="itens">'+(eventos.length?eventos.map(itemEvento).join(""):'<p class="nota">Nada marcado. <a class="lnk" href="#adm/calendario">Abrir o calendário</a></p>')+'</div></section>'+
    '<section class="sis-sec"><h2>Propostas recentes</h2><div class="itens">'+(recentes.length?recentes.map(function(p){return '<a class="item" href="#adm/proposta/'+esc(p.id)+'"><b>'+esc(p.num)+' · '+esc(p.cliente&&p.cliente.nome||"Sem nome")+'</b><span>'+brl(p.valor)+'</span><span>'+esc(S.FINALIDADES[p.finalidade]||"")+' · '+esc(S.listaAmbientes(p)||"sem ambientes")+'</span>'+S.tag("proposta",p.status)+'</a>';}).join(""):'<p class="nota">Ainda não há propostas. Elas chegam pelo formulário do Contato no site ou em <a class="lnk" href="#adm/proposta/nova">Nova proposta</a>.</p>')+'</div></section>'+
    '<section class="sis-sec"><h2>Financeiro do mês</h2><div class="totais"><span>Entradas <b class="pos">'+brl(ent)+'</b></span><span>Saídas <b class="neg">'+brl(sai)+'</b></span><span>Saldo <b>'+brl(ent-sai)+'</b></span><span>A receber <b>'+brl(receber)+'</b></span></div></section>';
  $$("[data-enviado]",m).forEach(function(b){b.addEventListener("click",function(){
    var a=St.copia("avisos",b.getAttribute("data-enviado"));if(!a)return;a.enviado=true;a.enviadoEm=S.agoraISO();
    St.salvar("avisos",a.id,a).then(function(){S.toast("Marcada como enviada.");},S.erroGravar);
  });});
  $$("[data-evento]",m).forEach(function(b){b.addEventListener("click",function(){verEvento(b.getAttribute("data-evento"));});});
}};

/* ================= PROPOSTAS ================= */
var fProp={st:"todas",q:""};
function stProp(p){return p.status==="revisao"?"nova":p.status;} /* "Em revisão" saiu: propostas antigas contam como Nova */
M.propostas={render:function(m,id,vista){
  m.innerHTML=cab("Propostas","Os pedidos do <b>Contato</b> no site chegam aqui já calculados pela <b>tabela de preços</b>. Revise, ajuste e envie. Acompanhe as propostas <b>em aberto</b>, <b>aceitas</b> e <b>recusadas</b>.",'<a class="btn btn--linha" href="#adm/ajustes">Tabela de preços</a><a class="btn btn--escuro" href="#adm/proposta/nova">+ Nova proposta</a>')+
    '<div id="prop-kpis"></div><div class="sis-barra">'+pilulas(comCor("proposta",["todas","Todas"]),fProp.st,"data-st","Status")+busca(fProp.q,"Buscar cliente ou número…")+'</div><div id="sis-lista"></div>';
  ligarPil(m,"data-st",function(v){fProp.st=v;vista.atualizar();});
  $("[data-q]",m).addEventListener("input",function(e){fProp.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){location.hash="#adm/proposta/"+id;});
  vista.atualizar=function(){
    var todas=St.list("propostas");
    function de(sts){var x=todas.filter(function(p){return sts.indexOf(stProp(p))>=0;});return {n:x.length,v:soma(x,"valor")};}
    var ab=de(["nova","enviada"]),ac=de(["aceita"]),re=de(["recusada"]),dec=ac.n+re.n;
    $("#prop-kpis",m).innerHTML=kpis([
      {r:"Em aberto",v:brl(ab.v),chip:plural(ab.n,"proposta"),cor:"#5F6F7A",ico:"envio"},
      {r:"Aceitas",v:brl(ac.v),chip:plural(ac.n,"proposta"),cor:"#3E6B48",ico:"ok"},
      {r:"Recusadas",v:brl(re.v),chip:plural(re.n,"proposta"),cor:"#9A3B2E",ico:"x"},
      {r:"Taxa de fechamento",v:(dec?Math.round(ac.n/dec*100):0)+"%",chip:dec?"de "+plural(dec,"decidida"):"Nenhuma decidida",cor:"#B08A3E",ico:"grafico"}]);
    contarPil(m,"data-st",function(v){return v==="todas"?todas.length:todas.filter(function(p){return stProp(p)===v;}).length;});
    var l=todas.filter(function(p){var c=p.cliente||{};return (fProp.st==="todas"||stProp(p)===fProp.st)&&contem(fProp.q,[p.num,c.nome,c.empresa,c.local,c.email]);}).sort(function(a,b){return porData(a,b,"criadaEm");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Cliente",v:function(p){var c=p.cliente||{};return esc(c.nome||"Sem nome")+'<small>'+esc(p.num)+(c.empresa?' · '+esc(c.empresa):'')+'</small>';}},
      {r:"Finalidade",v:function(p){return esc(S.FINALIDADES[p.finalidade]||"—");},cl:"sec"},
      {r:"Ambientes",v:function(p){return esc(S.listaAmbientes(p)||"—");}},
      {r:"Data sugerida",v:function(p){return esc(S.dataBR(p.dataSugerida)||"—");},cl:"sec"},
      {r:"Valor",v:function(p){return brl(p.valor);},cl:"num"},
      {r:"Status",v:function(p){return S.tag("proposta",stProp(p))+(p.origem==="site"?'<small class="sec">pelo site</small>':'');}}
    ],l,todas.length?"Nenhuma proposta com esse filtro.":"Ainda não há propostas. Elas chegam pelo formulário do Contato no site, ou crie uma em Nova proposta.",function(p){return corSt("proposta",stProp(p));});
  };
  if(!carregando($("#sis-lista",m),vista,"propostas"))vista.atualizar();
}};

M.proposta={render:function(m,id,vista){
  var ed;
  if(carregando(m,vista,["propostas","clientes","config"]))return;
  if(id==="nova"){ed=S.novaProposta();}
  else{
    ed=St.copia("propostas",id);
    if(!ed){m.innerHTML=cab("Proposta não encontrada","",'',["#adm/propostas","Propostas"]);return;}
    ed.status=stProp(ed);
  }
  vista.vivo=false;
  var temAssets=false;S.usar("assets").then(function(a){temAssets=!!a&&St.modo==="db";var b=temAssets&&$("#ed-amb",m);if(b)b.innerHTML=ambHTML();});
  var aba="slides";
  function camposCliente(){return [
    {k:"cliente.nome",r:"Nome do cliente",req:1},{k:"cliente.empresa",r:"Empresa ou projeto",ph:"Ex.: REVEEV"},
    {k:"cliente.codigo",r:"Código ou evento",ph:"Ex.: MT26"},{k:"cliente.local",r:"Localização",ph:"Cidade/UF"},
    {k:"cliente.telefone",r:"WhatsApp",t:"tel"},{k:"cliente.email",r:"E-mail",t:"email"}];}
  function ambHTML(){
    return ed.ambientes.map(function(a,i){
      var fotos=(a.fotos||[]);
      return '<div class="rep__lin" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr) auto" data-ai="'+i+'">'+
        '<label class="f">Ambiente<input type="text" data-ak="nome" value="'+esc(a.nome)+'" placeholder="Ex.: sala de estar"></label>'+
        '<label class="f">m²<input type="text" inputmode="decimal" data-ak="m2" value="'+esc(a.m2)+'"></label>'+
        '<button type="button" class="rep__x" data-rem-amb="'+i+'">Remover</button>'+
        (fotos.length?'<div class="miniaturas">'+fotos.map(function(f){var u=S.urlArquivo(f);return u?'<a href="'+u+'" target="_blank" rel="noopener"><img src="'+u+'" alt="'+esc(f.nome)+'" loading="lazy"></a>':'<span>'+esc(f.nome)+'</span>';}).join("")+'</div>':'')+
        (temAssets?'<label class="f f--full" style="grid-column:1/-1">Adicionar fotos<input type="file" accept="image/*" multiple data-fotos="'+i+'"></label>':'')+
      '</div>';
    }).join("");
  }
  function arquivosHTML(){
    var l=ed.arquivos||[];
    return l.length?'<div class="miniaturas">'+l.map(function(f){var u=S.urlArquivo(f);return u?'<a class="lnk" href="'+u+'" target="_blank" rel="noopener">'+esc(f.nome)+' ↗</a>':'<span>'+esc(f.nome)+(f.nota?' · '+esc(f.nota):'')+'</span>';}).join("")+'</div>':'<p class="nota">Nenhum arquivo de projeto enviado.</p>';
  }
  function calcHTML(){
    var r=S.calcular(ed);
    return r.itens.map(function(i){return '<li><span>'+esc(i.rot)+'</span><span>'+brl(i.v)+'</span></li>';}).join("")+'<li class="total"><span>Valor calculado (arredondado)</span><span>'+brl(r.total)+'</span></li>';
  }
  function desenhar(){
    var novo=!ed.id;
    m.innerHTML=cab(novo?"Nova proposta":"Proposta "+ed.num,novo?"Preencha os dados; o valor é calculado pela tabela de Ajustes.":esc((ed.origem==="site"?"Pedido pelo site":"Criada na área restrita")+" em "+S.dataBR(ed.criadaEm)),
      '<label class="f" style="min-width:180px">Status'+selectHTML('data-k="status"',S.opcoes("proposta"),ed.status)+'</label>'+
      '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>Salvar</button><button type="button" class="btn btn--linha" data-pdf>Baixar PDF</button><button type="button" class="lnk" data-imprimir>Imprimir</button><button type="button" class="lnk" data-contrato>Gerar contrato</button>'+(novo?'':'<button type="button" class="lnk lnk--perigo" data-excluir>Excluir</button>')+'</div>',
      ["#adm/propostas","Propostas"])+
    '<div class="ed"><div class="ed__form" id="ed-form">'+
      '<section class="ed__bloco"><h2>Cliente</h2><div class="fgrid"><label class="f f--full">Vincular a um cliente cadastrado'+selectHTML('data-vinc',opcoesClientes(),ed.clienteId)+'</label>'+S.campos(camposCliente(),ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>Pedido</h2><div class="fgrid">'+S.campos([
        {k:"finalidade",r:"Finalidade",t:"select",o:[["foto","Produção para foto"],["cliente","Cliente final"],["mostra","Exposição ou mostra"]]},
        {k:"dataSugerida",r:"Data sugerida",t:"date"},{k:"temProjeto",r:"Tem projeto ou arquivo do SketchUp",t:"check",full:1}],ed)+
        '<div class="f f--full">Arquivos de projeto'+arquivosHTML()+'</div>'+
        S.campos([{k:"mensagem",r:"Mensagem do cliente",t:"area",full:1}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>Ambientes</h2><div class="rep" id="ed-amb">'+ambHTML()+'</div><p style="margin-top:var(--s-12)"><button type="button" class="lnk" data-add-amb>+ Adicionar ambiente</button></p></section>'+
      '<section class="ed__bloco"><h2>Calculadora<small>valores-base em <a class="lnk" href="#adm/ajustes">Ajustes</a></small></h2><ul class="calc" id="ed-calc">'+calcHTML()+'</ul><div class="fgrid">'+S.campos([
        {k:"valor",r:"Valor da proposta (R$)",t:"money"},{k:"valorManual",r:"Usar valor manual (não recalcular)",t:"check"},
        {k:"dias",r:"Prazo de execução (dias)",t:"number"},{k:"ajudantes",r:"Ajudantes",t:"number"}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>Texto da proposta</h2><div class="fgrid">'+S.campos([
        {k:"data",r:"Data da proposta",t:"date"},{k:"pagamento",r:"Forma de pagamento"},
        {k:"etapas",r:"Etapas",full:1},
        {k:"contexto",r:"Contexto (opcional)",full:1,ph:"Ex.: para o espaço da REVEEV projetado por Manu P.",ajuda:"Completa a frase “Apresentamos as condições para a produção… mencionados na proposta”."},
        {k:"tituloInvest",r:"Título do investimento",full:1,ph:"Ex.: Quarto REVEEV - Manu Pagliosa"},
        {k:"exclusoes",r:"Exclusões",t:"area",full:1},
        {k:"observacoes",r:"Observações (uma por linha)",t:"area",full:1,alt:120},
        {k:"creditos",r:"Observação em destaque (vermelho)",full:1}],ed)+'</div></section>'+
    '</div><aside class="ed__prev"><div class="abas-mini" role="tablist"><button type="button" role="tab" data-aba="slides" aria-selected="'+(aba==="slides")+'">Proposta</button><button type="button" role="tab" data-aba="whats" aria-selected="'+(aba==="whats")+'">WhatsApp</button></div><div class="ed__prev-corpo" id="ed-prev"></div></aside></div>';
    ligar();previa();
  }
  var previa=S.debounce(function(){
    var box=$("#ed-prev",m);if(!box)return;
    if(aba==="slides"){box.innerHTML='<div class="slides">'+S.slidesHTML(ed)+'</div>';return;}
    var c=ed.cliente||{};
    box.innerHTML='<div class="itens">'+
      '<div class="item"><b>Para Shylton</b><span>'+esc(S.cfg().whatsappAdm)+'</span><pre>'+esc(S.msgAdm(ed))+'</pre><div class="acoes"><a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(S.waLink(S.cfg().whatsappAdm,S.msgAdm(ed)))+'">Abrir no WhatsApp ↗</a></div></div>'+
      '<div class="item"><b>Para o cliente</b><span>'+esc(c.telefone||"sem telefone")+'</span><pre>'+esc(S.msgCliente(ed))+'</pre><div class="acoes">'+(c.telefone?'<a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(S.waLink(c.telefone,S.msgCliente(ed)))+'">Enviar ao cliente ↗</a>':'<span class="nota">Informe o WhatsApp do cliente.</span>')+'</div></div>'+
      '<p class="nota">No site com servidor, essas duas mensagens saem sozinhas quando o pedido chega. Aqui, os botões abrem o WhatsApp com o texto pronto.</p></div>';
  },180);
  function recalc(mudouAmb){
    var r=S.calcular(ed);
    if(mudouAmb){ed.dias=r.dias;ed.ajudantes=r.ajudantes;var d=$('[data-k="dias"]',m),a=$('[data-k="ajudantes"]',m);if(d)d.value=r.dias;if(a)a.value=r.ajudantes;}
    if(!ed.valorManual){ed.valor=r.total;var v=$('[data-k="valor"]',m);if(v&&document.activeElement!==v)v.value=S.fmtValor(r.total);}
    var c=$("#ed-calc",m);if(c)c.innerHTML=calcHTML();
    previa();
  }
  function salvar(){
    var f=$("#ed-form",m);if(!S.validar(f))return Promise.reject({code:"validacao"});
    var corpo=S.clone(ed),pid=ed.id;delete corpo.id;
    return St.salvar("propostas",pid||null,corpo).then(function(nid){ed.id=nid;S.toast("Proposta salva.");if(!pid)history.replaceState(null,"","#adm/proposta/"+nid);return nid;});
  }
  function ligar(){
    $("[data-salvar]",m).addEventListener("click",function(){var novo=!ed.id;salvar().then(function(){if(novo)desenhar();},function(e){if(!e||e.code!=="validacao")S.erroGravar(e);});});
    $("[data-pdf]",m).addEventListener("click",function(){S.propostaPDF(ed);});
    $("[data-imprimir]",m).addEventListener("click",function(){S.imprimirProposta(ed);});
    $("[data-contrato]",m).addEventListener("click",function(){gerarContrato();});
    var x=$("[data-excluir]",m);if(x)x.addEventListener("click",function(){if(!window.confirm("Excluir a proposta "+ed.num+"?"))return;St.excluir("propostas",ed.id).then(function(){location.hash="#adm/propostas";},S.erroGravar);});
    $("[data-add-amb]",m).addEventListener("click",function(){ed.ambientes.push({nome:"",m2:"",fotos:[]});$("#ed-amb",m).innerHTML=ambHTML();recalc(true);});
    $("#ed-amb",m).addEventListener("click",function(e){var b=e.target.closest("[data-rem-amb]");if(!b)return;ed.ambientes.splice(+b.getAttribute("data-rem-amb"),1);if(!ed.ambientes.length)ed.ambientes.push({nome:"",m2:"",fotos:[]});$("#ed-amb",m).innerHTML=ambHTML();recalc(true);});
    $$("[data-aba]",m).forEach(function(b){b.addEventListener("click",function(){aba=b.getAttribute("data-aba");$$("[data-aba]",m).forEach(function(x){x.setAttribute("aria-selected",x===b?"true":"false");});previa();});});
  }
  function aoMudar(e){
    var t=e.target;
    if(t.hasAttribute("data-vinc")&&e.type==="change"){
      var c=t.value?St.get("clientes",t.value):null;ed.clienteId=t.value;
      if(c){ed.cliente.nome=c.nome||"";ed.cliente.email=c.email||"";ed.cliente.telefone=c.telefone||"";ed.cliente.local=[c.cidade,c.uf].filter(Boolean).join("/");
        ["nome","email","telefone","local"].forEach(function(k){var i=$('[data-k="cliente.'+k+'"]',m);if(i)i.value=ed.cliente[k];});}
      recalc();return;
    }
    if(t.hasAttribute("data-fotos")&&e.type==="change"){
      var i=+t.getAttribute("data-fotos"),fs=Array.prototype.slice.call(t.files||[]);if(!fs.length)return;
      S.toast("Enviando fotos…");
      fs.reduce(function(p,f){return p.then(function(){return S.subir(f).then(function(r){ed.ambientes[i].fotos=(ed.ambientes[i].fotos||[]).concat([r]);});});},Promise.resolve())
        .then(function(){$("#ed-amb",m).innerHTML=ambHTML();S.toast("Fotos adicionadas. Salve a proposta.");});
      return;
    }
    if(t.hasAttribute("data-ak")){var lin=t.closest("[data-ai]");ed.ambientes[+lin.getAttribute("data-ai")][t.getAttribute("data-ak")]=t.value;recalc(e.type==="change");return;}
    var k=t.getAttribute("data-k");if(!k)return;
    var v=t.type==="checkbox"?t.checked:t.value;
    if(t.getAttribute("data-num"))v=num(v);
    S.setPath(ed,k,v);
    if(k==="valor"&&e.type==="input"){ed.valorManual=true;var vm=$('[data-k="valorManual"]',m);if(vm)vm.checked=true;}
    if(k==="valor"&&e.type==="change")t.value=S.fmtValor(ed.valor);
    if(k==="valorManual"&&!v){recalc();return;}
    if(k==="dias"||k==="ajudantes"||k==="valor"){previa();var c2=$("#ed-calc",m);if(c2)c2.innerHTML=calcHTML();return;}
    recalc();
  }
  function gerarContrato(){
    salvar().then(function(pid){
      var cli=ed.cliente||{};
      var pc=ed.clienteId?Promise.resolve(ed.clienteId):St.salvar("clientes",null,{tipo:"PF",nome:cli.nome,email:cli.email,telefone:cli.telefone,cidade:cli.local,origem:"Proposta "+ed.num,criadoEm:S.agoraISO()});
      return pc.then(function(cid){
        ed.clienteId=cid;ed.status="aceita";var corpo=S.clone(ed);delete corpo.id;
        return St.salvar("propostas",pid,corpo).then(function(){
          var c=S.cfg().contrato;
          return St.salvar("contratos",null,{num:S.proxNum("contratos","C"),status:"rascunho",clienteId:cid,propostaId:pid,criadoEm:S.agoraISO(),
            campos:{finalidade:ed.finalidade,ambientes:S.listaAmbientes(ed),enderecoServico:"",dataInicio:ed.dataSugerida||"",dias:ed.dias,ajudantes:ed.ajudantes,dataDesmontagem:"",valor:ed.valor,
              pagamentoTipo:S.normal(ed.pagamento).indexOf("vista")>=0?"vista":"sinal",sinal:c.sinal,pagamentoOutro:"",pix:"",limiteDespesa:c.limiteDespesa,diaria:c.diaria,
              prazoConceito:c.prazoConceito,prazoAprovacao:c.prazoAprovacao,revisoes:c.revisoes,diasCancel:c.diasCancel,retencao:c.retencao,retencaoMax:c.retencaoMax,
              prazoFotos:c.prazoFotos,multaFotos:c.multaFotos,foro:c.foro,cidade:c.cidade,dataAssinatura:S.hoje()}});
        });
      }).then(function(id){S.toast("Contrato criado. Complete os dados do cliente.");location.hash="#adm/contrato/"+id;});
    },function(e){if(!e||e.code!=="validacao")S.erroGravar(e);});
  }
  m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);
  desenhar();
}};

/* ================= CONTRATOS ================= */
var fCon={st:"todos",q:"",ano:"todos"};
function stCon(c){return c.status==="concluido"?"assinado":c.status;} /* Concluído saiu: contratos antigos contam como Assinado */
M.contratos={render:function(m,id,vista){
  var anos=[];St.list("contratos").forEach(function(c){var a=String(c.criadoEm||"").slice(0,4);if(a&&anos.indexOf(a)<0)anos.push(a);});anos.sort().reverse();
  m.innerHTML=cab("Contratos",'Modelo revisado a partir do contrato base. <a class="lnk" href="#adm/revisao">Ver a revisão jurídica</a>',selPil("Ano","data-ano",[["todos","Todos os anos"]].concat(anos.map(function(a){return [a,a];})),fCon.ano)+'<a class="btn btn--escuro" href="#adm/contrato/novo">+ Novo contrato</a>')+
    '<div class="sis-barra">'+pilulas(comCor("contrato",["todos","Todos"]),fCon.st,"data-st","Status")+busca(fCon.q,"Buscar cliente ou número…")+'</div><div id="sis-lista"></div>';
  ligarPil(m,"data-st",function(v){fCon.st=v;vista.atualizar();});
  $("[data-q]",m).addEventListener("input",function(e){fCon.q=e.target.value;vista.atualizar();});
  $("[data-ano]",m).addEventListener("change",function(e){fCon.ano=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){location.hash="#adm/contrato/"+id;});
  vista.atualizar=function(){
    var doAno=St.list("contratos").filter(function(c){return fCon.ano==="todos"||String(c.criadoEm).slice(0,4)===fCon.ano;});
    contarPil(m,"data-st",function(v){return v==="todos"?doAno.length:doAno.filter(function(c){return stCon(c)===v;}).length;});
    var l=doAno.filter(function(c){return (fCon.st==="todos"||stCon(c)===fCon.st)&&contem(fCon.q,[c.num,nomeCliente(c.clienteId),c.campos&&c.campos.ambientes]);}).sort(function(a,b){return porData(a,b,"criadoEm");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Cliente",v:function(c){return esc(nomeCliente(c.clienteId)||"Sem cliente")+'<small>'+esc(c.num)+'</small>';}},
      {r:"Ambientes",v:function(c){return esc((c.campos||{}).ambientes||"—");},cl:"sec"},
      {r:"Início",v:function(c){return esc(S.dataBR((c.campos||{}).dataInicio)||"—");},cl:"sec"},
      {r:"Valor",v:function(c){return brl((c.campos||{}).valor);},cl:"num"},
      {r:"Pendências",v:function(c){var f=S.faltando(c).length;return f?'<span class="neg">'+f+' dado'+(f>1?'s':'')+' a preencher</span>':'<span class="pos">Completo</span>';}},
      {r:"Status",v:function(c){return S.tag("contrato",stCon(c));}}
    ],l,St.list("contratos").length?"Nenhum contrato com esse filtro.":"Ainda não há contratos. Gere um a partir de uma proposta ou em Novo contrato.",function(c){return corSt("contrato",stCon(c));});
  };
  if(!carregando($("#sis-lista",m),vista,"contratos"))vista.atualizar();
}};

M.revisao={render:function(m){
  m.innerHTML=cab("Revisão do contrato base","Leitura do contrato com Alexandre Oltramari (junho de 2024) e o que mudou no modelo usado pelo sistema. Revisão feita com base na legislação brasileira; antes de usar, peça a um advogado para validar.",'<a class="btn btn--linha" href="#adm/contrato/novo">Abrir o modelo revisado</a>',["#adm/contratos","Contratos"])+S.revisaoHTML();
}};

M.contrato={render:function(m,id,vista){
  var ed;
  if(carregando(m,vista,["contratos","clientes","propostas","config"]))return;
  if(id==="novo"){var c0=S.cfg().contrato;ed={num:S.proxNum("contratos","C"),status:"rascunho",clienteId:"",propostaId:"",criadoEm:S.agoraISO(),campos:Object.assign({finalidade:"foto",ambientes:"",enderecoServico:"",dataInicio:"",dias:2,ajudantes:1,dataDesmontagem:"",valor:0,pagamentoTipo:"sinal",pagamentoOutro:"",pix:"",dataAssinatura:S.hoje()},c0)};}
  else{ed=St.copia("contratos",id);if(!ed){m.innerHTML=cab("Contrato não encontrado","",'',["#adm/contratos","Contratos"]);return;}ed.status=stCon(ed);}
  vista.vivo=false;
  var aba="contrato";
  function propOpts(){return [["","— sem proposta —"]].concat(St.list("propostas").sort(function(a,b){return porData(a,b,"criadaEm");}).map(function(p){return [p.id,p.num+" · "+((p.cliente&&p.cliente.nome)||"")+" · "+brl(p.valor)];}));}
  function desenhar(){
    var cli=ed.clienteId?St.get("clientes",ed.clienteId):null;
    m.innerHTML=cab("Contrato "+ed.num,cli?esc(cli.nome):"Escolha o cliente e complete os dados.",
      '<label class="f" style="min-width:200px">Status'+selectHTML('data-k="status"',S.opcoes("contrato"),ed.status)+'</label>'+
      '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>Salvar</button><button type="button" class="btn btn--linha" data-docx>Baixar .docx</button><button type="button" class="lnk" data-parcelas>Lançar parcelas no financeiro</button><button type="button" class="lnk" data-producao>Criar produção</button>'+(ed.id?'<button type="button" class="lnk lnk--perigo" data-excluir>Excluir</button>':'')+'</div>',
      ["#adm/contratos","Contratos"])+
    '<div class="ed ed--meio"><div class="ed__form" id="ed-form">'+
      '<section class="ed__bloco"><h2>Partes</h2><div class="fgrid">'+
        '<label class="f f--full">Cliente (contratante)'+selectHTML('data-cli',opcoesClientes(),ed.clienteId)+'</label>'+
        '<div class="acoes f--full"><button type="button" class="lnk" data-editar-cli'+(cli?'':' hidden')+'>Completar dados do cliente</button><button type="button" class="lnk" data-novo-cli>+ Cadastrar cliente</button><button type="button" class="lnk" data-copiar-link="'+esc(linkCadastro("cadastro-cliente"))+'">Copiar link para o cliente preencher</button></div>'+
        '<label class="f f--full">Proposta (Anexo I)'+selectHTML('data-prop',propOpts(),ed.propostaId)+'<small>Ao escolher, ambientes, valor, prazo e data vêm da proposta.</small></label>'+
        '<p class="nota f--full">Seus dados de contratado (CPF, CAU, endereço, PIX) ficam em <a class="lnk" href="#adm/ajustes">Ajustes</a>.</p>'+
      '</div></section>'+
      '<section class="ed__bloco"><h2>Serviço</h2><div class="fgrid">'+S.campos([
        {k:"campos.finalidade",r:"Finalidade",t:"select",o:[["foto","Produção para foto"],["cliente","Cliente final"],["mostra","Exposição ou mostra"]]},
        {k:"campos.dataInicio",r:"Início da produção",t:"date"},
        {k:"campos.ambientes",r:"Ambientes",full:1},
        {k:"campos.enderecoServico",r:"Endereço da produção",full:1,ph:"Se vazio, usa o endereço do cliente"},
        {k:"campos.dias",r:"Dias de trabalho",t:"number"},{k:"campos.ajudantes",r:"Ajudantes",t:"number"},
        {k:"campos.dataDesmontagem",r:"Desmontagem e devolução das peças",t:"date"}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>Valor e pagamento</h2><div class="fgrid">'+S.campos([
        {k:"campos.valor",r:"Valor total (R$)",t:"money"},
        {k:"campos.pagamentoTipo",r:"Forma",t:"select",o:[["sinal","Sinal + saldo"],["vista","À vista na assinatura"],["outro","Outra"]]},
        {k:"campos.sinal",r:"Sinal (%)",t:"pct"},{k:"campos.pix",r:"Chave PIX",ph:"Se vazio, usa a de Ajustes"},
        {k:"campos.pagamentoOutro",r:"Outra forma (texto)",full:1},
        {k:"campos.limiteDespesa",r:"Despesa sem aprovação escrita até (R$)",t:"money"},{k:"campos.diaria",r:"Dia extra de trabalho (R$)",t:"money"}],ed)+
        '<p class="nota f--full">Ao marcar <b>Assinado</b>, os recebimentos vão sozinhos para o <a class="lnk" href="#adm/financeiro">Financeiro</a> em A receber: o sinal (ou o valor à vista) na data da assinatura e o saldo no início da produção.</p></div></section>'+
      '<section class="ed__bloco"><h2>Prazos e condições</h2><div class="fgrid">'+S.campos([
        {k:"campos.prazoConceito",r:"Entrega do conceito (dias)",t:"number"},{k:"campos.prazoAprovacao",r:"Prazo para aprovar (dias)",t:"number"},
        {k:"campos.revisoes",r:"Rodadas de ajuste",t:"number"},{k:"campos.diasCancel",r:"Antecedência para cancelar (dias)",t:"number"},
        {k:"campos.retencao",r:"Retenção no cancelamento (%)",t:"pct"},{k:"campos.retencaoMax",r:"Retenção máxima em cima da hora (%)",t:"pct"},
        {k:"campos.prazoFotos",r:"Prazo para enviar as fotos (dias)",t:"number"},{k:"campos.multaFotos",r:"Multa se não enviar (%)",t:"pct"}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>Assinatura</h2><div class="fgrid">'+S.campos([
        {k:"campos.cidade",r:"Cidade"},{k:"campos.dataAssinatura",r:"Data",t:"date"},{k:"campos.foro",r:"Foro (comarca)",full:1}],ed)+'</div></section>'+
    '</div><aside class="ed__prev"><div class="abas-mini" role="tablist"><button type="button" role="tab" data-aba="contrato" aria-selected="'+(aba==="contrato")+'">Contrato</button><button type="button" role="tab" data-aba="revisao" aria-selected="'+(aba==="revisao")+'">O que mudou no modelo</button></div><p class="nota" id="ed-falta" style="margin-bottom:var(--s-12)"></p><div class="ed__prev-corpo" id="ed-prev"></div></aside></div>';
    ligar();previa();
  }
  var previa=S.debounce(function(){
    var box=$("#ed-prev",m),fl=$("#ed-falta",m);if(!box)return;
    var f=S.faltando(ed);
    fl.innerHTML=f.length?'<b>Falta preencher:</b> '+esc(f.join(", "))+'. Os campos aparecem destacados no texto.':'<span class="pos">Contrato completo, pronto para baixar e enviar para assinatura.</span>';
    box.innerHTML=aba==="contrato"?S.contratoHTML(ed):S.revisaoHTML();
  },160);
  /* Assinado → recebimentos entram sozinhos em "A receber" no Financeiro (uma vez por contrato; flag finLancado) */
  function salvar(){
    var lancar=false;
    if(ed.status==="assinado"&&!ed.finLancado&&num(ed.campos.valor)){
      ed.finLancado=true;
      lancar=!ed.id||!St.list("financeiro").some(function(f){return f.contratoId===ed.id;});
    }
    var corpo=S.clone(ed),cid=ed.id;delete corpo.id;
    return St.salvar("contratos",cid||null,corpo).then(function(nid){ed.id=nid;if(!cid)history.replaceState(null,"","#adm/contrato/"+nid);
      if(!lancar){S.toast(ed.status==="assinado"&&!num(ed.campos.valor)?"Contrato salvo. Informe o valor para os recebimentos irem ao Financeiro.":"Contrato salvo.");return nid;}
      var l=parcelas(nid);
      return gravarFin(l).then(function(){S.toast("Contrato assinado. No Financeiro, a receber: "+l.map(function(x){return x.rot+" "+brl(x.valor)+" em "+S.dataBR(x.data);}).join(" e ")+".");return nid;});
    });
  }
  function parcelas(cid){
    var c=ed.campos,total=num(c.valor),nome=nomeCliente(ed.clienteId)||"cliente",base={tipo:"entrada",status:"pendente",forma:"PIX",contratoId:cid,criadoEm:S.agoraISO()},l=[];
    if(c.pagamentoTipo==="sinal"){var a=Math.round(total*(num(c.sinal)||50))/100;
      l.push(Object.assign({rot:"sinal"},base,{data:c.dataAssinatura||S.hoje(),descricao:"Sinal · contrato "+ed.num+" · "+nome,categoria:"Sinal de contrato",valor:a}));
      l.push(Object.assign({rot:"saldo"},base,{data:c.dataInicio||c.dataAssinatura||S.hoje(),descricao:"Saldo · contrato "+ed.num+" · "+nome,categoria:"Produção",valor:Math.round((total-a)*100)/100}));}
    else l.push(Object.assign({rot:"total"},base,{data:c.pagamentoTipo==="vista"?(c.dataAssinatura||S.hoje()):(c.dataInicio||c.dataAssinatura||S.hoje()),descricao:"Contrato "+ed.num+" · "+nome,categoria:"Produção",valor:total}));
    return l;
  }
  function gravarFin(l){return l.reduce(function(p,x){var y=Object.assign({},x);delete y.rot;return p.then(function(){return St.salvar("financeiro",null,y);});},Promise.resolve());}
  function ligar(){
    $("[data-salvar]",m).addEventListener("click",function(){salvar().then(function(){var x=$("[data-excluir]",m);if(!x)desenhar();},S.erroGravar);});
    $("[data-docx]",m).addEventListener("click",function(){var f=S.faltando(ed);if(f.length&&!window.confirm("Ainda faltam "+f.length+" dado(s). Eles vão aparecer destacados em amarelo no .docx. Baixar mesmo assim?"))return;S.contratoDocx(ed);});
    $("[data-parcelas]",m).addEventListener("click",lancarParcelas);
    $("[data-producao]",m).addEventListener("click",criarProducao);
    var x=$("[data-excluir]",m);if(x)x.addEventListener("click",function(){if(!window.confirm("Excluir o contrato "+ed.num+"?"))return;St.excluir("contratos",ed.id).then(function(){location.hash="#adm/contratos";},S.erroGravar);});
    $("[data-novo-cli]",m).addEventListener("click",function(){S.modalCliente(null,function(id){ed.clienteId=id;desenhar();});});
    $("[data-editar-cli]",m).addEventListener("click",function(){S.modalCliente(ed.clienteId,function(){previa();});});
    ligarCopiarLink(m);
    $$("[data-aba]",m).forEach(function(b){b.addEventListener("click",function(){aba=b.getAttribute("data-aba");$$("[data-aba]",m).forEach(function(x){x.setAttribute("aria-selected",x===b?"true":"false");});previa();});});
  }
  function aoMudar(e){
    var t=e.target;
    if(t.hasAttribute("data-cli")){if(e.type!=="change")return;ed.clienteId=t.value;var b=$("[data-editar-cli]",m);if(b)b.hidden=!t.value;previa();return;}
    if(t.hasAttribute("data-prop")){
      if(e.type!=="change")return;ed.propostaId=t.value;var p=t.value?St.get("propostas",t.value):null;
      if(p){var c=ed.campos;c.finalidade=p.finalidade;c.ambientes=S.listaAmbientes(p);c.valor=p.valor;c.dias=p.dias;c.ajudantes=p.ajudantes;if(p.dataSugerida)c.dataInicio=p.dataSugerida;if(p.clienteId&&!ed.clienteId)ed.clienteId=p.clienteId;
        c.pagamentoTipo=S.normal(p.pagamento).indexOf("vista")>=0?"vista":(c.pagamentoTipo||"sinal");desenhar();}
      else previa();
      return;
    }
    var k=t.getAttribute("data-k");if(!k)return;
    var v=t.type==="checkbox"?t.checked:t.value;if(t.getAttribute("data-num"))v=v===""?"":num(v);
    S.setPath(ed,k,v);
    if(e.type==="change"&&k==="campos.valor")t.value=S.fmtValor(v);
    if(e.type==="change"&&k==="status"&&v==="assinado"){salvar().then(function(){if(!$("[data-excluir]",m))desenhar();},S.erroGravar);return;}
    previa();
  }
  function lancarParcelas(){
    if(!num(ed.campos.valor)){S.toast("Informe o valor do contrato.");return;}
    ed.finLancado=true;
    salvar().then(function(cid){
      var ja=St.list("financeiro").filter(function(f){return f.contratoId===cid;});
      if(ja.length&&!window.confirm("Já existem "+ja.length+" lançamento(s) deste contrato no financeiro. Lançar de novo?"))return;
      var l=parcelas(cid);
      return gravarFin(l).then(function(){S.toast(l.length+" lançamento(s) criados como pendentes no Financeiro.");});
    },S.erroGravar);
  }
  function criarProducao(){
    if(ed.status!=="assinado"&&ed.status!=="concluido"){S.toast("Marque o contrato como Assinado para criar a produção.");return;}
    salvar().then(function(cid){
      var c=ed.campos,cli=St.get("clientes",ed.clienteId),d=Math.max(1,Math.round(num(c.dias)||1));
      return St.salvar("producoes",null,{titulo:(cli?cli.nome:"Produção")+(c.ambientes?" · "+c.ambientes:""),contratoId:cid,clienteId:ed.clienteId,local:c.enderecoServico||S.enderecoCli(cli),
        dataInicio:c.dataInicio||"",dataFim:c.dataInicio?S.somaDias(c.dataInicio,d-1):"",hora:"",status:"planejada",equipe:[],parceiros:[],pecas:[],obs:"",criadoEm:S.agoraISO()});
    }).then(function(pid){
      var p=St.get("producoes",pid);return M.producao.sync(pid,p).then(function(){location.hash="#adm/producao/"+pid;});
    },S.erroGravar);
  }
  m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);
  desenhar();
}};

/* ================= CLIENTES ================= */
var CAMPOS_CLI=[
  {k:"tipo",r:"Tipo",t:"select",o:[["PF","Pessoa física"],["PJ","Empresa"]]},{k:"nome",r:"Nome completo ou razão social",req:1},
  {k:"doc",r:"CPF ou CNPJ"},{k:"rg",r:"RG"},{k:"nacionalidade",r:"Nacionalidade"},{k:"estadoCivil",r:"Estado civil"},
  {k:"profissao",r:"Profissão"},{k:"email",r:"E-mail",t:"email"},{k:"telefone",r:"Telefone / WhatsApp",t:"tel"},{k:"instagram",r:"Instagram"},
  {k:"cep",r:"CEP"},{k:"endereco",r:"Rua / avenida"},{k:"numero",r:"Número"},{k:"complemento",r:"Complemento"},
  {k:"bairro",r:"Bairro"},{k:"cidade",r:"Cidade"},{k:"uf",r:"Estado (UF)"},{k:"representante",r:"Representante legal (empresa)"},
  {k:"repCpf",r:"CPF do representante (empresa)"},{k:"origem",r:"Origem",ro:1},{k:"obs",r:"Observações",t:"area",full:1}];
S.modalCliente=function(id,aoSalvar){
  var c=id?St.copia("clientes",id):{tipo:"PF",origem:"Cadastro manual"};
  var props=id?St.list("propostas").filter(function(p){return p.clienteId===id;}):[],cons=id?St.list("contratos").filter(function(x){return x.clienteId===id;}):[];
  var depois=id?'<div class="ed__bloco" style="margin-top:var(--s-24);padding-bottom:0"><h2>Propostas e contratos</h2><div class="acoes">'+
    (props.map(function(p){return '<a class="lnk" href="#adm/proposta/'+esc(p.id)+'">Proposta '+esc(p.num)+'</a>';}).concat(cons.map(function(x){return '<a class="lnk" href="#adm/contrato/'+esc(x.id)+'">Contrato '+esc(x.num)+'</a>';})).join("")||'<span class="nota">Nenhum ainda.</span>')+'</div></div>':'';
  S.modalForm({sobre:"Cadastro",titulo:id?c.nome:"Novo cliente",campos:CAMPOS_CLI,dados:c,depois:depois,salvarRot:id?"Salvar":"+ Adicionar",
    aoSalvar:function(v){var corpo=Object.assign({},c,v);if(!id)corpo.criadoEm=S.agoraISO();delete corpo.id;return St.salvar("clientes",id||null,corpo).then(function(nid){S.toast("Cliente salvo.");if(aoSalvar)aoSalvar(nid);});},
    aoExcluir:id?function(){return St.excluir("clientes",id);}:null});
  var d=document.querySelector("dialog.modal");if(d)$$(".modal__corpo a",d).forEach(function(a){a.addEventListener("click",S.fecharModal);});
};
var fCli={q:"",ord:"cad"};
function dadosOk(c){return !!(c.doc&&c.endereco&&c.cidade);}
M.clientes={render:function(m,id,vista){
  m.innerHTML=cab("Clientes","Cadastro feito por você ou pelo próprio cliente, pelo link. Toque num cliente para ver os dados, as propostas e os contratos.",'<button type="button" class="btn btn--escuro" data-novo>+ Novo cliente</button>')+
    caixaLink("Link de cadastro de novos clientes","cadastro-cliente")+
    '<div class="sis-barra"><div class="sis-ord"><span>Ordenar</span>'+pilulas([["cad","Cadastro"],["az","A–Z"]],fCli.ord,"data-ord","Ordenar")+'</div>'+busca(fCli.q,"Buscar cliente…")+'</div><div id="sis-lista"></div>';
  ligarCopiarLink(m);
  $("[data-novo]",m).addEventListener("click",function(){S.modalCliente(null);});
  ligarPil(m,"data-ord",function(v){fCli.ord=v;vista.atualizar();});
  $("[data-q]",m).addEventListener("input",function(e){fCli.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){S.modalCliente(id);});
  vista.atualizar=function(){
    var props=St.list("propostas"),cons=St.list("contratos");
    var l=St.list("clientes").filter(function(c){return contem(fCli.q,[c.nome,c.cidade,c.email,c.telefone,c.doc]);}).sort(function(a,b){return fCli.ord==="az"?String(a.nome).localeCompare(String(b.nome)):porData(a,b,"criadoEm");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Cliente / e-mail",v:function(c){return esc(c.nome)+(c.email?'<small>'+esc(c.email)+'</small>':'');}},
      {r:"Propostas e contratos",v:function(c){var p=props.filter(function(x){return x.clienteId===c.id;}).length,k=cons.filter(function(x){return x.clienteId===c.id;}).length;return esc(plural(p,"proposta")+" · "+plural(k,"contrato"));},cl:"sec"},
      {r:"Cidade",v:function(c){return esc([c.cidade,c.uf].filter(Boolean).join("/")||"—");},cl:"sec"},
      {r:"Telefone",v:function(c){return esc(c.telefone||"—");}},
      {r:"Origem",v:function(c){return esc(c.origem||"—");},cl:"sec"},
      {r:"Dados para contrato",v:function(c){return dadosOk(c)?'<span class="tag" style="--c:#3E6B48">completos</span>':'<span class="tag" style="--c:#B08A3E">incompletos</span>';}}
    ],l,St.list("clientes").length?"Nenhum cliente encontrado.":"Ainda não há clientes. Eles entram pelos pedidos do site, pelo link de cadastro ou em Novo cliente.",function(c){return dadosOk(c)?"#3E6B48":"#B08A3E";});
  };
  if(!carregando($("#sis-lista",m),vista,"clientes"))vista.atualizar();
}};

/* ================= PRODUÇÕES ================= */
var fProd={st:"todas",q:""};
M.producoes={render:function(m,id,vista){
  var adm=S.ehAdm();
  m.innerHTML=cab("Produções",adm?"Criadas a partir de contratos assinados: local, data, parceiros e peças que ficaram com o cliente.":"Local, datas, equipe, parceiros e peças que ficaram com o cliente. Só para consulta.",adm?'<a class="btn btn--escuro" href="#adm/producao/nova">+ Nova produção</a>':'')+
    '<div class="sis-barra">'+pilulas(comCor("producao",["todas","Todas"]),fProd.st,"data-st","Status")+busca(fProd.q,"Buscar produção ou cliente…")+'</div><div id="sis-lista"></div>';
  ligarPil(m,"data-st",function(v){fProd.st=v;vista.atualizar();});
  $("[data-q]",m).addEventListener("input",function(e){fProd.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){location.hash="#adm/producao/"+id;});
  vista.atualizar=function(){
    var todas=St.list("producoes");
    contarPil(m,"data-st",function(v){return v==="todas"?todas.length:todas.filter(function(p){return p.status===v;}).length;});
    var l=todas.filter(function(p){return (fProd.st==="todas"||p.status===fProd.st)&&contem(fProd.q,[p.titulo,p.local,nomeCliente(p.clienteId)]);}).sort(function(a,b){return porData(a,b,"dataInicio");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Produção / cliente",v:function(p){var c=nomeCliente(p.clienteId);return esc(p.titulo||"Sem título")+(c?'<small>'+esc(c)+'</small>':'');}},
      {r:"Local",v:function(p){return esc(p.local||"—");},cl:"sec"},
      {r:"Datas",v:function(p){return esc(S.dataBR(p.dataInicio)+(p.dataFim&&p.dataFim!==p.dataInicio?" a "+S.dataBR(p.dataFim):""))||"—";}},
      {r:"Parceiros",v:function(p){return String((p.parceiros||[]).length);},cl:"num"},
      {r:"Peças com o cliente",v:function(p){return String(qtdPecas(p.pecas));},cl:"num"},
      adm?{r:"RT",v:function(p){return brl(artTotal(p.pecas));},cl:"num"}:null,
      {r:"Status",v:function(p){return S.tag("producao",p.status);}}
    ].filter(Boolean),l,todas.length?"Nenhuma produção com esse filtro.":"Ainda não há produções. Marque um contrato como Assinado e use Criar produção.",function(p){return corSt("producao",p.status);});
  };
  if(!carregando($("#sis-lista",m),vista,"producoes"))vista.atualizar();
}};
function artTotal(pecas){return (pecas||[]).reduce(function(s,x){return s+num(x.valor)*num(x.art)/100;},0);} /* RT (reserva técnica); o campo continua "art" */
/* Quantidade de peças com o cliente (linhas antigas sem qtd contam 1) */
function qtdPeca(x){return x.qtd===""||x.qtd==null?1:num(x.qtd);}
function qtdPecas(pecas){return (pecas||[]).reduce(function(s,x){return s+qtdPeca(x);},0);}
/* Colaborador: produção só para consulta, sem valores nem RT */
function verProducao(m,p){
  function it(r,v){return '<div class="item"><b>'+esc(r)+'</b><span>'+esc(v||"—")+'</span></div>';}
  function sec(t,c){return '<section class="sis-sec"><h2>'+t+'</h2><div class="itens">'+c+'</div></section>';}
  var dt=S.dataBR(p.dataInicio)+(p.dataFim&&p.dataFim!==p.dataInicio?" a "+S.dataBR(p.dataFim):"");
  var eq=p.equipeNomes||[],ne=(p.equipe||[]).length,parc=(p.parceiros||[]).filter(function(x){return x.parceiroId||x.papel;}),pc=p.pecas||[];
  m.innerHTML=cab(p.titulo||"Produção","Só para consulta.",'',["#adm/producoes","Produções"])+
    sec("Dados",'<div class="item"><b>Status</b>'+S.tag("producao",p.status)+'</div>'+it("Local",p.local)+it("Datas",dt)+it("Horário de chegada",p.hora)+(p.obs?'<div class="item"><b>Observações</b><pre>'+esc(p.obs)+'</pre></div>':''))+
    sec("Equipe",eq.length?eq.map(function(n){return '<div class="item"><b>'+esc(n)+'</b></div>';}).join(""):'<p class="nota">'+(ne?plural(ne,"pessoa")+" na equipe.":"Ninguém escalado ainda.")+'</p>')+
    sec("Parceiros nesta produção",parc.length?parc.map(function(x){return it(nomeParceiro(x.parceiroId)||"Parceiro",x.papel);}).join(""):'<p class="nota">Nenhum parceiro nesta produção.</p>')+
    sec("Peças que ficaram com o cliente<small>"+plural(qtdPecas(pc),"peça")+" no total</small>",pc.length?pc.map(function(x){return it(nomeParceiro(x.parceiroId)||"Sem parceiro",plural(qtdPeca(x),"peça"));}).join(""):'<p class="nota">Nenhuma peça registrada.</p>');
}

M.producao={
  sync:function(id,p){
    if(!p||!p.dataInicio||p.status==="cancelada")return St.excluir("agenda","prod-"+id).catch(function(){});
    var nomes=(p.equipe||[]).map(function(i){var x=St.get("equipe",i);return x?x.nome:"";}).filter(Boolean);
    return St.salvar("agenda","prod-"+id,{titulo:"Produção · "+(p.titulo||""),tipo:"producao",data:p.dataInicio,dataFim:p.dataFim||p.dataInicio,hora:p.hora||"",horaFim:"",local:p.local||"",
      desc:nomes.length?"Equipe: "+nomes.join(", "):"",producaoId:id,auto:true});
  },
  render:function(m,id,vista){
    var ed;
    if(!S.ehAdm()){if(carregando(m,vista,["producoes","parceiros"]))return;var p0=St.get("producoes",id);
      if(p0)verProducao(m,p0);else m.innerHTML=cab("Produção não encontrada","",'',["#adm/producoes","Produções"]);return;}
    if(carregando(m,vista,["producoes","contratos","clientes","parceiros","equipe"]))return;
    if(id==="nova")ed={titulo:"",contratoId:"",clienteId:"",local:"",dataInicio:"",dataFim:"",hora:"",status:"planejada",equipe:[],parceiros:[],pecas:[],obs:"",criadoEm:S.agoraISO()};
    else{ed=St.copia("producoes",id);if(!ed){m.innerHTML=cab("Produção não encontrada","",'',["#adm/producoes","Produções"]);return;}}
    vista.vivo=false;
    ed.equipe=ed.equipe||[];ed.parceiros=ed.parceiros||[];ed.pecas=ed.pecas||[];
    function conOpts(){return [["","— escolha um contrato assinado —"]].concat(St.list("contratos").filter(function(c){return c.status==="assinado"||c.status==="concluido"||c.id===ed.contratoId;}).map(function(c){return [c.id,c.num+" · "+(nomeCliente(c.clienteId)||"sem cliente")];}));}
    function parcHTML(){
      return ed.parceiros.map(function(x,i){return '<div class="rep__lin" style="grid-template-columns:minmax(0,1.2fr) minmax(0,1fr) auto" data-pi="'+i+'"><label class="f">Parceiro'+selectHTML('data-pk="parceiroId"',opcoesParceiros(),x.parceiroId)+'</label><label class="f">O que forneceu<input type="text" data-pk="papel" value="'+esc(x.papel)+'" placeholder="Ex.: tapetes e almofadas"></label><button type="button" class="rep__x" data-rem-p="'+i+'">Remover</button></div>';}).join("")||'<p class="nota">Nenhum parceiro nesta produção.</p>';
    }
    function pecasHTML(){
      return ed.pecas.map(function(x,i){return '<div class="rep__lin rep__lin--peca" data-qi="'+i+'"><label class="f f--parc">Parceiro'+selectHTML('data-qk="parceiroId"',opcoesParceiros(),x.parceiroId)+'</label><label class="f">Qtd. de peças<input type="number" min="0" step="1" inputmode="numeric" data-qk="qtd" data-num="1" value="'+esc(x.qtd)+'"></label><label class="f">Valor (R$)<input type="text" inputmode="decimal" data-qk="valor" data-num="1" value="'+(x.valor!==""&&x.valor!=null?S.fmtValor(x.valor):"")+'"></label><label class="f">RT %<input type="text" inputmode="decimal" data-qk="art" data-num="1" value="'+esc(x.art)+'"></label><label class="f">Pagamento da RT<input type="date" data-qk="dataRT" value="'+esc(x.dataRT)+'"></label><button type="button" class="rep__x" data-rem-q="'+i+'">Remover</button></div>';}).join("")||'<p class="nota">Nenhuma peça registrada.</p>';
    }
    function totaisHTML(){
      var t=soma(ed.pecas,"valor"),a=artTotal(ed.pecas),por={};
      ed.pecas.forEach(function(x){var v=num(x.valor)*num(x.art)/100;if(!v)return;var k=x.parceiroId||"";por[k]=(por[k]||0)+v;});
      var lin=Object.keys(por).map(function(k){return '<span>'+esc(nomeParceiro(k)||"Sem parceiro")+' <b>'+brl(por[k])+'</b></span>';}).join("");
      return '<span>Peças com o cliente <b>'+qtdPecas(ed.pecas)+'</b></span><span>Valor <b>'+brl(t)+'</b></span><span>RT total <b>'+brl(a)+'</b></span>'+(Object.keys(por).length>1?lin:'')+'<span class="nota">RT % e valores de RT ficam visíveis só para o administrador.</span>';
    }
    function equipeHTML(){
      var at=St.list("equipe").filter(function(x){return x.status==="ativo";});
      return at.length?'<div class="chks">'+at.map(function(x){return '<label class="chk"><input type="checkbox" data-eq="'+esc(x.id)+'"'+(ed.equipe.indexOf(x.id)>=0?" checked":"")+'> '+esc(x.nome)+(x.funcao?' <span class="nota">· '+esc(x.funcao)+'</span>':'')+'</label>';}).join("")+'</div>':'<p class="nota">Ninguém liberado em <a class="lnk" href="#adm/equipe">Equipe</a> ainda.</p>';
    }
    function desenhar(){
      m.innerHTML=cab(ed.id?(ed.titulo||"Produção"):"Nova produção",ed.contratoId?"Contrato "+esc((St.get("contratos",ed.contratoId)||{}).num||""):"Escolha o contrato assinado desta produção.",
        '<label class="f" style="min-width:180px">Status'+selectHTML('data-k="status"',S.opcoes("producao"),ed.status)+'</label>'+
        '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>Salvar</button><button type="button" class="lnk" data-art>Lançar RT no financeiro</button>'+(ed.id?'<button type="button" class="lnk lnk--perigo" data-excluir>Excluir</button>':'')+'</div>',["#adm/producoes","Produções"])+
      '<div class="ed ed--meio"><div class="ed__form" id="ed-form">'+
        '<section class="ed__bloco"><h2>Dados</h2><div class="fgrid"><label class="f f--full">Contrato'+selectHTML("data-con",conOpts(),ed.contratoId)+'</label>'+S.campos([
          {k:"titulo",r:"Título",full:1,req:1},{k:"local",r:"Local",full:1},{k:"dataInicio",r:"Início",t:"date"},{k:"dataFim",r:"Fim",t:"date"},{k:"hora",r:"Horário de chegada",t:"time"},{k:"obs",r:"Observações",t:"area",full:1}],ed)+
          '<p class="nota f--full">Ao salvar, a produção aparece no Calendário, onde a equipe também vê.</p></div></section>'+
        '<section class="ed__bloco"><h2>Equipe</h2>'+equipeHTML()+'</section>'+
      '</div><div class="ed__form">'+
        '<section class="ed__bloco"><h2>Parceiros nesta produção</h2><div class="rep" id="ed-parc">'+parcHTML()+'</div><p style="margin-top:var(--s-12)"><button type="button" class="lnk" data-add-p>+ Adicionar parceiro</button> <a class="lnk" href="#adm/parceiros" style="margin-left:var(--s-12)">Cadastrar parceiro</a></p></section>'+
        '<section class="ed__bloco"><h2>Peças que ficaram com o cliente para compra</h2><div class="rep" id="ed-pecas">'+pecasHTML()+'</div><p style="margin-top:var(--s-12)"><button type="button" class="lnk" data-add-q>+ Adicionar peça</button></p><div class="totais" id="ed-tot">'+totaisHTML()+'</div></section>'+
      '</div></div>';
      ligar();
    }
    function ligar(){
      $("[data-salvar]",m).addEventListener("click",function(){salvar().catch(function(){});});
      $("[data-art]",m).addEventListener("click",lancarArt);
      var x=$("[data-excluir]",m);if(x)x.addEventListener("click",function(){if(!window.confirm("Excluir esta produção? Ela também sai do calendário."))return;St.excluir("producoes",ed.id).then(function(){return St.excluir("agenda","prod-"+ed.id).catch(function(){});}).then(function(){location.hash="#adm/producoes";},S.erroGravar);});
      $("[data-add-p]",m).addEventListener("click",function(){ed.parceiros.push({parceiroId:"",papel:""});$("#ed-parc",m).innerHTML=parcHTML();});
      $("[data-add-q]",m).addEventListener("click",function(){ed.pecas.push({qtd:"",parceiroId:"",valor:"",art:"",dataRT:""});$("#ed-pecas",m).innerHTML=pecasHTML();});
    }
    function aoClicar(e){
      var b=e.target.closest("[data-rem-p]");if(b){ed.parceiros.splice(+b.getAttribute("data-rem-p"),1);$("#ed-parc",m).innerHTML=parcHTML();return;}
      b=e.target.closest("[data-rem-q]");if(b){ed.pecas.splice(+b.getAttribute("data-rem-q"),1);$("#ed-pecas",m).innerHTML=pecasHTML();$("#ed-tot",m).innerHTML=totaisHTML();}
    }
    function aoMudar(e){
      var t=e.target;
      if(t.hasAttribute("data-con")){
        if(e.type!=="change")return;ed.contratoId=t.value;var c=t.value?St.get("contratos",t.value):null;
        if(c){var cc=c.campos||{},cli=St.get("clientes",c.clienteId),d=Math.max(1,Math.round(num(cc.dias)||1));ed.clienteId=c.clienteId;if(!ed.titulo)ed.titulo=(cli?cli.nome:"Produção")+(cc.ambientes?" · "+cc.ambientes:"");
          ed.local=cc.enderecoServico||S.enderecoCli(cli);if(cc.dataInicio){ed.dataInicio=cc.dataInicio;ed.dataFim=S.somaDias(cc.dataInicio,d-1);}desenhar();}
        return;
      }
      if(t.hasAttribute("data-eq")){var i=ed.equipe.indexOf(t.getAttribute("data-eq"));if(t.checked&&i<0)ed.equipe.push(t.getAttribute("data-eq"));if(!t.checked&&i>=0)ed.equipe.splice(i,1);return;}
      var lp=t.closest("[data-pi]");if(lp&&t.hasAttribute("data-pk")){ed.parceiros[+lp.getAttribute("data-pi")][t.getAttribute("data-pk")]=t.value;return;}
      var lq=t.closest("[data-qi]");
      if(lq&&t.hasAttribute("data-qk")){var v=t.getAttribute("data-num")?(t.value===""?"":num(t.value)):t.value;ed.pecas[+lq.getAttribute("data-qi")][t.getAttribute("data-qk")]=v;
        if(e.type==="change"&&t.getAttribute("data-qk")==="valor"&&t.value!=="")t.value=S.fmtValor(v);$("#ed-tot",m).innerHTML=totaisHTML();return;}
      var k=t.getAttribute("data-k");if(!k)return;S.setPath(ed,k,t.type==="checkbox"?t.checked:t.value);
    }
    function salvar(){
      if(!S.validar($("#ed-form",m)))return Promise.reject({code:"validacao"});
      var corpo=S.clone(ed),pid=ed.id;delete corpo.id;
      corpo.equipeNomes=ed.equipe.map(function(i){var x=St.get("equipe",i);return x?x.nome:"";}).filter(Boolean); /* o colaborador não lê Equipe */
      return St.salvar("producoes",pid||null,corpo).then(function(nid){ed.id=nid;return M.producao.sync(nid,corpo).then(function(){S.toast("Produção salva e calendário atualizado.");if(!pid){history.replaceState(null,"","#adm/producao/"+nid);desenhar();}return nid;});},function(e){S.erroGravar(e);throw e;});
    }
    /* Uma entrada por parceiro, na data de pagamento da RT de cada linha */
    function lancarArt(){
      var a=Math.round(artTotal(ed.pecas)*100)/100;if(!a){S.toast("Nenhuma RT nas peças desta produção.");return;}
      salvar().then(function(pid){
        var ja=St.list("financeiro").filter(function(f){return f.producaoId===pid;}).length;
        if(ja&&!window.confirm("Já existem "+ja+" lançamento(s) de RT desta produção no financeiro. Lançar de novo?"))return 0;
        var l=ed.pecas.filter(function(x){return num(x.valor)*num(x.art);}).map(function(x){var p=nomeParceiro(x.parceiroId);
          return {tipo:"entrada",data:x.dataRT||ed.dataFim||ed.dataInicio||S.hoje(),descricao:"RT · "+(p?p+" · ":"")+(ed.titulo||"produção"),pagador:p||"",categoria:"RT / comissão",valor:Math.round(num(x.valor)*num(x.art))/100,status:"pendente",forma:"PIX",producaoId:pid,contratoId:ed.contratoId||"",criadoEm:S.agoraISO()};});
        return l.reduce(function(q,x){return q.then(function(){return St.salvar("financeiro",null,x);});},Promise.resolve()).then(function(){return l.length;});
      }).then(function(n){if(n)S.toast("RT de "+brl(a)+" lançada no Financeiro em A receber ("+plural(n,"lançamento")+").");},function(){});
    }
    m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);m.addEventListener("click",aoClicar);
    desenhar();
  }
};

/* ================= FINANCEIRO ================= */
var CATS_FIN=[{grupo:"Entradas",itens:["Produção","Sinal de contrato","RT / comissão","Consultoria","Serviço avulso","Outras entradas"]},{grupo:"Saídas",itens:["Ajudantes e equipe","Frete e transporte","Folhagens e flores","Materiais de produção","Alimentação","Impostos e taxas","Ferramentas e equipamentos","Outras saídas"]}];
var fFin={per:"mes",mes:S.hoje().slice(0,7),aba:"todos",q:""};
var ABAS_FIN=[["todos","Todos"],["receber","A receber","#B08A3E"],["recebido","Recebido","#3E6B48"],["saidas","Saídas","#9A3B2E"]];
function catFin(c){return c==="ART / comissão"?"RT / comissão":c;} /* nome antigo */
function vencido(f){return f.tipo==="entrada"&&f.status==="pendente"&&String(f.data||"")<S.hoje();}
function naAba(f,a){
  if(a==="receber")return f.tipo==="entrada"&&f.status==="pendente";
  if(a==="recebido")return f.tipo==="entrada"&&f.status==="pago";
  if(a==="saidas")return f.tipo==="saida";
  return true;
}
/* Situação do lançamento: [rótulo, cor] */
function stFin(f){
  if(f.tipo==="saida")return f.status==="pago"?["paga","#7D7A75"]:["a pagar","#9A3B2E"];
  if(f.status==="pago")return ["recebido","#3E6B48"];
  return vencido(f)?["vencido","#9A3B2E"]:["a receber","#B08A3E"];
}
function noPeriodo(d){
  d=String(d||"");var h=S.hoje();
  if(fFin.per==="mes")return d.slice(0,7)===h.slice(0,7);
  if(fFin.per==="ant"){var x=new Date();x.setDate(1);x.setMonth(x.getMonth()-1);return d.slice(0,7)===S.isoLocal(x).slice(0,7);}
  if(fFin.per==="ano")return d.slice(0,4)===h.slice(0,4);
  if(fFin.per==="esc")return d.slice(0,7)===fFin.mes;
  return true;
}
function modalFin(id,tipo){
  var f=id?St.copia("financeiro",id):{tipo:tipo||"entrada",data:S.hoje(),status:tipo==="saida"?"pago":"pendente",forma:"PIX",categoria:tipo==="saida"?"Materiais de produção":"Produção"};
  f.categoria=catFin(f.categoria);
  var cons=[["","— nenhum —"]].concat(St.list("contratos").map(function(c){return [c.id,c.num+" · "+(nomeCliente(c.clienteId)||"")];}));
  S.modalForm({sobre:"Financeiro",titulo:id?"Editar lançamento":(f.tipo==="saida"?"Nova saída":"Nova entrada"),dados:f,salvarRot:id?"Salvar":"+ Adicionar",
    campos:[{k:"tipo",r:"Tipo",t:"select",o:[["entrada","Entrada"],["saida","Saída"]]},{k:"data",r:"Data",t:"date",req:1},
      {k:"descricao",r:"Descrição",req:1,full:1},{k:"categoria",r:"Categoria",t:"select",o:CATS_FIN},{k:"valor",r:"Valor (R$)",t:"money",req:1},
      {k:"status",r:"Status",t:"select",o:S.opcoes("financeiro")},{k:"forma",r:"Forma",t:"select",o:["PIX","Transferência","Dinheiro","Cartão","Boleto"]},
      {k:"contratoId",r:"Contrato",t:"select",o:cons},{k:"pagador",r:"Quem pagou ou recebeu"},{k:"obs",r:"Observação",t:"area",full:1}],
    /* entrada sem contrato nem produção = recebimento avulso (consultoria, serviços) */
    aoSalvar:function(v){if(!num(v.valor)){S.toast("Informe um valor.");return false;}var corpo=Object.assign({},f,v);delete corpo.id;corpo.avulso=corpo.tipo==="entrada"&&!corpo.contratoId&&!corpo.producaoId;if(!id)corpo.criadoEm=S.agoraISO();return St.salvar("financeiro",id||null,corpo).then(function(){S.toast("Lançamento salvo.");});},
    aoExcluir:id?function(){return St.excluir("financeiro",id);}:null});
}
M.financeiro={render:function(m,id,vista){
  m.innerHTML=cab("Financeiro","Entradas e saídas do escritório. Quando um <b>contrato</b> é marcado como Assinado, o sinal e o saldo entram aqui sozinhos em A receber, com a data de cada recebimento; ao marcar uma como <b>paga</b>, ela passa para Recebido. Recebimentos <b>avulsos</b> (sem contrato) também entram por + Entrada.",
      selPil("Período","data-per",[["mes","Este mês"],["ant","Mês passado"],["ano","Este ano"],["esc","Escolher mês"],["tudo","Todo o período"]],fFin.per)+
      '<label class="sis-sel" data-mes-box'+(fFin.per==="esc"?"":" hidden")+'><span class="vh">Mês</span><input type="month" data-mes value="'+esc(fFin.mes)+'"></label>'+
      '')+
    '<div id="fin-kpis"></div>'+
    '<div class="sis-barra">'+pilulas(ABAS_FIN,fFin.aba,"data-aba","Mostrar")+busca(fFin.q,"Buscar descrição, cliente…")+'</div>'+
    '<div id="sis-lista"></div>'+
    '<div class="sis-avulso"><button type="button" class="btn btn--escuro" data-nova="entrada">+ Entrada</button><button type="button" class="btn btn--linha" data-nova="saida">− Saída</button><button type="button" class="btn btn--linha" data-csv>Exportar CSV</button></div>';
  function liga(sel,k,cb){$(sel,m).addEventListener("change",function(e){fFin[k]=e.target.value;if(cb)cb();vista.atualizar();});}
  liga("[data-per]","per",function(){$("[data-mes-box]",m).hidden=fFin.per!=="esc";});liga("[data-mes]","mes");
  ligarPil(m,"data-aba",function(v){fFin.aba=v;vista.atualizar();});
  $("[data-q]",m).addEventListener("input",function(e){fFin.q=e.target.value;vista.atualizar();});
  $$("[data-nova]",m).forEach(function(b){b.addEventListener("click",function(){modalFin(null,b.getAttribute("data-nova"));});});
  aoClicarLinha($("#sis-lista",m),function(id){modalFin(id);});
  var atual=[];
  function origem(f){if(f.avulso)return "Avulso"+(f.pagador?" · "+f.pagador:"");var c=f.contratoId?St.get("contratos",f.contratoId):null;return c?"Contrato "+c.num+(nomeCliente(c.clienteId)?" · "+nomeCliente(c.clienteId):""):"";}
  $("[data-csv]",m).addEventListener("click",function(){
    var linhas=[["Data","Tipo","Descrição","Origem","Categoria","Situação","Forma","Valor"]].concat(atual.map(function(f){return [S.dataBR(f.data),f.tipo==="saida"?"Saída":"Entrada",f.descricao,origem(f),catFin(f.categoria),stFin(f)[0],f.forma,(f.tipo==="saida"?"-":"")+S.fmtValor(f.valor)];}));
    S.salvarArquivo("financeiro-"+S.hoje()+".csv","﻿"+linhas.map(function(l){return l.map(function(c){return '"'+String(c==null?"":c).replace(/"/g,'""')+'"';}).join(";");}).join("\r\n"));
  });
  vista.atualizar=function(){
    var todos=St.list("financeiro"),per=todos.filter(function(f){return noPeriodo(f.data);});
    function soma2(fn){var x=per.filter(fn);return {n:x.length,v:soma(x,"valor")};}
    var rec=soma2(function(f){return f.tipo==="entrada"&&f.status==="pago";}),arec=soma2(function(f){return f.tipo==="entrada"&&f.status==="pendente"&&!vencido(f);}),sai=soma2(function(f){return f.tipo==="saida"&&f.status==="pago";});
    var venc=todos.filter(vencido),vv=soma(venc,"valor");
    $("#fin-kpis",m).innerHTML=kpis([
      {r:"Recebido",v:brl(rec.v),chip:plural(rec.n,"entrada")+" no período",cor:"#3E6B48",ico:"ok"},
      {r:"A receber",v:brl(arec.v),chip:"Em aberto",cor:"#B08A3E",ico:"ampulheta"},
      {r:"Vencido",v:brl(vv),chip:venc.length?"Em atraso · "+plural(venc.length,"parcela"):"Nada em atraso",cor:"#9A3B2E",ico:"x"},
      {r:"Saídas pagas",v:brl(sai.v),chip:"Saldo "+brl(rec.v-sai.v),cor:"#7D7A75",ico:"saida"}]);
    var base=per.filter(function(f){return contem(fFin.q,[f.descricao,catFin(f.categoria),f.obs,f.pagador,origem(f)]);});
    contarPil(m,"data-aba",function(a){return base.filter(function(f){return naAba(f,a);}).length;});
    atual=base.filter(function(f){return naAba(f,fFin.aba);}).sort(function(a,b){return porData(a,b,"data");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Descrição / origem",v:function(f){var o=origem(f);return esc(f.descricao||"—")+(o?'<small>'+esc(o)+'</small>':'');}},
      {r:"Categoria",v:function(f){return esc(catFin(f.categoria)||"—");},cl:"sec"},
      {r:"Data",v:function(f){return esc(S.dataBR(f.data));}},
      {r:"Forma",v:function(f){return esc(f.forma||"—");},cl:"sec"},
      {r:"Valor",v:function(f){return '<span class="'+(f.tipo==="saida"?"neg":"pos")+'">'+(f.tipo==="saida"?"− ":"+ ")+brl(f.valor)+'</span>';},cl:"num"},
      {r:"Situação",v:function(f){var s=stFin(f);return '<span class="tag tag--pil" style="--c:'+s[1]+'">'+s[0]+'</span>';}}
    ],atual,todos.length?"Nenhum lançamento nesse filtro.":"Ainda não há lançamentos. Use + Entrada, − Saída, ou marque um contrato como Assinado.",function(f){return stFin(f)[1];});
  };
  if(!carregando($("#sis-lista",m),vista,"financeiro"))vista.atualizar();
}};

/* ================= CALENDÁRIO ================= */
var TIPOS_AG={producao:["Produção","#111111","#E2DFDA"],visita:["Visita","#7D7A75","#ECEAE5"],tarefa:["Tarefa","#5F6F7A","#E5E9EC"],outro:["Outro","#A9A6A0","#F0EEEA"]};
var mesCal=S.hoje().slice(0,7);
/* Tarefa marcada "Mostrar no calendário" vira um evento (não é gravada na agenda: o calendário lê das tarefas) */
function evTarefa(t){
  var ini=t.inicio||t.prazo,fim=t.prazo||t.inicio,r=t.respNome||(t.resp==="adm"?"Shylton":"");
  return {id:"tar:"+t.id,titulo:t.titulo||"Tarefa",tipo:"tarefa",data:ini,dataFim:fim,hora:t.hora||"",horaFim:t.horaFim||"",local:"",desc:[r?"Responsável: "+r:"",t.desc||""].filter(Boolean).join(". "),tarefaId:t.id};
}
function agendaTudo(){return St.list("agenda").concat(St.list("tarefas").filter(function(t){return t.calendario&&(t.inicio||t.prazo);}).map(evTarefa));}
function eventosDoDia(dia){return agendaTudo().filter(function(e){return e.data&&e.data<=dia&&(e.dataFim||e.data)>=dia;}).sort(function(a,b){return String(a.hora||"").localeCompare(String(b.hora||""));});}
function proximosEventos(n){var h=S.hoje();return agendaTudo().filter(function(e){return (e.dataFim||e.data)>=h;}).sort(function(a,b){return (String(a.data)+(a.hora||"")).localeCompare(String(b.data)+(b.hora||""));}).slice(0,n);}
function itemEvento(e){var t=TIPOS_AG[e.tipo]||TIPOS_AG.outro;return '<div class="item"><button type="button" class="tab__abrir" data-evento="'+esc(e.id)+'" style="text-align:left">'+esc(e.titulo)+'</button><span>'+esc(S.dataBR(e.data)+(e.dataFim&&e.dataFim!==e.data?" a "+S.dataBR(e.dataFim):"")+(e.hora?" · "+e.hora:""))+'</span><span>'+esc(e.local||"")+'</span><span class="tag" style="--c:'+t[1]+'">'+t[0]+'</span></div>';}
function gcal(e){
  var enc=encodeURIComponent,d1=String(e.data).replace(/-/g,""),datas;
  if(e.hora){var hf=e.horaFim||(function(){var p=e.hora.split(":");return S.pad((+p[0]+2)%24)+":"+(p[1]||"00");})();datas=d1+"T"+e.hora.replace(":","")+"00/"+String(e.dataFim||e.data).replace(/-/g,"")+"T"+hf.replace(":","")+"00";}
  else datas=d1+"/"+S.somaDias(e.dataFim||e.data,1).replace(/-/g,"");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+enc(e.titulo||"")+"&dates="+datas+"&details="+enc(e.desc||"")+"&location="+enc(e.local||"")+"&ctz=America/Sao_Paulo";
}
function verEvento(id){
  if(String(id).indexOf("tar:")===0){modalTarefa(String(id).slice(4));return;}
  var e=St.copia("agenda",id);if(!e)return;
  var t=TIPOS_AG[e.tipo]||TIPOS_AG.outro,adm=S.ehAdm();
  if(adm&&!e.auto){modalEvento(id);return;}
  S.modal({sobre:t[0],titulo:e.titulo,semFoco:1,
    corpo:'<dl class="itens">'+[["Data",S.dataBR(e.data)+(e.dataFim&&e.dataFim!==e.data?" a "+S.dataBR(e.dataFim):"")],["Horário",(e.hora||"")+(e.horaFim?" às "+e.horaFim:"")],["Local",e.local],["Detalhes",e.desc]].filter(function(x){return x[1];}).map(function(x){return '<div class="item"><b>'+esc(x[0])+'</b><span style="grid-column:1/-1;color:var(--tinta)">'+esc(x[1])+'</span></div>';}).join("")+'</dl>'+
      (e.auto&&adm?'<p class="nota" style="margin-top:var(--s-12)">Criado pela produção. Para mudar datas, edite a produção.</p>':''),
    pe:(e.auto&&e.producaoId?'<a class="lnk esq" href="#adm/producao/'+esc(e.producaoId)+'" data-fechar>Abrir produção</a>':'')+'<a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(gcal(e))+'">Adicionar ao Google Agenda ↗</a><button type="button" class="btn btn--escuro" data-fechar>Fechar</button>'});
}
function modalEvento(id,data){
  var e=id?St.copia("agenda",id):{tipo:"visita",data:data||S.hoje()};
  var d=S.modalForm({sobre:"Calendário",titulo:id?e.titulo:"Novo compromisso",dados:e,salvarRot:id?"Salvar":"+ Adicionar",
    campos:[{k:"titulo",r:"Título",req:1,full:1},{k:"tipo",r:"Tipo",t:"select",o:Object.keys(TIPOS_AG).filter(function(k){return k!=="producao";}).map(function(k){return [k,TIPOS_AG[k][0]];})},
      {k:"data",r:"Data",t:"date",req:1},{k:"dataFim",r:"Até (opcional)",t:"date"},{k:"hora",r:"Início",t:"time"},{k:"horaFim",r:"Fim",t:"time"},
      {k:"local",r:"Local",full:1},{k:"desc",r:"Detalhes",t:"area",full:1}],
    depois:id?'<p style="margin-top:var(--s-16)"><a class="lnk" target="_blank" rel="noopener" href="'+esc(gcal(e))+'">Adicionar ao Google Agenda ↗</a></p>':'<p class="nota" style="margin-top:var(--s-16)">Depois de salvar, abra o compromisso para mandar ao Google Agenda.</p>',
    aoSalvar:function(v){if(v.dataFim&&v.dataFim<v.data)v.dataFim=v.data;var corpo=Object.assign({},e,v);delete corpo.id;return St.salvar("agenda",id||null,corpo).then(function(){S.toast("Compromisso salvo.");});},
    aoExcluir:id?function(){return St.excluir("agenda",id);}:null});
  return d;
}
M.calendario={render:function(m,id,vista){
  var adm=S.ehAdm();
  m.innerHTML=cab("Calendário",adm?"Produções, visitas, compromissos e as tarefas marcadas para aparecer aqui. Cada compromisso pode ir para o Google Agenda.":"Produções, visitas, compromissos e tarefas da equipe.",
    '<div class="cal-nav"><button type="button" data-mes="-1">‹ Anterior</button><b id="cal-tit"></b><button type="button" data-mes="1">Próximo ›</button><button type="button" data-mes="0">Hoje</button></div>'+(adm?'<button type="button" class="btn btn--escuro" data-novo>+ Compromisso</button>':''))+
    '<div id="sis-lista"></div>';
  $$("[data-mes]",m).forEach(function(b){b.addEventListener("click",function(){
    var dlt=+b.getAttribute("data-mes");
    if(!dlt)mesCal=S.hoje().slice(0,7);else{var p=mesCal.split("-").map(Number),d=new Date(p[0],p[1]-1+dlt,1);mesCal=d.getFullYear()+"-"+S.pad(d.getMonth()+1);}
    vista.atualizar();
  });});
  var nb=$("[data-novo]",m);if(nb)nb.addEventListener("click",function(){modalEvento(null);});
  $("#sis-lista",m).addEventListener("click",function(e){
    var ev=e.target.closest("[data-evento]");if(ev){verEvento(ev.getAttribute("data-evento"));return;}
    var add=e.target.closest("[data-dia]");if(add&&adm)modalEvento(null,add.getAttribute("data-dia"));
  });
  vista.atualizar=function(){
    var p=mesCal.split("-").map(Number),ini=new Date(p[0],p[1]-1,1),h=S.hoje();
    var nm=S.MESES[p[1]-1];$("#cal-tit",m).textContent=nm.charAt(0).toUpperCase()+nm.slice(1)+" de "+p[0];
    var d=new Date(ini);d.setDate(1-ini.getDay());
    var html='<div class="cal">'+["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(function(x){return '<div class="cal__dow">'+x+'</div>';}).join("");
    for(var i=0;i<42;i++){
      var iso=S.isoLocal(d),fora=d.getMonth()!==p[1]-1,evs=eventosDoDia(iso);
      if(i>=35&&fora&&d.getDate()<=7)break;
      html+='<div class="cal__dia'+(fora?" fora":"")+(iso===h?" hoje":"")+'"><span class="cal__n">'+d.getDate()+'</span>'+
        evs.map(function(e){var t=TIPOS_AG[e.tipo]||TIPOS_AG.outro;return '<button type="button" class="ev" style="--evc:'+t[1]+';--evf:'+t[2]+'" data-evento="'+esc(e.id)+'" title="'+esc(e.titulo)+'">'+esc((e.hora?e.hora+" ":"")+e.titulo)+'</button>';}).join("")+
        (adm?'<button type="button" class="cal__add" data-dia="'+iso+'" aria-label="Novo compromisso em '+S.dataBR(iso)+'"></button>':'')+'</div>';
      d.setDate(d.getDate()+1);
    }
    html+='</div>';
    var prox=proximosEventos(10);
    html+='<section class="sis-sec proximos"><h2>Próximos</h2><div class="itens">'+(prox.length?prox.map(itemEvento).join(""):'<p class="nota">Nada marcado.</p>')+'</div></section>';
    html+='<p class="nota">Legenda: '+Object.keys(TIPOS_AG).map(function(k){return '<span class="tag" style="--c:'+TIPOS_AG[k][1]+';margin-right:14px">'+TIPOS_AG[k][0]+'</span>';}).join("")+'</p>';
    $("#sis-lista",m).innerHTML=html;
  };
  if(!carregando($("#sis-lista",m),vista,["agenda","tarefas"]))vista.atualizar();
}};

/* ================= PARCEIROS ================= */
var CAMPOS_PARC={
  projeto:[["etapa","Etapa"],["fornecedor","Fornecedor"],["responsavel","Responsável"],["contato","Contato"],["email","E-mail"],["valor","Valor"],["obs","Observação"]],
  execucao:[["tipo","Tipo"],["fornecedor","Fornecedor"],["responsavel","Responsável"],["produtoMo","Produto e MO"],["contato","Contato"],["email","E-mail"],["valor","Valor"],["obs","Observação"]],
  loja:[["produto","Produto"],["fornecedor","Fornecedor"],["responsavel","Responsável"],["site","Site / Instagram"],["contato","Contato"],["email","E-mail"],["valor","Valor"],["obs","Observação"]],
  online:[["produto","Produto"],["fornecedor","Fornecedor"],["ondeVende","Onde vende?"],["site","Site"],["valor","Valor"],["obs","Observação"]],
  marcas:[["marca","Marca"],["produto","Produto"],["ondeVende","Onde vende?"],["site","Site"],["valor","Valor"],["obs","Observação"]]
};
var fParc={aba:"projeto",q:""};
function nomeCat(k){var c=CATS_PARC.filter(function(x){return x[0]===k;})[0];return c?c[1]:k;}
function modalParceiro(id,cat){
  var p=id?St.copia("parceiros",id):{cat:cat};cat=p.cat||cat;
  var cs=CAMPOS_PARC[cat].map(function(c){return {k:c[0],r:c[1],t:c[0]==="obs"?"area":(c[0]==="email"?"email":"text"),full:c[0]==="obs"};});
  S.modalForm({sobre:"Cadastro",titulo:(id?"Fornecedor":"Novo fornecedor")+" · "+nomeCat(cat),campos:cs,dados:p,salvarRot:id?"Salvar":"+ Adicionar",
    aoSalvar:function(v){var corpo=Object.assign({},p,v,{cat:cat});delete corpo.id;if(!id)corpo.criadoEm=S.agoraISO();return St.salvar("parceiros",id||null,corpo).then(function(){S.toast("Parceiro salvo.");});},
    aoExcluir:id?function(){return St.excluir("parceiros",id);}:null});
}
/* Campos que cada papel vê: o colaborador não vê o valor */
function camposParc(cat){return CAMPOS_PARC[cat].filter(function(c){return S.ehAdm()||c[0]!=="valor";});}
/* Colaborador: só vê os dados do fornecedor, sem editar nem excluir */
function verParceiro(id){
  var p=St.get("parceiros",id);if(!p)return;
  var lin=camposParc(p.cat||"projeto").filter(function(c){return p[c[0]];});
  S.modal({sobre:"Fornecedor · "+nomeCat(p.cat),titulo:nomeParceiro(id),semFoco:1,
    corpo:'<dl class="itens">'+(lin.length?lin.map(function(c){return '<div class="item"><b>'+esc(c[1])+'</b><span style="grid-column:1/-1;color:var(--tinta);overflow-wrap:anywhere">'+esc(p[c[0]])+'</span></div>';}).join(""):'<p class="nota">Sem dados preenchidos.</p>')+'</dl>',
    pe:'<button type="button" class="btn btn--escuro" data-fechar>Fechar</button>'});
}
M.parceiros={render:function(m,id,vista){
  var adm=S.ehAdm();
  m.innerHTML=cab("Parceiros e fornecedores","Projeto, execução, lojas, online e marcas. "+(adm?"Toque num fornecedor para editar os dados.":"Toque num fornecedor para ver os dados de contato."),adm?'<button type="button" class="btn btn--escuro" data-novo>+ Novo fornecedor</button>':'')+
    '<div class="sis-barra">'+pilulas(CATS_PARC,fParc.aba,"data-aba","Categoria")+busca(fParc.q,"Buscar fornecedor…")+'</div><div id="sis-lista"></div>';
  if(adm)$("[data-novo]",m).addEventListener("click",function(){modalParceiro(null,fParc.aba);});
  $("[data-q]",m).addEventListener("input",function(e){fParc.q=e.target.value;vista.atualizar();});
  ligarPil(m,"data-aba",function(v){fParc.aba=v;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){if(adm)modalParceiro(id);else verParceiro(id);});
  vista.atualizar=function(){
    var todos=St.list("parceiros"),cor=(CATS_PARC.filter(function(c){return c[0]===fParc.aba;})[0]||[])[2];
    contarPil(m,"data-aba",function(a){return todos.filter(function(p){return p.cat===a;}).length;});
    var cs=camposParc(fParc.aba).filter(function(c){return c[0]!=="obs";}).slice(0,5);
    var l=todos.filter(function(p){return p.cat===fParc.aba&&contem(fParc.q,camposParc(fParc.aba).map(function(c){return p[c[0]];}));}).sort(function(a,b){return String(nomeParceiro(a.id)).localeCompare(String(nomeParceiro(b.id)));});
    $("#sis-lista",m).innerHTML=tabela(cs.map(function(c,i){return {r:c[1],v:function(p){var v=p[c[0]];return esc(v||"—");},cl:i>1?"sec":""};}),l,"Nenhum fornecedor nesta categoria.",function(){return cor;});
  };
  if(!carregando($("#sis-lista",m),vista,"parceiros"))vista.atualizar();
}};

/* ================= TAREFAS ================= */
var COLS_K=[["afazer","A fazer","#7D7A75"],["andamento","Em andamento","#B08A3E"],["concluida","Concluídas","#3E6B48"]];
var fTar={resp:"todos"};
function ehMinha(t){if(S.ehAdm())return t.resp==="adm";return (S.Sessao.membroId&&t.resp===S.Sessao.membroId)||(S.Sessao.userId&&t.respUser===S.Sessao.userId);}
/* Quem pode ser responsável: [id, nome, userId]. O colaborador não lê Equipe (dados pessoais),
   então o adm espelha só os nomes em time/lista, que o colaborador lê. */
function timeLista(){
  var adm=["adm","Shylton (administrador)",""];
  if(S.ehAdm()&&(St.modo!=="db"||St.carregado.equipe))return [adm].concat(St.list("equipe").filter(function(x){return x.status==="ativo";}).map(function(x){return [x.id,x.nome,x.userId||""];}));
  var l=((St.get("time","lista")||{}).membros||[adm]).slice(),eu=S.Sessao.membroId;
  if(eu&&!l.some(function(x){return x[0]===eu;}))l.push([eu,S.Sessao.nome||"Eu",S.Sessao.userId||""]);
  return l;
}
function syncTime(){
  if(!S.ehAdm()||(St.modo==="db"&&!St.carregado.equipe))return;
  var l=timeLista();if(JSON.stringify(l)===JSON.stringify((St.get("time","lista")||{}).membros))return;
  St.salvar("time","lista",{membros:l}).catch(function(){});
}
function opcoesResp(){return timeLista().map(function(x){return [x[0],x[1]];});}
function modalTarefa(id,coluna){
  var adm=S.ehAdm(),t=id?St.copia("tarefas",id):{coluna:coluna||"afazer",resp:adm?"adm":(S.Sessao.membroId||""),criadaEm:S.agoraISO()};
  var cs=[{k:"titulo",r:"Tarefa",req:1,full:1},{k:"desc",r:"Detalhes",t:"area",full:1},
    {k:"inicio",r:"Início",t:"date"},{k:"prazo",r:"Prazo (fim)",t:"date"},{k:"hora",r:"Horário de início",t:"time"},{k:"horaFim",r:"Horário de fim",t:"time"},
    {k:"calendario",r:"Mostrar no calendário",t:"check",full:1}];
  cs.push({k:"resp",r:"Responsável",t:"select",o:opcoesResp()},{k:"coluna",r:"Coluna",t:"select",o:COLS_K});
  var temData=id&&(t.inicio||t.prazo);
  S.modalForm({sobre:"Tarefas",titulo:id?"Editar tarefa":"Nova tarefa",campos:cs,dados:t,salvarRot:id?"Salvar":"+ Adicionar",
    depois:'<p class="nota" style="margin-top:var(--s-16)">Marque <b>Mostrar no calendário</b> para a tarefa aparecer no Calendário da área restrita, do início ao prazo.'+(temData?' <a class="lnk" target="_blank" rel="noopener" href="'+esc(gcal(evTarefa(Object.assign({id:id},t))))+'">Adicionar ao Google Agenda ↗</a>':'')+'</p>',
    aoSalvar:function(v){
      var corpo=Object.assign({},t,v);delete corpo.id;
      if(corpo.calendario&&!corpo.inicio&&!corpo.prazo){S.toast("Para mostrar no calendário, informe o início ou o prazo.");return false;}
      if(corpo.inicio&&corpo.prazo&&corpo.prazo<corpo.inicio)corpo.prazo=corpo.inicio;
      var mb=timeLista().filter(function(x){return x[0]===corpo.resp;})[0];
      if(corpo.resp==="adm"){corpo.respNome="Shylton";corpo.respUser="";}
      else if(mb){corpo.respNome=mb[1];corpo.respUser=mb[2];}
      else if(!id&&!adm){corpo.respNome=S.Sessao.nome||"";corpo.respUser=S.Sessao.userId||"";}
      return St.salvar("tarefas",id||null,corpo).then(function(){S.toast("Tarefa salva.");});
    },
    aoExcluir:id&&adm?function(){return St.excluir("tarefas",id);}:null});
}
/* Rodapé do cartão: 12/11 → 15/11 · 09:00; o ícone de calendário aparece quando a tarefa está no calendário */
function quando(t){
  function dm(d){return S.dataBR(d).slice(0,5);}
  if(!t.inicio&&!t.prazo)return 'sem prazo';
  var txt=t.inicio&&t.prazo&&t.inicio!==t.prazo?dm(t.inicio)+" → "+dm(t.prazo):dm(t.prazo||t.inicio);
  if(t.hora)txt+=" · "+t.hora+(t.horaFim?"–"+t.horaFim:"");
  return (t.calendario?ik("cal"):ik("relogio"))+esc(txt);
}
function moverTarefa(id,col){var t=St.copia("tarefas",id);if(!t||t.coluna===col)return;t.coluna=col;if(col==="concluida")t.concluidaEm=S.agoraISO();delete t.id;St.salvar("tarefas",id,t).catch(S.erroGravar);}
M.tarefas={render:function(m,id,vista){
  var adm=S.ehAdm();
  syncTime();
  var eu=adm?"adm":S.Sessao.membroId;
  var opts=[["todos","Todas"],["minhas","Minhas"]].concat(timeLista().filter(function(x){return x[0]!==eu;}).map(function(x){return [x[0],x[1]];}));
  if(!opts.some(function(o){return o[0]===fTar.resp;}))fTar.resp="todos";
  m.innerHTML=cab("Tarefas",adm?"Para você e para a equipe. Use o filtro para ver as suas, as de um colaborador ou as de toda a equipe; arraste os cartões entre as colunas.":"Suas tarefas e as da equipe. Escolha o responsável de cada tarefa e use o filtro para ver as de cada pessoa; arraste os cartões entre as colunas.",'<button type="button" class="btn btn--escuro" data-nova>+ Nova tarefa</button>')+
    '<div class="k-filtro"><label class="f">Mostrar tarefas de'+selectHTML("data-resp",opts,fTar.resp)+'</label><p class="k-filtro__n" id="k-total"></p></div><div id="sis-lista"></div>';
  $("[data-nova]",m).addEventListener("click",function(){modalTarefa(null);});
  $("[data-resp]",m).addEventListener("change",function(e){fTar.resp=e.target.value;vista.atualizar();});
  var caixa=$("#sis-lista",m);
  caixa.addEventListener("click",function(e){
    var mv=e.target.closest("[data-mover]");if(mv){moverTarefa(mv.getAttribute("data-id"),mv.getAttribute("data-mover"));return;}
    var nv=e.target.closest("[data-nova-col]");if(nv){modalTarefa(null,nv.getAttribute("data-nova-col"));return;}
    var c=e.target.closest("[data-tarefa]");if(c)modalTarefa(c.getAttribute("data-tarefa"));
  });
  caixa.addEventListener("dragstart",function(e){var c=e.target.closest("[data-tarefa]");if(!c)return;e.dataTransfer.setData("text/plain",c.getAttribute("data-tarefa"));e.dataTransfer.effectAllowed="move";c.classList.add("arrastando");});
  caixa.addEventListener("dragend",function(e){var c=e.target.closest("[data-tarefa]");if(c)c.classList.remove("arrastando");$$(".kcol",caixa).forEach(function(k){k.classList.remove("sobre");});});
  caixa.addEventListener("dragover",function(e){var k=e.target.closest(".kcol");if(!k)return;e.preventDefault();$$(".kcol",caixa).forEach(function(x){x.classList.toggle("sobre",x===k);});});
  caixa.addEventListener("drop",function(e){var k=e.target.closest(".kcol");if(!k)return;e.preventDefault();k.classList.remove("sobre");var tid=e.dataTransfer.getData("text/plain");if(tid)moverTarefa(tid,k.getAttribute("data-col"));});
  vista.atualizar=function(){
    var h=S.hoje();
    var l=St.list("tarefas").filter(function(t){return fTar.resp==="todos"||(fTar.resp==="minhas"?ehMinha(t):t.resp===fTar.resp);});
    $("#k-total",m).innerHTML='<b>'+l.length+'</b> '+(l.length===1?"cartão":"cartões");
    caixa.innerHTML='<div class="kanban">'+COLS_K.map(function(c,ci){
      var ts=l.filter(function(t){return (t.coluna||"afazer")===c[0];}).sort(function(a,b){return String(a.prazo||a.inicio||"9999").localeCompare(String(b.prazo||b.inicio||"9999"))||String(a.criadaEm||"").localeCompare(String(b.criadaEm||""));});
      return '<section class="kcol'+(c[0]==="concluida"?" kcol--feita":"")+'" data-col="'+c[0]+'" style="--c:'+c[2]+'"><h2><i aria-hidden="true"></i>'+c[1]+'<span>'+ts.length+'</span></h2>'+
        ts.map(function(t){
          var atras=t.prazo&&t.prazo<h&&c[0]!=="concluida",resp=t.respNome||(t.resp==="adm"?"Shylton":"");
          return '<article class="kcard" draggable="true" data-tarefa="'+esc(t.id)+'">'+(resp?'<span class="av av--p" title="'+esc(resp)+'">'+esc(iniciais(resp))+'</span>':'')+'<h3>'+esc(t.titulo)+'</h3>'+(t.desc?'<p>'+esc(String(t.desc).slice(0,120))+'</p>':'')+
            (resp?'<p class="kcard__resp">'+esc(resp)+'</p>':'')+
            '<div class="kcard__pe"><span class="kcard__data'+(atras?" atrasada":"")+'"'+(t.calendario?' title="Aparece no calendário"':'')+'>'+quando(t)+'</span><span>'+
            (ci>0?'<button type="button" data-mover="'+COLS_K[ci-1][0]+'" data-id="'+esc(t.id)+'" aria-label="Mover para '+COLS_K[ci-1][1]+'">←</button>':'')+
            (ci<2?'<button type="button" data-mover="'+COLS_K[ci+1][0]+'" data-id="'+esc(t.id)+'" aria-label="Mover para '+COLS_K[ci+1][1]+'">→</button>':'')+'</span></div></article>';
        }).join("")+'<button type="button" class="k-nova" data-nova-col="'+c[0]+'">+ Tarefa</button></section>';
    }).join("")+'</div>';
  };
  if(!carregando(caixa,vista,"tarefas"))vista.atualizar();
}};

/* ================= EQUIPE ================= */
function modalMembro(id){
  var x=id?St.copia("equipe",id):{status:"ativo",membro:"nao",acesso:"colaborador"};
  if(!x.membro)x.membro="nao";
  var antes=id?St.copia("equipe",id):null;
  function gravar(corpo){
    if(corpo.membro==="sim"&&!corpo.email)return Promise.reject({code:"sem_email"});
    return St.salvar("equipe",id||null,corpo).then(function(){return S.sincAcesso(antes,corpo);});
  }
  function falhou(e){if(e&&e.code==="sem_email")S.toast("Para ser membro, preencha o e-mail: é com ele que a pessoa entra.");else S.erroGravar(e);}
  var d=S.modalForm({sobre:"Equipe",titulo:id?x.nome:"Novo membro",dados:x,salvarRot:id?"Salvar":"+ Adicionar",
    campos:[{k:"nome",r:"Nome",req:1},{k:"funcao",r:"Função"},{k:"email",r:"E-mail",t:"email",ajuda:"É com este e-mail que o membro entra na área restrita."},{k:"telefone",r:"Telefone / WhatsApp",t:"tel"},{k:"cidade",r:"Cidade"},{k:"pix",r:"Chave PIX"},
      {k:"membro",r:"Membro",t:"select",o:[["nao","Não: sem acesso à área restrita"],["sim","Sim: liberar acesso à área restrita"]]},
      {k:"acesso",r:"Acesso do membro",t:"select",o:[["colaborador","Colaborador: Produções e Parceiros (só ver), Tarefas e Calendário"],["adm","Administrador: acesso completo"]],ajuda:"Vale só quando Membro é Sim."},
      {k:"status",r:"Situação",t:"select",o:S.opcoes("equipe"),ajuda:"Bloqueado tira o acesso, mesmo sendo membro."},{k:"obs",r:"Observações",t:"area",full:1}],
    antes:id&&(x.status==="pendente"||x.membro!=="sim")&&x.status!=="bloqueado"?'<div class="item" style="margin-bottom:var(--s-16)"><b>'+(x.status==="pendente"?"Cadastro aguardando liberação":"Sem acesso à área restrita")+'</b><div class="acoes"><button type="button" class="btn btn--escuro" data-liberar>Tornar membro e liberar acesso</button></div></div>':'',
    aoSalvar:function(v){var corpo=Object.assign({},x,v);delete corpo.id;if(!id)corpo.criadoEm=S.agoraISO();return gravar(corpo).then(function(){S.toast(S.membroLiberado(corpo)?"Membro salvo, com acesso liberado.":"Membro salvo, sem acesso.");},function(e){if(e&&e.code==="sem_email"){falhou(e);var c=$('[data-k="email"]',d);if(c){c.setAttribute("aria-invalid","true");c.focus();}return false;}throw e;});},
    aoExcluir:id?function(){return St.excluir("equipe",id).then(function(){return S.sincAcesso(antes,null);});}:null});
  var lb=$("[data-liberar]",d);
  if(lb)lb.addEventListener("click",function(){var c=Object.assign({},x,{status:"ativo",membro:"sim"});delete c.id;gravar(c).then(function(){S.fecharModal();S.toast(x.nome+" agora é membro, com acesso liberado.");},falhou);});
}
M.equipe={render:function(m,id,vista){
  m.innerHTML=cab("Equipe","Só quem é membro entra na área restrita. Marque <b>Membro: Sim</b> e escolha o acesso: colaborador vê Tarefas e Calendário, e consulta Produções e Parceiros (sem valores nem RT). Toque num membro para editar os dados.",'<button type="button" class="btn btn--escuro" data-novo>+ Novo membro</button>')+
    '<div id="sis-lista"></div>';
  ligarCopiarLink(m);
  $("[data-novo]",m).addEventListener("click",function(){modalMembro(null);});
  aoClicarLinha($("#sis-lista",m),modalMembro);
  vista.atualizar=function(){
    syncTime();
    var ordem={pendente:0,ativo:1,bloqueado:2};
    var l=St.list("equipe").sort(function(a,b){return (ordem[a.status]-ordem[b.status])||String(a.nome).localeCompare(String(b.nome));});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Colaborador",v:function(x){return '<span class="tab__pessoa">'+av(x.nome)+'<span>'+esc(x.nome)+'</span></span>';}},
      {r:"Função",v:function(x){return esc(x.funcao||"—");},cl:"sec"},
      {r:"Contato",v:function(x){return esc(x.email||"—")+(x.telefone?'<small>'+esc(x.telefone)+'</small>':'');}},
      {r:"Membro",v:function(x){return x.membro==="sim"?"Sim":"Não";}},
      {r:"Acesso",v:function(x){return !S.membroLiberado(x)?"Sem acesso":(x.acesso==="adm"?"Administrador":"Colaborador");},cl:"sec"},
      {r:"Situação",v:function(x){return S.tag("equipe",x.status);}}
    ],l,"Ainda não há membros. Use Novo membro.",function(x){return corSt("equipe",x.status);});
  };
  if(!carregando($("#sis-lista",m),vista,"equipe"))vista.atualizar();
}};

/* ================= AJUSTES ================= */
M.ajustes={render:function(m,id,vista){
  if(carregando(m,vista,"config"))return;
  vista.vivo=false;
  var c=S.cfg();
  m.innerHTML=cab("Ajustes","Tabela da calculadora, seus dados no contrato e textos padrão.",'<button type="button" class="btn btn--escuro" data-salvar>Salvar ajustes</button>')+
  '<div id="aj-form">'+
  '<section class="sis-sec"><h2>Calculadora<small>Usada nos pedidos do site e nas propostas novas. Proposta antiga não muda sozinha.</small></h2><div class="fgrid">'+S.campos([
    {k:"calc.base",r:"1º ambiente (R$)",t:"money"},{k:"calc.adicional",r:"Cada ambiente a mais (R$)",t:"money"},
    {k:"calc.m2Base",r:"Metragem incluída por ambiente (m²)",t:"number"},{k:"calc.m2Extra",r:"Cada m² acima disso (R$)",t:"money"},
    {k:"calc.fatorFoto",r:"Acréscimo: produção para foto (%)",t:"pct"},{k:"calc.fatorMostra",r:"Acréscimo: mostra ou exposição (%)",t:"pct"},
    {k:"calc.fatorCliente",r:"Acréscimo: cliente final (%)",t:"pct"},{k:"calc.semProjeto",r:"Acréscimo sem projeto ou SketchUp (%)",t:"pct"},
    {k:"calc.urgDias",r:"Urgência: data em menos de (dias)",t:"number"},{k:"calc.urgPerc",r:"Acréscimo de urgência (%)",t:"pct"},
    {k:"calc.deslocamento",r:"Deslocamento fora das cidades-base (R$)",t:"money"},{k:"calc.cidadesBase",r:"Cidades-base (separadas por vírgula)"},
    {k:"calc.arredondar",r:"Arredondar para cima, de (R$)",t:"money"},{k:"calc.diasMin",r:"Prazo mínimo (dias)",t:"number"},
    {k:"calc.diasPorAmbiente",r:"Dias por ambiente",t:"number"},{k:"calc.ambPorAjudante",r:"Ambientes por ajudante",t:"number"}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>Avisos e links</h2><div class="fgrid">'+S.campos([
    {k:"whatsappAdm",r:"WhatsApp que recebe os pedidos",t:"tel"},{k:"siteUrl",r:"Endereço do site",ajuda:"Usado nos links de cadastro. Troque pelo domínio quando o site for publicado."}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>Seus dados no contrato<small>Ficam guardados só para o administrador.</small></h2><div class="fgrid">'+S.campos([
    {k:"contratado.nome",r:"Nome completo"},{k:"contratado.marca",r:"Marca"},{k:"contratado.nacionalidade",r:"Nacionalidade"},{k:"contratado.profissao",r:"Profissão"},
    {k:"contratado.cpf",r:"CPF"},{k:"contratado.cau",r:"Registro CAU"},{k:"contratado.endereco",r:"Endereço profissional",full:1},
    {k:"contratado.email",r:"E-mail",t:"email"},{k:"contratado.telefone",r:"Telefone"},{k:"contratado.instagram",r:"Instagram"},{k:"contratado.cidade",r:"Cidade (proposta)"},
    {k:"contratado.pix",r:"Chave PIX"}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>Padrões do contrato</h2><div class="fgrid">'+S.campos([
    {k:"contrato.sinal",r:"Sinal (%)",t:"pct"},{k:"contrato.limiteDespesa",r:"Despesa sem aprovação escrita até (R$)",t:"money"},
    {k:"contrato.diaria",r:"Dia extra de trabalho (R$)",t:"money"},{k:"contrato.prazoConceito",r:"Entrega do conceito (dias)",t:"number"},
    {k:"contrato.prazoAprovacao",r:"Prazo para aprovar (dias)",t:"number"},{k:"contrato.revisoes",r:"Rodadas de ajuste",t:"number"},
    {k:"contrato.diasCancel",r:"Antecedência para cancelar (dias)",t:"number"},{k:"contrato.retencao",r:"Retenção no cancelamento (%)",t:"pct"},
    {k:"contrato.retencaoMax",r:"Retenção máxima (%)",t:"pct"},{k:"contrato.prazoFotos",r:"Prazo para enviar fotos (dias)",t:"number"},
    {k:"contrato.multaFotos",r:"Multa se não enviar fotos (%)",t:"pct"},{k:"contrato.foro",r:"Foro"},{k:"contrato.cidade",r:"Cidade da assinatura"}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>Textos padrão da proposta</h2><div class="fgrid">'+S.campos([
    {k:"proposta.pagamento",r:"Forma de pagamento"},{k:"proposta.etapas",r:"Etapas"},
    {k:"proposta.exclusoes",r:"Exclusões",t:"area",full:1},{k:"proposta.observacoes",r:"Observações (uma por linha)",t:"area",full:1,alt:120},
    {k:"proposta.creditos",r:"Observação em destaque (vermelho)",full:1}],c)+'</div></section>'+
  '</div>'+
  '<section class="sis-sec"><h2>Dados</h2><div class="acoes"><button type="button" class="lnk" data-backup>Baixar cópia de todos os dados (JSON)</button>'+(St.modo==="local"?'<button type="button" class="lnk lnk--perigo" data-limpar>Apagar dados da demonstração</button>':'')+'</div></section>';
  $("[data-salvar]",m).addEventListener("click",function(){
    var v=S.lerCampos($("#aj-form",m)),atual=St.copia("config","geral")||{};delete atual.id;
    ["calc","contratado","contrato","proposta"].forEach(function(k){atual[k]=Object.assign({},atual[k]||{},v[k]||{});});
    atual.whatsappAdm=v.whatsappAdm;atual.siteUrl=v.siteUrl;
    St.salvar("config","geral",atual).then(function(){S.toast("Ajustes salvos.");},S.erroGravar);
  });
  $("[data-backup]",m).addEventListener("click",function(){var o={};["propostas","clientes","contratos","producoes","financeiro","parceiros","tarefas","agenda","equipe","avisos","config"].forEach(function(k){o[k]=St.list(k);});S.salvarArquivo("backup-area-restrita-"+S.hoje()+".json",JSON.stringify(o,null,2));});
  var lp=$("[data-limpar]",m);if(lp)lp.addEventListener("click",function(){if(!window.confirm("Apagar todos os dados da demonstração neste navegador?"))return;St.dados={};St.gravar();S.toast("Dados apagados.");S.render();});
}};
})();
