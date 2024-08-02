import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './FeaturedArticles.css';
import { fetchPostDetails } from '../../Services/apiService';

const FeaturedArticles = ({ postId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchPostDetails(postId);

        // Ensure data is defined and categories is an array
        const categories = Array.isArray(data.categories) ? data.categories.map(category => ({
          id: category.id,
          name: category.name,
          absolute_url: category.absolute_url,
        })) : [];

        setArticle({ ...data, categories });
      } catch (error) {
        console.error('Error loading article:', error); // Log the error
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading article: {error.message}</p>;

  return (
    <section className="featured-articles">
      <div className="container Featured-Container">
        {article ? (
          <div className="row1">
            <div className="FeaturedRow">
              <a href={article.absolute_url} className="featuredtext">
                <img src={article.data.banner_url} alt={article.data.title} className="card-img article-image" />
                <div className="featured-categories">
                  {article.data.categories.length > 0 ? (
                    <Link key={article.data.categories[0].id} to={article.data.categories[0].absolute_url} className="category-link">
                      {article.data.categories[0].name}
                    </Link>
                  ) : (
                    <span>No categories available</span>
                  )}
                </div>
                <div className="card-body">
                  <h1 className="featuredTitle">
                    <a className='featuredtext' href={`/articles/${article.data.id}`}>{article.data.title}</a>
                  </h1>
                  <p className="forYoutext">{truncateText(article.data.short_description || '', 37)}</p>
                </div>
              </a>
            </div>
          </div>
        ) : (
          <p>No article found</p>
        )}
      </div>
    </section>
  );
};

const truncateText = (text, maxWords) => {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
};

export default FeaturedArticles;
