# Deploying to bmsce.acm.org (Cloudflare Pages)

`bmsce.acm.org` already points at the Cloudflare Pages project
**bmsce-acm-student-chapter-website** (a CNAME to `bmsce-acm-student-chapter-website.pages.dev`,
in ACM's DNS). The new site deploys to that same project, so **no DNS change is needed** and
nothing has to be asked of ACM.

What runs where:

| Part | Where |
| --- | --- |
| The website (`dist/`) | Cloudflare Pages, built from this repository |
| The content API (`/api/*`: team, home-page numbers, drafts…) | Cloudflare Pages Functions, from `functions/` in this repository |
| Events, projects, Insight Series, admin accounts | The existing backend on Render (unchanged) |
| Images uploaded in the admin panel | The existing Cloudinary account (unchanged) |

You need: access to the Cloudflare account that owns the Pages project, and admin (or
maintainer) access to `acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE` on GitHub.

## 1. Make a GitHub token for saving

The admin panel saves team, numbers, drafts and similar as commits to this repository.

1. GitHub → your avatar → **Settings** → **Developer settings** → **Personal access tokens** →
   **Fine-grained tokens** → **Generate new token**.
2. **Resource owner**: `acm-bmsce`. **Repository access**: *Only select repositories* →
   `BMSCE-ACM-STUDENT-CHAPTER-WEBSITE`.
3. **Repository permissions** → **Contents**: *Read and write*. Nothing else.
4. Expiration: up to a year; put a reminder in the calendar to renew it.
5. Generate, and copy the token (it starts with `github_pat_`). If the organisation requires
   approval for fine-grained tokens, an org owner approves it under the org's **Settings** →
   **Personal access tokens** → **Pending requests**.

Never commit this token or paste it anywhere except Cloudflare's settings below.

## 2. Check the Cloudflare Pages build settings

Cloudflare dashboard → **Workers & Pages** → **bmsce-acm-student-chapter-website** →
**Settings** → **Build**:

| Setting | Value |
| --- | --- |
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(empty)* |
| Production branch | `main` |

Node 22 is picked up from `.node-version`. The `functions/` folder is found automatically.

## 3. Add the variables

Same project → **Settings** → **Variables and Secrets**. Add each for **Production**, and again
for **Preview**:

| Name | Type | Production | Preview |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | **Secret** | the token from step 1 | the same token |
| `GITHUB_BRANCH` | Text | `main` | `website-v2` (the branch being previewed, so test saves don't land on `main`) |

Optional, only if something differs from the defaults:

| Name | Default |
| --- | --- |
| `VITE_LIVE_API` | `https://bmsceacmwebsite.onrender.com` (the old `VITE_API_BASE_URL` also works) |
| `GITHUB_REPO` | `acm-bmsce/BMSCE-ACM-STUDENT-CHAPTER-WEBSITE` |

If an old `VITE_API_BASE_URL` is set to the Render address, it can stay.

## 4. Try it on a preview first

1. Push the `website-v2` branch. Cloudflare builds it as a preview (if previews are enabled
   for all branches: **Settings** → **Build** → **Branch control**) at
   `https://website-v2.bmsce-acm-student-chapter-website.pages.dev`.
2. Open `/api/health` on that address. It should show `"storage":"github"` and
   `"backend":"connected"`.
3. Click through every page on a laptop and a phone.
4. Open `/admin`, sign in with your existing backend account, and:
   - add a draft event, then delete it: a commit appears on `website-v2` each time;
   - open **Pages & team** and save without changes: another commit on `website-v2`.

   Publishing an event, or adding a project or story, changes the **real** database, which the
   live site reads too. Only do it with something you mean to keep, or delete it straight after.

## 5. Go live

1. Open a pull request from `website-v2` into `main` and merge it.
2. Cloudflare builds `main` and serves it at https://bmsce.acm.org (about 2 minutes; watch
   **Deployments**).
3. Check https://bmsce.acm.org/api/health and sign in at https://bmsce.acm.org/admin.
4. In **Pages & team**, change one number, publish, and see it on the home page about two
   minutes later (each save is a commit, and each commit is a new build).

## 6. Get it found on Google

The site already tells search engines what each page is: every page and event has its own title,
description and address; `sitemap.xml` lists them all; and the home page describes the chapter
(including the names people search: "BMSCE ACM", "ACM BMSCE", "BMS College of Engineering ACM").
Searches like those, or "ACM student chapter Bangalore", are where it can rank. The bare word
"acm" belongs to acm.org itself.

Google needs to be told about the site once:

1. Open https://search.google.com/search-console and sign in with the chapter's Google account.
2. **Add property** → **URL prefix** → `https://bmsce.acm.org/`.
3. Verify with **HTML file**: download the file Google offers, put it in `public/` (keep its
   name), commit, and wait for the build; then click **Verify**. (The DNS option won't work:
   `acm.org`'s DNS belongs to ACM.)
4. **Sitemaps** → enter `sitemap.xml` → **Submit**.
5. **URL inspection** → `https://bmsce.acm.org/` → **Request indexing**. Do the same for
   `/events` and `/about`.
6. Optional: Bing Webmaster Tools (https://www.bing.com/webmasters) can import the property from
   Search Console in one click.

What helps most after that is other sites linking to it:

- Put `https://bmsce.acm.org` in the Instagram, LinkedIn, YouTube and GitHub bios.
- Ask ACM India to link the chapter's page to it, and BMSCE to list it on the college website.
- Link back to the event page (`bmsce.acm.org/events/<name>`) from every event post and form.

New pages show up in Google within days to a few weeks.

## If something goes wrong

- **Roll back:** Cloudflare → the project → **Deployments** → pick the last good one → **⋯** →
  **Rollback to this deployment**. It takes seconds and doesn't touch the repository.
- **"Saving isn't set up on this deployment yet"**: `GITHUB_TOKEN` is missing for that
  environment (Production or Preview). Add it, then **Retry deployment**.
- **"GitHub refused the token"**: it expired, or lacks *Contents: Read and write* on this
  repository. Make a new one (step 1) and replace the secret.
- **Sign-in is slow, or says the server is waking up**: the free Render backend sleeps when
  idle. The `keep_alive` workflow in `acm-bmsce/WEBSITE-BACKEND` pings it every 5 minutes;
  check it's still enabled under that repository's **Actions** (GitHub turns off scheduled
  workflows after 60 days without commits).
- **Pages show old events for a moment**: expected. Pages show the copy in `content/` first
  and switch to the backend's data once it answers.

## Other hosts

`vercel.json` and `api/index.js` run the same site and API on Vercel instead (see the README).
Moving `bmsce.acm.org` there would need ACM to change the CNAME, so Cloudflare is the simpler
choice.
