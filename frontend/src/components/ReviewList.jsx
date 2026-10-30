import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle2, MessageCircle, Image as ImageIcon, CornerDownRight, ThumbsUp, Filter } from 'lucide-react';
import { addProductComment } from '../services/api';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export const ReviewList = ({ productId, initialComments = [], variants = [], onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments);
  const [filterTab, setFilterTab] = useState('all'); // all, 5, 4, 3, with-image, verified
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useCart();
  const { currentUser } = useUser();
  const [authorName, setAuthorName] = useState(currentUser?.fullname || '');

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    if (currentUser?.fullname) {
      setAuthorName(currentUser.fullname);
    }
  }, [currentUser]);

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant) {
      setSelectedVariant(`${variants[0].color} - ${variants[0].storage}`);
    }
  }, [variants]);

  // Star Distribution Calculations
  const totalReviews = comments.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalScore = 0;

  comments.forEach(c => {
    const r = Math.min(5, Math.max(1, Math.round(c.rating || 5)));
    ratingCounts[r] = (ratingCounts[r] || 0) + 1;
    totalScore += (c.rating || 5);
  });

  const avgScore = totalReviews > 0 ? (totalScore / totalReviews).toFixed(1) : '5.0';
  const withImagesCount = comments.filter(c => c.images && c.images.length > 0).length;
  const verifiedCount = comments.filter(c => c.isVerifiedPurchase).length;

  // Filtered comments
  const filteredComments = comments.filter(c => {
    if (filterTab === '5') return Math.round(c.rating) === 5;
    if (filterTab === '4') return Math.round(c.rating) === 4;
    if (filterTab === '3') return Math.round(c.rating) <= 3;
    if (filterTab === 'with-image') return c.images && c.images.length > 0;
    if (filterTab === 'verified') return Boolean(c.isVerifiedPurchase);
    return true;
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      showToast('Vui lòng nhập họ tên và nội dung đánh giá!');
      return;
    }

    try {
      setIsSubmitting(true);
      const images = imageUrl.trim() ? [imageUrl.trim()] : [];
      const newComment = await addProductComment(productId, {
        author: authorName.trim(),
        rating,
        content: content.trim(),
        variantPurchased: selectedVariant || 'Bản Tiêu Chuẩn',
        isVerifiedPurchase: true,
        images
      });

      const updated = [newComment, ...comments];
      setComments(updated);
      setContent('');
      setImageUrl('');
      showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!');
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (err) {
      showToast('Lỗi khi gửi đánh giá: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="e-comment-section">
      <div className="e-comment-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageCircle size={22} color="#818cf8" />
          <h3 className="e-comment-title">
            ĐÁNH GIÁ & NHẬN XÉT TỪ KHÁCH HÀNG ({totalReviews})
          </h3>
        </div>
      </div>

      {/* RATING OVERVIEW SCOREBOARD */}
      <div className="rating-overview-box">
        {/* Left: Score */}
        <div className="score-summary-left">
          <div className="score-big">{avgScore}</div>
          <div className="score-out-of">trên 5</div>
          <div className="stars-cluster">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={18}
                fill={s <= Math.round(Number(avgScore)) ? '#f59e0b' : 'none'}
                color={s <= Math.round(Number(avgScore)) ? '#f59e0b' : '#64748b'}
              />
            ))}
          </div>
          <span className="total-review-text">{totalReviews} đánh giá đã xác thực</span>
        </div>

        {/* Right: Breakdown bars 5★ down to 1★ */}
        <div className="rating-bars-right">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = ratingCounts[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : (stars === 5 ? 100 : 0);
            return (
              <div key={stars} className="star-bar-row">
                <span className="bar-label">{stars} ★</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="bar-count">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="comment-filter-tabs">
        <span className="filter-title-label">
          <Filter size={14} /> Lọc xem:
        </span>
        <button
          className={`comment-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          Tất cả ({totalReviews})
        </button>
        <button
          className={`comment-tab-btn ${filterTab === '5' ? 'active' : ''}`}
          onClick={() => setFilterTab('5')}
        >
          5 Sao ({ratingCounts[5]})
        </button>
        <button
          className={`comment-tab-btn ${filterTab === '4' ? 'active' : ''}`}
          onClick={() => setFilterTab('4')}
        >
          4 Sao ({ratingCounts[4]})
        </button>
        <button
          className={`comment-tab-btn ${filterTab === 'with-image' ? 'active' : ''}`}
          onClick={() => setFilterTab('with-image')}
        >
          Có hình ảnh ({withImagesCount})
        </button>
        <button
          className={`comment-tab-btn ${filterTab === 'verified' ? 'active' : ''}`}
          onClick={() => setFilterTab('verified')}
        >
          Đã mua hàng ({verifiedCount})
        </button>
      </div>

      {/* FORM: VIẾT ĐÁNH GIÁ MỚI */}
      <form onSubmit={handleSubmitComment} className="review-input-card">
        <h4 className="review-form-title">
          Viết đánh giá của bạn về sản phẩm này
        </h4>

        <div className="form-row-grid">
          <div>
            <label className="form-label">Họ và tên của bạn</label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Phân loại bạn đã mua / sở hữu</label>
            {variants && variants.length > 0 ? (
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="form-input"
              >
                {variants.map(v => (
                  <option key={v.sku} value={`${v.color} - ${v.storage}`}>
                    {v.color} - {v.storage} (${v.price})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="VD: Titanium Tự Nhiên - 256GB"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="form-input"
              />
            )}
          </div>
        </div>

        {/* Rating Select */}
        <div style={{ marginBottom: '14px' }}>
          <label className="form-label">Chất lượng sản phẩm (Đánh giá sao)</label>
          <div className="star-select-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="star-click-btn"
                onClick={() => setRating(star)}
              >
                <Star
                  size={24}
                  fill={star <= rating ? '#f59e0b' : 'none'}
                  color={star <= rating ? '#f59e0b' : '#64748b'}
                />
              </button>
            ))}
            <span className="star-rating-hint">
              {rating === 5 && 'Tuyệt vời, cực kỳ hài lòng!'}
              {rating === 4 && 'Hài lòng, chất lượng tốt'}
              {rating === 3 && 'Bình thường, tạm được'}
              {rating === 2 && 'Chưa hài lòng'}
              {rating === 1 && 'Rất tệ'}
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div style={{ marginBottom: '14px' }}>
          <label className="form-label">Chi tiết nhận xét (Đánh giá tính năng, trải nghiệm thực tế)</label>
          <textarea
            rows={3}
            placeholder="Hãy chia sẻ cảm nhận về hiệu năng, độ hoàn thiện, thời lượng pin, tốc độ giao hàng 2H..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input form-textarea"
            required
          />
        </div>

        {/* Image upload link */}
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">
            <ImageIcon size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Đính kèm link ảnh thực tế (tùy chọn)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/... hoặc link ảnh của bạn"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
        >
          <Send size={16} />
          <span>{isSubmitting ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá Ngay'}</span>
        </button>
      </form>

      {/* COMMENT LIST */}
      <div className="comment-feed">
        {filteredComments.length === 0 ? (
          <div className="empty-comment-notice">
            <MessageCircle size={32} color="#64748b" />
            <p>Chưa có đánh giá nào phù hợp với bộ lọc đã chọn.</p>
          </div>
        ) : (
          filteredComments.map((c, index) => (
            <div key={c.id || index} className="comment-item-card">
              {/* Header: User avatar + info */}
              <div className="comment-item-header">
                <img
                  src={c.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(c.author)}`}
                  alt={c.author}
                  className="comment-author-avatar"
                />

                <div className="comment-author-meta">
                  <div className="comment-name-row">
                    <span className="comment-author-name">{c.author}</span>
                    {c.isVerifiedPurchase && (
                      <span className="badge-verified-buyer">
                        <CheckCircle2 size={12} />
                        <span>Đã mua tại TechNova</span>
                      </span>
                    )}
                  </div>

                  {/* Stars + Variant info */}
                  <div className="comment-rating-line">
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={s <= (c.rating || 5) ? '#f59e0b' : 'none'}
                          color={s <= (c.rating || 5) ? '#f59e0b' : '#4b5563'}
                        />
                      ))}
                    </div>
                    {c.variantPurchased && (
                      <span className="comment-purchased-variant">
                        • Phân loại: <strong>{c.variantPurchased}</strong>
                      </span>
                    )}
                    <span className="comment-date-text">
                      • {new Date(c.created_at || Date.now()).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <div className="comment-content-body">
                <p>{c.content}</p>

                {/* Attached real photos */}
                {c.images && c.images.length > 0 && (
                  <div className="comment-photo-gallery">
                    {c.images.map((imgUrl, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={imgUrl}
                        alt="Ảnh thực tế từ khách hàng"
                        className="comment-real-photo"
                        onClick={() => window.open(imgUrl, '_blank')}
                        title="Click để phóng to ảnh"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Shop / Admin Response Box */}
              {c.adminReply && (
                <div className="admin-reply-box">
                  <div className="admin-reply-title">
                    <CornerDownRight size={14} color="#818cf8" />
                    <strong>Phản Hồi Từ TechNova Store:</strong>
                  </div>
                  <p className="admin-reply-content">{c.adminReply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
