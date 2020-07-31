import React from "react";
import PropTypes from "prop-types";
import { Button, Dimmer, Loader, Popup, Segment } from "semantic-ui-react";
import _ from "lodash";

const propDefs = {
  description: "Composant de lecture et transformations d'une image",
  example: "",
  propDocs: {
    idImage: "identifiant de l'image à charger",
    height: "hauteur de l'image à charger",
    width: "largeur de l'image à charger",
    onClose: "callback à la fermeture du lecteur d'images"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idImage: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    onClose: PropTypes.func
  }
};

export default class ImageLecteur extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    image: {},
    loading: false,
    loadingZoomIn: false,
    loadingZoomOut: false,
    loadingRotationLeft: false,
    loadingRotationRight: false,
    params: {}
  };

  zoomFacteurDefaut = 1.5;
  rotationDegreDefaut = 90;

  componentDidMount() {
    let params = {};
    params.echelle = this.calculEchelle(this.props.height, this.props.width);
    this.setState({ loading: true, params: params });
    this.readImage(
      params, // uniquement mise à l'echelle
      result => {
        this.setState({ image: result, loading: false });
      },
      error => {
        console.log(error);
        this.setState({ loading: false });
      }
    );
  }

  calculEchelle = (height, width) => {
    if (height >= width) {
      return window.innerHeight + "l";
    } else {
      return window.innerWidth + "l";
    }
  };

  readImage = (params, onSuccess, onError) => {
    this.props.client.Images.read(
      this.props.idImage,
      params,
      result => {
        onSuccess(result);
      },
      error => {
        onError(error);
      }
    );
  };

  handleZoom = facteur => {
    if (this.state.loadingZoomIn || this.state.loadingZoomOut) {
      return;
    }
    if (facteur > 0) {
      this.setState({ loadingZoomIn: true });
    } else {
      this.setState({ loadingZoomOut: true });
    }
    let params = this.state.params;
    params.zoom = params.zoom
      ? params.zoom + facteur * 100 <= 0
        ? 100
        : params.zoom + facteur * 100
      : facteur * 100 <= 0
      ? 100
      : facteur * 100;
    //console.log(params.zoom);
    // TODO : si params.zoom === 100, alors la prochaine valeur
    // => this.zoomFacteurDefaut * 100
    //this.readImage(params);
    //this.setState({ params: params });
    this.readImage(
      params,
      result => {
        params.echelle = this.calculEchelle(
          result.imageSize.height,
          result.imageSize.width
        );
        this.readImage(
          params,
          res => {
            this.setState({
              image: res,
              params: params,
              loadingZoomIn: false,
              loadingZoomOut: false
            });
          },
          err => {
            console.log(err);
            this.setState({ loadingZoomIn: false, loadingZoomOut: false });
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  handleRotation = angle => {
    if (this.state.loadingRotationLeft || this.state.loadingRotationRight) {
      return;
    }
    if (angle > 0) {
      this.setState({ loadingRotationRight: true });
    } else {
      this.setState({ loadingRotationLeft: true });
    }
    let params = this.state.params;
    params.rotation = params.rotation ? params.rotation + angle : angle;
    this.readImage(
      params,
      result => {
        params.echelle = this.calculEchelle(
          result.imageSize.height,
          result.imageSize.width
        );
        this.readImage(
          params,
          res => {
            this.setState({
              image: res,
              params: params,
              loadingRotationLeft: false,
              loadingRotationRight: false
            });
          },
          err => {
            console.log(err);
            this.setState({
              loadingRotationLeft: false,
              loadingRotationRight: false
            });
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <Dimmer active={true} page={true}>
          <div
            style={{
              height: "100vh",
              width: "100vw",
              backgroundColor: "white",
              position: "relative"
            }}
          >
            {this.state.loading ? (
              <Segment basic={true} style={{ paddingTop: "40%" }}>
                <Dimmer active={true} inverted={true}>
                  <Loader active={true} inline="centered">
                    Chargement de l'image...
                  </Loader>
                </Dimmer>
              </Segment>
            ) : null}

            {/* affichage de l'image */}
            {!_.isEmpty(this.state.image) ? (
              <div
                style={{
                  padding: "5px",
                  overflow: "auto",
                  height: "100%",
                  width: "100%",
                  display: "flex"
                }}
              >
                <img
                  alt={"Image " + this.state.image.id}
                  src={this.state.image.image}
                  style={{
                    margin: "auto",
                    maxHeight: window.innerHeight - 10,
                    maxWidth: window.innerWidth - 10
                  }}
                  //style={{ maxHeight: "800px", maxWidth: "800px" }}
                  onWheel={e => {
                    if (e.deltaY > 0) {
                      this.handleZoom(this.zoomFacteurDefaut);
                    } else {
                      if (
                        !this.state.params.zoom ||
                        this.state.params.zoom < this.zoomFacteurDefaut * 100
                      ) {
                        return;
                      }
                      this.handleZoom(-1 * this.zoomFacteurDefaut);
                    }
                  }}
                />
              </div>
            ) : null}
            <div
              style={{
                textAlign: "center",
                position: "fixed",
                bottom: 0,
                right: 0,
                left: 0,
                marginBottom: "15px"
              }}
            >
              <Popup
                trigger={
                  <Button
                    icon="undo"
                    loading={this.state.loadingRotationLeft}
                    onClick={() =>
                      this.handleRotation(-1 * this.rotationDegreDefaut)
                    }
                  />
                }
                content="Rotation -90°"
                inverted={true}
                size="mini"
              />

              <Popup
                trigger={
                  <Button
                    icon="redo"
                    loading={this.state.loadingRotationRight}
                    onClick={() =>
                      this.handleRotation(this.rotationDegreDefaut)
                    }
                  />
                }
                content="Rotation 90°"
                inverted={true}
                size="mini"
              />

              <Button
                disabled={
                  !this.state.params.zoom ||
                  this.state.params.zoom < this.zoomFacteurDefaut * 100
                }
                loading={this.state.loadingZoomOut}
                icon="zoom-out"
                onClick={() => this.handleZoom(-1 * this.zoomFacteurDefaut)}
              />
              <Button
                icon="zoom-in"
                loading={this.state.loadingZoomIn}
                onClick={() => this.handleZoom(this.zoomFacteurDefaut)}
              />
              <Button
                content="Fermer"
                onClick={() => {
                  if (this.props.onClose) {
                    this.props.onClose();
                  }
                }}
              />
            </div>
          </div>
        </Dimmer>
      </React.Fragment>
    );
  }
}
