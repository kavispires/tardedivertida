"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[379],{2090:function(e,n,t){t.d(n,{gD:function(){return s},hD:function(){return v},bf:function(){return A},Ge:function(){return w},RS:function(){return N}});var a=t(63),o=t(2427),r=t(6954),i=t(184);function s(e){var n=e.children,t=e.title,s=(0,o.ZK)().translate;return(0,i.jsx)(r.vr,{contained:!0,children:(0,i.jsx)(a.Z,{ghost:!0,children:(0,i.jsx)(a.Z.Panel,{header:s("Regras","Rules",t),children:n},"1")})})}var c=t(9439),l=t(2791),u=t(9228),d=t(7309),m=t(6146),g=t(5948);function v(e){var n=e.content,t=e.label,a=e.showLabel,o=void 0===a||a,r=(0,l.useState)(!1),s=(0,c.Z)(r,2),v=s[0],p=s[1];return(0,l.useEffect)((function(){p(o)}),[]),(0,i.jsx)("div",{className:"popover-rule",children:(0,i.jsx)(u.Z,{placement:"bottomLeft",content:n,trigger:"click",children:(0,i.jsxs)(d.Z,{shape:"round",size:"large",onMouseOver:function(){return p(!0)},onMouseLeave:function(){return p(null!==o&&void 0!==o&&o)},children:[(0,i.jsx)(m.Z,{}),v&&Boolean(t)?t:(0,i.jsx)(g.v,{pt:" Regras",en:" Rules"})]})})})}var p=t(1413),f=t(8182),j=t(535),x=t(1735),h=t(5281),Z=t(6591),b=t(9617),k=t(5542);function A(e){var n=e.info,t=e.className,a=void 0===t?"":t,r=e.ruleClass,s=void 0===r?"":r,c=(0,o.ZK)().language,l={prevArrow:(0,i.jsx)(d.Z,{children:(0,i.jsx)(b.Z,{className:"rules-carousel__nav rules-carousel__nav--left"})}),nextArrow:(0,i.jsx)(d.Z,{children:(0,i.jsx)(k.Z,{className:"rules-carousel__nav rules-carousel__nav--right"})})};return(0,i.jsx)(j.Z,(0,p.Z)((0,p.Z)({className:(0,f.Z)("rules-carousel",a),autoplay:!0,autoplaySpeed:15e3,arrows:!0},l),{},{children:n.rules[c].map((function(e,t){return(0,i.jsxs)("div",{className:(0,f.Z)("rules-carousel__rule",s),children:[(0,i.jsx)("span",{className:"rules-carousel__rule-number",children:t+1}),(0,i.jsx)(x.Z,{className:"rules-carousel__image",src:0===t?"".concat(Z.fQ.BANNERS,"game-image-").concat(n.gameName,"-").concat(c,".jpg"):"".concat(Z.fQ.RULES,"game-rule-").concat(n.gameName,"-").concat(t,".jpg"),fallback:"".concat(Z.fQ.RULES,"game-rule-not-found.jpg"),alt:e}),(0,i.jsx)(h.Z.Paragraph,{className:"rules-carousel__rule-text",children:e})]},e)}))}))}function w(e){var n=e.children,t=e.className,a=void 0===t?"":t;return(0,i.jsx)("ul",{className:(0,f.Z)("rules-list",a),children:n})}var S=t(2862);function N(e){var n=e.gameInfo,t=(0,o.ZK)(),a=t.language,r=t.translate,s=(0,l.useState)(!1),u=(0,c.Z)(s,2),v=u[0],p=u[1],f=function(){p(!1)};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(d.Z,{type:"default",onClick:function(){return p(!0)},icon:(0,i.jsx)(m.Z,{}),children:(0,i.jsx)(g.v,{pt:"Regras",en:"Rules"})}),v&&(0,i.jsx)(S.Z,{title:"".concat(r("Regras","Rules"),": ").concat(n.title[a]),visible:v,onCancel:f,className:"rules-modal",footer:[(0,i.jsx)(d.Z,{onClick:f,children:(0,i.jsx)(g.v,{pt:"Fechar",en:"Close"})},"close")],children:(0,i.jsx)(A,{info:n})})]})}},6954:function(e,n,t){t.d(n,{vr:function(){return i},dx:function(){return c},Bw:function(){return l},Dx:function(){return u}});var a=t(8182),o=t(5281),r=t(184),i=function(e){var n=e.children,t=e.white,i=e.className,s=e.contained,c=e.fullWidth,l="instruction";return(0,r.jsx)(o.Z.Text,{className:(0,a.Z)(l,s&&"".concat(l,"--contained"),t&&"".concat(l,"--white"),c&&"".concat(l,"--full-width"),i),"data-testid":"instruction",children:n})},s=t(5948);function c(e){var n,t,a,o,c=e.round;return(0,r.jsx)(i,{contained:!0,children:(0,r.jsx)(s.v,{pt:(0,r.jsxs)(r.Fragment,{children:["Faltam ",(0,r.jsx)("strong",{children:(null!==(n=null===c||void 0===c?void 0:c.total)&&void 0!==n?n:0)-(null!==(t=null===c||void 0===c?void 0:c.current)&&void 0!==t?t:0)})," rodadas para o jogo terminar..."]}),en:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("strong",{children:(null!==(a=null===c||void 0===c?void 0:c.total)&&void 0!==a?a:0)-(null!==(o=null===c||void 0===c?void 0:c.current)&&void 0!==o?o:0)})," rounds left for the game to end..."]})})})}function l(e){var n=e.children;return(0,r.jsx)("span",{className:"text-highlight",children:n})}var u=function(e){var n=e.children,t=e.white,i=e.icon,s=e.className,c=e.level,l=void 0===c?1:c,u=e.size,d=void 0===u?"large":u;return(0,r.jsxs)(o.Z.Title,{level:l,className:(0,a.Z)("title","title--".concat(d),t&&"title--white",s),children:[Boolean(i)&&i,n]})}},2950:function(e,n,t){t.r(n),t.d(n,{default:function(){return J}});var a=t(5861),o=t(9439),r=t(7757),i=t.n(r),s=t(2791),c=t(6871),l=t(419),u=t(586),d=t(2745),m=t(7309),g=t(1333),v=t(3099),p=t(5281),f=t(950),j=t(9650),x=t(2427),h=t(5603),Z=t(4598),b=t(446),k=t(6591),A=t(5948),w=t(184);function S(){var e=(0,c.s0)(),n=(0,x._)(),t=(0,o.Z)(n,1)[0],a=(0,s.useState)([]),r=(0,o.Z)(a,2),i=r[0],l=r[1],u=function(){var e;l(Object.keys(null!==(e=t(k.$l))&&void 0!==e?e:{}).sort())};return(0,s.useEffect)((function(){u()}),[]),(0,w.jsxs)(v.Z,{children:[(0,w.jsxs)("span",{children:[(0,w.jsx)(A.v,{pt:"Jogos criados recentemente (por voc\xea)",en:"Recently created games (by you)"}),":"]}),i.map((function(n){return(0,w.jsx)(m.Z,{ghost:!0,onClick:function(){return function(n){e(n)}(n)},children:n},"recent-".concat(n))})),(0,w.jsx)(Z.Z,{title:(0,w.jsx)(A.v,{pt:"Atualizar lista",en:"Refresh list"}),children:(0,w.jsx)(m.Z,{shape:"circle",icon:(0,w.jsx)(b.Z,{}),onClick:u,ghost:!0})})]})}var N=t(5594),C=t(915),y=t(1735),_=t(7528),R=t(2090),V=t(4942),G=t(1413),B=t(8182),O=t(3085),P=t(2862),z=t(5581),F=t(3673),D=t(6954),E=t(9119),I=function(e,n){var t=Date.now(),a=t-864e5,r=Object.entries(null!==e&&void 0!==e?e:{}).reduce((function(e,n){var t=(0,o.Z)(n,2),r=t[0],i=t[1];return i>a&&(e[r]=i),e}),{});return(0,V.Z)({},k.$l,(0,G.Z)((0,G.Z)({},r),{},(0,V.Z)({},n,t)))};function T(e){var n=e.gameInfo,t=(0,c.s0)(),r=(0,x.ZK)(),u=r.language,d=r.translate,p=(0,x.r$)().setLoader,f=(0,x._)(),j=(0,o.Z)(f,2),h=j[0],Z=j[1],b=(0,s.useState)(!1),S=(0,o.Z)(b,2),N=S[0],C=S[1],_=(0,s.useState)(!1),R=(0,o.Z)(_,2),B=R[0],z=R[1],T=(0,s.useState)(null),K=(0,o.Z)(T,2),L=K[0],Q=K[1],J=(0,x.j1)("userId"),U=(0,o.Z)(J,2)[1],W=(0,x.j1)("username"),$=(0,o.Z)(W,2)[1],H=(0,x.j1)("userAvatarId"),q=(0,o.Z)(H,2)[1],X=(0,s.useState)({}),Y=(0,o.Z)(X,2),ee=Y[0],ne=Y[1],te=(0,s.useCallback)((function(){C(!1)}),[]),ae=function(){var e=(0,a.Z)(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,p("create",!0),z(!0),e.next=5,F.c2.createGame({gameCode:n.gameCode,language:u,options:ee});case 5:(t=e.sent).data.gameId&&(Q(t.data.gameId),U(null),$(""),q(""),Z(I(h(k.$l),t.data.gameId))),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(0),O.Z.error({message:d("Aplicativo encontrou um erro ao tentar criar o jogo","The application found an error while trying to create a game",u),description:JSON.stringify(e.t0.message),placement:"bottomLeft"}),console.error(e.t0),C(!1);case 14:return e.prev=14,z(!1),p("create",!1),e.finish(14);case 18:case"end":return e.stop()}}),e,null,[[0,9,14,18]])})));return function(){return e.apply(this,arguments)}}();return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(m.Z,{type:"primary",onClick:function(){return C(!0)},children:(0,w.jsx)(A.v,{pt:"Criar Jogo",en:"Create Game"})}),N&&(0,w.jsx)(P.Z,{title:"".concat(d("Criando novo jogo","Creating new game"),": ").concat(n.title[u]),visible:N,onCancel:te,onOk:function(){L?t("/".concat(L)):l.ZP.info(d("P\xe9ra! O jogo ainda n\xe3o foi inicializado.","Wait! The game has not been created"))},okButtonProps:{disabled:Boolean(!L)},maskClosable:!1,children:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(y.Z,{alt:n.title[u],src:"".concat(k.fQ.BANNERS,"game-image-").concat(n.gameName,"-").concat(u,".jpg"),fallback:"".concat(k.fQ.BANNERS,"/game-image-em-breve-").concat(u,".jpg")}),(0,w.jsx)(M,{options:n.options,disabled:B||Boolean(L),onChangeOptions:function(e,n){ne((function(t){return(0,G.Z)((0,G.Z)({},t),{},(0,V.Z)({},e,n))}))},selectedOptions:ee}),(0,w.jsx)(g.Z,{}),B&&(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(D.vr,{children:(0,w.jsx)(A.v,{pt:"O jogo est\xe1 sendo criado...",en:"The game session is being created"})}),(0,w.jsx)(E.gb,{message:d("Gerando...","Generating..."),margin:!0})]}),Boolean(L)?(0,w.jsxs)("div",{children:[(0,w.jsxs)(D.Dx,{className:"center",children:[(0,w.jsx)(A.v,{pt:"Jogo inicializado",en:"Game Initialized"}),": ",L]}),(0,w.jsx)(D.vr,{children:(0,w.jsx)(A.v,{pt:"Pressione OK para ser redirecionadx \xe0 p\xe1gina do jogo.",en:"Press OK to be redirected to the game page"})})]}):(0,w.jsx)(v.Z,{className:"space-container",align:"center",children:(0,w.jsx)(m.Z,{type:"primary",size:"large",disabled:B,onClick:ae,children:(0,w.jsx)(A.v,{pt:"Criar Jogo",en:"Create Game"})})})]})})]})}function M(e){var n=e.options,t=e.disabled,a=e.onChangeOptions,o=e.selectedOptions;return Boolean(n)?(0,w.jsxs)("div",{className:"create-game-modal-options",children:[(0,w.jsx)(p.Z.Title,{level:5,className:"create-game-modal-options__title",children:(0,w.jsx)(A.v,{pt:"Op\xe7\xf5es:",en:"Options:"})}),n.map((function(e,n){var r,i;return(0,w.jsxs)(p.Z.Paragraph,{className:"create-game-modal-options__option",children:[(0,w.jsx)("span",{className:"create-game-modal-options__label",children:e.label}),(0,w.jsx)("span",{className:(0,B.Z)("create-game-modal-options__off",!o[e.key]&&"create-game-modal-options__selected"),children:null!==(r=null===e||void 0===e?void 0:e.off)&&void 0!==r?r:""}),(0,w.jsx)(z.Z,{disabled:t,onChange:function(n){return a(e.key,n)}}),(0,w.jsx)("span",{className:(0,B.Z)("create-game-modal-options__on",o[e.key]&&"create-game-modal-options__selected"),children:null!==(i=null===e||void 0===e?void 0:e.on)&&void 0!==i?i:""})]},"option-".concat(e.label))}))]}):(0,w.jsx)("div",{className:"create-game-modal-options create-game-modal-options__no-options",children:(0,w.jsx)(p.Z.Text,{children:(0,w.jsx)(A.v,{pt:"Este jogo n\xe3o possui customiza\xe7\xf5es",en:"This game does not support customizations"})})})}var K=t(897);function L(e){var n,t,a,r=e.game,i=(0,x.Bs)(),s=(0,o.Z)(i,1)[0],c=(0,x.ZK)(),l=c.language,u=c.translate;return(0,w.jsx)(N.Z.Ribbon,{text:r.version,color:(a=r.version,a.endsWith("alpha")?"#F97659":"beta"===a?"#F9D859":a.startsWith("1.")?"#72D984":a.startsWith("2.")?"#7CBD51":"#96A0A3"),children:(0,w.jsxs)(C.Z,{hoverable:!0,style:{width:s&&s>0?Math.max(s/5,250):250},cover:(0,w.jsx)(y.Z,{alt:r.title[l],src:"".concat(k.fQ.BANNERS,"game-image-").concat(r.gameName,"-").concat(l,".jpg"),fallback:"".concat(k.fQ.BANNERS,"/game-image-em-breve-").concat(l,".jpg")}),children:[(0,w.jsx)(C.Z.Meta,{title:r.title[l],description:"".concat(u("Baseado em","Based on")," ").concat(r.basedOn.split("").reverse().join(""))}),(0,w.jsx)(C.Z.Meta,{style:{marginTop:"24px"},description:r.summary[l]}),(0,w.jsx)(g.Z,{}),(0,w.jsx)(C.Z.Meta,{description:u("Para ".concat(r.playerCount.min,"-").concat(r.playerCount.max," jogadores"),"For ".concat(r.playerCount.min,"-").concat(r.playerCount.max," players"))}),(0,w.jsx)(C.Z.Meta,{description:u("Recomendado jogar com ".concat(r.playerCount.recommended),"Recommended with ".concat(r.playerCount.recommended))}),r.mobileFriendly&&(0,w.jsx)(C.Z.Meta,{description:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(K.Z,{})," ",(0,w.jsx)(A.v,{pt:"Funciona em aparelhos m\xf3veis",en:"Mobile friendly"})]})}),(0,w.jsx)(g.Z,{}),(0,w.jsx)(v.Z,{wrap:!0,size:[1,6],prefixCls:r.gameName,style:{display:"flex"},children:r.tags.map((function(e){var n,t;return(0,w.jsx)(_.Z,{color:null===(n=k.Up[e])||void 0===n?void 0:n.color,children:"pt"===l?null===(t=k.Up[e])||void 0===t?void 0:t.label:e},"".concat(r.gameCode,"-").concat(e))}))}),(0,w.jsx)(g.Z,{}),(0,w.jsxs)(v.Z,{children:[Boolean((null===(n=r.rules)||void 0===n||null===(t=n[l])||void 0===t?void 0:t.length)>1)&&(0,w.jsx)(R.RS,{gameInfo:r}),Boolean(r.available[l])&&(0,w.jsx)(T,{gameInfo:r})]})]},r.gameName)})}var Q=h;var J=function(){var e=(0,c.s0)(),n=(0,x.ZK)().language,t=(0,x._)(),r=(0,o.Z)(t,1)[0],h=(0,x.j1)("language"),Z=(0,o.Z)(h,2)[1],b=(0,x.j1)("isAuthenticated"),k=(0,o.Z)(b,2)[1];(0,s.useEffect)((function(){var e=r("language");e&&Z(e)}),[]);var N=function(){var n=(0,a.Z)(i().mark((function n(){return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,(0,j.w7)();case 3:k(!1),e("/"),n.next=10;break;case 7:n.prev=7,n.t0=n.catch(0),l.ZP.error("Something went wrong",n.t0);case 10:case"end":return n.stop()}}),n,null,[[0,7]])})));return function(){return n.apply(this,arguments)}}(),C=(0,s.useMemo)((function(){return Object.values(Q).sort((function(e,t){return e.title[n]>t.title[n]?1:-1})).reduce((function(e,t){return t.available[n]?e.availableGames.push(t):e.comingSoonGames.push(t),e}),{availableGames:[],comingSoonGames:[]})}),[n]),y=C.availableGames,_=C.comingSoonGames;return(0,w.jsxs)(u.Z.Content,{className:"container",children:[(0,w.jsx)(d.Z,{title:(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(f.Z,{})," Hub"]}),subTitle:(0,w.jsx)(A.v,{pt:"Selecione um jogo para come\xe7ar",en:"Select a game to start"}),extra:[(0,w.jsx)(A.U,{},"language-switch"),(0,w.jsx)(m.Z,{danger:!0,ghost:!0,onClick:N,children:"Logout"},"logout-button")]}),(0,w.jsx)(g.Z,{}),(0,w.jsx)(S,{}),(0,w.jsx)(g.Z,{}),(0,w.jsx)(v.Z,{size:[8,16],wrap:!0,align:"start",children:y.map((function(e,n){return(0,w.jsx)(L,{game:e},"".concat(e.gameCode,"-").concat(n))}))}),(0,w.jsx)(g.Z,{}),(0,w.jsx)(p.Z.Title,{level:2,children:(0,w.jsx)(A.v,{pt:"Em Breve",en:"Coming Soon"})}),(0,w.jsx)(v.Z,{size:[8,16],wrap:!0,align:"start",children:_.map((function(e,n){return(0,w.jsx)(L,{game:e},"".concat(e.gameCode,"-").concat(n))}))})]})}},3673:function(e,n,t){t.d(n,{D0:function(){return r},c2:function(){return i},qU:function(){return s},RS:function(){return c},yD:function(){return l},sZ:function(){return u},zA:function(){return d},XI:function(){return m},mA:function(){return g},sQ:function(){return v},h5:function(){return p},r4:function(){return f},u7:function(){return j},SA:function(){return x},K3:function(){return h},nD:function(){return Z},Gm:function(){return b},aC:function(){return k},WJ:function(){return A}});var a=t(9650),o=t(5006),r={loadGame:(0,o.V1)(a.wk,"loadGame"),addPlayer:(0,o.V1)(a.wk,"addPlayer"),makePlayerReady:(0,o.V1)(a.wk,"makePlayerReady"),rateGame:(0,o.V1)(a.wk,"rateGame")},i={createGame:(0,o.V1)(a.wk,"createGame"),lockGame:(0,o.V1)(a.wk,"lockGame"),performAdminAction:(0,o.V1)(a.wk,"performAdminAction")},s={submitAction:(0,o.V1)(a.wk,"arteRuimSubmitAction")},c={submitAction:(0,o.V1)(a.wk,"contadoresHistoriasSubmitAction")},l={submitAction:(0,o.V1)(a.wk,"detetivesImaginativosSubmitAction")},u={submitAction:(0,o.V1)(a.wk,"espiaoEntreNosSubmitAction")},d={submitAction:(0,o.V1)(a.wk,"galeriaDeSonhosSubmitAction")},m={submitAction:(0,o.V1)(a.wk,"crimesHediondosSubmitAction")},g=((0,o.V1)(a.wk,"instrumentosCodificadosSubmitAction"),{submitAction:(0,o.V1)(a.wk,"linhasCruzadasSubmitAction")}),v={submitAction:(0,o.V1)(a.wk,"menteColetivaSubmitAction")},p={submitAction:(0,o.V1)(a.wk,"naRuaDoMedoSubmitAction")},f={submitAction:(0,o.V1)(a.wk,"ondaTelepaticaSubmitAction")},j={submitAction:(0,o.V1)(a.wk,"polemicaDaVezSubmitAction")},x={submitAction:(0,o.V1)(a.wk,"retratoFaladoSubmitAction")},h={submitAction:(0,o.V1)(a.wk,"sonhosPesadelosSubmitAction")},Z={submitAction:(0,o.V1)(a.wk,"testemunhaOcularSubmitAction")},b={submitAction:(0,o.V1)(a.wk,"ueSoIssoSubmitAction")},k={submitAction:(0,o.V1)(a.wk,"vendavalDePalpiteSubmitAction")},A={submitAction:(0,o.V1)(a.wk,"cruzaPalavrasSubmitAction")}}}]);
//# sourceMappingURL=page-hub.b716effa.chunk.js.map