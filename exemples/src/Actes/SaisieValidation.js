import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Button, Divider, Form, Message, Modal } from "semantic-ui-react";

import moment from "moment";
import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "Aucun patient", value: null },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8}
];

const descriptionType = [
  { text: "Nom court", value: "court" },
  { text: "Nom long", value: "long" }
]

export default class ActesSaisieValidation extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient: null,
      fse: {},
      msgSaveFSE: ""
    });
    this.getPreferences();
  };

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

  createFSE = idPatient => {
    let params = {
      code: "#FSE",
      etat: 1,
      idPatient: idPatient,
      description: "Nouvelle FSE du patient d'id " + idPatient
    };
    client.Actes.create(
      params,
      result => {
        //console.log(result);
        this.setState({ fse: result, msgSaveFSE: "" });
      },
      error => {
        console.log(error);
        this.setState({ fse: {} });
      }
    );
  };

  onPatientChange = id => {
    this.setState({ idPatient: id });
    if (id && id !== 0) {
      let params = {
        _code: "#FSE",
        _etat: 1,
        _idPatient: id
      };
      client.Actes.readAll(
        params,
        result => {
          let actes = result.results;
          //console.log(actes);
          if (_.isEmpty(actes)) {
            this.createFSE(id);
          } else if (actes.length > 1) {
            let recent = _.maxBy(actes, a => moment.max(moment(a.modifiedAt)));
            this.setState({ fse: recent });
          } else {
            this.setState({ fse: actes[0] });
          }
        },
        error => {
          console.log(error);
          this.setState({ fse: {} });
        }
      );
    } else {
      this.setState({ fse: {} });
    }
  };

  createActe = (acte, idDocument, idPatient) => {
    let params = {
      code: acte.code,
      doneAt: acte.date,
      localisation: acte.localisation,
      cotation: acte.cotation,
      description: acte.description,
      montant: acte.montant,
      idPatient: idPatient,
      idDocument: idDocument,
      etat: 0
    };
    client.Actes.create(
      params,
      result => {
        //console.log(result);
      },
      error => {
        console.log(error);
        console.log("La création d'un acte a échoué");
      }
    );
  };

  save = () => {
    client.Actes.read(
      this.state.fse.id,
      {},
      result => {
        // les actes vides ne sont pas sauvegardés
        let actes = _.filter(_.get(result, "contentJO.actes", []), a => !_.isEmpty(a.code));
        _.forEach(actes, acte => {
          this.createActe(acte, result.id, result.idPatient);
        });
        client.Actes.update(
          result.id,
          { etat: 0, doneAt: moment().toISOString() },
          result => {
            this.setState({ msgSaveFSE: "Cette FSE a été bien enregistrée !" });
            this.onPatientChange(result.idPatient);
          },
          error => {
            this.setState({ msgSaveFSE: "Erreur de sauvegarde de la FSE !" });
          }
        );
      },
      error => {
        this.setState({ msgSaveFSE:  "Erreur de sauvegarde de la FSE ! Lecture de cette acte impossible "});
      }
    );
  };

  destroy = () => {
    client.Actes.destroy(
      this.state.fse.id,
      result => {
        //this.setState({ fse: {} });
        this.onPatientChange(this.state.fse.id);
      },
      error => {
        console.log(error);
      }
    );
  };

  onError = () => {
    this.setState({ fse: {} });
  };

  render() {
    let actions = [
      { text: "Exemple action", icon: "check", action: il => console.log(il)}
    ];
    return (
      <React.Fragment>
        <p>
          Saisie et validation d'un acte FSE pour un patient donné.
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
        </Form>
        <Divider hidden={true} />
        {!_.isEmpty(this.state.fse)
          ? <div>
              <Actes.Saisie
                client={client}
                idActe={this.state.fse.id}
                codGrille={13}
                executant="D1"
                specialite={19} // new
                onError={this.onError}
                lignes={10}
                actions={actions}
              />
              <span>
                <Button
                  content="Valider"
                  onClick={this.save}
                />
                <Button
                  content="Supprimer"
                  negative={true}
                  onClick={this.destroy}
                />
              </span>
            </div>
          : ""
        }
        <Modal size="mini" open={!_.isEmpty(this.state.msgSaveFSE)} onClose={() => this.setState({ msgSaveFSE: "" })}>
          <Modal.Header>Résultat validation FSE</Modal.Header>
          <Modal.Content>
            <Message>{this.state.msgSaveFSE}</Message>
          </Modal.Content>
          <Modal.Actions>
            <Button content="OK" onClick={() => this.setState({ msgSaveFSE: "" })}/>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}