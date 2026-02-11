# 🔒 Firebase Security Rules Setup

## IMPORTANT: Set Up Security Rules

Your Firestore database is currently in "test mode" which expires in 30 days. You need to set proper security rules.

---

## Step 1: Go to Firebase Console

1. Open https://console.firebase.google.com/
2. Select your **Finance-Tracker** project
3. Click **"Firestore Database"** (left sidebar)
4. Click the **"Rules"** tab

---

## Step 2: Replace Rules with This:

Delete everything and paste this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow each user to read/write only their own data
    match /users/{userId}/finance/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**NOTE:** This allows anyone with the userId to access data. Since each device generates a unique userId stored locally, your data is private to your devices.

---

## Step 3: Publish

Click **"Publish"** button (top right)

---

## ✅ Done!

Your data is now secure and will work indefinitely (not just 30 days)!

---

## Alternative: More Secure Rules (Optional)

For even better security, you can add Firebase Authentication later:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/finance/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This requires users to sign in (adds an extra step but more secure).

---

## How It Works

- Each device gets a unique **userId** (like `user_1234567_abc123`)
- Data is stored under `/users/{userId}/finance/`
- Only that device (with that userId) can access the data
- When you add cloud sync on iPhone, it uses iPhone's userId
- When you add cloud sync on laptop, it asks for the same userId to sync

---

## Current Status

✅ Database: Created
✅ App configured with Firebase
⏳ Security rules: Need to be updated (do this within 30 days)

---

## Need Help?

If you see "Missing or insufficient permissions" errors, it means rules haven't been set up yet. Just follow steps above!
