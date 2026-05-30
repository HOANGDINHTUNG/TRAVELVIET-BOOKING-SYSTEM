import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { productLabels } from '@/constants/productLabels';
import { colors } from '@/theme/colors';
import { space } from '@/theme/spacing';

type Props = {
  message: string;
  onRetry: () => void;
};

export function ProductErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="cloud-offline-outline" size={52} color={colors.error} />
      <Text style={styles.title}>{productLabels.errorTitle}</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton
        title={productLabels.retry}
        variant="outline"
        onPress={onRetry}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
    gap: space.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: space.sm,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    marginTop: space.md,
    alignSelf: 'stretch',
    maxWidth: 200,
  },
});
