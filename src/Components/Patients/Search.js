import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Modal, Search } from "semantic-ui-react";
import _ from "lodash";
import { affichageDenomination, civilite } from "../lib/Helpers";

const propDefs = {
  description: "Composant de recherche élargie d'un patient",
  example: "",
  propDocs: {
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal",
    onPatientSelection: "Callback à la selection d'un patient"
  },
  propTypes: {
    client: PropTypes.any,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onPatientSelection: PropTypes.func
  }
};

const options = [
  { text: "Recherche par IPP", value: 1 },
  { text: "Recherche par IPP2", value: 2 },
  { text: "Recherche par nom + prénom", value: 3 },
  { text: "Recherche par prénom + nom", value: 4 },
  { text: "Recherche par téléphones", value: 5 },
  { text: "Recherche par numéro de sécurité sociale", value: 6 }
];

const denominationDefaultFormat = "NP";

export default class PatientSearch extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    searchBy: 1,
    isLoading: false,
    resultStr: "", // denomination du patient sélectionné + ipp, ipp2 et naissance
    searchValue: "",
    searchResults: [],
    idPatient: -1,
    patientDenom: "" // denomination du patient
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      isLoading: false,
      resultStr: "",
      searchValue: "",
      searchResults: [],
      idPatient: -1,
      patientDenom: ""
    });
  };

  completionSearch = (champ, valeur, texte) => {
    let params = {};
    let results = [];

    if (champ === "ipp") {
      params = { ipp: valeur, format: denominationDefaultFormat, texte: "***" };
    } else {
      params = { format: valeur, texte: texte };
    }

    this.props.client.Patients.completion(
      params,
      patients => {
        _.forEach(patients, patient => {
          let result = {
            id: patient.id,
            title: patient.completion,
            description: _.isEmpty(patient.naissance)
              ? ""
              : new Date(patient.naissance.split("T")[0]).toLocaleDateString(
                  "fr-FR"
                )
          };
          results.push(result);
        });
        this.setState({ isLoading: false, searchResults: results });
      },
      error => {
        console.log(error);
      }
    );
  };

  telephoneSearch = telephone => {
    let params = { format: denominationDefaultFormat, texte: telephone };
    let results = [];
    this.props.client.Patients.telephones(
      params,
      patients => {
        _.forEach(patients, patient => {
          let result = {
            id: patient.id,
            title: patient.completion,
            description: patient.denomination
          };
          results.push(result);
        });
        this.setState({ isLoading: false, searchResults: results });
      },
      error => {
        console.log(error);
      }
    );
  };

  readAllSearch = (query, value) => {
    let params = {};
    let results = [];
    if (query === "ipp2") {
      params = {
        q1: "ipp2,Like," + value
      };
    } else {
      // query === nir
      params = {
        q1: "nir,Like," + value + "*"
      };
    }
    this.props.client.Patients.readAll(
      params,
      patients => {
        _.forEach(patients.results, patient => {
          let result = {
            id: patient.id,
            title:
              query === "ipp2"
                ? patient.nom + " " + patient.prenom
                : patient.nir,
            description:
              query === "ipp2"
                ? _.isEmpty(patient.naissance)
                  ? ""
                  : new Date(
                      patient.naissance.split("T")[0]
                    ).toLocaleDateString("fr-FR")
                : patient.nom + " " + patient.prenom
          };
          results.push(result);
        });
        this.setState({ isLoading: false, searchResults: results });
      },
      error => {
        console.log(error);
      }
    );
  };

  onSearch = value => {
    if (value === "") {
      this.reset();
      return;
    } else {
      this.setState({ isLoading: true, searchValue: value });
    }

    if (_.includes([1, 3, 4], this.state.searchBy)) {
      // recherche par ipp ou nom + prenom ou prenom + nom
      // api Patients.completion
      if (this.state.searchBy === 1) {
        this.completionSearch("ipp", value);
      } else if (this.state.searchBy === 3) {
        this.completionSearch("format", "NP", value);
      } else {
        this.completionSearch("format", "PN", value);
      }
    } else if (this.state.searchBy === 5) {
      // api Patients.telephones
      this.telephoneSearch(value);
    } else {
      // ipp2 ou num de sécurité sociale
      // api Patients.readAll
      if (this.state.searchBy === 2) {
        this.readAllSearch("ipp2", value);
      } else {
        this.readAllSearch("nir", value);
      }
    }
  };

  handleResultSelect = result => {
    this.props.client.Patients.read(
      result.id,
      {},
      patient => {
        let naissanceDate = _.isEmpty(patient.naissance)
          ? ""
          : new Date(patient.naissance.split("T")[0]).toLocaleDateString(
              "fr-FR"
            );
        let display =
          "#" +
          patient.id +
          " / " +
          patient.ipp2 +
          " / " +
          (_.isUndefined(patient.civilite)
            ? ""
            : civilite(true, patient.civilite)) +
          "  " +
          affichageDenomination(
            denominationDefaultFormat,
            patient.nom,
            patient.prenom
          ) +
          "  " +
          (patient.genre === 2 ? "née" : "né") +
          " le " +
          naissanceDate;
        this.setState({
          searchValue: result.title,
          idPatient: result.id,
          resultStr: display,
          patientDenom: affichageDenomination(
            denominationDefaultFormat,
            patient.nom,
            patient.prenom
          )
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <Modal size="tiny" open={this.props.open}>
          <Modal.Header>Recherche élargie d'un patient</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Dropdown
                fluid={true}
                selection={true}
                options={options}
                defaultValue={this.state.searchBy}
                onChange={(e, d) => {
                  this.setState({ searchBy: d.value });
                  this.reset();
                }}
              />

              <Form.Input>
                <Search
                  fluid={true}
                  type="number"
                  loading={this.state.isLoading}
                  placeholder="Recherche d'un patient..."
                  value={this.state.searchValue}
                  showNoResults={false}
                  results={this.state.searchResults}
                  onSearchChange={(e, d) => this.onSearch(d.value)}
                  onResultSelect={(e, d) => this.handleResultSelect(d.result)}
                  style={{ width: "100%" }}
                />
              </Form.Input>

              <Form.Input
                style={{
                  visibility: this.state.idPatient === -1 ? "hidden" : "visible"
                }}
              >
                <div style={{ fontSize: "12px" }}>
                  <strong>{this.state.resultStr}</strong>
                </div>
              </Form.Input>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
            <Button
              disabled={this.state.idPatient === -1}
              primary={true}
              content="Sélectionner"
              onClick={() => {
                if (this.props.onPatientSelection) {
                  this.props.onPatientSelection(
                    this.state.idPatient,
                    this.state.patientDenom
                  );
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
