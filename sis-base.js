/* Área restrita · núcleo: utilidades, dados, acesso, rotas, modal e formulários públicos */
(function(){
"use strict";
var SIS = window.SIS = window.SIS || {};

/* Supabase: banco da área restrita no domínio próprio (shyltonmavie.com).
   A chave publishable é pública por natureza; quem lê e grava o quê é decidido pelas regras do banco (RLS, ver supabase/banco.sql). */
var SUPA={
  url:"https://emzhlblfqkzsjgxfszmy.supabase.co",
  chave:"sb_publishable_MiKTMg0SxTnEh-my20Uf0Q_Sri4xdkI",
  lib:"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/dist/umd/supabase.js"
};
var SB=null;
function noClaude(){return !!(window.claude&&typeof window.claude.use==="function");}

/* ---------- utilidades ---------- */
var $ = function(s,r){return (r||document).querySelector(s);};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function pad(n){return String(n).padStart(2,"0");}
function isoLocal(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function hoje(){return isoLocal(new Date());}
function agoraISO(){return new Date().toISOString();}
function num(v){
  if(typeof v==="number")return isFinite(v)?v:0;
  var s=String(v==null?"":v).trim().replace(/[^\d,.\-]/g,"");
  if(!s)return 0;
  if(s.indexOf(",")>=0)s=s.replace(/\./g,"").replace(",",".");
  else if(/^-?\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,"");
  var n=parseFloat(s);return isFinite(n)?n:0;
}
function brl(n){return num(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
function fmtValor(n){return num(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});}
function fmtNum(n){return num(n).toLocaleString("pt-BR",{maximumFractionDigits:2});}
var MESES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function partes(iso){var p=String(iso||"").slice(0,10).split("-").map(Number);return p.length===3&&p[0]?p:null;}
function dataBR(iso){var p=partes(iso);return p?pad(p[2])+"/"+pad(p[1])+"/"+p[0]:"";}
function dataExtenso(iso){var p=partes(iso);return p?p[2]+" de "+MESES[p[1]-1]+" de "+p[0]:"";}
function diasEntre(a,b){return Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);}
function somaDias(iso,n){var d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return isoLocal(d);}
function soDig(s){return String(s||"").replace(/\D/g,"");}
function normal(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim();}
function primeiroNome(n){return String(n||"").trim().split(/\s+/)[0]||"";}
function waLink(tel,txt){var d=soDig(tel);if(d&&d.length<=11)d="55"+d;return "https://wa.me/"+d+"?text="+encodeURIComponent(txt||"");}
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o));}
function setPath(o,k,v){var ps=k.split(".");var c=o;for(var i=0;i<ps.length-1;i++){if(typeof c[ps[i]]!=="object"||c[ps[i]]===null)c[ps[i]]={};c=c[ps[i]];}c[ps[ps.length-1]]=v;}
function getPath(o,k){return k.split(".").reduce(function(c,p){return c==null?undefined:c[p];},o);}
function debounce(fn,ms){var t;return function(){var a=arguments,s=this;clearTimeout(t);t=setTimeout(function(){fn.apply(s,a);},ms);};}

function extenso(valor){
  var un=["","um","dois","três","quatro","cinco","seis","sete","oito","nove","dez","onze","doze","treze","quatorze","quinze","dezesseis","dezessete","dezoito","dezenove"];
  var dez=["","","vinte","trinta","quarenta","cinquenta","sessenta","setenta","oitenta","noventa"];
  var cen=["","cento","duzentos","trezentos","quatrocentos","quinhentos","seiscentos","setecentos","oitocentos","novecentos"];
  function ate999(n){
    if(!n)return "";if(n===100)return "cem";
    var c=Math.floor(n/100),r=n%100,p=[];
    if(c)p.push(cen[c]);
    if(r){if(r<20)p.push(un[r]);else{var d=Math.floor(r/10),u=r%10;p.push(u?dez[d]+" e "+un[u]:dez[d]);}}
    return p.join(" e ");
  }
  function liga(maior,menor){if(!menor)return maior;if(!maior)return menor.txt;return maior+((menor.v<100||menor.v%100===0)?" e ":" ")+menor.txt;}
  function inteiro(n){
    if(n===0)return "zero";
    var mi=Math.floor(n/1e6),mil=Math.floor((n%1e6)/1000),r=n%1000;
    var s="";
    if(mi)s=mi===1?"um milhão":ate999(mi)+" milhões";
    if(mil){var tm=mil===1?"mil":ate999(mil)+" mil";s=s?s+((r===0)?" e ":", ")+tm:tm;}
    if(r)s=liga(s,{v:r,txt:ate999(r)});
    return s;
  }
  var v=Math.round(num(valor)*100),reais=Math.floor(v/100),cent=v%100,out="";
  if(reais){out=inteiro(reais)+(reais===1?" real":((reais%1e6===0)?" de reais":" reais"));}
  if(cent){out+=(out?" e ":"")+inteiro(cent)+(cent===1?" centavo":" centavos");}
  return out||"zero reais";
}

var toastT;
function toast(msg){
  var t=document.getElementById("sis-toast");
  if(!t){t=document.createElement("div");t.id="sis-toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t);}
  t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true;},2800);
}
function copiar(texto){
  if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(texto).then(function(){toast("Copiado.");},function(){window.prompt("Copie o texto:",texto);});}
  window.prompt("Copie o texto:",texto);return Promise.resolve();
}

/* Capacidades da página publicada (claude.use); fora dela tudo volta null */
var usos={};
function usar(nome){
  if(nome==="assets"&&SB&&Store.modo==="db")return Promise.resolve(Sessao.conta==="adm"?assetsSupa:null);
  if(!usos[nome]){
    usos[nome]=new Promise(function(ok){
      try{if(window.claude&&typeof window.claude.use==="function"){window.claude.use(nome).then(ok,function(){ok(null);});return;}}catch(e){}
      ok(null);
    });
  }
  return usos[nome];
}

/* ---------- tabelas fixas ---------- */
var FINALIDADES={foto:"Produção para foto",cliente:"Cliente final",mostra:"Exposição ou mostra"};
var FINALIDADE_CAPS={foto:"PRODUÇÃO PARA FOTO",cliente:"CLIENTE FINAL",mostra:"MOSTRA"};
var ST={
  proposta:{nova:["Nova","#7D7A75"],enviada:["Enviada","#5F6F7A"],aceita:["Aceita","#3E6B48"],recusada:["Recusada","#9A3B2E"]},
  contrato:{enviado:["Enviado","#5F6F7A"],assinado:["Assinado","#3E6B48"],cancelado:["Cancelado","#9A3B2E"],rascunho:["Rascunho","#7D7A75"]}, /* "concluido" antigo conta como Assinado */
  producao:{planejada:["Planejada","#7D7A75"],andamento:["Em produção","#B08A3E"],concluida:["Concluída","#3E6B48"],cancelada:["Cancelada","#9A3B2E"]},
  equipe:{pendente:["Aguardando liberação","#B08A3E"],ativo:["Liberado","#3E6B48"],bloqueado:["Bloqueado","#9A3B2E"]},
  financeiro:{pago:["Pago","#3E6B48"],pendente:["Pendente","#B08A3E"]}
};
function tag(grupo,v){var s=(ST[grupo]||{})[v]||[v||"—","#B5ADA2"];return '<span class="tag" style="--c:'+s[1]+'">'+esc(s[0])+'</span>';}
function opcoes(grupo){var g=ST[grupo]||{};return Object.keys(g).map(function(k){return [k,g[k][0]];});}

/* ---------- ajustes padrão ---------- */
var PADRAO={
  calc:{base:1500,adicional:1000,m2Base:20,m2Extra:30,fatorFoto:0,fatorMostra:0,fatorCliente:20,semProjeto:20,urgDias:15,urgPerc:15,deslocamento:350,cidadesBase:"Florianópolis, São Paulo",arredondar:50,diasPorAmbiente:1,diasMin:2,ambPorAjudante:2},
  whatsappAdm:"+55 48 99621-0587",
  siteUrl:"https://shyltonmavie.com/",
  contratado:{nome:"Shylton Mattos Vieira",nacionalidade:"brasileiro",profissao:"arquiteto e urbanista",cpf:"",cau:"",endereco:"",email:["shyltonmattosvieira","gmail.com"].join("@"),telefone:"+55 48 9 9621-0587",instagram:"@shyltu",cidade:"Florianópolis, SC / BRASIL",pix:"",marca:"MATO Produção"},
  contrato:{sinal:50,limiteDespesa:300,diaria:800,prazoConceito:7,prazoAprovacao:3,revisoes:1,diasCancel:15,retencao:20,retencaoMax:50,prazoFotos:30,multaFotos:20,foro:"Florianópolis/SC",cidade:"Florianópolis"},
  proposta:{
    pagamento:"À vista",
    etapas:"Conceito, Pré Produção e Produção",
    exclusoes:"Não estão incluídos projetos estruturais, detalhamento de marcenaria executiva, projetos de engenharia, compra de flores ou compra de mobiliário.",
    observacoes:"o cliente terá que fornecer todos os documentos necessários para a elaboração da produção.\ncaso haja alteração de área o valor total poderá ser alterado.\nos prazos ficam condicionados às aprovações solicitadas ao cliente.\ngastos extras serão cobrados diretamente ao cliente, como folhagem, avarias de peças e outros.",
    creditos:"fica acordado que toda e qualquer foto ou material visual publicado deverá conter os devidos créditos"
  }
};
function cfg(){
  var c=Store.get("config","geral")||{};
  function m(k){return Object.assign({},PADRAO[k],c[k]||{});}
  return {calc:m("calc"),contratado:m("contratado"),contrato:m("contrato"),proposta:m("proposta"),whatsappAdm:c.whatsappAdm||PADRAO.whatsappAdm,siteUrl:c.siteUrl||PADRAO.siteUrl};
}

