import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "../../Components";
import { Divider, Form, Radio } from "semantic-ui-react";

import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8 }
];

const descriptionType = [
  { text: "Nom court", value: "court" },
  { text: "Nom long", value: "long" }
];

export default class ActesSaisieValidation extends React.Component {
  state = {
    idPatient: null,
    typeActe: "#FSE",
    defaultDescriptionType: "court"
  };

  componentDidMount() {
    this.getPreferences();
  }

  getPreferences = () => {
    let pref = JSON.parse(localStorage.getItem("localPreferences"));
    if (pref) {
      if (_.isUndefined(pref.defaultDescriptionType)) {
        pref.defaultDescriptionType = "long";
      }
      localStorage.setItem("localPreferences", JSON.stringify(pref));
      this.setState({
        defaultDescriptionType: pref.defaultDescriptionType
      });
    } else {
      let obj = {
        defaultDescriptionType: "long"
      };
      localStorage.setItem("localPreferences", JSON.stringify(obj));
      this.setState({
        defaultDescriptionType: obj.defaultDescriptionType
      });
    }
  };

  render() {
    let actions = [
      { text: "Exemple action", icon: "check", action: il => console.log(il) }
    ];
    return (
      <React.Fragment>
        <p>
          Saisie et validation d'un acte #FSE ou #DEVIS pour un patient donné.
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Group>
            <Form.Dropdown
              label="ID du patient"
              placeholder="Sélectionner un patient"
              selection={true}
              options={patients}
              onChange={(e, d) => this.setState({ idPatient: d.value })}
              value={this.state.idPatient}
            />
            <Form.Dropdown
              label="Type de description par défaut"
              placeholder="Sélectionner le type"
              selection={true}
              options={descriptionType}
              value={this.state.defaultDescriptionType}
              onChange={(e, d) => {
                let pref = JSON.parse(localStorage.getItem("localPreferences"));
                if (pref) {
                  pref.defaultDescriptionType = d.value;
                } else {
                  pref = { defaultDescriptionType: d.value };
                }
                localStorage.setItem("localPreferences", JSON.stringify(pref));
                this.setState({ defaultDescriptionType: d.value });
              }}
            />
          </Form.Group>
          <Form.Input label="Type d'actes">
            <Radio
              label="FSE"
              value="#FSE"
              checked={this.state.typeActe === "#FSE"}
              onChange={(e, d) => this.setState({ typeActe: d.value })}
            />
            <Radio
              style={{ marginLeft: "20px" }}
              label="PROJET"
              value="#DEVIS"
              checked={this.state.typeActe === "#DEVIS"}
              onChange={(e, d) => this.setState({ typeActe: d.value })}
            />
          </Form.Input>
        </Form>

        <Divider hidden={true} />

        {/* saisie et validation des actes */}
        <Actes.SaisieValidation
          client={client}
          idPatient={this.state.idPatient}
          typeActe={this.state.typeActe}
          defaultDescriptionType={this.state.defaultDescriptionType}
          codGrille={13}
          executant="D1"
          specialite={19}
          lignes={10}
          actions={actions}
          onForceChangeType={type => this.setState({ typeActe: type })}
        />
      </React.Fragment>
    );
  }
}
