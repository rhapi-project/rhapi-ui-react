import React from "react";
import { Client } from "rhapi-client";
import _ from "lodash";
import { Documents } from "../../Components";
import { Divider, Form } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: 0 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8 }
];

export default class DocumentsListeDocument extends React.Component {
  state = {
    idPatient: null,
    documents: []
  };

  onPatientChange = id => {
    this.reload(id);
  };

  reload = id => {
    let params = {
      _idPatient: id,
      exfields: "document"
    };

    client.Documents.readAll(
      params,
      result => {
        this.setState({
          idPatient: id,
          documents: result.results
        });
      },
      error => {}
    );
  };

  onDocumentClick = id => {
    console.log(id);
  };

  onDocumentDoubleClick = id => {
    console.log(id);
    client.Documents.read(
      id,
      {},
      result => {
        if (!_.startsWith(result.mimeType, "text/")) {
          /*let f = new Functions();
          f.BinaryFiles.download(result.document, result.fileName);*/
        }
      },
      error => {}
    );
  };

  onSelectionChange = documents => {
    console.log(documents);
  };

  onActionClick = (id, action) => {
    if (action === "supprimer") {
      client.Documents.destroy(
        id,
        result => {
          this.reload(this.state.idPatient);
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
          Composant <b>Documents.ListeDocument</b> listant les documents du
          patient.
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
          </Form.Group>
        </Form>

        <Documents.ListeDocument
          documents={this.state.documents}
          onDocumentClick={this.onDocumentClick}
          onDocumentDoubleClick={this.onDocumentDoubleClick}
          onSelectionChange={this.onSelectionChange}
          onActionClick={this.onActionClick}
          actions={[
            {
              icon: "question circle",
              text: "Autre action",
              action: id => this.onActionClick(id, "autre action")
            }
          ]}
        />
      </React.Fragment>
    );
  }
}