/* ---------- calculadora ---------- */
function calcular(p){
  var c=cfg().calc;
  var amb=(p.ambientes||[]).filter(function(a){return a&&(String(a.nome||"").trim()||num(a.m2));});
  var n=Math.max(1,amb.length),itens=[];
  itens.push({rot:"1º ambiente (até "+fmtNum(c.m2Base)+" m²)",v:num(c.base)});
  if(n>1)itens.push({rot:(n-1)+(n-1===1?" ambiente adicional":" ambientes adicionais")+" × "+brl(c.adicional),v:(n-1)*num(c.adicional)});
  var exced=amb.reduce(function(s,a){return s+Math.max(0,num(a.m2)-num(c.m2Base));},0);
  if(exced>0)itens.push({rot:"Área excedente: "+fmtNum(exced)+" m² × "+brl(c.m2Extra),v:exced*num(c.m2Extra)});
  var sub=itens.reduce(function(s,i){return s+i.v;},0);
  var fat={foto:c.fatorFoto,mostra:c.fatorMostra,cliente:c.fatorCliente}[p.finalidade];
  if(num(fat))itens.push({rot:"Finalidade: "+(FINALIDADES[p.finalidade]||"")+" (+"+fmtNum(fat)+"%)",v:sub*num(fat)/100});
  if(!p.temProjeto&&num(c.semProjeto))itens.push({rot:"Sem projeto ou SketchUp: conceito a desenvolver (+"+fmtNum(c.semProjeto)+"%)",v:sub*num(c.semProjeto)/100});
  if(p.dataSugerida){
    var base=(p.criadaEm||agoraISO()).slice(0,10),d=diasEntre(base,p.dataSugerida);
    if(d>=0&&d<num(c.urgDias)&&num(c.urgPerc))itens.push({rot:"Data em menos de "+fmtNum(c.urgDias)+" dias (+"+fmtNum(c.urgPerc)+"%)",v:sub*num(c.urgPerc)/100});
  }
  var bases=String(c.cidadesBase||"").split(",").map(normal).filter(Boolean);
  var loc=normal(p.cliente&&p.cliente.local);
  if(loc&&num(c.deslocamento)&&!bases.some(function(b){return loc.indexOf(b)>=0;}))itens.push({rot:"Deslocamento (fora de "+c.cidadesBase+")",v:num(c.deslocamento)});
  var total=itens.reduce(function(s,i){return s+i.v;},0),arr=num(c.arredondar)||1;
  total=Math.ceil(Math.round(total*100)/100/arr)*arr;
  return {itens:itens,total:total,n:n,
    dias:Math.max(num(c.diasMin)||1,Math.ceil(n*(num(c.diasPorAmbiente)||1))),
    ajudantes:Math.max(1,Math.ceil(n/(num(c.ambPorAjudante)||2)))};
}

/* ---------- dados ----------
   Na página publicada: banco do artifact (claude.use("db")), com regras que deixam
   propostas, contratos, clientes, parceiros, equipe e financeiro só para o adm.
   Fora dela: modo demonstração no navegador (localStorage). */
var LS="sm-sistema-v1";
var COLS_ADM=["propostas","clientes","contratos","producoes","financeiro","parceiros","tarefas","agenda","equipe","avisos","config","time"];
var COLS_COLAB=["tarefas","agenda","parceiros","producoes","time"];
var Store={
  modo:"carregando",db:null,dados:{},ouvintes:[],carregado:{},assinadas:"",
  get:function(col,id){return (this.dados[col]||{})[id]||null;},
  copia:function(col,id){var d=this.get(col,id);return d?Object.assign({id:id},clone(d)):null;},
  list:function(col){var m=this.dados[col]||{};return Object.keys(m).map(function(id){return Object.assign({id:id},m[id]);});},
  salvar:function(col,id,dados){
    var self=this;id=id||uid();
    var corpo=clone(dados)||{};delete corpo.id;corpo.atualizadoEm=agoraISO();
    if(this.modo==="db"){
      return this.db.collection(col).doc(id).set(corpo).then(function(){(self.dados[col]=self.dados[col]||{})[id]=corpo;mudou();return id;});
    }
    (this.dados[col]=this.dados[col]||{})[id]=corpo;this.gravar();mudou();return Promise.resolve(id);
  },
  excluir:function(col,id){
    var self=this;
    function fim(){if(self.dados[col])delete self.dados[col][id];if(self.modo!=="db")self.gravar();mudou();}
    if(this.modo==="db")return this.db.collection(col).doc(id).delete().then(fim);
    fim();return Promise.resolve();
  },
  gravar:function(){try{localStorage.setItem(LS,JSON.stringify(this.dados));}catch(e){toast("Não foi possível guardar neste navegador.");}},
  ler:function(){try{this.dados=JSON.parse(localStorage.getItem(LS)||"{}")||{};}catch(e){this.dados={};}},
  assinar:function(cols){
    var self=this,chave=cols.join(",");
    if(this.modo!=="db"||this.assinadas===chave)return;
    this.ouvintes.forEach(function(u){try{u();}catch(e){}});this.ouvintes=[];this.assinadas=chave;
    cols.forEach(function(col){
      self.carregado[col]=false;
      var un=self.db.collection(col).onSnapshot(function(snap){
        var m={};snap.docs.forEach(function(d){m[d.id]=d.data();});self.dados[col]=m;
        if(!snap.metadata.fromCache)self.carregado[col]=true;
        mudou();
      },function(){self.carregado[col]=true;mudou();});
      self.ouvintes.push(un);
    });
  }
};
function proxNum(col,prefixo){
  var aa=String(new Date().getFullYear()).slice(2),ini=prefixo+aa+"-";
  var maior=Store.list(col).reduce(function(m,x){var s=String(x.num||"");return s.indexOf(ini)===0?Math.max(m,parseInt(s.slice(ini.length),10)||0):m;},0);
  return ini+String(maior+1).padStart(3,"0");
}

/* ---------- Supabase: biblioteca, tabela "registros" no formato coleção/documento, arquivos ---------- */
function carregarSupa(){
  if(SB)return Promise.resolve(SB);
  return new Promise(function(ok,erro){
    var s=document.createElement("script");s.src=SUPA.lib;s.onload=ok;s.onerror=erro;document.head.appendChild(s);
  }).then(function(){
    SB=window.supabase.createClient(SUPA.url,SUPA.chave,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"implicit"}});
    SB.auth.onAuthStateChange(function(ev){if(ev==="PASSWORD_RECOVERY"){Sessao.recuperar=true;setTimeout(render,0);}});
    return SB;
  });
}
function okSb(r){if(r&&r.error)throw r.error;return r;}
var TAB="registros";
function dbSupa(sb){
  function col(c){return {
    doc:function(id){return {
      set:function(d){return sb.from(TAB).upsert({colecao:c,id:id,dados:d,atualizado_em:agoraISO()}).then(okSb);},
      "delete":function(){return sb.from(TAB).delete().eq("colecao",c).eq("id",id).then(okSb);},
      get:function(){return sb.from(TAB).select("dados").eq("colecao",c).eq("id",id).maybeSingle().then(function(r){okSb(r);return {exists:!!r.data,data:function(){return r.data?r.data.dados:null;}};});}
    };},
    /* Carrega a coleção e acompanha mudanças ao vivo (Realtime respeita as regras do banco) */
    onSnapshot:function(ok,erro){
      var vivo=true,m={},canal=null;
      function snap(){return {docs:Object.keys(m).map(function(id){return {id:id,data:function(){return m[id];}};}),metadata:{fromCache:false}};}
      sb.from(TAB).select("id,dados").eq("colecao",c).then(function(r){
        if(!vivo)return;
        if(r.error){if(erro)erro(r.error);return;}
        (r.data||[]).forEach(function(x){m[x.id]=x.dados;});ok(snap());
      });
      canal=sb.channel("reg-"+c+"-"+uid()).on("postgres_changes",{event:"*",schema:"public",table:TAB},function(p){
        if(!vivo)return;
        var n=p["new"]||{},o=p.old||{};
        if(p.eventType==="DELETE"){if(o.colecao!==c||!(o.id in m))return;delete m[o.id];}
        else{if(n.colecao!==c)return;m[n.id]=n.dados;}
        ok(snap());
      }).subscribe();
      return function(){vivo=false;if(canal)sb.removeChannel(canal);};
    }
  };}
  return {collection:col};
}
/* Arquivos: pasta privada "arquivos"; para abrir, gera um link temporário (1 hora) */
var assetsSupa={upload:function(f,o){
  var nome=String(f.name||"arquivo").normalize("NFD").replace(/[^\w.\-]+/g,"-").slice(-80),caminho=uid()+"-"+nome;
  return SB.storage.from("arquivos").upload(caminho,f,{contentType:(o&&o.type)||f.type,upsert:false}).then(function(r){okSb(r);return {id:"sb:"+caminho};});
}};
var linksArq={};
function urlSupa(caminho){
  var u=linksArq[caminho];
  if(u&&u.url&&u.ate>Date.now())return u.url;
  if(SB&&!(u&&u.pedindo)){
    linksArq[caminho]={pedindo:true};
    SB.storage.from("arquivos").createSignedUrl(caminho,3600).then(function(r){
      if(r&&r.data&&r.data.signedUrl){linksArq[caminho]={url:r.data.signedUrl,ate:Date.now()+3500e3};mudou();}else delete linksArq[caminho];
    },function(){delete linksArq[caminho];});
  }
  return "";
}

/* ---------- sessão ----------
   Só entra com login (e-mail e senha), como administrador ou colaborador.
   Domínio próprio: login do Supabase; o papel vem da tabela "membros" (função meu_papel).
   Site publicado: a conta define o papel (Editor = adm, Contributor = colaborador; quem só visualiza não entra)
   e a senha de cada pessoa fica em acessos/<id>, que só ela e o adm leem.
   Fora do site publicado (teste local): modo demonstração, tudo guardado só no navegador. */
