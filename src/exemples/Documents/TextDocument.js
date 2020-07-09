import React from "react";
import { Button, Divider, Form } from "semantic-ui-react";
import _ from "lodash";
import { Client } from "rhapi-client";
import { Documents } from "../../Components";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8 }
];

const types = [
  { text: "Archives", value: 0 },
  { text: "Modèles", value: 1 }
];

export default class DocumentsTextDocument extends React.Component {
  state = {
    idPatient: null,
    data: {},
    type: 0,
    documents: [],
    selectedDocument: {}
  };

  onPatientChange = id => {
    if (id && id !== 0) {
      client.Patients.read(
        id,
        {},
        result => {
          let d = this.state.data;
          d.patient = result;
          this.setState({ data: d, autoFilling: false });
        },
        error => {
          console.log(error);
        }
      );
    }
    this.setState({ idPatient: id });
    this.reload(id, this.state.type);
  };

  handleChangeType = type => {
    this.setState({ type: type });
    // possibilité de rajouter des traitements supplémentaires
    this.reload(this.state.idPatient, type);
  };

  reload = (idPatient, type) => {
    let params = {};
    if (type === 0) {
      params = { _idPatient: idPatient, exfields: "document" };
    } else if (type === 1) {
      // modèles du praticien
      params = {
        _idPatient: 0,
        _mimeType: "text/x-html-template",
        exfields: "document"
      };
    }

    client.Documents.readAll(
      params,
      result => {
        //console.log(result);
        this.setState({ documents: result.results, selectedDocument: {} });
      },
      error => {
        console.log(error);
      }
    );
  };

  readDocument = id => {
    client.Documents.read(
      id,
      {},
      result => {
        //console.log(result);
        this.setState({ selectedDocument: result });
      },
      error => {
        console.log(error);
      }
    );
  };

  updateDocument = () => {
    client.Documents.update(
      this.state.selectedDocument.id,
      {
        document: this.state.selectedDocument.document
          ? this.state.selectedDocument.document
          : "",
        lockRevision: this.state.selectedDocument.lockRevision
      },
      result => {
        //console.log(result);
        this.reload(this.state.idPatient, this.state.type);
      },
      error => {
        console.log(error);
      }
    );
  };

  deleteDocument = () => {
    client.Documents.destroy(
      this.state.selectedDocument.id,
      result => {
        //console.log(result);
        this.reload(this.state.idPatient, this.state.type);
      },
      error => {
        console.log(error);
      }
    );
  };

  onActionClick = (id, action) => {
    if (action === "supprimer") {
      client.Documents.destroy(
        id,
        result => {
          this.reload(this.state.idPatient, this.state.type);
        },
        error => {}
      );
    }

    console.log(id + " " + action);
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Documents.TextDocument</b> pour le
          traitement de documents HTML ou PLAIN TEXT.
        </p>
        <p>
          La liste des documents est affichée par le composant{" "}
          <a
            href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#listedocument"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>Documents.ListeDocument</b>
          </a>
        </p>
        <p>
          Voir la documentation du composant{" "}
          <a
            href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#textdocument"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>Documents.TextDocument</b>
          </a>
          .
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Group>
            <Form.Dropdown
              label="ID du patient"
              placeholder="Sélectionner un patient"
              selection={true}
              options={patients}
              onChange={(e, d) => this.onPatientChange(d.value)}
              value={this.state.idPatient}
            />
            <Form.Dropdown
              label="Type - document"
              selection={true}
              options={types}
              onChange={(e, d) => this.handleChangeType(d.value)}
              value={this.state.type}
            />
          </Form.Group>
        </Form>

        <Divider hidden={true} />

        <Documents.ListeDocument
          documents={this.state.documents}
          onDocumentDoubleClick={id => {
            this.readDocument(id);
          }}
          actions={[
            {
              icon: "trash",
              text: "Supprimer",
              action: id => this.onActionClick(id, "supprimer")
            }
          ]}
          showAction={true}
          showCheckbox={false}
        />

        <Divider hidden={true} />

        {!_.isEmpty(this.state.selectedDocument) ? (
          <React.Fragment>
            <div style={{ textAlign: "center" }}>
              <strong>{this.state.selectedDocument.fileName}</strong>
            </div>
            <Documents.TextDocument
              data={this.state.autoFilling ? this.state.data : {}}
              document={this.state.selectedDocument.document}
              // TODO : Rajouter un mode de lecture RTF
              mode={
                this.state.selectedDocument.mimeType === "text/plain"
                  ? "plain"
                  : "html"
              }
              onEdit={content => {
                let sd = this.state.selectedDocument;
                sd.document = content;
                this.setState({ selectedDocument: sd });
              }}
            />
          </React.Fragment>
        ) : null}

        <Divider hidden={true} />

        {!_.isEmpty(this.state.selectedDocument) ? (
          <React.Fragment>
            <Button
              content="Fermer"
              onClick={() => this.setState({ selectedDocument: {} })}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}
