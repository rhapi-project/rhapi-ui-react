import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesSaisie extends React.Component {
  render() {   
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Saisie</b> pour la saisie des actes dentaires.
        </p>
        <Divider hidden={true} />       
        <Actes.Saisie
          client={client}
          lignes={5}
        />
      </React.Fragment>
    );
  }
}
