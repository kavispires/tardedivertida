"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[3733],{83733:function(t,e,n){n.d(e,{Z:function(){return Ct}});var a=n(36222),o=n(50678),c=n(60732),r=n(75033),i=n(1413),l=n(72791),d={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"}},{tag:"path",attrs:{d:"M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"}}]},name:"plus",theme:"outlined"},s=n(64864),u=function(t,e){return l.createElement(s.Z,(0,i.Z)((0,i.Z)({},t),{},{ref:e,icon:d}))};u.displayName="PlusOutlined";var p=l.forwardRef(u),v=n(81694),f=n.n(v),b=n(87462),m=n(4942),h=n(29439),g=n(71002),Z=n(44925),k=n(33786),x=n(75179),y=n(15207),w=(0,l.createContext)(null),_=l.forwardRef((function(t,e){var n=t.prefixCls,a=t.className,o=t.style,c=t.id,r=t.active,i=t.tabKey,d=t.children;return l.createElement("div",{id:c&&"".concat(c,"-panel-").concat(i),role:"tabpanel",tabIndex:r?0:-1,"aria-labelledby":c&&"".concat(c,"-tab-").concat(i),"aria-hidden":!r,style:o,className:f()(n,r&&"".concat(n,"-active"),a),ref:e},d)}));var C=_,S=["key","forceRender","style","className"];function E(t){var e=t.id,n=t.activeKey,a=t.animated,o=t.tabPosition,c=t.destroyInactiveTabPane,r=l.useContext(w),d=r.prefixCls,s=r.tabs,u=a.tabPane,p="".concat(d,"-tabpane");return l.createElement("div",{className:f()("".concat(d,"-content-holder"))},l.createElement("div",{className:f()("".concat(d,"-content"),"".concat(d,"-content-").concat(o),(0,m.Z)({},"".concat(d,"-content-animated"),u))},s.map((function(t){var o=t.key,r=t.forceRender,d=t.style,s=t.className,v=(0,Z.Z)(t,S),m=o===n;return l.createElement(y.Z,(0,b.Z)({key:o,visible:m,forceRender:r,removeOnLeave:!!c,leavedClassName:"".concat(p,"-hidden")},a.tabPaneMotion),(function(t,n){var a=t.style,c=t.className;return l.createElement(C,(0,b.Z)({},v,{prefixCls:p,id:e,tabKey:o,animated:u,active:m,style:(0,i.Z)((0,i.Z)({},d),a),className:f()(s,c),ref:n}))}))}))))}var R=n(93433),P=n(88829),T=n(75314),N=n(88834),L={width:0,height:0,left:0,top:0};function I(t){var e=(0,l.useRef)(),n=(0,l.useRef)(!1);return(0,l.useEffect)((function(){return n.current=!1,function(){n.current=!0,T.Z.cancel(e.current)}}),[]),function(){for(var a=arguments.length,o=new Array(a),c=0;c<a;c++)o[c]=arguments[c];n.current||(T.Z.cancel(e.current),e.current=(0,T.Z)((function(){t.apply(void 0,o)})))}}function O(t,e){var n=l.useRef(t),a=l.useState({}),o=(0,h.Z)(a,2)[1];return[n.current,function(t){var a="function"===typeof t?t(n.current):t;a!==n.current&&e(a,n.current),n.current=a,o({})}]}var B=Math.pow(.995,20);var D={width:0,height:0,left:0,top:0,right:0};function M(t){var e;return t instanceof Map?(e={},t.forEach((function(t,n){e[n]=t}))):e=t,JSON.stringify(e)}function j(t,e){var n=t.prefixCls,a=t.editable,o=t.locale,c=t.style;return a&&!1!==a.showAdd?l.createElement("button",{ref:e,type:"button",className:"".concat(n,"-nav-add"),style:c,"aria-label":(null===o||void 0===o?void 0:o.addAriaLabel)||"Add tab",onClick:function(t){a.onEdit("add",{event:t})}},a.addIcon||"+"):null}var H=l.forwardRef(j);var z=l.forwardRef((function(t,e){var n,a=t.position,o=t.prefixCls,c=t.extra;if(!c)return null;var r={};return"object"!==(0,g.Z)(c)||l.isValidElement(c)?r.right=c:r=c,"right"===a&&(n=r.right),"left"===a&&(n=r.left),n?l.createElement("div",{className:"".concat(o,"-extra-content"),ref:e},n):null})),A=n(93241),G=n(82257),W=n(11354);function X(t,e){var n=t.prefixCls,a=t.id,o=t.tabs,c=t.locale,r=t.mobile,i=t.moreIcon,d=void 0===i?"More":i,s=t.moreTransitionName,u=t.style,p=t.className,v=t.editable,b=t.tabBarGutter,g=t.rtl,Z=t.removeAriaLabel,k=t.onTabClick,x=t.getPopupContainer,y=t.popupClassName,w=(0,l.useState)(!1),_=(0,h.Z)(w,2),C=_[0],S=_[1],E=(0,l.useState)(null),R=(0,h.Z)(E,2),P=R[0],T=R[1],N="".concat(a,"-more-popup"),L="".concat(n,"-dropdown"),I=null!==P?"".concat(N,"-").concat(P):null,O=null===c||void 0===c?void 0:c.dropdownAriaLabel;var B=l.createElement(G.ZP,{onClick:function(t){var e=t.key,n=t.domEvent;k(e,n),S(!1)},prefixCls:"".concat(L,"-menu"),id:N,tabIndex:-1,role:"listbox","aria-activedescendant":I,selectedKeys:[P],"aria-label":void 0!==O?O:"expanded dropdown"},o.map((function(t){var e=v&&!1!==t.closable&&!t.disabled;return l.createElement(G.sN,{key:t.key,id:"".concat(N,"-").concat(t.key),role:"option","aria-controls":a&&"".concat(a,"-panel-").concat(t.key),disabled:t.disabled},l.createElement("span",null,t.label),e&&l.createElement("button",{type:"button","aria-label":Z||"remove",tabIndex:0,className:"".concat(L,"-menu-item-remove"),onClick:function(e){var n,a;e.stopPropagation(),n=e,a=t.key,n.preventDefault(),n.stopPropagation(),v.onEdit("remove",{key:a,event:n})}},t.closeIcon||v.removeIcon||"\xd7"))})));function D(t){for(var e=o.filter((function(t){return!t.disabled})),n=e.findIndex((function(t){return t.key===P}))||0,a=e.length,c=0;c<a;c+=1){var r=e[n=(n+t+a)%a];if(!r.disabled)return void T(r.key)}}(0,l.useEffect)((function(){var t=document.getElementById(I);t&&t.scrollIntoView&&t.scrollIntoView(!1)}),[P]),(0,l.useEffect)((function(){C||T(null)}),[C]);var M=(0,m.Z)({},g?"marginRight":"marginLeft",b);o.length||(M.visibility="hidden",M.order=1);var j=f()((0,m.Z)({},"".concat(L,"-rtl"),g)),z=r?null:l.createElement(A.Z,{prefixCls:L,overlay:B,trigger:["hover"],visible:!!o.length&&C,transitionName:s,onVisibleChange:S,overlayClassName:f()(j,y),mouseEnterDelay:.1,mouseLeaveDelay:.1,getPopupContainer:x},l.createElement("button",{type:"button",className:"".concat(n,"-nav-more"),style:M,tabIndex:-1,"aria-hidden":"true","aria-haspopup":"listbox","aria-controls":N,id:"".concat(a,"-more"),"aria-expanded":C,onKeyDown:function(t){var e=t.which;if(C)switch(e){case W.Z.UP:D(-1),t.preventDefault();break;case W.Z.DOWN:D(1),t.preventDefault();break;case W.Z.ESC:S(!1);break;case W.Z.SPACE:case W.Z.ENTER:null!==P&&k(P,t)}else[W.Z.DOWN,W.Z.SPACE,W.Z.ENTER].includes(e)&&(S(!0),t.preventDefault())}},d));return l.createElement("div",{className:f()("".concat(n,"-nav-operations"),p),style:u,ref:e},z,l.createElement(H,{prefixCls:n,locale:c,editable:v}))}var K=l.memo(l.forwardRef(X),(function(t,e){return e.tabMoving}));var q=function(t){var e,n=t.prefixCls,a=t.id,o=t.active,c=t.tab,r=c.key,i=c.label,d=c.disabled,s=c.closeIcon,u=t.closable,p=t.renderWrapper,v=t.removeAriaLabel,b=t.editable,h=t.onClick,g=t.onFocus,Z=t.style,k="".concat(n,"-tab"),x=b&&!1!==u&&!d;function y(t){d||h(t)}var w=l.createElement("div",{key:r,"data-node-key":r,className:f()(k,(e={},(0,m.Z)(e,"".concat(k,"-with-remove"),x),(0,m.Z)(e,"".concat(k,"-active"),o),(0,m.Z)(e,"".concat(k,"-disabled"),d),e)),style:Z,onClick:y},l.createElement("div",{role:"tab","aria-selected":o,id:a&&"".concat(a,"-tab-").concat(r),className:"".concat(k,"-btn"),"aria-controls":a&&"".concat(a,"-panel-").concat(r),"aria-disabled":d,tabIndex:d?null:0,onClick:function(t){t.stopPropagation(),y(t)},onKeyDown:function(t){[W.Z.SPACE,W.Z.ENTER].includes(t.which)&&(t.preventDefault(),y(t))},onFocus:g},i),x&&l.createElement("button",{type:"button","aria-label":v||"remove",tabIndex:0,className:"".concat(k,"-remove"),onClick:function(t){var e;t.stopPropagation(),(e=t).preventDefault(),e.stopPropagation(),b.onEdit("remove",{key:r,event:e})}},s||b.removeIcon||"\xd7"));return p?p(w):w},V=function(t){var e=t.current||{},n=e.offsetWidth,a=void 0===n?0:n,o=e.offsetHeight;return[a,void 0===o?0:o]},Y=function(t,e){return t[e?0:1]};function F(t,e){var n,a=l.useContext(w),o=a.prefixCls,c=a.tabs,r=t.className,d=t.style,s=t.id,u=t.animated,p=t.activeKey,v=t.rtl,g=t.extra,Z=t.editable,k=t.locale,x=t.tabPosition,y=t.tabBarGutter,_=t.children,C=t.onTabClick,S=t.onTabScroll,E=(0,l.useRef)(),j=(0,l.useRef)(),A=(0,l.useRef)(),G=(0,l.useRef)(),W=(0,l.useRef)(),X=(0,l.useRef)(),F=(0,l.useRef)(),Q="top"===x||"bottom"===x,J=O(0,(function(t,e){Q&&S&&S({direction:t>e?"left":"right"})})),U=(0,h.Z)(J,2),$=U[0],tt=U[1],et=O(0,(function(t,e){!Q&&S&&S({direction:t>e?"top":"bottom"})})),nt=(0,h.Z)(et,2),at=nt[0],ot=nt[1],ct=(0,l.useState)([0,0]),rt=(0,h.Z)(ct,2),it=rt[0],lt=rt[1],dt=(0,l.useState)([0,0]),st=(0,h.Z)(dt,2),ut=st[0],pt=st[1],vt=(0,l.useState)([0,0]),ft=(0,h.Z)(vt,2),bt=ft[0],mt=ft[1],ht=(0,l.useState)([0,0]),gt=(0,h.Z)(ht,2),Zt=gt[0],kt=gt[1],xt=function(t){var e=(0,l.useRef)([]),n=(0,l.useState)({}),a=(0,h.Z)(n,2)[1],o=(0,l.useRef)("function"===typeof t?t():t),c=I((function(){var t=o.current;e.current.forEach((function(e){t=e(t)})),e.current=[],o.current=t,a({})}));return[o.current,function(t){e.current.push(t),c()}]}(new Map),yt=(0,h.Z)(xt,2),wt=yt[0],_t=yt[1],Ct=function(t,e,n){return(0,l.useMemo)((function(){for(var n,a=new Map,o=e.get(null===(n=t[0])||void 0===n?void 0:n.key)||L,c=o.left+o.width,r=0;r<t.length;r+=1){var l,d=t[r].key,s=e.get(d);s||(s=e.get(null===(l=t[r-1])||void 0===l?void 0:l.key)||L);var u=a.get(d)||(0,i.Z)({},s);u.right=c-u.left-u.width,a.set(d,u)}return a}),[t.map((function(t){return t.key})).join("_"),e,n])}(c,wt,ut[0]),St=Y(it,Q),Et=Y(ut,Q),Rt=Y(bt,Q),Pt=Y(Zt,Q),Tt=St<Et+Rt?St-Pt:St-Rt,Nt="".concat(o,"-nav-operations-hidden"),Lt=0,It=0;function Ot(t){return t<Lt?Lt:t>It?It:t}Q&&v?(Lt=0,It=Math.max(0,Et-Tt)):(Lt=Math.min(0,Tt-Et),It=0);var Bt=(0,l.useRef)(),Dt=(0,l.useState)(),Mt=(0,h.Z)(Dt,2),jt=Mt[0],Ht=Mt[1];function zt(){Ht(Date.now())}function At(){window.clearTimeout(Bt.current)}!function(t,e){var n=(0,l.useState)(),a=(0,h.Z)(n,2),o=a[0],c=a[1],r=(0,l.useState)(0),i=(0,h.Z)(r,2),d=i[0],s=i[1],u=(0,l.useState)(0),p=(0,h.Z)(u,2),v=p[0],f=p[1],b=(0,l.useState)(),m=(0,h.Z)(b,2),g=m[0],Z=m[1],k=(0,l.useRef)(),x=(0,l.useRef)(),y=(0,l.useRef)(null);y.current={onTouchStart:function(t){var e=t.touches[0],n=e.screenX,a=e.screenY;c({x:n,y:a}),window.clearInterval(k.current)},onTouchMove:function(t){if(o){t.preventDefault();var n=t.touches[0],a=n.screenX,r=n.screenY;c({x:a,y:r});var i=a-o.x,l=r-o.y;e(i,l);var u=Date.now();s(u),f(u-d),Z({x:i,y:l})}},onTouchEnd:function(){if(o&&(c(null),Z(null),g)){var t=g.x/v,n=g.y/v,a=Math.abs(t),r=Math.abs(n);if(Math.max(a,r)<.1)return;var i=t,l=n;k.current=window.setInterval((function(){Math.abs(i)<.01&&Math.abs(l)<.01?window.clearInterval(k.current):e(20*(i*=B),20*(l*=B))}),20)}},onWheel:function(t){var n=t.deltaX,a=t.deltaY,o=0,c=Math.abs(n),r=Math.abs(a);c===r?o="x"===x.current?n:a:c>r?(o=n,x.current="x"):(o=a,x.current="y"),e(-o,-o)&&t.preventDefault()}},l.useEffect((function(){function e(t){y.current.onTouchMove(t)}function n(t){y.current.onTouchEnd(t)}return document.addEventListener("touchmove",e,{passive:!1}),document.addEventListener("touchend",n,{passive:!1}),t.current.addEventListener("touchstart",(function(t){y.current.onTouchStart(t)}),{passive:!1}),t.current.addEventListener("wheel",(function(t){y.current.onWheel(t)})),function(){document.removeEventListener("touchmove",e),document.removeEventListener("touchend",n)}}),[])}(G,(function(t,e){function n(t,e){t((function(t){return Ot(t+e)}))}return!(St>=Et)&&(Q?n(tt,t):n(ot,e),At(),zt(),!0)})),(0,l.useEffect)((function(){return At(),jt&&(Bt.current=window.setTimeout((function(){Ht(0)}),100)),At}),[jt]);var Gt=function(t,e,n,a,o,c,r){var i,d,s,u=r.tabs,p=r.tabPosition,v=r.rtl;return["top","bottom"].includes(p)?(i="width",d=v?"right":"left",s=Math.abs(n)):(i="height",d="top",s=-n),(0,l.useMemo)((function(){if(!u.length)return[0,0];for(var n=u.length,a=n,o=0;o<n;o+=1){var c=t.get(u[o].key)||D;if(c[d]+c[i]>s+e){a=o-1;break}}for(var r=0,l=n-1;l>=0;l-=1)if((t.get(u[l].key)||D)[d]<s){r=l+1;break}return[r,a]}),[t,e,a,o,c,s,p,u.map((function(t){return t.key})).join("_"),v])}(Ct,Tt,Q?$:at,Et,Rt,Pt,(0,i.Z)((0,i.Z)({},t),{},{tabs:c})),Wt=(0,h.Z)(Gt,2),Xt=Wt[0],Kt=Wt[1],qt=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,e=Ct.get(t)||{width:0,height:0,left:0,right:0,top:0};if(Q){var n=$;v?e.right<$?n=e.right:e.right+e.width>$+Tt&&(n=e.right+e.width-Tt):e.left<-$?n=-e.left:e.left+e.width>-$+Tt&&(n=-(e.left+e.width-Tt)),ot(0),tt(Ot(n))}else{var a=at;e.top<-at?a=-e.top:e.top+e.height>-at+Tt&&(a=-(e.top+e.height-Tt)),tt(0),ot(Ot(a))}},Vt={};"top"===x||"bottom"===x?Vt[v?"marginRight":"marginLeft"]=y:Vt.marginTop=y;var Yt=c.map((function(t,e){var n=t.key;return l.createElement(q,{id:s,prefixCls:o,key:n,tab:t,style:0===e?void 0:Vt,closable:t.closable,editable:Z,active:n===p,renderWrapper:_,removeAriaLabel:null===k||void 0===k?void 0:k.removeAriaLabel,onClick:function(t){C(n,t)},onFocus:function(){qt(n),zt(),G.current&&(v||(G.current.scrollLeft=0),G.current.scrollTop=0)}})})),Ft=function(){return _t((function(){var t=new Map;return c.forEach((function(e){var n=e.key,a=W.current.querySelector('[data-node-key="'.concat(n,'"]'));a&&t.set(n,{width:a.offsetWidth,height:a.offsetHeight,left:a.offsetLeft,top:a.offsetTop})})),t}))};(0,l.useEffect)((function(){Ft()}),[c.map((function(t){return t.key})).join("_")]);var Qt=I((function(){var t=V(E),e=V(j),n=V(A);lt([t[0]-e[0]-n[0],t[1]-e[1]-n[1]]);var a=V(F);mt(a);var o=V(X);kt(o);var c=V(W);pt([c[0]-a[0],c[1]-a[1]]),Ft()})),Jt=c.slice(0,Xt),Ut=c.slice(Kt+1),$t=[].concat((0,R.Z)(Jt),(0,R.Z)(Ut)),te=(0,l.useState)(),ee=(0,h.Z)(te,2),ne=ee[0],ae=ee[1],oe=Ct.get(p),ce=(0,l.useRef)();function re(){T.Z.cancel(ce.current)}(0,l.useEffect)((function(){var t={};return oe&&(Q?(v?t.right=oe.right:t.left=oe.left,t.width=oe.width):(t.top=oe.top,t.height=oe.height)),re(),ce.current=(0,T.Z)((function(){ae(t)})),re}),[oe,Q,v]),(0,l.useEffect)((function(){qt()}),[p,M(oe),M(Ct),Q]),(0,l.useEffect)((function(){Qt()}),[v]);var ie,le,de,se,ue=!!$t.length,pe="".concat(o,"-nav-wrap");return Q?v?(le=$>0,ie=$+St<Et):(ie=$<0,le=-$+St<Et):(de=at<0,se=-at+St<Et),l.createElement(P.Z,{onResize:Qt},l.createElement("div",{ref:(0,N.x1)(e,E),role:"tablist",className:f()("".concat(o,"-nav"),r),style:d,onKeyDown:function(){zt()}},l.createElement(z,{ref:j,position:"left",extra:g,prefixCls:o}),l.createElement("div",{className:f()(pe,(n={},(0,m.Z)(n,"".concat(pe,"-ping-left"),ie),(0,m.Z)(n,"".concat(pe,"-ping-right"),le),(0,m.Z)(n,"".concat(pe,"-ping-top"),de),(0,m.Z)(n,"".concat(pe,"-ping-bottom"),se),n)),ref:G},l.createElement(P.Z,{onResize:Qt},l.createElement("div",{ref:W,className:"".concat(o,"-nav-list"),style:{transform:"translate(".concat($,"px, ").concat(at,"px)"),transition:jt?"none":void 0}},Yt,l.createElement(H,{ref:F,prefixCls:o,locale:k,editable:Z,style:(0,i.Z)((0,i.Z)({},0===Yt.length?void 0:Vt),{},{visibility:ue?"hidden":null})}),l.createElement("div",{className:f()("".concat(o,"-ink-bar"),(0,m.Z)({},"".concat(o,"-ink-bar-animated"),u.inkBar)),style:ne})))),l.createElement(K,(0,b.Z)({},t,{removeAriaLabel:null===k||void 0===k?void 0:k.removeAriaLabel,ref:X,prefixCls:o,tabs:$t,className:!ue&&Nt,tabMoving:!!jt})),l.createElement(z,{ref:A,position:"right",extra:g,prefixCls:o})))}var Q=l.forwardRef(F),J=["renderTabBar"],U=["label","key"];function $(t){var e=t.renderTabBar,n=(0,Z.Z)(t,J),a=l.useContext(w).tabs;return e?e((0,i.Z)((0,i.Z)({},n),{},{panes:a.map((function(t){var e=t.label,n=t.key,a=(0,Z.Z)(t,U);return l.createElement(C,(0,b.Z)({tab:e,key:n,tabKey:n},a))}))}),Q):l.createElement(Q,n)}n(60632);var tt=["id","prefixCls","className","items","direction","activeKey","defaultActiveKey","editable","animated","tabPosition","tabBarGutter","tabBarStyle","tabBarExtraContent","locale","moreIcon","moreTransitionName","destroyInactiveTabPane","renderTabBar","onChange","onTabClick","onTabScroll","getPopupContainer","popupClassName"],et=0;function nt(t,e){var n,a=t.id,o=t.prefixCls,c=void 0===o?"rc-tabs":o,r=t.className,d=t.items,s=t.direction,u=t.activeKey,p=t.defaultActiveKey,v=t.editable,y=t.animated,_=t.tabPosition,C=void 0===_?"top":_,S=t.tabBarGutter,R=t.tabBarStyle,P=t.tabBarExtraContent,T=t.locale,N=t.moreIcon,L=t.moreTransitionName,I=t.destroyInactiveTabPane,O=t.renderTabBar,B=t.onChange,D=t.onTabClick,M=t.onTabScroll,j=t.getPopupContainer,H=t.popupClassName,z=(0,Z.Z)(t,tt),A=l.useMemo((function(){return(d||[]).filter((function(t){return t&&"object"===(0,g.Z)(t)&&"key"in t}))}),[d]),G="rtl"===s,W=function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{inkBar:!0,tabPane:!1};return(t=!1===e?{inkBar:!1,tabPane:!1}:!0===e?{inkBar:!0,tabPane:!1}:(0,i.Z)({inkBar:!0},"object"===(0,g.Z)(e)?e:{})).tabPaneMotion&&void 0===t.tabPane&&(t.tabPane=!0),!t.tabPaneMotion&&t.tabPane&&(t.tabPane=!1),t}(y),X=(0,l.useState)(!1),K=(0,h.Z)(X,2),q=K[0],V=K[1];(0,l.useEffect)((function(){V((0,k.Z)())}),[]);var Y=(0,x.Z)((function(){var t;return null===(t=A[0])||void 0===t?void 0:t.key}),{value:u,defaultValue:p}),F=(0,h.Z)(Y,2),Q=F[0],J=F[1],U=(0,l.useState)((function(){return A.findIndex((function(t){return t.key===Q}))})),nt=(0,h.Z)(U,2),at=nt[0],ot=nt[1];(0,l.useEffect)((function(){var t,e=A.findIndex((function(t){return t.key===Q}));-1===e&&(e=Math.max(0,Math.min(at,A.length-1)),J(null===(t=A[e])||void 0===t?void 0:t.key));ot(e)}),[A.map((function(t){return t.key})).join("_"),Q,at]);var ct=(0,x.Z)(null,{value:a}),rt=(0,h.Z)(ct,2),it=rt[0],lt=rt[1];(0,l.useEffect)((function(){a||(lt("rc-tabs-".concat(et)),et+=1)}),[]);var dt={id:it,activeKey:Q,animated:W,tabPosition:C,rtl:G,mobile:q},st=(0,i.Z)((0,i.Z)({},dt),{},{editable:v,locale:T,moreIcon:N,moreTransitionName:L,tabBarGutter:S,onTabClick:function(t,e){null===D||void 0===D||D(t,e);var n=t!==Q;J(t),n&&(null===B||void 0===B||B(t))},onTabScroll:M,extra:P,style:R,panes:null,getPopupContainer:j,popupClassName:H});return l.createElement(w.Provider,{value:{tabs:A,prefixCls:c}},l.createElement("div",(0,b.Z)({ref:e,id:a,className:f()(c,"".concat(c,"-").concat(C),(n={},(0,m.Z)(n,"".concat(c,"-mobile"),q),(0,m.Z)(n,"".concat(c,"-editable"),v),(0,m.Z)(n,"".concat(c,"-rtl"),G),n),r)},z),undefined,l.createElement($,(0,b.Z)({},st,{renderTabBar:O})),l.createElement(E,(0,b.Z)({destroyInactiveTabPane:I},dt,{animated:W}))))}var at=l.forwardRef(nt),ot=n(71929),ct=n(1815),rt=n(29464),it={motionAppear:!1,motionEnter:!0,motionLeave:!0};var lt=n(85501),dt=function(t,e){var n={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.indexOf(a)<0&&(n[a]=t[a]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(t);o<a.length;o++)e.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(t,a[o])&&(n[a[o]]=t[a[o]])}return n};var st=function(){return null},ut=n(55564),pt=n(89922),vt=n(67521),ft=n(25541),bt=function(t){var e=t.componentCls,n=t.motionDurationSlow;return[(0,a.Z)({},e,(0,a.Z)({},"".concat(e,"-switch"),{"&-appear, &-enter":{transition:"none","&-start":{opacity:0},"&-active":{opacity:1,transition:"opacity ".concat(n)}},"&-leave":{position:"absolute",transition:"none",inset:0,"&-start":{opacity:1},"&-active":{opacity:0,transition:"opacity ".concat(n)}}})),[(0,ft.oN)(t,"slide-up"),(0,ft.oN)(t,"slide-down")]]},mt=function(t){var e,n,o,c,r,i,l=t.componentCls,d=t.tabsCardHorizontalPadding,s=t.tabsCardHeadBackground,u=t.tabsCardGutter,p=t.colorSplit;return(0,a.Z)({},"".concat(l,"-card"),(i={},(0,a.Z)(i,"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(e={},(0,a.Z)(e,"".concat(l,"-tab"),{margin:0,padding:d,background:s,border:"".concat(t.lineWidth,"px ").concat(t.lineType," ").concat(p),transition:"all ".concat(t.motionDurationSlow," ").concat(t.motionEaseInOut)}),(0,a.Z)(e,"".concat(l,"-tab-active"),{color:t.colorPrimary,background:t.colorBgContainer}),(0,a.Z)(e,"".concat(l,"-ink-bar"),{visibility:"hidden"}),e)),(0,a.Z)(i,"&".concat(l,"-top, &").concat(l,"-bottom"),(0,a.Z)({},"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(0,a.Z)({},"".concat(l,"-tab + ").concat(l,"-tab"),{marginLeft:{_skip_check_:!0,value:"".concat(u,"px")}}))),(0,a.Z)(i,"&".concat(l,"-top"),(0,a.Z)({},"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(n={},(0,a.Z)(n,"".concat(l,"-tab"),{borderRadius:"".concat(t.borderRadiusLG,"px ").concat(t.borderRadiusLG,"px 0 0")}),(0,a.Z)(n,"".concat(l,"-tab-active"),{borderBottomColor:t.colorBgContainer}),n))),(0,a.Z)(i,"&".concat(l,"-bottom"),(0,a.Z)({},"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(o={},(0,a.Z)(o,"".concat(l,"-tab"),{borderRadius:"0 0 ".concat(t.borderRadiusLG,"px ").concat(t.borderRadiusLG,"px")}),(0,a.Z)(o,"".concat(l,"-tab-active"),{borderTopColor:t.colorBgContainer}),o))),(0,a.Z)(i,"&".concat(l,"-left, &").concat(l,"-right"),(0,a.Z)({},"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(0,a.Z)({},"".concat(l,"-tab + ").concat(l,"-tab"),{marginTop:"".concat(u,"px")}))),(0,a.Z)(i,"&".concat(l,"-left"),(0,a.Z)({},"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(c={},(0,a.Z)(c,"".concat(l,"-tab"),{borderRadius:{_skip_check_:!0,value:"".concat(t.borderRadiusLG,"px 0 0 ").concat(t.borderRadiusLG,"px")}}),(0,a.Z)(c,"".concat(l,"-tab-active"),{borderRightColor:{_skip_check_:!0,value:t.colorBgContainer}}),c))),(0,a.Z)(i,"&".concat(l,"-right"),(0,a.Z)({},"> ".concat(l,"-nav, > div > ").concat(l,"-nav"),(r={},(0,a.Z)(r,"".concat(l,"-tab"),{borderRadius:{_skip_check_:!0,value:"0 ".concat(t.borderRadiusLG,"px ").concat(t.borderRadiusLG,"px 0")}}),(0,a.Z)(r,"".concat(l,"-tab-active"),{borderLeftColor:{_skip_check_:!0,value:t.colorBgContainer}}),r))),i))},ht=function(t){var e=t.componentCls,n=t.tabsHoverColor,o=t.dropdownEdgeChildVerticalPadding;return(0,a.Z)({},"".concat(e,"-dropdown"),Object.assign(Object.assign({},(0,vt.Wf)(t)),(0,a.Z)({position:"absolute",top:-9999,left:{_skip_check_:!0,value:-9999},zIndex:t.zIndexPopup,display:"block","&-hidden":{display:"none"}},"".concat(e,"-dropdown-menu"),{maxHeight:t.tabsDropdownHeight,margin:0,padding:"".concat(o,"px 0"),overflowX:"hidden",overflowY:"auto",textAlign:{_skip_check_:!0,value:"left"},listStyleType:"none",backgroundColor:t.colorBgContainer,backgroundClip:"padding-box",borderRadius:t.borderRadiusLG,outline:"none",boxShadow:t.boxShadow,"&-item":Object.assign(Object.assign({},vt.vS),{display:"flex",alignItems:"center",minWidth:t.tabsDropdownWidth,margin:0,padding:"".concat(t.paddingXXS,"px ").concat(t.paddingSM,"px"),color:t.colorText,fontWeight:"normal",fontSize:t.fontSize,lineHeight:t.lineHeight,cursor:"pointer",transition:"all ".concat(t.motionDurationSlow),"> span":{flex:1,whiteSpace:"nowrap"},"&-remove":{flex:"none",marginLeft:{_skip_check_:!0,value:t.marginSM},color:t.colorTextDescription,fontSize:t.fontSizeSM,background:"transparent",border:0,cursor:"pointer","&:hover":{color:n}},"&:hover":{background:t.controlItemBgHover},"&-disabled":{"&, &:hover":{color:t.colorTextDisabled,background:"transparent",cursor:"not-allowed"}}})})))},gt=function(t){var e,n,o,c,r,i,l,d,s=t.componentCls,u=t.margin,p=t.colorSplit;return d={},(0,a.Z)(d,"".concat(s,"-top, ").concat(s,"-bottom"),(0,a.Z)({flexDirection:"column"},"> ".concat(s,"-nav, > div > ").concat(s,"-nav"),(n={margin:"0 0 ".concat(u,"px 0"),"&::before":{position:"absolute",right:{_skip_check_:!0,value:0},left:{_skip_check_:!0,value:0},borderBottom:"".concat(t.lineWidth,"px ").concat(t.lineType," ").concat(p),content:"''"}},(0,a.Z)(n,"".concat(s,"-ink-bar"),{height:t.lineWidthBold,"&-animated":{transition:"width ".concat(t.motionDurationSlow,", left ").concat(t.motionDurationSlow,",\n            right ").concat(t.motionDurationSlow)}}),(0,a.Z)(n,"".concat(s,"-nav-wrap"),(e={"&::before, &::after":{top:0,bottom:0,width:t.controlHeight},"&::before":{left:{_skip_check_:!0,value:0},boxShadow:t.boxShadowTabsOverflowLeft},"&::after":{right:{_skip_check_:!0,value:0},boxShadow:t.boxShadowTabsOverflowRight}},(0,a.Z)(e,"&".concat(s,"-nav-wrap-ping-left::before"),{opacity:1}),(0,a.Z)(e,"&".concat(s,"-nav-wrap-ping-right::after"),{opacity:1}),e)),n))),(0,a.Z)(d,"".concat(s,"-top"),(0,a.Z)({},"> ".concat(s,"-nav,\n        > div > ").concat(s,"-nav"),(0,a.Z)({"&::before":{bottom:0}},"".concat(s,"-ink-bar"),{bottom:0}))),(0,a.Z)(d,"".concat(s,"-bottom"),(o={},(0,a.Z)(o,"> ".concat(s,"-nav, > div > ").concat(s,"-nav"),(0,a.Z)({order:1,marginTop:"".concat(u,"px"),marginBottom:0,"&::before":{top:0}},"".concat(s,"-ink-bar"),{top:0})),(0,a.Z)(o,"> ".concat(s,"-content-holder, > div > ").concat(s,"-content-holder"),{order:0}),o)),(0,a.Z)(d,"".concat(s,"-left, ").concat(s,"-right"),(0,a.Z)({},"> ".concat(s,"-nav, > div > ").concat(s,"-nav"),(r={flexDirection:"column",minWidth:1.25*t.controlHeight},(0,a.Z)(r,"".concat(s,"-tab"),{padding:"".concat(t.paddingXS,"px ").concat(t.paddingLG,"px"),textAlign:"center"}),(0,a.Z)(r,"".concat(s,"-tab + ").concat(s,"-tab"),{margin:"".concat(t.margin,"px 0 0 0")}),(0,a.Z)(r,"".concat(s,"-nav-wrap"),(c={flexDirection:"column","&::before, &::after":{right:{_skip_check_:!0,value:0},left:{_skip_check_:!0,value:0},height:t.controlHeight},"&::before":{top:0,boxShadow:t.boxShadowTabsOverflowTop},"&::after":{bottom:0,boxShadow:t.boxShadowTabsOverflowBottom}},(0,a.Z)(c,"&".concat(s,"-nav-wrap-ping-top::before"),{opacity:1}),(0,a.Z)(c,"&".concat(s,"-nav-wrap-ping-bottom::after"),{opacity:1}),c)),(0,a.Z)(r,"".concat(s,"-ink-bar"),{width:t.lineWidthBold,"&-animated":{transition:"height ".concat(t.motionDurationSlow,", top ").concat(t.motionDurationSlow)}}),(0,a.Z)(r,"".concat(s,"-nav-list, ").concat(s,"-nav-operations"),{flex:"1 0 auto",flexDirection:"column"}),r))),(0,a.Z)(d,"".concat(s,"-left"),(i={},(0,a.Z)(i,"> ".concat(s,"-nav, > div > ").concat(s,"-nav"),(0,a.Z)({},"".concat(s,"-ink-bar"),{right:{_skip_check_:!0,value:0}})),(0,a.Z)(i,"> ".concat(s,"-content-holder, > div > ").concat(s,"-content-holder"),(0,a.Z)({marginLeft:{_skip_check_:!0,value:"-".concat(t.lineWidth,"px")},borderLeft:{_skip_check_:!0,value:"".concat(t.lineWidth,"px ").concat(t.lineType," ").concat(t.colorBorder)}},"> ".concat(s,"-content > ").concat(s,"-tabpane"),{paddingLeft:{_skip_check_:!0,value:t.paddingLG}})),i)),(0,a.Z)(d,"".concat(s,"-right"),(l={},(0,a.Z)(l,"> ".concat(s,"-nav, > div > ").concat(s,"-nav"),(0,a.Z)({order:1},"".concat(s,"-ink-bar"),{left:{_skip_check_:!0,value:0}})),(0,a.Z)(l,"> ".concat(s,"-content-holder, > div > ").concat(s,"-content-holder"),(0,a.Z)({order:0,marginRight:{_skip_check_:!0,value:-t.lineWidth},borderRight:{_skip_check_:!0,value:"".concat(t.lineWidth,"px ").concat(t.lineType," ").concat(t.colorBorder)}},"> ".concat(s,"-content > ").concat(s,"-tabpane"),{paddingRight:{_skip_check_:!0,value:t.paddingLG}})),l)),d},Zt=function(t){var e,n,o,c=t.componentCls,r=t.padding;return o={},(0,a.Z)(o,c,{"&-small":(0,a.Z)({},"> ".concat(c,"-nav"),(0,a.Z)({},"".concat(c,"-tab"),{padding:"".concat(t.paddingXS,"px 0"),fontSize:t.fontSize})),"&-large":(0,a.Z)({},"> ".concat(c,"-nav"),(0,a.Z)({},"".concat(c,"-tab"),{padding:"".concat(r,"px 0"),fontSize:t.fontSizeLG}))}),(0,a.Z)(o,"".concat(c,"-card"),(n={},(0,a.Z)(n,"&".concat(c,"-small"),(e={},(0,a.Z)(e,"> ".concat(c,"-nav"),(0,a.Z)({},"".concat(c,"-tab"),{padding:"".concat(1.5*t.paddingXXS,"px ").concat(r,"px")})),(0,a.Z)(e,"&".concat(c,"-bottom"),(0,a.Z)({},"> ".concat(c,"-nav ").concat(c,"-tab"),{borderRadius:"0 0 ".concat(t.borderRadius,"px ").concat(t.borderRadius,"px")})),(0,a.Z)(e,"&".concat(c,"-top"),(0,a.Z)({},"> ".concat(c,"-nav ").concat(c,"-tab"),{borderRadius:"".concat(t.borderRadius,"px ").concat(t.borderRadius,"px 0 0")})),(0,a.Z)(e,"&".concat(c,"-right"),(0,a.Z)({},"> ".concat(c,"-nav ").concat(c,"-tab"),{borderRadius:{_skip_check_:!0,value:"0 ".concat(t.borderRadius,"px ").concat(t.borderRadius,"px 0")}})),(0,a.Z)(e,"&".concat(c,"-left"),(0,a.Z)({},"> ".concat(c,"-nav ").concat(c,"-tab"),{borderRadius:{_skip_check_:!0,value:"".concat(t.borderRadius,"px 0 0 ").concat(t.borderRadius,"px")}})),e)),(0,a.Z)(n,"&".concat(c,"-large"),(0,a.Z)({},"> ".concat(c,"-nav"),(0,a.Z)({},"".concat(c,"-tab"),{padding:"".concat(t.paddingXS,"px ").concat(r,"px ").concat(1.5*t.paddingXXS,"px")}))),n)),o},kt=function(t){var e,n,o,c,r,i=t.componentCls,l=t.tabsHorizontalGutter,d=t.iconCls,s=t.tabsCardGutter,u="".concat(i,"-rtl");return r={},(0,a.Z)(r,u,(c={direction:"rtl"},(0,a.Z)(c,"".concat(i,"-nav"),(0,a.Z)({},"".concat(i,"-tab"),(e={margin:{_skip_check_:!0,value:"0 0 0 ".concat(l,"px")}},(0,a.Z)(e,"".concat(i,"-tab:last-of-type"),{marginLeft:{_skip_check_:!0,value:0}}),(0,a.Z)(e,d,{marginRight:{_skip_check_:!0,value:0},marginLeft:{_skip_check_:!0,value:"".concat(t.marginSM,"px")}}),(0,a.Z)(e,"".concat(i,"-tab-remove"),(0,a.Z)({marginRight:{_skip_check_:!0,value:"".concat(t.marginXS,"px")},marginLeft:{_skip_check_:!0,value:"-".concat(t.marginXXS,"px")}},d,{margin:0})),e))),(0,a.Z)(c,"&".concat(i,"-left"),(n={},(0,a.Z)(n,"> ".concat(i,"-nav"),{order:1}),(0,a.Z)(n,"> ".concat(i,"-content-holder"),{order:0}),n)),(0,a.Z)(c,"&".concat(i,"-right"),(o={},(0,a.Z)(o,"> ".concat(i,"-nav"),{order:0}),(0,a.Z)(o,"> ".concat(i,"-content-holder"),{order:1}),o)),(0,a.Z)(c,"&".concat(i,"-card").concat(i,"-top, &").concat(i,"-card").concat(i,"-bottom"),(0,a.Z)({},"> ".concat(i,"-nav, > div > ").concat(i,"-nav"),(0,a.Z)({},"".concat(i,"-tab + ").concat(i,"-tab"),{marginRight:{_skip_check_:!0,value:"".concat(s,"px")},marginLeft:{_skip_check_:!0,value:0}}))),c)),(0,a.Z)(r,"".concat(i,"-dropdown-rtl"),{direction:"rtl"}),(0,a.Z)(r,"".concat(i,"-menu-item"),(0,a.Z)({},"".concat(i,"-dropdown-rtl"),{textAlign:{_skip_check_:!0,value:"right"}})),r},xt=function(t){var e,n,o,c,r=t.componentCls,i=t.tabsCardHorizontalPadding,l=t.tabsCardHeight,d=t.tabsCardGutter,s=t.tabsHoverColor,u=t.tabsActiveColor,p=t.colorSplit;return c={},(0,a.Z)(c,r,Object.assign(Object.assign(Object.assign(Object.assign({},(0,vt.Wf)(t)),(n={display:"flex"},(0,a.Z)(n,"> ".concat(r,"-nav, > div > ").concat(r,"-nav"),(e={position:"relative",display:"flex",flex:"none",alignItems:"center"},(0,a.Z)(e,"".concat(r,"-nav-wrap"),{position:"relative",display:"flex",flex:"auto",alignSelf:"stretch",overflow:"hidden",whiteSpace:"nowrap",transform:"translate(0)","&::before, &::after":{position:"absolute",zIndex:1,opacity:0,transition:"opacity ".concat(t.motionDurationSlow),content:"''",pointerEvents:"none"}}),(0,a.Z)(e,"".concat(r,"-nav-list"),{position:"relative",display:"flex",transition:"opacity ".concat(t.motionDurationSlow)}),(0,a.Z)(e,"".concat(r,"-nav-operations"),{display:"flex",alignSelf:"stretch"}),(0,a.Z)(e,"".concat(r,"-nav-operations-hidden"),{position:"absolute",visibility:"hidden",pointerEvents:"none"}),(0,a.Z)(e,"".concat(r,"-nav-more"),{position:"relative",padding:i,background:"transparent",border:0,"&::after":{position:"absolute",right:{_skip_check_:!0,value:0},bottom:0,left:{_skip_check_:!0,value:0},height:t.controlHeightLG/8,transform:"translateY(100%)",content:"''"}}),(0,a.Z)(e,"".concat(r,"-nav-add"),Object.assign({minWidth:"".concat(l,"px"),marginLeft:{_skip_check_:!0,value:"".concat(d,"px")},padding:"0 ".concat(t.paddingXS,"px"),background:"transparent",border:"".concat(t.lineWidth,"px ").concat(t.lineType," ").concat(p),borderRadius:"".concat(t.borderRadiusLG,"px ").concat(t.borderRadiusLG,"px 0 0"),outline:"none",cursor:"pointer",color:t.colorText,transition:"all ".concat(t.motionDurationSlow," ").concat(t.motionEaseInOut),"&:hover":{color:s},"&:active, &:focus:not(:focus-visible)":{color:u}},(0,vt.Qy)(t))),e)),(0,a.Z)(n,"".concat(r,"-extra-content"),{flex:"none"}),(0,a.Z)(n,"".concat(r,"-ink-bar"),{position:"absolute",background:t.colorPrimary,pointerEvents:"none"}),n)),function(t){var e,n,o=t.componentCls,c=t.tabsActiveColor,r=t.tabsHoverColor,i=t.iconCls,l=t.tabsHorizontalGutter,d="".concat(o,"-tab");return n={},(0,a.Z)(n,d,(e={position:"relative",display:"inline-flex",alignItems:"center",padding:"".concat(t.paddingSM,"px 0"),fontSize:"".concat(t.fontSize,"px"),background:"transparent",border:0,outline:"none",cursor:"pointer","&-btn, &-remove":Object.assign({"&:focus:not(:focus-visible), &:active":{color:c}},(0,vt.Qy)(t)),"&-btn":{outline:"none",transition:"all 0.3s"},"&-remove":{flex:"none",marginRight:{_skip_check_:!0,value:-t.marginXXS},marginLeft:{_skip_check_:!0,value:t.marginXS},color:t.colorTextDescription,fontSize:t.fontSizeSM,background:"transparent",border:"none",outline:"none",cursor:"pointer",transition:"all ".concat(t.motionDurationSlow),"&:hover":{color:t.colorTextHeading}},"&:hover":{color:r}},(0,a.Z)(e,"&".concat(d,"-active ").concat(d,"-btn"),{color:t.colorPrimary,textShadow:t.tabsActiveTextShadow}),(0,a.Z)(e,"&".concat(d,"-disabled"),{color:t.colorTextDisabled,cursor:"not-allowed"}),(0,a.Z)(e,"&".concat(d,"-disabled ").concat(d,"-btn, &").concat(d,"-disabled ").concat(o,"-remove"),{"&:focus, &:active":{color:t.colorTextDisabled}}),(0,a.Z)(e,"& ".concat(d,"-remove ").concat(i),{margin:0}),(0,a.Z)(e,i,{marginRight:{_skip_check_:!0,value:t.marginSM}}),e)),(0,a.Z)(n,"".concat(d," + ").concat(d),{margin:{_skip_check_:!0,value:"0 0 0 ".concat(l,"px")}}),n}(t)),(o={},(0,a.Z)(o,"".concat(r,"-content"),{position:"relative",width:"100%"}),(0,a.Z)(o,"".concat(r,"-content-holder"),{flex:"auto",minWidth:0,minHeight:0}),(0,a.Z)(o,"".concat(r,"-tabpane"),{outline:"none","&-hidden":{display:"none"}}),o))),(0,a.Z)(c,"".concat(r,"-centered"),(0,a.Z)({},"> ".concat(r,"-nav, > div > ").concat(r,"-nav"),(0,a.Z)({},"".concat(r,"-nav-wrap"),(0,a.Z)({},"&:not([class*='".concat(r,"-nav-wrap-ping'])"),{justifyContent:"center"})))),c},yt=(0,ut.Z)("Tabs",(function(t){var e=t.controlHeightLG,n=(0,pt.TS)(t,{tabsHoverColor:t.colorPrimaryHover,tabsActiveColor:t.colorPrimaryActive,tabsCardHorizontalPadding:"".concat((e-Math.round(t.fontSize*t.lineHeight))/2-t.lineWidth,"px ").concat(t.padding,"px"),tabsCardHeight:e,tabsCardGutter:t.marginXXS/2,tabsHorizontalGutter:32,tabsCardHeadBackground:t.colorFillAlter,dropdownEdgeChildVerticalPadding:t.paddingXXS,tabsActiveTextShadow:"0 0 0.25px currentcolor",tabsDropdownHeight:200,tabsDropdownWidth:120});return[Zt(n),kt(n),gt(n),ht(n),mt(n),xt(n),bt(n)]}),(function(t){return{zIndexPopup:t.zIndexPopupBase+50}})),wt=function(t,e){var n={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.indexOf(a)<0&&(n[a]=t[a]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(t);o<a.length;o++)e.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(t,a[o])&&(n[a[o]]=t[a[o]])}return n};function _t(t){var e,n=t.type,i=t.className,d=t.size,s=t.onEdit,u=t.hideAdd,v=t.centered,b=t.addIcon,m=t.popupClassName,h=t.children,g=t.items,Z=t.animated,k=wt(t,["type","className","size","onEdit","hideAdd","centered","addIcon","popupClassName","children","items","animated"]),x=k.prefixCls,y=k.moreIcon,w=void 0===y?l.createElement(r.Z,null):y,_=l.useContext(ot.E_),C=_.getPrefixCls,S=_.direction,E=_.getPopupContainer,R=C("tabs",x),P=yt(R),T=(0,o.Z)(P,2),N=T[0],L=T[1];"editable-card"===n&&(e={onEdit:function(t,e){var n=e.key,a=e.event;null===s||void 0===s||s("add"===t?a:n,t)},removeIcon:l.createElement(c.Z,null),addIcon:b||l.createElement(p,null),showAdd:!0!==u});var I=C(),O=function(t,e){return t||function(t){return t.filter((function(t){return t}))}((0,lt.Z)(e).map((function(t){if(l.isValidElement(t)){var e=t.key,n=t.props||{},a=n.tab,o=dt(n,["tab"]);return Object.assign(Object.assign({key:String(e)},o),{label:a})}return null})))}(g,h),B=function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{inkBar:!0,tabPane:!1};return(e=!1===n?{inkBar:!1,tabPane:!1}:!0===n?{inkBar:!0,tabPane:!0}:Object.assign({inkBar:!0},"object"===typeof n?n:{})).tabPane&&(e.tabPaneMotion=Object.assign(Object.assign({},it),{motionName:(0,rt.mL)(t,"switch")})),e}(R,Z);return N(l.createElement(ct.Z.Consumer,null,(function(t){var o,c=void 0!==d?d:t;return l.createElement(at,Object.assign({direction:S,getPopupContainer:E,moreTransitionName:"".concat(I,"-slide-up")},k,{items:O,className:f()((o={},(0,a.Z)(o,"".concat(R,"-").concat(c),c),(0,a.Z)(o,"".concat(R,"-card"),["card","editable-card"].includes(n)),(0,a.Z)(o,"".concat(R,"-editable-card"),"editable-card"===n),(0,a.Z)(o,"".concat(R,"-centered"),v),o),i,L),popupClassName:f()(m,L),editable:e,moreIcon:w,prefixCls:R,animated:B}))})))}_t.TabPane=st;var Ct=_t}}]);
//# sourceMappingURL=3733.77960ba9.chunk.js.map