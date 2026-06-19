# FundaDron - Contexto del proyecto (CLAUDE.md)

Lee este archivo al empezar cualquier chat. Resume que es FundaDron y como esta
montado, para no tener que repetir el contexto cada vez.

## Que es
FundaDron es una tienda online de **fundas/estuches para drones**.
La web es **estatica** (HTML/CSS/JS, sin framework ni paso de build).

## Dominio y correo
- Dominio: **fundadron.com** (y www.fundadron.com).
- Correo de contacto: **hola@fundadron.com**.
  - Montado con **Cloudflare Email Routing** (Opcion A): reenvia todo lo que
    llega a hola@fundadron.com al Gmail del dueno. Es solo recepcion/reenvio
    (para ENVIAR como hola@ haria falta Zoho Mail o Google Workspace).
  - Antes el contacto era fundadron@gmail.com (ya sustituido en toda la web).

## Repositorio (GitHub)
- Repo: **https://github.com/withdemon1/fundadron**
- Rama principal: **main**
- Ruta local en el servidor: **/root/fundadron** (contenedor LXC 105 de Proxmox).
- IMPORTANTE: ahora mismo hay **1 commit local SIN subir**:
  4e91583 "Cambiar correo de contacto a hola@fundadron.com".
  Falta hacer `git push` (y volver a desplegar).

## Hosting / despliegue (Cloudflare)
- Se sirve como **Cloudflare Worker de assets estaticos** (config en wrangler.jsonc):
  - name: fundadron
  - assets.directory: "./" (sirve toda la raiz del repo)
  - routes: dominios propios fundadron.com y www.fundadron.com
    (Cloudflare gestiona el DNS y el HTTPS automaticamente).
- .assetsignore excluye del despliegue: .git, .gitignore, .assetsignore,
  .wrangler, wrangler.jsonc, README.md, LEEME.txt.
- _headers: cabeceras de seguridad (nosniff, referrer-policy) y de cache
  (HTML/CSS/JS sin cache; imagenes y SVG con cache de 30 dias).
- CONFIRMAR el metodo exacto de publicacion: si Cloudflare esta conectado al
  repo de GitHub, basta `git push` a main; si no, se despliega con
  `npx wrangler deploy`. (LEEME.txt menciona Hostinger, pero es del montaje
  antiguo; ahora el hosting es Cloudflare.)

## Estructura de archivos
- index.html  - pagina principal con el catalogo de productos.
- legal.html  - aviso legal (pendiente de rellenar datos fiscales reales).
- styles.css, main.js - estilos y logica.
- assets/img/ - fotos de producto (~54 archivos, WebP; 2 fotos por producto,
  al pasar el raton se ve la segunda).
- assets/*.svg + logo cuadrado 1080x1080 para el perfil de Instagram.
- lib/ - recursos auxiliares.
- robots.txt, sitemap.xml - SEO.

## Decisiones ya tomadas (no rehacer salvo que se pida)
- Envio: **solo punto de recogida** (se quito la entrega a domicilio).
- SEO: URLs canonical, Open Graph, datos estructurados (Schema) con
  shippingDetails y hasMerchantReturnPolicy en los productos; sitemap y
  robots apuntando a fundadron.com.
- Aviso legal sin titular/NIF ni textos entre corchetes (pendiente poner los
  datos reales del titular).

## Como trabajar aqui
- Web estatica: editar HTML/CSS/JS directamente, sin build.
- Mantener el correo como hola@fundadron.com en todo el sitio.
- Tras cambios: git add -A, git commit -m "...", git push, y desplegar.
- Si se cambia de dominio, actualizar SEO: sitemap.xml, robots.txt y las
  metaetiquetas/canonical.

## Pendientes conocidos
- [ ] git push del commit del correo + desplegar en Cloudflare.
- [ ] Completar datos fiscales reales en legal.html.
- [ ] (Opcional) Alta en Google Search Console y Google Merchant Center.
