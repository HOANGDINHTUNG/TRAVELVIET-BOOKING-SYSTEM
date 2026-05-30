import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commerceDeskCopy } from '@/constants/commerceDeskCopy';
import { commerceDesk } from '@/theme/commerceDesk';
import { space } from '@/theme/spacing';

type Props = {
  keyword: string;
  loading: boolean;
  onChangeKeyword: (value: string) => void;
  onSearch: () => void;
  onReload: () => void;
};

export function CommerceToolbar({
  keyword,
  loading,
  onChangeKeyword,
  onSearch,
  onReload,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={17} color={commerceDesk.textMuted} />
        <TextInput
          style={styles.input}
          placeholder={commerceDeskCopy.searchPlaceholder}
          placeholderTextColor={commerceDesk.textMuted}
          value={keyword}
          onChangeText={onChangeKeyword}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={onSearch}>
          <Text style={styles.btnText}>{commerceDeskCopy.search}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onReload}
          disabled={loading}>
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.btnTextPrimary}>{commerceDeskCopy.reload}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    marginBottom: space.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 42,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    borderRadius: commerceDesk.radius,
    paddingHorizontal: 11,
    backgroundColor: commerceDesk.surface,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: commerceDesk.text,
  },
  actions: {
    flexDirection: 'row',
    gap: space.sm,
  },
  btn: {
    flex: 1,
    minHeight: 38,
    borderWidth: 1,
    borderColor: commerceDesk.border,
    borderRadius: commerceDesk.radius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commerceDesk.surface,
  },
  btnPrimary: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: commerceDesk.accent,
    borderColor: commerceDesk.accent,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '800',
    color: commerceDesk.textMuted,
  },
  btnTextPrimary: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
});
