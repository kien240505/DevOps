import React, { useState } from 'react';
import { X, Star, CheckCircle, Package, Sparkles } from 'lucide-react';
import { addProductComment } from '../services/api';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const QUICK_TAGS = [
  '⭐ Chất lượng vượt mong đợi',
  '🚀 Giao hàng siêu tốc',
  '📦 Đóng gói rất cẩn thận',
  '💯 Đúng như mô tả',
  '🔥 Rất đáng tiền, sẽ ủng hộ tiếp'
];

const RATING_LABELS = {
  1: '1 sao - Rất tệ',
  2: '2 sao - Không hài lòng',
  3: '3 sao - Bình thường',
  4: '4 sao - Hài lòng',
  5: '5 sao - Rất hài lòng & Tuyệt vời'
};

export const OrderReviewModal = ({ isOpen, onClose, order, item, onReviewSuccess }) => {
  if (!isOpen || !item) return null;

  const { currentUser } = useUser();
  const { showToast } = useCart();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = (tag) => {
    if (content.includes(tag)) return;
    setContent(prev => (prev ? `${prev} · ${tag}` : tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá của bạn!');
      return;
    }

    try {
      setSubmitting(true);
      const author = currentUser?.fullname || order?.customer_name || 'Khách hàng TechNova';
      const avatar = currentUser?.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(author)}`;

      const newComment = await addProductComment(item.product_id, {
        author,
        rating,
        content: content.trim(),
        avatar
      });

      showToast(`Đã gửi đánh giá 5★ cho sản phẩm "${item.product_name || item.name}" thành công!`);
      if (onReviewSuccess) {
        onReviewSuccess({
          orderId: order.id,
          productId: item.product_id,
          rating,
          content: content.trim(),
          comment: newComment
        });
      }
      onClose();
    } catch (err) {
      showToast('Lỗi khi gửi đánh giá: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          padding: '28px',
          border: '1px solid var(--border-accent)',
          boxShadow: 'var(--shadow-glow)'
        }}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Star size={26} color="#f59e0b" fill="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Đánh Giá Sản Phẩm
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Đơn hàng #{order?.id} · Hãy chia sẻ cảm nhận của bạn để cộng đồng cùng tham khảo
          </p>
        </div>

        {/* Product preview card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px',
            background: 'rgba(99,102,241,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Package size={22} color="#818cf8" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700, color: '#fff', fontSize: '0.95rem',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {item.product_name || item.name || `Sản phẩm #${item.product_id}`}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
              Số lượng: {item.quantity} · ${Number(item.price || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating Section */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              Chất lượng sản phẩm
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transform: activeRating >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star
                    size={32}
                    fill={activeRating >= star ? '#f59e0b' : 'none'}
                    color={activeRating >= star ? '#f59e0b' : '#4b5563'}
                  />
                </button>
              ))}
            </div>
            <div style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#f59e0b',
              marginTop: '6px',
              minHeight: '20px'
            }}>
              {RATING_LABELS[activeRating]}
            </div>
          </div>

          {/* Quick Tags */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={14} color="#818cf8" /> Gợi ý nhận xét nhanh:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  style={{
                    background: content.includes(tag) ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                    border: content.includes(tag) ? '1px solid #818cf8' : '1px solid var(--border-light)',
                    color: content.includes(tag) ? '#a5b4fc' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Textarea */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
              Nội dung đánh giá chi tiết
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm chân thực của bạn về chất lượng sản phẩm, độ hoàn thiện, tốc độ giao hàng..."
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>Đánh giá từ tài khoản: <strong style={{ color: '#fff' }}>{currentUser?.fullname || 'Bạn'}</strong></span>
              <span>{content.length} ký tự</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !content.trim()}
              style={{ padding: '10px 24px', fontSize: '0.88rem' }}
            >
              <CheckCircle size={16} />
              <span>{submitting ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
