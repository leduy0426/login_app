import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Lấy toàn bộ thông tin hồ sơ người dùng từ Firestore
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

/**
 * Cập nhật các thông tin cơ bản: Họ tên, Số điện thoại, Địa chỉ
 */
export const updateUserProfile = async (uid, updatedFields) => {
  if (!uid) throw new Error('Không có UID');

  const userDocRef = doc(db, 'users', uid);
  const dataToUpdate = {
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };

  // setDoc với merge: true giúp tránh lỗi nếu tài liệu chưa tồn tại trước đó
  await setDoc(userDocRef, dataToUpdate, { merge: true });
  return dataToUpdate;
};

/**
 * Lưu Device Push Token (FCM / Expo Push Token) vào Firestore
 */
export const saveUserPushToken = async (uid, pushToken) => {
  if (!uid || !pushToken) return;

  const userDocRef = doc(db, 'users', uid);
  await setDoc(
    userDocRef,
    {
      pushToken,
      lastTokenUpdate: new Date().toISOString(),
    },
    { merge: true }
  );
};
