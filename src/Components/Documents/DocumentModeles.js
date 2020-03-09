import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, Form, Modal } from "semantic-ui-react";
import _ from "lodash";
import ListeDocument from "./ListeDocument";
import TextDocument from "./TextDocument";

const propDefs = {
  description:
    "Composant de gestion des modèles appartenant à un ou plusieurs praticiens",
  example: "",
  propDocs: {
    idPatient:
      "identifiant du patient nécessaire si l'on souhaite créer un document à partir d'un modèle",
    origine: "identifiant du praticien"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    origine: PropTypes.string
  }
};

export default class DocumentModeles extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    origine: ""
  };

  state = {
    modeles: [],
    selectedDocument: {},
    disabledBtnSave: true,
    modalDelete: false,
    modalCreate: false,
    currentDocumentId: null
  };

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.props.client.Documents.readAll(
      {
        _mimeType: "text/x-html-template",
        origine: this.props.origine,
        exfields: "document"
      },
      result => {
        //console.log(result);
        this.setState({
          modeles: result.results,
          selectedDocument: {},
          currentDocumentId: null,
          modalDelete: false,
          modalCreate: false
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  readDocument = id => {
    this.props.client.Documents.read(
      id,
      {},
      result => {
        //console.log(result);
        this.setState({
          selectedDocument: result,
          currentDocumentId: result.id
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  updateDocument = () => {
    this.props.client.Documents.update(
      this.state.selectedDocument.id,
      {
        document: this.state.selectedDocument.document,
        lockRevision: this.state.selectedDocument.lockRevision
      },
      result => {
        //console.log(result);
        this.setState({
          selectedDocument: result,
          disabledBtnSave: true,
          currentDocumentId: result.id
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  deleteDocument = id => {
    this.props.client.Documents.destroy(
      id,
      result => {
        this.reload();
      },
      error => {
        console.log(error);
      }
    );
  };

  createModele = fileName => {
    this.props.client.Documents.create(
      {
        fileName: fileName + ".html",
        mimeType: "text/x-html-template",
        document: ""
      },
      result => {
        //console.log(result);
        this.reload();
      },
      error => {
        console.log(error);
      }
    );
  };

  handleActions = (id, action) => {
    if (action === "supprimer") {
      this.setState({ modalDelete: true, currentDocumentId: id });
    }
  };

  render() {
    return (
      <React.Fragment>
        {_.isEmpty(this.state.selectedDocument) ? (
          <React.Fragment>
            <ListeDocument
              documents={this.state.modeles}
              onDocumentClick={id => {}}
              onDocumentDoubleClick={this.readDocument}
              onSelectionChange={modeles => {}}
              onActionClick={this.handleActions}
              actions={[
                {
                  icon: "download",
                  text: "Télécharger",
                  action: id => {}
                }
              ]}
            />

            <div style={{ textAlign: "center" }}>
              <Button
                content="Créer un modèle"
                onClick={() => this.setState({ modalCreate: true })}
              />
              {/*<Button 
                  content="Importer un modèle"
                  onClick={() => {}}
                />*/}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ textAlign: "center" }}>
              <strong>{this.state.selectedDocument.fileName}</strong>
            </div>
            <TextDocument
              data={{}}
              document={this.state.selectedDocument.document}
              mode="html"
              onEdit={content => {
                let sd = this.state.selectedDocument;
                sd.document = content;
                this.setState({ selectedDocument: sd, disabledBtnSave: false });
              }}
            />

            <Divider hidden={true} />
            <div style={{ textAlign: "center" }}>
              <Button content="Fermer" onClick={this.reload} />
              <Button
                disabled={this.state.disabledBtnSave}
                content="Enregistrer"
                onClick={this.updateDocument}
              />
              <Button
                negative={true}
                content="Supprimer"
                onClick={() => this.setState({ modalDelete: true })}
              />
            </div>
          </React.Fragment>
        )}

        {/* modal de création d'un modèle */}
        <CreationModele
          open={this.state.modalCreate}
          onCreate={this.createModele}
          onClose={() => this.setState({ modalCreate: false })}
        />

        {/* modal de confirmation - suppression d'un modèle */}
        <Modal open={this.state.modalDelete} size="tiny">
          <Modal.Header>Supprimer un modèle</Modal.Header>
          <Modal.Content>Voulez-vous supprimer ce modèle ?</Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => this.setState({ modalDelete: false })}
            />
            <Button
              negative={true}
              content="Supprimer"
              onClick={() => this.deleteDocument(this.state.currentDocumentId)}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

class CreationModele extends React.Component {
  state = {
    fileName: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && prevProps.open !== this.props.open) {
      this.setState({ fileName: "Nouveau document" });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal size="tiny" open={this.props.open}>
          <Modal.Header>Créer un modèle</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Nom du modèle"
                placeholder="Entrer le nom du modèle"
                value={this.state.fileName}
                onChange={(e, d) => this.setState({ fileName: d.value })}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Annuler" onClick={this.props.onClose} />
            <Button
              content="Créer"
              onClick={() => {
                if (!_.isEmpty(this.state.fileName)) {
                  this.props.onCreate(this.state.fileName);
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}