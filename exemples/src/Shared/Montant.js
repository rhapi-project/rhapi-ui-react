import React from "react";
import { Shared } from "rhapi-ui-react";
import { Divider } from "semantic-ui-react";

export default class SharedMontant extends React.Component {
  componentWillMount() {
    this.setState({ 
      montant: 0
    });
  };
  render () {
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
          <b>Shared.Montant</b> est un composant facilitant la saisie et l'affichage 
          d'un montant au format français.
        </p>
        <p>
          Il se base sur le composant <b>Input</b> de {semanticInput}
        </p>
        <Divider hidden={true} />
        <Shared.Montant
          input={{ fluid: false }}
          montant={this.state.montant}
          onChange={ montant => this.setState({ montant: montant })}
        />
        <Divider hidden={true} />
        <p>
          Montant obtenu en sortie : {this.state.montant}
        </p>
      </React.Fragment>
    )
  }
}