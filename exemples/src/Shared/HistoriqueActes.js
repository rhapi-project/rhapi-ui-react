import React from "react";
import { Shared } from "rhapi-ui-react";
import { Client } from "rhapi-client";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class SharedHistoriqueActes extends React.Component {
  
  render() {
    return (
        <Shared.HistoriqueActes client={client} />
    );
  }
}
