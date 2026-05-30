import React from 'react';
import { StyleSheet, View } from 'react-native';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

export function ProductListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.lineWide} />
          <View style={styles.lineMid} />
          <View style={styles.lineShort} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  row: {
    backgroundColor: commerceDesk.surface,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    padding: space.md,
    gap: space.sm,
  },
  lineWide: {
    height: 14,
    borderRadius: 6,
    backgroundColor: commerceDesk.border,
    width: '40%',
  },
  lineMid: {
    height: 16,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    width: '75%',
  },
  lineShort: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    width: '50%',
  },
});
