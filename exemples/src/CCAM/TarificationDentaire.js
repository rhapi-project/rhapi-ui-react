import React from "react";
import { CCAM, Shared } from "rhapi-ui-react";
import { Divider, Input } from "semantic-ui-react";

export default class CCAMTarificationDentaire extends React.Component {
  render() {
    let daypickerlink = (
      <a
        href="http://react-day-picker.js.org/"
        target="_blank"
        rel="noopener noreferrer"
        title="Documentation du composant REACT-DAY-PICKER"
      >
        DayPicker
      </a>
    );
    
    return (
      <React.Fragment>
        <p>
          Limitation de la recherche aux actes des dentistes. <br />Dans cet exemple,&nbsp;
          les composants <b>{daypickerlink}</b>, <b>Shared.Localisations</b>, <b>CCAM.Search</b>, <b>CCAM.Table</b>&nbsp;
          et <b>CCAM.Tarification</b> sont respectivement utilisés pour <b>la date effective de l'acte</b>,&nbsp;
          la <b>grille des localisations dentaires</b>, la <b>recherche</b> et la <b>sélection</b> d'un&nbsp;
          acte ainsi que la <b>tarification</b>.
        </p>
        <Divider hidden={true} />
      </React.Fragment>
    );
  }
}