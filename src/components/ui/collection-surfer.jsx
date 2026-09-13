import React,{useCallback,useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {motion,useScroll,useTransform} from 'motion/react';
import {asset} from '../../site';

const count=26;
const label=(index,en)=>`${en?'Claudia Rivas, fashion photograph':'Claudia Rivas, fotografía de moda'} ${index+1}`;

function Card({index,progress,en,onOpen}){
 const last=count-1;
 const z=useTransform(progress,[0,1],[-index*240,(last-index)*240]);
 const x=useTransform(progress,[0,1],[index*190,(index-last)*190]);
 const y=useTransform(progress,[0,1],[-index*58,(last-index)*58]);
 const number=String(index+1).padStart(2,'0');
 return <motion.figure className="surfer-card" style={{x,y,z,rotateY:-32}}><button className="surfer-open" onClick={()=>onOpen(index)} aria-label={`${en?'Open photograph':'Abrir fotografía'} ${index+1}`}><img src={asset(`media/model-${number}.jpg`)} sizes="(max-width:700px) 78vw, 320px" width="480" height="640" loading="lazy" alt={label(index,en)}/><span aria-hidden="true">↗</span></button><figcaption>{number} / {count}</figcaption></motion.figure>;
}

function Lightbox({index,en,onClose,onChange}){
 const closeRef=useRef(null);
 useEffect(()=>{const previous=document.activeElement,root=document.getElementById('root'),wasInert=root?.hasAttribute('inert');const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';root?.setAttribute('inert','');closeRef.current?.focus();const keys=e=>{if(e.key==='Escape')onClose();if(e.key==='ArrowLeft')onChange(-1);if(e.key==='ArrowRight')onChange(1);if(e.key==='Tab'){const controls=[...document.querySelectorAll('.lightbox button')];if(!controls.length)return;const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};document.addEventListener('keydown',keys);return()=>{document.removeEventListener('keydown',keys);document.body.style.overflow=oldOverflow;if(!wasInert)root?.removeAttribute('inert');previous?.focus?.();};},[onClose,onChange]);
 const number=String(index+1).padStart(2,'0');
 return createPortal(<div className="lightbox" role="dialog" aria-modal="true" aria-label={en?'Fashion gallery':'Galería de moda'} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label={en?'Close gallery':'Cerrar galería'}>×</button><button className="lightbox-arrow lightbox-prev" onClick={()=>onChange(-1)} aria-label={en?'Previous photograph':'Fotografía anterior'}>←</button><figure><img src={asset(`media/model-${number}.jpg`)} alt={label(index,en)}/><figcaption>{number} / {count}</figcaption></figure><button className="lightbox-arrow lightbox-next" onClick={()=>onChange(1)} aria-label={en?'Next photograph':'Fotografía siguiente'}>→</button></div>,document.body);
}

export default function CollectionSurfer({en}){
 const ref=useRef(null),track=useRef(null);const [open,setOpen]=useState(null);
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
 const move=d=>track.current?.scrollBy({left:d*track.current.clientWidth*.85,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
 const close=useCallback(()=>setOpen(null),[]),change=useCallback(d=>setOpen(i=>(i+d+count)%count),[]);
 return <><div className="surfer" ref={ref}><div className="surfer-stage"><div className="surfer-scene" ref={track}>{Array.from({length:count},(_,i)=><Card key={i} index={i} progress={scrollYProgress} en={en} onOpen={setOpen}/>)}</div><div className="surfer-controls"><button onClick={()=>move(-1)} aria-label={en?'Previous photograph':'Fotografía anterior'}>←</button><span>{en?'Fashion. Image. Expression.':'Moda. Imagen. Expresión.'}</span><button onClick={()=>move(1)} aria-label={en?'Next photograph':'Fotografía siguiente'}>→</button></div></div></div>{open!==null&&<Lightbox index={open} en={en} onClose={close} onChange={change}/>}</>;
}
