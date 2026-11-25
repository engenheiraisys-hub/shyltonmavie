/* Área restrita · módulos: início, propostas, produções, financeiro, contratos, clientes, calendário, parceiros, tarefas, equipe, ajustes */
(function(){
"use strict";
var S=window.SIS,M=S.mod,St=S.Store,esc=S.esc,num=S.num,brl=S.brl,$=S.$,$$=S.$$;

/* ---------- peças comuns ---------- */
/* Cabeçalho de tela: ‹ Voltar, título, ações à direita e descrição embaixo */
function cab(t,sub,dir,voltar){
  var v=voltar||(S.ehAdm()&&t!=="Início"?["#adm/inicio","Início"]:null);
  return '<header class="sis-cab">'+(v?'<a class="sis-voltar" href="'+v[0]+'" aria-label="Voltar para '+esc(v[1])+'">‹ Voltar</a>':'')+
    '<div class="sis-cab__lin"><h1>'+icoTela()+esc(t)+'</h1>'+(dir?'<div class="sis-ferr">'+dir+'</div>':'')+'</div>'+(sub?'<p class="sis-cab__sub">'+sub+'</p>':'')+'</header>';
}
/* Ícones de traço (grade 24, cantos retos): extras de indicadores e cartões. A biblioteca principal é S.ICO (sis-base), que também tem os ícones dos botões */
var IK={
  texto:'<path d="M4 6h16M4 10h16M4 14h11M4 18h7"/>',
  peca:'<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9"/>',
  dados:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v1"/>',
  aviso:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
  ampulheta:'<path d="M7 3.5h10M7 20.5h10"/><path d="M8 3.5c0 4.5 8 4.5 8 8.5s-8 4-8 8.5M16 3.5c0 4.5-8 4.5-8 8.5s8 4 8 8.5"/>',
  x:'<circle cx="12" cy="12" r="8.5"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
  relogio:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  grafico:'<path d="M3.5 20.5h17"/><path d="M7 17v-5M12 17V6.5M17 17V9.5"/>',
  saida:'<path d="M12 3.5v12M7 10.5l5 5 5-5"/><path d="M4 20.5h16"/>',
  tarefa:'<rect x="3.5" y="3.5" width="17" height="17"/><path d="M8 12.5l3 3 5.5-6"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  lupa:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
  seta:'<path d="M9.5 6l6 6-6 6"/>',
  entrega:'<path d="M3.5 6.5h10v10h-10z"/><path d="M13.5 10h4l3 3.5v3h-7"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/>',
  retirada:'<path d="M4 11v9.5h16V11"/><path d="M12 16V3.5M7.5 8l4.5-4.5L16.5 8"/>'
};
function ik(n,cl){return '<svg class="'+(cl||"ik")+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(IK[n]||S.ICO[n]||"")+'</svg>';}
/* Ícone do título da página: o mesmo do item do menu (telas de detalhe usam o da lista) */
var ICO_ROTA={proposta:"propostas",contrato:"contratos",producao:"producoes",cliente:"clientes",parceiro:"parceiros",membro:"equipe",revisao:"contratos",minhas:"producoes"};
function icoTela(){var r=(location.hash.split("/")[1]||"inicio").split("?")[0];r=ICO_ROTA[r]||r;return S.ICO[r]?ik(r):"";}
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
function caixaLink(rot,h,txt){
  var u=linkCadastro(h);
  return '<section class="sis-link"><div><h2>'+ik("link")+esc(rot)+'</h2><p>'+(txt||"Compartilhe este link: quando o cliente preencher, ele entra na lista abaixo.")+'</p></div>'+
    '<div class="acoes"><a class="lnk" href="#'+h+'">'+ik("previa")+'Ver o formulário</a><button type="button" class="btn btn--escuro" data-copiar-link="'+esc(u)+'">'+ik("link")+'Copiar link</button></div>'+
    '<p class="sis-link__url">'+esc(u)+'</p></section>';
}
function ligarCopiarLink(raiz){$$("[data-copiar-link]",raiz).forEach(function(b){b.addEventListener("click",function(){S.copiar(b.getAttribute("data-copiar-link"));});});}
function carregando(m,vista,cols){
  cols=[].concat(cols);
  if(St.modo==="db"&&cols.some(function(c){return !St.carregado[c];})){m.innerHTML='<p class="vazio-sis" style="margin-top:var(--s-32)">Carregando…</p>';vista.vivo=true;return true;}
  return false;
}
function opcoesClientes(){return [["","— escolha um cliente —"]].concat(St.list("clientes").sort(function(a,b){return String(a.nome).localeCompare(String(b.nome));}).map(function(c){return [c.id,c.nome+(c.cidade?" · "+c.cidade:"")];}));}
var CATS_PARC=S.CATS_PARC;
/* Categorias de antes de 2026-11-15: fichas antigas aparecem em "Outras" até o adm escolher a categoria nova */
var CATS_ANTIGAS={projeto:"Projeto",execucao:"Execução",loja:"Loja",online:"Online",marcas:"Marcas"};
function catNova(k){return CATS_PARC.some(function(c){return c[0]===k;});}
function opcoesParceiros(){
  var todos=St.list("parceiros");
  return [["","— parceiro —"]].concat(CATS_PARC.concat([["outras","Outras"]]).map(function(c){
    return {grupo:c[1],itens:todos.filter(function(p){return c[0]==="outras"?!catNova(p.cat):p.cat===c[0];}).map(function(p){return [p.id,nomeParceiro(p.id)];})};
  }).filter(function(g){return g.itens.length;}));
}
function selectHTML(attrs,opts,v){
  return '<select '+attrs+'>'+opts.map(function(o){
    if(o&&o.grupo)return '<optgroup label="'+esc(o.grupo)+'">'+o.itens.map(function(x){return '<option value="'+esc(x[0])+'"'+(String(x[0])===String(v)?" selected":"")+'>'+esc(x[1])+'</option>';}).join("")+'</optgroup>';
    return '<option value="'+esc(o[0])+'"'+(String(o[0])===String(v)?" selected":"")+'>'+esc(o[1])+'</option>';
  }).join("")+'</select>';
}

/* ================= INÍCIO ================= */
/* Lembretes de vencidos e de propostas sem resposta saem sozinhos por e-mail, todo dia às 8h
   (supabase/functions/lembretes); não aparecem no Início. */
function diasDesde(d){return Math.round((new Date(S.hoje()+"T12:00")-new Date(String(d).slice(0,10)+"T12:00"))/864e5);}
function quandoVence(d){var n=diasDesde(d);return n<=0?"vence hoje":"venceu em "+S.dataBR(d)+" (há "+n+" dia"+(n>1?"s":"")+")";}
/* Financeiro do Início: parcelas e RT vencidas e recebimentos de hoje (inclui RT anotada na produção e ainda não lançada) */
function finInicio(){
  var h=S.hoje(),fin=St.list("financeiro"),l=[];
  fin.forEach(function(f){
    var d=String(f.data||"").slice(0,10);
    if(f.tipo!=="entrada"||f.status!=="pendente"||!d||d>h)return;
    l.push({fin:f.id,href:"#adm/financeiro",tit:f.descricao||"—",valor:f.valor,data:d,tipo:catFin(f.categoria)==="RT / comissão"?"RT":"Parcela"});
  });
  St.list("producoes").forEach(function(p){
    if(p.status==="cancelada"||fin.some(function(f){return f.producaoId===p.id;}))return;
    (p.pecas||[]).forEach(function(x){
      var v=Math.round(num(x.valor)*num(x.art))/100;if(!v||!x.dataRT||x.dataRT>h)return;
      l.push({href:"#adm/producao/"+p.id,tit:"RT · "+(nomeParceiro(x.parceiroId)||"parceiro")+" · "+(p.titulo||"produção"),valor:v,data:x.dataRT,tipo:"RT ainda não lançada"});
    });
  });
  return l.sort(function(a,b){return a.data.localeCompare(b.data);});
}
function secIni(t,sub,itens,vazio){return '<section class="sis-sec"><h2>'+t+'<small>'+sub+'</small></h2><div class="itens">'+(itens.length?itens.join(""):'<p class="nota">'+vazio+'</p>')+'</div></section>';}
M.inicio={vivo:true,render:function(m){
  var h=S.hoje(),lim=S.somaDias(h,30);
  var props=St.list("propostas"),cons=St.list("contratos"),prods=St.list("producoes"),tars=St.list("tarefas");
  /* Aviso de proposta que já foi excluída não aparece (avisos antigos, de antes da limpeza ao excluir) */
  var propOk=St.modo!=="db"||St.carregado.propostas;
  var avs=St.list("avisos").filter(function(a){return !a.enviado&&!a.lembrete&&!(propOk&&a.propostaId&&!St.get("propostas",a.propostaId));}).sort(function(a,b){return porData(a,b,"criadoEm");});
  var novas=props.filter(function(p){return stProp(p)==="nova";}).length;
  var aAssinar=cons.filter(function(c){return c.status==="rascunho"||c.status==="enviado";}).length;
  var proxP=prods.filter(function(p){return p.status!=="cancelada"&&p.dataInicio>=h&&p.dataInicio<=lim;}).length;
  var abertas=tars.filter(function(t){return t.coluna!=="concluida";}).length;
  var venc=finInicio();
  /* Para finalizar e enviar (nova / rascunho) vêm antes; depois o que espera o cliente. Mais antigos primeiro. */
  var dia=function(v){return String(v||"").slice(0,10);};
  var quando=function(rot,d){var n=d?diasDesde(d):0;return d?" · "+rot+" em "+S.dataBR(d)+(n>0?" (há "+n+" dia"+(n>1?"s":"")+")":" (hoje)"):"";};
  var antes=function(f){return function(a,b){return f(a).localeCompare(f(b));};};
  var dCri=function(p){return dia(p.criadaEm);},dEnv=function(p){return dia(p.enviadaEm||p.criadaEm);};
  var dConC=function(c){return dia(c.criadoEm);},dConE=function(c){return dia(c.enviadoEm||c.criadoEm);};
  var propNovas=props.filter(function(p){return stProp(p)==="nova";}).sort(antes(dCri));
  var enviadas=props.filter(function(p){return stProp(p)==="enviada";}).sort(antes(dEnv));
  var conRasc=cons.filter(function(c){return stCon(c)==="rascunho";}).sort(antes(dConC));
  var aguard=cons.filter(function(c){return stCon(c)==="enviado";}).sort(antes(dConE));
  var itemProp=function(p){var st=stProp(p),nv=st==="nova";
    return '<a class="item item--d" href="#adm/proposta/'+esc(p.id)+'"><b>'+esc(p.num)+' · '+esc(p.cliente&&p.cliente.nome||"Sem nome")+'</b><span>'+brl(p.valor)+'</span><span>'+esc((nv?"Finalizar e enviar · ":"")+(S.FINALIDADES[p.finalidade]||"Proposta")+(nv?(p.origem==="site"||p.origem==="link"?" · pedido do "+p.origem:"")+quando("criada",dCri(p)):quando("enviada",dEnv(p))))+'</span>'+S.tag("proposta",st)+'</a>';};
  var itemCon=function(c){var k=c.campos||{},st=stCon(c),rs=st==="rascunho";
    return '<a class="item item--d" href="#adm/contrato/'+esc(c.id)+'"><b>'+esc(c.num)+' · '+esc(nomeCliente(c.clienteId)||"Sem cliente")+'</b><span>'+(num(k.valor)?brl(k.valor):"sem valor")+'</span><span>'+esc((rs?"Finalizar e enviar · ":"")+(k.ambientes||"sem ambientes")+(rs?quando("criado",dConC(c)):quando("enviado",dConE(c))))+'</span>'+S.tag("contrato",st)+'</a>';};
  var eventos=proximosEventos(6);
  m.innerHTML=cab("Início",esc(S.dataExtenso(h)))+
    kpis([
      {r:"Propostas novas",v:novas,chip:"Ver propostas",cor:"#5F6F7A",ico:"envio",href:"#adm/propostas"},
      {r:"Contratos sem assinatura",v:aAssinar,chip:"Ver contratos",cor:"#B08A3E",ico:"doc",href:"#adm/contratos"},
      {r:"Produções em 30 dias",v:proxP,chip:"Ver produções",cor:"#3E6B48",ico:"cal",href:"#adm/producoes"},
      {r:"Tarefas abertas",v:abertas,chip:"Ver tarefas",cor:"#7D7A75",ico:"tarefa",href:"#adm/tarefas"}])+
    /* Ordem pedida pela Isys: compromissos, financeiro, propostas, contratos */
    secIni(ik("calendario")+"Próximos compromissos",'<a class="lnk" href="#adm/calendario">Abrir o calendário</a>',eventos.map(itemEvento),"Nada marcado.")+
    secIni(ik("financeiro")+"Financeiro",'Parcelas e RT vencidas e recebimentos de hoje. <a class="lnk" href="#adm/financeiro">Abrir o financeiro</a>',venc.map(function(f){var hj=f.data>=h;
      return '<a class="item item--d" href="'+esc(f.href)+'"'+(f.fin?' data-fin="'+esc(f.fin)+'"':'')+'><b>'+esc(f.tit)+'</b><span class="pos">+ '+brl(f.valor)+'</span><span>'+esc(f.tipo+" · "+quandoVence(f.data))+'</span><span class="tag" style="--c:'+(hj?"#B08A3E":"#9A3B2E")+'">'+(hj?"hoje":"vencida")+'</span></a>';}),"Nada vencido e nenhum recebimento para hoje.")+
    secIni(ik("propostas")+"Propostas",'Novas para finalizar e enviar, e enviadas esperando resposta. <a class="lnk" href="#adm/propostas">Ver propostas</a>',propNovas.concat(enviadas).map(itemProp),"Nenhuma proposta para enviar ou esperando resposta.")+
    secIni(ik("contratos")+"Contratos",'Rascunhos para finalizar e enviar, e enviados aguardando assinatura. <a class="lnk" href="#adm/contratos">Ver contratos</a>',conRasc.concat(aguard).map(itemCon),"Nenhum contrato para enviar ou aguardando assinatura.")+
    (avs.length?'<section class="sis-sec"><h2>'+ik("whats")+'WhatsApp para enviar<small>Pedidos que chegaram pelo formulário do site.</small></h2><div class="itens">'+
      avs.map(function(a){
        var tel=a.tipo==="adm"?S.cfg().whatsappAdm:a.para,lk=a.propostaId?["#adm/proposta/"+a.propostaId,"Ver proposta"]:null;
        return '<div class="item"><b>'+(a.tipo==="adm"?"Para Shylton":"Para o cliente"+(a.nome?" · "+esc(a.nome):""))+' · '+esc(a.num||"")+'</b><span>'+esc(S.dataBR(a.criadoEm))+'</span><pre>'+esc(a.texto)+'</pre>'+
          '<div class="acoes"><a class="btn btn--linha" href="'+esc(S.waLink(tel,a.texto))+'" target="_blank" rel="noopener">'+ik("whats")+'Abrir no WhatsApp ↗</a><button type="button" class="lnk" data-enviado="'+esc(a.id)+'">'+ik("ok")+'Marcar como enviada</button>'+(lk?'<a class="lnk" href="'+esc(lk[0])+'">'+esc(lk[1])+'</a>':'')+'</div></div>';
      }).join("")+'</div></section>':'');
  $$("[data-fin]",m).forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();modalFin(a.getAttribute("data-fin"));});});
  $$("[data-enviado]",m).forEach(function(b){b.addEventListener("click",function(){
    var id=b.getAttribute("data-enviado"),a=St.copia("avisos",id);if(!a||!a.texto)return;
    delete a.id;a.enviado=true;a.enviadoEm=S.agoraISO();
    St.salvar("avisos",id,a).then(function(){S.toast("Marcada como enviada.");},S.erroGravar);
  });});
  $$("[data-evento]",m).forEach(function(b){b.addEventListener("click",function(){verEvento(b.getAttribute("data-evento"));});});
}};

/* ================= PROPOSTAS ================= */
var fProp={st:"todas",q:""};
function opcoesFin(){return Object.keys(S.FINALIDADES).map(function(k){return [k,S.FINALIDADES[k]];});}
function stProp(p){return p.status==="revisao"?"nova":p.status;} /* "Em revisão" saiu: propostas antigas contam como Nova */
M.propostas={render:function(m,id,vista){
  m.innerHTML=cab("Propostas","Os pedidos do <b>Contato</b> no site e do <b>link</b> chegam aqui já calculados pela <b>tabela de preços</b>. Revise, ajuste e envie. Acompanhe as propostas <b>em aberto</b>, <b>aceitas</b> e <b>recusadas</b>.",'<a class="btn btn--linha" href="#adm/ajustes">'+ik("calc")+'Tabela de preços</a><a class="btn btn--escuro" href="#adm/proposta/nova">'+ik("mais")+'Nova proposta</a>')+
    caixaLink("Link para o cliente pedir proposta","pedido-proposta","Mande este link ao cliente: o pedido dele entra na lista abaixo como Nova, já calculado.")+
    '<div id="prop-kpis"></div><div class="sis-barra">'+pilulas(comCor("proposta",["todas","Todas"]),fProp.st,"data-st","Status")+busca(fProp.q,"Buscar cliente ou número…")+'</div><div id="sis-lista"></div>';
  ligarCopiarLink(m);
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
      {r:"Data sugerida",v:function(p){var d=S.datasProposta(p);return esc(S.dataBR(d[0])||"—")+(d.length>1?" +"+(d.length-1):"");},cl:"sec"},
      {r:"Valor",v:function(p){return brl(p.valor);},cl:"num"},
      {r:"Status",v:function(p){return S.tag("proposta",stProp(p))+(p.origem==="site"||p.origem==="link"?'<small class="sec">pelo '+p.origem+'</small>':'');}}
    ],l,todas.length?"Nenhuma proposta com esse filtro.":"Ainda não há propostas. Elas chegam pelo formulário do Contato no site, ou crie uma em Nova proposta.",function(p){return corSt("proposta",stProp(p));});
  };
  if(!carregando($("#sis-lista",m),vista,"propostas"))vista.atualizar();
}};

