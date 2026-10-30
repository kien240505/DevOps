import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, GitCompare, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

export const ProductCard = ({ product, onSelectProduct, onCompareProduct, onBuyNow }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('technova_favorites') || '[]');
      return favs.includes(product.id);
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('technova_favorites') || '[]');
      let updated;
      if (favs.includes(product.id)) {
        updated = favs.filter(id => id !== product.id);
        setIsFavorite(false);
      } else {
        updated = [...favs, product.id];
        setIsFavorite(true);
      }
      localStorage.setItem('technova_favorites', JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const isLowStock = product.stock <= 3 && product.stock > 0;
  const isOutOfStock = product.stock === 0;
  const discount = product.discountPercent || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
  const sold = product.soldCount || (80 + ((product.id * 73) % 950));
  const reviews = product.ratingCount || Math.max(12, Math.round(sold * 0.28));
  const quickSpecs = product.quickSpecs || (product.specs ? product.specs.slice(0, 3) : []);
  const extraDiscountEst = Math.min(100, Math.round(product.price * 0.05));

  return (
    <div className="product-card">
      {/* Top Left: Mall / Official / HOT Badge */}
      <div className="card-badge-left">
        {product.brand === 'Apple' || product.brand === 'Sony' || product.brand === 'Samsung' ? (
          <span className="badge-mall-tag">Mall</span>
        ) : product.featured === 1 || product.isHot ? (
          <span className="badge badge-primary">HOT</span>
        ) : (
          <span className="badge-official-tag">Chính Hãng</span>
        )}
      </div>

      {/* Top Right: Discount Badge & Wishlist Heart */}
      <div className="card-badge-right">
        {discount > 0 && (
          <span className="card-discount-badge">
            -{discount}%
          </span>
        )}
        <button 
          className={`card-wishlist-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          title={isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} color={isFavorite ? '#f43f5e' : '#cbd5e1'} />
        </button>
      </div>

      {/* Image Preview with Bottom Delivery/Installment Tag */}
      <div className="product-img-wrapper" onClick={() => onSelectProduct(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          loading="lazy" 
          onError={handleImageError}
        />
        
        {/* Bottom Banner Over Image */}
        <div className="img-bottom-promo-strip">
          <span className="promo-pill-left">⚡ Freeship 2H</span>
          <span className="promo-pill-right">Trả góp 0%</span>
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        {/* Brand & Category */}
        <div className="card-brand-row">
          <span className="card-brand-name">{product.brand || 'TechNova'}</span>
          <span className="card-cat-name">• {product.category}</span>
        </div>

        {/* Product Title */}
        <h3 className="product-card-title" onClick={() => onSelectProduct(product)} title={product.name}>
          {product.name}
        </h3>

        {/* Quick Specs Pills */}
        {quickSpecs.length > 0 && (
          <div className="quick-specs-pills">
            {quickSpecs.slice(0, 3).map((spec, idx) => (
              <span key={idx} className="spec-pill">
                {typeof spec === 'string' ? spec.split(' - ')[0] : spec}
              </span>
            ))}
          </div>
        )}

        {/* Rating & Sold Count */}
        <div className="product-rating">
          <div className="star-score">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span className="score-val">{product.rating}</span>
            <span className="review-count">({reviews})</span>
          </div>
          <span className="sold-divider">|</span>
          <span className="sold-count-text">Đã bán {sold}</span>
        </div>

        {/* Stock status indicator */}
        {isLowStock && (
          <span className="stock-warning low">
            🔥 Chỉ còn {product.stock} sản phẩm
          </span>
        )}
        {isOutOfStock && (
          <span className="stock-warning out">
            ❌ Tạm hết hàng
          </span>
        )}

        {/* Price Row */}
        <div className="product-price-row">
          <div className="price-main-wrap">
            <span className="price-current">${product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="price-old">${product.oldPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Voucher Discount Hint */}
        <div className="voucher-hint-row">
          <span className="voucher-hint-badge">
            <Zap size={11} /> Áp mã TECH10 giảm thêm ${extraDiscountEst}
          </span>
        </div>

        {/* Action Buttons: Add Cart + Buy Now + Quick View + Compare */}
        <div className="card-action-container">
          <div className="card-action-row-main">
            <button
              className="btn btn-outline btn-add-cart-card"
              disabled={isOutOfStock}
              onClick={() => addToCart(product, 1)}
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart size={14} />
              <span>{isOutOfStock ? 'Hết hàng' : 'Thêm giỏ'}</span>
            </button>

            <button
              className="btn btn-buy-now-card"
              disabled={isOutOfStock}
              onClick={() => {
                if (onBuyNow) {
                  onBuyNow(product);
                } else {
                  addToCart(product, 1);
                }
              }}
              title="Mua ngay lập tức"
            >
              <Zap size={14} fill="#ffffff" />
              <span>Mua ngay</span>
            </button>
          </div>

          <div className="card-action-row-aux">
            <button
              className="btn-card-aux"
              title="Xem chi tiết & Đánh giá"
              onClick={() => onSelectProduct(product)}
            >
              <Eye size={14} />
              <span>Chi tiết</span>
            </button>

            {onCompareProduct && (
              <button
                className="btn-card-aux"
                title="So sánh với sản phẩm khác"
                onClick={() => onCompareProduct(product)}
              >
                <GitCompare size={14} />
                <span>So sánh</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
