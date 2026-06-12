import { Stack } from 'expo-router';
import { AiChatButton } from '@/components/ai/AiChatButton';
import { AppProviders } from '@/providers/AppProviders';
import { PermissionModal } from '@/components/ui/PermissionModal';

export default function RootLayout() {
  return (
    <AppProviders>
      <PermissionModal />
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="tour/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cruise/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="hotels" options={{ headerShown: false }} />
        <Stack.Screen name="combos" options={{ headerShown: false }} />
        <Stack.Screen name="cruises" options={{ headerShown: false }} />
        <Stack.Screen name="help-center" options={{ headerShown: false }} />
        <Stack.Screen name="travel-passport" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="flights" options={{ headerShown: false }} />
        <Stack.Screen name="flight/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="transport" options={{ headerShown: false }} />
        <Stack.Screen name="destination-detail" options={{ headerShown: false }} />
        <Stack.Screen name="map" options={{ headerShown: false }} />
      </Stack>
      <AiChatButton />
    </AppProviders>
  );
}
