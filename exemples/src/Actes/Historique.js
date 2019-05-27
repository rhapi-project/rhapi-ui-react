import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider, Dropdown, Form } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");
const patients = [
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
]

export default class ActesHistorique extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient : 0
    });
  }

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };
  
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Historique</b> pour l'historique des actes d'un patient.
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
        <Actes.Historique 
          client={client}
          showPagination={true}
          idPatient={this.state.idPatient}
          limit={5}
          sort="doneAt"
          order="DESC"
        />
      </React.Fragment>
    );
  }
}