var NPARC=[2,3,4,5,6,7,8,9,10,11,12].map(function(n){return [String(n),n+"x"];});
/* Proposta → contrato: forma de pagamento e 1ª data da produção */
function pagContrato(p){
  var t=S.pagTipo(p);
  return t==="vista"?{pagamentoTipo:"vista"}:t==="parcelado"?{pagamentoTipo:"parcelado",nParcelas:String(p.nParcelas||3)}:t==="5050"?{pagamentoTipo:"sinal",sinal:50}
    :{pagamentoTipo:"outro",pagamentoOutro:p.pagamento||""};
}
M.proposta={render:function(m,id,vista){
  var ed;
  if(carregando(m,vista,["propostas","clientes","config","contratos"]))return;
  function conDaProposta(pid){return pid?St.list("contratos").filter(function(c){return c.propostaId===pid;})[0]:null;}
  if(id==="nova"){ed=S.novaProposta();}
  else{
    ed=St.copia("propostas",id);
    if(!ed){m.innerHTML=cab("Proposta não encontrada","",'',["#adm/propostas","Propostas"]);return;}
    ed.status=stProp(ed);
  }
  ed.pagTipo=S.pagTipo(ed);if(!ed.nParcelas)ed.nParcelas="3";
  vista.vivo=false;
  var temAssets=false;S.usar("assets").then(function(a){temAssets=!!a&&St.modo==="db";var b=temAssets&&$("#ed-amb",m);if(b)b.innerHTML=ambHTML();});
  var aba="slides";
  function camposCliente(){return [
    {k:"cliente.nome",r:"Nome do cliente",req:1},{k:"cliente.empresa",r:"Empresa ou projeto",ph:"Ex.: REVEEV"},
    {k:"cliente.codigo",r:"Código ou evento",ph:"Ex.: MT26"},{k:"cliente.local",r:"Localização",ph:"Cidade/UF"},
    {k:"cliente.telefone",r:"WhatsApp",t:"tel"},{k:"cliente.email",r:"E-mail",t:"email"}];}
  /* Portfólio da proposta: produções do site (window.SM_PROJETOS, do index.html), até 6; sem marcar, entram 4 da categoria da finalidade */
  function portHTML(){
    var l=window.SM_PROJETOS||[],sel=ed.portfolio||[];
    if(!l.length)return '<p class="nota">As produções do site não estão disponíveis nesta página.</p>';
    return '<div class="fgrid">'+S.campos([{k:"semPortfolio",r:"Não incluir portfólio nesta proposta",t:"check",full:1}],ed)+'</div>'+
      '<div id="ed-port"'+(ed.semPortfolio?' hidden':'')+'><p class="nota port-nota">Marque até 6 produções, na ordem em que devem aparecer. Sem marcar nenhuma, entram 4 da categoria da finalidade.</p>'+
      '<div class="port-sel">'+l.map(function(x){return '<label class="chk"><input type="checkbox" data-port="'+esc(x.slug)+'"'+(sel.indexOf(x.slug)>=0?' checked':'')+'><span>'+esc(x.nome)+' <small class="sec">'+esc(x.cat)+'</small></span></label>';}).join("")+'</div></div>';
  }
  function ambHTML(){
    return ed.ambientes.map(function(a,i){
      var fotos=(a.fotos||[]);
      return '<div class="rep__lin" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr) auto" data-ai="'+i+'">'+
        '<label class="f">Ambiente<input type="text" data-ak="nome" value="'+esc(a.nome)+'" placeholder="Ex.: sala de estar"></label>'+
        '<label class="f">m²<input type="text" inputmode="decimal" data-ak="m2" value="'+esc(a.m2)+'"></label>'+
        '<button type="button" class="rep__x" data-rem-amb="'+i+'">'+ik("excluir")+'Remover</button>'+
        (fotos.length?'<div class="miniaturas">'+fotos.map(function(f){return S.linkArq(f,S.imgArq(f,f.nome))||'<span>'+esc(f.nome)+'</span>';}).join("")+'</div>':'')+
        (temAssets?'<label class="f f--full" style="grid-column:1/-1">Adicionar fotos<input type="file" accept="image/*" multiple data-fotos="'+i+'"></label>':'')+
      '</div>';
    }).join("");
  }
  /* Mais de uma data para a produção (pedido da Isys, 2026-11-24): a Data sugerida + outras datas */
  function datasHTML(){
    return (ed.datasExtra||[]).map(function(d,i){
      return '<div class="rep__lin" style="grid-template-columns:minmax(0,1fr) auto;margin-bottom:var(--s-12)"><label class="f">Outra data<input type="date" data-dx="'+i+'" value="'+esc(d)+'"></label>'+
        '<button type="button" class="rep__x" data-rem-data="'+i+'">'+ik("excluir")+'Remover</button></div>';
    }).join("")+'<p><button type="button" class="lnk" data-add-data>'+ik("mais")+'Adicionar outra data</button></p>';
  }
  /* Forma de pagamento: mostra Número de vezes só no parcelado e o texto só em Outra; nos outros, o texto sai sozinho */
  function pagVis(){
    var t=ed.pagTipo,n=$('[data-k="nParcelas"]',m),p=$('[data-k="pagamento"]',m),nt=$("#ed-pag",m);
    if(t!=="outro"){ed.pagamento=S.textoPagamento(ed);if(p)p.value=ed.pagamento;}
    if(n)n.closest("label").hidden=t!=="parcelado";if(p)p.closest("label").hidden=t!=="outro";
    if(nt){nt.hidden=t==="outro";nt.innerHTML="Na proposta: <b>"+esc(ed.pagamento)+"</b>";}
  }
  function arquivosHTML(){
    var l=ed.arquivos||[];
    return l.length?'<div class="miniaturas">'+l.map(function(f){return S.linkArq(f,esc(f.nome)+' ↗',"lnk")||'<span>'+esc(f.nome)+(f.nota?' · '+esc(f.nota):'')+'</span>';}).join("")+'</div>':'<p class="nota">Nenhum arquivo de projeto enviado.</p>';
  }
  function calcHTML(){
    var r=S.calcular(ed);
    return r.itens.map(function(i){return '<li><span>'+esc(i.rot)+'</span><span>'+brl(i.v)+'</span></li>';}).join("")+'<li class="total"><span>Valor calculado (arredondado)</span><span>'+brl(r.total)+'</span></li>';
  }
  function desenhar(){
    var novo=!ed.id,ct=conDaProposta(ed.id);
    m.innerHTML=cab(novo?"Nova proposta":"Proposta "+ed.num,novo?"Preencha os dados; o valor é calculado pela tabela de Ajustes.":esc((ed.origem==="site"?"Pedido pelo site":ed.origem==="link"?"Pedido pelo link":"Criada na área restrita")+" em "+S.dataBR(ed.criadaEm)),
      '<label class="f" style="min-width:180px">Status'+selectHTML('data-k="status"',S.opcoes("proposta"),ed.status)+'</label>'+
      '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>'+ik("salvar")+'Salvar</button><button type="button" class="btn btn--linha" data-pdf>'+ik("baixar")+'Baixar PDF</button>'+(ct?'<a class="lnk" href="#adm/contrato/'+esc(ct.id)+'">'+ik("contratos")+'Ver contrato</a>':'')+(novo?'':'<button type="button" class="btn btn--linha btn--perigo" data-excluir>'+ik("excluir")+'Excluir</button>')+'</div>',
      ["#adm/propostas","Propostas"])+
    '<div class="ed"><div class="ed__form" id="ed-form">'+
      '<section class="ed__bloco"><h2>'+ik("clientes")+'Cliente</h2><div class="fgrid"><label class="f f--full">Vincular a um cliente cadastrado'+selectHTML('data-vinc',opcoesClientes(),ed.clienteId)+'</label>'+S.campos(camposCliente(),ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("propostas")+'Pedido</h2><div class="fgrid">'+S.campos([
        {k:"finalidade",r:"Finalidade",t:"select",o:opcoesFin()},
        {k:"dataSugerida",r:"Data sugerida",t:"date"}],ed)+'<div id="ed-datas" style="grid-column:1/-1">'+datasHTML()+'</div>'+
        S.campos([{k:"temProjeto",r:"Tem projeto ou arquivo do SketchUp",t:"check",full:1}],ed)+
        '<div class="f f--full">Arquivos de projeto'+arquivosHTML()+'</div>'+
        ((ed.fotos||[]).length?'<div class="f f--full">Fotos do espaço<div class="miniaturas">'+ed.fotos.map(function(f){return S.linkArq(f,S.imgArq(f,f.nome))||'<span>'+esc(f.nome)+(f.nota?' · '+esc(f.nota):'')+'</span>';}).join("")+'</div></div>':'')+
        S.campos([{k:"mensagem",r:"Mensagem do cliente",t:"area",full:1}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("ambiente")+'Ambientes</h2><div class="rep" id="ed-amb">'+ambHTML()+'</div><p style="margin-top:var(--s-12)"><button type="button" class="lnk" data-add-amb>'+ik("mais")+'Adicionar ambiente</button></p></section>'+
      '<section class="ed__bloco"><h2>'+ik("calc")+'Calculadora<small>valores-base em <a class="lnk" href="#adm/ajustes">Ajustes</a></small></h2><ul class="calc" id="ed-calc">'+calcHTML()+'</ul><div class="fgrid">'+S.campos([
        {k:"valor",r:"Valor da proposta (R$)",t:"money"},{k:"valorManual",r:"Usar valor manual (não recalcular)",t:"check"},
        {k:"dias",r:"Prazo de execução (dias)",t:"number"},{k:"ajudantes",r:"Ajudantes",t:"number"}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("texto")+'Texto da proposta</h2><div class="fgrid">'+S.campos([
        {k:"data",r:"Data da proposta",t:"date"},{k:"pagTipo",r:"Forma de pagamento",t:"select",o:S.PAG_TIPOS},
        {k:"nParcelas",r:"Número de vezes",t:"select",o:NPARC},
        {k:"validade",r:"Validade da proposta (dias)",t:"number",ph:"10",ajuda:"Aparece em Próximos passos, com as datas sugeridas da produção."}],ed)+
        '<p class="nota" id="ed-pag" style="grid-column:1/-1"></p>'+S.campos([
        {k:"pagamento",r:"Forma de pagamento (texto)",full:1},
        {k:"etapas",r:"Etapas",full:1},
        {k:"contexto",r:"Contexto (opcional)",full:1,ph:"Ex.: para o espaço da REVEEV projetado por Manu P.",ajuda:"Completa a frase “Apresentamos as condições para a produção… mencionados na proposta”."},
        {k:"tituloInvest",r:"Título do investimento",full:1,ph:"Ex.: Quarto REVEEV - Manu Pagliosa"},
        {k:"exclusoes",r:"Exclusões",t:"area",full:1},
        {k:"observacoes",r:"Observações (uma por linha)",t:"area",full:1,alt:120},
        {k:"creditos",r:"Observação em destaque (vermelho)",full:1}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("producoes")+'Portfólio<small>fotos das produções do site</small></h2>'+portHTML()+'</section>'+
    '</div><aside class="ed__prev"><div class="abas-mini" role="tablist"><button type="button" role="tab" data-aba="slides" aria-selected="'+(aba==="slides")+'">'+ik("propostas")+'Proposta</button><button type="button" role="tab" data-aba="whats" aria-selected="'+(aba==="whats")+'">'+ik("whats")+'WhatsApp</button></div><div class="ed__prev-corpo" id="ed-prev"></div></aside></div>';
    ligar();previa();
  }
  var previa=S.debounce(function(){
    pagVis();
    var box=$("#ed-prev",m);if(!box)return;
    if(aba==="slides"){box.innerHTML='<div class="slides">'+S.slidesHTML(ed)+'</div>';return;}
    var c=ed.cliente||{};
    box.innerHTML='<div class="itens">'+
      '<div class="item"><b>Para Shylton</b><span>'+esc(S.cfg().whatsappAdm)+'</span><pre>'+esc(S.msgAdm(ed))+'</pre><div class="acoes"><a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(S.waLink(S.cfg().whatsappAdm,S.msgAdm(ed)))+'">'+ik("whats")+'Abrir no WhatsApp ↗</a></div></div>'+
      '<div class="item"><b>Para o cliente</b><span>'+esc(c.telefone||"sem telefone")+'</span><pre>'+esc(S.msgCliente(ed))+'</pre><div class="acoes">'+(c.telefone?'<a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(S.waLink(c.telefone,S.msgCliente(ed)))+'">'+ik("whats")+'Enviar ao cliente ↗</a>':'<span class="nota">Informe o WhatsApp do cliente.</span>')+'</div></div>'+
      '<p class="nota">No site com servidor, essas duas mensagens saem sozinhas quando o pedido chega. Aqui, os botões abrem o WhatsApp com o texto pronto.</p></div>';
  },180);
  function recalc(mudouAmb){
    var r=S.calcular(ed);
    if(mudouAmb){ed.dias=r.dias;ed.ajudantes=r.ajudantes;var d=$('[data-k="dias"]',m),a=$('[data-k="ajudantes"]',m);if(d)d.value=r.dias;if(a)a.value=r.ajudantes;}
    if(!ed.valorManual){ed.valor=r.total;var v=$('[data-k="valor"]',m);if(v&&document.activeElement!==v)v.value=S.fmtValor(r.total);}
    var c=$("#ed-calc",m);if(c)c.innerHTML=calcHTML();
    previa();
  }
  /* Aceita → o contrato nasce sozinho em rascunho, com a proposta como Anexo I (uma vez por proposta; flag contratoCriado).
     Sem os botões Imprimir e Gerar contrato: a Isys pediu (2026-11-09). */
  function salvar(){
    var f=$("#ed-form",m);if(!S.validar(f))return Promise.reject({code:"validacao"});
    pagVis();ed.datasExtra=(ed.datasExtra||[]).filter(Boolean);
    if(ed.status==="enviada"&&!ed.enviadaEm)ed.enviadaEm=S.hoje(); /* conta os 7 dias do lembrete */
    var criar=false;
    if(ed.status==="aceita"&&!ed.contratoCriado){ed.contratoCriado=true;criar=!conDaProposta(ed.id);}
    var pc=criar&&!ed.clienteId?St.salvar("clientes",null,{tipo:"PF",nome:(ed.cliente||{}).nome,email:(ed.cliente||{}).email,telefone:(ed.cliente||{}).telefone,cidade:(ed.cliente||{}).local,origem:"Proposta "+ed.num,criadoEm:S.agoraISO()}):Promise.resolve(ed.clienteId);
    return pc.then(function(cid){
      ed.clienteId=cid||"";
      var corpo=S.clone(ed),pid=ed.id;delete corpo.id;
      return St.salvar("propostas",pid||null,corpo).then(function(nid){ed.id=nid;if(!pid)history.replaceState(null,"","#adm/proposta/"+nid);
        if(!criar){S.toast("Proposta salva.");return nid;}
        return novoContrato(nid).then(function(kid){var k=St.get("contratos",kid);S.toast("Proposta aceita. Contrato "+(k&&k.num||"")+" criado em rascunho, com a proposta no Anexo I.");desenhar();return nid;});
      });
    });
  }
  function novoContrato(pid){
    var c=S.cfg().contrato;
    return St.salvar("contratos",null,{num:S.proxNum("contratos","C"),status:"rascunho",clienteId:ed.clienteId,propostaId:pid,criadoEm:S.agoraISO(),
      campos:Object.assign({finalidade:ed.finalidade,ambientes:S.listaAmbientes(ed),enderecoServico:"",dataInicio:S.datasProposta(ed)[0]||"",dias:ed.dias,ajudantes:ed.ajudantes,dataDesmontagem:"",valor:ed.valor,
        sinal:c.sinal,pagamentoOutro:"",pix:"",limiteDespesa:c.limiteDespesa,diaria:c.diaria,
        prazoConceito:c.prazoConceito,prazoAprovacao:c.prazoAprovacao,revisoes:c.revisoes,diasCancel:c.diasCancel,retencao:c.retencao,retencaoMax:c.retencaoMax,
        prazoFotos:c.prazoFotos,multaFotos:c.multaFotos,foro:c.foro,cidade:c.cidade,dataAssinatura:S.hoje()},pagContrato(ed))});
  }
  function ligar(){
    $("[data-salvar]",m).addEventListener("click",function(){var novo=!ed.id,ja=ed.contratoCriado;salvar().then(function(){if(novo&&ja===ed.contratoCriado)desenhar();},function(e){if(!e||e.code!=="validacao")S.erroGravar(e);});});
    $("[data-pdf]",m).addEventListener("click",function(){S.propostaPDF(ed);});
    var x=$("[data-excluir]",m);if(x)x.addEventListener("click",function(){S.confirmar({titulo:"Excluir a proposta "+ed.num+"?"}).then(function(sim){if(!sim)return;var pid=ed.id;
      St.excluir("propostas",pid).then(function(){
        /* os avisos de WhatsApp desta proposta saem junto do Início */
        return Promise.all(St.list("avisos").filter(function(a){return a.propostaId===pid;}).map(function(a){return St.excluir("avisos",a.id).catch(function(){});}));
      }).then(function(){location.hash="#adm/propostas";},S.erroGravar);});});
    $("#ed-datas",m).addEventListener("click",function(e){var a=e.target.closest("[data-add-data]"),r=e.target.closest("[data-rem-data]");if(!a&&!r)return;
      ed.datasExtra=(ed.datasExtra||[]).slice();if(a)ed.datasExtra.push("");else ed.datasExtra.splice(+r.getAttribute("data-rem-data"),1);
      $("#ed-datas",m).innerHTML=datasHTML();if(a){var ns=$$("[data-dx]",m);if(ns.length)ns[ns.length-1].focus();}previa();});
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
    if(t.hasAttribute("data-port")){
      if(e.type!=="change")return;
      var s=t.getAttribute("data-port"),lp=(ed.portfolio||[]).filter(function(x){return x!==s;});
      if(t.checked){if(lp.length>=6){t.checked=false;S.toast("Escolha até 6 produções.");return;}lp.push(s);} /* ordem = ordem em que foram marcadas */
      ed.portfolio=lp;previa();return;
    }
    if(t.getAttribute("data-k")==="semPortfolio"){ed.semPortfolio=t.checked;var ep=$("#ed-port",m);if(ep)ep.hidden=t.checked;previa();return;}
    if(t.hasAttribute("data-dx")){ed.datasExtra[+t.getAttribute("data-dx")]=t.value;previa();return;}
    if(t.hasAttribute("data-ak")){var lin=t.closest("[data-ai]");ed.ambientes[+lin.getAttribute("data-ai")][t.getAttribute("data-ak")]=t.value;recalc(e.type==="change");return;}
    var k=t.getAttribute("data-k");if(!k)return;
    var v=t.type==="checkbox"?t.checked:t.value;
    if(t.getAttribute("data-num"))v=num(v);
    S.setPath(ed,k,v);
    if(k==="status"&&v==="aceita"&&e.type==="change"&&!ed.contratoCriado){salvar().catch(function(er){if(!er||er.code!=="validacao")S.erroGravar(er);});return;}
    if(k==="valor"&&e.type==="input"){ed.valorManual=true;var vm=$('[data-k="valorManual"]',m);if(vm)vm.checked=true;}
    if(k==="valor"&&e.type==="change")t.value=S.fmtValor(ed.valor);
    if(k==="valorManual"&&!v){recalc();return;}
    if(k==="dias"||k==="ajudantes"||k==="valor"){previa();var c2=$("#ed-calc",m);if(c2)c2.innerHTML=calcHTML();return;}
    recalc();
  }
  m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);
  desenhar();
}};

/* ================= CONTRATOS ================= */
var fCon={st:"todos",q:"",ano:"todos"};
function stCon(c){return c.status==="concluido"?"assinado":c.status;} /* Concluído saiu: contratos antigos contam como Assinado */
M.contratos={render:function(m,id,vista){
  var anos=[];St.list("contratos").forEach(function(c){var a=String(c.criadoEm||"").slice(0,4);if(a&&anos.indexOf(a)<0)anos.push(a);});anos.sort().reverse();
  m.innerHTML=cab("Contratos",'Modelo revisado a partir do contrato base. <a class="lnk" href="#adm/revisao">Ver a revisão jurídica</a>',selPil("Ano","data-ano",[["todos","Todos os anos"]].concat(anos.map(function(a){return [a,a];})),fCon.ano)+'<a class="btn btn--escuro" href="#adm/contrato/novo">'+ik("mais")+'Novo contrato</a>')+
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
  m.innerHTML=cab("Revisão do contrato base","Leitura do contrato com Alexandre Oltramari (junho de 2024) e o que mudou no modelo usado pelo sistema. Revisão feita com base na legislação brasileira; antes de usar, peça a um advogado para validar.",'<a class="btn btn--linha" href="#adm/contrato/novo">'+ik("doc")+'Abrir o modelo revisado</a>',["#adm/contratos","Contratos"])+S.revisaoHTML();
}};

M.contrato={render:function(m,id,vista){
  var ed;
  if(carregando(m,vista,["contratos","clientes","propostas","config","producoes","financeiro"]))return;
  if(id==="novo"){var c0=S.cfg().contrato;ed={num:S.proxNum("contratos","C"),status:"rascunho",clienteId:"",propostaId:"",criadoEm:S.agoraISO(),campos:Object.assign({finalidade:"foto",ambientes:"",enderecoServico:"",dataInicio:"",dias:2,ajudantes:1,dataDesmontagem:"",valor:0,pagamentoTipo:"sinal",pagamentoOutro:"",pix:"",dataAssinatura:S.hoje()},c0)};}
  else{ed=St.copia("contratos",id);if(!ed){m.innerHTML=cab("Contrato não encontrado","",'',["#adm/contratos","Contratos"]);return;}ed.status=stCon(ed);}
  vista.vivo=false;
  var aba="contrato";
  function propOpts(){return [["","— sem proposta —"]].concat(St.list("propostas").sort(function(a,b){return porData(a,b,"criadaEm");}).map(function(p){return [p.id,p.num+" · "+((p.cliente&&p.cliente.nome)||"")+" · "+brl(p.valor)];}));}
  function prodDoContrato(cid){return cid?St.list("producoes").filter(function(p){return p.contratoId===cid;})[0]:null;}
  function desenhar(){
    var cli=ed.clienteId?St.get("clientes",ed.clienteId):null,pr=prodDoContrato(ed.id);
    m.innerHTML=cab("Contrato "+ed.num,cli?esc(cli.nome):"Escolha o cliente e complete os dados.",
      '<label class="f" style="min-width:200px">Status'+selectHTML('data-k="status"',S.opcoes("contrato"),ed.status)+'</label>'+
      '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>'+ik("salvar")+'Salvar</button><button type="button" class="btn btn--linha" data-pdf>'+ik("baixar")+'Baixar PDF</button><button type="button" class="btn btn--linha" data-docx>'+ik("baixar")+'Baixar .docx</button>'+(pr?'<a class="lnk" href="#adm/producao/'+esc(pr.id)+'">'+ik("producoes")+'Ver produção</a>':'')+(ed.id?'<button type="button" class="btn btn--linha btn--perigo" data-excluir>'+ik("excluir")+'Excluir</button>':'')+'</div>',
      ["#adm/contratos","Contratos"])+
    '<div class="ed ed--meio"><div class="ed__form" id="ed-form">'+
      '<section class="ed__bloco"><h2>'+ik("equipe")+'Partes</h2><div class="fgrid">'+
        '<label class="f f--full">Cliente (contratante)'+selectHTML('data-cli',opcoesClientes(),ed.clienteId)+'</label>'+
        '<div class="acoes f--full"><button type="button" class="lnk" data-editar-cli'+(cli?'':' hidden')+'>'+ik("editar")+'Completar dados do cliente</button><button type="button" class="lnk" data-novo-cli>'+ik("mais")+'Cadastrar cliente</button><button type="button" class="lnk" data-copiar-link="'+esc(linkCadastro("cadastro-cliente"))+'">'+ik("link")+'Copiar link para o cliente preencher</button></div>'+
        '<label class="f f--full">Proposta (Anexo I)'+selectHTML('data-prop',propOpts(),ed.propostaId)+'<small>Ao escolher, ambientes, valor, prazo e data vêm da proposta, e ela entra inteira no Anexo I do contrato (na prévia e no .docx).</small></label>'+
        S.campos([{k:"campos.contratadoComo",r:"Contratado em nome de",t:"select",o:[["pf","Pessoa física (CPF)"],["pj","Empresa (CNPJ)"]],full:1,ajuda:"Pessoa física: o contrato fala só em recibo. Empresa: recibo ou nota fiscal, com a razão social e o CNPJ."}],ed)+
        '<p class="nota f--full">Seus dados de contratado (CPF, CNPJ, razão social, CAU, endereço, PIX) ficam em <a class="lnk" href="#adm/ajustes">Ajustes</a>.</p>'+
      '</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("producoes")+'Serviço</h2><div class="fgrid">'+S.campos([
        {k:"campos.finalidade",r:"Finalidade",t:"select",o:opcoesFin()},
        {k:"campos.dataInicio",r:"Início da produção",t:"date"},
        {k:"campos.ambientes",r:"Ambientes",full:1},
        {k:"campos.enderecoServico",r:"Endereço da produção",full:1,ph:"Se vazio, usa o endereço do cliente"},
        {k:"campos.dias",r:"Dias de trabalho",t:"number"},{k:"campos.ajudantes",r:"Ajudantes",t:"number"},
        {k:"campos.dataDesmontagem",r:"Desmontagem e devolução das peças",t:"date"}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("financeiro")+'Valor e pagamento</h2><div class="fgrid">'+S.campos([
        {k:"campos.valor",r:"Valor total (R$)",t:"money"},
        {k:"campos.pagamentoTipo",r:"Forma",t:"select",o:[["sinal","Sinal + saldo"],["vista","À vista na assinatura"],["parcelado","Parcelado (mensal)"],["outro","Outra"]]},
        {k:"campos.sinal",r:"Sinal (%)",t:"pct"},{k:"campos.nParcelas",r:"Número de vezes (parcelado)",t:"select",o:NPARC},
        {k:"campos.pagamentoOutro",r:"Outra forma (texto)",full:1},{k:"campos.pix",r:"Chave PIX",ph:"Se vazio, usa a de Ajustes"},
        {k:"campos.limiteDespesa",r:"Despesa sem aprovação escrita até (R$)",t:"money"},{k:"campos.diaria",r:"Dia extra de trabalho (R$)",t:"money"}],ed)+
        '<p class="nota f--full">Ao marcar <b>Assinado</b>, tudo é feito sozinho: os recebimentos vão para o <a class="lnk" href="#adm/financeiro">Financeiro</a> em A receber (o sinal ou o valor à vista na data da assinatura e o saldo no início da produção) e a produção é criada em <a class="lnk" href="#adm/producoes">Produções</a>, já no calendário.</p></div></section>'+
      '<section class="ed__bloco"><h2>'+ik("relogio")+'Prazos e condições</h2><div class="fgrid">'+S.campos([
        {k:"campos.prazoConceito",r:"Entrega do conceito (dias)",t:"number"},{k:"campos.prazoAprovacao",r:"Prazo para aprovar (dias)",t:"number"},
        {k:"campos.revisoes",r:"Rodadas de ajuste",t:"number"},{k:"campos.diasCancel",r:"Antecedência para cancelar (dias)",t:"number"},
        {k:"campos.retencao",r:"Retenção no cancelamento (%)",t:"pct"},{k:"campos.retencaoMax",r:"Retenção máxima em cima da hora (%)",t:"pct"},
        {k:"campos.prazoFotos",r:"Prazo para enviar as fotos (dias)",t:"number"},{k:"campos.multaFotos",r:"Multa se não enviar (%)",t:"pct"}],ed)+'</div></section>'+
      '<section class="ed__bloco"><h2>'+ik("contratos")+'Assinatura</h2><div class="fgrid">'+S.campos([
        {k:"campos.cidade",r:"Cidade"},{k:"campos.dataAssinatura",r:"Data",t:"date"},{k:"campos.foro",r:"Foro (comarca)",full:1}],ed)+'</div></section>'+
    '</div><aside class="ed__prev"><div class="abas-mini" role="tablist"><button type="button" role="tab" data-aba="contrato" aria-selected="'+(aba==="contrato")+'">'+ik("contratos")+'Contrato</button><button type="button" role="tab" data-aba="revisao" aria-selected="'+(aba==="revisao")+'">'+ik("trocar")+'O que mudou no modelo</button></div><p class="nota" id="ed-falta" style="margin-bottom:var(--s-12)"></p><div class="ed__prev-corpo" id="ed-prev"></div></aside></div>';
    ligar();previa();
  }
  var previa=S.debounce(function(){
    var box=$("#ed-prev",m),fl=$("#ed-falta",m);if(!box)return;
    var f=S.faltando(ed);
    fl.innerHTML=f.length?'<b>Falta preencher:</b> '+esc(f.join(", "))+'. Os campos aparecem destacados no texto.':'<span class="pos">Contrato completo, pronto para baixar e enviar para assinatura.</span>';
    box.innerHTML=aba==="contrato"?S.contratoHTML(ed):S.revisaoHTML();
  },160);
  /* Assinado → sozinho, uma vez por contrato: recebimentos em "A receber" no Financeiro (flag finLancado) e a produção em Produções/calendário (flag prodCriada).
     Sem botões: a Isys pediu (2026-11-09). Nunca duplica: confere se já há lançamento ou produção ligada ao contrato. */
  function salvar(){
    var lancar=false,criarProd=false;
    if(ed.status==="enviado"&&!ed.enviadoEm)ed.enviadoEm=S.hoje(); /* data mostrada no Início */
    if(ed.status==="assinado"){
      /* hora em que virou assinado: a função de e-mails (supabase/functions/lembretes) avisa o cliente uma vez só */
      if(!ed.assinadoEm){var ant=ed.id&&St.get("contratos",ed.id);if(!ant||ant.status!=="assinado")ed.assinadoEm=S.agoraISO();}
      if(!ed.finLancado&&num(ed.campos.valor)){ed.finLancado=true;lancar=!St.list("financeiro").some(function(f){return ed.id&&f.contratoId===ed.id;});}
      if(!ed.prodCriada){ed.prodCriada=true;criarProd=!prodDoContrato(ed.id);}
    }
    var corpo=S.clone(ed),cid=ed.id;delete corpo.id;
    return St.salvar("contratos",cid||null,corpo).then(function(nid){ed.id=nid;if(!cid)history.replaceState(null,"","#adm/contrato/"+nid);
      var l=lancar?parcelas(nid):[];
      return gravarFin(l).then(function(){return criarProd?novaProducao(nid):null;}).then(function(pid){
        var rec=l.map(function(x){return x.rot+" "+brl(x.valor)+" em "+S.dataBR(x.data);}).join(" e ");
        var semValor=ed.status==="assinado"&&!num(ed.campos.valor)?" Informe o valor para os recebimentos irem ao Financeiro.":"";
        if(pid)S.toast("Contrato assinado. Produção criada"+(rec?" e, no Financeiro, a receber: "+rec:"")+"."+semValor);
        else if(rec)S.toast("Contrato assinado. No Financeiro, a receber: "+rec+".");
        else S.toast("Contrato salvo."+semValor);
        if(pid&&cid)desenhar(); /* mostra o link Ver produção (contrato novo já é redesenhado por quem chamou) */
        return nid;
      });
    });
  }
  function novaProducao(cid){
    var c=ed.campos,cli=St.get("clientes",ed.clienteId),d=Math.max(1,Math.round(num(c.dias)||1));
    var p={titulo:(cli?cli.nome:"Produção")+(c.ambientes?" · "+c.ambientes:""),contratoId:cid,clienteId:ed.clienteId,local:c.enderecoServico||S.enderecoCli(cli),
      dataInicio:c.dataInicio||"",dataFim:c.dataInicio?S.somaDias(c.dataInicio,d-1):"",hora:"",status:"planejada",equipe:[],parceiros:[],pecas:[],checklist:checklistPadrao(),obs:"",criadoEm:S.agoraISO()};
    return St.salvar("producoes",null,p).then(function(pid){return M.producao.sync(pid,p).then(function(){return pid;});});
  }
  function parcelas(cid){
    var c=ed.campos,total=num(c.valor),nome=nomeCliente(ed.clienteId)||"cliente",base={tipo:"entrada",status:"pendente",forma:"PIX",contratoId:cid,criadoEm:S.agoraISO()},l=[];
    if(c.pagamentoTipo==="sinal"){var a=Math.round(total*(num(c.sinal)||50))/100;
      l.push(Object.assign({rot:"sinal"},base,{data:c.dataAssinatura||S.hoje(),descricao:"Sinal · contrato "+ed.num+" · "+nome,categoria:"Sinal de contrato",valor:a}));
      l.push(Object.assign({rot:"saldo"},base,{data:c.dataInicio||c.dataAssinatura||S.hoje(),descricao:"Saldo · contrato "+ed.num+" · "+nome,categoria:"Produção",valor:Math.round((total-a)*100)/100}));}
    else if(c.pagamentoTipo==="parcelado"){ /* mensal, a 1ª na assinatura; cada parcela é um lançamento do mesmo grupo, como o Parcelado do Financeiro */
      var x=S.parcelasValor(total,Math.max(2,Math.round(num(c.nParcelas)||3))),g=S.uid(),ini=c.dataAssinatura||S.hoje();
      for(var i=0;i<x.n;i++)l.push(Object.assign({rot:"parcela "+(i+1)+"/"+x.n},base,{data:somaMes(ini,i),descricao:"Parcela "+(i+1)+"/"+x.n+" · contrato "+ed.num+" · "+nome,categoria:"Produção",
        valor:x.valor(i),parcGrupo:g,parcela:i+1,parcelas:x.n}));}
    else l.push(Object.assign({rot:"total"},base,{data:c.pagamentoTipo==="vista"?(c.dataAssinatura||S.hoje()):(c.dataInicio||c.dataAssinatura||S.hoje()),descricao:"Contrato "+ed.num+" · "+nome,categoria:"Produção",valor:total}));
    return l;
  }
  function gravarFin(l){return l.reduce(function(p,x){var y=Object.assign({},x);delete y.rot;return p.then(function(){return St.salvar("financeiro",null,y);});},Promise.resolve());}
  function ligar(){
    $("[data-salvar]",m).addEventListener("click",function(){salvar().then(function(){var x=$("[data-excluir]",m);if(!x)desenhar();},S.erroGravar);});
    function baixar(tipo,fazer){var f=S.faltando(ed);if(!f.length){fazer();return;}
      S.confirmar({perigo:false,sobre:"Baixar "+tipo,ico:"baixar",icoOk:"baixar",titulo:"Ainda faltam "+f.length+" dado(s)",texto:"Eles vão aparecer destacados no "+tipo+".",ok:"Baixar mesmo assim"}).then(function(sim){if(sim)fazer();});}
    $("[data-docx]",m).addEventListener("click",function(){baixar(".docx",function(){S.contratoDocx(ed);});});
    $("[data-pdf]",m).addEventListener("click",function(){baixar("PDF",function(){pdfContrato(ed);});});
    var x=$("[data-excluir]",m);if(x)x.addEventListener("click",function(){S.confirmar({titulo:"Excluir o contrato "+ed.num+"?"}).then(function(sim){if(!sim)return;St.excluir("contratos",ed.id).then(function(){location.hash="#adm/contratos";},S.erroGravar);});});
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
      if(p){var c=ed.campos;c.finalidade=p.finalidade;c.ambientes=S.listaAmbientes(p);c.valor=p.valor;c.dias=p.dias;c.ajudantes=p.ajudantes;var dp=S.datasProposta(p);if(dp[0])c.dataInicio=dp[0];if(p.clienteId&&!ed.clienteId)ed.clienteId=p.clienteId;
        Object.assign(c,pagContrato(p));desenhar();}
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
  m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);
  desenhar();
}};

/* ================= CLIENTES ================= */
var CAMPOS_CLI=[
  {k:"tipo",r:"Tipo",t:"select",o:S.TIPOS_CLI},{k:"nome",r:"Nome completo ou razão social",req:1},
  {k:"doc",r:"CPF ou CNPJ"},{k:"rg",r:"RG"},{k:"nacionalidade",r:"Nacionalidade"},{k:"estadoCivil",r:"Estado civil"},
  {k:"profissao",r:"Profissão"},{k:"email",r:"E-mail",t:"email"},{k:"telefone",r:"Telefone / WhatsApp",t:"tel"},{k:"instagram",r:"Instagram"},
  {k:"cep",r:"CEP"},{k:"endereco",r:"Rua / avenida"},{k:"numero",r:"Número"},{k:"complemento",r:"Complemento"},
  {k:"bairro",r:"Bairro"},{k:"cidade",r:"Cidade"},{k:"uf",r:"Estado (UF)"},{k:"representante",r:"Representante legal"},
  {k:"repCpf",r:"CPF do representante"},{k:"origem",r:"Origem",ro:1},{k:"obs",r:"Observações",t:"area",full:1}];
S.modalCliente=function(id,aoSalvar){
  var c=id?St.copia("clientes",id):{tipo:"PF",origem:"Cadastro manual"};
  if(c)c.tipo=S.tipoCli(c.tipo); /* loja/escritório antigos abrem como Pessoa jurídica e gravam "PJ" ao salvar */
  var props=id?St.list("propostas").filter(function(p){return p.clienteId===id;}):[],cons=id?St.list("contratos").filter(function(x){return x.clienteId===id;}):[];
  var depois=id?'<div class="ed__bloco" style="margin-top:var(--s-24);padding-bottom:0"><h2>'+ik("propostas")+'Propostas e contratos</h2><div class="acoes">'+
    (props.map(function(p){return '<a class="lnk" href="#adm/proposta/'+esc(p.id)+'">Proposta '+esc(p.num)+'</a>';}).concat(cons.map(function(x){return '<a class="lnk" href="#adm/contrato/'+esc(x.id)+'">Contrato '+esc(x.num)+'</a>';})).join("")||'<span class="nota">Nenhum ainda.</span>')+'</div></div>':'';
  var fc=id?faltaCli(c):[];
  var antes=id?'<p class="nota" style="margin-bottom:var(--s-16)">'+(fc.length?'<b>Falta para o contrato:</b> '+esc(fc.join(", "))+'.':'<span class="pos">Dados completos para o contrato.</span>')+'</p>':'';
  /* Área do cliente (pedido da Isys, 2026-11-15): liberado aqui, o cliente entra com este e-mail e vê as produções dele */
  if(id&&S.clienteLiberado(c)){var conv=msgAreaCli(c);
    antes+='<p class="nota t-meet" style="margin-bottom:var(--s-16)">'+ik("clientes")+'<span>Área do cliente liberada para '+esc(c.email)+'. O acesso é em '+esc(linkCadastro("adm"))+': em Primeiro acesso, com este e-mail, cria a senha e vê as próprias produções, com contrato, proposta e orçamentos dos parceiros.'+
      (c.telefone?' <a class="lnk" target="_blank" rel="noopener" href="'+esc(S.waLink(c.telefone,conv))+'">'+ik("whats")+'Avisar pelo WhatsApp ↗</a>':'')+'</span></p>';}
  var campos=CAMPOS_CLI.slice();
  campos.splice(campos.map(function(f){return f.k;}).indexOf("instagram")+1,0,{k:"acessoArea",r:"Área do cliente",t:"select",o:[["nao","Sem acesso"],["sim","Liberado: entra com o e-mail acima"]],ajuda:"Mostra só as produções deste cliente, com contrato, proposta e orçamentos dos parceiros. Valores internos (peças, RT, financeiro) não aparecem."});
  if(!c.acessoArea)c.acessoArea="nao";
  function falhou(e){
    var m=e&&e.code==="email_equipe"?"Este e-mail é de alguém da equipe. Use outro e-mail para a área do cliente.":e&&e.code==="email_outro_cliente"?"Este e-mail já dá acesso a outro cliente. Use outro e-mail ou tire o acesso do outro cadastro.":
      e&&e.code==="sem_email"?"Para liberar a área do cliente, preencha o e-mail: é com ele que o cliente entra.":/cliente_id|membros_papel_check/i.test(String(e&&e.message||""))?"Falta rodar o area-cliente.sql no Supabase para liberar clientes.":"";
    if(!m)throw e;
    S.toast(m);
    var cp=!/\.sql/.test(m)&&$('[data-k="email"]',document.querySelector("dialog.modal")||document);if(cp){cp.setAttribute("aria-invalid","true");cp.focus();}
    return false;
  }
  S.modalForm({sobre:"Cadastro",ico:"clientes",titulo:id?c.nome:"Novo cliente",campos:campos,dados:c,antes:antes,depois:depois,aoAbrir:S.ligarTipoCliente,salvarRot:id?"Salvar":"+ Adicionar",
    aoSalvar:function(v){var corpo=Object.assign({},c,v),nid=id||S.uid();if(!id)corpo.criadoEm=S.agoraISO();delete corpo.id;
      if(corpo.acessoArea==="sim"&&!String(corpo.email||"").trim())return falhou({code:"sem_email"});
      var liberou=S.clienteLiberado(corpo)&&!(id&&S.clienteLiberado(c)&&String(c.email).trim().toLowerCase()===String(corpo.email).trim().toLowerCase());
      return S.sincCliente(nid,id?c:null,corpo).then(function(){return St.salvar("clientes",nid,corpo);}).then(function(){
        S.toast(liberou?"Cliente salvo, com a área do cliente liberada. Abra de novo para avisar pelo WhatsApp.":"Cliente salvo.");if(aoSalvar)aoSalvar(nid);},falhou);},
    aoExcluir:id?function(){return St.excluir("clientes",id).then(function(){return S.sincCliente(id,c,null);});}:null});
  var d=document.querySelector("dialog.modal");if(d)$$(".modal__corpo a",d).forEach(function(a){if(!a.target)a.addEventListener("click",S.fecharModal);});
};
function msgAreaCli(c){
  return "Olá, "+String(c.nome||"").split(/\s+/)[0]+"! Liberei seu acesso à área do cliente Shylton Mavie, onde ficam suas produções, o contrato, a proposta e os orçamentos dos parceiros. "+
    "Entre em "+linkCadastro("adm")+", toque em Primeiro acesso e crie sua senha com o e-mail "+String(c.email||"").trim()+".";
}
var fCli={q:"",ord:"cad",tipo:"todos"};
/* Filtro por tipo: Pessoa física / Pessoa jurídica (loja e escritório antigos contam como jurídica) */
function tipoFiltro(c){return S.tipoCli(c.tipo);}
/* "Completos" = o contrato sai sem lacunas na qualificação do contratante (mesmas regras do contrato, em S.faltaCliente) */
function faltaCli(c){return S.faltaCliente?S.faltaCliente(c):(c.doc&&c.endereco&&c.cidade?[]:["dados"]);}
function dadosOk(c){return !faltaCli(c).length;}
function faltaTxt(f){return f.length<=3?f.join(", "):f.slice(0,3).join(", ")+" e mais "+(f.length-3);}
M.clientes={render:function(m,id,vista){
  m.innerHTML=cab("Clientes","Cadastro feito por você ou pelo próprio cliente, pelo link. Toque num cliente para ver os dados, as propostas e os contratos.",'<button type="button" class="btn btn--escuro" data-novo>'+ik("mais")+'Novo cliente</button>')+
    caixaLink("Link de cadastro de novos clientes","cadastro-cliente")+
    '<div class="sis-barra">'+pilulas([["todos","Todos"]].concat(S.TIPOS_CLI),fCli.tipo,"data-tipo","Tipo de cliente")+
      '<div class="sis-ord"><span>Ordenar</span>'+pilulas([["cad","Cadastro"],["az","A–Z"]],fCli.ord,"data-ord","Ordenar")+'</div>'+busca(fCli.q,"Buscar cliente…")+'</div><div id="sis-lista"></div>';
  ligarCopiarLink(m);
  ligarPil(m,"data-tipo",function(v){fCli.tipo=v;vista.atualizar();});
  $("[data-novo]",m).addEventListener("click",function(){S.modalCliente(null);});
  ligarPil(m,"data-ord",function(v){fCli.ord=v;vista.atualizar();});
  $("[data-q]",m).addEventListener("input",function(e){fCli.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){S.modalCliente(id);});
  vista.atualizar=function(){
    var props=St.list("propostas"),cons=St.list("contratos"),todos=St.list("clientes");
    contarPil(m,"data-tipo",function(v){return v==="todos"?todos.length:todos.filter(function(c){return tipoFiltro(c)===v;}).length;});
    var l=todos.filter(function(c){return (fCli.tipo==="todos"||tipoFiltro(c)===fCli.tipo)&&contem(fCli.q,[c.nome,c.cidade,c.email,c.telefone,c.doc]);}).sort(function(a,b){return fCli.ord==="az"?String(a.nome).localeCompare(String(b.nome)):porData(a,b,"criadoEm");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Cliente / tipo",v:function(c){return esc(c.nome)+'<small>'+esc(S.nomeTipoCli(tipoFiltro(c))+(c.email?" · "+c.email:"")+(S.clienteLiberado(c)?" · área do cliente liberada":""))+'</small>';}},
      {r:"Propostas e contratos",v:function(c){var p=props.filter(function(x){return x.clienteId===c.id;}).length,k=cons.filter(function(x){return x.clienteId===c.id;}).length;return esc(plural(p,"proposta")+" · "+plural(k,"contrato"));},cl:"sec"},
      {r:"Cidade",v:function(c){return esc([c.cidade,c.uf].filter(Boolean).join("/")||"—");},cl:"sec"},
      {r:"Telefone",v:function(c){return esc(c.telefone||"—");}},
      {r:"Origem",v:function(c){return esc(c.origem||"—");},cl:"sec"},
      {r:"Dados para contrato",v:function(c){var f=faltaCli(c);return !f.length?'<span class="tag" style="--c:#3E6B48">completos</span>':'<span class="tag" style="--c:#B08A3E">incompletos</span><small>Falta: '+esc(faltaTxt(f))+'</small>';}}
    ],l,St.list("clientes").length?"Nenhum cliente encontrado.":"Ainda não há clientes. Eles entram pelos pedidos do site, pelo link de cadastro ou em Novo cliente.",function(c){return dadosOk(c)?"#3E6B48":"#B08A3E";});
  };
  if(!carregando($("#sis-lista",m),vista,"clientes"))vista.atualizar();
}};

/* ================= ÁREA DO CLIENTE =================
   Pedido da Isys (2026-11-15): o cliente liberado em Clientes entra com o próprio e-mail e vê as produções dele;
   em cada uma, o contrato, a proposta e os orçamentos dos parceiros anexados. No banco ele não lê nada direto:
   tudo vem da função area_cliente (supabase/area-cliente.sql), já sem peças, RT, financeiro, equipe e observações.
   Na demonstração, o mesmo formato é montado aqui com os dados deste navegador. */
var areaCli={chave:"",dados:undefined,pedindo:null};
function areaClienteDemo(cid){
  var cli=cid?St.get("clientes",cid):null;if(!S.clienteLiberado(cli))return null;
  var so=function(x){var o=S.clone(x);delete o.id;return o;};
  var prods=St.list("producoes").filter(function(p){return p.clienteId===cid;}).sort(function(a,b){return porData(a,b,"dataInicio");});
  var cons=St.list("contratos").filter(function(c){return c.clienteId===cid&&prods.some(function(p){return p.contratoId===c.id;});});
  var props=St.list("propostas").filter(function(p){return cons.some(function(c){return c.propostaId===p.id;});});
  return {clienteId:cid,cliente:so(cli),
    producoes:prods.map(function(p){return {id:p.id,dados:{titulo:p.titulo,local:p.local,dataInicio:p.dataInicio,dataFim:p.dataFim,hora:p.hora,status:p.status,contratoId:p.contratoId,clienteId:p.clienteId,
      parceiros:(p.parceiros||[]).map(function(x){return {nome:nomeParceiro(x.parceiroId)||"Parceiro",papel:x.papel||"",orcamento:x.orcamento||null,recebidos:orcRecebidos(x.chave),entrega:logiCli(x.entrega),retirada:logiCli(x.retirada)};})}};}),
    contratos:cons.map(function(c){return {id:c.id,dados:so(c)};}),propostas:props.map(function(p){return {id:p.id,dados:so(p)};})};
}
function logiCli(o){if(!o||typeof o!=="object")return null;var r={};["data","hora","resp","quem"].forEach(function(k){if(o[k])r[k]=String(o[k]);});return r;} /* o mesmo filtro da função area_cliente no banco */
/* Cronograma do cliente (2026-11-23, pedido da Isys): entrega e retirada de todas as lojas, por data e horário; sem data vai para o fim */
var DIAS_SEM=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
function diaSem(iso){var p=String(iso||"").split("-").map(Number);if(p.length<3||!p[0])return "";return DIAS_SEM[new Date(p[0],p[1]-1,p[2]).getDay()];}
function cronoHTML(p){
  var ps=p.parceiros||[];
  if(!ps.length)return '<p class="nota">As lojas desta produção ainda não estão definidas. Quando estiverem, a entrega e a retirada de cada uma aparecem aqui.</p>';
  return LOGI.map(function(g){
    var l=ps.map(function(x){var o=x[g[0]]||{};return {loja:x.nome||"Loja",papel:x.papel||"",data:o.data||"",hora:o.hora||"",resp:o.resp||"",quem:o.quem||""};})
      .sort(function(a,b){return (a.data?0:1)-(b.data?0:1)||a.data.localeCompare(b.data)||(a.hora||"99").localeCompare(b.hora||"99")||a.loja.localeCompare(b.loja,"pt-BR");});
    return '<section class="sis-sec cli-sec"><h2>'+ik(g[0])+esc(g[1])+'</h2><div class="cli-sec__corpo"><ol class="crono">'+l.map(function(c){
      var quem=c.resp==="loja"?"Pessoa da loja"+(c.quem?": "+c.quem:""):c.resp==="equipe"?"Equipe Shylton Mavie"+(c.quem?": "+c.quem:""):"Responsável a combinar";
      return '<li class="crono__item"><div class="crono__quando">'+(c.data?'<b>'+esc(diaSem(c.data))+', '+esc(S.dataBR(c.data).slice(0,5))+'</b><span>'+esc(c.hora||"horário a combinar")+'</span>':'<b>A combinar</b>')+'</div>'+
        '<div class="crono__oque"><b>'+esc(c.loja)+'</b>'+(c.papel?'<small>'+esc(c.papel)+'</small>':'')+'<span>'+ik("equipe")+esc(quem)+'</span></div></li>';
    }).join("")+'</ol></div></section>';
  }).join("");
}
function dadosArea(){
  var ch=(S.Sessao.userId||"")+"|"+(S.Sessao.membroId||"");
  if(areaCli.chave!==ch)areaCli={chave:ch,dados:undefined,pedindo:null};
  if(St.modo!=="db")return Promise.resolve(areaClienteDemo(S.Sessao.membroId));
  if(areaCli.dados!==undefined)return Promise.resolve(areaCli.dados);
  if(!areaCli.pedindo)areaCli.pedindo=S.areaClienteDb().then(function(d){areaCli.dados=d;areaCli.pedindo=null;return d;},function(e){areaCli.pedindo=null;throw e;});
  return areaCli.pedindo;
}
function periodoProd(p){
  if(!p.dataInicio)return "Data a combinar";
  var f=p.dataFim&&p.dataFim!==p.dataInicio?p.dataFim:"";
  return (f?S.dataBR(p.dataInicio).slice(0,5)+" a "+S.dataBR(f):S.dataBR(p.dataInicio))+(p.hora?" · "+p.hora:"");
}
/* PDF do contrato em arquivo (adm e cliente); se o navegador não conseguir gerar, abre a impressão (Salvar como PDF) */
function pdfContrato(ct,nomeCli){
  return S.contratoPDF(ct,nomeCli).catch(function(e){if(window.console)console.error(e);S.toast("Não foi possível gerar o PDF aqui. Na janela de impressão, escolha Salvar como PDF.");imprimirContrato(ct);});
}
function imprimirContrato(ct){
  var box=document.createElement("div");box.className="ct-print";box.innerHTML=S.contratoHTML(ct);document.body.appendChild(box);
  document.body.classList.add("imprimindo-ct");
  function fim(){document.body.classList.remove("imprimindo-ct");box.remove();window.removeEventListener("afterprint",fim);}
  window.addEventListener("afterprint",fim);
  setTimeout(function(){try{window.print();}catch(e){S.toast("A impressão não está disponível aqui. Abra o contrato em outro navegador.");}setTimeout(fim,1500);},120);
}
M.minhas={render:function(m,id,vista){
  var verCt=false,dados=null,aba="docs"; /* abas da produção: Documentos | Cronograma (entrega e retirada) */
  m.innerHTML='<p class="vazio-sis" style="margin-top:var(--s-32)">Carregando…</p>';
  function achar(l,i){return i?(l||[]).filter(function(x){return x.id===i;}).map(function(x){return Object.assign({id:x.id},x.dados);})[0]||null:null;}
  function arq(a,extra){
    var n=esc(a&&a.nome||"orçamento"),l=a?S.linkArq(a,n+' '+ik("baixar"),"lnk",true):"";
    return '<span class="orc__arq">'+ik("propostas")+'<span>'+(l||n+(St.modo!=="db"?' <small class="nota">· na demonstração só o nome; no site o arquivo abre aqui</small>':a&&a.nota?' <small class="nota">· '+esc(a.nota)+'</small>':''))+
      (extra?' <small class="nota">· '+extra+'</small>':'')+'</span></span>';
  }
  function desenhar(){
    var d=dados;
    if(!d){m.innerHTML=cab("Área do cliente","",'',null)+'<p class="vazio-sis">Seu acesso ainda não está ligado ao seu cadastro de cliente. Fale com o Shylton.</p>';return;}
    var prods=(d.producoes||[]).map(function(x){return Object.assign({id:x.id},x.dados);});
    if(!id){
      var nome=String((d.cliente&&d.cliente.nome)||S.Sessao.nome||"").split(/\s+/)[0];
      m.innerHTML=cab("Suas produções",(nome?"Olá, "+esc(nome)+". ":"")+"Toque numa produção para ver o contrato, a proposta, os orçamentos dos parceiros e o cronograma de entrega e retirada.","",null)+
        '<div id="sis-lista">'+tabela([
          {r:"Produção",v:function(p){return esc(p.titulo||"Produção")+(p.local?'<small>'+esc(p.local)+'</small>':'');}},
          {r:"Data",v:function(p){return esc(periodoProd(p));},cl:"sec"},
          {r:"Situação",v:function(p){return S.tag("producao",p.status);}}
        ],prods,"Ainda não há produções por aqui. Quando o contrato for assinado, a produção aparece nesta tela.",function(p){return corSt("producao",p.status);})+'</div>';
      aoClicarLinha($("#sis-lista",m),function(pid){location.hash="#adm/minhas/"+encodeURIComponent(pid);});
      return;
    }
    var p=prods.filter(function(x){return x.id===id;})[0];
    if(!p){m.innerHTML=cab("Produção não encontrada","",'',["#adm/minhas","Suas produções"])+'<p class="vazio-sis">Esta produção não está na sua área.</p>';return;}
    var ct=achar(d.contratos,p.contratoId),pr=ct?achar(d.propostas,ct.propostaId):null;
    var parcs=(p.parceiros||[]).filter(function(x){return x.orcamento||(x.recebidos||[]).length;});
    var abas='<div class="pil cli-abas" role="group" aria-label="Seções da produção">'+[["docs","doc","Documentos"],["crono","cal","Cronograma"]].map(function(a){
      return '<button type="button" data-aba-cli="'+a[0]+'" aria-pressed="'+(aba===a[0])+'">'+ik(a[1])+a[2]+'</button>';}).join("")+'</div>';
    if(aba==="crono"){
      m.innerHTML=cab(p.titulo||"Produção",esc(periodoProd(p))+(p.local?" · "+esc(p.local):""),S.tag("producao",p.status),["#adm/minhas","Suas produções"])+abas+
        '<p class="nota cli-crono__intro">Como vai ser a entrega dos produtos de cada loja antes da produção e a retirada depois. Se algo mudar, aparece aqui.</p>'+cronoHTML(p);
      return;
    }
    m.innerHTML=cab(p.titulo||"Produção",esc(periodoProd(p))+(p.local?" · "+esc(p.local):""),S.tag("producao",p.status),["#adm/minhas","Suas produções"])+abas+
      '<section class="sis-sec cli-sec"><h2>'+ik("contratos")+'Contrato</h2><div class="cli-sec__corpo">'+(ct?
        '<p>Contrato <b>'+esc(ct.num||"")+'</b> '+S.tag("contrato",stCon(ct))+'</p>'+
        '<div class="acoes"><button type="button" class="btn btn--escuro" data-ver-ct aria-expanded="'+verCt+'" aria-controls="cli-folha">'+ik(verCt?"acima":"abaixo")+(verCt?'Fechar o contrato':'Ver o contrato')+'</button>'+
          '<button type="button" class="btn btn--linha" data-ct-pdf>'+ik("baixar")+'Baixar o contrato em PDF</button></div></div>'+ /* sem .docx para o cliente (pedido da Isys, 2026-11-15) */
        '<div class="cli-folha" id="cli-folha"'+(verCt?'':' hidden')+'>'+(verCt?S.contratoHTML(ct):'')+'</div>'
        :'<p class="nota">O contrato desta produção ainda não está aqui. Fale com o Shylton.</p></div>')+'</section>'+
      '<section class="sis-sec cli-sec"><h2>'+ik("propostas")+'Proposta</h2><div class="cli-sec__corpo">'+(pr?
        '<p>Proposta <b>'+esc(pr.num||"")+'</b>'+(num(pr.valor)?' · '+esc(brl(pr.valor)):'')+(pr.data?' · '+esc(S.dataBR(String(pr.data).slice(0,10))):'')+'</p>'+
        '<div class="acoes"><button type="button" class="btn btn--linha" data-prop-pdf>'+ik("baixar")+'Baixar a proposta em PDF</button></div>'
        :'<p class="nota">A proposta desta produção ainda não está aqui.</p>')+'</div></section>'+
      '<section class="sis-sec cli-sec"><h2>'+ik("parceiros")+'Orçamentos dos parceiros</h2><div class="cli-sec__corpo">'+(parcs.length?parcs.map(function(x){
        return '<div class="cli-orc"><b>'+esc(x.nome||"Parceiro")+'</b>'+(x.papel?'<small>'+esc(x.papel)+'</small>':'')+'<div class="cli-orc__arqs">'+
          (x.orcamento?arq(x.orcamento,""):"")+(x.recebidos||[]).map(function(r){return arq(r.arquivo,"enviado em "+esc(S.dataBR(String(r.enviadoEm||"").slice(0,10)))+(r.obs?" · "+esc(r.obs):""));}).join("")+'</div></div>';
      }).join(""):'<p class="nota">Nenhum orçamento de parceiro anexado ainda.</p>')+'</div></section>';
  }
  m.addEventListener("click",function(e){
    var d=dados,p=d&&id?(d.producoes||[]).filter(function(x){return x.id===id;})[0]:null,ct=p?achar(d.contratos,p.dados.contratoId):null;
    var ba=e.target.closest("[data-aba-cli]");if(ba){aba=ba.getAttribute("data-aba-cli");desenhar();var bf=$('[data-aba-cli="'+aba+'"]',m);if(bf)bf.focus();return;}
    if(e.target.closest("[data-ver-ct]")){verCt=!verCt;desenhar();var b=$("[data-ver-ct]",m);if(b)b.focus();return;}
    if(e.target.closest("[data-ct-pdf]")&&ct){pdfContrato(ct,d.cliente&&d.cliente.nome);return;}
    if(e.target.closest("[data-prop-pdf]")&&ct){var pr=achar(d.propostas,ct.propostaId);if(pr)S.propostaPDF(pr);}
  });
  var pronto=false; /* links dos arquivos chegam depois e redesenham a tela (vista.atualizar) */
  vista.atualizar=function(){if(!pronto)return;if(St.modo!=="db")dados=areaClienteDemo(S.Sessao.membroId);desenhar();};
  dadosArea().then(function(d){dados=d;pronto=true;desenhar();},function(e){
    if(window.console)console.error(e);
    m.innerHTML=cab("Suas produções","",'',null)+'<p class="vazio-sis">Não foi possível carregar suas produções agora. <button type="button" class="lnk" data-recarregar>'+ik("trocar")+'Tentar de novo</button></p>';
    var b=$("[data-recarregar]",m);if(b)b.addEventListener("click",function(){S.render();});
  });
}};

/* ================= PRODUÇÕES ================= */
/* Checklist de conferência (pedido da Isys, 2026-11-15): itens por etapa. O padrão vem de Ajustes
   (config/geral.checklist, um item por linha; colaborador não lê config e usa o padrão do sistema) e é copiado
   para cada produção, onde adm e colaborador marcam e incluem itens (tirar, só o adm).
   Numa produção já salva, marcar/incluir/tirar grava na hora só o checklist, sem mexer no resto da tela. */
var ETAPAS_CHK=[["antes","Antes da produção"],["montagem","Montagem"],["desmontagem","Desmontagem"]];
var LOGI=[["entrega","Entrega dos produtos"],["retirada","Retirada dos produtos"]]; /* por loja da produção; o cliente vê no Cronograma */
function idChk(){return "k"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
/* Orçamento pelo link: chave secreta de 24 caracteres por linha de parceiro da produção */
function chaveOrc(){var a=new Uint8Array(12);crypto.getRandomValues(a);return Array.prototype.map.call(a,function(b){return ("0"+b.toString(16)).slice(-2);}).join("");}
/* O registro vem de fora (sem login): só vale o que tem a mesma chave e arquivo no caminho que o site gera, orcamentos/<chave>/<id>.<ext> */
function orcRecebidos(chave){
  if(!/^[\w-]{16,40}$/.test(chave||""))return [];
  var rx=new RegExp("^sb:orcamentos/"+chave+"/[\\w-]{4,64}\\.(pdf|jpg|png|webp)$");
  return St.list("orcamentos").filter(function(r){return r.chave===chave;}).map(function(r){
    var a=r.arquivo||{},id=String(a.id||""),arq={nome:String(a.nome||"orçamento").slice(0,120)};
    if(rx.test(id))arq.id=id;else arq.nota=String(a.nota||"arquivo não recebido").slice(0,60);
    return {id:r.id,arquivo:arq,empresa:String(r.empresa||"").slice(0,120),obs:String(r.obs||"").slice(0,1000),enviadoEm:String(r.enviadoEm||"")};
  }).sort(function(a,b){return b.enviadoEm.localeCompare(a.enviadoEm);});
}
function checklistPadrao(){
  var c=S.cfg().checklist||{},l=[];
  ETAPAS_CHK.forEach(function(e){String(c[e[0]]||"").split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean).forEach(function(txt){l.push({id:idChk(),etapa:e[0],txt:txt.slice(0,200),ok:false});});});
  return l;
}
/* Resumo do modelo recolhido em Ajustes: "Antes da produção: 37 itens · Montagem: 3 itens · Desmontagem: 3 itens" */
function resumoChk(c){
  c=c||{};
  return ETAPAS_CHK.map(function(e){var n=String(c[e[0]]||"").split(/\r?\n/).filter(function(x){return x.trim();}).length;return e[1]+": "+n+(n===1?" item":" itens");}).join(" · ");
}
function progChk(p){var l=p.checklist||[];return l.length?l.filter(function(x){return x.ok;}).length+" de "+l.length:"";}
var fProd={st:"todas",q:""};
M.producoes={render:function(m,id,vista){
  var adm=S.ehAdm();
  m.innerHTML=cab("Produções",adm?"Criadas a partir de contratos assinados: local, data, parceiros e peças que ficaram com o cliente.":"Local, datas, equipe e parceiros de cada produção.",adm?'<a class="btn btn--escuro" href="#adm/producao/nova">'+ik("mais")+'Nova produção</a>':'')+
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
      {r:"Conferência",v:function(p){var l=p.checklist||[],f=l.filter(function(x){return x.ok;}).length;return l.length?(f===l.length?'<span class="tag" style="--c:#3E6B48">'+esc(progChk(p))+'</span>':esc(progChk(p))):"—";},cl:"num"},
      adm?{r:"Peças com o cliente",v:function(p){return String(qtdPecas(p.pecas));},cl:"num"}:null,
      adm?{r:"RT",v:function(p){return brl(artTotal(p.pecas));},cl:"num"}:null,
      {r:"Status",v:function(p){return S.tag("producao",p.status);}}
    ].filter(Boolean),l,todas.length?"Nenhuma produção com esse filtro.":"Ainda não há produções. Ao marcar um contrato como Assinado, a produção aparece aqui sozinha.",function(p){return corSt("producao",p.status);});
  };
  if(!carregando($("#sis-lista",m),vista,"producoes"))vista.atualizar();
}};
function artTotal(pecas){return (pecas||[]).reduce(function(s,x){return s+num(x.valor)*num(x.art)/100;},0);} /* RT (reserva técnica); o campo continua "art" */
/* Quantidade de peças com o cliente (linhas antigas sem qtd contam 1) */
function qtdPeca(x){return x.qtd===""||x.qtd==null?1:num(x.qtd);}
function idPeca(){return "q"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);} /* id fixo da linha de peça: liga a peça ao seu lançamento de RT */
function qtdPecas(pecas){return (pecas||[]).reduce(function(s,x){return s+qtdPeca(x);},0);}
/* Colaborador (pedido da Isys, 2026-11-09): edita a produção (status, dados, equipe e parceiros),
   mas o bloco de peças com o cliente (valores e RT) não aparece para ele, nem as informações dele.
   Ao salvar, as peças gravadas pelo adm são mantidas (o banco também as protege) e a RT não é mexida;
   rtRever avisa para o Financeiro ser conferido sozinho quando o adm abrir a produção. */
M.producao={
  /* tokP (opcional): acesso ao Google pedido no clique de Salvar/Excluir; sem ele, o Google fica para "Atualizar a agenda do Google" */
  sync:function(id,p,tokP){
    var novo=agendaProd(id,p);
    if(!novo)return excluirAgenda("prod-"+id,tokP).catch(function(){});
    return gravarAgenda("prod-"+id,St.copia("agenda","prod-"+id),novo,tokP);
  },
  render:function(m,id,vista){
    var ed,adm=S.ehAdm();
    if(!adm&&id==="nova"){location.replace("#adm/producoes");return;}
    if(carregando(m,vista,adm?["producoes","contratos","clientes","parceiros","equipe","financeiro","orcamentos"]:["producoes","parceiros","time"]))return;
    if(id==="nova")ed={titulo:"",contratoId:"",clienteId:"",local:"",dataInicio:"",dataFim:"",hora:"",status:"planejada",equipe:[],parceiros:[],pecas:[],checklist:checklistPadrao(),obs:"",criadoEm:S.agoraISO()};
    else{ed=St.copia("producoes",id);if(!ed){m.innerHTML=cab("Produção não encontrada","",'',["#adm/producoes","Produções"]);return;}}
    vista.vivo=false;
    ed.equipe=ed.equipe||[];ed.parceiros=ed.parceiros||[];ed.pecas=ed.pecas||[];
    if(!Array.isArray(ed.checklist))ed.checklist=checklistPadrao(); /* produção antiga: ganha o padrão (grava ao marcar ou salvar) */
    var chkAberto=false; /* checklist começa recolhido (pedido da Isys, 2026-11-15); abre no título */
    if(gOkAdm())prepararGoogle().catch(function(){}); /* a produção vai direto para a agenda do Shylton ao salvar */
    function chkHTML(){
      var l=ed.checklist;
      var html=ETAPAS_CHK.map(function(e){
        var its=l.map(function(x,i){return [x,i];}).filter(function(a){return (a[0].etapa||"antes")===e[0];});
        if(!its.length)return "";
        return '<div class="conf__etapa"><h3>'+esc(e[1])+'</h3>'+its.map(function(a){var x=a[0],i=a[1],quem=[x.por,x.em?S.dataBR(String(x.em).slice(0,10)):""].filter(Boolean).join(" · ");
          return '<div class="conf__item'+(x.ok?" feito":"")+'"><label class="chk"><input type="checkbox" data-chk="'+i+'"'+(x.ok?" checked":"")+'><span><span class="conf__txt">'+esc(x.txt)+'</span>'+(x.ok&&quem?'<small>'+esc(quem)+'</small>':'')+'</span></label>'+
            (adm?'<button type="button" class="rep__x" data-rem-chk="'+i+'" aria-label="Tirar o item: '+esc(x.txt)+'" title="Tirar o item">'+ik("excluir")+'</button>':'')+'</div>';}).join("")+'</div>';
      }).join("");
      return (html||'<p class="nota">Nenhum item. Inclua abaixo.</p>')+
        '<div class="conf__novo"><label class="f">Etapa'+selectHTML('data-chk-etapa',ETAPAS_CHK,"antes")+'</label><label class="f">Novo item<input type="text" data-chk-txt maxlength="200" placeholder="Ex.: conferir a iluminação"></label><button type="button" class="btn btn--linha" data-add-chk>'+ik("mais")+'Incluir</button></div>';
    }
    function progTxt(){var t=ed.checklist.length,f=ed.checklist.filter(function(x){return x.ok;}).length;return t?f+" de "+t+" conferidos":"";}
    function gravarChk(){
      $("#ed-chk",m).innerHTML=chkHTML();$("#chk-prog",m).textContent=progTxt();
      if(!ed.id)return; /* produção nova: o checklist vai junto ao salvar */
      var at=St.copia("producoes",ed.id);if(!at)return;delete at.id;at.checklist=S.clone(ed.checklist);
      St.salvar("producoes",ed.id,at).catch(S.erroGravar);
    }
    function conOpts(){return [["","— escolha um contrato assinado —"]].concat(St.list("contratos").filter(function(c){return c.status==="assinado"||c.status==="concluido"||c.id===ed.contratoId;}).map(function(c){return [c.id,c.num+" · "+(nomeCliente(c.clienteId)||"sem cliente")];}));}
    function parcHTML(){
      return ed.parceiros.map(function(x,i){return '<div class="rep__lin" style="grid-template-columns:minmax(0,1.2fr) minmax(0,1fr) auto" data-pi="'+i+'"><label class="f">Parceiro'+selectHTML('data-pk="parceiroId"',opcoesParceiros(),x.parceiroId)+'</label><label class="f">O que forneceu<input type="text" data-pk="papel" value="'+esc(x.papel)+'" placeholder="Ex.: tapetes e almofadas"></label><button type="button" class="rep__x" data-rem-p="'+i+'">'+ik("excluir")+'Remover</button>'+orcHTML(x,i)+logiHTML(x)+'</div>';}).join("")||'<p class="nota">Nenhum parceiro nesta produção.</p>';
    }
    /* Orçamento de cada parceiro (2026-11-15): o adm anexa (orcamento) ou o parceiro envia pelo link da linha (chave → coleção "orcamentos").
       Só o adm lê a pasta de arquivos e a coleção "orcamentos"; o colaborador vê só o nome do anexado. */
    function arqHTML(o,extra){ /* colaborador não lê a pasta de arquivos: só o nome */
      return '<span class="orc__arq">'+ik("propostas")+'<span>'+((adm&&S.linkArq(o,esc(o.nome)+' '+ik("baixar"),"lnk",true))||esc(o.nome)+(o.nota?' <small class="nota">· '+esc(o.nota)+'</small>':''))+(extra||'')+'</span></span>';
    }
    function orcHTML(x,i){
      var o=x.orcamento,ver=o?arqHTML(o):"";
      if(!adm)return '<div class="orc">'+(o?ver:'<span class="nota">Sem orçamento anexado.</span>')+'</div>';
      var rec=orcRecebidos(x.chave).map(function(r){
        return '<div class="orc__rec">'+arqHTML(r.arquivo,' <small class="nota">· enviado pelo link'+(r.empresa?' por '+esc(r.empresa):'')+' em '+esc(S.dataBR(String(r.enviadoEm||"").slice(0,10)))+'</small>')+
          '<button type="button" class="lnk" data-rem-rec="'+esc(r.id)+'">'+ik("excluir")+'Tirar</button>'+(r.obs?'<p class="nota">'+esc(r.obs)+'</p>':'')+'</div>';
      }).join("");
      var p=x.parceiroId?St.get("parceiros",x.parceiroId):null,tel=p&&p.contato,url=x.chave?linkOrc(x):"";
      return '<div class="orc">'+rec+ver+
        '<label class="lnk orc__env">'+ik("mais")+(o?'Trocar orçamento':'Anexar orçamento')+'<input type="file" accept="application/pdf,image/*" data-orc="'+i+'"></label>'+
        (o?'<button type="button" class="lnk" data-rem-orc="'+i+'">'+ik("excluir")+'Tirar</button>':'')+
        '<button type="button" class="lnk" data-link-orc="'+i+'">'+ik("link")+(url?'Copiar link para o parceiro':'Link para o parceiro enviar')+'</button>'+
        (url&&tel?'<a class="lnk" target="_blank" rel="noopener" href="'+esc(S.waLink(tel,msgOrc(x,url)))+'">'+ik("whats")+'Enviar pelo WhatsApp ↗</a>':'')+'</div>';
    }
    /* Entrega e retirada dos produtos de cada loja (2026-11-23, pedido da Isys): data, horário e quem é responsável —
       pessoa da loja (nome, se souber) ou pessoa da equipe (lista de Responsáveis, com o Shylton). Adm e colaborador veem e
       editam; o cliente acompanha na aba Cronograma da área dele. Fica em parceiros[i].entrega / .retirada {data,hora,resp,quem,equipeId}. */
    function logiBlocoHTML(x,g){
      var o=x[g[0]]||{},eqs=opcoesResp().map(function(r){return [r[0],nomeSemPapel(r[1])];});
      if(o.equipeId&&!eqs.some(function(r){return r[0]===o.equipeId;}))eqs.push([o.equipeId,o.quem||"Membro da equipe"]);
      return '<fieldset class="logi__bloco" data-logi="'+g[0]+'"><legend>'+ik(g[0])+esc(g[1])+'</legend><div class="fgrid">'+
        '<label class="f">Data<input type="date" data-lg="'+g[0]+'" data-lk="data" value="'+esc(o.data||"")+'"></label>'+
        '<label class="f">Horário<input type="time" data-lg="'+g[0]+'" data-lk="hora" value="'+esc(o.hora||"")+'"></label>'+
        '<label class="f">Responsável'+selectHTML('data-lg="'+g[0]+'" data-lk="resp"',[["","A combinar"],["loja","Pessoa da loja"],["equipe","Pessoa da equipe"]],o.resp||"")+'</label>'+
        (o.resp==="equipe"?'<label class="f">Quem da equipe'+selectHTML('data-lg="'+g[0]+'" data-lk="equipeId"',[["","— escolha —"]].concat(eqs),o.equipeId||"")+'</label>':
         o.resp==="loja"?'<label class="f">Nome na loja<input type="text" maxlength="80" data-lg="'+g[0]+'" data-lk="quem" value="'+esc(o.quem||"")+'" placeholder="Se souber"></label>':'')+
        '</div></fieldset>';
    }
    function logiHTML(x){return '<div class="logi">'+LOGI.map(function(g){return logiBlocoHTML(x,g);}).join("")+'</div>';}
    function linkOrc(x){
      var q=[],n=x.parceiroId&&nomeParceiro(x.parceiroId);
      if(n)q.push("e="+encodeURIComponent(n));if(ed.dataInicio)q.push("d="+ed.dataInicio);
      return linkCadastro("orcamento/"+x.chave+(q.length?"?"+q.join("&"):""));
    }
    function msgOrc(x,url){return "Olá! Aqui é do Shylton Mavie. Pode enviar o orçamento"+(ed.dataInicio?" da produção de "+S.dataBR(ed.dataInicio):"")+" por este link? "+url;}
    function gravarParc(msg){
      $("#ed-parc",m).innerHTML=parcHTML();redesRes();
      if(!ed.id){S.toast(msg+" Salve a produção.");return;}
      var at=St.copia("producoes",ed.id);if(!at)return;delete at.id;at.parceiros=S.clone(ed.parceiros);
      St.salvar("producoes",ed.id,at).then(function(){S.toast(msg);},S.erroGravar);
    }
    function pecasHTML(){
      return ed.pecas.map(function(x,i){return '<div class="rep__lin rep__lin--peca" data-qi="'+i+'"><label class="f f--parc">Parceiro'+selectHTML('data-qk="parceiroId"',opcoesParceiros(),x.parceiroId)+'</label><label class="f">Qtd. de peças<input type="number" min="0" step="1" inputmode="numeric" data-qk="qtd" data-num="1" value="'+esc(x.qtd)+'"></label><label class="f">Valor (R$)<input type="text" inputmode="decimal" data-qk="valor" data-num="1" value="'+(x.valor!==""&&x.valor!=null?S.fmtValor(x.valor):"")+'"></label><label class="f">RT %<input type="text" inputmode="decimal" data-qk="art" data-num="1" value="'+esc(x.art)+'"></label><label class="f">Pagamento da RT<input type="date" data-qk="dataRT" value="'+esc(x.dataRT)+'"></label><button type="button" class="rep__x" data-rem-q="'+i+'">'+ik("excluir")+'Remover</button></div>';}).join("")||'<p class="nota">Nenhuma peça registrada.</p>';
    }
    function totaisHTML(){
      var t=soma(ed.pecas,"valor"),a=artTotal(ed.pecas),por={};
      ed.pecas.forEach(function(x){var v=num(x.valor)*num(x.art)/100;if(!v)return;var k=x.parceiroId||"";por[k]=(por[k]||0)+v;});
      var lin=Object.keys(por).map(function(k){return '<span>'+esc(nomeParceiro(k)||"Sem parceiro")+' <b>'+brl(por[k])+'</b></span>';}).join("");
      return '<span>Peças com o cliente <b>'+qtdPecas(ed.pecas)+'</b></span><span>Valor <b>'+brl(t)+'</b></span><span>RT total <b>'+brl(a)+'</b></span>'+(Object.keys(por).length>1?lin:'')+'<span class="nota">Ao salvar, a RT do parceiro entra sozinha no Financeiro, em A receber, na data de pagamento da RT. RT % e valores de RT ficam visíveis só para o administrador.</span>';
    }
    /* Resumo dos orçamentos para o cliente (2026-11-23, pedido da Isys): itens de cada loja (linha de Parceiros) com categoria e valor,
       em parceiros[i].itens; lidos do PDF do orçamento (S.lerOrcamento) ou digitados; parceiros[i].lido guarda o total achado no PDF.
       "Baixar resumo em PDF" monta o PDF (S.resumoOrcPDF) sem RT. Só o adm vê; o colaborador, ao salvar, mantém os itens. */
    function arqsLer(x){
      return [x.orcamento].concat(orcRecebidos(x.chave).map(function(r){return r.arquivo;})).filter(function(a){return a&&S.temBytes(a)&&(a.tipo==="application/pdf"||/\.pdf$/i.test(String(a.id)));});
    }
    function catPadrao(x){var p=x.parceiroId?St.get("parceiros",x.parceiroId):null;return (p&&S.CAT_DO_PARC[p.cat])||"";}
    function avisoRes(x){
      var t=soma(x.itens||[],"valor");
      return x.lido&&x.lido.total&&Math.abs(t-x.lido.total)>=.05?"O total do orçamento é "+brl(x.lido.total)+" e a soma dos itens está em "+brl(t)+". Confira os valores.":"";
    }
    function resLojaHTML(x,i){
      var its=x.itens||[],av=avisoRes(x);
      return '<div class="res__loja" data-ip="'+i+'"><div class="res__cab"><h3>'+esc(nomeParceiro(x.parceiroId)||"Parceiro sem nome")+(x.papel?'<small>'+esc(x.papel)+'</small>':'')+'</h3><b data-res-lt>'+brl(soma(its,"valor"))+'</b></div>'+
        '<div class="res__ler">'+arqsLer(x).map(function(a,k){return '<button type="button" class="lnk" data-ler="'+i+'" data-ler-k="'+k+'">'+ik("doc")+'Ler '+esc(a.nome||"orçamento")+'</button>';}).join("")+
          '<label class="lnk orc__env">'+ik("doc")+'Ler um PDF do computador<input type="file" accept="application/pdf,.pdf" data-ler-arq="'+i+'"></label></div>'+
        '<p class="nota res__aviso" data-res-av'+(av?'':' hidden')+'>'+esc(av)+'</p>'+
        its.map(function(it,j){return '<div class="rep__lin rep__lin--item" data-ii="'+j+'"><label class="f">Item<input type="text" data-ik="desc" maxlength="120" value="'+esc(it.desc)+'"></label>'+
          '<label class="f">Categoria<input type="text" data-ik="cat" list="dl-cat-orc" maxlength="40" value="'+esc(it.cat)+'"></label>'+
          '<label class="f">Valor (R$)<input type="text" inputmode="decimal" data-ik="valor" value="'+(it.valor!==""&&it.valor!=null?S.fmtValor(it.valor):"")+'"></label>'+
          '<button type="button" class="rep__x" data-rem-it="'+j+'" aria-label="Remover o item" title="Remover o item">'+ik("excluir")+'</button></div>';}).join("")+
        '<p><button type="button" class="lnk" data-add-it="'+i+'">'+ik("mais")+'Adicionar item</button></p></div>';
    }
    function resHTML(){return ed.parceiros.map(resLojaHTML).join("")||'<p class="nota">Adicione as lojas em Parceiros nesta produção para montar o resumo.</p>';}
    function resTotHTML(){
      var cats={},tot=0;
      ed.parceiros.forEach(function(x){(x.itens||[]).forEach(function(it){var v=num(it.valor);if(!v)return;var c=String(it.cat||"").trim()||"Outros";cats[c]=(cats[c]||0)+v;tot+=v;});});
      return Object.keys(cats).sort(function(a,b){var ia=S.CATS_ORC.indexOf(a),ib=S.CATS_ORC.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib);}).map(function(c){return '<span>'+esc(c)+' <b>'+brl(cats[c])+'</b></span>';}).join("")+'<span>Total <b>'+brl(tot)+'</b></span>';
    }
    function redesRes(){var r=$("#ed-res",m);if(!r)return;r.innerHTML=resHTML();$("#res-tot",m).innerHTML=resTotHTML();}
    function lerOrc(i,pBuf,nome){
      var x=ed.parceiros[i];if(!x)return;nome=nome||"o orçamento";
      S.toast("Lendo "+nome+"…");
      Promise.resolve(pBuf).then(function(buf){return S.lerOrcamento(buf,catPadrao(x));}).then(function(r){
        if(!r.itens.length){S.toast("Não achei itens com valor em "+nome+". Se for foto ou PDF escaneado, digite os itens.");return;}
        function aplicar(){x.itens=r.itens;x.lido={arquivo:String(nome).slice(0,120),total:r.total||0,em:S.agoraISO()};redesRes();
          S.toast(r.itens.length+(r.itens.length>1?" itens lidos":" item lido")+". Confira e salve a produção.");}
        if(!(x.itens||[]).length)return aplicar();
        return S.confirmar({titulo:"Trocar os itens desta loja?",texto:"Saem os "+x.itens.length+" itens de agora e entram os "+r.itens.length+" lidos de "+nome+".",ok:"Trocar",perigo:false,sobre:"Resumo dos orçamentos",ico:"calc"}).then(function(sim){if(sim)aplicar();});
      }).catch(function(e){if(window.console)console.warn("Leitura do orçamento",e);S.toast("Não consegui ler "+nome+". Digite os itens.");});
    }
    function baixarResumo(b){
      var lojas=ed.parceiros.map(function(x){return {nome:nomeParceiro(x.parceiroId)||x.papel||"Loja",itens:(x.itens||[]).filter(function(it){return num(it.valor);}).map(function(it){return {desc:it.desc,cat:it.cat,valor:num(it.valor)};})};}).filter(function(l){return l.itens.length;});
      if(!lojas.length){S.toast("Inclua os itens dos orçamentos antes de baixar o resumo.");return;}
      var cl=ed.clienteId?St.get("clientes",ed.clienteId):null;
      b.disabled=true;
      S.resumoOrcPDF({titulo:ed.titulo||"Produção",cliente:(cl&&cl.nome)||"",data:S.hoje(),lojas:lojas})
        .catch(function(e){if(window.console)console.warn("Resumo dos orçamentos",e);S.toast("Não foi possível gerar o PDF. Tente de novo.");})
        .then(function(){b.disabled=false;});
    }
    /* Quem pode ir para a produção: o adm lê Equipe; o colaborador usa a lista de nomes espelhada em time/lista */
    function equipeLista(){
      if(adm)return St.list("equipe").filter(function(x){return x.status==="ativo";}).map(function(x){return {id:x.id,nome:x.nome,funcao:x.funcao};});
      return timeLista().filter(function(x){return x[0]!=="adm";}).map(function(x){return {id:x[0],nome:x[1]};});
    }
    function equipeHTML(){
      var at=equipeLista();
      return at.length?'<div class="chks">'+at.map(function(x){return '<label class="chk"><input type="checkbox" data-eq="'+esc(x.id)+'"'+(ed.equipe.indexOf(x.id)>=0?" checked":"")+'> '+esc(x.nome)+(x.funcao?' <span class="nota">· '+esc(x.funcao)+'</span>':'')+'</label>';}).join("")+'</div>':'<p class="nota">'+(adm?'Ninguém liberado em <a class="lnk" href="#adm/equipe">Equipe</a> ainda.':'Ninguém na equipe ainda.')+'</p>';
    }
    function desenhar(){
      m.innerHTML=cab(ed.id?(ed.titulo||"Produção"):"Nova produção",!adm?"":ed.contratoId?"Contrato "+esc((St.get("contratos",ed.contratoId)||{}).num||""):"Escolha o contrato assinado desta produção.",
        '<label class="f" style="min-width:180px">Status'+selectHTML('data-k="status"',S.opcoes("producao"),ed.status)+'</label>'+
        '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>'+ik("salvar")+'Salvar</button>'+(ed.id&&adm?'<button type="button" class="btn btn--linha btn--perigo" data-excluir>'+ik("excluir")+'Excluir</button>':'')+'</div>',["#adm/producoes","Produções"])+
      '<div class="ed ed--meio"><div class="ed__form" id="ed-form">'+
        '<section class="ed__bloco"><h2>'+ik("producoes")+'Dados</h2><div class="fgrid">'+(adm?'<label class="f f--full">Contrato'+selectHTML("data-con",conOpts(),ed.contratoId)+'</label>':'')+S.campos([
          {k:"titulo",r:"Título",full:1,req:1},{k:"local",r:"Local",full:1},{k:"dataInicio",r:"Início",t:"date"},{k:"dataFim",r:"Fim",t:"date"},{k:"hora",r:"Horário de chegada",t:"time"},{k:"obs",r:"Observações",t:"area",full:1}],ed)+
          '<p class="nota f--full">Ao salvar, a produção aparece no Calendário, onde a equipe também vê.</p></div></section>'+
        '<section class="ed__bloco"><h2>'+ik("equipe")+'Equipe</h2>'+equipeHTML()+'</section>'+
        '<section class="ed__bloco"><h2><button type="button" class="recolher" data-recolher-chk aria-expanded="'+chkAberto+'" aria-controls="chk-corpo">'+ik("ok")+'<span>Checklist de conferência<small id="chk-prog">'+esc(progTxt())+'</small></span><span class="recolher__seta">'+ik("abaixo")+'</span></button></h2><div id="chk-corpo"'+(chkAberto?'':' hidden')+'><div class="conf" id="ed-chk">'+chkHTML()+'</div>'+
          '<p class="nota" style="margin-top:var(--s-12)">'+(ed.id?'Cada item marcado já fica salvo, com quem marcou e a data.':'Os itens marcados ficam salvos ao salvar a produção.')+(adm?' A lista padrão de toda produção nova fica em <a class="lnk" href="#adm/ajustes">Ajustes</a>.':'')+'</p></div></section>'+
      '</div><div class="ed__form">'+
        '<section class="ed__bloco"><h2>'+ik("parceiros")+'Parceiros nesta produção</h2><div class="rep" id="ed-parc">'+parcHTML()+'</div><p style="margin-top:var(--s-12)"><button type="button" class="lnk" data-add-p>'+ik("mais")+'Adicionar parceiro</button>'+(adm?' <a class="lnk" href="#adm/parceiros" style="margin-left:var(--s-12)">'+ik("parceiros")+'Cadastrar parceiro</a>':'')+'</p></section>'+
        (adm?'<section class="ed__bloco"><h2>'+ik("peca")+'Peças que ficaram com o cliente para compra</h2><div class="rep" id="ed-pecas">'+pecasHTML()+'</div><p style="margin-top:var(--s-12)"><button type="button" class="lnk" data-add-q>'+ik("mais")+'Adicionar peça</button></p><div class="totais" id="ed-tot">'+totaisHTML()+'</div></section>':'')+
        (adm?'<section class="ed__bloco"><h2>'+ik("calc")+'Resumo dos orçamentos<small>para enviar ao cliente</small></h2>'+
          '<p class="nota res__intro">Leia o PDF do orçamento de cada loja ou digite os itens, e confira categorias e valores. O PDF mostra o total, o total por categoria, por loja e os itens de cada loja. Não mostra RT.</p>'+
          '<div id="ed-res">'+resHTML()+'</div><div class="totais" id="res-tot">'+resTotHTML()+'</div>'+
          '<p class="res__baixar"><button type="button" class="btn btn--linha" data-baixar-res>'+ik("baixar")+'Baixar resumo em PDF</button></p>'+
          '<datalist id="dl-cat-orc">'+S.CATS_ORC.map(function(c){return '<option value="'+esc(c)+'">';}).join("")+'</datalist></section>':'')+
      '</div></div>';
      ligar();
    }
    function ligar(){
      $("[data-salvar]",m).addEventListener("click",function(){salvar().catch(function(){});});
      var x=$("[data-excluir]",m);if(x)x.addEventListener("click",function(){S.confirmar({titulo:"Excluir esta produção?",texto:"Ela também sai do calendário, e a RT ainda não recebida sai do financeiro. Essa ação não pode ser desfeita."}).then(function(sim){if(!sim)return;
        var tokP=gOkAdm()&&(St.get("agenda","prod-"+ed.id)||{}).gEvento?tokenGoogle():null;if(tokP)tokP.catch(function(){});
        St.excluir("producoes",ed.id).then(function(){return excluirAgenda("prod-"+ed.id,tokP).catch(function(){});})
          .then(function(){return Promise.all(St.list("financeiro").filter(function(f){return f.producaoId===ed.id&&f.status!=="pago"&&catFin(f.categoria)==="RT / comissão";}).map(function(f){return St.excluir("financeiro",f.id);}));})
          .then(function(){location.hash="#adm/producoes";},S.erroGravar);});});
      $("[data-add-p]",m).addEventListener("click",function(){ed.parceiros.push({parceiroId:"",papel:""});$("#ed-parc",m).innerHTML=parcHTML();redesRes();});
      var br=$("[data-baixar-res]",m);if(br)br.addEventListener("click",function(){baixarResumo(br);});
      var aq=$("[data-add-q]",m);if(aq)aq.addEventListener("click",function(){ed.pecas.push({id:idPeca(),qtd:"",parceiroId:"",valor:"",art:"",dataRT:""});$("#ed-pecas",m).innerHTML=pecasHTML();});
    }
    function aoClicar(e){
      var b=e.target.closest("[data-rem-p]");if(b){ed.parceiros.splice(+b.getAttribute("data-rem-p"),1);$("#ed-parc",m).innerHTML=parcHTML();redesRes();return;}
      b=e.target.closest("[data-ler]");if(b){var xl=+b.getAttribute("data-ler"),pl0=ed.parceiros[xl],al=pl0&&arqsLer(pl0)[+b.getAttribute("data-ler-k")];if(al)lerOrc(xl,S.bytesArq(al),al.nome);return;}
      b=e.target.closest("[data-add-it]");if(b){var ia=+b.getAttribute("data-add-it"),xa=ed.parceiros[ia];if(!xa)return;(xa.itens=xa.itens||[]).push({desc:"",cat:catPadrao(xa),valor:""});redesRes();
        var ds=S.$$('[data-ip="'+ia+'"] [data-ik="desc"]',m);if(ds.length)ds[ds.length-1].focus();return;}
      b=e.target.closest("[data-rem-it]");if(b){var lr=b.closest("[data-ip]"),xr=lr&&ed.parceiros[+lr.getAttribute("data-ip")];if(xr&&xr.itens){xr.itens.splice(+b.getAttribute("data-rem-it"),1);redesRes();}return;}
      b=e.target.closest("[data-recolher-chk]");if(b){chkAberto=!chkAberto;b.setAttribute("aria-expanded",String(chkAberto));$("#chk-corpo",m).hidden=!chkAberto;return;}
      b=e.target.closest("[data-rem-orc]");if(b){var po=ed.parceiros[+b.getAttribute("data-rem-orc")];if(po){delete po.orcamento;gravarParc("Orçamento retirado.");}return;}
      b=e.target.closest("[data-link-orc]");if(b){
        var pl=ed.parceiros[+b.getAttribute("data-link-orc")];if(!pl)return;
        if(!ed.id){S.toast("Salve a produção antes de gerar o link.");return;}
        var nova=!pl.chave;if(nova)pl.chave=chaveOrc();
        S.copiar(linkOrc(pl)).then(function(){if(nova)gravarParc("Link criado e copiado. Envie ao parceiro.");else S.toast("Link copiado. Envie ao parceiro.");});
        return;
      }
      b=e.target.closest("[data-rem-rec]");if(b){var rid=b.getAttribute("data-rem-rec");
        S.confirmar({titulo:"Tirar este orçamento enviado pelo link?",texto:"Ele sai da produção. Essa ação não pode ser desfeita."}).then(function(sim){if(!sim)return;St.excluir("orcamentos",rid).then(function(){$("#ed-parc",m).innerHTML=parcHTML();redesRes();S.toast("Orçamento retirado.");},S.erroGravar);});
        return;}
      b=e.target.closest("[data-add-chk]");if(b){
        var tx=$("[data-chk-txt]",m),et=$("[data-chk-etapa]",m),txt=String(tx.value).trim().slice(0,200);
        if(!txt){S.toast("Escreva o item antes de incluir.");tx.focus();return;}
        ed.checklist.push({id:idChk(),etapa:et.value||"antes",txt:txt,ok:false});var etp=et.value;gravarChk();var et2=$("[data-chk-etapa]",m);if(et2)et2.value=etp;var tx2=$("[data-chk-txt]",m);if(tx2)tx2.focus();return;
      }
      b=e.target.closest("[data-rem-chk]");if(b){ed.checklist.splice(+b.getAttribute("data-rem-chk"),1);gravarChk();return;}
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
      if(t.hasAttribute("data-chk")){
        if(e.type!=="change")return;
        var it=ed.checklist[+t.getAttribute("data-chk")];if(!it)return;it.ok=t.checked;
        if(t.checked){it.por=adm?"Shylton":(S.Sessao.nome||"Equipe");it.em=S.agoraISO();}else{delete it.por;delete it.em;}
        gravarChk();return;
      }
      if(t.hasAttribute("data-chk-txt")||t.hasAttribute("data-chk-etapa"))return;
      if(t.hasAttribute("data-orc")){
        if(e.type!=="change")return;var oi=+t.getAttribute("data-orc"),f=t.files&&t.files[0];if(!f||!ed.parceiros[oi])return;
        if(f.size>26214400){S.toast("Arquivo maior que 25 MB.");t.value="";return;}
        S.toast("Enviando orçamento…");
        S.subir(f).then(function(r){if(!ed.parceiros[oi])return;ed.parceiros[oi].orcamento=r;gravarParc(r.nota&&r.nota!=="só o nome (modo demonstração)"?"Orçamento não foi guardado: "+r.nota+".":"Orçamento anexado.");});
        return;
      }
      if(t.hasAttribute("data-eq")){var i=ed.equipe.indexOf(t.getAttribute("data-eq"));if(t.checked&&i<0)ed.equipe.push(t.getAttribute("data-eq"));if(!t.checked&&i>=0)ed.equipe.splice(i,1);return;}
      if(t.hasAttribute("data-ler-arq")){
        if(e.type!=="change")return;var fl=t.files&&t.files[0],il=+t.getAttribute("data-ler-arq");t.value="";if(!fl)return;
        if(!/pdf/i.test(fl.type)&&!/\.pdf$/i.test(fl.name)){S.toast("Escolha o orçamento em PDF. Se for foto, digite os itens.");return;}
        lerOrc(il,fl.arrayBuffer(),fl.name);return;
      }
      if(t.hasAttribute("data-lk")){ /* entrega / retirada da loja */
        var lg=t.closest("[data-pi]"),xg=lg&&ed.parceiros[+lg.getAttribute("data-pi")];if(!xg)return;
        if(t.tagName==="SELECT"&&e.type!=="change")return;
        var gk=t.getAttribute("data-lg"),kg=t.getAttribute("data-lk"),og=xg[gk]=xg[gk]||{};
        if(kg==="resp"){og.resp=t.value;delete og.quem;delete og.equipeId;
          var bl=$('[data-logi="'+gk+'"]',lg);if(bl)bl.outerHTML=logiBlocoHTML(xg,LOGI.filter(function(z){return z[0]===gk;})[0]);
          var sr=$('[data-logi="'+gk+'"] [data-lk="resp"]',lg);if(sr)sr.focus();return;}
        if(kg==="equipeId"){og.equipeId=t.value;og.quem=t.value?nomeSemPapel((opcoesResp().filter(function(r){return r[0]===t.value;})[0]||[])[1]||""):"";return;}
        og[kg]=t.value;return;
      }
      var li=t.closest("[data-ii]"),lj=li&&t.closest("[data-ip]");
      if(lj&&t.hasAttribute("data-ik")){
        var xi=ed.parceiros[+lj.getAttribute("data-ip")],it=xi&&(xi.itens||[])[+li.getAttribute("data-ii")];if(!it)return;
        var ki=t.getAttribute("data-ik"),vi=ki==="valor"?(t.value===""?"":num(t.value)):t.value;it[ki]=vi;
        if(e.type==="change"&&ki==="valor"&&t.value!=="")t.value=S.fmtValor(vi);
        var lt=$("[data-res-lt]",lj),av=$("[data-res-av]",lj),txt=avisoRes(xi);if(lt)lt.textContent=brl(soma(xi.itens,"valor"));if(av){av.textContent=txt;av.hidden=!txt;}
        $("#res-tot",m).innerHTML=resTotHTML();return;
      }
      var lp=t.closest("[data-pi]");if(lp&&t.hasAttribute("data-pk")){ed.parceiros[+lp.getAttribute("data-pi")][t.getAttribute("data-pk")]=t.value;if(e.type==="change")redesRes();return;}
      var lq=t.closest("[data-qi]");
      if(lq&&t.hasAttribute("data-qk")){var v=t.getAttribute("data-num")?(t.value===""?"":num(t.value)):t.value;ed.pecas[+lq.getAttribute("data-qi")][t.getAttribute("data-qk")]=v;
        if(e.type==="change"&&t.getAttribute("data-qk")==="valor"&&t.value!=="")t.value=S.fmtValor(v);$("#ed-tot",m).innerHTML=totaisHTML();return;}
      var k=t.getAttribute("data-k");if(!k)return;S.setPath(ed,k,t.type==="checkbox"?t.checked:t.value);
    }
    function salvar(){
      if(!S.validar($("#ed-form",m)))return Promise.reject({code:"validacao"});
      ed.pecas.forEach(function(x){if(!x.id)x.id=idPeca();});
      var corpo=S.clone(ed),pid=ed.id;delete corpo.id;delete corpo.rtRever;
      var nm={};equipeLista().forEach(function(x){nm[x.id]=x.nome;});
      corpo.equipeNomes=ed.equipe.map(function(i){return nm[i]||(adm&&St.get("equipe",i)||{}).nome||"";}).filter(Boolean); /* o colaborador não lê Equipe */
      if(!adm){var at=St.get("producoes",pid)||{};corpo.pecas=at.pecas||[];corpo.contratoId=at.contratoId||"";corpo.clienteId=at.clienteId||"";corpo.rtRever=true;}
      /* Google: o acesso é pedido aqui, ainda no clique (a janela do Google só abre no clique), e só se a agenda muda */
      var tokP=gOkAdm()&&precisaGoogleProd(pid,corpo)?tokenGoogle():null;if(tokP)tokP.catch(function(){});
      return St.salvar("producoes",pid||null,corpo).then(function(nid){ed.id=nid;return M.producao.sync(nid,corpo,tokP).then(function(){return adm?syncRT(nid):0;}).then(function(n){
        S.toast(n?"Produção salva. Calendário e RT no Financeiro atualizados.":"Produção salva e calendário atualizado.");if(!pid){history.replaceState(null,"","#adm/producao/"+nid);desenhar();}return nid;});},function(e){S.erroGravar(e);throw e;});
    }
    /* RT das peças vai sozinha para o Financeiro (A receber) ao salvar: um lançamento por peça com RT, na data de pagamento da RT.
       Lançamento já recebido não é alterado; peça removida (ou produção cancelada) apaga o lançamento ainda pendente. */
    function syncRT(pid){
      var lanc=St.list("financeiro").filter(function(f){return f.producaoId===pid&&catFin(f.categoria)==="RT / comissão";}),usados={},fila=[];
      ed.pecas.forEach(function(x){
        var v=Math.round(num(x.valor)*num(x.art))/100;if(ed.status==="cancelada"||!v)return;
        var p=nomeParceiro(x.parceiroId)||"";
        var d={tipo:"entrada",data:x.dataRT||ed.dataFim||ed.dataInicio||S.hoje(),descricao:"RT · "+(p?p+" · ":"")+(ed.titulo||"produção"),pagador:p,categoria:"RT / comissão",valor:v,producaoId:pid,contratoId:ed.contratoId||"",rtPeca:x.id,parceiroId:x.parceiroId||""};
        /* acha o lançamento desta peça (ou um lançado à mão antes, com o mesmo parceiro e valor) */
        var e=lanc.filter(function(f){return f.rtPeca===x.id;})[0]||lanc.filter(function(f){return !f.rtPeca&&!f.parcGrupo&&!usados[f.id]&&num(f.valor)===v&&(f.pagador||"")===p;})[0];
        /* RT parcelada no Financeiro (2026-11-23): as parcelas ficam como estão, sem voltar a ser um lançamento só */
        if(e&&e.parcGrupo){lanc.forEach(function(f){if(f.parcGrupo===e.parcGrupo)usados[f.id]=1;});return;}
        if(!e){fila.push(["rt-"+pid+"-"+x.id,Object.assign(d,{status:"pendente",forma:"PIX",criadoEm:S.agoraISO()})]);return;}
        usados[e.id]=1;
        if(e.status==="pago"||["data","descricao","pagador","valor","contratoId","rtPeca","parceiroId"].every(function(k){return String(e[k]==null?"":e[k])===String(d[k]);}))return;
        var c=St.copia("financeiro",e.id);delete c.id;fila.push([e.id,Object.assign(c,d)]);
      });
      lanc.forEach(function(f){if(!usados[f.id]&&f.status!=="pago")fila.push([f.id,null]);});
      return fila.reduce(function(q,o){return q.then(function(){return o[1]?St.salvar("financeiro",o[0],o[1]):St.excluir("financeiro",o[0]);});},Promise.resolve()).then(function(){return fila.length;});
    }
    m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);m.addEventListener("click",aoClicar);
    m.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.hasAttribute&&e.target.hasAttribute("data-chk-txt")){e.preventDefault();var b=$("[data-add-chk]",m);if(b)b.click();}});
    desenhar();
    /* Colaborador mexeu na produção (título, datas, status): o adm, ao abrir, confere a RT no Financeiro sozinho */
    if(adm&&ed.id&&ed.rtRever){delete ed.rtRever;syncRT(ed.id).then(function(){var c=St.copia("producoes",ed.id);if(!c)return;delete c.id;delete c.rtRever;return St.salvar("producoes",ed.id,c);}).catch(function(){});}
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
/* Lembrete de RT ao fornecedor por botão (pedido da Isys, 2026-11-24), mesmo com a parcela vencida.
   O botão grava pedidoLembrete no lançamento; a função de e-mails (roda a cada 10 min) manda ao e-mail do parceiro
   e grava em lembretes "rt-pedido-<id>-<pedidoLembrete>". Parceiro: parceiroId, a peça da produção ou o nome. */
