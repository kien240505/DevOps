import React, { useState } from 'react';
import { Ticket, Check, Copy, Sparkles, Clock } from 'lucide-react';

const VOUCHERS = [
  {
    code: 'TECH10',
    title: 'Giảm 20% Toàn Sàn',
    minSpend: 'Đơn từ $100',
    expiry: 'Còn 3 ngày',
    badge: 'HOT DEAL',
    discount: '20%'
  },
  {
    code: 'FREESHIP',
    title: 'Freeship Siêu Tốc 2H',
    minSpend: 'Đơn từ $50',
    expiry: 'Hôm nay',
    badge: 'VẬN CHUYỂN',
    discount: 'Free $15'
  },
  {
    code: 'MEGA50',
    title: 'Giảm Trực Tiếp $50',
    minSpend: 'Đơn từ $500',
    expiry: 'Còn 5 ngày',
    badge: 'SIÊU CẤP',
    discount: '-$50'
  },
  {
    code: 'VIPTECH',
    title: 'Giảm Thêm $100',
    minSpend: 'Đơn từ $1000',
    expiry: 'SL có hạn',
    badge: 'VIP TECH',
    discount: '-$100'
  }
];

export const VoucherBar = ({ onApplyVoucher }) => {
  const [savedCodes, setSavedCodes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('technova_saved_vouchers') || '[]');
    } catch {
      return [];
    }
  });

  const handleSaveCode = (code) => {
    let updated;
    if (savedCodes.includes(code)) {
      updated = savedCodes.filter(c => c !== code);
    } else {
      updated = [...savedCodes, code];
      // Copy to clipboard
      try {
        navigator.clipboard.writeText(code);
      } catch {}
    }
    setSavedCodes(updated);
    localStorage.setItem('technova_saved_vouchers', JSON.stringify(updated));
    if (onApplyVoucher) onApplyVoucher(code);
  };

  return (
    <section className="voucher-bar-section">
      <div className="voucher-bar-header">
        <div className="voucher-header-title">
          <Ticket size={18} color="#818cf8" />
          <span>MÃ GIẢM GIÁ & VOUCHER ĐỘC QUYỀN</span>
        </div>
        <span className="voucher-sub-hint">
          Lưu mã ngay để tự động áp dụng tại giỏ hàng và thanh toán
        </span>
      </div>

      <div className="voucher-grid">
        {VOUCHERS.map((v) => {
          const isSaved = savedCodes.includes(v.code);
          return (
            <div key={v.code} className={`voucher-card ${isSaved ? 'is-saved' : ''}`}>
              <div className="voucher-left">
                <span className="voucher-badge">{v.badge}</span>
                <span className="voucher-discount-val">{v.discount}</span>
              </div>

              <div className="voucher-divider" />

              <div className="voucher-right">
                <div className="voucher-info">
                  <strong className="voucher-title">{v.title}</strong>
                  <span className="voucher-min">{v.minSpend}</span>
                  <div className="voucher-expiry">
                    <Clock size={11} />
                    <span>HSD: {v.expiry}</span>
                  </div>
                </div>

                <div className="voucher-action">
                  <button
                    className={`btn-voucher-action ${isSaved ? 'saved' : ''}`}
                    onClick={() => handleSaveCode(v.code)}
                  >
                    {isSaved ? (
                      <>
                        <Check size={13} />
                        <span>Đã Lưu</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Lưu Mã</span>
                      </>
                    )}
                  </button>
                  <span className="voucher-code-label">Mã: <code>{v.code}</code></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
