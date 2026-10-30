import React from 'react';
import { X, GitCompare, Check, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

export const CompareModal = ({ baseProduct, allProducts, onClose, onSelectProduct }) => {
  const { addToCart } = useCart();
  if (!baseProduct) return null;

  // Find 1 or 2 similar products in same category
  const similarProducts = allProducts
    .filter(p => p.id !== baseProduct.id && (p.category === baseProduct.category || p.brand === baseProduct.brand))
    .slice(0, 2);

  const comparedList = [baseProduct, ...similarProducts];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-compare-custom" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Đóng">
          <X size={20} />
        </button>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <GitCompare size={24} color="#818cf8" />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', margin: 0 }}>
                So Sánh Chi Tiết Sản Phẩm Cùng Phân Khúc
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                So sánh thông số kỹ thuật, cấu hình, mức giá và đánh giá từ khách hàng
              </span>
            </div>
          </div>

          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Đặc điểm</th>
                  {comparedList.map((p) => (
                    <th key={p.id} style={{ width: `${78 / comparedList.length}%` }}>
                      <div className="compare-card-head">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="compare-thumb-img" 
                          onError={handleImageError} 
                        />
                        <span className="compare-brand-tag">{p.brand || 'TechNova'}</span>
                        <h4 className="compare-product-name">{p.name}</h4>
                        <div className="compare-price-val">${p.price.toLocaleString()}</div>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', marginTop: '6px' }}
                          onClick={() => {
                            addToCart(p, 1);
                          }}
                        >
                          <ShoppingCart size={13} />
                          <span>Thêm giỏ</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="compare-row-title">Đánh giá sao</td>
                  {comparedList.map(p => (
                    <td key={p.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <strong>{p.rating} / 5</strong>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>({p.ratingCount || 45})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-row-title">Lượt đã bán</td>
                  {comparedList.map(p => (
                    <td key={p.id}>
                      <span style={{ color: '#22d3ee', fontWeight: 700 }}>{p.soldCount || 120} sản phẩm</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-row-title">Thông số nhanh</td>
                  {comparedList.map(p => (
                    <td key={p.id}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(p.quickSpecs || []).map((s, idx) => (
                          <span key={idx} className="spec-pill">{s}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-row-title">Tất cả thông số</td>
                  {comparedList.map(p => (
                    <td key={p.id}>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {(p.specs || []).map((s, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                            <Check size={12} color="#34d399" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-row-title">Bảo hành</td>
                  {comparedList.map(p => (
                    <td key={p.id}>12 Tháng Chính Hãng (1 đổi 1 30 ngày)</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
