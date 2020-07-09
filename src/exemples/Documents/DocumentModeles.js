import React from "react";
import { Divider } from "semantic-ui-react";
import { Documents } from "../../Components";
import { Client } from "rhapi-client";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class DocumentsDocumentModeles extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Documents.DocumentModeles</b> pour
          afficher la liste des modèles de documents.
        </p>
        <p>
          Voir la documentation du composant{" "}
          <a
            href="https://github.com/rhapi-project/rhapi-ui-react/blob/master/docs/composants.md#documentmodeles"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>Documents.DocumentModeles</b>
          </a>
          .
        </p>
        <Divider hidden={true} />
        <Documents.DocumentModeles client={client} idPatient={3} />
      </React.Fragment>
    );
  }
}
