import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStyles } from './styles';
import type { TourCardProps, WeatherInfo } from '@/types/Tour';
import { Colors } from '@/constants/theme';

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const weatherIcons: Record<WeatherInfo['condition'], MaterialIconName> = {
  sunny: 'weather-sunny',
  cloudy: 'weather-cloudy',
  rainy: 'weather-rainy',
  snowy: 'weather-snowy',
  windy: 'weather-windy',
};

export function TourCard({
  tour,
  onPress,
  showWeather = false,
  size = 'medium',
}: TourCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);
  const themeColors = isDark ? Colors.dark : Colors.light;

  // Select container style based on size
  const getContainerStyle = () => {
    switch (size) {
      case 'small':
        return styles.containerSmall;
      case 'large':
        return styles.containerLarge;
      default:
        return styles.containerMedium;
    }
  };

  const getImageContainerStyle = () => {
    switch (size) {
      case 'small':
        return styles.imageContainerSmall;
      case 'large':
        return styles.imageContainerLarge;
      default:
        return styles.imageContainerMedium;
    }
  };

  const getContentStyle = () => {
    switch (size) {
      case 'small':
        return styles.contentSmall;
      case 'large':
        return styles.contentLarge;
      default:
        return styles.contentMedium;
    }
  };

  const getTitleStyle = () => {
    switch (size) {
      case 'small':
        return styles.titleSmall;
      case 'large':
        return styles.titleLarge;
      default:
        return styles.titleMedium;
    }
  };

  const getLocationStyle = () => {
    switch (size) {
      case 'small':
        return styles.locationSmall;
      case 'large':
        return styles.locationLarge;
      default:
        return styles.locationMedium;
    }
  };

  const getRatingRowStyle = () => {
    switch (size) {
      case 'small':
        return styles.ratingRowSmall;
      case 'large':
        return styles.ratingRowLarge;
      default:
        return styles.ratingRowMedium;
    }
  };

  const getPriceRowStyle = () => {
    switch (size) {
      case 'small':
        return styles.priceRowSmall;
      case 'large':
        return styles.priceRowLarge;
      default:
        return styles.priceRowMedium;
    }
  };

  const getPriceTextStyle = () => {
    switch (size) {
      case 'small':
        return styles.priceSmall;
      case 'large':
        return styles.priceLarge;
      default:
        return styles.priceMedium;
    }
  };

  const getOriginalPriceStyle = () => {
    switch (size) {
      case 'small':
        return styles.originalPriceSmall;
      case 'large':
        return styles.originalPriceLarge;
      default:
        return styles.originalPriceMedium;
    }
  };

  const getReviewCountStyle = () => {
    switch (size) {
      case 'small':
        return styles.reviewCountSmall;
      case 'large':
        return styles.reviewCountLarge;
      default:
        return styles.reviewCountMedium;
    }
  };

  const getDescriptionStyle = () => {
    switch (size) {
      case 'small':
        return styles.descriptionSmall;
      case 'large':
        return styles.descriptionLarge;
      default:
        return styles.descriptionMedium;
    }
  };

  const getMetaRowStyle = () => {
    switch (size) {
      case 'small':
        return styles.metaRowSmall;
      case 'large':
        return styles.metaRowLarge;
      default:
        return styles.metaRowMedium;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Render rating stars
  const renderStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <MaterialCommunityIcons
            key={i}
            name={i < Math.floor(tour.rating) ? 'star' : 'star-outline'}
            size={size === 'small' ? 10 : size === 'large' ? 14 : 12}
            color="#FFB800"
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={getContainerStyle()}
    >
      {/* Image Container */}
      <View style={getImageContainerStyle()}>
        <Image
          source={{ uri: tour.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{formatPrice(tour.price)}</Text>
        </View>

        {/* Weather Badge */}
        {showWeather && tour.weather && (
          <View style={styles.weatherBadge}>
            <MaterialCommunityIcons
              name={
                weatherIcons[
                  tour.weather.condition as keyof typeof weatherIcons
                ] || 'weather-partly-cloudy'
              }
              size={16}
              color="#3498DB"
            />
            <Text style={styles.weatherText}>
              {tour.weather.temperature}°C
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={getContentStyle()}>
        {/* Title */}
        <Text style={getTitleStyle()} numberOfLines={2}>
          {tour.name}
        </Text>

        {/* Location */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialCommunityIcons
            name="map-marker"
            size={size === 'small' ? 10 : 12}
            color={themeColors.icon}
          />
          <Text style={getLocationStyle()} numberOfLines={1}>
            {tour.location.name}
          </Text>
        </View>

        {/* Description - only show for medium and large sizes */}
        {size !== 'small' && (
          <Text style={getDescriptionStyle()} numberOfLines={size === 'large' ? 3 : 2}>
            {tour.description}
          </Text>
        )}

        {/* Rating Row */}
        <View style={getRatingRowStyle()}>
          <View style={styles.ratingContainer}>
            {renderStars()}
            <Text style={[{ color: themeColors.text }, getReviewCountStyle()]}>
              ({tour.reviewCount})
            </Text>
          </View>
          {size === 'large' && (
            <Text style={[{ color: themeColors.text }, getReviewCountStyle()]}>
              {tour.rating.toFixed(1)} sao
            </Text>
          )}
        </View>

        {/* Price Row - show original price if available */}
        <View style={getPriceRowStyle()}>
          <Text style={getPriceTextStyle()}>{formatPrice(tour.price)}</Text>
          {tour.originalPrice && (
            <Text style={getOriginalPriceStyle()}>
              {formatPrice(tour.originalPrice)}
            </Text>
          )}
        </View>

        {/* Meta Info - only for large size */}
        {size === 'large' && (
          <View
            style={[
              getMetaRowStyle(),
              { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: themeColors.icon },
            ]}
          >
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="calendar"
                size={12}
                color={themeColors.icon}
              />
              <Text style={[{ color: themeColors.icon }, getMetaRowStyle()]}>
                {tour.duration} ngày
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="account-multiple"
                size={12}
                color={themeColors.icon}
              />
              <Text style={[{ color: themeColors.icon }, getMetaRowStyle()]}>
                {tour.currentParticipants}/{tour.maxParticipants}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
