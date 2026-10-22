# Hướng Dẫn Vận Hành, Kiểm Thử & Nộp Link Online (MMA301)

Tài liệu này hướng dẫn chi tiết cách cấu hình Firebase, chạy ứng dụng trên máy thật/máy ảo, và tạo **Link Nộp Bài Trực Tuyến** (Expo Snack) cho bài tập MMA301.

---

## 🔑 1. Cấu Hình Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/) và tạo một Project mới (hoặc dùng project có sẵn).
2. **Kích hoạt Authentication**:
   - Vào **Build** ➔ **Authentication** ➔ **Get Started**.
   - Tại tab **Sign-in method**, bấm chọn **Email/Password** ➔ Bật **Enable** ➔ **Save**.
3. **Kích hoạt Cloud Firestore**:
   - Vào **Build** ➔ **Firestore Database** ➔ **Create database**.
   - Chọn chế độ **Start in test mode** (để cho phép đọc/ghi trong quá trình làm bài) ➔ Bấm **Next** ➔ Chọn vị trí máy chủ (vd: `asia-southeast1` hoặc `nam5`) ➔ **Enable**.
4. **Lấy Cấu hình Web App**:
   - Bấm vào biểu tượng bánh răng ⚙️ ở góc trên bên trái ➔ **Project settings**.
   - Tại tab **General**, cuộn xuống phần **Your apps** ➔ Bấm vào biểu tượng Web `</>`.
   - Đặt tên ứng dụng (vd: `login_app`) ➔ Bấm **Register app**.
   - Sao chép đối tượng `firebaseConfig` và dán vào file [`src/config/firebase.js`](file:///d:/Semester/Fall2026/MMA301/Ex/login_app/src/config/firebase.js):
   ```javascript
   export const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```

---

## 🚀 2. Chạy Ứng Dụng Trên Thiết Bị (Local)

Mở terminal tại thư mục `login_app` và chạy lệnh:
```bash
npx expo start
```
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại Android hoặc Camera trên iPhone.
- Nhấn phím `w` nếu muốn mở chạy thử trên trình duyệt Web.

---

## 🔔 3. Kiểm Thử Push Notification (FCM)

### Cách 1: Thử nghiệm nhanh ngay trong App
1. Đăng nhập vào ứng dụng.
2. Tại màn hình Profile, bấm vào banner tím: **"Dịch vụ Push Notification (FCM)"**.
3. Nhập tiêu đề và nội dung mong muốn ➔ Bấm nút **"Bắn Thông Báo Thử Nghiệm"**.
4. Ứng dụng sẽ phát thông báo lập tức trên thanh thông báo của điện thoại.

### Cách 2: Gửi từ Firebase Console (Remote Push Notification)
1. Tại màn hình **Push Notification (FCM)** trong app, bấm nút **"Sao Chép Push Token"**.
2. Trên máy tính, vào [Firebase Console](https://console.firebase.google.com/) ➔ Menu **Engage** ➔ **Messaging**.
3. Bấm **Create your first campaign** ➔ Chọn **Firebase Notification messages**.
4. Điền **Notification title** và **Notification text**.
5. Bấm nút **Send test message** ở khung xem trước bên phải.
6. Dán Device Push Token đã sao chép từ điện thoại vào ➔ Bấm dấu `+` ➔ Bấm **Test**.
7. Điện thoại sẽ nhận được Push Notification từ server Firebase!

---

## 🌐 4. Hướng Dẫn Tạo Link Nộp Online (Expo Snack)

Đề bài yêu cầu **Nộp link online**, phương án tối ưu và chuẩn nhất cho Expo React Native là tạo link trên **Expo Snack** (`snack.expo.dev`):

### Các bước thực hiện:
1. Truy cập [snack.expo.dev](https://snack.expo.dev).
2. Đăng nhập tài khoản Expo của bạn (nếu có, để lưu vĩnh viễn).
3. Đổi tên Snack ở góc trên bên trái thành: `MMA301_HE194188_LoginApp`.
4. Copy toàn bộ nội dung từ các file trong project vào Snack:
   - File `App.js`: Copy mã từ `App.js`.
   - File `package.json`: Thêm các dependency tương ứng (`firebase`, `expo-notifications`, `expo-device`).
   - Thư mục `src/`: Tạo các file tương ứng trong Snack (`src/config/firebase.js`, `src/screens/...`, `src/services/...`, `src/components/...`).
5. Bấm nút **Save** ở góc trên bên phải.
6. Copy đường link URL trên thanh địa chỉ hoặc bấm **Share** để lấy link nộp bài:
   ```
   https://snack.expo.dev/@le_duy/mma301-login-app
   ```
7. Giảng viên khi nhận được link này có thể:
   - Xem code trực tiếp trên web.
   - Bấm tab **Web Preview** để chạy thử ngay trên trình duyệt.
   - Quét mã QR ở tab **Android/iOS** bằng Expo Go để test push notification trên điện thoại thật!
