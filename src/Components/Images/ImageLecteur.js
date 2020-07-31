import React from "react";
import PropTypes from "prop-types";
import { Button, Dimmer, Loader, Segment } from "semantic-ui-react";
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
    params: {}
  };

  zoomFacteurDefaut = 1.5;

  componentDidMount() {
    let params = {};
    params.echelle = _.max([this.props.height, this.props.width]) + "l";
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
    let params = this.state.params;
    //_.unset(params, "echelle");
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
        params.echelle =
          _.max([result.imageSize.height, result.imageSize.width]) + "l";
        this.readImage(
          params,
          res => {
            this.setState({ image: res, params: params });
          },
          err => {
            console.log(err);
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
                  <Loader
                    active={true}
                    inline="centered"
                    //style={{ color: "black" }}
                    //inverted={true}
                  >
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
                    maxHeight: window.innerHeight * 2,
                    maxWidth: window.innerWidth * 2
                  }}
                  //style={{ maxHeight: "800px", maxWidth: "800px" }}
                  /*onWheel={e => {
                    if (e.deltaY > 0) {
                      this.handleZoom(2);
                    } else {
                      this.handleZoom(-2)
                    }
                  }}*/
                />
              </div>
            ) : null}
            <div
              style={{
                textAlign: "center",
                float: "bottom",
                position: "absolute",
                bottom: 0,
                right: 0,
                left: 0,
                marginBottom: "15px"
              }}
            >
              <Button
                disabled={
                  !this.state.params.zoom ||
                  this.state.params.zoom < this.zoomFacteurDefaut * 100
                }
                icon="zoom-out"
                onClick={() => this.handleZoom(-1 * this.zoomFacteurDefaut)}
              />
              <Button
                icon="zoom-in"
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