import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  Button,
  Checkbox,
  Dimmer,
  Dropdown,
  Form,
  Header,
  Icon,
  Input,
  Loader,
  Modal,
  Segment,
  Table
} from "semantic-ui-react";
import Search2 from "../CCAM/Search";
import Table2 from "../CCAM/Table";
import Localisations from "../Shared/Localisations";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import moment from "moment";

import { spacedLocalisation, tarif, toISOLocalisation } from "../lib/Helpers";

const propDefs = {
  description:
    "Ce composant est une modal Semantic de recherche d'un acte. Il intègre " +
    "un date picker, les composants CCAM.Search, CCAM.Table et Shared.Localisations",
  example: "ModalSearch",
  propDocs: {
    code: 'Code de l\'acte CCAM sélectionné. Par défaut ""',
    codActivite: 'Code de l\'activité, par défaut "1"',
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    cotation:
      "Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif)",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    executant:
      "Limiter la recherche aux seuls actes d'une profession de santé. " +
      "Exemple : D1(dentistes), SF(sages-femmes)",
    localisationPicker:
      "Affichage de la grille de saisie des localisations dentaires",
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal",
    rowIndex:
      "Indice de la ligne sur laquelle on a cliqué dans le tableau de saisie des actes",
    allModificateurs:
      "Tous les modificateurs (obtenus avec une requête CCAM contextes)",
    modificateurs:
      'Modificateurs appliqués à l\'acte sélectionné. Par défaut ""',
    onSelectionActe: "Callback à la validation"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    code: PropTypes.string,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    cotation: PropTypes.number,
    date: PropTypes.string,
    localisation: PropTypes.string,
    executant: PropTypes.string,
    localisationPicker: PropTypes.bool,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    rowIndex: PropTypes.number,
    allModificateurs: PropTypes.array,
    modificateurs: PropTypes.string,
    onSelectionActe: PropTypes.func
  }
};

const descriptionType = [
  { text: "Nom court", value: 0 },
  { text: "Nom long", value: 1 },
  { text: "Nom personnalisé", value: 2 }
];

