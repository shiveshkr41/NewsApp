import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LatestNews.css';
import { fetchPostsByCategory, fetchCategoryDetails } from '../../Services/apiService';

const LatestNews = ({ CategoryId }) => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryResponse = await fetchCategoryDetails(CategoryId);
        setCategoryName(categoryResponse.data.name);
      } catch (error) {
        setError(`Failed to fetch category name: ${error.message}`);
      }
    };

    const fetchPostsData = async () => {
      try {
        const response = await fetchPostsByCategory(CategoryId);

        if (!Array.isArray(response.data)) throw new Error("Invalid data format");

        const slicedPosts = response.data.slice(0, 4); // Fetch only the latest 4 posts
        setLatestPosts(slicedPosts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
    fetchPostsData();
  }, [CategoryId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error}</p>;
  return (
    <section className="latest-news">
      <div className="containe">
        <h2>{categoryName}</h2> {/* Display the category name */}
        <div className="row">
          {latestPosts.map((article) => (
            <div key={article.id} className="col-md-3 mb-4 LTLN">
              <div className="Home-card">
                <img src={article.banner_url} alt={article.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">
                    <a className="text Latest-Homepage-t" href={`/articles/${article.id}`}>{article.title}</a>
                  </h5>
                  <p className="card-text">Author: {article.contributors.map(contributor => contributor.name).join(', ')}</p>
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
