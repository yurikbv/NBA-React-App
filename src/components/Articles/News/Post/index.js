import React, {Component} from 'react';
import { firebaseLooper, firebaseTeams, firebaseDB, firebase } from "../../../../firebase";
import HeaderItem from './header';
import '../../articles.css';

class NewsArticles extends Component {
  state = {
    article: [],
    team: [],
    imageURL: ''
  };

  componentWillMount() {
    console.log(this.props.match.params);
    firebaseDB.ref(`/articles/${this.props.match.params.id}`).once('value')
      .then(snapshot => {
        let article = snapshot.val();
        firebaseTeams.orderByChild('id').equalTo(+article.team).once('value')
          .then(snapshot => {
            this.setState({
                  article,
                  team: firebaseLooper(snapshot)
                })
          }).catch(e => console.log(e));
        this.getImageURL(article.image)
      }).catch(e => console.log(e));
  }

  getImageURL = (filename) => {
    firebase.storage().ref('images')
      .child(filename).getDownloadURL()
      .then( url => {
        this.setState({imageURL: url})
      })
  };

  render() {
    const {article, team} = this.state;
    return (
      <div className="articleWrapper">
        <HeaderItem
          teamData={team[0]}
          date={article.date}
          author={article.author}
        />
        <div className="articleBody">
          <h1>{article.title}</h1>
          <div
            className="articleImage">
            <img src={this.state.imageURL} alt="main-image"/>
          </div>
          <div
            className="articleText"
            dangerouslySetInnerHTML={{
              __html: article.body
            }}
          />
        </div>
      </div>
    );
  }
}

export default NewsArticles;