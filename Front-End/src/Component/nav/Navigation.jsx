import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import './Navigation.css';
import { fetchTopCategories } from '../../Services/apiService'; // Assuming you have this function

const Navigation = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchTopCategories();
        setCategories(response.data.slice(0, 10)); // Fetch top 10 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="navigation">
      <ul className="navigation-list">
        {categories.map(category => (
          <li key={category.id} className="navigation-item">
            <Link to={`/category/${category.id}/${category.slug}`} className="navigation-link">
              {category.name}
            </Link>
          </li>
        ))}
        
      </ul>
    </nav>
  );
};

export default Navigation;
