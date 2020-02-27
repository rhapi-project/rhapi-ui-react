import React from "react";
import CreationDocument from "./CreationDocument";
import TextDocument from "./TextDocument";
import PDFDocument from "./PDFDocument";

export default class Documents extends React.Component {
  static CreationDocument = CreationDocument;
  static TextDocument = TextDocument;
  static PDFDocument = PDFDocument;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, child => child)}
      </React.Fragment>
    );
  }
}
