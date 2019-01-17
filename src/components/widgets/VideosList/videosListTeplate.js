import React from 'react';
import {Link} from "react-router-dom";

import './videosList.css';
import CardInfo from '../CardInfo/cardInfo';

const VideosTemplate = (props) => {
  return props.data.map((item,i) => (
    <Link to={`/videos/${item.id}`} key={i}>
      <div className="videoListItem__wrapper">
        <div className="left" style={{
          background: `url(./images/videos/${item.image})`
        }}>
          <div> </div>
        </div>
        <div className="right">
          <h2>{item.title}</h2>
        </div>
      </div>
    </Link>
  ))
};

export default VideosTemplate;
