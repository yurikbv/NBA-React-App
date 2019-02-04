import React, {Component} from 'react';
import {CSSTransition, TransitionGroup } from 'react-transition-group';
import {Link} from "react-router-dom";
import { firebaseArticles, firebaseTeams, firebaseLooper} from "../../../firebase";
import './newsList.css';
import Button from '../Buttons/buttons'
import CardInfo from '../CardInfo/cardInfo'

class NewsList extends Component {

  state = {
    items: [],
    teams:[],
    start: this.props.start,
    finish: this.props.start + this.props.amount,
    amount: this.props.amount
  };

  componentWillMount() {
    this.request(this.state.start, this.state.finish);
  }

  request = (start, end) => {
    if(this.state.teams.length < 1){

      firebaseTeams.once('value')
        .then(snapshot => {
          const teams = firebaseLooper(snapshot);
          this.setState({
            teams
          })
        }).catch(e => console.log(e))
    }

    firebaseArticles.orderByChild('id').startAt(start).endAt(end).once('value')
      .then((snapshot) => {
        const items = firebaseLooper(snapshot);
        this.setState({
          items: [...this.state.items, ...items ],
          finish: end
        })
      }).catch(e => console.log(e));
  };

  loadMore = () => {
    let end =  this.state.finish + this.state.amount;
    this.request(this.state.finish+1, end)
  };

  renderNews = (type) => {
    let template = null;
    switch (type) {
      case 'card':
        template = this.state.items.map((item,i) => (
          <CSSTransition
            classNames="newsList__wrapper"
            timeout={500}
            key={i}>
            <div className="newsList__wrapper">
              <div className="newsList__item">
                <Link to={`/articles/${item.id}`}>
                  <CardInfo teams={this.state.teams} team={item.team} date={item.date}/>
                  <h2>{item.title}</h2>
                </Link>
              </div>
            </div>
          </CSSTransition>
        ));
        break;
      case 'cardMain':
        template = this.state.items.map((item,i) => (
          <CSSTransition
            classNames="newsList__wrapper"
            timeout={500}
            key={i}>
            <div className="newsList__wrapper">
              <div className="newsList__item">
                <Link to={`/articles/${item.id}`}>
                  <div className="flex-wrapper">
                    <div
                      className="left"
                      style={{
                        background: `url(/images/articles/${item.image})`
                      }}
                    > <div> </div></div>
                    <div className="right">
                      <CardInfo teams={this.state.teams} team={item.team} date={item.date}/>
                      <h2>{item.title}</h2>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </CSSTransition>
        ));
        break;
      default:
        template = null
    }
    return template;
  };

  render() {
    return (
      <div>
        <TransitionGroup component="div" className="list">
          {this.renderNews( this.props.type)}
        </TransitionGroup>
        <Button
          type="loadmore"
          loadMore={() => this.loadMore()}
          cta="Load More News"
        />
      </div>
    );
  }
}

export default NewsList;