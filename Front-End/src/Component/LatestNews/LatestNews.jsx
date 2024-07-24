import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LatestNews.css';

const LatestNews = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/apis/posts/');
        const data = await response.json();
        if (Array.isArray(data)) {
          setLatestPosts(data.slice(0, 8)); // Fetch only the latest 8 posts
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authorRequests = latestPosts.map(article =>
          fetch(`http://127.0.0.1:8000/apis/users/${article.user}/`).then(response => response.json())
        );
        const authors = await Promise.all(authorRequests);

        const updatedPosts = latestPosts.map((article, index) => ({
          ...article,
          author: authors[index].username, // Assuming username is the field for author name
        }));

        setLatestPosts(updatedPosts);
      } catch (error) {
        setError(error);
      }
    };

    if (latestPosts.length > 0) {
      fetchAuthors();
    }
  }, [latestPosts.length]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error.message}</p>;

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
