"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[1046],{73031:function(e,t,r){r.d(t,{f:function(){return s}});var n=r(63733),a=r(71566),i=r(80184);function s(e){var t=e.id,r=e.width,s=e.className,c=t.startsWith("emoji")?t:"emoji-".concat(t);return(0,i.jsx)("div",{className:(0,n.Z)("emoji-card",s),style:{width:"".concat(r,"px"),height:"".concat(r,"px")},children:(0,i.jsx)(a.j,{source:"emojis",id:c,width:r})})}},40140:function(e,t,r){r.d(t,{M:function(){return c}});var n=r(50678),a=r(63733),i=r(71566),s=r(80184);function c(e){var t=e.id,r=e.width,c=e.className,o=function(e){var t="glyph-".concat(e),r=128*Math.ceil(e/128);return["glyphs-".concat(r),t]}(+t),l=(0,n.Z)(o,2),d=l[0],u=l[1];return(0,s.jsx)("div",{className:(0,a.Z)("glyph-card",c),style:{width:"".concat(r,"px"),height:"".concat(r,"px")},children:(0,s.jsx)(i.j,{source:d,id:u,width:r,padding:0})})}},61299:function(e,t,r){r.d(t,{q:function(){return o}});var n=r(50678),a=r(63733),i=r(71566),s=r(30236),c=r(80184);function o(e){var t=e.id,r=e.width,o=void 0===r?75:r,l=e.className,d=e.title,u=e.text,h=function(e){var t=e.match(/\d+/),r=t?parseInt(t[0],10):0,n="item-".concat(r),a=64*Math.ceil(r/64);return["items-".concat(a),n]}(t),f=(0,n.Z)(h,2),p=f[0],x=f[1],m=u?"auto":"".concat(o,"px");return(0,c.jsxs)("div",{className:(0,a.Z)("item-card",l),style:{width:"".concat(o,"px"),height:m},children:[(0,c.jsx)(i.j,{source:p,id:x,width:o,title:d}),Boolean(u)&&(0,c.jsx)("span",{className:"item-card__text",children:(0,c.jsx)(s.Cn,{children:u})})]})}},19433:function(e,t,r){r.d(t,{w:function(){return s}});var n=r(63733),a=r(71566),i=r(80184);function s(e){var t=e.id,r=e.width,s=void 0===r?50:r,c=e.className,o=void 0===c?"":c;return(0,i.jsx)("div",{className:(0,n.Z)("sign-card",o),style:{width:"".concat(s,"px"),height:"".concat(s,"px")},children:(0,i.jsx)("svg",{viewBox:"0 0 512 512",style:{width:"".concat(s-12,"px"),height:"".concat(s-12,"px")},children:(0,i.jsx)(a.j,{source:"alien-signs",id:"sign-".concat(t),width:s})})})}},71566:function(e,t,r){r.d(t,{j:function(){return h}});var n=r(33032),a=r(84322),i=r.n(a),s=r(90398),c=r(12917),o=r(14692),l=r(61431),d=r(90879),u=r(80184);function h(e){var t=e.id,r=e.source,a=e.width,h=void 0===a?75:a,f=e.padding,p=void 0===f?6:f,x=e.title,m=e.className,v=(0,d.c)("tdi"),g=(0,c.a)({queryKey:["sprite",r],queryFn:function(){var e=(0,n.Z)(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(v,"sprites/").concat(r,".svg"));case 2:return t=e.sent,e.next=5,t.text();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),enabled:!!t&&!!r}),b=g.isLoading,j=g.data,y=g.isError,w=h-12;if(b)return(0,u.jsx)("span",{style:{width:"".concat(w,"px"),height:"".concat(w,"px"),padding:p,display:"grid",placeItems:"center"},className:m,children:(0,u.jsx)(o.Z,{})});var k=j;return y||!k?(0,u.jsx)("span",{style:{width:"".concat(w,"px"),height:"".concat(w,"px"),padding:p,display:"grid",placeItems:"center"},className:m,children:(0,u.jsx)(s.Z,{})}):(0,u.jsxs)("svg",{viewBox:"0 0 512 512",style:{width:"".concat(w,"px"),height:"".concat(w,"px"),padding:p},className:m,children:[(0,u.jsx)("use",{xlinkHref:"#".concat(t),dangerouslySetInnerHTML:{__html:k}}),(0,u.jsx)("foreignObject",{x:"0",y:"0",width:"100%",height:"100%",children:x&&(0,u.jsx)(l.Z,{title:x,children:(0,u.jsx)("div",{style:{background:"transparent",width:"100%",height:"100vh"}})})})]})}},4766:function(e,t,r){r.d(t,{K:function(){return s}});var n=r(50678),a=r(72791),i=r(11087);function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,i.lr)(),r=(0,n.Z)(t,2),s=r[0],c=r[1],o=function(e,t){void 0===t?s.delete(e):s.set(e,String(t)),c(s)},l=function(e){s.delete(e),c(s)};(0,a.useEffect)((function(){Object.entries(e).forEach((function(e){var t=(0,n.Z)(e,2),r=t[0],a=t[1];s.has(r)||o(r,a)}))}),[]);var d=s.toString().split("&").reduce((function(e,t){var r=t.split("="),a=(0,n.Z)(r,2),i=a[0],s=a[1];return i&&void 0!==s&&(e[i]=s),e}),{});return{add:o,remove:l,queryParams:d}}},90879:function(e,t,r){function n(e){var t="https://www.kavispires.com";switch(e){case"tdi":return"".concat(t,"/").concat("tdi/images/");case"tdr":return"".concat(t,"/").concat("tdr/resources");case"tdi-data":return"".concat(t,"/").concat("tdi/data");default:return""}}r.d(t,{c:function(){return n}})},34812:function(e,t,r){r.d(t,{B:function(){return o}});var n=r(71046),a=r(64248),i=r(57689),s=r(80184);function c(){var e=(0,i.TH)().pathname,t=(0,i.s0)(),r=[{label:"Home",value:"/",disabled:"/"===e},{label:"Hub",value:"/hub",disabled:"/hub"===e},{label:"Icons",value:"/dev/icons",disabled:"/dev/icons"===e},{label:"Colors",value:"/dev/colors",disabled:"/dev/colors"===e},{label:"Sprites",value:"/dev/sprites",disabled:"/dev/sprites"===e},{label:"Resources",value:"/dev/resources",disabled:"/dev/resources"===e},{label:"Playground",value:"/dev/playground",disabled:"/dev/playground"===e},{label:"Showcase",value:"/showcase",disabled:"/showcase"===e}];return(0,s.jsx)(a.Z,{options:r,defaultValue:e,onChange:function(e){t(e)}})}function o(e){var t=e.title,r=e.subTitle,a=e.extra;return(0,s.jsx)("header",{className:"dev-header",children:(0,s.jsxs)("div",{className:"dev-header__heading",children:[(0,s.jsxs)("div",{className:"dev-header__left",children:[(0,s.jsxs)("span",{className:"dev-header__title",children:[t," "]}),(0,s.jsx)("span",{className:"dev-header__subtitle",children:r})]}),(0,s.jsxs)("div",{className:"dev-header__extra",children:[(0,s.jsx)(n.Z,{className:"dev-header__extra-space",wrap:!0,children:a}),(0,s.jsx)(c,{})]})]})})}},32246:function(e,t,r){r.r(t),r.d(t,{default:function(){return W}});var n=r(50678),a=r(66509),i=r(11087),s=r(72791),c=r(83990),o=r(66818),l=r(77128),d=r(66106),u=r(30914),h=r(4766),f=r(99757),p=r(81238),x=r(40050),m=r(46708),v=r(73058),g=r(16589),b=r(40140),j=r(61299),y=r(34812),w=r(763),k=(0,w.orderBy)(["arrow-curve-down","arrow-curve-up","arrow-down","arrow-left","arrow-narrow","arrow-right","arrow-rotate","arrow-sign-left","arrow-sign-right","arrow-up","arrow-wide","arrows","arrows-reverse","scale","alien","loupe","trash","two","three","four","five","thought","yin-yang","bell","block","box","brain","broken-arrow","broken-bulb","broken-chain","broken-heart","broken-pencil","broken-shield","bullet","candy","card","check-mark","chip","clock","clover","controller","dialog","dice","difference","distance","dollar","donkey","door","double-arrow-down","double-arrow-left","double-arrow-right","double-arrow-up","ellipsis","empty-box","equal","exclamation-mark","eye","face-angry","face-crying","face-dead","face-embarrassed","face-fed-up","face-mental-breakdown","face-oops","face-panic","face-perplexed","face-scared","face-shocked","face-smiley","face-surprise","face-tense","face-tired","fire","flower","foot-prints","gear","glasses","graph-increase","guide","hare","heart","house","intersection","lie","light-bulb","list","mask","minus","money-bag","moon","one","open-book","paint","paint-brush","pencil","people","person","plus","puzzle","question-mark","recycle","robot","sand-timer","shield","siren","skull","snail","speedometer","spiral","star","stopwatch","sun","sword","table","target","tetris","theater","thumbs-down","thumbs-up","tree","x","zero"]),Z=r(29064),_=r(11605),N=r(76910),S=r(73031),q=r(19433),z=r(76591),A=r(80184),C={avatars:{key:"avatars",label:"Avatars",prefix:"avatar",quantity:50,extra:["A","B","C","D","E","N"],startAt:0},"alien-signs":{key:"alien-signs",label:"Alien Signs",prefix:"sign",quantity:36,startAt:0},sheep:{key:"sheep",label:"Sheep",prefix:"sheep-face",quantity:25,startAt:0},costumes:{key:"costumes",label:"Costumes",prefix:"costume",quantity:50,startAt:0},clubbers:{key:"clubbers",label:"Clubbers",prefix:"clubber",quantity:60,startAt:0},"super-heroes":{key:"super-heroes",label:"Super Heroes",prefix:"super-hero",quantity:50,startAt:0},glyphs:{key:"glyphs",label:"Glyphs",prefix:"glyph",quantity:365,startAt:1},items:{key:"items",label:"Items",prefix:"item",quantity:Number(z.Ro),startAt:0},trees:{key:"trees",label:"Trees",prefix:"tree",quantity:15,startAt:1},emojis:{key:"emojis",label:"Emojis",prefix:"emoji",quantity:30,startAt:1},medals:{key:"medals",label:"Medals",prefix:"medal",quantity:100,startAt:1}},I=(0,w.orderBy)(Object.values(C),["label"],["asc"]);function O(){var e=Object.keys(f.HC).filter((function(e){return!f.q0.includes(e)}));return(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)("ul",{className:"sprites__grid-5",children:f.q0.map((function(e){var t=f.HC[e];return(0,A.jsxs)("li",{className:"sprites__avatar-grid-item",style:{backgroundColor:t.color},children:[(0,A.jsxs)("div",{style:{overflow:"hidden",textAlign:"center"},children:["[",t.id,"]"]}),(0,A.jsx)(x.qE,{id:t.id,size:64}),(0,A.jsx)("div",{style:{overflow:"hidden",textAlign:"center"},children:(0,A.jsxs)("p",{children:[t.description.en,(0,A.jsx)("br",{}),t.description.pt]})})]},t.id)}))}),(0,A.jsx)(l.Z,{}),(0,A.jsx)("ul",{className:"sprites__grid-5",children:e.map((function(e){var t=f.HC[e];return(0,A.jsxs)("li",{className:"sprites__avatar-grid-item",style:{backgroundColor:t.color},children:[(0,A.jsx)(x.qE,{id:t.id,size:64}),(0,A.jsx)("div",{style:{overflow:"hidden",textAlign:"center"},children:(0,A.jsxs)("p",{children:[t.description.en,(0,A.jsx)("br",{}),t.description.pt]})})]},t.id)}))})]})}function E(e){var t=e.type,r=C[t],n=r.quantity,a=r.startAt,i=(0,p.VL)(n,a);return(0,A.jsx)("ul",{className:"sprites__flex",children:i.map((function(e){return(0,A.jsxs)("li",{className:"sprites__flex-item",children:["sheep"===t&&(0,A.jsx)(m.F,{sheepId:String(e),id:"A"}),"costumes"===t&&(0,A.jsx)(v.T,{id:String(e),avatarId:"A"}),"clubbers"===t&&(0,A.jsx)(g._,{id:String(e),avatarId:"A"}),"super-heroes"===t&&(0,A.jsx)(N.x,{id:String(e),avatarId:"A"})]},"content-".concat(e))}))})}function M(){var e=C.items,t=e.quantity,r=e.startAt,n=(0,p.VL)(t,r);return(0,A.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,A.jsxs)("li",{className:"sprites__flex-item",children:[(0,A.jsx)(j.q,{id:String(e)}),e]},"items-".concat(e))}))})}function B(){var e=C["alien-signs"],t=e.quantity,r=e.startAt,n=(0,p.VL)(t,r);return(0,A.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,A.jsxs)("li",{className:"sprites__flex-item",children:[(0,A.jsx)(q.w,{id:String(e)}),e]},"items-".concat(e))}))})}function H(){var e=C.emojis,t=e.quantity,r=e.startAt,n=(0,p.VL)(t,r);return(0,A.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,A.jsxs)("li",{className:"sprites__flex-item",children:[(0,A.jsx)(S.f,{id:String(e)}),e]},"items-".concat(e))}))})}function P(){var e=C.glyphs,t=e.quantity,r=e.startAt,n=(0,p.VL)(t,r);return(0,A.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,A.jsxs)("li",{className:"sprites__flex-item",children:[(0,A.jsx)(b.M,{id:String(e)}),e]},"costume-".concat(e))}))})}function T(){return(0,A.jsx)(d.Z,{gutter:8,children:k.map((function(e){return(0,A.jsxs)(u.Z,{xs:6,sm:6,md:4,lg:4,xl:2,className:"sprites__col",children:[(0,A.jsx)(Z.j,{id:String(e),width:100}),e]},"medal-".concat(e))}))})}function L(){var e=C.trees,t=e.quantity,r=e.startAt,n=(0,p.VL)(t,r);return(0,A.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,A.jsxs)("li",{className:"sprites__flex-item",children:[(0,A.jsx)(_.Y,{id:String(e)}),e]},"tree-".concat(e))}))})}var W=function(){var e,t,r=(0,s.useState)(C.avatars),l=(0,n.Z)(r,2),d=l[0],u=l[1];(0,a.Z)("".concat(d.label," Sprites | Dev | Tarde Divertida"));var f=(0,h.K)({active:"avatars"});(0,s.useEffect)((function(){var e;u(null!==(e=C[f.queryParams.active])&&void 0!==e?e:C.avatars)}),[f.queryParams.active]);var p=null!==(e=null===(t={avatars:(0,A.jsx)(O,{}),glyphs:(0,A.jsx)(P,{}),items:(0,A.jsx)(M,{}),medals:(0,A.jsx)(T,{}),trees:(0,A.jsx)(L,{}),emojis:(0,A.jsx)(H,{}),"alien-signs":(0,A.jsx)(B,{})})||void 0===t?void 0:t[d.key])&&void 0!==e?e:(0,A.jsx)(E,{type:d.key});return(0,A.jsxs)(c.Z,{className:"dev-layout",children:[(0,A.jsx)(y.B,{title:(0,A.jsx)(o.Z,{onChange:function(e){return f.add("active",e)},value:f.queryParams.active,size:"small",style:{minWidth:"15ch"},children:I.map((function(e){return(0,A.jsx)(o.Z.Option,{value:e.key,children:e.label},e.key)}))}),subTitle:(0,A.jsxs)(A.Fragment,{children:["(",d.quantity,")","items"===d.key&&(0,A.jsx)(i.rU,{to:"/dev/classifier",children:" Classifier"})]})}),(0,A.jsx)(c.Z.Content,{className:"dev-content",children:p})]})}},90398:function(e,t,r){r.d(t,{Z:function(){return o}});var n=r(87462),a=r(72791),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"}}]},name:"warning",theme:"outlined"},s=r(24315),c=function(e,t){return a.createElement(s.Z,(0,n.Z)({},e,{ref:t,icon:i}))};var o=a.forwardRef(c)},30914:function(e,t,r){var n=r(89752);t.Z=n.Z},77128:function(e,t,r){r.d(t,{Z:function(){return m}});var n=r(36222),a=r(50678),i=r(72791),s=r(19809),c=r.n(s),o=r(71929),l=r(20909),d=r(67521),u=r(96562),h=r(89922),f=function(e){var t,r=e.componentCls,a=e.sizePaddingEdgeHorizontal,i=e.colorSplit,s=e.lineWidth,c=e.textPaddingInline,o=e.orientationMargin,u=e.verticalMarginInline;return(0,n.Z)({},r,Object.assign(Object.assign({},(0,d.Wf)(e)),(t={borderBlockStart:"".concat((0,l.unit)(s)," solid ").concat(i),"&-vertical":{position:"relative",top:"-0.06em",display:"inline-block",height:"0.9em",marginInline:u,marginBlock:0,verticalAlign:"middle",borderTop:0,borderInlineStart:"".concat((0,l.unit)(s)," solid ").concat(i)},"&-horizontal":{display:"flex",clear:"both",width:"100%",minWidth:"100%",margin:"".concat((0,l.unit)(e.dividerHorizontalGutterMargin)," 0")}},(0,n.Z)(t,"&-horizontal".concat(r,"-with-text"),{display:"flex",alignItems:"center",margin:"".concat((0,l.unit)(e.dividerHorizontalWithTextGutterMargin)," 0"),color:e.colorTextHeading,fontWeight:500,fontSize:e.fontSizeLG,whiteSpace:"nowrap",textAlign:"center",borderBlockStart:"0 ".concat(i),"&::before, &::after":{position:"relative",width:"50%",borderBlockStart:"".concat((0,l.unit)(s)," solid transparent"),borderBlockStartColor:"inherit",borderBlockEnd:0,transform:"translateY(50%)",content:"''"}}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-left"),{"&::before":{width:"calc(".concat(o," * 100%)")},"&::after":{width:"calc(100% - ".concat(o," * 100%)")}}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-right"),{"&::before":{width:"calc(100% - ".concat(o," * 100%)")},"&::after":{width:"calc(".concat(o," * 100%)")}}),(0,n.Z)(t,"".concat(r,"-inner-text"),{display:"inline-block",paddingBlock:0,paddingInline:c}),(0,n.Z)(t,"&-dashed",{background:"none",borderColor:i,borderStyle:"dashed",borderWidth:"".concat((0,l.unit)(s)," 0 0")}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text").concat(r,"-dashed"),{"&::before, &::after":{borderStyle:"dashed none none"}}),(0,n.Z)(t,"&-vertical".concat(r,"-dashed"),{borderInlineStartWidth:s,borderInlineEnd:0,borderBlockStart:0,borderBlockEnd:0}),(0,n.Z)(t,"&-plain".concat(r,"-with-text"),{color:e.colorText,fontWeight:"normal",fontSize:e.fontSize}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-left").concat(r,"-no-default-orientation-margin-left"),(0,n.Z)({"&::before":{width:0},"&::after":{width:"100%"}},"".concat(r,"-inner-text"),{paddingInlineStart:a})),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-right").concat(r,"-no-default-orientation-margin-right"),(0,n.Z)({"&::before":{width:"100%"},"&::after":{width:0}},"".concat(r,"-inner-text"),{paddingInlineEnd:a})),t)))},p=(0,u.I$)("Divider",(function(e){var t=(0,h.TS)(e,{dividerHorizontalWithTextGutterMargin:e.margin,dividerHorizontalGutterMargin:e.marginLG,sizePaddingEdgeHorizontal:0});return[f(t)]}),(function(e){return{textPaddingInline:"1em",orientationMargin:.05,verticalMarginInline:e.marginXS}}),{unitless:{orientationMargin:!0}}),x=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]])}return r};var m=function(e){var t,r=i.useContext(o.E_),s=r.getPrefixCls,l=r.direction,d=r.divider,u=e.prefixCls,h=e.type,f=void 0===h?"horizontal":h,m=e.orientation,v=void 0===m?"center":m,g=e.orientationMargin,b=e.className,j=e.rootClassName,y=e.children,w=e.dashed,k=e.plain,Z=e.style,_=x(e,["prefixCls","type","orientation","orientationMargin","className","rootClassName","children","dashed","plain","style"]),N=s("divider",u),S=p(N),q=(0,a.Z)(S,3),z=q[0],A=q[1],C=q[2],I=v.length>0?"-".concat(v):v,O=!!y,E="left"===v&&null!=g,M="right"===v&&null!=g,B=c()(N,null===d||void 0===d?void 0:d.className,A,C,"".concat(N,"-").concat(f),(t={},(0,n.Z)(t,"".concat(N,"-with-text"),O),(0,n.Z)(t,"".concat(N,"-with-text").concat(I),O),(0,n.Z)(t,"".concat(N,"-dashed"),!!w),(0,n.Z)(t,"".concat(N,"-plain"),!!k),(0,n.Z)(t,"".concat(N,"-rtl"),"rtl"===l),(0,n.Z)(t,"".concat(N,"-no-default-orientation-margin-left"),E),(0,n.Z)(t,"".concat(N,"-no-default-orientation-margin-right"),M),t),b,j),H=i.useMemo((function(){return"number"===typeof g?g:/^\d+$/.test(g)?Number(g):g}),[g]),P=Object.assign(Object.assign({},E&&{marginLeft:H}),M&&{marginRight:H});return z(i.createElement("div",Object.assign({className:B,style:Object.assign(Object.assign({},null===d||void 0===d?void 0:d.style),Z)},_,{role:"separator"}),y&&"vertical"!==f&&i.createElement("span",{className:"".concat(N,"-inner-text"),style:P},y)))}},66106:function(e,t,r){var n=r(37545);t.Z=n.Z}}]);
//# sourceMappingURL=page-dev-sprites.093d28a7.chunk.js.map