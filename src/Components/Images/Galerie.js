import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Loader,
  Modal,
  Popup,
  Segment
} from "semantic-ui-react";

import Importation from "./Importation";
import ImageLecteur from "./ImageLecteur";
//import Periode from "../Shared/Periode";

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
    idImageToOpen: null
  };

  defaultLimit = 20;
  defaultOffset = 0;

  componentDidMount() {
    this.reload(this.defaultLimit, this.defaultOffset);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.idPatient !== this.props.idPatient) {
      this.reload(this.defaultLimit, this.defaultOffset);
    }
  }

  reload = (limit, offset) => {
    if (!_.isNumber(this.props.idPatient)) {
      return;
    }
    this.setState({ loading: true });
    this.props.client.Images.readAll(
      {
        q1: "idPatient,Equal," + this.props.idPatient,
        limit: limit,
        offset: offset
      },
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
          idImageToOpen: null
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
          idImageToOpen: null
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
    if (_.isNumber(this.state.idImageToOpen)) {
      return (
        <ImageLecteur
          client={this.props.client}
          idImage={this.state.idImageToOpen}
          onClose={() => {
            this.setState({ idImageToOpen: null });
          }}
        />
      );
    }
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

            {/*<Periode
              labelDate="&nbsp;"
              labelYear="&nbsp;"
              startYear={2015}
              onPeriodeChange={(startAt, endAt) => {
                if (startAt && endAt) {
                  console.log("changer période");
                } else {
                  console.log("période indeterminée")
                }
              }}
            />*/}

            <div style={{ float: "right" }}>
              <Button
                basic={true}
                disabled={
                  !_.isNumber(this.props.idPatient) ||
                  this.state.itemsPerRow === 10
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
        </Segment>

        <Divider hidden={true} />

        <div
          id="galerieScrollable"
          style={{ height: "700px", overflowY: "auto", overflowX: "hidden" }}
          onScroll={() => {
            let el = document.getElementById("galerieScrollable");
            if (el.offsetHeight + el.scrollTop === el.scrollHeight) {
              if (this.state.hasNextPage) {
                this.reload(this.defaultLimit, this.state.images.length);
              }
            }
          }}
        >
          <Card.Group itemsPerRow={this.state.itemsPerRow}>
            {_.map(this.state.images, (image, index) => (
              <ImageCard
                key={index}
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
                        selectedImages.length === this.state.images.length,
                      selectedImages: selectedImages
                    });
                  }
                }}
                onOpenImage={idImage => {
                  this.setState({ idImageToOpen: idImage });
                }}
              />
            ))}
          </Card.Group>

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

class ImageCard extends React.Component {
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
    this.props.onOpenImage(this.props.image.id);
  };

  render() {
    return (
      <React.Fragment>
        <Dimmer.Dimmable
          as={Card}
          dimmed={this.props.selected}
          onClick={this.onImageClick}
          onDoubleClick={this.onImageDoubleClick}
        >
          <div>
            <img
              alt={"Image " + this.props.image.id}
              src={this.props.image.image}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <Dimmer inverted={true} active={this.props.selected} />
        </Dimmer.Dimmable>
      </React.Fragment>
    );
  }
}
