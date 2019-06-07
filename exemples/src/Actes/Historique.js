import React from "react";
import ReactDOM from 'react-dom';
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Divider, Form } from "semantic-ui-react";

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
    const domNode = ReactDOM.findDOMNode(this.refs.componentHistorique);

    if (!event.ctrlKey) {
      if (!domNode.contains(event.target)) {
        // this.setState({
        //   actesSelected: []
        // });
      }
    }
  }

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };

  onSelectionChange = ids => {
    console.log("onSelectionChange");
    console.log(ids);
    this.setState({ actesSelected: ids });
  }

  onActeClick = id => {
    console.log("onActeClick");
    console.log(id);
    let singleActe = [];
    singleActe.push(id);
    this.setState({ actesSelected: singleActe });
  }

  onActeDoubleClick = id => {
    console.log("onActeDoubleClick");
    console.log(id);
    let singleActe = [];
    singleActe.push(id);
    this.setState({ actesSelected: singleActe });
  }

  render() {
    console.log(this.state);

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
          ref='componentHistorique'
          client={client}
          idPatient={this.state.idPatient}
          actesSelected={this.state.actesSelected}
          onSelectionChange={this.onSelectionChange}
          onActeClick={this.onActeClick}
          onActeDoubleClick={this.onActeDoubleClick}
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