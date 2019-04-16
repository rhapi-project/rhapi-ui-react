import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMPaginationPages extends React.Component {
  state = {
    actes: [],
    informations: {}
  };

  onClearSearch = () => {
    this.setState({ actes: [], informations: {} });
  };

  onLoadActes = obj => {
    this.setState({ actes: obj.results, informations: obj.informations });
  };

  onPageSelect = obj => {
    this.setState({
      actes: obj.actes,
      informations: obj.informations
    });
  };

  render() {
    // options de pagination
    let pagination = {
      mode: "more"
    };
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>CCAM.Search</b> pour la recherche d'actes
          CCAM et <b>CCAM.Table</b> pour afficher les résultats (avec des
          options de pagination).
        </p>
        <Divider hidden={true} />
        <CCAM.Search
          client={client}
          onClear={this.onClearSearch}
          onLoadActes={this.onLoadActes}
        />
        <Divider hidden={true} />
        <CCAM.Table
          client={client}
          actes={this.state.actes}
          informations={this.state.informations}
          pagination={pagination}
          onPageSelect={this.onPageSelect}
          showPagination={true}
        />
      </React.Fragment>
    );
  }
}
