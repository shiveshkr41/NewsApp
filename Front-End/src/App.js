import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Homepage/home';
import AdBanner from './Component/AdBanner/AdBanner';
import Header from './Component/header/header';
import Navigation from './Component/nav/Navigation';
import Footer from './Component/footer/Footer';
import Latest from './Component/post/ArticleList';
import NotFound from './NotFound';
import PostDetails from './Component/ArticleDetails/PostDetails';
function App() {
  const apiBaseUrl = 'http://127.0.0.1:8000/apis';

  return (
    <Router>
      <div>
        <AdBanner />
        <Header />
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="latest" element={<Latest fetchUrl={apiBaseUrl} />} />
          <Route path="category/:categoryId/posts" element={<Latest fetchUrl={`${apiBaseUrl}/category/`} />} />
          <Route path="articles/:postId" element={<PostDetails fetchUrl={`${apiBaseUrl}/`} />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>

      </div>
      <Footer />
    </Router>
  );
}

export default App;
