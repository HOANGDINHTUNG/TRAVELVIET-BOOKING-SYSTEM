import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

type Props = {
  title: string;
  message: string;
  onLogin?: () => void;
};

export function CommerceAccessGate({ title, message, onLogin }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onLogin ? (
        <PrimaryButton title="Đăng nhập lại" onPress={onLogin} style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: space.lg,
    gap: space.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: commerceDesk.text,
  },
  message: {
    fontSize: 14,
    color: commerceDesk.textMuted,
    lineHeight: 20,
  },
  btn: {
    marginTop: space.md,
  },
});
