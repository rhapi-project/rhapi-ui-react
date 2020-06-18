import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, Modal } from "semantic-ui-react";
import TextDocument from "./TextDocument";
import { downloadTextFile } from "../lib/Helpers";
import { print } from "../lib/PrintHelper";

const propDefs = {
  description: "Composant d'édition d'un document texte",
  example: "",
  propDocs: {
    document: "Objet document à manipuler",
    onClose: "Callback à la fermeture de l'édition",
    onEditDocument:
      "Callback à l'édition du contenu d'un document. Ce callback prend en paramètre le nouveau contenu du document"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    document: PropTypes.object,
    onClose: PropTypes.func,
    onEditDocument: PropTypes.func
  }
};
export default class DocumentEditor extends React.Component {
  static propTypes = propDefs.propTypes;
  state = {
    disabledBtnSave: true,
    modalDelete: false
  };

  updateDocument = () => {
    this.props.client.Documents.update(
      this.props.document.id,
      {
        document: this.props.document.document,
        lockRevision: this.props.document.lockRevision
      },
      result => {
        if (this.props.onClose) {
          this.props.onClose();
        }
      },
      error => {}
    );
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ textAlign: "center" }}>
          <strong>{this.props.document.fileName}</strong>
        </div>
        <TextDocument
          data={{}}
          document={this.props.document.document}
          mode={
            this.props.document.mimeType === "text/plain" ? "plain" : "html"
          }
          onEdit={content => {
            this.setState({ disabledBtnSave: false });
            if (this.props.onEditDocument) {
              this.props.onEditDocument(content);
            }
          }}
        />
        <Divider hidden={true} />
        <div style={{ textAlign: "center" }}>
          <Button
            content="Fermer"
            onClick={() => {
              if (this.props.onClose) {
                this.props.onClose();
              }
            }}
          />
          <Button
            disabled={this.state.disabledBtnSave}
            content="Enregistrer"
            onClick={this.updateDocument}
          />
          <Button
            content="Télécharger"
            onClick={() => {
              let mimeType =
                this.props.document.mimeType === "text/x-html-template"
                  ? "text/html"
                  : this.props.document.mimeType;
              downloadTextFile(
                this.props.document.document,
                this.props.document.fileName,
                mimeType
              );
            }}
          />
          <Button
            content="Imprimer"
            onClick={() => {
              let win = window.open(
                "",
                "Impression",
                "height='100%',width='100%'"
              );
              win.document.open();
              win.document.write(this.props.document.document);
              win.document.close();
              win.focus();

              print(
                this,
                win,
                () => {},
                () => {
                  win.close();
                }
              );
            }}
          />
          <Button
            negative={true}
            content="Supprimer"
            onClick={() => this.setState({ modalDelete: true })}
          />
        </div>

        {/* modal de confirmation - suppression d'un document */}
        <Modal open={this.state.modalDelete} size="tiny">
          <Modal.Header>Supprimer un document</Modal.Header>
          <Modal.Content>
            Vous confirmez la suppression de ce document ?
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => this.setState({ modalDelete: false })}
            />
            <Button
              negative={true}
              content="Supprimer"
              onClick={() => {
                this.props.client.Documents.destroy(
                  this.props.document.id,
                  result => {
                    if (this.props.onClose) {
                      this.props.onClose();
                    }
                  },
                  error => {}
                );
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
