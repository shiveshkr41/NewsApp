import React from 'react';
import './AdBanner.css';

const AdBanner = () => {
  return (
    <div className="ad-banner" data-testid="ad">
      <div id="google_ads">
        <div className="ad-content">
          <img
            src="https://www.gourmetads.com/wp-content/uploads/2019/02/970x250-starbucks-nitro.jpg"
            alt="Ad Banner"
            className="ad-img"
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
