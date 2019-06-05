import React from "react";
import ReactDOM from 'react-dom';
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider, Form } from "semantic-ui-react";
import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");
const patients = [
  { text: "Aucun patient", value: -1 },
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "5", value: 5 },
  { text: "6", value: 6 },
  { text: "8", value: 8 },
]

export default class ActesHistorique extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient : -1,
      actesSelected: []
    });
  }

  componentDidMount() {
    document.addEventListener('click',this.onClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click',this.onClickOutside, true);
  }

  onClickOutside = (event) => {
    const domNode = ReactDOM.findDOMNode(this);

    if (!event.ctrlKey) {
      if (!domNode || !domNode.contains(event.target)) {
        this.setState({
          actesSelected: []
        });
      }
    }
  }

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };

  onActeDoubleClick = (id) => {
    let single_acte = [];
    single_acte.push(id);
    this.setState({ actesSelected: single_acte })
  }

  onSelectionChange = (e, id) => {
    if (e.ctrlKey) {
      let multi_actes = this.state.actesSelected;

      // Possibilité d'améliorer avec lodash
      if (_.includes(multi_actes,id)) {
        const index = multi_actes.indexOf(id);
        multi_actes.splice(index,1);
        this.setState({ actesSelected: multi_actes });
      } else {
        multi_actes.push(id);
        this.setState({ actesSelected: multi_actes });
      }
    } else {
      let single_acte = [];
      single_acte.push(id);
      this.setState({ actesSelected: single_acte });
    }
  }

  onAction = (id, action) => {
    console.log("onAction : " + id);
    if (_.isEqual(action,"Supprimer")) {
      console.log("action : " + action);

      client.Actes.destroy(
        id,
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
    } else if (_.isEqual(action,"Editer")) {
      console.log("action : " + action);
    }
  }

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
          actesSelected={this.state.actesSelected}
          onSelectionChange={this.onSelectionChange}
          onActeDoubleClick={this.onActeDoubleClick}
          onAction={this.onAction}
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