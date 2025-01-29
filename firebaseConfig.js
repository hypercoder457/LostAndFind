import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "lostandfounddb.firebaseapp.com",
    projectId: "lostandfounddb",
    storageBucket: "lostandfounddb.firebasestorage.app",
    messagingSenderId: "971516787359",
    appId: "1:971516787359:web:fc13aecb2e641049abc0aa"
};

export default function getFirebaseApp() {
    const app = initializeApp(firebaseConfig);
    return app;
}
