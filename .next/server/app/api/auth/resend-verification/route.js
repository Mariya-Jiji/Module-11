"use strict";(()=>{var e={};e.id=596,e.ids=[596],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},3203:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>y,requestAsyncStorage:()=>f,routeModule:()=>d,serverHooks:()=>x,staticGenerationAsyncStorage:()=>h});var i={};t.r(i),t.d(i,{POST:()=>c});var s=t(3278),o=t(5002),a=t(4877),n=t(1309),l=t(1643),p=t(2671),u=t(410);async function c(e){try{let{email:r}=await e.json();if(!r)return n.NextResponse.json({error:"Email is required."},{status:400});let t=await l._.user.findUnique({where:{email:r}});if(!t)return n.NextResponse.json({success:!0,message:"If an account exists, a verification email has been sent."});if(t.emailVerified)return n.NextResponse.json({error:"Email is already verified."},{status:400});let i=(0,p.c)(),s=(0,p.q)(i),o=`verify:${r}`,a=new Date(Date.now()+36e5);return await l._.$transaction([l._.verificationToken.deleteMany({where:{identifier:o}}),l._.verificationToken.create({data:{identifier:o,token:s,expires:a}})]),await (0,u.q)(r,i),n.NextResponse.json({success:!0,message:"Verification email resent."})}catch(e){return console.error("Resend verification error:",e),n.NextResponse.json({error:"Failed to resend verification email."},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/auth/resend-verification/route",pathname:"/api/auth/resend-verification",filename:"route",bundlePath:"app/api/auth/resend-verification/route"},resolvedPagePath:"C:\\Projects\\The AI Signal\\app\\api\\auth\\resend-verification\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:f,staticGenerationAsyncStorage:h,serverHooks:x}=d,m="/api/auth/resend-verification/route";function y(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:h})}},410:(e,r,t)=>{t.d(r,{L:()=>a,q:()=>o});let i=t(6742).createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),s=()=>process.env.NEXT_PUBLIC_APP_URL?process.env.NEXT_PUBLIC_APP_URL:process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:"http://localhost:3000";async function o(e,r){let t=`${s()}/verify-email?token=${r}&email=${encodeURIComponent(e)}`,o={from:process.env.EMAIL_USER,to:e,subject:"Verify your email - The AI Signal",html:`
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
    `};try{return await i.sendMail(o),{success:!0}}catch(e){return console.error("Error sending verification email:",e),{success:!1,error:e}}}async function a(e,r){let t=`${s()}/reset-password?token=${r}&email=${encodeURIComponent(e)}`,o={from:process.env.EMAIL_USER,to:e,subject:"Reset your password - The AI Signal",html:`
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
    `};try{return await i.sendMail(o),{success:!0}}catch(e){return console.error("Error sending password reset email:",e),{success:!1,error:e}}}},1643:(e,r,t)=>{t.d(r,{_:()=>s});let i=require("@prisma/client"),s=globalThis.prisma??new i.PrismaClient},2671:(e,r,t)=>{t.d(r,{c:()=>o,q:()=>a});var i=t(4770),s=t.n(i);function o(){return s().randomUUID()}function a(e){return s().createHash("sha256").update(e).digest("hex")}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[787,309,2],()=>t(3203));module.exports=i})();