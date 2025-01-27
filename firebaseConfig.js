// Import the functions you need from the SDKs you need
import { configDotenv } from "dotenv";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
configDotenv();

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "lostandfounddb.firebaseapp.com",
    projectId: "lostandfounddb",
    storageBucket: "lostandfounddb.firebasestorage.app",
    messagingSenderId: "971516787359",
    appId: "1:971516787359:web:fc13aecb2e641049abc0aa"
};

// Initialize Firebase
export default function getFirebaseApp() {
    const app = initializeApp(firebaseConfig);
    return app;
};