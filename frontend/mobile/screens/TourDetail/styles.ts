import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const createTourDetailStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Image Section
    imageContainer: {
      width: '100%',
      height: 300,
      position: 'relative',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    imagePagination: {
      position: 'absolute',
      bottom: 12,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
    },

    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },

    paginationDotActive: {
      backgroundColor: '#FFFFFF',
      width: 24,
    },

    // Content
    content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      paddingBottom: 120, // Space for bottom button
    },

    // Title Section
    titleSection: {
      marginBottom: 16,
    },

    tourName: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      lineHeight: 28,
    },

    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },

    locationText: {
      fontSize: 14,
      color: colors.icon,
    },

    // Rating Row
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    ratingStars: {
      flexDirection: 'row',
      gap: 2,
    },

    ratingScore: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },

    reviewCount: {
      fontSize: 12,
      color: colors.icon,
    },

    favoriteButton: {
      padding: 8,
    },

    // Price Section
    priceSection: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },

    price: {
      fontSize: 26,
      fontWeight: '700',
      color: '#E74C3C',
    },

    originalPrice: {
      fontSize: 14,
      color: colors.icon,
      textDecorationLine: 'line-through',
    },

    priceUnit: {
      fontSize: 12,
      color: colors.icon,
      marginLeft: 4,
    },

    discount: {
      fontSize: 12,
      fontWeight: '600',
      color: '#27AE60',
      marginLeft: 12,
    },

    // Duration & Participants
    metaRow: {
      flexDirection: 'row',
      gap: 24,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    metaLabel: {
      fontSize: 12,
      color: colors.icon,
      marginTop: 2,
    },

    metaValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },

    // Highlights
    highlightsSection: {
      marginBottom: 24,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },

    highlightsList: {
      gap: 10,
    },

    highlightItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    highlightBullet: {
      fontSize: 18,
      color: colors.tint,
      marginTop: 2,
    },

    highlightText: {
      fontSize: 13,
      color: colors.text,
      flex: 1,
      lineHeight: 18,
    },

    // Description
    descriptionSection: {
      marginBottom: 24,
    },

    descriptionText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 20,
      textAlign: 'justify',
    },

    // Itinerary
    itinerarySection: {
      marginBottom: 24,
    },

    itineraryList: {
      gap: 16,
    },

    itineraryItem: {
      flexDirection: 'row',
      gap: 12,
    },

    dayBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.tint,
      justifyContent: 'center',
      alignItems: 'center',
    },

    dayBadgeText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 12,
    },

    itineraryContent: {
      flex: 1,
    },

    itineraryTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },

    itineraryDescription: {
      fontSize: 12,
      color: colors.icon,
      lineHeight: 16,
      marginBottom: 6,
    },

    itineraryLocations: {
      fontSize: 11,
      color: colors.tint,
      fontWeight: '500',
    },

    // Reviews
    reviewsSection: {
      marginBottom: 24,
    },

    reviewsList: {
      gap: 12,
    },

    reviewItem: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },

    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    reviewerName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },

    reviewDate: {
      fontSize: 11,
      color: colors.icon,
    },

    reviewText: {
      fontSize: 12,
      color: colors.text,
      lineHeight: 16,
    },

    // Bottom Button
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },

    bookButton: {
      backgroundColor: colors.tint,
      paddingVertical: 14,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    bookButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    // Loading State
    skeleton: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: 8,
    },
  });
};
