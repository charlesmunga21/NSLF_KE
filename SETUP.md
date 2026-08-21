# Turning on shared sync (free, no card required)

Right now everyone who opens the dashboard only sees their own progress —
each browser saves to its own `localStorage`. This wires it up to a free
Firebase (Spark plan) project so every member sees the same board update
live, with no server to run or pay for.

Cost: **$0**. The Spark plan doesn't ask for a credit card and its free
quotas (50k reads/day, 20k writes/day, 1GB storage) are far more than a
small team checking boxes needs.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com/> and sign in with the
   Google account that should own this.
2. **Add project** → name it (e.g. `nslf-ke-ingo`) → you can skip Google
   Analytics → **Create project**.

## 2. Turn on Firestore

1. In the left sidebar: **Build → Firestore Database → Create database**.
2. Choose **Start in production mode**.
3. Pick a region close to Kenya (e.g. `europe-west1`) → **Enable**.

## 3. Turn on Anonymous sign-in

1. **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Anonymous** → **Save**.

This lets the page identify "someone using the dashboard" without anyone
typing a password — good enough for a small trusted team, and it's the
free option. It is not strong security: anyone with the page URL can also
get an anonymous session. Don't put anything in the dashboard you wouldn't
want a stranger who finds the link to see.

## 4. Set Firestore security rules

**Build → Firestore Database → Rules**, replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boards/kenya-ingo {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This locks writes to exactly the one document the dashboard uses, and
only from a signed-in (including anonymous) session. Click **Publish**.

## 5. Get the web app config

1. **Project settings** (gear icon) → scroll to **Your apps** → click the
   **</>** (web) icon.
2. Give it a nickname (e.g. `dashboard`) → **Register app**. Skip the
   hosting step.
3. Copy the `firebaseConfig` object shown.

## 6. Paste the config into `index.html`

Open `index.html`, find this block near the top of the `<script>` tag:

```js
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace it with the values Firebase gave you, commit, and push. GitHub
Pages picks it up automatically within a minute.

Once the real keys are in, the footer at the bottom of the page will say
**"Synced live"** instead of "Progress saves in this browser only" — that's
confirmation every member editing the page is now reading and writing the
same shared board.

## Notes

- If Firebase isn't configured yet (the placeholder `YOUR_...` values are
  still there), the dashboard silently falls back to the original
  per-browser behavior — nothing breaks.
- Export/Import/Print still work as a manual backup, sync or not.
- If you ever want to wipe the shared board for everyone, the **Reset**
  button in the toolbar clears it for all connected members, not just you.
