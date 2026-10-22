import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './src/config/firebase';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import { saveUserPushToken } from './src/services/userService';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Điều hướng Auth: 'login' | 'register'
  const [authScreen, setAuthScreen] = useState('login');

  // Điều hướng Main: 'profile' | 'notifications'
  const [mainScreen, setMainScreen] = useState('profile');

  // Notification states
  const [pushToken, setPushToken] = useState(null);
  const [lastNotification, setLastNotification] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  // 1. Lắng nghe trạng thái đăng nhập Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthChecking(false);

      if (user && pushToken) {
        try {
          await saveUserPushToken(user.uid, pushToken);
        } catch (e) {
          console.warn('Lỗi đồng bộ Push Token lên Firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, [pushToken]);

  // 2. Khởi tạo dịch vụ Push Notification & Lắng nghe thông báo
  useEffect(() => {
    // Đăng ký quyền & sinh Token
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setPushToken(token);
        if (currentUser?.uid) {
          saveUserPushToken(currentUser.uid, token);
        }
      }
    });

    // Lắng nghe khi nhận thông báo (Foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setLastNotification(notification);
      }
    );

    // Lắng nghe khi người dùng bấm vào thông báo
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        setLastNotification(response.notification);
        if (currentUser) {
          setMainScreen('notifications');
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [currentUser]);

  // Màn hình chờ khi đang kiểm tra phiên đăng nhập
  if (authChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Đang khởi tạo ứng dụng Firebase...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {!currentUser ? (
        // LUỒNG XÁC THỰC (Chưa đăng nhập)
        authScreen === 'login' ? (
          <LoginScreen onNavigateRegister={() => setAuthScreen('register')} />
        ) : (
          <RegisterScreen onNavigateLogin={() => setAuthScreen('login')} />
        )
      ) : (
        // LUỒNG CHÍNH (Đã đăng nhập)
        mainScreen === 'profile' ? (
          <ProfileScreen
            user={currentUser}
            onNavigateNotifications={() => setMainScreen('notifications')}
          />
        ) : (
          <NotificationScreen
            pushToken={pushToken}
            lastNotification={lastNotification}
            onNavigateBack={() => setMainScreen('profile')}
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: RNStatusBar.currentHeight || 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});
