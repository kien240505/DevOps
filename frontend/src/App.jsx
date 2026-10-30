import React, { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { VoucherBar } from './components/VoucherBar';
import { FlashSaleSection } from './components/FlashSaleSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { fetchProducts, fetchCategories, fetchBrands } from './services/api';
import { CartProvider, useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { 
  Filter, SlidersHorizontal, Star, DollarSign, RotateCcw, 
  ChevronLeft, ChevronRight, Check, Zap, Layers, Sparkles 
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const SORT_OPTIONS = [
  { id: 'popular', label: 'Phổ Biến' },
  { id: 'newest', label: 'Mới Nhất' },
  { id: 'bestseller', label: 'Bán Chạy' },
  { id: 'price-asc', label: 'Giá Thấp - Cao' },
  { id: 'price-desc', label: 'Giá Cao - Thấp' },
  { id: 'rating', label: 'Đánh Giá Cao' }
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under200', label: 'Dưới $200' },
  { id: '200-500', label: '$200 - $500' },
  { id: '500-1000', label: '$500 - $1,000' },
  { id: 'above1000', label: 'Trên $1,000' }
];

const MainShop = ({ search, setSearch, isContactOpen, setIsContactOpen }) => {
  const { currentUser, openAuth } = useUser();
  const { addToCart, showToast } = useCart();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [brands, setBrands] = useState(['All']);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comparingProduct, setComparingProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Categories & Brands
  useEffect(() => {
    fetchCategories().then(data => setCategories(data)).catch(() => {});
    fetchBrands().then(data => setBrands(data)).catch(() => {});
  }, []);

  // Fetch Products with all active filters
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
      brand: selectedBrand,
      search: search,
      sort: sortBy,
      minPrice,
      maxPrice,
      minRating: minRating > 0 ? minRating : undefined
    })
      .then(data => {
        setProducts(data);
        setCurrentPage(1);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedBrand, search, sortBy, selectedPriceRange, minRating]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedPriceRange('all');
    setMinRating(0);
    setSearch('');
    setSortBy('popular');
    setCurrentPage(1);
    showToast('Đã đặt lại toàn bộ bộ lọc!');
  };

  const handleBuyNow = (product) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để mua sản phẩm này!');
      openAuth('login');
      return;
    }
    const added = addToCart(product, 1);
    if (added) {
      setIsCheckoutOpen(true);
    }
  };

  // Pagination calculation
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="main-shop-view">
      {/* 1. HERO 3 PHẦN */}
      {!search && selectedCategory === 'All' && selectedPriceRange === 'all' && selectedBrand === 'All' && (
        <HeroBanner
          onShopNow={() => {
            const gridEl = document.getElementById('catalog-grid');
            if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const gridEl = document.getElementById('catalog-grid');
            if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
          }}
          selectedCategory={selectedCategory}
        />
      )}

      {/* 2. THANH MÃ GIẢM GIÁ (VOUCHER BAR) */}
      <VoucherBar onApplyVoucher={(code) => {
        showToast(`Đã lưu mã voucher ${code}!`);
      }} />

      {/* 3. KHU VỰC FLASH SALE ĐẾM NGƯỢC THỜI GIAN THỰC */}
      <FlashSaleSection
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onBuyNow={handleBuyNow}
        onViewAllFlashSale={() => {
          setSelectedCategory('All');
          setSortBy('popular');
          const gridEl = document.getElementById('catalog-grid');
          if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. KHU VỰC SẢN PHẨM CHÍNH (SIDEBAR BỘ LỌC + GRID 4 CỘT) */}
      <div id="catalog-grid" className="catalog-main-layout">
        {/* SIDEBAR BỘ LỌC NÂNG CAO */}
        <aside className="advanced-filter-sidebar">
          <div className="filter-sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="#818cf8" />
              <h3 className="filter-sidebar-title">BỘ LỌC NÂNG CAO</h3>
            </div>
            {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPriceRange !== 'all' || minRating > 0 || search) && (
              <button className="btn-reset-filter" onClick={handleResetFilters} title="Xóa tất cả bộ lọc">
                <RotateCcw size={13} />
                <span>Đặt lại</span>
              </button>
            )}
          </div>

          {/* Filter Group: Danh mục */}
          <div className="filter-group">
            <h4 className="filter-group-title">
              <Layers size={14} color="#818cf8" /> Danh Mục Sản Phẩm
            </h4>
            <div className="filter-options-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn-item ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                >
                  <span>{cat === 'All' ? 'Tất cả danh mục' : cat}</span>
                  {selectedCategory === cat && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group: Khoảng Giá */}
          <div className="filter-group">
            <h4 className="filter-group-title">
              <DollarSign size={14} color="#818cf8" /> Khoảng Giá (USD)
            </h4>
            <div className="filter-options-list">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  className={`filter-btn-item ${selectedPriceRange === range.id ? 'active' : ''}`}
                  onClick={() => { setSelectedPriceRange(range.id); setCurrentPage(1); }}
                >
                  <span>{range.label}</span>
                  {selectedPriceRange === range.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group: Thương hiệu */}
          <div className="filter-group">
            <h4 className="filter-group-title">
              <Sparkles size={14} color="#818cf8" /> Thương Hiệu Nổi Bật
            </h4>
            <div className="filter-brands-tags">
              {brands.map((b) => (
                <button
                  key={b}
                  className={`brand-tag-btn ${selectedBrand === b ? 'active' : ''}`}
                  onClick={() => { setSelectedBrand(b); setCurrentPage(1); }}
                >
                  {b === 'All' ? 'Tất cả' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group: Đánh giá sao */}
          <div className="filter-group">
            <h4 className="filter-group-title">
              <Star size={14} color="#f59e0b" /> Đánh Giá Khách Hàng
            </h4>
            <div className="filter-options-list">
              {[
                { val: 0, label: 'Tất cả số sao' },
                { val: 5, label: '5 Sao (Cực kỳ hài lòng)' },
                { val: 4, label: 'Từ 4 Sao trở lên' }
              ].map(opt => (
                <button
                  key={opt.val}
                  className={`filter-btn-item ${minRating === opt.val ? 'active' : ''}`}
                  onClick={() => { setMinRating(opt.val); setCurrentPage(1); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {opt.val > 0 && <Star size={13} fill="#f59e0b" color="#f59e0b" />}
                    <span>{opt.label}</span>
                  </div>
                  {minRating === opt.val && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CATALOG & SORTING */}
        <section className="catalog-content-area">
          {/* SORTING TAB BAR */}
          <div className="catalog-toolbar-card">
            <div className="sort-tabs-container">
              <span className="sort-tabs-label">
                <SlidersHorizontal size={15} /> Sắp xếp theo:
              </span>
              <div className="sort-tabs-pills">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={`sort-tab-btn ${sortBy === opt.id ? 'active' : ''}`}
                    onClick={() => setSortBy(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Results Count */}
            <div className="catalog-results-count">
              Tìm thấy <strong style={{ color: 'white' }}>{totalItems}</strong> sản phẩm công nghệ
            </div>
          </div>

          {/* Active Search & Filter Chips Bar */}
          {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPriceRange !== 'all' || minRating > 0 || search) && (
            <div className="active-filters-chips-bar">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Đang lọc:</span>
              {selectedCategory !== 'All' && (
                <span className="active-chip">
                  Danh mục: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>×</button>
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="active-chip">
                  Hãng: {selectedBrand}
                  <button onClick={() => setSelectedBrand('All')}>×</button>
                </span>
              )}
              {selectedPriceRange !== 'all' && (
                <span className="active-chip">
                  Giá: {PRICE_RANGES.find(r => r.id === selectedPriceRange)?.label}
                  <button onClick={() => setSelectedPriceRange('all')}>×</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="active-chip">
                  {minRating}★ trở lên
                  <button onClick={() => setMinRating(0)}>×</button>
                </span>
              )}
              {search && (
                <span className="active-chip highlight">
                  Từ khóa: "{search}"
                  <button onClick={() => setSearch('')}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid 4 Columns */}
          {loading ? (
            <div className="catalog-loading-state">
              <div className="loading-spinner" />
              <p>Đang tải danh sách thiết bị công nghệ TechNova...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="catalog-empty-state">
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Hãy thử điều chỉnh lại bộ lọc giá, thương hiệu hoặc từ khóa tìm kiếm.
              </p>
              <button className="btn btn-secondary" onClick={handleResetFilters}>
                Đặt lại toàn bộ bộ lọc
              </button>
            </div>
          ) : (
            <div>
              <div className="product-grid-4-col">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onCompareProduct={(p) => setComparingProduct(p)}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <button
                    className="btn btn-secondary pagination-nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(p => Math.max(p - 1, 1));
                      const gridEl = document.getElementById('catalog-grid');
                      if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Trước</span>
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          const gridEl = document.getElementById('catalog-grid');
                          if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary pagination-nav-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(p => Math.min(p + 1, totalPages));
                      const gridEl = document.getElementById('catalog-grid');
                      if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>Sau</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* MODALS & DRAWERS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={() => {
          if (!currentUser) {
            openAuth('login');
            return;
          }
          setIsCheckoutOpen(true);
        }}
      />

      <CompareModal
        baseProduct={comparingProduct}
        allProducts={products}
        onClose={() => setComparingProduct(null)}
        onSelectProduct={(p) => {
          setComparingProduct(null);
          setSelectedProduct(p);
        }}
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

// 404 Page
const NotFoundPage = ({ navigateTo }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '100px 20px', gap: '16px', textAlign: 'center'
  }}>
    <div style={{ fontSize: '6rem', fontWeight: 900, color: '#1f2937', lineHeight: 1 }}>404</div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Trang không tìm thấy</h2>
    <p style={{ color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.6 }}>
      Đường dẫn bạn yêu cầu không tồn tại trên sàn TechNova.
    </p>
    <button className="btn btn-primary" onClick={() => navigateTo('/')} style={{ marginTop: '8px' }}>
      Về Trang Chủ Sàn TMĐT
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

  const isAdminRoute = currentPath === '/admin';

  const renderPage = () => {
    switch (currentPath) {
      case '/admin':
        return <AdminDashboard navigateTo={navigateTo} />;
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
      <div className={`app-container ${isAdminRoute ? 'admin-mode' : ''}`}>
        {/* TOP BAR: Chỉ hiện ngoài trang khách hàng */}
        {!isAdminRoute && <TopBar onOpenContact={() => setIsContactOpen(true)} />}

        {/* STICKY HEADER NAVBAR: Chỉ hiện ngoài trang khách hàng */}
        {!isAdminRoute && (
          <Navbar
            search={search}
            setSearch={setSearch}
            currentPath={currentPath}
            navigateTo={navigateTo}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {/* MAIN ROUTE CONTENT */}
        <main className={`main-content ${isAdminRoute ? 'main-content-admin' : ''}`}>
          {renderPage()}
        </main>

        {/* FULL FOOTER: Chỉ hiện ngoài trang khách hàng */}
        {!isAdminRoute && <Footer />}

        {/* AUTH MODAL & TOAST */}
        <AuthModal navigateTo={navigateTo} />
        <Toast />
      </div>
    </CartProvider>
  );
}
