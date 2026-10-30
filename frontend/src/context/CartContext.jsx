import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser, openAuth } = useUser();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('technova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedItemIds, setSelectedItemIds] = useState(() => {
    try {
      const saved = localStorage.getItem('technova_selected_cart_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart
  useEffect(() => {
    try {
      localStorage.setItem('technova_cart', JSON.stringify(cartItems));
      // By default select all if selection is empty or mismatched
      if (cartItems.length > 0 && selectedItemIds.length === 0) {
        const allIds = cartItems.map(item => item.cartItemId || item.id);
        setSelectedItemIds(allIds);
      }
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('technova_selected_cart_ids', JSON.stringify(selectedItemIds));
    } catch {}
  }, [selectedItemIds]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      if (openAuth) openAuth('login');
      return false;
    }

    const cartItemId = `${product.id}-${product.selectedVariant || 'default'}`;
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => (item.cartItemId || item.id) === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { ...product, cartItemId, quantity }];
      }
    });

    setSelectedItemIds(prev => [...new Set([...prev, cartItemId])]);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    return true;
  };

  const updateQuantity = (identifier, delta) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if ((item.cartItemId || item.id) === identifier) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (identifier) => {
    setCartItems(prevItems => prevItems.filter(item => (item.cartItemId || item.id) !== identifier));
    setSelectedItemIds(prev => prev.filter(id => id !== identifier));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const toggleSelectItem = (identifier) => {
    setSelectedItemIds(prev => {
      if (prev.includes(identifier)) {
        return prev.filter(id => id !== identifier);
      } else {
        return [...prev, identifier];
      }
    });
  };

  const toggleSelectAll = () => {
    const allIds = cartItems.map(item => item.cartItemId || item.id);
    if (selectedItemIds.length === cartItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(allIds);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItemIds([]);
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const currentSubtotal = cartItems
      .filter(item => selectedItemIds.includes(item.cartItemId || item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cleanCode === 'TECH10') {
      const deduction = Math.round(currentSubtotal * 0.2); // 20%
      setDiscountCode('TECH10');
      setDiscountAmount(deduction);
      showToast('Áp dụng mã TECH10 giảm 20% thành công!');
      return true;
    } else if (cleanCode === 'FREESHIP') {
      setDiscountCode('FREESHIP');
      setDiscountAmount(15);
      showToast('Áp dụng mã FREESHIP miễn phí vận chuyển $15 thành công!');
      return true;
    } else if (cleanCode === 'MEGA50') {
      if (currentSubtotal < 500) {
        showToast('Mã MEGA50 chỉ áp dụng cho đơn từ $500 trở lên!');
        return false;
      }
      setDiscountCode('MEGA50');
      setDiscountAmount(50);
      showToast('Áp dụng mã MEGA50 giảm $50 thành công!');
      return true;
    } else if (cleanCode === 'VIPTECH') {
      if (currentSubtotal < 1000) {
        showToast('Mã VIPTECH chỉ áp dụng cho đơn từ $1000 trở lên!');
        return false;
      }
      setDiscountCode('VIPTECH');
      setDiscountAmount(100);
      showToast('Áp dụng mã VIPTECH giảm $100 thành công!');
      return true;
    } else {
      showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
      return false;
    }
  };

  // Calculations for selected items
  const selectedCartItems = cartItems.filter(item => selectedItemIds.includes(item.cartItemId || item.id));
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculatedDiscount = Math.min(subtotal, discountAmount);
  const finalTotal = Math.max(0, subtotal - calculatedDiscount);

  return (
    <CartContext.Provider value={{
      cartItems,
      selectedCartItems,
      selectedItemIds,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleSelectItem,
      toggleSelectAll,
      totalItemsCount,
      selectedCount,
      subtotal,
      discountCode,
      discountAmount: calculatedDiscount,
      finalTotal,
      applyPromoCode,
      showToast,
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
