/* Área restrita · módulos: início, propostas, produções, financeiro, contratos, clientes, calendário, parceiros, tarefas, equipe, ajustes */
(function(){
"use strict";
var S=window.SIS,M=S.mod,St=S.Store,esc=S.esc,num=S.num,brl=S.brl,$=S.$,$$=S.$$;

/* ---------- peças comuns ---------- */
function cab(t,sub,dir,voltar){
  return '<div class="sis-cab"><div>'+(voltar?'<a class="lnk" href="'+voltar[0]+'">← '+esc(voltar[1])+'</a>':'')+'<h1>'+esc(t)+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div><div class="sis-ferr">'+(dir||'')+'</div></div>';
}
function filtros(lista,ativo,attr){return '<div class="sis-filtros">'+lista.map(function(f){return '<button type="button" '+attr+'="'+esc(f[0])+'" aria-pressed="'+(String(f[0])===String(ativo)?"true":"false")+'">'+esc(f[1])+'</button>';}).join("")+'</div>';}
function busca(v){return '<label class="sis-busca">Buscar <input type="search" data-q value="'+esc(v||"")+'" placeholder="nome, número, cidade…"></label>';}
function tabela(cols,linhas,vazio){
  if(!linhas.length)return '<p class="vazio-sis">'+esc(vazio)+'</p>';
  return '<table class="tab"><thead><tr>'+cols.map(function(c){return '<th class="'+(c.cl||"")+'">'+esc(c.r)+'</th>';}).join("")+'</tr></thead><tbody>'+
    linhas.map(function(l){return '<tr data-id="'+esc(l.id)+'">'+cols.map(function(c,i){var v=c.v(l);return '<td class="'+(c.cl||"")+'" data-r="'+esc(c.r)+'">'+(i===0?'<button type="button" class="tab__abrir">'+v+'</button>':v)+'</td>';}).join("")+'</tr>';}).join("")+'</tbody></table>';
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
  return '<div class="sis-sec"><h2>'+esc(rot)+'<small>Envie ao cliente ou colaborador. O que ele preencher entra direto aqui.</small></h2><div class="acoes"><span class="nota" style="overflow-wrap:anywhere">'+esc(u)+'</span><button type="button" class="lnk" data-copiar-link="'+esc(u)+'">Copiar link</button><a class="lnk" href="#'+h+'">Ver o formulário</a></div></div>';
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
  var novas=props.filter(function(p){return p.status==="nova";}).length;
  var aAssinar=cons.filter(function(c){return c.status==="rascunho"||c.status==="enviado";}).length;
  var proxP=prods.filter(function(p){return p.status!=="cancelada"&&p.dataInicio>=h&&p.dataInicio<=lim;}).length;
  var abertas=tars.filter(function(t){return t.coluna!=="concluida";}).length;
  var doMes=fin.filter(function(f){return String(f.data).slice(0,7)===mes;});
  var ent=soma(doMes.filter(function(f){return f.tipo==="entrada"&&f.status==="pago";}),"valor"),sai=soma(doMes.filter(function(f){return f.tipo==="saida"&&f.status==="pago";}),"valor");
  var receber=soma(fin.filter(function(f){return f.tipo==="entrada"&&f.status==="pendente";}),"valor");
  var eventos=proximosEventos(6);
  var recentes=props.sort(function(a,b){return porData(a,b,"criadaEm");}).slice(0,5);
  m.innerHTML=cab("Início",esc(S.dataExtenso(h)))+
    '<div class="sis-numeros">'+
      '<a href="#adm/propostas"><b>'+novas+'</b><span>Propostas novas</span></a>'+
      '<a href="#adm/contratos"><b>'+aAssinar+'</b><span>Contratos sem assinatura</span></a>'+
      '<a href="#adm/producoes"><b>'+proxP+'</b><span>Produções nos próximos 30 dias</span></a>'+
      '<a href="#adm/tarefas"><b>'+abertas+'</b><span>Tarefas abertas</span></a></div>'+
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
M.propostas={render:function(m,id,vista){
  m.innerHTML=cab("Propostas","Os pedidos do Contato no site chegam aqui já calculados. Revise, ajuste e envie.",'<span></span><a class="btn btn--escuro" href="#adm/proposta/nova">+ Nova proposta</a>')+
    '<div class="sis-ferr sis-ferr--baixo">'+filtros([["todas","Todas"]].concat(S.opcoes("proposta")),fProp.st,"data-st")+busca(fProp.q)+'</div><div id="sis-lista"></div>';
  $$("[data-st]",m).forEach(function(b){b.addEventListener("click",function(){fProp.st=b.getAttribute("data-st");$$("[data-st]",m).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});vista.atualizar();});});
  $("[data-q]",m).addEventListener("input",function(e){fProp.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){location.hash="#adm/proposta/"+id;});
  vista.atualizar=function(){
    var l=St.list("propostas").filter(function(p){var c=p.cliente||{};return (fProp.st==="todas"||p.status===fProp.st)&&contem(fProp.q,[p.num,c.nome,c.empresa,c.local,c.email]);}).sort(function(a,b){return porData(a,b,"criadaEm");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Nº",v:function(p){return esc(p.num);}},
      {r:"Cliente",v:function(p){var c=p.cliente||{};return esc(c.nome||"Sem nome")+(c.empresa?'<br><span class="sec">'+esc(c.empresa)+'</span>':'');}},
      {r:"Finalidade",v:function(p){return esc(S.FINALIDADES[p.finalidade]||"");},cl:"sec"},
      {r:"Ambientes",v:function(p){return esc(S.listaAmbientes(p)||"—");}},
      {r:"Data sugerida",v:function(p){return esc(S.dataBR(p.dataSugerida)||"—");},cl:"sec"},
      {r:"Valor",v:function(p){return brl(p.valor);},cl:"num"},
      {r:"Status",v:function(p){return S.tag("proposta",p.status)+(p.origem==="site"?'<br><span class="sec" style="font-size:var(--t-leg)">pelo site</span>':'');}}
    ],l,St.list("propostas").length?"Nenhuma proposta com esse filtro.":"Ainda não há propostas. Elas chegam pelo formulário do Contato no site, ou crie uma em Nova proposta.");
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
M.contratos={render:function(m,id,vista){
  var anos=[];St.list("contratos").forEach(function(c){var a=String(c.criadoEm||"").slice(0,4);if(a&&anos.indexOf(a)<0)anos.push(a);});anos.sort().reverse();
  m.innerHTML=cab("Contratos",'Modelo revisado a partir do contrato base. <a class="lnk" href="#adm/revisao">Ver a revisão jurídica</a>','<label class="f">Ano'+selectHTML("data-ano",[["todos","Todos"]].concat(anos.map(function(a){return [a,a];})),fCon.ano)+'</label><a class="btn btn--escuro" href="#adm/contrato/novo">+ Novo contrato</a>')+
    '<div class="sis-ferr sis-ferr--baixo">'+filtros([["todos","Todos"]].concat(S.opcoes("contrato")),fCon.st,"data-st")+busca(fCon.q)+'</div><div id="sis-lista"></div>';
  $$("[data-st]",m).forEach(function(b){b.addEventListener("click",function(){fCon.st=b.getAttribute("data-st");$$("[data-st]",m).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});vista.atualizar();});});
  $("[data-q]",m).addEventListener("input",function(e){fCon.q=e.target.value;vista.atualizar();});
  $("[data-ano]",m).addEventListener("change",function(e){fCon.ano=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){location.hash="#adm/contrato/"+id;});
  vista.atualizar=function(){
    var l=St.list("contratos").filter(function(c){return (fCon.st==="todos"||c.status===fCon.st)&&(fCon.ano==="todos"||String(c.criadoEm).slice(0,4)===fCon.ano)&&contem(fCon.q,[c.num,nomeCliente(c.clienteId),c.campos&&c.campos.ambientes]);}).sort(function(a,b){return porData(a,b,"criadoEm");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Nº",v:function(c){return esc(c.num);}},
      {r:"Cliente",v:function(c){return esc(nomeCliente(c.clienteId)||"Sem cliente");}},
      {r:"Ambientes",v:function(c){return esc((c.campos||{}).ambientes||"—");},cl:"sec"},
      {r:"Início",v:function(c){return esc(S.dataBR((c.campos||{}).dataInicio)||"—");},cl:"sec"},
      {r:"Valor",v:function(c){return brl((c.campos||{}).valor);},cl:"num"},
      {r:"Pendências",v:function(c){var f=S.faltando(c).length;return f?'<span class="neg">'+f+' dado'+(f>1?'s':'')+' a preencher</span>':'<span class="pos">Completo</span>';}},
      {r:"Status",v:function(c){return S.tag("contrato",c.status);}}
    ],l,St.list("contratos").length?"Nenhum contrato com esse filtro.":"Ainda não há contratos. Gere um a partir de uma proposta ou em Novo contrato.");
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
  else{ed=St.copia("contratos",id);if(!ed){m.innerHTML=cab("Contrato não encontrado","",'',["#adm/contratos","Contratos"]);return;}}
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
        {k:"campos.limiteDespesa",r:"Despesa sem aprovação escrita até (R$)",t:"money"},{k:"campos.diaria",r:"Dia extra de trabalho (R$)",t:"money"}],ed)+'</div></section>'+
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
  function salvar(){
    var corpo=S.clone(ed),cid=ed.id;delete corpo.id;
    return St.salvar("contratos",cid||null,corpo).then(function(nid){ed.id=nid;if(!cid)history.replaceState(null,"","#adm/contrato/"+nid);S.toast("Contrato salvo.");return nid;});
  }
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
    previa();
  }
  function lancarParcelas(){
    var c=ed.campos,total=num(c.valor);
    if(!total){S.toast("Informe o valor do contrato.");return;}
    salvar().then(function(cid){
      var ja=St.list("financeiro").filter(function(f){return f.contratoId===cid;});
      if(ja.length&&!window.confirm("Já existem "+ja.length+" lançamento(s) deste contrato no financeiro. Lançar de novo?"))return;
      var nome=nomeCliente(ed.clienteId)||"cliente",base={tipo:"entrada",status:"pendente",forma:"PIX",contratoId:cid,criadoEm:S.agoraISO()};
      var l=[];
      if(c.pagamentoTipo==="sinal"){var a=Math.round(total*(num(c.sinal)||50))/100;
        l.push(Object.assign({},base,{data:c.dataAssinatura||S.hoje(),descricao:"Sinal · contrato "+ed.num+" · "+nome,categoria:"Sinal de contrato",valor:a}));
        l.push(Object.assign({},base,{data:c.dataInicio||c.dataAssinatura||S.hoje(),descricao:"Saldo · contrato "+ed.num+" · "+nome,categoria:"Produção",valor:Math.round((total-a)*100)/100}));}
      else l.push(Object.assign({},base,{data:c.pagamentoTipo==="vista"?(c.dataAssinatura||S.hoje()):(c.dataInicio||S.hoje()),descricao:"Contrato "+ed.num+" · "+nome,categoria:"Produção",valor:total}));
      return l.reduce(function(p,x){return p.then(function(){return St.salvar("financeiro",null,x);});},Promise.resolve()).then(function(){S.toast(l.length+" lançamento(s) criados como pendentes no Financeiro.");});
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
var fCli={q:""};
M.clientes={render:function(m,id,vista){
  m.innerHTML=cab("Clientes","Cadastro feito por você ou pelo próprio cliente, pelo link.",'<span></span><button type="button" class="btn btn--escuro" data-novo>+ Novo cliente</button>')+
    caixaLink("Link de cadastro do cliente","cadastro-cliente")+
    '<div class="sis-ferr sis-ferr--baixo"><span></span>'+busca(fCli.q)+'</div><div id="sis-lista"></div>';
  ligarCopiarLink(m);
  $("[data-novo]",m).addEventListener("click",function(){S.modalCliente(null);});
  $("[data-q]",m).addEventListener("input",function(e){fCli.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){S.modalCliente(id);});
  vista.atualizar=function(){
    var l=St.list("clientes").filter(function(c){return contem(fCli.q,[c.nome,c.cidade,c.email,c.telefone,c.doc]);}).sort(function(a,b){return String(a.nome).localeCompare(String(b.nome));});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Nome",v:function(c){return esc(c.nome);}},
      {r:"Cidade",v:function(c){return esc([c.cidade,c.uf].filter(Boolean).join("/")||"—");},cl:"sec"},
      {r:"Telefone",v:function(c){return esc(c.telefone||"—");}},
      {r:"E-mail",v:function(c){return esc(c.email||"—");},cl:"sec"},
      {r:"Dados para contrato",v:function(c){var ok=c.doc&&c.endereco&&c.cidade;return ok?'<span class="pos">Completos</span>':'<span class="neg">Incompletos</span>';}},
      {r:"Origem",v:function(c){return esc(c.origem||"—");},cl:"sec"}
    ],l,St.list("clientes").length?"Nenhum cliente encontrado.":"Ainda não há clientes. Eles entram pelos pedidos do site, pelo link de cadastro ou em Novo cliente.");
  };
  if(!carregando($("#sis-lista",m),vista,"clientes"))vista.atualizar();
}};

/* ================= PRODUÇÕES ================= */
var fProd={st:"todas",q:""};
M.producoes={render:function(m,id,vista){
  m.innerHTML=cab("Produções","Criadas a partir de contratos assinados: local, data, parceiros e peças que ficaram com o cliente.",'<span></span><a class="btn btn--escuro" href="#adm/producao/nova">+ Nova produção</a>')+
    '<div class="sis-ferr sis-ferr--baixo">'+filtros([["todas","Todas"]].concat(S.opcoes("producao")),fProd.st,"data-st")+busca(fProd.q)+'</div><div id="sis-lista"></div>';
  $$("[data-st]",m).forEach(function(b){b.addEventListener("click",function(){fProd.st=b.getAttribute("data-st");$$("[data-st]",m).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});vista.atualizar();});});
  $("[data-q]",m).addEventListener("input",function(e){fProd.q=e.target.value;vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){location.hash="#adm/producao/"+id;});
  vista.atualizar=function(){
    var l=St.list("producoes").filter(function(p){return (fProd.st==="todas"||p.status===fProd.st)&&contem(fProd.q,[p.titulo,p.local,nomeCliente(p.clienteId)]);}).sort(function(a,b){return porData(a,b,"dataInicio");});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Produção",v:function(p){return esc(p.titulo||"Sem título");}},
      {r:"Local",v:function(p){return esc(p.local||"—");},cl:"sec"},
      {r:"Datas",v:function(p){return esc(S.dataBR(p.dataInicio)+(p.dataFim&&p.dataFim!==p.dataInicio?" a "+S.dataBR(p.dataFim):""))||"—";}},
      {r:"Parceiros",v:function(p){return String((p.parceiros||[]).length);},cl:"num"},
      {r:"Peças com o cliente",v:function(p){return String((p.pecas||[]).length);},cl:"num"},
      {r:"ART",v:function(p){return brl(artTotal(p.pecas));},cl:"num"},
      {r:"Status",v:function(p){return S.tag("producao",p.status);}}
    ],l,St.list("producoes").length?"Nenhuma produção com esse filtro.":"Ainda não há produções. Marque um contrato como Assinado e use Criar produção.");
  };
  if(!carregando($("#sis-lista",m),vista,"producoes"))vista.atualizar();
}};
function artTotal(pecas){return (pecas||[]).reduce(function(s,x){return s+num(x.valor)*num(x.art)/100;},0);}

