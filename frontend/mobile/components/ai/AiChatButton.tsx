import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AiChatModal } from './AiChatModal';

export function AiChatButton() {
  const [visible, setVisible] = useState(false);

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        accessibilityLabel="Mở AI Assistant"
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
        <Ionicons name="chatbubble-ellipses-outline" size={27} color="#283618" />
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
    bottom: 96,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDA15E',
    shadowColor: '#283618',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
});
