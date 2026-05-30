import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { getApiBaseUrl } from '@/config/apiBaseUrl';
import { API_CONFIG_HINT } from '@/config/apiConfig';
import { colors } from '@/theme/colors';
import { space } from '@/theme/spacing';

/** Hiển thị URL API đang dùng — giúp debug khi UI “y như cũ” do chưa vào tab / chưa có .env */
export function ApiConnectionBanner() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>API Backend (dữ liệu thật)</Text>
      <Text style={styles.url} selectable>
        {getApiBaseUrl()}
      </Text>
      <Text style={styles.hint}>{API_CONFIG_HINT}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: space.md,
    marginBottom: space.sm,
    padding: space.sm,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  url: {
    fontSize: 12,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
});
