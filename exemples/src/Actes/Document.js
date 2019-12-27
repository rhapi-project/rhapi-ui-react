import React from "react";
//import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";

// Instanciation du client RHAPI sans authentification
//const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesDocument extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Actes.Document />
      </React.Fragment>
    );
  }
}