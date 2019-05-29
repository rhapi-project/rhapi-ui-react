//https://bagja.net/tips/react-component-with-dot-notation.html
//https://www.jakewiesler.com/blog/compound-component-basics/

import React from "react";
import Detail from "./Detail";
import Fiche from "./Fiche";
import Search from "./Search";
import Table from "./Table";
import Tarification from "./Tarification";

export default class CCAM extends React.Component {
  static Detail = Detail;
  static Fiche = Fiche;
  static Table = Table;
  static Search = Search;
  static Tarification = Tarification;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
