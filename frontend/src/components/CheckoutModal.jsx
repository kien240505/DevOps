import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, CreditCard, Truck, Wallet, ShieldCheck, Printer, Copy, 
  Check, QrCode, ArrowRight, RefreshCw, Zap, Clock, PackageCheck, Star 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrder, processPayment } from '../services/api';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, selectedCartItems, finalTotal, clearCart, showToast } = useCart();
  const { currentUser, openAuth } = useUser();

  const checkoutItems = selectedCartItems && selectedCartItems.length > 0 ? selectedCartItems : cartItems;

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    city: 'TP. Hồ Chí Minh',
    address: '',
    shipping_method: 'express_2h', // express_2h or standard
    payment_method: 'COD'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData(prev => ({
        ...prev,
        customer_name: currentUser.fullname || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      }));
    }
  }, [currentUser, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCompletedOrder(null);
      setIsPaid(false);
      setIsPaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Đã sao chép ${field}!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      openAuth('login');
      showToast('Vui lòng đăng nhập trước khi đặt hàng!');
      return;
    }

    if (!formData.customer_name || !formData.email || !formData.phone || !formData.address) {
      showToast('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    try {
      setIsSubmitting(true);
      const fullAddress = `${formData.address}, ${formData.city}`;
      const res = await createOrder({
        ...formData,
        address: fullAddress,
        items: checkoutItems,
        total_amount: finalTotal
      });

      setCompletedOrder({
        orderId: res.orderId,
        items: checkoutItems,
        total_amount: finalTotal,
        customer: {
          ...formData,
          address: fullAddress
        }
      });

      clearCart();
      showToast('Đặt hàng thành công!');
    } catch (err) {
      showToast('Lỗi khi đặt hàng: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmQrPayment = async () => {
    if (!completedOrder?.orderId) return;
    try {
      setIsPaying(true);
      await processPayment(completedOrder.orderId, 'VietQR');
      setIsPaid(true);
      showToast('Thanh toán qua VietQR đã được xác nhận thành công!');
    } catch (err) {
      showToast('Lỗi khi xác nhận thanh toán: ' + err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const vndAmount = completedOrder ? Math.round(completedOrder.total_amount * 25400) : 0;
  const qrTransferContent = completedOrder ? `TECHNOVA DH${completedOrder.orderId}` : '';
  const vietQrUrl = completedOrder
    ? `https://img.vietqr.io/image/MB-68888824052005-compact2.png?amount=${vndAmount}&addInfo=${encodeURIComponent(qrTransferContent)}&accountName=TECHNOVA%20STORE`
    : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: completedOrder ? '720px' : '650px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Đóng">
          <X size={18} />
        </button>

        <div style={{ padding: '28px' }}>
          {completedOrder ? (
            /* --- ORDER COMPLETED & ORDER STATUS STEPPER VIEW --- */
            <div>
              {/* Stepper Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 12px' }} />
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
                  Đặt Hàng Thành Công!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Mã đơn hàng: <strong style={{ color: '#818cf8' }}>#{completedOrder.orderId}</strong>
                </p>
              </div>

              {/* ORDER STATUS STEPPER */}
              <div className="order-stepper-box">
                <div className="stepper-track">
                  {/* Step 1 */}
                  <div className="step-node completed">
                    <div className="step-circle">1</div>
                    <span className="step-title">Chờ xác nhận</span>
                    <span className="step-status-tag">Hoàn tất</span>
                  </div>
                  <div className="step-line active" />

                  {/* Step 2 */}
                  <div className={`step-node ${isPaid ? 'completed' : 'active'}`}>
                    <div className="step-circle">2</div>
                    <span className="step-title">{isPaid ? 'Đã thanh toán' : 'Đang chuẩn bị'}</span>
                    <span className="step-status-tag">{isPaid ? 'Thành công' : 'Đang xử lý'}</span>
                  </div>
                  <div className="step-line" />

                  {/* Step 3 */}
                  <div className="step-node">
                    <div className="step-circle">3</div>
                    <span className="step-title">Đang giao hàng</span>
                    <span className="step-status-tag">Dự kiến 2H</span>
                  </div>
                  <div className="step-line" />

                  {/* Step 4 */}
                  <div className="step-node">
                    <div className="step-circle">4</div>
                    <span className="step-title">Đã giao</span>
                    <span className="step-status-tag">Ký nhận</span>
                  </div>
                  <div className="step-line" />

                  {/* Step 5 */}
                  <div className="step-node">
                    <div className="step-circle">5</div>
                    <span className="step-title">Đánh giá ★</span>
                    <span className="step-status-tag">Mở khóa</span>
                  </div>
                </div>

                <p className="stepper-policy-hint">
                  * <strong>Chính sách E-Comment:</strong> Chỉ những đơn hàng đã hoàn tất ở trạng thái <strong>Đã giao</strong> mới được mở khóa viết đánh giá sao kèm ảnh để chống spam và đảm bảo tính chân thực 100%.
                </p>
              </div>

              {/* VIETQR PAYMENT SECTION (IF CHOSEN BANKING) */}
              {completedOrder.customer.payment_method === 'Banking' && !isPaid && (
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 800, marginBottom: '14px' }}>
                    <QrCode size={20} />
                    <span>Cổng Quét Mã VietQR Tự Động</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '18px', alignItems: 'center' }}>
                    <div style={{ background: '#ffffff', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <img src={vietQrUrl} alt="VietQR" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px' }} />
                      <span style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 700, marginTop: '6px', display: 'block' }}>Quét bằng App Ngân Hàng</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Số tiền: </span>
                        <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{vndAmount.toLocaleString('vi-VN')} đ</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Nội dung CK: </span>
                        <strong style={{ color: '#fb7185' }}>{qrTransferContent}</strong>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleCopy(qrTransferContent, 'Nội dung')}
                          style={{ padding: '2px 8px', fontSize: '0.72rem', marginLeft: '6px' }}
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={handleConfirmQrPayment}
                        disabled={isPaying}
                        style={{ marginTop: '8px', padding: '8px 16px', background: 'var(--gradient-emerald)', alignSelf: 'flex-start' }}
                      >
                        {isPaying ? <RefreshCw size={14} className="spin" /> : <Check size={14} />}
                        <span>{isPaying ? 'Đang kiểm tra...' : 'Tôi Đã Chuyển Khoản'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Receipt Details */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', margin: 0 }}>
                    Thông tin giao nhận
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: 600 }}>
                    {completedOrder.customer.shipping_method === 'express_2h' ? '⚡ Giao siêu tốc 2H' : '🚚 Giao tiêu chuẩn'}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>Khách hàng: <strong style={{ color: 'white' }}>{completedOrder.customer.customer_name}</strong></div>
                  <div>Điện thoại: <strong style={{ color: 'white' }}>{completedOrder.customer.phone}</strong></div>
                  <div style={{ gridColumn: 'span 2' }}>Địa chỉ: <strong style={{ color: 'white' }}>{completedOrder.customer.address}</strong></div>
                  <div>Thanh toán: <strong style={{ color: 'white' }}>{completedOrder.customer.payment_method === 'COD' ? 'Thanh toán khi nhận (COD)' : completedOrder.customer.payment_method}</strong></div>
                  <div>Trạng thái: <strong style={{ color: isPaid ? '#34d399' : '#f59e0b' }}>{isPaid ? 'Đã thanh toán (Paid)' : 'Chờ thanh toán / COD'}</strong></div>
                </div>

                <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <h5 style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>Sản phẩm đã đặt ({completedOrder.items.length}):</h5>
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>{item.name} {item.selectedVariant ? `(${item.selectedVariant})` : ''} x {item.quantity}</span>
                      <strong style={{ color: 'white' }}>${(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#818cf8', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                    <span>Tổng hóa đơn:</span>
                    <span>${completedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  <Printer size={16} />
                  <span>In Hóa Đơn</span>
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  <span>Hoàn Tất & Tiếp Tục Mua</span>
                </button>
              </div>
            </div>
          ) : (
            /* --- CHECKOUT FORM VIEW --- */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Truck size={24} color="#818cf8" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>
                  Thông Tin Giao Hàng & Thanh Toán Chuẩn TMĐT
                </h2>
              </div>

              <form onSubmit={handleSubmitOrder}>
                {/* Row 1: Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">Họ và tên người nhận *</label>
                    <input
                      type="text"
                      name="customer_name"
                      placeholder="VD: Nguyễn Văn A"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="VD: 0987 654 321"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Email & City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">Email nhận hóa đơn điện tử *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="nguyenvana@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Tỉnh / Thành phố *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Hỗ trợ Giao 2H)</option>
                      <option value="Hà Nội">Hà Nội (Hỗ trợ Giao 2H)</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                    </select>
                  </div>
                </div>

                {/* Detailed Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Địa chỉ nhận hàng chi tiết (Số nhà, Tên đường, Phường/Xã, Quận/Huyện) *</label>
                  <textarea
                    name="address"
                    rows="2"
                    placeholder="VD: Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    style={{ resize: 'none' }}
                    required
                  />
                </div>

                {/* Shipping Method Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="form-label">Phương thức vận chuyển</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div
                      onClick={() => setFormData({ ...formData, shipping_method: 'express_2h' })}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: formData.shipping_method === 'express_2h' ? '1px solid #22d3ee' : '1px solid var(--border-light)',
                        background: formData.shipping_method === 'express_2h' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22d3ee', fontWeight: 700, fontSize: '0.88rem' }}>
                        <Zap size={15} /> Giao Siêu Tốc 2H
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                        Nhận hàng trong 120 phút • Miễn phí vận chuyển
                      </span>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, shipping_method: 'standard' })}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: formData.shipping_method === 'standard' ? '1px solid #818cf8' : '1px solid var(--border-light)',
                        background: formData.shipping_method === 'standard' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 700, fontSize: '0.88rem' }}>
                        <Truck size={15} /> Giao Tiêu Chuẩn
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                        Dự kiến nhận 1-2 ngày • Miễn phí vận chuyển
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: '22px' }}>
                  <label className="form-label">Phương thức thanh toán</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'COD', label: 'COD (Khi nhận)', desc: 'Kiểm tra hàng rồi trả tiền', icon: Truck },
                      { id: 'Banking', label: 'VietQR Ngân Hàng', desc: 'Quét QR thanh toán tức thì', icon: Wallet },
                      { id: 'Card', label: 'Thẻ Quốc Tế', desc: 'Visa / MasterCard / JCB', icon: CreditCard }
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = formData.payment_method === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setFormData({ ...formData, payment_method: method.id })}
                          style={{
                            padding: '12px 8px',
                            textAlign: 'center',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                            background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer'
                          }}
                        >
                          <Icon size={20} color={isSelected ? '#818cf8' : '#9ca3af'} style={{ margin: '0 auto 6px' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? 'white' : 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                            {method.label}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: isSelected ? '#a5b4fc' : 'var(--text-dim)', display: 'block' }}>
                            {method.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total & Submit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                      Tổng thanh toán ({checkoutItems.length} mặt hàng)
                    </span>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#818cf8' }}>
                      ${finalTotal.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    <span>{isSubmitting ? 'Đang tạo đơn...' : (formData.payment_method === 'Banking' ? 'Tiếp Tục Đến VietQR' : 'Xác Nhận Đặt Hàng')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
