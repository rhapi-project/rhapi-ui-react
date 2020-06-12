import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dimmer,
  Loader,
  Message,
  Modal,
  Segment
} from "semantic-ui-react";
import _ from "lodash";
import Mustache from "mustache";
import { downloadTextFile, modeleDocument } from "../lib/Helpers";

const propDefs = {
  description:
    "Modal de chargement à la création d'un document à partir des Actes.",
  example: "",
  propDocs: {
    idPatient: "identifiant d'un patient",
    arrayIdActes:
      "liste d'identifiants d'actes pour lesquels il faut générer des documents",
    idModele:
      "identifiant du modèle à utiliser. Si cette valeur est renseignée, ce sera le document correspondant à cet identifiant qui sera utilisé",
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal",
    user: "identifiant du praticien",
    typeDocument: "type de document à produire : DEVIS ou FACTURE",
    download: "téléchargement du document généré"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    arrayIdActes: PropTypes.array,
    idModele: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    user: PropTypes.string,
    typeDocument: PropTypes.string,
    download: PropTypes.bool
  }
};

export default class DocumentFromActes extends React.Component {
  static propTypes = propDefs.propTypes;
  state = {
    errorMessage: "",
    loading: true
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.createDocument();
    }
  }

  // TODO : Introduire le cas où un identifiant du praticien
  // est renseigné. Il faudra faire un read du profil Praticien,
  // informations qui pourraient bien être utilisées plus tard
  // dans la création du document
  createDocument = () => {
    if (_.isEmpty(this.props.typeDocument) && !this.props.idModele) {
      this.setState({
        errorMessage: "Le type de document à produire n'est pas défini.",
        loading: false
      });
      return;
    }
    this.setState({
      errorMessage: "",
      loading: true
    });
    this.props.client.Patients.read(
      this.props.idPatient,
      {},
      patient => {
        if (this.props.idModele) {
          this.props.client.Documents.read(
            this.props.idModele,
            {},
            modele => {
              this.generateDocument(patient, modele);
            },
            error => {
              console.log(error);
              this.setState({
                errorMessage:
                  "Une erreur est surnvenue lors de la recherche d'un modèle à utiliser pour produire un document.",
                loading: false
              });
            }
          );
        } else {
          // recherche d'un modèle
          modeleDocument(
            this.props.client,
            this.props.user,
            this.props.typeDocument,
            modele => {
              this.generateDocument(patient, modele);
            },
            error => {
              console.log(error);
              this.setState({
                errorMessage:
                  "Une erreur est surnvenue lors de la recherche d'un modèle à utiliser pour produire un document.",
                loading: false
              });
            }
          );
        }
      },
      error => {
        console.log(error);
        this.setState({
          errorMessage:
            "Une erreur est survenue lors de la lecture des informations sur le patient.",
          loading: false
        });
      }
    );
  };

  // TODO : ajouter une visualisation du document qui vient d'être
  // créé
  generateDocument = (patient, modele) => {
    let actes = [];
    let readActe = arrayIdActes => {
      if (_.isEmpty(arrayIdActes)) {
        // procéder à la création d'un document ICI
        let data = {
          patient: { ...patient },
          actes:
            this.props.typeDocument === "FACTURE"
              ? actes
              : _.get(actes[0], "contentJO.actes", [])
        }; // Si DEVIS, actes contient un seul acte de type #DEVIS

        let filledDocument = Mustache.render(modele.document, data);
        let fileName = _.isEmpty(modele.infosJO.modele.nom)
          ? "Sans titre"
          : modele.infosJO.modele.nom;

        this.props.client.Documents.create(
          {
            fileName: fileName,
            idPatient: patient.id,
            mimeType: "text/html",
            document: filledDocument
          },
          result => {
            this.props.client.Actes.create(
              {
                code: "#DOC_HTML",
                etat: 0,
                idPatient: patient.id,
                description: result.fileName,
                idDocument: result.id
              },
              acte => {
                if (this.props.download) {
                  downloadTextFile(
                    result.document,
                    result.fileName,
                    result.mimeType
                  );
                }
                if (this.props.onClose) {
                  this.props.onClose();
                }
              },
              error => {
                console.log(error);
                this.setState({
                  errorMessage:
                    "Une erreur est survenue lors de la création de l'acte associée au document produit.",
                  loading: false
                });
              }
            );
          },
          error => {
            console.log(error);
            this.setState({
              errorMessage:
                "Une erreur est survenue lors de la création du document.",
              loading: false
            });
          }
        );
      } else {
        this.props.client.Actes.read(
          arrayIdActes.shift(),
          {},
          acte => {
            actes.push(acte);
            readActe(arrayIdActes);
          },
          error => {
            console.log(error);
            this.setState({
              errorMessage:
                "Une erreur est survenue lors de la lecture des informations d'un acte",
              loading: false
            });
          }
        );
      }
    };
    readActe(_.clone(this.props.arrayIdActes));
  };

  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="mini">
          <Modal.Header>Création d'un document</Modal.Header>
          <Modal.Content>
            {this.state.loading ? (
              <Segment basic={true}>
                <Dimmer active={true} inverted={true}>
                  <Loader
                    active={true}
                    inline="centered"
                    inverted={true}
                    size="medium"
                  >
                    Chargement...
                  </Loader>
                </Dimmer>
              </Segment>
            ) : (
              <Message error={true}>{this.state.errorMessage}</Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              disabled={this.state.loading}
              content="OK"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
