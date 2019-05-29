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
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "8", value: 8}
]
export default class ActesSaisieValidation extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient: null,
      fse: {},
      msgSaveFSE: ""
    });
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
    if (id || id === 0) {
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
        console.log("création avec succès d'un acte");
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
        let actes = _.get(result, "contentJO.actes", []);
        _.forEach(actes, acte => {
          this.createActe(acte, result.id, result.idPatient);
        });
        client.Actes.update(
          result.id,
          { etat: 0 },
          result => {
            this.setState({ msgSaveFSE: "Cette FSE a été bien enregistrée !", fse: {} });
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
        this.setState({ idPatient: null, fse: {} });
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
    return (
      <React.Fragment>
        <p>
          Saisie et validation d'un acte pour un patient donné.
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
        {!_.isEmpty(this.state.fse)
          ? <div>
              <Actes.Saisie
                client={client}
                idActe={this.state.fse.id}
                onError={this.onError}
                lignes={10}
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
            <Button content="OK" onClick={() => this.setState({ idPatient: null, msgSaveFSE: "" })}/>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}