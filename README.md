# BMSCE ACM Student Chapter website

The website of the BMSCE ACM Student Chapter at B.M.S. College of Engineering, Bengaluru,
together with its admin panel. Live at **https://bmsce.acm.org**.

- [How it fits together](#how-it-fits-together)
- [Running it locally](#running-it-locally)
- [The admin panel](#the-admin-panel)
- [Content and data](#content-and-data)
- [Pages and addresses](#pages-and-addresses)
- [The home page video](#the-home-page-video)
- [Search engines and link previews](#search-engines-and-link-previews)
- [Deploying](#deploying)
- [Configuration](#configuration)
- [Checks](#checks)
- [Project layout](#project-layout)
- [Troubleshooting](#troubleshooting)

## How it fits together

```
                         ┌──────────────────────────────────────────────┐
  Visitors ─────────────▶│  Website (React, static files in dist/)      │
                         │  Cloudflare Pages, bmsce.acm.org             │
                         └───────┬──────────────────────┬───────────────┘
                                 │ reads                │ admin saves
                                 ▼                      ▼
     ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
     │ Chapter backend (FastAPI +      │   │ Content API (/api, this repo)   │
     │ MongoDB on Render)              │   │ Cloudflare Pages Function       │
     │ events, projects, Insight       │   │ reads and commits content/*.json│
     │ Series, admin accounts          │   │ to this GitHub repository       │
     └─────────────────────────────────┘   └─────────────────────────────────┘
                 ▲ admin images: Cloudinary (unsigned upload preset)
```

There are three places data lives, each for a reason:

| What | Where | Why |
| --- | --- | --- |
| Events, projects, Insight Series stories, admin accounts | The chapter's backend, [acm-bmsce/WEBSITE-BACKEND](https://github.com/acm-bmsce/WEBSITE-BACKEND), at https://bmsceacmwebsite.onrender.com | The existing database, shared with anything else that reads it |
| Team, home-page numbers, recognition, About timeline, Join links, socials, plus a few details the backend has no fields for | JSON files in [`content/`](content/), in this repository | Versioned with the site; each admin save is a commit, and the site rebuilds |
| Images uploaded in the admin panel | The chapter's Cloudinary account | The same upload preset the previous site used |

The website shows its bundled copy of events, projects and stories (in `content/`) straight away,
then switches to the backend's data as soon as it answers. The free Render service can take up to
a minute to wake up; the site works normally in the meantime, and keeps working if the backend is
down. The last answer is cached in the browser for an hour.

## Running it locally

Needs Node 22 (see `.node-version`).

```bash
npm install
cp .env.example .env
npm run dev          # website on http://localhost:5173 (it forwards /api), content API on :5000
```

Sign in at http://localhost:5173/admin with your account on the chapter's backend.

**Saves to the backend are real**: they change the live database. Without `GITHUB_TOKEN`, saves to
`content/` write the files in this folder; commit and push them yourself.

To try the admin panel without touching the real database, run the stand-in backend that the tests
use, and point the site at it:

```bash
node scripts/mock-backend.mjs     # http://localhost:5056; sign in as master / master-pass
VITE_LIVE_API=http://localhost:5056 LIVE_API=http://localhost:5056 npm run dev
```

Other commands:

```bash
npm run build        # production build in dist/
npm run preview      # serve dist/ on http://localhost:4173
```

## The admin panel

At `/admin`. Accounts are the backend's own:

- **Master** accounts can do everything.
- Other approved accounts (**coordinators**) manage events and Insight Series stories.
- Anyone can ask for an account, or for a password reset, from the sign-in page. A master admin
  approves both under **Accounts**.

| Section | What it does | Saved to | Who |
| --- | --- | --- | --- |
| Overview | What's coming up, drafts, counts | (read only) | Everyone |
| Events | Add, edit, publish, unpublish, delete events | Published events: the backend. Drafts and website-only details: `content/events.json` | Everyone |
| Insight Series | Alumni and placement stories | The backend; the batch year: `content/insights.json` | Everyone |
| Projects | Approve, hide, edit, delete projects (including ones people submit) | The backend | Master |
| Pages & team | Team, stats, recognition, timeline, links | `content/site.json` | Master |
| Accounts | Approve account requests; set a new password for a reset request | The backend | Master |

How events are saved:

- **Drafts never reach the backend**, so nothing half-written shows up anywhere.
- **Publishing** sends the event to the backend, then records its website-only details (link
  name, type, team size, prices, seats, exact start time) in `content/events.json`.
- **Unpublishing** saves the draft in `content/events.json` first, then removes it from the
  backend, so nothing is lost if one step fails.
- The backend stores only the date; the start time is kept on this side.

Two people can't overwrite each other's work on `content/`: a save made from an out-of-date copy
is refused, with a message to reload.

## Content and data

| File | Holds |
| --- | --- |
| `content/site.json` | Stats, recognition, team (faculty, core, advisors, team photo), previous cores, contact email, Join links, socials, About timeline |
| `content/events.json` | The bundled copy of every event, plus drafts and each event's website-only details |
| `content/projects.json`, `content/insights.json` | The bundled copies of projects and stories (stories also keep their batch year here) |
| `content/live-overrides.json` | Fixes applied on top of the backend's data: gallery photos to leave out, and field replacements for specific events |

Every save to these files is checked against the schemas in
`server/services/content.schemas.js`, and a test checks the shipped files too, so a bad edit
can't break the build.

How the website combines the two sources (`src/lib/data.js`):

1. Show the bundled copy at once.
2. Fetch events, approved projects and stories from the backend.
3. For each event, take the backend's fields and add this site's details (link name, draft status
   and so on) from the bundled copy.
4. Apply `content/live-overrides.json`.
5. Anything deleted on the backend disappears here too; drafts are never shown.

Text from the database is shown as typed, except that an em dash is shown as a comma.

## Pages and addresses

| Address | Page |
| --- | --- |
| `/` | Home |
| `/events`, `/events/<name>` | Calendar and archive; each event has its own shareable address |
| `/projects` | Projects showcase |
| `/placements` | Insight Series, by batch |
| `/team` | Faculty, core team, advisors |
| `/about` | The chapter's story, recognition and timeline |
| `/join` | Chapter and global ACM membership |
| `/admin` | The admin panel |

The previous site's addresses still work: `/about-us`, `/event`, `/archive`, `/join-us`,
`/events/<id>/register` and `/admin/placements` lead to the matching new page, and `/login`,
`/account` and `/verify` go to the home page.

## The home page video

As visitors scroll, the diamond on the home page opens out to fill the screen and plays
`public/video/hero.mp4` once (muted, 1920×1080, about 15 seconds, 4.5 MB): seven captioned
photos from the chapter's events with diamond transitions. When it ends, the page moves on to the
next section by itself, but only if the visitor is still watching it.

To change it, replace `public/video/hero.mp4` with another muted 16:9 MP4 (H.264, under about
6 MB, `-movflags +faststart`), and update the length in the comment above `HERO_VIDEO` in
`src/pages/Home.jsx`. Keep text and logos at least 160 px in from the left and right edges:
laptop screens crop the sides of a 16:9 video slightly.

## Search engines and link previews

- Every page and every published event is built as its own HTML file with its own title,
  description, canonical address and link-preview tags (`pageHeads` in `vite.config.js`, text in
  `src/data/seo.js`). Events also carry schema.org Event data.
- The home page describes the chapter as an organisation (names people search, its college, ACM,
  founding date, award, social profiles) in `index.html`.
- `sitemap.xml` is generated at build time; `public/robots.txt` points to it and keeps `/admin`
  and `/api` out of search results.
- Getting listed on Google (Search Console) is covered in [DEPLOYING.md](DEPLOYING.md), step 6.

## Deploying

**bmsce.acm.org runs on Cloudflare Pages. Follow [DEPLOYING.md](DEPLOYING.md) step by step.**
In short: the Pages project builds `npm run build` into `dist/`, the content API runs from
`functions/api/[[path]].js`, `public/_headers` sets security and caching headers, and the only
required setting is a `GITHUB_TOKEN` secret.

It can also run on Vercel (`vercel.json` and `api/index.js` are included), or on any Node host
with `SERVE_WEB=true npm start`.

## Configuration

All optional except `GITHUB_TOKEN` in production. See `.env.example` for details.

| Variable | Used by | Default |
| --- | --- | --- |
| `GITHUB_TOKEN` | Content API: commits `content/` saves. A fine-grained token for this repository only, with Contents: Read and write | none (saves to `content/` are switched off in production) |
| `GITHUB_REPO`, `GITHUB_BRANCH` | Content API | `acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE`, `main` |
| `VITE_LIVE_API` (website), `LIVE_API` (content API) | The backend's address; `off` uses only the bundled copy | `https://bmsceacmwebsite.onrender.com` (the previous site's `VITE_API_BASE_URL` also works) |
| `VITE_CLOUDINARY_CLOUD`, `VITE_CLOUDINARY_PRESET` | Admin image uploads | `dzccr1oot`, `Website-Image` |
| `VITE_API_URL` | Where the website finds the content API | `/api` on the same address |
| `ADMIN_USERS`, `JWT_SECRET` | Optional sign-ins for the content API alone, when the backend is switched off | none |

Never commit `.env` or a token. `.env` is ignored by git.

## Checks

```bash
npm run lint
npm test             # content API (Node and Cloudflare versions): sign-ins, roles, saves, conflicts, GitHub commits
npm run qa:e2e       # a browser bot uses the admin panel against the stand-in backend, then checks the website
npm run preview      # then, in a second terminal:
npm run qa           # every page at phone, tablet and desktop sizes: layout, links, images, console errors
node scripts/fit.mjs # every page at 21 screen sizes: nothing overflows or overlaps
npm run qa:perf      # Lighthouse scores, written to docs/PERF.md
npm run qa:leaks     # many page changes in a row: checks memory and listeners don't grow
```

The tests never touch the real backend or the chapter's Cloudinary account: the end-to-end test
runs its own stand-in backend (`scripts/mock-backend.mjs`) and answers image uploads itself. Pull
requests run lint, tests, build and `npm audit` on GitHub (`.github/workflows/ci.yml`).

## Project layout

| Path | What |
| --- | --- |
| `src/pages/` | The public pages; `src/pages/admin/` is the admin panel |
| `src/components/` | Header, footer, page-change curtain, event window, shared building blocks (`ui/`), and components adapted from React Bits (`reactbits/`) |
| `src/lib/liveApi.js` | The backend's address and the Cloudinary upload settings |
| `src/lib/data.js` | How the website reads the backend and merges in this site's details |
| `src/lib/adminApi.js` | How the admin panel signs in and saves |
| `src/data/site.js` | Fixed copy (domains, About text, Join benefits) and the values from `content/site.json` |
| `src/data/seo.js` | Page titles and descriptions for search engines |
| `src/styles/` | `site.css` (the website) and `admin.css` |
| `content/` | Editable content (see above) |
| `public/` | Images (`img/`, with resized copies in `img/r/`), fonts, the hero video, icons, `_headers`, `robots.txt` |
| `functions/api/[[path]].js` | The content API on Cloudflare Pages |
| `server/`, `api/index.js` | The same API for Node and Vercel, with its tests in `server/tests/` |
| `scripts/` | Build, checks, the stand-in backend, and `responsive-images.py` (makes the resized copies in `public/img/r/`) |

Built with React 18, Vite 6 and React Router 7, Lenis for smooth scrolling, and self-hosted fonts
(Bebas Neue for display, General Sans for text). No tracking or third-party scripts.

## Troubleshooting

| What you see | Cause and fix |
| --- | --- |
| Admin: "Saving isn't set up on this deployment yet" | `GITHUB_TOKEN` is missing for that environment. Add it in Cloudflare Pages (Production and Preview), then redeploy |
| Admin: "GitHub refused the token" | The token expired or lacks Contents: Read and write on this repository. Make a new one |
| Admin: sign-in is slow or says the server may be waking up | The Render backend sleeps when idle. Wait a minute and try again |
| Admin: "Only a master admin account can do this" | The account is a coordinator. A master admin can do it |
| Admin: "Someone published a newer version" | Another save happened first. Reload the page and make the change again |
| Website shows slightly old events for a moment | Expected: the bundled copy shows first, then the backend's data replaces it |
| A change to team or numbers isn't live yet | Each save is a commit, and Cloudflare rebuilds the site; allow about two minutes |
