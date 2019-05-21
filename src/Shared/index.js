import React from "react";
import Localisations from "./Localisations";
import SaisieDentaire from "./SaisieDentaire";
import SaisiesDentaires from "./SaisiesDentaires";

export default class Shared extends React.Component {
  static Localisations = Localisations;
  static SaisieDentaire = SaisieDentaire;
  static SaisiesDentaires = SaisiesDentaires;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
