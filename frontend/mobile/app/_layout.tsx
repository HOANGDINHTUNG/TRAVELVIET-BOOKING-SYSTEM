import { Stack } from 'expo-router';
import { AiChatButton } from '@/components/ai/AiChatButton';

export default function RootLayout() {
  return (
    <>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <AiChatButton />
    </>
  );
}
