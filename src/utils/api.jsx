// src/utils/api.js
const API_BASE_URL = 'https://www.writtenlyhub.com/wp-json/wp/v2';

class WordPressAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async fetchAPI(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all posts with pagination and filters
  async getAllPosts(params = {}) {
    const queryParams = new URLSearchParams({
      per_page: params.perPage || 10,
      page: params.page || 1,
      _embed: true,
      ...params.filters,
    });

    const endpoint = `/wh_blogs?${queryParams}`;
    return this.fetchAPI(endpoint);
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    const endpoint = `/wh_blogs?slug=${slug}&_embed=true`;
    const posts = await this.fetchAPI(endpoint);
    return posts[0] || null;
  }

  // Get categories
  async getCategories() {
    return this.fetchAPI('/wh_category?per_page=100');
  }

  // Get tags
  async getTags() {
    return this.fetchAPI('/wh_tag?per_page=100');
  }

  // Search posts
  async searchPosts(searchTerm, params = {}) {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      per_page: params.perPage || 10,
      page: params.page || 1,
      _embed: true,
    });

    const endpoint = `/wh_blogs?${queryParams}`;
    return this.fetchAPI(endpoint);
  }

  // Get posts by category
  async getPostsByCategory(categoryId, params = {}) {
    const queryParams = new URLSearchParams({
      wh_category: categoryId,
      per_page: params.perPage || 10,
      page: params.page || 1,
      _embed: true,
    });

    const endpoint = `/wh_blogs?${queryParams}`;
    return this.fetchAPI(endpoint);
  }

  // Get posts by tag
  async getPostsByTag(tagId, params = {}) {
    const queryParams = new URLSearchParams({
      wh_tag: tagId,
      per_page: params.perPage || 10,
      page: params.page || 1,
      _embed: true,
    });

    const endpoint = `/wh_blogs?${queryParams}`;
    return this.fetchAPI(endpoint);
  }

  // Get related posts (by category)
  async getRelatedPosts(postId, categoryIds = [], limit = 3) {
    const queryParams = new URLSearchParams({
      wh_category: categoryIds.join(','),
      exclude: postId,
      per_page: limit,
      _embed: true,
    });

    const endpoint = `/wh_blogs?${queryParams}`;
    return this.fetchAPI(endpoint);
  }

  // Get recent posts
  async getRecentPosts(limit = 5) {
    const queryParams = new URLSearchParams({
      per_page: limit,
      orderby: 'date',
      order: 'desc',
      _embed: true,
    });

    const endpoint = `/wh_blogs?${queryParams}`;
    return this.fetchAPI(endpoint);
  }
}

// Create singleton instance
const wpAPI = new WordPressAPI();
export default wpAPI;