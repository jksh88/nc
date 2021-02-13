import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Directory from './DirectoryComponent';
import Contact from './ContactComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
// import { CAMPSITES } from '../shared/campsites';
// import { COMMENTS } from '../shared/comments';
// import { PARTNERS } from '../shared/partners';
// import { PROMOTIONS } from '../shared/promotions';
import CampsiteInfo from './CampsiteInfoComponent';
import About from './AboutComponent';

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    partners: state.partners,
    promotions: state.promotions,
  };
};

class Main extends Component {
  render() {
    const HomePage = () => {
      return (
        <Home
          campsite={
            this.props.campsites.filter((campsite) => campsite.featured)[0]
          }
          promotion={
            this.props.promotions.filter((promotion) => promotion.featured)[0]
          }
          partner={this.props.partners.filter((partner) => partner.featured)[0]}
        />
      );
    };

    const RenderCampsiteWithId = ({ match }) => {
      return (
        <CampsiteInfo
          campsite={
            this.props.campsites.filter(
              (campsite) => campsite.id === +match.params.campsiteId
            )[0]
          }
          comments={this.props.comments.filter(
            (comment) => comment.campsiteId === +match.params.campsiteId
          )}
        />
      );
    };
    //Don't forget the '[0]' after I run filter. Filter always returns an array. If I forget this, I am passing the whole array and when child component needs a property of an element(which is the campsite object), it will be undefined.
    //Make sure to put the '+' in front of match. id from params is always a string(Think of a query string in url)

    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/home" component={HomePage} />
          <Route
            exact
            path="/directory"
            render={(props) => (
              <Directory
                {...props}
                campsites={this.props.campsites}
                comments={this.props.comments}
              />
            )}
          />
          <Route
            exact
            path="/directory/:campsiteId"
            component={RenderCampsiteWithId}
          />
          <Route
            exact
            path="/aboutus"
            render={(props) => <About partners={this.props.partners} />}
          />
          <Route exact path="/contactus" component={Contact} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Main));

//Q: Why do we need withRouter? What is it subscribing to?
