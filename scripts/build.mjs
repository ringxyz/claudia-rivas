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
for(const lang of ['es','en']){const en=lang==='en',path=en?'en/':'';const title=en?'Claudia Rivas | Entrepreneur, model & host of Claud 360':'Claudia Rivas | Empresaria, modelo y host de Claud 360';const description=en?'Meet Claudia Rivas: Miami-based entrepreneur, CEO of Enterprises Business Corp, model and host of Claud 360.':'Conoce a Claudia Rivas: empresaria en Miami, CEO de Enterprises Business Corp, modelo y host de Claud 360.';let seo=`<meta name="description" content="${description}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">`;if(site){const url=site+base;seo+=`<link rel="canonical" href="${url+path}"><link rel="alternate" hreflang="es" href="${url}"><link rel="alternate" hreflang="en" href="${url}en/"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:url" content="${url+path}"><meta property="og:image" content="${url}media/portrait.webp">`;}else seo+='<meta name="robots" content="noindex, nofollow">';seo+=`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Person',name:'Claudia Rivas',jobTitle:en?'Entrepreneur, model and host':'Empresaria, modelo y host',sameAs:['https://www.instagram.com/claudiarivasm/','https://www.youtube.com/@Claud360'],worksFor:{'@type':'Organization',name:'Enterprises Business Corp',sameAs:'https://www.instagram.com/enterprisesbusinesscorp/'}},{'@type':'WebSite',name:'Claudia Rivas',inLanguage:lang,...(site?{url:site+base+path}:{})}]})}</script>`;await mkdir(`dist/${path}`,{recursive:true});await writeFile(`dist/${path}index.html`,template.replace('lang="es"',`lang="${lang}"`).replace('<title>Claudia Rivas</title>',`<title>${title}</title>`).replace('<!--seo-->',seo).replace('<div id="root"></div>',`<div id="root">${render(lang)}</div>`));}
await writeFile('dist/robots.txt',site?`User-agent: *\nAllow: /\nSitemap: ${site+base}sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(site)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site+base}</loc></url><url><loc>${site+base}en/</loc></url></urlset>`);
await rm('.prerender',{recursive:true,force:true});


