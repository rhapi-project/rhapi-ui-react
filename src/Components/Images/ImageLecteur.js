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
    loadingRetournementH: false,
    loadingRetournementV: false,
    loadingContraste: false,
    loadingLuminosite: false,
    loadingCancelModifications: false,
    params: {},
    contraste: 0,
    luminosite: 0
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

  isLoadingModification = () => {
    return (
      this.state.loadingZoomIn ||
      this.state.loadingZoomOut ||
      this.state.loadingRotationLeft ||
      this.state.loadingRotationRight ||
      this.state.loadingRetournementH ||
      this.state.loadingRetournementV ||
      this.state.loadingContraste ||
      this.state.loadingLuminosite ||
      this.state.loadingCancelModifications
    );
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

  resetEchelle = (imageParams, height, width) => {
    let params = imageParams;
    params.echelle = this.calculEchelle(height, width);
    this.readImage(
      params,
      result => {
        this.setState({
          image: result,
          params: params,
          loadingZoomIn: false,
          loadingZoomOut: false,
          loadingRotationLeft: false,
          loadingRotationRight: false,
          loadingRetournementH: false,
          loadingRetournementV: false,
          loadingContraste: false,
          loadingLuminosite: false,
          loadingCancelModifications: false
        });
      },
      error => {
        console.log(error);
        this.setState({
          loadingZoomIn: false,
          loadingZoomOut: false,
          loadingRotationLeft: false,
          loadingRotationRight: false,
          loadingRetournementH: false,
          loadingRetournementV: false,
          loadingContraste: false,
          loadingLuminosite: false,
          loadingCancelModifications: false
        });
      }
    );
  };

  handleZoom = facteur => {
    if (this.isLoadingModification()) {
      return;
    }
    this.setState({
      loadingZoomIn: facteur > 0,
      loadingZoomOut: facteur <= 0
    });
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
        this.resetEchelle(
          params,
          result.imageSize.height,
          result.imageSize.width
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  handleRotation = angle => {
    if (this.isLoadingModification()) {
      return;
    }
    this.setState({
      loadingRotationRight: angle > 0,
      loadingRotationLeft: angle <= 0
    });
    let params = this.state.params;
    params.rotation = params.rotation ? params.rotation + angle : angle;
    this.readImage(
      params,
      result => {
        this.resetEchelle(
          params,
          result.imageSize.height,
          result.imageSize.width
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  handleRetournement = sens => {
    if (this.isLoadingModification()) {
      return;
    }
    this.setState({
      loadingRetournementH: sens === "h",
      loadingRetournementV: sens === "v"
    });
    let params = this.state.params;
    if (params.retournement === sens) {
      _.unset(params, "retournement");
    } else {
      params.retournement = sens;
    }
    this.readImage(
      params,
      result => {
        this.resetEchelle(
          params,
          result.imageSize.height,
          result.imageSize.width
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  handleChangeContraste = value => {
    if (this.isLoadingModification()) {
      return;
    }
    this.setState({ loadingContraste: true });
    let params = this.state.params;
    params.contraste = value === 0 ? 100 : value * 100;
    this.readImage(
      params,
      result => {
        this.setState({ contraste: value });
        this.resetEchelle(
          params,
          result.imageSize.height,
          result.imageSize.width
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  handleChangeLuminosite = value => {
    if (this.isLoadingModification()) {
      return;
    }
    this.setState({ loadingLuminosite: true });
    let params = this.state.params;
    if (value === 0) {
      _.unset(params, "luminosite");
    } else {
      params.luminosite = value * 100;
    }
    this.readImage(
      params,
      result => {
        this.setState({ luminosite: value });
        this.resetEchelle(
          params,
          result.imageSize.height,
          result.imageSize.width
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
                    icon="resize horizontal"
                    loading={this.state.loadingRetournementH}
                    onClick={() => this.handleRetournement("h")}
                  />
                }
                content="Retournement horizontal"
                inverted={true}
                size="mini"
              />
              <Popup
                trigger={
                  <Button
                    icon="resize vertical"
                    loading={this.state.loadingRetournementV}
                    onClick={() => this.handleRetournement("v")}
                  />
                }
                content="Retournement vertical"
                inverted={true}
                size="mini"
              />
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
              <Popup
                trigger={
                  <Button
                    disabled={
                      !this.state.params.zoom ||
                      this.state.params.zoom < this.zoomFacteurDefaut * 100
                    }
                    loading={this.state.loadingZoomOut}
                    icon="zoom-out"
                    onClick={() => this.handleZoom(-1 * this.zoomFacteurDefaut)}
                  />
                }
                content="Zoom arrière"
                inverted={true}
                size="mini"
              />
              <Popup
                trigger={
                  <Button
                    icon="zoom-in"
                    loading={this.state.loadingZoomIn}
                    onClick={() => this.handleZoom(this.zoomFacteurDefaut)}
                  />
                }
                content="Zoom avant"
                inverted={true}
                size="mini"
              />
              <Popup
                trigger={
                  <Button icon="sun" loading={this.state.loadingLuminosite} />
                }
                on="click"
                pinned={true}
                inverted={true}
                size="mini"
              >
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.2}
                  value={this.state.luminosite}
                  onChange={e =>
                    this.handleChangeLuminosite(parseFloat(e.target.value))
                  }
                />
              </Popup>
              <Popup
                trigger={
                  <Button icon="adjust" loading={this.state.loadingContraste} />
                }
                on="click"
                pinned={true}
                inverted={true}
                size="mini"
              >
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.2}
                  value={this.state.contraste}
                  onChange={e =>
                    this.handleChangeContraste(parseFloat(e.target.value))
                  }
                />
              </Popup>
              <Popup
                trigger={
                  <Button
                    loading={this.state.loadingCancelModifications}
                    icon="erase"
                    onClick={() => {
                      this.setState({
                        loadingCancelModifications: true,
                        luminosite: 0,
                        contraste: 0
                      });
                      this.resetEchelle(
                        {},
                        this.props.height,
                        this.props.width
                      );
                    }}
                  />
                }
                content="Annuler les modifications"
                inverted={true}
                size="mini"
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
