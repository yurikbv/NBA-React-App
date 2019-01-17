import React, {Component} from 'react';
import axios from 'axios';
import {URL} from '../../../config';
import SliderTemplate from './slider_templates';

class NewsSlider extends Component {

  state = {
    news: []
  };

  componentWillMount() {
    axios.get(`${URL}/articles?_start=${this.props.start}&_end=${this.props.finish}`)
      .then(response => {
      this.setState({
        news: response.data
      })
    })
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