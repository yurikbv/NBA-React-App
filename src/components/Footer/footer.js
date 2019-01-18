import React from 'react';
import {Link} from "react-router-dom";
import './footer.css';
import {CURRENT_YEAR} from '../../config';

const Footer = () => (
    <footer className="footer">
      <Link to="/" className="logo">
        <img src="/images/nba_logo.png" alt="nba logo"/>
      </Link>
      <div className="right">
        @NBA {CURRENT_YEAR} All right reserved.
      </div>
    </footer>
  );

export default Footer;
