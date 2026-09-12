import React from 'react';
import {asset} from '../site';

const waikaWhatsapp='34641219538';

export default function SiteFooter({en=false}){
 const home=asset(en?'en/':'');
 const privacy=asset(en?'en/privacy/':'privacidad/');
 const terms=asset(en?'en/terms/':'terminos-y-condiciones/');
 const message=encodeURIComponent(en?'Hello Waika Studios, I would like to discuss a website project.':'Hola Waika Studios, me gustaría hablar sobre un proyecto web.');
 return <footer><a href={home} className="wordmark"><img src={asset('brand/claudia-rivas.png')} width="1062" height="200" alt="Claudia Rivas"/></a><div className="social-links"><a href="https://www.instagram.com/claudiarivasm/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.youtube.com/@Claud360" target="_blank" rel="noreferrer">YouTube ↗</a><a href={privacy}>{en?'Privacy':'Privacidad'}</a><a href={terms}>{en?'Terms':'Términos'}</a></div><span>Miami, Florida · © 2026 Claudia Rivas</span><a className="footer-credit" href={`https://wa.me/${waikaWhatsapp}?text=${message}`} target="_blank" rel="noreferrer">{en?'Website by Waika Studios':'Página realizada por Waika Studios'} ↗</a><a href={home}>{en?'Back to top':'Volver arriba'} ↑</a></footer>;
}
