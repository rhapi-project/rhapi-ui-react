import React from "react";
import { Client } from "rhapi-client";
import { Documents } from "../../Components";
import { Button, Divider, Form } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8 }
];

export default class DocumentsCreationDocument extends React.Component {
  state = {
    idPatient: null,
    open: false
  };
  render() {
    return (
      <React.Fragment>
        <p>
          Composant <b>Documents.CreationDocument</b> proposant les options de
          création d'un document.
        </p>
        <Divider hidden={true} />

        <Form>
          <Form.Group>
            <Form.Dropdown
              label="ID du patient"
              placeholder="Sélectionner un patient"
              selection={true}
              options={patients}
              onChange={(e, d) => this.setState({ idPatient: d.value })}
              value={this.state.idPatient}
            />
          </Form.Group>
        </Form>

        <Divider hidden={true} />

        <Button
          content="Créer un nouveau document"
          onClick={() => this.setState({ open: true })}
        />
        <Documents.CreationDocument
          client={client}
          idPatient={this.state.idPatient}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        />
      </React.Fragment>
    );
  }
}