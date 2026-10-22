import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, CreditCard, Truck, Wallet, ShieldCheck, Printer, Copy, Check, QrCode, ArrowRight, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrder, processPayment } from '../services/api';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, finalTotal, clearCart, showToast } = useCart();
  const { currentUser, openAuth } = useUser();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
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
      const res = await createOrder({
        ...formData,
        items: cartItems,
        total_amount: finalTotal
      });

      setCompletedOrder({
        orderId: res.orderId,
        items: cartItems,
        total_amount: finalTotal,
        customer: formData
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
      showToast('Xác nhận thanh toán VietQR thành công!');
    } catch (err) {
      showToast('Lỗi xác nhận thanh toán: ' + err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const vndAmount = completedOrder ? Math.round(completedOrder.total_amount * 25400) : 0;
  const qrTransferContent = completedOrder ? `TECHNOVA DH${completedOrder.orderId}` : '';
  const vietQrUrl = completedOrder
    ? `https://img.vietqr.io/image/MB-999988889999-compact2.png?amount=${vndAmount}&addInfo=${encodeURIComponent(qrTransferContent)}&accountName=TECHNOVA%20STORE`
    : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: completedOrder?.customer.payment_method === 'Banking' ? '680px' : '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '28px' }}>
          {completedOrder ? (
            completedOrder.customer.payment_method === 'Banking' ? (
              /* --- VIETQR PAYMENT GATEWAY VIEW --- */
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: isPaid ? 'rgba(52, 211, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    border: `1px solid ${isPaid ? '#34d399' : '#818cf8'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
                  }}>
                    {isPaid ? <CheckCircle2 size={28} color="#34d399" /> : <QrCode size={28} color="#818cf8" />}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
                    {isPaid ? 'Thanh Toán Thành Công!' : 'Cổng Thanh Toán VietQR'}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Mã đơn hàng: <strong style={{ color: '#818cf8' }}>#{completedOrder.orderId}</strong>
                    {isPaid ? ' · Đơn hàng đã được ghi nhận thanh toán vào hệ thống' : ' · Mở ứng dụng ngân hàng bất kỳ để quét mã QR'}
                  </p>
                </div>

                {!isPaid ? (
                  <div>
                    {/* Live status badge */}
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 600 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                        Hệ thống đang chờ chuyển khoản...
                      </div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Hiệu lực: 15 phút</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 260px) 1fr', gap: '20px', alignItems: 'center', marginBottom: '22px' }}>
                      {/* QR Code Container */}
                      <div style={{
                        background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '14px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)', textAlign: 'center'
                      }}>
                        <img
                          src={vietQrUrl}
                          alt="VietQR TechNova"
                          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                        />
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                          Quét mã bằng App Ngân Hàng
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ngân hàng thụ hưởng</div>
                          <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>MB Bank (Quân Đội)</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chủ tài khoản</div>
                          <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>TECHNOVA STORE</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Số tài khoản</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontSize: '1rem', color: '#818cf8', fontWeight: 800, letterSpacing: '0.5px' }}>9999 8888 9999</span>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleCopy('999988889999', 'Số tài khoản')}
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            >
                              {copiedField === 'Số tài khoản' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                              <span>{copiedField === 'Số tài khoản' ? 'Đã chép' : 'Chép'}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Số tiền chuyển khoản</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '1.05rem', color: '#34d399', fontWeight: 800 }}>{vndAmount.toLocaleString('vi-VN')} đ</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '6px' }}>(${completedOrder.total_amount})</span>
                            </div>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleCopy(String(vndAmount), 'Số tiền')}
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            >
                              {copiedField === 'Số tiền' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                              <span>{copiedField === 'Số tiền' ? 'Đã chép' : 'Chép'}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nội dung chuyển khoản (Bắt buộc)</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#fb7185', fontWeight: 700 }}>{qrTransferContent}</span>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleCopy(qrTransferContent, 'Nội dung CK')}
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            >
                              {copiedField === 'Nội dung CK' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                              <span>{copiedField === 'Nội dung CK' ? 'Đã chép' : 'Chép'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                      <button className="btn btn-secondary" onClick={onClose} style={{ padding: '10px 18px' }}>
                        <span>Thanh toán sau</span>
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleConfirmQrPayment}
                        disabled={isPaying}
                        style={{ padding: '10px 24px', background: 'var(--gradient-emerald)' }}
                      >
                        {isPaying ? <RefreshCw size={16} className="spin" /> : <CheckCircle2 size={16} />}
                        <span>{isPaying ? 'Đang xác nhận...' : 'Tôi Đã Chuyển Khoản'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Payment Confirmed State */
                  <div>
                    <div style={{
                      background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)',
                      borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', marginBottom: '22px'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginBottom: '6px' }}>
                        🎉 Giao dịch thành công!
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
                        Đơn hàng <strong style={{ color: '#818cf8' }}>#{completedOrder.orderId}</strong> đã được chuyển sang trạng thái <strong>Đã thanh toán (Paid)</strong> trong cơ sở dữ liệu.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn btn-secondary" onClick={() => window.print()}>
                        <Printer size={16} />
                        <span>In Hóa Đơn</span>
                      </button>
                      <button className="btn btn-primary" onClick={onClose}>
                        <span>Hoàn Tất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* --- COD & CARD INVOICE RECEIPT VIEW --- */
              <div style={{ textAlign: 'center' }}>
                <CheckCircle2 size={54} color="#34d399" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                  Xác Nhận Đơn Hàng Thành Công!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Mã đơn hàng của bạn: <strong style={{ color: '#818cf8' }}>#{completedOrder.orderId}</strong>. Chúng tôi sẽ liên hệ giao hàng sớm nhất.
                </p>

                {/* Order Receipt Summary */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'left',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    Thông tin khách hàng
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Người nhận: <strong style={{ color: 'white' }}>{completedOrder.customer.customer_name}</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Số điện thoại: <strong style={{ color: 'white' }}>{completedOrder.customer.phone}</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Địa chỉ: <strong style={{ color: 'white' }}>{completedOrder.customer.address}</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Hình thức: <strong style={{ color: 'white' }}>{completedOrder.customer.payment_method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : completedOrder.customer.payment_method}</strong></p>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    Danh sách sản phẩm
                  </h4>
                  {completedOrder.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
                      <span>{item.name} x {item.quantity}</span>
                      <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#818cf8', borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '10px' }}>
                    <span>Tổng thanh toán:</span>
                    <span>${completedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => window.print()}>
                    <Printer size={16} />
                    <span>In Hóa Đơn</span>
                  </button>
                  <button className="btn btn-primary" onClick={onClose}>
                    <span>Hoàn Tất</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* --- CHECKOUT FORM VIEW --- */
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={24} color="#818cf8" /> Thông Tin Giao Hàng & Thanh Toán
              </h2>

              <form onSubmit={handleSubmitOrder}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Họ và tên *</label>
                    <input
                      type="text"
                      name="customer_name"
                      placeholder="Nguyễn Văn A"
                      value={formData.customer_name}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0987 654 321"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email nhận thông báo *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Địa chỉ giao hàng chi tiết *</label>
                  <textarea
                    name="address"
                    rows="2"
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP..."
                    value={formData.address}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.88rem', resize: 'none' }}
                    required
                  />
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                  Phương thức thanh toán
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { id: 'COD', label: 'Thanh toán COD', desc: 'Nhận hàng trả tiền', icon: Truck },
                    { id: 'Banking', label: 'Chuyển khoản VietQR', desc: 'Quét mã QR tức thì', icon: Wallet },
                    { id: 'Card', label: 'Thẻ Visa/Master', desc: 'Cổng thẻ quốc tế', icon: CreditCard }
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
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Tổng cần thanh toán</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8' }}>${finalTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                  >
                    <span>{isSubmitting ? 'Đang xử lý...' : (formData.payment_method === 'Banking' ? 'Tiếp Tục Đến VietQR' : 'Xác Nhận Đặt Hàng')}</span>
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
