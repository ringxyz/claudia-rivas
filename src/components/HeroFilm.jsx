import React,{useRef,useState} from 'react';
import {useScroll,useMotionValueEvent,useReducedMotion} from 'motion/react';
import {asset} from '../site';

export default function HeroFilm({en}){
 const root=useRef(null),video=useRef(null),videoReady=useRef(false);
 const reduce=useReducedMotion();
 const [videoLoaded,setVideoLoaded]=useState(false);
 const {scrollYProgress}=useScroll({target:root,offset:['start start','end end']});
 const syncVideo=(progress)=>{const node=video.current;if(!videoReady.current||!node?.duration||!Number.isFinite(node.duration))return;const target=Math.min(node.duration-.02,Math.max(0,progress*node.duration));if(Math.abs(node.currentTime-target)>.015)node.currentTime=target;};
 useMotionValueEvent(scrollYProgress,'change',p=>{const progress=p<.08?0:p>.94?1:(p-.08)/.86;if(!reduce)syncVideo(progress);root.current?.style.setProperty('--hint',p<.12?'1':'0');root.current?.style.setProperty('--copy',String(Math.max(0,1-p/.28)));});
 const videoUrl=asset('media/claudia-muestra.mp4');
 return <section id="inicio" className={`film ${reduce?'reduced':''}`} ref={root} aria-label={en?'Claudia in a white studio':'Claudia en un estudio blanco'}><div className="film-stage"><video ref={video} className={`hero-video ${videoLoaded?'ready':''}`} src={videoUrl} muted playsInline preload="auto" onLoadedMetadata={()=>{videoReady.current=true;setVideoLoaded(true);syncVideo(scrollYProgress.get());}} onError={()=>{videoReady.current=false;setVideoLoaded(false);}} aria-label={en?'Claudia Rivas hero film':'Vídeo principal de Claudia Rivas'}/><div className="film-fade"/><div className="film-copy"><p>{en?'Entrepreneur · Model · Host':'Empresaria · Modelo · Host'}</p><h1>Claudia Rivas.<br/><span>{en?'Vision in motion.':'Visión en movimiento.'}</span></h1></div><div className="scroll-cue">{en?'Scroll to meet me':'Desliza para conocerme'}<span aria-hidden="true">↓</span></div><a className="skip" href="#sobre-mi">{en?'Skip introduction':'Saltar introducción'} ↗</a></div></section>;
}
