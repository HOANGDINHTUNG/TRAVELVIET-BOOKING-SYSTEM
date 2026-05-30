import { Redirect } from 'expo-router';

/** Route cũ — chuyển sang login API thật */
export default function LegacyLoginRedirect() {
  return <Redirect href="/(auth)/login" />;
}
