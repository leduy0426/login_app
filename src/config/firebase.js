import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * CẤU HÌNH FIREBASE PROJECT (MMA301)
 * Thay thế các thông tin bên dưới bằng cấu hình từ Firebase Console của bạn:
 * Firebase Console -> Project Settings -> General -> Your apps -> Web app
 */
const firebaseConfig = {
  apiKey: "AIzaSyDlXNQ90902LQV-tupLVJDJlx7KMT0MPvg",
  authDomain: "mma301-login-app.firebaseapp.com",
  projectId: "mma301-login-app",
  storageBucket: "mma301-login-app.firebasestorage.app",
  messagingSenderId: "223848972731",
  appId: "1:223848972731:web:789cbafd343836dd8f449e"
};
// Khởi tạo Firebase App an toàn (tránh khởi tạo lại khi fast-refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Auth và Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
