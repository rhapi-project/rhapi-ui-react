import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Grid,
  Loader,
  Modal,
  Popup,
  Segment
} from "semantic-ui-react";

import Importation from "./Importation";
import ImageLecteur from "./ImageLecteur";
import Periode from "../Shared/Periode";

const propDefs = {
  description: "Liste d'images appartenant à un patient (sous forme de grille)",
  example: "",
  propDocs: {
    idPatient: "identifiant du patient à qui appartient l'image"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number
  }
};

export default class Galerie extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    loading: false,
    loadingDelete: false,
    modalImportation: false,
    images: [],
    hasNextPage: false,
    selectedImages: [],
    allImagesSelected: false,
    itemsPerRow: parseInt(_.get(localStorage, "galerieItemsPerRow", 6)),
    modalDeleteImage: false,
    imageToOpen: {},
    periodeStartAt: "",
    periodeEndAt: ""
  };

  defaultLimit = 40;
  defaultOffset = 0;

  componentDidMount() {
    this.reload(this.defaultLimit, this.defaultOffset);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.idPatient !== this.props.idPatient ||
      prevState.periodeStartAt !== this.state.periodeStartAt ||
      prevState.periodeEndAt !== this.state.periodeEndAt
    ) {
      this.reload(this.defaultLimit, this.defaultOffset);
    }
  }

  reload = (limit, offset) => {
    if (!_.isNumber(this.props.idPatient)) {
      return;
    }
    this.setState({ loading: true });
    let params = {};
    params.q1 = "idPatient,Equal," + this.props.idPatient;
    params.limit = limit;
    params.offset = offset;
    if (this.state.periodeStartAt && this.state.periodeEndAt) {
      params.q2 =
        "AND,createdAt,Between," +
        this.state.periodeStartAt +
        "," +
        this.state.periodeEndAt;
    }
    this.props.client.Images.readAll(
      params,
      result => {
        //console.log(result);
        this.setState({
          loading: false,
          loadingDelete: false,
          images:
            offset === 0
              ? result.results
              : this.state.images.concat(result.results),
          hasNextPage: !_.isUndefined(result.informations.queries.next),
          selectedImages: [],
          modalImportation: false,
          modalDeleteImage: false,
          allImagesSelected: false,
          imageToOpen: {}
        });
      },
      error => {
        console.log(error);
        this.setState({
          loading: false,
          loadingDelete: false,
          modalImportation: false,
          modalDeleteImage: false,
          selectedImages: [],
          allImagesSelected: false,
          hasNextPage: false,
          imageToOpen: {}
        });
      }
    );
  };

  deleteImages = () => {
    this.setState({ loadingDelete: true });
    let selectedImages = this.state.selectedImages;
    let deleteImage = () => {
      if (_.isEmpty(selectedImages)) {
        this.reload(this.defaultLimit, this.defaultOffset);
      } else {
        this.props.client.Images.destroy(
          selectedImages.shift(),
          () => {
            deleteImage();
          },
          error => {
            console.log(error);
            return;
          }
        );
      }
    };
    deleteImage();
  };

  render() {
    if (!_.isEmpty(this.state.imageToOpen)) {
      return (
        <ImageLecteur
          client={this.props.client}
          idImage={this.state.imageToOpen.id}
          height={this.state.imageToOpen.imageSize.height}
          width={this.state.imageToOpen.imageSize.width}
          onClose={() => {
            this.reload(this.defaultLimit, this.defaultOffset);
          }}
        />
      );
    }

    let galerieLignes = [];
    let ligne = [];
    _.forEach(this.state.images, (image, index) => {
      ligne.push(image);
      if (
        ligne.length === this.state.itemsPerRow ||
        index === this.state.images.length - 1
      ) {
        galerieLignes.push(ligne);
        ligne = [];
      }
    });

    return (
      <React.Fragment>
        <Segment color="grey">
          <div>
            <Popup
              trigger={
                <Button
                  disabled={!_.isNumber(this.props.idPatient)}
                  basic={true}
                  icon="photo"
                  onClick={() => this.setState({ modalImportation: true })}
                />
              }
              content="Importer une image"
              inverted={true}
              size="mini"
            />

            <Popup
              trigger={
                <Button
                  disabled={_.isEmpty(this.state.selectedImages)}
                  basic={true}
                  icon="trash alternate"
                  onClick={() => this.setState({ modalDeleteImage: true })}
                />
              }
              content="Supprimer les images sélectionnées"
              inverted={true}
              size="mini"
            />

            <div style={{ float: "right" }}>
              <Button
                basic={true}
                disabled={
                  !_.isNumber(this.props.idPatient) ||
                  this.state.itemsPerRow === 8
                }
                icon="zoom-out"
                onClick={() => {
                  localStorage.setItem(
                    "galerieItemsPerRow",
                    this.state.itemsPerRow + 1
                  );
                  this.setState({
                    itemsPerRow: parseInt(
                      localStorage.getItem("galerieItemsPerRow")
                    )
                  });
                }}
              />
              <Button
                basic={true}
                disabled={
                  !_.isNumber(this.props.idPatient) ||
                  this.state.itemsPerRow === 1
                }
                icon="zoom-in"
                onClick={() => {
                  localStorage.setItem(
                    "galerieItemsPerRow",
                    this.state.itemsPerRow - 1
                  );
                  this.setState({
                    itemsPerRow: parseInt(
                      localStorage.getItem("galerieItemsPerRow")
                    )
                  });
                }}
              />
              <Popup
                trigger={
                  <Button
                    disabled={_.isEmpty(this.state.images)}
                    basic={true}
                    icon={this.state.allImagesSelected ? "close" : "check"}
                    onClick={() => {
                      if (this.state.allImagesSelected) {
                        this.setState({
                          allImagesSelected: false,
                          selectedImages: []
                        });
                      } else {
                        let selectedImages = [];
                        _.forEach(this.state.images, image => {
                          selectedImages.push(image.id);
                        });
                        this.setState({
                          allImagesSelected: true,
                          selectedImages: selectedImages
                        });
                      }
                    }}
                  />
                }
                content="Sélection des images"
                inverted={true}
                size="mini"
              />
            </div>
          </div>

          <Divider />

          <div>
            <Form>
              <Form.Group>
                <Periode
                  labelDate="Période"
                  labelYear="&nbsp;"
                  startYear={2015}
                  onPeriodeChange={(startAt, endAt) => {
                    if (startAt && endAt) {
                      this.setState({
                        periodeStartAt: startAt,
                        periodeEndAt: endAt
                      });
                    } else {
                      this.setState({ periodeStartAt: "", periodeEndAt: "" });
                    }
                  }}
                />
                <Form.Input
                  label="Localisation"
                  width={5}
                  placeholder="Localisation"
                  onChange={() => {}}
                  //onClick={() => this.setState({ openLocalisations: true })}
                  value={""}
                />
              </Form.Group>
            </Form>
          </div>
        </Segment>

        <Divider hidden={true} />

        <div
          id="galerieScrollable"
          style={{ height: "650px", overflowY: "auto", overflowX: "hidden" }}
          onScroll={() => {
            let el = document.getElementById("galerieScrollable");
            if (el.offsetHeight + el.scrollTop === el.scrollHeight) {
              if (this.state.hasNextPage) {
                this.reload(this.defaultLimit, this.state.images.length);
              }
            }
          }}
        >
          {!_.isEmpty(galerieLignes) ? (
            <Grid container={true}>
              {_.map(galerieLignes, (ligne, indexLigne) => (
                <Grid.Row
                  key={indexLigne}
                  columns={this.state.itemsPerRow}
                  stretched={true}
                >
                  {_.map(ligne, (image, indexImage) => (
                    <Grid.Column
                      key={indexImage}
                      textAlign="center"
                      verticalAlign="middle"
                    >
                      <ImageView
                        image={image}
                        selected={
                          _.findIndex(
                            this.state.selectedImages,
                            id => id === image.id
                          ) !== -1
                        }
                        onSelectionChange={idImage => {
                          let selectedImages = this.state.selectedImages;
                          let indexSelection = _.findIndex(
                            selectedImages,
                            id => id === idImage
                          );
                          if (indexSelection === -1) {
                            selectedImages.push(idImage);
                            this.setState({
                              allImagesSelected:
                                selectedImages.length ===
                                this.state.images.length,
                              selectedImages: selectedImages
                            });
                          }
                        }}
                        onOpenImage={() => {
                          this.setState({ imageToOpen: image });
                        }}
                      />
                    </Grid.Column>
                  ))}
                </Grid.Row>
              ))}
            </Grid>
          ) : null}

          {/* loader de chargement */}
          {this.state.loading ? (
            <Loader
              style={{ marginTop: "25px" }}
              active={true}
              inline="centered"
            >
              Chargement des images...
            </Loader>
          ) : null}
        </div>

        {/* modal d'importation d'une image */}
        <Modal open={this.state.modalImportation} size="tiny">
          <Modal.Header>Importer une image</Modal.Header>
          <Modal.Content>
            <Importation
              client={this.props.client}
              idPatient={this.props.idPatient}
              onImportation={() => {
                this.reload(this.defaultLimit, this.defaultOffset);
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => this.setState({ modalImportation: false })}
            />
          </Modal.Actions>
        </Modal>

        {/* modal de confirmation - suppression d'images */}
        <Modal open={this.state.modalDeleteImage} size="tiny">
          <Modal.Header>Suppression d'images</Modal.Header>
          <Modal.Content>
            {this.state.selectedImages.length === 1
              ? "Voulez-vous supprimer l'image sélectionnée ?"
              : "Voulez-vous supprimer les images sélectionnées ?"}
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => this.setState({ modalDeleteImage: false })}
            />
            <Button
              negative={true}
              loading={this.state.loadingDelete}
              content="Supprimer"
              onClick={this.deleteImages}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

class ImageView extends React.Component {
  timeout = null; // gestion du double clic

  onImageClick = e => {
    e.preventDefault();
    e.persist();
    if (this.timeout === null) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.props.onSelectionChange(this.props.image.id);
      }, 300);
    }
  };

  onImageDoubleClick = e => {
    e.preventDefault();
    clearTimeout(this.timeout);
    this.timeout = null;
    this.props.onOpenImage();
  };

  render() {
    return (
      <div onClick={this.onImageClick} onDoubleClick={this.onImageDoubleClick}>
        <Dimmer.Dimmable dimmed={this.props.selected}>
          <div>
            <img
              alt={"Image " + this.props.image.id}
              src={this.props.image.image}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <Dimmer inverted={true} active={this.props.selected} />
        </Dimmer.Dimmable>
      </div>
    );
  }
}
