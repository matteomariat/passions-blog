import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getAllArticles, deleteArticle, isLoggedIn, logout } from '../lib/pocketbase';
import type { Article } from '../lib/pocketbase';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login');
      return;
    }

    getAllArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [navigate]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    
    const success = await deleteArticle(id);
    if (success) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isLoggedIn()) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Articles</h1>
        <div className="flex items-center gap-4">
          <Link to="/admin/new" className="btn-primary inline-flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            New Article
          </Link>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {/* Articles list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[--color-bg-tertiary] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[--color-border] rounded-lg">
          <p className="text-[--color-text-muted] mb-4">No articles yet</p>
          <Link to="/admin/new" className="btn-primary inline-flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="border border-[--color-border] rounded-lg divide-y divide-[--color-border]">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between p-4 hover:bg-[--color-bg-secondary] transition-colors"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium truncate">{article.title}</h3>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      article.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-[--color-text-muted] mt-1">
                  {new Date(article.publication_date).toLocaleDateString()}
                  {article.expand?.category && (
                    <> · {article.expand.category.name}</>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/edit/${article.id}`}
                  className="p-2 text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-bg-tertiary] rounded-lg transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  className="p-2 text-[--color-text-muted] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
