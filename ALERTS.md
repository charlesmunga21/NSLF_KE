# Email alerts when the board changes (free)

Get an email digest whenever a member updates a status on the dashboard
— no server, no paid Firebase plan. Uses Google Apps Script: a small
script tied to your own Google account, on a free timer, that checks
the shared board every 15 minutes and emails you if anything changed.

Cost: **$0**. Apps Script's free quotas (90 min of script runtime/day,
100 emails/day on a personal Gmail account) are far beyond what a
15-minute poll of one small document needs.

## Setup (about 5 minutes)

1. Go to **https://script.google.com/** and sign in with the Google
   account that should receive the alerts.
2. **New project**.
3. Delete the placeholder code in the editor, and paste in the contents
   of **[`apps-script/email-alerts.gs`](apps-script/email-alerts.gs)**
   from this repo.
4. At the top of the pasted code, edit `NOTIFY_EMAILS` to the list of
   addresses that should get the digest, e.g.:
   ```js
   var NOTIFY_EMAILS = ["charlesmuiruri13@gmail.com", "someoneelse@example.com"];
   ```
5. Save the project (name it something like `NSLF Kenya INGO alerts`).
6. In the function dropdown at the top of the editor, select
   **`createTrigger`**, then click **Run**.
   - The first run asks you to authorize the script (it needs
     permission to send email and read/write its own storage). Click
     through **Advanced → Go to \[project name\] (unsafe)** — this
     warning shows because the script isn't published/verified by
     Google, which is normal for a personal script; you wrote it,
     so it's safe.
7. That's it — `createTrigger` sets up a recurring check every 15
   minutes and then Apps Script runs it automatically in the
   background, even with the tab closed.

## Adjusting the check frequency

Edit the `.everyMinutes(15)` line in `createTrigger()` — Apps Script
allows down to 1 minute, but every 15–30 minutes is plenty for a board
that a handful of people update occasionally, and keeps the email
volume sane (updates within the same window get bundled into one
email instead of one email per click).

After changing it, re-run `createTrigger` once to replace the old
schedule with the new one.

## Turning it off

In the Apps Script editor: left sidebar **Triggers** (clock icon) →
delete the `checkForUpdates` trigger. Or just delete the whole Apps
Script project.

## How it works

The script calls Firestore's public REST API for the one document the
dashboard uses (readable by anyone, per the security rules in
`SETUP.md`), compares it to what it saw last time, and emails only the
items whose **status** changed since the last check — not every field,
so quietly editing a note won't trigger an email.
