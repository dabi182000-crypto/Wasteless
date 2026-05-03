import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

// Theme-aware Wasteless logo. Falls back to the Lucide leaf inside a red square
// if the PNG asset hasn't been dropped into public/ yet.
export default function Logo({ size = 40, className = '' }) {
  const { theme } = useTheme();
  const src = theme === 'dark' ? '/logo-white.png' : '/logo-red.png';
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`rounded-2xl bg-accent flex items-center justify-center shadow-glow ${className}`}
        style={{ width: size, height: size }}
      >
        <Leaf className="text-white" style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Wasteless"
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
