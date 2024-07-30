// src/components/PostDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css';
import { fetchPostDetails, fetchUserDetails, fetchCategoryDetails } from '../../Services/apiService';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [error, setError] = useState(null); // State to manage error
  const [showFullDescription, setShowFullDescription] = useState(false); // State to manage full description visibility

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await fetchPostDetails(postId);

        // Fetch author details
        const author = await fetchUserDetails(post.user);

        // Fetch category details
        const categories = await Promise.all(
          post.categories.map(categoryId => fetchCategoryDetails(categoryId))
        );

        setPost({ ...post, author, categories });
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if fetch fails
  }

  if (!post) {
    return <div>No post details available.</div>; // Display message if post details are not available
  }

  return (
    <div className='article-body'>
      <div className="post-details">
        <div className='article-header'>
          <div className="foryou-categories article-cat">
            {post.categories.map(category => (
              <Link key={category.id} to={`/category/${category.id}/posts`} className="category-link postDetailsCat">
                <h5>{category.name}</h5>
              </Link>
            ))}
          </div>
          
          <h1 className='article-title'>{post.title}</h1>
          <p>BY: {post.author.username}</p>
          <p>Date Updated: {formatDate(post.date_updated)}</p>
        </div>
        <img src={post.banner_path} className='article-img' alt={post.title} />
        
        <p className='article-short forYoutext'>
          {showFullDescription ? post.short_description : `${post.short_description.slice(0, 180)}...`}
          <button onClick={toggleDescription}>
            <b> {showFullDescription ? 'close' : 'more'}</b>
          </button>
        </p>
        <div className='post-S'>
          <ul className="social-links ">
            <li>
              <a href="https://www.facebook.com/harvardbusinessreview">
                <i className=" fabP fab fa-facebook-f"></i> Post
              </a>
            </li>
            <li>
              <a href="https://twitter.com/HarvardBiz">
                <i className="fabP fab fa-twitter"></i> X
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/harvard-business-review">
                <i className="fabP fab fa-linkedin-in"></i> Share
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/harvard_business_review/">
                <i className="fabP fab fa-instagram"></i> Instagram
              </a>
            </li>
            <li>
              <a href="/rss">
                <i className="fabP fas fa-rss"></i> Save
              </a>
            </li>
          </ul>
        </div>
        <div className='article-content' dangerouslySetInnerHTML={{ __html: post.content }}></div>
        {/* Add any other details you want to display */}
      </div>
    </div>
  );
};

export default PostDetails;