var Sessao={papel:null,conta:null,nome:"",membroId:"",userId:"",email:"",previa:false,fora:false,supa:false,recuperar:false,aviso:""};
var SS="sm-sessao",prep=null;
function lerSessao(){try{return JSON.parse(sessionStorage.getItem(SS)||"null");}catch(e){return null;}}
function entrarSupa(user){
  Sessao.userId=user.id;Sessao.email=String(user.email||"").toLowerCase();
  Sessao.nome=(user.user_metadata&&user.user_metadata.nome)||"";
  return SB.rpc("meu_papel").then(function(r){
    var papel=r&&!r.error&&(r.data==="adm"||r.data==="colab")?r.data:null;
    Sessao.conta=papel;
    if(papel)entrar(papel);
    return papel;
  });
}
function prepararSupa(){
  Sessao.supa=true;
  /* Links dos e-mails (confirmação e nova senha) voltam com os dados no endereço; lidos antes que a biblioteca os limpe */
  var h0=location.hash||"";
  if(/type=recovery/.test(h0))Sessao.recuperar=true;
  var erroLink=/error_description=([^&]*)/.exec(h0);
  if(erroLink)Sessao.aviso=/expired|invalid/i.test(decodeURIComponent(erroLink[1].replace(/\+/g," ")))?"Este link expirou ou já foi usado. Peça um novo abaixo.":"Não foi possível usar este link. Tente de novo.";
  return carregarSupa().then(function(sb){
    Store.db=dbSupa(sb);Store.modo="db";
    return sb.auth.getSession().then(function(r){
      if(/access_token=|error=/.test(h0))history.replaceState(null,"",location.pathname+location.search+"#adm");
      var s=r&&r.data&&r.data.session;
      if(s&&!Sessao.recuperar)return entrarSupa(s.user);
      if(s)Sessao.userId=s.user.id;
    });
  });
}
function preparar(){
  if(prep)return prep;
  if(!noClaude()&&SUPA.url){prep=prepararSupa();prep.catch(function(){prep=null;});return prep;}
  /* Dentro do site publicado sem banco (visitante sem conta): não há demonstração, ninguém entra */
  Sessao.fora=!!(window.claude&&typeof window.claude.use==="function");
  prep=usar("db").then(function(db){
    if(db){
      Store.db=db;Store.modo="db";Sessao.fora=false;
      return usar("user").then(function(user){
        if(!user)return;
        var pode=typeof user.can==="function"?user.can("data.write").catch(function(){return null;}):Promise.resolve(null);
        var dono=typeof user.isOwner==="function"?Promise.resolve(user.isOwner()).catch(function(){return false;}):false;
        return Promise.all([user.canEdit(),user.me(),pode,dono]).then(function(r){
          Sessao.conta=r[0]?"adm":(r[2]===false?null:"colab");Sessao.nome=(r[1]&&r[1].name)||"";Sessao.userId=(r[1]&&r[1].id)||"";Sessao.dono=r[3]===true;
          var s=lerSessao();if(Sessao.conta&&Sessao.userId&&s&&s.userId===Sessao.userId)entrar(Sessao.dono?"adm":papelFinal(s.papel));
        });
      });
    }
    Store.modo="local";Store.ler();
    if(Sessao.fora)return;
    var s=lerSessao();if(s&&s.papel)entrar(s.papel,s.membroId,s.nome);
  });
  return prep;
}
function entrar(papel,membroId,nome){
  Sessao.papel=papel;Sessao.membroId=membroId||"";if(nome)Sessao.nome=nome;Sessao.previa=false;
  try{sessionStorage.setItem(SS,JSON.stringify({papel:papel,nome:Sessao.nome,membroId:Sessao.membroId,userId:Sessao.userId}));}catch(e){}
  if(Store.modo==="db")Store.assinar(papel==="adm"?COLS_ADM:COLS_COLAB);
}
function sair(){
  if(Sessao.supa&&SB){SB.auth.signOut();Sessao.conta=null;Sessao.userId="";Sessao.email="";Sessao.nome="";Sessao.recuperar=false;}
  Sessao.papel=null;Sessao.membroId="";Sessao.previa=false;try{sessionStorage.removeItem(SS);}catch(e){}
  if(Store.modo==="db"){Store.ouvintes.forEach(function(u){try{u();}catch(e){}});Store.ouvintes=[];Store.assinadas="";Store.dados={};}
  location.hash="#adm";render();
}
/* Senha: PBKDF2 (SHA-256) com sal aleatório; a senha em si nunca é guardada */
function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(b){return ("0"+b.toString(16)).slice(-2);}).join("");}
function novoSal(){var a=new Uint8Array(16);crypto.getRandomValues(a);return hex(a);}
function hashSenha(senha,sal){
  var enc=new TextEncoder();
  return crypto.subtle.importKey("raw",enc.encode(senha),"PBKDF2",false,["deriveBits"]).then(function(k){
    return crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode(sal),iterations:150000,hash:"SHA-256"},k,256);
  }).then(hex);
}
/* Membros liberados: em Equipe, só quem é Membro (sim) e está ativo entra.
   No site publicado, a liberação fica em liberados/<hash do e-mail>, que o colaborador consegue ler e só o adm grava.
   O dono do site sempre entra como administrador. */
function hashEmail(e){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(e||"").trim().toLowerCase())).then(hex);}
function membroLiberado(m){return !!(m&&m.membro==="sim"&&m.status==="ativo");}
function papelFinal(lib){return Sessao.conta==="adm"&&lib==="adm"?"adm":"colab";}
function liberadoDb(email){
  if(Sessao.dono)return Promise.resolve("adm");
  return hashEmail(email).then(function(h){return Store.db.collection("liberados").doc(h).get();})
    .then(function(s){return s.exists?((s.data()||{}).papel||"colab"):null;},function(){return null;});
}
function sincAcesso(antes,depois){
  if(Sessao.supa&&SB){
    /* Equipe → tabela membros. Nunca mexe no acesso de quem está logado, para o adm não se trancar fora */
    var ea=String(antes&&antes.email||"").trim().toLowerCase(),ed=String(depois&&depois.email||"").trim().toLowerCase(),p=[];
    if(ea&&ea!==ed&&ea!==Sessao.email)p.push(SB.from("membros").delete().eq("email",ea).then(okSb));
    if(ed&&ed!==Sessao.email)p.push(membroLiberado(depois)
      ?SB.from("membros").upsert({email:ed,papel:depois.acesso==="adm"?"adm":"colab",ativo:true}).then(okSb)
      :SB.from("membros").update({ativo:false}).eq("email",ed).then(okSb));
    return Promise.all(p);
  }
  if(Store.modo!=="db")return Promise.resolve();
  var col=Store.db.collection("liberados"),ea=antes&&antes.email||"",ed=depois&&depois.email||"";
  return Promise.all([ea?hashEmail(ea):null,ed?hashEmail(ed):null]).then(function(h){
    var p=[];
    if(h[0]&&h[0]!==h[1])p.push(col.doc(h[0]).delete());
    if(h[1])p.push(membroLiberado(depois)?col.doc(h[1]).set({papel:depois.acesso==="adm"?"adm":"colab"}):col.doc(h[1]).delete());
    return Promise.all(p);
  });
}
function credDb(){
  if(!Sessao.userId)return Promise.resolve(null);
  return Store.db.collection("acessos").doc(Sessao.userId).get().then(function(s){return s.exists?s.data():null;},function(){return null;});
}
function verificar(email,senha,cred){
  if(Store.modo==="db"){
    if(!cred||String(cred.email||"").toLowerCase()!==email)return Promise.reject("E-mail ou senha incorretos.");
    return hashSenha(senha,cred.sal).then(function(h){
      if(h!==cred.hash)throw "E-mail ou senha incorretos.";
      return liberadoDb(email);
    }).then(function(lib){
      if(!lib)throw "Seu acesso não foi liberado. Fale com o Shylton.";
      return {papel:Sessao.dono?"adm":papelFinal(lib)};
    });
  }
  var c=Store.list("acessos").filter(function(x){return String(x.email||"").toLowerCase()===email;})[0];
  if(!c)return Promise.reject("E-mail ou senha incorretos.");
  return hashSenha(senha,c.sal).then(function(h){
    if(h!==c.hash)throw "E-mail ou senha incorretos.";
    if(c.id==="adm")return {papel:"adm",nome:"Shylton Mavie"};
    var m=Store.get("equipe",c.id);
    if(!membroLiberado(m))throw "Seu acesso não foi liberado. Fale com o Shylton.";
    return {papel:m.acesso==="adm"?"adm":"colab",membroId:c.id,nome:m.nome};
  });
}
function criarAcesso(email,senha){
  var sal=novoSal();
  if(Store.modo==="db"){
    if(!Sessao.userId)return Promise.reject("Não foi possível identificar sua conta. Recarregue a página.");
    var papel;
    return liberadoDb(email).then(function(lib){
      if(!lib)throw "Este e-mail não foi liberado. Peça ao Shylton para marcar você como membro na aba Equipe.";
      papel=Sessao.dono?"adm":papelFinal(lib);
      return hashSenha(senha,sal).then(function(h){
        return Store.db.collection("acessos").doc(Sessao.userId).set({email:email,sal:sal,hash:h,criadoEm:agoraISO()})
          .catch(function(){throw "Não foi possível criar sua senha agora. Tente de novo.";});
      });
    }).then(function(){return {papel:papel};});
  }
  var id,ret;
  if(!Store.get("acessos","adm")){id="adm";ret={papel:"adm",nome:"Shylton Mavie"};}
  else{
    var m=Store.list("equipe").filter(function(x){return membroLiberado(x)&&String(x.email||"").trim().toLowerCase()===email;})[0];
    if(!m)return Promise.reject("Este e-mail não foi liberado. Peça ao Shylton para marcar você como membro na aba Equipe.");
    if(Store.get("acessos",m.id))return Promise.reject("Este e-mail já tem senha. Use Entrar.");
    id=m.id;ret={papel:m.acesso==="adm"?"adm":"colab",membroId:m.id,nome:m.nome};
  }
  return hashSenha(senha,sal).then(function(h){return Store.salvar("acessos",id,{email:email,sal:sal,hash:h});}).then(function(){return ret;});
}
function ehAdm(){return Sessao.papel==="adm"&&!Sessao.previa;}

