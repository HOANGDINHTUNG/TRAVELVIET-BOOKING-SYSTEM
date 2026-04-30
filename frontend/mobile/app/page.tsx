import React from 'react';

export default function HomeWeb() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. Header Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-700">
            Travel<span className="text-rose-500">Viet</span>
          </div>
          <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
            <a href="#" className="hover:text-blue-600">Khuyến mãi</a>
            <a href="#" className="hover:text-blue-600">Khám phá</a>
            <a href="#" className="hover:text-blue-600">Video</a>
          </nav>
          <div className="flex gap-4">
            <button className="px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50 rounded-full">Đăng nhập</button>
            <button className="px-5 py-2 font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-full">Đăng ký</button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section & Search Bar */}
      <section className="relative h-[500px] flex items-center justify-center">
        {/* Ảnh nền */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div> {/* Lớp phủ tối */}
        </div>

        <div className="relative z-10 text-center w-full max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Khám phá dải đất hình chữ S
          </h1>
          
          {/* Thanh tìm kiếm ngang */}
          <div className="bg-white p-2 md:p-4 rounded-full shadow-xl flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Bạn muốn đi đâu?" 
              className="flex-1 px-6 py-3 rounded-full bg-gray-100 outline-none focus:bg-white focus:ring-2 ring-blue-500 transition-all"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
              Tìm Tour Ngay
            </button>
          </div>
        </div>
      </section>

      {/* 3. Danh sách Tour nổi bật */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Tour Giá Tốt Đang Chờ Bạn</h2>
        
        {/* Grid 3 cột cho Web */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2111&auto=format&fit=crop" 
                  alt="Tour Image" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Tiết kiệm
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 mb-2">📍 Khởi hành: TP. Hồ Chí Minh</p>
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">Hà Giang - Lũng Cú - Cao Nguyên Đá Đồng Văn</h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-rose-500 font-black text-xl">3,990,000 đ</p>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">Xem chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}