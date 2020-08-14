import React from "react";
import PatientSearch from "./Search";

export default class Patients extends React.Component {
  static Search = PatientSearch;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
