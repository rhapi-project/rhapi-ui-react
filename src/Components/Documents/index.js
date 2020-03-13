import React from "react";
import DocumentModeles from "./DocumentModeles";
import TextDocument from "./TextDocument";
import ListeDocument from "./ListeDocument";
import DocumentArchives from "./DocumentArchives";
import RenameDocument from "./RenameDocument";

export default class Documents extends React.Component {
  static DocumentModeles = DocumentModeles;
  static TextDocument = TextDocument;
  static ListeDocument = ListeDocument;
  static DocumentArchives = DocumentArchives;
  static RenameDocument = RenameDocument;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
