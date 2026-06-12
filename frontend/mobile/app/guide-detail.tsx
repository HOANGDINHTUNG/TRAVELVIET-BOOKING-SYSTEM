import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GuideArticle {
  id: string;
  titleVi: string;
  titleEn: string;
  image: string;
  categoryVi: string;
  categoryEn: string;
  readTimeVi: string;
  readTimeEn: string;
  author: string;
  date: string;
  relatedDestination: string;
  introVi: string;
  introEn: string;
  sectionsVi: { title: string; content: string }[];
  sectionsEn: { title: string; content: string }[];
}

const GUIDES_DB: Record<string, GuideArticle> = {
  'g1': {
    id: 'g1',
    titleVi: 'Bí kíp săn mây Sa Pa tự túc từ A - Z siêu chi tiết',
    titleEn: 'Ultimate Guide to Cloud Hunting in Sa Pa from A to Z',
    image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=1000',
    categoryVi: 'Cẩm nang',
    categoryEn: 'Guide',
    readTimeVi: '5 phút đọc',
    readTimeEn: '5 min read',
    author: 'Hoàng Tùng',
    date: '10/06/2026',
    relatedDestination: 'Sa Pa',
    introVi: 'Sa Pa luôn là điểm đến hấp dẫn du khách bởi vẻ đẹp lãng mạn mờ sương và đặc biệt là hoạt động săn mây kỳ thú trên đỉnh Fansipan hay đèo Ô Quy Hồ. Bài viết này sẽ chia sẻ toàn bộ kinh nghiệm săn mây thành công 100% dành cho bạn.',
    introEn: 'Sa Pa is always a favorite destination for its romantic misty beauty, and especially the breathtaking activity of cloud hunting on the peak of Fansipan or O Quy Ho pass. This article will share all the tips for a 100% successful cloud hunting trip.',
    sectionsVi: [
      {
        title: '1. Thời điểm săn mây lý tưởng nhất trong năm',
        content: 'Mùa mây đẹp nhất ở Sa Pa kéo dài từ tháng 11 đến tháng 3 năm sau. Thời gian này thời tiết khô lạnh, độ ẩm cao và ít mưa, tạo điều kiện thuận lợi nhất để hình thành các biển mây dày đặc bồng bềnh phủ kín thung lũng.'
      },
      {
        title: '2. Những tọa độ săn mây đỉnh cao không thể bỏ lỡ',
        content: '• Đỉnh Fansipan: Tọa độ cao 3.143m là nơi săn mây số 1. Bạn sẽ có cảm giác như đang đi trên mây giữa quần thể tâm linh kỳ vĩ.\n• Đèo Ô Quy Hồ: Đỉnh đèo lộng gió nhìn xuống thung lũng Mường Hoa phủ kín sương mờ vào hoàng hôn.\n• Bản Hang Đá: Địa điểm săn mây hoang sơ và ít người biết, thích hợp cho các bạn trẻ thích cắm trại.'
      },
      {
        title: '3. Kinh nghiệm chuẩn bị hành trang',
        content: 'Thời tiết trên cao rất lạnh và gió mạnh, hãy chuẩn bị áo phao ấm, mũ len, găng tay và giày thể thao có độ bám tốt. Đừng quên mang sạc dự phòng cho điện thoại vì nhiệt độ thấp sẽ làm pin sụt rất nhanh!'
      }
    ],
    sectionsEn: [
      {
        title: '1. The Best Time of the Year for Cloud Hunting',
        content: 'The cloud season in Sa Pa runs from November to March. During this dry, cold period with high humidity and low rainfall, giant seas of clouds form and cover the valleys beautifully.'
      },
      {
        title: '2. Top Cloud Hunting Spots You Cannot Miss',
        content: '• Fansipan Peak: At 3,143m, this is the prime spot where you feel like walking in heaven among spiritual temples.\n• O Quy Ho Pass: A windy pass viewpoint overlooking the misty Muong Hoa valley at sunset.\n• Hang Da Village: An off-the-beaten-path village, perfect for camping and photography.'
      },
      {
        title: '3. Gear & Clothing Tips',
        content: 'High-altitude areas are extremely cold and windy. Pack thick winter coats, beanies, gloves, and hiking shoes. Bring a power bank because the cold drains phone batteries very fast!'
      }
    ]
  },
  'g2': {
    id: 'g2',
    titleVi: 'Bản đồ ăn vặt Hội An chuẩn vị như người địa phương',
    titleEn: 'Hoi An Street Food Map: Eat Like a Local',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000',
    categoryVi: 'Ẩm thực',
    categoryEn: 'Food',
    readTimeVi: '3 phút đọc',
    readTimeEn: '3 min read',
    author: 'Minh Thư',
    date: '12/06/2026',
    relatedDestination: 'Hội An',
    introVi: 'Ẩm thực Hội An không chỉ có Cao Lầu hay Cơm gà nổi tiếng, các món ăn vặt đường phố ở ngõ ngách Phố Cổ mới là thứ níu chân du khách thực sự. Hãy cùng khám phá bản đồ ẩm thực ăn vặt ngon - bổ - rẻ chuẩn vị địa phương nhé.',
    introEn: 'Hoi An cuisine goes beyond Cao Lau and Chicken Rice. The street snacks hidden in the alleyways of the Ancient Town are the real treasures. Let\'s discover the delicious and budget-friendly snacks loved by locals.',
    sectionsVi: [
      {
        title: '1. Bánh mì Hội An - Danh tiếng thế giới',
        content: 'Bánh mì Phượng hay bánh mì Madam Khánh đều mang vỏ giòn tan, patê thơm phức cùng nước sốt chưng đặc chế đậm đà khó cưỡng. Mỗi ổ bánh chỉ khoảng 20.000đ - 35.000đ nhưng đủ dinh dưỡng.'
      },
      {
        title: '2. Chè nướng, tào phớ bên bờ sông Hoài',
        content: 'Vào buổi tối, hãy ghé chân các gánh hàng rong ven sông Hoài để thưởng thức một chén tào phớ gừng thơm nồng, hay ly chè bắp ngọt lịm mát lạnh trong lúc ngắm đèn lồng trôi sông.'
      },
      {
        title: '3. Bánh đập hến xào sông Hoài',
        content: 'Món ăn giản dị làm từ bánh tráng nướng đập dập kèm bánh ướt mịn chấm mắm nêm chưng, ăn cùng đĩa hến xào hành răm thơm lừng ngọt lịm.'
      }
    ],
    sectionsEn: [
      {
        title: '1. Hoi An Banh Mi - World-Famous Taste',
        content: 'Banh Mi Phuong or Madam Khanh are crispy baguettes filled with rich pate, aromatic herbs, and special savory sauce. A complete meal in a sandwich for only 20,000 to 35,000 VND.'
      },
      {
        title: '2. Sweet Soup and Tofu on the Hoai Riverbank',
        content: 'In the evening, sit by the riverbank and try warm ginger tofu or sweet corn pudding from local street vendors while watching lanterns float by.'
      },
      {
        title: '3. Broken Crackers with Stir-fried Clams',
        content: 'A rustic local snack made of crispy grilled rice crackers cracked over soft steamed flat noodles, dipped in fermented sauce and eaten with sweet river clams.'
      }
    ]
  },
  'g3': {
    id: 'g3',
    titleVi: 'Lịch trình nghỉ dưỡng Phú Quốc 3 ngày 2 đêm thư thái',
    titleEn: 'Poetic 3D2N Relaxation Itinerary in Phu Quoc',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
    categoryVi: 'Lịch trình',
    categoryEn: 'Itinerary',
    readTimeVi: '6 phút đọc',
    readTimeEn: '6 min read',
    author: 'Khánh Duy',
    date: '11/06/2026',
    relatedDestination: 'Phú Quốc',
    introVi: 'Bạn muốn trốn chạy khỏi ồn ào đô thị và tận hưởng hoàng hôn tím ngắt trên bãi cát mịn màng? Lịch trình nghỉ dưỡng 3 ngày 2 đêm tại Đảo Ngọc Phú Quốc dưới đây sẽ giúp bạn có chuyến đi thư thái tối đa mà vẫn check-in đủ điểm hot.',
    introEn: 'Want to escape the city noise and enjoy the purple sunsets on fine white sands? This 3-day 2-night itinerary in Phu Quoc Island guarantees maximum relaxation while hitting all the must-see highlights.',
    sectionsVi: [
      {
        title: 'Ngày 1: Check-in Sunset Sanato và thưởng thức hải sản Dương Đông',
        content: 'Sáng đáp sân bay, di chuyển về resort nghỉ ngơi. Chiều tầm 16:30 ghé Sunset Sanato chụp ảnh với các chú voi chân dài khổng lồ dưới hoàng hôn tím lãng mạn. Tối dạo chợ đêm Dương Đông ăn gỏi cá trích và bún quậy.'
      },
      {
        title: 'Ngày 2: Tour Cano 4 đảo và đi bộ dưới đáy biển',
        content: 'Chuyến phiêu lưu khám phá Nam đảo: lướt cano qua các đảo san hô hoang sơ (Hòn Mây Rút, Hòn Móng Tay), lặn ngắm san hô bằng ống thở và trải nghiệm đi bộ dưới đáy biển cực kỳ độc đáo.'
      },
      {
        title: 'Ngày 3: Dạo quanh Grand World và mua đặc sản tiêu ngọc',
        content: 'Ghé thăm khu đô thị sắc màu Grand World được ví như Venice thu nhỏ của Phú Quốc, đi thuyền gỗ trên kênh đào. Trước khi ra sân bay, mua vài hũ tiêu sọ khô thơm nồng và nước mắm truyền thống về làm quà.'
      }
    ],
    sectionsEn: [
      {
        title: 'Day 1: Sunset Sanato and Duong Dong Seafood Market',
        content: 'Arrive at the resort and unwind. At 4:30 PM, visit Sunset Sanato to photograph the iconic long-legged elephants under the sunset. Dinner at Duong Dong night market featuring herring salad.'
      },
      {
        title: 'Day 2: 4-Island Speedboat Tour & Undersea Walk',
        content: 'An adventure across the Southern islets (May Rut, Mong Tay). Enjoy snorkeling, swimming in clear turquoise waters, and an unforgettable undersea sea-walker experience.'
      },
      {
        title: 'Day 3: Venice-like Grand World & Souvenir Shopping',
        content: 'Explore Grand World Phu Quoc, take a gondola ride on the canal. Before heading to the airport, buy some local black pepper and premium fish sauce as souvenirs.'
      }
    ]
  }
};