/* ---------- rotas ---------- */
var NAV=[["inicio","Início"],["producoes","Produções"],["tarefas","Tarefas"],["calendario","Calendário"],["clientes","Clientes"],["equipe","Equipe"],["parceiros","Parceiros"],["financeiro","Financeiro"],["propostas","Propostas"],["contratos","Contratos"],["ajustes","Ajustes"]];
var DO_COLAB=["producoes","tarefas","calendario","parceiros"];
var PAI={proposta:"propostas",contrato:"contratos",producao:"producoes",revisao:"contratos"};
SIS.mod={};
var vista=null;
function rotaAtual(){return (location.hash||"").slice(1);}
function trata(h){return /^adm(\/|$)/.test(h)||h==="cadastro-cliente"||/(^|&)(access_token|error_description)=/.test(h);}
/* Estilos, fontes dos documentos e módulos só são baixados quando a área restrita abre */
var extrasP=null;
function extras(){
  if(extrasP)return extrasP;
  function css(href){return new Promise(function(ok){var l=document.createElement("link");l.rel="stylesheet";l.href=href;l.onload=ok;l.onerror=ok;document.head.appendChild(l);});}
  function js(src){return new Promise(function(ok,erro){var s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=erro;document.body.appendChild(s);});}
  css("https://fonts.googleapis.com/css2?family=Lexend:wght@200;300;400;500;600&family=Lexend+Exa:wght@300;600&display=swap");
  extrasP=Promise.all([css("sistema.css"),js("sis-docs.js"),js("sis-modulos.js")]);
  extrasP.catch(function(){extrasP=null;});
  return extrasP;
}
function mostrar(){
  var raiz=document.getElementById("sis");raiz.hidden=false;
  if(!raiz.firstChild)raiz.innerHTML='<p class="vazio-sis" style="padding:var(--s-48) var(--g-l)">Carregando…</p>';
  Promise.all([preparar(),extras()]).then(render,function(){raiz.innerHTML='<p class="vazio-sis" style="padding:var(--s-48) var(--g-l)">Não foi possível abrir a área restrita. Recarregue a página.</p>';});
}
function esconder(){var r=document.getElementById("sis");if(r){r.hidden=true;}fecharModal();vista=null;}
var mudou=debounce(function(){
  var raiz=document.getElementById("sis");
  if(!raiz||raiz.hidden||!vista)return;
  if(vista.atualizar)vista.atualizar();
  else if(vista.vivo)render();
},120);

function render(){
  var raiz=document.getElementById("sis");if(!raiz||raiz.hidden)return;
  var h=rotaAtual();
  if(h==="cadastro-cliente"){vista=null; /* equipe não tem link público: só o adm cadastra membros */SIS.publica(raiz,h);return;}
  var ps=h.split("/"),nome=ps[1]||"",id=ps.slice(2).join("/");
  if(!Sessao.papel){telaEntrada(raiz);return;}
  var colab=!ehAdm();
  if(nome==="painel"){location.replace("#adm/inicio");return;}
  if(!nome)nome=colab?"tarefas":"inicio";
  var raizMod=PAI[nome]||nome;
  if(colab&&DO_COLAB.indexOf(raizMod)<0){location.replace("#adm/tarefas");return;}
  var mod=SIS.mod[nome];
  if(!mod){location.replace("#adm");return;}
  raiz.innerHTML=cascaHTML(raizMod);
  ligarCasca(raiz);
  vista={nome:nome,id:id,vivo:!!mod.vivo,atualizar:null};
  try{mod.render($("#sis-main"),id,vista);}catch(e){$("#sis-main").innerHTML='<p class="vazio-sis">Algo deu errado ao abrir esta tela. Volte ao início e tente de novo.</p>';if(window.console)console.error(e);}
}

