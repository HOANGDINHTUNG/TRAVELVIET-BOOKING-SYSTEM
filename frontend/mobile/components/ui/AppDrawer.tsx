import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';
import { getAuthSession } from '@/services/authStorage';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface AppDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function AppDrawer({ visible, onClose }: AppDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();
  const {
    theme,
    language,
    userAvatar,
    userDisplayName,
    userCoverImage,
  } = useAppSettings();

  const [showEditPen, setShowEditPen] = useState(false);

  const isDark = theme === 'dark';
  const lang = language as 'vi' | 'en';
  const { width: screenWidth } = Dimensions.get('window');
  
  // Design proportions: Full height bleed on top, bottom, and left, rounded corners on right
  const drawerWidth = screenWidth * 0.82; 

  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sync animation with visible prop
  useEffect(() => {
    if (visible) {
      setShowEditPen(false);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, drawerWidth, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleNavigate = (route: string, params?: any) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setShowEditPen(false);
      if (route === '/') {
        router.replace('/');
      } else {
        router.push({ pathname: route as any, params });
      }
    });
  };

  const handleSignOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      showSnackbar(lang === 'vi' ? 'Đã đăng xuất tài khoản!' : 'Signed out successfully!');
      router.replace('/login');
    });
  };

  const session = getAuthSession();
  const displayName = userDisplayName || (language === 'vi' ? 'Shinomiya Kaguya' : 'Shinomiya Kaguya');
  const quoteText = language === 'vi' ? 'Hãy luôn đam mê dịch chuyển.' : 'Adventure awaits you.';

  const isSelected = (route: string) => pathname === route;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Backdrop overlay - fading out horizontally to the right */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
            <LinearGradient
              colors={isDark ? ['rgba(0, 0, 0, 0.75)', 'rgba(0, 0, 0, 0.0)'] : ['rgba(15, 23, 42, 0.55)', 'rgba(15, 23, 42, 0.0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Pressable>
        </Animated.View>

        {/* Slide-out Rounded Edge Drawer Panel */}
        <Animated.View
          style={[
            styles.drawerPanel,
            isDark ? styles.drawerPanelDark : styles.drawerPanelLight,
            {
              width: drawerWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Drawer Header (Freud style wavy arc header with premium gradient background) */}
          <LinearGradient
            colors={isDark ? ['#3E2517', '#2A180E'] : ['#9C6644', '#7F5539']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.headerSection,
              { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8 }
            ]}
          >
            {/* Background image if user customized it */}
            {userCoverImage ? (
              <Image
                source={{ uri: userCoverImage }}
                style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
              />
            ) : null}

            {/* Wavy background mask */}
            <View style={[styles.headerCurve, isDark && styles.headerCurveDark]} />

            {/* Background pressable to toggle edit pen on cover click */}
            <Pressable
              style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
              onPress={() => setShowEditPen(true)}
            />

            {/* Top Logo and Close Row */}
            <View style={styles.headerTopRow}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoDotRow}>
                  <View style={styles.logoDotColumn}>
                    <View style={[styles.logoDot, { backgroundColor: '#FFFFFF' }]} />
                    <View style={[styles.logoDot, { backgroundColor: '#FFFFFF', opacity: 0.8 }]} />
                  </View>
                  <View style={styles.logoDotColumn}>
                    <View style={[styles.logoDot, { backgroundColor: '#FFFFFF', opacity: 0.8 }]} />
                    <View style={[styles.logoDot, { backgroundColor: '#FFFFFF', opacity: 0.6 }]} />
                  </View>
                </View>
                <Text style={styles.logoText}>travelviet</Text>
              </View>
              
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Pressable area for avatar, name, cover bg */}
            <Pressable
              onPress={() => setShowEditPen(true)}
              style={{ alignItems: 'center', width: '100%', zIndex: 20 }}
            >
              {/* Profile Avatar in center with modern gold check badge & glowing shadow wrapper */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: userAvatar }}
                    style={styles.avatarImage}
                  />
                  {showEditPen && (
                    <TouchableOpacity
                      style={styles.editPenOverlay}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleNavigate('/preferences', { edit: 'true' });
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="pencil" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
                {/* Verified Traveler Badge */}
                {!showEditPen && (
                  <View style={[styles.verifiedBadge, isDark && styles.verifiedBadgeDark]}>
                    <Ionicons name="checkmark-sharp" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* User details */}
              <Text style={styles.nameText}>{displayName}</Text>
              <Text style={styles.quoteText}>{quoteText}</Text>

              {/* Member level badge */}
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>
                  {lang === 'vi' ? 'HỘ CHIẾU VÀNG' : 'GOLD EXPLORER'}
                </Text>
              </View>
            </Pressable>
          </LinearGradient>

          {/* Grouped menu options */}
          <ScrollView
            style={styles.menuScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuScrollContent}
          >
            {/* SECTION 1: General */}
            <View style={styles.menuSection}>
              <Text style={[styles.sectionTitle, isDark && styles.textMutedDark]}>General</Text>
              
              {/* Lịch trình của tôi -> Bookings */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isSelected('/bookings') && (isDark ? styles.menuItemActiveDark : styles.menuItemActiveLight),
                ]}
                activeOpacity={0.7}
                onPress={() => handleNavigate('/bookings')}
              >
                <Ionicons
                  name="book-outline"
                  size={18}
                  color={isSelected('/bookings') ? '#9C6644' : (isDark ? '#94A3B8' : '#475569')}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuText,
                    isDark && styles.menuTextDark,
                    isSelected('/bookings') && styles.menuTextActive,
                  ]}
                >
                  {lang === 'vi' ? 'Lịch trình của tôi' : 'My Bookings'}
                </Text>
              </TouchableOpacity>

              {/* Hộ chiếu du lịch -> Travel Passport */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isSelected('/travel-passport') && (isDark ? styles.menuItemActiveDark : styles.menuItemActiveLight),
                ]}
                activeOpacity={0.7}
                onPress={() => handleNavigate('/travel-passport')}
              >
                <Ionicons
                  name="flower-outline"
                  size={18}
                  color={isSelected('/travel-passport') ? '#9C6644' : (isDark ? '#94A3B8' : '#475569')}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuText,
                    isDark && styles.menuTextDark,
                    isSelected('/travel-passport') && styles.menuTextActive,
                  ]}
                >
                  {lang === 'vi' ? 'Hộ chiếu du lịch' : 'Travel Passport'}
                </Text>
              </TouchableOpacity>

              {/* Trợ lý du lịch AI -> AI Assistant */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  handleClose();
                  showSnackbar(lang === 'vi' ? 'Tính năng Trợ lý AI đã được kích hoạt!' : 'AI Assistant is ready!');
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={isDark ? '#94A3B8' : '#475569'} style={styles.menuIcon} />
                <Text style={[styles.menuText, isDark && styles.menuTextDark]}>
                  {lang === 'vi' ? 'Trợ lý du lịch AI' : 'freud AI Assistant'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionDivider} />

            {/* SECTION 2: Profile & Support */}
            <View style={styles.menuSection}>
              <Text style={[styles.sectionTitle, isDark && styles.textMutedDark]}>Profile & Support</Text>

              {/* Cài đặt tài khoản -> Settings */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isSelected('/preferences') && (isDark ? styles.menuItemActiveDark : styles.menuItemActiveLight),
                ]}
                activeOpacity={0.7}
                onPress={() => handleNavigate('/preferences')}
              >
                <Ionicons
                  name="settings-outline"
                  size={18}
                  color={isSelected('/preferences') ? '#9C6644' : (isDark ? '#94A3B8' : '#475569')}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuText,
                    isDark && styles.menuTextDark,
                    isSelected('/preferences') && styles.menuTextActive,
                  ]}
                >
                  {lang === 'vi' ? 'Cài đặt tài khoản' : 'Settings'}
                </Text>
              </TouchableOpacity>

              {/* Hỗ trợ khách hàng -> Help Center */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isSelected('/help-center') && (isDark ? styles.menuItemActiveDark : styles.menuItemActiveLight),
                ]}
                activeOpacity={0.7}
                onPress={() => handleNavigate('/help-center')}
              >
                <Ionicons
                  name="headset-outline"
                  size={18}
                  color={isSelected('/help-center') ? '#9C6644' : (isDark ? '#94A3B8' : '#475569')}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuText,
                    isDark && styles.menuTextDark,
                    isSelected('/help-center') && styles.menuTextActive,
                  ]}
                >
                  {lang === 'vi' ? 'Hỗ trợ khách hàng' : 'Customer Support'}
                </Text>
              </TouchableOpacity>

              {/* Đăng xuất -> Sign Out */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: '#EF4444' }]}>
                  {lang === 'vi' ? 'Đăng xuất tài khoản' : 'Sign Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Drawer Footer Actions - Sleek single full-width button */}
          <View style={[styles.drawerFooter, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
            <TouchableOpacity
              style={[styles.rateBtn, isDark && styles.rateBtnDark]}
              activeOpacity={0.8}
              onPress={() => showSnackbar(lang === 'vi' ? 'Cảm ơn phản hồi từ bạn!' : 'Thanks for rating the app!')}
            >
              <Text style={[styles.rateBtnText, isDark && styles.rateBtnTextDark]}>
                {lang === 'vi' ? 'Đánh giá ứng dụng' : 'Rate Our App'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  drawerPanelLight: {
    backgroundColor: '#FFFFFF',
  },
  drawerPanelDark: {
    backgroundColor: '#0F172A',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 0,
  },
  headerCurve: {
    position: 'absolute',
    bottom: -55,
    left: -30,
    right: -30,
    height: 100,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    transform: [{ scaleX: 1.6 }, { rotate: '-6deg' }],
  },
  headerCurveDark: {
    backgroundColor: '#0F172A',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    zIndex: 10,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoDotRow: {
    flexDirection: 'row',
    gap: 2,
  },
  logoDotColumn: {
    flexDirection: 'column',
    gap: 2,
  },
  logoDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 6,
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 8,
    zIndex: 10,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF5B22', // brand orange
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7F5539', // matches gradient header bottom color to blend cutout
  },
  verifiedBadgeDark: {
    borderColor: '#2A180E', // dark mode header background matching
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    zIndex: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quoteText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    fontStyle: 'italic',
    zIndex: 10,
  },
  memberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    marginTop: 8,
    zIndex: 10,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuSection: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  textMutedDark: {
    color: '#64748B',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuItemActiveLight: {
    backgroundColor: 'rgba(156, 102, 68, 0.08)',
    borderColor: 'rgba(156, 102, 68, 0.15)',
  },
  menuItemActiveDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  menuTextDark: {
    color: '#E2E8F0',
  },
  menuTextActive: {
    color: '#9C6644',
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
    opacity: 0.5,
  },
  drawerFooter: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateBtn: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  rateBtnDark: {
    backgroundColor: 'transparent',
    borderColor: '#334155',
  },
  rateBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  rateBtnTextDark: {
    color: '#94A3B8',
  },
  editPenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
});
