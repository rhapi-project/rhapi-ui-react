import React from "react";
import { Actes } from "rhapi-ui-react";
import { Client } from "rhapi-client";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesHistorique extends React.Component {
  
  render() {
    return (
      <Actes.Historique client={client} idPatient={0} />
    );
  }
}
