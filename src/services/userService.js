import { db } from '../config/firebase';

/**
 * Lấy toàn bộ thông tin hồ sơ người dùng từ Firestore
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const docSnap = await db.collection('users').doc(uid).get();

  if (docSnap.exists) {
    return docSnap.data();
  }
  return null;
};

/**
 * Cập nhật các thông tin cơ bản: Họ tên, Số điện thoại, Địa chỉ
 */
export const updateUserProfile = async (uid, updatedFields) => {
  if (!uid) throw new Error('Không có UID');

  const dataToUpdate = {
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };

  await db.collection('users').doc(uid).set(dataToUpdate, { merge: true });
  return dataToUpdate;
};

/**
 * Lưu Device Push Token (FCM / Expo Push Token) vào Firestore
 */
export const saveUserPushToken = async (uid, pushToken) => {
  if (!uid || !pushToken) return;

  await db.collection('users').doc(uid).set(
    {
      pushToken,
      lastTokenUpdate: new Date().toISOString(),
    },
    { merge: true }
  );
};
