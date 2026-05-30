import { Stack } from 'expo-router';
import { AiChatButton } from '@/components/ai/AiChatButton';
import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack initialRouteName="index">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <AiChatButton />
    </AppProviders>
  );
}
