import React, {Component} from 'react';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import './layout.css';

class Layout extends Component {

  state = {
    showNav: false
  };

  toggleSidenav = (action) => {
    this.setState({
      showNav: action
    })
  };

  render() {
    return (
      <div>
        <Header
          showNav={this.state.showNav}
          onHideNav={() => this.toggleSidenav(false)}
          onShowNav={() => this.toggleSidenav(true)}
          user={this.props.user}
        />
        {this.props.children}
        <Footer/>
      </div>
    );
  }
}

export default Layout;