export default class ModalSearch extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    code: "",
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    cotation: 1,
    date: moment().toISOString(),
    localisation: "",
    cotation: 0,
    executant: "",
    localisationPicker: false
  };

  componentWillMount() {
    this.setState({
      acte: {},
      actes: [],
      code: this.props.code,
      date: this.props.date,
      localisation: this.props.localisation,
      modificateurs: this.props.modificateurs,
      description: "",
      montant: 0,
      openLocalisation: false,
      openModificateurs: false,
      informations: {},
      descriptionType: 1,
      loading: false
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      acte: {},
      code: next.code,
      date: next.date,
      localisation: next.localisation,
      modificateurs: next.modificateurs,
      description: "",
      montant: 0,
      openLocalisation: false,
      openModificateurs: false,
      informations: {},
      descriptionType: 1
    });
    if (next.code) {
      this.readActe(next.code, next.date);
    }
  }

  readActe = (code, date) => {
    this.setState({ loading: true });
    this.props.client.CCAM.read(
      code,
      { date: date },
      result => {
        let description =
          this.state.descriptionType === 0 ? result.nomCourt : result.nomLong;
        this.setState({ acte: result, description: description });
        this.tarification(
          result.codActe,
          this.props.codActiv,
          this.props.codPhase,
          this.props.codGrille,
          date,
          this.props.codDom,
          this.props.modificateurs
        );
      },
      error => {
        console.log(error);
        this.setState({ loading: false });
      }
    );
  };

  onClose = () => {
    if (!_.isUndefined(this.props.onClose)) {
      this.props.onClose();
    }
  };

  onLoadActes = obj => {
    this.setState({
      actes: obj.results,
      acte: {},
      informations: obj.informations,
      modificateurs: ""
    });
  };

  onPageSelect = obj => {
    this.setState({
      actes: obj.actes,
      informations: obj.informations
    });
  };

  errorTarification = () => {};

  onSelection = acte => {
    let description =
      this.state.descriptionType === 0 ? acte.nomCourt : acte.nomLong;
    this.setState({
      acte: acte,
      code: acte.codActe, // new
      description: description,
      actes: [], // new
      informations: {}, // new
      modificateurs: ""
    });
    this.tarification(
      acte.codActe,
      this.props.codActiv,
      this.props.codPhase,
      this.props.codGrille,
      this.state.date,
      this.props.codDom,
      ""
    );
  };

  openLocalisation = () => {
    this.setState({
      openLocalisation: !this.state.openLocalisation
    });
  };

  openModificateurs = () => {
    this.setState({
      openModificateurs: !this.state.openModificateurs
    });
  };

  descriptionTypeChange = value => {
    if (value === 0) {
      this.setState({
        description: this.state.acte.nomCourt,
        descriptionType: value
      });
    } else {
      this.setState({
        description: this.state.acte.nomLong,
        descriptionType: value
      });
    }
  };

  tarification = (
    codActe,
    codActiv,
    codPhase,
    codGrille,
    date,
    codDom,
    modificateurs
  ) => {
    this.setState({ loading: true });
    let params = {
      activite: codActiv,
      phase: codPhase,
      grille: codGrille,
      date: date,
      dom: codDom,
      modificateurs: modificateurs
    };
    if (_.isEmpty(modificateurs)) {
      _.unset(params, "modificateurs");
    }
    if (codDom === 0) {
      _.unset(params, "dom");
    }
    this.props.client.CCAM.tarif(
      codActe,
      params,
      result => {
        //console.log(result);
        this.setState({ montant: result.pu, loading: false });
      },
      error => {
        console.log(error);
        this.setState({ loading: false });
      }
    );
  };

  valider = () => {
    if (_.isEmpty(this.state.acte)) {
      return;
    }
    this.props.onSelectionActe(
      this.props.rowIndex,
      this.state.acte.codActe,
      this.state.description,
      this.state.date,
      spacedLocalisation(this.state.localisation),
      this.props.cotation,
      this.state.modificateurs,
      this.state.montant
    );
    this.onClose();
  };

  render() {
    let localisation = this.props.localisationPicker ? (
      <Localisations
        dents={
          toISOLocalisation(this.state.localisation).length % 2 !== 0
            ? ""
            : spacedLocalisation(this.state.localisation)
        }
        onSelection={dents => this.setState({ localisation: dents })}
      />
    ) : null;
    let tableProps = {
      celled: true,
      style: { width: "100%" }
    };
    let accordion = (
      <Accordion styled={true} fluid={true}>
        <Accordion.Title
          active={this.state.openLocalisation}
          onClick={this.openLocalisation}
        >
          <Icon name="dropdown" />
          Localisation
        </Accordion.Title>
        <Accordion.Content active={this.state.openLocalisation}>
          {localisation}
        </Accordion.Content>
        <Accordion.Title
          active={this.state.openModificateurs}
          onClick={this.openModificateurs}
        >
          <Icon name="dropdown" />
          Modificateurs
        </Accordion.Title>
        <Accordion.Content active={this.state.openModificateurs}>
          <Modificateurs
            allModificateurs={this.props.allModificateurs}
            codGrille={this.props.codGrille}
            date={this.state.date}
            modificateurs={this.state.modificateurs}
            onChange={modifStr => {
              this.setState({ modificateurs: modifStr });
              this.tarification(
                this.state.code,
                this.props.codActiv,
                this.props.codPhase,
                this.props.codGrille,
                this.state.date,
                this.props.codDom,
                modifStr
              );
            }}
            onError={() => {
              this.setState({ modificateurs: "" });
              this.tarification(
                this.state.code,
                this.props.codActiv,
                this.props.codPhase,
                this.props.codGrille,
                this.state.date,
                this.props.codDom,
                ""
              );
            }}
          />
        </Accordion.Content>
      </Accordion>
    );
    let loading = (
      <Segment basic={true} style={{ marginTop: "10%" }}>
        <Dimmer active={true} inverted={true}>
          <Loader active={true} inline="centered" inverted={true} size="huge">
            Chargement...
          </Loader>
        </Dimmer>
      </Segment>
    );
    return (
      <Modal open={this.props.open} onClose={this.onClose} size="large">
        <Modal.Content>
          <Table basic="very" style={{ marginBottom: "0px" }}>
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Recherche d'un acte">
                      <Search2
                        client={this.props.client}
                        date={this.state.date}
                        executant={this.props.executant}
                        limit={8}
                        localisation={this.state.localisation}
                        onLoadActes={this.onLoadActes}
                      />
                    </Form.Input>
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Date">
                      {/* <DayPickerInput /> */}
                    </Form.Input>
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input
                      error={
                        toISOLocalisation(this.state.localisation).length %
                          2 !==
                        0
                      }
                      label="Localisation"
                      value={this.state.localisation}
                      onChange={(e, d) =>
                        this.setState({ localisation: d.value })
                      }
                    />
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input
                      label="Modificateurs"
                      placeholder="Modificateurs"
                      value={
                        this.state.modificateurs ? this.state.modificateurs : ""
                      }
                      onChange={(e, d) => {
                        this.setState({ modificateurs: d.value });
                        this.tarification(
                          this.state.code,
                          this.props.codActiv,
                          this.props.codPhase,
                          this.props.codGrille,
                          this.state.date,
                          this.props.codDom,
                          d.value
                        );
                      }}
                    />
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input
                      label="Montant"
                      value={tarif(this.state.montant)}
                      onChange={(e, d) => {
                        //this.setState({ tmpMontant: d.value });
                        /*console.log(d.value);
                        //if (parseFloat(d.value)) {
                        if (_.isEmpty(d.value)) {
                          console.log("ici");
                          this.setState({ montant: "" });
                          return;
                        } else {
                          console.log("là");
                          this.setState({ montant: parseFloat(d.value) });
                        }*/
                        //}
                        //this.setState({ montant: parseFloat(d.value) })
                        //this.setState({ montant: d.value })
                      }}
                    />
                  </Form>
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Input
                    disabled={_.isEmpty(this.state.acte)}
                    fluid={true}
                    placeholder="Description de l'acte sélectionné"
                    onChange={(e, d) =>
                      this.setState({
                        description: d.value,
                        descriptionType: 2
                      })
                    }
                    value={this.state.description}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    fluid={true}
                    disabled={_.isEmpty(this.state.acte)}
                    placeholder="Type de libellé de l'acte"
                    selection={true}
                    options={descriptionType}
                    onChange={(e, d) => this.descriptionTypeChange(d.value)}
                    value={this.state.descriptionType}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <div style={{ height: "450px", overflow: "auto" }}>
            {accordion}
            {this.state.loading ? (
              loading
            ) : _.isEmpty(this.state.actes) &&
              !this.state.openLocalisation &&
              !this.state.openModificateurs ? (
              <div style={{ textAlign: "center" }}>
                <Header as="h3" icon={true} style={{ marginTop: "10%" }}>
                  <Icon name="search" />
                  Recherche d'un acte en CCAM
                </Header>
              </div>
            ) : null}
            <Table2
              client={this.props.client}
              actes={this.state.actes}
              informations={this.state.informations}
              onPageSelect={this.onPageSelect}
              onSelection={this.onSelection}
              table={tableProps}
              showPagination={true}
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Annuler" onClick={this.onClose} />
          <Button content="Valider" onClick={this.valider} />
        </Modal.Actions>
      </Modal>
    );
  }
}

