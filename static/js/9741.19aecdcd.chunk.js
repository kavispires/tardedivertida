"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[9741],{27810:function(e,t,n){n.d(t,{Z:function(){return w}});var r=n(81694),a=n.n(r),o=n(72791),c=n(89532),l=n(66180),i=n(70737),u=n(67521);function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=function(e){var t,n=e.componentCls,r=e.colorBgContainer,a=e.fontSize,o=e.fontSizeSM,c=e.padding,l=e.paddingXS,i=e.marginSM,s=e.marginXXS,m=e.controlHeight,v=e.lineHeightSM,p=e.colorText,h=e.colorTextSecondary,g=e.colorTextTertiary,b=e.motionDurationSlow;return d({},n,f(f({},(0,u.Wf)(e)),{},(d(t={position:"relative",backgroundColor:r},"".concat(n,"-inner"),{display:"flex",paddingBlock:c}),d(t,"".concat(n,"-avatar"),{position:"relative",flexShrink:0,marginInlineEnd:i,cursor:"pointer",img:{width:m,height:m,borderRadius:"50%"}}),d(t,"".concat(n,"-content"),{position:"relative",flex:"auto",minWidth:0,wordWrap:"break-word","&-author":{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",marginBottom:s,"& > a, & > span":{paddingInlineEnd:l,fontSize:o,lineHeight:v},"&-name":{color:h,fontSize:a,transition:"color ".concat(b),"> *":{color:h,"&:hover":{color:h}}},"&-time":{color:g,whiteSpace:"nowrap",cursor:"auto"}},"&-detail p":{whiteSpace:"pre-wrap",marginBlock:0}}),d(t,"".concat(n,"-actions"),{marginTop:i,marginBottom:0,paddingInlineStart:0,"> li":{display:"inline-block",color:h,"> span":{marginInlineEnd:i,color:h,fontSize:o,cursor:"pointer",transition:"color ".concat(b),userSelect:"none","&:hover":{color:p}}}}),d(t,"".concat(n,"-nested"),{marginInlineStart:44}),t)))};var v=["actions","author","avatar","children","className","content","prefixCls","datetime"];function p(){return p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p.apply(this,arguments)}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,a,o=[],c=!0,l=!1;try{for(n=n.call(e);!(c=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);c=!0);}catch(i){l=!0,a=i}finally{try{c||null==n.return||n.return()}finally{if(l)throw a}}return o}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return g(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return g(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function b(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var y=c.ZP.ConfigContext,w=function(e){var t,n,r,u=e.actions,s=e.author,d=e.avatar,g=e.children,w=e.className,S=e.content,Z=e.prefixCls,O=e.datetime,C=b(e,v),x=o.useContext(y),E=x.getPrefixCls,j=x.direction,N=E("comment",Z),k=function(e){var t=i.Z.useToken(),n=t.theme,r=t.token,a=t.hashId,u=o.useContext(c.ZP.ConfigContext).iconPrefixCls;return[(0,l.xy)({theme:n,token:r,hashId:a,path:["compatible","Comment",e,u]},(function(){var t=f({componentCls:".".concat(e)},r);return[m(t)]})),a]}(N),z=h(k,2),R=z[0],I=z[1],P=d?o.createElement("div",{className:"".concat(N,"-avatar")},"string"===typeof d?o.createElement("img",{src:d,alt:"comment-avatar"}):d):null,L=u&&u.length?o.createElement("ul",{className:"".concat(N,"-actions")},u.map((function(e,t){return o.createElement("li",{key:"action-".concat(t)},e)}))):null,M=(s||O)&&o.createElement("div",{className:"".concat(N,"-content-author")},s&&o.createElement("span",{className:"".concat(N,"-content-author-name")},s),O&&o.createElement("span",{className:"".concat(N,"-content-author-time")},O)),H=o.createElement("div",{className:"".concat(N,"-content")},M,o.createElement("div",{className:"".concat(N,"-content-detail")},S),L),T=a()(N,(t={},n="".concat(N,"-rtl"),r="rtl"===j,n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t),w,I);return R(o.createElement("div",p({},C,{className:T}),o.createElement("div",{className:"".concat(N,"-inner")},P,H),g?function(e,t){return o.createElement("div",{className:a()("".concat(e,"-nested"))},t)}(N,g):null))}},92995:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zm-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"}},{tag:"path",attrs:{d:"M894 345a343.92 343.92 0 00-189-130v.1c-17.1-19-36.4-36.5-58-52.1-163.7-119-393.5-82.7-513 81-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4a31.95 31.95 0 0040.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6 17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408zM323 735l-12-5-99 31-1-104-8-9c-84.6-103.2-90.2-251.9-11-361 96.4-132.2 281.2-161.4 413-66 132.2 96.1 161.5 280.6 66 412-80.1 109.9-223.5 150.5-348 102zm505-17l-8 10 1 104-98-33-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1A367.31 367.31 0 00729 676c76.4-105.3 88.8-237.6 44.4-350.4l.6.4c23 16.5 44.1 37.1 62 62 72.6 99.6 68.5 235.2-8 330z"}},{tag:"path",attrs:{d:"M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"}}]},name:"comment",theme:"outlined"},c=n(64864),l=function(e,t){return a.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="CommentOutlined";var i=a.forwardRef(l)},99596:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M925.9 804l-24-199.2c-.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3a8.03 8.03 0 00-11.3 0l-45 45.2a8.03 8.03 0 000 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3a8.01 8.01 0 004.7 13.6l199.2 24c5.1.7 9.5-3.7 8.8-8.9z"}}]},name:"fall",theme:"outlined"},c=n(64864),l=function(e,t){return a.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="FallOutlined";var i=a.forwardRef(l)},18341:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 000 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0013.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"}}]},name:"rise",theme:"outlined"},c=n(64864),l=function(e,t){return a.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="RiseOutlined";var i=a.forwardRef(l)},19951:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 000-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z"}}]},name:"share-alt",theme:"outlined"},c=n(64864),l=function(e,t){return a.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="ShareAltOutlined";var i=a.forwardRef(l)},35794:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"}}]},name:"star",theme:"filled"},c=n(64864),l=function(e,t){return a.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="StarFilled";var i=a.forwardRef(l)},56908:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"}}]},name:"twitter",theme:"outlined"},c=n(64864),l=function(e,t){return a.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="TwitterOutlined";var i=a.forwardRef(l)},34601:function(e,t,n){n.d(t,{Z:function(){return E}});var r=n(50678),a=n(35794),o=n(81694),c=n.n(o),l=n(4942),i=n(29439),u=n(72791),s=n(75179),f=n(84304),d=n(11354);function m(e,t){var n=e.disabled,r=e.prefixCls,a=e.character,o=e.characterRender,l=e.index,i=e.count,s=e.value,f=e.allowHalf,m=e.focused,v=e.onHover,p=e.onClick,h=l+1,g=new Set([r]);0===s&&0===l&&m?g.add("".concat(r,"-focused")):f&&s+.5>=h&&s<h?(g.add("".concat(r,"-half")),g.add("".concat(r,"-active")),m&&g.add("".concat(r,"-focused"))):(h<=s?g.add("".concat(r,"-full")):g.add("".concat(r,"-zero")),h===s&&m&&g.add("".concat(r,"-focused")));var b="function"===typeof a?a(e):a,y=u.createElement("li",{className:c()(Array.from(g)),ref:t},u.createElement("div",{onClick:n?null:function(e){p(e,l)},onKeyDown:n?null:function(e){e.keyCode===d.Z.ENTER&&p(e,l)},onMouseMove:n?null:function(e){v(e,l)},role:"radio","aria-checked":s>l?"true":"false","aria-posinset":l+1,"aria-setsize":i,tabIndex:n?-1:0},u.createElement("div",{className:"".concat(r,"-first")},b),u.createElement("div",{className:"".concat(r,"-second")},b)));return o&&(y=o(y,e)),y}var v=u.forwardRef(m);function p(e,t){var n,r=e.prefixCls,a=void 0===r?"rc-rate":r,o=e.className,m=e.style,p=e.defaultValue,h=e.value,g=e.count,b=void 0===g?5:g,y=e.allowHalf,w=void 0!==y&&y,S=e.allowClear,Z=void 0===S||S,O=e.character,C=void 0===O?"\u2605":O,x=e.characterRender,E=e.disabled,j=e.direction,N=void 0===j?"ltr":j,k=e.tabIndex,z=void 0===k?0:k,R=e.autoFocus,I=e.onHoverChange,P=e.onChange,L=e.onFocus,M=e.onBlur,H=e.onKeyDown,T=function(){var e=u.useRef({});return[function(t){return e.current[t]},function(t){return function(n){e.current[t]=n}}]}(),D=(0,i.Z)(T,2),B=D[0],A=D[1],F=u.useRef(null),W=function(){var e;E||(null===(e=F.current)||void 0===e||e.focus())};u.useImperativeHandle(t,(function(){return{focus:W,blur:function(){var e;E||(null===(e=F.current)||void 0===e||e.blur())}}}));var X=(0,s.Z)(p||0,{value:h}),G=(0,i.Z)(X,2),K=G[0],V=G[1],U=(0,s.Z)(null),$=(0,i.Z)(U,2),_=$[0],q=$[1],J=function(e,t){var n="rtl"===N,r=e+1;if(w){var a=(0,f.Z)(B(e)),o=function(e){var t=function(e){var t,n,r=e.ownerDocument,a=r.body,o=r&&r.documentElement,c=e.getBoundingClientRect();return t=c.left,n=c.top,{left:t-=o.clientLeft||a.clientLeft||0,top:n-=o.clientTop||a.clientTop||0}}(e),n=e.ownerDocument,r=n.defaultView||n.parentWindow;return t.left+=function(e){var t=e.pageXOffset,n="scrollLeft";if("number"!==typeof t){var r=e.document;"number"!==typeof(t=r.documentElement[n])&&(t=r.body[n])}return t}(r),t.left}(a),c=a.clientWidth;(n&&t-o>c/2||!n&&t-o<c/2)&&(r-=.5)}return r},Q=function(e){V(e),null===P||void 0===P||P(e)},Y=u.useState(!1),ee=(0,i.Z)(Y,2),te=ee[0],ne=ee[1],re=u.useState(null),ae=(0,i.Z)(re,2),oe=ae[0],ce=ae[1],le=function(e,t){var n=J(t,e.pageX);n!==_&&(ce(n),q(null)),null===I||void 0===I||I(n)},ie=function(){ce(null),q(null),null===I||void 0===I||I(void 0)},ue=function(e,t){var n=J(t,e.pageX),r=!1;Z&&(r=n===K),ie(),Q(r?0:n),q(r?n:null)};u.useEffect((function(){R&&!E&&W()}),[]);var se=new Array(b).fill(0).map((function(e,t){return u.createElement(v,{ref:A(t),index:t,count:b,disabled:E,prefixCls:"".concat(a,"-star"),allowHalf:w,value:null===oe?K:oe,onClick:ue,onHover:le,key:t,character:C,characterRender:x,focused:te})}));return u.createElement("ul",{className:c()(a,o,(n={},(0,l.Z)(n,"".concat(a,"-disabled"),E),(0,l.Z)(n,"".concat(a,"-rtl"),"rtl"===N),n)),style:m,onMouseLeave:E?null:ie,tabIndex:E?-1:z,onFocus:E?null:function(){ne(!0),null===L||void 0===L||L()},onBlur:E?null:function(){ne(!1),null===M||void 0===M||M()},onKeyDown:E?null:function(e){var t=e.keyCode,n="rtl"===N,r=K;t===d.Z.RIGHT&&r<b&&!n?(Q(r+=w?.5:1),e.preventDefault()):t===d.Z.LEFT&&r>0&&!n||t===d.Z.RIGHT&&r>0&&n?(Q(r-=w?.5:1),e.preventDefault()):t===d.Z.LEFT&&r<b&&n&&(Q(r+=w?.5:1),e.preventDefault()),null===H||void 0===H||H(e)},ref:F,role:"radiogroup"},se)}var h=u.forwardRef(p),g=n(71929),b=n(61431),y=n(36222),w=n(55564),S=n(89922),Z=n(67521),O=function(e){var t=e.componentCls;return(0,y.Z)({},t,Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},(0,Z.Wf)(e)),(0,y.Z)({display:"inline-block",margin:0,padding:0,color:e.rateStarColor,fontSize:e.rateStarSize,lineHeight:"unset",listStyle:"none",outline:"none"},"&-disabled".concat(t," ").concat(t,"-star"),{cursor:"default","> div:hover":{transform:"scale(1)"}})),function(e){var t,n=e.componentCls;return(0,y.Z)({},"".concat(n,"-star"),(t={position:"relative",display:"inline-block",color:"inherit",cursor:"pointer","&:not(:last-child)":{marginInlineEnd:e.marginXS},"> div":{transition:"all ".concat(e.motionDurationMid,", outline 0s"),"&:hover":{transform:e.rateStarHoverScale},"&:focus":{outline:0},"&:focus-visible":{outline:"".concat(e.lineWidth,"px dashed ").concat(e.rateStarColor),transform:e.rateStarHoverScale}},"&-first, &-second":(0,y.Z)({color:e.defaultColor,transition:"all ".concat(e.motionDurationMid),userSelect:"none"},e.iconCls,{verticalAlign:"middle"}),"&-first":{position:"absolute",top:0,insetInlineStart:0,width:"50%",height:"100%",overflow:"hidden",opacity:0}},(0,y.Z)(t,"&-half ".concat(n,"-star-first, &-half ").concat(n,"-star-second"),{opacity:1}),(0,y.Z)(t,"&-half ".concat(n,"-star-first, &-full ").concat(n,"-star-second"),{color:"inherit"}),t))}(e)),(0,y.Z)({},"+ ".concat(t,"-text"),{display:"inline-block",marginInlineStart:e.marginXS,fontSize:e.fontSize})),function(e){return(0,y.Z)({},"&-rtl".concat(e.componentCls),{direction:"rtl"})}(e)))},C=(0,w.Z)("Rate",(function(e){var t=e.colorFillContent,n=(0,S.TS)(e,{rateStarColor:e.yellow6,rateStarSize:.5*e.controlHeightLG,rateStarHoverScale:"scale(1.1)",defaultColor:t});return[O(n)]})),x=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n};var E=u.forwardRef((function(e,t){var n=e.prefixCls,o=e.className,l=e.rootClassName,i=e.tooltips,s=e.character,f=void 0===s?u.createElement(a.Z,null):s,d=x(e,["prefixCls","className","rootClassName","tooltips","character"]),m=u.useContext(g.E_),v=m.getPrefixCls,p=m.direction,y=v("rate",n),w=C(y),S=(0,r.Z)(w,2),Z=S[0],O=S[1];return Z(u.createElement(h,Object.assign({ref:t,character:f,characterRender:function(e,t){var n=t.index;return i?u.createElement(b.Z,{title:i[n]},e):e}},d,{className:c()(o,l,O),prefixCls:y,direction:p})))}))}}]);
//# sourceMappingURL=9741.19aecdcd.chunk.js.map