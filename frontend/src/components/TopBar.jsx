import React from 'react';
import { Truck, Search, Store, Bell, PhoneCall, ShieldCheck } from 'lucide-react';

export const TopBar = ({ onSearchOrder, onOpenContact }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        {/* Left items */}
        <div className="top-bar-left">
          <div className="top-bar-item highlight">
            <Truck size={14} />
            <span>Freeship Đơn Từ $50 • Giao Siêu Tốc 2H Nội Thành</span>
          </div>
          <div className="top-bar-divider" />
          <div className="top-bar-item">
            <ShieldCheck size={14} color="#34d399" />
            <span>Cam kết 100% Chính Hãng • Đổi trả 30 ngày</span>
          </div>
        </div>

        {/* Right items */}
        <div className="top-bar-right">
          <button 
            className="top-bar-link" 
            onClick={() => alert("Tra cứu đơn hàng: Vui lòng vào trang 'Tài Khoản' hoặc kiểm tra mã vận đơn gửi qua Email!")}
          >
            <Search size={13} />
            <span>Tra cứu đơn hàng</span>
          </button>
          <div className="top-bar-divider" />
          <button 
            className="top-bar-link" 
            onClick={() => alert("Cổng Kênh Người Bán TechNova Partner đang mở đăng ký đại lý chính thức!")}
          >
            <Store size={13} />
            <span>Kênh người bán</span>
          </button>
          <div className="top-bar-divider" />
          <button className="top-bar-link" onClick={onOpenContact}>
            <Bell size={13} />
            <span>Thông báo ưu đãi</span>
          </button>
          <div className="top-bar-divider" />
          <a href="tel:19008888" className="top-bar-link hotline">
            <PhoneCall size={13} />
            <span>Hotline: <strong>1900 8888</strong></span>
          </a>
        </div>
      </div>
    </div>
  );
};
