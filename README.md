# Louis Tucker Digital, site build

Plain HTML/CSS/JS, no framework, no build step. Open `index.html` directly
or serve the folder with any static server.

## Public URL map

Each page lives in its own folder as `index.html`, so clean URLs work
natively on any static host, no rewrite rules or server config needed.

| Page | File | Clean URL |
|---|---|---|
| Home | `index.html` | `/` |
| Services | `services/index.html` | `/services/` |
| Work | `work/index.html` | `/work/` |
| Contact | `contact/index.html` | `/contact/` |
| Privacy notice | `privacy/index.html` | `/privacy/` |
| 404 | `404.html` | (served automatically by most hosts on any unmatched path) |

The site is currently deployed on GitHub Pages, which serves each
folder's `index.html` for its clean URL natively, no config needed.

## Before this goes live

- **Contact form**: `contact/index.html` posts to a live Formspree endpoint
  (`https://formspree.io/f/mbgjwpvg`). Send a real test enquiry and confirm
  it reaches your inbox before relying on it. If you ever switch providers,
  update the `form-action` and `connect-src` values in the
  `Content-Security-Policy` meta tag on every page (`index.html`,
  `services/index.html`, `work/index.html`, `contact/index.html`,
  `privacy/index.html`).
- **Email address**: `hello@louistuckerdigital.co.uk` is wired in across the
  footer, contact page, and mailto links. Update it everywhere if you
  switch to a different address later (a business-domain address once
  you have one is usually more credible than a personal one).
- **Domain**: canonical links, Open Graph URLs, `robots.txt`, and
  `sitemap.xml` all use the real domain, `https://louistuckerdigital.co.uk/`.
  A `CNAME` file at the repo root sets this as the GitHub Pages custom
  domain; confirm it's also set under the repo's Settings → Pages, and
  that DNS at your registrar points to GitHub Pages.
- **Prices**: the figures on the homepage and services page (from £35
  to £500) are real pricing, already live.
- **Company details**: the footer is intentionally minimal (copyright,
  privacy link, email) and doesn't carry a company registration/VAT
  line. If you trade as a limited company, add that disclosure, either
  as a short line in the footer or on the privacy page, it isn't
  required for a sole trader.
- **Privacy notice**: `privacy/index.html` covers who's responsible for
  data, what's collected, lawful bases, B2B marketing contact, sharing
  with processors, retention and cookies. It isn't legal advice, have it
  checked before relying on it, and keep the "Last updated" date current
  whenever the wording changes.
- **Favicon and OG image**: `assets/favicon.svg` and `assets/og-image.png`
  are a simple "LT" monogram in your brand colours. Swap for a proper
  logo if you have one.

## Cookie and tracker audit

Completed as part of this build: the site includes no analytics, no
advertising trackers, and sets no cookies of its own. Archivo is
self-hosted (`assets/fonts/archivo-variable.woff2`), so there's no
Google Fonts request; the only external request is, on the contact
page, the Formspree submission endpoint. No cookie consent banner is
required as the site stands. If you add analytics later, this will
need revisiting.

## Accessibility and QA already handled in the build

- Checked against Impeccable's (impeccable.style) published catalog of
  AI-generated-UI tells: removed the hero graphic (shape-assembled SVG
  hero art is one of their flagged patterns), removed small numbered
  labels on the services page, shortened and resized the hero headline
  (was reading as oversized for a full-sentence hero), and widened the
  gap between h3 and body text sizes for clearer hierarchy. No purple
  gradients, glassmorphism, gradient text, bounce easing, marketing
  buzzwords, or box-shadow-plus-hairline combos were present to begin
  with.

- Heading hierarchy checked and fixed on every page (no skipped levels).
- Colour contrast checked against WCAG thresholds (4.5:1 body text, 3:1
  large text and UI elements) and adjusted where it fell short.
- Keyboard navigation and visible focus states on all interactive
  elements.
- Reduced-motion preference respected.
- Form fields have real `<label>` elements (not placeholder-only),
  sensible `maxlength` limits, accessible error messages linked via
  `aria-describedby`, and inline success/failure states.
- Honeypot field on the contact form for basic spam protection.
- Mobile nav, footer links, and buttons sized for comfortable tapping.
- No inline scripts or styles, keeping the Content Security Policy free
  of `unsafe-inline`.

## Things that can only be finished after deployment

These depend on a live URL, real hosting, or your own accounts, so
they're flagged here rather than done in this build:

- HTTPS/SSL, HTTPS redirect, and domain DNS (handled by your host, most
  modern static hosts provide free HTTPS automatically).
- Running Lighthouse/PageSpeed against the live site.
- Submitting the sitemap in Google Search Console.
- Cross-browser and cross-device testing on real devices (the CSS is
  written to standard, widely-supported features, but a manual pass is
  still worth doing).
- Final proofread of live content and a full click-through as a visitor
  once DNS and hosting are live.
- Keeping a backup of the source files, and, if you ever bring someone
  else in, making sure you (or your client) own the domain and hosting
  account rather than a third party.

## Server headers

Confirmed live with `curl -I` against the production domain: GitHub
Pages sends none of the following, and there's no config file or
dashboard setting on GitHub Pages that adds them, custom response
headers aren't supported on this host at all.

- `Strict-Transport-Security` - missing. HTTPS itself works (HTTP
  redirects to HTTPS correctly), but there's no HSTS header telling
  browsers to always require it.
- `X-Content-Type-Options: nosniff` - missing.
- `Permissions-Policy` - missing.
- `Referrer-Policy: strict-origin-when-cross-origin` - not sent as a
  header. A matching `<meta name="referrer">` is in the HTML as a
  fallback, which works but is weaker than the real header.
- The CSP `frame-ancestors 'none'` directive - present in the HTML
  `<meta>` tag, but browsers ignore `frame-ancestors` entirely unless
  CSP is set as a real HTTP header, so there is currently no working
  clickjacking protection despite the code showing this directive.

None of this is fixable from within this repo. The only way to get
real response headers while keeping GitHub Pages for hosting is to
put a layer in front of it, Cloudflare (free tier, using a Worker or
a Transform Rule to inject headers) is the standard option, pointing
the domain's DNS through Cloudflare instead of directly at GitHub.

The CSP `<meta>` tag itself is otherwise sound: verified live against
the deployed site with no unexpected external requests, the only
external connection anywhere in the site is to `formspree.io` on the
contact page, already correctly allowed. It also sets `object-src
'none'` as defence-in-depth against plugin-based content, even though
`default-src 'self'` already covers it by fallback. Everything else
(form handling, input sanitisation, honeypot spam field) is already
handled in the markup and JS.

## Structure

```
index.html
404.html
CNAME
robots.txt
sitemap.xml
css/styles.css
js/main.js
assets/favicon.svg
assets/og-image.png
services/index.html
work/index.html
contact/index.html
privacy/index.html
```
