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

Each person's statuses, owners and notes save to their own browser (`localStorage`). There is no shared backend, so:

- **Export** downloads `kenya-ingo-progress.json`.
- **Import** loads someone else's export over your copy.
- **Print** produces a clean board-ready sheet with the controls stripped out.

If the team needs live shared state instead of passing a file around, that needs a backend — Firebase, Supabase, or a GitHub Actions workflow committing the JSON back to the repo. Say the word and it can be added.

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
