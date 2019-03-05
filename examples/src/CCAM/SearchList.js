import React from "react";
import { Ccam } from "rhapi-ui-react";
import { Divider, Form } from "semantic-ui-react";

import { Client } from "rhapi-client";

// Instanciation du Client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class SearchList extends React.Component {
  state = {
    actes: [],
    actesObject: {}
  };

  onClearSearch = () => {
    this.setState({ actesObject: {}, actes: [] });
  };

  onLoadActes = obj => {
    this.setState({ actesObject: obj, actes: obj.results });
  };

  render() {
    // Les props que l'on souhaite passer au Search de semantic
    let searchProps = {
      placeholder: "Recherche des actes"
    };

    // Les props que l'on souhaite passer au Table de semantic
    let tableProps = {
      basic: true,
      celled: true,
      collapsing: true
      //style: { textAlign: "center" } // le inline CSS sera passé comme ceci
    };

    // Les champs qu'on veut obtenir dans le résultat
    // Si ces champs ne sont pas définis, par défaut le résultat comportera
    // uniquement le "codActe" et "nomLong"
    let headers = [
      { champ: "codActe", title: "Code" }, // le champ qu'on veut récupérer et le titre qu'on lui donne dans le Header de la Table de semantic
      { champ: "dtCreatio", title: "Date création" },
      { champ: "nomLong", title: "Nom long" },
      { champ: "dtModif", title: "Date Modification" }
    ];

    return (
      <React.Fragment>
        <div>
          <p>
            Cet exemple utilise <b>Ccam.Search</b> pour la recherche des actes en
            CCAM et <b>Ccam.Table</b> pour afficher les résultats.
          </p>
          <a
            href="https://react.semantic-ui.com/collections/table/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Semantic-ui-react
          </a>
        </div>
        <Divider hidden={true} />
        <div>
          <Form>
            <Form.Input inline={true} label="Recherche d'un acte CCAM">
              <Ccam.Search
                client={client}
                onClear={this.onClearSearch}
                onLoadActes={this.onLoadActes}
                search={searchProps}
                searchInputLength={3}
              />
            </Form.Input>
          </Form>
          <Divider hidden={true} />
          <Ccam.Table
            actes={this.state.actes}
            headers={headers}
            table={tableProps}
          />
        </div>
      </React.Fragment>
    );
  }
}
