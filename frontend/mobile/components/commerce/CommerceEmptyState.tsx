import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

export function CommerceEmptyState({ message }: { message?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message ?? commerceDeskCopy.empty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
    minHeight: 160,
  },
  text: {
    fontSize: 15,
    color: commerceDesk.textMuted,
    textAlign: 'center',
  },
});
