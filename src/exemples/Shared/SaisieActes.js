import React from "react";
import { Client } from "rhapi-client";
import { Shared } from "../../Components";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class SharedSaisieActesDentaires extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Shared.SaisiesDentaires</b> pour la saisie
          des actes dentaires.
        </p>
        <Divider hidden={true} />
        <Shared.SaisiesDentaires client={client} lignes={10} />
      </React.Fragment>
    );
  }
}