function parceiroDoRT(f){
  var pid=f.parceiroId;
  if(!pid&&f.producaoId){var p=St.get("producoes",f.producaoId),x=p&&(p.pecas||[]).filter(function(y){return y.id===f.rtPeca;})[0];pid=x&&x.parceiroId;}
  var pa=pid?St.get("parceiros",pid):null;
  if(!pa&&f.pagador)pa=St.list("parceiros").filter(function(y){return [y.fornecedor,y.marca,y.produto].indexOf(f.pagador)>=0;})[0]||null;
  return pa;
}
function quandoBR(iso){var d=new Date(iso);return isNaN(d)?"":S.dataBR(S.isoLocal(d))+" às "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);}
function rtLembreteHTML(id,f){
  var pa=parceiroDoRT(f),em=pa?String(pa.email||"").trim():"",nome=pa?(pa.fornecedor||pa.marca||pa.produto||"parceiro"):"";
  var ult=St.list("lembretes").filter(function(l){return l.id.indexOf("rt-venc-"+id+"-")===0||l.id.indexOf("rt-pedido-"+id+"-")===0;}).map(function(l){return String(l.enviadoEm||"");}).sort().pop();
  var pend=f.pedidoLembrete&&!St.get("lembretes","rt-pedido-"+id+"-"+f.pedidoLembrete);
  var txt=!pa?"Para enviar o lembrete por e-mail, a RT precisa estar ligada a um parceiro (pela produção).":
    !em?"Para enviar o lembrete, cadastre o e-mail de "+esc(nome)+" em Parceiros.":
    "Lembrete ao fornecedor: <b>"+esc(nome)+"</b> · "+esc(em)+"."+(pend?" <b>Envio pedido; sai em até 10 minutos.</b>":ult?" Último envio em "+esc(quandoBR(ult))+".":"");
  return '<div data-rt-box style="margin-bottom:var(--s-16)"><p class="nota">'+txt+'</p>'+(em?'<div class="acoes" style="margin-top:var(--s-12)"><button type="button" class="btn btn--linha" data-rt-lembrete'+(pend?' disabled':'')+'>'+ik("email")+'Enviar lembrete ao fornecedor</button></div>':'')+'</div>';
}
function modalFin(id,tipo){
  var f=id?St.copia("financeiro",id):{tipo:tipo||"entrada",data:S.hoje(),status:tipo==="saida"?"pago":"pendente",forma:"PIX",categoria:tipo==="saida"?"Materiais de produção":"Produção"};
  f.categoria=catFin(f.categoria);
  var cons=[["","— nenhum —"]].concat(St.list("contratos").map(function(c){return [c.id,c.num+" · "+(nomeCliente(c.clienteId)||"")];}));
  var ehParc=!!f.parcGrupo,par=null;
  var cs=[{k:"tipo",r:"Tipo",t:"select",o:[["entrada","Entrada"],["saida","Saída"]]},{k:"data",r:"Data",t:"date",req:1},
      {k:"descricao",r:"Descrição",req:1,full:1},{k:"categoria",r:"Categoria",t:"select",o:CATS_FIN},{k:"valor",r:"Valor (R$)",t:"money",req:1}];
  /* Parcelado (pedido da Isys, 2026-11-23, ex.: RT em 6x): valor total + número de parcelas + 1ª cobrança → lista de parcelas editável */
  if(!ehParc)cs.push({k:"parcelado",r:"Parcelado: dividir em várias cobranças",t:"check",full:1},{k:"nParcelas",r:"Número de parcelas",t:"number"});
  cs.push({k:"status",r:"Status",t:"select",o:S.opcoes("financeiro")},{k:"forma",r:"Forma",t:"select",o:["PIX","Transferência","Dinheiro","Cartão","Boleto"]},
      {k:"contratoId",r:"Contrato",t:"select",o:cons});
  /* Recibo por e-mail (pedido da Isys, 2026-11-24): entrada de contrato marcada como Paga → a função de e-mails manda o recibo ao cliente, uma vez só */
  var rec=id?St.get("lembretes","recibo-"+id):null,pagoAntes=f.status==="pago";
  var ehRTpend=!!id&&f.tipo==="entrada"&&f.categoria==="RT / comissão"&&f.status!=="pago";
  if(!rec){cs.push({k:"enviarRecibo",r:"Enviar recibo ao cliente por e-mail",t:"check",full:1});if(!pagoAntes)f.enviarRecibo=true;}
  cs.push({k:"pagador",r:"Quem pagou ou recebeu"},{k:"obs",r:"Observação",t:"area",full:1});
  S.modalForm({sobre:"Financeiro",titulo:id?"Editar lançamento":(f.tipo==="saida"?"Nova saída":"Nova entrada"),dados:f,salvarRot:id?"Salvar":"+ Adicionar",campos:cs,
    antes:(ehParc?'<p class="nota" style="margin-bottom:var(--s-16)"><b>Parcela '+esc(f.parcela)+' de '+esc(f.parcelas)+'.</b> As mudanças valem só para esta parcela.</p>':'')+
      (rec?'<p class="nota" style="margin-bottom:var(--s-16)">Recibo nº '+esc(rec.num)+' enviado ao cliente em '+esc(S.dataBR(String(rec.enviadoEm||"").slice(0,10)))+'.</p>':'')+
      (ehRTpend?rtLembreteHTML(id,f):''),
    aoAbrir:function(d){if(!ehParc)par=ligarParcelas(d);
      var bl=$("[data-rt-lembrete]",d);
      if(bl)bl.addEventListener("click",function(){
        var pa=parceiroDoRT(f),h=S.hoje(),dt=String(f.data||"");
        S.confirmar({sobre:"Lembrete de RT",ico:"email",perigo:false,titulo:"Enviar lembrete a "+(pa.fornecedor||pa.marca||"fornecedor")+"?",ok:"Enviar",icoOk:"email",
          texto:"Vai para "+String(pa.email).trim()+": RT de "+brl(f.valor)+(dt<h?", vencida em "+S.dataBR(dt):dt===h?", vence hoje":", vence em "+S.dataBR(dt))+". Sai em até 10 minutos."}).then(function(sim){
          if(!sim)return;
          var c=St.copia("financeiro",id);if(!c)return;delete c.id;c.pedidoLembrete=f.pedidoLembrete=S.agoraISO();
          return St.salvar("financeiro",id,c).then(function(){var bx=$("[data-rt-box]",d);if(bx)bx.outerHTML=rtLembreteHTML(id,f);S.toast("Lembrete pedido. Sai em até 10 minutos.");},S.erroGravar);
        });
      });
      var ck=$('[data-k="enviarRecibo"]',d);if(!ck)return;var lb=ck.closest("label");
      function ver(){var g=function(k){var e=$('[data-k="'+k+'"]',d);return e?e.value:"";};
        lb.hidden=!(g("tipo")==="entrada"&&g("contratoId")&&g("status")==="pago"&&g("categoria")!=="RT / comissão");}
      d.addEventListener("change",ver);ver();},
    /* entrada sem contrato nem produção = recebimento avulso (consultoria, serviços) */
    aoSalvar:function(v){
      var parcelado=!!v.parcelado;delete v.parcelado;delete v.nParcelas;if(parcelado){delete v.enviarRecibo;delete f.enviarRecibo;}
      if(!num(v.valor)){S.toast(parcelado?"Informe o valor total.":"Informe um valor.");return false;}
      if(!parcelado){var corpo=Object.assign({},f,v);delete corpo.id;corpo.avulso=corpo.tipo==="entrada"&&!corpo.contratoId&&!corpo.producaoId;if(!id)corpo.criadoEm=S.agoraISO();
        /* pagoEm = quando virou Pago (data do recibo); enviarRecibo só fica em entrada de contrato paga */
        if(corpo.status!=="pago")delete corpo.pagoEm;else if(!pagoAntes||(corpo.enviarRecibo&&!corpo.pagoEm))corpo.pagoEm=S.agoraISO();
        if(!(corpo.enviarRecibo&&corpo.status==="pago"&&corpo.tipo==="entrada"&&corpo.contratoId&&corpo.categoria!=="RT / comissão"))delete corpo.enviarRecibo;
        return St.salvar("financeiro",id||null,corpo).then(function(){S.toast("Lançamento salvo.");});}
      var ls=par.linhas(),n=ls.length;
      if(n<2){S.toast("Informe de 2 a 60 parcelas.");return false;}
      if(ls.some(function(l){return !l.data||!(num(l.valor)>0);})){S.toast("Confira a data e o valor de cada parcela.");return false;}
      /* cada parcela é um lançamento; o que já existia vira a 1ª (mesmo id) */
      var g=S.uid(),fila=ls.map(function(l,i){
        var c=Object.assign({},f,v,{data:l.data,valor:num(l.valor),status:l.status,descricao:v.descricao+" ("+(i+1)+"/"+n+")",parcGrupo:g,parcela:i+1,parcelas:n});
        delete c.id;c.avulso=c.tipo==="entrada"&&!c.contratoId&&!c.producaoId;if(!(i===0&&id))c.criadoEm=S.agoraISO();
        return [i===0?id||null:null,c];
      });
      return fila.reduce(function(q,x){return q.then(function(){return St.salvar("financeiro",x[0],x[1]);});},Promise.resolve()).then(function(){S.toast(n+" parcelas salvas.");});
    },
    aoExcluir:id?function(){return St.excluir("financeiro",id);}:null});
}
/* Parcelas na janela do lançamento: ao marcar "Parcelado", Valor vira o total, Data vira a 1ª cobrança e aparece a lista
   (mensal, mesmo dia; dia 31 cai no último dia do mês; valor = total ÷ parcelas em centavos, a sobra na última).
   Data, valor e status de cada parcela podem ser mudados (ex.: marcar como Pago as que já foram pagas).
   Mudar total, número de parcelas ou 1ª data refaz datas e valores (os status ficam). */
