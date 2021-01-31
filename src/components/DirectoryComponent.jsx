import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardImgOverlay,
  CardText,
  CardBody,
  CardTitle,
} from 'reactstrap';

class Directory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCampsite: null,
    };
  }

  onCampsiteSelect = (campsite) =>
    this.setState({ selectedCampsite: campsite });

  renderSelectedCampsite = (campsite) => {
    campsite ? (
      <Card>
        <CardImg top src={campsite.image} alt={campsite.name} />
        <CardBody>
          <CardTitle>{campsite.name}</CardTitle>
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    ) : (
      <div />
    );
  };

  render() {
    const directory = this.props.campsites.map((campsite) => (
      <div className="col-md-5 m-1" key={campsite.id}>
        <Card onClick={() => this.onCampsiteSelect(campsite)}>
          <CardImg width="100%" src={campsite.image} alt={campsite.name} />
          <CardImgOverlay>
            <CardTitle>{campsite.name}</CardTitle>
          </CardImgOverlay>
        </Card>
      </div>
    ));
    return (
      <div className="container">
        <div className="row">{directory}</div>
        <div className="row">
          <div className="col-md-5 m-1">
            <div>
              {this.renderSelectedCampsite(this.state.selectedCampsite)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Directory;
