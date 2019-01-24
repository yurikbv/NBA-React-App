import React, {Component} from 'react';

import {firebaseArticles, firebaseLooper} from "../../../firebase";
import SliderTemplate from './slider_templates';

class NewsSlider extends Component {

  state = {
    news: []
  };

  componentWillMount() {
    firebaseArticles.limitToFirst(this.props.finish).once('value')
      .then((snapshot) => {
        const news = firebaseLooper(snapshot);
        this.setState({
          news
        })
      });
  }

  render() {
    return (
      <div>
        <SliderTemplate data={this.state.news} type={this.props.type} settings={this.props.settings}/>
      </div>
    );
  }
}

export default NewsSlider;