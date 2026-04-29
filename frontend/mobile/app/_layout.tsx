import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Thuộc tính initialRouteName sẽ chỉ định thư mục nào được chạy lên đầu tiên
    <Stack initialRouteName="(auth)">
      
      {/* 1. Khai báo luồng Đăng nhập/Đăng ký (Cho nó chạy đầu tiên) */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* 2. Khai báo luồng chính của App (Màn hình Home, Explore...) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 3. Khai báo các màn hình phụ khác (như Modal, Not Found) */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}