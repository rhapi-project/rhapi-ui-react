import React from "react";
import {
  Divider,
  Form
} from "semantic-ui-react";
import _ from "lodash";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8}
];

export default class ActesDocument extends React.Component {
  state = {
    idPatient: null,
    patient: {},
    data: "",
    devis: {}
  };

  onPatientChange = id => {
    if (id && id !== 0) {
      client.Patients.read(
        id,
        {},
        result => {
          //console.log(result);
          this.setState({ patient: result });
          this.loadActes(id);
        },
        error => {
          console.log(error);
        }
      );
    }
    this.setState({ idPatient: id });
  };

  loadHtmlFile = (e, d) => {
    let filesSelected = document.getElementById(d.id).files;
    if (filesSelected.length === 1) {
      let f = filesSelected[0];
      let fr = new FileReader();
      fr.readAsText(f);
      fr.onload = event => {
        //let data = event.target.result;
        this.setState({
          data: event.target.result
        });
      }
    }
  };

  // sur cet exemple on récupère les actes d'un devis (pour un patient donné)
  loadActes = idPatient => {
    let params = {
      _code: "#DEVIS",
      //_etat: 1, // TODO : voir quel type de devis récupérer
      _idPatient: idPatient
    };
    client.Actes.readAll(
      params,
      result => {
        //console.log(result);
        this.setState({
          devis: _.isEmpty(result.results) ? {} : result.results[0]
        });
      },
      error => {
        console.log(error);
      }
    )
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Traitement de documents (exemple modèle Devis)
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Group>
            <Form.Dropdown
              label="ID du patient"
              placeholder="Sélectionner un patient"
              selection={true}
              options={patients}
              onChange={(e, d) => this.onPatientChange(d.value)}
              value={this.state.idPatient}
            />
            <Form.Input
              id="file"
              label="Sélectionner un model (format html)"
              type="file"
              accept=".html"
              onChange={(e, d) => {
                this.loadHtmlFile(e, d);
              }}
            />
          </Form.Group>
        </Form>

        <Divider hidden={true} />
        
        {/* module d'édition d'un document */}
        <Actes.Document
          data={this.state.data}
          patient={this.state.patient}
          praticien={null}
          devis={this.state.devis}
        />
      </React.Fragment>
    );
  }
}