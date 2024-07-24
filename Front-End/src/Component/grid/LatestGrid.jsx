import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LatestGrid.css';

const LatestGrid = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/apis/posts/')
    .then((response) => response.json())
    .then(async (data) => {
      if (Array.isArray(data)) {
        const postsWithAuthors = await Promise.all(data.slice(0, 3).map(async (post) => {
          const userResponse = await fetch(`http://127.0.0.1:8000/apis/users/${post.user}/`);
          const userData = await userResponse.json();
          return { ...post, authorName: userData.username };
        }));
        setLatestPosts(postsWithAuthors);
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
        
      <div className="container Glat">
      <h5 className='gridhead'>Latest</h5>
        <div className="forYourow">
          {latestPosts.map((article) => (
            <div className='gridbd'>
            <div key={article.id} className="col-md-12 mb-4 hv">
              
              <div className="CardLatestGrid">
               
                
                <div className="card-body">
                  <h5 className="card-title">
                    <h2 className='foryoutitle' href={`/articles/${article.id}`}>{article.title}</h2>
                  </h5>
                  <p className="forYoutext">{truncateText(article.short_description, 18)}</p>
                  
                  <p className="foryou-author">{article.authorName}</p> 
                </div>
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
