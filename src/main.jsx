import React from 'react';
import {hydrateRoot,createRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
const root=document.getElementById('root');
const path=window.location.pathname.replace(/\/+$/,'/');
const page=path.includes('/privacidad/')||path.endsWith('/privacy/')?'privacy':path.includes('/terminos-y-condiciones/')||path.endsWith('/terms/')?'terms':'home';
const app=<App lang={document.documentElement.lang} page={page}/>;
if(root.hasChildNodes())hydrateRoot(root,app);else createRoot(root).render(app);