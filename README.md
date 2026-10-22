# Ứng Dụng Quản Lý Người Dùng & Push Notification Với Firebase (MMA301)

Ứng dụng di động xây dựng bằng **React Native (Expo SDK)** kết hợp với **Google Firebase** phục vụ bài tập môn MMA301.

## 🌟 Tính Năng Chính

1. **Authentication (Firebase Auth)**:
   - Đăng ký tài khoản mới với đầy đủ thông tin: Họ tên, Email, Mật khẩu, Số điện thoại, Địa chỉ.
   - Đăng nhập an toàn với Email & Mật khẩu.
   - Tự động lưu phiên và tự động đăng nhập khi mở lại app.
   - Đăng xuất tài khoản an toàn.

2. **Quản Lý Thông Tin Người Dùng (User Profile & Firestore)**:
   - Xem thông tin tài khoản hiện tại.
   - Cập nhật Họ và tên, Số điện thoại và Địa chỉ (Lưu trữ và đồng bộ hóa trên Cloud Firestore).
   - Đổi địa chỉ Email (Cập nhật Firebase Auth + đồng bộ Firestore).
   - Đổi Mật khẩu với cơ chế Re-authentication (xác thực mật khẩu cũ) đảm bảo an toàn tuyệt đối.

3. **Firebase Cloud Messaging (FCM) & Push Notification**:
   - Tích hợp `expo-notifications` và `expo-device`.
   - Xin cấp quyền thông báo và tự động sinh Device Push Token.
   - Lưu trữ `pushToken` của từng người dùng lên Firestore để hỗ trợ bắn thông báo theo User/Segment.
   - Xử lý nhận thông báo cả khi app chạy tiền cảnh (Foreground) lẫn chạy ngầm (Background).
   - Màn hình quản lý Push Notification tích hợp sẵn nút **Sao chép Token** và **Bắn thông báo thử nghiệm**.

4. **Nộp Link Online**:
   - Hỗ trợ chạy trực tiếp trên **Expo Snack** (`snack.expo.dev`).
   - Xem tài liệu hướng dẫn tại [`docs/submission_guide.md`](docs/submission_guide.md).

## 🚀 Cài Đặt & Khởi Chạy

```bash
# Cài đặt thư viện (nếu chưa có node_modules)
npm install

# Khởi chạy ứng dụng
npx expo start
```
