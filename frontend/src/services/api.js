const API_BASE_URL = '/api';

// Rich Products List for Standalone Mode & Offline Fallback
import { MOCK_PRODUCTS } from './productsData';

let localProducts = [...MOCK_PRODUCTS];
let localMessages = [];

export const getAuthHeaders = () => {
  const token = localStorage.getItem('technova_admin_token') || localStorage.getItem('technova_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper to attempt fetch, or fallback to mock
const fetchOrFallback = async (url, options, fallbackFn) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API Response Error');
    return await res.json();
  } catch (err) {
    console.warn(`[Offline Fallback Mode] Backend unavailable at ${url}. Using local fallback.`, err);
    return fallbackFn();
  }
};

const fetchRequired = async (url, options = {}) => {
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`API trả về dữ liệu không hợp lệ (${res.status})`);
  }
  if (!res.ok) throw new Error(data.error || `Yêu cầu thất bại (${res.status})`);
  return data;
};

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.brand && filters.brand !== 'All') params.append('brand', filters.brand);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.featured) params.append('featured', '1');
  if (filters.flashSale) params.append('flashSale', '1');
  if (filters.minRating) params.append('minRating', filters.minRating);
  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') params.append('minPrice', filters.minPrice);
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') params.append('maxPrice', filters.maxPrice);

  return fetchOrFallback(
    `${API_BASE_URL}/products?${params.toString()}`,
    {},
    () => {
      let result = [...localProducts];
      if (filters.category && filters.category !== 'All') {
        result = result.filter(p => p.category === filters.category);
      }
      if (filters.brand && filters.brand !== 'All') {
        result = result.filter(p => p.brand === filters.brand);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query))
        );
      }
      if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
      if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
      if (filters.minRating) result = result.filter(p => p.rating >= Number(filters.minRating));
      if (filters.flashSale) result = result.filter(p => p.isFlashSale);

      if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
      else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
      else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      else if (filters.sort === 'popular' || filters.sort === 'bestseller') result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      else result.sort((a, b) => b.id - a.id);

      return result;
    }
  );
};

export const fetchCategories = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/categories`,
    {},
    () => ['All', ...new Set(localProducts.map(p => p.category))]
  );
};

export const fetchBrands = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/brands`,
    {},
    () => ['All', ...new Set(localProducts.map(p => p.brand).filter(Boolean))]
  );
};

export const fetchFlashSaleProducts = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/flash-sale`,
    {},
    () => localProducts.filter(p => p.isFlashSale || p.featured === 1)
  );
};

export const fetchProductDetail = async (id) => {
  return fetchOrFallback(
    `${API_BASE_URL}/products/${id}`,
    {},
    () => {
      const prod = localProducts.find(p => p.id === Number(id)) || localProducts[0];
      return { ...prod, comments: prod.comments || [] };
    }
  );
};

export const addProductComment = async (productId, commentData) => {
  return fetchRequired(
    `${API_BASE_URL}/products/${productId}/comments`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    }
  );
};

export const createOrder = async (orderData) => {
  return fetchRequired(
    `${API_BASE_URL}/orders`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }
  );
};

export const processPayment = async (orderId, paymentGateway = 'VietQR') => {
  return fetchRequired(
    `${API_BASE_URL}/orders/${orderId}/pay`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_gateway: paymentGateway })
    }
  );
};

export const fetchAdminStats = async () => {
  return fetchRequired(
    `${API_BASE_URL}/admin/stats`,
    {
      headers: { ...getAuthHeaders() }
    }
  );
};

export const adminLogin = async (username, password) => {
  return fetchRequired(
    `${API_BASE_URL}/admin/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }
  );
};

export const fetchOrders = async () => {
  return fetchRequired(
    `${API_BASE_URL}/orders`,
    {
      headers: { ...getAuthHeaders() }
    }
  );
};

export const updateOrderStatus = async (orderId, status) => {
  return fetchRequired(
    `${API_BASE_URL}/orders/${orderId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    }
  );
};

export const createProduct = async (productData) => {
  return fetchRequired(
    `${API_BASE_URL}/products`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(productData)
    }
  );
};

export const updateProduct = async (productId, productData) => {
  return fetchRequired(
    `${API_BASE_URL}/products/${productId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(productData)
    }
  );
};

