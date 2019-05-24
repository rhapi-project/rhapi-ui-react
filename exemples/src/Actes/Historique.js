import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider, Input } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesHistorique extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient : 0
    });
  }
  
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Historique</b> pour l'historique des actes d'un patient.
        </p>
        <Divider hidden={true} />
        <Input
          placeholder='ID du patient = 0 par défaut'
          onChange={(e,d) => {this.setState({
            idPatient: d.value
          })}}
        />
        <Actes.Historique 
          client={client}
          showPagination={true}
          idPatient={Number(this.state.idPatient)}
          limit={5}
          sort="doneAt"
          order="DESC"
        />
      </React.Fragment>
    );
  }
}