function somaMes(iso,k){
  var p=String(iso).split("-").map(Number),mo=p[1]-1+k,y=p[0]+Math.floor(mo/12);mo=((mo%12)+12)%12;
  var ult=new Date(y,mo+1,0).getDate();return y+"-"+("0"+(mo+1)).slice(-2)+"-"+("0"+Math.min(p[2],ult)).slice(-2);
}
function ligarParcelas(d){
  var chk=$('[data-k="parcelado"]',d),nIn=$('[data-k="nParcelas"]',d),vIn=$('[data-k="valor"]',d),dIn=$('[data-k="data"]',d),sIn=$('[data-k="status"]',d);
  var lN=nIn.closest("label"),lS=sIn.closest("label"),lV=vIn.closest("label"),lD=dIn.closest("label"),rotV=lV.firstChild.nodeValue,rotD=lD.firstChild.nodeValue;
  var box=document.createElement("div");box.className="parc f--full";box.hidden=true;lN.after(box);
  nIn.setAttribute("min","2");nIn.setAttribute("max","60");nIn.setAttribute("step","1");nIn.setAttribute("inputmode","numeric");
  var linhas=[];
  function gerar(){
    var n=Math.round(num(nIn.value)),ini=dIn.value||S.hoje(),cent=Math.round(num(vIn.value)*100);
    if(!(n>=2&&n<=60)){linhas=[];box.innerHTML='<p class="nota">Informe de 2 a 60 parcelas.</p>';return;}
    var base=Math.round(cent/n),antes=linhas;linhas=[];
    for(var i=0;i<n;i++)linhas.push({data:somaMes(ini,i),valor:(i<n-1?base:cent-base*(n-1))/100,status:antes[i]?antes[i].status:"pendente"});
    desenhar();
  }
  function desenhar(){
    var n=linhas.length,sts=[["pendente","Pendente"],["pago","Pago"]];
    box.innerHTML='<div class="parc__lin parc__cab" aria-hidden="true"><span>Nº</span><span>Data da cobrança</span><span>Valor (R$)</span><span>Status</span></div>'+
      linhas.map(function(l,i){var q=(i+1)+" de "+n;
        return '<div class="parc__lin" data-pi="'+i+'"><span class="parc__n">'+(i+1)+'/'+n+'</span>'+
          '<label class="f"><span class="vh">Data da parcela '+q+'</span><input type="date" data-pq="data" value="'+esc(l.data)+'"></label>'+
          '<label class="f"><span class="vh">Valor da parcela '+q+'</span><input type="text" inputmode="decimal" data-pq="valor" value="'+esc(S.fmtValor(l.valor))+'"></label>'+
          '<label class="f"><span class="vh">Status da parcela '+q+'</span><select data-pq="status">'+sts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===l.status?" selected":"")+'>'+o[1]+'</option>';}).join("")+'</select></label></div>';
      }).join("")+'<p class="nota parc__soma" aria-live="polite"></p>';
    somar();
  }
  function somar(){
    var s=linhas.reduce(function(a,l){return a+Math.round(num(l.valor)*100);},0)/100,t=num(vIn.value),p=$(".parc__soma",box);if(!p)return;
    var pagas=linhas.filter(function(l){return l.status==="pago";}).length;
    p.innerHTML='Soma das parcelas: <b>'+brl(s)+'</b>'+(pagas?' · '+pagas+(pagas===1?' paga':' pagas'):'')+(Math.abs(s-t)>=0.005?' · <span class="neg">diferente do valor total ('+esc(brl(t))+')</span>':'');
  }
  function mostrar(){
    var on=chk.checked;box.hidden=lN.hidden=!on;lS.hidden=on;
    lV.firstChild.nodeValue=on?"Valor total (R$) *":rotV;lD.firstChild.nodeValue=on?"Data da 1ª cobrança *":rotD;
    if(on){if(!nIn.value)nIn.value="2";gerar();}
  }
  chk.addEventListener("change",mostrar);
  [nIn,vIn,dIn].forEach(function(x){x.addEventListener("input",function(){if(chk.checked)gerar();});});
  box.addEventListener("input",function(e){var t=e.target,k=t.getAttribute("data-pq"),lin=t.closest("[data-pi]");if(!k||!lin)return;
    var l=linhas[+lin.getAttribute("data-pi")];l[k]=k==="valor"?num(t.value):t.value;somar();});
  box.addEventListener("change",function(e){var t=e.target;if(t.getAttribute("data-pq")==="valor")t.value=S.fmtValor(num(t.value));});
  mostrar();
  return {linhas:function(){return chk.checked?linhas:[];}};
}
M.financeiro={render:function(m,id,vista){
  m.innerHTML=cab("Financeiro","Entradas e saídas do escritório. Quando um <b>contrato</b> é marcado como Assinado, o sinal e o saldo entram aqui sozinhos em A receber, com a data de cada recebimento; ao marcar uma como <b>paga</b>, ela passa para Recebido. Recebimentos <b>avulsos</b> (sem contrato) também entram por + Entrada.",
      selPil("Período","data-per",[["mes","Este mês"],["ant","Mês passado"],["ano","Este ano"],["esc","Escolher mês"],["tudo","Todo o período"]],fFin.per)+
      '<label class="sis-sel" data-mes-box'+(fFin.per==="esc"?"":" hidden")+'><span class="vh">Mês</span><input type="month" data-mes value="'+esc(fFin.mes)+'"></label>'+
      '')+
    '<div id="fin-kpis"></div>'+
    '<div class="sis-barra">'+pilulas(ABAS_FIN,fFin.aba,"data-aba","Mostrar")+busca(fFin.q,"Buscar descrição, cliente…")+'</div>'+
    '<div id="sis-lista"></div>'+
    '<div class="sis-avulso"><button type="button" class="btn btn--escuro" data-nova="entrada">'+ik("mais")+'Entrada</button><button type="button" class="btn btn--linha" data-nova="saida">'+ik("menos")+'Saída</button><button type="button" class="btn btn--linha" data-csv>'+ik("baixar")+'Exportar CSV</button></div>';
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
/* Toda tarefa com data (início ou prazo) aparece no calendário, sem precisar marcar (pedido da Isys, 2026-11-15) */
/* Colaborador: só compromissos e tarefas de que é responsável; produções aparecem para todos (pedido da Isys, 2026-11-16) */
function agendaTudo(){return St.list("agenda").filter(function(e){return !e.gApagar&&(e.tipo==="producao"||e.auto||podeVer(e));}).concat(St.list("tarefas").filter(function(t){return (t.inicio||t.prazo)&&podeVer(t);}).map(evTarefa));}
function eventosDoDia(dia){return agendaTudo().filter(function(e){return e.data&&e.data<=dia&&(e.dataFim||e.data)>=dia;}).sort(function(a,b){return String(a.hora||"").localeCompare(String(b.hora||""));});}
function proximosEventos(n){var h=S.hoje();return agendaTudo().filter(function(e){return (e.dataFim||e.data)>=h;}).sort(function(a,b){return (String(a.data)+(a.hora||"")).localeCompare(String(b.data)+(b.hora||""));}).slice(0,n);}
/* Compromisso em linha: data (e hora) | título (e local) | tipo, nas mesmas colunas em todas as linhas */
function itemEvento(e){var t=TIPOS_AG[e.tipo]||TIPOS_AG.outro,per=e.dataFim&&e.dataFim!==e.data,dm=function(d){return S.dataBR(d).slice(0,5);};
  return '<div class="item item--ev"><span class="ev__data">'+esc(per?dm(e.data)+" a "+dm(e.dataFim):S.dataBR(e.data))+(e.hora?'<small>'+esc(e.hora)+'</small>':'')+'</span>'+
    '<span class="ev__txt"><button type="button" class="ev__tit" data-evento="'+esc(e.id)+'">'+esc(e.titulo)+'</button>'+(e.local?'<small>'+esc(e.local)+'</small>':'')+'</span>'+
    '<span class="tag" style="--c:'+t[1]+'">'+t[0]+'</span></div>';}
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
  var link=linkMeet({hangoutLink:e.meetLink});
  S.modal({sobre:t[0],ico:"calendario",titulo:e.titulo,semFoco:1,
    corpo:(link?'<p class="nota t-meet" style="margin-bottom:var(--s-12)">'+ik("video")+'<a class="lnk" target="_blank" rel="noopener" href="'+esc(link)+'">Entrar na reunião (Google Meet) ↗</a></p>':'')+
      '<dl class="itens">'+[["Data",S.dataBR(e.data)+(e.dataFim&&e.dataFim!==e.data?" a "+S.dataBR(e.dataFim):"")],["Horário",(e.hora||"")+(e.horaFim?" às "+e.horaFim:"")],["Responsável",e.respNome],["Local",e.local],["Convidados",e.convidados],["Detalhes",e.desc]].filter(function(x){return x[1];}).map(function(x){return '<div class="item"><b>'+esc(x[0])+'</b><span style="grid-column:1/-1;color:var(--tinta)">'+esc(x[1])+'</span></div>';}).join("")+'</dl>'+
      (e.auto&&adm?'<p class="nota" style="margin-top:var(--s-12)">Criado pela produção. Para mudar datas, edite a produção.</p>':''),
    pe:(e.auto&&e.producaoId?'<a class="lnk esq" href="#adm/producao/'+esc(e.producaoId)+'" data-fechar>'+ik("producoes")+'Abrir produção</a>':'')+
      ((adm&&googleId()&&vaiAgenda(e))?'':'<a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(gcal(e))+'">'+ik("calendario")+'Adicionar ao Google Agenda ↗</a>')+ /* do Shylton: já vai sozinho, sem cópia solta */
      '<button type="button" class="btn btn--escuro" data-fechar>'+ik("fechar")+'Fechar</button>'});
}
function modalEvento(id,data){
  var e=id?St.copia("agenda",id):{tipo:"visita",data:data||S.hoje()};
  var gOk=gOkAdm();if(gOk)prepararGoogle().catch(function(){});
  e.resps=respsDe(e);if(!e.resps.length)e.resps=["adm"]; /* sem responsável = do Shylton */
  hashesEquipe().catch(function(){});
  /* Compromisso do Shylton vai direto para a agenda dele no Google (pedido da Isys, 2026-11-15); dos outros, link para copiar */
  var depois=gOk?'<p class="nota" style="margin-top:var(--s-16)">'+(e.gEvento?ik("calendario")+' Na agenda do Shylton no Google: mudar ou excluir aqui atualiza lá.':'Compromisso do Shylton vai direto para a agenda dele no Google ao salvar (o Google pode pedir para entrar com a conta dele).')+
      (id&&!vaiAgenda(e)?' <a class="lnk" target="_blank" rel="noopener" href="'+esc(gcal(e))+'">'+ik("calendario")+'Adicionar ao Google Agenda ↗</a>':'')+'</p>':
    id?'<p style="margin-top:var(--s-16)"><a class="lnk" target="_blank" rel="noopener" href="'+esc(gcal(e))+'">'+ik("calendario")+'Adicionar ao Google Agenda ↗</a></p>':'<p class="nota" style="margin-top:var(--s-16)">Depois de salvar, abra o compromisso para mandar ao Google Agenda.</p>';
  /* Reunião online com o link à mostra e convidados por e-mail, como no Google Agenda (pedido da Isys, 2026-11-16) */
  var link=linkMeet({hangoutLink:e.meetLink});
  var cs=[{k:"titulo",r:"Título",req:1,full:1},{k:"tipo",r:"Tipo",t:"select",o:Object.keys(TIPOS_AG).filter(function(k){return k!=="producao";}).map(function(k){return [k,TIPOS_AG[k][0]];})},
      {k:"resps",r:"Responsáveis",t:"multi",o:opcoesResp(),full:1,ajuda:"Marque um ou mais; o colaborador só vê o compromisso se for responsável. "+(gOk?"Vai para o Google Agenda do Shylton o que for dele e toda reunião online ou com convidados.":"Só o que for do Shylton vai para o Google Agenda dele.")},
      {k:"data",r:"Data",t:"date",req:1},{k:"dataFim",r:"Até (opcional)",t:"date"},{k:"hora",r:"Início",t:"time"},{k:"horaFim",r:"Fim",t:"time"}];
  if(gOk){e.linkReuniao=link;
    cs.push({k:"meet",r:"Reunião online (Google Meet): o link é criado sozinho na agenda do Shylton",t:"check",full:1},
      {k:"linkReuniao",r:"Link da reunião",ro:1,full:1,ph:e.gMeet?"O link está no evento do Google Agenda":"O link do Meet aparece aqui depois de salvar"},
      {k:"convidados",r:"Convidados (e-mails)",t:"area",full:1,alt:72,ph:"nome@exemplo.com",ajuda:"Um por linha ou separados por vírgula. O Google manda o convite por e-mail e avisa os convidados se mudar a data ou cancelar."});}
  cs.push({k:"local",r:"Local",full:1},{k:"desc",r:"Detalhes",t:"area",full:1});
  var d=S.modalForm({sobre:"Calendário",titulo:id?e.titulo:"Novo compromisso",dados:e,salvarRot:id?"Salvar":"+ Adicionar",
    campos:cs,
    depois:depois,
    aoSalvar:function(v){if(v.dataFim&&v.dataFim<v.data)v.dataFim=v.data;var corpo=Object.assign({},e,v);delete corpo.id;delete corpo.linkReuniao;
      var rs=(v.resps||[]).filter(Boolean);
      if(!rs.length){S.toast("Marque pelo menos um responsável.");return false;}
      gravarResps(corpo,rs);
      if(gOk){
        var ems=listaEmails(v.convidados),ruins=ems.filter(function(x){return !emailOk(x);});
        if(ruins.length){S.toast("Confira "+(ruins.length===1?"este e-mail":"estes e-mails")+": "+ruins.join(", ")+".");return false;}
        if(ems.length)corpo.convidados=ems.join(", ");else delete corpo.convidados;
        if(v.meet)corpo.meet=true;else delete corpo.meet;
        if(corpo.meet&&!corpo.hora){S.toast("Para a reunião online, informe o horário de início.");return false;}
      }
      var a=gOk?acaoAgenda(id?e:{},corpo):null;
      if(!a)return St.salvar("agenda",id||null,corpo).then(function(){S.toast("Compromisso salvo.");});
      return tokenGoogle().then(a).then(function(r){aplicarGoogle(corpo,r);return "ok";},function(er){if(window.console)console.error(er);if(corpo.gEvento)corpo.gAtrasado=true;return "falhou";})
        .then(function(st){return St.salvar("agenda",id||null,corpo).then(function(nid){
          var novoLink=st==="ok"&&corpo.meetLink&&corpo.meetLink!==e.meetLink;
          S.toast(st!=="ok"?"Compromisso salvo, mas o Google Agenda não foi atualizado agora. No Calendário, use “Atualizar a agenda do Google”.":
            novoLink?"Reunião criada no Google Agenda. O link está no compromisso.":"Compromisso salvo e agenda do Google atualizada.");
          if(novoLink)setTimeout(function(){modalEvento(nid||id);},400); /* reabre já com o link à mostra */
        });});
    },
    aoExcluir:id?function(){return excluirAgenda(id,gOk&&e.gEvento?tokenGoogle():null);}:null});
  var lk=$('[data-k="linkReuniao"]',d);
  if(lk&&link){
    lk.closest("label").insertAdjacentHTML("afterend",'<div class="f--full acoes meet-acoes"><a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(link)+'">'+ik("video")+'Entrar na reunião ↗</a><button type="button" class="btn btn--linha" data-copiar-meet>'+ik("link")+'Copiar link</button></div>');
    $("[data-copiar-meet]",d).addEventListener("click",function(){S.copiar(link);});
  }
  return d;
}
M.calendario={render:function(m,id,vista){
  var adm=S.ehAdm(),gOk=gOkAdm();if(gOk)prepararGoogle().catch(function(){});
  m.innerHTML=cab("Calendário",adm?"Produções, visitas, compromissos e as tarefas com data. "+(gOk?"O que é do Shylton vai direto para a agenda dele no Google.":"Cada compromisso pode ir para o Google Agenda."):"Produções, visitas, compromissos e tarefas da equipe.",
    '<div class="cal-nav"><button type="button" data-mes="-1">'+ik("anterior")+'Anterior</button><b id="cal-tit"></b><button type="button" data-mes="1">Próximo'+ik("proximo")+'</button><button type="button" data-mes="0">'+ik("calendario")+'Hoje</button></div>'+(adm?'<button type="button" class="btn btn--escuro" data-novo>'+ik("mais")+'Compromisso</button>':''))+
    '<div id="k-google"></div><div id="sis-lista"></div>';
  var avisoGoogle=avisoGoogleEm($("#k-google",m));
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
    html+='<section class="sis-sec proximos"><h2>'+ik("calendario")+'Próximos</h2><div class="itens">'+(prox.length?prox.map(itemEvento).join(""):'<p class="nota">Nada marcado.</p>')+'</div></section>';
    html+='<p class="nota">Legenda: '+Object.keys(TIPOS_AG).map(function(k){return '<span class="tag" style="--c:'+TIPOS_AG[k][1]+';margin-right:14px">'+TIPOS_AG[k][0]+'</span>';}).join("")+'</p>';
    $("#sis-lista",m).innerHTML=html;
    avisoGoogle();
  };
  if(!carregando($("#sis-lista",m),vista,["agenda","tarefas"]))vista.atualizar();
}};

/* ================= PARCEIROS =================
   Pedido da Isys (2026-11-15): 5 categorias (S.CATS_PARC), a mesma ficha para todas, sem valor,
   e link público de cadastro (cadastro-parceiro). Fichas antigas guardam campos antigos (etapa, valor…):
   aparecem só se preenchidos, e o valor só para o adm. */
var CAMPOS_PARC=[["fornecedor","Nome da empresa"],["responsavel","Responsável"],["cnpj","CNPJ"],["produto","O que oferece"],["contato","Telefone / WhatsApp"],["email","E-mail"],["instagram","Instagram"],["site","Site"],
  ["cep","CEP"],["endereco","Rua / avenida"],["numero","Número"],["complemento","Complemento"],["bairro","Bairro"],["cidade","Cidade"],["uf","Estado (UF)"],["origem","Origem"],["obs","Observação"]];
var ANTIGOS_PARC=[["marca","Marca"],["etapa","Etapa"],["tipo","Tipo"],["produtoMo","Produto e MO"],["ondeVende","Onde vende?"],["valor","Valor"]];
var fParc={aba:"todos",q:""};
function nomeCat(k){var c=CATS_PARC.filter(function(x){return x[0]===k;})[0];return c?c[1]:CATS_ANTIGAS[k]?CATS_ANTIGAS[k]+" (categoria antiga)":"Sem categoria";}
function corCat(k){var c=CATS_PARC.filter(function(x){return x[0]===k;})[0];return c?c[2]:"#A9A49C";}
function camposParc(p){return CAMPOS_PARC.concat(ANTIGOS_PARC.filter(function(c){return p&&p[c[0]]&&(S.ehAdm()||c[0]!=="valor");}));}
function modalParceiro(id){
  var p=id?St.copia("parceiros",id):{cat:catNova(fParc.aba)?fParc.aba:""};
  var opc=[["","— escolha —"]].concat(CATS_PARC);if(p.cat&&!catNova(p.cat))opc.push([p.cat,nomeCat(p.cat)]);
  var cs=[{k:"cat",r:"Categoria",t:"select",o:opc}].concat(camposParc(p).map(function(c){var k=c[0];return {k:k,r:c[1],t:k==="obs"?"area":k==="email"?"email":"text",full:k==="obs",ro:k==="origem"?1:0};}));
  S.modalForm({sobre:"Cadastro",ico:"parceiros",titulo:id?nomeParceiro(id):"Novo fornecedor",campos:cs,dados:p,salvarRot:id?"Salvar":"+ Adicionar",
    aoSalvar:function(v){var corpo=Object.assign({},p,v);delete corpo.id;if(!id)corpo.criadoEm=S.agoraISO();return St.salvar("parceiros",id||null,corpo).then(function(){S.toast("Parceiro salvo.");});},
    aoExcluir:id?function(){return St.excluir("parceiros",id);}:null});
}
/* Colaborador: só vê os dados do fornecedor, sem editar nem excluir */
function verParceiro(id){
  var p=St.get("parceiros",id);if(!p)return;
  var lin=camposParc(p).filter(function(c){return p[c[0]]&&c[0]!=="origem";});
  S.modal({sobre:"Fornecedor · "+nomeCat(p.cat),ico:"parceiros",titulo:nomeParceiro(id),semFoco:1,
    corpo:'<dl class="itens">'+(lin.length?lin.map(function(c){return '<div class="item"><b>'+esc(c[1])+'</b><span style="grid-column:1/-1;color:var(--tinta);overflow-wrap:anywhere">'+esc(p[c[0]])+'</span></div>';}).join(""):'<p class="nota">Sem dados preenchidos.</p>')+'</dl>',
    pe:'<button type="button" class="btn btn--escuro" data-fechar>'+ik("fechar")+'Fechar</button>'});
}
function abaParc(p){return catNova(p.cat)?p.cat:"outras";}
M.parceiros={render:function(m,id,vista){
  var adm=S.ehAdm(),todos=St.list("parceiros");
  if(fParc.aba==="outras"&&!todos.some(function(p){return !catNova(p.cat);}))fParc.aba="todos";
  m.innerHTML=cab("Parceiros e fornecedores","Folhagem, móveis soltos, objetos, obras de arte e objetos especiais. "+(adm?"Toque num fornecedor para editar os dados.":"Toque num fornecedor para ver os dados de contato."),adm?'<button type="button" class="btn btn--escuro" data-novo>'+ik("mais")+'Novo fornecedor</button>':'')+
    (adm?caixaLink("Link de cadastro de parceiros e fornecedores","cadastro-parceiro","Compartilhe este link: quando o fornecedor preencher, ele entra aqui, na categoria que escolheu."):'')+
    '<div class="sis-barra">'+pilulas([["todos","Todos"]].concat(CATS_PARC,todos.some(function(p){return !catNova(p.cat);})?[["outras","Outras","#A9A49C"]]:[]),fParc.aba,"data-aba","Categoria")+busca(fParc.q,"Buscar fornecedor…")+'</div><div id="sis-lista"></div>';
  if(adm){$("[data-novo]",m).addEventListener("click",function(){modalParceiro(null);});ligarCopiarLink(m);}
  $("[data-q]",m).addEventListener("input",function(e){fParc.q=e.target.value;vista.atualizar();});
  ligarPil(m,"data-aba",function(v){fParc.aba=v;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){if(adm)modalParceiro(id);else verParceiro(id);});
  vista.atualizar=function(){
    var todos=St.list("parceiros");
    contarPil(m,"data-aba",function(a){return a==="todos"?todos.length:todos.filter(function(p){return abaParc(p)===a;}).length;});
    var l=todos.filter(function(p){return (fParc.aba==="todos"||abaParc(p)===fParc.aba)&&contem(fParc.q,[nomeCat(p.cat)].concat(camposParc(p).map(function(c){return p[c[0]];})));}).sort(function(a,b){return String(nomeParceiro(a.id)).localeCompare(String(nomeParceiro(b.id)));});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Fornecedor / categoria",v:function(p){return esc(nomeParceiro(p.id))+'<small>'+esc(nomeCat(p.cat))+'</small>';}},
      {r:"Responsável",v:function(p){return esc(p.responsavel||"—");},cl:"sec"},
      {r:"Telefone",v:function(p){return esc(p.contato||"—");}},
      {r:"Instagram",v:function(p){return esc(p.instagram||"—");},cl:"sec"},
      {r:"Cidade",v:function(p){return esc([p.cidade,p.uf].filter(Boolean).join("/")||"—");},cl:"sec"}
    ],l,"Nenhum fornecedor nesta categoria.",function(p){return corCat(p.cat);});
  };
  if(!carregando($("#sis-lista",m),vista,"parceiros"))vista.atualizar();
}};

