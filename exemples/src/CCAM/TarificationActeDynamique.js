import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMTarificationDynamique extends React.Component {
  state = {
    actes: []
  };

  onSelection = acte => {
    this.setState({ codActe: acte.codActe, actes: [] });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results, codActe: "" });
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation de <b>CCAM.Tarification</b>, composant de tarification
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
        <CCAM.Tarification
          client={client}
          codActe={this.state.codActe}
          dynamic={true}
        />
      </React.Fragment>
    );
  }
}
