import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';

export type CommerceDeskTab = 'vouchers' | 'campaigns' | 'products' | 'combos';

type TabDef = { id: CommerceDeskTab; label: string };

const tabs: TabDef[] = [
  { id: 'vouchers', label: commerceDeskCopy.tabVouchers },
  { id: 'campaigns', label: commerceDeskCopy.tabCampaigns },
  { id: 'products', label: commerceDeskCopy.tabProducts },
  { id: 'combos', label: commerceDeskCopy.tabCombos },
];

type Props = {
  activeTab: CommerceDeskTab;
  onChange: (tab: CommerceDeskTab) => void;
};

export function CommerceSegmentTabs({ activeTab, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.wrap}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onChange(tab.id)}>
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  tab: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    backgroundColor: commerceDesk.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: commerceDesk.accent,
    borderColor: commerceDesk.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: commerceDesk.textMuted,
  },
  tabTextActive: {
    color: '#fff',
  },
});