class Modificateurs extends React.Component {
  state = {
    listModificateurs: [],
    selectedModif: []
  };
  componentWillMount() {
    this.setState({
      listModificateurs: this.listModificateurs(
        this.props.allModificateurs,
        this.props.codGrille,
        this.props.date
      )
    });
  }

  componentWillReceiveProps(next) {
    let s = _.map(next.modificateurs, m => {
      let modif = _.find(
        this.state.listModificateurs,
        mod => mod.codModifi === m
      );
      if (modif) {
        return modif;
      } else {
        this.props.onError();
        return;
      }
    });
    this.setState({ selectedModif: s });
  }

  checkedModif = m => {
    return _.includes(this.state.selectedModif, m);
  };

  handleCheckModif = modif => {
    let s = this.state.selectedModif;
    let modifStr = this.props.modificateurs;
    let index = s.indexOf(modif);
    if (index > -1) {
      s.splice(index, 1);
      modifStr = "";
      _.forEach(s, mod => {
        modifStr += mod.codModifi;
      });
    } else {
      modifStr += modif.codModifi;
    }
    this.props.onChange(modifStr);
  };

  listModificateurs = (modificateurs, codGrille, date) => {
    let d = moment(date);
    return _.filter(modificateurs, m => {
      if (m.grilleCod !== codGrille) {
        return false;
      }

      if (_.isNull(m.dtDebut) && _.isNull(m.dtFin)) {
        return true;
      }

      if (_.isNull(m.dtDebut) && !_.isNull(m.dtFin)) {
        return d.isSameOrBefore(m.dtFin);
      }

      if (!_.isNull(m.dtDebut) && _.isNull(m.dtFin)) {
        return d.isSameOrAfter(m.dtDebut);
      }

      return d.isBetween(m.dtDebut, m.dtFin, null, "[]");
    });
  };
  render() {
    return (
      <div style={{ overflow: "auto", height: "200px" }}>
        {_.map(this.state.listModificateurs, modif => (
          <div key={modif.libelle + "" + modif.coef}>
            <Checkbox
              label={modif.libelle}
              checked={this.checkedModif(modif)}
              onChange={() => this.handleCheckModif(modif)}
            />
          </div>
        ))}
      </div>
    );
  }
}