/* Mesma assinatura do cabeçalho do site (símbolo + nome, sem traço); o link que a envolve leva a classe barra__logo */
function logoSVG(){return '<svg class="barra__simb" viewBox="0 0 96 148" aria-hidden="true" focusable="false"><use href="#g-simb-v" fill="currentColor"/></svg><span class="barra__nome">Shylton Mavie</span>';}
/* Ícones da barra lateral: traço 1.5 em grade de 24, sem preenchimento */
var ICO={
  inicio:'<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-6h4v6"/>',
  propostas:'<path d="M14 3.5H5.5v17h13V8z"/><path d="M14 3.5V8h4.5"/><path d="M8.5 12.5h7M8.5 16h7"/>',
  producoes:'<path d="M3.5 7.5h4l2-3h5l2 3h4v12h-17z"/><circle cx="12" cy="13" r="3.5"/>',
  financeiro:'<path d="M3.5 20.5h17"/><path d="M7 17v-5M12 17V6.5M17 17V9.5"/>',
  contratos:'<path d="M3.5 20.5h8"/><path d="M15.5 4l4.5 4.5L9.5 19h-4.5v-4.5z"/>',
  clientes:'<circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4.3 3.6-7 8-7s8 2.7 8 7"/>',
  calendario:'<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  parceiros:'<path d="M10.5 13.5a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1"/><path d="M13.5 10.5a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/>',
  tarefas:'<rect x="3.5" y="3.5" width="17" height="17"/><path d="M8 12.5l3 3 5.5-6"/>',
  equipe:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.6c2.1.8 3.5 2.8 3.5 5.9"/>',
  ajustes:'<path d="M3.5 7h10M18.5 7h2M3.5 17h2M10.5 17h10"/><circle cx="16" cy="7" r="2.5"/><circle cx="8" cy="17" r="2.5"/>',
  previa:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  sair:'<path d="M13.5 3.5h-8v17h8"/><path d="M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5"/>',
  site:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.1 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.1-3.5-8.5s1.2-6.2 3.5-8.5z"/>'
};
function ico(n){return '<svg class="sb__ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+ICO[n]+'</svg>';}
function sbItem(tag,attrs,icone,texto){return '<'+tag+' class="sb__item" '+attrs+'>'+ico(icone)+'<span class="sb__txt">'+texto+'</span></'+tag+'>';}
/* Logo da barra: o símbolo fica sempre visível; o nome aparece quando a barra abre */
function logoSB(){return '<svg class="logo sb__simb" viewBox="0 0 96 148" aria-hidden="true" focusable="false"><use href="#g-simb-v" fill="currentColor"/></svg><span class="sb__marca">Shylton Mavie</span>';}
function cascaHTML(ativo){
  var colab=!ehAdm(),itens=NAV.filter(function(n){return !colab||DO_COLAB.indexOf(n[0])>=0;});
  var papel=colab?"Colaborador":"Administrador",nome=Sessao.nome||papel;
  var ini=nome.split(/\s+/).filter(Boolean).slice(0,2).map(function(p){return p.charAt(0);}).join("").toUpperCase();
  var pe=['<div class="sb__item sb__quem"><span class="sb__ini" aria-hidden="true">'+esc(ini)+'</span><span class="sb__txt">'+esc(nome)+'<small>'+papel+'</small></span></div>'];
  if(Sessao.papel==="adm")pe.push(sbItem("button",'type="button" data-previa',"previa",Sessao.previa?"Ver como administrador":"Ver como colaborador"));
  pe.push(sbItem("button",'type="button" data-sair',"sair","Sair"));
  pe.push(sbItem("a",'href="#inicio"',"site","Ver o site"));
  var modo=Store.modo==="local"?'<p class="sis-modo">Modo demonstração: os dados ficam só neste navegador. No site publicado com servidor, os dados ficam no banco e cada pessoa entra com o próprio login.</p>':(Sessao.previa?'<p class="sis-modo">Você está vendo a área como um colaborador vê: Produções e Parceiros (só consulta, sem valores), Tarefas e Calendário.</p>':"");
  return '<header class="sis-topo-m"><a href="#adm" class="sis-topo-m__logo barra__logo" aria-label="Área restrita, início">'+logoSVG()+'</a><button type="button" class="menu-btn" data-sb-abrir aria-expanded="false" aria-controls="sis-sb">Menu</button></header>'+
    '<aside class="sb" id="sis-sb" aria-label="Menu da área restrita">'+
      '<div class="sb__topo"><a href="#adm" class="sb__logo" aria-label="Área restrita, início">'+logoSB()+'</a><button type="button" class="sb__fechar" data-sb-fechar>Fechar</button></div>'+
      '<nav class="sb__nav" aria-label="Área restrita">'+itens.map(function(n){return sbItem("a",'href="#adm/'+n[0]+'"'+(n[0]===ativo?' aria-current="page"':''),n[0],n[1]);}).join("")+'</nav>'+
      '<div class="sb__pe">'+pe.join("")+'</div>'+
    '</aside><div class="sb-veu" data-sb-fechar hidden></div>'+
    '<div class="sis-cont">'+modo+'<main class="sis-main" id="sis-main"></main></div>';
}
function ligarCasca(raiz){
  var b=$("[data-previa]",raiz);if(b)b.addEventListener("click",function(){Sessao.previa=!Sessao.previa;location.hash=Sessao.previa?"#adm/tarefas":"#adm";render();});
  var s=$("[data-sair]",raiz);if(s)s.addEventListener("click",sair);
  /* Celular e telas sem mouse: a barra vira gaveta aberta pelo botão Menu */
  var sb=$("#sis-sb",raiz),veu=$(".sb-veu",raiz),abrir=$("[data-sb-abrir]",raiz);
  function gaveta(v,foco){
    sb.classList.toggle("aberta",v);veu.hidden=!v;abrir.setAttribute("aria-expanded",v?"true":"false");
    if(foco)(v?$("[data-sb-fechar]",sb):abrir).focus();
  }
  abrir.addEventListener("click",function(){gaveta(true,true);});
  $$("[data-sb-fechar]",raiz).forEach(function(x){x.addEventListener("click",function(){gaveta(false,true);});});
  sb.addEventListener("keydown",function(e){if(e.key==="Escape"&&sb.classList.contains("aberta"))gaveta(false,true);});
  sb.addEventListener("click",function(e){if(e.target.closest("a"))gaveta(false,false);});
}

/* Tela de entrada: "entrar" (e-mail e senha) ou "criar" (primeiro acesso / nova senha) */
/* Domínio próprio (Supabase): entrar · primeiro acesso · esqueci a senha · nova senha · conta sem liberação */
/* Campo de senha com botão para mostrar/ocultar o que foi digitado (o botão fica fora do label, como pede o HTML) */
var OLHO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var OLHO_FECHADO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/></svg>';
function campoSenha(rotulo,id,auto){
  return '<div class="f"><label for="'+id+'">'+rotulo+'</label><div class="senha"><input type="password" id="'+id+'" autocomplete="'+auto+'" required>'+
    '<button type="button" class="senha__ver" data-ver-senha="'+id+'" aria-label="Mostrar senha" aria-pressed="false">'+OLHO+'</button></div></div>';
}
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-ver-senha]");if(!b)return;
  var i=document.getElementById(b.getAttribute("data-ver-senha"));if(!i)return;
  var ver=i.type==="password";
  i.type=ver?"text":"password";
  b.setAttribute("aria-pressed",ver?"true":"false");b.setAttribute("aria-label",ver?"Ocultar senha":"Mostrar senha");
  b.innerHTML=ver?OLHO_FECHADO:OLHO;i.focus();
});
function msgErroSupa(e){
  var c=(e&&e.code)||"",m=String(e&&e.message||"");
  if(c==="invalid_credentials"||/invalid login/i.test(m))return "E-mail ou senha incorretos.";
  if(c==="email_not_confirmed"||/not confirmed/i.test(m))return "Confirme seu e-mail antes de entrar: abra o link que enviamos (olhe também o spam).";
  if(/rate_limit/.test(c)||(e&&e.status===429))return "Muitas tentativas ou e-mails seguidos. Espere alguns minutos e tente de novo.";
  if(c==="weak_password")return "Senha fraca. Use pelo menos 8 caracteres, com letras e números.";
  if(c==="user_already_exists")return "Este e-mail já tem cadastro. Use Entrar ou Esqueci minha senha.";
  if(c==="same_password")return "A nova senha precisa ser diferente da anterior.";
  /* O banco recusa conta de e-mail que o adm não liberou na aba Equipe (gatilho so_liberados) */
  if(/database error saving new user|acesso_nao_liberado/i.test(m))return "Este e-mail não foi liberado. Só cria acesso quem o Shylton autorizar na aba Equipe.";
  return "Não foi possível concluir agora. Tente de novo.";
}
function telaSupa(raiz,modo){
  vista=null;
  var topo='<div class="entrada"><a href="#inicio" class="barra__logo" aria-label="Shylton Mavie, voltar ao site">'+logoSVG()+'</a><h1>Área restrita</h1>';
  var fim='<p class="entrada__pe"><a class="lnk" href="#inicio">Voltar ao site</a></p></div>';
  if(Sessao.recuperar)modo="nova";
  else if(Sessao.userId&&!Sessao.conta)modo="sem";
  modo=modo||"entrar";
  var aviso=Sessao.aviso?'<p class="status erro">'+esc(Sessao.aviso)+'</p>':"";Sessao.aviso="";
  if(modo==="sem"){
    raiz.innerHTML=topo+'<p>Você entrou como <strong>'+esc(Sessao.email)+'</strong>, mas esse e-mail ainda não foi liberado. Peça ao Shylton para liberar seu acesso na aba Equipe.</p><div class="acoes"><button type="button" class="btn btn--linha" data-sair>Sair</button></div>'+fim;
    $("[data-sair]",raiz).addEventListener("click",sair);return;
  }
  var intro={entrar:"Entre com seu e-mail e senha. Acesso só para o administrador e os colaboradores liberados.",
    criar:"Primeiro acesso: use o e-mail liberado pelo Shylton e crie sua senha. Enviamos um link de confirmação para esse e-mail.",
    esqueci:"Digite seu e-mail. Enviamos um link para você criar uma nova senha.",
    nova:"Crie sua nova senha."}[modo];
  var botao={entrar:"Entrar",criar:"Criar acesso",esqueci:"Enviar link",nova:"Salvar nova senha"}[modo];
  var links=modo==="entrar"?'<button type="button" class="lnk" data-modo="esqueci">Esqueci minha senha</button><button type="button" class="lnk" data-modo="criar">Primeiro acesso</button>'
    :modo==="nova"?'':'<button type="button" class="lnk" data-modo="entrar">Já tenho senha</button>';
  var duas=modo==="criar"||modo==="nova";
  raiz.innerHTML=topo+'<p>'+intro+'</p>'+aviso+
    '<form class="entrada__caixa" id="lg-form" novalidate>'+
      (modo!=="nova"?'<label class="f">E-mail<input type="email" id="lg-email" autocomplete="'+(modo==="entrar"?"username":"email")+'" required></label>':'')+
      (modo!=="esqueci"?campoSenha((modo==="nova"?"Nova senha":"Senha")+(duas?' <small>Mínimo de 8 caracteres</small>':''),"lg-senha",duas?"new-password":"current-password"):'')+
      (duas?campoSenha("Confirmar senha","lg-senha2","new-password"):'')+
      '<div class="acoes"><button type="submit" class="btn btn--escuro">'+botao+'</button>'+links+'</div>'+
      '<p class="status" id="lg-status" role="status"></p>'+
    '</form>'+fim;
  $$("[data-modo]",raiz).forEach(function(b){b.addEventListener("click",function(){telaSupa(raiz,b.getAttribute("data-modo"));var e=$("#lg-email",raiz);if(e)e.focus();});});
  var f=$("#lg-form",raiz),st=$("#lg-status",raiz),ce=$("#lg-email",raiz),cs=$("#lg-senha",raiz),cs2=$("#lg-senha2",raiz);
  function erro(msg,campo){
    st.className="status erro";st.textContent=msg;
    [ce,cs,cs2].forEach(function(c){if(c)c.removeAttribute("aria-invalid");});
    if(campo){campo.setAttribute("aria-invalid","true");campo.focus();}
  }
  function pronto(msg){f.innerHTML='<p class="status">'+esc(msg)+'</p>';f.setAttribute("tabindex","-1");f.focus();}
  function seguir(papel){if(!papel){render();return;}location.hash=papel==="adm"?"#adm/inicio":"#adm/tarefas";render();}
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var email=ce?ce.value.trim().toLowerCase():"",senha=cs?cs.value:"",base=location.origin+location.pathname;
    if(ce&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return erro("Digite um e-mail válido.",ce);
    if(cs&&!senha)return erro("Digite a senha.",cs);
    if(duas&&senha.length<8)return erro("A senha precisa ter pelo menos 8 caracteres.",cs);
    if(duas&&senha!==cs2.value)return erro("As senhas não são iguais.",cs2);
    var btn=$("button[type=submit]",f);btn.disabled=true;st.className="status";st.textContent="Aguarde…";
    var acao;
    if(modo==="entrar")acao=SB.auth.signInWithPassword({email:email,password:senha}).then(function(r){if(r.error)throw r.error;return entrarSupa(r.data.user);}).then(seguir);
    else if(modo==="criar")acao=SB.auth.signUp({email:email,password:senha,options:{emailRedirectTo:base}}).then(function(r){
      if(r.error)throw r.error;
      if(r.data&&r.data.session)return entrarSupa(r.data.user).then(seguir);
      pronto("Enviamos um link de confirmação para "+email+". Abra o e-mail e clique no link para entrar (olhe também o spam). Se você já tinha cadastro, use Entrar.");
    });
    else if(modo==="esqueci")acao=SB.auth.resetPasswordForEmail(email,{redirectTo:base}).then(function(r){
      if(r.error)throw r.error;
      pronto("Se este e-mail tiver cadastro, enviamos um link para criar uma nova senha. Olhe também o spam.");
    });
    else acao=SB.auth.updateUser({password:senha}).then(function(r){
      if(r.error)throw r.error;Sessao.recuperar=false;toast("Senha alterada.");return entrarSupa(r.data.user);
    }).then(seguir);
    acao.catch(function(x){btn.disabled=false;if(cs)cs.value="";if(cs2)cs2.value="";erro(msgErroSupa(x),modo==="esqueci"?ce:cs);});
  });
}
function telaEntrada(raiz,modoPedido){
  if(Sessao.supa){telaSupa(raiz,modoPedido);return;}
  vista=null;
  var db=Store.modo==="db";
  var topo='<div class="entrada"><a href="#inicio" class="barra__logo" aria-label="Shylton Mavie, voltar ao site">'+logoSVG()+'</a><h1>Área restrita</h1>';
  var fim='<p class="entrada__pe"><a class="lnk" href="#inicio">Voltar ao site</a></p></div>';
  if(Sessao.fora||(db&&!Sessao.conta)){
    raiz.innerHTML=topo+'<p>'+(Sessao.fora?'Entre na sua conta para acessar. Só o administrador e os colaboradores liberados pelo Shylton entram aqui.':'Seu acesso ainda não foi liberado. Peça ao Shylton para liberar seu cadastro.')+'</p>'+fim;
    return;
  }
  if(db&&!modoPedido)raiz.innerHTML=topo+'<p>Carregando…</p></div>';
  (db?credDb():Promise.resolve(null)).then(function(cred){
    var primeiroAdm=!db&&!Store.get("acessos","adm");
    var modo=modoPedido||((db?!cred:primeiroAdm)?"criar":"entrar"),criar=modo==="criar";
    var intro=!criar?"Entre com seu e-mail e senha. Acesso só para o administrador e os colaboradores liberados."
      :db?(cred?"Crie uma nova senha. A senha anterior deixa de valer.":"Primeiro acesso: crie o e-mail e a senha que você vai usar para entrar como "+(Sessao.conta==="adm"?"administrador.":"colaborador."))
      :primeiroAdm?"Primeiro acesso do administrador: crie o e-mail e a senha de entrada."
      :"Primeiro acesso de membro: use o e-mail que o Shylton liberou na aba Equipe e crie sua senha.";
    var troca=!criar?'<button type="button" class="lnk" data-modo="criar">'+(db?"Esqueci minha senha":"Primeiro acesso de colaborador")+'</button>'
      :((db?cred:!primeiroAdm)?'<button type="button" class="lnk" data-modo="entrar">Já tenho senha</button>':'');
    raiz.innerHTML=topo+'<p>'+intro+'</p>'+
      '<form class="entrada__caixa" id="lg-form" novalidate>'+
        '<label class="f">E-mail<input type="email" id="lg-email" autocomplete="'+(criar?"email":"username")+'" required></label>'+
        campoSenha('Senha'+(criar?' <small>Mínimo de 8 caracteres</small>':''),"lg-senha",criar?"new-password":"current-password")+
        (criar?campoSenha("Confirmar senha","lg-senha2","new-password"):'')+
        '<div class="acoes"><button type="submit" class="btn btn--escuro">'+(criar?"Criar senha e entrar":"Entrar")+'</button>'+troca+'</div>'+
        '<p class="status" id="lg-status" role="status"></p>'+
      '</form>'+
      (db?'':'<p class="nota entrada__pe">Modo demonstração: e-mails, senhas e dados ficam guardados só neste navegador.</p>')+fim;
    ligarEntrada(raiz,criar,cred);
    if(modoPedido)$("#lg-email",raiz).focus();
  });
}
function ligarEntrada(raiz,criar,cred){
  $$("[data-modo]",raiz).forEach(function(b){b.addEventListener("click",function(){telaEntrada(raiz,b.getAttribute("data-modo"));});});
  var f=$("#lg-form",raiz),st=$("#lg-status",raiz),ce=$("#lg-email",raiz),cs=$("#lg-senha",raiz),cs2=$("#lg-senha2",raiz);
  function erro(msg,campo){
    st.className="status erro";st.textContent=msg;
    [ce,cs,cs2].forEach(function(c){if(c)c.removeAttribute("aria-invalid");});
    if(campo){campo.setAttribute("aria-invalid","true");campo.focus();}
  }
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var email=ce.value.trim().toLowerCase(),senha=cs.value;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return erro("Digite um e-mail válido.",ce);
    if(!senha)return erro("Digite a senha.",cs);
    if(criar&&senha.length<8)return erro("A senha precisa ter pelo menos 8 caracteres.",cs);
    if(criar&&senha!==cs2.value)return erro("As senhas não são iguais.",cs2);
    var btn=$("button[type=submit]",f);btn.disabled=true;st.className="status";st.textContent=criar?"Criando sua senha…":"Conferindo…";
    (criar?criarAcesso(email,senha):verificar(email,senha,cred)).then(function(r){
      entrar(r.papel,r.membroId,r.nome);
      location.hash=r.papel==="adm"?"#adm/inicio":"#adm/tarefas";render();
    },function(msg){btn.disabled=false;cs.value="";if(cs2)cs2.value="";erro(typeof msg==="string"?msg:"Não foi possível entrar. Tente de novo.",typeof msg==="string"&&/e-mail/i.test(msg)&&!/senha/i.test(msg)?ce:cs);});
  });
}

