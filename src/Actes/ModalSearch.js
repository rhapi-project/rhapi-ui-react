import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  Button,
  Checkbox,
  Dimmer,
  Form,
  Header,
  Icon,
  Label,
  Loader,
  Modal,
  Ref,
  Segment
} from "semantic-ui-react";
import Search2 from "../CCAM/Search";
import Table2 from "../CCAM/Table";
import Localisations from "../Shared/Localisations";
import Montant from "../Shared/Montant";

import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";

import { spacedLocalisation, toISOLocalisation } from "../lib/Helpers";

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
    description: 'Description de l\'acte sélectionné. Par défaut ""',
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    executant:
      "Limiter la recherche aux seuls actes d'une profession de santé. " +
      "Exemple : D1(dentistes), SF(sages-femmes)",
    specialite: "Code spécialité du praticien", // new
    localisationPicker:
      "Affichage de la grille de saisie des localisations dentaires",
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal",
    rowIndex:
      "Indice de la ligne sur laquelle on a cliqué dans le tableau de saisie des actes",
    ngap: "Liste des codes NGAP", // new
    allModificateurs:
      "Tous les modificateurs (obtenus avec une requête CCAM contextes)",
    modificateurs:
      'Modificateurs appliqués à l\'acte sélectionné. Par défaut ""',
    montant: "Montant de l'acte sélectionné",
    qualificatifs: "Qualificatifs",
    onValidation: "Callback à la validation"
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
    description: PropTypes.string,
    localisation: PropTypes.string,
    executant: PropTypes.string,
    specialite: PropTypes.number, // new
    localisationPicker: PropTypes.bool,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    rowIndex: PropTypes.number,
    ngap: PropTypes.array, // new
    allModificateurs: PropTypes.array,
    modificateurs: PropTypes.string,
    qualificatifs: PropTypes.string,
    montant: PropTypes.number,
    onValidation: PropTypes.func
  }
};

const descriptionType = [
  { text: "Nom court", value: 0 },
  { text: "Nom long", value: 1 },
  { text: "Saisie libre", value: 2 }
];

