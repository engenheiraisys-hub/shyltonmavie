(function(){
  /* lado de cada foto no maior tamanho (srcset) — gerado com as fotos originais */
  var DIM={"g46-1":[2400,1600],"g46-2":[1600,2400],"g46-3":[1600,2400],"g46-4":[1600,2400],"g46-5":[1600,2400],"g46-6":[1600,2400],"g46-7":[1600,2400],"g46-8":[1600,2400],"g46-9":[1600,2400],"g46-10":[1600,2400],"g46-11":[1600,2400],"g46-12":[1600,2400],"g46-13":[1600,2400],"g46-14":[1600,2400],"g46-15":[1600,2400],"g46-16":[1600,2400],"g46-17":[1600,2400],"g46-18":[1600,2400],"g41-1":[1499,1000],"g41-2":[1499,1000],"g41-3":[667,1000],"g41-4":[667,1000],"g41-5":[750,472],"g41-6":[750,575],"g41-7":[1499,1000],"g39-1":[1601,2400],"g39-2":[2400,1601],"g39-3":[2400,1601],"g39-4":[2400,1601],"g39-5":[1601,2400],"g39-6":[1601,2400],"g39-7":[1601,2400],"g39-8":[1601,2400],"g39-9":[1601,2400],"g39-10":[2400,1601],"g39-11":[1601,2400],"g39-12":[1601,2400],"g39-13":[1601,2400],"g39-14":[2400,1601],"g37-1":[2400,1600],"g37-2":[2400,1600],"g37-3":[2400,1600],"g37-4":[2400,1600],"g37-5":[1600,2400],"g37-6":[1600,2400],"g37-7":[1600,2400],"g37-8":[1600,2400],"g37-9":[1600,2400],"g37-10":[1600,2400],"g37-11":[1600,2400],"g37-12":[1600,2400],"g37-13":[1600,2400],"g37-14":[1600,2400],"g36-1":[1181,1771],"g36-2":[1181,1771],"g36-3":[1771,1181],"g36-4":[1770,1181],"g36-5":[1181,1770],"g36-6":[1771,1181],"g36-7":[1771,1181],"g36-8":[1181,1771],"g36-9":[1181,1771],"g36-10":[1771,1181],"g36-11":[1181,1771],"g36-12":[1181,1771],"g36-13":[1181,1792],"g36-14":[1771,1181],"g36-15":[1771,1181],"g36-16":[1771,1181],"g36-17":[1181,1767],"g36-18":[1181,1771],"g32-1":[2400,1653],"g32-2":[2400,1536],"g32-3":[2400,1640],"g32-4":[1800,2400],"g32-5":[1640,2400],"g32-6":[1745,2400],"g32-7":[1640,2400],"g32-8":[1669,2400],"g32-9":[1597,2400],"g32-10":[1597,2400],"g32-11":[2400,1640],"g32-12":[1660,2400],"g32-13":[2400,1662],"g32-14":[2400,1504],"g32-15":[1702,2400],"g32-16":[2400,1597],"g31-1":[1714,2400],"g31-2":[2400,1601],"g31-3":[1714,2400],"g31-4":[2400,1600],"g31-5":[2400,1601],"g31-6":[1714,2400],"g31-7":[1714,2400],"g31-8":[1714,2400],"g31-9":[2400,1601],"g31-10":[1714,2400],"g31-11":[2400,1601],"g31-12":[1714,2400],"g31-13":[1714,2400],"g31-14":[1714,2400],"g31-15":[1714,2400],"g31-16":[1715,2400],"g31-17":[1714,2400],"g44-1":[1200,1600],"g44-2":[1600,1067],"g44-3":[1200,1600],"g44-4":[1067,1600],"g44-5":[1600,1067],"g44-6":[1200,1600],"g44-7":[1600,1067],"g44-8":[1067,1600],"g44-9":[1200,1600],"g44-10":[1067,1600],"g35-1":[2400,1640],"g35-2":[1500,1000],"g35-3":[2400,1600],"g35-4":[2400,1600],"g35-5":[1678,2400],"g35-6":[2400,1600],"g35-7":[2400,1590],"g35-8":[1600,2400],"g35-9":[1684,2400],"g35-10":[2400,1600],"g35-11":[1000,1500],"g33-1":[1600,2400],"g33-2":[2400,1600],"g33-3":[2400,1600],"g33-4":[1600,2400],"g33-5":[1600,2400],"g33-6":[1600,2400],"g33-7":[1600,2400],"g33-8":[1600,2400],"g33-9":[1600,2400],"g33-10":[1600,2400],"g33-11":[1600,2400],"g33-12":[1600,2400],"g33-13":[1600,2400],"g45-1":[1600,2400],"g45-2":[1600,2400],"g45-3":[1600,2400],"g45-4":[1600,2400],"g45-5":[1600,2400],"g45-6":[2400,1600],"g45-7":[2400,1545],"g45-8":[1600,2400],"g45-9":[1600,2400],"g45-10":[1600,2400],"g45-11":[1365,2048],"g34-1":[1826,2400],"g34-2":[2400,2271],"g34-3":[2400,1843],"g34-4":[1745,2400],"g34-5":[1972,2400],"g34-6":[1984,2400],"g34-7":[2400,1499],"g34-8":[1667,2400],"g34-9":[2400,1583],"g34-10":[2400,1582],"g34-11":[2400,1551],"g43-1":[667,1000],"g43-2":[667,1000],"g43-3":[1500,1000],"g43-4":[1500,1000],"g43-5":[667,1000],"g40-1":[1334,2000],"g40-2":[2000,1334],"g40-3":[1334,2000],"g40-4":[1334,2000],"g40-5":[1334,2000],"g40-6":[1334,2000],"g40-7":[1323,2000],"g40-8":[1334,2000],"g40-9":[2000,1334],"g40-10":[1334,2000],"g38-1":[1800,2400],"g38-2":[1795,2400],"g38-3":[2400,1806],"g38-4":[2400,1800],"g38-5":[1800,2400],"g38-6":[2400,1800],"g38-7":[1800,2400],"g38-8":[2400,1800],"g38-9":[2400,1800],"g38-10":[1800,2400],"g38-11":[1800,2400],"g38-12":[1800,2400],"g42-1":[1600,2400],"g42-2":[1600,2400],"g42-3":[1600,2400],"g42-4":[1600,2400],"g42-5":[1600,2400],"g42-6":[1600,2400],"g42-7":[1600,2400],"g42-8":[1600,2400],"g42-9":[1600,2400],"g42-10":[1600,2400],"g42-11":[1600,2400],"g42-12":[1600,2400],"g42-13":[1600,2400],"g42-14":[1600,2400],"g42-15":[1600,2400]};
  var PROJETOS=[
    {slug:"casa-ponte",nome:"Casa Ponte",cat:"Residencial",local:"Santa Catarina, Brasil",ano:"",evento:"",projeto:"Tetro",papel:"producao",producao:"Shylton Mavie",fotos:"Joana Franca",capa:"g41-1.jpg",galeria:["g41-1.jpg","g41-2.jpg","g41-3.jpg","g41-4.jpg","g41-5.jpg","g41-6.jpg","g41-7.jpg"],texto:"Casa Ponte, em Santa Catarina, com projeto do Tetro. Mesa de madeira de demolição diante da piscina de borda infinita e do mar, estar com mobiliário de madeira e couro, pedras naturais integradas à arquitetura e brises que filtram a luz."},
    {slug:"showroom-marble-superficie",nome:"Showroom Marble Superfície",cat:"Comercial",local:"Santa Catarina, Brasil",ano:"",evento:"",marca:"Marble Superfície",projeto:"Octaedro",papel:"producao",producao:"Shylton Mavie",fotos:"Mariana Boro",capa:"g39-1.jpg",foco:"50% 55%",galeria:["g39-1.jpg","g39-2.jpg","g39-3.jpg","g39-4.jpg","g39-5.jpg","g39-6.jpg","g39-7.jpg","g39-8.jpg","g39-9.jpg","g39-10.jpg","g39-11.jpg","g39-12.jpg","g39-13.jpg","g39-14.jpg"],texto:"Showroom da Marble Superfície, com projeto do Octaedro. Estar com mesa de centro em pedra, cozinha diante de painéis de travertino, prateleiras iluminadas sobre mármore verde e lavabo em mármore canelado."},
    {slug:"showroom-masotti",nome:"Showroom Masotti",cat:"Comercial",local:"",ano:"",evento:"",marca:"Masotti Móveis",projeto:"",papel:"producao",producao:"Shylton Mavie",fotos:"Guilherme Lopes",capa:"g46-16.jpg",galeria:["g46-16.jpg","g46-1.jpg","g46-2.jpg","g46-3.jpg","g46-4.jpg","g46-5.jpg","g46-6.jpg","g46-7.jpg","g46-8.jpg","g46-9.jpg","g46-10.jpg","g46-11.jpg","g46-12.jpg","g46-13.jpg","g46-14.jpg","g46-15.jpg","g46-17.jpg","g46-18.jpg"],texto:"Showroom da Masotti Móveis. Sofá orgânico branco diante de painel ripado de madeira, poltronas de veludo verde, mesas de centro em madeira e pedra, quarto com parede de pedra e cabeceira de palhinha, e objetos em tons de terra."},
    {slug:"vitrine-tennis-club",nome:"Vitrine Tennis Club",cat:"Comercial",local:"Santa Catarina, Brasil",ano:"",evento:"",marca:"Tidelli",projeto:"Beatriz Zeglin",paisagismo:"Terraço Paisagismo",papel:"producao",producao:"Shylton Mavie",fotos:"",capa:"g37-1.jpg",galeria:["g37-1.jpg","g37-2.jpg","g37-3.jpg","g37-4.jpg","g37-5.jpg","g37-6.jpg","g37-7.jpg","g37-8.jpg","g37-9.jpg","g37-10.jpg","g37-11.jpg","g37-12.jpg","g37-13.jpg","g37-14.jpg"],texto:"Vitrine Tennis Club da Tidelli, com projeto de Beatriz Zeglin e paisagismo da Terraço Paisagismo. Bancos de madeira, ombrelones perfurados, espreguiçadeiras e bolas de tênis espalhadas pelo ambiente."},
    {slug:"apartamento-nosso-tempo",nome:"Apartamento Nosso Tempo",cat:"Residencial",local:"Santa Catarina, Brasil",ano:"",evento:"",projeto:"Patricia Nobrega",papel:"producao",producao:"Shylton Mavie",fotos:"Anna Hoatsu",capa:"g36-3.jpg",galeria:["g36-3.jpg","g36-1.jpg","g36-2.jpg","g36-4.jpg","g36-5.jpg","g36-6.jpg","g36-7.jpg","g36-9.jpg","g36-10.jpg","g36-11.jpg","g36-12.jpg","g36-14.jpg","g36-16.jpg","g36-17.jpg","g36-18.jpg"],texto:"Apartamento Nosso Tempo, em Santa Catarina, com projeto de Patricia Nobrega. Marcenaria em madeira clara, mesa de pedra com cadeiras de couro caramelo, escada de degraus soltos e objetos em tons de terra."},
    {slug:"living-lar",nome:"Living L(ar)",cat:"Mostra",local:"Santa Catarina, Brasil",ano:"2026",evento:"CASACOR Santa Catarina 2026",projeto:"Jacobus Buzzi Arquitetos",papel:"producao",producao:"Shylton Mavie",fotos:"Lio Simas",capa:"g32-1.jpg",galeria:["g32-1.jpg","g32-2.jpg","g32-3.jpg","g32-4.jpg","g32-5.jpg","g32-6.jpg","g32-7.jpg","g32-8.jpg","g32-9.jpg","g32-10.jpg","g32-11.jpg","g32-12.jpg","g32-13.jpg","g32-14.jpg","g32-15.jpg","g32-16.jpg"],texto:"Living L(ar), ambiente de Jacobus Buzzi Arquitetos na CASACOR Santa Catarina 2026. Estar com lareira e jardim, jantar com adega e cristaleira, em madeira, pedra e veludo."},
    {slug:"vitrine-forma-e-materia",nome:"Vitrine Forma & Matéria",cat:"Comercial",local:"",ano:"",evento:"",marca:"ContTi Home Design",projeto:"Beatriz Zeglin",papel:"producao",producao:"Shylton Mavie",fotos:"Fernando Willadino",capa:"g31-1.jpg",foco:"50% 58%",galeria:["g31-1.jpg","g31-2.jpg","g31-3.jpg","g31-4.jpg","g31-5.jpg","g31-6.jpg","g31-7.jpg","g31-8.jpg","g31-9.jpg","g31-10.jpg","g31-11.jpg","g31-12.jpg","g31-13.jpg","g31-14.jpg","g31-15.jpg","g31-16.jpg","g31-17.jpg"],texto:"Vitrine Forma & Matéria da ContTi Home Design, com projeto de Beatriz Zeglin."},
    {slug:"apartamento-mfm",nome:"Apartamento MFM",cat:"Residencial",local:"São Paulo, Brasil",ano:"",evento:"",projeto:"Estúdio Dutra",papel:"producao",producao:"Shylton Mavie e André Dutra",fotos:"Renato Navarro",capa:"g44-1.jpg",foco:"50% 68%",galeria:["g44-1.jpg","g44-2.jpg","g44-3.jpg","g44-4.jpg","g44-5.jpg","g44-6.jpg","g44-7.jpg","g44-8.jpg","g44-9.jpg","g44-10.jpg"],texto:"Produção do apartamento MFM, em São Paulo, com projeto do Estúdio Dutra. Marcenaria em madeira, prateleiras abertas e objetos escolhidos peça por peça para as fotos."},
    {slug:"casa-horizonte",nome:"Casa Horizonte",cat:"Mostra",local:"Santa Catarina, Brasil",ano:"2023",evento:"CASACOR Santa Catarina 2023",projeto:"Beatriz Zeglin e Dimas Construções",papel:"producao",producao:"Shylton Mavie",fotos:"Lio Simas",capa:"g35-1.jpg",foco:"18% 50%",galeria:["g35-1.jpg","g35-2.jpg","g35-3.jpg","g35-4.jpg","g35-5.jpg","g35-6.jpg","g35-7.jpg","g35-8.jpg","g35-9.jpg","g35-10.jpg","g35-11.jpg"],texto:"Ambiente de Beatriz Zeglin e Dimas Construções na CASACOR Santa Catarina 2023. Estante em grade preta, livros, cerâmicas e uma poltrona de balanço compõem a produção."},
    {slug:"espaco-raizes",nome:"Espaço Raízes",cat:"Mostra",local:"Santa Catarina, Brasil",ano:"2024",evento:"CASACOR Santa Catarina 2024",projeto:"Terraço Paisagismo",papel:"producao",producao:"Shylton Mavie",fotos:"Lucas Reitz",capa:"g33-1.jpg",foco:"50% 58%",galeria:["g33-1.jpg","g33-2.jpg","g33-3.jpg","g33-4.jpg","g33-5.jpg","g33-6.jpg","g33-7.jpg","g33-8.jpg","g33-9.jpg","g33-10.jpg","g33-11.jpg","g33-12.jpg","g33-13.jpg"],texto:"Terraço da Terraço Paisagismo na CASACOR Santa Catarina 2024, com vasos de barro, folhagens e mobiliário para área externa."},
    {slug:"mostra-autoria",nome:"Mostra Autoria",cat:"Mostra",local:"Santa Catarina, Brasil",ano:"2026",evento:"Mostra Autoria 2026",projeto:"Terraço Paisagismo",papel:"producao",producao:"Shylton Mavie",fotos:"Lucas Reitz",capa:"g45-1.jpg",foco:"50% 62%",galeria:["g45-1.jpg","g45-2.jpg","g45-3.jpg","g45-4.jpg","g45-5.jpg","g45-6.jpg","g45-7.jpg","g45-8.jpg","g45-9.jpg","g45-10.jpg","g45-11.jpg"],texto:"Mostra Autoria 2026, em Santa Catarina, com projeto da Terraço Paisagismo. Jardim seco com cactos, agaves e pedras empilhadas entre bases de textura branca, cadeiras de madeira e de metal colorido, banco de alumínio e cerâmica autoral."},
    {slug:"casa-floripa",nome:"Casa Floripa",cat:"Mostra",local:"Santa Catarina, Brasil",ano:"2024",evento:"CASACOR Santa Catarina 2024",projeto:"Beatriz Zeglin e Dimas Construções",papel:"producao",producao:"Shylton Mavie",fotos:"Lio Simas",capa:"g34-1.jpg",galeria:["g34-1.jpg","g34-2.jpg","g34-3.jpg","g34-4.jpg","g34-5.jpg","g34-6.jpg","g34-7.jpg","g34-8.jpg","g34-9.jpg","g34-10.jpg"],texto:"Casa de Beatriz Zeglin e Dimas Construções na CASACOR Santa Catarina 2024. Estar, bar e varanda se abrem para a vegetação ao redor."},
    {slug:"casa-canto",nome:"Casa Canto",cat:"Residencial",local:"Santa Catarina, Brasil",ano:"",evento:"",projeto:"Bloco B Arquitetura",papel:"producao",producao:"Shylton Mavie",fotos:"Lucas Reitz",capa:"g43-1.jpg",foco:"50% 60%",galeria:["g43-1.jpg","g43-2.jpg","g43-3.jpg","g43-5.jpg"],texto:"Casa Canto, em Santa Catarina, com projeto da Bloco B Arquitetura. Laje de concreto aparente, grandes panos de vidro voltados para as árvores, poltronas de couro caramelo na varanda e cozinha integrada em madeira clara."},
    {slug:"cobertura-mares",nome:"Cobertura Mares",cat:"Residencial",local:"Santa Catarina, Brasil",ano:"",evento:"",projeto:"ARQO Arquitetura",papel:"producao",producao:"Shylton Mavie",fotos:"Fabio Junior Severo",capa:"g40-1.jpg",galeria:["g40-1.jpg","g40-2.jpg","g40-3.jpg","g40-4.jpg","g40-5.jpg","g40-6.jpg","g40-7.jpg","g40-8.jpg","g40-9.jpg","g40-10.jpg"],texto:"Cobertura Mares, em Santa Catarina, com projeto da ARQO Arquitetura. Cozinha com ilha em mármore branco e banquetas pretas, mesa de madeira sob pendentes, terraço com mesa de tronco, ducha em deque de madeira e banquinhos torneados."},
    {slug:"casa-acores",nome:"Casa Açores",cat:"Residencial",local:"Santa Catarina, Brasil",ano:"",evento:"",projeto:"Micael Carminatti",papel:"producao",producao:"Shylton Mavie",fotos:"Rafael Ribeiro",capa:"g38-1.jpg",foco:"50% 60%",galeria:["g38-1.jpg","g38-2.jpg","g38-3.jpg","g38-4.jpg","g38-5.jpg","g38-6.jpg","g38-7.jpg","g38-8.jpg","g38-9.jpg","g38-10.jpg","g38-11.jpg","g38-12.jpg"],texto:"Casa Açores, em Santa Catarina, com projeto de Micael Carminatti. Lareira revestida em pedra, poltronas de couro, marcenaria em madeira clara e luz natural pelo pé-direito duplo."},
    {slug:"apartamento-bt",nome:"Apartamento BT",cat:"Residencial",local:"Santa Catarina, Brasil",ano:"",evento:"",projeto:"ARQO Arquitetura",papel:"producao",producao:"Shylton Mavie",fotos:"Fernando Fiorentin",capa:"g42-1.jpg",foco:"50% 64%",galeria:["g42-1.jpg","g42-2.jpg","g42-3.jpg","g42-4.jpg","g42-5.jpg","g42-6.jpg","g42-7.jpg","g42-8.jpg","g42-9.jpg","g42-10.jpg","g42-11.jpg","g42-12.jpg","g42-13.jpg","g42-14.jpg","g42-15.jpg"],texto:"Apartamento BT, em Santa Catarina, com projeto da ARQO Arquitetura. Base em tons claros com madeira escura, cadeira de palhinha diante do aparador suspenso apoiado numa esfera, prateleiras com cerâmicas e espelho orgânico refletindo a cozinha."}
  ];
  /* Início: foto de abertura e, na rolagem, a primeira foto (capa) de cada produção; a 3ª posição é o texto alternativo */
  var DESTAQUES=[["","inicio.jpg","Bancada de mármore branco com taça, figos, uvas e ameixas, e uma cadeira preta em primeiro plano"]].concat(PROJETOS.map(function(p){return [p.slug,p.capa];}));
  var CATS=["Todos","Residencial","Mostra","Comercial"];
  function img(id){return "img/"+id+(/\.\w+$/.test(id)?"":".webp");}
  /* Fotos em alta (2026-11-10, originais da Isys): cada foto tem 3 tamanhos — x-p.jpg (lado maior 800), x.jpg (1600) e,
     quando o original é maior, x-g.jpg (2400). O navegador escolhe pelo tamanho na tela (srcset + sizes): celular baixa a leve. */
  var TAM={"capa":"100vw","card":"(max-width:520px) 100vw, (max-width:1100px) 50vw, 33vw","gal":"(max-width:820px) 100vw, 75vw"}; /* galeria: as fotos crescem para fechar a linha, então a conta é folgada */
  function fontes(id){
    var b=String(id).replace(/\.\w+$/,""),d=DIM[b];if(!d)return "";
    var L=Math.max(d[0],d[1]);function w(l){return Math.round(d[0]*Math.min(l,L)/L);}
    return ["img/"+b+"-p.jpg "+w(800)+"w","img/"+b+".jpg "+w(1600)+"w"].concat(L>1600?["img/"+b+"-g.jpg "+d[0]+"w"]:[]).join(", ");
  }
  function atrFoto(id,tam,adiar){var s=fontes(id);return s?' '+(adiar?'data-srcset':'srcset')+'="'+s+'" sizes="'+TAM[tam]+'"':'';}
  /* Área restrita: o portfólio da proposta usa estas produções e fotos (sis-docs.js) */
  window.SM_PROJETOS=PROJETOS.map(function(p){return {slug:p.slug,nome:p.nome,cat:p.cat,local:p.local,evento:p.evento,projeto:p.projeto,fotos:p.fotos,foco:p.foco||"",capa:img(p.capa),galeria:(p.galeria||[]).map(img)};});
  function el(tag,attrs,html){var e=document.createElement(tag);for(var k in attrs){e.setAttribute(k,attrs[k]);}if(html!=null)e.innerHTML=html;return e;}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function porSlug(s){for(var i=0;i<PROJETOS.length;i++){if(PROJETOS[i].slug===s)return PROJETOS[i];}return null;}
  function etiqueta(p){return p.evento||p.cat;}

  // Marcas: duas linhas correndo para a esquerda a 40px/s; a cópia (oculta para leitores de tela) fecha o laço sem emenda
  (function(){
    /* Andam sempre, como no computador (pedido da Isys, 2026-11-15); com "reduzir movimento" ligado no aparelho, na metade da velocidade */
    var VEL=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches?20:40;
    var ro=window.ResizeObserver?new ResizeObserver(function(es){es.forEach(function(e){var w=e.target.scrollWidth/2;if(w)e.target.style.setProperty("--dur",(w/VEL).toFixed(1)+"s");});}):null;
    [].forEach.call(document.querySelectorAll(".marcas__lista"),function(l){
      [].slice.call(l.children).forEach(function(li){var c=li.cloneNode(true);c.setAttribute("aria-hidden","true");l.appendChild(c);});
      l.classList.add("anda");if(ro)ro.observe(l);
    });
  })();

  // Início: uma foto por tela; a rolagem troca a foto
  var vInicio=document.getElementById("v-inicio"),palco=document.getElementById("palco-fotos"),passos=document.getElementById("palco-passos");
  var telas=[],atual=-1;
  DESTAQUES.forEach(function(d,i){
    var p=porSlug(d[0]);
    var f=el("div",{"class":"palco__foto","aria-hidden":"true"});
    f.innerHTML='<img'+atrFoto(d[1],"capa",i>=2)+' '+(i<2?'src':'data-src')+'="'+img(d[1])+'" alt="'+esc(d[2]||p.nome)+'" decoding="async"'+(p&&p.foco?' style="object-position:'+p.foco+'"':'')+(i===0?' fetchpriority="high"':'')+'>';
    palco.appendChild(f);telas.push(f);
    passos.appendChild(el("div",{"class":"passo"}));
  });
  function carregar(i){var im=telas[i]&&telas[i].querySelector("img[data-src]");if(im){if(im.hasAttribute("data-srcset")){im.srcset=im.getAttribute("data-srcset");im.removeAttribute("data-srcset");}im.src=im.getAttribute("data-src");im.removeAttribute("data-src");}}
  function ativar(i){
    if(i===atual)return;atual=i;
    telas.forEach(function(f,k){f.classList.toggle("ativa",k===i);f.setAttribute("aria-hidden",k===i?"false":"true");});    carregar(i);carregar(i+1);
  }
  function aoRolar(){
    if(vInicio.hidden)return;
    var h=passos.firstChild.offsetHeight||window.innerHeight;
    ativar(Math.max(0,Math.min(telas.length-1,Math.round(window.scrollY/h))));
  }
  window.addEventListener("scroll",aoRolar,{passive:true});
  window.addEventListener("resize",aoRolar);
  vInicio.style.setProperty("--n",telas.length);
  ativar(0);

  // Produções: filtro por tipo
  var estado={cat:"Todos"};
  var filtros=document.getElementById("filtros");
  CATS.forEach(function(c){
    var b=el("button",{type:"button","aria-pressed":c==="Todos"?"true":"false","data-cat":c},esc(c));
    b.addEventListener("click",function(){estado.cat=c;[].forEach.call(filtros.children,function(x){x.setAttribute("aria-pressed",x.getAttribute("data-cat")===c?"true":"false");});desenharProjetos();});
    filtros.appendChild(b);
  });
  function desenharProjetos(){
    var itens=PROJETOS.filter(function(p){return estado.cat==="Todos"||p.cat===estado.cat;});
    var grade=document.getElementById("grade");
    grade.innerHTML="";
    if(!itens.length){grade.appendChild(el("p",{"class":"vazio"},"Nenhuma produção nesta categoria."));return;}
    itens.forEach(function(p){
      var c=el("div",{"class":"card"});
      c.innerHTML='<a href="#'+p.slug+'" class="card__img"><img'+atrFoto(p.capa,"card")+' src="'+img(p.capa)+'" alt="'+esc(p.nome)+'" loading="lazy" decoding="async"></a><a href="#'+p.slug+'" class="card__leg"><b>'+esc(p.nome)+'</b><span>'+esc(p.local||p.marca||p.cat)+'</span></a>';
      grade.appendChild(c);
    });
  }

  // Projeto
  function credito(p){
    if(p.papel==="assistente")return "Produção de "+p.producao+", com assistência de Shylton Mavie";
    return p.producao;
  }
  function desenharProjeto(p){
    var capa=document.getElementById("det-capa"),fc=fontes(p.capa);
    if(fc){capa.srcset=fc;capa.sizes=TAM.capa;}else capa.removeAttribute("srcset");
    capa.src=img(p.capa);capa.alt=p.nome;
    document.getElementById("ficha-nome").textContent=p.nome;
    var gal=document.getElementById("det-galeria");gal.innerHTML="";
    p.galeria.filter(function(g){return g!==p.capa;}).forEach(function(g,i){
      var at={alt:p.nome+", foto "+(i+2)+(p.fotos?" de "+p.fotos:""),loading:"lazy",decoding:"async"},fg=fontes(g);
      if(fg){at.srcset=fg;at.sizes=TAM.gal;}at.src=img(g);
      var im=el("img",at);
      im.addEventListener("load",function(){var r=(im.naturalWidth/im.naturalHeight)||1.3;im.style.flex=r.toFixed(3)+" 1 calc(var(--alt) * "+r.toFixed(3)+")";});
      gal.appendChild(im);
    });
    var campos=[["Produção",credito(p)],["Projeto",p.projeto],["Paisagismo",p.paisagismo],["Marca",p.marca],["Categoria",p.cat],["Fotos",p.fotos],["Local",p.local],["Mostra ou evento",p.evento]];
    document.getElementById("det-ficha").innerHTML=campos.filter(function(c){return c[1];}).map(function(c){return '<div><dt>'+esc(c[0])+'</dt><dd>'+esc(c[1])+'</dd></div>';}).join("");
  }

  // Menu: lista suspensa sob os três traços. Abre ao passar o mouse (fecha ao sair)
  // e ao clicar ou tocar (fica aberta até clicar de novo, fora dela ou apertar Esc).
  var menu=document.getElementById("menu"),menuBtn=null,menuFixo=false,menuTimer=0;
  function posMenu(){
    var r=menuBtn.getBoundingClientRect();
    if(r.bottom<=0){fecharMenu();return;}
    menu.style.top=Math.round(r.bottom)+"px";
    menu.style.right=Math.max(0,Math.round(document.documentElement.clientWidth-r.right-6))+"px"; /* texto alinhado à borda dos traços */
  }
  function abrirMenu(btn,fixo){
    clearTimeout(menuTimer);
    if(menuBtn&&menuBtn!==btn)menuBtn.setAttribute("aria-expanded","false");
    menuBtn=btn;menuFixo=menuFixo||fixo;
    menu.hidden=false;posMenu();btn.setAttribute("aria-expanded","true");
  }
  function fecharMenu(foco){
    clearTimeout(menuTimer);
    if(menu.hidden)return;
    menu.hidden=true;menuFixo=false;
    if(menuBtn){menuBtn.setAttribute("aria-expanded","false");if(foco===true)menuBtn.focus();}
  }
  function fecharDepois(){if(!menu.hidden&&!menuFixo){clearTimeout(menuTimer);menuTimer=setTimeout(fecharMenu,250);}}
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-menu]");
    if(b){
      if(!menu.hidden&&menuFixo&&menuBtn===b){fecharMenu();return;}
      abrirMenu(b,true);
      if(e.detail===0){var p=menu.querySelector("a");if(p)p.focus();} /* aberto pelo teclado: foco no primeiro item */
      return;
    }
    if(menu.hidden)return;
    if(!menu.contains(e.target)||e.target.closest("a"))fecharMenu();
  });
  document.addEventListener("pointerover",function(e){
    if(e.pointerType!=="mouse")return;
    var b=e.target.closest&&e.target.closest("[data-menu]");
    if(b){abrirMenu(b,false);return;}
    if(menu.contains(e.target)){clearTimeout(menuTimer);return;}
    fecharDepois();
  });
  document.documentElement.addEventListener("mouseleave",fecharDepois);
  menu.addEventListener("focusout",function(e){if(!menu.contains(e.relatedTarget)&&e.relatedTarget!==menuBtn)fecharMenu();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!menu.hidden)fecharMenu(true);});
  addEventListener("scroll",function(){if(!menu.hidden)posMenu();},{passive:true});
  addEventListener("resize",function(){if(!menu.hidden)posMenu();});

  // Rotas
  var VIEWS=["inicio","producoes","atividades","sobre","contato","privacidade"];
  var TITULOS={inicio:"",producoes:"Produções",atividades:"Atividades",sobre:"Sobre",contato:"Contato",privacidade:"Privacidade e Termos de Uso"};
  /* endereços que abrem uma parte da página de Privacidade e Termos de Uso */
  var PARTES={termos:"parte-termos","politica-de-privacidade":"parte-privacidade"};
  function titulo(t){document.title=t?t+" · Shylton Mavie":"Shylton Mavie · Arquiteto e produtor de ambientes";}
  function mostrar(nome){
    if(TITULOS[nome]!=null)titulo(TITULOS[nome]);
    [].forEach.call(document.querySelectorAll(".view"),function(v){v.hidden=v.getAttribute("data-view")!==nome;});
    [].forEach.call(menu.querySelectorAll("nav a"),function(a){if(a.getAttribute("href")==="#"+nome){a.setAttribute("aria-current","page");}else{a.removeAttribute("aria-current");}});
  }
  function rota(){
    var h=(location.hash||"").slice(1)||"inicio";
    if(h==="projetos"){location.replace("#producoes");return;}
    if(h==="servicos"){location.replace("#atividades");return;}
    if(h==="colaboracoes"){location.replace("#producoes");return;} /* endereço antigo */
    fecharMenu();
    if(window.SIS&&SIS.trata(h)){
      [].forEach.call(document.querySelectorAll(".view"),function(v){v.hidden=true;});
      titulo(/^cadastro-/.test(h)?"Cadastro":"Área restrita");SIS.mostrar();window.scrollTo(0,0);return;
    }
    if(window.SIS)SIS.esconder();
    if(PARTES[h]){mostrar("privacidade");var parte=document.getElementById(PARTES[h]);if(parte){parte.scrollIntoView();aoRolar();return;}}
    if(VIEWS.indexOf(h)>=0){mostrar(h);if(h==="producoes")desenharProjetos();}
    else{var p=porSlug(h);if(p){desenharProjeto(p);mostrar("projeto");titulo(p.nome);}else{mostrar("inicio");}}
    window.scrollTo(0,0);aoRolar();
  }
  window.addEventListener("hashchange",rota);
  rota();

  // Contato: a mensagem vai direto para o e-mail do Shylton (administrador 2) pelo FormSubmit, sem abrir o e-mail do visitante.
  // O primeiro envio manda ao Shylton um e-mail "Activate Form"; depois de ativado, as mensagens chegam normalmente.
  // Código do FormSubmit no lugar do e-mail: leva ao Gmail do Shylton sem expor o endereço a robôs de spam.
  var ENVIO_CONTATO="https://formsubmit.co/ajax/7b8a89291ab518e894c1a118f8945477";
  var formC=document.getElementById("form-contato"),stC=document.getElementById("ct-status");
  formC.addEventListener("input",function(e){if(e.target.getAttribute("aria-invalid")==="true"&&e.target.value.trim())e.target.setAttribute("aria-invalid","false");});
  formC.addEventListener("submit",function(e){
    e.preventDefault();
    var v=function(id){return document.getElementById(id).value.trim();};
    var d={nome:v("ct-nome"),sobrenome:v("ct-sobrenome"),email:v("ct-email"),tel:v("ct-tel"),msg:v("ct-msg")};
    var erro=null,campo=null;
    [].forEach.call(formC.querySelectorAll("[aria-invalid]"),function(x){x.setAttribute("aria-invalid","false");});
    if(!d.nome){erro="Preencha seu nome.";campo="ct-nome";}
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)){erro="Confira o email: ele precisa ter o formato nome@dominio.com.";campo="ct-email";}
    else if(!d.msg){erro="Escreva sua mensagem.";campo="ct-msg";}
    if(erro){stC.className="status erro";stC.textContent=erro;var c=document.getElementById(campo);c.setAttribute("aria-invalid","true");c.focus();return;}
    if(v("ct-honey"))return; /* campo-isca: só robôs preenchem */
    var nome=(d.nome+" "+d.sobrenome).trim();
    var btn=formC.querySelector("button[type=submit]");btn.disabled=true;
    stC.className="status";stC.textContent="Enviando…";
    fetch(ENVIO_CONTATO,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({
      Nome:nome,email:d.email,Telefone:d.tel?"+55 "+d.tel:"",Mensagem:d.msg,
      _replyto:d.email,_subject:"Contato pelo site · "+nome,_template:"table",_captcha:"false"
    })})
    .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||String(j.success)!=="true")throw new Error(j.message||"falha no envio");});})
    .then(function(){formC.reset();stC.className="status ok";stC.textContent="Mensagem enviada. O Shylton responde no seu e-mail.";})
    .catch(function(){stC.className="status erro";stC.textContent="Não foi possível enviar agora. Tente de novo em instantes ou fale pelo WhatsApp.";})
    .then(function(){btn.disabled=false;});
  });
})();
