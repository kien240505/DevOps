import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { Toast } from './components/Toast';
import { fetchProducts, fetchCategories } from './services/api';
import { CartProvider } from './context/CartContext';
import { useUser } from './context/UserContext';
import { SlidersHorizontal, ShieldCheck, Truck, RefreshCw, Headset, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const MainShop = ({ search, setSearch, isContactOpen, setIsContactOpen }) => {
  const { currentUser, openAuth } = useUser();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(data => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let minPrice = '';
    let maxPrice = '';
    if (selectedPriceRange === 'under200') {
      maxPrice = '200';
    } else if (selectedPriceRange === '200-500') {
      minPrice = '200';
      maxPrice = '500';
    } else if (selectedPriceRange === '500-1000') {
      minPrice = '500';
      maxPrice = '1000';
    } else if (selectedPriceRange === 'above1000') {
      minPrice = '1000';
    }

    fetchProducts({
      category: selectedCategory,
      search: search,
      sort: sortBy,
      minPrice,
      maxPrice
    })
      .then(data => {
        setProducts(data);
        setCurrentPage(1);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, sortBy, selectedPriceRange]);

  // Pagination calculation
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      {/* Hero Banner */}
      {!search && selectedCategory === 'All' && selectedPriceRange === 'all' && (
        <HeroBanner onShopNow={() => {
          const gridEl = document.getElementById('catalog-grid');
          if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
        }} />
      )}

      {/* Category Bar & Controls */}
      <div id="catalog-grid" className="category-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            >
              {cat === 'All' ? 'Tất cả danh mục' : cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Price Range Filter Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap', marginBottom: '24px',
        padding: '10px 16px', background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={14} color="#818cf8" /> Mức giá:
          </span>
          {[
            { id: 'all', label: 'Tất cả mức giá' },
            { id: 'under200', label: 'Dưới $200' },
            { id: '200-500', label: '$200 - $500' },
            { id: '500-1000', label: '$500 - $1,000' },
            { id: 'above1000', label: 'Trên $1,000' },
          ].map(range => (
            <button
              key={range.id}
              onClick={() => { setSelectedPriceRange(range.id); setCurrentPage(1); }}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: selectedPriceRange === range.id ? '1px solid #818cf8' : '1px solid var(--border-light)',
                background: selectedPriceRange === range.id ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                color: selectedPriceRange === range.id ? '#818cf8' : 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Product Count Summary */}
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {totalItems > 0 ? (
            <>
              Hiển thị <strong style={{ color: 'white' }}>{startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</strong> trong <strong style={{ color: 'white' }}>{totalItems}</strong> sản phẩm
            </>
          ) : (
            '0 sản phẩm'
          )}
        </span>
      </div>

      {/* Product Catalog Grid */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải danh sách sản phẩm...
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'white' }}>Không tìm thấy sản phẩm nào</p>
          <p style={{ fontSize: '0.85rem' }}>Thử chọn lại mức giá hoặc danh mục khác để xem thêm sản phẩm.</p>
        </div>
      ) : (
        <div>
          <div className="product-grid">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', marginTop: '40px', flexWrap: 'wrap'
            }}>
              <button
                className="btn btn-secondary"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(p => Math.max(p - 1, 1));
                  const gridEl = document.getElementById('catalog-grid');
                  if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} />
                <span>Trang trước</span>
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    const gridEl = document.getElementById('catalog-grid');
                    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    border: currentPage === pageNum ? 'none' : '1px solid var(--border-light)',
                    background: currentPage === pageNum ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.04)',
                    color: currentPage === pageNum ? '#fff' : 'var(--text-muted)',
                    fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: currentPage === pageNum ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(p => Math.min(p + 1, totalPages));
                  const gridEl = document.getElementById('catalog-grid');
                  if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <span>Trang sau</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onProceedCheckout={() => {
          if (!currentUser) {
            openAuth('login');
            return;
          }
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

// 404 Not Found Page
const NotFoundPage = ({ navigateTo }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 20px', gap: '16px', textAlign: 'center'
  }}>
    <div style={{ fontSize: '6rem', fontWeight: 900, color: '#1f2937', lineHeight: 1 }}>404</div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Trang không tìm thấy</h2>
    <p style={{ color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.6 }}>
      Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
    </p>
    <button className="btn btn-primary" onClick={() => navigateTo('/')} style={{ marginTop: '8px' }}>
      Về Trang Chủ
    </button>
  </div>
);

export default function App() {
  const [search, setSearch] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/admin':
        return <AdminDashboard />;
      case '/profile':
        return <ProfilePage navigateTo={navigateTo} />;
      case '/':
        return (
          <MainShop
            search={search}
            setSearch={setSearch}
            isContactOpen={isContactOpen}
            setIsContactOpen={setIsContactOpen}
          />
        );
      default:
        return <NotFoundPage navigateTo={navigateTo} />;
    }
  };

  return (
    <CartProvider>
      <div className="app-container">
        <Navbar
          search={search}
          setSearch={setSearch}
          currentPath={currentPath}
          navigateTo={navigateTo}
          onOpenContact={() => setIsContactOpen(true)}
        />

        <main className="main-content">
          {renderPage()}
        </main>

        {/* Enhanced Footer */}
        <footer className="footer">
          <div style={{
            maxWidth: '1300px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border-light)',
            marginBottom: '24px', textAlign: 'left'
          }}>
            {/* Brand */}
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                Tech<span style={{ color: '#818cf8' }}>Nova</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Hệ thống công nghệ số 1 Việt Nam. Sản phẩm chính hãng, giao hàng nhanh.
              </p>
            </div>
            {/* Links */}
            <div>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '12px', fontSize: '0.9rem' }}>Cửa Hàng</div>
              {['Laptop', 'Smartphone', 'Audio', 'Monitor', 'Phụ kiện'].map(item => (
                <div key={item} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#818cf8'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</div>
              ))}
            </div>
            {/* Support */}
            <div>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '12px', fontSize: '0.9rem' }}>Hỗ Trợ</div>
              {['Chính sách bảo hành', 'Đổi trả 30 ngày', 'Vận chuyển 2H', 'Hướng dẫn mua hàng'].map(item => (
                <div key={item} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#818cf8'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</div>
              ))}
            </div>
            {/* Contact Info */}
            <div>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '12px', fontSize: '0.9rem' }}>Liên Hệ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: Headset, text: '1800 1234 (Miễn phí)' },
                  { icon: ShieldCheck, text: 'Hàng chính hãng 100%' },
                  { icon: Truck, text: 'Giao siêu tốc 2H' },
                  { icon: RefreshCw, text: 'Đổi trả 30 ngày' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Icon size={14} color="#818cf8" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p style={{ marginBottom: 0, color: 'var(--text-dim)' }}>
            © 2026 TechNova E-Commerce Store. All rights reserved.
          </p>
        </footer>

        <AuthModal navigateTo={navigateTo} />
        <Toast />
      </div>
    </CartProvider>
  );
}
