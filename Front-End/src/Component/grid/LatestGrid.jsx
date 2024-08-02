import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LatestGrid.css';
import { fetchPosts } from '../../Services/apiService';

const LatestGrid = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(1);
        console.log('Fetched posts:', data); // Log fetched posts

        if (Array.isArray(data.data)) {
          const postsToDisplay = data.data.slice(0, 4); // Limit to the first three posts
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
      <div className="container Glat">
        <h5 className='gridhead'>Latest</h5>
        <div className="forYourow">
          {latestPosts.map((article) => (
            
            <div key={article.id} className='gridbd'>
              <div className="col-md-12 mb-4">
                <div className="CardLatestGrid">
                  <a href={`/articles/${article.id}`} className="featuredtext">
                    <div className="card-body">
                      <h5 className="card-title">
                        <h2 className='foryoutitle'>{truncateText(article.title || '', 6)}</h2>
                      </h5>
                       <div>Author: {article.contributors[0].name}</div>
                      
                       <p className="forYoutext">{truncateText(article.content || 'No short description available.', 27)}</p>
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

function truncateText(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}

export default LatestGrid;
