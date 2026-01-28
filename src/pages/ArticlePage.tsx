import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getArticleBySlug, getCoverImageUrl } from '../lib/pocketbase';
import type { Article } from '../lib/pocketbase';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug).then((data) => {
        setArticle(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-[--color-bg-tertiary] rounded mb-8" />
          <div className="h-10 w-3/4 bg-[--color-bg-tertiary] rounded mb-4" />
          <div className="h-4 w-48 bg-[--color-bg-tertiary] rounded mb-8" />
          <div className="aspect-[16/9] bg-[--color-bg-tertiary] rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-[--color-bg-tertiary] rounded" />
            <div className="h-4 w-full bg-[--color-bg-tertiary] rounded" />
            <div className="h-4 w-2/3 bg-[--color-bg-tertiary] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <p className="text-[--color-text-secondary] mb-8">
          The article you're looking for doesn't exist.
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

  const coverUrl = getCoverImageUrl(article);
  const date = new Date(article.publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      {/* Back link */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm text-[--color-text-muted] hover:text-[--color-text] mb-8 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to all posts
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-[--color-text-muted]">
          <time dateTime={article.publication_date}>{date}</time>
          {article.expand?.category && (
            <>
              <span className="text-[--color-border]">·</span>
              <Link 
                to={`/category/${article.expand.category.slug}`}
                className="text-[--color-text-secondary] hover:text-[--color-text]"
              >
                {article.expand.category.name}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Cover image */}
      {coverUrl && (
        <div className="aspect-[16/9] overflow-hidden rounded-lg border border-[--color-border] mb-8">
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="article-content">
        <MarkdownRenderer content={article.content} />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[--color-border]">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-mono text-[--color-text-muted] bg-[--color-bg-tertiary] rounded-full border border-[--color-border]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
