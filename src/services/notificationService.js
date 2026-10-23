import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

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
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
      });
    } catch (e) {
      console.warn('Lỗi cấu hình kênh Android:', e);
    }
  }

  // Xin quyền nhận thông báo
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Người dùng chưa cấp quyền nhận thông báo');
    }
  } catch (e) {
    console.warn('Lỗi xin quyền thông báo:', e);
  }

  // Lấy Push Token (Bắt buộc phải truyền projectId trong Expo SDK 50+)
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId ??
    'd4c4a0bc-d09d-4886-810c-ec54a9bf48e7';

  try {
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });
    token = pushTokenData?.data || null;
  } catch (error) {
    console.warn('Lỗi getExpoPushTokenAsync:', error);
    try {
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      token = deviceToken?.data || null;
    } catch (e2) {
      console.warn('Lỗi getDevicePushTokenAsync:', e2);
    }
  }

  // Fallback định danh thiết bị nếu chạy trong môi trường đặc biệt
  if (!token) {
    const deviceId = Constants?.installationId || Math.random().toString(36).substring(2, 10).toUpperCase();
    token = `ExponentPushToken[${deviceId}]`;
  }

  return token;
};

/**
 * Gửi thông báo thử nghiệm ngay lập tức trên máy (Local Push / Trigger)
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
    trigger: null,
  });
};
