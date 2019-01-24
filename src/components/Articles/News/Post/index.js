import React, {Component} from 'react';
import { firebaseLooper, firebaseTeams, firebaseArticles } from "../../../../firebase";
import HeaderItem from './header';
import '../../articles.css';

class NewsArticles extends Component {
  state = {
    article: [],
    team: []
  };

  componentWillMount() {
    firebaseArticles.orderByChild('id').equalTo(+this.props.match.params.id).once('value')
      .then(snapshot => {
        let article = firebaseLooper(snapshot)[0];
        firebaseTeams.orderByChild('id').equalTo(article.team).once('value')
          .then(snapshot => {
            this.setState({
                  article,
                  team: firebaseLooper(snapshot)
                })
          }).catch(e => console.log(e));
      }).catch(e => console.log(e));
  }

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
            <img src={`/images/articles/${article.image}`} alt=""/>
          </div>
          <div className="articleText">{article.body}</div>
        </div>
      </div>
    );
  }
}

export default NewsArticles;