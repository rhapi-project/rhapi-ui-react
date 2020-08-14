import React from "react";
import { Client } from "rhapi-client";
import { Button, Divider } from "semantic-ui-react";
import { Patients } from "../../Components";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class PatientSearch extends React.Component {
  state = {
    modalPatientSearch: false,
    idPatient: null
  };

  render() {
    return (
      <React.Fragment>
        <Button
          content="Recherche élargie d'un patient"
          onClick={() => this.setState({ modalPatientSearch: true })}
        />

        {/* modal de recherche élargie d'un patient */}
        <Patients.Search
          client={client}
          open={this.state.modalPatientSearch}
          onClose={() => this.setState({ modalPatientSearch: false })}
          onPatientSelection={(idPatient, patientDenomination) => {
            this.setState({ idPatient: idPatient, modalPatientSearch: false });
          }}
        />

        <Divider hidden={true} />
        {this.state.idPatient !== null ? (
          <div>
            Identifiant du patient sélectionné :{" "}
            <strong>{this.state.idPatient}</strong>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}
