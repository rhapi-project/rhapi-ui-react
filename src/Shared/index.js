import React from "react";
import Localisations from "./Localisations";
import SaisieDentaire from "./SaisieDentaire";
import SaisiesDentaires from "./SaisiesDentaires";
import HistoriqueActes from "./HistoriqueActes";

export default class Shared extends React.Component {
  static Localisations = Localisations;
  static SaisieDentaire = SaisieDentaire;
  static SaisiesDentaires = SaisiesDentaires;
  static HistoriqueActes = HistoriqueActes;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
