import React, { useState } from 'react';
import { ShoppingBag, Search, Store, Headset, LogIn, LogOut, UserCircle2, ChevronDown, LayoutDashboard, X, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const HOT_KEYWORDS = [
  'MacBook M3',
  'iPhone 15 Pro',
  'Sony ANC',
  'Bàn phím cơ',
  'Màn hình 4K',
  'PlayStation 5'
];

export const Navbar = ({ search, setSearch, currentPath, navigateTo, onOpenContact }) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { currentUser, logout, openAuth } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const isAdminPath = currentPath === '/admin';
  const isProfilePath = currentPath === '/profile';

  return (
    <header className="sticky-header-container">
      <nav className="navbar">
        <div className="nav-inner">
          {/* Brand Logo */}
          <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
            <div className="logo-icon">
              <ShoppingBag size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Tech<span style={{ color: '#818cf8' }}>Nova</span>
                </span>
                <span className="badge-mall">MALL</span>
              </div>
              {isAdminPath ? (
                <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Admin Portal</span>
              ) : isProfilePath ? (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Khách Hàng VIP</span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '-2px' }}>
                  Sàn Công Nghệ Đỉnh Cao
                </span>
              )}
            </div>
          </a>

          {/* Search Box with Hot Keywords */}
          {!isAdminPath && !isProfilePath && (
            <div className="header-search-wrapper">
              <div className="search-box">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm Laptop M3, iPhone 15, Tai nghe Sony, Chuột MX Master..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    className="search-clear-btn" 
                    onClick={() => setSearch('')}
                    title="Xóa tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                )}
                <button 
                  className="search-submit-btn"
                  onClick={() => {
                    const el = document.getElementById('catalog-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Search size={16} />
                  <span>Tìm Kiếm</span>
                </button>
              </div>

              {/* Hot Search Suggestions */}
              <div className="hot-keywords-bar">
                <span className="hot-keywords-label">
                  <Flame size={12} color="#f43f5e" /> Gợi ý:
                </span>
                {HOT_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    className={`hot-kw-pill ${search.toLowerCase() === kw.toLowerCase() ? 'active' : ''}`}
                    onClick={() => {
                      setSearch(kw);
                      const el = document.getElementById('catalog-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav Actions */}
          <div className="nav-actions">
            {!isAdminPath ? (
              <>
                {/* Contact button */}
                {!isProfilePath && (
                  <button
                    className="btn btn-secondary nav-action-btn"
                    onClick={onOpenContact}
                    title="Hỗ trợ & Liên hệ CSKH 24/7"
                  >
                    <Headset size={16} color="#22d3ee" />
                    <span>Hỗ Trợ</span>
                  </button>
                )}

                {/* User Auth Area */}
                {currentUser ? (
                  <div style={{ position: 'relative' }}>
                    <button
                      className="btn btn-secondary nav-user-btn"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt={currentUser.fullname}
                        className="user-avatar-sm"
                      />
                      <div className="user-name-box">
                        <span className="user-name-text">
                          {currentUser.fullname}
                        </span>
                        <span className="user-role-badge">
                          {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Thành Viên'}
                        </span>
                      </div>
                      <ChevronDown size={14} />
                    </button>

                    {showDropdown && (
                      <div className="user-dropdown-menu">
                        <div className="dropdown-user-header">
                          <p className="dropdown-user-name">{currentUser.fullname}</p>
                          <p className="dropdown-user-email">{currentUser.email}</p>
                        </div>
                        {/* Profile link */}
                        <button
                          className="dropdown-item"
                          onClick={() => { navigateTo('/profile'); setShowDropdown(false); }}
                        >
                          <UserCircle2 size={16} color="#818cf8" />
                          <span>Tài Khoản & Đơn Hàng</span>
                        </button>
                        {/* Admin panel (if admin) */}
                        {currentUser.role === 'admin' && (
                          <button
                            className="dropdown-item highlight"
                            onClick={() => { navigateTo('/admin'); setShowDropdown(false); }}
                          >
                            <LayoutDashboard size={16} color="#fb7185" />
                            <span>Bảng Quản Trị (Admin)</span>
                          </button>
                        )}
                        <div className="dropdown-divider" />
                        <button
                          className="dropdown-item logout"
                          onClick={() => { logout(); setShowDropdown(false); }}
                        >
                          <LogOut size={16} />
                          <span>Đăng Xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                    onClick={() => openAuth('login')}
                  >
                    <LogIn size={16} />
                    <span>Đăng Nhập</span>
                  </button>
                )}

                {/* Cart Trigger */}
                {!isProfilePath && (
                  <button className="cart-trigger" onClick={() => setIsCartOpen(true)} title="Xem giỏ hàng của bạn">
                    <div style={{ position: 'relative' }}>
                      <ShoppingBag size={20} color="#818cf8" />
                      {totalItemsCount > 0 && (
                        <span className="cart-badge-count">{totalItemsCount}</span>
                      )}
                    </div>
                    <span className="cart-text">Giỏ hàng</span>
                  </button>
                )}
              </>
            ) : (
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                onClick={() => navigateTo('/')}
              >
                <Store size={16} />
                <span>Về Trang Cửa Hàng</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
