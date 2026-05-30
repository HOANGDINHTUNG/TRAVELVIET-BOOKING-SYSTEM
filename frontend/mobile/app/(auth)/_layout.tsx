import { Redirect, Stack } from 'expo-router';
import { getAccessToken } from '@/services/authStorage';
import { AppRoutes, asHref } from '@/lib/navigation';

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Redirect href={asHref(AppRoutes.productTab)} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
