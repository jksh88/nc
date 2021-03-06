import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import Contact from './ContactComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  postComment,
  fetchCampsites,
  fetchComments,
  fetchPartners,
  fetchPromotions,
  postFeedback,
} from '../redux/ActionCreators';
import { actions } from 'react-redux-form';

const mapStateToProps = (state) => {
  console.log('STATE AT MapSTATEtoPROPS: ', state);
  return {
    campsites: state.campsites,
    comments: state.comments,
    partners: state.partners,
    promotions: state.promotions,
  };
};
//Q: Why is the state empty????

//TODO: To double-check: mapDispatchToProps is an object literarl and mapStateToProps is a function
//dispatch => {} ?
const mapDispatchToProps = {
  fetchCampsites: () => fetchCampsites(),
  fetchComments: () => fetchComments(),
  postComment: (campsiteId, rating, author, text) =>
    postComment(campsiteId, rating, author, text),
  fetchPartners: () => fetchPartners(),
  fetchPromotions: () => fetchPromotions(), // the modelname that was used was 'feedbackForm' in configureStore so using that here
  postFeedback: (feedback) => postFeedback(feedback),
  resetFeedbackForm: () => actions.reset('feedbackForm'),
};

class Main extends Component {
  componentDidMount() {
    this.props.fetchCampsites();
    this.props.fetchComments();
    this.props.fetchPartners();
    this.props.fetchPromotions();
  }
  //Since campsites array now hold 'isLoading', and 'errorMessage' objects as additional elements(see the reducer), to access the campsites array of campsite objects
  //on the inside of the outermost campsites array, it is necessary to go 'campsites.campsites' here.
  //Below, first campsites is an object and second campsites is the array inside
  render() {
    console.log('INSIDE MAIN render method');
    const HomePage = () => {
      return (
        <Home
          campsite={
            this.props.campsites.campsites.filter(
              (campsite) => campsite.featured
            )[0]
          }
          campsitesLoading={this.props.campsites.isLoading}
          campsitesErrorMessage={this.props.campsites.errorMessage}
          partner={
            this.props.partners.partners.filter(
              (partner) => partner.featured
            )[0]
          }
          partnersLoading={this.props.partners.isLoading}
          partnersErrorMessage={this.props.partners.errorMessage}
          promotion={
            this.props.promotions.promotions.filter(
              (promotion) => promotion.featured
            )[0]
          }
          promotionsLoading={this.props.promotions.isLoading}
          promotionsErrorMessage={this.props.promotions.errorMessage}
        />
      );
    };

    const RenderCampsiteWithId = ({ match }) => {
      return (
        <CampsiteInfo
          campsite={
            this.props.campsites.campsites.filter(
              (campsite) => campsite.id === +match.params.campsiteId
            )[0]
          }
          isLoading={this.props.campsites.isLoading}
          errorMessage={this.props.campsites.errorMessage}
          comments={this.props.comments.comments.filter(
            (comment) => comment.campsiteId === +match.params.campsiteId
          )}
          commentsErrorMessage={this.props.comments.errorMessage}
          // campsiteId={match.params.campsiteId}
          postComment={this.props.postComment}
        />
      );
    };
    //Note above errorMessage is for campsites fetching error. Fetching error is comments was named commentsErrorMessage.

    //Don't forget the '[0]' after I run filter. Filter always returns an array. If I forget this, I am passing the whole array and when child component needs a property of an element(which is the campsite object), it will be undefined.
    //Make sure to put the '+' in front of match. id from params is always a string(Think of a query string in url)
    console.log('PROPS AT MAIN: ', this.props);
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
                campsites={this.props.campsites.campsites}
                comments={this.props.comments.comments}
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
          <Route
            exact
            path="/contactus"
            render={() => (
              <Contact
                postFeedback={this.props.postFeedback}
                resetFeedbackForm={this.props.resetFeedbackForm}
              />
            )}
          />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

//By adding mapDispatchToProps here as the second argument for connect function, we have just made it possible for mapDispatchToProps property function(in this case 'addComment')
//to be passed as a prop in this component(<Main>)
//mapStateToProps is a function that you would use to provide the store data to your component, whereas mapDispatchToProps is something that you will use to provide the action creators as props to your component.

//Q: Why do we need withRouter? What is it subscribing to?
