import{r as h,j as a,A as p,a as x,b}from"./index-jMMqFWbC.js";import{u as g,e as c,T as d,p as m,c as u,z as w}from"./TextInput-CPnwiCRt.js";const f=w.object({email:c,password:m,confirmPassword:u}).refine(l=>l.password===l.confirmPassword,{message:"Passwords need to match",path:["confirmPassword"]}),j=({onSubmit:l,isLoading:t=!1})=>{const[i,o]=h.useState(null),r=g({validators:{onSubmit:f},defaultValues:{email:"",password:"",confirmPassword:""},onSubmit:async({value:e})=>{try{o(null),await l({email:e.email,password:e.password})}catch(s){if(s instanceof p){o("Couldn't sign you up, please refresh and try again");return}o("An unexpected error occurred, please refresh and try again")}}});return a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx("h1",{className:"text-2xl font-bold",children:"Create an account"}),i&&a.jsx("div",{className:"bg-red-100 border-l-4 border-red-500 text-red-700 p-4",children:a.jsx("p",{children:i})}),a.jsxs("form",{onSubmit:e=>{e.preventDefault(),e.stopPropagation(),r.validate("submit"),r.handleSubmit()},className:"flex flex-col gap-2",children:[a.jsx(r.Field,{name:"email",validators:{onBlur:c},children:e=>{var s,n;return a.jsx(d,{label:"Email",placeholder:"your-email@example.com",type:"email",field:{name:e.name,value:e.state.value,handleChange:e.handleChange,handleBlur:e.handleBlur},errorMsg:(n=(s=e.state.meta.errors)==null?void 0:s[0])==null?void 0:n.message,isDisabled:t})}}),a.jsx(r.Field,{name:"password",validators:{onBlur:m},children:e=>{var s,n;return a.jsx(d,{label:"Password",placeholder:"Password",type:"password",field:{name:e.name,value:e.state.value,handleChange:e.handleChange,handleBlur:e.handleBlur},errorMsg:(n=(s=e.state.meta.errors)==null?void 0:s[0])==null?void 0:n.message,isDisabled:t})}}),a.jsx(r.Field,{name:"confirmPassword",validators:{onBlur:u},children:e=>{var s,n;return a.jsx(d,{label:"Confirm Password",placeholder:"Confirm Password",type:"password",field:{name:e.name,value:e.state.value,handleChange:e.handleChange,handleBlur:e.handleBlur},errorMsg:(n=(s=e.state.meta.errors)==null?void 0:s[0])==null?void 0:n.message,isDisabled:t})}}),a.jsx("div",{className:"mt-2",children:a.jsx(r.Subscribe,{selector:e=>[e.canSubmit,e.isSubmitting],children:([e,s])=>a.jsx("button",{type:"submit",disabled:!e||t,className:"w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",children:s?"Creating account...":"Create account"})})}),a.jsxs("p",{className:"text-sm text-center mt-4 text-gray-600",children:["Already have an account?"," ",a.jsx("a",{href:"/sign-in",className:"text-blue-600 hover:underline",children:"Sign in"})]})]})]})},y=function(){const t=x(),i=async({email:o,password:r})=>{const{error:e}=await b.signUp(o,r);if(e)throw e;t({to:"/sign-in",search:{message:"sign-up-success"}})};return a.jsx(j,{onSubmit:i})};export{y as component};
