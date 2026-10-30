export const FALLBACK_TECH_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';

export const handleImageError = (e) => {
  if (e && e.target) {
    e.target.onerror = null;
    e.target.src = FALLBACK_TECH_IMAGE;
  }
};
