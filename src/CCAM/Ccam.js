//https://bagja.net/tips/react-component-with-dot-notation.html
//https://www.jakewiesler.com/blog/compound-component-basics/

import React from "react";
import CSearch from "./CSearch";
import CTable from "./CTable";
import Pagination from "./Pagination";

export default class Ccam extends React.Component {
  static Search = CSearch;
  static Table = CTable;
  static Pagination = Pagination;
  render() {
    const { children } = this.props;
    return(
      <React.Fragment>
        {React.Children.map(children, child => child )}
      </React.Fragment>
    );
  }
}