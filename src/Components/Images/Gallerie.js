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

export default class Gallerie extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    loading: false,
    loadingDelete: false,
    modalImportation: false,
    images: [],
    selectedImages: [],
    allImagesSelected: false,
    itemsPerRow: 6,
    modalDeleteImage: false
  };

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.idPatient !== this.props.idPatient) {
      this.reload();
    }
  }

  reload = () => {
    if (!_.isNumber(this.props.idPatient)) {
      return;
    }
    this.setState({ loading: true });
    this.props.client.Images.readAll(
      {
        q1: "idPatient,Equal," + this.props.idPatient,
        limit: 1000 // toutes les images
      },
      result => {
        //console.log(result);
        this.setState({
          loading: false,
          loadingDelete: false,
          images: result.results,
          selectedImages: [],
          modalImportation: false,
          modalDeleteImage: false,
          allImagesSelected: false
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
          allImagesSelected: false
        });
      }
    );
  };

  deleteImages = () => {
    this.setState({ loadingDelete: true });
    let selectedImages = this.state.selectedImages;
    let deleteImage = () => {
      if (_.isEmpty(selectedImages)) {
        this.reload();
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
                  this.state.itemsPerRow === 10
                }
                icon="zoom-out"
                onClick={() => {
                  this.setState({ itemsPerRow: this.state.itemsPerRow + 1 });
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
                  this.setState({ itemsPerRow: this.state.itemsPerRow - 1 });
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

        {/* loader de chargement */}
        {this.state.loading ? (
          <Loader style={{ marginTop: "25px" }} active={true} inline="centered">
            Chargement des images...
          </Loader>
        ) : null}

        <Divider hidden={true} />

        <div
          style={{ height: "700px", overflowY: "auto", overflowX: "hidden" }}
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
              />
            ))}
          </Card.Group>
        </div>

        {/* modal d'importation d'une image */}
        <Modal open={this.state.modalImportation} size="tiny">
          <Modal.Header>Importer une image</Modal.Header>
          <Modal.Content>
            <Importation
              client={this.props.client}
              idPatient={this.props.idPatient}
              onImportation={() => {
                this.reload();
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
  render() {
    return (
      <React.Fragment>
        <Dimmer.Dimmable
          as={Card}
          dimmed={this.props.selected}
          onClick={() => this.props.onSelectionChange(this.props.image.id)}
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
