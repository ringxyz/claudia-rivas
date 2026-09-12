# Claudia Rivas

Landing editorial blanca y azul marino para Claudia Rivas: negocios, Claud 360 y moda. React 19, Vite, motion/react y Manrope autoalojada. Usa el logo oficial transparente del brandbook.

## Vista local

```sh
npm ci
npm run dev
```

## Build estático

```sh
npm run build
npm run preview
```

El build genera HTML completo en español (`dist/index.html`) e inglés (`dist/en/index.html`), con interacciones hidratadas. No requiere base de datos. `dist` es una vista local noindex hasta configurar un dominio real.

Define `SITE_URL` con el origen HTTPS confirmado, `BASE_PATH=/` (o la subruta del repositorio) y `PRODUCTION_RELEASE=true` antes de generar una distribución de producción. El build bloquea una publicación marcada como producción sin dominio. No se ha creado repositorio ni desplegado.

## Contenido y contacto

- Textos largos ES/EN: `src/content/es.js` y `src/content/en.js`; etiquetas y composición: `src/App.jsx`.
- Episodios: `src/content/episodes.json`. `npm run update:episodes` consulta el feed oficial y descarga nuevas miniaturas locales antes de guardar. Conserva los datos verificados ante fallos. `UPDATE_EPISODES=true` activa ese paso durante build; no se actualiza en tiempo real en el navegador.
- El episodio seleccionado se reproduce con el reproductor oficial de YouTube dentro de la página. Las miniaturas inferiores cambian el episodio del reproductor.
- Fotos y secuencias optimizadas: `public/media`. El hero usa 241 fotogramas HD con nitidez reforzada y carga solo una pequeña ventana alrededor del punto actual del scroll. Originales preservados localmente y excluidos de Git.
- La galería de moda abre cada fotografía en un lightbox accesible con fondo translúcido, navegación anterior/siguiente, flechas de teclado y cierre con Escape.
- Logo oficial: `public/brand/claudia-rivas.png`; fuente: `public/fonts/manrope.woff2`.
- Correo confirmado: Claud360podcast@gmail.com. El formulario está integrado con FormSubmit para remitir propuestas a esa dirección. La activación del destinatario y la recepción real están pendientes de verificación. El enlace de correo ofrece un contacto alternativo.
- WhatsApp confirmado: +17867028767. Abre una conversación con borrador sin enviarlo.

FormSubmit está configurado por defecto; `VITE_CONTACT_ENDPOINT` permite cambiarlo, como indica `.env.example`. Usa el valor `mailto` para abrir borradores sin servicio externo. Requiere activación del destinatario y prueba de recepción autorizada antes de utilizarla en producción. No se enviaron mensajes de prueba ni se verificó entrega.

Consulta `docs/EDITING-AND-DEPLOYMENT.md` para edición, episodios, formulario y alojamiento raíz/subruta. Las credenciales nunca deben incluirse en el bundle ni en GitHub.

