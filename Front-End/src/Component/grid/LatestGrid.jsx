import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LatestGrid.css';
import { fetchPosts, fetchUserDetails } from '../../Services/apiService';

const LatestGrid = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        if (Array.isArray(data)) {
          const postsWithAuthors = await Promise.all(data.slice(0, 3).map(async (post) => {
            const userData = await fetchUserDetails(post.user);
            return { ...post, authorName: userData.username };
          }));
          setLatestPosts(postsWithAuthors);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      } catch (error) {
        setError(error);
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
            <div className='gridbd'>
            <div key={article.id} className="col-md-12 mb-4 ">
              
              <div className="CardLatestGrid">
               
                
              <a href={`/articles/${article.id}`} className="featuredtext">
                <div className="card-body">
                  <h5 className="card-title">
                    <h2 className='foryoutitle' href={`/articles/${article.id}`}>{article.title}</h2>
                  </h5>
                  <p className="forYoutext">{truncateText(article.short_description, 14)}</p>
                  
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
function truncateText(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}

export default LatestGrid;
