import React from "react";
import PropTypes from "prop-types";

import Tarification from "./Tarification";

const propDefs = {
  description:
    "Composant de présentation d'une fiche d'un acte. Celui-ci utilise le composant de Tarification",
  example: "Fiche",
  propDocs: {
    codActe: 'Code de l\'acte CCAM, par défaut ""',
    codActivite: 'Code de l\'activité, par défaut "1"',
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    date:
      "Date de la tarification de l'acte, au format ISO. Par défaut la date du jour",
    modificateurs:
      "Modificateurs appliqués à l'acte, par défaut une chaîne de caractères vide"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    codActe: PropTypes.string,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    date: PropTypes.string,
    modificateurs: PropTypes.string
  }
};

export default class Fiche extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    codActe: "",
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    date: new Date().toISOString(),
    modificateurs: ""
  };

  render() {
    return (
      <React.Fragment>
        <Tarification
          client={this.props.client}
          codActe={this.props.codActe}
          codActivite={this.props.codActivite}
          codDom={this.props.codDom}
          codGrille={this.props.codGrille}
          codPhase={this.props.codPhase}
          date={this.props.date}
          dynamic={false}
          error={() => {}}
          hidden={false}
          modificateurs={this.props.modificateurs}
          success={obj => {} /*console.log(obj)*/}
        />
      </React.Fragment>
    );
  }
}
