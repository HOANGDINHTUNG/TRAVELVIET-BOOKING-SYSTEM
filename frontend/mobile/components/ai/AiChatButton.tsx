import { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiChatModal } from './AiChatModal';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { commerceDesk } from '@/theme/commerceDesk';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AiChatButton() {
  const [visible, setVisible] = useState(false);
  const segments = useSegments();
  const authenticated = useIsAuthenticated();
  const insets = useSafeAreaInsets();
  const onTabs = segments[0] === '(tabs)';

  const pan = useRef(new Animated.ValueXY()).current;
  const positionRef = useRef({ x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Boundaries calculation relative to the layout position (right: 18, bottom: 88)
  // Default position:
  // x_start = SCREEN_WIDTH - 56 - 18
  // y_start = SCREEN_HEIGHT - 56 - 88
  const minX = -(SCREEN_WIDTH - 56 - 18 - 8); // left edge with 8px margin
  const maxX = 18 - 8; // right edge margin allowance (keep 8px padding from right)
  const minY = -(SCREEN_HEIGHT - 56 - 88 - insets.top - 8); // top edge with safe area + 8px margin
  const maxY = 88 - 8 - insets.bottom; // bottom edge margin allowance (keep 8px padding above bottom)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Visual press scale animation
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (e, gestureState) => {
        const currentX = positionRef.current.x + gestureState.dx;
        const currentY = positionRef.current.y + gestureState.dy;

        // Clamp values to keep button inside screen edges
        const clampedX = Math.max(minX, Math.min(currentX, maxX));
        const clampedY = Math.max(minY, Math.min(currentY, maxY));

        pan.setValue({
          x: clampedX,
          y: clampedY,
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        // Restore normal scale animation
        Animated.spring(scaleAnim, {
          toValue: 1.0,
          useNativeDriver: true,
        }).start();

        const finalX = positionRef.current.x + gestureState.dx;
        const finalY = positionRef.current.y + gestureState.dy;

        // Clamp final values
        const clampedX = Math.max(minX, Math.min(finalX, maxX));
        const clampedY = Math.max(minY, Math.min(finalY, maxY));

        positionRef.current = { x: clampedX, y: clampedY };

        // If drag distance is very small, treat as click/tap
        if (Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6) {
          setVisible(true);
        }
      },
    })
  ).current;

  if (!authenticated || !onTabs) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scaleAnim }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#fff" />
      </Animated.View>
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
});
