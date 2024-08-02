import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forYou.css';
import { fetchPosts } from '../../Services/apiService';

const ForYou = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchPosts();
        console.log('Fetched posts:', posts.data); // Log the fetched posts

        if (Array.isArray(posts.data)) {
          const postsToDisplay = posts.data.slice(5, 7); // Limit to the first two posts
          setLatestPosts(postsToDisplay);
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
          {latestPosts.map((article) => {
            // Extract categories
           
            return (
              <div key={article.id} className='foryoucard'>
                <div className="col-md-12 hv">
                  <div className="CardFoyYou">
                    <Link to={`/articles/${article.id}`} className="featuredtext">
                      <img src={article.banner_url} alt={article.title} className="card-img-top foryou-img" />
                      <div className="foryou-categories">
                        {article.primary_category.name.length > 0 ? (
                          <Link key={article.primary_category.id} to={article.primary_category.absolute_url} className="category-link">
                            {article.primary_category.name}
                          </Link>
                        ) : (
                          <span>No categories available</span>
                        )}
                      </div>
                      <div className="card-body">
                      
                      
                        <h5 className="card-title">
                          <h2 className='foryoutitle'>{truncateText(article.title || '', 7  )}</h2>
                        </h5>
                        <p className="card-text">Author: {article.contributors.map(contributor => contributor.name).join(', ')}</p>
                        <p className="forYoutext">{truncateText(article.content || '', 20)}</p>
                      </div>
                    </Link>
                    
                  </div>
                </div>
              </div>
            );
          })}
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
