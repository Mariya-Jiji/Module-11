"use strict";(()=>{var e={};e.id=654,e.ids=[654],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},373:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>y,patchFetch:()=>g,requestAsyncStorage:()=>x,routeModule:()=>h,serverHooks:()=>m,staticGenerationAsyncStorage:()=>f});var s={};t.r(s),t.d(s,{POST:()=>c});var i=t(3278),o=t(5002),a=t(4877),n=t(1309),p=t(3981),l=t(1643),u=t(2671),d=t(410);async function c(e){try{let{email:r,password:t,name:s}=await e.json();if(!r||!t)return n.NextResponse.json({error:"Email and password are required."},{status:400});if(await l._.user.findUnique({where:{email:r}}))return n.NextResponse.json({error:"Email is already in use."},{status:409});let i=await p.ZP.hash(t,12);await l._.user.create({data:{email:r,name:s||r,password:i,emailVerified:null}});let o=(0,u.c)(),a=(0,u.q)(o),c=`verify:${r}`,h=new Date(Date.now()+36e5);return await l._.$transaction([l._.verificationToken.deleteMany({where:{identifier:c}}),l._.verificationToken.create({data:{identifier:c,token:a,expires:h}})]),await (0,d.q)(r,o),n.NextResponse.json({success:!0,message:"Verification email sent."},{status:201})}catch(e){return console.error("Signup error:",e),n.NextResponse.json({error:"Failed to create account."},{status:500})}}let h=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/auth/signup/route",pathname:"/api/auth/signup",filename:"route",bundlePath:"app/api/auth/signup/route"},resolvedPagePath:"C:\\Projects\\The AI Signal\\app\\api\\auth\\signup\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:x,staticGenerationAsyncStorage:f,serverHooks:m}=h,y="/api/auth/signup/route";function g(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:f})}},410:(e,r,t)=>{t.d(r,{L:()=>a,q:()=>o});let s=t(6742).createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),i=()=>process.env.NEXT_PUBLIC_APP_URL?process.env.NEXT_PUBLIC_APP_URL:process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:"http://localhost:3000";async function o(e,r){let t=`${i()}/verify-email?token=${r}&email=${encodeURIComponent(e)}`,o={from:process.env.EMAIL_USER,to:e,subject:"Verify your email - The AI Signal",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Verify your email address</h2>
        <p style="color: #444; line-height: 1.5;">
          Thanks for signing up for The AI Signal! Please click the link below to verify your email address.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${t}" style="background-color: #7C3AED; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `};try{return await s.sendMail(o),{success:!0}}catch(e){return console.error("Error sending verification email:",e),{success:!1,error:e}}}async function a(e,r){let t=`${i()}/reset-password?token=${r}&email=${encodeURIComponent(e)}`,o={from:process.env.EMAIL_USER,to:e,subject:"Reset your password - The AI Signal",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111;">Reset your password</h2>
        <p style="color: #444; line-height: 1.5;">
          You requested a password reset. Please click the link below to set a new password.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${t}" style="background-color: #7C3AED; color: #fff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `};try{return await s.sendMail(o),{success:!0}}catch(e){return console.error("Error sending password reset email:",e),{success:!1,error:e}}}},1643:(e,r,t)=>{t.d(r,{_:()=>i});let s=require("@prisma/client"),i=globalThis.prisma??new s.PrismaClient},2671:(e,r,t)=>{t.d(r,{c:()=>o,q:()=>a});var s=t(4770),i=t.n(s);function o(){return i().randomUUID()}function a(e){return i().createHash("sha256").update(e).digest("hex")}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[787,309,981,2],()=>t(373));module.exports=s})();