const qualificatifs = [
  { text: "OP", value: "OP" },
  { text: "ED", value: "ED" },
  { text: "NPC", value: "NPC" }
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
    description: "",
    localisation: "",
    cotation: 0,
    executant: "",
    localisationPicker: false,
    montant: 0
  };

  componentWillMount() {
    this.setState({
      acte: {},
      code: this.props.code,
      cotation: this.props.cotation,
      date: this.props.date,
      localisation: this.props.localisation,
      modificateurs: this.props.modificateurs,
      qualificatifs: this.props.qualificatifs,
      description: this.props.description,
      montant: 0,
      openLocalisation: false,
      openModificateurs: false,
      descriptionType: 1
    });
  }

  componentWillReceiveProps(next) {
    if (next.code) {
      this.setState({
        code: next.code,
        cotation: next.cotation,
        date: next.date,
        localisation: next.localisation,
        modificateurs: next.modificateurs,
        qualificatifs: next.qualificatifs,
        montant: next.montant,
        description: next.description
      });
      this.readActe(next.code, next.date);
    } else {
      this.setState({
        acte: {},
        actes: [],
        code: "",
        cotation: this.props.cotation,
        date: this.props.date,
        localisation: "",
        modificateurs: "",
        qualificatifs: "OP",
        description: "",
        montant: 0,
        openLocalisation: false,
        openModificateurs: false,
        informations: {},
        descriptionType: this.getDescriptionType()
      });
    }
  }

  getDescriptionType = () => {
    return _.get(
      JSON.parse(localStorage.getItem("localPreferences")),
      "defaultDescriptionType",
      "long"
    ) === "court"
      ? 0
      : 1;
  };

  readActe = (code, date) => {
    if (code.length !== 7) {
      return;
    }
    this.props.client.CCAM.read(
      code,
      { date: date },
      result => {
        let descrType =
          this.state.description === result.nomCourt
            ? 0
            : this.state.description === result.nomLong
            ? 1
            : 2;
        this.setState({
          acte: result,
          loading: false,
          descriptionType: descrType,
          saisieLibre: descrType === 2 ? this.state.description : ""
        });
      },
      error => {
        console.log(error);
        this.setState({ acte: {}, loading: false });
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
      code: "",
      description: "",
      descriptionType: this.getDescriptionType(),
      informations: obj.informations,
      modificateurs: "",
      montant: 0,
      openModificateurs: false
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
      code: acte.codActe,
      cotation: 1, //new
      description: description,
      actes: [],
      //date: "", // new
      //localisation: ""
      informations: {},
      modificateurs: ""
    });
    this.tarification(
      acte.codActe,
      this.state.cotation,
      this.props.codActiv,
      this.props.codPhase,
      this.props.codGrille,
      this.props.specialite, // new
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
    } else if (value === 2 && !_.isEmpty(this.state.saisieLibre)) {
      this.setState({
        description: this.state.saisieLibre,
        descriptionType: value
      });
    } else {
      this.setState({
        description: this.state.acte.nomLong,
        descriptionType: value
      });
    }
  };

  inputContentFormating = () => {
    this.setState({
      localisation: spacedLocalisation(this.state.localisation)
    });
  };

  tarification = (
    codActe,
    cotation,
    codActiv,
    codPhase,
    codGrille,
    specialite, // new
    date,
    codDom,
    modificateurs
  ) => {
    this.setState({ loading: true });
    let params = {
      activite: codActiv,
      phase: codPhase,
      grille: codGrille,
      specialite: specialite,
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
    if (!specialite) {
      _.unset(params, "specialite");
    }
    this.props.client.CCAM.tarif(
      codActe,
      params,
      result => {
        this.setState({
          montant:
            codActe.length === 7
              ? result.pu
              : _.isNaN(parseInt(cotation))
              ? result.tarif
              : result.tarif * parseInt(cotation),
          loading: false
        });
      },
      error => {
        console.log(error);
        this.setState({ loading: false });
      }
    );
  };

  valider = () => {
    if (
      (_.isEmpty(this.state.acte) && _.isEmpty(this.state.code)) ||
      toISOLocalisation(this.state.localisation).length % 2 !== 0
    ) {
      return;
    }
    this.props.onValidation(
      this.props.rowIndex,
      //this.state.acte.codActe,
      this.state.code,
      this.state.description,
      this.state.date,
      spacedLocalisation(this.state.localisation),
      //this.props.cotation,
      _.isNaN(parseInt(this.state.cotation))
        ? 1
        : parseInt(this.state.cotation),
      this.state.modificateurs,
      this.state.qualificatifs,
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
            executant={this.props.executant}
            specialite={this.props.specialite}
            modificateurs={this.state.modificateurs}
            onChange={modifStr => {
              this.setState({ modificateurs: modifStr });
              this.tarification(
                this.state.code,
                this.state.cotation,
                this.props.codActiv,
                this.props.codPhase,
                this.props.codGrille,
                this.props.specialite,
                this.state.date,
                this.props.codDom,
                modifStr
              );
            }}
            onError={() => {
              this.setState({ modificateurs: "" });
              this.tarification(
                this.state.code,
                this.state.cotation,
                this.props.codActiv,
                this.props.codPhase,
                this.props.codGrille,
                this.props.specialite,
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
    let optionsNGAP = [];

    if (this.state.code.length === 7) {
      optionsNGAP.push({
        key: this.state.code,
        text: this.state.code,
        value: this.state.code
      });
    }
    _.forEach(this.props.ngap, code => {
      let obj = { key: code, text: code, value: code };
      optionsNGAP.push(obj);
    });
    return (
      <Modal open={this.props.open} onClose={this.onClose} size="large">
        <Modal.Content>
          <Form unstackable>
            <Form.Group widths="equal">
              <Form.Input label="Date" width={9}>
                <Ref
                  innerRef={node => {
                    let input = node.firstChild.firstChild;
                    input.style.width = "100%";
                  }}
                >
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={moment(this.state.date).toDate()}
                    onChange={date => {
                      if (date) {
                        this.setState({ date: date.toISOString() });
                      }
                    }}
                    locale={fr}
                  />
                </Ref>
              </Form.Input>
              <Form.Input
                label="Localisation"
                placeholder="Num. des dents"
                error={
                  toISOLocalisation(this.state.localisation).length % 2 !== 0
                }
                value={this.state.localisation}
                onChange={(e, d) => this.setState({ localisation: d.value })}
                onBlur={() => this.inputContentFormating()}
              />
              <Form.Dropdown
                label="Code"
                placeholder="Code de l'acte"
                search={true}
                selection={true}
                value={this.state.code}
                options={optionsNGAP}
                noResultsMessage="Aucun acte trouvé"
                onChange={(e, d) => {
                  this.setState({
                    code: d.value,
                    modificateurs: "",
                    description: "",
                    acte: {},
                    actes: [],
                    cotation: 1,
                    informations: {}
                  });
                  this.tarification(
                    d.value,
                    this.state.cotation,
                    this.props.codActiv,
                    this.props.codPhase,
                    this.props.codGrille,
                    this.props.specialite,
                    this.state.date,
                    this.props.codDom,
                    ""
                  );
                }}
              />
              <Ref
                innerRef={node => {
                  node.childNodes[1].firstChild.style.textAlign = "right";
                }}
              >
                <Form.Input
                  label="Cotation"
                  disabled={
                    _.isEmpty(this.state.code) || this.state.code.length === 7
                  }
                  width={1}
                  value={this.state.cotation}
                  onChange={(e, d) => {
                    this.setState({ cotation: d.value });
                    this.tarification(
                      this.state.code,
                      d.value,
                      this.props.codActiv,
                      this.props.codPhase,
                      this.props.codGrille,
                      this.props.specialite,
                      this.state.date,
                      this.props.codDom,
                      this.state.modificateurs
                    );
                  }}
                  placeholder="Cotation"
                />
              </Ref>

              <Form.Input
                fluid={true}
                label="Modificateurs"
                placeholder="Modificateurs"
                value={this.state.modificateurs ? this.state.modificateurs : ""}
                onChange={(e, d) => {
                  this.setState({ modificateurs: d.value });
                  this.tarification(
                    this.state.code,
                    this.state.cotation,
                    this.props.codActiv,
                    this.props.codPhase,
                    this.props.codGrille,
                    this.props.specialite,
                    this.state.date,
                    this.props.codDom,
                    d.value
                  );
                }}
              />
              <Form.Dropdown
                label="Qualificatifs"
                fluid={true}
                width={3}
                placeholder="Qualificatifs"
                options={qualificatifs}
                selection={true}
                value={this.state.qualificatifs}
                onChange={(e, d) => {
                  this.setState({ qualificatifs: d.value });
                  if (d.value === "OP") {
                    this.tarification(
                      this.state.code,
                      this.state.cotation,
                      this.props.codActiv,
                      this.props.codPhase,
                      this.props.codGrille,
                      this.props.specialite,
                      this.state.date,
                      this.props.codDom,
                      this.state.modificateurs
                    );
                  }
                }}
              />
              <Form.Input label="Montant" width={10}>
                <Montant
                  montant={this.state.montant}
                  onChange={montant => {
                    if (this.state.qualificatifs !== "OP") {
                      this.setState({ montant: montant });
                    }
                  }}
                />
              </Form.Input>
            </Form.Group>
            <Form.Group>
              <Form.Input fluid={true}>
                <Ref
                  innerRef={node => {
                    node.firstChild.firstChild.focus();
                  }}
                >
                  <Search2
                    client={this.props.client}
                    date={_.isEmpty(this.state.acte) ? this.state.date : null}
                    executant={this.props.executant}
                    limit={8}
                    localisation={
                      _.isEmpty(this.state.acte)
                        ? spacedLocalisation(this.state.localisation)
                        : null
                    }
                    onLoadActes={this.onLoadActes}
                  />
                </Ref>
              </Form.Input>
              <Form.Input
                width={10}
                disabled={_.isEmpty(this.state.code)}
                fluid={true}
                placeholder="Description de l'acte sélectionné"
                onChange={(e, d) =>
                  this.setState({
                    description: d.value,
                    descriptionType: 2,
                    saisieLibre: d.value
                  })
                }
                value={this.state.description}
              />
              <Form.Dropdown
                width={3}
                fluid={true}
                disabled={_.isEmpty(this.state.acte)}
                placeholder="Type de libellé de l'acte"
                selection={true}
                options={descriptionType}
                onChange={(e, d) => this.descriptionTypeChange(d.value)}
                value={this.state.descriptionType}
              />
            </Form.Group>
          </Form>

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
  static defaultProps = {
    executant: ""
  };
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

      if (this.props.executant === "D1") {
        if (!_.includes(["N", "F", "J", "U"], m.codModifi)) {
          return false;
        }
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
      <div style={{ overflow: "auto", height: "100px" }}>
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
