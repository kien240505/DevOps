import React, { useEffect, useState } from 'react';
import { 
  X, Star, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, Cpu, 
  Sparkles, Zap, Gift, Play, ChevronDown, ChevronUp, Share2, Heart
} from 'lucide-react';
import { fetchProductDetail } from '../services/api';
import { useCart } from '../context/CartContext';
import { ReviewList } from './ReviewList';
import { handleImageError } from '../utils/imageFallback';

export const ProductDetailModal = ({ product, onClose, onBuyNow }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(product?.image);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, showToast } = useCart();

  useEffect(() => {
    if (!product?.id) return;
    setLoading(true);
    fetchProductDetail(product.id)
      .then(data => {
        setDetail(data);
        setActiveImage(data.image || product.image);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [product?.id]);

  if (!product) return null;

  const currentProduct = detail || product;
  const variants = currentProduct.variants && currentProduct.variants.length > 0 ? currentProduct.variants : [
    { sku: 'DFT-STD', color: 'Màu Tiêu Chuẩn', storage: 'Bản Tiêu Chuẩn', price: currentProduct.price, stock: currentProduct.stock || 10 }
  ];

  const activeVariant = variants[selectedVariantIndex] || variants[0];
  const dynamicPrice = activeVariant.price || currentProduct.price;
  const isOutOfStock = (activeVariant.stock ?? currentProduct.stock) === 0;

  // Alternate images for gallery preview
  const galleryImages = [
    currentProduct.image,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  ];

  const handleAddToCart = () => {
    const itemToAdd = {
      ...currentProduct,
      price: dynamicPrice,
      selectedVariant: `${activeVariant.color} - ${activeVariant.storage}`
    };
    return addToCart(itemToAdd, quantity);
  };

  const handleDirectBuy = () => {
    const added = handleAddToCart();
    if (!added) return;
    if (onBuyNow) {
      onBuyNow();
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-detail-custom" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} title="Đóng">
          <X size={22} />
        </button>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: '16px' }}>Đang tải thông tin chi tiết sản phẩm TechNova...</p>
          </div>
        ) : (
          <div className="product-detail-container">
            {/* ======================================================== */}
            {/* TẦNG 1: THÔNG TIN MUA HÀNG (MEDIA 45% - PURCHASE INFO 55%) */}
            {/* ======================================================== */}
            <div className="layer-purchase-grid">
              {/* CỘT TRÁI: MEDIA GALLERY */}
              <div className="detail-media-col">
                <div className="main-image-viewport">
                  <img
                    src={activeImage || currentProduct.image}
                    alt={currentProduct.name}
                    className="main-detail-img"
                    onError={handleImageError}
                  />
                  <span className="detail-mall-badge">Mall Chính Hãng</span>
                  <button 
                    className={`detail-fav-btn ${isFavorite ? 'active' : ''}`}
                    onClick={() => {
                      setIsFavorite(!isFavorite);
                      showToast(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào danh sách yêu thích!');
                    }}
                    title="Yêu thích"
                  >
                    <Heart size={18} fill={isFavorite ? '#f43f5e' : 'none'} color={isFavorite ? '#f43f5e' : '#ffffff'} />
                  </button>
                </div>

                {/* Thumbnails list */}
                <div className="gallery-thumbs-row">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumb-btn ${activeImage === img ? 'active' : ''}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt="Thumbnail" className="thumb-img" onError={handleImageError} />
                    </button>
                  ))}
                  <button 
                    className="thumb-video-btn" 
                    onClick={() => alert("Video Review 4K & Unboxing chi tiết bởi TechNova Studio!")}
                    title="Xem Video Review"
                  >
                    <Play size={16} fill="#ffffff" />
                    <span>Video</span>
                  </button>
                </div>

                {/* Value Propositions Pill Grid */}
                <div className="media-guarantee-grid">
                  <div className="media-guarantee-item">
                    <ShieldCheck size={16} color="#34d399" />
                    <span>Chính hãng 100%</span>
                  </div>
                  <div className="media-guarantee-item">
                    <Truck size={16} color="#22d3ee" />
                    <span>Giao 2H miễn phí</span>
                  </div>
                  <div className="media-guarantee-item">
                    <RefreshCw size={16} color="#818cf8" />
                    <span>Lỗi 1 đổi 1 30 ngày</span>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: QUYẾT ĐỊNH MUA HÀNG */}
              <div className="detail-info-col">
                {/* 1. Header: Brand, Title, Rating, Sold */}
                <div className="detail-header-block">
                  <div className="detail-brand-badge-row">
                    <span className="detail-brand-tag">{currentProduct.brand || 'TechNova'}</span>
                    <span className="badge-official-pill">Hàng Phân Phối Chính Thức</span>
                  </div>

                  <h1 className="detail-product-title">
                    {currentProduct.name}
                  </h1>

                  <div className="detail-stats-bar">
                    <div className="stats-stars-group">
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <strong className="score-val">{currentProduct.rating}</strong>
                    </div>
                    <span className="stats-pipe">|</span>
                    <span className="stats-reviews-count">
                      {currentProduct.ratingCount || 128} Đánh giá
                    </span>
                    <span className="stats-pipe">|</span>
                    <span className="stats-sold-count">
                      Đã bán {currentProduct.soldCount || 540}
                    </span>
                  </div>
                </div>

                {/* 2. Khung Giá & Flash Sale */}
                <div className="detail-price-box">
                  {currentProduct.isFlashSale && (
                    <div className="detail-flash-tag">
                      <Zap size={14} fill="#ffffff" />
                      <span>FLASH SALE ĐỘC QUYỀN</span>
                    </div>
                  )}

                  <div className="detail-price-main">
                    <span className="detail-current-price">
                      ${dynamicPrice.toLocaleString()}
                    </span>
                    {currentProduct.oldPrice && (
                      <span className="detail-old-price">
                        ${currentProduct.oldPrice.toLocaleString()}
                      </span>
                    )}
                    {currentProduct.discountPercent > 0 && (
                      <span className="detail-save-badge">
                        Tiết kiệm {currentProduct.discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="detail-price-policy">
                    * Giá đã bao gồm thuế VAT & Bảo hành điện tử chính hãng 12 tháng.
                  </p>
                </div>

                {/* 3. Bộ chọn Biến thể (Variants) */}
                <div className="detail-variants-section">
                  <div className="variant-header-row">
                    <span className="variant-label">Chọn Phiên Bản & Cấu Hình:</span>
                    <span className="variant-current-picked">
                      Đang chọn: <strong>{activeVariant.color} - {activeVariant.storage}</strong>
                    </span>
                  </div>

                  <div className="variant-options-grid">
                    {variants.map((v, idx) => (
                      <button
                        key={v.sku || idx}
                        className={`variant-pill-btn ${selectedVariantIndex === idx ? 'active' : ''}`}
                        onClick={() => setSelectedVariantIndex(idx)}
                      >
                        <div className="variant-pill-top">
                          <span className="variant-pill-name">{v.color}</span>
                          {selectedVariantIndex === idx && <Check size={14} color="#818cf8" />}
                        </div>
                        <div className="variant-pill-sub">
                          <span>{v.storage}</span>
                          <strong className="variant-pill-price">${v.price.toLocaleString()}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Khung Khuyến mãi & Voucher */}
                <div className="detail-promo-box">
                  <div className="promo-box-title">
                    <Gift size={16} color="#f43f5e" />
                    <strong>Khuyến Mãi & Quà Tặng Kèm:</strong>
                  </div>
                  <ul className="promo-list">
                    <li>
                      <Sparkles size={13} color="#f59e0b" />
                      <span>Áp mã <code>TECH10</code> giảm trực tiếp 20% (tối đa $100).</span>
                    </li>
                    <li>
                      <Truck size={13} color="#22d3ee" />
                      <span>Freeship 2H nội thành với mã <code>FREESHIP</code>.</span>
                    </li>
                    <li>
                      <Check size={13} color="#34d399" />
                      <span>Tặng gói bảo hành VIP 1 đổi 1 trong 30 ngày đầu.</span>
                    </li>
                  </ul>
                </div>

                {/* 5. Vận chuyển */}
                <div className="detail-shipping-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} color="#22d3ee" />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>Giao Hàng Siêu Tốc 2H:</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>
                        Cam kết giao trong 2 giờ tại TP.HCM & Hà Nội. Miễn phí ship cho đơn từ $50.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Quantity & CTA Action Buttons */}
                <div className="detail-action-cluster">
                  <div className="quantity-counter-wrap">
                    <span className="qty-label">Số lượng:</span>
                    <div className="qty-counter-box">
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="qty-val">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= (activeVariant.stock || 10)}
                      >
                        +
                      </button>
                    </div>
                    <span className="qty-stock-left">
                      (Còn {activeVariant.stock || 10} sản phẩm)
                    </span>
                  </div>

                  <div className="cta-buttons-row">
                    <button
                      className="btn btn-primary btn-add-cart-large"
                      disabled={isOutOfStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={18} />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </button>

                    <button
                      className="btn btn-buy-now-large"
                      disabled={isOutOfStock}
                      onClick={handleDirectBuy}
                    >
                      <Zap size={18} fill="#ffffff" />
                      <span>Mua Ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TẦNG 2: THÔNG SỐ KỸ THUẬT & MÔ TẢ (65% - 35%)            */}
            {/* ======================================================== */}
            <div className="layer-specs-grid">
              {/* CỘT TRÁI (65%): MÔ TẢ CHI TIẾT */}
              <div className="detail-desc-col">
                <h3 className="section-title-with-bar">
                  MÔ TẢ CHI TIẾT SẢN PHẨM
                </h3>

                <div className={`desc-rich-content ${isDescExpanded ? 'expanded' : 'collapsed'}`}>
                  <p className="desc-lead">
                    {currentProduct.description}
                  </p>

                  <h4 style={{ color: '#818cf8', margin: '16px 0 8px', fontSize: '1.05rem', fontWeight: 700 }}>
                    1. Đột phá về thiết kế và công nghệ thế hệ mới
                  </h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                    Sản phẩm được gia công từ các vật liệu cao cấp chuẩn công nghiệp vũ trụ, mang lại cảm giác cầm nắm chắc chắn, đầm tay nhưng vẫn giữ được trọng lượng siêu nhẹ. Hệ thống tản nhiệt và tối ưu vi kiến trúc giúp duy trì xung nhịp cao trong thời gian dài mà không bị bóp nghẽn hiệu năng.
                  </p>

                  <h4 style={{ color: '#818cf8', margin: '16px 0 8px', fontSize: '1.05rem', fontWeight: 700 }}>
                    2. Trải nghiệm người dùng thông minh & Tiết kiệm năng lượng
                  </h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                    Tích hợp thuật toán trí tuệ nhân tạo thế hệ mới, tối ưu hóa các tác vụ học máy, xử lý hình ảnh và quản lý điện năng tiêu thụ. Tương thích hoàn hảo với hệ sinh thái công nghệ TechNova, mang lại trải nghiệm liền mạch từ công việc chuyên nghiệp đến giải trí đỉnh cao.
                  </p>
                </div>

                <button
                  className="btn-toggle-desc"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                >
                  {isDescExpanded ? (
                    <>
                      <span>Thu Gọn Bài Viết</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>Xem Thêm Mô Tả Chi Tiết</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* CỘT PHẢI (35%): BẢNG THÔNG SỐ KỸ THUẬT */}
              <div className="detail-specs-col">
                <h3 className="section-title-with-bar">
                  <Cpu size={18} color="#818cf8" style={{ display: 'inline', marginRight: '6px' }} />
                  BẢNG THÔNG SỐ KỸ THUẬT
                </h3>

                <div className="specs-table-box">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td className="spec-label">Thương hiệu</td>
                        <td className="spec-val"><strong>{currentProduct.brand || 'TechNova'}</strong></td>
                      </tr>
                      <tr>
                        <td className="spec-label">Danh mục</td>
                        <td className="spec-val">{currentProduct.category}</td>
                      </tr>
                      {currentProduct.specs && currentProduct.specs.map((spec, i) => {
                        const parts = typeof spec === 'string' ? spec.split(':') : [spec];
                        return (
                          <tr key={i}>
                            <td className="spec-label">{parts[0]?.trim()}</td>
                            <td className="spec-val">{parts[1]?.trim() || <span style={{ color: '#34d399' }}>✓ Hỗ trợ</span>}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td className="spec-label">Bảo hành</td>
                        <td className="spec-val">12 Tháng Chính Hãng</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Xuất xứ</td>
                        <td className="spec-val">Chính hãng (Fullbox VAT)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TẦNG 3: HỆ THỐNG BÌNH LUẬN & ĐÁNH GIÁ (TRỌNG TÂM E-COMMENT)*/}
            {/* ======================================================== */}
            <ReviewList
              productId={currentProduct.id}
              initialComments={currentProduct.comments || []}
              variants={variants}
              onCommentAdded={(newComment) => {
                setDetail(prev => ({
                  ...prev,
                  comments: [newComment, ...(prev?.comments || [])]
                }));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
