# Great Minds Creating - Creator Platform

A mobile-first web platform for the Great Minds Creating music collective, featuring artist pages, music releases, media content, creative services, event promotion, clothing store, and fan engagement system.

## 🎵 Project Overview

This is a production-ready platform built for Great Minds Creating, a Boston-based music collective. The platform serves as the digital headquarters for the collective and their clothing brand.

## 📁 Project Structure

```
great-minds-creating/
├── index.html              # Home page / Dashboard
├── jay-bando-baby.html     # Jay Bando Baby artist page
├── b-blazo.html            # B Blazo artist page
├── cash-create.html        # Cash Create artist page
├── create-hub.html         # Creative services & events
├── merch.html              # Clothing store
├── css/
│   └── styles.css          # Main stylesheet (urban design)
├── js/
│   ├── main.js             # Core functionality
│   ├── auth.js             # Firebase authentication
│   ├── polls.js            # Fan voting system
│   ├── artist.js           # Artist page functionality
│   ├── create-hub.js       # Booking form
│   └── merch.js            # Stripe payment integration
├── config/
│   └── firebase-config.js  # Firebase configuration
├── assets/
│   ├── images/             # General images
│   └── logos/              # Brand logos
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Setup Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage
5. Copy your Firebase config to `config/firebase-config.js`

See detailed instructions in `config/firebase-config.js`

### 2. Setup Stripe

1. Create account at https://stripe.com
2. Get your publishable key from https://dashboard.stripe.com/apikeys
3. Replace the placeholder in `js/merch.js` with your key

### 3. Add Logo Images

Place your logo images in `assets/logos/` and update the reference in HTML files:
- Main logo: `logo-main.png`

### 4. Deploy

#### Option A: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project directory
firebase init

# Select: Hosting
# Public directory: . (current directory)
# Single-page app: No
# Overwrite index.html: No

# Deploy
firebase deploy
```

#### Option B: Netlify

1. Go to https://www.netlify.com
2. Drag and drop the entire project folder
3. Site will be live immediately

#### Option C: Traditional Web Hosting

1. Upload all files via FTP
2. Ensure directory structure is maintained
3. Set index.html as default page

## 👥 Admin Users

The platform has three admin roles configured:

1. **Cash Create** (Super Admin)
   - Email: torrancegreen22@yahoo.com
   - Full control over all content

2. **Jay Bando Baby** (Artist Admin)
   - Email: jaybandobaby4@gmail.com
   - Can edit Jay Bando Baby page only

3. **B Blazo** (Artist Admin)
   - Email: beats4bblazo@gmail.com
   - Can edit B Blazo page only

**IMPORTANT:** Create these accounts in Firebase Authentication after setup.

## ✨ Features

### For Fans
- Browse artist profiles and music
- Vote in polls
- Follow favorite artists
- RSVP to events
- Purchase merchandise
- Sign up for exclusive updates

### For Admins
- Add/edit songs and videos
- Create polls
- View analytics (poll results, signups, orders)
- Manage bookings
- Update artist bios

### Technical Features
- Mobile-first responsive design
- Firebase authentication
- Firestore real-time database
- Stripe payment processing
- Sticky music player
- Image/video embedding
- Google Maps integration

## 🎨 Design

The platform features an urban street culture design inspired by:
- Graffiti textures
- Bold typography
- Dark theme with orange/gold accents
- Boston cultural references

Color Palette:
- Primary Orange: #FF6B35
- Gold Accent: #FFD700
- Dark Background: #0A0A0A
- Light Gray: #1A1A1A

## 📱 Navigation

The site has exactly 6 navigation tabs:
1. Home
2. Jay Bando Baby
3. B Blazo
4. Cash Create
5. Create Hub
6. Merch

## 🔧 Configuration Required

Before deployment, update these files:

### 1. config/firebase-config.js
Replace all placeholder values with your Firebase project credentials.

### 2. js/merch.js
Replace `pk_test_YOUR_PUBLISHABLE_KEY_HERE` with your Stripe publishable key.

### 3. HTML files
Update placeholder content:
- Spotify embed URLs
- YouTube video IDs
- Instagram handles
- Social media links
- Event details

## 🔒 Security Setup

### Firebase Security Rules

Set these in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fans/{fanId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    match /artists/{artistId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /polls/{pollId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /votes/{voteId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
    match /follows/{followId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow delete: if request.auth != null;
    }
    match /bookings/{bookingId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    match /orders/{orderId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

## 📊 Firestore Collections

The platform uses these Firestore collections:

- `artists` - Artist profiles and bios
- `songs` - Music releases
- `videos` - Music videos
- `polls` - Fan polls
- `votes` - Poll votes
- `fans` - Fan signups
- `follows` - Artist follows
- `bookings` - Service requests
- `orders` - Merch orders

## 💳 Stripe Payment Flow

1. Customer selects product
2. Fills out shipping information
3. Enters card details (Stripe Elements)
4. Payment is processed
5. Order saved to Firestore
6. Confirmation displayed

**Note:** Full Stripe integration requires server-side implementation for production.

## 📈 Analytics

Admins can view:
- Fan signups
- Poll results (fans cannot see)
- Event RSVPs
- Merch orders
- Most popular songs

Access via Firebase Console or build an admin dashboard.

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 To-Do After Deployment

1. ✅ Set up Firebase project
2. ✅ Configure authentication
3. ✅ Set up Firestore database
4. ✅ Add security rules
5. ✅ Create admin accounts
6. ✅ Set up Stripe account
7. ✅ Add real content (songs, videos, bios)
8. ✅ Test all features
9. ✅ Set up custom domain
10. ✅ Configure SSL certificate

## 🐛 Troubleshooting

### Firebase not connecting
- Check firebase-config.js has correct credentials
- Verify Firebase SDK is loaded in HTML
- Check browser console for errors

### Stripe not working
- Verify publishable key is correct
- Check Stripe is in test mode for testing
- Switch to live keys for production

### Admin controls not showing
- Verify user is logged in
- Check email matches admin list
- Clear browser cache

## 📞 Support

For issues or questions:
- Check browser console for errors
- Review Firebase Console logs
- Verify all configuration steps completed

## 📄 License

© 2026 Great Minds Creating. All rights reserved.

## 🎯 Credits

Built for Great Minds Creating
- Cash Create
- Jay Bando Baby
- B Blazo

Platform developed with:
- HTML5
- CSS3
- JavaScript
- Firebase
- Stripe

---

**Ready to go live!** Follow the setup instructions above and deploy your platform.
