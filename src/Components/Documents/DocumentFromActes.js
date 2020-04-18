import React from "react";
import PropTypes from "prop-types";
import { Button, Message, Modal, Progress } from "semantic-ui-react";
import _ from "lodash";
import Mustache from "mustache";
import { htmlToPDF, modeleDocument } from "../lib/Helpers";

const propDefs = {
  description:
    "Modal de chargement à la création d'un document à partir des Actes.",
  example: "",
  propDocs: {
    idPatient: "identifiant d'un patient",
    idFse:
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
    idFse: PropTypes.array,
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
    errorMessages: [],
    treatedActes: 0,
    generatedDocuments: 0
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.createDocuments();
    }
  }

  // TODO : Introduire le cas où un identifiant du praticien
  // est renseigné. Il faudra faire un read du profil Praticien,
  // informations qui pourraient bien être utilisées plus tard
  // dans la création du document
  createDocuments = () => {
    if (_.isEmpty(this.props.typeDocument) && !this.props.idModele) {
      let m = this.state.errorMessages;
      m.push("Le type de document à produire n'est pas défini.");
      this.setState({
        treatedActes: this.props.idFse.length,
        errorMessages: m
      });
      return;
    }
    this.setState({
      treatedActes: 0,
      generatedDocuments: 0,
      errorMessages: []
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
              this.generateDocuments(patient, modele);
            },
            error => {
              console.log(error);
              let m = _.clone(this.state.errorMessages);
              m.push(
                "Une erreur est surnvenue lors de la recherche d'un modèle à utiliser pour produire un document."
              );
              this.setState({
                treatedActes: this.props.idFse.length,
                errorMessages: m
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
              this.generateDocuments(patient, modele);
            },
            error => {
              console.log(error);
              let m = _.clone(this.state.errorMessages);
              m.push(
                "Une erreur est surnvenue lors de la recherche d'un modèle à utiliser pour produire un document."
              );
              this.setState({
                treatedActes: this.props.idFse.length,
                errorMessages: m
              });
            }
          );
        }
      },
      error => {
        let m = _.clone(this.state.errorMessages);
        m.push(
          "Une erreur est survenue lors de la lecture des informations sur le patient."
        );
        this.setState({
          treatedActes: this.props.idFse.length,
          errorMessages: m
        });
      }
    );
  };

  generateDocuments = (patient, modele) => {
    let generateDoc = arrayIdActe => {
      if (_.isEmpty(arrayIdActe)) {
        if (_.isEmpty(this.state.errorMessages) && this.props.onClose) {
          // la fenêtre se ferme automatiquement s'il n'y a pas d'erreurs
          this.props.onClose();
        }
        return;
      }
      this.props.client.Actes.read(
        arrayIdActe.shift(),
        {},
        fse => {
          if (_.isEmpty(fse.contentJO.actes)) {
            this.setState({
              treatedActes: this.state.treatedActes + 1
            });
            generateDoc(arrayIdActe);
          } else {
            //console.log(patient);
            //console.log(fse);
            //console.log(modele);

            // TODO : Faire le remplissage des champs dynamiques
            //    Données à utiliser : patient, fse et praticien s'il y en a

            // Ici seulement le remplissage des informations du patient ! TODO : À faire évoluer
            let data = {
              patient: { ...patient }
            };

            let filledDocument = Mustache.render(modele.document, data);
            // on crée d'abord le document et on enregistre ensuite
            // se référence dans l'historique
            let fileName = _.isEmpty(modele.infosJO.modele.nom)
              ? "Sans titre.pdf"
              : modele.infosJO.modele.nom + ".pdf";
            htmlToPDF(
              filledDocument,
              fileName,
              this.props.download,
              base64PDF => {
                this.props.client.Documents.create(
                  {
                    fileName: fileName,
                    idPatient: patient.id,
                    mimeType: "application/pdf",
                    document: base64PDF
                  },
                  result => {
                    this.props.client.Actes.create(
                      {
                        code: "#DOC_PDF",
                        etat: 0,
                        idPatient: patient.id,
                        description: result.fileName,
                        idDocument: result.id
                      },
                      acte => {
                        this.setState({
                          treatedActes: this.state.treatedActes + 1,
                          generatedDocuments: this.state.generatedDocuments + 1
                        });
                        generateDoc(arrayIdActe);
                      },
                      error => {
                        console.log(error);
                        let m = this.state.errorMessages;
                        m.push(
                          "Une erreur est survenue lors de la création de l'acte associée au document produit."
                        );
                        this.setState({
                          treatedActes: this.state.treatedActes + 1,
                          errorMessages: m
                        });
                        generateDoc(arrayIdActe);
                      }
                    );
                  },
                  error => {
                    console.log(error);
                    let m = this.state.errorMessages;
                    m.push(
                      "Une erreur est survenue lors de la création du document."
                    );
                    this.setState({
                      treatedActes: this.state.treatedActes + 1,
                      errorMessages: m
                    });
                    generateDoc(arrayIdActe);
                  }
                );
              },
              error => {
                console.log(error);
                let m = this.state.errorMessages;
                if (error === "POPUP_ERROR") {
                  m.push(
                    "Votre navigateur a empêché cette application d'ouvrir une fenêtre popup."
                  );
                  this.setState({
                    treatedActes: this.state.treatedActes + 1,
                    errorMessages: m
                  });
                } else {
                  m.push(
                    "Une erreur est survenue lors de la conversion du HTML vers PDF."
                  );
                  this.setState({
                    treatedActes: this.state.treatedActes + 1,
                    errorMessages: m
                  });
                }
                generateDoc(arrayIdActe);
              }
            );
          }
        },
        error => {
          this.setState({
            treatedActes: this.state.treatedActes + 1
          });
          generateDoc(arrayIdActe);
        }
      );
    };
    generateDoc(_.clone(this.props.idFse));
  };

  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="mini">
          <Modal.Header>Création d'un document</Modal.Header>
          <Modal.Content>
            {!_.isEmpty(this.state.errorMessages) ? (
              <React.Fragment>
                {_.map(this.state.errorMessages, (errorMessage, index) => (
                  <Message error={true} key={index}>
                    {errorMessage}
                  </Message>
                ))}
              </React.Fragment>
            ) : null}
            <Progress
              active={true}
              color="blue"
              size="small"
              total={this.props.idFse.length}
              value={this.state.treatedActes}
            >
              {this.state.generatedDocuments +
                " / " +
                this.props.idFse.length +
                " documents générés..."}
            </Progress>
          </Modal.Content>
          <Modal.Actions>
            <Button
              disabled={this.state.treatedActes !== this.props.idFse.length}
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
