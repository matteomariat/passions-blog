import { Link } from 'react-router-dom';
import { getCoverImageUrl } from '../lib/pocketbase';
import type { Article } from '../lib/pocketbase';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const coverUrl = getCoverImageUrl(article);
  const date = new Date(article.publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="group">
      <Link to={`/article/${article.slug}`} className="block">
        {/* Cover image */}
        {coverUrl && (
          <div className="aspect-[16/9] overflow-hidden rounded-lg border border-[--color-border] mb-4 bg-[--color-bg-secondary]">
            <img
              src={coverUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-[--color-text-muted] mb-2">
          <time dateTime={article.publication_date}>{date}</time>
          {article.expand?.category && (
            <>
              <span className="text-[--color-border]">/</span>
              <span className="text-[--color-text-secondary]">
                {article.expand.category.name}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[--color-text] mb-2 group-hover:underline underline-offset-4">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[--color-text-secondary] line-clamp-2">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-mono text-[--color-text-muted] bg-[--color-bg-tertiary] rounded border border-[--color-border]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
