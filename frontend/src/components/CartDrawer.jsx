import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, CheckSquare, Square, Ticket, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

export const CartDrawer = ({ onProceedCheckout }) => {
  const {
    cartItems,
    selectedCartItems,
    selectedItemIds,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    toggleSelectItem,
    toggleSelectAll,
    selectedCount,
    subtotal,
    discountCode,
    discountAmount,
    finalTotal,
    applyPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode.trim());
      setInputCode('');
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="drawer-content">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#818cf8" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>
              Giỏ Hàng Công Nghệ ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h3>
          </div>
          <button className="modal-close-btn" style={{ position: 'relative', top: 0, right: 0 }} onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Select All Bar */}
        {cartItems.length > 0 && (
          <div className="cart-select-all-bar">
            <button className="btn-toggle-select-all" onClick={toggleSelectAll}>
              {isAllSelected ? (
                <CheckSquare size={18} color="#818cf8" />
              ) : (
                <Square size={18} color="#94a3b8" />
              )}
              <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
            </button>
            <span className="selected-summary-pill">
              Đã chọn: <strong>{selectedCount}</strong>
            </span>
          </div>
        )}

        {/* Drawer Items List */}
        <div className="cart-items-scroll">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={52} color="#4b5563" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Giỏ hàng đang trống</p>
              <p style={{ fontSize: '0.88rem' }}>Hãy thêm các siêu phẩm công nghệ TechNova vào giỏ để nhận ưu đãi!</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const identifier = item.cartItemId || item.id;
              const isSelected = selectedItemIds.includes(identifier);
              return (
                <div key={identifier} className={`cart-item-card ${isSelected ? 'is-selected' : ''}`}>
                  {/* Selection Checkbox */}
                  <button
                    className="item-checkbox-btn"
                    onClick={() => toggleSelectItem(identifier)}
                    title={isSelected ? 'Bỏ chọn' : 'Chọn sản phẩm'}
                  >
                    {isSelected ? (
                      <CheckSquare size={18} color="#818cf8" />
                    ) : (
                      <Square size={18} color="#64748b" />
                    )}
                  </button>

                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImageError}
                    className="cart-item-thumb"
                  />

                  {/* Info */}
                  <div className="cart-item-details">
                    <div className="cart-item-title-row">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(identifier)}
                        className="cart-item-delete-btn"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Variant tag if present */}
                    {item.selectedVariant && (
                      <span className="cart-item-variant-tag">
                        Phân loại: {item.selectedVariant}
                      </span>
                    )}

                    <div className="cart-item-price-row">
                      <span className="cart-item-price">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="cart-qty-counter">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(identifier, -1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cart-qty-num">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(identifier, 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input & Quick Pills */}
            <form onSubmit={handleApplyVoucher} className="voucher-input-group">
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={15} color="#818cf8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Nhập mã voucher (VD: TECH10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="voucher-input-field"
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-apply-voucher">
                Áp Dụng
              </button>
            </form>

            {/* Quick voucher chips */}
            <div className="quick-voucher-chips">
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Gợi ý:</span>
              <button 
                type="button" 
                className="voucher-chip-btn"
                onClick={() => applyPromoCode('TECH10')}
              >
                TECH10 (-20%)
              </button>
              <button 
                type="button" 
                className="voucher-chip-btn"
                onClick={() => applyPromoCode('FREESHIP')}
              >
                FREESHIP ($15)
              </button>
              <button 
                type="button" 
                className="voucher-chip-btn"
                onClick={() => applyPromoCode('MEGA50')}
              >
                MEGA50 (-$50)
              </button>
            </div>

            {/* Price Calculations */}
            <div className="cart-calc-box">
              <div className="calc-row">
                <span>Tạm tính ({selectedCount} sản phẩm đã chọn)</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="calc-row discount">
                  <span>Mã giảm giá ({discountCode})</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="calc-row">
                <span>Phí vận chuyển (Giao siêu tốc 2H)</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Miễn phí</span>
              </div>
              <div className="calc-row total">
                <span>Tổng Thanh Toán</span>
                <span className="total-val">${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="btn btn-primary btn-checkout-large"
              disabled={selectedCount === 0}
              onClick={() => {
                setIsCartOpen(false);
                onProceedCheckout();
              }}
            >
              <span>Tiến Hành Đặt Hàng ({selectedCount})</span>
              <ArrowRight size={18} />
            </button>
            {selectedCount === 0 && (
              <p className="no-selection-warning">
                * Vui lòng tích chọn ít nhất 1 sản phẩm để thanh toán
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