M.producao={
  sync:function(id,p){
    if(!p||!p.dataInicio||p.status==="cancelada")return St.excluir("agenda","prod-"+id).catch(function(){});
    var nomes=(p.equipe||[]).map(function(i){var x=St.get("equipe",i);return x?x.nome:"";}).filter(Boolean);
    return St.salvar("agenda","prod-"+id,{titulo:"Produção · "+(p.titulo||""),tipo:"producao",data:p.dataInicio,dataFim:p.dataFim||p.dataInicio,hora:p.hora||"",horaFim:"",local:p.local||"",
      desc:nomes.length?"Equipe: "+nomes.join(", "):"",producaoId:id,auto:true});
  },
  render:function(m,id,vista){
    var ed;
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
      return ed.pecas.map(function(x,i){return '<div class="rep__lin" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1.1fr) minmax(0,.8fr) minmax(0,.55fr) auto" data-qi="'+i+'"><label class="f">Peça<input type="text" data-qk="peca" value="'+esc(x.peca)+'"></label><label class="f">Parceiro'+selectHTML('data-qk="parceiroId"',opcoesParceiros(),x.parceiroId)+'</label><label class="f">Valor (R$)<input type="text" inputmode="decimal" data-qk="valor" data-num="1" value="'+(x.valor!==""&&x.valor!=null?S.fmtValor(x.valor):"")+'"></label><label class="f">ART %<input type="text" inputmode="decimal" data-qk="art" data-num="1" value="'+esc(x.art)+'"></label><button type="button" class="rep__x" data-rem-q="'+i+'">Remover</button></div>';}).join("")||'<p class="nota">Nenhuma peça registrada.</p>';
    }
    function totaisHTML(){
      var t=soma(ed.pecas,"valor"),a=artTotal(ed.pecas),por={};
      ed.pecas.forEach(function(x){var v=num(x.valor)*num(x.art)/100;if(!v)return;var k=x.parceiroId||"";por[k]=(por[k]||0)+v;});
      var lin=Object.keys(por).map(function(k){return '<span>'+esc(nomeParceiro(k)||"Sem parceiro")+' <b>'+brl(por[k])+'</b></span>';}).join("");
      return '<span>Peças com o cliente <b>'+brl(t)+'</b></span><span>ART total <b>'+brl(a)+'</b></span>'+(Object.keys(por).length>1?lin:'')+'<span class="nota">ART visível só para o administrador.</span>';
    }
    function equipeHTML(){
      var at=St.list("equipe").filter(function(x){return x.status==="ativo";});
      return at.length?'<div class="chks">'+at.map(function(x){return '<label class="chk"><input type="checkbox" data-eq="'+esc(x.id)+'"'+(ed.equipe.indexOf(x.id)>=0?" checked":"")+'> '+esc(x.nome)+(x.funcao?' <span class="nota">· '+esc(x.funcao)+'</span>':'')+'</label>';}).join("")+'</div>':'<p class="nota">Ninguém liberado em <a class="lnk" href="#adm/equipe">Equipe</a> ainda.</p>';
    }
    function desenhar(){
      m.innerHTML=cab(ed.id?(ed.titulo||"Produção"):"Nova produção",ed.contratoId?"Contrato "+esc((St.get("contratos",ed.contratoId)||{}).num||""):"Escolha o contrato assinado desta produção.",
        '<label class="f" style="min-width:180px">Status'+selectHTML('data-k="status"',S.opcoes("producao"),ed.status)+'</label>'+
        '<div class="acoes"><button type="button" class="btn btn--escuro" data-salvar>Salvar</button><button type="button" class="lnk" data-art>Lançar ART no financeiro</button>'+(ed.id?'<button type="button" class="lnk lnk--perigo" data-excluir>Excluir</button>':'')+'</div>',["#adm/producoes","Produções"])+
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
      $("[data-add-q]",m).addEventListener("click",function(){ed.pecas.push({peca:"",parceiroId:"",valor:"",art:""});$("#ed-pecas",m).innerHTML=pecasHTML();});
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
      return St.salvar("producoes",pid||null,corpo).then(function(nid){ed.id=nid;return M.producao.sync(nid,corpo).then(function(){S.toast("Produção salva e calendário atualizado.");if(!pid){history.replaceState(null,"","#adm/producao/"+nid);desenhar();}return nid;});},function(e){S.erroGravar(e);throw e;});
    }
    function lancarArt(){
      var a=Math.round(artTotal(ed.pecas)*100)/100;if(!a){S.toast("Nenhuma ART nas peças desta produção.");return;}
      salvar().then(function(pid){
        return St.salvar("financeiro",null,{tipo:"entrada",data:ed.dataFim||ed.dataInicio||S.hoje(),descricao:"ART · "+(ed.titulo||"produção"),categoria:"ART / comissão",valor:a,status:"pendente",forma:"PIX",producaoId:pid,contratoId:ed.contratoId||"",criadoEm:S.agoraISO()});
      }).then(function(){S.toast("ART de "+brl(a)+" lançada como pendente no Financeiro.");},function(){});
    }
    m.addEventListener("input",aoMudar);m.addEventListener("change",aoMudar);m.addEventListener("click",aoClicar);
    desenhar();
  }
};

