import React from "react";
import { Client } from "rhapi-client";
import { Actes, Documents } from "../../Components";
import { Button, Divider, Form, Radio } from "semantic-ui-react";

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
  { text: "8", value: 8 }
];

const descriptionType = [
  { text: "Nom court", value: "court" },
  { text: "Nom long", value: "long" }
];

export default class ActesSaisieValidation extends React.Component {
  state = {
    idPatient: null,
    acteToAdd: {}, // acte à ajouter dans une FSE
    fse: {},
    typeActe: "#FSE",
    modalCreationDocument: false,
    modalValidationActes: false
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

  createFSE = (idPatient, typeActe, acteToAdd) => {
    let params = {
      code: typeActe,
      etat: 1,
      idPatient: idPatient,
      description: "Nouvel acte du patient d'id " + idPatient
    };
    client.Actes.create(
      params,
      result => {
        //console.log(result);
        this.setState({ fse: result, acteToAdd: acteToAdd });
      },
      error => {
        console.log(error);
        this.setState({ fse: {} });
      }
    );
  };

  onPatientChange = (id, typeActe, acteToAdd) => {
    this.setState({
      idPatient: id,
      modalValidationActes: false,
      modalCreationDocument: false
    });
    if (id && id !== 0) {
      let params = {
        _code: typeActe,
        _etat: 1,
        _idPatient: id
      };
      client.Actes.readAll(
        params,
        result => {
          let actes = result.results;
          if (_.isEmpty(actes)) {
            this.createFSE(id, typeActe, acteToAdd);
          } else if (actes.length > 1) {
            let recent = _.maxBy(actes, a => moment.max(moment(a.modifiedAt)));
            this.setState({ fse: recent, acteToAdd: acteToAdd });
          } else {
            this.setState({ fse: actes[0], acteToAdd: acteToAdd });
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

  destroy = () => {
    client.Actes.destroy(
      this.state.fse.id,
      result => {
        this.setState({ fse: {} });
        this.onPatientChange(this.state.idPatient, this.state.typeActe, {});
      },
      error => {
        console.log(error);
      }
    );
  };

  onError = () => {
    this.setState({ fse: {} });
  };

  handleChangeType = (type, acteToAdd) => {
    this.setState({ typeActe: type });
    this.onPatientChange(this.state.idPatient, type, acteToAdd);
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
              onChange={(e, d) =>
                this.onPatientChange(d.value, this.state.typeActe, {})
              }
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
              onChange={(e, d) => this.handleChangeType(d.value, {})}
            />
            <Radio
              style={{ marginLeft: "20px" }}
              label="PROJET"
              value="#DEVIS"
              checked={this.state.typeActe === "#DEVIS"}
              onChange={(e, d) => this.handleChangeType(d.value, {})}
            />
          </Form.Input>
        </Form>
        <Divider hidden={true} />
        {!_.isEmpty(this.state.fse) ? (
          <div>
            <Actes.Saisie
              client={client}
              idActe={this.state.fse.id}
              codGrille={13}
              executant="D1"
              specialite={19} // new
              onError={this.onError}
              lignes={10}
              actions={actions}
              acteToAdd={this.state.acteToAdd}
              addToFSE={acte => {
                this.handleChangeType("#FSE", acte);
              }}
            />
            <span>
              <Button
                content="Valider"
                onClick={() => {
                  if (_.isEmpty(this.state.fse.contentJO.actes)) {
                    return;
                  }
                  this.setState({ modalValidationActes: true });
                }}
              />
              <Button
                content="Supprimer"
                negative={true}
                onClick={this.destroy}
              />
            </span>
          </div>
        ) : null}

        {/* modal de validation d'un acte */}
        <Actes.ValidationActes
          client={client}
          modeleDocument={
            this.state.typeActe === "#FSE"
              ? "FACTURE"
              : this.state.typeActe === "#DEVIS"
              ? "DEVIS"
              : ""
          }
          idActe={this.state.fse.id}
          open={this.state.modalValidationActes}
          onClose={() =>
            this.onPatientChange(this.state.idPatient, this.state.typeActe, {})
          }
          onDocumentGeneration={() => {
            this.setState({
              modalCreationDocument: true
            });
          }}
        />

        {/* modal de chargement à la création d'un document */}
        <Documents.DocumentFromActes
          client={client}
          open={this.state.modalCreationDocument}
          idPatient={this.state.idPatient}
          idFse={this.state.fse.id}
          user=""
          typeDocument={
            this.state.typeActe === "#FSE"
              ? "FACTURE"
              : this.state.typeActe === "#DEVIS"
              ? "DEVIS"
              : ""
          }
          onClose={() =>
            this.onPatientChange(this.state.idPatient, this.state.typeActe, {})
          }
        />
      </React.Fragment>
    );
  }
}
