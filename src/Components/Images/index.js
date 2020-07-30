import React from "react";
import Importation from "./Importation";
import Galerie from "./Galerie";
import ImageLecteur from "./ImageLecteur";

export default class Images extends React.Component {
  static Importation = Importation;
  static Galerie = Galerie;
  static ImageLecteur = ImageLecteur;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
