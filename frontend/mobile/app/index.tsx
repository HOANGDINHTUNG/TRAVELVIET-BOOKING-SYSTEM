import { Redirect } from 'expo-router';

export default function Index() {
  // Lệnh này sẽ tự động đá người dùng sang trang Đăng nhập ngay khi vừa mở App
  return <Redirect href="/(auth)/login" />;
}