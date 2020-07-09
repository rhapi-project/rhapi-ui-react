import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Form, Header, Message, Segment } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

import { tarif } from "../lib/Helpers";

const propDefs = {
  description: "Tarification d'un acte CCAM",
  example: "Tarification",
  propDocs: {
    codActe: "Code de l'acte CCAM",
    codActivite: 'Code de l\'activité, par défaut "1"',
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    date:
      "Date de la tarification de l'acte, au format ISO. Par défaut la date du jour",
    dynamic:
      'Affichage de l\'interface dynamique de tarification, par défaut "false"',
    error: "Message d'erreur ou Callback acte non tarifé à la date donnée",
    hidden: "Cacher l'interface du composant de tarification",
    modificateurs:
      "Modificateurs appliqués à l'acte, par défaut une chaîne de caractères vide",
    success: "Callback succès de la tarification"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    codActe: PropTypes.string,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    date: PropTypes.string,
    dynamic: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    hidden: PropTypes.bool,
    modificateurs: PropTypes.string,
    success: PropTypes.func
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    date: new Date().toISOString(),
    dynamic: false,
    hidden: false,
    modificateurs: ""
  };

  state = {
    acte: {},
    selectedModif: [], // modificateurs sélectionnés
    selectableModif: [], // modificateurs applicables
    modifShow: false, // true -> afficher les modificateurs possibles
    tarif: {},
    errorMessage: "",
    currentActivite: 0,
    currentDom: 0,
    currentGrille: 0,
    currentPhase: 0,
    activites: [],
    doms: [],
    grilles: [],
    modificateurs: [],
    phase: []
  };

  componentDidMount() {
    this.setState({
      currentActivite: this.props.codActivite,
      currentDom: this.props.codDom,
      currentGrille: this.props.codGrille,
      currentPhase: this.props.codPhase
    });

    this.props.client.CCAM.contextes(
      results => {
        this.setState({
          activites: results.activite,
          doms: results.dom,
          grilles: results.tb23,
          modificateurs: results.tb11,
          phases: results.phase
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.codActe !== this.props.codActe ||
      prevProps.codActivite !== this.props.codActivite ||
      prevProps.codPhase !== this.props.codPhase ||
      prevProps.codGrille !== this.props.codGrille ||
      prevProps.date !== this.props.date ||
      prevProps.codDom !== this.props.codDom ||
      prevProps.modificateurs !== this.props.modificateurs
    ) {
      if (this.props.codActe) {
        this.readActe(
          this.props.codActe,
          this.props.codActivite,
          this.props.codPhase,
          this.props.codGrille,
          this.props.date,
          this.props.codDom,
          this.props.modificateurs
        );
      } else {
        this.setState({ acte: {}, selectableModif: [], modifShow: false });
      }
    }
  }

  checkedModif = modif => {
    return _.includes(this.state.selectedModif, modif);
  };

  handleCheckModif = modif => {
    let s = this.state.selectedModif;
    let index = s.indexOf(modif);
    if (index > -1) {
      s.splice(index, 1);
    } else {
      s.push(modif);
    }
    this.setState({ selectedModif: s });

    this.tarif(
      this.state.acte.codActe,
      this.state.currentActivite,
      this.state.currentPhase,
      this.state.currentGrille,
      this.props.date,
      this.state.currentDom,
      s
    );
  };

  // définition d'une grille - description
  defGrille = (codGrille, grilles) => {
    let grille = _.find(grilles, g => {
      return _.isUndefined(g.codGrille)
        ? codGrille === g.value
        : codGrille === g.codGrille;
    });
    return _.isUndefined(grille) ? "" : grille.definition;
  };

  // modificateurs possible par rapport à une grille et à la date
  listModificateurs = (modificateurs, grille) => {
    let date = moment(this.props.date);
    return _.filter(modificateurs, m => {
      if (m.grilleCod !== grille) {
        return false;
      }

      if (_.isNull(m.dtDebut) && _.isNull(m.dtFin)) {
        return true;
      }

      if (_.isNull(m.dtDebut) && !_.isNull(m.dtFin)) {
        return date.isSameOrBefore(m.dtFin);
      }

      if (!_.isNull(m.dtDebut) && _.isNull(m.dtFin)) {
        return date.isSameOrAfter(m.dtDebut);
      }

      return date.isBetween(m.dtDebut, m.dtFin, null, "[]");
    });
  };

  readActe = (
    codActe,
    codActiv,
    codPhase,
    codGrille,
    date,
    codDom,
    modificateurs
  ) => {
    this.props.client.CCAM.read(
      codActe,
      { date: date },
      result => {
        //console.log(result);
        let selectableModif = this.listModificateurs(
          this.state.modificateurs,
          codGrille
        );
        let selectedModif = _.map(modificateurs, m =>
          _.find(selectableModif, s => s.codModifi === m)
        );

        this.setState({
          acte: result,
          currentActivite: codActiv,
          currentPhase: codPhase,
          currentGrille: codGrille,
          currendDom: codDom,
          modifShow: !_.isEmpty(selectedModif),
          selectableModif: selectableModif,
          selectedModif: selectedModif,
          errorMessage: ""
        });

        this.tarif(
          result.codActe,
          codActiv,
          codPhase,
          codGrille,
          date,
          codDom,
          selectedModif
        );
      },
      error => {
        console.log(error);
        this.setState({ acte: {} });
        if (!_.isUndefined(this.props.error)) {
          if (_.isFunction(this.props.error)) {
            this.props.error();
          } else {
            this.setState({ errorMessage: this.props.error });
          }
        }
      }
    );
  };

  tarif = (
    codActe,
    codActiv,
    codPhase,
    codGrille,
    date,
    codDom,
    modificateurs
  ) => {
    let m = "";
    _.forEach(modificateurs, modificateur => {
      m += modificateur.codModifi;
    });
    let params = {
      activite: codActiv,
      phase: codPhase,
      grille: codGrille,
      date: date,
      dom: codDom,
      modificateurs: m
    };

    // si on n'a pas de modificateurs, on utilisera pas
    // le champ 'modificateurs'
    if (_.isEmpty(m)) {
      _.unset(params, "modificateurs");
    }

    if (codDom === 0) {
      _.unset(params, "dom");
    }

    this.props.client.CCAM.tarif(
      codActe,
      params,
      result => {
        this.setState({ tarif: result, errorMessage: "" });
        if (!_.isUndefined(this.props.success)) {
          let activite = _.find(
            this.state.activites,
            a => a.value === codActiv
          );
          let grille = _.find(this.state.grilles, g => g.value === codGrille);
          let phase = _.find(this.state.phases, p => p.value === codPhase);

          let obj = {};
          obj.acte = this.state.acte;
          obj.activite = activite;
          obj.date = date;
          obj.grille = grille;
          obj.phase = phase;
          obj.modificateurs = m;
          obj.tarif = result;
          if (codDom !== 0) {
            obj.dom = _.find(this.state.doms, d => d.value === codDom);
          }

          this.props.success(obj);
        }
      },
      error => {
        this.setState({ tarif: {} });
        console.log(error);
        if (!_.isUndefined(this.props.error)) {
          if (_.isFunction(this.props.error)) {
            this.props.error();
          } else {
            this.setState({ errorMessage: this.props.error });
          }
        }
      }
    );
  };

  render() {
    if (this.props.hidden) {
      return "";
    }

    let tarifPrint = (
      <React.Fragment>
        <Header as="h2">
          {!_.isEmpty(this.state.tarif)
            ? tarif(this.state.tarif.pu)
            : "Inconnu"}
        </Header>
      </React.Fragment>
    );

    if (!_.isEmpty(this.state.errorMessage)) {
      return (
        <React.Fragment>
          <Message
            icon="info"
            info={true}
            header="Message d'erreur"
            content={this.state.errorMessage}
          />
        </React.Fragment>
      );
    }

    if (!_.isEmpty(this.state.acte) && this.props.dynamic) {
      let optionsActivites = _.filter(this.state.activites, activite => {
        activite.text = activite.libelle;
        activite.value = _.isUndefined(activite.codActiv)
          ? activite.value
          : activite.codActiv;

        // champ 'options' sur le Dropdown semantic -> Ne pas mettre des objets avec des champs
        // en camelCase.
        _.unset(activite, "codActiv");
        return _.includes(
          this.state.acte.codActivites,
          _.toInteger(activite.value)
        );
      });

      let metropole = {};
      metropole.text = "METROPOLE";
      metropole.value = 0;

      // Au tableau d'options des DOM, rajouter METROPOLE
      let optionsDoms = _.map(this.state.doms, d => {
        d.text = d.libelle;
        d.value = _.isUndefined(d.codDom) ? d.value : d.codDom;
        _.unset(d, "codDom");
        return d;
      });
      optionsDoms.push(metropole);

      let optionsGrilles = _.map(this.state.grilles, g => {
        g.text = g.libelle;
        g.value = _.isUndefined(g.codGrille) ? g.value : g.codGrille;
        _.unset(g, "codGrille");
        return g;
      });

      let optionsPhases = _.filter(this.state.phases, phase => {
        phase.text = phase.libelle;
        phase.value = _.isUndefined(phase.codPhase)
          ? phase.value
          : phase.codPhase;
        _.unset(phase, "codPhase");
        return _.includes(this.state.acte.codPhases, phase.value);
      });

      return (
        <React.Fragment>
          <Form>
            <Form.Dropdown
              label="Activité"
              placeholder="Sélectionner une activité"
              onChange={(e, d) => {
                this.setState({
                  currentActivite: d.value,
                  selectedModif: [],
                  modifShow: false
                });
                this.tarif(
                  this.state.acte.codActe,
                  d.value,
                  this.state.currentPhase,
                  this.state.currentGrille,
                  this.props.date,
                  this.state.currentDom,
                  []
                );
              }}
              options={optionsActivites}
              selection={true}
              value={this.state.currentActivite}
            />

            <Form.Dropdown
              label={
                "Grille " +
                "(" +
                this.defGrille(this.state.currentGrille, this.state.grilles) +
                ")"
              }
              placeholder="Sélectionner une grille"
              onChange={(e, d) => {
                this.setState({
                  currentGrille: d.value,
                  selectedModif: [],
                  selectableModif: this.listModificateurs(
                    this.state.modificateurs,
                    d.value
                  ),
                  modifShow: false
                });
                this.tarif(
                  this.state.acte.codActe,
                  this.state.currentActivite,
                  this.state.currentPhase,
                  d.value,
                  this.props.date,
                  this.state.currentDom,
                  []
                );
              }}
              options={optionsGrilles}
              selection={true}
              value={this.state.currentGrille}
            />

            <Form.Dropdown
              label="Phase"
              placeholder="Sélectionner une phase"
              onChange={(e, d) => {
                this.setState({
                  currentPhase: d.value,
                  selectedModif: [],
                  modifShow: false
                });
                this.tarif(
                  this.state.acte.codActe,
                  this.state.currentActivite,
                  d.value,
                  this.state.currentGrille,
                  this.props.date,
                  this.state.currentDom,
                  []
                );
              }}
              options={optionsPhases}
              selection={true}
              value={this.state.currentPhase}
            />

            <Form.Dropdown
              label="DOM"
              placeholder="Métropole par défaut"
              onChange={(e, d) => {
                this.setState({
                  currentDom: d.value,
                  selectedModif: [],
                  modifShow: false
                });
                this.tarif(
                  this.state.acte.codActe,
                  this.state.currentActivite,
                  this.state.currentPhase,
                  this.state.currentGrille,
                  this.props.date,
                  d.value,
                  []
                );
              }}
              options={optionsDoms}
              selection={true}
              value={this.state.currentDom}
            />

            <Form.Input label="Modificateurs">
              <div>
                <Checkbox
                  label="Aucun modificateur"
                  checked={!this.state.modifShow}
                  onChange={() => {
                    if (!_.isEmpty(this.state.selectedModif)) {
                      this.setState({ selectedModif: [], modifShow: false });
                      this.tarif(
                        this.state.acte.codActe,
                        this.state.currentActivite,
                        this.state.currentPhase,
                        this.state.currentGrille,
                        this.props.date,
                        this.state.currentDom,
                        []
                      );
                    } else {
                      this.setState({ modifShow: !this.state.modifShow });
                    }
                  }}
                />
                {!_.isEmpty(this.state.selectableModif) &&
                this.state.modifShow ? (
                  <Segment compact={false}>
                    <div style={{ overflow: "auto", height: "220px" }}>
                      {_.map(this.state.selectableModif, modif => (
                        <div key={modif.libelle + "" + modif.coef}>
                          <Checkbox
                            label={modif.libelle}
                            checked={this.checkedModif(modif)}
                            onChange={() => this.handleCheckModif(modif)}
                          />
                        </div>
                      ))}
                    </div>
                  </Segment>
                ) : (
                  ""
                )}
              </div>
            </Form.Input>
          </Form>
          {tarifPrint}
        </React.Fragment>
      );
    } else if (!_.isEmpty(this.state.acte) && !this.props.dynamic) {
      // Tarification statique
      return tarifPrint;
    } else {
      return null;
    }
  }
}
