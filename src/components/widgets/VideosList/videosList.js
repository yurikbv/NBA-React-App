import React, {Component} from 'react';
import {firebaseVideos, firebaseTeams, firebaseLooper} from "../../../firebase";
import './videosList.css';
import Button from '../Buttons/buttons';
import VideosTemplate from './videosListTeplate';

class VideosList extends Component {

  state = {
    teams: [],
    videos: [],
    start: this.props.start,
    end: this.props.start + this.props.amount,
    amount: this.props.amount
  };

  componentWillMount() {
    this.request(this.state.start, this.state.end)
  }

  renderTitle = () => (
    <h3><strong>NBA</strong> Videos</h3>
  );

  request = (start, end) => {
    if(this.state.teams.length < 1){
      firebaseTeams.once('value')
        .then(snapshot => this.setState({ teams: firebaseLooper(snapshot)}))
        .catch(e => console.log(e));
    }

    firebaseVideos.orderByChild('id').startAt(start).endAt(end).once('value')
      .then(snapshot => {
        const videos = firebaseLooper(snapshot);
        this.setState({
          videos: [...this.state.videos, ...videos],
          start,
          end
        })
      }).catch(e => console.log(e));
  };

  loadMore = () => {
    let end =  this.state.end + this.state.amount;
    this.request(this.state.end+1, end)
  };

  renderButton = () => {
    return this.props.loadmore ?
      <Button type="loadmore" loadMore={() => this.loadMore()} cta="Load More Videos" /> :
      <Button type="linkTo" cta="More videos" linkTo="/videos"/>
      ;
  };

  renderVideos = () => {
    let template = null;
    switch (this.props.type) {
      case 'card':
        template = <VideosTemplate data={this.state.videos} teams={this.state.teams}/>;
        break;
      default:
        template = null;
        break;
    }
    return template;
  };

  render() {

    return (
      <div className="videoList__wrapper">
        {this.props.title ? this.renderTitle() : null}
        {this.renderVideos()}
        {this.renderButton()}
      </div>
    );
  }
}

export default VideosList;