/* ---------- campos e modal ---------- */
var seq=0;
function campo(c,v){
  var id="c"+(++seq),req=c.req?" required":"",dis=c.ro?" readonly":"";
  if(v==null)v=c.pad!=null?c.pad:"";
  if(c.t==="check")return '<label class="chk'+(c.full?" f--full":"")+'" for="'+id+'"><input type="checkbox" id="'+id+'" data-k="'+c.k+'"'+(v?" checked":"")+'> '+esc(c.r)+'</label>';
  var inp;
  if(c.t==="area")inp='<textarea id="'+id+'" data-k="'+c.k+'"'+req+dis+' placeholder="'+esc(c.ph||"")+'"'+(c.alt?' style="min-height:'+c.alt+'px"':'')+'>'+esc(v)+'</textarea>';
  else if(c.t==="select"){
    inp='<select id="'+id+'" data-k="'+c.k+'"'+req+'>'+(c.o||[]).map(function(o){
      if(o&&o.grupo)return '<optgroup label="'+esc(o.grupo)+'">'+o.itens.map(function(x){var a=Array.isArray(x)?x:[x,x];return '<option value="'+esc(a[0])+'"'+(String(a[0])===String(v)?" selected":"")+'>'+esc(a[1])+'</option>';}).join("")+'</optgroup>';
      var a=Array.isArray(o)?o:[o,o];return '<option value="'+esc(a[0])+'"'+(String(a[0])===String(v)?" selected":"")+'>'+esc(a[1])+'</option>';
    }).join("")+'</select>';
  }else{
    var tipo=c.t==="money"||c.t==="pct"?"text":(c.t||"text"),extra="";
    if(c.t==="money"||c.t==="pct")extra=' inputmode="decimal" data-num="1"';
    if(c.t==="number")extra=' step="any" inputmode="decimal" data-num="1"';
    var val=(c.t==="money"&&v!==""&&v!=null)?fmtValor(v):v;
    inp='<input id="'+id+'" type="'+tipo+'" data-k="'+c.k+'" value="'+esc(val)+'"'+extra+req+dis+' placeholder="'+esc(c.ph||"")+'"'+(c.ac?' autocomplete="'+c.ac+'"':'')+'>';
  }
  return '<label class="f'+(c.full?" f--full":"")+'" for="'+id+'">'+esc(c.r)+(c.req?" *":"")+inp+(c.ajuda?'<small>'+esc(c.ajuda)+'</small>':'')+'</label>';
}
function campos(lista,dados){return lista.map(function(c){return campo(c,getPath(dados||{},c.k));}).join("");}
function lerCampos(raiz){
  var o={};
  $$("[data-k]",raiz).forEach(function(e){
    var v=e.type==="checkbox"?e.checked:String(e.value).trim();
    if(e.getAttribute("data-num"))v=v===""?"":num(v);
    setPath(o,e.getAttribute("data-k"),v);
  });
  return o;
}
function validar(raiz){
  var ok=true;
  $$("[required]",raiz).forEach(function(e){var vazio=!String(e.value).trim();e.setAttribute("aria-invalid",vazio?"true":"false");if(vazio&&ok){ok=false;e.focus();}});
  if(!ok)toast("Preencha os campos marcados com *.");
  return ok;
}
var dlg=null;
function fecharModal(){if(dlg){try{dlg.close();}catch(e){}dlg.remove();dlg=null;}}
function modal(o){
  fecharModal();
  dlg=document.createElement("dialog");dlg.className="modal";
  dlg.innerHTML='<div class="modal__cab"><p class="modal__sobre">'+esc(o.sobre||"Cadastro")+'</p><h2 class="modal__tit">'+esc(o.titulo||"")+'</h2></div>'+
    '<div class="modal__corpo">'+(o.corpo||"")+'</div><div class="modal__pe">'+(o.pe||"")+'</div>';
  document.body.appendChild(dlg);
  dlg.addEventListener("cancel",function(e){e.preventDefault();fecharModal();});
  dlg.addEventListener("click",function(e){if(e.target===dlg)fecharModal();});
  $$("[data-fechar]",dlg).forEach(function(b){b.addEventListener("click",fecharModal);});
  try{dlg.showModal();}catch(e){dlg.setAttribute("open","");}
  var p=$(".modal__corpo input, .modal__corpo select, .modal__corpo textarea",dlg);if(p&&!o.semFoco)p.focus();
  return dlg;
}
/* Formulário em modal: campos -> salvar/excluir */
function modalForm(o){
  var pe=(o.aoExcluir?'<button type="button" class="lnk lnk--perigo esq" data-excluir>Excluir</button>':'')+
    '<button type="button" class="btn btn--linha" data-fechar>× Cancelar</button>'+
    '<button type="button" class="btn btn--escuro" data-salvar>'+esc(o.salvarRot||"+ Adicionar")+'</button>';
  var d=modal({sobre:o.sobre,titulo:o.titulo,corpo:(o.antes||"")+'<div class="fgrid">'+campos(o.campos,o.dados)+'</div>'+(o.depois||""),pe:pe});
  if(o.aoAbrir)o.aoAbrir(d);
  $("[data-salvar]",d).addEventListener("click",function(){
    var corpo=$(".modal__corpo",d);if(!validar(corpo))return;
    var v=lerCampos(corpo),b=this;b.disabled=true;
    Promise.resolve(o.aoSalvar(v,d)).then(function(r){if(r!==false)fecharModal();else b.disabled=false;},function(e){b.disabled=false;erroGravar(e);});
  });
  var x=$("[data-excluir]",d);
  if(x)x.addEventListener("click",function(){if(!window.confirm(o.confirmar||"Excluir este cadastro? Essa ação não pode ser desfeita."))return;Promise.resolve(o.aoExcluir()).then(fecharModal,erroGravar);});
  return d;
}
function erroGravar(e){
  if(window.console)console.error(e);
  var c=e&&e.code;
  toast(c==="invalid_argument"||c==="42501"?"Você não tem permissão para gravar aqui.":c==="quota_exceeded"?"O banco de dados está cheio. Exclua registros antigos.":"Não foi possível salvar. Tente de novo.");
}

