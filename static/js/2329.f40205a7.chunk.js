"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[2329],{40140:function(e,n,t){t.d(n,{M:function(){return r}});var a=t(50678),i=t(63733),c=t(71566),s=t(80184);function r(e){var n=e.id,t=e.width,r=e.className,d=function(e){var n="glyph-".concat(e),t=128*Math.ceil(e/128);return["glyphs-".concat(t),n]}(+n),o=(0,a.Z)(d,2),l=o[0],u=o[1];return(0,s.jsx)("div",{className:(0,i.Z)("glyph-card",r),style:{width:"".concat(t,"px"),height:"".concat(t,"px")},children:(0,s.jsx)(c.j,{source:l,id:u,width:t?t-12:void 0,padding:0})})}},82216:function(e,n,t){t.d(n,{X:function(){return x}});var a=t(83738),i=t(63733),c=t(69228),s=t(2556),r=t(28624),d=t(81238),o=t(40050),l=t(30236),u=t(2208),h=t(29064),v=t(80184),m=["icon"],p={pt:"Desconhecido",en:"Unknown"};function x(e){var n=e.players,t=e.achievements,x=e.reference;return 0===t.length?(0,v.jsx)(v.Fragment,{}):(0,v.jsxs)("div",{className:(0,i.Z)("achievements",(0,d.hL)("fadeIn")),children:[(0,v.jsx)(u.Dx,{size:"small",level:3,children:(0,v.jsx)(l.vN,{pt:"Medalhas",en:"Achievements"})}),(0,v.jsx)("ul",{className:"achievements-list",children:t.map((function(e,u){var j,g,f,b=null!==(j=x[e.type])&&void 0!==j?j:{},Z=b.icon,N=void 0===Z?"star":Z,w=(0,a.Z)(b,m),y=n[e.playerId];return(0,v.jsxs)("li",{className:(0,i.Z)("achievements-entry",(0,d.hL)("flipInY",{delay:u<t.length/2?u:t.length-1-u})),children:[(0,v.jsx)("div",{className:"achievement__medal",children:(0,v.jsx)(h.j,{id:N})}),(0,v.jsx)("h4",{className:"achievement__title",children:(0,v.jsx)(l.Cn,{children:null!==(g=w.title)&&void 0!==g?g:p})}),(0,v.jsx)("div",{className:"achievement__avatar",children:(0,v.jsx)(o.qE,{id:y.avatarId})}),(0,v.jsx)("div",{className:"achievement__name",children:y.name}),Boolean(w.description)&&(0,v.jsx)("div",{className:"achievement__description",children:(0,v.jsx)(c.Z,{content:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(l.Cn,{children:null!==(f=w.description)&&void 0!==f?f:p})," (",e.value,")"]}),children:(0,v.jsx)(s.ZP,{icon:(0,v.jsx)(r.Z,{}),shape:"circle",type:"text",size:"small"})})})]},"achievement-".concat(e.type))}))})]})}},70679:function(e,n,t){t.d(n,{i9:function(){return l},Kp:function(){return p},fe:function(){return b},kM:function(){return N},Jd:function(){return C},YA:function(){return F},L9:function(){return P},Dm:function(){return z}});var a=t(61431),i=t(2556),c=t(24215),s=t(98272),r=t(66455),d=t(30236),o=t(80184);function l(e){var n=e.cardId,t=e.ghost,l=void 0===t||t,u=(0,r.v)(),h=u.blurCard,v=u.isBlurEnabled,m=u.shouldBeBlurred;return v?(0,o.jsx)(a.Z,{placement:"top",title:(0,o.jsx)(d.vN,{pt:"Aperte o bot\xe3o para emba\xe7ar a foto caso voc\xea tenha alguma fobia",en:"Use this button to blur the image in case of any phobia"}),children:(0,o.jsx)(i.ZP,{ghost:l,onClick:function(){return h(n)},size:"small",className:"image-blur-button",children:m(n)?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(c.Z,{})," ",(0,o.jsx)(d.vN,{pt:"Descredar",en:"Focus"})]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(s.Z,{})," ",(0,o.jsx)(d.vN,{pt:"Credo",en:"Blur"})]})})}):(0,o.jsx)(o.Fragment,{})}var u=t(18489),h=t(83738),v=t(63733),m=["cardId","children","className","position","ghost"];function p(e){var n=e.cardId,t=e.children,a=e.className,i=void 0===a?"":a,c=e.position,s=void 0===c?"bottom":c,r=e.ghost,d=void 0===r||r,p=(0,h.Z)(e,m);return(0,o.jsxs)("div",(0,u.Z)((0,u.Z)({className:(0,v.Z)("image-blur-button-container",i)},p),{},{children:["top"===s&&(0,o.jsx)(l,{cardId:n,ghost:d}),t,"bottom"===s&&(0,o.jsx)(l,{cardId:n,ghost:d})]}))}var x=t(81736),j=t(76591),g=t.p+"static/media/placeholder.78bbe945192fff475738.jpg",f=t(90879),b=function(e){var n=e.id,t=e.cardWidth,a=void 0===t?200:t,i=e.className,c=void 0===i?"":i,s=e.preview,d=void 0===s||s,l=e.previewImageId,h=void 0===l?"":l,m=e.fileExtension,p=void 0===m?"jpg":m,b=e.square,Z=void 0!==b&&b,N=e.classic,w=void 0!==N&&N,y=(0,r.v)().shouldBeBlurred,_=(0,f.c)(w?"classic":"images"),k="image-card",C="placeholder-".concat(n[n.length-1]),I=n.replace(/-/g,"/"),B=y(n),S="boolean"===typeof d?{}:d;return(0,o.jsx)("div",{className:(0,v.Z)(k,B&&"".concat(k,"--blur"),Z&&"".concat(k,"--square"),c),style:{height:Z?"".concat(a,"px"):void 0},children:(0,o.jsx)(x.Z,{width:a,src:"".concat(_,"/").concat(I,".").concat(p),placeholder:(0,o.jsx)(x.Z,{preview:!1,src:g,width:a}),fallback:"".concat(j.fQ.CARDS).concat(C,".jpg"),preview:!(B||!d)&&(0,u.Z)((0,u.Z)({},S),{},{maskClassName:(0,v.Z)("".concat(k,"__preview-mask"),null===S||void 0===S?void 0:S.maskClassName),src:Boolean(h)?"".concat(_,"/").concat(h.replace(/-/g,"/"),".").concat(p):null===S||void 0===S?void 0:S.src})})})},Z=["id"],N=function(e){var n=e.id,t=void 0===n?"back-default":n,a=(0,h.Z)(e,Z);return(0,o.jsx)(b,(0,u.Z)({id:t},a))},w=t(25115),y=t(82610),_=t(42246),k=["className"];function C(e){var n=e.id,t=e.children,a=e.className,c=void 0===a?"":a,s=e.buttonPosition,r=void 0===s?"top":s,l=e.over,m=void 0!==l&&l,x=e.icon,j=e.onClick,g=e.disabled,f=void 0!==g&&g,b=e.buttonText,Z=e.buttonProps,N=void 0===Z?{}:Z,C="top"===r,I=null!==x&&void 0!==x?x:C?(0,o.jsx)(w.Z,{}):(0,o.jsx)(y.Z,{}),B=N.className,S=(0,h.Z)(N,k),F=j?(0,o.jsxs)(i.ZP,(0,u.Z)((0,u.Z)({shape:"round",size:"small",ghost:m,className:(0,v.Z)("image-card-button__button",m&&"image-card-button__button--over",m&&"image-card-button__button--over-".concat(r),B),onClick:function(){return j(n)},disabled:f},S),{},{children:[I,null!==b&&void 0!==b?b:(0,o.jsx)(d.vN,{pt:"Selecionar",en:"Select"}),I]})):(0,o.jsx)(o.Fragment,{});return(0,o.jsx)("div",{className:(0,v.Z)("image-card-button",c),children:(0,o.jsxs)(p,{cardId:n,position:"bottom"===r?"top":"bottom",children:[(0,o.jsx)(_.H,{children:n}),(0,o.jsxs)("div",{className:"image-card-button__container",children:[C&&F,t,!C&&F]})]})})}var I=t(50678),B=t(49946),S=t(81238);function F(e){var n=e.hand,t=void 0===n?[]:n,a=e.onSelectCard,i=e.selectButtonText,c=e.selectButtonIcon,s=e.className,r=void 0===s?"":s,d=e.selectButtonClass,l=void 0===d?"":d,u=e.sizeRatio,h=void 0===u?8:u,m=e.cardSize,p=e.minCardSize,j=void 0===p?80:p,g=e.disabledSelectButton,f=void 0!==g&&g,Z=e.selectedCards,N=void 0===Z?{}:Z,w=e.cardClassName,y=void 0===w?"":w,_=e.preview,k=void 0===_||_,F=e.imageGroupPreview,P=(0,B.F)(Math.max(h,6),{minWidth:j}),z=(0,I.Z)(P,2),L=z[0],D=z[1];return(0,o.jsx)(x.Z.PreviewGroup,{preview:F,children:(0,o.jsx)("div",{className:(0,v.Z)("image-card-hand",r),ref:D,children:t.map((function(e,n){return(0,o.jsx)("div",{className:(0,v.Z)("image-card-hand__card-container",(0,S.hL)("slideInUp",{delay:n})),children:(0,o.jsx)(C,{onClick:a,id:e,buttonProps:{className:l},icon:c,buttonText:i,disabled:f,children:(0,o.jsx)(b,{id:e,cardWidth:m||L,className:(0,v.Z)(N[e]&&"image-card-hand__selected",y),preview:k})})},"hand-".concat(e))}))})})}function P(e){var n=e.hand;return n?(0,o.jsx)("div",{className:"image-card-preload-hand",children:n.map((function(e){return(0,o.jsx)(b,{id:e,cardWidth:1,preview:!1},"pre-load-".concat(e))}))}):(0,o.jsx)("span",{})}function z(e){var n=e.onClick,t=e.cardId,a=e.selectLabel,c=e.deselectLabel,s=e.isSelected,r=void 0!==s&&s;return(0,o.jsxs)(i.ZP,{shape:"round",size:"small",ghost:!r,className:"image-card-select-button",onClick:function(){return n(t)},children:[(0,o.jsx)(y.Z,{}),r?(0,o.jsx)(d.vN,{pt:"Desmarcar",en:"Deselect",custom:c}):(0,o.jsx)(d.vN,{pt:"Selecionar",en:"Select",custom:a}),(0,o.jsx)(y.Z,{})]})}},71566:function(e,n,t){t.d(n,{j:function(){return h}});var a=t(33032),i=t(84322),c=t.n(i),s=t(90398),r=t(4893),d=t(68302),o=t(61431),l=t(90879),u=t(80184);function h(e){var n=e.id,t=e.source,i=e.width,h=void 0===i?75:i,v=e.padding,m=void 0===v?6:v,p=e.title,x=e.className,j=(0,l.c)("sprites"),g=(0,r.a)({queryKey:["sprite",t],queryFn:function(){var e=(0,a.Z)(c().mark((function e(){var n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(j,"/sprites/").concat(t,".svg"));case 2:return n=e.sent,e.next=5,n.text();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),enabled:!!n&&!!t}),f=g.isLoading,b=g.data,Z=g.isError,N=h-2*m;if(f)return(0,u.jsx)("span",{style:{width:"".concat(N,"px"),height:"".concat(N,"px"),padding:m,display:"grid",placeItems:"center"},className:x,children:(0,u.jsx)(d.Z,{})});var w=b;return Z||!w?(0,u.jsx)("span",{style:{width:"".concat(N,"px"),height:"".concat(N,"px"),padding:m,display:"grid",placeItems:"center"},className:x,children:(0,u.jsx)(s.Z,{})}):(0,u.jsxs)("svg",{viewBox:"0 0 512 512",style:{width:"".concat(N,"px"),height:"".concat(N,"px"),padding:m},className:x,children:[(0,u.jsx)("use",{xlinkHref:"#".concat(n),dangerouslySetInnerHTML:{__html:w}}),(0,u.jsx)("foreignObject",{x:"0",y:"0",width:"100%",height:"100%",children:p&&(0,u.jsx)(o.Z,{title:p,children:(0,u.jsx)("div",{style:{background:"transparent",width:"100%",height:"100vh"}})})})]})}}}]);
//# sourceMappingURL=2329.f40205a7.chunk.js.map