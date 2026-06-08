import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { productLabels } from '@/constants/productLabels';
import { colors } from '@/theme/colors';
import { space } from '@/theme/spacing';

type Props = {
  onAdd: () => void;
};

export function ProductEmptyState({ onAdd }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="cube-outline" size={56} color={colors.textMuted} />
      <Text style={styles.title}>{productLabels.emptyTitle}</Text>
      <Text style={styles.subtitle}>{productLabels.emptySubtitle}</Text>
      <PrimaryButton title={productLabels.emptyCta} onPress={onAdd} style={styles.btn} />
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: space.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginTop: space.md,
    alignSelf: 'stretch',
    maxWidth: 280,
  },
});
