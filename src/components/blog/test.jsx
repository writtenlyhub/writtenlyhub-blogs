// src/components/blog/BlogSuggestions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BlogSuggestions = ({ posts }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFeaturedImageUrl = (post) => {
    if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const getExcerpt = (post) => {
    if (post.excerpt?.rendered) {
      return post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
    }
    return post.content.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link to={`/${post.slug}`} className="block">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={getFeaturedImageUrl(post)}
                    alt={post.title.rendered}
                    className="w-20 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {post.title.rendered}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {getExcerpt(post)}
                  </p>
                  
                  <time className="text-xs text-gray-500" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to="/blogs"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          View All Articles
        </Link>
      </div>
    </section>
  );
};

export default BlogSuggestions;