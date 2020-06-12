import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ListeDocument from "./ListeDocument";
import TextDocument from "./TextDocument";
import ModalSelectActes from "../Actes/ModalSelectActes";
import DocumentFromActes from "./DocumentFromActes";
import { Button, Divider, Modal } from "semantic-ui-react";
import {
  downloadBinaryFile,
  downloadTextFile,
  uploadFile
} from "../lib/Helpers";

const propDefs = {
  description: "Liste des documents d'un patient (archives)",
  example: "Tableau",
  propDocs: {
    idPatient:
      "ID du patient. Si idPatient = 0, le document est partagé par tous les patients (ex. un modèle de document)"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number
  }
};

export default class DocumentArchives extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: null
  };

  state = {
    documents: [],
    selectedDocument: {},
    currentDocumentId: null,
    disabledBtnSave: true,
    modalDelete: false,
    modeText: "",
    modalSelectActes: false,
    modalCreationDocument: false,
    typeDocumentToGenerate: "",
    selectedActes: []
  };

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.idPatient !== prevProps.idPatient) {
      this.reload();
    }
  }

  reload = () => {
    // let params = {};

    // if (!this.props.idPatient) {
    //   _.set(params, "q1", "AND,idPatient,Equal,0");
    //   _.set(params, "q2", "AND,mimeType,NotLike,text/x-html-template");
    // } else {
    //   _.set(params, "q1", "AND,idPatient,Equal," + this.props.idPatient);
    // }

    // _.set(params, "exfields", "document");

    this.props.client.Documents.readAll(
      {
        _idPatient: this.props.idPatient, // idPatient est nécessairement > 0 donc il ne peut pas s'agir d'un modèle
        exfields: "document"
      },
      result => {
        this.setState({
          documents: result.results,
          selectedDocument: {},
          currentDocumentId: null,
          modalDelete: false,
          modalCreate: false,
          modeText: "",
          modalSelectActes: false,
          modalCreationDocument: false,
          typeDocumentToGenerate: "",
          selectedActes: []
        });
      },
      error => {}
    );
  };

  onDocumentClick = id => {
    // l'id du document en paramètre sur un click
  };

  onDocumentDoubleClick = id => {
    // l'id du document en paramètre sur un double click => téléchargement du document
    this.props.client.Documents.read(
      id,
      {},
      result => {
        if (result.mimeType === "text/rtf") {
          // cas particulier d'un mimeType text qui sera téléchargé par défaut
          this.downloadDocument(result);
          return;
        }
        if (!_.startsWith(result.mimeType, "text/")) {
          this.downloadDocument(result);
        } else {
          this.setState({
            selectedDocument: result,
            currentDocumentId: result.id,
            modeText: result.mimeType
          });
        }
      },
      error => {}
    );
  };

  onSelectionChange = documents => {
    // array des id des documents en paramètre sur une sélection multiple
  };

  handleActions = (id, action) => {
    switch (action) {
      case "delete":
        this.props.client.Documents.destroy(
          id,
          result => {
            this.reload();
          },
          error => {
            console.log(error);
          }
        );
        break;
      case "download":
        this.props.client.Documents.read(
          id,
          {},
          result => {
            this.downloadDocument(result);
          },
          error => {
            console.log(error);
          }
        );
        break;
      default:
        break;
    }
  };

  downloadDocument = resultDoc => {
    // objet du document passé en paramètre
    if (_.startsWith(resultDoc.mimeType, "text/")) {
      downloadTextFile(
        resultDoc.document,
        resultDoc.fileName,
        resultDoc.mimeType
      );
    } else {
      downloadBinaryFile(resultDoc.document, resultDoc.fileName);
    }
  };

  uploadDocument = event => {
    uploadFile(
      event,
      (file, fileReader) => {
        this.createDocument(file.name, file.type, fileReader.result);
      },
      () => {
        return;
      }
    );
  };

  createDocument = (fileName, mimeType, document) => {
    this.props.client.Documents.create(
      {
        fileName: fileName,
        idPatient: this.props.idPatient,
        mimeType: mimeType,
        document: document
      },
      result => {
        this.reload();
      },
      error => {}
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
        this.setState({
          selectedDocument: result,
          disabledBtnSave: true,
          currentDocumentId: result.id
        });
      },
      error => {}
    );
  };

  deleteDocument = id => {
    this.props.client.Documents.destroy(
      id,
      result => {
        this.reload();
      },
      error => {}
    );
  };

  render() {
    return (
      <React.Fragment>
        {_.isEmpty(this.state.selectedDocument) ? (
          <React.Fragment>
            <ListeDocument
              documents={this.state.documents}
              onDocumentClick={this.onDocumentClick}
              onDocumentDoubleClick={this.onDocumentDoubleClick}
              onSelectionChange={this.onSelectionChange}
              actions={[
                {
                  icon: "download",
                  text: "Télécharger",
                  action: id => this.handleActions(id, "download")
                },
                {
                  icon: "trash",
                  text: "Supprimer",
                  action: id => this.handleActions(id, "delete")
                }
              ]}
              showActions={true}
              showCheckbox={true}
            />
            <div style={{ textAlign: "center" }}>
              <Button
                content="Importer"
                onClick={() => {
                  document.getElementById("file").click();
                }}
              />
              <Button
                disabled={!_.isNumber(this.props.idPatient)}
                content="Facture"
                onClick={() => {
                  this.setState({
                    modalSelectActes: true,
                    typeDocumentToGenerate: "FACTURE"
                  });
                }}
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
              mode={this.state.modeText === "text/html" ? "html" : "plain"}
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
                content="Télécharger"
                onClick={() =>
                  this.downloadDocument(this.state.selectedDocument)
                }
              />
              <Button
                negative={true}
                content="Supprimer"
                onClick={() => this.setState({ modalDelete: true })}
              />
            </div>
          </React.Fragment>
        )}

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
              onClick={() => this.deleteDocument(this.state.currentDocumentId)}
            />
          </Modal.Actions>
        </Modal>

        {/* upload d'un document */}
        <input
          id="file"
          type="file"
          hidden={true}
          onChange={this.uploadDocument}
        />

        {/* modal de selection des actes */}
        <ModalSelectActes
          client={this.props.client}
          open={this.state.modalSelectActes}
          idPatient={this.props.idPatient}
          onClose={() =>
            this.setState({
              modalSelectActes: false,
              typeDocumentToGenerate: ""
            })
          }
          onDocumentGeneration={arrayIdActes => {
            this.setState({
              selectedActes: arrayIdActes,
              modalCreationDocument: true
            });
          }}
        />

        {/* modal de création d'un document à partir des actes*/}
        <DocumentFromActes
          client={this.props.client}
          open={this.state.modalCreationDocument}
          idPatient={this.props.idPatient}
          arrayIdActes={this.state.selectedActes}
          //user={this.props.user}
          typeDocument={this.state.typeDocumentToGenerate}
          download={true}
          onClose={this.reload}
        />
      </React.Fragment>
    );
  }
}