/* ================= TAREFAS ================= */
var COLS_K=[["afazer","A fazer","#7D7A75"],["andamento","Em andamento","#B08A3E"],["concluida","Concluídas","#3E6B48"]];
var fTar={resp:"todos"};
/* Vários responsáveis (pedido da Isys, 2026-11-16): resps = lista de ids ("adm" = Shylton, ou id da Equipe).
   resp continua gravado ("adm" se o Shylton está entre eles; senão o primeiro) para o que já lia um só, como a função agenda.
   respH = sha-256 do e-mail de cada colaborador responsável: é assim que o site reconhece o colaborador logado. */
function respsDe(x){return x&&Array.isArray(x.resps)&&x.resps.length?x.resps.slice():(x&&x.resp?[x.resp]:[]);}
function meuId(){
  if(S.ehAdm())return "adm";
  if(S.Sessao.membroId)return S.Sessao.membroId;
  var h=S.Sessao.h,l=(St.get("time","lista")||{}).membros||[];
  for(var i=0;i<l.length;i++)if(h&&l[i][3]===h)return l[i][0];
  return "";
}
function ehMinha(x){
  if(S.ehAdm())return respsDe(x).indexOf("adm")>=0;
  var eu=meuId(),h=S.Sessao.h,u=S.Sessao.userId;
  return !!((eu&&respsDe(x).indexOf(eu)>=0)||(h&&Array.isArray(x.respH)&&x.respH.indexOf(h)>=0)||(u&&(x.respUser===u||(Array.isArray(x.respUsers)&&x.respUsers.indexOf(u)>=0))));
}
/* Colaborador só vê tarefa, reunião e compromisso de que é responsável (pedido da Isys, 2026-11-16); produções continuam para todos */
/* No Supabase o banco já só entrega ao colaborador o que é dele (colab-responsavel.sql): se o site ainda não o achou em time/lista, confia no banco */
function podeVer(x){return S.ehAdm()||ehMinha(x)||(!!S.Sessao.supa&&!meuId());}
/* Grava resps, resp, respNome, respH e respUsers a partir dos ids marcados */
function gravarResps(corpo,rs){
  var tl=timeLista(),ach=function(r){return tl.filter(function(x){return x[0]===r;})[0];};
  corpo.resps=rs;corpo.resp=rs.indexOf("adm")>=0?"adm":rs[0];
  corpo.respNome=rs.map(function(r){if(r==="adm")return "Shylton";var m=ach(r);return m?m[1]:"";}).filter(Boolean).join(", ");
  corpo.respH=rs.map(function(r){var m=ach(r);return m&&m[3]||"";}).filter(Boolean);
  corpo.respUsers=rs.map(function(r){var m=ach(r);return m&&m[2]||"";}).filter(Boolean);
  delete corpo.respUser;
}
/* Quem pode ser responsável: [id, nome, userId, hash do e-mail]. O colaborador não lê Equipe (dados pessoais),
   então o adm espelha só nomes e hashes em time/lista, que o colaborador lê. */
