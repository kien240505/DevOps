import React, { useState, useEffect } from 'react';
import { 
  Laptop, Smartphone, Headphones, Monitor, Gamepad2, Tablet, Watch, 
  Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { name: 'Laptop', icon: Laptop, badge: 'Hot' },
  { name: 'Smartphone', icon: Smartphone, badge: 'Mới' },
  { name: 'Audio', icon: Headphones, badge: null },
  { name: 'Monitor', icon: Monitor, badge: 'Giảm $100' },
  { name: 'Gaming Gear', icon: Gamepad2, badge: 'Pro' },
  { name: 'Tablet', icon: Tablet, badge: null },
  { name: 'Smartwatch', icon: Watch, badge: null },
  { name: 'Accessory', icon: Zap, badge: '-20%' }
];

const MAIN_SLIDES = [
  {
    badge: 'MALL CHÍNH HÃNG 100%',
    title: 'MacBook Pro 16 M3 Max',
    subtitle: 'Sức mạnh đồ họa đỉnh cao với chip M3 Max 16-Core CPU, 40-Core GPU và màn hình Liquid Retina XDR 120Hz.',
    priceTag: 'Chỉ từ $2,499 (Tiết kiệm $200)',
    voucherCode: 'TECH10',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    categoryTarget: 'Laptop'
  },
  {
    badge: 'FLAGSHIP CÔNG NGHỆ MỚI',
    title: 'iPhone 15 Pro Max Titanium',
    subtitle: 'Khung vỏ Titanium siêu bền nhẹ chuẩn hàng không vũ trụ, chip A17 Pro 3nm và camera quang học 5x cực đỉnh.',
    priceTag: 'Ưu đãi sốc: $1,199',
    voucherCode: 'FREESHIP',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    categoryTarget: 'Smartphone'
  },
  {
    badge: 'ÂM THANH HI-RES CHỐNG ỒN',
    title: 'Sony WH-1000XM5 ANC',
    subtitle: 'Khử tiếng ồn chủ động số 1 thế giới với bộ xử lý QN1 kép, thời lượng pin 30 giờ và đệm tai siêu êm ái.',
    priceTag: 'Flash Sale: $349 (Giá cũ: $399)',
    voucherCode: 'MEGA50',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    categoryTarget: 'Audio'
  }
];

export const HeroBanner = ({ onShopNow, onSelectCategory, selectedCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate banner every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MAIN_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = MAIN_SLIDES[currentSlide];

  return (
    <div className="hero-section">
      <div className="hero-grid-container">
        {/* PART 1: CATEGORY SIDEBAR MENU */}
        <aside className="hero-cat-sidebar">
          <div className="cat-sidebar-header">
            <span className="cat-sidebar-title">DANH MỤC NỔI BẬT</span>
          </div>
          <div className="cat-sidebar-list">
            {CATEGORY_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedCategory === item.name;
              return (
                <button
                  key={item.name}
                  className={`cat-sidebar-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectCategory(item.name)}
                >
                  <div className="cat-sidebar-item-left">
                    <IconComp size={17} className="cat-sidebar-icon" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`cat-pill-tag ${item.badge.includes('%') || item.badge.includes('$') ? 'tag-sale' : 'tag-hot'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* PART 2: MAIN SLIDER BANNER */}
        <div className="hero-main-slider">
          <div className="slider-content-wrap">
            {/* Text details */}
            <div className="slider-text-col">
              <span className="slider-badge">
                <Sparkles size={13} /> {slide.badge}
              </span>
              <h1 className="slider-heading">
                {slide.title}
              </h1>
              <p className="slider-subtext">
                {slide.subtitle}
              </p>

              <div className="slider-price-box">
                <span className="slider-price-val">{slide.priceTag}</span>
                <span className="slider-voucher-pill">
                  Nhập mã <strong>{slide.voucherCode}</strong>
                </span>
              </div>

              <div className="slider-cta-row">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    onSelectCategory(slide.categoryTarget);
                    onShopNow();
                  }}
                >
                  <span>Khám Phá Ngay</span>
                  <ArrowRight size={18} />
                </button>
                <div className="slider-free-tag">
                  <Truck size={15} color="#22d3ee" />
                  <span>Giao siêu tốc 2H</span>
                </div>
              </div>
            </div>

            {/* Product image right side */}
            <div className="slider-img-col">
              <div className="slider-img-frame">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="slider-product-img"
                />
                <div className="slider-img-glow" />
              </div>
            </div>
          </div>

          {/* Slider controls */}
          <button 
            className="slider-arrow prev" 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + MAIN_SLIDES.length) % MAIN_SLIDES.length)}
            title="Banner trước"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="slider-arrow next" 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % MAIN_SLIDES.length)}
            title="Banner kế tiếp"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="slider-dots">
            {MAIN_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`slider-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                title={`Chuyển tới slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* PART 3: 2 SUB BANNERS ON THE RIGHT */}
        <div className="hero-sub-banners">
          {/* Sub Banner 1 */}
          <div 
            className="sub-banner-card banner-deal" 
            onClick={() => {
              onSelectCategory('Gaming Gear');
              onShopNow();
            }}
          >
            <div className="sub-banner-content">
              <span className="sub-banner-tag">DEAL CHỚP NHOÁNG</span>
              <h3 className="sub-banner-title">Gaming Gear Đỉnh Cao</h3>
              <p className="sub-banner-desc">Chuột, Phím cơ & Tai nghe giảm sâu tới 40%</p>
              <span className="sub-banner-link">Săn Deal Ngay &rarr;</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80" 
              alt="Gaming Gear" 
              className="sub-banner-img"
            />
          </div>

          {/* Sub Banner 2 */}
          <div 
            className="sub-banner-card banner-display"
            onClick={() => {
              onSelectCategory('Monitor');
              onShopNow();
            }}
          >
            <div className="sub-banner-content">
              <span className="sub-banner-tag tag-cyan">TRẢ GÓP 0%</span>
              <h3 className="sub-banner-title">Màn Hình 4K IPS Black</h3>
              <p className="sub-banner-desc">Chuẩn màu đồ họa 98% DCI-P3, Type-C 90W</p>
              <span className="sub-banner-link">Xem Chi Tiết &rarr;</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80" 
              alt="Màn hình đồ họa" 
              className="sub-banner-img"
            />
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Bar */}
      <div className="hero-guarantee-bar">
        <div className="guarantee-item">
          <ShieldCheck size={20} color="#34d399" />
          <div>
            <strong>100% Chính Hãng</strong>
            <span>Bảo hành chính hãng 12-24 tháng</span>
          </div>
        </div>
        <div className="guarantee-item">
          <Truck size={20} color="#22d3ee" />
          <div>
            <strong>Giao Siêu Tốc 2H</strong>
            <span>Nhận hàng hỏa tốc trong nội thành</span>
          </div>
        </div>
        <div className="guarantee-item">
          <RefreshCw size={20} color="#818cf8" />
          <div>
            <strong>Đổi Trả Trong 30 Ngày</strong>
            <span>1 đổi 1 nếu lỗi từ nhà sản xuất</span>
          </div>
        </div>
        <div className="guarantee-item">
          <Sparkles size={20} color="#f59e0b" />
          <div>
            <strong>Trả Góp 0% Lãi Suất</strong>
            <span>Thủ tục duyệt online trong 5 phút</span>
          </div>
        </div>
      </div>
    </div>
  );
};
