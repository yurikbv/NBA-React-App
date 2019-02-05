import React from 'react';

import NewsSlider from '../widgets/NewsSlider/slider';
import NewsList from '../widgets/NewsList/newsList';
import VideosList from '../widgets/VideosList/videosList';

const Home = (props) => {
  return (
    <div>
      <NewsSlider type="featured" finish={4} settings={{dots: true}}/>
      <NewsList type="card" loadmore={true} start={0} amount={3}/>
      <VideosList type="card" title={true} loadmore={true} start={0} amount={3}/>
    </div>
  );
};

export default Home;
