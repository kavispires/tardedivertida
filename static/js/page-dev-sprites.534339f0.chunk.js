(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[1046],{4766:function(e,t,r){"use strict";r.d(t,{K:function(){return s}});var n=r(50678),a=r(72791),i=r(11087);function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,i.lr)(),r=(0,n.Z)(t,2),s=r[0],o=r[1],l=function(e,t){void 0===t?s.delete(e):s.set(e,String(t)),o(s)},c=function(e){s.delete(e),o(s)};(0,a.useEffect)((function(){Object.entries(e).forEach((function(e){var t=(0,n.Z)(e,2),r=t[0],a=t[1];s.has(r)||l(r,a)}))}),[]);var d=s.toString().split("&").reduce((function(e,t){var r=t.split("="),a=(0,n.Z)(r,2),i=a[0],s=a[1];return i&&void 0!==s&&(e[i]=s),e}),{});return{add:l,remove:c,queryParams:d}}},34812:function(e,t,r){"use strict";r.d(t,{B:function(){return l}});var n=r(71046),a=r(64248),i=r(57689),s=r(80184);function o(){var e=(0,i.TH)().pathname,t=(0,i.s0)(),r=[{label:"Home",value:"/",disabled:"/"===e},{label:"Hub",value:"/hub",disabled:"/hub"===e},{label:"Icons",value:"/dev/icons",disabled:"/dev/icons"===e},{label:"Colors",value:"/dev/colors",disabled:"/dev/colors"===e},{label:"Sprites",value:"/dev/sprites",disabled:"/dev/sprites"===e},{label:"Resources",value:"/dev/resources",disabled:"/dev/resources"===e},{label:"Playground",value:"/dev/playground",disabled:"/dev/playground"===e},{label:"Daily Setup",value:"/dev/dailysetup",disabled:"/dev/dailysetup"===e},{label:"Showcase",value:"/showcase",disabled:"/showcase"===e}];return(0,s.jsx)(a.Z,{options:r,defaultValue:e,onChange:function(e){t(e)}})}function l(e){var t=e.title,r=e.subTitle,a=e.extra;return(0,s.jsx)("header",{className:"dev-header",children:(0,s.jsxs)("div",{className:"dev-header__heading",children:[(0,s.jsxs)("div",{className:"dev-header__left",children:[(0,s.jsxs)("span",{className:"dev-header__title",children:[t," "]}),(0,s.jsx)("span",{className:"dev-header__subtitle",children:r})]}),(0,s.jsxs)("div",{className:"dev-header__extra",children:[(0,s.jsx)(n.Z,{className:"dev-header__extra-space",wrap:!0,children:a}),(0,s.jsx)(o,{})]})]})})}},32246:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return H}});var n=r(50678),a=r(66509),i=r(11087),s=r(72791),o=r(83990),l=r(238),c=r(77128),d=r(66106),u=r(30914),p=r(4766),f=r(99757),h=r(81238),x=r(40050),m=r(46708),b=r(92056),v=r(86251),g=r(11491),y=r(93196),j=r(34812),w=(0,r(763).orderBy)(["arrow-curve-down","arrow-curve-up","arrow-down","arrow-left","arrow-narrow","arrow-right","arrow-rotate","arrow-sign-left","arrow-sign-right","arrow-up","arrow-wide","arrows","arrows-reverse","scale","alien","loupe","trash","two","three","four","five","thought","yin-yang","bell","block","box","brain","broken-arrow","broken-bulb","broken-chain","broken-heart","broken-pencil","broken-shield","bullet","candy","card","check-mark","chip","clock","clover","controller","dialog","dice","difference","distance","dollar","donkey","door","double-arrow-down","double-arrow-left","double-arrow-right","double-arrow-up","ellipsis","empty-box","equal","exclamation-mark","eye","face-angry","face-crying","face-dead","face-embarrassed","face-fed-up","face-mental-breakdown","face-oops","face-panic","face-perplexed","face-scared","face-shocked","face-smiley","face-surprise","face-tense","face-tired","fire","flower","foot-prints","gear","glasses","graph-increase","guide","hare","heart","house","intersection","lie","light-bulb","list","mask","minus","money-bag","moon","one","open-book","paint","paint-brush","pencil","people","person","plus","puzzle","question-mark","recycle","robot","sand-timer","shield","siren","skull","snail","speedometer","spiral","star","stopwatch","sun","sword","table","target","tetris","theater","thumbs-down","thumbs-up","tree","x","zero"]),_=r(29064),k=r(11605),S=r(76910),Z=r(22505),N=r(80184),A={avatars:{key:"avatars",label:"Avatars",prefix:"avatar",quantity:50,extra:["A","B","C","D","E","N"],startAt:0},sheep:{key:"sheep",label:"Sheep",prefix:"sheep-face",quantity:25,startAt:0},costumes:{key:"costumes",label:"Costumes",prefix:"costume",quantity:25,startAt:0},clubbers:{key:"clubbers",label:"Clubbers",prefix:"clubber",quantity:60,startAt:0},"super-heroes":{key:"super-heroes",label:"Super Heroes",prefix:"super-hero",quantity:50,startAt:1},glyphs:{key:"glyphs",label:"Glyphs",prefix:"glyph",quantity:365,startAt:1},items:{key:"items",label:"Items",prefix:"item",quantity:500,startAt:1},trees:{key:"trees",label:"Trees",prefix:"tree",quantity:15,startAt:1},emojis:{key:"emojis",label:"Emojis",prefix:"emoji",quantity:30,startAt:1},medals:{key:"medals",label:"Medals",prefix:"medal",quantity:100,startAt:1}};function q(){var e=Object.keys(f.HC).filter((function(e){return!f.q0.includes(e)}));return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("ul",{className:"sprites__grid-5",children:f.q0.map((function(e){var t=f.HC[e];return(0,N.jsxs)("li",{className:"sprites__avatar-grid-item",style:{backgroundColor:t.color},children:[(0,N.jsxs)("div",{style:{overflow:"hidden",textAlign:"center"},children:["[",t.id,"]"]}),(0,N.jsx)(x.qE,{id:t.id,size:64}),(0,N.jsx)("div",{style:{overflow:"hidden",textAlign:"center"},children:(0,N.jsxs)("p",{children:[t.description.en,(0,N.jsx)("br",{}),t.description.pt]})})]},t.id)}))}),(0,N.jsx)(c.Z,{}),(0,N.jsx)("ul",{className:"sprites__grid-5",children:e.map((function(e){var t=f.HC[e];return(0,N.jsxs)("li",{className:"sprites__avatar-grid-item",style:{backgroundColor:t.color},children:[(0,N.jsx)(x.qE,{id:t.id,size:64}),(0,N.jsx)("div",{style:{overflow:"hidden",textAlign:"center"},children:(0,N.jsxs)("p",{children:[t.description.en,(0,N.jsx)("br",{}),t.description.pt]})})]},t.id)}))})]})}function z(e){var t=e.type,r=A[t],n=r.quantity,a=r.startAt,i=(0,h.VL)(n,a);return(0,N.jsx)("ul",{className:"sprites__flex",children:i.map((function(e){return(0,N.jsxs)("li",{className:"sprites__flex-item",children:["sheep"===t&&(0,N.jsx)(m.F,{sheepId:String(e),id:"A"}),"costumes"===t&&(0,N.jsx)(b.T,{costumeId:String(e),id:"A"}),"clubbers"===t&&(0,N.jsx)(v._,{clubberId:String(e),id:"A"}),"super-heroes"===t&&(0,N.jsx)(S.x,{superHeroId:String(e),id:"A"})]},"content-".concat(e))}))})}function C(){var e=A.items,t=e.quantity,r=e.startAt,n=(0,h.VL)(t,r);return(0,N.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,N.jsxs)("li",{className:"sprites__flex-item",children:[(0,N.jsx)(y.q,{id:String(e)}),e]},"items-".concat(e))}))})}function O(){var e=A.emojis,t=e.quantity,r=e.startAt,n=(0,h.VL)(t,r);return(0,N.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,N.jsxs)("li",{className:"sprites__flex-item",children:[(0,N.jsx)(Z.f,{id:String(e)}),e]},"items-".concat(e))}))})}function I(){var e=A.glyphs,t=e.quantity,r=e.startAt,n=(0,h.VL)(t,r);return(0,N.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,N.jsxs)("li",{className:"sprites__flex-item",children:[(0,N.jsx)(g.M,{id:String(e)}),e]},"costume-".concat(e))}))})}function M(){return(0,N.jsx)(d.Z,{gutter:8,children:w.map((function(e){return(0,N.jsxs)(u.Z,{xs:6,sm:6,md:4,lg:4,xl:2,className:"sprites__col",children:[(0,N.jsx)(_.j,{id:String(e),width:100}),e]},"medal-".concat(e))}))})}function E(){var e=A.trees,t=e.quantity,r=e.startAt,n=(0,h.VL)(t,r);return(0,N.jsx)("ul",{className:"sprites__flex",children:n.map((function(e){return(0,N.jsxs)("li",{className:"sprites__flex-item",children:[(0,N.jsx)(k.Y,{id:String(e)}),e]},"tree-".concat(e))}))})}var H=function(){var e,t,r=(0,s.useState)(A.avatars),c=(0,n.Z)(r,2),d=c[0],u=c[1];(0,a.Z)("".concat(d.label," Sprites | Dev | Tarde Divertida"));var f=(0,p.K)({active:"avatars"});(0,s.useEffect)((function(){var e;u(null!==(e=A[f.queryParams.active])&&void 0!==e?e:A.avatars)}),[f.queryParams.active]);var h=null!==(e=null===(t={avatars:(0,N.jsx)(q,{}),glyphs:(0,N.jsx)(I,{}),items:(0,N.jsx)(C,{}),medals:(0,N.jsx)(M,{}),trees:(0,N.jsx)(E,{}),emojis:(0,N.jsx)(O,{})})||void 0===t?void 0:t[d.key])&&void 0!==e?e:(0,N.jsx)(z,{type:d.key});return(0,N.jsxs)(o.Z,{className:"dev-layout",children:[(0,N.jsx)(j.B,{title:(0,N.jsx)(l.Z,{onChange:function(e){return f.add("active",e)},value:f.queryParams.active,size:"small",style:{minWidth:"15ch"},children:Object.values(A).map((function(e){return(0,N.jsx)(l.Z.Option,{value:e.key,children:e.label},e.key)}))}),subTitle:(0,N.jsxs)(N.Fragment,{children:["(",d.quantity,")","items"===d.key&&(0,N.jsx)(i.rU,{to:"/dev/classifier",children:" Classifier"})]})}),(0,N.jsx)(o.Z.Content,{className:"dev-content",children:h})]})}},30914:function(e,t,r){"use strict";var n=r(89752);t.Z=n.Z},77128:function(e,t,r){"use strict";r.d(t,{Z:function(){return x}});var n=r(36222),a=r(50678),i=r(72791),s=r(81694),o=r.n(s),l=r(71929),c=r(67521),d=r(55564),u=r(89922),p=function(e){var t,r=e.componentCls,a=e.sizePaddingEdgeHorizontal,i=e.colorSplit,s=e.lineWidth,o=e.textPaddingInline,l=e.orientationMargin,d=e.verticalMarginInline;return(0,n.Z)({},r,Object.assign(Object.assign({},(0,c.Wf)(e)),(t={borderBlockStart:"".concat(s,"px solid ").concat(i),"&-vertical":{position:"relative",top:"-0.06em",display:"inline-block",height:"0.9em",marginInline:d,marginBlock:0,verticalAlign:"middle",borderTop:0,borderInlineStart:"".concat(s,"px solid ").concat(i)},"&-horizontal":{display:"flex",clear:"both",width:"100%",minWidth:"100%",margin:"".concat(e.dividerHorizontalGutterMargin,"px 0")}},(0,n.Z)(t,"&-horizontal".concat(r,"-with-text"),{display:"flex",alignItems:"center",margin:"".concat(e.dividerHorizontalWithTextGutterMargin,"px 0"),color:e.colorTextHeading,fontWeight:500,fontSize:e.fontSizeLG,whiteSpace:"nowrap",textAlign:"center",borderBlockStart:"0 ".concat(i),"&::before, &::after":{position:"relative",width:"50%",borderBlockStart:"".concat(s,"px solid transparent"),borderBlockStartColor:"inherit",borderBlockEnd:0,transform:"translateY(50%)",content:"''"}}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-left"),{"&::before":{width:"".concat(100*l,"%")},"&::after":{width:"".concat(100-100*l,"%")}}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-right"),{"&::before":{width:"".concat(100-100*l,"%")},"&::after":{width:"".concat(100*l,"%")}}),(0,n.Z)(t,"".concat(r,"-inner-text"),{display:"inline-block",paddingBlock:0,paddingInline:o}),(0,n.Z)(t,"&-dashed",{background:"none",borderColor:i,borderStyle:"dashed",borderWidth:"".concat(s,"px 0 0")}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text").concat(r,"-dashed"),{"&::before, &::after":{borderStyle:"dashed none none"}}),(0,n.Z)(t,"&-vertical".concat(r,"-dashed"),{borderInlineStartWidth:s,borderInlineEnd:0,borderBlockStart:0,borderBlockEnd:0}),(0,n.Z)(t,"&-plain".concat(r,"-with-text"),{color:e.colorText,fontWeight:"normal",fontSize:e.fontSize}),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-left").concat(r,"-no-default-orientation-margin-left"),(0,n.Z)({"&::before":{width:0},"&::after":{width:"100%"}},"".concat(r,"-inner-text"),{paddingInlineStart:a})),(0,n.Z)(t,"&-horizontal".concat(r,"-with-text-right").concat(r,"-no-default-orientation-margin-right"),(0,n.Z)({"&::before":{width:"100%"},"&::after":{width:0}},"".concat(r,"-inner-text"),{paddingInlineEnd:a})),t)))},f=(0,d.Z)("Divider",(function(e){var t=(0,u.TS)(e,{dividerHorizontalWithTextGutterMargin:e.margin,dividerHorizontalGutterMargin:e.marginLG,sizePaddingEdgeHorizontal:0});return[p(t)]}),(function(e){return{textPaddingInline:"1em",orientationMargin:.05,verticalMarginInline:e.marginXS}})),h=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]])}return r};var x=function(e){var t,r=i.useContext(l.E_),s=r.getPrefixCls,c=r.direction,d=r.divider,u=e.prefixCls,p=e.type,x=void 0===p?"horizontal":p,m=e.orientation,b=void 0===m?"center":m,v=e.orientationMargin,g=e.className,y=e.rootClassName,j=e.children,w=e.dashed,_=e.plain,k=e.style,S=h(e,["prefixCls","type","orientation","orientationMargin","className","rootClassName","children","dashed","plain","style"]),Z=s("divider",u),N=f(Z),A=(0,a.Z)(N,2),q=A[0],z=A[1],C=b.length>0?"-".concat(b):b,O=!!j,I="left"===b&&null!=v,M="right"===b&&null!=v,E=o()(Z,null===d||void 0===d?void 0:d.className,z,"".concat(Z,"-").concat(x),(t={},(0,n.Z)(t,"".concat(Z,"-with-text"),O),(0,n.Z)(t,"".concat(Z,"-with-text").concat(C),O),(0,n.Z)(t,"".concat(Z,"-dashed"),!!w),(0,n.Z)(t,"".concat(Z,"-plain"),!!_),(0,n.Z)(t,"".concat(Z,"-rtl"),"rtl"===c),(0,n.Z)(t,"".concat(Z,"-no-default-orientation-margin-left"),I),(0,n.Z)(t,"".concat(Z,"-no-default-orientation-margin-right"),M),t),g,y),H=i.useMemo((function(){return"number"===typeof v?v:/^\d+$/.test(v)?Number(v):v}),[v]),P=Object.assign(Object.assign({},I&&{marginLeft:H}),M&&{marginRight:H});return q(i.createElement("div",Object.assign({className:E,style:Object.assign(Object.assign({},null===d||void 0===d?void 0:d.style),k)},S,{role:"separator"}),j&&"vertical"!==x&&i.createElement("span",{className:"".concat(Z,"-inner-text"),style:P},j)))}},66106:function(e,t,r){"use strict";var n=r(37545);t.Z=n.Z},5314:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},80807:function(e){e.exports=function(e){if(Array.isArray(e))return e},e.exports.__esModule=!0,e.exports.default=e.exports},38181:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},61581:function(e){e.exports=function(e,t){var r=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,i=[],s=!0,o=!1;try{for(r=r.call(e);!(s=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);s=!0);}catch(l){o=!0,a=l}finally{try{s||null==r.return||r.return()}finally{if(o)throw a}}return i}},e.exports.__esModule=!0,e.exports.default=e.exports},96258:function(e){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},94534:function(e,t,r){var n=r(80807),a=r(61581),i=r(55816),s=r(96258);e.exports=function(e,t){return n(e)||a(e,t)||i(e,t)||s()},e.exports.__esModule=!0,e.exports.default=e.exports},55816:function(e,t,r){var n=r(5314);e.exports=function(e,t){if(e){if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=page-dev-sprites.534339f0.chunk.js.map