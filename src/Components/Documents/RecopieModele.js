import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, Progress } from "semantic-ui-react";
import ListeDocument from "./ListeDocument";
import _ from "lodash";

const propDefs = {
  description:
    "Modal de sélection des modèles à recopier (modèles partagés ou appartenant à un autre praticien).",
  example: "",
  propDocs: {
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func
  }
};

export default class RecopieModele extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    modeles: [],
    selectedModelesId: [],
    modalProgress: false,
    copiedModeles: 0,
    traitedModeles: 0
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.props.client.Documents.readAll(
        {
          _mimeType: "text/x-html-template",
          origine: "", // TODO : à corriger en mettant _origine. Pour l'instant _origine ne fonctionne pas...
          exfields: "document"
        },
        result => {
          this.setState({
            modeles: result.results,
            selectedModelesId: [],
            copiedModeles: 0,
            traitedModeles: 0
          });
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  recopieModeles = () => {
    this.setState({ modalProgress: true });
    let recopie = arrayId => {
      if (_.isEmpty(arrayId)) {
        return;
      }
      this.props.client.Documents.read(
        arrayId.shift(),
        {},
        result => {
          this.setState({ traitedModeles: this.state.traitedModeles + 1 });
          this.props.client.Documents.create(
            {
              fileName: result.fileName,
              mimeType: result.mimeType,
              document: result.document
            },
            res => {
              this.setState({ copiedModeles: this.state.copiedModeles + 1 });
              recopie(arrayId);
            },
            err => {
              recopie(arrayId);
            }
          );
        },
        error => {
          this.setState({ traitedModeles: this.state.traitedModeles + 1 });
          recopie(arrayId);
        }
      );
    };
    recopie(_.clone(this.state.selectedModelesId));
  };

  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="small">
          <Modal.Header>Recopie d'un modèle</Modal.Header>
          <Modal.Content>
            <ListeDocument
              documents={this.state.modeles}
              onSelectionChange={mod =>
                this.setState({ selectedModelesId: mod })
              }
            />
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
              disabled={_.isEmpty(this.state.selectedModelesId)}
              content="Recopier"
              onClick={this.recopieModeles}
            />
          </Modal.Actions>
        </Modal>

        {/* modal de progression des recopies */}
        <Modal open={this.state.modalProgress} size="tiny">
          <Modal.Header>Statut de recopie</Modal.Header>
          <Modal.Content>
            <Progress
              active={true}
              color="blue"
              size="small"
              total={this.state.selectedModelesId.length}
              value={this.state.traitedModeles}
            >
              {this.state.copiedModeles +
                " / " +
                this.state.selectedModelesId.length +
                " modèles recopiés..."}
            </Progress>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content={
                this.state.traitedModeles ===
                this.state.selectedModelesId.length
                  ? "OK"
                  : "Annuler"
              }
              onClick={() => {
                this.setState({ modalProgress: false });
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
