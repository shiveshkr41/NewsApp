import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ArticleList.css';
import { fetchPosts, fetchUserDetails, fetchCategoryDetails } from '../../Services/apiService';

const LatestNews = ({ fetchUrl }) => {
  const { categoryId } = useParams();
  const location = useLocation();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tl, setPageTitle] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      let url;
      try {
        if (location.pathname === "/latest") {
          url = `${fetchUrl}/posts/`;
          setPageTitle("Latest Posts");

          const data = await fetchPosts();
          const postsWithAuthors = await Promise.all(data.map(async (post) => {
            const userData = await fetchUserDetails(post.user);
            const categoryResponses = await Promise.all(
              post.categories.map(categoryId => fetchCategoryDetails(categoryId))
            );
            const categories = categoryResponses.map(category => ({
              id: category.id,
              name: category.name
            }));
            post.banner_path = `${post.banner_path.replace(fetchUrl, '')}`;
            return { ...post, authorName: userData.username, categories };
          }));
          setLatestPosts(postsWithAuthors);
        } else if (categoryId) {
          url = `${fetchUrl}${categoryId}/posts/`;
          const categoryData = await fetchCategoryDetails(categoryId);
          setPageTitle(`${categoryData.name} Posts`);

          const data = await fetchPosts();
          const postsWithAuthors = await Promise.all(data.map(async (post) => {
            const userData = await fetchUserDetails(post.user);
            const categoryResponses = await Promise.all(
              post.categories.map(categoryId => fetchCategoryDetails(categoryId))
            );
            const categories = categoryResponses.map(category => ({
              id: category.id,
              name: category.name
            }));
            post.banner_path = `${post.banner_path.replace(fetchUrl, '')}`;
            return { ...post, authorName: userData.username, categories };
          }));
          setLatestPosts(postsWithAuthors.slice(0, 8)); // Set the first 8 posts directly
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadPosts();
  }, [fetchUrl, categoryId, location.pathname]);

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
