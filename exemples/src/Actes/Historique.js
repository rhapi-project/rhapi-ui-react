import React from "react";
import ReactDOM from 'react-dom';
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Confirm, Divider, Form } from "semantic-ui-react";
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
      idPatient : 0,
      showModal: false,
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
    } else if (_.isEqual(action,"Editer")) {
      console.log("action : " + action);
    }
  }

  remove = () => {
    this.setState({
      showModal: false
    });
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
        <Actes.Historique 
          client={client}
          idPatient={this.state.idPatient}
          actesSelected={this.state.actesSelected}
          onSelectionChange={this.onSelectionChange}
          onActeDoubleClick={this.onActeDoubleClick}
          onAction={this.onAction}
        />
        <Confirm
          open={this.state.showModal}
          header="Supression"
          content="Etes-vous sûr de vouloir supprimer ?"
          onCancel={this.remove}
          onConfirm={this.remove}
        />
      </React.Fragment>
    );
  }
}
