"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[5893],{91203:function(e,n,a){a.d(n,{D:function(){return t}});var i=a(30236),r=a(70679),s=a(80184);function t(e){var n=e.suspect,a=e.width,t=e.hideName;return(0,s.jsxs)("div",{className:"suspect-card",style:{width:"".concat(a,"px")},children:[(0,s.jsx)(r.fe,{id:n.id,className:"suspect-card__image",cardWidth:a,preview:!1}),!t&&(0,s.jsx)("div",{className:"suspect-card__name",children:(0,s.jsx)(i.Cn,{children:n.name})})]})}},82216:function(e,n,a){a.d(n,{X:function(){return x}});var i=a(83738),r=a(63733),s=a(69228),t=a(2556),o=a(28624),c=a(81238),d=a(40050),l=a(30236),u=a(2208),v=a(29064),h=a(80184),m=["icon"],p={pt:"Desconhecido",en:"Unknown"};function x(e){var n=e.players,a=e.achievements,x=e.reference;return 0===a.length?(0,h.jsx)(h.Fragment,{}):(0,h.jsxs)("div",{className:(0,r.Z)("achievements",(0,c.hL)("fadeIn")),children:[(0,h.jsx)(u.Dx,{size:"small",level:3,children:(0,h.jsx)(l.vN,{pt:"Medalhas",en:"Achievements"})}),(0,h.jsx)("ul",{className:"achievements-list",children:a.map((function(e,u){var j,g,_,b=null!==(j=x[e.type])&&void 0!==j?j:{},f=b.icon,N=void 0===f?"star":f,Z=(0,i.Z)(b,m),k=n[e.playerId];return(0,h.jsxs)("li",{className:(0,r.Z)("achievements-entry",(0,c.hL)("flipInY",{delay:u<a.length/2?u:a.length-1-u})),children:[(0,h.jsx)("div",{className:"achievement__medal",children:(0,h.jsx)(v.j,{id:N})}),(0,h.jsx)("h4",{className:"achievement__title",children:(0,h.jsx)(l.Cn,{children:null!==(g=Z.title)&&void 0!==g?g:p})}),(0,h.jsx)("div",{className:"achievement__avatar",children:(0,h.jsx)(d.qE,{id:k.avatarId})}),(0,h.jsx)("div",{className:"achievement__name",children:k.name}),Boolean(Z.description)&&(0,h.jsx)("div",{className:"achievement__description",children:(0,h.jsx)(s.Z,{content:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(l.Cn,{children:null!==(_=Z.description)&&void 0!==_?_:p})," (",e.value,")"]}),children:(0,h.jsx)(t.ZP,{icon:(0,h.jsx)(o.Z,{}),shape:"circle",type:"text",size:"small"})})})]},"achievement-".concat(e.type))}))})]})}},70679:function(e,n,a){a.d(n,{i9:function(){return l},Kp:function(){return p},fe:function(){return b},kM:function(){return N},Jd:function(){return P},YA:function(){return B},L9:function(){return D},Dm:function(){return z}});var i=a(61431),r=a(2556),s=a(24215),t=a(98272),o=a(66455),c=a(30236),d=a(80184);function l(e){var n=e.cardId,a=e.ghost,l=void 0===a||a,u=(0,o.v)(),v=u.blurCard,h=u.isBlurEnabled,m=u.shouldBeBlurred;return h?(0,d.jsx)(i.Z,{placement:"top",title:(0,d.jsx)(c.vN,{pt:"Aperte o bot\xe3o para emba\xe7ar a foto caso voc\xea tenha alguma fobia",en:"Use this button to blur the image in case of any phobia"}),children:(0,d.jsx)(r.ZP,{ghost:l,onClick:function(){return v(n)},size:"small",className:"image-blur-button",children:m(n)?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.Z,{})," ",(0,d.jsx)(c.vN,{pt:"Descredar",en:"Focus"})]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(t.Z,{})," ",(0,d.jsx)(c.vN,{pt:"Credo",en:"Blur"})]})})}):(0,d.jsx)(d.Fragment,{})}var u=a(18489),v=a(83738),h=a(63733),m=["cardId","children","className","position","ghost"];function p(e){var n=e.cardId,a=e.children,i=e.className,r=void 0===i?"":i,s=e.position,t=void 0===s?"bottom":s,o=e.ghost,c=void 0===o||o,p=(0,v.Z)(e,m);return(0,d.jsxs)("div",(0,u.Z)((0,u.Z)({className:(0,h.Z)("image-blur-button-container",r)},p),{},{children:["top"===t&&(0,d.jsx)(l,{cardId:n,ghost:c}),a,"bottom"===t&&(0,d.jsx)(l,{cardId:n,ghost:c})]}))}var x=a(51682),j=a(76591),g=a.p+"static/media/placeholder.78bbe945192fff475738.jpg",_=a(90879),b=function(e){var n=e.id,a=e.cardWidth,i=void 0===a?200:a,r=e.className,s=void 0===r?"":r,t=e.preview,c=void 0===t||t,l=e.previewImageId,v=void 0===l?"":l,m=e.fileExtension,p=void 0===m?"jpg":m,b=e.square,f=void 0!==b&&b,N=(0,o.v)().shouldBeBlurred,Z=(0,_.c)("tdi"),k="image-card",y="placeholder-".concat(n[n.length-1]),w=n.replace(/-/g,"/"),P=N(n),I="boolean"===typeof c?{}:c;return(0,d.jsx)("div",{className:(0,h.Z)(k,P&&"".concat(k,"--blur"),f&&"".concat(k,"--square"),s),style:{height:f?"".concat(i,"px"):void 0},children:(0,d.jsx)(x.Z,{width:i,src:"".concat(Z,"/").concat(w,".").concat(p),placeholder:(0,d.jsx)(x.Z,{preview:!1,src:g,width:i}),fallback:"".concat(j.fQ.CARDS).concat(y,".jpg"),preview:!(P||!c)&&(0,u.Z)((0,u.Z)({},I),{},{maskClassName:(0,h.Z)("".concat(k,"__preview-mask"),null===I||void 0===I?void 0:I.maskClassName),src:Boolean(v)?"".concat(Z,"/").concat(v.replace(/-/g,"/"),".").concat(p):null===I||void 0===I?void 0:I.src})})})},f=["id"],N=function(e){var n=e.id,a=void 0===n?"back-default":n,i=(0,v.Z)(e,f);return(0,d.jsx)(b,(0,u.Z)({id:a},i))},Z=a(25115),k=a(82610),y=a(42246),w=["className"];function P(e){var n=e.id,a=e.children,i=e.className,s=void 0===i?"":i,t=e.buttonPosition,o=void 0===t?"top":t,l=e.over,m=void 0!==l&&l,x=e.icon,j=e.onClick,g=e.disabled,_=void 0!==g&&g,b=e.buttonText,f=e.buttonProps,N=void 0===f?{}:f,P="top"===o,I=null!==x&&void 0!==x?x:P?(0,d.jsx)(Z.Z,{}):(0,d.jsx)(k.Z,{}),S=N.className,C=(0,v.Z)(N,w),B=j?(0,d.jsxs)(r.ZP,(0,u.Z)((0,u.Z)({shape:"round",size:"small",ghost:m,className:(0,h.Z)("image-card-button__button",m&&"image-card-button__button--over",m&&"image-card-button__button--over-".concat(o),S),onClick:function(){return j(n)},disabled:_},C),{},{children:[I,null!==b&&void 0!==b?b:(0,d.jsx)(c.vN,{pt:"Selecionar",en:"Select"}),I]})):(0,d.jsx)(d.Fragment,{});return(0,d.jsx)("div",{className:(0,h.Z)("image-card-button",s),children:(0,d.jsxs)(p,{cardId:n,position:"bottom"===o?"top":"bottom",children:[(0,d.jsx)(y.H,{children:n}),(0,d.jsxs)("div",{className:"image-card-button__container",children:[P&&B,a,!P&&B]})]})})}var I=a(50678),S=a(49946),C=a(81238);function B(e){var n=e.hand,a=void 0===n?[]:n,i=e.onSelectCard,r=e.selectButtonText,s=e.selectButtonIcon,t=e.className,o=void 0===t?"":t,c=e.selectButtonClass,l=void 0===c?"":c,u=e.sizeRatio,v=void 0===u?8:u,m=e.cardSize,p=e.minCardSize,j=void 0===p?80:p,g=e.disabledSelectButton,_=void 0!==g&&g,f=e.selectedCards,N=void 0===f?{}:f,Z=e.cardClassName,k=void 0===Z?"":Z,y=e.preview,w=void 0===y||y,B=e.imageGroupPreview,D=(0,S.F)(Math.max(v,6),{minWidth:j}),z=(0,I.Z)(D,2),A=z[0],F=z[1];return(0,d.jsx)(x.Z.PreviewGroup,{preview:B,children:(0,d.jsx)("div",{className:(0,h.Z)("image-card-hand",o),ref:F,children:a.map((function(e,n){return(0,d.jsx)("div",{className:(0,h.Z)("image-card-hand__card-container",(0,C.hL)("slideInUp",{delay:n})),children:(0,d.jsx)(P,{onClick:i,id:e,buttonProps:{className:l},icon:s,buttonText:r,disabled:_,children:(0,d.jsx)(b,{id:e,cardWidth:m||A,className:(0,h.Z)(N[e]&&"image-card-hand__selected",k),preview:w})})},"hand-".concat(e))}))})})}function D(e){var n=e.hand;return n?(0,d.jsx)("div",{className:"image-card-preload-hand",children:n.map((function(e){return(0,d.jsx)(b,{id:e,cardWidth:1,preview:!1},"pre-load-".concat(e))}))}):(0,d.jsx)("span",{})}function z(e){var n=e.onClick,a=e.cardId,i=e.selectLabel,s=e.deselectLabel,t=e.isSelected,o=void 0!==t&&t;return(0,d.jsxs)(r.ZP,{shape:"round",size:"small",ghost:!o,className:"image-card-select-button",onClick:function(){return n(a)},children:[(0,d.jsx)(k.Z,{}),o?(0,d.jsx)(c.vN,{pt:"Desmarcar",en:"Deselect",custom:s}):(0,d.jsx)(c.vN,{pt:"Selecionar",en:"Select",custom:i}),(0,d.jsx)(k.Z,{})]})}},34876:function(e,n,a){a.d(n,{B:function(){return t}});var i=a(69051),r=a(21613),s=a(80184);function t(e){var n=e.children,a=e.type,t=e.iconSize,o=e.className;return(0,s.jsx)(r.K,{icon:(0,s.jsx)(i.r,{}),type:a,iconSize:t,className:o,children:n})}},19263:function(e,n,a){a.d(n,{l:function(){return b},N:function(){return y}});var i=a(18489),r=a(31303),s=a(50678),t=a(63733),o=a(72791),c=a(763),d=a(97415),l=a(20263),u=a(61431),v=a(21290),h=a(95090),m=a(81238),p=a(30236),x=a(40050),j=a(80184);function g(e){var n=e.gainedPoint,a=e.order,i=e.description,r=n>0,s=n<0;return(0,j.jsx)("li",{className:(0,t.Z)("ranking-board__gained-point",r&&"ranking-board__gained-point--plus",s&&"ranking-board__gained-point--minus","ranking-board__gained-point--".concat(a)),children:(0,j.jsxs)(u.Z,{title:null!==i&&void 0!==i?i:(0,j.jsx)(p.vN,{pt:"Pontos ganhos",en:"Gained Points"}),color:r?"gold":s?"red":"gray",children:[r?"+":"",n]})})}function _(e){var n=e.gainedPoints,a=e.playerId,i=e.gainedPointsDescriptions,r=void 0===i?[]:i,s=Array.isArray(n)?n:[n];return(0,j.jsx)("ul",{className:"ranking-board__cell-gained-points",children:s.map((function(e,n){return(0,j.jsx)(g,{gainedPoint:e,order:n,description:r[n]},"gained-point-".concat(a,"-").concat(n))}))})}function b(e){var n=e.players,a=e.ranking,g=e.gainedPointsDescriptions,b=e.hideGainedPoints,f=void 0!==b&&b,N=e.delay,Z=void 0===N?0:N,k=(0,o.useState)(0),y=(0,s.Z)(k,2),w=y[0],P=y[1],I=(0,o.useState)([]),S=(0,s.Z)(I,2),C=S[0],B=S[1],D=(0,o.useState)(0),z=(0,s.Z)(D,2),A=z[0],F=z[1],M=(0,d.Z)(),E=(0,s.Z)(M,2),L=E[0],q=E[1].height,T=(0,o.useMemo)((function(){return Math.max.apply(Math,(0,r.Z)(a.map((function(e){return e.newScore}))))}),[a]),W=(0,h.a)({duration:5+Z,autoStart:!0,onExpire:function(){F(1),P(3)}}).seconds;return(0,l.Z)((function(){var e={},n=0,r=0,s=(0,c.orderBy)(a,["newScore","name"],["desc","asc"]).reduce((function(a,i,s){return a[i.playerId]=s,(0===r||i.newScore<r)&&(r=i.newScore,n+=1),e[i.playerId]=[0,n],a}),{}),t=(0,c.orderBy)(a,["previousScore","name"],["desc","asc"]);n=0,r=0;var o=t.map((function(a,t){var o=(0,i.Z)({},a);return o.order=[t,s[o.playerId]],o.position=e[o.playerId],(0===r||a.previousScore<r)&&(r=a.previousScore,n+=1),o.position[0]=n,o}));B(o)})),(0,o.useEffect)((function(){W===4+Z?P(1):W===2+Z&&P(2)}),[W,Z]),(0,j.jsxs)("div",{className:(0,t.Z)("ranking-board",W>4&&"ranking-board--hidden",4===W&&(0,m.hL)("fadeIn")),style:{height:"".concat((Math.max(60,q)+8)*C.length,"px")},children:[(0,j.jsxs)("div",{className:"ranking-board__row",id:"ranking-row-placeholder",style:{opacity:0},ref:L,children:[(0,j.jsx)("div",{className:"ranking-board__cell-crown",children:(0,j.jsx)(v.Z,{className:"ranking-board__crown-icon"})}),(0,j.jsx)("div",{className:"ranking-board__cell-position",children:"#0"}),(0,j.jsxs)("div",{className:"ranking-board__cell-player",children:[(0,j.jsx)("div",{className:"ranking-board__avatar",children:(0,j.jsx)(x.qE,{id:"A"})}),(0,j.jsx)("div",{className:"ranking-board__name",children:"Placeholder"})]}),(0,j.jsx)(u.Z,{title:(0,j.jsx)(p.vN,{pt:"Pontos Anteriores",en:"Previous Points"}),color:"gray",children:(0,j.jsx)("div",{className:"ranking-board__cell-points",children:"0"})}),(0,j.jsx)(_,{gainedPoints:0,playerId:"A"}),(0,j.jsx)(u.Z,{title:"Total",color:"gold",children:(0,j.jsx)("span",{className:"ranking-board__cell-points-total",children:"0"})})]}),C.map((function(e,a){var i,r,s=e.playerId,t=e.newScore,o=e.previousScore,c=e.gainedPoints,d=e.order,l=e.position,h=(Math.max(60,q)+8)*(null!==(i=d[A])&&void 0!==i?i:0);return(0,j.jsxs)("div",{className:"ranking-board__row ranking-board__row--".concat(a),style:{top:"".concat(h,"px")},children:[(0,j.jsx)("div",{className:"ranking-board__cell-crown",children:t>0&&T===t&&w>=3&&(0,j.jsx)(v.Z,{className:"ranking-board__crown-icon"})}),(0,j.jsxs)("div",{className:"ranking-board__cell-position",children:["#",null!==(r=l[A])&&void 0!==r?r:""]}),(0,j.jsxs)("div",{className:"ranking-board__cell-player",children:[(0,j.jsx)("div",{className:"ranking-board__avatar",children:(0,j.jsx)(x.qE,{id:n[s].avatarId})}),(0,j.jsx)("div",{className:"ranking-board__name",children:n[s].name})]}),(0,j.jsx)(u.Z,{title:(0,j.jsx)(p.vN,{pt:"Pontos Anteriores",en:"Previous Points"}),color:"gray",children:(0,j.jsx)("div",{className:"ranking-board__cell-points",children:o})}),!f&&w>=1&&void 0!==c&&(0,j.jsx)(_,{gainedPoints:c,playerId:s,gainedPointsDescriptions:g}),w>=2&&(0,j.jsx)(u.Z,{title:"Total",color:"gold",children:(0,j.jsx)("span",{className:"ranking-board__cell-points-total",children:t})})]},"ranking-".concat(s))}))]})}var f=a(52234),N=a(64823),Z=a(25234),k=a(2208);function y(e){var n=e.players,a=e.ranking,i=e.gainedPointsDescriptions,r=e.children,s=e.title,t=e.subtitle,o=e.white;return(0,N.R)(),(0,j.jsxs)(Z.h,{children:[(0,j.jsx)(k.Dx,{white:o,children:null!==s&&void 0!==s?s:"Ranking"}),t,(0,j.jsx)(b,{players:n,ranking:a,gainedPointsDescriptions:i}),(0,j.jsxs)(k.vr,{className:"step-ranking-wrapper-gained-points-instruction",children:[(0,j.jsx)(f.Z,{}),(0,j.jsx)(p.vN,{pt:"Passe o mouse em cada um dos pontos para saber como eles foram distribu\xeddos",en:"Hover over the scores to learn how they were granted"}),(0,j.jsx)(f.Z,{})]}),r]})}}}]);
//# sourceMappingURL=5893.fba19a1c.chunk.js.map