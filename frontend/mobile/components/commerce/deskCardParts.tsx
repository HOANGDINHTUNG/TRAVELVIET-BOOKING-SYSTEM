import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';

export function DeskMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.dt}>{label}</Text>
      <Text style={styles.dd}>{value}</Text>
    </View>
  );
}

type DeskCardShellProps = {
  code: string;
  isActive: boolean;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  toggleOffLabel: string;
  toggleOnLabel: string;
  toggling: boolean;
  canToggle: boolean;
  readOnlyHint: string;
  onToggleStatus: () => void;
};

export function DeskCardShell({
  code,
  isActive,
  title,
  subtitle,
  children,
  toggleOffLabel,
  toggleOnLabel,
  toggling,
  canToggle,
  readOnlyHint,
  onToggleStatus,
}: DeskCardShellProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.code} numberOfLines={1}>
          {code}
        </Text>
        <View style={[styles.badgeWrap, !isActive && styles.badgeWrapOff]}>
          <Text style={[styles.badgeText, !isActive && styles.badgeTextOff]}>
            {isActive ? commerceDeskCopy.statusActive : commerceDeskCopy.statusInactive}
          </Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {subtitle}
      </Text>

      <View style={styles.dl}>{children}</View>

      {canToggle ? (
        <Pressable
          style={[styles.toggleBtn, toggling && styles.toggleBtnDisabled]}
          onPress={onToggleStatus}
          disabled={toggling}>
          {toggling ? (
            <ActivityIndicator size="small" color={commerceDesk.text} />
          ) : (
            <Text style={styles.toggleBtnText}>
              {isActive ? toggleOffLabel : toggleOnLabel}
            </Text>
          )}
        </Pressable>
      ) : (
        <Text style={styles.readOnlyHint}>{readOnlyHint}</Text>
      )}
    </View>
  );
}

export const deskCardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: commerceDesk.border,
    borderRadius: commerceDesk.radius,
    backgroundColor: commerceDesk.surface,
    padding: 14,
    gap: 10,
    marginBottom: commerceDesk.gridGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  code: {
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    color: commerceDesk.accent,
    textTransform: 'uppercase',
  },
  badgeWrap: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: commerceDesk.statusActiveBg,
  },
  badgeWrapOff: {
    backgroundColor: commerceDesk.statusInactiveBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: commerceDesk.statusActiveText,
  },
  badgeTextOff: {
    color: commerceDesk.statusInactiveText,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: commerceDesk.text,
    lineHeight: 22,
  },
  subtitle: {
    minHeight: 36,
    fontSize: 13,
    color: commerceDesk.textMuted,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  dl: {
    gap: 7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  dt: {
    fontSize: 12,
    fontWeight: '900',
    color: commerceDesk.textMuted,
    textTransform: 'uppercase',
  },
  dd: {
    fontSize: 14,
    fontWeight: '900',
    color: commerceDesk.text,
    textAlign: 'right',
  },
  toggleBtn: {
    minHeight: 38,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commerceDesk.surfaceSoft,
  },
  toggleBtnDisabled: {
    opacity: 0.7,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: commerceDesk.text,
  },
  readOnlyHint: {
    fontSize: 12,
    color: commerceDesk.textMuted,
    fontStyle: 'italic',
  },
});

const styles = deskCardStyles;
