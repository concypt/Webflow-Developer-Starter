"use strict";(()=>{var ft=Object.create;var et=Object.defineProperty;var dt=Object.getOwnPropertyDescriptor;var pt=Object.getOwnPropertyNames;var mt=Object.getPrototypeOf,ht=Object.prototype.hasOwnProperty;var yt=(a,r)=>()=>(r||a((r={exports:{}}).exports,r),r.exports);var vt=(a,r,i,d)=>{if(r&&typeof r=="object"||typeof r=="function")for(let v of pt(r))!ht.call(a,v)&&v!==i&&et(a,v,{get:()=>r[v],enumerable:!(d=dt(r,v))||d.enumerable});return a};var bt=(a,r,i)=>(i=a!=null?ft(mt(a)):{},vt(r||!a||!a.__esModule?et(i,"default",{value:a,enumerable:!0}):i,a));var nt=yt((K,Y)=>{var V,F;V=K,F=function(){"use strict";function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(s){return Object.getOwnPropertyDescriptor(t,s).enumerable})),n.push.apply(n,o)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?a(Object(n),!0).forEach(function(o){d(t,o,n[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(n,o))})}return t}function i(t){return i=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i(t)}function d(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function v(t){return function(e){if(Array.isArray(e))return L(e)}(t)||function(e){if(typeof Symbol!="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}(t)||w(t)||function(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}function w(t,e){if(t){if(typeof t=="string")return L(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?L(t,e):void 0}}function L(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}var g=function(t){return typeof t=="string"?document.querySelector(t):t()},q=function(t,e){var n=typeof t=="string"?document.createElement(t):t;for(var o in e){var s=e[o];if(o==="inside")s.append(n);else if(o==="dest")g(s[0]).insertAdjacentElement(s[1],n);else if(o==="around"){var c=s;c.parentNode.insertBefore(n,c),n.append(c),c.getAttribute("autofocus")!=null&&c.focus()}else o in n?n[o]=s:n.setAttribute(o,s)}return n},D=function(t,e){return t=String(t).toLowerCase(),e?t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").normalize("NFC"):t},O=function(t,e){return q("mark",r({innerHTML:t},typeof e=="string"&&{class:e})).outerHTML},S=function(t,e){e.input.dispatchEvent(new CustomEvent(t,{bubbles:!0,detail:e.feedback,cancelable:!0}))},E=function(t,e,n){var o=n||{},s=o.mode,c=o.diacritics,l=o.highlight,h=D(e,c);if(e=String(e),t=D(t,c),s==="loose"){var m=(t=t.replace(/ /g,"")).length,u=0,p=Array.from(e).map(function(b,y){return u<m&&h[y]===t[u]&&(b=l?O(b,l):b,u++),b}).join("");if(u===m)return p}else{var f=h.indexOf(t);if(~f)return t=e.substring(f,f+t.length),f=l?e.replace(t,O(t,l)):e}},I=function(t,e){return new Promise(function(n,o){var s;return(s=t.data).cache&&s.store?n():new Promise(function(c,l){return typeof s.src=="function"?s.src(e).then(c,l):c(s.src)}).then(function(c){try{return t.feedback=s.store=c,S("response",t),n()}catch(l){return o(l)}},o)})},P=function(t,e){var n=e.data,o=e.searchEngine,s=[];n.store.forEach(function(l,h){var m=function(f){var b=f?l[f]:l,y=typeof o=="function"?o(t,b):E(t,b,{mode:o,diacritics:e.diacritics,highlight:e.resultItem.highlight});if(y){var A={match:y,value:l};f&&(A.key=f),s.push(A)}};if(n.keys){var u,p=function(f,b){var y=typeof Symbol!="undefined"&&f[Symbol.iterator]||f["@@iterator"];if(!y){if(Array.isArray(f)||(y=w(f))||b&&f&&typeof f.length=="number"){y&&(f=y);var A=0,T=function(){};return{s:T,n:function(){return A>=f.length?{done:!0}:{done:!1,value:f[A++]}},e:function(C){throw C},f:T}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var R,N=!0,_=!1;return{s:function(){y=y.call(f)},n:function(){var C=y.next();return N=C.done,C},e:function(C){_=!0,R=C},f:function(){try{N||y.return==null||y.return()}finally{if(_)throw R}}}}(n.keys);try{for(p.s();!(u=p.n()).done;)m(u.value)}catch(f){p.e(f)}finally{p.f()}}else m()}),n.filter&&(s=n.filter(s));var c=s.slice(0,e.resultsList.maxResults);e.feedback={query:t,matches:s,results:c},S("results",e)},H="aria-expanded",B="aria-activedescendant",M="aria-selected",j=function(t,e){t.feedback.selection=r({index:e},t.feedback.results[e])},x=function(t){t.isOpen||((t.wrapper||t.input).setAttribute(H,!0),t.list.removeAttribute("hidden"),t.isOpen=!0,S("open",t))},k=function(t){t.isOpen&&((t.wrapper||t.input).setAttribute(H,!1),t.input.setAttribute(B,""),t.list.setAttribute("hidden",""),t.isOpen=!1,S("close",t))},J=function(t,e){var n=e.resultItem,o=e.list.getElementsByTagName(n.tag),s=!!n.selected&&n.selected.split(" ");if(e.isOpen&&o.length){var c,l,h=e.cursor;t>=o.length&&(t=0),t<0&&(t=o.length-1),e.cursor=t,h>-1&&(o[h].removeAttribute(M),s&&(l=o[h].classList).remove.apply(l,v(s))),o[t].setAttribute(M,!0),s&&(c=o[t].classList).add.apply(c,v(s)),e.input.setAttribute(B,o[e.cursor].id),e.list.scrollTop=o[t].offsetTop-e.list.clientHeight+o[t].clientHeight+5,e.feedback.cursor=e.cursor,j(e,t),S("navigate",e)}},G=function(t){J(t.cursor+1,t)},Q=function(t){J(t.cursor-1,t)},U=function(t,e,n){(n=n>=0?n:t.cursor)<0||(t.feedback.event=e,j(t,n),S("selection",t),k(t))};function Z(t,e){var n=this;return new Promise(function(o,s){var c,l;return c=e||((l=t.input)instanceof HTMLInputElement||l instanceof HTMLTextAreaElement?l.value:l.innerHTML),function(m,u,p){return u?u(m):m.length>=p}(c=t.query?t.query(c):c,t.trigger,t.threshold)?I(t,c).then(function(m){try{return t.feedback instanceof Error?o():(P(c,t),t.resultsList&&function(u){var p=u.resultsList,f=u.list,b=u.resultItem,y=u.feedback,A=y.matches,T=y.results;if(u.cursor=-1,f.innerHTML="",A.length||p.noResults){var R=new DocumentFragment;T.forEach(function(N,_){var C=q(b.tag,r({id:"".concat(b.id,"_").concat(_),role:"option",innerHTML:N.match,inside:R},b.class&&{class:b.class}));b.element&&b.element(C,N)}),f.append(R),p.element&&p.element(f,y),x(u)}else k(u)}(t),h.call(n))}catch(u){return s(u)}},s):(k(t),h.call(n));function h(){return o()}})}var z=function(t,e){for(var n in t)for(var o in t[n])e(n,o)},ut=function(t){var e,n,o,s=t.events,c=(e=function(){return Z(t)},n=t.debounce,function(){clearTimeout(o),o=setTimeout(function(){return e()},n)}),l=t.events=r({input:r({},s&&s.input)},t.resultsList&&{list:s?r({},s.list):{}}),h={input:{input:function(){c()},keydown:function(m){(function(u,p){switch(u.keyCode){case 40:case 38:u.preventDefault(),u.keyCode===40?G(p):Q(p);break;case 13:p.submit||u.preventDefault(),p.cursor>=0&&U(p,u);break;case 9:p.resultsList.tabSelect&&p.cursor>=0&&U(p,u);break;case 27:p.input.value="",k(p)}})(m,t)},blur:function(){k(t)}},list:{mousedown:function(m){m.preventDefault()},click:function(m){(function(u,p){var f=p.resultItem.tag.toUpperCase(),b=Array.from(p.list.querySelectorAll(f)),y=u.target.closest(f);y&&y.nodeName===f&&U(p,u,b.indexOf(y))})(m,t)}}};z(h,function(m,u){(t.resultsList||u==="input")&&(l[m][u]||(l[m][u]=h[m][u]))}),z(l,function(m,u){t[m].addEventListener(u,l[m][u])})};function tt(t){var e=this;return new Promise(function(n,o){var s,c,l;if(s=t.placeHolder,l={role:"combobox","aria-owns":(c=t.resultsList).id,"aria-haspopup":!0,"aria-expanded":!1},q(t.input,r(r({"aria-controls":c.id,"aria-autocomplete":"both"},s&&{placeholder:s}),!t.wrapper&&r({},l))),t.wrapper&&(t.wrapper=q("div",r({around:t.input,class:t.name+"_wrapper"},l))),c&&(t.list=q(c.tag,r({dest:[c.destination,c.position],id:c.id,role:"listbox",hidden:"hidden"},c.class&&{class:c.class}))),ut(t),t.data.cache)return I(t).then(function(m){try{return h.call(e)}catch(u){return o(u)}},o);function h(){return S("init",t),n()}return h.call(e)})}function lt(t){var e=t.prototype;e.init=function(){tt(this)},e.start=function(n){Z(this,n)},e.unInit=function(){if(this.wrapper){var n=this.wrapper.parentNode;n.insertBefore(this.input,this.wrapper),n.removeChild(this.wrapper)}var o;z((o=this).events,function(s,c){o[s].removeEventListener(c,o.events[s][c])})},e.open=function(){x(this)},e.close=function(){k(this)},e.goTo=function(n){J(n,this)},e.next=function(){G(this)},e.previous=function(){Q(this)},e.select=function(n){U(this,null,n)},e.search=function(n,o,s){return E(n,o,s)}}return function t(e){this.options=e,this.id=t.instances=(t.instances||0)+1,this.name="autoComplete",this.wrapper=1,this.threshold=1,this.debounce=0,this.resultsList={position:"afterend",tag:"ul",maxResults:5},this.resultItem={tag:"li"},function(n){var o=n.name,s=n.options,c=n.resultsList,l=n.resultItem;for(var h in s)if(i(s[h])==="object")for(var m in n[h]||(n[h]={}),s[h])n[h][m]=s[h][m];else n[h]=s[h];n.selector=n.selector||"#"+o,c.destination=c.destination||n.selector,c.id=c.id||o+"_list_"+n.id,l.id=l.id||o+"_result",n.input=g(n.selector)}(this),lt.call(this,t),tt(this)}},typeof K=="object"&&typeof Y!="undefined"?Y.exports=F():typeof define=="function"&&define.amd?define(F):(V=typeof globalThis!="undefined"?globalThis:V||self).autoComplete=F()});var st=bt(nt(),1),$=document.querySelector('[data-element="Purchaser"]');$==null||$.addEventListener("change",a=>{a.preventDefault();let r=a.target.value,i=document.querySelector('[data-purchaser="Joint"]');r==="Joint"&&(i==null||i.classList.remove("hide")),r==="Single"&&(i==null||i.classList.add("hide"))});var W=document.querySelector('[data-element="Buying Entity Type"]');W==null||W.addEventListener("change",a=>{a.preventDefault();let r=a.target.value;console.log(r);let i=document.querySelector('[data-element="Buying Entity Name"]');r!=="Named above"&&(i==null||i.classList.remove("hide")),(r==="Named above"||r==="")&&(i==null||i.classList.add("hide"))});var at=[];document.querySelectorAll(".property-list-item").forEach(a=>{a.textContent&&at.push(a.textContent)});var gt=new st.default({placeHolder:"Search for listing...",data:{src:at,cache:!0},resultItem:{highlight:!0},events:{input:{selection:a=>{let r=a.detail.selection.value;gt.input.value=r}}}}),it;(it=document.querySelector("#autoComplete"))==null||it.addEventListener("selection",function(a){let r=a.detail.selection.value;Lt(r).then(i=>wt(i))});async function Lt(a){let r="https://api.airtable.com/v0/appWNf6XfqAR6n0oT/"+a+"?api_key=keyUxdcC40qxNrt1Y";return await(await fetch(r)).json()}var wt=a=>{let r=document.querySelector('[data-element="AvailableUnits"]');if(!r)return;let i=r.options.length-1,d;for(d=i;d>=1;d--)r.remove(d);let v=a.records;console.log(v);let w=[];v.forEach(L=>{let g="Unit "+L.fields.Unit+" - $"+L.fields.Price+" / "+L.fields.Land+"sqm / "+L.fields.Beds+" / "+L.fields.Baths+" / "+L.fields["Car Park"];w.push(g)}),w.sort(),w.forEach(L=>{let g=document.createElement("option");g.text=L+"",g.value=L+"",r==null||r.add(g)})},St="a95d779bec144d448ebcafccdec4ce61";function kt(){let a=new AddyComplete(document.getElementById("main-address"));a.options.excludePostBox=!1,a.fields={address1:document.getElementById("main-address"),address2:document.getElementById("main-address2"),city:document.getElementById("main-city"),postcode:document.getElementById("main-postcode"),suburb:document.getElementById("main-suburb")}}(function(a,r){let i=a.createElement("script"),d="https://www.addysolutions.com/address-lookup/1.6.2/js/addy.min.js";i.src=d+"?loadcss=true&enableLocation=false&country=nz&nzKey="+St,i.type="text/javascript",i.async=1,i.onload=kt,a.body.appendChild(i)})(document,window);var X=(a,r,i)=>{let d=a==null?void 0:a.cloneNode(!0),v=d.querySelector("span"),w=d.querySelector("input");if(!(!v||!w))return v.textContent=r.toString(),w.value=i.toString(),d},ct=(a,r,i)=>{let d=r==null?void 0:r.parentElement;r==null||r.remove(),console.log(i),a.forEach((v,w,L)=>{var O,S,E,I,P,H,B,M;let g=v,q="Yes - "+((O=g.querySelector('[data-element="'+i+' Location"]'))==null?void 0:O.textContent)+(i!=="Lawyer"?" ":": ")+((S=g.querySelector('[data-element="'+i+' Name"]'))==null?void 0:S.textContent)+" at "+((E=g.querySelector('[data-element="'+i+' Firm"]'))==null?void 0:E.textContent)+" ("+((I=g.querySelector('[data-element="'+i+' Email"]'))==null?void 0:I.textContent)+" / "+((P=g.querySelector('[data-element="'+i+' Phone"]'))==null?void 0:P.textContent)+" )",D=((H=g.querySelector('[data-element="'+i+' Location"]'))==null?void 0:H.textContent)+": "+((B=g.querySelector('[data-element="'+i+' Name"]'))==null?void 0:B.textContent)+" at "+((M=g.querySelector('[data-element="'+i+' Firm"]'))==null?void 0:M.textContent);if(r){let j=X(r,q,D);if(j&&(d==null||d.append(j)),w===L.length-1){let x;i==="Lawyer"?x=X(r,"No - please fill in purchaser solicitors section below","Custom Lawyer"):x=X(r,"No - please fill in purchaser broker section below","Custom Broker"),x&&(d==null||d.append(x));let k=d==null?void 0:d.querySelector(".w-form-formradioinput:first-child");k&&(k.checked=!0)}}})},Ct=document.querySelectorAll('[data-element="Lawyer Item"]'),rt=document.querySelector('[data-element="Lawyer Radio"]');rt&&ct(Ct,rt,"Lawyer");var qt=document.querySelectorAll('[data-element="Broker Item"]'),ot=document.querySelector('[data-element="Broker Radio"]');ot&&ct(qt,ot,"Broker");document.addEventListener("click",function(a){var i,d,v,w;let r=a.target;r.classList.contains("lawyer-radio")&&(r.value==="Custom Lawyer"?(i=document.querySelector('[data-element="Custom Lawyer"]'))==null||i.classList.remove("hide"):(d=document.querySelector('[data-element="Custom Lawyer"]'))==null||d.classList.add("hide")),r.classList.contains("broker-radio")&&(r.value==="Custom Broker"?(v=document.querySelector('[data-element="Custom Broker"]'))==null||v.classList.remove("hide"):(w=document.querySelector('[data-element="Custom Broker"]'))==null||w.classList.add("hide"))});})();