var hEq={};
function timeLista(){
  var adm=["adm","Shylton (administrador)","",""];
  if(S.ehAdm()&&(St.modo!=="db"||St.carregado.equipe))return [adm].concat(St.list("equipe").filter(function(x){return x.status==="ativo";}).map(function(x){return [x.id,x.nome,x.userId||"",(hEq[x.id]||{}).h||""];}));
  var l=((St.get("time","lista")||{}).membros||[adm]).slice(),eu=meuId();
  if(eu&&!l.some(function(x){return x[0]===eu;}))l.push([eu,S.Sessao.nome||"Eu",S.Sessao.userId||"",S.Sessao.h||""]);
  return l;
}
function hashesEquipe(){
  return Promise.all(St.list("equipe").filter(function(x){return x.status==="ativo"&&x.email;}).map(function(x){
    var e=String(x.email).trim().toLowerCase();if(hEq[x.id]&&hEq[x.id].e===e)return null;
    return S.hashEmail(e).then(function(h){hEq[x.id]={e:e,h:h};});
  }));
}
function syncTime(){
  if(!S.ehAdm()||(St.modo==="db"&&!St.carregado.equipe))return;
  hashesEquipe().then(function(){
    var l=timeLista();if(JSON.stringify(l)===JSON.stringify((St.get("time","lista")||{}).membros))return;
    return St.salvar("time","lista",{membros:l});
  }).catch(function(){});
}
function opcoesResp(){return timeLista().map(function(x){return [x[0],x[1]];});}
function nomeSemPapel(n){return String(n||"").replace(/\s*\(administrador\)$/,"");}
/* ---------- Reunião no Google Meet (pedido da Isys, 2026-11-15) ----------
   Só o adm: ao salvar a tarefa com "Reunião online", abre a janela do Google (conta do Shylton, permissão só
   para eventos da agenda), o site cria o evento com Meet na agenda principal dele e guarda o link na tarefa.
   Mudou título, data ou horário: o evento é atualizado; desmarcou ou excluiu a tarefa: o evento sai do Google.
   ID do cliente OAuth em config/geral.googleClientId (Ajustes › Google Agenda). O acesso fica só na memória (1 h).
   Tarefa com Meet não vai pelo link .ics (supabase/functions/agenda), para não aparecer duas vezes. */
var GIS="https://accounts.google.com/gsi/client",GEV="https://www.googleapis.com/calendar/v3/calendars/primary/events",TZ_G="America/Sao_Paulo";
var gTok=null,gCli=null,gPend=null,gisP=null;
function googleId(){var id=String((St.get("config","geral")||{}).googleClientId||"").trim();return /^[\w-]+\.apps\.googleusercontent\.com$/.test(id)?id:"";}
function carregarGIS(){
  return gisP||(gisP=new Promise(function(ok,erro){var s=document.createElement("script");s.src=GIS;s.async=true;s.onload=ok;s.onerror=function(){gisP=null;erro({code:"google_script"});};document.head.appendChild(s);}));
}
/* Carrega o Google antes do clique em Salvar: a janela do Google só abre direto no clique */
function prepararGoogle(){
  var id=googleId();if(!id||(gCli&&gCli.id===id))return Promise.resolve();
  return carregarGIS().then(function(){
    var o=window.google&&google.accounts&&google.accounts.oauth2;if(!o)throw {code:"google_script"};
    var fim=function(r,bom){var p=gPend;gPend=null;if(!p)return;if(bom&&r&&r.access_token){gTok={t:r.access_token,ate:Date.now()+(Math.max(+r.expires_in||3600,120)-60)*1000};p.ok(gTok.t);}else p.erro({code:"google_negado",det:r});};
    gCli={id:id,c:o.initTokenClient({client_id:id,scope:"https://www.googleapis.com/auth/calendar.events",callback:function(r){fim(r,!r.error);},error_callback:function(e){fim(e,false);}})};
  });
}
function tokenGoogle(){
  if(gTok&&gTok.ate>Date.now())return Promise.resolve(gTok.t);
  if(!gCli)return Promise.reject({code:"google_nao_pronto"});
  return new Promise(function(ok,erro){gPend={ok:ok,erro:erro};gCli.c.requestAccessToken({prompt:""});});
}
function gFetch(tok,met,url,corpo){
  return fetch(url,{method:met,headers:corpo?{Authorization:"Bearer "+tok,"Content-Type":"application/json"}:{Authorization:"Bearer "+tok},body:corpo?JSON.stringify(corpo):undefined}).then(function(r){
    if(r.status===204||(met==="DELETE"&&(r.status===410||r.status===404)))return {}; /* já apagado no Google */
    return r.json().catch(function(){return {};}).then(function(j){if(!r.ok){if(r.status===401)gTok=null;throw {code:"google_"+r.status,det:j&&j.error&&j.error.message};}return j;});
  });
}
function somaHora(h,min){var p=String(h).split(":"),t=(+p[0])*60+(+p[1]||0)+min;return S.pad(Math.floor(t/60)%24)+":"+S.pad(t%60);}
/* Com horário: evento com hora (fim = horário de fim ou 1 h depois). Sem horário: dia inteiro, do início ao prazo.
   Os null limpam o outro formato quando a tarefa ganha ou perde horário; status "confirmed" traz de volta um evento apagado no Google. */
