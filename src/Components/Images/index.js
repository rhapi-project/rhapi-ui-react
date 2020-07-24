import React from "react";
import Importation from "./Importation";
import Gallerie from "./Gallerie";

export default class Images extends React.Component {
  static Importation = Importation;
  static Gallerie = Gallerie;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
