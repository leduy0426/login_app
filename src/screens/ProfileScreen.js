import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {
  logoutUser,
  updateUserEmail,
  updateUserPassword,
  getFriendlyAuthErrorMessage,
} from '../services/authService';
import { getUserProfile, updateUserProfile } from '../services/userService';

export default function ProfileScreen({ user, onNavigateNotifications }) {
  // State profile Firestore
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // State cập nhật Email
  const [currentEmail, setCurrentEmail] = useState(user?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // State cập nhật Mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Tải dữ liệu hồ sơ từ Firestore
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      setLoadingProfile(true);
      try {
        const data = await getUserProfile(user.uid);
        if (data) {
          setFullName(data.fullName || user.displayName || '');
          setPhoneNumber(data.phoneNumber || '');
          setAddress(data.address || '');
          if (data.email) setCurrentEmail(data.email);
        } else {
          setFullName(user.displayName || '');
        }
      } catch (error) {
        console.warn('Lỗi tải dữ liệu người dùng:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.uid, user?.displayName]);

  // 1. Cập nhật Họ tên, Số điện thoại và Địa chỉ
  const handleUpdateContactInfo = async () => {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (phoneNumber && !phoneRegex.test(phoneNumber.trim().replace(/\s/g, ''))) {
      Alert.alert('Lỗi', 'Số điện thoại không đúng định dạng (10 chữ số).');
      return;
    }

    setSavingProfile(true);
    try {
      await updateUserProfile(user.uid, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });
      Alert.alert('Thành công', 'Thông tin cá nhân (SĐT, Địa chỉ) đã được cập nhật thành công!');
    } catch (error) {
      Alert.alert('Thất bại', error.message || 'Không thể lưu thông tin vào Firestore.');
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Cập nhật Email (Firebase Auth + Firestore)
  const handleUpdateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email mới.');
      return;
    }
    if (!emailRegex.test(newEmail.trim())) {
      Alert.alert('Lỗi', 'Email mới không đúng định dạng.');
      return;
    }
    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      Alert.alert('Lỗi', 'Email mới phải khác với email hiện tại.');
      return;
    }

    setSavingEmail(true);
    try {
      const updated = await updateUserEmail(newEmail);
      setCurrentEmail(updated);
      setNewEmail('');
      Alert.alert('Thành công', `Email đã được cập nhật thành: ${updated}`);
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      Alert.alert('Cập nhật Email thất bại', message);
    } finally {
      setSavingEmail(false);
    }
  };

  // 3. Cập nhật Mật khẩu (Re-authenticate + updatePassword)
  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại để xác thực.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới nhập lại không khớp.');
      return;
    }

    setSavingPassword(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      Alert.alert('Thành công', 'Mật khẩu của bạn đã được thay đổi thành công!');
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      Alert.alert('Đổi mật khẩu thất bại', message);
    } finally {
      setSavingPassword(false);
    }
  };

  // 4. Đăng xuất
  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
          } catch (e) {
            console.error('Lỗi đăng xuất:', e);
          }
        },
      },
    ]);
  };

  const getInitials = () => {
    if (fullName) {
      const words = fullName.trim().split(' ');
      if (words.length > 1) {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    return (currentEmail || 'US').substring(0, 2).toUpperCase();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Hồ Sơ */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.profileName}>{fullName || 'Người Dùng'}</Text>
          <Text style={styles.profileEmail}>{currentEmail}</Text>
          <View style={styles.uidBadge}>
            <Text style={styles.uidText} numberOfLines={1}>
              UID: {user?.uid}
            </Text>
          </View>
        </View>

        {/* Nút tắt chuyển nhanh sang trang Test FCM Notification */}
        <TouchableOpacity
          style={styles.notificationBannerBtn}
          onPress={onNavigateNotifications}
          activeOpacity={0.8}
        >
          <View style={styles.notifLeft}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View>
              <Text style={styles.notifTitle}>Dịch vụ Push Notification (FCM)</Text>
              <Text style={styles.notifDesc}>Xem Push Token & Bắn thông báo thử nghiệm</Text>
            </View>
          </View>
          <Text style={styles.notifArrow}>➔</Text>
        </TouchableOpacity>

        {loadingProfile ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Đang tải thông tin người dùng từ Firestore...</Text>
          </View>
        ) : (
          <>
            {/* CARD 1: Cập nhật Thông tin cá nhân (Họ tên, SĐT, Địa chỉ) */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>👤 Thông Tin Cá Nhân</Text>
                <Text style={styles.cardSubtitle}>Cập nhật Số điện thoại & Địa chỉ lưu trữ trên Firestore</Text>
              </View>

              <CustomInput
                label="Họ và tên"
                icon="✏️"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
              />

              <CustomInput
                label="Số điện thoại"
                icon="📱"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="0987654321"
                keyboardType="phone-pad"
              />

              <CustomInput
                label="Địa chỉ cư trú"
                icon="📍"
                value={address}
                onChangeText={setAddress}
                placeholder="Số nhà, đường, quận/huyện, TP..."
                multiline
              />

              <CustomButton
                title="Lưu Thông Tin Cá Nhân"
                onPress={handleUpdateContactInfo}
                loading={savingProfile}
                style={styles.actionBtn}
              />
            </View>

            {/* CARD 2: Cập nhật Email */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>✉️ Cập Nhật Địa Chỉ Email</Text>
                <Text style={styles.cardSubtitle}>Cập nhật email đăng nhập và đồng bộ hệ thống</Text>
              </View>

              <CustomInput
                label="Email hiện tại"
                icon="🔒"
                value={currentEmail}
                editable={false}
              />

              <CustomInput
                label="Email mới"
                icon="✉️"
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="nhapemailmoi@example.com"
                keyboardType="email-address"
              />

              <CustomButton
                title="Cập Nhật Email"
                variant="secondary"
                onPress={handleUpdateEmail}
                loading={savingEmail}
                style={styles.actionBtn}
              />
            </View>

            {/* CARD 3: Cập nhật Mật khẩu */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🔑 Đổi Mật Khẩu</Text>
                <Text style={styles.cardSubtitle}>Xác thực mật khẩu cũ để đổi mật khẩu mới an toàn</Text>
              </View>

              <CustomInput
                label="Mật khẩu hiện tại"
                icon="🔐"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu đang dùng"
                secureTextEntry
              />

              <CustomInput
                label="Mật khẩu mới"
                icon="✨"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                secureTextEntry
              />

              <CustomInput
                label="Nhập lại mật khẩu mới"
                icon="🔒"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry
              />

              <CustomButton
                title="Đổi Mật Khẩu"
                variant="secondary"
                onPress={handleUpdatePassword}
                loading={savingPassword}
                style={styles.actionBtn}
              />
            </View>
          </>
        )}

        {/* Nút Đăng Xuất */}
        <CustomButton
          title="Đăng Xuất Tài Khoản"
          variant="danger"
          icon="🚪"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
  },
  uidBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: '90%',
  },
  uidText: {
    fontSize: 11,
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  notificationBannerBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  notifLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notifIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notifTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  notifDesc: {
    color: '#E0E7FF',
    fontSize: 12,
    marginTop: 2,
  },
  notifArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
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
    marginBottom: 16,
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
  },
  actionBtn: {
    marginTop: 6,
  },
  logoutBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
