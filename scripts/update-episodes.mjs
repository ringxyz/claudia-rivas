import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
const path='src/content/episodes.json';
try{
 const response=await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UCdKP6yC16VXrzyjoglTG6rQ',{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error(`HTTP ${response.status}`);
 const xml=await response.text(),decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
 const entries=[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(x=>({id:x[1].match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1],title:decode(x[1].match(/<title>([\s\S]*?)<\/title>/)?.[1]||'')})).filter(x=>/^[\w-]{11}$/.test(x.id)&&/Claud\s*360.*Ep\.?\s*\d/i.test(x.title)).slice(0,5);
 if(entries.length!==5)throw Error('Feed does not contain five validated episodes');
 const current=JSON.parse((await readFile(path,'utf8')).replace(/^\uFEFF/,''));
 for(const item of entries){const existing=current.find(x=>x.id===item.id);if(existing){item.thumbnail=existing.thumbnail||`media/podcast-${item.id}.webp`;await readFile(`public/${item.thumbnail}`);continue;}const image=await fetch(`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,{signal:AbortSignal.timeout(10000)});if(!image.ok||!image.headers.get('content-type')?.includes('image/jpeg'))throw Error(`Invalid thumbnail: ${item.id}`);const bytes=Buffer.from(await image.arrayBuffer());if(bytes.length<1000||bytes.length>500000||bytes[0]!==255||bytes[1]!==216)throw Error('Invalid JPEG');item.thumbnail=`media/podcast-${item.id}.jpg`;await mkdir('public/media',{recursive:true});await writeFile(`public/${item.thumbnail}`,bytes);}
 await writeFile(`${path}.tmp`,JSON.stringify(entries,null,2));await rename(`${path}.tmp`,path);console.log('Episodes and local thumbnails updated.');
}catch(error){JSON.parse((await readFile(path,'utf8')).replace(/^\uFEFF/,''));console.warn(`Keeping last verified episodes: ${error.message}`);}
