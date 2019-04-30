import React from "react";
import GrilleDents from "./GrilleDents";

export default class CCAM extends React.Component {
  static GrilleDents = GrilleDents;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}