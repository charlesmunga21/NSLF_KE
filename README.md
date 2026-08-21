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

This dashboard is wired to a free Firebase (Spark plan) project (`nslf-ingo`), so every member's status, owner and note changes sync live across everyone viewing the board — no reload needed, no card on file. The footer at the bottom of the page reads **"Synced live"** to confirm it.

If you're reusing this repo as a template for another board, a fresh copy has no Firebase project attached yet and falls back to per-browser (`localStorage`) storage until you connect one. See **[SETUP.md](SETUP.md)** for the one-time, ~10 minute setup.

Either way:

- **Export** downloads `kenya-ingo-progress.json` (handy as a manual backup even with sync on).
- **Import** loads someone else's export over your copy.
- **Print** produces a clean board-ready sheet with the controls stripped out.

**Email alerts on change**: get an email digest whenever a status changes, using a free Google Apps Script poll — no paid backend needed. See **[ALERTS.md](ALERTS.md)**.

## Assigning owners and uploading documents

Each item has an **Owner** dropdown (Charles, Anthony, Florence, Atong, or Unassigned) instead of a free-text field, so assignments stay consistent across the team. The list lives in the `OWNERS` array near the top of the `<script>` block in `index.html` — edit it there to add or rename members.

Each item also has an **↑ Upload document** control. There's no paid file-storage backend behind this dashboard, so it doesn't accept files directly: clicking it opens a field to paste a shareable Google Drive link once the assigned person has uploaded the file to the team's shared Drive folder (a convenience **Open Drive ↗** link is provided). Once a link is saved, the item shows **📎 View document**, with **Replace** and **Remove** to update or clear it. Like owner and status, the link syncs live with everyone if shared sync is on.

**Filed requires a document.** Clicking **Filed** on an item with no document attached shows an explanation instead of changing the status — the button gets a dashed border as a visual hint before you even click it. Removing a document from an item that's already Filed moves it back to In progress automatically, since Filed is meant to mean "here's the proof," not just "done."

## Expiry tracking

Three items carry a hard validity window: the Form 2 name reservation (60 days) and the DCI and foreign police clearances (6 months each — they have to be dated within six months of submission, not just "obtained at some point"). Those items get an extra date field — **Approved** for the reservation, **Issued** for the clearances — plus a computed badge:

- More than 14 days left: **Valid to `<date>`**
- 14 days or fewer: **Expires in `N`d** (amber)
- Past the window: **Expired `N`d ago** (red)

The badge recalculates on every page load, so it stays accurate even if nobody touches the item for weeks. To add expiry tracking to another item, give it `expiryDays` (and optionally `expiryLabel`, which defaults to "Started") in its entry in the `PHASES` array.

## Light / dark mode

The **☀/🌙** button in the toolbar switches themes; the choice is remembered per-browser (`localStorage`, not synced across the team) and otherwise follows the system's light/dark setting on first visit. The masthead band stays a fixed dark "stamped ink" color in both themes by design — only the page, cards and text invert.

## Editing the content

All 24 items live in the `PHASES` array near the top of the `<script>` block in `index.html`. Each item takes:

```js
{
  id: "2.1",
  title: "Form 2 — name search and reservation",
  detail: "What has to happen, in plain terms.",
  href: "https://pbora.go.ke/register-pbo",   // optional
  hrefLabel: "Download forms",                       // optional
  meta: ["KES 1,000", "60-day validity"]             // optional chips
}
```

Add or remove items freely — the progress ledger, phase counts and filters all count whatever is in the array. Item `id` values are the storage keys, so renaming an id resets that row's saved state.

## Notes

- Fees and form numbers change. Confirm current figures on [pbora.go.ke](https://pbora.go.ke/register-pbo) before paying anything.
- Fonts load from Google Fonts. If the team works offline, download Archivo, Public Sans and IBM Plex Mono into the repo and swap the `<link>` for local `@font-face` rules.
