import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Loader,
  Popup,
  Ref,
  Segment
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import _ from "lodash";
import moment from "moment";

import Localisations from "../Shared/Localisations";

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
    loadingInversion: false,
    lodaingNormalisation: false,
    params: {},
    contraste: 0,
    luminosite: 0,
    inversion: false,
    normalisation: false,
    modalLocalisation: false
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
      this.state.loadingCancelModifications ||
      this.state.loadingInversion ||
      this.state.loadingNormalisation
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
          loadingCancelModifications: false,
          loadingInversion: false,
          loadingNormalisation: false
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
          loadingCancelModifications: false,
          loadingInversion: false,
          loadingNormalisation: false
        });
      }
    );
  };

  handleModificationImage = (transformation, valeur) => {
    if (this.isLoadingModification()) {
      return;
    }
    let params = this.state.params;
    if (transformation === "zoom") {
      this.setState({ loadingZoomIn: valeur > 0, loadingZoomOut: valeur <= 0 });
      params.zoom = params.zoom
        ? params.zoom + valeur * 100 <= 0
          ? 100
          : params.zoom + valeur * 100
        : valeur * 100 <= 0
        ? 100
        : valeur * 100;
      // TODO : si params.zoom === 100, alors la prochaine valeur
      // => this.zoomFacteurDefaut * 100
    } else if (transformation === "rotation") {
      this.setState({
        loadingRotationRight: valeur > 0,
        loadingRotationLeft: valeur <= 0
      });
      params.rotation = params.rotation ? params.rotation + valeur : valeur;
    } else if (transformation === "retournement") {
      this.setState({
        loadingRetournementH: valeur === "h",
        loadingRetournementV: valeur === "v"
      });
      if (params.retournement === valeur) {
        _.unset(params, "retournement");
      } else {
        params.retournement = valeur;
      }
    } else if (transformation === "contraste") {
      this.setState({ loadingContraste: true });
      params.contraste = valeur === 0 ? 100 : valeur * 100;
    } else if (transformation === "luminosite") {
      this.setState({ loadingLuminosite: true });
      if (valeur === 0) {
        _.unset(params, "luminosite");
      } else {
        params.luminosite = valeur * 100;
      }
    } else if (transformation === "inversion") {
      this.setState({ loadingInversion: true });
      if (!valeur) {
        _.unset(params, "inversion");
      } else {
        params.inversion = valeur;
      }
    } else if (transformation === "normalisation") {
      this.setState({ loadingNormalisation: true });
      if (!valeur) {
        _.unset(params, "normalisation");
      } else {
        params.normalisation = valeur;
      }
    }

    this.readImage(
      params,
      result => {
        if (transformation === "contraste") {
          this.setState({ contraste: valeur });
        } else if (transformation === "luminosite") {
          this.setState({ luminosite: valeur });
        } else if (transformation === "inversion") {
          this.setState({ inversion: valeur });
        } else if (transformation === "normalisation") {
          this.setState({ normalisation: valeur });
        }
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

  updateFields = (dateObj, localisation) => {
    let precHeight = this.state.image.imageSize.height;
    let precWidth = this.state.image.imageSize.width;
    let params = {};
    if (!_.isUndefined(dateObj)) {
      params.createdAt = dateObj.toISOString(true);
    }
    if (!_.isUndefined(localisation)) {
      params.localisation = localisation;
    }
    this.props.client.Images.update(
      this.state.image.id,
      params,
      result => {
        //console.log(result);
        this.resetEchelle(this.state.params, precHeight, precWidth);
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
              <div
                style={{
                  textAlign: "left",
                  position: "fixed",
                  bottom: 0,
                  left: 10
                }}
              >
                <Form>
                  <Form.Group>
                    <Form.Input
                      label="Localisation"
                      value={
                        _.isEmpty(this.state.image)
                          ? ""
                          : this.state.image.localisation
                      }
                      onClick={() => this.setState({ modalLocalisation: true })}
                    />
                    <Form.Input label="Date">
                      <Ref
                        innerRef={node => {
                          if (node) {
                            let input = node.firstChild.firstChild;
                            input.style.width = "100%";
                          }
                        }}
                      >
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          selected={moment(this.state.image.createdAt).toDate()}
                          onChange={date => {
                            if (date) {
                              this.updateFields(date, undefined);
                            }
                          }}
                          locale={fr}
                        />
                      </Ref>
                    </Form.Input>
                  </Form.Group>
                </Form>
              </div>
              <Popup
                trigger={<Button icon="magic" />}
                on="click"
                pinned={true}
                inverted={true}
                wide={true}
              >
                <Button
                  loading={this.state.loadingNormalisation}
                  content="Normalisation"
                  onClick={() =>
                    this.handleModificationImage(
                      "normalisation",
                      !this.state.normalisation
                    )
                  }
                />
                <Divider hidden={true} vertical={true} />
                <Button
                  loading={this.state.loadingInversion}
                  content="Inversion"
                  onClick={() =>
                    this.handleModificationImage(
                      "inversion",
                      !this.state.inversion
                    )
                  }
                />
              </Popup>
              <Popup
                trigger={
                  <Button
                    icon="resize horizontal"
                    loading={this.state.loadingRetournementH}
                    onClick={() =>
                      this.handleModificationImage("retournement", "h")
                    }
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
                    onClick={() =>
                      this.handleModificationImage("retournement", "v")
                    }
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
                      this.handleModificationImage(
                        "rotation",
                        -1 * this.rotationDegreDefaut
                      )
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
                      this.handleModificationImage(
                        "rotation",
                        this.rotationDegreDefaut
                      )
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
                    onClick={() =>
                      this.handleModificationImage(
                        "zoom",
                        -1 * this.zoomFacteurDefaut
                      )
                    }
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
                    onClick={() =>
                      this.handleModificationImage(
                        "zoom",
                        this.zoomFacteurDefaut
                      )
                    }
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
                    this.handleModificationImage(
                      "luminosite",
                      parseFloat(e.target.value)
                    )
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
                    this.handleModificationImage(
                      "contraste",
                      parseFloat(e.target.value)
                    )
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

        {/* Modal Localisations */}
        <Localisations
          dents={this.state.image.localisation}
          onSelection={dents => {
            if (dents !== this.state.image.localisation) {
              this.updateFields(undefined, dents);
            }
          }}
          modal={{
            size: "large",
            open: this.state.modalLocalisation,
            onClose: () => {
              this.setState({ modalLocalisation: false });
            }
          }}
        />
      </React.Fragment>
    );
  }
}
