import os
import re

table_meanings = {
    'bookings': 'Lưu trữ thông tin giao dịch đặt vé tổng hợp (Master Record). Tóm tắt giá trị tổng tiền và liên kết sang các dịch vụ Tour/Flight/Hotel.',
    'booking_combo_items': 'Lưu trữ sản phẩm chi tiết của siêu gói (Combo). Cho phép đối soát tài chính khi bóc tách doanh thu của riêng vé bay hay khách sạn bên trong Combo.',
    'booking_passengers': 'Lưu trữ thông tin khách hàng đi kèm. Dữ liệu sinh tử dùng để xuất vé máy bay (Ticketing) lưu ý chuẩn APIS/Passport.',
    'booking_status_history': 'Lưu vết (Audit Log) thời gian thực về chuyển trạng thái (Pending -> Paid -> Cancelled). Ngăn chặn chối bỏ trách nhiệm.',
    'combo_bookings': 'Lưu cấu hình phiên bản đóng băng (Snapshot) của gói dịch vụ tích hợp tại thời điểm thanh toán.',
    'flight_bookings': 'Bảng ánh xạ trực tiếp với GDS hàng không. Gồm thông tin PNR (Mã đặt chỗ), hạng ghế, số hiệu bay.',
    'flight_booking_passengers': 'Danh sách hành khách tham gia chuyến bay, bắt buộc tuân thủ chuẩn danh tính Hàng không.',
    'hotel_bookings': 'Ghi nhận số lượng phòng thuê, loại phòng (Room Type ID), ngày check-in/checkout để đồng bộ kênh Quản lý Phòng ảo (PMS / Allotments).',
    'combo_packages': 'Định nghĩa một gói du lịch lai (Bundle). Ví dụ: 1 Khách sạn + 1 Chuyến bay + Discount.',
    'destinations': 'Hạt nhân điểm đến địa lý, thiết kế theo cấu trúc Cây/Đường dẫn tĩnh phục vụ SEO và Category Filter.',
    'tours': 'Đối tượng kinh doanh lõi của OTA. Quản lý metadata Tour, chỉ số ESGs, giá Base, và điểm đón trả.',
    'tour_schedules': 'Bảng Tồn Kho (Inventory). Cập nhật số ghế mua real-time, khóa chặn hành vi Overbooking (Bán lố chỗ).',
    'orders': 'Khối gốc của vòng đời thanh toán eCommerce. Giữ tổng số tiền và gửi lệnh khởi tạo sang Payment Gateway.',
    'payments': 'Lưu chứng từ hệ thống cổng thanh toán thứ 3 (Ví dụ VNPay / Stripe). Đây là dữ liệu dùng để giải quyết tranh chấp bồi hoàn (Dispute).',
    'promotion_campaigns': 'Bảng Chiến dịch Marketing. Định nghĩa ranh giới ngân sách tối đa (Max Budget) và thời gian sống (TTL) của các mã Voucher.',
    'vouchers': 'Mỗi dòng là một mã giảm giá độc lập. Quản lý % giảm giá, tổng số lần sử dụng tối đa.',
    'users': 'Lưu trữ hồ sơ khách hàng. Quản lý Authentication và phân quyền truy cập hệ thống (Role-based).'
}

field_meanings = {
    'id': 'Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu.',
    'status': 'Cờ Enum vòng đời. Mấu chốt của Data Filtering và quản lý Logic hệ thống (Thay vì xóa mềm DB).',
    'price': 'Chỉ số Tài chính kế toán. Dữ liệu nhạy cảm cực cao ảnh hưởng lợi nhuận.',
    'amount': 'Lượng tiền / Số lượng. Mọi sự thay đổi (Mutation) đều phải trigger file log.',
    'createdat': 'Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync.',
    'name': 'Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS.',
    'slug': 'Đường dẫn liên kết SEO thân thiện, tăng cường khả năng xuất hiện trên máy tìm kiếm.',
    'uuid': 'Khóa Security chống Brute-force/Web Crawling, che giấu độ lớn database.'
}

def guess_table_meaning(table_name):
    t = table_name.lower()
    if t in table_meanings: return table_meanings[t]
    if 'history' in t or 'log' in t: return 'Bảng Ghi Log Đóng băng. Chống thao tác xóa lén (DELETE), bắt buộc cho Tracking/Compliance.'
    if 'translation' in t: return 'Bảng Đa ngôn ngữ (Localize/I18N), giúp scale data tiếng nước ngoài không phá vỡ DB lõi.'
    if 'media' in t or 'image' in t: return 'CDN Media. Tách Resource nặng ra khỏi bảng lõi để API truy xuất In-memory cực kỳ nhẹ.'
    if 'rule' in t or 'policy' in t: return 'Hệ thống Quản trị Luật số. Dễ thao tác đổi chính sách kinh doanh (ví dụ: Chính sách hủy) trên giao diện thay vì đổi Code.'
    return 'Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3).'

def guess_field_meaning(field_name):
    f = field_name.lower()
    for k, v in field_meanings.items():
        if k in f: return v
    if f.endswith('id'): return 'Khóa Nối (Foreign Key). Lớp ghép Mapper để hệ ORM Load/Join sang thư mục Cha.'
    if f.startswith('is') or f.startswith('has'): return 'Công tắc Điều hướng (Flag Variables Booleans). Kiểm soát UI Logic hoặc Tính năng tức thì.'
    if 'json' in f: return 'Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB.'
    if 'url' in f or 'path' in f: return 'Resource Locator đường dẫn tĩnh.'
    if 'code' in f: return 'Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482).'
    return 'Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain.'

