import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSegments } from 'expo-router';

import { AiChatModal } from './AiChatModal';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { commerceDesk } from '@/theme/commerceDesk';

export function AiChatButton() {
  const [visible, setVisible] = useState(false);
  const segments = useSegments();
  const authenticated = useIsAuthenticated();
  const onTabs = segments[0] === '(tabs)';

  if (!authenticated || !onTabs) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        accessibilityLabel="Mở AI Assistant"
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#fff" />
      </Pressable>
      <AiChatModal visible={visible} onClose={() => setVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    elevation: 20,
  },
  button: {
    position: 'absolute',
    right: 18,
    bottom: 88,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commerceDesk.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
