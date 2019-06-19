import React from "react";
import Actions from "./Actions";
import Localisations from "./Localisations";
import Montant from "./Montant";
import Periode from "./Periode";

export default class Shared extends React.Component {
  static Actions = Actions;
  static Localisations = Localisations;
  static Montant = Montant;
  static Periode = Periode;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
