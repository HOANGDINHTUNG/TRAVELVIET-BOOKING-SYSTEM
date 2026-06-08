import { Stack } from 'expo-router';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';

/** Giai đoạn 1–3: chỉ màn desk (index) — không detail/form */
export default function ProductsTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: commerceDesk.surfaceSoft },
        headerTintColor: commerceDesk.accent,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: commerceDesk.surfaceSoft },
      }}>
      <Stack.Screen name="index" options={{ title: commerceDeskCopy.screenTitle }} />
    </Stack>
  );
}
