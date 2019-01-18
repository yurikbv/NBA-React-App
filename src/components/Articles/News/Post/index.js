import React, {Component} from 'react';
import axios from 'axios';

import {URL} from "../../../../config";
import HeaderItem from './header';
import '../../articles.css';

class NewsArticles extends Component {
  state = {
    article: [],
    team: []
  };

  componentWillMount() {
    axios.get(`${URL}/articles/?id=${this.props.match.params.id}`)
      .then( ( response) => {
        let article = response.data[0];
        axios.get(`${URL}/teams?id=${article.team}`)
          .then(response => {
            this.setState({
              article,
              team: response.data
            })
          })
      })
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