# ICSMAMET 2027 — Conference Website

Official website for the **International Conference on Sustainable Materials, Advanced Manufacturing and Emerging Technologies (ICSMAMET 2027)**, 21–23 July 2027, hosted by **VNR VJIET, Hyderabad**.

A static-first React + Vite + TypeScript site. Every page is **prerendered to static HTML** at build time (fast first paint, full content for search engines and link previews) and then hydrated for client-side navigation. There is **no database and no always-running server** — it deploys to Netlify, Vercel, GitHub Pages or any static host.

---

## Quick start

Requirements: **Node.js 20+** (22 recommended).

```bash
npm install
npm run dev          # local development at http://localhost:5173
npm run build        # type-check, build, prerender all pages → dist/
npm run preview      # serve dist/ at http://localhost:4173 (mimics Netlify/Vercel routing)
```

Optional end-to-end checks (needs a local Chrome/Chromium):

```bash
CHROME_PATH="/path/to/chrome" npm run test:e2e
```

---

## Site map

| Path | Page | Contents |
|---|---|---|
| `/` | Home | Hero (dates, host, CTAs), research imperative, three track previews, invited speakers, timeline, host institution |
| `/about` | 01 About | Overview, objectives, relevance, audience, programme format, About VNR VJIET, venue |
| `/themes` | 02 Themes | All three tracks with full topic lists, audience, call for papers, submission steps, documents |
| `/speakers` | 03 Invited Speakers | Speaker profiles (photo/bio/lecture fields ready for approved content) |
| `/committees` | 04 Committees | Patrons & leadership, conveners, co-conveners, organizing, proceedings editors, advisory |
| `/registration` | 05 Registration | Fee table, registration status, process, dates, pending policies |
| `/accommodation` | 06 Accommodation | Hostel / guest-house options, booking-request form, venue map |
| `/important-dates` | 07 Important Dates | Full timeline with next-milestone highlight, .ics calendar download |
| `/contact` | 08 Contact | Convener contacts, enquiry form, embedded Google Map |
| any other | 404 | Custom not-found page (served with HTTP 404) |

---

## Updating content

All conference content lives in **`src/data/`** — pages never hard-code conference facts. Edit a data file, rebuild, redeploy.

| File | What it holds |
|---|---|
| `conference.ts` | Name, dates, host, overview/objectives, About VNR VJIET, accommodation text |
| `tracks.ts` | Track titles, focus lines and topic lists |
| `speakers.ts` | Invited speakers — add `photo`, `bio`, `expertise`, `lectureTitle`, `abstract` when approved |
| `committees.ts` | All committee groups and members |
| `registration.ts` | Fee table and registration policies (`text: null` = "to be announced") |
| `deadlines.ts` | Important dates (and optional `deadlineTimeZone`) |
| `contact.ts` | Convener names, emails, phone numbers |
| `documents.ts` | Downloadable PDFs — put files in `public/documents/` and set `href` |

Page titles and search descriptions are in `src/app/siteMap.ts`.

**Hero slideshow photos:** the homepage card sits over a slideshow of campus photos listed in `src/data/heroSlides.ts`.
1. Copy the original photos into `photos-to-add/`.
2. Run `npm run photos` — each one is cropped to 16:9 and saved as WebP + JPEG in `public/images/campus/` (originals ≥ 1920 px wide look best).
3. Paste the printed entries into `heroSlides.ts`, write a real `alt` description and `caption` for each, and reorder as you like. Optional `position: 'center 30%'` adjusts the crop.
The slideshow crossfades every 6 seconds (`SLIDE_SECONDS`), pauses on hover/focus and has a pause button; visitors who prefer reduced motion see a still photo. With a single photo the controls are hidden.

**Light / dark theme:** a toggle in the header switches themes. The first visit follows the device setting; an explicit choice is remembered in the browser. Colours are defined once in `src/styles/tokens.css` — the `:root` block is the light theme and `:root[data-theme='dark']` the dark theme.

**Speaker photos:** place approved images (square, ≥ 320 px) in `public/images/speakers/` and set `photo: '/images/speakers/<file>.webp'`. Until then a monogram is shown.

---

## Registration, submission and forms (integrations)

The site never shows a button that looks operational before its destination exists. Each integration is switched on by a build-time environment variable (see `.env.example`):

| Variable | Effect when set | Fallback when empty |
|---|---|---|
| `VITE_REGISTRATION_URL` | "Register now" buttons (header, home, registration page) link to the approved registration/payment portal | Buttons lead to the Registration page, which states the form isn't published yet and offers a pre-filled email to the conveners |
| `VITE_SUBMISSION_URL` | "Submit a paper" buttons link to the submission system (CMT, EasyChair, etc.) | Shows "Call for papers — opens 1 January 2027" and the call-for-papers information, plus an email option |
| `VITE_CONTACT_FORM_ENDPOINT` | Contact and accommodation forms POST JSON to this endpoint (Formspree, Getform, or a serverless function) | Forms validate input, then open the visitor's email app with a message to both conveners, pre-filled with their details. Nothing is stored by the website |
| `VITE_MAP_URL` | "Open in Google Maps" uses the official share link | A Google Maps search for the institute is used |
| `SITE_URL` | Absolute canonical URLs, Open Graph URLs and `sitemap.xml` | Auto-detected on Netlify (`URL`) and Vercel (`VERCEL_PROJECT_PRODUCTION_URL`); otherwise relative canonicals and no sitemap |

