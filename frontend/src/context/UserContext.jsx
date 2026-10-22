import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const isAdminUser = (user) => {
  const role = String(user?.role ?? user?.roleName ?? user?.role_name ?? '').toLowerCase();
  return ['admin', 'superadmin'].includes(role) || user?.isAdmin === true || user?.is_admin === true;
};

// --- Standalone mock users storage (only for pure offline demo fallback) ---
let localUsers = [
  {
    id: 1,
    fullname: "Nguyễn Văn Demo",
    email: "demo@technova.com",
    password: "demo123",
    phone: "0987 000 111",
    avatar: "https://i.pravatar.cc/150?img=11",
    role: "user"
  }
];

const userApiLogin = async (email, password) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại!');
    if (data.token) {
      localStorage.setItem('technova_token', data.token);
      if (data.user?.role === 'admin') {
        localStorage.setItem('technova_admin_token', data.token);
      }
    }
    return data;
  } catch (err) {
    // If backend gave an explicit error, rethrow it
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
    // Pure offline fallback if backend server is not running
    const found = localUsers.find(u => u.email === email && u.password === password);
    if (found) {
      return {
        success: true,
        user: { id: found.id, fullname: found.fullname, email: found.email, phone: found.phone, avatar: found.avatar, role: found.role },
        message: `Chào mừng trở lại, ${found.fullname}!`
      };
    }
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }
};

const userApiRegister = async ({ fullname, email, phone, password }) => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, phone, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Đăng ký thất bại từ cơ sở dữ liệu!');
    }
    if (data.token) {
      localStorage.setItem('technova_token', data.token);
      if (data.user?.role === 'admin') {
        localStorage.setItem('technova_admin_token', data.token);
      }
    }
    return data;
  } catch (err) {
    // Don't swallow real database/server errors!
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
    // Only if server is completely unreachable, fallback to local
    console.warn('[Offline Mode] Backend unreachable, saving locally:', err);
    const exists = localUsers.find(u => u.email === email);
    if (exists) throw new Error('Email này đã được đăng ký!');
    if (password.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    const newUser = {
      id: Date.now(),
      fullname,
      email,
      phone: phone || '',
      password,
      role: 'user',
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`
    };
    localUsers.push(newUser);
    return {
      success: true,
      user: { id: newUser.id, fullname: newUser.fullname, email: newUser.email, phone: newUser.phone, avatar: newUser.avatar, role: 'user' },
      message: `Đăng ký thành công! (Chế độ cục bộ)`
    };
  }
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('technova_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('technova_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('technova_user');
      localStorage.removeItem('technova_token');
      localStorage.removeItem('technova_admin_token');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const res = await userApiLogin(email, password);
    setCurrentUser(res.user);
    return res;
  };

  const register = async (formData) => {
    const res = await userApiRegister(formData);
    setCurrentUser(res.user);
    return res;
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem('technova_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ id: currentUser?.id, ...updateData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cập nhật thất bại');
      if (data.user) {
        setCurrentUser(data.user);
      }
      return data;
    } catch (err) {
      console.warn('Update profile online failed, updating local state:', err);
      setCurrentUser(prev => ({ ...prev, ...updateData }));
      return { success: true, message: 'Đã cập nhật thông tin cá nhân!' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      isAuthOpen,
      setIsAuthOpen,
      authMode,
      setAuthMode,
      login,
      register,
      updateProfile,
      logout,
      openAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
