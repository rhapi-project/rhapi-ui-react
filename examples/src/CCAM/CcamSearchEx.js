import React from "react";
import { Client } from "rhapi-client";
import { CcamSearch } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CcamSearchEx extends React.Component {
  render() {
    return(
      <div>
        <div>
          Un petit descriptif de comment ce composant fonction, les props, les fonctions callbacks etc. <br />
          Dire que ce composant est basé sur le composant <strong>Search</strong> de
          &nbsp;
          <a
            href="https://react.semantic-ui.com/modules/search/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Semantic-ui-react
          </a>
        </div>
        <Divider hidden={true} />
        <div>
          <CcamSearch
            client={client}
          />
        </div>
      </div>
    );
  }
}
