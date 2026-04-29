import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const createStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return StyleSheet.create({
    // Container
    containerSmall: {
      width: 160,
      marginRight: 12,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    containerMedium: {
      marginHorizontal: 12,
      marginBottom: 16,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    containerLarge: {
      marginHorizontal: 16,
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },

    // Image Container
    imageContainerSmall: {
      width: '100%',
      height: 140,
      position: 'relative',
    },
    imageContainerMedium: {
      width: '100%',
      height: 200,
      position: 'relative',
    },
    imageContainerLarge: {
      width: '100%',
      height: 280,
      position: 'relative',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    // Badge (Price/Discount)
    priceBadge: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      backgroundColor: '#E74C3C',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },

    priceBadgeText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },

    // Weather Badge
    weatherBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    weatherIcon: {
      width: 16,
      height: 16,
    },

    weatherText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#333',
    },

    // Content Area
    contentSmall: {
      padding: 8,
    },
    contentMedium: {
      padding: 12,
    },
    contentLarge: {
      padding: 16,
    },

    // Title
    titleSmall: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      numberOfLines: 2,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      numberOfLines: 2,
    },
    titleLarge: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 10,
      numberOfLines: 2,
    },

    // Location
    locationSmall: {
      fontSize: 10,
      color: colors.icon,
      marginBottom: 4,
      numberOfLines: 1,
    },
    locationMedium: {
      fontSize: 12,
      color: colors.icon,
      marginBottom: 8,
      numberOfLines: 1,
    },
    locationLarge: {
      fontSize: 13,
      color: colors.icon,
      marginBottom: 8,
      numberOfLines: 1,
    },

    // Rating Row
    ratingRowSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    ratingRowMedium: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    ratingRowLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    ratingText: {
      fontWeight: '600',
      fontSize: 12,
    },

    reviewCountSmall: {
      fontSize: 10,
      color: colors.icon,
    },
    reviewCountMedium: {
      fontSize: 11,
      color: colors.icon,
    },
    reviewCountLarge: {
      fontSize: 12,
      color: colors.icon,
    },

    // Price Display
    priceRowSmall: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
    },
    priceRowMedium: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 6,
    },
    priceRowLarge: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },

    priceSmall: {
      fontSize: 13,
      fontWeight: '700',
      color: '#E74C3C',
    },
    priceMedium: {
      fontSize: 16,
      fontWeight: '700',
      color: '#E74C3C',
    },
    priceLarge: {
      fontSize: 18,
      fontWeight: '700',
      color: '#E74C3C',
    },

    originalPriceSmall: {
      fontSize: 10,
      fontWeight: '500',
      color: colors.icon,
      textDecorationLine: 'line-through',
    },
    originalPriceMedium: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.icon,
      textDecorationLine: 'line-through',
    },
    originalPriceLarge: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.icon,
      textDecorationLine: 'line-through',
    },

    // Description
    descriptionSmall: {
      fontSize: 10,
      color: colors.icon,
      marginBottom: 6,
      numberOfLines: 1,
    },
    descriptionMedium: {
      fontSize: 12,
      color: colors.icon,
      marginBottom: 10,
      numberOfLines: 2,
      lineHeight: 16,
    },
    descriptionLarge: {
      fontSize: 13,
      color: colors.icon,
      marginBottom: 12,
      numberOfLines: 3,
      lineHeight: 18,
    },

    // Duration & Participants
    metaRowSmall: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 10,
      color: colors.icon,
    },
    metaRowMedium: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 11,
      color: colors.icon,
    },
    metaRowLarge: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 12,
      color: colors.icon,
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
};