/* ---------- arquivos ---------- */
var TIPOS_OK={"image/png":1,"image/jpeg":1,"image/gif":1,"image/webp":1,"application/pdf":1};
function tipoArquivo(f){
  if(TIPOS_OK[f.type])return f.type;
  var ext=normal(f.name.split(".").pop());
  return {png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",pdf:"application/pdf"}[ext]||"";
}
function subir(f){
  return usar("assets").then(function(assets){
    var tipo=tipoArquivo(f),reg={nome:f.name,tam:f.size};
    if(!assets||Store.modo!=="db"){reg.nota="só o nome (modo demonstração)";return reg;}
    if(!tipo){reg.nota="formato guardado só pelo nome";return reg;}
    return assets.upload(f,{type:tipo}).then(function(r){reg.id=r.id;reg.tipo=tipo;return reg;},function(){reg.nota="não foi possível guardar";return reg;});
  });
}
function urlArquivo(a){if(!a||!a.id)return "";var id=String(a.id);return id.indexOf("sb:")===0?urlSupa(id.slice(3)):"/_blob/"+id;}
function salvarArquivo(nome,dados){
  return usar("downloads").then(function(dl){
    if(dl)return dl.save({filename:nome,data:dados}).then(function(){toast("Arquivo pronto: "+nome);return true;},function(e){
      if(e&&e.code==="declined"){toast("Download cancelado.");return false;}
      return baixarDireto(nome,dados);
    });
    return baixarDireto(nome,dados);
  });
}
function baixarDireto(nome,dados){
  try{var blob=dados instanceof Blob?dados:new Blob([dados]),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=nome;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},5000);toast("Arquivo pronto: "+nome);return true;}
  catch(e){toast("Não foi possível baixar o arquivo aqui.");return false;}
}

/* ---------- propostas: criação e mensagens ---------- */
function novaProposta(x){
  var c=cfg();
  return Object.assign({num:proxNum("propostas","P"),status:"nova",origem:"manual",criadaEm:agoraISO(),data:hoje(),
    cliente:{nome:"",empresa:"",codigo:"",telefone:"",email:"",local:""},clienteId:"",
    finalidade:"foto",ambientes:[{nome:"",m2:"",fotos:[]}],temProjeto:true,arquivos:[],dataSugerida:"",mensagem:"",
    valor:0,valorManual:false,dias:2,ajudantes:1,contexto:"",tituloInvest:"",
    pagamento:c.proposta.pagamento,etapas:c.proposta.etapas,exclusoes:c.proposta.exclusoes,observacoes:c.proposta.observacoes,creditos:c.proposta.creditos},x||{});
}
function listaAmbientes(p){return (p.ambientes||[]).filter(function(a){return String(a.nome||"").trim();}).map(function(a){return a.nome+(num(a.m2)?" ("+fmtNum(a.m2)+" m²)":"");}).join(", ");}
function msgAdm(p){
  var fotos=(p.ambientes||[]).reduce(function(s,a){return s+(a.fotos||[]).length;},0);
  var l=["*Novo pedido de proposta pelo site* ("+p.num+")","",
    "Cliente: "+(p.cliente.nome||""),"WhatsApp: "+(p.cliente.telefone||""),"E-mail: "+(p.cliente.email||""),"Local: "+(p.cliente.local||""),
    "Finalidade: "+(FINALIDADES[p.finalidade]||""),"Ambientes: "+listaAmbientes(p),"Fotos enviadas: "+fotos,
    "Projeto ou SketchUp: "+(p.temProjeto?"sim":"não")+((p.arquivos||[]).length?" ("+p.arquivos.length+" arquivo"+(p.arquivos.length>1?"s":"")+")":""),
    "Data sugerida: "+(dataBR(p.dataSugerida)||"não informada"),"",
    "*Proposta calculada: "+brl(p.valor)+"*","Prazo: "+p.dias+" dias · "+p.ajudantes+" ajudante"+(p.ajudantes>1?"s":"")];
  if(p.mensagem)l.push("","Mensagem: "+p.mensagem);
  l.push("","Revise e envie em Área restrita › Propostas.");
  return l.join("\n");
}
function msgCliente(p){return "Olá, "+(primeiroNome(p.cliente.nome)||"tudo bem")+"! Recebemos seu pedido de proposta de produção de ambiente. Shylton Mavie entrará em contato em até 3 dias.\n\nObrigado!\nShylton Mavie · @shyltu";}

function receberPedido(d){
  return preparar().then(function(){
    if(Store.modo==="db"&&Sessao.conta!=="adm")throw {code:"sem_permissao"};
    var ambientes=[],arquivos=[],fila=Promise.resolve();
    d.ambientes.forEach(function(a){
      var reg={nome:a.nome,m2:a.m2,fotos:[]};ambientes.push(reg);
      a.files.forEach(function(f){fila=fila.then(function(){return subir(f).then(function(r){reg.fotos.push(r);});});});
    });
    d.projFiles.forEach(function(f){fila=fila.then(function(){return subir(f).then(function(r){arquivos.push(r);});});});
    return fila.then(function(){
      var cli=Store.list("clientes").find(function(c){return (d.email&&normal(c.email)===normal(d.email))||(soDig(d.telefone).length>7&&soDig(c.telefone)===soDig(d.telefone));});
      var pc=cli?Promise.resolve(cli.id):Store.salvar("clientes",null,{tipo:"PF",nome:d.nome,email:d.email,telefone:d.telefone,cidade:d.local,origem:"Pedido de proposta pelo site",criadoEm:agoraISO()});
      return pc.then(function(clienteId){
        var p=novaProposta({origem:"site",clienteId:clienteId,cliente:{nome:d.nome,empresa:"",codigo:"",telefone:d.telefone,email:d.email,local:d.local},
          finalidade:d.finalidade,ambientes:ambientes,temProjeto:d.temProjeto,arquivos:arquivos,dataSugerida:d.dataSugerida,mensagem:d.mensagem});
        var r=calcular(p);p.valor=r.total;p.dias=r.dias;p.ajudantes=r.ajudantes;
        return Store.salvar("propostas",null,p).then(function(id){
          return Store.salvar("avisos",null,{tipo:"adm",para:cfg().whatsappAdm,texto:msgAdm(p),propostaId:id,num:p.num,criadoEm:agoraISO(),enviado:false})
            .then(function(){return Store.salvar("avisos",null,{tipo:"cliente",para:d.telefone,texto:msgCliente(p),propostaId:id,num:p.num,nome:d.nome,criadoEm:agoraISO(),enviado:false});})
            .then(function(){return {ok:true,id:id};});
        });
      });
    });
  });
}

/* ---------- formulário de pedido no Contato do site ---------- */
function ambienteHTML(n){
  return '<div class="amb" data-amb><div class="amb__topo"><span>Ambiente '+n+'</span>'+(n>1?'<button type="button" class="copiar" data-rem-amb>Remover</button>':'')+'</div>'+
    '<div class="fduas"><label class="campo">Nome do ambiente *<input type="text" data-a="nome" placeholder="Ex.: sala de estar"></label>'+
    '<label class="campo">Metragem (m²), se souber<input type="text" data-a="m2" inputmode="decimal" placeholder="Ex.: 18"></label></div>'+
    '<label class="campo">Fotos deste ambiente<input type="file" data-a="fotos" accept="image/*" multiple></label></div>';
}
function renumerar(caixa){$$("[data-amb]",caixa).forEach(function(a,i){$(".amb__topo span",a).textContent="Ambiente "+(i+1);});}
function ligarPedido(){
  var form=document.getElementById("form-pedido");if(!form)return;
  var caixa=$("#pd-ambientes",form),status=$("#pd-status",form);
  caixa.innerHTML=ambienteHTML(1);
  $("#pd-add",form).addEventListener("click",function(){caixa.insertAdjacentHTML("beforeend",ambienteHTML(caixa.children.length+1));});
  caixa.addEventListener("click",function(e){var b=e.target.closest("[data-rem-amb]");if(b){b.closest("[data-amb]").remove();renumerar(caixa);}});
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var val=function(id){return String(($("#"+id,form)||{}).value||"").trim();};
    var d={nome:val("pd-nome"),telefone:val("pd-tel"),email:val("pd-email"),local:val("pd-local"),dataSugerida:val("pd-data"),mensagem:val("pd-msg"),
      finalidade:(($("input[name=pd-fin]:checked",form)||{}).value)||"",temProjeto:(($("input[name=pd-proj]:checked",form)||{}).value)==="sim",
      projFiles:Array.prototype.slice.call(($("#pd-arquivos",form)||{}).files||[]),ambientes:[]};
    $$("[data-amb]",caixa).forEach(function(a){
      var nome=String($("[data-a=nome]",a).value).trim(),m2=String($("[data-a=m2]",a).value).trim();
      if(nome||m2)d.ambientes.push({nome:nome||"Ambiente",m2:m2,files:Array.prototype.slice.call($("[data-a=fotos]",a).files||[])});
    });
    var falta=[];
    if(!d.nome)falta.push("nome");if(!d.telefone)falta.push("WhatsApp");if(!d.email)falta.push("e-mail");if(!d.local)falta.push("localização");
    if(!d.finalidade)falta.push("finalidade");if(!d.ambientes.length)falta.push("ao menos um ambiente");
    if(falta.length){status.className="status erro";status.textContent="Falta preencher: "+falta.join(", ")+".";return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)){status.className="status erro";status.textContent="Confira o e-mail: ele precisa ter o formato nome@dominio.com.";return;}
    var btn=$("button[type=submit]",form);btn.disabled=true;status.className="status";status.textContent="Enviando fotos e dados…";
    receberPedido(d).then(function(){
      form.hidden=true;
      var ok=document.getElementById("pd-ok");
      ok.innerHTML='<h3>Pedido enviado.</h3><p>Shylton Mavie entrará em contato em até 3 dias pelo WhatsApp ou e-mail que você informou.</p>'+
        (Store.modo==="local"?'<p class="nota">Demonstração: a proposta foi criada na área restrita deste navegador.</p>':'')+
        '<button type="button" class="copiar copiar--bloco" id="pd-novo">Fazer outro pedido</button>';
      ok.hidden=false;
      $("#pd-novo").addEventListener("click",function(){form.reset();caixa.innerHTML=ambienteHTML(1);status.textContent="";btn.disabled=false;ok.hidden=true;form.hidden=false;});
    },function(){
      btn.disabled=false;status.className="status erro";
      var txt="Olá, Shylton! Quero pedir uma proposta de produção de ambiente.\nNome: "+d.nome+"\nLocal: "+d.local+"\nFinalidade: "+(FINALIDADES[d.finalidade]||"")+"\nAmbientes: "+d.ambientes.map(function(a){return a.nome+(a.m2?" ("+a.m2+" m²)":"");}).join(", ")+"\nData sugerida: "+(dataBR(d.dataSugerida)||"a combinar");
      status.innerHTML='O envio automático ainda não está ligado nesta versão do site. <a class="rodape__adm" href="'+esc(waLink(PADRAO.whatsappAdm,txt))+'" target="_blank" rel="noopener">Mandar o pedido pelo WhatsApp ↗</a>';
    });
  });
}

