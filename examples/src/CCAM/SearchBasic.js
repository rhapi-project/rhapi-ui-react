import React from "react";
import { Client } from "rhapi-client";
import { CcamSearch } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class SearchBasic extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Cet exemple utilise <b>CcamSearch</b> pour la recherche des actes en
          CCAM et retourne simplement les résultats en console.
        </p>
        <a
          href="https://react.semantic-ui.com/modules/search/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Semantic-ui-react
        </a>
        <Divider hidden={true} />
        <CcamSearch
          client={client}
          getActesObject={results => console.log(results)}
        />
      </React.Fragment>
    );
  }
}
