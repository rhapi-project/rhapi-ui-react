import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Form, Header, Segment } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";
//import "moment/locale/fr";

const propDefs = {
  description: "Composant de facturation d'un acte CCAM",
  example: "Tarification",
  propDocs: {
    codActe: 'Code de l\'acte CCAM, par défaut ""',
    codActivite: 'Code de l\'activité, par défaut "1"',
    codDom: "Code du DOM, par défaut c'est la métropole. Code 0",
    codGrille: "Code grille, par défaut 0",
    codPhase: "Code phase, par défaut 0",
    date:
      "Date de la tarification de l'acte, au format ISO. Par défaut la date du jour",
    dynamic: 'Activation de la tarification dynamique, par défaut "false"',
    //error: "Message d'erreur ou Callback acte non tarifé à la date donnée",
    //success: "Callback succès de la tarification"
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
    //error: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
    //success: PropTypes.func
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    codActe: "",
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    date: new Date().toISOString(),
    dynamic: false
  };

  state = {
    acte: {},
    activites: [],
    doms: [],
    grilles: [],
    modificateurs: [],
    phases: [],
    selectedModif: [], // modificateurs sélectionnés
    modifShow: false, // true -> afficher les modificateurs possibles
    tarif: {}
  };

  componentWillMount() {
    this.props.client.CCAM.contextes(
      results => {
        this.setState({
          activites: results.activite,
          doms: results.dom,
          grilles: results.tb23,
          modificateurs: results.tb11,
          phases: results.phase,
          currentActivite: this.props.codActivite,
          currentDom: this.props.codDom,
          currentGrille: this.props.codGrille,
          currentPhase: this.props.codPhase
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  componentWillReceiveProps(next) {
    if (!_.isEmpty(next.codActe)) {
      this.readActe(next.codActe);
      this.tarif(
        next.codActe,
        this.state.currentActivite,
        this.state.currentPhase,
        this.state.currentGrille,
        this.props.date,
        this.state.currentDom,
        this.state.selectedModif
      );
    } else {
      this.setState({ acte: {}, selectedModif: [], modifShow: false });
    }
  }

  checkedModif = modif => {
    return _.includes(this.state.selectedModif, modif.codModifi);
  };

  handleCheckModif = modif => {
    let s = this.state.selectedModif;
    let index = s.indexOf(modif.codModifi);
    if (index > -1) {
      // modif est déjà sélectionné
      s.splice(index, 1);
    } else {
      s.push(modif.codModifi);
    }
    this.setState({ selectedModif: s });

    // calcul du tarif
    this.tarif(
      this.props.codActe,
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

  readActe = codActe => {
    let params = {};
    params.date = this.props.date;
    this.props.client.CCAM.read(
      codActe,
      params,
      result => {
        console.log(result);
        this.setState({ acte: result });
      },
      error => {
        console.log(error);
        this.setState({ acte: {} });
      }
    );
  };

  // modif : array de codModifi
  tarif = (codActe, codActiv, codPhase, codGrille, date, codDom, modif) => {
    let m = "";
    _.forEach(modif, codModifi => {
      m += codModifi;
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
        //console.log(result);
        this.setState({ tarif: result });
      },
      error => {
        this.setState({ tarif: {} });
        console.log(error);
      }
    );
  };

  render() {
    //console.log(this.state.modificateurs);
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

      let listModificateurs = this.listModificateurs(
        this.state.modificateurs,
        this.state.currentGrille
      );

      //console.log(listModificateurs);
      //console.log(optionsDoms);
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
                  this.props.codActe,
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
                  modifShow: false
                });
                this.tarif(
                  this.props.codActe,
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
                  this.props.codActe,
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
                  this.props.codActe,
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
                        this.props.codActe,
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
                {!_.isEmpty(listModificateurs) && this.state.modifShow ? (
                  <Segment>
                    <div style={{ overflow: "auto", height: "220px" }}>
                      {_.map(listModificateurs, modif => (
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

          {/* Tarif affiché : 2 chiffres après la virgule (fonction toFixed)*/}
          <Header as="h2">
            Tarif :{" "}
            {!_.isEmpty(this.state.tarif)
              ? this.state.tarif.pu.toFixed(2) + " €"
              : "Inconnu"}
          </Header>
        </React.Fragment>
      );
    } else if (!_.isEmpty(this.state.acte) && !this.props.dynamic) {
      // Tarification statique
      return (
        <React.Fragment>
          <Header as="h2">
            Tarif :{" "}
            {!_.isEmpty(this.state.tarif)
              ? this.state.tarif.pu.toFixed(2) + " €"
              : "Inconnu"}
          </Header>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
