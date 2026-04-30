import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  TextInput, Platform, Alert, KeyboardAvoidingView, ScrollView, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
// Nhập kho dữ liệu tổng để đồng bộ
import { useProfile } from '../../constants/ProfileContext';

export default function EditProfileScreen() {
  const router = useRouter();
  
  // Lấy dữ liệu và hàm cập nhật từ kho tổng
  const { profile, updateProfile } = useProfile();

  // Khởi tạo state bằng dữ liệu từ kho (Thay vì hardcode cứng)
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [province, setProvince] = useState(profile.province);
  
  // Lưu URI của ảnh, mặc định lấy từ kho
  const [selectedImage, setSelectedImage] = useState<string | null>(profile.avatar);

  // Hàm yêu cầu quyền và mở thư viện ảnh
  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'TravelViet cần quyền truy cập thư viện ảnh để đổi ảnh đại diện.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Hàm yêu cầu quyền và mở camera
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'TravelViet cần quyền truy cập camera để chụp ảnh mới.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Hàm hiển thị menu chọn nguồn ảnh
  const showImagePickerOptions = () => {
    Alert.alert(
      "Đổi ảnh đại diện",
      "Vui lòng chọn nguồn ảnh của bạn",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Chụp ảnh mới", onPress: takePhotoWithCamera },
        { text: "Chọn từ thư viện", onPress: pickImageFromLibrary },
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    // ĐÃ SỬA: Cập nhật toàn bộ thông tin mới (bao gồm cả ảnh) vào kho tổng
    updateProfile({ 
      name, 
      phone, 
      email, 
      birthday, 
      province, 
      avatar: selectedImage || profile.avatar 
    });

    Alert.alert("Thành công", "Đã cập nhật thông tin hồ sơ!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name={"arrow-back" as any} size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          
          {/* PHẦN AVATAR */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name={"person" as any} size={40} color="#ccc" />
                </View>
              )}
              
              <TouchableOpacity style={styles.cameraBtn} onPress={showImagePickerOptions}>
                <Ionicons name={"camera" as any} size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.editAvatarText}>Chạm vào camera để đổi ảnh</Text>
          </View>

          {/* CÁC TRƯỜNG NHẬP LIỆU */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nhập họ tên" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput style={styles.input} value={birthday} onChangeText={setBirthday} placeholder="DD/MM/YYYY" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Đến từ (Tỉnh/Thành)</Text>
            <TextInput style={styles.input} value={province} onChangeText={setProvince} placeholder="Nhập tỉnh/thành phố" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Nhập số điện thoại" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Nhập email" />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveBtn: { padding: 5 },
  saveText: { fontSize: 16, color: '#005AAB', fontWeight: 'bold' },
  
  formContainer: { padding: 20 },
  
  avatarSection: { alignItems: 'center', marginBottom: 35 },
  avatarWrapper: { position: 'relative' },
  avatarImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#fff', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
  avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#005AAB', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 6 },
  editAvatarText: { fontSize: 12, color: '#888', marginTop: 12, fontWeight: '500' },

  inputGroup: { marginBottom: 22 },
  label: { fontSize: 13, color: '#666', marginBottom: 8, fontWeight: '600', marginLeft: 2 },
  input: { backgroundColor: '#F8F9FA', height: 50, borderRadius: 12, paddingHorizontal: 15, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#E8E8E8' }
});