/* ================= FINANCEIRO ================= */
var CATS_FIN=[{grupo:"Entradas",itens:["Produção","Sinal de contrato","ART / comissão","Outras entradas"]},{grupo:"Saídas",itens:["Ajudantes e equipe","Frete e transporte","Folhagens e flores","Materiais de produção","Alimentação","Impostos e taxas","Ferramentas e equipamentos","Outras saídas"]}];
var fFin={per:"mes",mes:S.hoje().slice(0,7),tipo:"todos",st:"todos",cat:"",q:""};
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
  var cons=[["","— nenhum —"]].concat(St.list("contratos").map(function(c){return [c.id,c.num+" · "+(nomeCliente(c.clienteId)||"")];}));
  S.modalForm({sobre:"Financeiro",titulo:id?"Editar lançamento":(f.tipo==="saida"?"Nova saída":"Nova entrada"),dados:f,salvarRot:id?"Salvar":"+ Adicionar",
    campos:[{k:"tipo",r:"Tipo",t:"select",o:[["entrada","Entrada"],["saida","Saída"]]},{k:"data",r:"Data",t:"date",req:1},
      {k:"descricao",r:"Descrição",req:1,full:1},{k:"categoria",r:"Categoria",t:"select",o:CATS_FIN},{k:"valor",r:"Valor (R$)",t:"money",req:1},
      {k:"status",r:"Status",t:"select",o:S.opcoes("financeiro")},{k:"forma",r:"Forma",t:"select",o:["PIX","Transferência","Dinheiro","Cartão","Boleto"]},
      {k:"contratoId",r:"Contrato",t:"select",o:cons,full:1},{k:"obs",r:"Observação",t:"area",full:1}],
    aoSalvar:function(v){if(!num(v.valor)){S.toast("Informe um valor.");return false;}var corpo=Object.assign({},f,v);delete corpo.id;if(!id)corpo.criadoEm=S.agoraISO();return St.salvar("financeiro",id||null,corpo).then(function(){S.toast("Lançamento salvo.");});},
    aoExcluir:id?function(){return St.excluir("financeiro",id);}:null});
}
M.financeiro={render:function(m,id,vista){
  m.innerHTML=cab("Financeiro","Entradas e saídas, com filtros por período, tipo, status e categoria.",'<button type="button" class="lnk" data-csv>Exportar CSV</button><div class="acoes"><button type="button" class="btn btn--linha" data-nova="saida">− Saída</button><button type="button" class="btn btn--escuro" data-nova="entrada">+ Entrada</button></div>')+
    '<div class="sis-ferr sis-ferr--baixo"><div class="acoes">'+
      '<label class="f">Período'+selectHTML("data-per",[["mes","Este mês"],["ant","Mês passado"],["ano","Este ano"],["esc","Escolher mês"],["tudo","Tudo"]],fFin.per)+'</label>'+
      '<label class="f" data-mes-box'+(fFin.per==="esc"?"":" hidden")+'>Mês<input type="month" data-mes value="'+esc(fFin.mes)+'"></label>'+
      '<label class="f">Tipo'+selectHTML("data-tipo",[["todos","Todos"],["entrada","Entradas"],["saida","Saídas"]],fFin.tipo)+'</label>'+
      '<label class="f">Status'+selectHTML("data-stf",[["todos","Todos"],["pago","Pago"],["pendente","Pendente"]],fFin.st)+'</label>'+
      '<label class="f">Categoria'+selectHTML("data-cat",[["","Todas"]].concat(CATS_FIN),fFin.cat)+'</label>'+
    '</div>'+busca(fFin.q)+'</div><div class="totais" id="fin-tot" style="padding:var(--s-4) 0 var(--s-16)"></div><div id="sis-lista"></div>';
  function liga(sel,k,cb){$(sel,m).addEventListener("change",function(e){fFin[k]=e.target.value;if(cb)cb();vista.atualizar();});}
  liga("[data-per]","per",function(){$("[data-mes-box]",m).hidden=fFin.per!=="esc";});liga("[data-mes]","mes");liga("[data-tipo]","tipo");liga("[data-stf]","st");liga("[data-cat]","cat");
  $("[data-q]",m).addEventListener("input",function(e){fFin.q=e.target.value;vista.atualizar();});
  $$("[data-nova]",m).forEach(function(b){b.addEventListener("click",function(){modalFin(null,b.getAttribute("data-nova"));});});
  aoClicarLinha($("#sis-lista",m),function(id){modalFin(id);});
  var atual=[];
  $("[data-csv]",m).addEventListener("click",function(){
    var linhas=[["Data","Tipo","Descrição","Categoria","Status","Forma","Valor"]].concat(atual.map(function(f){return [S.dataBR(f.data),f.tipo==="saida"?"Saída":"Entrada",f.descricao,f.categoria,f.status,f.forma,(f.tipo==="saida"?"-":"")+S.fmtValor(f.valor)];}));
    S.salvarArquivo("financeiro-"+S.hoje()+".csv","﻿"+linhas.map(function(l){return l.map(function(c){return '"'+String(c==null?"":c).replace(/"/g,'""')+'"';}).join(";");}).join("\r\n"));
  });
  vista.atualizar=function(){
    atual=St.list("financeiro").filter(function(f){return noPeriodo(f.data)&&(fFin.tipo==="todos"||f.tipo===fFin.tipo)&&(fFin.st==="todos"||f.status===fFin.st)&&(!fFin.cat||f.categoria===fFin.cat)&&contem(fFin.q,[f.descricao,f.categoria,f.obs]);}).sort(function(a,b){return porData(a,b,"data");});
    var e=soma(atual.filter(function(f){return f.tipo==="entrada"&&f.status==="pago";}),"valor"),s=soma(atual.filter(function(f){return f.tipo==="saida"&&f.status==="pago";}),"valor");
    var r=soma(atual.filter(function(f){return f.tipo==="entrada"&&f.status==="pendente";}),"valor"),p=soma(atual.filter(function(f){return f.tipo==="saida"&&f.status==="pendente";}),"valor");
    $("#fin-tot",m).innerHTML='<span>Entradas pagas <b class="pos">'+brl(e)+'</b></span><span>Saídas pagas <b class="neg">'+brl(s)+'</b></span><span>Saldo <b>'+brl(e-s)+'</b></span><span>A receber <b>'+brl(r)+'</b></span><span>A pagar <b>'+brl(p)+'</b></span>';
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Descrição",v:function(f){return esc(f.descricao||"—");}},
      {r:"Data",v:function(f){return esc(S.dataBR(f.data));},cl:"sec"},
      {r:"Categoria",v:function(f){return esc(f.categoria||"—");},cl:"sec"},
      {r:"Status",v:function(f){return S.tag("financeiro",f.status);}},
      {r:"Valor",v:function(f){return '<span class="'+(f.tipo==="saida"?"neg":"pos")+'">'+(f.tipo==="saida"?"− ":"+ ")+brl(f.valor)+'</span>';},cl:"num"}
    ],atual,St.list("financeiro").length?"Nenhum lançamento nesse filtro.":"Ainda não há lançamentos. Use + Entrada, − Saída ou Lançar parcelas no contrato.");
  };
  if(!carregando($("#sis-lista",m),vista,"financeiro"))vista.atualizar();
}};

/* ================= CALENDÁRIO ================= */
var TIPOS_AG={producao:["Produção","#111111","#E2DFDA"],visita:["Visita","#7D7A75","#ECEAE5"],tarefa:["Tarefa","#5F6F7A","#E5E9EC"],outro:["Outro","#A9A6A0","#F0EEEA"]};
var mesCal=S.hoje().slice(0,7);
function eventosDoDia(dia){return St.list("agenda").filter(function(e){return e.data&&e.data<=dia&&(e.dataFim||e.data)>=dia;}).sort(function(a,b){return String(a.hora||"").localeCompare(String(b.hora||""));});}
function proximosEventos(n){var h=S.hoje();return St.list("agenda").filter(function(e){return (e.dataFim||e.data)>=h;}).sort(function(a,b){return (String(a.data)+(a.hora||"")).localeCompare(String(b.data)+(b.hora||""));}).slice(0,n);}
function itemEvento(e){var t=TIPOS_AG[e.tipo]||TIPOS_AG.outro;return '<div class="item"><button type="button" class="tab__abrir" data-evento="'+esc(e.id)+'" style="text-align:left">'+esc(e.titulo)+'</button><span>'+esc(S.dataBR(e.data)+(e.dataFim&&e.dataFim!==e.data?" a "+S.dataBR(e.dataFim):"")+(e.hora?" · "+e.hora:""))+'</span><span>'+esc(e.local||"")+'</span><span class="tag" style="--c:'+t[1]+'">'+t[0]+'</span></div>';}
function gcal(e){
  var enc=encodeURIComponent,d1=String(e.data).replace(/-/g,""),datas;
  if(e.hora){var hf=e.horaFim||(function(){var p=e.hora.split(":");return S.pad((+p[0]+2)%24)+":"+(p[1]||"00");})();datas=d1+"T"+e.hora.replace(":","")+"00/"+String(e.dataFim||e.data).replace(/-/g,"")+"T"+hf.replace(":","")+"00";}
  else datas=d1+"/"+S.somaDias(e.dataFim||e.data,1).replace(/-/g,"");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+enc(e.titulo||"")+"&dates="+datas+"&details="+enc(e.desc||"")+"&location="+enc(e.local||"")+"&ctz=America/Sao_Paulo";
}
function verEvento(id){
  var e=St.copia("agenda",id);if(!e)return;
  var t=TIPOS_AG[e.tipo]||TIPOS_AG.outro,adm=S.ehAdm();
  if(adm&&!e.auto){modalEvento(id);return;}
  S.modal({sobre:t[0],titulo:e.titulo,semFoco:1,
    corpo:'<dl class="itens">'+[["Data",S.dataBR(e.data)+(e.dataFim&&e.dataFim!==e.data?" a "+S.dataBR(e.dataFim):"")],["Horário",(e.hora||"")+(e.horaFim?" às "+e.horaFim:"")],["Local",e.local],["Detalhes",e.desc]].filter(function(x){return x[1];}).map(function(x){return '<div class="item"><b>'+esc(x[0])+'</b><span style="grid-column:1/-1;color:var(--tinta)">'+esc(x[1])+'</span></div>';}).join("")+'</dl>'+
      (e.auto&&adm?'<p class="nota" style="margin-top:var(--s-12)">Criado pela produção. Para mudar datas, edite a produção.</p>':''),
    pe:(e.auto&&adm?'<a class="lnk esq" href="#adm/producao/'+esc(e.producaoId)+'" data-fechar>Abrir produção</a>':'')+'<a class="btn btn--linha" target="_blank" rel="noopener" href="'+esc(gcal(e))+'">Adicionar ao Google Agenda ↗</a><button type="button" class="btn btn--escuro" data-fechar>Fechar</button>'});
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
  m.innerHTML=cab("Calendário",adm?"Produções, visitas e outras tarefas. Cada compromisso pode ir para o Google Agenda.":"Produções, visitas e compromissos da equipe.",
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
  if(!carregando($("#sis-lista",m),vista,"agenda"))vista.atualizar();
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
M.parceiros={render:function(m,id,vista){
  m.innerHTML=cab("Parceiros e fornecedores","Projeto, execução, lojas, online e marcas.",'<span></span><button type="button" class="btn btn--escuro" data-novo>+ Novo fornecedor</button>')+
    '<div class="abas" role="tablist" id="parc-abas"></div><div class="sis-ferr sis-ferr--baixo"><span></span>'+busca(fParc.q)+'</div><div id="sis-lista"></div>';
  $("[data-novo]",m).addEventListener("click",function(){modalParceiro(null,fParc.aba);});
  $("[data-q]",m).addEventListener("input",function(e){fParc.q=e.target.value;vista.atualizar();});
  $("#parc-abas",m).addEventListener("click",function(e){var b=e.target.closest("[data-aba]");if(!b)return;fParc.aba=b.getAttribute("data-aba");vista.atualizar();});
  aoClicarLinha($("#sis-lista",m),function(id){modalParceiro(id);});
  vista.atualizar=function(){
    var todos=St.list("parceiros");
    $("#parc-abas",m).innerHTML=CATS_PARC.map(function(c){var n=todos.filter(function(p){return p.cat===c[0];}).length;return '<button type="button" role="tab" style="--c:'+c[2]+'" data-aba="'+c[0]+'" aria-selected="'+(fParc.aba===c[0])+'">'+c[1]+' <span>'+n+'</span></button>';}).join("");
    var cs=CAMPOS_PARC[fParc.aba].filter(function(c){return c[0]!=="obs";}).slice(0,5);
    var l=todos.filter(function(p){return p.cat===fParc.aba&&contem(fParc.q,CAMPOS_PARC[fParc.aba].map(function(c){return p[c[0]];}));}).sort(function(a,b){return String(nomeParceiro(a.id)).localeCompare(String(nomeParceiro(b.id)));});
    $("#sis-lista",m).innerHTML=tabela(cs.map(function(c,i){return {r:c[1],v:function(p){var v=p[c[0]];return esc(v||"—");},cl:i>1?"sec":""};}),l,"Nenhum fornecedor nesta categoria.");
  };
  if(!carregando($("#sis-lista",m),vista,"parceiros"))vista.atualizar();
}};

/* ================= TAREFAS ================= */
var COLS_K=[["afazer","A fazer"],["andamento","Em andamento"],["concluida","Concluídas"]];
var fTar={resp:"todos"};
function ehMinha(t){if(S.ehAdm())return t.resp==="adm";return (S.Sessao.membroId&&t.resp===S.Sessao.membroId)||(S.Sessao.userId&&t.respUser===S.Sessao.userId);}
function opcoesResp(){var l=[["adm","Shylton (administrador)"]];St.list("equipe").filter(function(x){return x.status==="ativo";}).forEach(function(x){l.push([x.id,x.nome]);});return l;}
function modalTarefa(id,coluna){
  var adm=S.ehAdm(),t=id?St.copia("tarefas",id):{coluna:coluna||"afazer",resp:adm?"adm":(S.Sessao.membroId||""),criadaEm:S.agoraISO()};
  var cs=[{k:"titulo",r:"Tarefa",req:1,full:1},{k:"desc",r:"Detalhes",t:"area",full:1},{k:"prazo",r:"Prazo",t:"date"},{k:"coluna",r:"Coluna",t:"select",o:COLS_K}];
  if(adm)cs.splice(2,0,{k:"resp",r:"Responsável",t:"select",o:opcoesResp()});
  S.modalForm({sobre:"Tarefas",titulo:id?"Editar tarefa":"Nova tarefa",campos:cs,dados:t,salvarRot:id?"Salvar":"+ Adicionar",
    aoSalvar:function(v){
      var corpo=Object.assign({},t,v);delete corpo.id;
      if(adm){if(corpo.resp==="adm"){corpo.respNome="Shylton";corpo.respUser="";}else{var mb=St.get("equipe",corpo.resp);corpo.respNome=mb?mb.nome:"";corpo.respUser=mb&&mb.userId||"";}}
      else if(!id){corpo.respNome=S.Sessao.nome||"";corpo.respUser=S.Sessao.userId||"";}
      return St.salvar("tarefas",id||null,corpo).then(function(){S.toast("Tarefa salva.");});
    },
    aoExcluir:id&&adm?function(){return St.excluir("tarefas",id);}:null});
}
function moverTarefa(id,col){var t=St.copia("tarefas",id);if(!t||t.coluna===col)return;t.coluna=col;if(col==="concluida")t.concluidaEm=S.agoraISO();delete t.id;St.salvar("tarefas",id,t).catch(S.erroGravar);}
M.tarefas={render:function(m,id,vista){
  var adm=S.ehAdm();
  var opts=adm?[["todos","Todas"],["minhas","Minhas"]].concat(St.list("equipe").filter(function(x){return x.status==="ativo";}).map(function(x){return [x.id,x.nome];})):[["todos","Todas"],["minhas","Minhas"]];
  if(!opts.some(function(o){return o[0]===fTar.resp;}))fTar.resp="todos";
  m.innerHTML=cab("Tarefas",adm?"Para você e para a equipe. Arraste os cartões entre as colunas.":"Suas tarefas e as da equipe. Arraste os cartões entre as colunas.",'<span></span><button type="button" class="btn btn--escuro" data-nova>+ Nova tarefa</button>')+
    '<div class="sis-ferr sis-ferr--baixo">'+filtros(opts,fTar.resp,"data-resp")+'<span></span></div><div id="sis-lista"></div>';
  $("[data-nova]",m).addEventListener("click",function(){modalTarefa(null);});
  $$("[data-resp]",m).forEach(function(b){b.addEventListener("click",function(){fTar.resp=b.getAttribute("data-resp");$$("[data-resp]",m).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false");});vista.atualizar();});});
  var caixa=$("#sis-lista",m);
  caixa.addEventListener("click",function(e){
    var mv=e.target.closest("[data-mover]");if(mv){moverTarefa(mv.getAttribute("data-id"),mv.getAttribute("data-mover"));return;}
    var c=e.target.closest("[data-tarefa]");if(c)modalTarefa(c.getAttribute("data-tarefa"));
  });
  caixa.addEventListener("dragstart",function(e){var c=e.target.closest("[data-tarefa]");if(!c)return;e.dataTransfer.setData("text/plain",c.getAttribute("data-tarefa"));e.dataTransfer.effectAllowed="move";c.classList.add("arrastando");});
  caixa.addEventListener("dragend",function(e){var c=e.target.closest("[data-tarefa]");if(c)c.classList.remove("arrastando");$$(".kcol",caixa).forEach(function(k){k.classList.remove("sobre");});});
  caixa.addEventListener("dragover",function(e){var k=e.target.closest(".kcol");if(!k)return;e.preventDefault();$$(".kcol",caixa).forEach(function(x){x.classList.toggle("sobre",x===k);});});
  caixa.addEventListener("drop",function(e){var k=e.target.closest(".kcol");if(!k)return;e.preventDefault();k.classList.remove("sobre");var tid=e.dataTransfer.getData("text/plain");if(tid)moverTarefa(tid,k.getAttribute("data-col"));});
  vista.atualizar=function(){
    var h=S.hoje();
    var l=St.list("tarefas").filter(function(t){return fTar.resp==="todos"||(fTar.resp==="minhas"?ehMinha(t):t.resp===fTar.resp);});
    caixa.innerHTML='<div class="kanban">'+COLS_K.map(function(c,ci){
      var ts=l.filter(function(t){return (t.coluna||"afazer")===c[0];}).sort(function(a,b){return String(a.prazo||"9999").localeCompare(String(b.prazo||"9999"))||String(a.criadaEm||"").localeCompare(String(b.criadaEm||""));});
      return '<section class="kcol'+(c[0]==="concluida"?" kcol--feita":"")+'" data-col="'+c[0]+'"><h2>'+c[1]+' <span>'+ts.length+'</span></h2>'+
        ts.map(function(t){
          var atras=t.prazo&&t.prazo<h&&c[0]!=="concluida";
          return '<article class="kcard" draggable="true" data-tarefa="'+esc(t.id)+'"><h3>'+esc(t.titulo)+'</h3>'+(t.desc?'<p>'+esc(String(t.desc).slice(0,120))+'</p>':'')+
            '<div class="kcard__pe"><span class="nota">'+esc(t.respNome||(t.resp==="adm"?"Shylton":""))+(t.prazo?' · <span class="'+(atras?"atrasada":"")+'">'+esc(S.dataBR(t.prazo))+'</span>':'')+'</span><span>'+
            (ci>0?'<button type="button" data-mover="'+COLS_K[ci-1][0]+'" data-id="'+esc(t.id)+'" aria-label="Mover para '+COLS_K[ci-1][1]+'">←</button> ':'')+
            (ci<2?'<button type="button" data-mover="'+COLS_K[ci+1][0]+'" data-id="'+esc(t.id)+'" aria-label="Mover para '+COLS_K[ci+1][1]+'">→</button>':'')+'</span></div></article>';
        }).join("")+(ts.length?'':'<p class="nota" style="margin-top:var(--s-12)">Nenhuma tarefa.</p>')+'</section>';
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
      {k:"acesso",r:"Acesso do membro",t:"select",o:[["colaborador","Colaborador: Tarefas e Calendário"],["adm","Administrador: acesso completo"]],ajuda:"Vale só quando Membro é Sim."},
      {k:"status",r:"Situação",t:"select",o:S.opcoes("equipe"),ajuda:"Bloqueado tira o acesso, mesmo sendo membro."},{k:"obs",r:"Observações",t:"area",full:1}],
    antes:id&&(x.status==="pendente"||x.membro!=="sim")&&x.status!=="bloqueado"?'<div class="item" style="margin-bottom:var(--s-16)"><b>'+(x.status==="pendente"?"Cadastro aguardando liberação":"Sem acesso à área restrita")+'</b><div class="acoes"><button type="button" class="btn btn--escuro" data-liberar>Tornar membro e liberar acesso</button></div></div>':'',
    aoSalvar:function(v){var corpo=Object.assign({},x,v);delete corpo.id;if(!id)corpo.criadoEm=S.agoraISO();return gravar(corpo).then(function(){S.toast(S.membroLiberado(corpo)?"Membro salvo, com acesso liberado.":"Membro salvo, sem acesso.");},function(e){if(e&&e.code==="sem_email"){falhou(e);var c=$('[data-k="email"]',d);if(c){c.setAttribute("aria-invalid","true");c.focus();}return false;}throw e;});},
    aoExcluir:id?function(){return St.excluir("equipe",id).then(function(){return S.sincAcesso(antes,null);});}:null});
  var lb=$("[data-liberar]",d);
  if(lb)lb.addEventListener("click",function(){var c=Object.assign({},x,{status:"ativo",membro:"sim"});delete c.id;gravar(c).then(function(){S.fecharModal();S.toast(x.nome+" agora é membro, com acesso liberado.");},falhou);});
}
M.equipe={render:function(m,id,vista){
  m.innerHTML=cab("Equipe","Só quem é membro entra na área restrita. Marque Membro: Sim e escolha o acesso: colaborador vê só Tarefas e Calendário.",'<span></span><button type="button" class="btn btn--escuro" data-novo>+ Novo membro</button>')+
    caixaLink("Link de cadastro do colaborador","cadastro-equipe")+'<div id="sis-lista"></div>';
  ligarCopiarLink(m);
  $("[data-novo]",m).addEventListener("click",function(){modalMembro(null);});
  aoClicarLinha($("#sis-lista",m),modalMembro);
  vista.atualizar=function(){
    var ordem={pendente:0,ativo:1,bloqueado:2};
    var l=St.list("equipe").sort(function(a,b){return (ordem[a.status]-ordem[b.status])||String(a.nome).localeCompare(String(b.nome));});
    $("#sis-lista",m).innerHTML=tabela([
      {r:"Nome",v:function(x){return esc(x.nome);}},
      {r:"Função",v:function(x){return esc(x.funcao||"—");},cl:"sec"},
      {r:"Contato",v:function(x){return esc([x.telefone,x.email].filter(Boolean).join(" · ")||"—");}},
      {r:"Membro",v:function(x){return x.membro==="sim"?"Sim":"Não";}},
      {r:"Acesso",v:function(x){return !S.membroLiberado(x)?"Sem acesso":(x.acesso==="adm"?"Administrador":"Colaborador");},cl:"sec"},
      {r:"Situação",v:function(x){return S.tag("equipe",x.status);}}
    ],l,"Ainda não há membros. Envie o link de cadastro ou use Novo membro.");
  };
  if(!carregando($("#sis-lista",m),vista,"equipe"))vista.atualizar();
}};

/* ================= AJUSTES ================= */
M.ajustes={render:function(m,id,vista){
  if(carregando(m,vista,"config"))return;
  vista.vivo=false;
  var c=S.cfg();
  m.innerHTML=cab("Ajustes","Tabela da calculadora, seus dados no contrato e textos padrão.",'<span></span><button type="button" class="btn btn--escuro" data-salvar>Salvar ajustes</button>')+
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
