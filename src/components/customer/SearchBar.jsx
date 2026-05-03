import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-muted-dark pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search restaurants, bakeries, surprise bags..."
        className="input pl-11 pr-10"
        aria-label="Search listings"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted dark:text-muted-dark" />
        </button>
      )}
    </div>
  );
}
