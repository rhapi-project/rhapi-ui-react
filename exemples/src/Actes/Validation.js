import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Button, Divider, Form, Message, Modal } from "semantic-ui-react";

import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

const patients = [
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
]
export default class ActesValidation extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient: 2,
      fse: {},
      msgSaveFSE: ""
    });
  };

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };

  createFSE = () => {
    let params = {
      code: "#FSE",
      etat: 1,
      idPatient: this.state.idPatient,
      description: "Nouvelle FSE " + this.state.idPatient
    };
    client.Actes.create(
      params,
      result => {
        //console.log(result);
        this.setState({ fse: result, msgSaveFSE: "" });
      },
      error => {
        console.log(error);
      }
    );
  };

  onUpdateFSE = actes => {
    client.Actes.read(
      this.state.fse.id,
      {},
      result => {
        //console.log(result);
        if (result.lockRevision === this.state.fse.lockRevision) {
          this.update(actes);
        } else {
          console.log("Des modifications ont été apportées à cet acte. Voulez-vous recharger et continuer ?");
        }
      },
      error => {
        console.log(error);
      }
    )
  };

  update = actes => {
    let obj = {};
    obj.actes = actes;
    client.Actes.update(
      this.state.fse.id,
      { contentJO: obj },
      result => {
        //console.log(result);
        this.setState({ fse: result, msgSaveFSE: "" });
      },
      error => {
        console.log(error);
      }
    )
  };

  saveFSE = () => {
    client.Actes.update(
      this.state.fse.id,
      { etat: 0 },
      result => {
        this.setState({ msgSaveFSE: "Cette FSE a été bien enregistrée !", fse: {} });
      },
      error => {
        this.setState({ msgSaveFSE: "Erreur de sauvegarde de la FSE !"});
      }
    );
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
            <Form.Button 
              content="Créer une FSE"
              onClick={this.createFSE}
            />
          </Form.Group>
        </Form>
        <Divider hidden={true} />
        {!_.isEmpty(this.state.fse)
          ? <div>
              <Actes.Saisie
                fse={this.state.fse}
                client={client}
                idPatient={this.state.idPatient}
                lignes={10}
                onUpdate={this.onUpdateFSE}
              />
              <div style={{ textAlign: "center" }}>
                <Button
                  content="Valider"
                  onClick={this.saveFSE}
                />
              </div>
            </div>
          : ""
        }
        <Modal open={!_.isEmpty(this.state.msgSaveFSE)} onClose={() => this.setState({ msgSaveFSE: "" })}>
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