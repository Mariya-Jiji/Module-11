"use strict";(()=>{var e={};e.id=118,e.ids=[118],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},2842:(e,r,s)=>{s.r(r),s.d(r,{originalPathname:()=>m,patchFetch:()=>g,requestAsyncStorage:()=>h,routeModule:()=>c,serverHooks:()=>f,staticGenerationAsyncStorage:()=>x});var t={};s.r(t),s.d(t,{POST:()=>d});var o=s(3278),i=s(5002),a=s(4877),n=s(1309),p=s(1643),l=s(2671),u=s(410);async function d(e){try{let{email:r}=await e.json();if(!r)return n.NextResponse.json({error:"Email is required."},{status:400});if(!await p._.user.findUnique({where:{email:r}}))return n.NextResponse.json({success:!0,message:"If an account exists, a reset email has been sent."});let s=(0,l.c)(),t=(0,l.q)(s),o=`reset:${r}`,i=new Date(Date.now()+36e5);return await p._.$transaction([p._.verificationToken.deleteMany({where:{identifier:o}}),p._.verificationToken.create({data:{identifier:o,token:t,expires:i}})]),await (0,u.L)(r,s),n.NextResponse.json({success:!0,message:"Password reset email sent."})}catch(e){return console.error("Forgot password error:",e),n.NextResponse.json({error:"Failed to send password reset email."},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/auth/forgot-password/route",pathname:"/api/auth/forgot-password",filename:"route",bundlePath:"app/api/auth/forgot-password/route"},resolvedPagePath:"C:\\Projects\\The AI Signal\\app\\api\\auth\\forgot-password\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:h,staticGenerationAsyncStorage:x,serverHooks:f}=c,m="/api/auth/forgot-password/route";function g(){return(0,a.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:x})}},410:(e,r,s)=>{s.d(r,{L:()=>a,q:()=>i});let t=s(6742).createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),o=()=>process.env.NEXT_PUBLIC_APP_URL?process.env.NEXT_PUBLIC_APP_URL:process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:"http://localhost:3000";async function i(e,r){let s=`${o()}/verify-email?token=${r}&email=${encodeURIComponent(e)}`,i={from:process.env.EMAIL_USER,to:e,subject:"Verify your email - The AI Signal",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Verify your email address</h2>
        <p style="color: #444; line-height: 1.5;">
          Thanks for signing up for The AI Signal! Please click the link below to verify your email address.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${s}" style="background-color: #7C3AED; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `};try{return await t.sendMail(i),{success:!0}}catch(e){return console.error("Error sending verification email:",e),{success:!1,error:e}}}async function a(e,r){let s=`${o()}/reset-password?token=${r}&email=${encodeURIComponent(e)}`,i={from:process.env.EMAIL_USER,to:e,subject:"Reset your password - The AI Signal",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Reset your password</h2>
        <p style="color: #444; line-height: 1.5;">
          You requested a password reset. Please click the link below to set a new password.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${s}" style="background-color: #7C3AED; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `};try{return await t.sendMail(i),{success:!0}}catch(e){return console.error("Error sending password reset email:",e),{success:!1,error:e}}}},1643:(e,r,s)=>{s.d(r,{_:()=>o});let t=require("@prisma/client"),o=globalThis.prisma??new t.PrismaClient},2671:(e,r,s)=>{s.d(r,{c:()=>i,q:()=>a});var t=s(4770),o=s.n(t);function i(){return o().randomUUID()}function a(e){return o().createHash("sha256").update(e).digest("hex")}}};var r=require("../../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[787,309,2],()=>s(2842));module.exports=t})();