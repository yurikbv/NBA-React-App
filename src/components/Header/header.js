import React from 'react';
import { Link } from "react-router-dom";
import FontAwesome from 'react-fontawesome';

import SideNav from './SideNav/sideNav';
import './header.css';

const Header = (props) => {

  const navBars = () => (
    <div className="bars"
         onClick={props.onShowNav}
    >
      <FontAwesome
        name="bars"
        style={{
          color: '#dfdfdf',
          padding: '10px',
          cursor: 'pointer'
        }}
      />
    </div>
  );

  const logo = () => (
    <Link to={'/'} className="logo">
      <img src="/images/nba_logo.png" alt="nba logo"/>
    </Link>
  );

  return (
    <header className="header">
      <SideNav {...props}/>
      <div className="headerOpt">
        {navBars()}
        {logo()}
      </div>
    </header>
  );
};

export default Header;
