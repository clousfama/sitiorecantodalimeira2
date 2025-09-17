"use strict";(()=>{var e={};e.id=984,e.ids=[984],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},47086:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>b,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>u,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g});var o={};r.r(o),r.d(o,{POST:()=>p});var a=r(49303),s=r(88716),n=r(60670),i=r(87070),d=r(75571),l=r(90455),c=r(61086);async function p(e){try{let t=await (0,d.getServerSession)(l.L);if(!t||t.user?.email!=="admin@sitiorecantodalimeira.com")return i.NextResponse.json({error:"Acesso negado"},{status:401});let{icalUrl:r}=await e.json();if(!r)return i.NextResponse.json({error:"URL do iCal \xe9 obrigat\xf3ria"},{status:400});await (0,c.Hy)();let o=await (0,c.Vf)(r);return i.NextResponse.json(o)}catch(e){return console.error("Erro na API de sync:",e),i.NextResponse.json({error:"Erro interno do servidor",details:e instanceof Error?e.message:"Erro desconhecido"},{status:500})}}let u=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/sync-airbnb/route",pathname:"/api/admin/sync-airbnb",filename:"route",bundlePath:"app/api/admin/sync-airbnb/route"},resolvedPagePath:"/home/ubuntu/vercel-deploy/sitio-recanto-limeira-source/app/app/api/admin/sync-airbnb/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:x}=u,b="/api/admin/sync-airbnb/route";function y(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}},90455:(e,t,r)=>{r.d(t,{L:()=>l});var o=r(53797),a=r(13539),s=r(53524),n=r(42023),i=r.n(n);let d=new s.PrismaClient,l={adapter:(0,a.N)(d),providers:[(0,o.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)return null;let t=await d.user.findUnique({where:{email:e.email}});return t&&t.password&&await i().compare(e.password,t.password)?{id:t.id,email:t.email,name:t.name,role:t.role}:null}})],session:{strategy:"jwt"},callbacks:{jwt:async({token:e,user:t})=>(t&&(e.role=t.role),e),session:async({session:e,token:t})=>(t&&e.user&&(e.user.id=t.sub,e.user.role=t.role),e)},pages:{signIn:"/admin/login"}}},36119:(e,t,r)=>{r.d(t,{V:()=>s});var o=r(72880),a=r.n(o);async function s(e){try{if(!process.env.SENDGRID_API_KEY||"YOUR_SENDGRID_API_KEY_HERE"===process.env.SENDGRID_API_KEY)return console.log("⚠️ SendGrid n\xe3o configurado - email n\xe3o ser\xe1 enviado"),{success:!1,message:"SendGrid n\xe3o configurado"};if(!process.env.NOTIFICATION_EMAIL)return console.log("⚠️ Email de notifica\xe7\xe3o n\xe3o configurado"),{success:!1,message:"Email de notifica\xe7\xe3o n\xe3o configurado"};let t=new Date(e.checkIn).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),r=new Date(e.checkOut).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),o=new Date(e.checkIn),s=new Date(e.checkOut).getTime()-o.getTime(),n=Math.ceil(s/864e5),i=`
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
                ${n} ${1===n?"dia":"dias"}
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
    `,d={to:process.env.NOTIFICATION_EMAIL,from:{email:process.env.NOTIFICATION_EMAIL,name:"S\xedtio Recanto da Limeira"},subject:`🏡 Nova Reserva - ${e.guestName} (${e.source})`,html:i};return await a().send(d),console.log(`✅ Email de notifica\xe7\xe3o enviado para ${process.env.NOTIFICATION_EMAIL}`),{success:!0,message:"Email enviado com sucesso"}}catch(e){return console.error("❌ Erro ao enviar email:",e),{success:!1,message:e instanceof Error?e.message:"Erro desconhecido ao enviar email"}}}process.env.SENDGRID_API_KEY&&a().setApiKey(process.env.SENDGRID_API_KEY)},61086:(e,t,r)=>{r.d(t,{Hy:()=>c,Vf:()=>l});var o=r(53524),a=r(3442),s=r.n(a),n=r(36119);let i=new o.PrismaClient;async function d(e){try{let t=s().parseICS(e),r=[];return Object.values(t).forEach(e=>{if("VEVENT"===e.type&&e.start&&e.end){let t=new Date(e.start).toISOString().split("T")[0],o=new Date(e.end).toISOString().split("T")[0];r.push({startDate:t,endDate:o,summary:e.summary||"Reserva Airbnb",uid:e.uid||`airbnb-${t}-${o}`})}}),r}catch(e){throw console.error("Erro ao processar iCal:",e),e}}async function l(e){try{let t=await fetch(e);if(!t.ok)throw Error(`Erro ao buscar iCal: ${t.status}`);let r=await t.text(),o=await d(r),a=0;for(let e of o)if(!await i.blockedDate.findFirst({where:{startDate:new Date(e.startDate),endDate:new Date(e.endDate),reason:{contains:"Airbnb"}}})){await i.blockedDate.create({data:{startDate:new Date(e.startDate),endDate:new Date(e.endDate),reason:`Reserva Airbnb: ${e.summary}`,createdBy:"airbnb-sync"}});try{let t=e.summary.includes("Reserved")?e.summary.replace("Reserved","").trim():e.summary||"H\xf3spede Airbnb";await (0,n.V)({guestName:t,guestEmail:"N\xe3o informado via Airbnb",guestPhone:"Consultar no Airbnb",checkIn:new Date(e.startDate).toISOString(),checkOut:new Date(e.endDate).toISOString(),guests:4,observations:`Reserva importada automaticamente do Airbnb. UID: ${e.uid}`,source:"Airbnb"}),console.log(`✅ Notifica\xe7\xe3o enviada para nova reserva Airbnb: ${t}`)}catch(e){console.error("⚠️ Erro ao enviar notifica\xe7\xe3o de reserva Airbnb por email:",e)}a++}return{success:!0,bookingsAdded:a,message:`Sincroniza\xe7\xe3o conclu\xedda. ${a} novas reservas adicionadas.`}}catch(e){return console.error("Erro na sincroniza\xe7\xe3o:",e),{success:!1,bookingsAdded:0,message:`Erro na sincroniza\xe7\xe3o: ${e instanceof Error?e.message:"Erro desconhecido"}`}}}async function c(){let e=new Date;e.setDate(e.getDate()-30),await i.blockedDate.deleteMany({where:{endDate:{lt:e},createdBy:"airbnb-sync"}})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972,23,637,880,442],()=>r(47086));module.exports=o})();