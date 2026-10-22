import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * CẤU HÌNH FIREBASE PROJECT (MMA301)
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDlXNQ90902LQV-tupLVJDJlx7KMT0MPvg",
  authDomain: "mma301-login-app.firebaseapp.com",
  projectId: "mma301-login-app",
  storageBucket: "mma301-login-app.firebasestorage.app",
  messagingSenderId: "223848972731",
  appId: "1:223848972731:web:789cbafd343836dd8f449e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
