"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[6379],{69483:function(e,n,a){a.d(n,{s:function(){return v}});var t=a(18489),r=a(33032),s=a(84322),o=a.n(s),i=a(91933),c=a(57689),l=a(12661),u=a(91082),d=a(2641),m=a(72913),p=a(82741),g=a(80184);function v(e){var n=(0,c.s0)(),a=l.Z.useApp().message,s=(0,i.useMutation)({mutationFn:function(){var e=(0,r.Z)(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,m.w7)();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),onSuccess:function(){n("/")},onError:function(e){a.error("Something went wrong: ".concat(JSON.stringify(e,null,2)))}}),v=s.isLoading,h=s.mutate;return(0,g.jsx)(u.Z,{title:(0,g.jsx)(p.vN,{pt:"Tem certeza que quer deslogar?",en:"Are you sure you want to log out?"}),onConfirm:function(){return h()},children:(0,g.jsx)(d.ZP,(0,t.Z)((0,t.Z)({danger:!0,ghost:!0},e),{},{loading:v,children:"Logout"}))},"logout-button")}},37274:function(e,n,a){a.d(n,{v:function(){return d}});var t=a(18489),r=a(83738),s=a(71046),o=a(20952),i=a(20670),c=a(76591),l=a(80184),u=["tags","gameCode"];function d(e){var n=e.tags,a=e.gameCode,d=(0,r.Z)(e,u),m=(0,i.Z)().language,p=function(e){var n=[];return e.forEach((function(e){var a;void 0!==(null===c.Up||void 0===c.Up||null===(a=c.Up[e])||void 0===a?void 0:a.index)?n[c.Up[e].index]=e:n.length<18?n[18]=e:n.push(e)})),n.filter((function(e){return Boolean(e)}))}(n);return(0,l.jsx)(s.Z,(0,t.Z)((0,t.Z)({wrap:!0},d),{},{children:p.map((function(e){var n,t;return(0,l.jsx)(o.Z,{color:null===(n=c.Up[e])||void 0===n?void 0:n.color,children:null===(t=c.Up[e])||void 0===t?void 0:t.label[m]},"".concat(a,"-").concat(e))}))}))}},43418:function(e,n,a){a.d(n,{R:function(){return o}});var t=a(50678),r=a(81238),s=a(3224);function o(){var e=(0,s.j1)("isDebugEnabled"),n=(0,t.Z)(e,2),a=n[0],o=n[1];return{isDevEnv:r.WC,isDebugEnabled:a,toggleDevFeatures:function(){o((function(e){return!e}))}}}},34812:function(e,n,a){a.d(n,{B:function(){return c}});var t=a(71046),r=a(64248),s=a(57689),o=a(80184);function i(){var e=(0,s.TH)().pathname,n=(0,s.s0)(),a=[{label:"Home",value:"/",disabled:"/"===e},{label:"Hub",value:"/hub",disabled:"/hub"===e},{label:"Icons",value:"/dev/icons",disabled:"/dev/icons"===e},{label:"Colors",value:"/dev/colors",disabled:"/dev/colors"===e},{label:"Sprites",value:"/dev/sprites",disabled:"/dev/sprites"===e},{label:"Resources",value:"/dev/resources",disabled:"/dev/resources"===e},{label:"Playground",value:"/dev/playground",disabled:"/dev/playground"===e},{label:"Daily Setup",value:"/dev/dailysetup",disabled:"/dev/dailysetup"===e},{label:"Showcase",value:"/showcase",disabled:"/showcase"===e}];return(0,o.jsx)(r.Z,{options:a,defaultValue:e,onChange:function(e){n(e)}})}function c(e){var n=e.title,a=e.subTitle,r=e.extra;return(0,o.jsx)("header",{className:"dev-header",children:(0,o.jsxs)("div",{className:"dev-header__heading",children:[(0,o.jsxs)("div",{className:"dev-header__left",children:[(0,o.jsxs)("span",{className:"dev-header__title",children:[n," "]}),(0,o.jsx)("span",{className:"dev-header__subtitle",children:a})]}),(0,o.jsxs)("div",{className:"dev-header__extra",children:[(0,o.jsx)(t.Z,{className:"dev-header__extra-space",wrap:!0,children:r}),(0,o.jsx)(i,{})]})]})})}},19554:function(e,n,a){a.r(n),a.d(n,{default:function(){return pe}});var t=a(50678),r=a(72791),s=a(66509),o=a(20263),i=a(83990),c=a(14078),l=a(77128),u=a(66106),d=a(30914),m=a(10950),p=a(3224),g=a(20670),v=a(16728),h=a(65532),x=a(76591),j=a(81238),f=a(36473),Z=a(51678),b=a(59425),y=a(71046),N=a(12090),w=a(33032),_=a(36222),C=a(18489),S=a(84322),F=a.n(S),T=a(63733),k=a(57689),A=a(75678),E=a(763),R=a(12661),D=a(2641),O=a(40959),I=a(71234),B=a(25922),z=a(53673),G=a(50410),P=a(91933),W=a(1918);var M=a(82741),U=a(2208),L=a(79119),H=a(80184),J=function(e,n){var a=Date.now(),r=a-864e5,s=Object.entries(null!==e&&void 0!==e?e:{}).reduce((function(e,n){var a=(0,t.Z)(n,2),s=a[0],o=a[1];return o>r&&(e[s]=o),e}),{});return(0,_.Z)({},x.$l,(0,C.Z)((0,C.Z)({},s),{},(0,_.Z)({},n,a)))};function q(e){var n=e.gameInfo,a=R.Z.useApp(),s=a.message,o=a.notification,i=(0,k.s0)(),c=(0,k.TH)().pathname,u=(0,A.Z)(),d=(0,t.Z)(u,2),m=d[0],h=d[1],j=(0,g.Z)(),f=j.language,Z=j.translate,N=(0,G.r)().setLoader,S=(0,v._)(),T=(0,t.Z)(S,2),B=T[0],q=T[1],Y=(0,r.useState)(!1),K=(0,t.Z)(Y,2),V=K[0],$=K[1],X=(0,r.useState)(!1),ee=(0,t.Z)(X,2),ne=ee[0],ae=ee[1],te=(0,r.useState)(null),re=(0,t.Z)(te,2),se=re[0],oe=re[1],ie=(0,p.j1)("userId"),ce=(0,t.Z)(ie,2)[1],le=(0,p.j1)("username"),ue=(0,t.Z)(le,2)[1],de=(0,p.j1)("userAvatarId"),me=(0,t.Z)(de,2)[1],pe=(0,r.useState)({}),ge=(0,t.Z)(pe,2),ve=ge[0],he=ge[1],xe=function(e){var n=Object.entries(e).map((function(e){var n=(0,t.Z)(e,2);return{gameId:n[0],createdAt:n[1]}}));if(n.length<2)return null;var a=(0,E.orderBy)(n,"createdAt","desc"),r=Date.now();return a[1].createdAt-r>72e5?null:a[1].gameId}(B(x.$l)),je=function(){var e,n,a=R.Z.useApp().notification,s=(0,W.O)().currentUser,o=(0,r.useState)(!1),i=(0,t.Z)(o,2),c=i[0],l=i[1],u=(0,r.useState)(""),d=(0,t.Z)(u,2),m=d[0],p=d[1],g=(0,r.useState)({gameId:"",gameName:""}),v=(0,t.Z)(g,2),h=v[0],j=v[1],f=(0,P.useQuery)({queryKey:["meta",m],queryFn:function(){var e=(0,w.Z)(F().mark((function e(){return F().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.count("Fetching game meta..."),e.next=3,z.D0.run({action:z.rl.LOAD_GAME,gameId:m});case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),enabled:Boolean(m),onError:function(e){console.error(e),a.error({message:"Failed to load previous game to trigger the redirect",description:JSON.stringify(e.message)})}}),Z=(0,P.useMutation)({mutationKey:["oldState",h.gameId],mutationFn:function(){var e=(0,w.Z)(F().mark((function e(n){var a,t,r;return F().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=null===(a=f.data)||void 0===a?void 0:a.data,e.next=3,z.c2.performAdminAction({gameId:m,gameName:null!==(t=null===r||void 0===r?void 0:r.gameName)&&void 0!==t?t:"",playerId:s.id,action:x.ND.FORCE_STATE_PROPERTY,state:n});case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),onSuccess:function(){var e=(0,w.Z)(F().mark((function e(){return F().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.success({message:"Redirect successfully triggered"});case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),onError:function(e){console.error(e),a.error({message:"Failed to load previous game to continue the redirect",description:JSON.stringify(e.message)})}});(0,r.useEffect)((function(){var e,n;!c&&m&&h.gameId&&h.gameName&&f.isSuccess&&null!==f&&void 0!==f&&null!==(e=f.data)&&void 0!==e&&null!==(n=e.data)&&void 0!==n&&n.gameName&&(l(!0),Z.mutate({redirect:(0,C.Z)({redirectAt:Date.now()},h)}))}),[m,c,h,null===f||void 0===f||null===(e=f.data)||void 0===e||null===(n=e.data)||void 0===n?void 0:n.gameName,f.isSuccess,Z]);var b=function(){var e=(0,w.Z)(F().mark((function e(n,t,r){return F().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!c){e.next=3;break}return a.error({message:"Redirect has failed to trigger"}),e.abrupt("return");case 3:j({gameId:t,gameName:r}),p(n);case 5:case"end":return e.stop()}}),e)})));return function(n,a,t){return e.apply(this,arguments)}}();return{isSettingRedirect:f.isLoading&&Z.isLoading,startRedirect:b,wasRedirectSuccessful:Z.isSuccess}}(),fe=je.startRedirect,Ze=je.isSettingRedirect,be=je.wasRedirectSuccessful;(0,r.useEffect)((function(){m.value&&se&&s.info("Copied to clipboard: ".concat(m.value))}),[m,se,s]);var ye=(0,r.useCallback)((function(){$(!1)}),[]),Ne=function(){var e=(0,w.Z)(F().mark((function e(){var a,t;return F().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,N("create",!0),ae(!0),e.next=5,z.c2.run({action:z.tk.CREATE_GAME,gameName:n.gameName,language:f,options:ve});case 5:(a=e.sent).data.gameId&&(oe(a.data.gameId),ce(null),ue(""),me(""),q(J(B(x.$l),a.data.gameId)),t=window.location.href.split(c)[0],h("".concat(t,"/").concat(a.data.gameId))),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(0),o.error({message:Z("Aplicativo encontrou um erro ao tentar criar o jogo","The application found an error while trying to create a game",f),description:JSON.stringify(e.t0.message),placement:"bottomLeft"}),console.error(e.t0),$(!1);case 14:return e.prev=14,ae(!1),N("create",!1),e.finish(14);case 18:case"end":return e.stop()}}),e,null,[[0,9,14,18]])})));return function(){return e.apply(this,arguments)}}(),we=function(){var e=(0,w.Z)(F().mark((function e(){return F().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:se?i("/".concat(se)):s.info(Z("P\xe9ra! O jogo ainda n\xe3o foi inicializado.","Wait! The game has not been created"));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(D.ZP,{type:"primary",onClick:function(){return $(!0)},block:!0,children:(0,H.jsx)(M.vN,{pt:"Criar",en:"Create"})}),V&&(0,H.jsx)(O.Z,{title:"".concat(Z("Criando novo jogo","Creating new game"),": ").concat(n.title[f]),open:V,onCancel:ye,onOk:we,okButtonProps:{disabled:Boolean(!se)||Ze},maskClosable:!1,children:(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(b.Z,{alt:n.title[f],src:"".concat(x.fQ.BANNERS).concat(n.gameName,"-").concat(f,".jpg"),fallback:"".concat(x.fQ.BANNERS,"/em-breve-").concat(f,".jpg"),className:"round-corners"}),(0,H.jsx)(Q,{options:n.options,disabled:ne||Boolean(se),onChangeOptions:function(e,n){he((function(a){return(0,C.Z)((0,C.Z)({},a),{},(0,_.Z)({},e,n))}))},selectedOptions:ve}),(0,H.jsx)(l.Z,{}),ne&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(U.vr,{children:(0,H.jsx)(M.vN,{pt:"O jogo est\xe1 sendo criado...",en:"The game session is being created"})}),(0,H.jsx)(L.gb,{message:Z("Gerando...","Generating..."),margin:!0})]}),n.version.startsWith("alpha")&&(0,H.jsx)(I.Z,{type:"warning",showIcon:!0,message:(0,H.jsx)(M.vN,{pt:"Este jogo est\xe1 em alpha, n\xe3o o jogue",en:"This game is still in alpha and shouldn't be played"})}),n.version.startsWith("beta")&&(0,H.jsx)(I.Z,{type:"warning",showIcon:!0,message:(0,H.jsx)(M.vN,{pt:"Este jogo est\xe1 em beta, prossiga com cuidado",en:"This game is in beta and bugs might be everywhere"})}),Boolean(se)?(0,H.jsxs)("div",{children:[(0,H.jsxs)(U.Dx,{className:"center",children:[(0,H.jsx)(M.vN,{pt:"Jogo inicializado",en:"Game Initialized"}),": ",se]}),(0,H.jsxs)(U.vr,{children:[xe&&!be&&(0,H.jsx)(I.Z,{type:"info",showIcon:!0,message:(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(M.vN,{pt:(0,H.jsxs)(H.Fragment,{children:["Voc\xea quer redirecionar jogadores em ",xe," para essa nova partida?"]}),en:(0,H.jsxs)(H.Fragment,{children:["Redirect players in ",xe," to this new play?"]})}),(0,H.jsx)(D.ZP,{size:"large",onClick:function(){return fe(null!==xe&&void 0!==xe?xe:"",null!==se&&void 0!==se?se:"",n.gameName)},disabled:!se||!xe,loading:Ze,children:(0,H.jsx)(M.vN,{pt:"Redirecione-os",en:"Redirect them"})})]})}),be&&(0,H.jsx)(I.Z,{type:"info",showIcon:!0,message:(0,H.jsx)(M.vN,{pt:(0,H.jsxs)(H.Fragment,{children:["Jogadores em ",xe," foram convidados para o jogo ",se]}),en:(0,H.jsxs)(H.Fragment,{children:["Players in ",xe," have been invited to ",se]})})})]})]}):(0,H.jsx)(y.Z,{className:"space-container",align:"center",children:(0,H.jsx)(D.ZP,{type:"primary",size:"large",disabled:ne,onClick:Ne,children:(0,H.jsx)(M.vN,{pt:"Criar Jogo",en:"Create Game"})})})]})})]})}function Q(e){var n=e.options,a=void 0===n?[]:n,t=e.disabled,r=e.onChangeOptions,s=e.selectedOptions;return Boolean(a.length)?(0,H.jsxs)("div",{className:"create-game-modal-options",children:[(0,H.jsx)(c.Z.Title,{level:5,className:"create-game-modal-options__title",children:(0,H.jsx)(M.vN,{pt:"Op\xe7\xf5es:",en:"Options:"})}),(0,H.jsx)("div",{className:"create-game-modal-options__list",children:(null!==a&&void 0!==a?a:[]).map((function(e){var n,a;return(0,H.jsxs)(c.Z.Paragraph,{className:(0,T.Z)("create-game-modal-options__option",e.disabled&&"create-game-modal-options__option--disabled"),children:[(0,H.jsx)("span",{className:"create-game-modal-options__label",children:e.label}),(0,H.jsx)("span",{className:(0,T.Z)("create-game-modal-options__off",!s[e.key]&&"create-game-modal-options--selected"),children:null!==(n=null===e||void 0===e?void 0:e.off)&&void 0!==n?n:""}),(0,H.jsx)(B.Z,{disabled:t||e.disabled,onChange:function(n){return r(e.key,n)}}),(0,H.jsx)("span",{className:(0,T.Z)("create-game-modal-options__on",s[e.key]&&"create-game-modal-options--selected"),children:null!==(a=null===e||void 0===e?void 0:e.on)&&void 0!==a?a:""}),Boolean(e.description)&&(0,H.jsx)("span",{className:"create-game-modal-options__option-description",children:e.description})]},"option-".concat(e.label))}))})]}):(0,H.jsx)("div",{className:"create-game-modal-options create-game-modal-options__no-options",children:(0,H.jsx)(c.Z.Text,{children:(0,H.jsx)(M.vN,{pt:"Este jogo n\xe3o possui customiza\xe7\xf5es",en:"This game does not support customizations"})})})}var Y=a(37274),K=a(26814),V=function(e){if(e.includes("dev"))return"#6cb3f6";if(e.includes("alpha"))return"#F97659";if(e.includes("beta"))return"#F9D859";var n=Number(e.split(".")[0]);return isNaN(n)?"#96A0A3":0===n?"#F9D859":1===n?"#72D984":2===n||n>=3?"#7CBD51":"#96A0A3"};function $(e){var n,a,t=e.game,r=e.isAdmin,s=void 0===r||r,o=(0,g.Z)(),i=o.language,c=o.translate,u=(0,j.yG)(t);return(0,H.jsxs)(f.Z,{className:"game-card",cover:(0,H.jsx)(Z.Z.Ribbon,{text:t.version,color:V(t.version),children:(0,H.jsx)(b.Z,{alt:t.title[i],src:"".concat(x.fQ.BANNERS).concat(t.gameName,"-").concat(i,".jpg"),fallback:"".concat(x.fQ.BANNERS,"/em-breve-").concat(i,".jpg")})}),children:[(0,H.jsx)("div",{className:"game-card__contents",children:(0,H.jsxs)(y.Z,{direction:"vertical",children:[(0,H.jsx)(f.Z.Meta,{title:(0,H.jsxs)("span",{className:"game-card__title",title:t.title[i],children:[j.WC&&"[".concat(t.gameCode,"]")," ",t.title[i]]}),description:"".concat(c("Baseado em","Based on")," ").concat(t.basedOn.split("").reverse().join(""))}),(0,H.jsx)(f.Z.Meta,{className:"game-card__description",description:t.summary[i]}),Boolean((null===(n=t.rules)||void 0===n||null===(a=n[i])||void 0===a?void 0:a.length)>1)&&(0,H.jsx)(N.RS,{gameInfo:t,buttonProps:{size:"small",className:"game-card__margin-bottom"}}),(0,H.jsx)(Y.v,{wrap:!0,size:[1,6],style:{display:"flex"},gameCode:t.gameCode,tags:t.tags})]})}),(0,H.jsxs)("div",{className:"game-card__actions",children:[t.duration&&(0,H.jsx)(f.Z.Meta,{description:(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(K.Z,{})," ",u.min," min - ",u.max," min (Avg: ",u.ideal," min)"]})}),(0,H.jsx)(l.Z,{className:"game-card__divider"}),(0,H.jsxs)(y.Z,{direction:"vertical",children:[(0,H.jsx)(f.Z.Meta,{description:c("Para ".concat(t.playerCount.min,"-").concat(t.playerCount.max," jogadores"),"For ".concat(t.playerCount.min,"-").concat(t.playerCount.max," players"))}),(0,H.jsx)(f.Z.Meta,{className:"game-card__player-count",description:c("Melhor com ".concat(t.playerCount.best||"?"," jogadores"),"Best wih ".concat(t.playerCount.best||"?"," players"))}),(0,H.jsx)(f.Z.Meta,{className:"game-card__player-count game-card__margin-bottom",description:c("Recomendado jogar com ".concat((0,j.T0)(t.playerCount.recommended)),"Recommended with ".concat((0,j.T0)(t.playerCount.recommended)))})]}),s&&(0,H.jsx)("div",{style:{marginTop:"1rem"},children:Boolean(t.available[i])&&(0,H.jsx)(q,{gameInfo:t})})]})]},t.gameName)}var X=a(34812),ee=a(35796),ne=a(43418);function ae(){var e=(0,ne.R)().isDevEnv,n=(0,r.useState)(!1),a=(0,t.Z)(n,2),s=a[0],i=a[1],c=(0,p.j1)("usingFirestoreEmulator"),l=(0,t.Z)(c,1)[0],u=(0,p.j1)("usingFunctionsEmulator"),d=(0,t.Z)(u,1)[0],m=e&&window.location.hostname!==l,g=e&&window.location.hostname!==d,v=window.location,h=v.port,x=v.pathname,j=v.hash,f=v.protocol,Z="".concat("",":").concat(h).concat(x,"/").concat(j).replace("//","/"),b="".concat(f,"//").concat(Z);return(0,o.Z)((function(){!s&&e&&m&&O.Z.confirm({title:"Wrong Dev Environment",icon:(0,H.jsx)(ee.Z,{}),content:"You are in a development environment and not using the Firestore emulator.",okText:"Switch Routes",cancelText:"Stay in Localhost",onOk:function(){i(!0),window.location.href=b}})})),e?(0,H.jsxs)(H.Fragment,{children:[m&&(0,H.jsx)(I.Z,{message:(0,H.jsxs)(H.Fragment,{children:["You are in a development environment and not using the Firestore emulator."," ",(0,H.jsx)(D.ZP,{href:b,type:"link",children:"Switch Routes"})]}),type:"error",showIcon:!0,banner:!0}),g&&(0,H.jsx)(I.Z,{message:(0,H.jsxs)(H.Fragment,{children:["You are in a development environment and not using the Functions emulator."," ",(0,H.jsx)(D.ZP,{href:b,type:"link",children:"Switch Routes"})]}),type:"warning",showIcon:!0,banner:!0}),!g&&!m&&(0,H.jsx)(I.Z,{message:(0,H.jsx)(H.Fragment,{children:"You are running emulators safely."}),type:"success",showIcon:!0,banner:!0})]}):(0,H.jsx)(H.Fragment,{})}var te=a(82033),re=a(97622),se=a(238),oe=a(80574),ie=re.Z.SHOW_PARENT;function ce(e){var n=e.availabilityCount,a=e.setTagFilters,t=e.setNumberFilters,r=function(e,n){t((function(a){return(0,C.Z)((0,C.Z)({},a),{},(0,_.Z)({},e,n))}))};return(0,H.jsxs)(y.Z,{className:"hub-filters",wrap:!0,size:"middle",children:[(0,H.jsxs)("span",{children:[(0,H.jsx)(te.Z,{})," (",n,")"]}),(0,H.jsxs)(se.Z,{defaultValue:"",style:{minWidth:"20ch"},size:"small",onChange:function(e){r("recommendedWith",Number("recommended"===e)),r("bestWith",Number("best"===e))},children:[(0,H.jsx)(se.Z.Option,{value:"",children:"Playing with"}),(0,H.jsx)(se.Z.Option,{value:"recommended",children:"Recommended with"}),(0,H.jsx)(se.Z.Option,{value:"best",children:"Best with"})]}),(0,H.jsxs)("div",{className:"hub-filters__entry",children:[(0,H.jsx)("label",{children:"Players"}),(0,H.jsx)(oe.Z,{min:2,max:12,size:"small",className:"hub-filters__input-number",onChange:function(e){return r("players",null!==e&&void 0!==e?e:0)}})]}),(0,H.jsxs)("div",{className:"hub-filters__entry",children:[(0,H.jsx)("label",{children:"Duration"}),(0,H.jsx)(oe.Z,{min:15,step:15,size:"small",className:"hub-filters__input-number",onChange:function(e){return r("duration",null!==e&&void 0!==e?e:0)}})]}),(0,H.jsxs)("div",{className:"hub-filters__entry",children:[(0,H.jsx)("label",{children:"Tags"}),(0,H.jsx)(le,{value:void 0,onTreeSelectChange:a})]})]})}function le(e){var n=e.value,a=e.onTreeSelectChange,t=(0,g.Z)().dualTranslate,s=(0,r.useMemo)((function(){return Object.values(Object.keys(x.Up).reduce((function(e,n){var a=x.Up[n];return void 0===e[a.group]&&(e[a.group]={title:(0,E.capitalize)(a.group),value:a.group,children:[]}),e[a.group].children.push({title:(0,E.capitalize)(t(a.label)),value:"".concat(a.group).concat(x.UD).concat(n)}),e}),{}))}),[t]);return(0,H.jsx)(re.Z,{treeData:s,value:n,onChange:function(e){a(e)},treeCheckable:!0,showCheckedStrategy:ie,placeholder:"Select Game Tags",size:"small",style:{width:"100%",minWidth:"400px"}})}var ue=a(69483),de=["espiao-entre-nos","sonhos-pesadelos","ta-na-cara","vendaval-de-palpite"];function me(e){var n=e.games;return 0===n.length?(0,H.jsx)(c.Z.Text,{type:"secondary",children:(0,H.jsx)(M.vN,{pt:"Nenhum jogo encontrado nessa categoria",en:"No games found in this category"})}):(0,H.jsx)(u.Z,{gutter:[8,16],children:n.map((function(e){return(0,H.jsx)(d.Z,{xs:24,sm:12,md:8,lg:8,xl:6,xxl:4,children:(0,H.jsx)($,{game:e,isAdmin:!de.includes(e.gameName)})},e.gameName)}))})}var pe=function(){(0,s.Z)("Hub - Tarde Divertida");var e=(0,g.Z)().language,n=(0,v._)(),a=(0,t.Z)(n,1)[0],u=(0,p.j1)("language"),d=(0,t.Z)(u,2)[1],f=(0,r.useState)([]),Z=(0,t.Z)(f,2),b=Z[0],y=Z[1],N=(0,r.useState)({}),w=(0,t.Z)(N,2),_=w[0],C=w[1];(0,o.Z)((function(){var e=a("language");e&&d(e)}));var S=(0,r.useMemo)((function(){return Object.values(h.Z).filter((function(e){var n=[];if(_.players&&(n.push(e.playerCount.min<=_.players&&e.playerCount.max>=_.players),_.bestWith&&n.push(_.players===e.playerCount.best),_.recommendedWith&&n.push(e.playerCount.recommended.includes(_.players))),b.forEach((function(a){var r=a.split(x.UD),s=(0,t.Z)(r,2),o=s[0],i=s[1];(o&&i&&"exclusive"===(null===x.Av||void 0===x.Av?void 0:x.Av[o])||i)&&n.push(e.tags.includes(i))})),_.duration){var a,r=(0,j.yG)(e,null!==(a=_.players)&&void 0!==a?a:0);_.players?n.push(_.duration>=r.customTime-10&&_.duration<=r.customTime+10):n.push(_.duration>=r.min&&_.duration<=r.max)}return n.every(Boolean)}))}),[b,_]),F=(0,r.useMemo)((function(){return S.sort((function(n,a){return n.title[e]>a.title[e]?1:-1})).reduce((function(n,a){return a.available[e]?["alpha","dev"].includes(a.version)||a.version.startsWith("beta")?n.devGames.push(a):n.availableGames.push(a):n.comingSoonGames.push(a),n}),{availableGames:[],devGames:[],comingSoonGames:[]})}),[S,e]),T=F.availableGames,k=F.comingSoonGames,A=F.devGames;return(0,H.jsxs)(i.Z,{className:"dev-layout",children:[(0,H.jsx)(X.B,{title:(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(m.Z,{})," Hub"]}),subTitle:(0,H.jsx)(M.vN,{pt:"Selecione um jogo para come\xe7ar",en:"Select a game to start"}),extra:[(0,H.jsx)(M.UK,{},"language-switch"),(0,H.jsx)(ue.s,{danger:!0,ghost:!0,size:"small"},"logout-button")]}),(0,H.jsx)(ae,{}),(0,H.jsx)(ce,{setTagFilters:y,setNumberFilters:C,availabilityCount:T.length}),(0,H.jsxs)(i.Z.Content,{className:"container",id:"main-container",children:[j.WC&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(c.Z.Title,{level:2,children:(0,H.jsx)(M.vN,{pt:"Em Desenvolvimento",en:"Under Development"})}),(0,H.jsx)(me,{games:A}),(0,H.jsx)(l.Z,{})]}),(0,H.jsx)(c.Z.Title,{level:2,children:(0,H.jsx)(M.vN,{pt:"Dispon\xedveis",en:"Available"})}),(0,H.jsx)(me,{games:T}),(0,H.jsx)(l.Z,{}),!j.WC&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(c.Z.Title,{level:2,children:(0,H.jsx)(M.vN,{pt:"Em Desenvolvimento",en:"Under Development"})}),(0,H.jsx)(me,{games:A}),(0,H.jsx)(l.Z,{})]}),(0,H.jsx)(c.Z.Title,{level:2,children:(0,H.jsx)(M.vN,{pt:"Em Breve",en:"Coming Soon"})}),(0,H.jsx)(me,{games:k})]})]})}}}]);
//# sourceMappingURL=page-hub.92343199.chunk.js.map