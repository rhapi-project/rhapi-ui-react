import React from "react";
import Saisie from "./Saisie";
import Historique from "./Historique";

export default class Shared extends React.Component {
  static Saisie = Saisie;
  static Historique = Historique;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
