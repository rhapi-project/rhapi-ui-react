import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ListeDocument from "./ListeDocument";
import TextDocument from "./TextDocument";
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
    modeText: ""
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
          modeText: ""
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

  onActionClick = (id, action) => {
    if (action === "supprimer") {
      this.props.client.Documents.destroy(
        id,
        result => {
          this.reload();
        },
        error => {}
      );
    }
  };

  downloadDocument = resultDoc => {
    // objet du document passé en paramètre
    if (!_.startsWith(resultDoc.mimeType, "text/")) {
      downloadBinaryFile(resultDoc.document, resultDoc.fileName);
    } else {
      downloadTextFile(
        resultDoc.document,
        resultDoc.fileName,
        resultDoc.mimeType
      );
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
        this.props.client.Actes.create(
          {
            code: "#DOC_" + _.toUpper(result.mimeType.split("/")[1]),
            etat: 0,
            idPatient: this.props.idPatient,
            description: result.fileName,
            idDocument: result.id
          },
          res => {
            this.reload();
          },
          err => {}
        );
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
                  icon: "trash",
                  text: "Supprimer",
                  action: id => this.onActionClick(id, "supprimer")
                },
                {
                  icon: "question circle",
                  text: "Autre action",
                  action: id => this.onActionClick(id, "autre action")
                }
              ]}
            />
            <div style={{ textAlign: "center" }}>
              <Button
                content="Importer"
                onClick={() => {
                  document.getElementById("file").click();
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
              mode={
                this.state.modeText === "text/html"
                  ? "html"
                  : this.state.modeText === "text/rtf"
                  ? "rtf"
                  : "plain"
              }
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

        {/* modal de confirmation - suppression d'un modèle */}
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
      </React.Fragment>
    );
  }
}
