import React from "react";
import PropTypes from "prop-types";
import { Button, Dimmer, Loader, Message, Modal, Segment } from "semantic-ui-react";
import _ from "lodash";
import { htmlToPDF, modeleDocument } from "../lib/Helpers";

const propDefs = {
  description:
    "Modal de chargement à la création d'un document à partir des Actes.",
  example: "",
  propDocs: {
    idPatient: "identifiant d'un patient",
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal",
    user: "identifiant du praticien",
    typeDocument: "type de document à produire"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    user: PropTypes.string,
    typeDocument: PropTypes.string
  }
};

export default class DocumentFromActes extends React.Component {
  static propTypes = propDefs.propTypes;
  state = {
    loading: true,
    errorMessage: ""
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
    if (_.isEmpty(this.props.typeDocument)) {
      this.setState({
        loading: false,
        errorMessage: "Le type de document à produire n'est pas défini."
      });
      return;
    }
    this.setState({ loading: true, errorMessage: "" });
    this.props.client.Patients.read(
      this.props.idPatient,
      {},
      patient => {
        this.props.client.Actes.read(
          this.props.idFse,
          {},
          fse => {
            if (_.isEmpty(fse.contentJO.actes)) {
              this.setState({
                loading: false,
                errorMessage: "FSE.contentJO.actes est vide"
              });
            } else {
              // recherche du modèle à utiliser
              modeleDocument(
                this.props.client,
                this.props.user,
                this.props.typeDocument,
                modele => {
                  //console.log(patient);
                  //console.log(fse);
                  //console.log(modele);

                  // TODO : Faire le remplissage des champs dynamiques
                  //    Données à utiliser : patient, fse et praticien s'il y en a

                  // on crée d'abord le document et on enregistre ensuite
                  // se référence dans l'historique
                  htmlToPDF(
                    modele.document, // TODO : changer et passer le HTML avec les champs dynamiques remplis
                    base64PDF => {
                      this.props.client.Documents.create(
                        {
                          fileName: _.isEmpty(modele.infosJO.modele.nom)
                            ? "Sans titre.pdf"
                            : modele.infosJO.modele.nom + ".pdf",
                          idPatient: patient.id,
                          mimeType: "application/pdf",
                          document: base64PDF
                        },
                        result => {
                          //console.log(result);
                          this.props.client.Actes.create(
                            {
                              code: "#DOC_PDF",
                              etat: 0,
                              idPatient: patient.id,
                              description: result.fileName,
                              idDocument: result.id
                            },
                            acte => {
                              //console.log(acte);
                              this.setState({
                                loading: false,
                                errorMessage: ""
                              });
                            },
                            error => {
                              console.log(error);
                              this.setState({
                                loading: false,
                                errorMessage: "Une erreur est survenue lors de la création de l'acte associée au document produit."
                              });
                            }
                          );
                        },
                        error => {
                          console.log(error);
                          this.setState({
                            loading: false,
                            errorMessage: "Une erreur est survenue lors de la création du document."
                          });
                        }
                      );
                    },
                    error => {
                      console.log(error);
                      this.setState({
                        loading: false,
                        errorMessage: "Une erreur est survenue lors de la conversion du HTML vers PDF."
                      })
                    }
                  );
                },
                error => {
                  console.log(error);
                  this.setState({
                    loading: false,
                    errorMessage: "Une erreur est surnvenue lors de la recherche d'un modèle à utiliser pour produire un document."
                  });
                }
              );
            }
          },
          error => {
            console.log(error);
            this.setState({
              loading: false,
              errorMessage: "Une erreur est survenue lors de la lecture des actes."
            });
          }
        );
      },
      error => {
        console.log(error);
        this.setState({
          loading: false,
          errorMessage: "Une erreur est survenue lors de la lecture des informations sur le patient."
        });
      }
    );
  }

  render() {
    //console.log(this.props.idPatient);
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="mini">
          <Modal.Header>Création d'un document</Modal.Header>
          <Modal.Content>
            {this.state.loading
              ? <Segment basic={true}>
                  <Dimmer active={true} inverted={true}>
                    <Loader active={true} inline="centered" inverted={true} size="medium">
                      Chargement...
                    </Loader>
                  </Dimmer>
                </Segment>
              : <Message
                  error={!_.isEmpty(this.state.errorMessage)}
                >
                  {_.isEmpty(this.state.errorMessage)
                    ? "La création du document a été effectuée avec succès."
                    : this.state.errorMessage
                  }
                </Message>
            }
            
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
    )
  }
}