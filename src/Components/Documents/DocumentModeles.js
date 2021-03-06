import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Modal } from "semantic-ui-react";
import _ from "lodash";
import ListeDocument from "./ListeDocument";
import RenameDocument from "./RenameDocument";
import PropertiesModele from "./PropertiesModele";
import RecopieModele from "./RecopieModele";
import DocumentEditor from "./DocumentEditor";
import DocumentFromActes from "./DocumentFromActes";
import ModalSelectActes from "../Actes/ModalSelectActes";
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

  state = {
    modeles: [],
    selectedDocument: {},
    modalDelete: false,
    modalCreate: false,
    modalRename: false,
    modalProperties: false,
    modalRecopie: false,
    currentDocumentId: null,
    modalCreationDocument: false,
    modalSelectActes: false,
    selectedActes: [],
    typeDocumentToGenerate: ""
  };

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    let params = {
      _mimeType: "text/x-html-template",
      exfields: "document",
      sort: "modifiedAt",
      order: "DESC"
    };
    if (_.isString(this.props.user) && !_.isEmpty(this.props.user)) {
      params._origine = this.props.user;
    }
    this.props.client.Documents.readAll(
      params,
      result => {
        //console.log(result);
        this.setState({
          modeles: result.results,
          selectedDocument: {},
          currentDocumentId: null,
          modalDelete: false,
          modalCreate: false,
          modalRename: false,
          modalRecopie: false,
          modalCreationDocument: false,
          selectedActes: [],
          typeDocumentToGenerate: "",
          modalSelectActes: false
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
          //disabledBtnSave: true,
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

  genererDocument = idDocument => {
    this.readDocument(
      idDocument,
      result => {
        this.setState({
          currentDocumentId: result.id
        });
        let usage = _.get(result.infosJO, "modele.usage", "");
        if (usage === "FACTURE") {
          this.setState({
            modalSelectActes: true,
            typeDocumentToGenerate: "FACTURE"
          });
        }
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
                  this.genererDocument(id);
                } else {
                  this.editionDocument(id);
                }
              }}
              onSelectionChange={modeles => {}}
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
                  text: "Supprimer",
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
              <Button
                content="Recopier un modèle"
                onClick={() => this.setState({ modalRecopie: true })}
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
            <DocumentEditor
              client={this.props.client}
              document={this.state.selectedDocument}
              onClose={this.reload}
              onEditDocument={content => {
                let sd = this.state.selectedDocument;
                sd.document = content;
                this.setState({ selectedDocument: sd });
              }}
            />
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
          user={_.isEmpty(this.props.user) ? "" : this.props.user}
          open={this.state.modalProperties}
          onClose={() =>
            this.setState({ modalProperties: false, currentDocumentId: null })
          }
        />

        {/* modal de recopie d'un modèle */}
        <RecopieModele
          client={this.props.client}
          open={this.state.modalRecopie}
          onClose={this.reload}
        />

        {/* modal de selection des actes */}
        <ModalSelectActes
          client={this.props.client}
          idPatient={this.props.idPatient}
          open={this.state.modalSelectActes}
          onClose={() => this.setState({ modalSelectActes: false })}
          onDocumentGeneration={arrayIdActes => {
            this.setState({
              selectedActes: arrayIdActes,
              modalCreationDocument: true
            });
          }}
        />

        {/* modal de chargement - création des documents */}
        <DocumentFromActes
          client={this.props.client}
          open={this.state.modalCreationDocument}
          idPatient={this.props.idPatient}
          arrayIdActes={this.state.selectedActes}
          idModele={this.state.currentDocumentId}
          user={this.props.user}
          typeDocument={this.state.typeDocumentToGenerate}
          visualisation={true}
          onClose={this.reload}
          onDocumentGeneration={document => {
            this.setState({
              modalCreationDocument: false,
              modalSelectActes: false,
              selectedDocument: document
            });
          }}
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
