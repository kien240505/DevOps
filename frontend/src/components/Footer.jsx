import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Headphones, RefreshCw, PhoneCall, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="ecommerce-footer">
      <div className="footer-top-wrap">
        <div className="footer-grid">
          {/* Col 1: Brand & Intro */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="logo-icon">
                <ShoppingBag size={20} />
              </div>
              <span className="logo-text">Tech<span style={{ color: '#818cf8' }}>Nova</span></span>
              <span className="badge-mall">MALL</span>
            </div>
            <p className="footer-about">
              Hệ thống sàn thương mại điện tử công nghệ cao cấp hàng đầu Việt Nam. Cung cấp Laptop cao cấp, Smartphone Flagship, Âm thanh Hi-Res và Gaming Gear chính hãng 100%.
            </p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <PhoneCall size={14} color="#818cf8" />
                <span>Tổng đài: <strong>1900 8888</strong> (8h00 - 22h00)</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={14} color="#818cf8" />
                <span>Email: support@technova.store</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={14} color="#818cf8" />
                <span>Trụ sở: Tòa nhà TechNova Tower, Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

          {/* Col 2: Chăm sóc khách hàng */}
          <div className="footer-col">
            <h4 className="footer-heading">Hỗ Trợ Khách Hàng</h4>
            <ul className="footer-links">
              <li><a href="#catalog-grid">Trung tâm trợ giúp CSKH</a></li>
              <li><a href="#catalog-grid">Hướng dẫn đặt hàng online</a></li>
              <li><a href="#catalog-grid">Quy định bảo hành & Đổi trả 30 ngày</a></li>
              <li><a href="#catalog-grid">Chính sách vận chuyển siêu tốc 2H</a></li>
              <li><a href="#catalog-grid">Chính sách bảo mật thông tin</a></li>
            </ul>
          </div>

          {/* Col 3: Về TechNova */}
          <div className="footer-col">
            <h4 className="footer-heading">Về TechNova Store</h4>
            <ul className="footer-links">
              <li><a href="#catalog-grid">Giới thiệu hệ thống</a></li>
              <li><a href="#catalog-grid">Hệ thống chuỗi 24 cửa hàng</a></li>
              <li><a href="#catalog-grid">Tuyển dụng nhân tài</a></li>
              <li><a href="#catalog-grid">Chương trình Khách hàng thân thiết VIP</a></li>
              <li><a href="#catalog-grid">Kênh hợp tác bán hàng B2B</a></li>
            </ul>
          </div>

          {/* Col 4: Phương thức thanh toán & Vận chuyển */}
          <div className="footer-col">
            <h4 className="footer-heading">Phương Thức Thanh Toán</h4>
            <div className="payment-badges-grid">
              <span className="pay-badge">VietQR</span>
              <span className="pay-badge">Visa</span>
              <span className="pay-badge">MasterCard</span>
              <span className="pay-badge">JCB</span>
              <span className="pay-badge">MoMo</span>
              <span className="pay-badge">COD</span>
            </div>

            <h4 className="footer-heading" style={{ marginTop: '18px' }}>Đối Tác Vận Chuyển</h4>
            <div className="shipping-badges-grid">
              <span className="ship-badge">⚡ Giao Siêu Tốc 2H</span>
              <span className="ship-badge">GrabExpress</span>
              <span className="ship-badge">GHN Express</span>
            </div>

            <div className="trust-cert-badge">
              <ShieldCheck size={16} color="#34d399" />
              <span>Chứng nhận Website TMĐT an toàn SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p>© 2026 TechNova E-Commerce Store & E-Comment Platform. Môn học DevOps - All rights reserved.</p>
          <div className="footer-bottom-terms">
            <span>Điều khoản sử dụng</span>
            <span>•</span>
            <span>Chính sách quyền riêng tư</span>
            <span>•</span>
            <span>Sơ đồ trang</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
