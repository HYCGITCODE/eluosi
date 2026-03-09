/**
 * API Service for AI News Pulse
 * Handles all API communications with the backend
 */

const BASE_URL = '/api'

/**
 * Fetch news list from API
 * @param {Object} options - Request options
 * @param {number} options.page - Page number (not used in MVP, all news returned)
 * @param {string} options.source - Filter by source
 * @returns {Promise<{news: Array, hasMore: boolean}>}
 */
export async function fetchNews({ page = 1, source } = {}) {
  const params = new URLSearchParams()
  if (page) params.append('page', page)
  if (source) params.append('source', source)
  
  const url = source && source !== 'all' 
    ? `${BASE_URL}/news/${source}`
    : `${BASE_URL}/news?${params.toString()}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  
  // Adapt backend response format {success, count, data} to frontend format {news, hasMore}
  // Also map backend field names (link, description) to frontend (url, summary)
  const rawNews = data.data || data.news || data.items || []
  const mappedNews = rawNews.map(item => ({
    ...item,
    url: item.url || item.link,
    summary: item.summary || item.description
  }))
  
  return {
    news: mappedNews,
    hasMore: false // MVP: all news returned at once, no pagination
  }
}

/**
 * Refresh news data
 * @returns {Promise<{success: boolean, count: number}>}
 */
export async function refreshNews() {
  const response = await fetch(`${BASE_URL}/news/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

/**
 * Error handler for API calls
 * @param {Error} error - The error to handle
 * @returns {string} User-friendly error message
 */
export function handleApiError(error) {
  console.error('API Error:', error)
  
  if (error.message.includes('Failed to fetch')) {
    return '网络连接失败，请检查网络后重试'
  }
  
  if (error.message.includes('404')) {
    return 'API 接口不存在'
  }
  
  if (error.message.includes('500')) {
    return '服务器错误，请稍后重试'
  }
  
  return error.message || '操作失败，请重试'
}
