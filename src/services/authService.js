import { firebase, auth, db } from '../config/firebase';

/**
 * Chuyển đổi mã lỗi Firebase Auth sang thông báo tiếng Việt dễ hiểu
 */
export const getFriendlyAuthErrorMessage = (error) => {
  if (!error) return 'Đã có lỗi không xác định xảy ra.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng.';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị khóa.';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký cho một tài khoản khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu. Vui lòng nhập tối thiểu 6 ký tự.';
    case 'auth/requires-recent-login':
      return 'Để bảo mật, thao tác này yêu cầu bạn đăng nhập lại trước khi thực hiện.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền internet.';
    case 'auth/too-many-requests':
      return 'Bạn đã thao tác sai quá nhiều lần. Vui lòng thử lại sau ít phút.';
    default:
      return error.message || 'Đã có lỗi xảy ra trong quá trình xác thực.';
  }
};

/**
 * Đăng nhập người dùng bằng Email và Mật khẩu
 */
export const loginUser = async (email, password) => {
  const userCredential = await auth.signInWithEmailAndPassword(email.trim(), password);
  return userCredential.user;
};

/**
 * Đăng ký tài khoản mới và lưu thông tin người dùng vào Firestore
 */
export const registerUser = async (email, password, profileData = {}) => {
  const { fullName = '', phoneNumber = '', address = '' } = profileData;

  // 1. Tạo user trên Firebase Authentication
  const userCredential = await auth.createUserWithEmailAndPassword(email.trim(), password);
  const user = userCredential.user;

  // 2. Cập nhật Display Name trong Firebase Auth
  if (fullName) {
    try {
      await user.updateProfile({ displayName: fullName });
    } catch (e) {
      console.warn('Lỗi cập nhật profile display name:', e);
    }
  }

  // 3. Khởi tạo tài liệu người dùng trong Cloud Firestore
  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    address: address.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return user;
};

/**
 * Đăng xuất tài khoản
 */
export const logoutUser = async () => {
  await auth.signOut();
};

/**
 * Cập nhật Email của người dùng
 */
export const updateUserEmail = async (newEmail) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Chưa đăng nhập');

  const trimmedEmail = newEmail.trim();

  // 1. Cập nhật trong Firebase Auth
  await user.updateEmail(trimmedEmail);

  // 2. Đồng bộ trường email trên Firestore
  await db.collection('users').doc(user.uid).set(
    {
      email: trimmedEmail,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return trimmedEmail;
};

/**
 * Cập nhật Mật khẩu của người dùng (yêu cầu re-authenticate mật khẩu cũ)
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Chưa đăng nhập');

  // 1. Xác thực lại với mật khẩu hiện tại
  const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
  await user.reauthenticateWithCredential(credential);

  // 2. Cập nhật mật khẩu mới
  await user.updatePassword(newPassword);
};