export default function GuideDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { guideId } = useLocalSearchParams<{ guideId: string }>();
  const { theme, language } = useAppSettings();

  const isDark = theme === 'dark';
  const isVi = language === 'vi';

  const article = GUIDES_DB[guideId || 'g1'] || GUIDES_DB.g1;

  const handleDestinationLink = () => {
    router.push({ pathname: '/destination-detail', params: { pinId: article.relatedDestination } });
  };

  const sections = isVi ? article.sectionsVi : article.sectionsEn;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Sticky Top Back Button */}
      <TouchableOpacity
        style={[styles.floatingBackBtn, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Header Cover */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: article.image }} style={styles.heroImg} />
          <LinearGradient
            colors={isDark ? ['rgba(15,23,42,0.1)', 'rgba(15,23,42,1)'] : ['rgba(0,0,0,0.35)', 'rgba(248,250,252,1)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.metaRow}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>
                  {isVi ? article.categoryVi : article.categoryEn}
                </Text>
              </View>
              <Text style={styles.metaText}>
                {isVi ? article.readTimeVi : article.readTimeEn}
              </Text>
            </View>
            <Text style={styles.titleText}>
              {isVi ? article.titleVi : article.titleEn}
            </Text>
            <Text style={styles.authorText}>
              {isVi ? `Tác giả: ${article.author} • ${article.date}` : `By: ${article.author} • ${article.date}`}
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View style={styles.bodySection}>
          <Text style={[styles.introText, isDark && styles.textDark]}>
            {isVi ? article.introVi : article.introEn}
          </Text>
        </View>

        {/* Article Body Sections */}
        <View style={styles.bodySection}>
          {sections.map((sec, idx) => (
            <View key={idx} style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, isDark && styles.textTitleDark]}>
                {sec.title}
              </Text>
              <Text style={[styles.sectionContent, isDark && styles.textDark]}>
                {sec.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Recommended Destination Link (CTA) */}
        <View style={[styles.bodySection, { marginBottom: 40 }]}>
          <View style={[styles.ctaCard, isDark && styles.ctaCardDark]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.ctaTitle}>
                {isVi ? `Du lịch tại ${article.relatedDestination}` : `Explore ${article.relatedDestination}`}
              </Text>
              <Text style={styles.ctaDesc}>
                {isVi 
                  ? `Tìm thông tin chi tiết, cẩm nang danh thắng và ẩm thực đầy đủ cho chuyến đi ${article.relatedDestination} của bạn.`
                  : `Find detailed landmarks, food guides, and travel information for your next trip to ${article.relatedDestination}.`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaBtn}
              activeOpacity={0.8}
              onPress={handleDestinationLink}
            >
              <Text style={styles.ctaBtnText}>
                {isVi ? 'Xem chi tiết' : 'View Details'}
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  floatingBackBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 320,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryTag: {
    backgroundColor: '#FF5B22',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  authorText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '600',
  },
  bodySection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  introText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'justify',
  },
  textDark: {
    color: '#94A3B8',
  },
  sectionContainer: {
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  textTitleDark: {
    color: '#FFFFFF',
  },
  sectionContent: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'justify',
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  ctaCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5B22',
  },
  ctaDesc: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 16,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5B22',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