Card or payment details are never collected by this site — payment must be handled by the institution's approved payment provider.

After changing any variable, **rebuild and redeploy** (Vite inlines them at build time).

---

## Deployment

### Netlify
1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket) owned by the organizing institution.
2. In Netlify: **Add new site → Import an existing project** → pick the repository.
3. Build settings are read from `netlify.toml` (`npm run build`, publish `dist`, Node 22).
4. Optional: **Site configuration → Environment variables** → add the variables above.
5. **Domain management** → add the custom domain; Netlify provisions HTTPS automatically.

Drag-and-drop alternative: run `npm run build` locally and drop the `dist/` folder onto Netlify's deploy page (set `SITE_URL` before building).

### Vercel
1. Push to a Git repository and choose **Add New → Project** in Vercel.
2. Framework preset is detected as Vite; `vercel.json` sets the build command, `dist` output, clean URLs and cache headers.
3. Add environment variables under **Settings → Environment Variables**, then redeploy.
4. Add the custom domain under **Settings → Domains** (HTTPS is automatic).

### Other static hosts
Upload the contents of `dist/`. Configure the server to serve `/<path>/index.html` for `/<path>` and `404.html` for unknown paths.

Both configurations add security headers and long-term caching for fingerprinted assets.

---

## Project structure

```
icsmamet-website/
├── public/                    static files copied as-is
│   ├── images/campus/         optimized campus photograph (WebP + JPEG)
│   ├── images/research/       microstructure artwork (generated SVG)
│   ├── images/speakers/       approved speaker photos (empty)
│   ├── documents/             call for papers / author guidelines PDFs (empty)
│   ├── favicon.svg, apple-touch-icon.png, og-image.png, site.webmanifest
├── scripts/
│   ├── prerender.mjs          writes static HTML per route, sitemap, robots.txt
│   ├── serve.mjs              local static server for `npm run preview`
│   ├── smoke-test.mjs         Playwright + axe end-to-end checks
│   └── make-social-image.mjs  regenerates og-image.png / apple-touch-icon.png
├── src/
│   ├── app/                   App, routes, Layout, siteMap (titles & descriptions)
│   ├── components/            Header, Footer, Hero, PageHero, SectionHeading, TrackCard,
│   │                          SpeakerCard, CommitteeList, DeadlineTimeline, RegistrationTable,
│   │                          EnquiryForm, MapEmbed, ConferenceActions, PendingNotice, …
│   ├── data/                  all conference content (typed)
│   ├── hooks/                 usePageMeta, useNow
│   ├── pages/                 Home + 8 sections + NotFound
│   ├── services/              registrationService.ts (integrations & form submission)
│   ├── styles/                tokens, global, components, pages, responsive
│   ├── entry-server.tsx       build-time renderer (not shipped to browsers)
│   └── main.tsx               browser entry (hydrates prerendered HTML)
├── netlify.toml, vercel.json, .env.example
└── package.json, tsconfig*.json, vite.config.ts
```

---

## Quality notes

- **Accessibility:** skip link, landmark regions, one `<h1>` per page, focus moved to the page heading on navigation, keyboard-operable mobile menu (Esc to close, focus contained), labelled form fields with inline errors, visible focus rings, WCAG AA contrast, reduced-motion support. Checked with axe-core on desktop, tablet and mobile.
- **SEO:** per-page title/description, canonical URLs, Open Graph/Twitter cards with a 1200×630 preview image, schema.org `Event` JSON-LD on the homepage, `sitemap.xml`, `robots.txt`.
- **Performance:** static HTML, self-hosted fonts (no third-party font requests), responsive WebP images with lazy loading, fingerprinted assets with immutable caching, lazy-loaded map iframe.

---

## Items requiring organizer input

Content is published exactly as supplied. These items still need confirmation:

1. **Registration opening date** — the source lists *15 March 2026*, which is before the call for papers (1 January 2027) and already past. Published as supplied; correct in `src/data/deadlines.ts` if it should be 2027.
2. **Registration link and payment workflow** — set `VITE_REGISTRATION_URL`; add payment instructions in `registration.ts`.
3. **Paper submission system** — set `VITE_SUBMISSION_URL` when the call opens.
4. **Early-bird fees** — only regular rates were supplied; confirm early-bird amounts, and whether taxes/charges apply.
5. **Author registration, cancellation and refund policies.**
6. **Publication arrangements** — no proceedings, indexing or journal is promised on the site until confirmed.
7. **Author guidelines, paper template and call-for-papers PDF** (`public/documents/`).
8. **Speaker photographs, biographies, expertise and lecture titles** (with approval).
9. **Track titles** — the topic lists are verbatim; the titles (Sustainable Materials / Advanced Manufacturing / Emerging Technologies) follow the website specification's three pillars.
10. **Accommodation** — charges, check-in rules and booking contact person.
11. **Full postal address and official Google Maps link** for the venue (`VITE_MAP_URL`).
12. **Deadline time zone** and any extension announcements (`deadlineTimeZone` in `deadlines.ts`).
13. **Official logos** (institution / conference) if they should appear.
14. **Analytics** — none included; add only if approved by the institution.
15. **Domain and hosting ownership** — host under an institutional account so the site can be maintained independently.
