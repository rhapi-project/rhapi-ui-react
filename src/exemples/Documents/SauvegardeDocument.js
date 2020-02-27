import React from "react";

//import { Client } from "rhapi-client";

/*// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8}
];*/

export default class DocumentsSauvegardeDocument extends React.Component {
  /*state = {
    idPatient: 
  }*/
  render() {
    return (
      <React.Fragment>
        <p>
          Updload d'un document de type quelconque, document appartenant à un
          patient donné
        </p>
      </React.Fragment>
    );
  }
}
