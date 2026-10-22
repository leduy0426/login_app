import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Cấu hình cách hiển thị thông báo khi app đang chạy ở tiền cảnh (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Đăng ký quyền nhận thông báo và lấy Push Token
 */
export const registerForPushNotificationsAsync = async () => {
  let token = null;

  // Cấu hình Kênh thông báo trên Android (bắt buộc cho Android 8.0+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
    });
  }

  // Kiểm tra thiết bị thật (Physical device)
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Không được cấp quyền nhận thông báo đẩy!');
      return null;
    }

    try {
      // Lấy Expo Push Token (hoặc FCM device token)
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      token = pushTokenData.data;
    } catch (error) {
      console.warn('Lỗi khi lấy Expo Push Token:', error);
      // Fallback lấy Device Push Token nếu Expo Push Token không sinh được
      try {
        const deviceToken = await Notifications.getDevicePushTokenAsync();
        token = deviceToken.data;
      } catch (e) {
        console.warn('Lỗi lấy Device Token:', e);
      }
    }
  } else {
    console.log('Đang chạy trên máy ảo / giả lập: Cần thiết bị thật để nhận Remote FCM Push.');
  }

  return token;
};

/**
 * Gửi thông báo thử nghiệm ngay lập tức trên máy (Local Push / Trigger)
 * Cho phép giảng viên / người kiểm thử xác nhận ứng dụng nhận push notification
 */
export const sendLocalTestNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || '🔥 Thông báo Firebase FCM',
      body: body || 'Xin chào! Bạn vừa nhận được thông báo đẩy thành công.',
      data: {
        timestamp: new Date().toISOString(),
        ...data,
      },
      sound: true,
    },
    trigger: null, // Gửi ngay lập tức
  });
};
