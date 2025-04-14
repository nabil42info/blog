import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center text-gray-600">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-600">
        <h1 className="text-3xl font-bold mb-4">Recent Articles</h1>
        <p>No articles yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Recent Articles</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {article.content}
            </p>
            <div className="text-sm text-gray-500">
              By {article.profiles.username} •{' '}
              {new Date(article.created_at).toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}