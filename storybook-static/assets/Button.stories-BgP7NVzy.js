import{j as H}from"./jsx-runtime-DoEZbXM1.js";import"./jsx-runtime-Bw5QeaCk.js";function O(r){var a,e,t="";if(typeof r=="string"||typeof r=="number")t+=r;else if(typeof r=="object")if(Array.isArray(r)){var s=r.length;for(a=0;a<s;a++)r[a]&&(e=O(r[a]))&&(t&&(t+=" "),t+=e)}else for(e in r)r[e]&&(t&&(t+=" "),t+=e);return t}function P(){for(var r,a,e=0,t="",s=arguments.length;e<s;e++)(r=arguments[e])&&(a=O(r))&&(t&&(t+=" "),t+=a);return t}const g=r=>typeof r=="boolean"?`${r}`:r===0?"0":r,b=P,W=(r,a)=>e=>{var t;if((a==null?void 0:a.variants)==null)return b(r,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:s,defaultVariants:l}=a,_=Object.keys(s).map(n=>{const o=e==null?void 0:e[n],d=l==null?void 0:l[n];if(o===null)return null;const i=g(o)||g(d);return s[n][i]}),f=e&&Object.entries(e).reduce((n,o)=>{let[d,i]=o;return i===void 0||(n[d]=i),n},{}),k=a==null||(t=a.compoundVariants)===null||t===void 0?void 0:t.reduce((n,o)=>{let{class:d,className:i,...A}=o;return Object.entries(A).every(B=>{let[y,v]=B;return Array.isArray(v)?v.includes({...l,...f}[y]):{...l,...f}[y]===v})?[...n,d,i]:n},[]);return b(r,_,k,e==null?void 0:e.class,e==null?void 0:e.className)},z=W("inline-flex font-semibold items-center justify-center rounded-md transition-colors",{variants:{variant:{default:"bg-primary-500 hover:bg-primary-600 text-white",secondary:"bg-white text-gray-800 border-gray-400"},size:{default:"px-md py-sm",large:"px-6 py-3"},disabled:{false:null,true:["opacity-50","cursor-not-allowed"]}},defaultVariants:{variant:"default",size:"default"}}),S=({variant:r,size:a,className:e,disabled:t,...s})=>H.jsx("button",{className:z({variant:r,size:a,className:e}),disabled:t||void 0,...s});S.__docgenInfo={description:"",methods:[],displayName:"Button",composes:["Omit","ButtonVariants"]};const X={title:"Core/Button",component:S,parameters:{design:{type:"figma",url:"https://www.figma.com/design/ZuZWPWcPLSqaX8d1p9uTpX/DesignSystem"}}},u={args:{children:"Click me"}},c={args:{children:"Disabled",disabled:!0}},m={args:{children:"Hover me"},parameters:{pseudo:{hover:!0}}};var p,h,x;u.parameters={...u.parameters,docs:{...(p=u.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: 'Click me'
  }
}`,...(x=(h=u.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var V,j,C;c.parameters={...c.parameters,docs:{...(V=c.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: 'Disabled',
    disabled: true
  }
}`,...(C=(j=c.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var N,D,w;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    children: 'Hover me'
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...(w=(D=m.parameters)==null?void 0:D.docs)==null?void 0:w.source}}};const Z=["Default","Disabled","Hover"];export{u as Default,c as Disabled,m as Hover,Z as __namedExportsOrder,X as default};