/* ---------- páginas públicas de cadastro (link compartilhável) ---------- */
var UFS="AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
function cpub(k,r,o){o=o||{};var id="pb-"+k;
  if(o.t==="select")return '<label class="campo" for="'+id+'">'+esc(r)+(o.req?" *":"")+'<select id="'+id+'" data-k="'+k+'"'+(o.req?" required":"")+'>'+o.o.map(function(x){var a=Array.isArray(x)?x:[x,x];return '<option value="'+esc(a[0])+'">'+esc(a[1])+'</option>';}).join("")+'</select></label>';
  return '<label class="campo" for="'+id+'">'+esc(r)+(o.req?" *":"")+'<input id="'+id+'" type="'+(o.t||"text")+'" data-k="'+k+'"'+(o.req?" required":"")+(o.ac?' autocomplete="'+o.ac+'"':'')+(o.ph?' placeholder="'+esc(o.ph)+'"':'')+'></label>';
}
SIS.publica=function(raiz,h){
  var cli=h==="cadastro-cliente";
  var corpo=cli?
    '<div class="fduas">'+cpub("tipo","Você é",{t:"select",o:[["PF","Pessoa física"],["PJ","Empresa"]]})+cpub("nome","Nome completo ou razão social",{req:1,ac:"name"})+
    cpub("doc","CPF ou CNPJ",{req:1})+cpub("rg","RG (pessoa física)")+
    cpub("nacionalidade","Nacionalidade",{ph:"brasileira"})+cpub("estadoCivil","Estado civil")+
    cpub("profissao","Profissão")+cpub("email","E-mail",{t:"email",req:1,ac:"email"})+
    cpub("telefone","Telefone / WhatsApp",{t:"tel",req:1,ac:"tel"})+cpub("instagram","Instagram")+
    cpub("cep","CEP",{ac:"postal-code"})+cpub("endereco","Rua / avenida",{req:1,ac:"address-line1"})+
    cpub("numero","Número",{req:1})+cpub("complemento","Complemento")+
    cpub("bairro","Bairro")+cpub("cidade","Cidade",{req:1,ac:"address-level2"})+
    cpub("uf","Estado",{t:"select",o:[["","—"]].concat(UFS),req:1})+cpub("representante","Representante legal (empresa)")+
    cpub("repCpf","CPF do representante (empresa)")+'</div>'+
    '<label class="chk"><input type="checkbox" id="pb-lgpd" required> Autorizo o uso destes dados para propostas, contrato e comunicação sobre o serviço (LGPD).</label>'
    :
    '<div class="fduas">'+cpub("nome","Nome completo",{req:1,ac:"name"})+cpub("funcao","Função",{req:1,ph:"Ex.: assistente de produção, montagem, motorista"})+
    cpub("email","E-mail",{t:"email",req:1,ac:"email"})+cpub("telefone","Telefone / WhatsApp",{t:"tel",req:1,ac:"tel"})+
    cpub("cidade","Cidade",{req:1})+cpub("pix","Chave PIX")+'</div>'+
    '<label class="chk"><input type="checkbox" id="pb-lgpd" required> Autorizo o uso destes dados para a organização das produções (LGPD).</label>';
  raiz.innerHTML='<header class="barra"><a href="#inicio" class="barra__logo" aria-label="Shylton Mavie, início"><svg class="barra__simb" viewBox="0 0 96 148" aria-hidden="true" focusable="false"><use href="#g-simb-v" fill="currentColor"/></svg><span class="barra__nome">Shylton Mavie</span></a><button type="button" class="menu-btn" data-menu aria-label="Menu" aria-expanded="false" aria-controls="menu"><svg class="menu-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6.5h18M3 12h18M3 17.5h18"/></svg></button></header><h1 class="pag__titulo">Cadastro</h1>'+
    '<div class="cols"><div></div><div class="corpo"><p class="grande">'+(cli?"Preencha seus dados para o contrato de produção. Eles são usados só para a proposta, o contrato e o contato sobre o serviço.":"Preencha seus dados para trabalhar nas produções do Shylton Mavie. Depois do envio, o Shylton libera seu acesso às tarefas e ao calendário.")+'</p></div></div>'+
    '<div class="linhas"><div class="linha"><h2 class="linha__rot">Seus dados</h2><div><form class="form form--larga" id="form-pub" novalidate>'+corpo+'<button type="submit" class="enviar">Enviar cadastro</button><p class="status" id="pb-status" role="status"></p></form><div class="pedido-ok" id="pb-ok" hidden></div></div></div></div>'+
    '<footer class="rodape"><span>© 2026 Shylton Mavie</span></footer>';
  window.scrollTo(0,0);
  var form=$("#form-pub",raiz),st=$("#pb-status",raiz);
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var falta=$$("[required]",form).filter(function(x){return x.type==="checkbox"?!x.checked:!String(x.value).trim();});
    if(falta.length){st.className="status erro";st.textContent=$("#pb-lgpd",form).checked?"Preencha os campos marcados com *.":"Preencha os campos marcados com * e marque a autorização de uso dos dados.";falta[0].focus();return;}
    var v={};$$("[data-k]",form).forEach(function(x){v[x.getAttribute("data-k")]=String(x.value).trim();});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)){st.className="status erro";st.textContent="Confira o e-mail.";return;}
    v.criadoEm=agoraISO();v.lgpd=true;
    if(cli){v.origem="Link de cadastro";}else{v.status="pendente";v.acesso="colaborador";v.userId=Sessao.userId||"";}
    st.className="status";st.textContent="Enviando…";
    preparar().then(function(){
      /* Domínio próprio: o visitante só consegue criar (nunca ler ou alterar) um cadastro novo, que o adm vê na área restrita */
      if(Sessao.supa&&Sessao.conta!=="adm")return SB.from(TAB).insert({colecao:cli?"clientes":"equipe",id:uid(),dados:v}).then(okSb);
      if(Store.modo==="db"&&Sessao.conta!=="adm")throw {code:"sem_permissao"};
      return Store.salvar(cli?"clientes":"equipe",null,v);
    }).then(function(){
      form.hidden=true;var ok=$("#pb-ok",raiz);ok.hidden=false;
      ok.innerHTML='<h3>Cadastro recebido.</h3><p>'+(cli?"Obrigado! Seus dados já estão com o Shylton para o contrato.":"Obrigado! Assim que o Shylton liberar, você verá as tarefas e o calendário na área restrita.")+'</p>'+(Store.modo==="local"?'<p class="nota">Demonstração: o cadastro foi salvo na área restrita deste navegador.</p>':'');
    },function(){st.className="status erro";st.textContent="O envio automático ainda não está ligado nesta versão do site. Envie seus dados ao Shylton pelo WhatsApp +55 48 9 9621-0587.";});
  });
};

/* ---------- exportar ---------- */
Object.assign(SIS,{
  $:$,$$:$$,esc:esc,uid:uid,pad:pad,hoje:hoje,agoraISO:agoraISO,num:num,brl:brl,fmtValor:fmtValor,fmtNum:fmtNum,MESES:MESES,
  dataBR:dataBR,dataExtenso:dataExtenso,diasEntre:diasEntre,somaDias:somaDias,isoLocal:isoLocal,soDig:soDig,normal:normal,primeiroNome:primeiroNome,
  waLink:waLink,clone:clone,setPath:setPath,getPath:getPath,debounce:debounce,extenso:extenso,toast:toast,copiar:copiar,usar:usar,
  FINALIDADES:FINALIDADES,FINALIDADE_CAPS:FINALIDADE_CAPS,ST:ST,tag:tag,opcoes:opcoes,PADRAO:PADRAO,cfg:cfg,calcular:calcular,
  Store:Store,proxNum:proxNum,Sessao:Sessao,ehAdm:ehAdm,preparar:preparar,sincAcesso:sincAcesso,membroLiberado:membroLiberado,
  trata:trata,mostrar:mostrar,esconder:esconder,render:render,
  campo:campo,campos:campos,lerCampos:lerCampos,validar:validar,modal:modal,modalForm:modalForm,fecharModal:fecharModal,erroGravar:erroGravar,
  subir:subir,urlArquivo:urlArquivo,salvarArquivo:salvarArquivo,logoSVG:logoSVG,
  novaProposta:novaProposta,listaAmbientes:listaAmbientes,msgAdm:msgAdm,msgCliente:msgCliente,ligarPedido:ligarPedido
});
})();
