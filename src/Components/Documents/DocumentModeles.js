import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, Form, Modal } from "semantic-ui-react";
import _ from "lodash";
import ListeDocument from "./ListeDocument";
import TextDocument from "./TextDocument";
import RenameDocument from "./RenameDocument";
import PropertiesModele from "./PropertiesModele";
import { downloadTextFile, uploadFile } from "../lib/Helpers";

const propDefs = {
  description:
    "Composant de gestion des modèles appartenant à un ou plusieurs praticiens",
  example: "",
  propDocs: {
    idPatient:
      "identifiant du patient nécessaire si l'on souhaite créer un document à partir d'un modèle",
    user: "identifiant du praticien"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    user: PropTypes.string
  }
};

export default class DocumentModeles extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    user: ""
  };

  state = {
    modeles: [],
    selectedDocument: {},
    disabledBtnSave: true,
    modalDelete: false,
    modalCreate: false,
    modalRename: false,
    modalProperties: false, //
    currentDocumentId: null
  };

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.props.client.Documents.readAll(
      {
        _mimeType: "text/x-html-template",
        origine: this.props.user, // Attention : l'utilisation de _origine ne donne pas le bon résultat
        exfields: "document"
      },
      result => {
        //console.log(result);
        this.setState({
          modeles: result.results,
          selectedDocument: {},
          currentDocumentId: null,
          modalDelete: false,
          modalCreate: false,
          modalRename: false
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  readDocument = (id, onSuccess, onError) => {
    this.props.client.Documents.read(
      id,
      {},
      result => {
        onSuccess(result);
      },
      error => {
        onError(error);
      }
    );
  };

  updateDocument = (id, params, onSuccess, onError) => {
    this.props.client.Documents.update(
      id,
      params,
      result => {
        onSuccess(result);
      },
      error => {
        onError(error);
      }
    );
  };

  save = () => {
    this.updateDocument(
      this.state.selectedDocument.id,
      {
        document: this.state.selectedDocument.document,
        lockRevision: this.state.selectedDocument.lockRevision
      },
      result => {
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

  createModele = (fileName, content) => {
    this.props.client.Documents.create(
      {
        fileName: fileName,
        mimeType: "text/x-html-template",
        document: content
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
    switch (action) {
      case "delete":
        this.setState({ modalDelete: true, currentDocumentId: id });
        break;
      case "rename":
        this.setState({ modalRename: true, currentDocumentId: id });
        break;
      case "duplicate":
        this.readDocument(
          id,
          result => {
            this.createModele("(Copie) " + result.fileName, result.document);
          },
          error => {
            console.log(error);
          }
        );
        break;
      case "download":
        this.readDocument(
          id,
          result => {
            downloadTextFile(result.document, result.fileName, "text/html");
          },
          error => {
            console.log(error);
          }
        );
        break;
      case "edit":
        this.editionDocument(id);
        break;
      case "generate":
        // implémenter la génération d'un document si un idPatient est défini
        break;
      case "properties":
        this.setState({ modalProperties: true, currentDocumentId: id });
        break;
      default:
        break;
    }
  };

  rename = fileName => {
    this.readDocument(
      this.state.currentDocumentId,
      result => {
        this.updateDocument(
          result.id,
          {
            fileName: fileName + ".html",
            lockRevision: result.lockRevision
          },
          res => {
            this.reload();
          },
          err => {
            console.log(err);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  importerDocument = event => {
    uploadFile(
      event,
      (file, fileReader) => {
        this.createModele(file.name, fileReader.result);
      },
      () => {
        return;
      }
    );
  };

  editionDocument = id => {
    this.readDocument(
      id,
      result => {
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

  render() {
    return (
      <React.Fragment>
        {_.isEmpty(this.state.selectedDocument) ? (
          <React.Fragment>
            <ListeDocument
              documents={this.state.modeles}
              //onDocumentClick={id => {}}
              onDocumentDoubleClick={id => {
                if (this.props.idPatient) {
                  // TODO : générer un document
                } else {
                  this.editionDocument(id);
                }
              }}
              //onSelectionChange={modeles => {}}
              onActionClick={this.handleActions}
              actions={[
                {
                  icon: "edit",
                  text: "Éditer",
                  action: id => this.handleActions(id, "edit")
                },
                {
                  icon: "copy outline",
                  text: "Dupliquer",
                  action: id => this.handleActions(id, "duplicate")
                },
                {
                  icon: "write",
                  text: "Renommer",
                  action: id => this.handleActions(id, "rename")
                },
                {
                  icon: "file alternate outline",
                  text: "Générer un document",
                  action: id => this.handleActions(id, "generate")
                },
                {
                  icon: "download",
                  text: "Télécharger",
                  action: id => this.handleActions(id, "download")
                },
                {
                  icon: "settings",
                  text: "Propriétés",
                  action: id => this.handleActions(id, "properties")
                },
                {
                  icon: "trash",
                  text: "SUPPRIMER",
                  action: id => this.handleActions(id, "delete")
                }
              ]}
            />

            <div style={{ textAlign: "center" }}>
              <Button
                content="Créer un modèle"
                onClick={() => this.setState({ modalCreate: true })}
              />
              <Button
                content="Importer un modèle"
                onClick={() => {
                  document.getElementById("file").click();
                }}
              />
              <input
                id="file"
                type="file"
                hidden={true}
                accept="text/html"
                onChange={this.importerDocument}
              />
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
                onClick={this.save}
              />
              <Button
                negative={true}
                content="Supprimer"
                onClick={() => this.setState({ modalDelete: true })}
              />
            </div>
          </React.Fragment>
        )}

        {/* modal - renommer un document */}
        <RenameDocument
          open={this.state.modalRename}
          fileName={
            _.isNull(this.state.currentDocumentId)
              ? ""
              : this.state.modeles[
                  _.findIndex(
                    this.state.modeles,
                    mod => mod.id === this.state.currentDocumentId
                  )
                ].fileName
          }
          onClose={() =>
            this.setState({ modalRename: false, currentDocumentId: null })
          }
          onRename={this.rename}
        />

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

        {/* modal des propriétés d'un modèle */}
        <PropertiesModele
          client={this.props.client}
          id={this.state.currentDocumentId}
          user={this.props.user}
          open={this.state.modalProperties}
          onClose={() =>
            this.setState({ modalProperties: false, currentDocumentId: null })
          }
        />
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
                  this.props.onCreate(this.state.fileName + ".html", "");
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
