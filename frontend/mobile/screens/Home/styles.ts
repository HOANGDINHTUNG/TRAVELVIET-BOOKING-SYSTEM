import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const createHomeStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return StyleSheet.create({
    // Main Container
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Safe Area View
    safeAreaContainer: {
      flex: 1,
    },

    // Header Section
    header: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    greeting: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.icon,
      marginBottom: 4,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },

    // Search Bar
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F0F0F0',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 48,
      gap: 8,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },

    searchInputPlaceholder: {
      color: colors.icon,
    },

    clearButton: {
      padding: 4,
    },

    // Filter Chips
    filterContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },

    filtersScrollView: {
      flexGrow: 0,
    },

    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E0E0E0',
      marginRight: 8,
    },

    filterChipActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },

    filterChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },

    filterChipTextActive: {
      color: '#FFFFFF',
    },

    // Featured Section
    sectionContainer: {
      paddingVertical: 16,
    },

    sectionHeader: {
      paddingHorizontal: 16,
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },

    sectionSubtitle: {
      fontSize: 13,
      color: colors.icon,
    },

    // Horizontal Tour List
    horizontalList: {
      paddingLeft: 16,
      paddingRight: 4,
    },

    horizontalListContent: {
      paddingRight: 12,
    },

    // Vertical Tour List
    verticalListContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    // Loading State
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },

    loadingText: {
      color: colors.icon,
      fontSize: 14,
      marginTop: 12,
    },

    // Empty State
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },

    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },

    emptySubtitle: {
      fontSize: 14,
      color: colors.icon,
      textAlign: 'center',
      paddingHorizontal: 32,
    },

    // ScrollView Container
    scrollViewContent: {
      flexGrow: 1,
    },

    // Footer Spacing
    footerSpacing: {
      height: 30,
    },

    // Banner Container
    bannerContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginVertical: 12,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(233, 30, 99, 0.2)' : 'rgba(233, 30, 99, 0.1)',
      borderLeftWidth: 4,
      borderLeftColor: '#E91E63',
    },

    bannerTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },

    bannerSubtitle: {
      fontSize: 12,
      color: colors.icon,
    },

    // No Results
    noResultsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 40,
      alignItems: 'center',
    },

    noResultsText: {
      fontSize: 14,
      color: colors.icon,
      marginBottom: 16,
    },

    resetButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.tint,
    },

    resetButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};
