import React, { useEffect, useState } from 'react';
import FeaturedArticles from '../../Component/featured/FeaturedArticles';
import ForYou from '../../Component/forYou/forYou';
import LatestGrid from '../../Component/grid/LatestGrid';
import LatestNews from '../../Component/LatestNews/LatestNews';
import './home.css'; // Main CSS file for the entire app
import AdBanner from '../../Component/AdBanner/AdBanner';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { fetchTopCategories } from '../../Services/apiService'; // Assuming you have this function

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchTopCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="apps">
      <div className="app">
        <main className="main-content">
          <div></div>
          <div className='grid'>
            <FeaturedArticles postId={2383091} />
            <ForYou />
            <LatestGrid />
          </div>
          {categories.slice(0, 10).map((category, index) => (
            
            <React.Fragment key={category.id}>
              <LatestNews CategoryId={category.id} />
              {(index + 1) % 2 === 0 && (
                <div className='SecAds'>
                  <AdBanner className="2nd" />
                </div>
              )}
            </React.Fragment>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Home;
