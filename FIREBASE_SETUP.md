# Firebase Setup Instructions

This guide will help you set up Firebase for the waitlist feature.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter your project name (e.g., "theother-me")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click **"Create project"**

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll set up security rules later)
4. Choose a location for your database (select the closest region to your users)
5. Click **"Enable"**

## Step 3: Set Up Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read waitlist entries (optional - remove if you want to restrict)
    // match /waitlist/{document=**} {
    //   allow read: if true;
    // }
    
    // Allow anyone to write to waitlist collection (for signups)
    match /waitlist/{document=**} {
      allow create: if request.resource.data.email is string &&
                     request.resource.data.email.matches('.*@.*\\..*') &&
                     request.resource.data.createdAt == request.time;
      allow read: if false; // Prevent reading from client (use admin panel)
      allow update, delete: if false; // Only admins can update/delete
    }
  }
}
```

3. Click **"Publish"**

## Step 4: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to **"Project Overview"**
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` to add a web app
5. Register your app with a nickname (e.g., "TheOther.me Website")
6. **Copy the Firebase configuration object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 5: Update Your Firebase Configuration File

1. Open `js/firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_AUTH_DOMAIN_HERE",
    projectId: "YOUR_PROJECT_ID_HERE",
    storageBucket: "YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_APP_ID_HERE"
};
```

## Step 6: Test Your Setup

1. Open your website in a browser
2. Navigate to the waitlist section
3. Enter an email address and submit
4. Go to Firebase Console → Firestore Database
5. You should see a new collection called `waitlist` with your test entry

## Optional: Set Up Email Notifications (Using Cloud Functions)

If you want to send welcome emails when users join the waitlist, you can set up Firebase Cloud Functions:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize functions: `firebase init functions`
4. Create a function to trigger on new waitlist entries

## Viewing Waitlist Entries

You can view all waitlist entries in Firebase Console:

1. Go to **Firestore Database**
2. Click on the `waitlist` collection
3. You'll see all entries with email addresses and timestamps

## Exporting Waitlist Data

To export your waitlist data:

1. Go to Firestore Database
2. Click the three dots menu → **Export collection**
3. Or use Firebase CLI: `firebase firestore:export gs://your-bucket/backup`

## Security Best Practices

1. **Restrict Read Access**: The security rules above prevent clients from reading the waitlist. Only authenticated admins should be able to read.
2. **Rate Limiting**: Consider implementing rate limiting in Cloud Functions to prevent spam
3. **Email Validation**: The security rules validate email format on the server side
4. **Monitor Usage**: Check Firebase Console → Usage and billing to monitor your usage

## Troubleshooting

- **"Firebase not initialized"**: Make sure you've updated `firebase-config.js` with your actual config
- **Permission denied**: Check your Firestore security rules
- **CORS errors**: Firebase handles CORS automatically, but make sure your domain is authorized in Firebase Console

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Support](https://firebase.google.com/support)
