import React,{useEffect,useRef,useState} from 'react';
import {useScroll,useMotionValueEvent,useReducedMotion} from 'motion/react';
import {asset} from '../site';

export default function HeroFilm({en}){
 const root=useRef(null),canvas=useRef(null),engine=useRef(null);
 const reduce=useReducedMotion();
 const [ready,setReady]=useState(false);
 const {scrollYProgress}=useScroll({target:root,offset:['start start','end end']});

 useEffect(()=>{
  if(reduce||navigator.connection?.saveData){root.current?.classList.add('reduced');return;}
  let disposed=false,manifest,wanted=0,last=-1,hasDrawn=false;
  const cache=new Map(),inflight=new Map(),attempts=new Map();
  const ctx=canvas.current.getContext('2d');
  const draw=()=>{
   if(disposed||!manifest||!cache.size)return;
   let index=wanted;
   if(!cache.has(index))index=[...cache.keys()].reduce((a,b)=>Math.abs(a-wanted)<Math.abs(b-wanted)?a:b);
   const frame=cache.get(index),cv=canvas.current;
   const sourceRatio=Math.min(manifest.width/cv.clientWidth,manifest.height/cv.clientHeight);
   const ratio=Math.max(.5,Math.min(devicePixelRatio||1,sourceRatio));
   const w=Math.round(cv.clientWidth*ratio),h=Math.round(cv.clientHeight*ratio);
   if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
   const fit=Math.max(w/frame.width,h/frame.height),fw=frame.width*fit,fh=frame.height*fit;
   ctx.drawImage(frame,(w-fw)/2,(h-fh)/2,fw,fh);
   cv.dataset.frame=String(index);
   if(!hasDrawn){hasDrawn=true;setReady(true);}
  };
  const loadFrame=i=>{
   if(i<0||i>=manifest.count||cache.has(i)||inflight.has(i)||(attempts.get(i)||0)>=2)return;
   const controller=new AbortController();inflight.set(i,controller);attempts.set(i,(attempts.get(i)||0)+1);
   const fileIndex=i+(manifest.startIndex||0);
   const url=asset(manifest.pattern.replace('{index}',String(fileIndex).padStart(4,'0')));
   fetch(url,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('frame');return r.blob();}).then(createImageBitmap).then(bitmap=>{if(disposed||Math.abs(i-wanted)>16)bitmap.close();else{attempts.delete(i);cache.set(i,bitmap);draw();}}).catch(error=>{if(error.name==='AbortError')attempts.set(i,Math.max(0,(attempts.get(i)||1)-1));}).finally(()=>{inflight.delete(i);pump();});
  };
  const pump=()=>{
   if(disposed||!manifest)return;
   for(const [i,bitmap] of cache)if(Math.abs(i-wanted)>16){bitmap.close();cache.delete(i);}
   for(const [i,controller] of inflight)if(Math.abs(i-wanted)>16)controller.abort();
   const candidates=[wanted];for(let distance=1;distance<=8;distance++)candidates.push(wanted+distance,wanted-distance);
   for(const index of candidates){if(inflight.size>=6)break;loadFrame(index);}
  };
  const update=progress=>{if(!manifest)return;const normalized=progress<.025?0:progress>.985?1:(progress-.025)/.96;wanted=Math.round(normalized*(manifest.count-1));if(last!==wanted){last=wanted;draw();pump();}};
  engine.current={update};
  fetch(asset(matchMedia('(max-width:600px)').matches?'media/sequence-mobile.json':'media/sequence.json')).then(response=>{if(!response.ok)throw Error('sequence');return response.json();}).then(data=>{manifest=data;update(scrollYProgress.get());}).catch(()=>root.current?.classList.add('reduced'));
  const resize=new ResizeObserver(draw);resize.observe(canvas.current);
  return()=>{disposed=true;resize.disconnect();inflight.forEach(controller=>controller.abort());cache.forEach(bitmap=>bitmap.close());engine.current=null;};
 },[reduce]);

 useMotionValueEvent(scrollYProgress,'change',progress=>{
  engine.current?.update(progress);
  root.current?.style.setProperty('--poster-opacity',progress<.018?'1':'0');
  root.current?.style.setProperty('--hint',progress<.12?'1':'0');
  root.current?.style.setProperty('--copy',String(Math.max(0,1-progress/.28)));
 });

 return <section id="inicio" className={`film ${reduce?'reduced':''}`} ref={root} aria-label={en?'Claudia in a white studio':'Claudia en un estudio blanco'}><div className="film-stage"><img className="hero-start" src={asset('media/hero-start.png')} width="1664" height="939" alt={en?'Claudia Rivas seated in a navy suit':'Claudia Rivas sentada con traje azul marino'} fetchPriority="high"/><canvas ref={canvas} className={ready?'ready':''} aria-hidden="true"/><div className="film-fade"/><div className="film-copy"><p>{en?'Entrepreneur · Model · Host':'Empresaria · Modelo · Host'}</p><h1>Claudia Rivas.<br/><span>{en?'Vision in motion.':'Visión en movimiento.'}</span></h1></div><div className="scroll-cue">{en?'Scroll to meet me':'Desliza para conocerme'}<span aria-hidden="true">↓</span></div><a className="skip" href="#sobre-mi">{en?'Skip introduction':'Saltar introducción'} ↗</a></div></section>;
}
