"use strict";(self.webpackChunktardedivertida=self.webpackChunktardedivertida||[]).push([[3029],{15907:function(e,t,n){n.r(t);var i=n(18489),s=n(33032),r=n(50678),a=n(84322),l=n.n(a),u=(n(76738),n(49189)),o=n(66818),d=n(39070),c=n(71046),v=n(61855),h=n(2556),Z=n(49631),f=n(763),p=n(72791),m=n(93713),g=n(4893),y=n(78556),x=n(66509),b=n(53673),j=n(51273),k=n(80184),w={id:"",names:[],avatars:{},preferredLanguage:"en",games:{},gender:"unknown",ratings:{},blurredImages:{},daily:{}};t.default=function(){var e,t,n,a,O,S,C;(0,x.Z)("Users - Tarde Divertida");var N=u.Z.useApp(),M=N.message,E=N.notification,T=(0,m.NL)(),L=(0,p.useState)(w),P=(0,r.Z)(L,2),U=P[0],D=P[1],W=(0,p.useState)(w),K=(0,r.Z)(W,2),A=K[0],R=K[1],J=(0,g.a)({queryKey:["users"],queryFn:function(){var e=(0,s.Z)(l().mark((function e(){var t,n;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,Z.PL)((0,Z.IO)((0,Z.hJ)(j.RZ,"users"),(0,Z.ar)("isGuest","!=",!0)));case 2:return t=e.sent,n=[],t.forEach((function(e){return n.push(e.data())})),e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}),q=(0,y.D)({mutationKey:["users"],mutationFn:function(){var e=(0,s.Z)(l().mark((function e(t){return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:b.Js.run((0,i.Z)({action:b.s0.UPDATE_USER_DB},t));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),onSuccess:function(){M.success("User updated"),T.invalidateQueries({queryKey:["users"]})},onError:function(e){E.error({message:"Error",description:e.message})}}),I=null!==(e=J.data)&&void 0!==e?e:[],V=I.map((function(e){var t;return(0,k.jsxs)(o.Z.Option,{value:e.id,children:[(0,k.jsx)("strong",{children:null===e||void 0===e||null===(t=e.names)||void 0===t?void 0:t[0]}),": ",e.id]},e.id)})),F=(0,k.jsx)(o.Z,{onChange:function(e){var t;D(null!==(t=I.find((function(t){return t.id===e})))&&void 0!==t?t:w)},style:{minWidth:300},children:V}),Y=(0,k.jsx)(o.Z,{onChange:function(e){var t;R(null!==(t=I.find((function(t){return t.id===e})))&&void 0!==t?t:w)},style:{minWidth:300},children:V}),_=(0,p.useMemo)((function(){return(0,f.merge)((0,f.cloneDeep)(null!==U&&void 0!==U?U:{}),(0,f.cloneDeep)(null!==A&&void 0!==A?A:{}))}),[U,A]);return console.log(I),(0,k.jsxs)("div",{children:[(0,k.jsx)(d.Z.Title,{children:"Users"}),J.isLoading&&(0,k.jsx)(d.Z.Paragraph,{children:"Loading..."}),(0,k.jsxs)(c.Z,{className:"margin",style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)"},children:[(0,k.jsxs)(c.Z,{direction:"vertical",children:[(0,k.jsx)(d.Z.Title,{level:2,children:"Origin"}),(0,k.jsx)(c.Z,{className:"margin",children:F}),(0,k.jsx)(d.Z.Paragraph,{children:null!==(t=null===U||void 0===U||null===(n=U.names)||void 0===n?void 0:n.join(", "))&&void 0!==t?t:"No user selected"}),(0,k.jsx)(v.Z.TextArea,{value:JSON.stringify(null!==U&&void 0!==U?U:{},null,2),rows:20,cols:50,className:"margin"})]}),(0,k.jsxs)(c.Z,{direction:"vertical",children:[(0,k.jsx)(d.Z.Title,{level:2,children:"Destination"}),(0,k.jsx)(c.Z,{className:"margin",children:Y}),(0,k.jsx)(d.Z.Paragraph,{children:null!==(a=null===A||void 0===A||null===(O=A.names)||void 0===O?void 0:O.join(", "))&&void 0!==a?a:"No user selected"}),(0,k.jsx)(v.Z.TextArea,{value:JSON.stringify(null!==A&&void 0!==A?A:{},null,2),rows:20,cols:50,className:"margin"})]})]}),(0,k.jsxs)(c.Z,{direction:"vertical",children:[(0,k.jsx)(d.Z.Title,{level:2,children:"Merge"}),(0,k.jsx)(d.Z.Paragraph,{children:null!==(S=null===_||void 0===_||null===(C=_.names)||void 0===C?void 0:C.join(", "))&&void 0!==S?S:"No user selected"}),(0,k.jsx)(v.Z.TextArea,{value:JSON.stringify(null!==_&&void 0!==_?_:{},null,2),rows:20,cols:50,className:"margin"}),(0,k.jsxs)(h.ZP,{type:"primary",size:"large",loading:q.isPending,onClick:function(){return q.mutate(_)},disabled:!(null!==_&&void 0!==_&&_.id),children:['Merge Users "',U.id,'" into "',A.id,'"']})]})]})}},76738:function(){},78556:function(e,t,n){n.d(t,{D:function(){return T}});var i,s,r,a,l,u,o=n(18489),d=n(50678),c=n(72791),v=n(27853),h=n(84531),Z=n(6148),f=n(81020),p=n(804),m=n(15195),g=n(22494),y=n(9259),x=n(10615),b=n(83775),j=n(32756),k=n(7211),w=n(68974),O=n(5391),S=(i=new WeakMap,s=new WeakMap,r=new WeakMap,a=new WeakMap,l=new WeakSet,u=new WeakSet,function(e){(0,f.Z)(n,e);var t=(0,p.Z)(n);function n(e,o){var d;return(0,v.Z)(this,n),d=t.call(this),(0,m.Z)((0,Z.Z)(d),u),(0,m.Z)((0,Z.Z)(d),l),(0,g.Z)((0,Z.Z)(d),i,{writable:!0,value:void 0}),(0,g.Z)((0,Z.Z)(d),s,{writable:!0,value:void 0}),(0,g.Z)((0,Z.Z)(d),r,{writable:!0,value:void 0}),(0,g.Z)((0,Z.Z)(d),a,{writable:!0,value:void 0}),(0,b.Z)((0,Z.Z)(d),i,e),d.setOptions(o),d.bindMethods(),(0,x.Z)((0,Z.Z)(d),l,C).call((0,Z.Z)(d)),d}return(0,h.Z)(n,[{key:"bindMethods",value:function(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}},{key:"setOptions",value:function(e){var t,n=this.options;this.options=(0,y.Z)(this,i).defaultMutationOptions(e),(0,O.VS)(this.options,n)||(0,y.Z)(this,i).getMutationCache().notify({type:"observerOptionsUpdated",mutation:(0,y.Z)(this,r),observer:this}),null!==n&&void 0!==n&&n.mutationKey&&this.options.mutationKey&&(0,O.Ym)(n.mutationKey)!==(0,O.Ym)(this.options.mutationKey)?this.reset():"pending"===(null===(t=(0,y.Z)(this,r))||void 0===t?void 0:t.state.status)&&(0,y.Z)(this,r).setOptions(this.options)}},{key:"onUnsubscribe",value:function(){var e;this.hasListeners()||(null===(e=(0,y.Z)(this,r))||void 0===e||e.removeObserver(this))}},{key:"onMutationUpdate",value:function(e){(0,x.Z)(this,l,C).call(this),(0,x.Z)(this,u,N).call(this,e)}},{key:"getCurrentResult",value:function(){return(0,y.Z)(this,s)}},{key:"reset",value:function(){var e;null===(e=(0,y.Z)(this,r))||void 0===e||e.removeObserver(this),(0,b.Z)(this,r,void 0),(0,x.Z)(this,l,C).call(this),(0,x.Z)(this,u,N).call(this)}},{key:"mutate",value:function(e,t){var n;return(0,b.Z)(this,a,t),null===(n=(0,y.Z)(this,r))||void 0===n||n.removeObserver(this),(0,b.Z)(this,r,(0,y.Z)(this,i).getMutationCache().build((0,y.Z)(this,i),this.options)),(0,y.Z)(this,r).addObserver(this),(0,y.Z)(this,r).execute(e)}}]),n}(w.l));function C(){var e,t,n=null!==(e=null===(t=(0,y.Z)(this,r))||void 0===t?void 0:t.state)&&void 0!==e?e:(0,j.R)();(0,b.Z)(this,s,(0,o.Z)((0,o.Z)({},n),{},{isPending:"pending"===n.status,isSuccess:"success"===n.status,isError:"error"===n.status,isIdle:"idle"===n.status,mutate:this.mutate,reset:this.reset}))}function N(e){var t=this;k.V.batch((function(){if((0,y.Z)(t,a)&&t.hasListeners()){var n,i,r,l,u=(0,y.Z)(t,s).variables,o=(0,y.Z)(t,s).context;if("success"===(null===e||void 0===e?void 0:e.type))null===(n=(i=(0,y.Z)(t,a)).onSuccess)||void 0===n||n.call(i,e.data,u,o),null===(r=(l=(0,y.Z)(t,a)).onSettled)||void 0===r||r.call(l,e.data,null,u,o);else if("error"===(null===e||void 0===e?void 0:e.type)){var d,c,v,h;null===(d=(c=(0,y.Z)(t,a)).onError)||void 0===d||d.call(c,e.error,u,o),null===(v=(h=(0,y.Z)(t,a)).onSettled)||void 0===v||v.call(h,void 0,e.error,u,o)}}t.listeners.forEach((function(e){e((0,y.Z)(t,s))}))}))}var M=n(93713),E=n(28981);function T(e,t){var n=(0,M.NL)(t),i=c.useState((function(){return new S(n,e)})),s=(0,d.Z)(i,1)[0];c.useEffect((function(){s.setOptions(e)}),[s,e]);var r=c.useSyncExternalStore(c.useCallback((function(e){return s.subscribe(k.V.batchCalls(e))}),[s]),(function(){return s.getCurrentResult()}),(function(){return s.getCurrentResult()})),a=c.useCallback((function(e,t){s.mutate(e,t).catch(E.Z)}),[s]);if(r.error&&(0,E.L)(s.options.throwOnError,[r.error]))throw r.error;return(0,o.Z)((0,o.Z)({},r),{},{mutate:a,mutateAsync:r.mutate})}}}]);
//# sourceMappingURL=page-users.93e4b1c4.chunk.js.map