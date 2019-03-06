import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class SearchPagination extends React.Component {
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
    return (
      <React.Fragment>
        <p>
          Cet exemple utilise <b>Ccam.Search</b> pour la recherche des actes en
          CCAM et le résultat obtenu est affiché par le composant{" "}
          <b>Ccam.Table</b>.<br />
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
          onPageSelect={this.onPageSelect}
          showPagination={true}          
        />
      </React.Fragment>
    );
  }
}
