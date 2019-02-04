import React, {Component} from 'react';
import '../../articles.css';
import HeaderItem from "./header";
import VideosRelated from '../../../widgets/VideosList/VideosRelated/videosRelated'
import { firebaseLooper, firebaseTeams, firebaseVideos, firebaseDB} from "../../../../firebase";

class VideoArticle extends Component {

  state = {
    article: [],
    team: [],
    teams: [],
    related: []
  };

  componentWillMount() {
    firebaseDB.ref(`/videos/${this.props.match.params.id}`).once('value')
      .then(snapshot => {
        let article = snapshot.val();
        firebaseTeams.orderByChild('id').equalTo(article.team).once('value')
          .then(snapshot => {
            this.setState({
              article,
              team: firebaseLooper(snapshot)
            });
            this.getRelated();
          }).catch(e => console.log(e));
      }).catch(e => console.log(e));
  }

  getRelated = () => {
    firebaseTeams.once('value')
      .then(snapshot => {
        let  teams = firebaseLooper(snapshot);
        firebaseVideos.orderByChild('team').equalTo(this.state.article.team)
          .limitToFirst(3).once('value')
          .then(snapshot => {
            this.setState({
                      teams,
                      related: firebaseLooper(snapshot)
                    });
          })
      })
  };

  render() {
    const {article, team} = this.state;

    return (
      <div>
        <HeaderItem
          teamData={team[0]}
          date={article.date}
          author={article.author}
        />
        <div className="videoWrapper">
          <h1>{article.title}</h1>
          <iframe
            title="videoplayer"
            width="100%"
            height="300px"
            src={`https://www.youtube.com/embed/${article.url}`}
          > </iframe>
        </div>
        <VideosRelated
          data={this.state.related}
          teams={this.state.teams}
        />
      </div>
    );
  }
}

export default VideoArticle;