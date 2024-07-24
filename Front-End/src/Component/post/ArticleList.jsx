import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ArticleList.css';

const LatestNews = ({ fetchUrl }) => {
  const { categoryId } = useParams();
  const location = useLocation();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tl, setPageTitle] = useState("");

  useEffect(() => {
    let url;
    if (location.pathname === "/latest") {
      url = `${fetchUrl}/posts/`;
      
      setPageTitle("Latest Posts");
    } else if (categoryId) {
      url = `${fetchUrl}${categoryId}/posts/`;
      fetch(url)
      .then((response) => response.json())
        .then((categoryData) => {
          setPageTitle(`${categoryData.category.name} Posts`);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }

    if (location.pathname === "/latest"){

    fetch(url)
      .then((response) => response.json())
      
      .then(async (data) => {
        if (Array.isArray(data)) {
          const postsWithAuthors = await Promise.all(data.map(async (post) => {
            const userResponse = await fetch(`${fetchUrl}/users/${post.user}/`);
            const userData = await userResponse.json();
            return { ...post, authorName: userData.username };
          }));
          setLatestPosts(postsWithAuthors);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
    }
    else{
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.posts)) {
          // Map through each post to fetch additional author details
          const postsWithAuthors = data.posts.map(async (post) => {
            const userResponse = await fetch(`http://127.0.0.1:8000/apis/users/${post.user}/`);
            const userData = await userResponse.json();
            post.banner_path = `${'http://127.0.0.1:8000/'}${post.banner_path}`; 
            return { ...post, authorName: userData.username }; // Replace user ID with username
          });
          
          Promise.all(postsWithAuthors).then((postsWithAuthorsData) => {
            setLatestPosts(postsWithAuthorsData.slice(0, 8)); // Set the first 8 posts directly
            setLoading(false);
          });
        } else {
          throw new Error("Invalid data format");
        }
      })
    
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
}}, [fetchUrl, categoryId, location.pathname]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error.message}</p>;

  return (
    <section className="latest-news-page">
      <div className="container">
        <h1 className='thelatest'>{tl}</h1>
        <div className="row">
          {latestPosts.map((article) => (
            <div key={article.id} className="latestp">
              <div className="Latestc">
                <div className='ArticeList-p'>
                <img src={article.banner_path} alt={article.title} className="card-img-top latestimg" />
                <div className="card-body">
                  <h5 className="card-title">
                    <a className='text ArticleList-t' href={`/articles/${article.id}`}>{article.title}</a>
                  </h5>
                  <p className="latest-author">Author: {article.authorName}</p>
                  <p className="latestptext">{truncateText(article.short_description, 50)}</p>
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

// Function to truncate text to a specific number of words
function truncateText(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}

export default LatestNews;
