import React from "react";
import Actions from "./Actions";
import Localisations from "./Localisations";

export default class Shared extends React.Component {
  static Actions = Actions;
  static Localisations = Localisations;
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
