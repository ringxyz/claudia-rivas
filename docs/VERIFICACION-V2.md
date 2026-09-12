# Verificación de la revisión

Revisión del 12 de septiembre de 2026. Implementación delegada a GPT-6 Astra con razonamiento bajo por indicación del usuario; dirección, preparación de medios e integración revisadas en la tarea principal.

## Medios y marca

- Logo extraído del PDF oficial, conservando dibujo y transparencia. No es una reconstrucción vectorial.
- Manrope autoalojada: 24.836 bytes, licencia incluida.
- Hero original Seedance 2.5 comprobado con ffprobe: 1920 × 1080, 24 fps. Reutilizado sin regeneración innecesaria ni cambio de identidad.
- Perfil escritorio: 241 fotogramas Full HD, 9.526.786 bytes. Perfil móvil: 241 fotogramas a 1280 × 720, 5.140.652 bytes. Solo se carga el perfil seleccionado, con peticiones y memoria limitadas.
- Fotografías responsive: ocho fotos de modelaje proporcionadas, variantes de tamaño sin ampliación artificial. Toma empresarial sustituida por original de mayor resolución con teléfonos.
- Cinco miniaturas oficiales de YouTube a 1280 × 720. Episodio 5 destacado; cuatro alternativas debajo.

## Comprobaciones

- Build cliente y HTML prerenderizado ES/EN sin errores.
- Prueba de rutas en raíz y bajo `/claudia/`, incluyendo recursos, idioma, canonical y hreflang. La comprobación con dominio reservado fue temporal; el resultado final vuelve a ser local sin dominio inventado.
- Vista escritorio 1440 × 900 y móvil 390 × 844: navegación, fotogramas en ambos sentidos y visitas repetidas, cambio de idioma, WhatsApp correcto, menú Escape, sin desbordamiento horizontal ni excepciones de JavaScript.
- Movimiento reducido: hero estático de 844 px en viewport de 844 px.
- Sin peticiones a YouTube, Instagram o ytimg antes de pulsar reproducción. Miniaturas servidas localmente.
- Reproducción real de YouTube comprobada en Edge con acceso de red: episodio destacado reproduce dentro del iframe. La primera prueba restringida dio ERR_NETWORK_ACCESS_DENIED; se resolvió al realizar la comprobación con acceso de red. No fue una restricción del canal.
- Selección de episodio y parada del iframe anterior comprobadas tras asentarse el scroll. En automatización hay que esperar que termine el desplazamiento suave antes de hacer clic en la miniatura.
- Formulario validado con respuestas simuladas. Nunca se remitió un correo de prueba real. FormSubmit y la recepción deben activarse/verificarse antes de depender del formulario en producción.

## Auditoría local

Lighthouse móvil: rendimiento 98/100, accesibilidad 100/100 y buenas prácticas 100/100. LCP en la primera pasada: 2,3 segundos. Son mediciones locales de laboratorio, no resultados garantizados de hosting o de campo. El INP real requiere datos de visitantes.

El SEO de la vista local no representa la publicación: está deliberadamente noindex y robots Disallow porque falta el dominio definitivo. El build con SITE_URL/PRODUCTION_RELEASE genera los enlaces canónicos, idiomas y sitemap. No subir el ZIP de vista local como publicación indexable sin reconstruir con el dominio real.

## Dependencias pendientes

1. Dominio y destino de hosting para generar distribución de producción con URLs reales.
2. Activación del correo enterprisesbusinesscorp@gmail.com en FormSubmit y prueba de recepción autorizada. WhatsApp ya está configurado con el número confirmado.

No se ha creado un repositorio, publicado un sitio ni enviado mensajes a terceros.
