import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "semantic-ui-react";
import _ from "lodash";
import moment from "moment";

const propDefs = {
  description: "Modal de confirmation de la validation d'un acte",
  example: "",
  propDocs: {
    idActe: "identifiant de l'acte à valider",
    modeleDocument:
      "type de modèle à utiliser pour la génération d'un document",
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal",
    onDocumentGeneration:
      "callback à la confirmation de la génération d'un document"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idActe: PropTypes.number,
    modeleDocument: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onDocumentGeneration: PropTypes.func
  }
};

export default class ValidationActes extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    error: false,
    messageValidation: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.validation();
    }
  }

  createActe = (acte, idDocument, idPatient) => {
    let params = {
      code: acte.code,
      doneAt: acte.date,
      localisation: acte.localisation,
      cotation: acte.cotation,
      description: acte.description,
      montant: acte.montant,
      idPatient: idPatient,
      idDocument: idDocument,
      etat: 0
    };
    this.props.client.Actes.create(
      params,
      result => {
        //console.log(result);
      },
      error => {
        console.log(error);
        console.log("La création d'un acte a échoué");
      }
    );
  };

  validation = () => {
    this.props.client.Actes.read(
      this.props.idActe,
      {},
      result => {
        if (result.code === "#FSE") {
          let actes = _.filter(
            _.get(result, "contentJO.actes", []),
            a => !_.isEmpty(a.code)
          );
          _.forEach(actes, acte => {
            this.createActe(acte, result.id, result.idPatient);
          });
        }
        this.props.client.Actes.update(
          result.id,
          { etat: 0, doneAt: moment().toISOString() },
          acte => {
            this.setState({
              messageValidation: `L'acte "${result.description}" a été bien enregistré.`,
              error: false
            });
          },
          error => {
            this.setState({
              messageValidation:
                "Une erreur est survenue lors de la validation de l'acte.",
              error: true
            });
          }
        );
      },
      error => {
        this.setState({
          messageValidation:
            "Une erreur est survenue lors de la lecture de l'acte à valider.",
          error: true
        });
      }
    );
  };
  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="tiny">
          <Modal.Header>Validation d'un acte</Modal.Header>
          <Modal.Content>
            <span>{this.state.messageValidation}</span>
            {!this.state.error ? (
              <React.Fragment>
                <br />
                {this.props.modeleDocument === "FACTURE" ? (
                  <span>
                    Souhaitez-vous établir une facture (document PDF) ?
                  </span>
                ) : this.props.modeleDocument === "DEVIS" ? (
                  <span>
                    Souhaitez-vous établir un devis (document PDF) pour ce
                    projet ?
                  </span>
                ) : null}
              </React.Fragment>
            ) : null}
          </Modal.Content>
          <Modal.Actions>
            {this.state.error ? (
              <Button
                content="Annuler"
                onClick={() => {
                  if (this.props.onClose) {
                    this.props.onClose();
                  }
                }}
              />
            ) : (
              <React.Fragment>
                <Button
                  content="Non"
                  onClick={() => {
                    if (this.props.onClose) {
                      this.props.onClose();
                    }
                  }}
                />
                <Button
                  content="Oui"
                  onClick={() => {
                    if (this.props.onDocumentGeneration) {
                      this.props.onDocumentGeneration();
                    }
                  }}
                />
              </React.Fragment>
            )}
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
