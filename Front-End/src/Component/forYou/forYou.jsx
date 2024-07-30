// src/components/ForYou.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forYou.css';
import { fetchPosts, fetchUserDetails, fetchCategoryDetails } from '../../Services/apiService';

const ForYou = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchPosts();
        if (Array.isArray(posts)) {
          const postsWithDetails = await Promise.all(
            posts.slice(0, 2).map(async (post) => {
              const userData = await fetchUserDetails(post.user);

              const categoryResponses = await Promise.all(
                post.categories.map(categoryId => fetchCategoryDetails(categoryId))
              );

              const categories = categoryResponses.map(category => ({
                id: category.id,
                name: category.name
              }));

              return { ...post, authorName: userData.username, categories };
            })
          );
          setLatestPosts(postsWithDetails);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error.message}</p>;

  return (
    <section className="forYou">
      <div className="container Gcon">
        <div className="forYourow">
          {latestPosts.map((article, index) => (
            <div key={article.id} className='foryoucard'>
              <div className="col-md-12 hv">
                <div className="CardFoyYou">
                  <a href={`/articles/${article.id}`} className="featuredtext">
                    {index === 0 && (
                      <img src={article.banner_path} alt={article.title} className="card-img-top foryou-img" />
                    )}
                    <div className="foryou-categories">
                      {article.categories.map(category => (
                        <Link key={category.id} to={`/category/${category.id}/posts`} className="category-link">
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <h2 className='foryoutitle'>{article.title}</h2>
                      </h5>
                      <p className="forYoutext">{truncateText(article.short_description, 15)}</p>
                      <p className="foryou-author">{article.authorName}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Function to truncate text to a specific number of words
function truncateText(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}

export default ForYou;
