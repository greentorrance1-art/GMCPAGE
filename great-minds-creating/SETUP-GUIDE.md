# 🚀 Great Minds Creating - Complete Setup Guide

This guide will walk you through setting up your platform step-by-step.

## Part 1: Pre-Deployment Setup

### Step 1: Add Your Logo Images

1. Copy the logo images provided to `assets/logos/`
2. Rename the main logo to `logo-main.png`
3. Recommended size: 500px wide, transparent background

### Step 2: Firebase Setup (15-20 minutes)

#### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Project name: `great-minds-creating`
4. Disable Google Analytics (optional)
5. Click "Create project"

#### 2.2 Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Enable "Email/Password"
6. Click "Save"

#### 2.3 Create Admin Accounts

1. Click "Users" tab
2. Click "Add user"
3. Create these three admin accounts:

   **Super Admin:**
   - Email: torrancegreen22@yahoo.com
   - Password: [Choose a strong password]

   **Jay Bando Baby Admin:**
   - Email: jaybandobaby4@gmail.com
   - Password: [Choose a strong password]

   **B Blazo Admin:**
   - Email: beats4bblazo@gmail.com
   - Password: [Choose a strong password]

4. Save these passwords securely!

#### 2.4 Create Firestore Database

1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Start in "Production mode"
4. Choose location: `us-central1` (or closest to your users)
5. Click "Enable"

#### 2.5 Set Firestore Security Rules

1. Click "Rules" tab
2. Replace all content with the rules from `config/firebase-config.js`
3. Click "Publish"

#### 2.6 Enable Storage

1. Click "Storage" in left sidebar
2. Click "Get started"
3. Use default security rules
4. Click "Done"

#### 2.7 Get Firebase Configuration

1. Click gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click "Web" icon (</>)
5. App nickname: `Great Minds Creating`
6. Click "Register app"
7. **Copy the firebaseConfig object**
8. Open `config/firebase-config.js`
9. Replace the placeholder config with your config
10. Save the file

### Step 3: Stripe Setup (10 minutes)

#### 3.1 Create Stripe Account

1. Go to https://stripe.com
2. Click "Sign up"
3. Complete registration

#### 3.2 Get API Keys

1. In Stripe Dashboard, click "Developers"
2. Click "API keys"
3. Copy your "Publishable key" (starts with `pk_test_`)

#### 3.3 Update Project

1. Open `js/merch.js`
2. Find line: `const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');`
3. Replace with your key: `const stripe = Stripe('pk_test_YOUR_ACTUAL_KEY');`
4. Save the file

**For Production:**
- Switch to live mode in Stripe
- Use live keys (pk_live_...)
- Set up webhook endpoint
- Configure products in Stripe Dashboard

### Step 4: Add Content

#### 4.1 Update HTML Files

Go through each HTML file and update:

**index.html:**
- Replace placeholder Spotify embeds with real ones
- Update slider content

**Artist Pages:**
- Add real Spotify/YouTube embeds
- Update social media links
- Customize bios (or will be editable by admins after login)

**create-hub.html:**
- Update event information
- Add real YouTube video embeds
- Update Google Maps embed location

**merch.html:**
- Add product images (or keep placeholders)
- Update product names and prices

## Part 2: Deployment

### Option A: Firebase Hosting (Recommended)

#### Installation

```bash
# Install Node.js first if you don't have it
# Download from: https://nodejs.org

# Install Firebase CLI
npm install -g firebase-tools
```

#### Setup

```bash
# Navigate to project directory
cd great-minds-creating

# Login to Firebase
firebase login

# Initialize Firebase
firebase init
```

When prompted:
- Select: `Hosting`
- Use existing project: Select your project
- Public directory: `.` (just press Enter)
- Single-page app: `No`
- Overwrite index.html: `No`

#### Deploy

```bash
firebase deploy
```

Your site will be live at: `https://your-project-id.web.app`

#### Custom Domain (Optional)

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Follow instructions to connect your domain

### Option B: Netlify (Easy Alternative)

