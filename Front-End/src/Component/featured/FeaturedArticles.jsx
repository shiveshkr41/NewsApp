import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FeaturedArticles.css';

const FeaturedArticles = ({ postId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/apis/posts/8/`)
      .then((response) => response.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
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
                <div className="card-body">
                  <h1 className="featuredTitle"><a className='featuredtext' href={`/articles/${article.id}`}>{article.title}</a></h1>
                  <p className="forYoutext">{truncateText(article.short_description, 37)}</p>
                  
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
function truncateText(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}

export default FeaturedArticles;