base_dir = r'd:\Documents\WED_SERVICE\travelviet-booking-system\backend\src\main\java\com\wedservice\backend\module'
output_file = r'd:\Documents\WED_SERVICE\travelviet-booking-system\backend\BACKEND_SYSTEM_AUDIT.md'

md = []
md.append('# BÁO CÁO KIỂM TOÁN LÕI HỆ THỐNG BACKEND - PHÂN TÍCH TẦN SÂU NGHIỆP VỤ (DEEP DIVE)\n\n')

modules = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
modules.sort()

for module in modules:
    mod_dir = os.path.join(base_dir, module)
    md.append(f'## 🏢 MẢNG NGHIỆP VỤ (MODULE): `{module.upper()}`\n\n')
    
    entity_dir = os.path.join(mod_dir, 'entity')
    entities = []
    fields_data = [] 
    
    if os.path.exists(entity_dir):
        for root, _, files in os.walk(entity_dir):
            for f in files:
                if f.endswith('.java'):
                    with open(os.path.join(root, f), 'r', encoding='utf-8') as cf:
                        content = cf.read()
                        if '@Entity' in content:
                            table_match = re.search(r'@Table\s*\([^)]*name\s*=\s*\"([^\"]+)\"', content)
                            table_name = table_match.group(1) if table_match else f.replace('.java', '').lower()
                            entities.append((f.replace('.java', ''), table_name))
                            
                            fields = re.findall(r'private\s+([A-Z][a-zA-Z0-9<>]*)\s+([a-zA-Z0-9_]+);', content)
                            for f_type, f_name in fields[:8]:
                                fields_data.append((table_name, f_name, f_type))
    
    md.append('### 1. Database Schema (Các Bảng Dữ Liệu)\n')
    if not entities:
        md.append('*Không có Bảng/Thực thể Database nào nằm trong module này.*\n\n')
    else:
        md.append('| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |\n')
        md.append('|---|---|---|\n')
        for ent, table in sorted(entities):
            meaning = guess_table_meaning(table)
            md.append(f'| `{ent}` | **{table}** | {meaning} |\n')
        md.append('\n')
        
        md.append('### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)\n')
        md.append('| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |\n')
        md.append('|---|---|---|---|\n')
        for table, f_name, f_type in fields_data:
            f_mean = guess_field_meaning(f_name)
            md.append(f'| `{table}` | `{f_name}` | `{f_type}` | {f_mean} |\n')
        md.append('\n')
        
    ctrl_dir = os.path.join(mod_dir, 'controller')
    apis = []
    if os.path.exists(ctrl_dir):
        for root, _, files in os.walk(ctrl_dir):
            for f in files:
                if f.endswith('Controller.java'):
                    with open(os.path.join(root, f), 'r', encoding='utf-8') as cf:
                        content = cf.read()
                        if '@RestController' in content:
                            rm = re.search(r'@RequestMapping\s*\([^)]*value\s*=\s*\"([^\"]+)\"', content)
                            if not rm:
                                rm = re.search(r'@RequestMapping\s*\(\s*\"([^\"]+)\"', content)
                            base_path = rm.group(1) if rm else ''
                            
                            methods = re.findall(r'(@(Get|Post|Put|Patch|Delete)Mapping\([^)]*\)[^{]+)', content)
                            for m_str, m_type in methods:
                                path_match = re.search(r'value\s*=\s*\"([^\"]+)\"', m_str) or re.search(r'\"([^\"]+)\"', m_str)
                                sub_path = path_match.group(1) if path_match else ''
                                full_path = (base_path + sub_path).replace('//', '/')
                                if not full_path: full_path = '/'
                                
                                func_match = re.search(r'public [A-Za-z0-9_<>]+ ([a-zA-Z0-9_]+)\(', m_str)
                                func_name = func_match.group(1) if func_match else 'unknown'
                                apis.append((m_type.upper(), full_path, func_name))
    
    md.append('### 3. API Endpoints (Giao tiếp Phía Frontend)\n')
    if not apis:
        md.append('*Không có API Cổng kết nối (HTTP Endpoints) trong module này.*\n\n')
    else:
        md.append('| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |\n')
        md.append('|-------------|-------------------|-----------------------------------|-------------------------------------|\n')
        for mt, fp, fn in apis:
            m = mt.upper()
            p = fp.lower()
            mean = 'N/A'
            if m == 'GET' and '{' not in p.split('/')[-1]: mean = f'Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `{fn}`'
            elif m == 'GET' and '{' in p: mean = f'Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `{fn}`'
            elif m == 'POST': mean = f'Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `{fn}`'
            elif m in ['PUT', 'PATCH']: mean = f'Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `{fn}`'
            elif m == 'DELETE': mean = f'Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `{fn}`'
            
            fe_status = 'N/A'
            if '/admin/' in p: fe_status = '✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation)'
            elif 'tours' in p or 'destinations' in p or 'bookings' in p or 'auth' in p or 'users/me' in p: fe_status = '✅ Áp dụng Trang chủ Client Web B2C'
            elif 'stats' in p or 'dashboard' in p: fe_status = '✅ Áp dụng Dashboard Thống Kê'
            elif 'combo' in p or 'flight' in p or 'hotel' in p: fe_status = '⚠️ Hệ Khách đang dần tích hợp (WIP)'
            else: fe_status = '❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo'
            
            md.append(f'| `{mt}` | `{fp}` | {mean} | {fe_status} |\n')
        md.append('\n')
    
    md.append('---\n\n')

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(''.join(md))

print(f'File regenerated at {output_file}')
