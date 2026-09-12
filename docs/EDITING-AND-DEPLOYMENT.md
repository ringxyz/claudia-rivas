# Editing and static publishing

The site uses React, Vite and motion/react. There is no database. Run `npm ci`, then `npm run build`; `npm run preview` serves the prerendered result. Spanish HTML is in `dist/index.html`, English in `dist/en/index.html`.

## Content
- Edit page text in `src/App.jsx` (short interface labels) and `src/content/es.js` / `en.js` (long copy and FAQs).
- Edit five verified episodes in `src/content/episodes.json`. `npm run update:episodes` checks the official YouTube channel feed, filters full numbered episodes and preserves the last valid file on failure. Run it before building when an episode update is wanted. It does not run in the visitor’s browser or imply live updates.
- Optimized photographs, both hero manifests and sequences are in `public/media`. Photography originals remain local. The logo is the official transparent extraction in `public/brand/claudia-rivas.png`. Manrope is self-hosted.
- The adapted CollectionSurfer lives in `src/components/ui/collection-surfer.jsx`, using the existing motion/react dependency and native CSS. No Tailwind/shadcn/TypeScript migration is required.
- CollectionSurfer includes a portal-based lightbox with focus containment, inert page content, previous/next controls, arrow-key navigation and Escape close.
- Claud 360 uses the standard YouTube embed player. Selecting a thumbnail replaces the player with that episode; the external YouTube link remains available as a fallback.

## Contact
The confirmed address is enterprisesbusinesscorp@gmail.com. By default the form validates fields and submits to FormSubmit AJAX. Recipient activation and actual receipt remain unverified. The mailto link is an alternative. Set VITE_CONTACT_ENDPOINT=mailto for email drafts without the external service.

Default FormSubmit integration: `VITE_CONTACT_ENDPOINT=https://formsubmit.co/ajax/enterprisesbusinesscorp@gmail.com` is used unless overridden in the build environment. FormSubmit is a third-party service; the recipient must activate the address using the service’s confirmation email before relying on delivery. This integration has not sent any real test message and recipient activation/delivery are unverified. Before publication, the owner should authorize a test, activate the email if prompted, and verify receipt. The handler checks HTTP status and the service’s JSON success result. Other endpoints must accept JSON fields name, email, company and message and return JSON with `success: true` (boolean or string). Never put SMTP credentials or API secrets in VITE variables. Direct mailto remains available.

WhatsApp opens the confirmed number +17867028767 with a translated draft; it never sends automatically.

## Domain and hosting
Set environment variables before building: `SITE_URL` is the real HTTPS origin (for example your confirmed domain), `BASE_PATH` is `/` for root hosting or `/repository/` for GitHub Pages. Set `PRODUCTION_RELEASE=true` for a release: the build refuses a missing domain. No invented canonical domain is emitted. Builds without a domain are deliberately noindex and have robots Disallow; they are local previews.

`npm run build` creates static HTML for both languages, reciprocal canonical/hreflang links and sitemap only when SITE_URL exists. Deploy the contents of dist to the configured base. GitHub Pages must serve directory index files, including `/en/`. No repository or deployment has been created. Configure your chosen host’s build variables, not browser-local settings.

Only optimized public assets and source code should be versioned. Local references, original media, credentials, screenshots, generated ZIPs and node_modules are excluded. Keep original files locally.

Build update option: set `UPDATE_EPISODES=true` to run the feed refresh during the build; the default preserves the reviewed list. No scheduled GitHub Action is enabled.

