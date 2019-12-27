import React from "react";
import Saisie from "./Saisie";
import Historique from "./Historique";
import ModalSearch from "./ModalSearch";
import Favoris from "./Favoris";
import Edition from "./Edition";
import Note from "./Note";
import Document from "./Document";

export default class Actes extends React.Component {
  static Saisie = Saisie;
  static Historique = Historique;
  static ModalSearch = ModalSearch;
  static Favoris = Favoris;
  static Edition = Edition;
  static Note = Note;
  static Document = Document;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
