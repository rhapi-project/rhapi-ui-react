import React from "react";
import { Documents } from "../../Components";
import { Client } from "rhapi-client";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class DocumentsDocumentModeles extends React.Component {
  /*state = {
    modeles: []
  };

  componentDidMount() {

  };*/
  render() {
    return (
      <React.Fragment>
        <Documents.DocumentModeles client={client} />
      </React.Fragment>
    );
  }
}
