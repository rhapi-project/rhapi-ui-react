import React from "react";
import CreationDocument from "./CreationDocument";
import TextDocument from "./TextDocument";
import PDFDocument from "./PDFDocument";
import ListeDocument from "./ListeDocument";

export default class Documents extends React.Component {
  static CreationDocument = CreationDocument;
  static TextDocument = TextDocument;
  static PDFDocument = PDFDocument;
  static ListeDocument = ListeDocument;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
