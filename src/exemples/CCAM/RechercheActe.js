import React from "react";
import { Client } from "rhapi-client";
import { CCAM } from "../../Components";
import { Divider } from "semantic-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class CCAMSearchBasic extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b color="primary">CCAM.Search</b> pour la
          recherche des actes en CCAM. Le résultat de la recherche est retourné
          en console (<kbd>F12</kbd>).
        </p>
        <p>
          Ce composant est basé sur le composant <b>Search</b> de&nbsp;
          <a
            href="https://react.semantic-ui.com/modules/search/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Semantic-ui-react
          </a>
        </p>
        <p>
          Voir la documentation de ce composant{" "}
          <a
            href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#search"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>CCAM.Search</b>
          </a>
          .
        </p>

        <Divider hidden={true} />
        <CCAM.Search
          client={client}
          onLoadActes={results => console.log(results)}
        />
      </React.Fragment>
    );
  }
}
