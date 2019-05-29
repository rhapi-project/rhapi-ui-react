import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider, Form } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");
const patients = [
  { text: "Aucun patient", value: -1 },
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8 },
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

  onHandleRow = (e,id) => {
    console.log("onHandleRow " + id);

    // client.Actes.destroy(
    //   id,
    //   result => {
    //     console.log(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )
  }
  
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Historique</b> pour l'historique des actes d'un patient.
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Group inline={true}>
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
        <Divider hidden={true} />
        <Actes.Historique 
          client={client}
          idPatient={this.state.idPatient}
          onHandleRow={this.onHandleRow}
        />
      </React.Fragment>
    );
  }
}
