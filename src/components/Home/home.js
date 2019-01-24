import React from 'react';

import NewsSlider from '../widgets/NewsSlider/slider';
import NewsList from '../widgets/NewsList/newsList';
import VideosList from '../widgets/VideosList/videosList';

const Home = () => {
  return (
    <div>
      <NewsSlider type="featured" finish={5} settings={{dots: true}}/>
      <NewsList type="card" loadmore={true} start={1} amount={3}/>
      <VideosList type="card" title={true} loadmore={true} start={1} amount={3}/>
    </div>
  );
};

export default Home;
