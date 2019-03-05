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

  onLoadActes = obj => {
    this.setState({ actes: obj.results, informations: obj.informations });
  };

  changePage = obj => {
    this.setState({ actes: obj.actes, informations: obj.informations });
  };

  render() {
    return(
      <React.Fragment>
        <p>
          Le composant <b>Ccam.Search</b> est utilisé dans cet exemple pour faire la 
          recherche des actes CCAM. <br />
          Le résultat obtenu après une recherche est affiché par le composant <b>Ccam.Table</b>.<br />
          Tout en bas du résultat, se trouve le composant <b>Ccam.Pagination</b> qui propose des 
          boutons de navigations entre plusieurs pages du résultat obtenu.
        </p>
        <Divider hidden={true} />
        <CCAM.Search 
          client={client}
          onLoadActes={this.onLoadActes}
        />
        <Divider hidden={true} />
        <CCAM.Pagination 
          client={client}
          actes={this.state.actes}
          informations={this.state.informations}
          onLoadResult={this.changePage}
        />
        <Divider hidden={true} />
        <CCAM.Table 
          actes={this.state.actes}
        />
        
      </React.Fragment>
    );
  }
}