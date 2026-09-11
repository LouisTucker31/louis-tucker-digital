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
- **Email address**: `louistucker@live.co.uk` is wired in across the
  footer, contact page, and mailto links. Update it everywhere if you
  switch to a different address later (a business-domain address once
  you have one is usually more credible than a personal one).
- **Domain**: canonical links, Open Graph URLs, `robots.txt`, and
  `sitemap.xml` all use `https://www.louistuckerdigital.co.uk/` as a
  placeholder. Update these once you know your real domain, including
  the URLs pointing at `assets/og-image.png` (the image itself doesn't
  need to change, just the URLs referencing it).
- **Prices**: the figures on the homepage and services page (from £900,
  £1,600, £60/month, £350) are placeholders. Replace with your actual
  pricing before publishing.
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
advertising trackers, and sets no cookies of its own. The only external
requests are the Google Fonts stylesheet and, on the contact page, the
Formspree submission endpoint. No cookie consent banner is required as
the site stands. If you add analytics later, this will need revisiting.

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

Two security headers can't be set from HTML and should be added at the
hosting/server level if your host supports custom headers:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin` (a matching
  `<meta name="referrer">` is already in the HTML as a fallback)

Note also that the `frame-ancestors` directive inside the CSP `<meta>`
tag is ignored by browsers, that directive only takes effect when CSP
is set as a real HTTP header. If your host lets you set response
headers, moving the whole CSP there is stronger than the meta tag.

The CSP also sets `object-src 'none'` as defence-in-depth against
plugin-based content, even though `default-src 'self'` already covers
it by fallback. Everything else (form handling, input sanitisation,
honeypot spam field) is already handled in the markup and JS.

## Structure

```
index.html
404.html
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
