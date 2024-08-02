// src/components/PostDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetails.css';
import { fetchPostDetails } from '../../Services/apiService';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await fetchPostDetails(postId);
        
        // Fetch author details
        
        setPost({ ...post });
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>No post details available.</div>;
  }

  return (
    <div className='article-body'>
      <div className="post-details">
        <div className='article-header'>
          
          
          <h1 className='article-title'>{post.data.title}</h1>
          
          <p>{post.data.contributors[0].name}</p>
          <p>Date Updated: {formatDate(post.data.formatted_last_published_at_datetime)}</p>
        </div>
        <img src={post.data.banner_url} className='article-img' alt={post.title} />
        
        <p className='article-short forYoutext'>
          {post.short_description ? (
            <>
              {showFullDescription ? post.data.short_description : `${post.data.short_description.slice(0, 180)}...`}
              <button onClick={toggleDescription}>
                <b>{showFullDescription ? 'close' : 'more'}</b>
              </button>
            </>
          ) : (
            <span>No short description available.</span>
          )}
        </p>
        <div className='post-S'>
          <ul className="social-linksPost">
            <li>
              <a href="https://www.facebook.com/harvardbusinessreview">
                <i className="fabP fab fa-facebook-f custom-size"></i> Post
              </a>
            </li>
            <li>
              <a href="https://twitter.com/HarvardBiz">
                <i className="fabP fab fa-brands fa-x-twitter"></i> Post
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/harvard-business-review">
                <i className="fabP fab fa-linkedin-in"></i> Share
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/harvard_business_review/">
              <i class="fabP fa-regular fa-floppy-disk"></i> Save
              </a>
            </li>
            <li>
              <a href="/rss">
              <i class="fabP fa-solid fa-print"></i> Print
              </a>
            </li>
          </ul>
        </div>
        <div className='article-content postDC' dangerouslySetInnerHTML={{ __html: post.data.content }}></div>
      </div>
    </div>
  );
};

export default PostDetails;
