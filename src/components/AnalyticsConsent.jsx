import React,{useEffect,useState} from 'react';

const measurementId=import.meta.env.VITE_GA_MEASUREMENT_ID||'G-6FX7MLLCB4';
const consentKey='claudia-rivas-analytics-consent';

function startAnalytics(){
 if(!measurementId||typeof window==='undefined'||window.__claudiaAnalyticsStarted)return;
 window.__claudiaAnalyticsStarted=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag('js',new Date());
 window.gtag('config',measurementId,{anonymize_ip:true,send_page_view:true});
 const script=document.createElement('script');
 script.async=true;
 script.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
 document.head.appendChild(script);
}

export default function AnalyticsConsent({en=false}){
 const [choice,setChoice]=useState('loading');
 useEffect(()=>{
  const saved=window.localStorage.getItem(consentKey);
  setChoice(saved||'pending');
  if(saved==='granted')startAnalytics();
 },[]);
 useEffect(()=>{
  if(choice!=='granted')return;
  const pageView=()=>window.gtag?.('event','page_view',{page_location:window.location.href,page_path:`${window.location.pathname}${window.location.hash}`});
  window.addEventListener('hashchange',pageView);
  return()=>window.removeEventListener('hashchange',pageView);
 },[choice]);
 const decide=value=>{window.localStorage.setItem(consentKey,value);setChoice(value);if(value==='granted')startAnalytics();};
 if(choice!=='pending')return null;
 return <aside className="cookie-consent" role="dialog" aria-live="polite" aria-label={en?'Analytics preferences':'Preferencias de analítica'}><p>{en?'We use Google Analytics, with your permission, to understand visits and improve this website.':'Usamos Google Analytics, con tu permiso, para conocer las visitas y mejorar esta web.'} <a href="#privacidad">{en?'Privacy details':'Detalles de privacidad'}</a>.</p><div><button type="button" className="cookie-secondary" onClick={()=>decide('denied')}>{en?'Reject':'Rechazar'}</button><button type="button" className="cookie-primary" onClick={()=>decide('granted')}>{en?'Accept':'Aceptar'}</button></div></aside>;
}

