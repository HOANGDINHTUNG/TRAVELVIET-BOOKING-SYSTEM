import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/theme/colors';
import { radius, space } from '@/theme/spacing';

type Props = PressableProps & {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  title,
  isLoading,
  disabled,
  variant = 'primary',
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'outline' && styles.labelOutline,
            variant === 'danger' && styles.labelDanger,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.9 },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  labelOutline: {
    color: colors.primary,
  },
  labelDanger: {
    color: colors.error,
  },
});
