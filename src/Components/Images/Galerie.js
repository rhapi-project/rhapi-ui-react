import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
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
import Patients from "../Patients";
import Localisations from "../Shared/Localisations";

import { queriesLocalisation } from "../lib/LocalisationFilterHelper";

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
    periodeEndAt: "",
    modalSelectionPatient: false,
    modalImagesAttribution: false,
    modalLocalisation: false,
    localisation: ""
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
      prevState.periodeEndAt !== this.state.periodeEndAt ||
      prevState.localisation !== this.state.localisation
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
    let queriesLoc = queriesLocalisation(this.state.localisation);
    let numeroQuery = 0;
    if (this.state.localisation) {
      _.forEach(queriesLoc, query => {
        _.set(params, "q" + ++numeroQuery, query);
      });
    }
    _.set(
      params,
      "q" + ++numeroQuery,
      "AND,idPatient,Equal," + this.props.idPatient
    );
    params.limit = limit;
    params.offset = offset;

    if (this.state.periodeStartAt && this.state.periodeEndAt) {
      _.set(
        params,
        "q" + ++numeroQuery,
        "AND,createdAt,Between," +
          this.state.periodeStartAt +
          "," +
          this.state.periodeEndAt
      );
    }

    this.props.client.Images.readAll(
      params,
      result => {
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

  attributionImages = idPatient => {
    let selectedImages = this.state.selectedImages;
    let attribImage = () => {
      if (_.isEmpty(selectedImages)) {
        this.reload(this.defaultLimit, this.defaultOffset);
      } else {
        this.props.client.Images.update(
          selectedImages.shift(),
          { idPatient: idPatient },
          () => {
            attribImage();
          },
          error => {
            console.log(error);
            return;
          }
        );
      }
    };
    attribImage();
  };

  telechargementImages = () => {
    this.props.client.Patients.read(
      this.props.idPatient,
      {},
      patient => {
        //console.log(patient);
        let selectedImages = this.state.selectedImages;
        let telechargement = () => {
          if (_.isEmpty(selectedImages)) {
            console.log("TODO : implémenter les téléchargements");
          } else {
            this.props.client.Images.read(
              selectedImages.shift(),
              {},
              result => {
                //console.log(result);

                telechargement();

                /*let a = document.createElement("a");
                a.href = result.image;
                a.download = result.fileName; // format : NOM_PRENOM_JJ_MM_AAAA[ID].png (ou autre extension)
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);*/

                //telechargement();
              },
              error => {
                console.log(error);
                return;
              }
            );
          }
        };
        telechargement();
      },
      error => {
        console.log(error);
      }
    );
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

            <Popup
              trigger={
                <Button
                  disabled={_.isEmpty(this.state.selectedImages)}
                  basic={true}
                  icon="user"
                  onClick={() =>
                    this.setState({ modalImagesAttribution: true })
                  }
                />
              }
              content="Attribution des images sélectionnées à un autre patient"
              inverted={true}
              size="mini"
            />

            <Popup
              trigger={
                <Button
                  disabled={_.isEmpty(this.state.selectedImages)}
                  basic={true}
                  icon="download"
                  onClick={this.telechargementImages}
                />
              }
              content="Exporter les images sélectionnées"
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
                  onClick={() => this.setState({ modalLocalisation: true })}
                  value={this.state.localisation}
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
            <Grid /*container={true} */ padded={false}>
              {_.map(galerieLignes, (ligne, indexLigne) => (
                <React.Fragment key={indexLigne}>
                  <Grid.Row
                    columns={this.state.itemsPerRow}
                    stretched={true}
                    style={{ padding: 0 }}
                  >
                    {_.map(ligne, (image, indexImage) => (
                      <Grid.Column
                        key={indexImage}
                        textAlign="center"
                        verticalAlign="middle"
                        style={{
                          paddingTop: 0,
                          paddingBottom: 0,
                          paddingLeft: 2,
                          paddingRight: 2
                        }}
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

                  <Grid.Row
                    columns={this.state.itemsPerRow}
                    style={{ marginBottom: "15px" }}
                  >
                    {_.map(ligne, (image, indexImage) => (
                      <Grid.Column
                        key={indexImage}
                        //textAlign="center"
                        style={{ padding: 0 }}
                      >
                        <span style={{ marginLeft: "17px" }}>
                          {moment(image.createdAt).format("DD/MM/yyyy")}
                          &nbsp;
                          <span style={{ float: "right", marginRight: "10px" }}>
                            {image.localisation}
                          </span>
                        </span>
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                  {indexLigne === galerieLignes.length - 1 ? null : (
                    <Divider style={{ padding: 0 }} />
                  )}
                </React.Fragment>
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

        {/* modal de recherche élargie d'un patient */}
        <Patients.Search
          client={this.props.client}
          open={this.state.modalSelectionPatient}
          onClose={() => this.setState({ modalSelectionPatient: false })}
          onPatientSelection={(idPatient, patientDenomination) => {
            if (this.props.idPatient === idPatient) {
              this.setState({ modalSelectionPatient: false });
            } else {
              // faire appel aux trucs
              this.setState({ modalSelectionPatient: false });
              this.attributionImages(idPatient);
            }
          }}
        />

        {/* modal de confirmation - attribution des images à un autre patient */}
        <Modal open={this.state.modalImagesAttribution} size="tiny">
          <Modal.Header>Attribution des images</Modal.Header>
          <Modal.Content>
            Suite à une erreur lors de l'aquisition, des images peuvent avoir
            été attribuées à un mauvais patient. <br />
            Vous avez la possibilité ici, d'attribuer les images sélectionnées à
            un autre patient de votre choix.
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => this.setState({ modalImagesAttribution: false })}
            />
            <Button
              content="OK"
              primary={true}
              onClick={() =>
                this.setState({
                  modalSelectionPatient: true,
                  modalImagesAttribution: false
                })
              }
            />
          </Modal.Actions>
        </Modal>

        {/* modal localisations */}
        <Localisations
          dents={this.state.localisation}
          onSelection={dents =>
            this.setState({ modalLocalisation: false, localisation: dents })
          }
          modal={{
            size: "large",
            open: this.state.modalLocalisation,
            onClose: () => this.setState({ modalLocalisation: false })
          }}
        />
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
