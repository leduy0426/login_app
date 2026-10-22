import firebase from 'firebase';

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

// Khởi tạo an toàn cho Expo Snack & Fast Refresh
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
