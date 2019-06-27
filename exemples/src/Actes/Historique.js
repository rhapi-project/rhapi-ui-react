import React from "react";
import { Client } from "rhapi-client";
import { Actes, Shared} from "rhapi-ui-react";
import { Divider, Form } from "semantic-ui-react";

import moment from "moment";
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
      idPatient : 1,
      localisation: "",
      openLocalisations: false,
      startAt: "",
      endAt: ""
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

  close = () => {
    this.setState({ openLocalisations: false });
  };

  render() {
    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Historique</b> pour l'historique des actes d'un patient.
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Dropdown
            width={2}
            label="ID du patient"
            placeholder="Sélectionner un patient"
            selection={true}
            options={patients}
            onChange={(e, d) => this.onPatientChange(d.value)}
            value={this.state.idPatient}
          />
          <Form.Group>
            <Shared.Periode
              startYear={2015}
              onPeriodeChange={(startAt, endAt) => {
                if (startAt && endAt) {
                  console.log("Du : " + moment(startAt).format("LLL"));
                  console.log("Au : " + moment(endAt).format("LLL"));
                  this.setState({
                    startAt: startAt,
                    endAt: endAt
                  });
                } else {
                  console.log("Durée indéterminée");
                  this.setState({
                    startAt: "",
                    endAt: ""
                  });
                }
              }}
            />
            <Form.Input
              width={5}
              placeholder="Localisation"
              onClick={() => this.setState({ openLocalisations: true })}
              value={this.state.localisation}
            />
          </Form.Group>
        </Form>
        <Divider hidden={true} />
        <Shared.Localisations 
          localisation={this.state.localisation}
          onSelection={localisation => {
            this.setState({ localisation: localisation });
          }}
          modal={{
            size: "large",
            open: this.state.openLocalisations,
            onClose: this.close
          }}
        />
        <Divider hidden={true} />
        <Actes.Historique
          client={client}
          idPatient={this.state.idPatient}
          onActeClick={this.onActeClick}
          onActeDoubleClick={this.onActeDoubleClick}
          onSelectionChange={this.onSelectionChange}
          limit={10}
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
          localisation={this.state.localisation}
          startAt={this.state.startAt}
          endAt={this.state.endAt}
        />
      </React.Fragment>
    );
  }
}