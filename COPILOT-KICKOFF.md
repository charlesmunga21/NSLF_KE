# Paste this into your Copilot tab

Attach `index.html` first (drag it into the chat, or open the repo in github.dev so Copilot can see the file). Then send:

---

I have a single-file compliance dashboard, `index.html`, that tracks our NGO registration in Kenya. It is deliberately vanilla: no build step, no dependencies, no framework, no backend. All markup, CSS and JS are in that one file, and it must keep working when opened directly from disk.

Read `.github/copilot-instructions.md` in this repo before making any change — it defines the constraints, the data model and the design tokens.

Set up the repo for GitHub Pages:

1. Confirm `index.html` sits at the repo root.
2. Add a `.gitignore` covering `.DS_Store`, `Thumbs.db`, `node_modules/` and `*.json` exports.
3. Add a GitHub Actions workflow that deploys the root of `main` to Pages on push.
4. Do not add a package.json, a bundler, or any dependency.

Then confirm the Pages URL and tell me what to enable in Settings.

---

## Follow-up prompts that work well

**Add a field to every item**

> In `index.html`, add an optional due-date input to each item, next to the owner and note fields. Persist it in `state` under a `due` key, include it in export/import, and show items due within 14 days with the `--amber` token. Keep the ES5 syntax and the single-file structure.

**Add a blocked state**

> Add a fourth status, `blocked`, for items waiting on a third party like the DCI or a notary. Give it its own colour token, its own tick colour in the ledger, and its own filter button. Update `blank()` and `load()` so existing saved data still opens.

**Before you accept a change**

> Show me a diff, not the whole file. Confirm you have not added any dependency, build step, or second source file.

## What to watch for

Copilot will suggest converting this to React, Vite, or Next.js, and will suggest npm packages for date handling and state. Decline all of it. The reason the constraints exist is that the admin team opens this on phones over slow connections, and a non-developer needs to be able to edit the item list and commit it.
