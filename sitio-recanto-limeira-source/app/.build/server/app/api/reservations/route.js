"use strict";(()=>{var e={};e.id=74,e.ids=[74],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},51880:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>x,serverHooks:()=>v,staticGenerationAsyncStorage:()=>h});var o={};r.r(o),r.d(o,{GET:()=>g,POST:()=>u,dynamic:()=>l});var a=r(49303),s=r(88716),i=r(60670),n=r(87070),d=r(53524),c=r(36119);let p=new d.PrismaClient,l="force-dynamic";async function u(e){try{let{guestName:t,guestEmail:r,guestPhone:o,checkIn:a,checkOut:s,guests:i,observations:d}=await e.json();if(!t||!r||!o||!a||!s||!i)return n.NextResponse.json({error:"Todos os campos obrigat\xf3rios devem ser preenchidos"},{status:400});let l=new Date(a),u=new Date(s);if(l>=u)return n.NextResponse.json({error:"A data de sa\xedda deve ser posterior \xe0 data de entrada"},{status:400});if(await p.reservation.findFirst({where:{status:{in:["PENDING","CONFIRMED"]},OR:[{AND:[{checkIn:{lte:l}},{checkOut:{gt:l}}]},{AND:[{checkIn:{lt:u}},{checkOut:{gte:u}}]},{AND:[{checkIn:{gte:l}},{checkOut:{lte:u}}]}]}}))return n.NextResponse.json({error:"J\xe1 existe uma reserva confirmada para este per\xedodo"},{status:409});if((await p.blockedDate.findMany({where:{date:{gte:l,lte:u}}})).length>0)return n.NextResponse.json({error:"Algumas datas do per\xedodo selecionado n\xe3o est\xe3o dispon\xedveis"},{status:409});let g=Math.ceil((u.getTime()-l.getTime())/864e5),x=await p.reservation.create({data:{guestName:t,guestEmail:r,guestPhone:o,checkIn:l,checkOut:u,guests:parseInt(i),totalDays:g,totalPrice:0,observations:d||null,status:"PENDING"}});try{await (0,c.V)({guestName:t,guestEmail:r,guestPhone:o,checkIn:l.toISOString(),checkOut:u.toISOString(),guests:parseInt(i),observations:d||void 0,source:"Site"}),console.log("✅ Notifica\xe7\xe3o de reserva enviada por email")}catch(e){console.error("⚠️ Erro ao enviar notifica\xe7\xe3o por email:",e)}return n.NextResponse.json({message:"Reserva solicitada com sucesso! Entraremos em contato em breve.",reservation:{id:x.id,checkIn:x.checkIn,checkOut:x.checkOut,totalDays:x.totalDays}})}catch(e){return console.error("Erro ao criar reserva:",e),n.NextResponse.json({error:"Erro interno do servidor"},{status:500})}}async function g(){try{let e=await p.reservation.findMany({orderBy:{createdAt:"desc"}});return n.NextResponse.json(e)}catch(e){return console.error("Erro ao buscar reservas:",e),n.NextResponse.json({error:"Erro interno do servidor"},{status:500})}}let x=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/reservations/route",pathname:"/api/reservations",filename:"route",bundlePath:"app/api/reservations/route"},resolvedPagePath:"/home/ubuntu/vercel-deploy/sitio-recanto-limeira-source/app/app/api/reservations/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:v}=x,f="/api/reservations/route";function y(){return(0,i.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:h})}},36119:(e,t,r)=>{r.d(t,{V:()=>s});var o=r(72880),a=r.n(o);async function s(e){try{if(!process.env.SENDGRID_API_KEY||"YOUR_SENDGRID_API_KEY_HERE"===process.env.SENDGRID_API_KEY)return console.log("⚠️ SendGrid n\xe3o configurado - email n\xe3o ser\xe1 enviado"),{success:!1,message:"SendGrid n\xe3o configurado"};if(!process.env.NOTIFICATION_EMAIL)return console.log("⚠️ Email de notifica\xe7\xe3o n\xe3o configurado"),{success:!1,message:"Email de notifica\xe7\xe3o n\xe3o configurado"};let t=new Date(e.checkIn).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),r=new Date(e.checkOut).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),o=new Date(e.checkIn),s=new Date(e.checkOut).getTime()-o.getTime(),i=Math.ceil(s/864e5),n=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏡 Nova Reserva</h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 18px;">S\xedtio Recanto da Limeira</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; color: #059669; font-weight: bold; margin-bottom: 20px;">
          Uma nova reserva foi realizada atrav\xe9s do ${e.source}!
        </p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            📋 Informa\xe7\xf5es da Reserva
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">
                👤 H\xf3spede:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${e.guestName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📧 Email:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                <a href="mailto:${e.guestEmail}" style="color: #059669; text-decoration: none;">
                  ${e.guestEmail}
                </a>
              </td>
            </tr>
            ${e.guestPhone?`
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📱 Telefone:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                <a href="tel:${e.guestPhone}" style="color: #059669; text-decoration: none;">
                  ${e.guestPhone}
                </a>
              </td>
            </tr>
            `:""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📅 Check-in:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${t}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📅 Check-out:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${r}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                🗓️ Dura\xe7\xe3o:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${i} ${1===i?"dia":"dias"}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                👥 Pessoas:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${e.guests} ${1===e.guests?"pessoa":"pessoas"}
              </td>
            </tr>
            ${e.observations?`
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">
                📝 Observa\xe7\xf5es:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${e.observations}
              </td>
            </tr>
            `:""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                🌐 Origem:
              </td>
              <td style="padding: 8px 0;">
                <span style="background: ${"Site"===e.source?"#dcfce7":"#fef3c7"}; 
                           color: ${"Site"===e.source?"#059669":"#d97706"}; 
                           padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px;">
                  ${e.source}
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #374151; font-weight: bold;">
            💡 Pr\xf3ximos passos:
          </p>
          <p style="margin: 10px 0 0 0; color: #6b7280;">
            Entre em contato com o h\xf3spede para acertar detalhes, valores e confirmar a reserva.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL||"http://localhost:3000"}/admin/login" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; 
                    border-radius: 6px; font-weight: bold; display: inline-block;">
            🔧 Acessar Painel Administrativo
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
        
        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin: 0;">
          Este \xe9 um email autom\xe1tico do sistema de reservas do S\xedtio Recanto da Limeira.
        </p>
      </div>
    </div>
    `,d={to:process.env.NOTIFICATION_EMAIL,from:{email:process.env.NOTIFICATION_EMAIL,name:"S\xedtio Recanto da Limeira"},subject:`🏡 Nova Reserva - ${e.guestName} (${e.source})`,html:n};return await a().send(d),console.log(`✅ Email de notifica\xe7\xe3o enviado para ${process.env.NOTIFICATION_EMAIL}`),{success:!0,message:"Email enviado com sucesso"}}catch(e){return console.error("❌ Erro ao enviar email:",e),{success:!1,message:e instanceof Error?e.message:"Erro desconhecido ao enviar email"}}}process.env.SENDGRID_API_KEY&&a().setApiKey(process.env.SENDGRID_API_KEY)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972,880],()=>r(51880));module.exports=o})();