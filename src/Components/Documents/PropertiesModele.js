import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Message, Modal } from "semantic-ui-react";
import _ from "lodash";
import { setModeleDocument } from "../lib/Helpers";

const propDefs = {
  description:
    "Modal de changement des propriétés d'un modèle : usage par défaut du modèle et le nom (ou titre du document généré).",
  example: "",
  propDocs: {
    id: "identifiant du modèle",
    user: "identifiant du praticien",
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    id: PropTypes.number,
    user: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func
  }
};

const usages = [
  { text: "Aucun usage", value: "" },
  { text: "Modèle pour les devis", value: "DEVIS" },
  { text: "Modèle pour les factures", value: "FACTURE" }
];

export default class PropertiesModele extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    nom: "",
    usage: "",
    defaut: false,
    origine: "",
    modalMessage: "",
    modalMessageType: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && prevProps.open !== this.props.open) {
      this.props.client.Documents.read(
        this.props.id,
        {},
        result => {
          this.setState({
            origine: result.origine,
            nom: _.get(result.infosJO.modele, "nom", ""),
            usage: _.get(result.infosJO.modele, "usage", ""),
            defaut: _.get(result.infosJO.modele, "defaut", false)
          });
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="tiny">
          <Modal.Header>
            Propriétés {this.state.origine ? "" : "(Modèle partagé)"}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Nom du document généré"
                placeholder="Entrer le nom du document"
                value={this.state.nom}
                onChange={(e, d) => this.setState({ nom: d.value })}
              />
              <Form.Dropdown
                label="Usage de ce modèle"
                placeholder="Définir un usage de ce modèle"
                fluid={true}
                selection={true}
                options={usages}
                value={this.state.usage}
                onChange={(e, d) => this.setState({ usage: d.value })}
              />
              <Form.Checkbox
                label="Utiliser ce modèle comme modèle par défaut"
                checked={this.state.defaut}
                onChange={(e, d) => this.setState({ defaut: d.checked })}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
            <Button
              content="Enregistrer"
              onClick={() => {
                setModeleDocument(
                  this.props.client,
                  this.props.user,
                  this.props.id,
                  this.state.nom,
                  this.state.usage,
                  this.state.defaut,
                  result => {
                    this.setState({
                      modalMessage:
                        "La mise à jour du modèle a été effectuée avec succès !",
                      modalMessageType: "success"
                    });
                  },
                  error => {
                    //console.log(error);
                    let errmsg =
                      "Une erreur s'est produite lors de la mise à jour de ce modèle.";
                    if (!error) {
                      errmsg =
                        "Impossible de modifier les propriétés d'un modèle ne vous appartenant pas ou partagé avec d'autres praticiens.";
                    }
                    this.setState({
                      modalMessage: errmsg,
                      modalMessageType: "error"
                    });
                  }
                );
              }}
            />
          </Modal.Actions>
        </Modal>

        {/* résultat de la mise à jour */}
        <Modal
          open={
            !_.isEmpty(this.state.modalMessage) &&
            !_.isEmpty(this.state.modalMessageType)
          }
          size="mini"
        >
          <Modal.Header>Résultat de la mise à jour</Modal.Header>
          <Modal.Content>
            <Message
              negative={this.state.modalMessageType === "error"}
              positive={this.state.modalMessageType === "success"}
            >
              <Message.Header>
                {this.state.modalMessageType === "success"
                  ? "Mise à jour"
                  : this.state.modalMessageType === "error"
                  ? "Échec"
                  : null}
              </Message.Header>
              <Message.Content>{this.state.modalMessage}</Message.Content>
            </Message>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="OK"
              onClick={() => {
                if (this.props.onClose) {
                  this.setState({ modalMessage: "", modalMessageType: "" });
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
