import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMDetailActe extends React.Component {
  state = {
    actes: [],
    codActe: "",
    detail: {}
  };

  onSelection = acte => {
    this.setState({ codActe: acte.codActe, actes: [] });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results, codActe: "", detail: {} });
  };

  onSuccess = obj => {
    console.log(obj);
    this.setState({ detail: obj });
  }
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation de <b>CCAM.Detail</b> pour l'aperçu du détail d'un acte tarifé.
        </p>
        <Divider hidden={true} />
        <CCAM.Search client={client} onLoadActes={this.onLoadActes} />
        <Divider hidden={true} />
        <CCAM.Table
          client={client}
          actes={this.state.actes}
          onSelection={acte => this.onSelection(acte)}
        />
        <Divider hidden={true} />
        <CCAM.Tarification
          client={client}
          codActe={this.state.codActe}
          success={detail => this.onSuccess(detail)}
          dynamic={true}
        />
        <Divider hidden={true}/>
        <CCAM.Detail detail={this.state.detail} />
      </React.Fragment>
    );
  }
}