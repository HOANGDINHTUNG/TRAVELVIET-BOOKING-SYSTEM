import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loginCopy } from '@/constants/loginCopy';
import { styles } from '../styles/_login.styles';
import { commerceDesk } from '@/theme/commerceDesk';
import { AppRoutes, asHref } from '@/lib/navigation';

/** Commerce Desk — không đăng ký công khai; chỉ hướng dẫn liên hệ admin */
export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.kicker}>{loginCopy.kicker}</Text>
        <Ionicons
          name="shield-checkmark-outline"
          size={56}
          color={commerceDesk.accent}
          style={{ alignSelf: 'center', marginBottom: 16 }}
        />
        <Text style={styles.title}>{loginCopy.registerTitle}</Text>
        <Text style={[styles.subtitle, { marginBottom: 28 }]}>{loginCopy.registerBody}</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace(asHref(AppRoutes.login))}>
          <Text style={styles.loginButtonText}>{loginCopy.backToLogin}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
