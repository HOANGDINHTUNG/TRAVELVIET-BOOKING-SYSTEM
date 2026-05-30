import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { adminPreferencesCopy } from '@/constants/adminPreferencesCopy';
import { clearAuthSession, getAuthSession } from '@/services/authStorage';
import { setAiChatAccessTokenProvider } from '@/services/aiChatApi';
import { AppRoutes, asHref } from '@/lib/navigation';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

export default function PreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const session = getAuthSession();
  const user = session?.user;
  const displayName =
    user?.displayName?.trim() || user?.fullName?.trim() || user?.email || adminPreferencesCopy.guestName;
  const email = user?.email ?? '—';
  const permissions = session?.permissions ?? [];

  const handleLogout = () => {
    Alert.alert(adminPreferencesCopy.logoutTitle, adminPreferencesCopy.logoutMessage, [
      { text: adminPreferencesCopy.cancel, style: 'cancel' },
      {
        text: adminPreferencesCopy.logout,
        style: 'destructive',
        onPress: async () => {
          await clearAuthSession();
          setAiChatAccessTokenProvider(null);
          router.replace(asHref(AppRoutes.login));
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + space.lg }}
      showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
        <Text style={styles.kicker}>{adminPreferencesCopy.kicker}</Text>
        <Text style={styles.title}>{adminPreferencesCopy.title}</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={52} color={commerceDesk.accent} />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          {session?.isSuperAdmin ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{adminPreferencesCopy.superAdmin}</Text>
            </View>
          ) : session?.hasManagementAccess ? (
            <View style={[styles.badge, styles.badgeMuted]}>
              <Text style={styles.badgeText}>{adminPreferencesCopy.managementAccess}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>{adminPreferencesCopy.apiSection}</Text>
        <Text style={styles.sectionHint}>{adminPreferencesCopy.apiHint}</Text>
        <Text style={styles.apiUrl} selectable>
          {getApiBaseUrl()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionKicker}>{adminPreferencesCopy.sessionSection}</Text>
        <Text style={styles.metaLabel}>
          {adminPreferencesCopy.permissions} ({permissions.length})
        </Text>
        {permissions.length === 0 ? (
          <Text style={styles.metaValue}>{adminPreferencesCopy.noPermissions}</Text>
        ) : (
          <View style={styles.permissionWrap}>
            {permissions.slice(0, 12).map((perm) => (
              <View key={perm} style={styles.permissionChip}>
                <Text style={styles.permissionText}>{perm}</Text>
              </View>
            ))}
            {permissions.length > 12 ? (
              <Text style={styles.moreText}>+{permissions.length - 12} quyền khác</Text>
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <MenuRow
          icon="pricetags-outline"
          title={adminPreferencesCopy.commerceDesk}
          onPress={() => router.push(asHref(AppRoutes.productTab))}
        />
        <MenuRow
          icon="log-out-outline"
          title={adminPreferencesCopy.logout}
          danger
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

function MenuRow({
  icon,
  title,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={danger ? '#DC2626' : commerceDesk.accent}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={commerceDesk.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commerceDesk.surfaceSoft,
  },
  header: {
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: commerceDesk.accent,
  },
  title: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '800',
    color: commerceDesk.text,
  },
  profileCard: {
    marginTop: space.md,
    alignItems: 'center',
    padding: space.md,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    backgroundColor: commerceDesk.surface,
  },
  avatar: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: commerceDesk.text,
  },
  userEmail: {
    marginTop: 4,
    fontSize: 14,
    color: commerceDesk.textMuted,
    fontWeight: '600',
  },
  badge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: commerceDesk.statusActiveBg,
  },
  badgeMuted: {
    backgroundColor: 'rgba(143, 93, 32, 0.12)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: commerceDesk.statusActiveText,
  },
  section: {
    marginHorizontal: space.md,
    marginTop: space.md,
    padding: space.md,
    borderRadius: commerceDesk.radius,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    backgroundColor: commerceDesk.surface,
  },
  sectionKicker: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: commerceDesk.accent,
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 13,
    color: commerceDesk.textMuted,
    marginBottom: 8,
  },
  apiUrl: {
    fontSize: 13,
    fontWeight: '700',
    color: commerceDesk.text,
    lineHeight: 20,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: commerceDesk.text,
    marginBottom: 8,
  },
  metaValue: {
    fontSize: 13,
    color: commerceDesk.textMuted,
  },
  permissionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: commerceDesk.surfaceSoft,
    borderWidth: 1,
    borderColor: commerceDesk.border,
  },
  permissionText: {
    fontSize: 11,
    fontWeight: '700',
    color: commerceDesk.textMuted,
  },
  moreText: {
    width: '100%',
    fontSize: 12,
    color: commerceDesk.textMuted,
    marginTop: 4,
  },
  menuRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: commerceDesk.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: commerceDesk.text,
  },
  menuTitleDanger: {
    color: '#DC2626',
  },
});
