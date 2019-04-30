import React from "react";
import { Shared } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

export default class SharedGrilleDents extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Shared.GrilleDents</b> pour la grille de saisie des localisations dentaires.
        </p>
        <Divider hidden={true} />
        <Shared.GrilleDents
          onSelection={dents => console.log(dents)}
        />
      </React.Fragment>
    );
  }
}