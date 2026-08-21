# Kenya INGO Registration Dashboard

A single-page tracker for the Never Settle For Less Foundation's International NGO registration with Kenya's NGO Co-ordination Board. 24 tracked items across 5 phases.

No build step, no dependencies, no server. One HTML file.

## Deploy to GitHub Pages

1. Create a repository (public, or private on a paid plan).
2. Add `index.html` to the root of the `main` branch.
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
4. Wait ~1 minute. The site appears at `https://<username>.github.io/<repo>/`.

Via the command line:

```bash
git init
git add index.html README.md
git commit -m "Kenya INGO registration dashboard"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## How progress is stored

By default, each person's statuses, owners and notes save to their own browser (`localStorage`) — there's no shared backend, so nobody sees anyone else's edits.

**Shared live sync (recommended for a team)**: wire up a free Firebase project (no card required) so everyone sees the same board update in real time. See **[SETUP.md](SETUP.md)** — it's about 10 minutes, one-time. Until it's set up, the dashboard runs local-only and works exactly as before.

Either way:

- **Export** downloads `kenya-ingo-progress.json` (handy as a manual backup even with sync on).
- **Import** loads someone else's export over your copy.
- **Print** produces a clean board-ready sheet with the controls stripped out.

**Email alerts on change**: with sync on, you can also get an email digest whenever a status changes — no paid backend needed. See **[ALERTS.md](ALERTS.md)**.

## Editing the content

All 24 items live in the `PHASES` array near the top of the `<script>` block in `index.html`. Each item takes:

```js
{
  id: "2.1",
  title: "Form 2 — name search and reservation",
  detail: "What has to happen, in plain terms.",
  href: "https://www.ngobureau.go.ke/downloads/",   // optional
  hrefLabel: "Download forms",                       // optional
  meta: ["KES 1,000", "60-day validity"]             // optional chips
}
```

Add or remove items freely — the progress ledger, phase counts and filters all count whatever is in the array. Item `id` values are the storage keys, so renaming an id resets that row's saved state.

## Notes

- Fees and form numbers change. Confirm current figures on [ngobureau.go.ke](https://www.ngobureau.go.ke/) before paying anything.
- Fonts load from Google Fonts. If the team works offline, download Archivo, Public Sans and IBM Plex Mono into the repo and swap the `<link>` for local `@font-face` rules.
