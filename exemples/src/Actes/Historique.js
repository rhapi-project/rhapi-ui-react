import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider, Form } from "semantic-ui-react";
import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");
const patients = [
  { text: "Aucun patient", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "5", value: 5 },
  { text: "6", value: 6 },
  { text: "7", value: 7 },
  { text: "8", value: 8 },
]

export default class ActesHistorique extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient : 1
    });
  }

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };

  onActeClick = id => {
    // l'id de l'acte en paramètre
    console.log(`onActeClick ${id}`);
  }

  onActeDoubleClick = id => {
    // l'id de l'acte en paramètre
    console.log(`onActeDoubleClick ${id}`);
  }

  onSelectionChange = ids => {
    // array des id des actes en paramètre
    let actes = ids.join(",");
    console.log(`onSelectionChange ${actes}`);
  }

  onAction = (id, action) => {
    // l'id de l'acte et l'action passés en paramètres
    if (_.isEqual(action, "ajouter")) {
      console.log(`${id} - Action : ${action}`);
    } else if (_.isEqual(action, "tache")) {
      console.log(`${id} - Action : ${action}`);
    }
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Historique</b> pour l'historique des actes d'un patient.
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Group inline={true}>
            <Form.Dropdown
              label="ID du patient"
              placeholder="Sélectionner un patient"
              selection={true}
              options={patients}
              onChange={(e, d) => this.onPatientChange(d.value)}
              value={this.state.idPatient}
            />
          </Form.Group>
        </Form>
        <Divider hidden={true} />
        <Filtre />
        <Divider hidden={true} />
        <Actes.Historique
          client={client}
          idPatient={this.state.idPatient}
          onActeClick={this.onActeClick}
          onActeDoubleClick={this.onActeDoubleClick}
          onSelectionChange={this.onSelectionChange}
          actions={[
            {
              icon: "add",
              text: "Ajouter",
              action: (id) => this.onAction(id,"ajouter")
            },
            {
              icon: "tasks",
              text: "Tache",
              action: (id) => this.onAction(id,"tache")
            }
          ]}
        />
      </React.Fragment>
    );
  }
}

const dates = [
  { key:"0", text: "Aujourd'hui", value: 0 },
  { key:"1", text: "Hier", value: 1 },
  ( <Divider key="divider1"/> ),
  { key:"2", text: "Du .../.../... au .../.../...", value: 2 },
  ( <Divider key="divider2" /> ),
  { key:"3", text: "Cette semaine", value: 3 },
  { key:"4", text: "La semaine précédente", value: 4 },
  ( <Divider key="divider3" /> ),
  { key:"5", text: "Année civile (bilan) 2019", value: 5 },
  { key:"6", text: "Année flottante au ...", value: 6 }
]

class Filtre extends React.Component {
  componentWillMount() {
    this.setState({
      date: ""
    })
  }

  onDateChange = (date) => {
    this.setState({
      date: date
    })
  }

  render() {
    return(
      <React.Fragment>
        <Form>
          <Form.Group inline={true}>
            <Form.Dropdown
              placeholder="Sélectionner une date"
              selection={true}
              options={dates}
              onChange={(e, d) => this.onDateChange(d.value)}
              value={this.state.date}
            />
          </Form.Group>
        </Form>
      </React.Fragment>
    );
  }
}