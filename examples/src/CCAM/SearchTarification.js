import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class SearchPagination extends React.Component {
  state = {
    selectedActe: {},
    actes: []
  };

  onSelection = acte => {
    // Après la selection d'un acte masquer le tableau des résultats
    this.setState({ selectedActe: acte, actes: [] });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results });
  };

  render() {
    //console.log(this.state.selectedActe);
    return (
      <React.Fragment>
        <p>
          Description de l'exemple...
        </p>
        <Divider hidden={true} />
        <CCAM.Search
          client={client}
          onLoadActes={this.onLoadActes}
        />
        <Divider hidden={true} />
        <CCAM.Table
          actes={this.state.actes}
          onSelection={acte => this.onSelection(acte)}  
        />
        <CCAM.Tarification 
          client={client}
          acte={this.state.selectedActe}
        />
      </React.Fragment>
    );
  }
}
