import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettings } from '@/providers/AppSettingsProvider';

interface DetailItem {
  name: string;
  desc: string;
  image: string;
  price?: string;
}

interface ServiceItem {
  name: string;
  icon: string;
  desc: string;
}

interface DestinationDetail {
  id: string;
  name: string;
  province: string;
  coverImage: string;
  description: string;
  landmarks: DetailItem[];
  entertainment: DetailItem[];
  checkinSpots: DetailItem[];
  specialties: DetailItem[];
  otherServices: ServiceItem[];
}

const DESTINATION_DETAILS_DB: Record<string, DestinationDetail> = {
  pin1: {
    id: 'pin1',
    name: 'Sa Pa',
    province: 'Lào Cai',
    coverImage: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=1000',
    description: 'Sa Pa là một thị xã vùng cao biên giới ở vùng Tây Bắc Việt Nam. Nơi đây ẩn chứa nhiều điều kỳ diệu của cảnh sắc thiên nhiên cùng với nét văn hóa bản địa vô cùng độc đáo của các đồng bào dân tộc thiểu số.',
    landmarks: [
      { name: 'Đỉnh Fansipan', desc: 'Được mệnh danh là nóc nhà Đông Dương với độ cao 3.143m, sở hữu quần thể văn hóa tâm linh kỳ vĩ trên đỉnh núi.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400', price: 'Cáp treo: 800.000đ/vé' },
      { name: 'Bản Cát Cát', desc: 'Ngôi làng cổ kính của người Hmong đen với những guồng nước gỗ khổng lồ, nghề dệt thổ cẩm truyền thống và thác nước Cát Cát thơ mộng.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Vé vào cổng: 150.000đ' },
      { name: 'Thung Lũng Mường Hoa', desc: 'Nổi tiếng với những thửa ruộng bậc thang uốn lượn tuyệt mỹ và bãi đá cổ Sa Pa khắc nhiều hoa văn kỳ bí của tổ tiên.', image: 'https://images.unsplash.com/photo-1623940173617-640a3ad827de?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Sun World Fansipan Legend', desc: 'Tổ hợp vui chơi cáp treo, tàu hỏa leo núi và quần thể đền chùa tâm linh trên dãy Hoàng Liên Sơn.', image: 'https://images.unsplash.com/photo-1582803824122-f25522edd1e0?q=80&w=400', price: 'Tàu leo núi: 150.000đ' },
      { name: 'Chợ đêm Sa Pa', desc: 'Hoạt động vào cuối tuần, nơi giao lưu văn nghệ, nướng đồ ăn sưởi ấm và mua sắm đồ lưu niệm thổ cẩm đặc sắc.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Cổng Trời Ô Quy Hồ', desc: 'Điểm ngắm hoàng hôn tuyệt nhất Sa Pa nhìn xuống thung lũng sâu thẳm uốn lượn bên đèo Ô Quy Hồ kỳ vĩ.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400' },
      { name: 'Đồi Chè Ô Long', desc: 'Đồi chè xanh mướt uốn lượn xen kẽ những hàng mai anh đào nở rộ rực rỡ vào những ngày lập đông.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400' },
    ],
    specialties: [
      { name: 'Thắng cố Sa Pa', desc: 'Món ăn truyền thống của người H’Mông nấu từ thịt ngựa, lòng ngựa kết hợp 12 loại gia vị thảo mộc núi rừng.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400', price: 'Từ 100.000đ/bát' },
      { name: 'Cơm lam & Thịt nướng', desc: 'Cơm gạo nếp nương thơm dẻo nướng trong ống tre bánh tẻ ăn kèm thịt heo bản xiên nướng than hồng.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Từ 15.000đ/ống' },
    ],
    otherServices: [
      { name: 'Tắm lá thuốc Dao Đỏ', icon: 'water-outline', desc: 'Liệu pháp thư giãn cơ thể độc đáo bằng nước lá thuốc thảo dược rừng của đồng bào Dao đỏ.' },
      { name: 'Thuê trang phục dân tộc', icon: 'shirt-outline', desc: 'Cho thuê váy Hmong, Dao đầy sắc màu chụp ảnh lưu niệm tại Bản Cát Cát.' },
    ],
  },
  pin2: {
    id: 'pin2',
    name: 'Hà Nội',
    province: 'Thành phố Hà Nội',
    coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000',
    description: 'Hà Nội là thủ đô của nước Cộng hòa Xã hội chủ nghĩa Việt Nam. Thành phố ngàn năm văn hiến mang nét cổ kính trầm mặc của Phố Cổ kết hợp hài hòa với nhịp sống năng động.',
    landmarks: [
      { name: 'Hồ Hoàn Kiếm', desc: 'Trái tim của thủ đô gắn liền với truyền thuyết trả gươm, nổi tiếng với Cầu Thê Húc đỏ tươi uốn lượn dẫn vào đền Ngọc Sơn cổ kính.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400' },
      { name: 'Lăng Chủ Tịch Hồ Chí Minh', desc: 'Nơi an nghỉ vĩnh hằng của vị lãnh tụ kính yêu của dân tộc Việt Nam, nằm giữa Quảng trường Ba Đình lịch sử.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Miễn phí vé vào' },
      { name: 'Văn Miếu - Quốc Tử Giám', desc: 'Trường đại học đầu tiên của Việt Nam, nơi lưu giữ 82 bia tiến sĩ bằng đá đặt trên lưng rùa tôn vinh truyền thống hiếu học.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400', price: 'Vé tham quan: 30.000đ' },
    ],
    entertainment: [
      { name: 'Xem Múa rối nước', desc: 'Nghệ thuật sân khấu dân gian nước truyền thống diễn ra tại nhà hát Thăng Long ngay cạnh Hồ Gươm.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Vé xem: 100.000đ' },
      { name: 'Lotte Mall Tây Hồ', desc: 'Tổ hợp mua sắm, vui chơi giải trí và thủy cung nhân tạo trong nhà lớn nhất thủ đô nằm sát bên Hồ Tây.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Phố cổ Đường Tàu', desc: 'Con phố độc đáo nơi đường ray xe lửa chạy sát sạt hiên nhà dân, điểm check-in siêu hot của du khách nước ngoài.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
      { name: 'Cầu Long Biên', desc: 'Chứng nhân lịch sử trăm tuổi bắc qua sông Hồng do kiến trúc sư người Pháp thiết kế, mang vẻ đẹp hoài cổ nhuốm màu thời gian.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
    ],
    specialties: [
      { name: 'Phở bò Hà Nội', desc: 'Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương bò, bánh phở mềm dẻo cùng những lát thịt bò chín tái thơm lừng.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Từ 45.000đ/bát' },
      { name: 'Cà phê trứng Giảng', desc: 'Sự hòa quyện tuyệt hảo giữa lòng đỏ trứng gà đánh bông xốp ngậy béo và hương vị cà phê phin đắng đậm đà.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Giá từ: 35.000đ' },
    ],
    otherServices: [
      { name: 'Tour xe buýt 2 tầng', icon: 'bus-outline', desc: 'Ngắm cảnh phố phường Hà Nội từ mui trần xe buýt chạy qua các địa điểm danh lam nổi tiếng.' },
      { name: 'Thuê áo dài cổ phục', icon: 'shirt-outline', desc: 'Thuê áo dài truyền thống hay áo ngũ thân chụp ảnh tại Văn Miếu hay Hoàng thành Thăng Long.' },
    ],
  },
  pin3: {
    id: 'pin3',
    name: 'Hạ Long',
    province: 'Quảng Ninh',
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000',
    description: 'Vịnh Hạ Long được UNESCO công nhận là di sản thiên nhiên thế giới, nổi tiếng với hàng ngàn đảo đá vôi nhô lên từ làn nước xanh ngọc bích như bức tranh thủy mặc kỳ vĩ.',
    landmarks: [
      { name: 'Hang Sửng Sốt', desc: 'Hang động lớn nhất và đẹp nhất Vịnh Hạ Long với hàng triệu khối thạch nhũ, măng đá kỳ ảo tạo nên các hình thù sinh động.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=400' },
      { name: 'Đảo Ti Tốp', desc: 'Hòn đảo nhỏ có bãi biển cát trắng hình vầng trăng khuyết ôm lấy chân đảo, đỉnh núi có lầu vọng cảnh ngắm toàn cảnh Vịnh.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Vịnh Bái Tử Long', desc: 'Khu vực vịnh hoang sơ, yên tĩnh nằm kế bên Hạ Long với những bãi biển tự nhiên sạch trong vắt.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Sun World Halong Complex', desc: 'Tổ hợp vui chơi giải trí khổng lồ với cáp treo Nữ Hoàng vượt biển ngắm vịnh, Đồi huyền bí mang phong cách Nhật Bản.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400', price: 'Vé công viên: 350.000đ' },
      { name: 'Chèo thuyền Kayak', desc: 'Tự do chèo thuyền xuyên qua hang luồn, chạm tay vào những khối đá vôi hàng triệu năm tuổi giữa biển khơi.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Thuê xuồng: 50.000đ' },
    ],
    checkinSpots: [
      { name: 'Bảo tàng Quảng Ninh', desc: 'Công trình kiến trúc độc đáo lấy cảm hứng từ than đá với vỏ gương kính đen bóng khổng lồ, điểm check-in cực chất.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
      { name: 'Núi Bài Thơ', desc: 'Ngọn núi đá vôi biểu tượng sừng sững bên vịnh, lưu giữ bút tích thơ cổ của vua Lê Thánh Tông tạc trên vách đá.', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400' },
    ],
    specialties: [
      { name: 'Chả mực giã tay', desc: 'Mực mai tươi rói giã thủ công bằng cối đá tạo độ dai sần sật đặc trưng, chiên nóng hổi thơm giòn nhức nách.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Giá khoảng: 380.000đ/kg' },
      { name: 'Bún bề bề', desc: 'Bún tươi nấu cùng thịt bề bề luộc ngọt nước kết hợp rau cải xanh, đậu hũ chiên và tôm nõn béo ngậy.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Giá từ: 40.000đ/tô' },
    ],
    otherServices: [
      { name: 'Tour du thuyền ngủ đêm', icon: 'boat-outline', desc: 'Trải nghiệm ngủ đêm trên du thuyền sang trọng 5 sao giữa lòng kỳ quan vịnh.' },
      { name: 'Phi cơ ngắm cảnh bay', icon: 'airplane-outline', desc: 'Ngắm vịnh Hạ Long từ máy bay trực thăng hay thủy phi cơ ở độ cao 300m đầy phấn khích.' },
    ],
  },
  pin4: {
    id: 'pin4',
    name: 'Huế',
    province: 'Thừa Thiên Huế',
    coverImage: 'https://images.unsplash.com/photo-1590564311439-909ac7f933b2?q=80&w=1000',
    description: 'Huế từng là kinh đô của triều đại nhà Nguyễn. Thành phố mang nét trầm mặc, thơ mộng bên dòng sông Hương hiền hòa, nổi tiếng với quần thể di tích Đại Nội lộng lẫy và lăng tẩm hoàng cung uy nghiêm.',
    landmarks: [
      { name: 'Đại Nội Huế', desc: 'Quần thể cung điện hoàng gia gồm Hoàng Thành và Tử Cấm Thành, trung tâm chính trị xưa triều Nguyễn.', image: 'https://images.unsplash.com/photo-1590564311439-909ac7f933b2?q=80&w=400', price: 'Vé vào cổng: 200.000đ' },
      { name: 'Lăng Khải Định', desc: 'Đỉnh cao của kiến trúc lăng tẩm kết hợp giữa văn hóa phương Đông truyền thống và nghệ thuật phương Tây hiện đại.', image: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=400', price: 'Vé lăng: 150.000đ' },
      { name: 'Chùa Thiên Mụ', desc: 'Ngôi chùa cổ kính bốn trăm năm tuổi sừng sững bên dòng sông Hương thơ mộng, biểu tượng tâm linh xứ Huế.', image: 'https://images.unsplash.com/photo-1609137144813-7d7211bf7ec8?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Ca Huế trên Sông Hương', desc: 'Ngồi thuyền rồng lắng nghe những điệu hò, ca trù Huế mộc mạc cổ xưa và thả hoa đăng cầu may trên sông.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Vé nghe: 100.000đ' },
      { name: 'Suối nước nóng Alba Thanh Tân', desc: 'Khu du lịch sinh thái suối khoáng nóng tự nhiên kết hợp các trò chơi mạo hiểm Zipline và Highwire đầy thú vị.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Trường Quốc Học Huế', desc: 'Ngôi trường trung học cổ kính sơn màu đỏ sẫm đặc trưng, lối kiến trúc cổ điển Pháp pha lẫn Á Đông tuyệt đẹp.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400' },
      { name: 'Đồi Vọng Cảnh', desc: 'Ngọn đồi cao lộng gió ngắm khúc cua sông Hương lãng mạn uốn lượn ôm lấy rừng thông xanh ngắt mộng mơ.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400' },
    ],
    specialties: [
      { name: 'Bún bò Huế', desc: 'Bún sợi to chan nước dùng ngọt thanh từ xương bò hòa quyện mắm ruốc thơm lừng, ăn kèm mọc heo, huyết và chân giò.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Tô thường: 35.000đ' },
      { name: 'Bánh bèo, nậm, lọc', desc: 'Khay bánh đặc sản Huế làm từ bột gạo dẻo mịn, rắc tôm khô cháy và tóp mỡ ăn kèm nước mắm ngọt cay dịu dại.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Khay lớn: 60.000đ' },
    ],
    otherServices: [
      { name: 'Thuê áo dài cổ phục', icon: 'shirt-outline', desc: 'Cho thuê áo ngũ thân, áo Nhật Bình chụp ảnh hoàng gia bên tường thành cổ kính.' },
      { name: 'Xe điện tham quan Đại Nội', icon: 'car-outline', desc: 'Xe điện đưa đón di chuyển dạo quanh Đại Nội hoàng thành rộng lớn tiện lợi.' },
    ],
  },
  pin5: {
    id: 'pin5',
    name: 'Đà Nẵng',
    province: 'Thành phố Đà Nẵng',
    coverImage: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=1000',
    description: 'Đà Nẵng được coi là thành phố đáng sống nhất Việt Nam, sở hữu bãi biển Mỹ Khê lọt top đẹp nhất hành tinh, bán đảo Sơn Trà hoang sơ kỳ vĩ và những cây cầu bắc qua sông Hàn lừng lẫy.',
    landmarks: [
      { name: 'Cầu Vàng (Bà Nà Hills)', desc: 'Cây cầu đi bộ lơ lửng trên mây được nâng đỡ bởi hai bàn tay khổng lồ rêu phong đầy ấn tượng.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400', price: 'Vé Bà Nà: 900.000đ' },
      { name: 'Ngũ Hành Sơn', desc: 'Quần thể 5 ngọn núi đá vôi thiêng liêng sừng sững bên biển, chứa các hang động và chùa cổ kính huyền bí.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Vé tham quan: 40.000đ' },
      { name: 'Chùa Linh Ứng Bán Đảo', desc: 'Ngôi chùa sở hữu tượng Phật Quan Thế Âm cao nhất Việt Nam (67m) hướng mắt ra vịnh biển Đà Nẵng lộng lẫy.', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Ba Na Hills Fantasy Park', desc: 'Khu vui chơi giải trí trong nhà lớn nhất Việt Nam nằm trên đỉnh núi, phong cách lâu đài trung cổ lãng mạn.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400' },
      { name: 'Công viên Châu Á (Asia Park)', desc: 'Nổi bật với Vòng quay Mặt Trời khổng lồ Sun Wheel ngắm nhìn toàn cảnh thành phố rực rỡ ánh đèn đêm.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400', price: 'Cáp treo/vòng quay: 200.000đ' },
    ],
    checkinSpots: [
      { name: 'Cầu Rồng Đà Nẵng', desc: 'Cây cầu hình rồng thép khổng lồ phun lửa và phun nước ngoạn mục vào mỗi tối thứ Bảy, Chủ nhật.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Đèo Hải Vân', desc: 'Thiên hạ đệ nhất hùng quan nối Huế và Đà Nẵng với những khúc cua tay áo uốn lượn ôm sát vách đá nhìn ra đại dương xanh thẳm.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Mì Quảng', desc: 'Bún sợi to dẹt ăn cùng nước nhân tôm, thịt heo gà kho đậm đà, rắc lạc rang thơm giòn và bánh đa nướng giòn rụm.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Tô mì Quảng: 30.000đ' },
      { name: 'Bánh tráng thịt heo', desc: 'Thịt heo ba chỉ luộc thái mỏng uốn mỡ trong cuộn cùng rau sống bánh mướt chấm mắm nêm chưng cay ngọt đậm đà.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Phần thường: 50.000đ' },
    ],
    otherServices: [
      { name: 'Du thuyền sông Hàn', icon: 'boat-outline', desc: 'Thưởng ngoạn đêm sông Hàn lãng mạn dưới những cây cầu rực rỡ từ boong du thuyền mui trần.' },
      { name: 'Cho thuê xe máy tự lái', icon: 'bicycle-outline', desc: 'Thuê xe máy phượt đèo Hải Vân hay dạo quanh bán đảo Sơn Trà ngắm khỉ tự nhiên.' },
    ],
  },
  pin6: {
    id: 'pin6',
    name: 'Nha Trang',
    province: 'Khánh Hòa',
    coverImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1000',
    description: 'Nha Trang là thiên đường biển đảo duyên hải miền Trung nước ta với vịnh biển xanh thẳm hiền hòa, rặng san hô rực rỡ muôn màu dưới lòng biển khơi và những khu nghỉ dưỡng cao cấp.',
    landmarks: [
      { name: 'Tháp Bà Po Nagar', desc: 'Quần thể đền tháp Chăm cổ kính được xây dựng từ thế kỷ thứ VIII, kiệt tác kiến trúc gạch nung tôn vinh Thiên Y Thánh Mẫu.', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400', price: 'Vé vào cổng: 30.000đ' },
      { name: 'Hòn Mun', desc: 'Khu bảo tồn biển san hô đầu tiên của nước ta với hơn 350 loài san hô rực rỡ sinh sống dưới làn nước trong vắt.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400' },
      { name: 'Chùa Long Sơn', desc: 'Ngôi chùa cổ tự linh thiêng nổi bật với tượng Kim Thân Phật Tổ khổng lồ màu trắng uy nghiêm tọa lạc trên đỉnh đồi Trại Thủy.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
    ],
    entertainment: [
      { name: 'VinWonders Nha Trang', desc: 'Công viên giải trí khổng lồ trên đảo Hòn Tre với vòng xoay bầu trời lớn, cáp treo vượt biển dài, và vịnh phao nổi khổng lồ.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Vé combo: 800.000đ' },
      { name: 'Tắm bùn khoáng nóng', desc: 'Liệu pháp thư giãn ngâm mình trong bùn khoáng nóng tự nhiên giúp thanh lọc làn da và hồi phục sức khỏe.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400', price: 'Ngâm bùn: 250.000đ' },
    ],
    checkinSpots: [
      { name: 'Cáp treo Vinpearl', desc: 'Check-in trên cabin cáp treo lơ lửng giữa trời xanh biển thẳm ngắm trọn vẹn vịnh biển Nha Trang tuyệt mỹ.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Ga Nha Trang', desc: 'Ngôi nhà ga cổ kính mang dấu ấn kiến trúc Pháp cổ điển thanh lịch, góc sống ảo cực hoài niệm cho bạn trẻ.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Bún chả cá sứa', desc: 'Nước dùng trong veo ngọt thanh nấu từ cá cờ ăn cùng chả cá thu chiên vàng ruộm và sứa giòn sần sật mát lạnh.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Từ 35.000đ/tô' },
      { name: 'Nem nướng Ninh Hòa', desc: 'Thịt nem quấn sả nướng trên than hồng cuốn bánh tráng rán giòn, khế chua chuối chát chấm mắm thịt nếp sền sệt béo ngậy.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Suất nem nướng: 45.000đ' },
    ],
    otherServices: [
      { name: 'Cano cao tốc thuê đảo', icon: 'boat-outline', desc: 'Thuê ca-nô đi tour 3 đảo ngắm san hô bơi biển riêng tư nhanh chóng.' },
      { name: 'Lặn biển bằng bình khí', icon: 'water-outline', desc: 'Dịch vụ lặn bình khí chuyên nghiệp có hướng dẫn viên dìu lặn ngắm san hô đáy Hòn Mun.' },
    ],
  },
  pin7: {
    id: 'pin7',
    name: 'Đà Lạt',
    province: 'Lâm Đồng',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000',
    description: 'Đà Lạt là thành phố ngàn hoa ôn đới mộng mơ mát lạnh quanh năm tọa lạc trên cao nguyên Lâm Viên. Nơi đây thu hút du khách nhờ cảnh quan sương mù, rừng thông reo vi vu và vô vàn tiệm cà phê săn mây cực thơ.',
    landmarks: [
      { name: 'Hồ Xuân Hương', desc: 'Hồ nước nhân tạo hình trăng khuyết thơ mộng nằm ngay trái tim thành phố, bao quanh bởi những thảm cỏ và vườn hoa rực rỡ.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400' },
      { name: 'Thác Datanla', desc: 'Con thác hùng vĩ uốn lượn u tịch giữa rừng thông nguyên sinh, nổi tiếng với hệ thống máng trượt xuyên rừng đầy phấn khích.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Vé máng trượt: 100.000đ' },
      { name: 'Đỉnh Langbiang', desc: 'Ngọn núi truyền thuyết được ví như mái nhà của Đà Lạt, ngắm trọn thung lũng vàng và dòng suối bạc mờ ảo dưới mây.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400', price: 'Vé cổng: 50.000đ' },
    ],
    entertainment: [
      { name: 'Máng trượt Alpine Coaster', desc: 'Máng trượt dài uốn lượn quanh sườn núi rừng thông đưa bạn khám phá chân thác Datanla tuyệt mỹ.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400' },
      { name: 'Chợ đêm Đà Lạt', desc: 'Thiên đường ẩm thực đêm nhộn nhịp rực lửa khói ngập đồ nướng, sữa đậu nành nóng và bánh tráng nướng.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Đồi Chè Cầu Đất săn mây', desc: 'Khu đồi chè xanh mướt mải ngút tầm mắt nơi du khách check-in trên cầu gỗ săn mây sớm bồng bềnh như cõi tiên.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Quảng trường Lâm Viên', desc: 'Bông hoa dã quỳ và nụ hoa Atiso khổng lồ bằng kính màu đặc trưng lung linh sừng sững bên Hồ Xuân Hương.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Lẩu gà lá é', desc: 'Thịt gà ta dai giòn nấu lẩu măng chua, rắc lá é cay cay nồng ấm sưởi ấm đêm đông Đà Lạt lạnh buốt.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Lẩu nhỏ: 200.000đ' },
      { name: 'Bánh tráng nướng', desc: 'Bánh tráng nướng vàng trên than hồng rắc trứng, xúc xích, hành phi, phô mai béo ngậy được ví như bánh Pizza Đà Lạt.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Giá từ: 20.000đ' },
    ],
    otherServices: [
      { name: 'Xe Jeep leo đỉnh núi', icon: 'car-outline', desc: 'Thuê chuyến xe Jeep khứ hồi chinh phục đỉnh đồi Langbiang lộng gió thú vị.' },
      { name: 'Cắm trại Glamping đồi thông', icon: 'home-outline', desc: 'Dịch vụ lều trại sang trọng đốt lửa trại sưởi ấm ngắm thung lũng đêm lãng mạn.' },
    ],
  },
  pin8: {
    id: 'pin8',
    name: 'Sài Gòn',
    province: 'Thành phố Hồ Chí Minh',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1000',
    description: 'Thành phố Hồ Chí Minh là trung tâm kinh tế, văn hóa lớn nhất Việt Nam. Sài Gòn mang nhịp sống hối hả, sôi động bất kể ngày đêm với các tòa nhà chọc trời, ẩm thực phong phú và nếp sống hào sảng.',
    landmarks: [
      { name: 'Dinh Độc Lập', desc: 'Dinh thự mang dấu ấn lịch sử hào hùng, dinh tổng thống xưa, nơi chứng kiến sự kiện non sông thu về một mối năm 1975.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400', price: 'Vé vào cửa: 65.000đ' },
      { name: 'Nhà thờ Đức Bà', desc: 'Kiệt tác kiến trúc cổ điển Pháp bằng gạch nung đỏ Marseille sừng sững uy nghiêm tại trung tâm quận 1.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400' },
      { name: 'Bưu điện Trung tâm', desc: 'Tòa bưu điện cổ mang phong cách kiến trúc Pháp cổ điển kết hợp hài hòa với họa tiết trang trí Á Đông thanh lịch.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Landmark 81 Skyview', desc: 'Đài quan sát từ tầng 79-81 trên tòa nhà cao nhất Việt Nam ngắm nhìn toàn cảnh thành phố lộng lẫy bên sông Sài Gòn.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Vé lên đài: 420.000đ' },
      { name: 'Chợ Bến Thành dạo bộ', desc: 'Ngôi chợ lịch sử sầm uất với đủ các loại đặc sản ẩm thực Nam Bộ, hàng mỹ nghệ lưu niệm và quà tặng.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Cầu Ba Son', desc: 'Cây cầu dây văng dây võng mỹ thuật nối liền quận 1 và quận 2, điểm check-in hoàng hôn cực chill mới của giới trẻ.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Hẻm Hào Sĩ Phường', desc: 'Khu phố hẻm của người Hoa với ban công xây uốn lượn cổ kính, mang màu sắc điện ảnh đậm nét Sài Gòn xưa.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Cơm tấm Sài Gòn', desc: 'Hạt gạo tấm khô ráo ăn cùng sườn nướng mỡ hành thơm nức, bì thính heo thơm và chả trứng đút lò hấp béo ngậy.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Dĩa thường: 40.000đ' },
      { name: 'Hủ tiếu Nam Vang', desc: 'Hủ tiếu nước hoặc khô dai ngon chan nước lèo ngọt từ tủy heo cùng tôm, thịt băm, gan heo trứng cút thơm lừng tỏi phi.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Bát thường: 50.000đ' },
    ],
    otherServices: [
      { name: 'Sài Gòn Waterbus', icon: 'boat-outline', desc: 'Trải nghiệm đi xe buýt đường sông ngắm nhìn thành phố chọc trời lướt qua cực thư thái.' },
      { name: 'Tour Vespa ẩm thực đêm', icon: 'bicycle-outline', desc: 'Ngồi xe máy Vespa cổ phi qua những con ngõ ẩm thực ngập hương vị Sài Gòn.' },
    ],
  },
  pin9: {
    id: 'pin9',
    name: 'Phú Quốc',
    province: 'Kiên Giang',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
    description: 'Đảo Ngọc Phú Quốc là hòn đảo lớn nhất Việt Nam nằm trong vịnh Thái Lan. Nơi đây sở hữu bãi Sao uốn lượn cát mịn màng như kem, rặng san hô rực rỡ và những công viên giải trí quy mô quốc tế.',
    landmarks: [
      { name: 'Bãi Sao Phú Quốc', desc: 'Bãi biển thiên đường nổi tiếng nhất đảo với làn nước xanh lơ trong vắt, bãi cát trắng phau uốn lượn hàng dừa nằm ngang.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400' },
      { name: 'Hòn Thơm', desc: 'Hòn đảo hoang sơ tuyệt mỹ nổi bật với công viên nước Aquatopia hiện đại, kết nối bằng cáp treo vượt biển 3 dây kỷ lục thế giới.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Vé cáp treo: 600.000đ' },
      { name: 'Nhà tù Phú Quốc', desc: 'Địa danh lịch sử giam giữ hàng ngàn chiến sĩ xưa, tái hiện lại những hình phạt tra tấn dã man qua các tượng sáp mô phỏng.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
    ],
    entertainment: [
      { name: 'VinWonders & Safari', desc: 'Công viên chủ đề đẳng cấp thế giới với lâu đài cổ tích kỳ ảo và khu bảo tồn động vật hoang dã bán hoang dã safari lớn nhất VN.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Combo vé: 1.200.000đ' },
      { name: 'Grand World Phú Quốc', desc: 'Thành phố không ngủ tràn ngập sắc màu Venice lãng mạn, show diễn Tinh Hoa Việt Nam hoành tráng tái hiện lịch sử hào hùng.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400', price: 'Show diễn: 300.000đ' },
    ],
    checkinSpots: [
      { name: 'Cầu Hôn (Kiss Bridge)', desc: 'Kiệt tác điêu khắc nghệ thuật bắt ngang biển với hai đầu cầu không chạm nhau, góc ngắm hoàng hôn đỉnh cao nhất đảo.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Sunset Sanato Beach Club', desc: 'Check-in trên bãi biển ngắm những mô hình tượng voi chân dài, cá bay khổng lồ bằng gỗ lướt trên mặt nước lúc hoàng hôn tím.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Gỏi cá trích', desc: 'Cá trích tươi thái mỏng trộn dừa nạo, hành tây cuốn bánh tráng rau rừng chấm nước sốt mắm đậu phộng chua ngọt ngậy thơm.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Đĩa lớn: 150.000đ' },
      { name: 'Bún Quậy Kiến Xây', desc: 'Bún tươi ép từ khuôn nấu cùng chả cá tôm tươi giã quết sát lòng bát, hành lá chan nước sôi nóng quậy nhuyễn trước khi ăn.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Tô đặc biệt: 60.000đ' },
    ],
    otherServices: [
      { name: 'Cano cao tốc 4 đảo', icon: 'boat-outline', desc: 'Tour cano lướt nhanh khám phá 4 hòn đảo san hô hoang sơ phía nam Phú Quốc.' },
      { name: 'Tour câu mực đêm', icon: 'moon-outline', desc: 'Trải nghiệm làm ngư dân câu mực đêm giữa biển khơi và nấu cháo mực ăn nóng trên tàu.' },
    ],
  },
  pin10: {
    id: 'pin10',
    name: 'Tokyo',
    province: 'Kanto, Nhật Bản',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000',
    description: 'Tokyo là thủ đô năng động sầm uất bậc nhất của Nhật Bản. Nơi đây là siêu đô thị hiện đại giao thoa hoàn hảo giữa những tòa nhà chọc trời phát sáng rực rỡ và đền thờ cổ kính mang dấu ấn tôn giáo thiêng liêng.',
    landmarks: [
      { name: 'Đền Senso-ji (Asakusa)', desc: 'Ngôi đền cổ kính linh thiêng nhất Tokyo xây dựng từ thế kỷ thứ VII thờ Phật Bà Quan Âm, nổi bật với cổng Kaminarimon treo đèn lồng đỏ khổng lồ.', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=400' },
      { name: 'Tokyo Skytree', desc: 'Tháp truyền hình cao nhất thế giới (634m) với đài quan sát kính trong suốt ngắm trọn vẹn thung lũng đô thị Tokyo rực sáng đèn đêm.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Vé đài ngắm: 3100 JPY' },
      { name: 'Ngã tư Shibuya', desc: 'Giao lộ nhộn nhịp đi bộ đông đúc nhất thế giới, biểu tượng của lối sống bận rộn hối hả đô thị Nhật Bản.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
    ],
    entertainment: [
      { name: 'teamLab Planets Tokyo', desc: 'Bảo tàng nghệ thuật số tương tác nhập vai siêu thực độc đáo, nơi du khách đi chân trần trên nước và hòa mình vào thảm hoa chiếu 3D.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Vé vào cửa: 3800 JPY' },
      { name: 'Akihabara Electric Town', desc: 'Thánh địa văn hóa điện tử Anime, Manga và Maid Cafe nhộn nhịp rực rỡ hàng triệu thiết bị điện tử giá gốc.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Đền thờ Meiji Jingu', desc: 'Đền thờ Thần đạo cổ xưa u tịch ẩn mình giữa khu rừng sồi mát xanh rợp bóng mát ngay sát quận Shibuya sầm uất.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Đường Takeshita (Harajuku)', desc: 'Con đường thời trang đầy sắc màu rực rỡ ngập tràn văn hóa cosplay cá tính, bánh Crepe trứng ngọt béo ngậy.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Ramen truyền thống', desc: 'Bát mì ramen nóng hổi đầm ấm chan nước cốt hầm xương heo Tonkotsu ngậy béo, thịt xá xíu mềm tan đầu lưỡi.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Giá từ: 1000 JPY' },
      { name: 'Sushi tươi Edo-mae', desc: 'Lát cá sống hồi, ngừ tươi rói đặt trên miếng cơm giấm nếp dẻo thơm được các đầu bếp nặn bằng tay tỉ mỉ.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Set Sushi: từ 2500 JPY' },
    ],
    otherServices: [
      { name: 'Thuê Kimono truyền thống', icon: 'shirt-outline', desc: 'Cho thuê trang phục Kimono, Yukata chụp ảnh tuyệt mỹ tại cổ kính phố Asakusa.' },
      { name: 'Thẻ tàu điện ngầm Pasmo', icon: 'card-outline', desc: 'Thẻ nạp tiền tích hợp thanh toán tàu điện ngầm, xe buýt ngầm tiện lợi không dùng tiền mặt.' },
    ],
  },
  pin11: {
    id: 'pin11',
    name: 'Seoul',
    province: 'Hàn Quốc',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000',
    description: 'Seoul là thủ đô hiện đại của Hàn Quốc, trung tâm kinh tế, văn hóa lớn của Đông Á. Thành phố giao hòa độc đáo giữa các cung điện xưa ngàn tuổi và nhịp sống âm nhạc giải trí K-Pop hiện đại sôi động.',
    landmarks: [
      { name: 'Cung điện Gyeongbokgung', desc: 'Cung điện hoàng gia lớn nhất thời Joseon xây dựng năm 1395, nổi bật với show đổi gác tuần hoàng cung nghi lễ cổ xưa.', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400', price: 'Vé vào cửa: 3000 KRW' },
      { name: 'Tháp N Seoul (Namsan)', desc: 'Tháp truyền hình sừng sững trên đỉnh núi Namsan thơ mộng, nơi treo hàng triệu chiếc ổ khóa tình yêu sắc màu lãng mạn.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Cáp treo: 15000 KRW' },
      { name: 'Làng cổ Bukchon Hanok', desc: 'Khu phố cổ lưu giữ hàng trăm ngôi nhà gỗ hanok truyền thống có tuổi đời hàng trăm năm yên bình tĩnh mịch.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Lotte World Adventure', desc: 'Khu công viên giải trí trong nhà lớn nhất thế giới kết hợp lâu đài ma thuật ngoài trời lơ lửng trên hồ nước.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Vé vào cổng: 62000 KRW' },
      { name: 'Phố mua sắm Myeongdong', desc: 'Thánh địa mỹ phẩm Hàn Quốc náo nhiệt sầm uất ngập tràn hương vị ẩm thực đường phố bốc khói ngun ngút.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Suối Cheonggyecheon', desc: 'Con suối thanh mát trong vắt uốn lượn u tịch chảy xuyên qua lòng thủ đô nhộn nhịp, điểm check-in hóng mát lãng mạn.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400' },
      { name: 'Dongdaemun Design Plaza', desc: 'Tòa nhà kiến trúc phi đối xứng uốn lượn siêu thực tương lai do kiến trúc sư Zaha Hadid thiết kế, lung linh ánh đèn led đêm.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Thịt nướng Samgyeopsal', desc: 'Thịt ba chỉ heo nướng xèo xèo trên vỉ than hồng cuốn rau diếp, kim chi chấm nước sốt mắm ssamjang thơm nồng.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Phần nướng: từ 15000 KRW' },
      { name: 'Gà hầm sâm Samgyetang', desc: 'Gà tơ nhồi gạo nếp nương, nhân sâm đại táo hầm nhừ trong thố đá, món ăn đại bổ sưởi ấm cơ thể cực tốt.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Thố gà sâm: 18000 KRW' },
    ],
    otherServices: [
      { name: 'Cho thuê Hanbok cung điện', icon: 'shirt-outline', desc: 'Miễn phí vé vào cửa cung điện Gyeongbokgung khi mặc Hanbok truyền thống thuê chụp ảnh.' },
      { name: 'Sim dữ liệu 4G LTE', icon: 'wifi-outline', desc: 'Sim kết nối internet siêu tốc đón nhận nhận ngay tại sân bay Incheon nhanh chóng.' },
    ],
  },
  pin12: {
    id: 'pin12',
    name: 'Bangkok',
    province: 'Thái Lan',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1000',
    description: 'Thủ đô Bangkok của Thái Lan là thành phố du lịch hàng đầu Đông Nam Á. Nơi đây hấp dẫn du khách nhờ các ngôi đền Phật giáo dát vàng lộng lẫy bên dòng sông Chao Phraya, chợ đêm náo nhiệt và ẩm thực đường phố cay nồng cuốn hút.',
    landmarks: [
      { name: 'Đại Hoàng Cung (Grand Palace)', desc: 'Quần thể kiến trúc hoàng gia lộng lẫy dát vàng rực rỡ, nơi đặt đền thờ Chùa Phật Ngọc thiêng liêng biểu tượng vương quốc.', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=400', price: 'Vé vào cửa: 500 THB' },
      { name: 'Đền Wat Arun (Chùa Bình Minh)', desc: 'Ngôi đền tháp khảm sành sứ trắng tinh xảo lấp lánh sừng sững uy nghiêm bên bờ sông Chao Phraya thơ mộng.', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400', price: 'Vé vào cửa: 100 THB' },
      { name: 'Chợ nổi Damnoen Saduak', desc: 'Trải nghiệm nét sinh hoạt mua bán nhộn nhịp u tịch trên những chiếc xuồng gỗ bơi trên dòng kênh rạch chằng chịt.', image: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=400' },
    ],
    entertainment: [
      { name: 'Safari World Bangkok', desc: 'Công viên động vật mở lớn nhất thế giới kết hợp show cá heo biển diễn xiếc khỉ tinh nghịch đầy sảng khoái.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400', price: 'Vé trọn gói: 1000 THB' },
      { name: 'Chợ đêm Jodd Fairs', desc: 'Thánh địa ăn vặt của giới trẻ ngập sườn núi heo khổng lồ sốt ớt xanh, sinh tố hoa quả mọng và âm nhạc sống động.', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400' },
    ],
    checkinSpots: [
      { name: 'Mahanakhon Skywalk', desc: 'Đài quan sát kính trong suốt lơ lửng trên nóc tòa nhà cao nhất Bangkok ngắm nhìn hoàng hôn rực lửa uốn lượn.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=400', price: 'Vé lên kính: 850 THB' },
      { name: 'Phố Chinatown (Yaowarat)', desc: 'Check-in ngập tràn biển hiệu neon rực rỡ hoành tráng, thiên đường ẩm thực đường phố tấp nập xe Tuk Tuk qua lại.', image: 'https://images.unsplash.com/photo-1508809603885-50cf7c579365?q=80&w=400' },
    ],
    specialties: [
      { name: 'Tom Yum Goong', desc: 'Canh tôm chua cay béo ngậy nước cốt dừa thơm nức sả chanh lá chanh Thái, món ngon đại diện xứ Chùa Vàng.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', price: 'Tô vừa: 180 THB' },
      { name: 'Xôi xoài ngọt lịm', desc: 'Gạo nếp dẻo thơm rưới nước cốt dừa béo bùi ăn kèm những lát xoài chín vàng ngọt mát lịm lừng danh vị ngọt.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', price: 'Phần xôi xoài: 80 THB' },
    ],
    otherServices: [
      { name: 'Thuyền gỗ đi sông Chao Phraya', icon: 'boat-outline', desc: 'Ngắm cảnh chùa tháp cổ hai bên bờ sông từ boong thuyền gỗ truyền thống.' },
      { name: 'Massage Thái cổ truyền', icon: 'body-outline', desc: 'Liệu pháp ấn huyệt giãn cơ cổ xưa giúp hồi phục sinh lực cơ thể sau ngày dạo bộ.' },
    ],
  },
};

const DYNAMIC_IMAGES: Record<string, string> = {
  'hà giang': 'https://images.unsplash.com/photo-1623940173617-640a3ad827de?q=80&w=1000',
  'ninh bình': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000',
  'hội an': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000',
  'barcelona': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000',
  'venice': 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000',
  'sydney': 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=1000',
  'cát bà': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000',
  'phong nha': 'https://images.unsplash.com/photo-1609137144813-7d7211bf7ec8?q=80&w=1000',
  'phú yên': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000',
  'côn đảo': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000',
  'cần thơ': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000',
  'cao bằng': 'https://images.unsplash.com/photo-1582803824122-f25522edd1e0?q=80&w=1000',
  'hải phòng': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000',
  'quy nhơn': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000',
  'mũi né': 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000',
  'vũng tàu': 'https://images.unsplash.com/photo-1509060464153-4466739f88c0?q=80&w=1000',
};

const generateDynamicDetail = (name: string, lang: 'vi' | 'en'): DestinationDetail => {
  const normalized = name.toLowerCase();
  const coverImage = DYNAMIC_IMAGES[normalized] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000';
  
  const isVi = lang === 'vi';
  
  return {
    id: name,
    name: name,
    province: isVi ? 'Điểm đến du lịch' : 'Tourist Destination',
    coverImage: coverImage,
    description: isVi 
      ? `${name} là một trong những điểm đến hấp dẫn và nổi bật nhất, thu hút đông đảo du khách ghé thăm nhờ vẻ đẹp thiên nhiên độc đáo, bề dày văn hóa lịch sử và phong vị ẩm thực đặc sắc.`
      : `${name} is one of the most attractive and outstanding destinations, drawing visitors from all over the world with its unique natural beauty, rich cultural history, and distinct local cuisine.`,
    landmarks: [
      {
        name: isVi ? `Danh thắng nổi tiếng tại ${name}` : `Famous Landmark in ${name}`,
        desc: isVi 
          ? `Khu di tích danh thắng nổi tiếng tại ${name} sở hữu cảnh sắc thiên nhiên kỳ vĩ, kiến trúc độc đáo và không gian yên bình tĩnh lặng.`
          : `Famous scenic site in ${name} possessing magnificent landscapes, unique architecture, and a peaceful atmosphere.`,
        image: coverImage,
      },
      {
        name: isVi ? `Khu phố trung tâm ${name}` : `${name} Town Center`,
        desc: isVi 
          ? `Nơi lưu giữ nét đẹp văn hóa lâu đời, kiến trúc cổ xưa cùng nhịp sống mộc mạc và thân thiện của người dân địa phương.`
          : `A place preserving long-standing cultural beauty, ancient architecture, and the simple, friendly lifestyle of locals.`,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
      }
    ],
    entertainment: [
      {
        name: isVi ? 'Tổ hợp vui chơi giải trí' : 'Entertainment & Amusement Complex',
        desc: isVi 
          ? `Khu phức hợp vui chơi giải trí sôi động bậc nhất tại ${name} với nhiều trò chơi hấp dẫn, các show diễn nghệ thuật và hoạt động tương tác.`
          : `The most vibrant entertainment complex in ${name} with exciting games, art shows, and interactive activities.`,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
      }
    ],
    checkinSpots: [
      {
        name: isVi ? 'Điểm check-in toàn cảnh' : 'Panoramic Photo Spot',
        desc: isVi 
          ? `Góc chụp ảnh check-in tuyệt đẹp thu trọn toàn cảnh ${name} thơ mộng bên dưới, lý tưởng nhất vào lúc bình minh hoặc hoàng hôn.`
          : `A stunning photo spot capturing the poetic panorama of ${name} below, ideal at sunrise or sunset.`,
        image: coverImage,
      }
    ],
    specialties: [
      {
        name: isVi ? `Ẩm thực đặc sản ${name}` : `${name} Local Food Specialty`,
        desc: isVi 
          ? `Các món ăn truyền thống mang đậm hương vị đặc trưng vùng miền của ${name}, được chế biến tỉ mỉ từ nguyên liệu tươi ngon địa phương.`
          : `Traditional dishes rich in regional flavors of ${name}, meticulously prepared from fresh local ingredients.`,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400',
        price: isVi ? 'Giá cả phải chăng' : 'Reasonable price'
      }
    ],
    otherServices: [
      {
        name: isVi ? 'Hướng dẫn viên bản địa' : 'Local Tour Guide',
        icon: 'people-outline',
        desc: isVi 
          ? 'Đội ngũ hướng dẫn viên giàu kinh nghiệm đồng hành chia sẻ các câu chuyện lịch sử văn hóa.'
          : 'Experienced guides sharing historical and cultural stories along the way.'
      },
      {
        name: isVi ? 'Dịch vụ đưa đón du lịch' : 'Tourist Transfer Service',
        icon: 'car-outline',
        desc: isVi 
          ? 'Phương tiện đưa đón đời mới tiện nghi, phục vụ tận tình chu đáo suốt chuyến đi.'
          : 'Modern and comfortable transfer vehicles, serving you dedicatedly throughout the trip.'
      }
    ]
  };
};

export default function DestinationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pinId } = useLocalSearchParams<{ pinId: string }>();
  const { language } = useAppSettings();
  const lang = language as 'vi' | 'en';

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  // 1. Try direct database key lookup
  let detail = pinId ? DESTINATION_DETAILS_DB[pinId] : undefined;
  
  // 2. If not found, try searching by name in the database
  if (!detail && pinId) {
    const foundKey = Object.keys(DESTINATION_DETAILS_DB).find(
      (key) => DESTINATION_DETAILS_DB[key].name.toLowerCase() === pinId.toLowerCase()
    );
    if (foundKey) {
      detail = DESTINATION_DETAILS_DB[foundKey];
    }
  }

  // 3. If still not found, generate dynamic mock details based on the name
  if (!detail && pinId) {
    detail = generateDynamicDetail(pinId, lang);
  }

  // 4. Default fallback if nothing was matched or provided
  if (!detail) {
    detail = DESTINATION_DETAILS_DB.pin5; // Đà Nẵng
  }

  const handleBack = () => {
    router.back();
  };

  const renderSection = (title: string, icon: string, items: DetailItem[]) => {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name={icon as any} size={20} color="#FF5B22" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.detailCard}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                {item.price && (
                  <View style={styles.priceTag}>
                    <Ionicons name="pricetag-outline" size={10} color="#FF5B22" />
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover Image Header */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: detail.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.45)', 'rgba(26, 17, 12, 0.98)']}
            style={styles.coverGradient}
          />
          <View style={styles.coverContent}>
            <Text style={styles.provinceText}>{detail.province.toUpperCase()}</Text>
            <Text style={styles.nameText}>{detail.name}</Text>
            <Text style={styles.descText}>{detail.description}</Text>
          </View>
        </View>

        {/* Categories Sections */}
        {isReady ? (
          <>
            {renderSection(
              lang === 'vi' ? 'Danh Lam Thắng Cảnh Nổi Bật' : 'Scenic Landmarks',
              'compass-outline',
              detail.landmarks
            )}

            {renderSection(
              lang === 'vi' ? 'Khu Vui Chơi Giải Trí Sôi Động' : 'Amusement & Entertainment',
              'game-controller-outline',
              detail.entertainment
            )}

            {renderSection(
              lang === 'vi' ? 'Góc Sống Ảo & Check-In Cực Đẹp' : 'Instagrammable & Photo Spots',
              'camera-outline',
              detail.checkinSpots
            )}

            {renderSection(
              lang === 'vi' ? 'Ẩm Thực & Món Ngon Đặc Sản' : 'Local Food Specialties',
              'restaurant-outline',
              detail.specialties
            )}

            {/* Other Services Section */}
            {detail.otherServices && detail.otherServices.length > 0 && (
              <View style={[styles.section, { paddingBottom: 40 }]}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="construct-outline" size={20} color="#FF5B22" />
                  <Text style={styles.sectionTitle}>
                    {lang === 'vi' ? 'Dịch Vụ & Tiện Nghi Địa Phương' : 'Services & Amenities'}
                  </Text>
                </View>
                <View style={styles.servicesGrid}>
                  {detail.otherServices.map((srv, index) => (
                    <View key={index} style={styles.serviceItem}>
                      <View style={styles.serviceIconContainer}>
                        <Ionicons name={srv.icon as any} size={20} color="#9C6644" />
                      </View>
                      <View style={styles.serviceTextContainer}>
                        <Text style={styles.serviceName}>{srv.name}</Text>
                        <Text style={styles.serviceDesc}>{srv.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={{ paddingVertical: 60, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#FF5B22" />
          </View>
        )}
      </ScrollView>

      {/* Floating Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A110C', // Premium dark coffee-brown background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  coverContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  provinceText: {
    color: '#FF702A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  descText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    marginTop: 12,
  },
  section: {
    marginTop: 28,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 16,
  },
  detailCard: {
    width: 260,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2A180E',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  cardDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 17, 12, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 91, 34, 0.3)',
  },
  priceText: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '800',
  },
  servicesGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A180E',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(156, 102, 68, 0.15)',
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 102, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(156, 102, 68, 0.25)',
  },
  serviceTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  serviceDesc: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26, 17, 12, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
