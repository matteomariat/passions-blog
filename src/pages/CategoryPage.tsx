import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getArticles, getCategoryBySlug } from '../lib/pocketbase';
import type { Article, Category } from '../lib/pocketbase';
import ArticleCard from '../components/ArticleCard';
import CategoryList from '../components/CategoryList';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      Promise.all([
        getArticles(undefined, slug),
        getCategoryBySlug(slug),
      ]).then(([articlesData, categoryData]) => {
        setArticles(articlesData);
        setCategory(categoryData);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-[--color-bg-tertiary] rounded mb-4" />
          <div className="h-4 w-64 bg-[--color-bg-tertiary] rounded mb-12" />
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="aspect-[16/9] rounded-lg bg-[--color-bg-tertiary] mb-4" />
                <div className="h-6 w-3/4 bg-[--color-bg-tertiary] rounded mb-2" />
                <div className="h-4 w-full bg-[--color-bg-tertiary] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p className="text-[--color-text-secondary] mb-8">
          The category you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[--color-text-secondary] hover:text-[--color-text]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Header */}
      <section className="mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-[--color-text-muted] hover:text-[--color-text] mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          All posts
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-[--color-text-secondary]">
            {category.description}
          </p>
        )}
      </section>

      {/* Categories */}
      <section className="mb-12">
        <CategoryList />
      </section>

      {/* Articles */}
      <section>
        <h2 className="text-sm font-mono text-[--color-text-muted] uppercase tracking-wider mb-8">
          {articles.length} {articles.length === 1 ? 'Post' : 'Posts'}
        </h2>

        {articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[--color-border] rounded-lg">
            <p className="text-[--color-text-muted] font-mono">
              No articles in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-12">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
