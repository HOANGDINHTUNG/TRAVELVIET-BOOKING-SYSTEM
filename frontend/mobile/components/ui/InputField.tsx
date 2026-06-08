import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { colors } from '@/theme/colors';
import { radius, space } from '@/theme/spacing';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function InputField({ label, error, hint, style, ...inputProps }: Props) {
  const hasError = Boolean(error);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...inputProps}
        style={[styles.input, hasError && styles.inputError, style]}
      />
      {hasError ? <Text style={styles.error}>{error}</Text> : null}
      {!hasError && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.error },
  error: { fontSize: 12, color: colors.error },
  hint: { fontSize: 12, color: colors.textMuted },
});
