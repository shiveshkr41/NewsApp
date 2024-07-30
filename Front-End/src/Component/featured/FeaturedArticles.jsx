// src/components/FeaturedArticles.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './FeaturedArticles.css';
import { fetchCategoryDetails, fetchPostDetails } from '../../Services/apiService'; // Import the service function

const FeaturedArticles = ({ postId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchPostDetails(postId);
        const categoryResponses = await Promise.all(
          data.categories.map(categoryId => fetchCategoryDetails(categoryId))
        );

        const categories = categoryResponses.map(category => ({
          id: category.id,
          name: category.name
        }));

        setArticle({ ...data, categories });
      } catch (error) {
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
              <a href={`/articles/${article.id}`} className="featuredtext">
                <img src={article.banner_path} alt={article.title} className="card-img article-image" />
                <div className="featured-categories">
                    {article.categories.map(category => (
                      <Link key={category.id} to={`/category/${category.id}/posts`} className="category-link">
                        {category.name}
                      </Link>
                    ))}
                  </div>
                <div className="card-body">
                  <h1 className="featuredTitle">
                    <a className='featuredtext' href={`/articles/${article.id}`}>{article.title}</a>
                  </h1>
                  <p className="forYoutext">{truncateText(article.short_description, 27)}</p>
                  
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
