import React from "react";
import { Button, Divider, Form, Table, TableRow } from "semantic-ui-react";
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
    //autoFilling: false,
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
          //console.log(result);
          let d = this.state.data;
          d.patient = result;
          this.setState({ data: d, autoFilling: false });
          //this.loadActes(id);
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
    // certainement on fait quelque chose après
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

  /*autoFilling = () => {
    this.loadActes(this.state.idPatient);
  };*/

  // sur cet exemple on récupère les actes d'un devis (pour un patient donné)
  /*loadActes = idPatient => {
    let params = {
      _code: "#DEVIS",
      //_etat: 1, // TODO : voir quel type de devis récupérer
      _idPatient: idPatient
    };
    client.Actes.readAll(
      params,
      result => {
        //console.log(result);
        let d = this.state.data;
        d.devis = _.isEmpty(result.results) ? {} : result.results[0];
        this.setState({ data: d, autoFilling: true });
      },
      error => {
        console.log(error);
      }
    );
  };*/

  /*changeDateFormat = dateStr => {
    let d = new Date(dateStr);
    return d.toLocaleDateString();
  };*/

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

  /*savePDFDocument = base64Content => {
    client.Documents.create(
      {
        fileName: this.state.selectedDocument.fileName + ".pdf",
        idPatient: this.state.idPatient,
        mimeType: "application/pdf",
        document: base64Content
      },
      result => {
        console.log(result);
        this.setState({ selectedDocument: {} });
      },
      error => {
        console.log(error);
      }
    );
  };*/

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

  render() {
    return (
      <React.Fragment>
        <p>Traitement de documents (exemple modèle Devis)</p>
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
            {/*!_.isNull(this.state.idPatient) ? (
              <Button
                content="Remplissage auto"
                onClick={() => this.autoFilling()}
              />
            ) : null*/}
            {/*<Button
              content="Enregistrer"
              onClick={() => this.updateDocument()}
            />*/}
            {/*<Button
              content="Télécharger (PDF)"
              onClick={() => {
                //let func = new Functions();
                //func.PDF.download(this.state.selectedDocument.document);
              }}
            />*/}
            {/*!_.isNull(this.state.idPatient) ? (
              <Button
                content="Enregistrer (PDF)"
                onClick={() => {
                  //this.savePDFDocument(base64Content);
                  //func.PDF.experimentalDownload(this.state.selectedDocument.document, "fichier");
                }}
              />
            ) : null*/}
            {/*<Button
              //disabled={true}
              negative={true}
              content="Supprimer"
              onClick={() => this.deleteDocument()}
            />*/}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}
