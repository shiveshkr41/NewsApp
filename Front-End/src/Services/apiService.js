// src/Services/apiService.js

const API_URL = 'https://cds-beta.thepublive.com/publisher/2344';

const fetchPosts = async (page=1) => {
  try {
    console.log("call post")
    const response = await fetch(`${API_URL}/latest-posts/article/?page=${page}`);
    // ?page=${page}/
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
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
  const response = await fetch(`${API_URL}/category/${categoryId}/`);
  if (!response.ok) throw new Error(`Failed to fetch category: ${response.statusText}`);
  return response.json();
};
const fetchTopCategories = async () => {
  const response = await fetch(`${API_URL}/categories/`);
  return response.json();
};
// New function to fetch posts by category
const fetchPostsByCategoryPage = async (categoryId,page=1) => {
  try {
    console.log("call post")
    const response = await fetch(`${API_URL}/posts_by_category/${categoryId}/?page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // Rethrow the error to be caught in the component
  }
};
const fetchPostsByCategory = async (categoryId) => {
  try {
    console.log("call post")
    const response = await fetch(`${API_URL}/posts_by_category/${categoryId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // Rethrow the error to be caught in the component
  }
};

export { fetchPosts, fetchPostDetails, fetchUserDetails, fetchCategoryDetails,fetchTopCategories, fetchPostsByCategory,fetchPostsByCategoryPage };
