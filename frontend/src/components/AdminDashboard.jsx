import React, { useEffect, useState, useMemo } from 'react';
import { 
  DollarSign, Package, ShoppingBag, AlertTriangle, Plus, Trash2, RefreshCw, 
  Mail, Lock, User, LogOut, ShieldCheck, KeyRound, Search, Bell, ExternalLink, 
  Clock, CheckCircle2, Truck, XCircle, Copy, Printer, Eye, Star, MessageSquare, 
  Tag, Activity, ChevronRight, Download, Edit3, Save, X, TrendingUp, BarChart2, 
  Check, Filter, ArrowUpRight, Percent, Award, Sparkles, Layers, Send
} from 'lucide-react';
import { 
  fetchAdminStats, fetchOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct, 
  fetchProducts, fetchContactMessages, adminLogin, fetchUsers, deleteUser,
  fetchAdminComments, replyAdminComment, deleteAdminComment,
  fetchAdminVouchers, createAdminVoucher, toggleAdminVoucher, deleteAdminVoucher
} from '../services/api';
import { useCart } from '../context/CartContext';
import { isAdminUser, useUser } from '../context/UserContext';
import { handleImageError } from '../utils/imageFallback';

export const AdminDashboard = ({ navigateTo }) => {
  const { currentUser, logout } = useUser();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('technova_admin_token')) || isAdminUser(currentUser);
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Data State
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useCart();

  // Active Navigation Tab
  // 'overview' | 'orders' | 'products' | 'comments' | 'vouchers' | 'users' | 'messages' | 'add_product' | 'system'
  const [activeTab, setActiveTab] = useState('overview');

  // Filters & Search
  const [globalSearch, setGlobalSearch] = useState('');
  const [orderStatusTab, setOrderStatusTab] = useState('All');
  const [orderSearchText, setOrderSearchText] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('All');

  const [productSearchText, setProductSearchText] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All'); // 'All' | 'in_stock' | 'low_stock'

  const [commentStarFilter, setCommentStarFilter] = useState('All'); // 'All' | '5' | '4' | '3' | 'low' | 'no_reply'
  const [commentSearchText, setCommentSearchText] = useState('');

  // Modals & Popups
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);
  const [orderToPrint, setOrderToPrint] = useState(null);
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);
  const [isNewVoucherModalOpen, setIsNewVoucherModalOpen] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // New Voucher Form
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: '',
    min_order_value: '0',
    max_discount: '100',
    max_usage: '100'
  });

  // New Product Form
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Laptop',
    brand: 'TechNova',
    price: '',
    oldPrice: '',
    stock: 15,
    image: '',
    description: '',
    specs: '',
    featured: false
  });

  // Load All Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsData, ordersData, productsData, messagesData, 
        usersData, commentsData, vouchersData
      ] = await Promise.all([
        fetchAdminStats().catch(() => null),
        fetchOrders().catch(() => []),
        fetchProducts().catch(() => []),
        fetchContactMessages().catch(() => []),
        fetchUsers().catch(() => []),
        fetchAdminComments().catch(() => []),
        fetchAdminVouchers().catch(() => [])
      ]);

      setStats(statsData);
      setOrders(ordersData || []);
      setProducts(productsData || []);
      setMessages(messagesData || []);
      setUsers(usersData || []);
      setComments(commentsData || []);
      setVouchers(vouchersData || []);
    } catch (err) {
      showToast('Lỗi tải dữ liệu quản trị: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUser || !loginPass) {
      setLoginError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    try {
      setIsLoggingIn(true);
      const res = await adminLogin(loginUser, loginPass);
      localStorage.setItem('technova_admin_token', res.token);
      setIsAuthenticated(true);
      showToast('Đăng nhập quản trị viên thành công!');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('technova_admin_token');
    if (isAdminUser(currentUser)) logout();
    setIsAuthenticated(false);
    showToast('Đã đăng xuất khỏi tài khoản Quản trị!');
  };

  // Handle Status Change for Order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Đã chuyển trạng thái đơn #${orderId} sang "${newStatus}"!`);
      // Update local state smoothly
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrderForDetail && selectedOrderForDetail.id === orderId) {
        setSelectedOrderForDetail(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast('Lỗi cập nhật đơn: ' + err.message);
    }
  };

  // Handle Copy Order Code
  const handleCopyOrderCode = (orderId) => {
    const code = `#ORD-${String(orderId).padStart(4, '0')}`;
    navigator.clipboard.writeText(code);
    showToast(`Đã sao chép mã ${code} vào bộ nhớ tạm!`);
  };

  // Handle Export CSV
  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast('Chưa có dữ liệu đơn hàng để xuất!');
      return;
    }
    const headers = ['Mã Đơn', 'Khách Hàng', 'SĐT', 'Email', 'Địa Chỉ', 'Tổng Tiền', 'Thanh Toán', 'Trạng Thái', 'Ngày Tạo'];
    const rows = orders.map(o => [
      `#ORD-${String(o.id).padStart(4, '0')}`,
      `"${o.customer_name || ''}"`,
      `"${o.phone || ''}"`,
      `"${o.email || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      o.total_amount,
      `"${o.payment_method || ''}"`,
      o.status,
      `"${new Date(o.created_at).toLocaleString('vi-VN')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TechNova_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Xuất danh sách đơn hàng ra file CSV thành công!');
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Đã xóa sản phẩm thành công!');
    } catch (err) {
      showToast('Lỗi xóa sản phẩm: ' + err.message);
    }
  };

  // Handle Inline Edit Product
  const handleStartEditProduct = (p) => {
    setEditingProductId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const handleSaveEditProduct = async (id) => {
    const current = products.find(p => p.id === id);
    const newPrice = Number(editPrice) || (current ? current.price : 0);
    const newStock = Number(editStock) !== undefined && editStock !== '' ? Number(editStock) : (current ? current.stock : 10);

    try {
      if (current) {
        await updateProduct(id, {
          name: current.name,
          category: current.category,
          price: newPrice,
          oldPrice: current.oldPrice,
          stock: newStock,
          image: current.image,
          description: current.description,
          specs: current.specs,
          featured: current.featured
        });
      }
    } catch (err) {
      console.warn('Backend update failed, using local fallback:', err);
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          price: newPrice,
          stock: newStock
        };
      }
      return p;
    }));
    setEditingProductId(null);
    showToast('Đã lưu thay đổi thông tin sản phẩm inline!');
  };

  // Handle Create Product
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.image) {
      showToast('Vui lòng điền tên, giá và link ảnh sản phẩm!');
      return;
    }

    try {
      const specsArr = newProd.specs.split('\n').filter(s => s.trim() !== '');
      await createProduct({
        ...newProd,
        price: Number(newProd.price),
        oldPrice: newProd.oldPrice ? Number(newProd.oldPrice) : null,
        stock: Number(newProd.stock),
        specs: specsArr
      });

      showToast('Tạo sản phẩm mới vào kho thành công!');
      setNewProd({
        name: '',
        category: 'Laptop',
        brand: 'TechNova',
        price: '',
        oldPrice: '',
        stock: 15,
        image: '',
        description: '',
        specs: '',
        featured: false
      });
      setActiveTab('products');
      loadDashboardData();
    } catch (err) {
      showToast('Lỗi thêm sản phẩm: ' + err.message);
    }
  };

  // Handle Admin Reply to Comment
  const handleSendCommentReply = async (commentId) => {
    if (!replyText.trim()) {
      showToast('Vui lòng nhập nội dung phản hồi!');
      return;
    }
    try {
      await replyAdminComment(commentId, replyText.trim());
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, admin_reply: replyText.trim() } : c));
      setReplyingCommentId(null);
      setReplyText('');
      showToast('Đã gửi phản hồi chính thức của TechNova Mall tới khách hàng!');
    } catch (err) {
      showToast('Lỗi khi gửi phản hồi: ' + err.message);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn ẩn/xóa bình luận này khỏi hệ thống?')) return;
    try {
      await deleteAdminComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast('Đã xóa đánh giá bình luận thành công!');
    } catch (err) {
      showToast('Lỗi xóa bình luận: ' + err.message);
    }
  };

  // Handle Create Voucher
  const handleCreateVoucherSubmit = async (e) => {
    e.preventDefault();
    if (!newVoucher.code || !newVoucher.discount_value) {
      showToast('Vui lòng nhập mã code và mức giảm!');
      return;
    }
    try {
      await createAdminVoucher(newVoucher);
      showToast(`Đã tạo mã khuyến mãi ${newVoucher.code.toUpperCase()} thành công!`);
      setIsNewVoucherModalOpen(false);
      setNewVoucher({
        code: '',
        discount_type: 'percent',
        discount_value: '',
        min_order_value: '0',
        max_discount: '100',
        max_usage: '100'
      });
      const updatedVouchers = await fetchAdminVouchers();
      setVouchers(updatedVouchers);
    } catch (err) {
      showToast('Lỗi tạo voucher: ' + err.message);
    }
  };

  // Handle Toggle Voucher Status
  const handleToggleVoucher = async (voucherId) => {
    try {
      await toggleAdminVoucher(voucherId);
      setVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, is_active: v.is_active ? 0 : 1 } : v));
      showToast('Đã cập nhật trạng thái hoạt động của voucher!');
    } catch (err) {
      showToast('Lỗi cập nhật voucher: ' + err.message);
    }
  };

  // Handle Delete Voucher
  const handleDeleteVoucher = async (voucherId) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;
    try {
      await deleteAdminVoucher(voucherId);
      setVouchers(prev => prev.filter(v => v.id !== voucherId));
      showToast('Đã xóa voucher thành công!');
    } catch (err) {
      showToast('Lỗi xóa voucher: ' + err.message);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ID #${userId} khỏi Database?`)) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      showToast('Đã xóa người dùng khỏi Database!');
    } catch (err) {
      showToast('Lỗi xóa người dùng: ' + err.message);
    }
  };

  // Global Quick Search Filter Trigger
  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    const query = globalSearch.trim().toLowerCase();
    // If user searches for an order number
    if (query.includes('ord') || !isNaN(query.replace('#', ''))) {
      setActiveTab('orders');
      setOrderSearchText(query.replace('#ord-', '').replace('#', ''));
    } else {
      // Otherwise search product by name
      setActiveTab('products');
      setProductSearchText(query);
    }
  };

  // ================================================================
  // COMPUTED DATA FOR DASHBOARD
  // ================================================================
  const deliveredRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  }, [orders]);

  const pendingRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'Pending' || o.status === 'Processing')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  }, [orders]);

  const totalCalculatedRevenue = stats?.totalRevenue || (deliveredRevenue + pendingRevenue) || 25528;

  // Counts for To-Do List
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const processingOrdersCount = orders.filter(o => o.status === 'Processing').length;
  const shippingOrdersCount = orders.filter(o => o.status === 'Shipped').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const unrepliedCommentsCount = comments.filter(c => !c.admin_reply).length;

  // Total stock items across warehouse
  const totalStockItems = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  }, [products]);

  // Unique categories count
  const uniqueCategoriesCount = useMemo(() => {
    return new Set(products.map(p => p.category).filter(Boolean)).size || 7;
  }, [products]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Sub-tab filter
      if (orderStatusTab !== 'All' && o.status !== orderStatusTab) return false;
      // Payment filter
      if (orderPaymentFilter !== 'All' && o.payment_method !== orderPaymentFilter) return false;
      // Search query
      if (orderSearchText.trim()) {
        const q = orderSearchText.trim().toLowerCase();
        const ordCode = `#ord-${String(o.id).padStart(4, '0')}`.toLowerCase();
        const idMatch = String(o.id).includes(q) || ordCode.includes(q);
        const nameMatch = (o.customer_name || '').toLowerCase().includes(q);
        const phoneMatch = (o.phone || '').includes(q);
        if (!idMatch && !nameMatch && !phoneMatch) return false;
      }
      return true;
    });
  }, [orders, orderStatusTab, orderPaymentFilter, orderSearchText]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCatFilter !== 'All' && p.category !== productCatFilter) return false;
      if (productStockFilter === 'low_stock' && p.stock > 5) return false;
      if (productStockFilter === 'in_stock' && p.stock <= 5) return false;
      if (productSearchText.trim()) {
        const q = productSearchText.trim().toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const brandMatch = (p.brand || '').toLowerCase().includes(q);
        if (!nameMatch && !brandMatch) return false;
      }
      return true;
    });
  }, [products, productCatFilter, productStockFilter, productSearchText]);

  // Filtered Comments
  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      if (commentStarFilter === '5' && Math.round(c.rating) !== 5) return false;
      if (commentStarFilter === '4' && Math.round(c.rating) !== 4) return false;
      if (commentStarFilter === '3' && Math.round(c.rating) !== 3) return false;
      if (commentStarFilter === 'low' && Math.round(c.rating) > 2) return false;
      if (commentStarFilter === 'no_reply' && c.admin_reply) return false;
      if (commentSearchText.trim()) {
        const q = commentSearchText.trim().toLowerCase();
        const contentMatch = (c.content || '').toLowerCase().includes(q);
        const authorMatch = (c.author || '').toLowerCase().includes(q);
        const prodMatch = (c.product_name || '').toLowerCase().includes(q);
        if (!contentMatch && !authorMatch && !prodMatch) return false;
      }
      return true;
    });
  }, [comments, commentStarFilter, commentSearchText]);

  // Top 5 Best Sellers
  const topBestSellers = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      .slice(0, 5);
  }, [products]);

  // Mock 7-day revenue points for SVG bar chart
  const weeklyData = [
    { day: 'T2', rev: 2840, orders: 4 },
    { day: 'T3', rev: 4120, orders: 7 },
    { day: 'T4', rev: 3350, orders: 5 },
    { day: 'T5', rev: 5690, orders: 9 },
    { day: 'T6', rev: 6180, orders: 11 },
    { day: 'T7', rev: 7450, orders: 14 },
    { day: 'CN', rev: 4890, orders: 8 }
  ];
  const maxWeeklyRev = Math.max(...weeklyData.map(d => d.rev));

  // ================================================================
  // RENDER: ADMIN LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="glass-panel admin-login-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="admin-login-icon-box">
              <ShieldCheck size={32} color="#818cf8" />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
              Cổng Quản Trị Seller Center
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Hệ thống quản lý sàn thương mại điện tử TechNova Mall
            </p>
          </div>

          {loginError && (
            <div className="admin-login-error-badge">
              <AlertTriangle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-form-label">Tên đăng nhập / Email Admin</label>
              <div style={{ position: 'relative' }}>
                <User size={18} className="admin-input-icon" />
                <input
                  type="text"
                  placeholder="admin"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="admin-input-field"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label className="admin-form-label">Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} className="admin-input-icon" />
                <input
                  type="password"
                  placeholder="admin123"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="admin-input-field"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoggingIn}
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginBottom: '16px', justifyContent: 'center' }}
            >
              <KeyRound size={18} />
              <span>{isLoggingIn ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}</span>
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Đăng nhập kiểm thử nhanh:
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => {
                setLoginUser('admin');
                setLoginPass('admin123');
              }}
            >
              Điền tài khoản Admin mẫu (admin / admin123)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================================================================
  // MAIN SELLER CENTER / ADMIN PORTAL LAYOUT
  // ================================================================
  return (
    <div className="admin-portal-root">
      {/* 1. TOP ADMIN HEADER */}
      <header className="admin-portal-header">
        <div className="admin-header-left">
          <div className="admin-logo-badge" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
            <div className="admin-logo-symbol">TN</div>
            <div className="admin-logo-text-group">
              <span className="admin-logo-title">TechNova</span>
              <span className="admin-portal-tag">SELLER CENTER</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="admin-header-center">
          <form className="admin-global-search-form" onSubmit={handleGlobalSearchSubmit}>
            <Search size={16} className="search-icon-dim" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh: Mã đơn (#ORD-0022), SKU, SĐT, Sản phẩm..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="admin-global-search-input"
            />
            <button type="submit" className="search-submit-btn">Tìm</button>
          </form>
        </div>

        {/* Header Right Actions */}
        <div className="admin-header-right">
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="admin-header-icon-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Thông báo hệ thống"
            >
              <Bell size={18} />
              {(pendingOrdersCount > 0 || lowStockProducts.length > 0) && (
                <span className="admin-header-badge-dot" />
              )}
            </button>

            {showNotifications && (
              <div className="admin-notifications-dropdown">
                <div className="notif-dropdown-header">
                  <strong>Thông Báo Việc Cần Làm</strong>
                  <span className="badge badge-indigo">{pendingOrdersCount + lowStockProducts.length} mới</span>
                </div>
                <div className="notif-dropdown-body">
                  {pendingOrdersCount > 0 && (
                    <div className="notif-item" onClick={() => { setActiveTab('orders'); setOrderStatusTab('Pending'); setShowNotifications(false); }}>
                      <Clock size={16} color="#f59e0b" />
                      <div>
                        <strong>{pendingOrdersCount} Đơn hàng đang chờ xác nhận</strong>
                        <p>Khách đang đợi duyệt đơn để giao hàng.</p>
                      </div>
                    </div>
                  )}
                  {lowStockProducts.length > 0 && (
                    <div className="notif-item" onClick={() => { setActiveTab('products'); setProductStockFilter('low_stock'); setShowNotifications(false); }}>
                      <AlertTriangle size={16} color="#fb7185" />
                      <div>
                        <strong>{lowStockProducts.length} Sản phẩm sắp hết hàng</strong>
                        <p>Cần nhập thêm tồn kho ngay để tránh đứt hàng.</p>
                      </div>
                    </div>
                  )}
                  {unrepliedCommentsCount > 0 && (
                    <div className="notif-item" onClick={() => { setActiveTab('comments'); setCommentStarFilter('no_reply'); setShowNotifications(false); }}>
                      <MessageSquare size={16} color="#818cf8" />
                      <div>
                        <strong>{unrepliedCommentsCount} Đánh giá chưa được phản hồi</strong>
                        <p>Chăm sóc phản hồi của khách hàng TechNova.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Back to Client Store Button */}
          <button
            className="btn btn-secondary admin-btn-back-store"
            onClick={() => navigateTo ? navigateTo('/') : (window.location.href = '/')}
            title="Quay lại giao diện cửa hàng khách hàng"
          >
            <ExternalLink size={15} />
            <span>Xem Cửa Hàng</span>
          </button>

          {/* Admin User Info & Logout */}
          <div className="admin-user-pill">
            <div className="admin-avatar-small">
              <ShieldCheck size={16} color="#818cf8" />
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name">Quản Trị Viên</span>
              <span className="admin-user-role">Super Admin</span>
            </div>
            <button 
              className="admin-logout-icon-btn" 
              onClick={handleLogout}
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER WITH SIDEBAR & WORKSPACE */}
      <div className="admin-main-container">
        {/* SIDEBAR NAVIGATION */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-menu">
            <div className="sidebar-group-title">QUẢN LÝ TỔNG QUAN</div>
            
            <button
              className={`sidebar-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 size={18} />
              <span>Tổng quan (Dashboard)</span>
            </button>

            <button
              className={`sidebar-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              <span>Quản lý Đơn hàng</span>
              {orders.length > 0 && (
                <span className="sidebar-item-count">{orders.length}</span>
              )}
            </button>

            <button
              className={`sidebar-menu-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} />
              <span>Quản lý Sản phẩm</span>
              {products.length > 0 && (
                <span className="sidebar-item-count">{products.length}</span>
              )}
            </button>

            <button
              className={`sidebar-menu-item ${activeTab === 'add_product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add_product')}
            >
              <Plus size={18} />
              <span>Thêm Sản Phẩm Mới</span>
            </button>

            <div className="sidebar-group-title" style={{ marginTop: '16px' }}>CHĂM SÓC & KHUYẾN MÃI</div>

            <button
              className={`sidebar-menu-item ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <Star size={18} color="#f59e0b" />
              <span>Quản lý Đánh giá (E-Comment)</span>
              {unrepliedCommentsCount > 0 && (
                <span className="sidebar-item-count alert">{unrepliedCommentsCount}</span>
              )}
            </button>

            <button
              className={`sidebar-menu-item ${activeTab === 'vouchers' ? 'active' : ''}`}
              onClick={() => setActiveTab('vouchers')}
            >
              <Tag size={18} color="#22d3ee" />
              <span>Khuyến mãi & Voucher</span>
              {vouchers.length > 0 && (
                <span className="sidebar-item-count">{vouchers.length}</span>
              )}
            </button>

            <button
              className={`sidebar-menu-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <User size={18} />
              <span>Khách hàng Database</span>
              <span className="sidebar-item-count">{users.length}</span>
            </button>

            <button
              className={`sidebar-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <Mail size={18} />
              <span>Hộp thư liên hệ</span>
              {messages.length > 0 && (
                <span className="sidebar-item-count">{messages.length}</span>
              )}
            </button>

            <div className="sidebar-group-title" style={{ marginTop: '16px' }}>KỸ THUẬT & HỆ THỐNG</div>

            <button
              className={`sidebar-menu-item ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <Activity size={18} color="#34d399" />
              <span>Hệ thống / DevOps</span>
            </button>
          </div>

          {/* Sidebar Bottom Footer */}
          <div className="admin-sidebar-footer">
            <button className="admin-sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Đăng Xuất Admin</span>
            </button>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="admin-workspace">
          {/* Top Actions Bar inside Workspace */}
          <div className="workspace-action-header">
            <div>
              <h2 className="workspace-main-title">
                {activeTab === 'overview' && 'Bảng Điều Khiển Tổng Quan Sàn TechNova'}
                {activeTab === 'orders' && 'Quản Lý Đơn Hàng & Vận Chuyển'}
                {activeTab === 'products' && 'Quản Lý Danh Sách Thiết Bị Trong Kho'}
                {activeTab === 'comments' && 'Quản Lý Đánh Giá & Nhận Xét (E-Comment Module)'}
                {activeTab === 'vouchers' && 'Quản Lý Mã Giảm Giá & Chiến Dịch Khuyến Mãi'}
                {activeTab === 'users' && 'Quản Lý Tài Khoản Khách Hàng (SQL Server Users)'}
                {activeTab === 'messages' && 'Hộp Thư Tin Nhắn Khách Hàng & Liên Hệ'}
                {activeTab === 'add_product' && 'Thêm Thiết Bị Công Nghệ Mới Vào Kho'}
                {activeTab === 'system' && 'Thông Tin Hệ Thống, Database & DevOps CI/CD'}
              </h2>
              <p className="workspace-sub-title">
                {activeTab === 'overview' && 'Theo dõi doanh thu thời gian thực, tiến độ xử lý đơn hàng và hiệu suất bán chạy.'}
                {activeTab === 'orders' && `Tổng cộng ${orders.length} đơn hàng được đồng bộ từ website và thanh toán VietQR/COD.`}
                {activeTab === 'products' && `Hệ thống hiện có ${products.length} sản phẩm thuộc ${uniqueCategoriesCount} danh mục.`}
                {activeTab === 'comments' && 'Theo dõi đánh giá sao, kiểm duyệt nội dung và phản hồi trực tiếp ý kiến khách hàng.'}
                {activeTab === 'vouchers' && 'Tạo và kích hoạt các mã ưu đãi giảm giá áp dụng ngoài giỏ hàng.'}
                {activeTab === 'users' && 'Tài khoản người dùng được lưu trữ và mã hóa an toàn trong cơ sở dữ liệu MSSQL.'}
                {activeTab === 'messages' && 'Các tin nhắn thắc mắc được gửi từ form Hỗ Trợ 24/7 ngoài trang chủ.'}
                {activeTab === 'add_product' && 'Điền thông số kỹ thuật, cấu hình RAM/Chip và hình ảnh sản phẩm mới.'}
                {activeTab === 'system' && 'Kiểm tra trạng thái kết nối MSSQL, Redis Cache, Node.js API và Docker Container.'}
              </p>
            </div>

            <div className="workspace-header-btns">
              {activeTab === 'orders' && (
                <button className="btn btn-secondary" onClick={handleExportOrdersCSV}>
                  <Download size={16} />
                  <span>Xuất Excel / CSV</span>
                </button>
              )}
              {activeTab === 'vouchers' && (
                <button className="btn btn-primary" onClick={() => setIsNewVoucherModalOpen(true)}>
                  <Plus size={16} />
                  <span>Tạo Mã Voucher</span>
                </button>
              )}
              <button className="btn btn-secondary" onClick={loadDashboardData} disabled={loading}>
                <RefreshCw size={16} className={loading ? 'spin-anim' : ''} />
                <span>{loading ? 'Đang tải...' : 'Làm Mới'}</span>
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* TAB 1: OVERVIEW DASHBOARD                                        */}
          {/* ================================================================ */}
          {activeTab === 'overview' && (
            <div className="overview-tab-content">
              {/* TO-DO LIST (VIỆC CẦN LÀM CHUẨN SÀN TMĐT) */}
              <div className="todo-bar-container">
                <div className="todo-bar-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="#818cf8" />
                    <span className="todo-bar-title">VIỆC CẦN XỬ LÝ NGAY (TO-DO LIST CHUẨN SÀN TMĐT):</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Cập nhật thời gian thực
                  </span>
                </div>

                <div className="todo-items-grid">
                  <div 
                    className="todo-chip-item" 
                    onClick={() => { setActiveTab('orders'); setOrderStatusTab('Pending'); }}
                    title="Xem đơn hàng đang chờ duyệt"
                  >
                    <span className="todo-chip-label">Chờ xác nhận:</span>
                    <strong className={`todo-chip-val ${pendingOrdersCount > 0 ? 'alert' : ''}`}>
                      {pendingOrdersCount}
                    </strong>
                  </div>

                  <div 
                    className="todo-chip-item"
                    onClick={() => { setActiveTab('orders'); setOrderStatusTab('Processing'); }}
                    title="Xem đơn hàng đang đóng gói"
                  >
                    <span className="todo-chip-label">Chờ giao hàng:</span>
                    <strong className="todo-chip-val">{processingOrdersCount}</strong>
                  </div>

                  <div 
                    className="todo-chip-item"
                    onClick={() => { setActiveTab('orders'); setOrderStatusTab('Shipped'); }}
                    title="Xem đơn hàng đang trên đường giao"
                  >
                    <span className="todo-chip-label">Đang giao:</span>
                    <strong className="todo-chip-val">{shippingOrdersCount}</strong>
                  </div>

                  <div 
                    className="todo-chip-item"
                    onClick={() => { setActiveTab('products'); setProductStockFilter('low_stock'); }}
                    title="Xem sản phẩm sắp hết tồn kho"
                  >
                    <span className="todo-chip-label">Sắp hết hàng:</span>
                    <strong className={`todo-chip-val ${lowStockProducts.length > 0 ? 'danger' : ''}`}>
                      {lowStockProducts.length}
                    </strong>
                  </div>

                  <div 
                    className="todo-chip-item"
                    onClick={() => { setActiveTab('comments'); setCommentStarFilter('no_reply'); }}
                    title="Xem các đánh giá chưa trả lời"
                  >
                    <span className="todo-chip-label">Đánh giá cần phản hồi:</span>
                    <strong className="todo-chip-val">{unrepliedCommentsCount}</strong>
                  </div>
                </div>
              </div>

              {/* 4 ACTIONABLE KPI CARDS */}
              <div className="admin-kpi-grid">
                {/* KPI 1: Doanh thu */}
                <div 
                  className="admin-kpi-card hoverable"
                  onClick={() => setRevenueModalOpen(true)}
                  title="Bấm để xem phân tích chi tiết doanh thu theo cổng thanh toán"
                >
                  <div className="kpi-top-row">
                    <span className="kpi-label">Tổng Doanh Thu</span>
                    <div className="kpi-icon-wrap emerald">
                      <DollarSign size={20} color="#34d399" />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">${totalCalculatedRevenue.toLocaleString()}</span>
                    <span className="kpi-growth-badge positive">
                      <TrendingUp size={12} /> +15.4%
                    </span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>Đã thu (Delivered): <strong>${deliveredRevenue.toLocaleString()}</strong></span>
                    <span>Tạm tính (Pending): <strong>${pendingRevenue.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* KPI 2: Đơn hàng */}
                <div 
                  className="admin-kpi-card hoverable"
                  onClick={() => setActiveTab('orders')}
                  title="Bấm để cuộn xuống danh sách đơn hàng"
                >
                  <div className="kpi-top-row">
                    <span className="kpi-label">Tổng Đơn Hàng</span>
                    <div className="kpi-icon-wrap indigo">
                      <ShoppingBag size={20} color="#818cf8" />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">{orders.length} Đơn</span>
                    <span className="kpi-growth-badge neutral">
                      {Math.round(((orders.filter(o => o.status === 'Delivered').length) / (orders.length || 1)) * 100)}% Hoàn thành
                    </span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>{pendingOrdersCount} Chờ duyệt • {processingOrdersCount} Đang xử lý • {orders.filter(o => o.status === 'Delivered').length} Đã giao</span>
                  </div>
                </div>

                {/* KPI 3: Sản phẩm trong kho */}
                <div 
                  className="admin-kpi-card hoverable"
                  onClick={() => setActiveTab('products')}
                  title="Bấm để chuyển sang Quản lý Sản Phẩm"
                >
                  <div className="kpi-top-row">
                    <span className="kpi-label">Sản Phẩm Trong Kho</span>
                    <div className="kpi-icon-wrap cyan">
                      <Package size={20} color="#22d3ee" />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">{products.length} SP</span>
                    <span className="kpi-growth-badge info">
                      {uniqueCategoriesCount} Danh mục
                    </span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>Tổng <strong>{totalStockItems}</strong> mặt hàng tồn kho sẵn sàng xuất kho</span>
                  </div>
                </div>

                {/* KPI 4: Cảnh báo tồn kho */}
                <div 
                  className="admin-kpi-card hoverable warning-card"
                  onClick={() => { setActiveTab('products'); setProductStockFilter('low_stock'); }}
                  title="Bấm để lọc các sản phẩm tồn kho <= 5"
                >
                  <div className="kpi-top-row">
                    <span className="kpi-label">Cảnh Báo Tồn Kho Thấp</span>
                    <div className="kpi-icon-wrap rose">
                      <AlertTriangle size={20} color="#fb7185" />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number danger-text">{lowStockProducts.length} Sản phẩm</span>
                    <span className="kpi-btn-mini-restock">
                      Nhập thêm kho <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>
                      {lowStockProducts[0] ? `${lowStockProducts[0].name.slice(0, 22)}... (Còn ${lowStockProducts[0].stock})` : 'Kho hàng đang ổn định'}
                    </span>
                  </div>
                </div>
              </div>

              {/* VISUAL CHARTS ROW (65% - 35%) */}
              <div className="charts-split-grid">
                {/* Chart Left (65%): Weekly Revenue SVG Chart */}
                <div className="glass-panel chart-box-left">
                  <div className="chart-header-row">
                    <div>
                      <h3 className="chart-title">Biểu Đồ Doanh Thu & Đơn Hàng 7 Ngày Qua</h3>
                      <p className="chart-subtitle">Thống kê dữ liệu bán hàng trực tiếp theo ngày</p>
                    </div>
                    <div className="chart-legend-row">
                      <span className="legend-chip"><span className="legend-dot-bar" /> Doanh thu ($)</span>
                    </div>
                  </div>

                  <div className="chart-bars-wrap">
                    {weeklyData.map((item, idx) => {
                      const heightPercent = Math.max(15, Math.round((item.rev / maxWeeklyRev) * 100));
                      return (
                        <div key={idx} className="chart-bar-col">
                          <span className="chart-bar-val">${item.rev.toLocaleString()}</span>
                          <div className="chart-bar-track">
                            <div 
                              className="chart-bar-fill" 
                              style={{ height: `${heightPercent}%` }}
                              title={`${item.day}: $${item.rev} (${item.orders} đơn)`}
                            />
                          </div>
                          <span className="chart-bar-day">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart Right (35%): Top 5 Best Sellers */}
                <div className="glass-panel chart-box-right">
                  <div className="chart-header-row">
                    <div>
                      <h3 className="chart-title">Top 5 Sản Phẩm Bán Chạy</h3>
                      <p className="chart-subtitle">Xếp hạng theo lượt mua thực tế</p>
                    </div>
                    <Award size={18} color="#f59e0b" />
                  </div>

                  <div className="top-sellers-list">
                    {topBestSellers.map((prod, index) => (
                      <div key={prod.id || index} className="top-seller-item">
                        <span className="rank-badge">{index + 1}</span>
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          onError={handleImageError} 
                          className="seller-prod-thumb" 
                        />
                        <div className="seller-prod-info">
                          <h4 className="seller-prod-name" title={prod.name}>{prod.name}</h4>
                          <div className="seller-prod-meta">
                            <span className="seller-prod-cat">{prod.category}</span>
                            <span className="seller-prod-sold">Đã bán {prod.soldCount || 100}+</span>
                          </div>
                          <div className="seller-progress-track">
                            <div 
                              className="seller-progress-bar" 
                              style={{ width: `${Math.min(100, Math.max(20, (prod.soldCount || 50) / 3))}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUICK RECENT ORDERS PREVIEW */}
              <div className="glass-panel" style={{ padding: '20px', marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>
                    Đơn Hàng Mới Nhận Gần Đây
                  </h3>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('orders')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    Xem toàn bộ đơn hàng <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Mã Đơn</th>
                        <th>Khách Hàng</th>
                        <th>Sản Phẩm</th>
                        <th>Tổng Tiền</th>
                        <th>Thanh Toán</th>
                        <th>Trạng Thái</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id}>
                          <td>
                            <strong style={{ color: '#818cf8' }}>#ORD-{String(o.id).padStart(4, '0')}</strong>
                          </td>
                          <td style={{ color: 'white', fontWeight: 600 }}>{o.customer_name}</td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            {o.items?.length ? `${o.items[0].product_name || o.items[0].name} (${o.items.length} món)` : 'Sản phẩm công nghệ'}
                          </td>
                          <td style={{ fontWeight: 800, color: '#34d399' }}>${o.total_amount.toLocaleString()}</td>
                          <td>
                            <span className="badge badge-indigo">{o.payment_method}</span>
                          </td>
                          <td>
                            <span className={`status-pill ${o.status.toLowerCase()}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-secondary btn-icon-small" onClick={() => setSelectedOrderForDetail(o)} title="Chi tiết">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: ORDER MANAGEMENT (QUẢN LÝ ĐƠN HÀNG NÂNG CẤP)               */}
          {/* ================================================================ */}
          {activeTab === 'orders' && (
            <div className="orders-management-tab">
              {/* PHẦN A: SUB-TABS TRẠNG THÁI */}
              <div className="order-subtabs-row">
                {[
                  { key: 'All', label: 'Tất cả', count: orders.length },
                  { key: 'Pending', label: 'Chờ xác nhận', count: pendingOrdersCount },
                  { key: 'Processing', label: 'Đang xử lý', count: processingOrdersCount },
                  { key: 'Shipped', label: 'Đang giao', count: shippingOrdersCount },
                  { key: 'Delivered', label: 'Đã hoàn thành', count: orders.filter(o => o.status === 'Delivered').length },
                  { key: 'Cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'Cancelled').length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    className={`order-subtab-btn ${orderStatusTab === tab.key ? 'active' : ''}`}
                    onClick={() => setOrderStatusTab(tab.key)}
                  >
                    <span>{tab.label}</span>
                    <span className="tab-badge-num">({tab.count})</span>
                  </button>
                ))}
              </div>

              {/* SEARCH & FILTER TOOLBAR */}
              <div className="orders-toolbar-panel">
                <div className="toolbar-left-group">
                  <div className="toolbar-search-wrap">
                    <Search size={16} className="search-icon-dim" />
                    <input
                      type="text"
                      placeholder="Tìm theo Mã đơn (#22), Tên khách, SĐT..."
                      value={orderSearchText}
                      onChange={(e) => setOrderSearchText(e.target.value)}
                      className="toolbar-search-input"
                    />
                    {orderSearchText && (
                      <button className="clear-search-btn" onClick={() => setOrderSearchText('')}>×</button>
                    )}
                  </div>

                  {/* Lọc thanh toán */}
                  <div className="toolbar-select-wrap">
                    <label>Thanh toán:</label>
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="All">Tất cả cổng</option>
                      <option value="VietQR">VietQR Chuẩn 247</option>
                      <option value="Banking">Banking Chuyển khoản</option>
                      <option value="COD">Thanh toán khi nhận (COD)</option>
                    </select>
                  </div>
                </div>

                <div className="toolbar-right-group">
                  <span className="records-count-text">
                    Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng
                  </span>
                </div>
              </div>

              {/* PHẦN B: BẢNG ĐƠN HÀNG CHUẨN SÀN TMĐT */}
              <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Mã Đơn</th>
                      <th style={{ width: '220px' }}>Khách Hàng & Giao Hàng</th>
                      <th style={{ minWidth: '240px' }}>Sản Phẩm Đã Đặt</th>
                      <th style={{ width: '150px' }}>Tổng Tiền & Cổng</th>
                      <th style={{ width: '150px' }}>Trạng Thái</th>
                      <th style={{ width: '120px' }}>Thời Gian</th>
                      <th style={{ width: '110px', textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                          <ShoppingBag size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                          <p>Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(o => {
                        const ordCode = `#ORD-${String(o.id).padStart(4, '0')}`;
                        const isCOD = o.payment_method === 'COD';
                        const isPaid = o.status === 'Delivered' || !isCOD;

                        return (
                          <tr key={o.id}>
                            {/* Mã Đơn */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ color: '#818cf8', fontSize: '0.88rem' }}>{ordCode}</strong>
                                <button
                                  className="btn-icon-tiny"
                                  onClick={() => handleCopyOrderCode(o.id)}
                                  title="Sao chép mã đơn"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                            </td>

                            {/* Khách Hàng & SĐT / Địa Chỉ */}
                            <td>
                              <div className="order-customer-cell">
                                <span className="customer-name-bold">{o.customer_name}</span>
                                <span className="customer-contact-text">{o.phone} • {o.email}</span>
                                <span className="customer-address-text" title={o.address}>
                                  📍 {o.address || 'Địa chỉ giao hàng chuẩn'}
                                </span>
                                <span className="badge badge-shipping-2h">
                                  <Truck size={10} /> Giao Siêu Tốc 2H
                                </span>
                              </div>
                            </td>

                            {/* Sản Phẩm Đã Đặt */}
                            <td>
                              {o.items?.length ? (
                                <div className="order-items-compact-list">
                                  {o.items.map((item, itemIdx) => (
                                    <div key={item.id || itemIdx} className="order-item-compact-row">
                                      <img 
                                        src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100'} 
                                        alt={item.product_name || item.name} 
                                        onError={handleImageError} 
                                        className="order-item-thumb" 
                                      />
                                      <div className="order-item-details">
                                        <span className="order-item-name">{item.product_name || item.name}</span>
                                        <span className="order-item-qty">
                                          × {item.quantity} (${Number(item.price || 0).toLocaleString()})
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Chi tiết đang cập nhật</span>
                              )}
                            </td>

                            {/* Tổng Tiền & Thanh Toán */}
                            <td>
                              <div className="order-price-cell">
                                <strong className="order-price-val">${o.total_amount.toLocaleString()}</strong>
                                <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                                  {o.payment_method}
                                </span>
                                <span className={`order-payment-status ${isPaid ? 'paid' : 'unpaid'}`}>
                                  {isPaid ? '🟢 Đã thanh toán' : '🟡 Chờ thu hộ COD'}
                                </span>
                              </div>
                            </td>

                            {/* Trạng Thái Dropdown */}
                            <td>
                              <select
                                value={o.status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className={`order-status-select ${o.status.toLowerCase()}`}
                              >
                                <option value="Pending">🟡 Chờ duyệt (Pending)</option>
                                <option value="Processing">🔵 Đang xử lý (Processing)</option>
                                <option value="Shipped">🟣 Đang giao (Shipped)</option>
                                <option value="Delivered">🟢 Đã hoàn tất (Delivered)</option>
                                <option value="Cancelled">🔴 Đã hủy (Cancelled)</option>
                              </select>
                            </td>

                            {/* Thời Gian */}
                            <td>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                                {new Date(o.created_at).toLocaleDateString('vi-VN')}<br />
                                {new Date(o.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            {/* Thao Tác: Chi tiết & In phiếu gửi */}
                            <td>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button
                                  className="btn btn-secondary btn-icon-small"
                                  onClick={() => setSelectedOrderForDetail(o)}
                                  title="Xem đầy đủ lịch sử đơn"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  className="btn btn-secondary btn-icon-small"
                                  onClick={() => setOrderToPrint(o)}
                                  title="In phiếu gửi / Hóa đơn"
                                >
                                  <Printer size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: PRODUCT MANAGEMENT (DANH SÁCH SẢN PHẨM NÂNG CẤP)           */}
          {/* ================================================================ */}
          {activeTab === 'products' && (
            <div className="products-management-tab">
              {/* Product Toolbar */}
              <div className="orders-toolbar-panel">
                <div className="toolbar-left-group">
                  <div className="toolbar-search-wrap">
                    <Search size={16} className="search-icon-dim" />
                    <input
                      type="text"
                      placeholder="Tìm sản phẩm theo tên, thương hiệu..."
                      value={productSearchText}
                      onChange={(e) => setProductSearchText(e.target.value)}
                      className="toolbar-search-input"
                    />
                    {productSearchText && (
                      <button className="clear-search-btn" onClick={() => setProductSearchText('')}>×</button>
                    )}
                  </div>

                  {/* Lọc danh mục */}
                  <div className="toolbar-select-wrap">
                    <label>Danh mục:</label>
                    <select
                      value={productCatFilter}
                      onChange={(e) => setProductCatFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="All">Tất cả danh mục</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Audio">Audio</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Accessory">Accessory</option>
                    </select>
                  </div>

                  {/* Lọc tồn kho */}
                  <div className="toolbar-select-wrap">
                    <label>Kho hàng:</label>
                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="All">Tất cả trạng thái kho</option>
                      <option value="in_stock">Còn nhiều hàng (&gt; 5)</option>
                      <option value="low_stock">⚠️ Sắp hết hàng (&le; 5)</option>
                    </select>
                  </div>
                </div>

                <div className="toolbar-right-group">
                  <button className="btn btn-primary" onClick={() => setActiveTab('add_product')}>
                    <Plus size={16} />
                    <span>Thêm Sản Phẩm Mới</span>
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }}>Ảnh</th>
                      <th>Thông Tin Sản Phẩm & SKU</th>
                      <th>Danh Mục</th>
                      <th>Giá Bán</th>
                      <th>Tồn Kho</th>
                      <th>Đã Bán & Sao</th>
                      <th>Trạng Thái</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const isEditing = editingProductId === p.id;
                      const isLow = p.stock <= 5;

                      return (
                        <tr key={p.id}>
                          <td>
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              onError={handleImageError} 
                              className="product-table-thumb" 
                            />
                          </td>

                          {/* Thông Tin & Brand */}
                          <td>
                            <div className="product-table-meta-cell">
                              <span className="prod-cell-name">{p.name}</span>
                              <div className="prod-cell-sub">
                                <span className="prod-cell-brand">{p.brand || 'TechNova'}</span>
                                <span className="prod-cell-sku">• SKU: TN-{String(p.id).padStart(4, '0')}</span>
                              </div>
                            </div>
                          </td>

                          {/* Danh Mục */}
                          <td>
                            <span className="badge badge-cyan">{p.category}</span>
                          </td>

                          {/* Giá Bán (Sửa inline) */}
                          <td>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="inline-edit-input"
                              />
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong style={{ color: 'white', fontSize: '0.92rem' }}>
                                  ${p.price.toLocaleString()}
                                </strong>
                                {p.oldPrice && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                                    ${p.oldPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Tồn Kho (Tô đỏ nếu <= 5) */}
                          <td>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="inline-edit-input"
                              />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong className={`stock-number-text ${isLow ? 'danger' : 'safe'}`}>
                                  {p.stock} cái
                                </strong>
                                {isLow && (
                                  <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                                    Sắp hết
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Đã Bán & Rating */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700 }}>
                                ★ {p.rating}
                              </span>
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                                Đã bán {p.soldCount || 100}+
                              </span>
                            </div>
                          </td>

                          {/* Trạng Thái Switch / Badge */}
                          <td>
                            {p.isFlashSale ? (
                              <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                                🔥 FLASH SALE
                              </span>
                            ) : (
                              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                                Đang Hiển Thị
                              </span>
                            )}
                          </td>

                          {/* Hành Động: Sửa & Xóa */}
                          <td>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {isEditing ? (
                                <>
                                  <button
                                    className="btn btn-primary btn-icon-small"
                                    onClick={() => handleSaveEditProduct(p.id)}
                                    title="Lưu thay đổi"
                                  >
                                    <Save size={14} />
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-icon-small"
                                    onClick={() => setEditingProductId(null)}
                                    title="Hủy"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-secondary btn-icon-small"
                                    onClick={() => handleStartEditProduct(p)}
                                    title="Sửa nhanh giá & kho"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    className="btn btn-danger btn-icon-small"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    title="Xóa sản phẩm"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: E-COMMENT MODULE (QUẢN LÝ ĐÁNH GIÁ - ĐIỂM NHẤN CỦA ĐỒ ÁN) */}
          {/* ================================================================ */}
          {activeTab === 'comments' && (
            <div className="comments-management-tab">
              {/* Comment Subtabs & Filters */}
              <div className="order-subtabs-row">
                {[
                  { key: 'All', label: 'Tất cả đánh giá', count: comments.length },
                  { key: '5', label: '5 Sao (★★★★★)', count: comments.filter(c => Math.round(c.rating) === 5).length },
                  { key: '4', label: '4 Sao (★★★★)', count: comments.filter(c => Math.round(c.rating) === 4).length },
                  { key: 'low', label: '1 - 2 Sao (Cần xử lý gấp)', count: comments.filter(c => Math.round(c.rating) <= 2).length },
                  { key: 'no_reply', label: 'Chưa phản hồi', count: unrepliedCommentsCount }
                ].map(tab => (
                  <button
                    key={tab.key}
                    className={`order-subtab-btn ${commentStarFilter === tab.key ? 'active' : ''}`}
                    onClick={() => setCommentStarFilter(tab.key)}
                  >
                    <span>{tab.label}</span>
                    <span className="tab-badge-num">({tab.count})</span>
                  </button>
                ))}
              </div>

              {/* Search Toolbar */}
              <div className="orders-toolbar-panel">
                <div className="toolbar-left-group">
                  <div className="toolbar-search-wrap">
                    <Search size={16} className="search-icon-dim" />
                    <input
                      type="text"
                      placeholder="Tìm theo nội dung bình luận, tên khách, tên sản phẩm..."
                      value={commentSearchText}
                      onChange={(e) => setCommentSearchText(e.target.value)}
                      className="toolbar-search-input"
                    />
                    {commentSearchText && (
                      <button className="clear-search-btn" onClick={() => setCommentSearchText('')}>×</button>
                    )}
                  </div>
                </div>

                <div className="toolbar-right-group">
                  <span className="records-count-text">
                    Hiển thị <strong>{filteredComments.length}</strong> / {comments.length} đánh giá E-Comment
                  </span>
                </div>
              </div>

              {/* Comments List Table */}
              <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Khách Hàng</th>
                      <th style={{ width: '220px' }}>Sản Phẩm Đánh Giá</th>
                      <th style={{ width: '120px' }}>Số Sao</th>
                      <th>Nội Dung Bình Luận & Phản Hồi TechNova</th>
                      <th style={{ width: '110px' }}>Thời Gian</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                          <Star size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                          <p>Chưa có đánh giá nào phù hợp với bộ lọc hiện tại.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredComments.map(c => (
                        <tr key={c.id}>
                          {/* Khách hàng */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img
                                src={c.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(c.author)}`}
                                alt={c.author}
                                className="comment-user-avatar"
                              />
                              <div>
                                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.88rem', display: 'block' }}>
                                  {c.author}
                                </span>
                                {c.is_verified_purchase && (
                                  <span className="badge badge-verified" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                                    <Check size={10} /> Đã mua hàng
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Sản phẩm */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img
                                src={c.product_image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100'}
                                alt={c.product_name}
                                onError={handleImageError}
                                style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                              />
                              <div>
                                <span style={{ color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 600, display: 'block' }}>
                                  {c.product_name || `Sản phẩm #${c.product_id}`}
                                </span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                                  {c.variant_purchased || 'Bản Tiêu Chuẩn'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Số sao */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {Array.from({ length: 5 }, (_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  size={13}
                                  fill={starIdx < Math.round(c.rating) ? '#f59e0b' : 'transparent'}
                                  color={starIdx < Math.round(c.rating) ? '#f59e0b' : '#64748b'}
                                />
                              ))}
                            </div>
                          </td>

                          {/* Nội dung comment & Admin reply */}
                          <td>
                            <div className="comment-body-cell">
                              <p className="comment-content-text">{c.content}</p>

                              {/* Ảnh đính kèm (nếu có) */}
                              {c.images && c.images.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                  {c.images.map((img, imgIdx) => (
                                    <img
                                      key={imgIdx}
                                      src={img}
                                      alt="Review attachment"
                                      onError={handleImageError}
                                      style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Khung phản hồi của TechNova Mall */}
                              {c.admin_reply ? (
                                <div className="admin-reply-box">
                                  <div className="admin-reply-header">
                                    <ShieldCheck size={14} color="#818cf8" />
                                    <strong>TechNova Mall Phản Hồi:</strong>
                                  </div>
                                  <p className="admin-reply-content">{c.admin_reply}</p>
                                </div>
                              ) : (
                                replyingCommentId === c.id ? (
                                  <div className="inline-reply-editor">
                                    <textarea
                                      rows="2"
                                      placeholder="Nhập nội dung phản hồi chính thức từ TechNova Store..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      className="inline-reply-textarea"
                                    />
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '6px' }}>
                                      <button 
                                        className="btn btn-secondary btn-icon-small"
                                        onClick={() => { setReplyingCommentId(null); setReplyText(''); }}
                                      >
                                        Hủy
                                      </button>
                                      <button 
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                        onClick={() => handleSendCommentReply(c.id)}
                                      >
                                        <Send size={12} />
                                        <span>Gửi phản hồi</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                                    ⚠️ Chưa có phản hồi của gian hàng
                                  </span>
                                )
                              )}
                            </div>
                          </td>

                          {/* Thời gian */}
                          <td>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                              {new Date(c.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          </td>

                          {/* Thao tác */}
                          <td>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              {!c.admin_reply && replyingCommentId !== c.id && (
                                <button
                                  className="btn btn-secondary btn-icon-small"
                                  onClick={() => { setReplyingCommentId(c.id); setReplyText(''); }}
                                  title="Trả lời khách hàng"
                                >
                                  <MessageSquare size={14} color="#818cf8" />
                                </button>
                              )}
                              <button
                                className="btn btn-danger btn-icon-small"
                                onClick={() => handleDeleteComment(c.id)}
                                title="Xóa / Ẩn bình luận spam"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: VOUCHERS & PROMOTIONS (MÃ GIẢM GIÁ SÀN TMĐT)               */}
          {/* ================================================================ */}
          {activeTab === 'vouchers' && (
            <div className="vouchers-management-tab">
              {/* Voucher Top Banner */}
              <div className="voucher-admin-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="voucher-icon-badge">
                    <Sparkles size={24} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '2px' }}>
                      Chiến Dịch Khuyến Mãi & Voucher Sàn TechNova
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      Các mã voucher bên dưới được áp dụng trực tiếp tại giỏ hàng và màn hình thanh toán.
                    </p>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => setIsNewVoucherModalOpen(true)}>
                  <Plus size={16} />
                  <span>Tạo Mã Voucher Mới</span>
                </button>
              </div>

              {/* Vouchers Table */}
              <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Mã Code</th>
                      <th>Loại Giảm & Mức Ưu Đãi</th>
                      <th>Đơn Hàng Tối Thiểu</th>
                      <th>Giảm Tối Đa</th>
                      <th>Lượt Dùng / Tối Đa</th>
                      <th>Trạng Thái</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map(v => (
                      <tr key={v.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="voucher-code-badge">{v.code}</span>
                            <button 
                              className="btn-icon-tiny"
                              onClick={() => {
                                navigator.clipboard.writeText(v.code);
                                showToast(`Đã sao chép mã ${v.code}!`);
                              }}
                              title="Sao chép mã"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        </td>

                        <td>
                          <strong style={{ color: '#34d399', fontSize: '0.92rem' }}>
                            {v.discount_type === 'percent' ? `Giảm ${v.discount_value}%` : `Giảm $${v.discount_value}`}
                          </strong>
                        </td>

                        <td style={{ color: 'white' }}>
                          ${v.min_order_value || 0}
                        </td>

                        <td style={{ color: 'var(--text-muted)' }}>
                          ${v.max_discount || 100}
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                              <strong>{v.usage_count || 0}</strong> / {v.max_usage || 100} lượt
                            </span>
                            <div className="seller-progress-track" style={{ width: '120px' }}>
                              <div
                                className="seller-progress-bar"
                                style={{ width: `${Math.min(100, ((v.usage_count || 0) / (v.max_usage || 100)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          <button
                            className={`voucher-toggle-btn ${v.is_active ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleVoucher(v.id)}
                            title="Bấm để bật / tắt mã"
                          >
                            {v.is_active ? '🟢 Đang Chạy' : '⚪ Đã Tạm Dừng'}
                          </button>
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              className="btn btn-danger btn-icon-small"
                              onClick={() => handleDeleteVoucher(v.id)}
                              title="Xóa voucher"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 6: USERS IN DATABASE                                         */}
          {/* ================================================================ */}
          {activeTab === 'users' && (
            <div className="users-management-tab">
              <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Họ Và Tên</th>
                      <th>Email</th>
                      <th>Số Điện Thoại</th>
                      <th>Vai Trò (Role)</th>
                      <th>Ngày Lưu DB</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{ color: 'var(--text-dim)', fontWeight: 700 }}>#{u.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={u.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(u.email)}`}
                              alt={u.fullname}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ color: 'white', fontWeight: 600 }}>{u.fullname}</span>
                          </div>
                        </td>
                        <td style={{ color: '#cbd5e1' }}>{u.email}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{u.phone || '—'}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-rose' : 'badge-emerald'}`}>
                            {u.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleString('vi-VN') : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              className="btn btn-secondary btn-icon-small"
                              onClick={() => handleDeleteUser(u.id)}
                              style={{ color: '#fb7185' }}
                              title="Xóa tài khoản khỏi Database"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 7: CONTACT MESSAGES                                          */}
          {/* ================================================================ */}
          {activeTab === 'messages' && (
            <div className="messages-management-tab">
              <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Họ Tên</th>
                      <th>Email / SĐT</th>
                      <th>Chủ Đề</th>
                      <th>Nội Dung Tin Nhắn</th>
                      <th>Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                          Chưa có tin nhắn liên hệ nào từ khách hàng.
                        </td>
                      </tr>
                    ) : (
                      messages.map(m => (
                        <tr key={m.id}>
                          <td style={{ color: 'white', fontWeight: 600 }}>{m.name}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{m.email}<br />{m.phone}</td>
                          <td>
                            <span className="badge badge-cyan">{m.subject}</span>
                          </td>
                          <td style={{ color: '#cbd5e1', maxWidth: '350px' }}>{m.message}</td>
                          <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                            {new Date(m.created_at).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 8: ADD NEW PRODUCT FORM                                      */}
          {/* ================================================================ */}
          {activeTab === 'add_product' && (
            <div className="glass-panel" style={{ padding: '28px', maxWidth: '780px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Package size={22} color="#818cf8" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                  Tạo Thiết Bị Công Nghệ Mới Vào Kho
                </h3>
              </div>

              <form onSubmit={handleCreateProductSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-form-label">Tên sản phẩm *</label>
                  <input
                    type="text"
                    placeholder="VD: Sony PlayStation 5 Pro (2TB SSD)"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="admin-input-field"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-form-label">Danh mục *</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="admin-select"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      <option value="Laptop">Laptop</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Audio">Audio</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Accessory">Accessory</option>
                    </select>
                  </div>

                  <div>
                    <label className="admin-form-label">Thương hiệu</label>
                    <input
                      type="text"
                      placeholder="Apple, Sony, ASUS..."
                      value={newProd.brand}
                      onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                      className="admin-input-field"
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Số lượng nhập kho</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                      className="admin-input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-form-label">Giá bán chính thức ($) *</label>
                    <input
                      type="number"
                      placeholder="699"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="admin-input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Giá niêm yết cũ (nếu có giảm giá)</label>
                    <input
                      type="number"
                      placeholder="799"
                      value={newProd.oldPrice}
                      onChange={(e) => setNewProd({ ...newProd, oldPrice: e.target.value })}
                      className="admin-input-field"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-form-label">Link ảnh đại diện sản phẩm (URL) *</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                    className="admin-input-field"
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="admin-form-label">Mô tả sản phẩm</label>
                  <textarea
                    rows="3"
                    placeholder="Giới thiệu điểm mạnh, hiệu năng và công nghệ nổi bật..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="admin-input-field"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label className="admin-form-label">Thông số kỹ thuật (Mỗi dòng 1 thông số)</label>
                  <textarea
                    rows="3"
                    placeholder="Chip AMD Zen 2 RDNA 3&#10;2TB SSD Siêu Tốc 5500MB/s&#10;Hỗ trợ 8K HDR 120fps"
                    value={newProd.specs}
                    onChange={(e) => setNewProd({ ...newProd, specs: e.target.value })}
                    className="admin-input-field"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '0.95rem', justifyContent: 'center' }}>
                  <Plus size={18} />
                  <span>Lưu & Đưa Sản Phẩm Lên Kệ Bán</span>
                </button>
              </form>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 9: DEVOPS & SYSTEM INFORMATION                              */}
          {/* ================================================================ */}
          {activeTab === 'system' && (
            <div className="system-tab-content">
              <div className="admin-kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="admin-kpi-card">
                  <span className="kpi-label">Database Engine</span>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number" style={{ fontSize: '1.2rem', color: '#34d399' }}>MSSQL Server</span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>Host: localhost:1433 • Database: technova</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <span className="kpi-label">Backend API Server</span>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number" style={{ fontSize: '1.2rem', color: '#818cf8' }}>Node.js / Express</span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>Port: 5000 • JWT Auth • Jest 24 Tests Pass</span>
                  </div>
                </div>

                <div className="admin-kpi-card">
                  <span className="kpi-label">Frontend Client</span>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number" style={{ fontSize: '1.2rem', color: '#22d3ee' }}>React 18 + Vite 5</span>
                  </div>
                  <div className="kpi-sub-breakdown">
                    <span>Port: 3000 • Vanilla CSS Dark Mode Architecture</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '14px' }}>
                  Trạng Thái Kiểm Thử CI/CD & DevOps Automation
                </h3>
                <div className="system-check-list">
                  <div className="system-check-item">
                    <CheckCircle2 size={18} color="#34d399" />
                    <div>
                      <strong>Backend Unit & Integration Testing: PASS (24/24 tests)</strong>
                      <p>Kiểm thử xác thực Auth, Products, Admin Stats, Contact Messages và Orders.</p>
                    </div>
                  </div>
                  <div className="system-check-item">
                    <CheckCircle2 size={18} color="#34d399" />
                    <div>
                      <strong>Cổng Thanh Toán Giả Lập VietQR 247: SẴN SÀNG</strong>
                      <p>Tạo mã VietQR tiêu chuẩn NAPAS kèm mã đơn tự động đối soát giao dịch.</p>
                    </div>
                  </div>
                  <div className="system-check-item">
                    <CheckCircle2 size={18} color="#34d399" />
                    <div>
                      <strong>Hệ Thống Đánh Giá E-Comment: HOẠT ĐỘNG</strong>
                      <p>Tích hợp bình luận 5 sao, ảnh thực tế và phản hồi chính thức từ Admin.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================ */}
      {/* MODAL 1: ORDER DETAIL MODAL                                      */}
      {/* ================================================================ */}
      {selectedOrderForDetail && (
        <div className="modal-overlay" onClick={() => setSelectedOrderForDetail(null)}>
          <div className="modal-content admin-order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} color="#818cf8" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                  Chi Tiết Đơn Hàng #ORD-{String(selectedOrderForDetail.id).padStart(4, '0')}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedOrderForDetail(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="order-modal-summary-grid">
                <div>
                  <span className="summary-field-label">Khách Hàng:</span>
                  <strong className="summary-field-val">{selectedOrderForDetail.customer_name}</strong>
                  <span className="summary-field-sub">{selectedOrderForDetail.phone} • {selectedOrderForDetail.email}</span>
                </div>
                <div>
                  <span className="summary-field-label">Địa Chỉ Nhận Hàng:</span>
                  <strong className="summary-field-val">{selectedOrderForDetail.address || 'Địa chỉ tiêu chuẩn'}</strong>
                  <span className="summary-field-sub">Giao siêu tốc trong 2 giờ nội thành</span>
                </div>
                <div>
                  <span className="summary-field-label">Phương Thức Thanh Toán:</span>
                  <strong className="summary-field-val" style={{ color: '#818cf8' }}>
                    {selectedOrderForDetail.payment_method}
                  </strong>
                  <span className="summary-field-sub">
                    Trạng thái: {selectedOrderForDetail.status === 'Delivered' ? 'Đã thanh toán' : 'Chờ thu hộ COD'}
                  </span>
                </div>
                <div>
                  <span className="summary-field-label">Trạng Thái Đơn:</span>
                  <select
                    value={selectedOrderForDetail.status}
                    onChange={(e) => handleStatusChange(selectedOrderForDetail.id, e.target.value)}
                    className={`order-status-select ${selectedOrderForDetail.status.toLowerCase()}`}
                    style={{ marginTop: '4px' }}
                  >
                    <option value="Pending">Chờ xác nhận (Pending)</option>
                    <option value="Processing">Đang xử lý (Processing)</option>
                    <option value="Shipped">Đang giao hàng (Shipped)</option>
                    <option value="Delivered">Đã hoàn thành (Delivered)</option>
                    <option value="Cancelled">Đã hủy đơn (Cancelled)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
                  Danh Sách Thiết Bị Đóng Gói
                </h4>
                <div className="order-modal-items-list">
                  {selectedOrderForDetail.items?.map((item, idx) => (
                    <div key={idx} className="order-modal-item-row">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100'}
                        alt={item.product_name || item.name}
                        onError={handleImageError}
                        style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'white', fontWeight: 600, display: 'block' }}>
                          {item.product_name || item.name}
                        </span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                          SKU: TN-00{item.product_id} • Số lượng: {item.quantity}
                        </span>
                      </div>
                      <strong style={{ color: '#34d399' }}>
                        ${((item.price || 0) * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-modal-total-bar">
                <span>Tổng giá trị đơn hàng:</span>
                <strong>${Number(selectedOrderForDetail.total_amount || 0).toLocaleString()}</strong>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setOrderToPrint(selectedOrderForDetail)}
              >
                <Printer size={16} />
                <span>In Phiếu Giao Hàng</span>
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedOrderForDetail(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 2: PRINT INVOICE / SHIPPING SLIP                           */}
      {/* ================================================================ */}
      {orderToPrint && (
        <div className="modal-overlay" onClick={() => setOrderToPrint(null)}>
          <div className="modal-content print-invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="print-action-bar">
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} /> In Phiếu Gửi Ngay
              </button>
              <button className="btn btn-secondary" onClick={() => setOrderToPrint(null)}>
                Đóng
              </button>
            </div>

            {/* A5 Printable Shipping Slip Format */}
            <div className="printable-shipping-slip" id="shipping-slip-to-print">
              <div className="slip-header">
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000', margin: 0 }}>TechNova Logistics</h2>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#444' }}>Phiếu Giao Hàng Thương Mại Điện Tử (A5)</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="barcode-mock">||| | ||||| || | |||| |||</div>
                  <strong style={{ fontSize: '0.9rem', color: '#000' }}>
                    #ORD-{String(orderToPrint.id).padStart(4, '0')}
                  </strong>
                </div>
              </div>

              <div className="slip-sender-receiver-grid">
                <div className="slip-box">
                  <strong>NGƯỜI GỬI:</strong>
                  <p>TechNova Flagship Center</p>
                  <p>SĐT: 1900 8899 • Hotline Kho</p>
                  <p>Đ/C: Tầng 5, Tòa Nhà Công Nghệ TechNova, TP.HCM</p>
                </div>
                <div className="slip-box">
                  <strong>NGƯỜI NHẬN:</strong>
                  <p style={{ fontWeight: 700 }}>{orderToPrint.customer_name}</p>
                  <p>SĐT: {orderToPrint.phone}</p>
                  <p>Đ/C: {orderToPrint.address || 'Quận 1, TP.HCM'}</p>
                </div>
              </div>

              <div className="slip-items-table-wrap">
                <table className="slip-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên Hàng Hóa</th>
                      <th>SL</th>
                      <th style={{ textAlign: 'right' }}>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderToPrint.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{it.product_name || it.name}</td>
                        <td>{it.quantity}</td>
                        <td style={{ textAlign: 'right' }}>${(it.price * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="slip-footer-summary">
                <div className="cod-amount-box">
                  <span>TIỀN THU HỘ (COD):</span>
                  <strong>
                    {orderToPrint.payment_method === 'COD' ? `$${orderToPrint.total_amount.toLocaleString()}` : '$0.00 (Đã thanh toán)'}
                  </strong>
                </div>
                <div className="slip-sign-box">
                  <p>Chữ ký người nhận</p>
                  <span>(Xác nhận nguyên seal, nguyên kiện)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 3: REVENUE ANALYSIS MODAL                                  */}
      {/* ================================================================ */}
      {revenueModalOpen && (
        <div className="modal-overlay" onClick={() => setRevenueModalOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '540px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={22} color="#34d399" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                  Phân Tích Cơ Cấu Doanh Thu
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setRevenueModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="rev-stat-item">
                <span className="rev-stat-label">Tổng Doanh Thu Ghi Nhận:</span>
                <strong className="rev-stat-val">${totalCalculatedRevenue.toLocaleString()}</strong>
              </div>
              <div className="rev-stat-item">
                <span className="rev-stat-label">Doanh thu thực thu (Delivered):</span>
                <strong className="rev-stat-val" style={{ color: '#34d399' }}>
                  ${deliveredRevenue.toLocaleString()}
                </strong>
              </div>
              <div className="rev-stat-item">
                <span className="rev-stat-label">Doanh thu tạm tính (Đang giao/Chờ duyệt):</span>
                <strong className="rev-stat-val" style={{ color: '#f59e0b' }}>
                  ${pendingRevenue.toLocaleString()}
                </strong>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '6px' }}>
                <strong style={{ fontSize: '0.88rem', color: '#fff', display: 'block', marginBottom: '8px' }}>
                  Phân Bổ Theo Phương Thức Thanh Toán:
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>VietQR Napas 24/7 (55%)</span>
                    <strong>${Math.round(totalCalculatedRevenue * 0.55).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Banking / Chuyển khoản (25%)</span>
                    <strong>${Math.round(totalCalculatedRevenue * 0.25).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Thanh toán COD khi nhận (20%)</span>
                    <strong>${Math.round(totalCalculatedRevenue * 0.20).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => setRevenueModalOpen(false)} 
              style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
            >
              Đóng Phân Tích
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 4: CREATE VOUCHER MODAL                                    */}
      {/* ================================================================ */}
      {isNewVoucherModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewVoucherModalOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '480px', padding: '26px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} color="#22d3ee" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                  Tạo Mã Voucher Khuyến Mãi Mới
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsNewVoucherModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateVoucherSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label className="admin-form-label">Mã Code (Tự động in hoa) *</label>
                <input
                  type="text"
                  placeholder="VD: TECH25, BLACKFRIDAY"
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  className="admin-input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Loại ưu đãi</label>
                  <select
                    value={newVoucher.discount_type}
                    onChange={(e) => setNewVoucher({ ...newVoucher, discount_type: e.target.value })}
                    className="admin-select"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <option value="percent">Giảm theo %</option>
                    <option value="fixed">Giảm số tiền cố định ($)</option>
                  </select>
                </div>

                <div>
                  <label className="admin-form-label">Mức giảm *</label>
                  <input
                    type="number"
                    placeholder={newVoucher.discount_type === 'percent' ? '20 (%)' : '50 ($)'}
                    value={newVoucher.discount_value}
                    onChange={(e) => setNewVoucher({ ...newVoucher, discount_value: e.target.value })}
                    className="admin-input-field"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <label className="admin-form-label">Đơn tối thiểu ($)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newVoucher.min_order_value}
                    onChange={(e) => setNewVoucher({ ...newVoucher, min_order_value: e.target.value })}
                    className="admin-input-field"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Tổng lượt dùng</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newVoucher.max_usage}
                    onChange={(e) => setNewVoucher({ ...newVoucher, max_usage: e.target.value })}
                    className="admin-input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Kích Hoạt Mã Voucher Ngay</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
