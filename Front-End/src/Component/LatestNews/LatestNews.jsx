// src/components/LatestNews.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LatestNews.css';
import { fetchPosts, fetchUserDetails } from '../../Services/apiService';

const LatestNews = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const posts = await fetchPosts();
        if (!Array.isArray(posts)) throw new Error("Invalid data format");

        const slicedPosts = posts.slice(0, 8); // Fetch only the latest 8 posts
        const authorRequests = slicedPosts.map(post =>
          fetchUserDetails(post.user)
        );
        const authors = await Promise.all(authorRequests);

        const updatedPosts = slicedPosts.map((post, index) => ({
          ...post,
          author: authors[index].username, // Assuming username is the field for author name
        }));

        setLatestPosts(updatedPosts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error}</p>;

  return (
    <section className="latest-news">
      <div className="container">
        <div className="row">
          {latestPosts.map((article) => (
            <div key={article.id} className="col-md-3 mb-4 LTLN">
              <div className="Home-card">
                <img src={article.banner_path} alt={article.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">
                    <a className="text Latest-Homepage-t" href={`/articles/${article.id}`}>{article.title}</a>
                  </h5>
                  <p className="card-text">Author: {article.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