function eventoGoogle(t,reun,comConv){
  var d=t.inicio||t.prazo,ev={summary:t.titulo||(reun?"Reunião":"Tarefa"),description:(t.desc?t.desc+"\n\n":"")+"Tarefa da área restrita · shyltonmavie.com",status:"confirmed"};
  if(t.hora){var hf=t.horaFim||somaHora(t.hora,60),df=hf<=t.hora?S.somaDias(d,1):d;
    ev.start={dateTime:d+"T"+t.hora+":00",timeZone:TZ_G,date:null};ev.end={dateTime:df+"T"+hf+":00",timeZone:TZ_G,date:null};}
  else{var f=t.prazo&&t.prazo>=d?t.prazo:d;ev.start={date:d,dateTime:null,timeZone:null};ev.end={date:S.somaDias(f,1),dateTime:null,timeZone:null};}
  if(comConv)ev.attendees=listaEmails(t.convidados).map(function(m){return {email:m};}); /* só ao criar ou quando a lista muda */
  return ev;
}
function linkMeet(ev){
  var l=ev&&ev.hangoutLink||"";
  if(!l&&ev&&ev.conferenceData&&ev.conferenceData.entryPoints)ev.conferenceData.entryPoints.forEach(function(p){if(!l&&p.entryPointType==="video")l=p.uri||"";});
  return /^https:\/\/meet\.google\.com\/[\w-]+$/.test(l)?l:"";
}
function linkGoogle(u){return /^https:\/\/(www\.)?google\.com\/calendar\//.test(String(u||""))?u:"";}
function pedidoMeet(){return {createRequest:{requestId:"sm"+Date.now().toString(36)+Math.random().toString(36).slice(2,8),conferenceSolutionKey:{type:"hangoutsMeet"}}};}
/* Resposta do Google → campos da tarefa. O link do Meet às vezes chega um instante depois: tenta ler de novo. */
function resultadoTar(tok,ev,reun){
  var fim=function(x){return {meetEvento:x.id||ev.id,meetLink:reun?linkMeet(x):"",meetGoogle:linkGoogle(x.htmlLink||ev.htmlLink),meet:!!reun,gAtrasado:""};};
  if(!reun||linkMeet(ev))return fim(ev);
  return new Promise(function(ok){setTimeout(ok,2000);}).then(function(){return gFetch(tok,"GET",GEV+"/"+encodeURIComponent(ev.id)+"?conferenceDataVersion=1");})
    .then(function(e2){return fim(e2&&e2.id?e2:ev);},function(){return fim(ev);});
}
function msgGoogle(e){
  var c=e&&e.code||"";
  if(c==="google_nao_pronto"||c==="google_script")return "O Google ainda não carregou. Confira a internet e tente salvar de novo.";
  if(c==="google_negado")return "O Google não liberou o acesso à agenda. Entre com a conta do Shylton e permita o acesso.";
  if(c==="google_401"||c==="google_403")return "O Google recusou o acesso à agenda. Salve de novo e entre com a conta do Shylton.";
  return "Não foi possível falar com o Google Agenda. A tarefa não foi salva: tente de novo ou desmarque a reunião online.";
}
var CAMPOS_MEET=["titulo","desc","inicio","prazo","hora","horaFim"];
/* ---------- Tarefas do Shylton direto na agenda dele (pedido da Isys, 2026-11-15) ----------
   Pelo link .ics, mudar a data ou excluir demorava horas para aparecer: o Google só relê o link algumas vezes por dia.
   Agora toda tarefa do Shylton com data (e toda reunião) vira evento na agenda principal dele ao salvar; mudar ou excluir
   aqui atualiza lá na hora. O id do evento fica em meetEvento (nome antigo, de propósito: a função agenda já pula tarefa
   com meetEvento, sem precisar reimplantar). meet:true = evento com Google Meet; tarefa antiga com meetEvento sem "meet" era reunião.
   O que for mudado direto no Google não volta para o site. */
function temMeet(t){return !!t.meetEvento&&t.meet!==false;}
/* Convidados (pedido da Isys, 2026-11-16): tarefa com convidados também vai para a agenda do Shylton; o Google manda o convite */
function vaiProGoogle(t,reun){return !!(reun||((t.resp==="adm"||listaEmails(t.convidados).length)&&(t.inicio||t.prazo)));}
function criarEvento(tok,t,reun){
  var corpo=eventoGoogle(t,reun,true);if(reun)corpo.conferenceData=pedidoMeet();
  return gFetch(tok,"POST",GEV+QAG,corpo).then(function(ev){if(!ev||!ev.id)throw {code:"google_sem_id"};return resultadoTar(tok,ev,reun);});
}
var SEM_EVENTO={meetEvento:"",meetLink:"",meetGoogle:"",meet:"",gAtrasado:""};
/* O que fazer no Google para a tarefa ficar como "novo" (antes = como está gravada). null = nada a fazer.
   Ligar ou desligar o Meet muda o mesmo evento (sem apagar), para os convidados não receberem cancelamento. */
function acaoGoogle(antes,novo,reun){
  var quer=vaiProGoogle(novo,reun),id=antes.meetEvento,enc=encodeURIComponent(id||""),tem=temMeet(antes),
    conv=(novo.convidados||"")!==(antes.convidados||"");
  if(quer&&!id)return function(tok){return criarEvento(tok,novo,reun);};
  if(quer&&(antes.gAtrasado||conv||reun!==tem||CAMPOS_MEET.some(function(k){return (novo[k]||"")!==(antes[k]||"");})))return function(tok){
    var corpo=eventoGoogle(novo,reun,conv||!!antes.gAtrasado);if(reun!==tem)corpo.conferenceData=reun?pedidoMeet():null;
    return gFetch(tok,"PATCH",GEV+"/"+enc+QAG,corpo).then(function(ev){return resultadoTar(tok,ev,reun);},function(e){
      if(e&&(e.code==="google_404"||e.code==="google_410"))return criarEvento(tok,novo,reun); /* sumiu do Google: cria de novo */
      throw e;});
  };
  if(!quer&&id)return function(tok){return gFetch(tok,"DELETE",GEV+"/"+enc+QDEL).then(function(){return SEM_EVENTO;});};
  return null;
}
function aplicarGoogle(corpo,r){Object.keys(r).forEach(function(k){if(r[k]===""||r[k]==null)delete corpo[k];else corpo[k]=r[k];});}
/* Tarefas que ficaram para trás no Google: mudadas por colaborador (gAtrasado) ou do Shylton com data que ainda não foram */
function pendGoogle(){
  var h=S.hoje();
  return St.list("tarefas").filter(function(t){return t.gAtrasado||(!t.meetEvento&&(t.resp==="adm"||listaEmails(t.convidados).length)&&(t.prazo||t.inicio)>=h);});
}
/* ---------- Compromissos e produções do Shylton direto na agenda dele (pedido da Isys, 2026-11-15) ----------
   Mesmo esquema das tarefas: o id do evento fica em gEvento no registro da agenda (a produção usa o registro "prod-<id>").
   gAtrasado = mudou aqui sem conseguir falar com o Google; gApagar = excluído aqui, falta apagar lá (some do calendário já).
   A função agenda (link .ics) pula o que tem gEvento ou gApagar. */
var CAMPOS_AG=["titulo","desc","local","data","dataFim","hora","horaFim","tipo"];
function gOkAdm(){return S.ehAdm()&&!!googleId();}
/* Reunião online e convidados (pedido da Isys, 2026-11-16): o evento sai da agenda do Shylton, com Meet (meet = pedido,
   gMeet = criado no Google, meetLink = link) e convidados (e-mails); o Google manda o convite e avisa mudança e cancelamento. */
function listaEmails(s){return String(s||"").split(/[\s,;]+/).map(function(x){return x.trim().toLowerCase();}).filter(function(x,i,a){return x&&a.indexOf(x)===i;});}
function emailOk(x){return /^[^@\s<>"(),;]+@[^@\s<>"(),;]+\.[a-z]{2,}$/i.test(x);}
function vaiAgenda(e){return !!(e&&e.data&&(e.tipo==="producao"||(e.resp||"adm")==="adm"||e.meet||listaEmails(e.convidados).length));} /* antigo sem responsável: do Shylton */
var QAG="?conferenceDataVersion=1&sendUpdates=all",QDEL="?sendUpdates=all";
/* Com horário: sem fim, dura 2 h (como o link .ics). Sem horário: dia inteiro, do início ao fim.
   comConv: manda a lista de convidados (só ao criar ou quando muda, para não zerar as respostas de quem já aceitou). */
function eventoAgenda(e,comConv){
  var d=e.data,f=e.dataFim&&e.dataFim>=d?e.dataFim:d,
    ev={summary:e.titulo||"Compromisso",location:e.local||"",description:(e.desc?e.desc+"\n\n":"")+(e.tipo==="producao"?"Produção":"Compromisso")+" da área restrita · shyltonmavie.com",status:"confirmed"};
  if(e.hora){var hf=e.horaFim||somaHora(e.hora,120),df=f;if(df===d&&hf<=e.hora)df=S.somaDias(d,1);
    ev.start={dateTime:d+"T"+e.hora+":00",timeZone:TZ_G,date:null};ev.end={dateTime:df+"T"+hf+":00",timeZone:TZ_G,date:null};}
  else{ev.start={date:d,dateTime:null,timeZone:null};ev.end={date:S.somaDias(f,1),dateTime:null,timeZone:null};}
  if(comConv&&e.tipo!=="producao")ev.attendees=listaEmails(e.convidados).map(function(m){return {email:m};});
  return ev;
}
/* Resposta do Google → campos do registro. O link do Meet às vezes chega um instante depois: tenta ler de novo. */
function resultadoAg(tok,ev,m){
  var fim=function(x){return {gEvento:x.id||ev.id,gAtrasado:"",gMeet:m?true:"",meetLink:m?linkMeet(x):""};};
  if(!m||linkMeet(ev))return fim(ev);
  return new Promise(function(ok){setTimeout(ok,2000);}).then(function(){return gFetch(tok,"GET",GEV+"/"+encodeURIComponent(ev.id)+"?conferenceDataVersion=1");})
    .then(function(e2){return fim(e2&&e2.id?e2:ev);},function(){return fim(ev);});
}
function criarEvAg(tok,e){
  var corpo=eventoAgenda(e,true);if(e.meet)corpo.conferenceData=pedidoMeet();
  return gFetch(tok,"POST",GEV+QAG,corpo).then(function(ev){if(!ev||!ev.id)throw {code:"google_sem_id"};return resultadoAg(tok,ev,!!e.meet);});
}
/* O que fazer no Google para o compromisso ficar como "novo" (antes = como está gravado). null = nada a fazer. */
function acaoAgenda(antes,novo){
  var quer=vaiAgenda(novo),id=antes.gEvento,enc=encodeURIComponent(id||""),mq=!!novo.meet,mt=!!antes.gMeet,
    conv=(novo.convidados||"")!==(antes.convidados||"");
  if(quer&&!id)return function(tok){return criarEvAg(tok,novo);};
  if(quer&&(antes.gAtrasado||conv||mq!==mt||CAMPOS_AG.some(function(k){return (novo[k]||"")!==(antes[k]||"");})))return function(tok){
    var corpo=eventoAgenda(novo,conv||!!antes.gAtrasado);if(mq!==mt)corpo.conferenceData=mq?pedidoMeet():null;
    return gFetch(tok,"PATCH",GEV+"/"+enc+QAG,corpo).then(function(ev){return resultadoAg(tok,ev,mq);},function(er){
      if(er&&(er.code==="google_404"||er.code==="google_410"))return criarEvAg(tok,novo); /* sumiu do Google: cria de novo */
      throw er;});
  };
  if(!quer&&id)return function(tok){return gFetch(tok,"DELETE",GEV+"/"+enc+QDEL).then(function(){return {gEvento:"",gAtrasado:"",gMeet:"",meetLink:""};});};
  return null;
}
/* Registro da agenda feito pela produção (null = produção sem data ou cancelada: sai da agenda) */
function agendaProd(id,p){
  if(!p||!p.dataInicio||p.status==="cancelada")return null;
  var nomes=(p.equipe||[]).map(function(i){return (St.get("equipe",i)||{}).nome;}).filter(Boolean);
  if(!nomes.length&&Array.isArray(p.equipeNomes))nomes=p.equipeNomes.filter(Boolean); /* o colaborador não lê Equipe */
  return {titulo:"Produção · "+(p.titulo||""),tipo:"producao",data:p.dataInicio,dataFim:p.dataFim||p.dataInicio,hora:p.hora||"",horaFim:"",local:p.local||"",desc:nomes.length?"Equipe: "+nomes.join(", "):"",producaoId:id,auto:true};
}
/* Salvar a produção vai mexer no Google? (para pedir o acesso ainda no clique) */
function precisaGoogleProd(id,p){
  var ag=id?St.get("agenda","prod-"+id):null,novo=agendaProd(id,p);
  return novo?!!acaoAgenda(ag||{},novo):!!(ag&&ag.gEvento);
}
/* Grava o registro da agenda e acerta o Google com o acesso tokP (pedido no clique). Sem acesso: fica para "Atualizar a agenda do Google". */
function gravarAgenda(id,antes,novo,tokP){
  antes=antes||{};
  if(antes.gEvento)novo.gEvento=antes.gEvento;if(antes.gAtrasado)novo.gAtrasado=true;
  var a=acaoAgenda(antes,novo),salva=function(){return St.salvar("agenda",id,novo);};
  if(!a)return salva();
  if(!tokP){if(novo.gEvento)novo.gAtrasado=true;return salva();}
  return tokP.then(a).then(function(r){aplicarGoogle(novo,r);},function(er){if(window.console)console.error(er);if(novo.gEvento)novo.gAtrasado=true;}).then(salva);
}
/* Exclui o compromisso e o evento no Google. Sem acesso ao Google: some do site já e fica marcado para apagar lá depois. */
function excluirAgenda(id,tokP){
  var e=St.get("agenda",id);if(!e)return Promise.resolve();
  if(!e.gEvento)return St.excluir("agenda",id);
  var marca=function(){var c=St.copia("agenda",id);delete c.id;c.gApagar=true;return St.salvar("agenda",id,c);};
  if(!tokP)return marca();
  return tokP.then(function(tok){return gFetch(tok,"DELETE",GEV+"/"+encodeURIComponent(e.gEvento)+QDEL);}).then(function(){return St.excluir("agenda",id);},function(er){
    if(window.console)console.error(er);return marca().then(function(){S.toast("O evento continua no Google Agenda por enquanto: no Calendário, use “Atualizar a agenda do Google”.");});});
}
function pendAgenda(){
  var h=S.hoje();
  return St.list("agenda").filter(function(e){return e.gAtrasado||e.gApagar||(!e.gEvento&&vaiAgenda(e)&&(e.dataFim||e.data)>=h);});
}
function sincPendentes(){
  var l=pendGoogle(),la=pendAgenda();if(!l.length&&!la.length)return Promise.resolve(0);
  return tokenGoogle().then(function(tok){
    var feitos=0;
    var pt=l.reduce(function(p,t){return p.then(function(){
      var a=acaoGoogle(t,t,temMeet(t));if(!a){if(!t.gAtrasado)return;a=function(){return Promise.resolve({gAtrasado:""});};}
      return a(tok).then(function(r){var c=St.copia("tarefas",t.id);if(!c)return;delete c.id;aplicarGoogle(c,r);feitos++;return St.salvar("tarefas",t.id,c);});
    });},Promise.resolve());
    return la.reduce(function(p,e){return p.then(function(){
      if(e.gApagar)return (e.gEvento?gFetch(tok,"DELETE",GEV+"/"+encodeURIComponent(e.gEvento)+QDEL):Promise.resolve()).then(function(){feitos++;return St.excluir("agenda",e.id);});
      var a=acaoAgenda(e,e);if(!a){if(!e.gAtrasado)return;a=function(){return Promise.resolve({gAtrasado:""});};}
      return a(tok).then(function(r){var c=St.copia("agenda",e.id);if(!c)return;delete c.id;aplicarGoogle(c,r);feitos++;return St.salvar("agenda",e.id,c);});
    });},pt).then(function(){return feitos;});
  });
}
/* Aviso "N itens do Shylton ainda não estão em dia" + botão, nas Tarefas e no Calendário (bx = caixa vazia). Devolve a função que redesenha. */
function avisoGoogleEm(bx){
  var sincando=false,pinta=function(){
    var n=gOkAdm()?pendGoogle().length+pendAgenda().length:0;
    bx.innerHTML=n?'<p class="nota t-meet k-google">'+ik("calendario")+'<span>'+n+(n===1?' item do Shylton ainda não está em dia':' itens do Shylton ainda não estão em dia')+' na agenda do Google.</span><button type="button" class="lnk" data-gsinc>'+ik("trocar")+'Atualizar a agenda do Google</button></p>':'';
  };
  bx.addEventListener("click",function(e){
    if(!e.target.closest("[data-gsinc]")||sincando)return;sincando=true;S.toast("Atualizando a agenda do Google…");
    sincPendentes().then(function(n){sincando=false;S.toast(n?"Agenda do Google atualizada ("+n+").":"A agenda do Google já está em dia.");pinta();},
      function(er){sincando=false;if(window.console)console.error(er);S.toast(msgGoogle(er).replace(/ A tarefa não foi salva.*$/,""));pinta();});
  });
  return pinta;
}
function modalTarefa(id,coluna){
  var adm=S.ehAdm(),t=id?St.copia("tarefas",id):{coluna:coluna||"afazer",resp:meuId(),criadaEm:S.agoraISO()};
  var gOk=adm&&!!googleId();
  if(temMeet(t))t.reuniao=true;
  if(adm)hashesEquipe().catch(function(){}); /* hash do e-mail de cada colaborador, para ele achar a tarefa */
  t.resps=respsDe(t).filter(Boolean);
  var cs=[{k:"titulo",r:"Tarefa",req:1,full:1},{k:"desc",r:"Detalhes",t:"area",full:1},
    {k:"inicio",r:"Início",t:"date"},{k:"prazo",r:"Prazo (fim)",t:"date"},{k:"hora",r:"Horário de início",t:"time"},{k:"horaFim",r:"Horário de fim",t:"time"}];
  /* Link da reunião à mostra e convidados por e-mail, como no Calendário (pedido da Isys, 2026-11-16) */
  var link=temMeet(t)?linkMeet({hangoutLink:t.meetLink}):"";
  if(gOk){t.linkReuniao=link;
    cs.push({k:"reuniao",r:"Reunião online (Google Meet): o link é criado sozinho na agenda do Shylton",t:"check",full:1},
      {k:"linkReuniao",r:"Link da reunião",ro:1,full:1,ph:temMeet(t)?"O link está no evento do Google Agenda":"O link do Meet aparece aqui depois de salvar"},
      {k:"convidados",r:"Convidados (e-mails)",t:"area",full:1,alt:72,ph:"nome@exemplo.com",ajuda:"Um por linha ou separados por vírgula. O Google manda o convite por e-mail e avisa os convidados se mudar a data ou cancelar."});}
  cs.push({k:"resps",r:"Responsáveis",t:"multi",o:opcoesResp(),ajuda:adm?"Marque um ou mais. O colaborador só vê as tarefas de que é responsável.":"Marque um ou mais. Você continua entre eles: a tarefa só aparece para quem é responsável."},{k:"coluna",r:"Coluna",t:"select",o:COLS_K});
  var temData=id&&(t.inicio||t.prazo);
  /* Quem não mexe no Google (colaborador) vê o link para entrar */
  var meet=gOk?(t.meetEvento?'<p class="nota t-meet">'+ik("calendario")+'Na agenda do Shylton no Google: mudar a data ou excluir aqui atualiza lá.</p>':''):
    link?'<p class="nota t-meet">'+ik("video")+'<a class="lnk" target="_blank" rel="noopener" href="'+esc(link)+'">Entrar na reunião (Google Meet) ↗</a></p>':
    temMeet(t)?'<p class="nota t-meet">'+ik("video")+'Reunião no Google Meet marcada na agenda do Shylton.</p>':'';
  /* "Adicionar ao Google Agenda" fazia uma cópia solta no Google (não mudava nem sumia com a tarefa): só para quem não vai sozinho */
  var copia=temData&&!t.meetEvento&&!(gOk&&respsDe(t).indexOf("adm")>=0);
  var nota='<p class="nota" style="margin-top:var(--s-16)">Com data de início ou prazo, a tarefa aparece no Calendário da área restrita, do início ao prazo.'+
    (gOk?' Tarefa do Shylton com data vai direto para a agenda dele no Google (ao salvar, o Google pode pedir para entrar com a conta dele); mudar a data ou excluir aqui atualiza lá. Com <b>Reunião online</b>, informe a data e o horário: a reunião com Meet vai para a agenda dele.':adm?' Para mandar tarefas e reuniões do Google Meet direto para a agenda do Shylton, configure em <a class="lnk" href="#adm/ajustes">Ajustes › Reuniões no Google Meet</a>.':'')+
    (copia?' <a class="lnk" target="_blank" rel="noopener" href="'+esc(gcal(evTarefa(Object.assign({id:id},t))))+'">'+ik("calendario")+'Adicionar ao Google Agenda ↗</a>':'')+'</p>';
  if(gOk)prepararGoogle().catch(function(){});
  var d=S.modalForm({sobre:"Tarefas",titulo:id?"Editar tarefa":"Nova tarefa",campos:cs,dados:t,salvarRot:id?"Salvar":"+ Adicionar",
    depois:meet+nota,
    aoSalvar:function(v){
      var corpo=Object.assign({},t,v);delete corpo.id;delete corpo.linkReuniao;
      if(corpo.coluna==="concluida"){if(t.coluna!=="concluida"||!corpo.concluidaEm)corpo.concluidaEm=S.agoraISO();}else delete corpo.concluidaEm;
      delete corpo.calendario; /* opção antiga: agora toda tarefa com data vai para o calendário */
      if(corpo.inicio&&corpo.prazo&&corpo.prazo<corpo.inicio)corpo.prazo=corpo.inicio;
      var rs=(v.resps||[]).filter(Boolean);
      if(!rs.length){S.toast("Marque pelo menos um responsável.");return false;}
      gravarResps(corpo,rs);
      /* o banco só deixa o colaborador gravar tarefa de que é responsável */
      if(!adm&&meuId()&&!ehMinha(corpo)){S.toast("Você precisa continuar como responsável. Para passar a tarefa só para outra pessoa, peça ao Shylton.");return false;}
      /* nova na coluna, ou trocou de coluna: vai para o fim, se a coluna já tem ordem manual */
      if(!id||corpo.coluna!==t.coluna){var fim=fimDaColuna(corpo.coluna,id);if(fim==null)delete corpo.ordem;else corpo.ordem=fim;}
      /* Google: criar, atualizar ou apagar o evento antes de gravar a tarefa */
      var reun=!!corpo.reuniao,acao=null;delete corpo.reuniao;
      if(gOk){
        if(reun&&(!(corpo.inicio||corpo.prazo)||!corpo.hora)){S.toast("Para a reunião online, informe a data de início e o horário.");return false;}
        var ems=listaEmails(v.convidados),ruins=ems.filter(function(x){return !emailOk(x);});
        if(ruins.length){S.toast("Confira "+(ruins.length===1?"este e-mail":"estes e-mails")+": "+ruins.join(", ")+".");return false;}
        if(ems.length&&!(corpo.inicio||corpo.prazo)){S.toast("Para mandar o convite, informe a data de início.");return false;}
        if(ems.length)corpo.convidados=ems.join(", ");else delete corpo.convidados;
        acao=acaoGoogle(t,corpo,reun);
      }else if(!adm&&t.meetEvento&&(corpo.resp!==t.resp||String(corpo.resps)!==String(respsDe(t))||CAMPOS_MEET.some(function(k){return (corpo[k]||"")!==(t[k]||"");})))
        corpo.gAtrasado=true; /* colaborador mudou tarefa que está no Google: o adm atualiza em Tarefas */
      /* Reunião (criar ou tirar o Meet) sem o Google não salva; tarefa simples salva e o Google é atualizado depois */
      var comMeet=reun||temMeet(t);
      var passo=acao?tokenGoogle().then(acao).then(function(r){
        aplicarGoogle(corpo,r);
        if(r.meet&&!r.meetLink)S.toast("Reunião criada no Google Agenda; o link do Meet aparece lá.");
        return "ok";
      },function(e){
        if(window.console)console.error(e);
        if(comMeet){S.toast(msgGoogle(e));return false;}
        if(t.meetEvento)corpo.gAtrasado=true;
        return "falhou";
      }):Promise.resolve("");
      return passo.then(function(st){
        if(!st&&st!=="")return false;
        return St.salvar("tarefas",id||null,corpo).then(function(nid){
          var novoLink=st==="ok"&&corpo.meetLink&&corpo.meetLink!==(t.meetLink||"");
          S.toast(st==="falhou"?"Tarefa salva, mas o Google Agenda não foi atualizado agora. Em Tarefas, use “Atualizar a agenda do Google”.":
            novoLink?"Reunião criada no Google Agenda. O link está na tarefa.":
            st==="ok"&&reun&&!t.meetEvento?"Tarefa salva e reunião criada no Google Agenda.":st==="ok"?"Tarefa salva e agenda do Google atualizada.":"Tarefa salva.");
          if(novoLink)setTimeout(function(){modalTarefa(nid||id);},400); /* reabre já com o link à mostra */
        });
      });
    },
    aoExcluir:id&&adm?function(){
      var tira=t.meetEvento&&gOk?tokenGoogle().then(function(tok){return gFetch(tok,"DELETE",GEV+"/"+encodeURIComponent(t.meetEvento)+QDEL);}).then(null,function(){S.toast("O evento continua no Google Agenda: apague por lá.");}):Promise.resolve();
      return tira.then(function(){return St.excluir("tarefas",id);});
    }:null});
  var lk=$('[data-k="linkReuniao"]',d);
  if(lk&&link){
    lk.closest("label").insertAdjacentHTML("afterend",'<div class="f--full acoes meet-acoes"><a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(link)+'">'+ik("video")+'Entrar na reunião ↗</a><button type="button" class="btn btn--linha" data-copiar-meet>'+ik("link")+'Copiar link</button></div>');
    $("[data-copiar-meet]",d).addEventListener("click",function(){S.copiar(link);});
  }
}
/* Rodapé do cartão: 12/11 → 15/11 · 09:00; o ícone de calendário aparece quando a tarefa está no calendário */
function quando(t){
  function dm(d){return S.dataBR(d).slice(0,5);}
  if(!t.inicio&&!t.prazo)return 'sem prazo';
  var txt=t.inicio&&t.prazo&&t.inicio!==t.prazo?dm(t.inicio)+" → "+dm(t.prazo):dm(t.prazo||t.inicio);
  if(t.hora)txt+=" · "+t.hora+(t.horaFim?"–"+t.horaFim:"");
  return ik("cal")+esc(txt);
}
function moverTarefa(id,col){var t=St.copia("tarefas",id);if(!t||t.coluna===col)return;var fim=fimDaColuna(col,id);t.coluna=col;if(fim==null)delete t.ordem;else t.ordem=fim;if(col==="concluida")t.concluidaEm=S.agoraISO();else delete t.concluidaEm;delete t.id;St.salvar("tarefas",id,t).catch(S.erroGravar);}
/* Ordem dos cartões (pedido da Isys, 2026-11-15): as setas ↑ ↓ trocam o cartão de lugar na coluna.
   Coluna sem ordem manual segue a data (prazo, início); ao mover um cartão, a coluna toda ganha número (campo ordem)
   e quem chega depois (nova tarefa ou vinda de outra coluna) entra no fim. */
function porOrdemK(a,b){
  var oa=typeof a.ordem==="number",ob=typeof b.ordem==="number";
  if(oa&&ob&&a.ordem!==b.ordem)return a.ordem-b.ordem;
  if(oa!==ob)return oa?-1:1;
  return String(a.prazo||a.inicio||"9999").localeCompare(String(b.prazo||b.inicio||"9999"))||String(a.criadaEm||"").localeCompare(String(b.criadaEm||""));
}
function colunaK(col){return St.list("tarefas").filter(function(t){return !velha(t)&&(t.coluna||"afazer")===col;}).sort(porOrdemK);}
function fimDaColuna(col,semId){var l=colunaK(col).filter(function(t){return t.id!==semId&&typeof t.ordem==="number";});return l.length?l[l.length-1].ordem+1:null;}
/* Põe o cartão no lugar do vizinho visível (o de cima ou o de baixo) e renumera a coluna inteira, filtrada ou não */
function reordenarTarefa(id,vizId){
  var t=St.get("tarefas",id);if(!t)return;
  var l=colunaK(t.coluna||"afazer"),ids=l.map(function(x){return x.id;}),i=ids.indexOf(id),j=ids.indexOf(vizId);
  if(i<0||j<0||i===j)return;
  l.splice(j,0,l.splice(i,1)[0]);
  Promise.all(l.map(function(x,k){
    if(x.ordem===k)return null;
    var c=St.copia("tarefas",x.id);delete c.id;c.ordem=k;return St.salvar("tarefas",x.id,c);
  })).catch(S.erroGravar);
}
/* Soltar o cartão arrastado antes de outro (antesId) ou no fim da coluna col; renumera a coluna de destino (pedido da Isys, 2026-11-16) */
function soltarTarefa(id,col,antesId){
  var t=St.get("tarefas",id);if(!t)return;
  var de=t.coluna||"afazer",l=colunaK(col).filter(function(x){return x.id!==id;}),ids=l.map(function(x){return x.id;});
  var j=antesId?ids.indexOf(antesId):-1;if(j<0)j=l.length;
  if(de===col&&colunaK(col).map(function(x){return x.id;}).indexOf(id)===j)return; /* voltou para o mesmo lugar */
  l.splice(j,0,Object.assign({},t,{id:id}));
  Promise.all(l.map(function(x,k){
    var mov=x.id===id;
    if(x.ordem===k&&!(mov&&de!==col))return null;
    var c=St.copia("tarefas",x.id);if(!c)return null;delete c.id;c.ordem=k;
    if(mov&&de!==col){c.coluna=col;if(col==="concluida")c.concluidaEm=S.agoraISO();else delete c.concluidaEm;}
    return St.salvar("tarefas",x.id,c);
  })).catch(S.erroGravar);
}
/* Arrastar cartões com mouse ou dedo: solta entre outros cartões para mudar a ordem, ou em outra coluna.
   No toque, segura o cartão um instante para pegar (assim a rolagem da página continua normal). */
var arK=null,arKSoltou=false;
function fimArrasto(){
  if(!arK)return;var a=arK;arK=null;
  if(a.timer)clearTimeout(a.timer);if(a.fant)a.fant.remove();if(a.marca)a.marca.remove();
  a.card.classList.remove("arrastando");$$(".kcol").forEach(function(k){k.classList.remove("sobre");});
  return a;
}
function moverArrasto(x,y){
  var a=arK;a.fant.style.transform="translate("+(x-a.dx)+"px,"+(y-a.dy)+"px)";
  var el=document.elementFromPoint(x,y),k=el&&el.closest(".kcol");
  if(k&&!a.caixa.contains(k))k=null;
  $$(".kcol",a.caixa).forEach(function(c){c.classList.toggle("sobre",c===k);});
  a.col=k?k.getAttribute("data-col"):null;
  if(!k){a.marca.remove();return;}
  var cs=$$(".kcard",k).filter(function(c){return c!==a.card;}),antes=null;
  for(var i=0;i<cs.length;i++){var r=cs[i].getBoundingClientRect();if(y<r.top+r.height/2){antes=cs[i];break;}}
  a.antes=antes?antes.getAttribute("data-tarefa"):"";
  k.insertBefore(a.marca,antes||$(".k-nova",k));
  if(y<64)window.scrollBy(0,-14);else if(y>window.innerHeight-64)window.scrollBy(0,14);
}
function comecarArrasto(){
  var a=arK,r=a.card.getBoundingClientRect(),f=a.card.cloneNode(true);
  a.ativo=true;a.dx=a.x0-r.left;a.dy=a.y0-r.top;
  f.classList.add("kcard--fantasma");f.setAttribute("aria-hidden","true");f.style.width=r.width+"px";
  f.style.setProperty("--c",getComputedStyle(a.card).getPropertyValue("--c"));
  document.body.appendChild(f);a.fant=f;a.card.classList.add("arrastando");
  a.marca=document.createElement("div");a.marca.className="k-marca";
  if(a.toque&&navigator.vibrate)try{navigator.vibrate(12);}catch(e){}
  moverArrasto(a.x0,a.y0);
}
document.addEventListener("pointermove",function(e){
  var a=arK;if(!a||e.pointerId!==a.pid)return;
  if(!a.ativo){var d=Math.abs(e.clientX-a.x0)+Math.abs(e.clientY-a.y0);
    if(a.toque){if(d>10)fimArrasto();return;} /* dedo andou antes de segurar: é rolagem */
    if(d<6)return;comecarArrasto();}
  e.preventDefault();moverArrasto(e.clientX,e.clientY);
});
document.addEventListener("pointerup",function(e){
  if(!arK||e.pointerId!==arK.pid)return;
  var ativo=arK.ativo,a=fimArrasto();
  if(ativo){arKSoltou=true;setTimeout(function(){arKSoltou=false;},0);if(a.col)soltarTarefa(a.id,a.col,a.antes);}
});
document.addEventListener("pointercancel",function(e){if(arK&&e.pointerId===arK.pid)fimArrasto();});
document.addEventListener("touchmove",function(e){if(arK&&arK.ativo)e.preventDefault();},{passive:false});
function ligarArrasto(caixa){
  caixa.addEventListener("pointerdown",function(e){
    if(e.button>0||arK)return;var c=e.target.closest("[data-tarefa]");if(!c||e.target.closest("button,a"))return;
    arK={caixa:caixa,card:c,id:c.getAttribute("data-tarefa"),x0:e.clientX,y0:e.clientY,pid:e.pointerId,toque:e.pointerType!=="mouse",ativo:false};
    if(arK.toque)arK.timer=setTimeout(function(){if(arK&&!arK.ativo)comecarArrasto();},350);
  });
  caixa.addEventListener("click",function(e){if(arKSoltou){e.stopPropagation();e.preventDefault();}},true); /* soltar não abre o cartão */
  caixa.addEventListener("contextmenu",function(e){if(arK&&arK.toque)e.preventDefault();});
}
/* Concluídas há 40 dias ou mais são apagadas ao abrir Tarefas. Concluídas antigas sem data começam a contar agora. */
var DIAS_CONCLUIDA=40,apagando={};
function limparConcluidas(){
  var lim=S.somaDias(S.hoje(),-DIAS_CONCLUIDA);
  St.list("tarefas").forEach(function(t){
    if(t.coluna!=="concluida"||apagando[t.id])return;
    apagando[t.id]=1;var fim=function(){delete apagando[t.id];};
    if(!t.concluidaEm){var c=St.copia("tarefas",t.id);delete c.id;c.concluidaEm=S.agoraISO();St.salvar("tarefas",t.id,c).then(fim,fim);}
    else if(String(t.concluidaEm).slice(0,10)<=lim)St.excluir("tarefas",t.id).then(fim,fim);
    else fim();
  });
}
function velha(t){return t.coluna==="concluida"&&t.concluidaEm&&String(t.concluidaEm).slice(0,10)<=S.somaDias(S.hoje(),-DIAS_CONCLUIDA);}
M.tarefas={render:function(m,id,vista){
  var adm=S.ehAdm();
  syncTime();
  var eu=meuId();
  var opts=[["todos","Todas"],["minhas","Minhas"]].concat(timeLista().filter(function(x){return x[0]!==eu;}).map(function(x){return [x[0],x[1]];}));
  if(!adm)fTar.resp="minhas"; /* colaborador só vê as tarefas de que é responsável (pedido da Isys, 2026-11-16) */
  else if(!opts.some(function(o){return o[0]===fTar.resp;}))fTar.resp="todos";
  m.innerHTML=cab("Tarefas",adm?"Para você e para a equipe. Uma tarefa pode ter vários responsáveis; o colaborador só vê as dele. Use o filtro para ver as suas, as de um colaborador ou as de toda a equipe; arraste os cartões para mudar a ordem ou a coluna (no celular, segure o cartão um instante) ou use as setas. Concluídas há 40 dias são apagadas sozinhas.":"Suas tarefas: aparecem só as de que você é responsável. Arraste os cartões para mudar a ordem ou a coluna (no celular, segure o cartão um instante) ou use as setas. Concluídas há 40 dias são apagadas sozinhas.",'<button type="button" class="btn btn--escuro" data-nova>'+ik("mais")+'Nova tarefa</button>')+
    '<div class="k-filtro">'+(adm?'<label class="f">Mostrar tarefas de'+selectHTML("data-resp",opts,fTar.resp)+'</label>':'')+'<p class="k-filtro__n" id="k-total"></p></div><div id="k-google"></div><div id="sis-lista"></div>';
  $("[data-nova]",m).addEventListener("click",function(){modalTarefa(null);});
  /* Aviso do adm: tarefas que ainda não estão (ou não estão em dia) na agenda do Shylton no Google */
  var gOk=adm&&!!googleId();if(gOk)prepararGoogle().catch(function(){});
  var avisoGoogle=avisoGoogleEm($("#k-google",m));
  var fr=$("[data-resp]",m);if(fr)fr.addEventListener("change",function(e){fTar.resp=e.target.value;vista.atualizar();});
  var caixa=$("#sis-lista",m);
  caixa.addEventListener("click",function(e){
    if(e.target.closest("a"))return; /* link do Meet no cartão */
    var mv=e.target.closest("[data-mover]");if(mv){moverTarefa(mv.getAttribute("data-id"),mv.getAttribute("data-mover"));return;}
    var od=e.target.closest("[data-ordem]");if(od){reordenarTarefa(od.getAttribute("data-id"),od.getAttribute("data-ordem"));return;}
    var nv=e.target.closest("[data-nova-col]");if(nv){modalTarefa(null,nv.getAttribute("data-nova-col"));return;}
    var c=e.target.closest("[data-tarefa]");if(c)modalTarefa(c.getAttribute("data-tarefa"));
  });
  ligarArrasto(caixa);
  vista.atualizar=function(){
    var h=S.hoje();
    limparConcluidas();avisoGoogle();
    var l=St.list("tarefas").filter(function(t){return !velha(t)&&podeVer(t)&&(fTar.resp==="todos"||(fTar.resp==="minhas"?ehMinha(t):respsDe(t).indexOf(fTar.resp)>=0));});
    $("#k-total",m).innerHTML='<b>'+l.length+'</b> '+(l.length===1?"cartão":"cartões");
    caixa.innerHTML='<div class="kanban">'+COLS_K.map(function(c,ci){
      var ts=l.filter(function(t){return (t.coluna||"afazer")===c[0];}).sort(porOrdemK);
      return '<section class="kcol'+(c[0]==="concluida"?" kcol--feita":"")+'" data-col="'+c[0]+'" style="--c:'+c[2]+'"><h2><i aria-hidden="true"></i>'+c[1]+'<span>'+ts.length+'</span></h2>'+
        ts.map(function(t,ti){
          var atras=t.prazo&&t.prazo<h&&c[0]!=="concluida",resp=t.respNome||(t.resp==="adm"?"Shylton":""),nomes=resp?resp.split(", "):[];
          return '<article class="kcard" data-tarefa="'+esc(t.id)+'">'+(nomes.length?'<span class="kcard__avs">'+nomes.slice(0,3).map(function(n){return '<span class="av av--p" title="'+esc(n)+'">'+esc(iniciais(n))+'</span>';}).join("")+'</span>':'')+'<h3>'+esc(t.titulo)+'</h3>'+(t.desc?'<p>'+esc(String(t.desc).slice(0,120))+'</p>':'')+
            (resp?'<p class="kcard__resp">'+esc(resp)+'</p>':'')+
            '<div class="kcard__pe"><span class="kcard__data'+(atras?" atrasada":"")+'"'+(t.inicio||t.prazo?' title="Aparece no calendário"':'')+'>'+quando(t)+'</span><span class="kcard__mov">'+
            (ti>0?'<button type="button" data-ordem="'+esc(ts[ti-1].id)+'" data-id="'+esc(t.id)+'" aria-label="Subir o cartão" title="Subir">'+ik("acima")+'</button>':'')+
            (ti<ts.length-1?'<button type="button" data-ordem="'+esc(ts[ti+1].id)+'" data-id="'+esc(t.id)+'" aria-label="Descer o cartão" title="Descer">'+ik("abaixo")+'</button>':'')+
            (ci>0?'<button type="button" data-mover="'+COLS_K[ci-1][0]+'" data-id="'+esc(t.id)+'" aria-label="Mover para '+COLS_K[ci-1][1]+'">'+ik("anterior")+'</button>':'')+
            (ci<2?'<button type="button" data-mover="'+COLS_K[ci+1][0]+'" data-id="'+esc(t.id)+'" aria-label="Mover para '+COLS_K[ci+1][1]+'">'+ik("proximo")+'</button>':'')+'</span></div></article>';
        }).join("")+'<button type="button" class="k-nova" data-nova-col="'+c[0]+'">'+ik("mais")+'Tarefa</button></section>';
    }).join("")+'</div>';
  };
  if(!carregando(caixa,vista,"tarefas"))vista.atualizar();
}};

/* ================= EQUIPE ================= */
function modalMembro(id){
  var x=id?St.copia("equipe",id):{status:"ativo",membro:"nao",acesso:"colaborador"};
  if(!x.membro)x.membro="nao";
  /* colaborador não vira administrador: só quem já é adm mantém a opção */
  var eraAdm=!!id&&x.acesso==="adm";
  if(!eraAdm)x.acesso="colaborador";
  var antes=id?St.copia("equipe",id):null;
  function gravar(corpo){
    if(corpo.membro==="sim"&&!corpo.email)return Promise.reject({code:"sem_email"});
    /* acesso primeiro: e-mail de cliente com área liberada é recusado antes de gravar (cliente nunca vira equipe) */
    return S.sincAcesso(antes,corpo).then(function(){return St.salvar("equipe",id||null,corpo);});
  }
  function ehCliente(e){return !!e&&(e.code==="email_cliente"||/email_de_cliente/.test(String(e.message||"")));}
  function ehAdm(e){return !!e&&(e.code==="adm_so_banco"||/adm_so_pelo_banco/.test(String(e.message||"")));}
  function falhou(e){
    if(e&&e.code==="sem_email")S.toast("Para ser membro, preencha o e-mail: é com ele que a pessoa entra.");
    else if(ehAdm(e))S.toast("Colaborador não vira administrador pela área restrita. Administrador novo só é criado direto no banco de dados.");
    else if(ehCliente(e))S.toast("Este e-mail é de um cliente com a área do cliente liberada. Cliente não entra na área da equipe: use outro e-mail.");
    else S.erroGravar(e);
  }
  var d=S.modalForm({sobre:"Equipe",titulo:id?x.nome:"Novo membro",dados:x,salvarRot:id?"Salvar":"+ Adicionar",
    campos:[{k:"nome",r:"Nome",req:1},{k:"funcao",r:"Função"},{k:"email",r:"E-mail",t:"email",ajuda:"É com este e-mail que o membro entra na área restrita."},{k:"telefone",r:"Telefone / WhatsApp",t:"tel"},{k:"cidade",r:"Cidade"},{k:"pix",r:"Chave PIX"},
      {k:"membro",r:"Membro",t:"select",o:[["nao","Não: sem acesso à área restrita"],["sim","Sim: liberar acesso à área restrita"]]},
      {k:"acesso",r:"Acesso do membro",t:"select",o:eraAdm?[["adm","Administrador: acesso completo"],["colaborador","Colaborador: Produções e Parceiros (só ver), Tarefas e Calendário"]]:[["colaborador","Colaborador: Produções e Parceiros (só ver), Tarefas e Calendário"]],
        ajuda:eraAdm?"Vale só quando Membro é Sim. Se mudar para Colaborador, só volta a ser administrador direto no banco de dados.":"Vale só quando Membro é Sim. Colaborador não vira administrador: administrador novo só é criado direto no banco de dados."},
      {k:"status",r:"Situação",t:"select",o:S.opcoes("equipe"),ajuda:"Bloqueado tira o acesso, mesmo sendo membro."},{k:"obs",r:"Observações",t:"area",full:1}],
    antes:id&&(x.status==="pendente"||x.membro!=="sim")&&x.status!=="bloqueado"?'<div class="item" style="margin-bottom:var(--s-16)"><b>'+(x.status==="pendente"?"Cadastro aguardando liberação":"Sem acesso à área restrita")+'</b><div class="acoes"><button type="button" class="btn btn--escuro" data-liberar>'+ik("ok")+'Tornar membro e liberar acesso</button></div></div>':'',
    aoSalvar:function(v){var corpo=Object.assign({},x,v);delete corpo.id;if(!id)corpo.criadoEm=S.agoraISO();return gravar(corpo).then(function(){S.toast(S.membroLiberado(corpo)?"Membro salvo, com acesso liberado.":"Membro salvo, sem acesso.");},function(e){if(e&&(e.code==="sem_email"||ehCliente(e)||ehAdm(e))){falhou(e);var c=$('[data-k="email"]',d);if(c){c.setAttribute("aria-invalid","true");c.focus();}return false;}throw e;});},
    aoExcluir:id?function(){return St.excluir("equipe",id).then(function(){return S.sincAcesso(antes,null);});}:null});
  var lb=$("[data-liberar]",d);
  if(lb)lb.addEventListener("click",function(){var c=Object.assign({},x,{status:"ativo",membro:"sim"});delete c.id;gravar(c).then(function(){S.fecharModal();S.toast(x.nome+" agora é membro, com acesso liberado.");},falhou);});
}
M.equipe={render:function(m,id,vista){
  m.innerHTML=cab("Equipe","Só quem é membro entra na área restrita. Marque <b>Membro: Sim</b> e o membro entra como colaborador: vê Tarefas e Calendário, e consulta Produções e Parceiros (sem valores nem RT). Colaborador não vira administrador por aqui. Toque num membro para editar os dados.",'<button type="button" class="btn btn--escuro" data-novo>'+ik("mais")+'Novo membro</button>')+
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
/* Google Agenda: link secreto do feed .ics (função "agenda" no Supabase, ver supabase/functions/agenda).
   A chave fica em config/geral, que só o administrador lê; trocar a chave desliga o link antigo. */
var FEED_AGENDA="https://emzhlblfqkzsjgxfszmy.supabase.co/functions/v1/agenda";
function novaChave(){var b=new Uint8Array(24);window.crypto.getRandomValues(b);return Array.prototype.map.call(b,function(x){return ("0"+x.toString(16)).slice(-2);}).join("");}
function desenharGcal(sec){
  var k=(St.get("config","geral")||{}).agendaChave||"",url=k?FEED_AGENDA+"?chave="+k:"";
  sec.innerHTML='<h2>'+ik("calendario")+'Google Agenda<small>Entram sozinhos na agenda do Shylton só os itens em que ele é o responsável: compromissos, produções e tarefas com data. Só ida: o que mudar no Google não volta para cá.</small></h2>'+
    (k?'<div><div class="fgrid"><label class="f f--full">Link da agenda<input type="text" readonly value="'+esc(url)+'" data-gcal-url></label></div>'+
      '<div class="acoes" style="margin-top:var(--s-16)"><button type="button" class="btn btn--escuro" data-gcal-copiar>'+ik("link")+'Copiar link</button><button type="button" class="lnk lnk--perigo" data-gcal-trocar>'+ik("trocar")+'Trocar link</button></div>'+
      '<p class="nota" style="margin-top:var(--s-12)">No Google Agenda pelo computador: Outras agendas › + › Do URL › cole o link › Adicionar agenda. Faça isso entrando com o e-mail do Shylton. O Google atualiza sozinho, em geral algumas vezes por dia (pode levar até 24 h). Não passe o link adiante: quem tem o link vê a agenda. Se vazar, use Trocar link.</p></div>'
    :'<div class="acoes"><button type="button" class="btn btn--escuro" data-gcal-gerar>'+ik("link")+'Gerar link da agenda</button></div>');
  function gravar(){
    var atual=St.copia("config","geral")||{};delete atual.id;atual.agendaChave=novaChave();
    return St.salvar("config","geral",atual).then(function(){desenharGcal(sec);S.toast("Link da agenda pronto. Copie e cole no Google Agenda.");},S.erroGravar);
  }
  var g=$("[data-gcal-gerar]",sec);if(g)g.addEventListener("click",gravar);
  var t=$("[data-gcal-trocar]",sec);if(t)t.addEventListener("click",function(){S.confirmar({sobre:"Google Agenda",ico:"trocar",icoOk:"trocar",titulo:"Trocar o link?",texto:"O link antigo para de funcionar e a agenda precisa ser adicionada de novo no Google.",ok:"Trocar link"}).then(function(sim){if(sim)gravar();});});
  var c=$("[data-gcal-copiar]",sec);if(c)c.addEventListener("click",function(){
    var inp=$("[data-gcal-url]",sec),ok=function(){S.toast("Link copiado.");};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(inp.value).then(ok,function(){inp.select();});
    else{inp.select();try{document.execCommand("copy");ok();}catch(e){}}
  });
}
/* Google Meet nas tarefas: ID do cliente OAuth (público, não é senha), criado no Google Cloud */
function desenharGmeet(sec){
  sec.innerHTML='<h2>'+ik("video")+'Reuniões no Google Meet<small>Com o ID preenchido, a tarefa ganha a opção Reunião online: ao salvar, o Google pede para entrar com a conta do Shylton e cria a reunião com Meet direto na agenda dele.</small></h2>'+
    '<div><div class="fgrid"><label class="f f--full">ID do cliente Google (OAuth)<input type="text" data-gmeet-id spellcheck="false" autocomplete="off" placeholder="000000000000-xxxxxxxx.apps.googleusercontent.com" value="'+esc((St.get("config","geral")||{}).googleClientId||"")+'"></label></div>'+
    '<div class="acoes" style="margin-top:var(--s-16)"><button type="button" class="btn btn--escuro" data-gmeet-salvar>'+ik("salvar")+'Salvar ID</button></div></div>';
  $("[data-gmeet-salvar]",sec).addEventListener("click",function(){
    var v=String($("[data-gmeet-id]",sec).value).trim();
    if(v&&!/^[\w-]+\.apps\.googleusercontent\.com$/.test(v)){S.toast("Confira o ID: ele termina em .apps.googleusercontent.com");return;}
    var atual=St.copia("config","geral")||{};delete atual.id;atual.googleClientId=v;
    St.salvar("config","geral",atual).then(function(){S.toast(v?"ID do Google salvo. Já dá para criar reuniões nas tarefas.":"ID do Google apagado.");},S.erroGravar);
  });
}
M.ajustes={render:function(m,id,vista){
  if(carregando(m,vista,"config"))return;
  vista.vivo=false;
  var c=S.cfg();
  m.innerHTML=cab("Ajustes","Tabela da calculadora, seus dados no contrato e textos padrão.",'<button type="button" class="btn btn--escuro" data-salvar>'+ik("salvar")+'Salvar ajustes</button>')+
  '<div id="aj-form">'+
  '<section class="sis-sec"><h2>'+ik("calc")+'Calculadora<small>Usada nos pedidos do site e nas propostas novas. Proposta antiga não muda sozinha.</small></h2><div class="fgrid">'+S.campos([
    {k:"calc.base",r:"1º ambiente (R$)",t:"money"},{k:"calc.adicional",r:"Cada ambiente a mais (R$)",t:"money"},
    {k:"calc.m2Base",r:"Metragem incluída por ambiente (m²)",t:"number"},{k:"calc.m2Extra",r:"Cada m² acima disso (R$)",t:"money"},
    {k:"calc.fatorFoto",r:"Acréscimo: fotografia (%)",t:"pct"},{k:"calc.fatorMostra",r:"Acréscimo: mostras (%)",t:"pct"},
    {k:"calc.fatorMarcas",r:"Acréscimo: marcas e lojas (%)",t:"pct"},{k:"calc.fatorCliente",r:"Acréscimo: área privativa ou áreas comuns (%)",t:"pct"},{k:"calc.semProjeto",r:"Acréscimo sem projeto ou SketchUp (%)",t:"pct"},
    {k:"calc.urgDias",r:"Urgência: data em menos de (dias)",t:"number"},{k:"calc.urgPerc",r:"Acréscimo de urgência (%)",t:"pct"},
    {k:"calc.deslocamento",r:"Deslocamento fora das cidades-base (R$)",t:"money"},{k:"calc.cidadesBase",r:"Cidades-base (separadas por vírgula)"},
    {k:"calc.arredondar",r:"Arredondar para cima, de (R$)",t:"money"},{k:"calc.diasMin",r:"Prazo mínimo (dias)",t:"number"},
    {k:"calc.diasPorAmbiente",r:"Dias por ambiente",t:"number"},{k:"calc.ambPorAjudante",r:"Ambientes por ajudante",t:"number"}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>'+ik("aviso")+'Avisos e links</h2><div class="fgrid">'+S.campos([
    {k:"whatsappAdm",r:"WhatsApp que recebe os pedidos",t:"tel"},{k:"siteUrl",r:"Endereço do site",ajuda:"Usado nos links de cadastro. Troque pelo domínio quando o site for publicado."}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>'+ik("clientes")+'Seus dados no contrato<small>Ficam guardados só para o administrador.</small></h2><div class="fgrid">'+S.campos([
    {k:"contratado.nome",r:"Nome completo"},{k:"contratado.marca",r:"Marca"},{k:"contratado.nacionalidade",r:"Nacionalidade"},{k:"contratado.profissao",r:"Profissão"},
    {k:"contratado.cpf",r:"CPF"},{k:"contratado.cnpj",r:"CNPJ"},{k:"contratado.razao",r:"Razão social da empresa",full:1,ajuda:"Usada quando o contrato for em nome da empresa."},{k:"contratado.cau",r:"Registro CAU"},{k:"contratado.pix",r:"Chave PIX"},
    {k:"contratado.endereco",r:"Endereço profissional",full:1},
    {k:"contratado.email",r:"E-mail",t:"email"},{k:"contratado.telefone",r:"Telefone"},{k:"contratado.instagram",r:"Instagram"},{k:"contratado.cidade",r:"Cidade (proposta)"}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>'+ik("contratos")+'Padrões do contrato</h2><div class="fgrid">'+S.campos([
    {k:"contrato.sinal",r:"Sinal (%)",t:"pct"},{k:"contrato.limiteDespesa",r:"Despesa sem aprovação escrita até (R$)",t:"money"},
    {k:"contrato.diaria",r:"Dia extra de trabalho (R$)",t:"money"},{k:"contrato.prazoConceito",r:"Entrega do conceito (dias)",t:"number"},
    {k:"contrato.prazoAprovacao",r:"Prazo para aprovar (dias)",t:"number"},{k:"contrato.revisoes",r:"Rodadas de ajuste",t:"number"},
    {k:"contrato.diasCancel",r:"Antecedência para cancelar (dias)",t:"number"},{k:"contrato.retencao",r:"Retenção no cancelamento (%)",t:"pct"},
    {k:"contrato.retencaoMax",r:"Retenção máxima (%)",t:"pct"},{k:"contrato.prazoFotos",r:"Prazo para enviar fotos (dias)",t:"number"},
    {k:"contrato.multaFotos",r:"Multa se não enviar fotos (%)",t:"pct"},{k:"contrato.foro",r:"Foro"},{k:"contrato.cidade",r:"Cidade da assinatura"}],c)+'</div></section>'+
  '<section class="sis-sec"><h2>'+ik("texto")+'Textos padrão da proposta</h2><div class="fgrid">'+S.campos([
    {k:"proposta.pagamento",r:"Forma de pagamento"},{k:"proposta.etapas",r:"Etapas"},
    {k:"proposta.exclusoes",r:"Exclusões",t:"area",full:1},{k:"proposta.observacoes",r:"Observações (uma por linha)",t:"area",full:1,alt:120},
    {k:"proposta.creditos",r:"Observação em destaque (vermelho)",full:1}],c)+'</div></section>'+
  /* Modelo do checklist recolhido (pedido da Isys, 2026-11-15): é o padrão inicial de toda produção nova; em cada produção ainda dá para incluir e tirar itens */
  '<section class="sis-sec"><h2>'+ik("ok")+'Checklist das produções<small>Modelo padrão: entra em toda produção nova. Em cada produção dá para incluir ou tirar itens; produção já criada não muda quando o modelo muda.</small></h2>'+
    '<div><p class="nota" data-chk-resumo>'+esc(resumoChk(c.checklist))+'</p><button type="button" class="lnk" data-abrir-modelo aria-expanded="false" aria-controls="aj-chk">'+ik("abaixo")+'<span>Ver e editar o modelo</span></button>'+
    '<div id="aj-chk" hidden><div class="fgrid" style="margin-top:var(--s-16)"><p class="nota f--full">Um item por linha.</p>'+S.campos(
    ETAPAS_CHK.map(function(e){return {k:"checklist."+e[0],r:e[1],t:"area",full:1,alt:110};}),c)+'</div></div></div></section>'+
  '</div>'+
  '<section class="sis-sec" id="aj-gcal"></section>'+
  '<section class="sis-sec" id="aj-gmeet"></section>'+
  '<section class="sis-sec"><h2>'+ik("saida")+'Dados</h2><div class="acoes"><button type="button" class="lnk" data-backup>'+ik("baixar")+'Baixar cópia de todos os dados (JSON)</button>'+(St.modo==="local"?'<button type="button" class="lnk lnk--perigo" data-limpar>'+ik("excluir")+'Apagar dados da demonstração</button>':'')+'</div></section>';
  $("[data-salvar]",m).addEventListener("click",function(){
    var v=S.lerCampos($("#aj-form",m)),atual=St.copia("config","geral")||{};delete atual.id;
    ["calc","contratado","contrato","proposta","checklist"].forEach(function(k){atual[k]=Object.assign({},atual[k]||{},v[k]||{});});
    atual.whatsappAdm=v.whatsappAdm;atual.siteUrl=v.siteUrl;
    St.salvar("config","geral",atual).then(function(){S.toast("Ajustes salvos.");},S.erroGravar);
  });
  $("[data-abrir-modelo]",m).addEventListener("click",function(){
    var b=this,ab=b.getAttribute("aria-expanded")!=="true";b.setAttribute("aria-expanded",String(ab));$("#aj-chk",m).hidden=!ab;
    b.innerHTML=ik(ab?"acima":"abaixo")+'<span>'+(ab?"Recolher o modelo":"Ver e editar o modelo")+'</span>';
  });
  $("#aj-chk",m).addEventListener("input",function(){var v=S.lerCampos($("#aj-chk",m));$("[data-chk-resumo]",m).textContent=resumoChk(v.checklist);});
  desenharGcal($("#aj-gcal",m));desenharGmeet($("#aj-gmeet",m));
  $("[data-backup]",m).addEventListener("click",function(){var o={};["propostas","clientes","contratos","producoes","financeiro","parceiros","tarefas","agenda","equipe","avisos","config","orcamentos"].forEach(function(k){o[k]=St.list(k);});S.salvarArquivo("backup-area-restrita-"+S.hoje()+".json",JSON.stringify(o,null,2));});
  var lp=$("[data-limpar]",m);if(lp)lp.addEventListener("click",function(){S.confirmar({titulo:"Apagar todos os dados da demonstração?",texto:"Apaga tudo o que está salvo neste navegador. Essa ação não pode ser desfeita.",ok:"Apagar dados"}).then(function(sim){if(!sim)return;St.dados={};St.gravar();S.toast("Dados apagados.");S.render();});});
}};
})();
