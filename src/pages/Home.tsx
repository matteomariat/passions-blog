import { useEffect, useState } from 'react';
import { getArticles } from '../lib/pocketbase';
import type { Article } from '../lib/pocketbase';
import ArticleCard from '../components/ArticleCard';
import CategoryList from '../components/CategoryList';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Hello, I'm <span className="font-mono">Matteo</span>
        </h1>
        <p className="text-lg text-[--color-text-secondary] max-w-2xl">
          I write about my many passions — retrogaming, modding, vibecoding, music, 
          self-improvement, hiking, AI, and everything in between. This is my digital 
          garden where I document, share, and help.
        </p>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <CategoryList />
      </section>

      {/* Articles */}
      <section>
        <h2 className="text-sm font-mono text-[--color-text-muted] uppercase tracking-wider mb-8">
          Latest Posts
        </h2>

        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] rounded-lg bg-[--color-bg-tertiary] mb-4" />
                <div className="h-4 w-32 bg-[--color-bg-tertiary] rounded mb-3" />
                <div className="h-6 w-3/4 bg-[--color-bg-tertiary] rounded mb-2" />
                <div className="h-4 w-full bg-[--color-bg-tertiary] rounded" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[--color-border] rounded-lg">
            <p className="text-[--color-text-muted] font-mono">
              No articles yet. Start writing!
            </p>
            <p className="text-sm text-[--color-text-muted] mt-2">
              Add articles via PocketBase admin at{' '}
              <code className="text-[--color-text-secondary]">http://127.0.0.1:8090/_/</code>
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
