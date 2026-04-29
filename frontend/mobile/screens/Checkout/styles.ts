import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const createCheckoutStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    headerButton: {
      padding: 8,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
    },

    // Content
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },

    // Tour Summary Card
    tourSummaryCard: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    tourSummaryImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },

    tourSummaryContent: {
      flex: 1,
      justifyContent: 'space-between',
    },

    tourSummaryName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },

    tourSummaryLocation: {
      fontSize: 11,
      color: colors.icon,
      marginBottom: 8,
    },

    tourSummaryPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: '#E74C3C',
    },

    // Section
    section: {
      marginBottom: 24,
    },

    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },

    // Passenger Count Section
    countContainer: {
      gap: 12,
    },

    countItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    countLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },

    countSubLabel: {
      fontSize: 11,
      color: colors.icon,
      marginBottom: 2,
    },

    countControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    countButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.tint,
      justifyContent: 'center',
      alignItems: 'center',
    },

    countButtonDisabled: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },

    countButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },

    countValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      minWidth: 30,
      textAlign: 'center',
    },

    countPrice: {
      fontSize: 12,
      color: colors.icon,
    },

    // Passenger Form
    passengersSection: {
      marginBottom: 24,
    },

    passengerForm: {
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    passengerHeader: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.tint,
      marginBottom: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    inputContainer: {
      marginBottom: 12,
    },

    inputLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },

    input: {
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 13,
      color: colors.text,
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    },

    inputPlaceholder: {
      color: colors.icon,
    },

    inputError: {
      borderColor: '#E74C3C',
    },

    errorText: {
      fontSize: 11,
      color: '#E74C3C',
      marginTop: 4,
    },

    // Price Summary
    priceSummaryCard: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 10,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      marginBottom: 20,
    },

    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    priceRowLast: {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },

    priceLabel: {
      fontSize: 12,
      color: colors.icon,
    },

    priceValue: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },

    totalRow: {
      paddingTop: 10,
      borderTopWidth: 2,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },

    totalLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },

    totalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#E74C3C',
    },

    // Empty Message
    emptyMessage: {
      fontSize: 13,
      color: colors.icon,
      textAlign: 'center',
      marginVertical: 20,
      fontStyle: 'italic',
    },

    // Bottom Area
    bottomArea: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      gap: 10,
    },

    continueButton: {
      backgroundColor: colors.tint,
      paddingVertical: 14,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    continueButtonDisabled: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },

    continueButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    cancelButton: {
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.tint,
      justifyContent: 'center',
      alignItems: 'center',
    },

    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.tint,
    },

    // ScrollView Content
    scrollViewContent: {
      flexGrow: 1,
    },
  });
};
