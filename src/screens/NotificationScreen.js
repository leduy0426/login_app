import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { sendLocalTestNotification } from '../services/notificationService';

export default function NotificationScreen({
  pushToken,
  lastNotification,
  onNavigateBack,
}) {
  const [testTitle, setTestTitle] = useState('🔥 Firebase Push Notification');
  const [testBody, setTestBody] = useState(
    'Ứng dụng MMA301 vừa nhận được thông báo đẩy thành công!'
  );
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    if (!pushToken) {
      Alert.alert(
        'Chưa có Token',
        'Vui lòng chạy ứng dụng trên thiết bị thật (Physical device) hoặc cấp quyền thông báo để sinh Token.'
      );
      return;
    }
    setCopied(true);
    Alert.alert('Đã sao chép Push Token', pushToken);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendTestPush = async () => {
    if (!testTitle.trim() || !testBody.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề và nội dung thông báo.');
      return;
    }

    setSending(true);
    try {
      await sendLocalTestNotification(testTitle.trim(), testBody.trim(), {
        source: 'In-app Test Button',
        createdAt: new Date().toISOString(),
      });
      Alert.alert(
        'Đã gửi thông báo',
        'Thông báo đã được phát! Kiểm tra thanh trạng thái (status bar) hoặc pop-up trên màn hình của bạn.'
      );
    } catch (error) {
      Alert.alert('Lỗi gửi thông báo', error.message || 'Không thể phát thông báo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onNavigateBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Firebase Cloud Messaging (FCM)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Token Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.badge}>FCM / Expo Token</Text>
            <Text style={styles.cardTitle}>🔑 Device Push Token</Text>
            <Text style={styles.cardSubtitle}>
              Token này được dùng để gửi Push Notification đến đúng thiết bị này từ Firebase Console.
            </Text>
          </View>

          <View style={styles.tokenBox}>
            <Text style={styles.tokenText} selectable numberOfLines={3}>
              {pushToken || 'Đang lấy Token hoặc chạy trên môi trường không hỗ trợ thiết bị thật...'}
            </Text>
          </View>

          <CustomButton
            title={copied ? '✓ Đã Sao Chép Token' : 'Sao Chép Push Token'}
            variant="outline"
            icon="📋"
            onPress={handleCopyToken}
            style={styles.copyBtn}
          />
        </View>

        {/* Card Thử Nghiệm Bắn Thông Báo */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🚀 Kiểm Thử Nhận Thông Báo Đẩy</Text>
            <Text style={styles.cardSubtitle}>
              Bấm nút dưới để phát thông báo kiểm tra hệ thống chuông, rung và banner tiền cảnh.
            </Text>
          </View>

          <CustomInput
            label="Tiêu đề thông báo"
            icon="📢"
            value={testTitle}
            onChangeText={setTestTitle}
            placeholder="Tiêu đề"
          />

          <CustomInput
            label="Nội dung thông báo"
            icon="💬"
            value={testBody}
            onChangeText={setTestBody}
            placeholder="Nội dung thông báo..."
            multiline
          />

          <CustomButton
            title="Bắn Thông Báo Thử Nghiệm"
            icon="🔔"
            onPress={handleSendTestPush}
            loading={sending}
            style={styles.sendBtn}
          />
        </View>

        {/* Thông Báo Mới Nhất Nhận Được */}
        {lastNotification && (
          <View style={[styles.card, styles.lastNotifCard]}>
            <Text style={styles.lastNotifTitle}>🎉 Thông Báo Vừa Nhận Được:</Text>
            <Text style={styles.notifItemTitle}>
              {lastNotification?.request?.content?.title || 'Không có tiêu đề'}
            </Text>
            <Text style={styles.notifItemBody}>
              {lastNotification?.request?.content?.body || 'Không có nội dung'}
            </Text>
          </View>
        )}

        {/* Hướng Dẫn Bắn FCM từ Firebase Console */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>📖 Hướng Dẫn Bắn Notification Từ Firebase Console:</Text>
          <Text style={styles.stepText}>1. Đăng nhập vào Firebase Console ➔ Mở Project của bạn.</Text>
          <Text style={styles.stepText}>2. Menu bên trái ➔ Chọn **Engage** ➔ **Messaging** (FCM).</Text>
          <Text style={styles.stepText}>3. Bấm **Create campaign** ➔ Chọn **Firebase Notification messages**.</Text>
          <Text style={styles.stepText}>4. Nhập tiêu đề và nội dung thông báo.</Text>
          <Text style={styles.stepText}>
            5. Bấm nút **Send test message** ➔ Dán Push Token ở trên vào ➔ Bấm **Test**.
          </Text>
          <Text style={styles.stepText}>
            6. Thiết bị di động của bạn sẽ lập tức nhận được thông báo đẩy rung và kêu chuông!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 35,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  tokenBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  tokenText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  copyBtn: {
    height: 44,
  },
  sendBtn: {
    marginTop: 6,
  },
  lastNotifCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  lastNotifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 6,
  },
  notifItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 2,
  },
  notifItemBody: {
    fontSize: 13,
    color: '#065F46',
  },
  guideCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12.5,
    color: '#1E3A8A',
    marginBottom: 6,
    lineHeight: 18,
  },
});
