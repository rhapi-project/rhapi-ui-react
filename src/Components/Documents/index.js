import React from "react";
import DocumentModeles from "./DocumentModeles";
import TextDocument from "./TextDocument";
import ListeDocument from "./ListeDocument";
import DocumentArchives from "./DocumentArchives";

export default class Documents extends React.Component {
  static DocumentModeles = DocumentModeles;
  static TextDocument = TextDocument;
  static ListeDocument = ListeDocument;
  static DocumentArchives = DocumentArchives;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
