import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { X, Star, Upload } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.jsx';

export default function AddReviewModal({ open, listing, onClose, onSubmit }) {
  const { t, lang } = useI18n();
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [photo, setPhoto] = useState('');
  const [caption, setCaption] = useState('');
  const [vendor, setVendor] = useState('');
  const [price, setPrice] = useState('');
  const fileRef = useRef(null);

  const starLabels = lang === 'ar'
    ? ['', 'ضعيف', 'مقبول', 'جيد', 'رائع', 'ممتاز']
    : ['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing'];

  // Pre-fill from listing when it changes
  useEffect(() => {
    if (listing) {
      setVendor(listing.vendor || '');
      setPrice(String(listing.discountedPrice || ''));
    } else {
      setVendor('');
      setPrice('');
    }
  }, [listing]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const reset = () => {
    setStars(0);
    setHovered(0);
    setPhoto('');
    setCaption('');
    setVendor('');
    setPrice('');
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const handleSubmit = () => {
    if (stars === 0) return;
    onSubmit({
      vendor: vendor || 'Unknown vendor',
      title: listing?.title || '',
      discountedPrice: price || listing?.discountedPrice || 0,
      stars,
      photo,
      caption: caption.trim(),
    });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="review-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            key="review-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
          >
            <button
              onClick={() => { reset(); onClose(); }}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 id="review-title" className="text-xl font-extrabold tracking-tight">{t('review.title')}</h2>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark">{t('review.subtitle')}</p>

            {/* Pre-filled listing chip */}
            {listing ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 text-accent px-3 py-1 text-xs font-semibold">
                {listing.vendor} · {listing.discountedPrice} QAR
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t('review.vendor')}</label>
                  <input
                    className="input"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Leila Restaurant"
                  />
                </div>
                <div>
                  <label className="label">{t('review.price')}</label>
                  <input
                    type="number"
                    className="input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="15"
                    min={0}
                  />
                </div>
              </div>
            )}

            {/* Star rating */}
            <div className="mt-5">
              <label className="label">{t('review.rating')}</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="focus:outline-none"
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        n <= (hovered || stars)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted dark:text-muted-dark'
                      }`}
                    />
                  </button>
                ))}
                {stars > 0 && (
                  <span className="text-sm text-muted dark:text-muted-dark ml-1">
                    {starLabels[stars]}
                  </span>
                )}
              </div>
            </div>

            {/* Photo upload */}
            <div className="mt-5">
              <label className="label">{t('review.photo')}</label>
              <div
                className="relative border-2 border-dashed border-border dark:border-border-dark rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/50 transition-colors bg-bg dark:bg-bg-dark"
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {photo ? (
                  <div className="relative">
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPhoto(''); }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted dark:text-muted-dark" />
                    <p className="text-xs text-muted dark:text-muted-dark text-center">
                      {t('review.photo_cta')}
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Caption */}
            <div className="mt-4">
              <label className="label">{t('review.caption')}</label>
              <textarea
                className="input resize-none"
                rows={3}
                maxLength={200}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={t('review.caption_placeholder')}
              />
              <p className="text-[11px] text-muted dark:text-muted-dark mt-1 text-right">
                {caption.length}/200
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              disabled={stars === 0}
              onClick={handleSubmit}
              className="btn-primary w-full mt-5"
            >
              {t('review.submit')}
            </motion.button>
            <button
              onClick={() => { reset(); onClose(); }}
              className="btn-ghost w-full mt-2 text-sm"
            >
              {t('review.cancel')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
