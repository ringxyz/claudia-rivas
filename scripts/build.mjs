import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {build} from 'vite';
const base=(process.env.BASE_PATH||'/').replace(/\/?$/,'/');
const site=(process.env.SITE_URL||'https://claudrivas.com').replace(/\/$/,'');
if(process.env.PRODUCTION_RELEASE==='true'&&!site)throw Error('SITE_URL is required for a production release.');
if(site&&(!/^https:\/\//.test(site)||new URL(site).origin!==site))throw Error('SITE_URL must be an HTTPS origin.');
if(process.env.UPDATE_EPISODES==='true')await import('./update-episodes.mjs');
await build();
await build({build:{ssr:'src/entry-server.jsx',outDir:'.prerender',emptyOutDir:true}});
const {render}=await import('../.prerender/entry-server.js');
const template=await readFile('dist/index.html','utf8');
const routes=[
 {lang:'es',path:'',page:'home',title:'Claudia Rivas Miami | Empresaria, modelo y host de Claud 360',description:'Conoce a Claudia Rivas en Miami: empresaria, modelo, CEO de Enterprises Business Corp y host de Claud 360.'},
 {lang:'en',path:'en/',page:'home',title:'Claudia Rivas Miami | Entrepreneur, model & Claud 360 host',description:'Meet Claudia Rivas in Miami: entrepreneur, model, CEO of Enterprises Business Corp and host of Claud 360.'},
 {lang:'es',path:'privacidad/',page:'privacy',title:'Política de privacidad | Claudia Rivas',description:'Información sobre privacidad y protección de datos de claudrivas.com.'},
 {lang:'en',path:'en/privacy/',page:'privacy',title:'Privacy policy | Claudia Rivas',description:'Privacy and data protection information for claudrivas.com.'},
 {lang:'es',path:'terminos-y-condiciones/',page:'terms',title:'Términos y condiciones | Claudia Rivas',description:'Condiciones de uso de claudrivas.com.'},
 {lang:'en',path:'en/terms/',page:'terms',title:'Terms of use | Claudia Rivas',description:'Terms and conditions for using claudrivas.com.'}
];
const relativePaths={home:['','en/'],privacy:['privacidad/','en/privacy/'],terms:['terminos-y-condiciones/','en/terms/']};
for(const route of routes){
 const [esPath,enPath]=relativePaths[route.page];
 const url=site+base+route.path;
 let seo=`<meta name="description" content="${route.description}"><meta name="keywords" content="Claudia Rivas, Claudia Rivas Miami, empresaria Miami, modelo Miami, Claud 360, Enterprises Business Corp"><meta property="og:title" content="${route.title}"><meta property="og:description" content="${route.description}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">`;
 if(site){seo+=`<link rel="canonical" href="${url}"><link rel="alternate" hreflang="es" href="${site+base+esPath}"><link rel="alternate" hreflang="en" href="${site+base+enPath}"><link rel="alternate" hreflang="x-default" href="${site+base}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site+base}media/portrait.webp">`;}else seo+='<meta name="robots" content="noindex, nofollow">';
 const schema=route.page==='home'?{'@type':'WebSite',name:'Claudia Rivas',inLanguage:route.lang,keywords:route.lang==='en'?'Claudia Rivas Miami, entrepreneur, model, Claud 360':'Claudia Rivas Miami, empresaria, modelo, Claud 360',...(site?{url}:{})}:{'@type':'WebPage',name:route.title,inLanguage:route.lang,...(site?{url}:{})};
 seo+=`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Person',name:'Claudia Rivas',jobTitle:route.lang==='en'?'Entrepreneur, model and host':'Empresaria, modelo y host',sameAs:['https://www.instagram.com/claudiarivasm/','https://www.youtube.com/@Claud360'],worksFor:{'@type':'Organization',name:'Enterprises Business Corp',sameAs:'https://www.instagram.com/enterprisesbusinesscorp/' }},schema]})}</script>`;
 await mkdir(`dist/${route.path}`,{recursive:true});
 await writeFile(`dist/${route.path}index.html`,template.replace('lang="es"',`lang="${route.lang}"`).replace('<title>Claudia Rivas</title>',`<title>${route.title}</title>`).replace('<!--seo-->',seo).replace('<div id="root"></div>',`<div id="root">${render(route.lang,route.page)}</div>`));
}
await writeFile('dist/robots.txt',site?`User-agent: *\nAllow: /\nSitemap: ${site+base}sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(site)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${site+base+r.path}</loc></url>`).join('')}</urlset>`);
await rm('.prerender',{recursive:true,force:true});