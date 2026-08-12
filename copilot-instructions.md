# Copilot instructions — Kenya INGO Registration Dashboard

## What this repo is

A single-page compliance tracker for the Never Settle For Less Foundation's International NGO registration with Kenya's NGO Co-ordination Board. It tracks 24 items across 5 phases (19 documents, 5 filing steps). Hosted on GitHub Pages.

Users are the foundation's admin team, often on phones and on slow or metered connections in Tanzania and Kenya.

## Hard constraints — do not change these without being asked

- **One file.** All markup, CSS and JavaScript live in `index.html`. Do not split into modules or add a `src/` directory.
- **No build step.** No npm, no bundler, no package.json, no transpilation. The file must work when opened directly from disk.
- **No dependencies.** No React, no Tailwind, no jQuery, no CDN scripts. The only external request is the Google Fonts stylesheet.
- **No backend.** No API calls, no database, no auth. State lives in `localStorage` plus JSON export/import.
- **ES5-safe syntax.** `var`, `function`, string concatenation. No optional chaining, no arrow functions, no template literals — the file is not transpiled and must run on old Android browsers.
- **No personal data in the repo.** Names, national ID numbers, KRA PINs, passport details and board member identities must never be committed. They belong in the runtime owner/note fields only.

## How the code is organised

Inside the single `<script>` IIFE:

- `PHASES` — the content. An array of phase objects, each with `n`, `title`, `note`, and an `items` array.
- Item shape: `{ id, title, detail, href?, hrefLabel?, meta? }` where `meta` is an array of short chip strings.
- `ALL` — flat list of item ids, derived from `PHASES`. Everything counts off this, so adding an item to `PHASES` is enough.
- `state` — `{ [id]: { status, owner, note } }`. `status` is `"todo" | "active" | "filed"`.
- `blank()` / `load()` / `save()` — storage, all wrapped in try/catch so the app still runs where storage is blocked.
- `render()` builds the DOM once; `refresh()` updates statuses, ticks, phase counts and filter visibility. Never re-render the whole tree on a status change — it destroys focus in the text inputs.
- Events use delegation on `#phases`, not per-element listeners.

Item `id` values are the storage keys. Renaming an id silently resets that row's saved state — if you rename one, add a migration in `load()`.

## Design tokens

Defined as CSS custom properties on `:root`. Use them; do not introduce new hex values.

`--ink` #17231F · `--ink-soft` #4A5751 · `--paper` #F5F3EC · `--card` #FFFFFF · `--rule` #DCD8CB · `--stamp` #4A3B9E · `--amber` #A8620F · `--filed` #2C7256

Type: Archivo (display), Public Sans (body), IBM Plex Mono (numbers, fees, labels). The violet rubber-stamp "FILED" mark and the 24-tick ledger bar are the signature elements — keep them.

## Quality floor for any change

- Real `<button>` and `<a>` elements, never `<div onClick>`.
- Every input has a `<label>`, visually hidden via `.sr` if needed.
- Visible `:focus-visible` outline on everything interactive.
- Works down to 360px wide. Status controls move below the row under 760px.
- `prefers-reduced-motion` disables the stamp animation.
- Print styles hide controls and keep rows unbroken.

## Good tasks to ask for

- Add a phase or item to `PHASES`
- Add a due-date field per item, persisted alongside owner/note
- Show a "blocked" state for items waiting on a third party (DCI, notary, donor)
- Migrate storage to a shared backend — this is the one change that breaks the no-backend rule, so confirm before starting

## When unsure

Ask before adding a dependency, a build step, or a second file. The whole point of this project is that a non-developer can open `index.html`, edit the `PHASES` array, and commit.
