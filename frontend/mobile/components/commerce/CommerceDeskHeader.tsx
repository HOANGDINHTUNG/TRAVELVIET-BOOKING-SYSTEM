import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

type SummaryCounts = {
  vouchers: number;
  campaigns: number;
  products: number;
  combos: number;
};

type Props = {
  counts: SummaryCounts;
};

export function CommerceDeskHeader({ counts }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>{commerceDeskCopy.kicker}</Text>
      <Text style={styles.title}>{commerceDeskCopy.title}</Text>
      <Text style={styles.subtitle}>{commerceDeskCopy.subtitle}</Text>
      <View style={styles.summaryRow}>
        <SummaryChip label={commerceDeskCopy.summaryVouchers(counts.vouchers)} />
        <SummaryChip label={commerceDeskCopy.summaryCampaigns(counts.campaigns)} />
        <SummaryChip label={commerceDeskCopy.summaryProducts(counts.products)} />
        <SummaryChip label={commerceDeskCopy.summaryCombos(counts.combos)} />
      </View>
    </View>
  );
}

function SummaryChip({ label }: { label: string }) {
  return (
    <View style={styles.summaryChip}>
      <Text style={styles.summaryText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    paddingBottom: space.sm,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: commerceDesk.accent,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: commerceDesk.text,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    color: commerceDesk.textMuted,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  summaryChip: {
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    backgroundColor: commerceDesk.surface,
    justifyContent: 'center',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: commerceDesk.textMuted,
  },
});
