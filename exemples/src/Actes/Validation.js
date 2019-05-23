import React from "react";
//import { Client } from "rhapi-client";
//import { Actes } from "rhapi-ui-react";
import { Divider, Dropdown, Form } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
//const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
]
export default class ActesValidation extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient: 2
    });
  };

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };

  render() {   
    return (
      <React.Fragment>
        <p>
          Saisie et validation d'un acte pour un patient donné.
        </p>
        <Divider hidden={true} />
        <Form>
          <label>ID du patient : </label>
          <Dropdown
            placeholder="Sélectionner un patient"
            selection={true}
            options={patients}
            onChange={(e, d) => this.onPatientChange(d.value)}
            value={this.state.idPatient}
          />
        </Form>
        <Divider hidden={true} />
      </React.Fragment>
    );
  }
}