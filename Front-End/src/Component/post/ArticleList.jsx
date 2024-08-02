import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ArticleList.css';
import { fetchPosts, fetchCategoryDetails, fetchPostsByCategoryPage} from '../../Services/apiService';

const truncateText = (text, maxWords) => {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
};

const LatestNews = ({ fetchUrl }) => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        let data = [];
        if (location.pathname === "/latest") {
          setPageTitle("Latest Posts");
          const response = await fetchPosts(currentPage);
          data = response.data || [];
          setTotalPages(response.totalPages || 10);
        } else if (categoryId) {
          const categoryData = await fetchCategoryDetails(categoryId);
          setPageTitle(`${categoryData.data.name} Posts`);
          const response = await fetchPostsByCategoryPage(categoryId, currentPage);
          data = response.data || [];
          setTotalPages(response.totalPages || 10);
        }
        if (Array.isArray(data)) {
          const postsWithDetails = await Promise.all(data.map(async (post) => {
            return { ...post, authorName: "userData.username" };
          }));
          setLatestPosts(postsWithDetails);
        } else {
          setError(new Error("No posts available."));
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    loadPosts();
  }, [fetchUrl, categoryId, location.pathname, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      navigate({
        pathname: location.pathname,
        search: `?page=${newPage}`
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page'), 10);
    if (page) {
      setCurrentPage(page);
    }
  }, [location.search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles: {error.message}</p>;

  return (
    <section className="latest-news-page">
      <div className="container">
        <h1 className="thelatest">{pageTitle}</h1>
        <div className="row">
          {latestPosts.map((article) => (
            <div key={article.id} className="latestp">
              <div className="Latestc">
                <div className="ArticeList-p">
                  <img src={article.banner_url} alt={article.title} className="card-img-top latestimg" />
                  <div className="card-body">
                    <h5 className="card-title">
                      <a className="text ArticleList-t" href={`/articles/${article.id}`}>{article.title}</a>
                    </h5>
                    <p className="latestptext">{truncateText(article.short_description, 50)}</p>
                    <p className="card-text">Author: {article.contributors.map(contributor => contributor.name).join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
    </section>
  );
};

export default LatestNews;
