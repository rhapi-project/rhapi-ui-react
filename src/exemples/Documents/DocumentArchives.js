import React from "react";
import { Client } from "rhapi-client";
import { Documents } from "../../Components";
import { Divider, Form } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8 }
];

export default class DocumentsDocumentArchives extends React.Component {
  state = {
    idPatient: null
  };

  onPatientChange = id => {
    this.setState({
      idPatient: id
    });
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Documents.DocumentArchives</b> pour
          afficher la liste des documents du patient.
        </p>
        <p>
          Voir la documentation du composant{" "}
          <a
            href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#documentarchives"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>Documents.DocumentArchives</b>
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
          </Form.Group>
        </Form>
        <Documents.DocumentArchives
          client={client}
          idPatient={this.state.idPatient}
        />
      </React.Fragment>
    );
  }
}
