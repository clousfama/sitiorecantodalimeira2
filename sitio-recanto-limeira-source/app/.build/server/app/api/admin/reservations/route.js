"use strict";(()=>{var e={};e.id=516,e.ids=[516],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},24374:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>v,patchFetch:()=>y,requestAsyncStorage:()=>x,routeModule:()=>m,serverHooks:()=>f,staticGenerationAsyncStorage:()=>h});var o={};r.r(o),r.d(o,{POST:()=>g});var a=r(49303),s=r(88716),i=r(60670),n=r(87070),d=r(75571),l=r(90455),c=r(53524),p=r(36119);let u=new c.PrismaClient;async function g(e){try{let t=await (0,d.getServerSession)(l.L);if(!t||t.user?.email!=="admin@sitiorecantodalimeira.com")return n.NextResponse.json({error:"Acesso negado"},{status:401});let{guestName:r,guestEmail:o,guestPhone:a,checkIn:s,checkOut:i,guests:c,totalPrice:g,observations:m}=await e.json();if(!r||!o||!s||!i||!c)return n.NextResponse.json({error:"Campos obrigat\xf3rios: nome, email, check-in, check-out e n\xfamero de h\xf3spedes"},{status:400});let x=new Date(s),h=new Date(i);if(x>=h)return n.NextResponse.json({error:"Data de check-out deve ser posterior ao check-in"},{status:400});let f=h.getTime()-x.getTime();if(await u.reservation.findFirst({where:{AND:[{status:{in:["CONFIRMED","PENDING"]}},{OR:[{AND:[{checkIn:{lte:x}},{checkOut:{gt:x}}]},{AND:[{checkIn:{lt:h}},{checkOut:{gte:h}}]},{AND:[{checkIn:{gte:x}},{checkOut:{lte:h}}]}]}]}}))return n.NextResponse.json({error:"J\xe1 existe uma reserva confirmada para este per\xedodo"},{status:409});if((await u.blockedDate.findMany({where:{OR:[{date:{gte:x,lt:h}},{AND:[{startDate:{lte:h}},{endDate:{gte:x}}]}]}})).length>0)return n.NextResponse.json({error:"Existem datas bloqueadas no per\xedodo selecionado"},{status:409});let v=await u.reservation.create({data:{guestName:r,guestEmail:o,guestPhone:a||"",checkIn:x,checkOut:h,guests:parseInt(c),totalDays:Math.ceil(f/864e5),totalPrice:g?parseFloat(g):null,observations:m||null,status:"CONFIRMED"}});try{await (0,p.V)({guestName:r,guestEmail:o,guestPhone:a||"",checkIn:x.toISOString(),checkOut:h.toISOString(),guests:parseInt(c),observations:m||void 0,source:"Site"}),console.log("✅ Notifica\xe7\xe3o de reserva manual enviada por email")}catch(e){console.error("⚠️ Erro ao enviar notifica\xe7\xe3o de reserva manual por email:",e)}return n.NextResponse.json({success:!0,message:"Reserva criada com sucesso",reservation:v})}catch(e){return console.error("Erro ao criar reserva manual:",e),n.NextResponse.json({error:"Erro interno do servidor",details:e instanceof Error?e.message:"Erro desconhecido"},{status:500})}}let m=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/reservations/route",pathname:"/api/admin/reservations",filename:"route",bundlePath:"app/api/admin/reservations/route"},resolvedPagePath:"/home/ubuntu/vercel-deploy/sitio-recanto-limeira-source/app/app/api/admin/reservations/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:x,staticGenerationAsyncStorage:h,serverHooks:f}=m,v="/api/admin/reservations/route";function y(){return(0,i.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:h})}},90455:(e,t,r)=>{r.d(t,{L:()=>l});var o=r(53797),a=r(13539),s=r(53524),i=r(42023),n=r.n(i);let d=new s.PrismaClient,l={adapter:(0,a.N)(d),providers:[(0,o.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)return null;let t=await d.user.findUnique({where:{email:e.email}});return t&&t.password&&await n().compare(e.password,t.password)?{id:t.id,email:t.email,name:t.name,role:t.role}:null}})],session:{strategy:"jwt"},callbacks:{jwt:async({token:e,user:t})=>(t&&(e.role=t.role),e),session:async({session:e,token:t})=>(t&&e.user&&(e.user.id=t.sub,e.user.role=t.role),e)},pages:{signIn:"/admin/login"}}},36119:(e,t,r)=>{r.d(t,{V:()=>s});var o=r(72880),a=r.n(o);async function s(e){try{if(!process.env.SENDGRID_API_KEY||"YOUR_SENDGRID_API_KEY_HERE"===process.env.SENDGRID_API_KEY)return console.log("⚠️ SendGrid n\xe3o configurado - email n\xe3o ser\xe1 enviado"),{success:!1,message:"SendGrid n\xe3o configurado"};if(!process.env.NOTIFICATION_EMAIL)return console.log("⚠️ Email de notifica\xe7\xe3o n\xe3o configurado"),{success:!1,message:"Email de notifica\xe7\xe3o n\xe3o configurado"};let t=new Date(e.checkIn).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),r=new Date(e.checkOut).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),o=new Date(e.checkIn),s=new Date(e.checkOut).getTime()-o.getTime(),i=Math.ceil(s/864e5),n=`
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
    `,d={to:process.env.NOTIFICATION_EMAIL,from:{email:process.env.NOTIFICATION_EMAIL,name:"S\xedtio Recanto da Limeira"},subject:`🏡 Nova Reserva - ${e.guestName} (${e.source})`,html:n};return await a().send(d),console.log(`✅ Email de notifica\xe7\xe3o enviado para ${process.env.NOTIFICATION_EMAIL}`),{success:!0,message:"Email enviado com sucesso"}}catch(e){return console.error("❌ Erro ao enviar email:",e),{success:!1,message:e instanceof Error?e.message:"Erro desconhecido ao enviar email"}}}process.env.SENDGRID_API_KEY&&a().setApiKey(process.env.SENDGRID_API_KEY)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972,23,637,880],()=>r(24374));module.exports=o})();