export const deleteProduct = async (productId) => {
  return fetchRequired(
    `${API_BASE_URL}/products/${productId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }
  );
};

export const sendContactMessage = async (contactData) => {
  return fetchRequired(
    `${API_BASE_URL}/contact`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    }
  );
};

export const fetchContactMessages = async () => {
  return fetchRequired(
    `${API_BASE_URL}/contact`,
    {
      headers: { ...getAuthHeaders() }
    }
  );
};

export const fetchUsers = async () => {
  return fetchRequired(
    `${API_BASE_URL}/auth/users`,
    {
      headers: { ...getAuthHeaders() }
    }
  );
};

export const deleteUser = async (userId) => {
  return fetchRequired(
    `${API_BASE_URL}/auth/users/${userId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }
  );
};

export const fetchUserOrders = async () => {
  const token = localStorage.getItem('technova_token');
  if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

  return fetchRequired(
    `${API_BASE_URL}/orders/mine`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

export const completeOrder = async (orderId) => {
  return fetchRequired(
    `${API_BASE_URL}/orders/${orderId}/complete`,
    {
      method: 'PUT',
      headers: { ...getAuthHeaders() }
    }
  );
};

export const cancelOrder = async (orderId) => {
  return fetchRequired(
    `${API_BASE_URL}/orders/${orderId}/cancel`,
    {
      method: 'PUT',
      headers: { ...getAuthHeaders() }
    }
  );
};

export const changePassword = async (currentPassword, newPassword) => {
  return fetchRequired(
    `${API_BASE_URL}/auth/change-password`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, newPassword })
    }
  );
};

export const deleteContactMessage = async (messageId) => {
  return fetchRequired(
    `${API_BASE_URL}/contact/${messageId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }
  );
};

// ==========================================
// ADMIN E-COMMENTS & VOUCHERS API
// ==========================================

export const fetchAdminComments = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/admin/comments`,
    { headers: { ...getAuthHeaders() } },
    () => {
      // Fallback comments from all products
      const list = [];
      localProducts.forEach(p => {
        if (p.comments && p.comments.length) {
          p.comments.forEach(c => {
            list.push({
              ...c,
              product_id: p.id,
              product_name: p.name,
              product_image: p.image,
              product_category: p.category
            });
          });
        }
      });
      return list;
    }
  );
};

export const replyAdminComment = async (commentId, admin_reply) => {
  return fetchRequired(
    `${API_BASE_URL}/admin/comments/${commentId}/reply`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ admin_reply })
    }
  );
};

export const deleteAdminComment = async (commentId) => {
  return fetchRequired(
    `${API_BASE_URL}/admin/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }
  );
};

export const fetchAdminVouchers = async () => {
  return fetchOrFallback(
    `${API_BASE_URL}/admin/vouchers`,
    { headers: { ...getAuthHeaders() } },
    () => [
      { id: 1, code: 'TECH10', discount_type: 'percent', discount_value: 20, min_order_value: 50, max_discount: 100, usage_count: 38, max_usage: 200, is_active: 1 },
      { id: 2, code: 'FREESHIP', discount_type: 'fixed', discount_value: 15, min_order_value: 0, max_discount: 15, usage_count: 62, max_usage: 500, is_active: 1 },
      { id: 3, code: 'VIP50', discount_type: 'fixed', discount_value: 50, min_order_value: 300, max_discount: 50, usage_count: 12, max_usage: 50, is_active: 1 }
    ]
  );
};

export const createAdminVoucher = async (voucherData) => {
  return fetchRequired(
    `${API_BASE_URL}/admin/vouchers`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(voucherData)
    }
  );
};

export const toggleAdminVoucher = async (voucherId) => {
  return fetchRequired(
    `${API_BASE_URL}/admin/vouchers/${voucherId}/toggle`,
    {
      method: 'PUT',
      headers: { ...getAuthHeaders() }
    }
  );
};

export const deleteAdminVoucher = async (voucherId) => {
  return fetchRequired(
    `${API_BASE_URL}/admin/vouchers/${voucherId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    }
  );
};


