import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/latest" className="navigation-link">
            Latest
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/category/2/posts/" className="navigation-link">
            Demo
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/category/1/posts/" className="navigation-link">
            Business
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/" className="navigation-link">
            Podcasts
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/" className="navigation-link">
            The Big Idea
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/" className="navigation-link">
            Store
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/" className="navigation-link">
            Data & Visuals
          </Link>
        </li>
        <li className="navigation-item">
          <Link to="/" className="navigation-link">
            Case Selections
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
