//https://bagja.net/tips/react-component-with-dot-notation.html
//https://www.jakewiesler.com/blog/compound-component-basics/

import React from "react";
import Search from "./Search";
import Table from "./Table";
import Pagination from "./Pagination";

export default class CCAM extends React.Component {
  static Search = Search;
  static Table = Table;
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