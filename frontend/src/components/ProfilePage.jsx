import React, { useState, useEffect } from 'react';
import {
  UserCircle2, Mail, Phone, ShieldCheck, Edit3, Save, X,
  Camera, Package, LogOut, Key, Star, Clock, CheckCircle2,
  AlertCircle, Truck
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { fetchUserOrders } from '../services/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flex: '1',
    minWidth: '140px'
  }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      background: `${color}22`,
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
    </div>
  </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 0',
    borderBottom: '1px solid var(--border-light)'
  }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '10px',
      background: 'rgba(99,102,241,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={16} color="#818cf8" />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{value || '—'}</div>
    </div>
  </div>
);

export const ProfilePage = ({ navigateTo }) => {
  const { currentUser, logout, openAuth, updateProfile } = useUser();
  const { cartItems } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: currentUser?.fullname || '',
    phone: currentUser?.phone || '',
  });
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'orders' | 'security'
  const [saveMsg, setSaveMsg] = useState('');

  if (!currentUser) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 20px', gap: '20px', textAlign: 'center'
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(99,102,241,0.15)', border: '2px dashed rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'
        }}>
          <UserCircle2 size={36} color="#818cf8" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Bạn chưa đăng nhập</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.6 }}>
          Đăng nhập để xem và quản lý thông tin tài khoản của bạn.
        </p>
        <button className="btn btn-primary" onClick={() => openAuth('login')} style={{ padding: '12px 28px' }}>
          Đăng Nhập Ngay
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const res = await updateProfile({ fullname: editForm.fullname, phone: editForm.phone });
      setSaveMsg(res.message || 'Cập nhật thông tin vào Database thành công!');
      setIsEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Lỗi: ' + err.message);
    }
  };

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (currentUser?.email) {
      setLoadingOrders(true);
      setOrdersError('');
      fetchUserOrders()
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error('Error fetching user orders:', err);
          setOrders([]);
          setOrdersError(err.message);
        })
        .finally(() => setLoadingOrders(false));
    } else {
      setOrders([]);
      setOrdersError('');
    }
  }, [currentUser?.email]);

  const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Đã giao').length;
  const shippingOrders = orders.filter(o => ['Processing', 'Shipping', 'Đang giao', 'Pending'].includes(o.status)).length;
  const rewardPoints = orders.reduce((sum, o) => sum + Math.round(Number(o.total_amount || 0) * 0.1), 0);

  const tabs = [
    { id: 'info', label: 'Thông Tin', icon: UserCircle2 },
    { id: 'orders', label: 'Đơn Hàng', icon: Package },
    { id: 'security', label: 'Bảo Mật', icon: ShieldCheck },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px 0 40px' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
          Tài Khoản Của Tôi
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Quản lý thông tin và theo dõi đơn hàng</p>
      </div>

      {/* Profile Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 60%, #1e1b4b 100%)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.email}`}
              alt={currentUser.fullname}
              style={{
                width: '90px', height: '90px', borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #6366f1',
                boxShadow: '0 0 0 4px rgba(99,102,241,0.2)'
              }}
            />
            <button style={{
              position: 'absolute', bottom: '0', right: '0',
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#6366f1', border: '2px solid #111827',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Camera size={13} color="white" />
            </button>
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {currentUser.fullname}
              </h2>
              <span className={`badge ${currentUser.role === 'admin' ? 'badge-rose' : 'badge-primary'}`}>
                {currentUser.role === 'admin' ? 'Admin' : 'Thành Viên'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              {currentUser.email}
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '6px' }}>
              Tham gia từ tháng 10, 2026
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            {currentUser.role === 'admin' && (
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                onClick={() => navigateTo('/admin')}
              >
                <ShieldCheck size={15} color="#fb7185" />
                <span>Admin Panel</span>
              </button>
            )}
            <button
              className="btn btn-danger"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              onClick={() => { logout(); navigateTo('/'); }}
            >
              <LogOut size={15} />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <StatCard icon={Package} label="Đơn đặt hàng" value={orders.length} color="#818cf8" />
          <StatCard icon={CheckCircle2} label="Đã hoàn thành" value={completedOrders} color="#34d399" />
          <StatCard icon={Truck} label="Đang giao" value={shippingOrders} color="#f59e0b" />
          <StatCard icon={Star} label="Điểm thưởng" value={`${rewardPoints} pts`} color="#f59e0b" />
        </div>
      </div>

      {/* Save Success Banner */}
      {saveMsg && (
        <div style={{
          background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', fontWeight: 600
        }}>
          <CheckCircle2 size={18} /> {saveMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '24px',
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)', padding: '6px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '10px 16px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
              transition: 'all 0.2s ease',
              background: activeTab === tab.id ? '#6366f1' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
            }}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Thông Tin Cá Nhân */}
      {activeTab === 'info' && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)', padding: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Thông Tin Cá Nhân</h3>
            {!isEditing ? (
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={15} />
                <span>Chỉnh Sửa</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  onClick={() => setIsEditing(false)}
                >
                  <X size={15} />
                  <span>Hủy</span>
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  onClick={handleSave}
                >
                  <Save size={15} />
                  <span>Lưu</span>
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div>
              <InfoRow icon={UserCircle2} label="Họ và tên" value={currentUser.fullname} />
              <InfoRow icon={Mail} label="Email" value={currentUser.email} />
              <InfoRow icon={Phone} label="Số điện thoại" value={currentUser.phone} />
              <InfoRow icon={ShieldCheck} label="Vai trò" value={currentUser.role === 'admin' ? 'Quản trị viên' : 'Thành viên'} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { label: 'Họ và tên', key: 'fullname', type: 'text', icon: '👤' },
                { label: 'Số điện thoại', key: 'phone', type: 'tel', icon: '📱' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    {field.icon} {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={editForm[field.key]}
                    onChange={e => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(99,102,241,0.4)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff', fontSize: '0.95rem',
                      outline: 'none', transition: 'all 0.2s'
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  📧 Email (không thể thay đổi)
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-dim)', fontSize: '0.95rem',
                    cursor: 'not-allowed'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Đơn Hàng */}
      {activeTab === 'orders' && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden'
        }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Lịch Sử Đơn Hàng</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              {orders.length} đơn hàng trong tài khoản của bạn
            </p>
          </div>

          {loadingOrders ? (
            <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Đang tải danh sách đơn hàng...
            </div>
          ) : ordersError ? (
            <div style={{ padding: '50px 24px', textAlign: 'center', color: '#fb7185' }}>
              Không thể tải lịch sử đơn hàng: {ordersError}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.35, display: 'block', color: '#818cf8' }} />
              <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '8px' }}>Bạn chưa có đơn hàng nào</h4>
              <p style={{ fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Tài khoản mới tạo chưa phát sinh đơn hàng. Khi bạn mua sắm tại TechNova, toàn bộ lịch sử đơn hàng sẽ được lưu vào cơ sở dữ liệu và hiển thị tại đây.
              </p>
              <button className="btn btn-primary" onClick={() => navigateTo('/')} style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                Khám Phá Cửa Hàng Ngay
              </button>
            </div>
          ) : (
            orders.map((order, i) => {
              const isDelivered = order.status === 'Delivered' || order.status === 'Đã giao';
              const color = isDelivered ? '#34d399' : '#f59e0b';
              const itemCount = order.items?.length || 1;
              return (
                <div key={order.id || i} style={{
                  padding: '20px 28px',
                  borderBottom: i < orders.length - 1 ? '1px solid var(--border-light)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                  transition: 'background 0.2s'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Package size={20} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Đơn hàng #{order.id}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '3px' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : 'Gần đây'} · {itemCount} sản phẩm
                    </div>
                    <div style={{ marginTop: '10px', display: 'grid', gap: '5px' }}>
                      {order.items?.length ? order.items.map((item, itemIndex) => (
                        <div key={item.id || `${item.product_id}-${itemIndex}`} style={{
                          color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5
                        }}>
                          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                            {item.product_name || item.name || `Sản phẩm #${item.product_id}`}
                          </span>
                          {' '}× {item.quantity}
                          {' '}· ${Number(item.price || 0).toLocaleString()} / sản phẩm
                        </div>
                      )) : (
                        <div style={{ color: '#fb7185', fontSize: '0.82rem' }}>
                          Chưa có thông tin sản phẩm trong đơn hàng này.
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>${Number(order.total_amount || 0).toLocaleString()}</div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 10px', borderRadius: 'var(--radius-full)',
                      background: `${color}15`, color,
                      fontSize: '0.75rem', fontWeight: 700, marginTop: '4px'
                    }}>
                      {isDelivered ? <CheckCircle2 size={11} /> : <Truck size={11} />}
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Bảo Mật */}
      {activeTab === 'security' && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)', padding: '28px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>Bảo Mật Tài Khoản</h3>

          {/* Change Password */}
          <div style={{
            padding: '20px', borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Key size={18} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Đổi Mật Khẩu</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Cập nhật mật khẩu định kỳ để bảo vệ tài khoản
                  </div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                onClick={() => openAuth('login')}>
                Thay đổi
              </button>
            </div>
          </div>

          {/* Account Security Status */}
          <div style={{
            padding: '20px', borderRadius: 'var(--radius-md)',
            background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(52,211,153,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#34d399" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>Tài khoản đang được bảo vệ</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Email xác thực đã được liên kết: <strong style={{ color: '#fff' }}>{currentUser.email}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{
            marginTop: '24px', padding: '20px', borderRadius: 'var(--radius-md)',
            background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertCircle size={16} color="#fb7185" />
              <span style={{ fontWeight: 700, color: '#fb7185', fontSize: '0.9rem' }}>Vùng Nguy Hiểm</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
              Đăng xuất khỏi toàn bộ thiết bị. Bạn sẽ cần đăng nhập lại.
            </p>
            <button
              className="btn btn-danger"
              style={{ fontSize: '0.85rem' }}
              onClick={() => { logout(); navigateTo('/'); }}
            >
              <LogOut size={15} />
              <span>Đăng Xuất Toàn Bộ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
