import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Homepage/home';
import AdBanner from './Component/AdBanner/AdBanner';
import Header from './Component/header/header';
import Navigation from './Component/nav/Navigation';
import Footer from './Component/footer/Footer';
import ArticleList from './Component/post/ArticleList';
import NotFound from './NotFound';
import PostDetails from './Component/ArticleDetails/PostDetails';

function App() {

  return (
    <Router>
      <div>
        <AdBanner />
        <Header />
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="latest" element={<ArticleList />} />
          <Route path="category/:categoryId/:slug*"element={<ArticleList/>} />
          <Route path="articles/:postId" element={<PostDetails  />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>

      </div>
      <Footer />
    </Router>
  );
}

export default App;
