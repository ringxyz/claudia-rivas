import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './App';
export const render=(lang='es',page='home')=>renderToString(React.createElement(App,{lang,page}));