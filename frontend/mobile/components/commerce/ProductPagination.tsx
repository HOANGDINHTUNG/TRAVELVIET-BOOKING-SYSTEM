import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

type Props = {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function ProductPagination({ page, totalPages, disabled, onPrev, onNext }: Props) {
  const current = page + 1;
  const canPrev = page > 0 && !disabled;
  const canNext = page + 1 < totalPages && !disabled;

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={[styles.btn, !canPrev && styles.btnDisabled]}
        onPress={onPrev}
        disabled={!canPrev}>
        <Text style={styles.btnText}>{commerceDeskCopy.prev}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{commerceDeskCopy.page(current, totalPages)}</Text>
      <TouchableOpacity
        style={[styles.btn, !canNext && styles.btnDisabled]}
        onPress={onNext}
        disabled={!canNext}>
        <Text style={styles.btnText}>{commerceDeskCopy.next}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    paddingVertical: space.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: commerceDesk.textMuted,
  },
  btn: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    justifyContent: 'center',
    backgroundColor: commerceDesk.surface,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '800',
    color: commerceDesk.text,
  },
});
