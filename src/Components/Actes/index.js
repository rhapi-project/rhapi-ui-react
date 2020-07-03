import React from "react";
import Saisie from "./Saisie";
import Historique from "./Historique";
import ModalSearch from "./ModalSearch";
import Favoris from "./Favoris";
import Edition from "./Edition";
import Note from "./Note";
import ModalSelectActes from "./ModalSelectActes";
import ValidationActes from "./ValidationActes";
import SaisieValidation from "./SaisieValidation";
import ModalActeTitre from "./ModalActeTitre";

export default class Actes extends React.Component {
  static Saisie = Saisie;
  static Historique = Historique;
  static ModalSearch = ModalSearch;
  static Favoris = Favoris;
  static Edition = Edition;
  static Note = Note;
  static ModalSelectActes = ModalSelectActes;
  static ValidationActes = ValidationActes;
  static SaisieValidation = SaisieValidation;
  static ModalActeTitre = ModalActeTitre;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
