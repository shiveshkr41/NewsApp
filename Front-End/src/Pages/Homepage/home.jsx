import React from 'react';
import FeaturedArticles from '../../Component/featured/FeaturedArticles';
import ForYou from '../../Component/forYou/forYou';
import LatestGrid from '../../Component/grid/LatestGrid';
import LatestNews from '../../Component/LatestNews/LatestNews';
import './home.css'; // Main CSS file for the entire app
import AdBanner from '../../Component/AdBanner/AdBanner';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Home = () => {
  return (
    <div className="apps">
     
      <div className="app">
      <main className="main-content">
        <div></div>
        <div className='grid'>
        <FeaturedArticles postId={8} />
        <ForYou />
        <LatestGrid />
        </div>
        <LatestNews />
        <div className='SecAds'>
        <AdBanner className="2nd"/>
        </div>
        <LatestNews />
      </main>
      </div>
    </div>
  );
};

export default Home;
