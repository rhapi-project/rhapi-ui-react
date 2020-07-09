import React from "react";
import { Shared } from "../../Components";
import { Divider } from "semantic-ui-react";

export default class SharedMontant extends React.Component {
  state = {
    montant: 0
  };

  render() {
    let semanticInput = (
      <a
        href="https://react.semantic-ui.com/elements/input/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Semantic-ui-react
      </a>
    );
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Shared.Montant</b> pour la saisie et
          l'affichage d'un montant au format français.
        </p>
        <p>
          Ce composant se base sur le composant <b>Input</b> de {semanticInput}.
        </p>
        <p>
          Voir la documentation du composant{" "}
          <a
            href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#montant"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>Shared.Montant</b>
          </a>
          .
        </p>
        <Divider hidden={true} />
        <Shared.Montant
          input={{ fluid: false }}
          montant={this.state.montant}
          onChange={montant => this.setState({ montant: montant })}
        />
        <Divider hidden={true} />
        <p>Affichage obtenu en sortie : {this.state.montant}</p>
      </React.Fragment>
    );
  }
}
