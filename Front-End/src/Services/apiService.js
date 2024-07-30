// src/services/apiService.js
const API_URL = 'http://127.0.0.1:8000/apis';

const fetchPosts = async () => {
    const response = await fetch(`${API_URL}/posts/`);
    if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
    return response.json();
  };
  
const fetchPostDetails = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}/`);
  if (!response.ok) throw new Error(`Failed to fetch post: ${response.statusText}`);
  return response.json();
};

const fetchUserDetails = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/`);
  if (!response.ok) throw new Error(`Failed to fetch user: ${response.statusText}`);
  return response.json();
};

const fetchCategoryDetails = async (categoryId) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}/`);
  if (!response.ok) throw new Error(`Failed to fetch category: ${response.statusText}`);
  return response.json();
};

export {fetchPosts, fetchPostDetails, fetchUserDetails, fetchCategoryDetails };
