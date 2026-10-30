import React, { useState, useEffect } from 'react';
import { Zap, Flame, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

export const FlashSaleSection = ({ products, onSelectProduct, onViewAllFlashSale, onBuyNow }) => {
  const { addToCart } = useCart();
  
  // Real-time countdown (e.g. 2 hours 15 mins 48 secs from current time)
  const [timeLeft, setTimeLeft] = useState(() => {
    // 2 hours 35 mins remaining in seconds
    return 2 * 3600 + 35 * 60 + 40;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  // Filter products for flash sale (or top featured items)
  const flashProducts = (products.filter(p => p.isFlashSale || p.featured === 1)).slice(0, 5);

  if (!flashProducts.length) return null;

  return (
    <section className="flash-sale-section">
      {/* Header with Title and Countdown */}
      <div className="flash-sale-header">
        <div className="flash-title-wrap">
          <div className="flash-badge-icon">
            <Zap size={22} fill="#f43f5e" color="#f43f5e" />
          </div>
          <h2 className="flash-title">FLASH SALE</h2>
          
          <div className="countdown-timer">
            <span className="time-box">{hours}</span>
            <span className="time-colon">:</span>
            <span className="time-box">{minutes}</span>
            <span className="time-colon">:</span>
            <span className="time-box">{seconds}</span>
          </div>

          <span className="flash-subtitle">Kết thúc trong</span>
        </div>

        <button className="flash-view-all" onClick={onViewAllFlashSale}>
          <span>Xem tất cả Deal Sốc</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid of Flash Sale Products */}
      <div className="flash-products-grid">
        {flashProducts.map((p) => {
          const discount = p.discountPercent || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 15);
          const percentSold = Math.min(95, Math.max(45, (p.id * 17) % 96));
          const isNearlySoldOut = percentSold >= 85;

          return (
            <div key={p.id} className="flash-card" onClick={() => onSelectProduct(p)}>
              {/* Discount Tag */}
              <div className="flash-discount-tag">
                <span className="discount-number">-{discount}%</span>
                <span className="discount-label">GIẢM</span>
              </div>

              {/* Mall badge */}
              <span className="flash-mall-badge">Mall</span>

              {/* Product Image */}
              <div className="flash-img-wrapper">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="flash-img"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>

              {/* Body */}
              <div className="flash-card-body">
                <span className="flash-category">{p.brand || p.category}</span>
                <h4 className="flash-name" title={p.name}>{p.name}</h4>

                {/* Rating & Sold count */}
                <div className="flash-rating-row">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span className="rating-val">{p.rating}</span>
                  <span className="sold-val">| Đã bán {p.soldCount || 120}</span>
                </div>

                {/* Price */}
                <div className="flash-price-box">
                  <span className="flash-price-cur">${p.price.toLocaleString()}</span>
                  {p.oldPrice && (
                    <span className="flash-price-old">${p.oldPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Selling progress bar */}
                <div className="flash-progress-container">
                  <div 
                    className={`flash-progress-bar ${isNearlySoldOut ? 'hot' : ''}`} 
                    style={{ width: `${percentSold}%` }} 
                  />
                  <div className="flash-progress-text">
                    <Flame size={12} color="#ffffff" />
                    <span>
                      {isNearlySoldOut ? `🔥 Sắp Cháy Hàng (${percentSold}%)` : `Đã bán ${percentSold}%`}
                    </span>
                  </div>
                </div>

                {/* Quick Add CTA */}
                <button
                  className="btn btn-primary flash-buy-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBuyNow) {
                      onBuyNow(p);
                    } else {
                      addToCart(p, 1);
                    }
                  }}
                >
                  <Zap size={14} fill="#ffffff" />
                  <span>Mua Ngay</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
