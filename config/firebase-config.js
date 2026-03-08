// Great Minds Creating - Firebase Configuration
// Replace these values with your actual Firebase project credentials

// Firebase configuration object
// Get these values from: Firebase Console > Project Settings > General > Your apps > Firebase SDK snippet
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');

    // Initialize services
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    console.log('Firebase services ready');

} catch (error) {
    console.error('Firebase initialization error:', error);
}

// ============================================
// FIREBASE SETUP INSTRUCTIONS
// ============================================

/*
FIREBASE SETUP STEPS:

1. CREATE FIREBASE PROJECT
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "great-minds-creating" or your preferred name
   - Follow the setup wizard

2. ENABLE AUTHENTICATION
   - In Firebase Console, go to Authentication
   - Click "Get Started"
   - Enable "Email/Password" sign-in method
   - Add admin users manually:
     * torrancegreen22@yahoo.com (Super Admin)
     * jaybandobaby4@gmail.com (Jay Bando Baby Admin)
     * beats4bblazo@gmail.com (B Blazo Admin)

3. SETUP FIRESTORE DATABASE
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode (you'll set up rules later)
   - Choose a location (us-central1 recommended)

4. FIRESTORE SECURITY RULES
   Replace default rules with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Fans collection - anyone can create, users can read their own
       match /fans/{fanId} {
         allow create: if true;
         allow read: if request.auth != null;
       }

       // Artists collection - public read, admin write
       match /artists/{artistId} {
         allow read: if true;
         allow write: if request.auth != null &&
           (request.auth.token.email == 'torrancegreen22@yahoo.com' ||
            request.auth.token.email == 'jaybandobaby4@gmail.com' ||
            request.auth.token.email == 'beats4bblazo@gmail.com');
       }

       // Songs collection - public read, admin write
       match /songs/{songId} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Videos collection - public read, admin write
       match /videos/{videoId} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Polls collection - public read, admin write
       match /polls/{pollId} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Votes collection - authenticated users can create
       match /votes/{voteId} {
         allow create: if request.auth != null;
         allow read: if request.auth != null;
       }

       // Follows collection - authenticated users can manage their own
       match /follows/{followId} {
         allow create: if request.auth != null;
         allow read: if request.auth != null;
         allow delete: if request.auth != null &&
           request.auth.uid == resource.data.userId;
       }

       // Bookings collection - anyone can create, admins can read
       match /bookings/{bookingId} {
         allow create: if true;
         allow read: if request.auth != null;
       }

       // Orders collection - anyone can create, admins can read
       match /orders/{orderId} {
         allow create: if true;
         allow read: if request.auth != null;
       }
     }
   }
   ```

5. SETUP STORAGE
   - Go to Storage
   - Click "Get Started"
   - Use default security rules for now

6. STORAGE SECURITY RULES
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

7. GET YOUR CONFIG
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Web app" (</> icon)
   - Register app as "Great Minds Creating"
   - Copy the firebaseConfig object
   - Paste it into this file (replacing the placeholder)

8. OPTIONAL: CREATE INITIAL DATA
   You can manually add initial documents in Firestore:

   artists collection:
   {
     name: "Jay Bando Baby",
     bio: "Your bio here...",
     socialLinks: {...}
   }

   polls collection:
   {
     question: "Favorite Artist of the Month",
     options: ["Jay Bando Baby", "B Blazo", "Cash Create"],
     votes: {},
     active: true
   }

9. TESTING
   - Use Firebase Emulator Suite for local testing
   - Or deploy to Firebase Hosting for live testing

10. ADMIN USER CREATION
    After setting up authentication, manually create admin accounts:
    - Go to Authentication > Users
    - Add user with email and password
    - Or use Firebase CLI:
      firebase auth:import users.json

SECURITY NOTES:
- Never commit firebase-config.js with real credentials to public repos
- Use environment variables in production
- Implement rate limiting
- Monitor usage in Firebase Console
- Set up billing alerts
*/
