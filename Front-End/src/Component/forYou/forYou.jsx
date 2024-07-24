import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './forYou.css';
<link href="https://db.onlinewebfonts.com/c/74613f6f784f2e332b85076579141743?family=Tiempos+Headline+Bold" rel="stylesheet"></link>
const ForYou = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/apis/posts/')
      .then((response) => response.json())
      .then(async (data) => {
        if (Array.isArray(data)) {
          const postsWithDetails = await Promise.all(
            data.slice(0, 2).map(async (post) => {
              const userResponse = await fetch(`http://127.0.0.1:8000/apis/users/${post.user}/`);
              const userData = await userResponse.json();

              const categoryResponses = await Promise.all(
                post.categories.map(async (categoryId) => {
                  const categoryResponse = await fetch(`http://127.0.0.1:8000/apis/categories/${categoryId}/`);
                  return categoryResponse.json();
                })
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
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error.message}</p>;

  return (
    <section className="forYou">
      <div className="container Gcon">
        <div className="forYourow">
          {latestPosts.map((article, index) => (
            <div className='foryoucard'>
            <div key={article.id} className="col-md-12 hv">
              <div className="CardFoyYou">
              <a href={`/articles/${article.id}`} className="featuredtext">
                {index === 0 && (
                  <img src={article.banner_path} alt={article.title} className="card-img-top" />
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
                  <p className="forYoutext">{truncateText(article.short_description, 19)}</p>
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
