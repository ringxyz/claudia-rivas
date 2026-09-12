import React,{useRef,useState} from 'react';
import {email} from '../site';

const MIN_FILL_TIME=2500;
const RATE_WINDOW=10*60*1000;
const RATE_LIMIT=3;

export default function ContactForm({en}){
 const [status,setStatus]=useState(''),[busy,setBusy]=useState(false);
 const pending=useRef(false),started=useRef(Date.now());
 const endpoint=import.meta.env.VITE_CONTACT_ENDPOINT==='mailto'?'':(import.meta.env.VITE_CONTACT_ENDPOINT||'https://formsubmit.co/ajax/claud360podcast@gmail.com');
 const submit=async(e)=>{
  e.preventDefault();if(pending.current)return;
  const form=e.currentTarget,data=new FormData(form);
  if(data.get('website'))return;
  if(Date.now()-started.current<MIN_FILL_TIME){setStatus(en?'Please take a moment before sending.':'Espera unos segundos antes de enviar el formulario.');return;}
  const now=Date.now(),recent=JSON.parse(localStorage.getItem('claud360_contact_rate')||'[]').filter(time=>now-time<RATE_WINDOW);
  if(recent.length>=RATE_LIMIT){setStatus(en?'Please try again later.':'Inténtalo de nuevo más tarde.');return;}
  const payload=Object.fromEntries(data);delete payload.website;delete payload.formStartedAt;payload._captcha='true';payload._template='table';
  if(!endpoint){const subject=`${en?'Professional proposal':'Propuesta profesional'} — ${payload.name}`;const body=`${payload.message}\n\n${payload.name}\n${payload.email}\n${payload.company||''}`;window.location.href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;setStatus(en?'Your email app will open a draft. Review it and send it there.':'Tu aplicación de correo abrirá un borrador. Revísalo y envíalo desde allí.');return;}
  pending.current=true;setBusy(true);setStatus('');
  try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok||!(result.success===true||result.success==='true'))throw Error('delivery');localStorage.setItem('claud360_contact_rate',JSON.stringify([...recent,now]));setStatus(en?'The service has accepted your proposal. Thank you.':'El servicio ha aceptado tu propuesta. Gracias.');form.reset();started.current=Date.now();}catch{setStatus(en?'We could not submit your message. Please email us directly.':'No se pudo enviar el mensaje. Escríbenos directamente por correo.');}finally{pending.current=false;setBusy(false);}
 };
 return <form className="contact-form" onSubmit={submit}><div className="form-row"><label>{en?'Name':'Nombre'}<input name="name" autoComplete="name" required maxLength="120"/></label><label>{en?'Email':'Correo electrónico'}<input name="email" type="email" autoComplete="email" required maxLength="254"/></label></div><label>{en?'Company / project (optional)':'Empresa / proyecto (opcional)'}<input name="company" autoComplete="organization" maxLength="180"/></label><label>{en?'Your proposal':'Tu propuesta'}<textarea name="message" required rows="4" minLength="20" maxLength="5000"/></label><input type="hidden" name="formStartedAt" value={started.current}/><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex="-1" autoComplete="off"/></label></div><p className="form-note">{endpoint?(en?'Your information is processed securely through FormSubmit to respond to your proposal.':'Tus datos se procesan mediante FormSubmit para responder a tu propuesta.'):(en?'This form prepares an email draft in your email app. It does not send automatically.':'Este formulario prepara un borrador en tu aplicación de correo. No lo envía automáticamente.')}</p><button className="submit-button" disabled={busy}>{busy?(en?'Sending…':'Enviando…'):endpoint?(en?'Send proposal':'Enviar propuesta'):(en?'Open in my email':'Abrir en mi correo')} ↗</button><p role="status" aria-live="polite">{status}</p></form>;
}
