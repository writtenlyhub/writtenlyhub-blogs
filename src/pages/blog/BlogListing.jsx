import React, { useState, useEffect } from 'react';
import BlogHero from '../../components/blog/BlogHero';
import BlogCard from '../../components/blog/BlogCard';
import FeaturedBlogCard from '../../components/blog/FeaturedBlogCard';
import wpAPI from '../../utils/api';

const BlogListing = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    tag: '',
    search: '',
    orderby: 'date',
    order: 'desc'
  });
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, tagsData] = await Promise.all([
          wpAPI.getCategories(),
          wpAPI.getTags()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
        
        await loadPosts();
      } catch (err) {
        setError('Failed to load blog data');
        console.error('Initial data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load posts when filters change
  useEffect(() => {
    if (!loading) {
      loadPosts();
    }
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      const params = {
        perPage: 100,
        filters: {
          ...(filters.category && { wh_category: filters.category }),
          ...(filters.tag && { wh_tag: filters.tag }),
          ...(filters.search && { search: filters.search }),
          orderby: filters.orderby,
          order: filters.order,
        }
      };

      const response = await fetch(`${wpAPI.baseURL}/wh_blogs?${new URLSearchParams({
        per_page: params.perPage,
        _embed: true,
        ...params.filters
      })}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const postsData = await response.json();
      const totalPostsCount = parseInt(response.headers.get('X-WP-Total') || '0');
      
      const validatedPosts = postsData.map(post => ({
        ...post,
        title: post.title || { rendered: 'Untitled Post' },
        excerpt: post.excerpt || { rendered: '' },
        slug: post.slug || ''
      }));

      setPosts(validatedPosts);
      setTotalPosts(totalPostsCount);
      setVisiblePosts(10);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Posts load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts(prev => prev + 10);
      setIsLoadingMore(false);
    }, 500);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      tag: '',
      search: '',
      orderby: 'date',
      order: 'desc'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const getSkeletonCount = () => {
    return isMobile ? 6 : 9;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-[95%] md:w-[90%] lg:w-[70%] mx-auto">
        <BlogHero
          categories={categories}
          selectedCategory={filters.category}
          onSelectCategory={(catId) => handleFilterChange({ category: catId })}
          onClearCategory={() => handleFilterChange({ category: '' })}
          searchTerm={filters.search}
          onSearchChange={(term) => handleFilterChange({ search: term })}
        />
        
        <div className="px-2 md:px-4 py-6 md:py-8">
          {loading ? (
            <div className="space-y-8">
              {/* Featured Post Skeleton */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="md:flex">
                  <div className="md:w-1/2 h-64 md:h-80 bg-gray-300"></div>
                  <div className="md:w-1/2 p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
              
              {/* Regular Posts Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[...Array(getSkeletonCount())].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : posts.length > 0 ? (
            <>
              {/* Featured Post - Fully clickable */}
              {posts[0] && visiblePosts > 0 && (
                <div className="mb-12">
                  <div 
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                    onClick={() => window.location.href = `/blog/${posts[0].slug}`}
                  >
                    <FeaturedBlogCard 
                      post={posts[0]} 
                      getCategoryName={getCategoryName}
                    />
                  </div>
                </div>
              )}

              {/* Regular Posts Grid - All cards clickable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {posts.slice(1, visiblePosts).map((post) => (
                  <div 
                    key={post.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                  >
                    <BlogCard post={post} getCategoryName={getCategoryName} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visiblePosts < posts.length && (
                <div className="flex justify-center mt-8 md:mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-orange-500 text-white cursor-pointer rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center min-w-[200px]"
                  >
                    {isLoadingMore ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}

              {/* Posts count info */}
              <div className="text-center mt-4 text-sm text-[#022150] ">
                Showing {Math.min(visiblePosts, posts.length)} of {totalPosts} posts
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No posts found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListing;