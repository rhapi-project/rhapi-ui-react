import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Modal } from "semantic-ui-react";
import _ from "lodash";

const propDefs = {
  description: "Modal de changement de nom de fichier pour un document",
  example: "",
  propDocs: {
    fileName: "nom du document",
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal",
    onRename: "callback au changement du nom du document"
  },
  propTypes: {
    fileName: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onRename: PropTypes.func
  }
};

export default class RenameDocument extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    fileName: "",
    disableRenameBtn: true
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && prevProps.open !== this.props.open) {
      // TODO : enlever l'extension
      this.setState({ fileName: this.props.fileName, disableRenameBtn: true });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="tiny">
          <Modal.Header>Renommer le document</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Nom du document"
                placeholder="Entrer le nom du modèle"
                value={this.state.fileName}
                onChange={(e, d) =>
                  this.setState({ fileName: d.value, disableRenameBtn: false })
                }
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
              disabled={
                this.state.disableRenameBtn || _.isEmpty(this.state.fileName)
              }
              content="Renommer"
              onClick={() => {
                if (this.props.onRename) {
                  //this.props.onRename()
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
