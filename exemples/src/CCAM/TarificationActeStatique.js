import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMTarificationStatique extends React.Component {
  state = {
    actes: [],
    codActe: null
  };

  onSelection = acte => {
    // Après la selection d'un acte masquer le tableau des résultats
    this.setState({ codActe: acte.codActe, actes: [] });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results, codActe: null });
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>CCAM.Tarification</b> pour la tarification
          d'un acte CCAM.
        </p>
        <Divider hidden={true} />
        <CCAM.Search client={client} onLoadActes={this.onLoadActes} />
        <Divider hidden={true} />
        <CCAM.Table
          client={client}
          actes={this.state.actes}
          onSelection={acte => this.onSelection(acte)}
        />
        <CCAM.Tarification client={client} codActe={this.state.codActe} dynamic={false}/>
      </React.Fragment>
    );
  }
}