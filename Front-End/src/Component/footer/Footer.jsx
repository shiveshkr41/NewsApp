import React from 'react';
import './Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const Footer = () => {
  return (
    <footer className="footer">
      <div className='FooterTop'>
        <div className="header__logo">
          <a href="/">
            <img src="https://thepublive.com/assets/images/main_logo.svg" alt="Harvard Business Review" />
          </a>
        </div>
        <button className="Footerbutton"><b className='FooterSub'>Start my subscription!</b></button>
      </div>
      <div className="Footercontainer">
        <div className="row row1">
          <div className="col-sm-6 col-md-3 sz FooterBorder">
          <h3 className="FooterHead"> Explore HBR</h3>
            <ul>
              <li><a href="/latest">The Latest</a></li>
              <li><a href="/topics">All Topics</a></li>
              <li><a href="/archive">Magazine Archive</a></li>
              <li><a href="/big-idea">The Big Idea</a></li>
              <li><a href="/cases">Case Selections</a></li>
              <li><a href="/podcasts">Podcasts</a></li>
              <li><a href="/webinars">Webinars</a></li>
              <li><a href="/data-visuals">Data & Visuals</a></li>
              <li><a href="/library">My Library</a></li>
              <li><a href="/newsletters">Newsletters</a></li>
              <li><a href="/press">HBR Press</a></li>
              <li><a href="/ascend">HBR Ascend</a></li>
            </ul>
          </div>
          <div className="col-sm-6 col-md-3 sz FooterBorder">
            <h3 className="FooterHead">HBR Store</h3>
            <ul>
              <li><a href="/store/article-reprints">Article Reprints</a></li>
              <li><a href="/store/books">Books</a></li>
              <li><a href="/store/cases">Cases</a></li>
              <li><a href="/store/collections">Collections</a></li>
              <li><a href="/store/magazine-issues">Magazine Issues</a></li>
              <li><a href="/store/hbr-guide-series">HBR Guide Series</a></li>
              <li><a href="/store/20-minute-managers">HBR 20-Minute Managers</a></li>
              <li><a href="/store/ei-series">HBR Emotional Intelligence Series</a></li>
              <li><a href="/store/must-reads">HBR Must Reads</a></li>
              <li><a href="/store/tools">Tools</a></li>
            </ul>
          </div>
          <div className="col-sm-6 col-md-3 sz FooterBorder">
            <h3 className="FooterHead">About HBR</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/advertise">Advertise with Us</a></li>
              <li><a href="/booksellers">Information for Booksellers/Retailers</a></li>
              <li><a href="/masthead">Masthead</a></li>
              <li><a href="/global-editions">Global Editions</a></li>
              <li><a href="/media-inquiries">Media Inquiries</a></li>
              <li><a href="/authors-guidelines">Guidelines for Authors</a></li>
              <li><a href="/analytic-services">HBR Analytic Services</a></li>
              <li><a href="/copyright-permissions">Copyright Permissions</a></li>
            </ul>
          </div>
          <div className="col-sm-6 col-md-3 sz FooterBorder">
            <h3 className="FooterHead">Manage My Account</h3>
            <ul>
              <li><a href="/library">My Library</a></li>
              <li><a href="/topic-feeds">Topic Feeds</a></li>
              <li><a href="/orders">Orders</a></li>
              <li><a href="/account-settings">Account Settings</a></li>
              <li><a href="/email-preferences">Email Preferences</a></li>
              <li><a href="/account-faq">Account FAQ</a></li>
              <li><a href="/help-center">Help Center</a></li>
              <li><a href="/contact-customer-service">Contact Customer Service</a></li>
            </ul>
          </div>
          <div className="col-sm-12 sz FooterBorder">
            <h3 className="FooterHead">Follow HBR</h3>
            <ul className="social-links">
              <li>
                <a href="https://www.facebook.com/harvardbusinessreview">
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com/HarvardBiz">
                  <i className="fab fa-twitter"></i> X Corp.
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/harvard-business-review">
                  <i className="fab fa-linkedin-in"></i> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/harvard_business_review/">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="/rss">
                  <i className="fas fa-rss"></i> Your Newsreader
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