1. Create account at https://www.netlify.com
2. Click "Add new site" > "Deploy manually"
3. Drag and drop the entire `great-minds-creating` folder
4. Site goes live immediately!
5. Get URL like: `https://your-site-name.netlify.app`

### Option C: Traditional Web Hosting

1. Connect to your hosting via FTP (FileZilla, etc.)
2. Upload ALL files maintaining folder structure
3. Ensure `index.html` is in the root directory
4. Set up SSL certificate (usually free via Let's Encrypt)

## Part 3: Post-Deployment

### Step 1: Test Admin Login

1. Go to your live site
2. Click "Login"
3. Login with torrancegreen22@yahoo.com
4. Verify admin controls appear

### Step 2: Add Initial Content to Firestore

#### Create Artists Collection

In Firebase Console > Firestore:

1. Click "Start collection"
2. Collection ID: `artists`
3. Add document:
   ```
   name: "Jay Bando Baby"
   bio: "Jay Bando Baby brings authentic Boston energy..."
   instagram: "@jaybandobaby"
   spotify: "https://open.spotify.com/artist/..."
   ```
4. Repeat for B Blazo and Cash Create

#### Create Initial Poll

1. Collection ID: `polls`
2. Add document:
   ```
   question: "Favorite Artist of the Month"
   options: ["Jay Bando Baby", "B Blazo", "Cash Create"]
   votes: {}
   active: true
   createdAt: [current timestamp]
   ```

### Step 3: Test All Features

- ✅ Navigation works
- ✅ Slider advances
- ✅ Music player controls work
- ✅ Admin login works
- ✅ Admin controls appear for correct users
- ✅ Polls can be voted on
- ✅ Artist follow buttons work
- ✅ Booking form submits
- ✅ Merch checkout opens
- ✅ Mobile menu works
- ✅ All pages load correctly

### Step 4: Mobile Testing

Test on actual devices:
- iPhone Safari
- Android Chrome
- Tablet

### Step 5: Configure Email Notifications (Optional)

For order/booking notifications, integrate:
- SendGrid
- Mailgun
- Firebase Cloud Functions + Nodemailer

## Part 4: Maintenance

### Regular Tasks

**Weekly:**
- Check Firebase usage (free tier limits)
- Review new fan signups
- Check booking requests
- Process merch orders

**Monthly:**
- Create new polls
- Add new music releases
- Update artist content
- Review analytics

### Monitoring

**Firebase Console:**
- Authentication: User signups
- Firestore: Database usage
- Storage: File uploads
- Analytics: Traffic

**Stripe Dashboard:**
- Payments
- Customers
- Disputes

## Part 5: Common Issues

### Issue: Firebase not connecting

**Solution:**
1. Check config/firebase-config.js has correct credentials
2. Verify Firebase SDK scripts in HTML
3. Check browser console for errors
4. Ensure Firestore is enabled

### Issue: Admin controls not showing

**Solution:**
1. Verify logged in with correct email
2. Email must match exactly (case-sensitive)
3. Clear browser cache
4. Check auth.js for email list

### Issue: Stripe errors

**Solution:**
1. Verify publishable key is correct
2. Check Stripe dashboard for issues
3. Ensure in test mode for testing
4. Check browser console errors

### Issue: Mobile menu not working

**Solution:**
1. Clear cache
2. Check JavaScript console
3. Verify main.js is loaded

## Part 6: Advanced Features

### Add Admin Dashboard

Create `admin.html` with:
- Analytics overview
- User management
- Content management
- Order processing

### SMS Notifications

Integrate Twilio for fan notifications:
- New music releases
- Event reminders
- Exclusive offers

### Email Marketing

Connect to:
- Mailchimp
- SendGrid
- ConvertKit

### Analytics

Add Google Analytics:
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

## 🎉 You're Done!

Your Great Minds Creating platform is now live!

### Next Steps:

1. Share the URL with the team
2. Start promoting to fans
3. Add content regularly
4. Engage with your community
5. Grow your brand!

### Need Help?

Check:
- README.md for overview
- Firebase documentation: https://firebase.google.com/docs
- Stripe documentation: https://stripe.com/docs

---

Built for Great Minds Creating 🎵
