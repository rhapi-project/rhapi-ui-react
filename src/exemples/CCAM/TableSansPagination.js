import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "../../Components";
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
    // props semantic du bouton
    let btnMore = { secondary: true };
    return (
      <React.Fragment>
        <div>
          <p>
            Utilisation du composant <b>CCAM.Search</b> pour la recherche
            d'actes CCAM. Le résultat de la recherche est affiché par le
            composant <b>CCAM.Table</b>.
          </p>
          <p>
            <b>CCAM.Table</b> est base sur le composant <b>Table</b> de&nbsp;
            <a
              href="https://react.semantic-ui.com/collections/table/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Semantic-ui-react
            </a>
          </p>
          <p>
            Voir la documentation du composant{" "}
            <a
              href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#table"
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>CCAM.Table</b>
            </a>
            .
          </p>
        </div>
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
          btnMore={btnMore}
          mode="more"
        />
      </React.Fragment>
    );
  }
}
