// Firebase configuration - using CDN imports (no npm install needed)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGuq0Kq8Z77kk6amiSJZsV1gbCq0pM0KM",
    authDomain: "website-waitlist-696df.firebaseapp.com",
    projectId: "website-waitlist-696df",
    storageBucket: "website-waitlist-696df.firebasestorage.app",
    messagingSenderId: "636134236497",
    appId: "1:636134236497:web:29c8eba5ecebd889f8b370",
    measurementId: "G-9Y4PDNEDME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export db for use in other files
window.firestoreDb = db;

