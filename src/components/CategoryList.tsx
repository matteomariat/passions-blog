import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '../lib/pocketbase';
import type { Category } from '../lib/pocketbase';

// Icons for categories (you can customize these)
const categoryIcons: Record<string, string> = {
  'retrogaming': '🎮',
  'modding': '🔧',
  'vibecoding': '💻',
  'music': '🎵',
  'self-improvement': '🎯',
  'sports': '🏃',
  'ai': '🤖',
  'marketing': '📈',
  'books': '📚',
  'default': '✦',
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-8 w-24 rounded-full bg-[--color-bg-tertiary] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to="/"
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          location.pathname === '/'
            ? 'bg-[--color-text] text-[--color-bg] border-[--color-text]'
            : 'bg-transparent text-[--color-text-secondary] border-[--color-border] hover:border-[--color-text-secondary]'
        }`}
      >
        All
      </Link>
      {categories.map((category) => {
        const icon = categoryIcons[category.slug] || categoryIcons['default'];
        const isActive = location.pathname === `/category/${category.slug}`;
        
        return (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              isActive
                ? 'bg-[--color-text] text-[--color-bg] border-[--color-text]'
                : 'bg-transparent text-[--color-text-secondary] border-[--color-border] hover:border-[--color-text-secondary]'
            }`}
          >
            <span>{icon}</span>
            <span>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
