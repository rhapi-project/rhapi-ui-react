import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Form, Header, Segment } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

const propDefs = {
  description: "Détail de la facturation d'un acte",
  example: "Tarification",
  propDocs: {
    codActe: "code Acte CCAM",
    codActivite: "code de l'activité",
    codDom: "code DOM",
    codGrille: "code grille",
    codPhase: "code phase",
    date: "date de la tarification"
  },
  propTypes: {
    codActe: PropTypes.string,
    codActivite: PropTypes.string,
    codDom: PropTypes.number,
    codGrille: PropTypes.number,
    codPhase: PropTypes.number,
    client: PropTypes.any.isRequired,
    date: PropTypes.string
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    codActe: null,
    codActivite: "1",
    codDom: 0,
    codGrille: 0,
    codPhase: 0,
    date: moment().toISOString()
  };

  state = {
    acte: {},
    activites: [],
    doms: [],
    grilles: [],
    modificateurs: [],
    phases: [],
    selectedModif: [], // modificateurs sélectionnés
    tarif: {}
  };

  componentWillMount() {
    this.loadContextes();
    this.setState({
      currentActivite: this.props.codActivite,
      currentDom: this.props.codDom,
      currentGrille: this.props.codGrille,
      currentPhase: this.props.codPhase
    });
  }

  componentWillReceiveProps(next) {
    if (!_.isNull(next.codActe)) {
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
    }
  }

  loadContextes = () => {
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
  };

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

  /**
   * @possActiv array de codActivite possibles pour cet acte
   * @allActiv toutes les activités retournées par CONTEXTES
   * ATTENTION : dans 'allActiv' les codActiv sont des chaines de caracteres tandis que les
   * 'possActiv' sont des entiers. Une conversion est faite avant la comparaison.
   */
  optionsActivites = (allActiv, possActiv) => {
    let opt = [];
    _.forEach(allActiv, activite => {
      if (_.includes(possActiv, parseInt(activite.codActiv))) {
        let obj = {};
        obj.text = activite.libelle;
        obj.value = activite.codActiv;
        opt.push(obj);
      }
    });
    return opt;
  };

  optionsGrilles = grilles => {
    let opt = [];
    _.forEach(grilles, g => {
      let obj = {};
      obj.text = g.libelle;
      obj.value = g.codGrille;
      opt.push(obj);
    });
    return opt;
  };

  /**
   * @possPhases array de codPhase possibles pour cet acte
   * @allAPhases toutes les phases retournées par CONTEXTES
   */
  optionsPhases = (allPhases, possPhases) => {
    let opt = [];
    _.forEach(allPhases, phase => {
      if (_.includes(possPhases, phase.codPhase)) {
        let obj = {};
        obj.text = phase.libelle;
        obj.value = phase.codPhase;
        opt.push(obj);
      }
    });
    return opt;
  };

  optionsDoms = doms => {
    let opt = [];
    _.forEach(doms, dom => {
      let obj = {};
      obj.text = dom.libelle;
      obj.value = dom.codDom;
      opt.push(obj);
    });

    // option qui sera utilisé par défaut
    let obj = {};
    obj.text = "METROPOLE";
    obj.value = 0;
    opt.push(obj);
    return opt;
  };

  // définition d'une grille - description
  defGrille = (codGrille, grilles) => {
    let grille = _.find(grilles, g => {
      return codGrille === g.codGrille;
    });
    return _.isUndefined(grille) ? "" : grille.definition;
  };

  // modificateurs possible par rapport à une grille
  listModificateurs = (modificateurs, grille) => {
    return _.filter(modificateurs, m => {
      return m.grilleCod === grille;
    });
  };

  /**
   * @codActe code de l'acte CCAM
   * read d'un acte dans le but d'obtenir les 'codActivites', 'codPhases' possibles
   * et encore plus d'options.
   * ATTENTION (callbacks) : le premier callback correspont-il à l'erreur ?
   * TODO : Bien vérifer cela...
   */
  readActe = codActe => {
    this.props.client.CCAM.read(
      codActe,
      error => {
        console.log(error);
      },
      result => {
        //console.log(result);
        this.setState({ acte: result });
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
        console.log(error);
      }
    );
  };

  render() {
    if (!_.isEmpty(this.state.acte)) {
      
      // les variables options* contiennent les valeurs des options
      // qui seront utilisées dans les Dropdown

      let optionsActivites = this.optionsActivites(
        this.state.activites,
        this.state.acte.codActivites
      );
      let optionsDoms = this.optionsDoms(this.state.doms);
      let optionsGrilles = this.optionsGrilles(this.state.grilles);
      let optionsPhases = this.optionsPhases(
        this.state.phases,
        this.state.acte.codPhases
      );
      let listModificateurs = this.listModificateurs(
        this.state.modificateurs,
        this.state.currentGrille
      );

      return (
        <React.Fragment>
          {/*<Header as="h3">{acte.codActe}</Header>
          <Header as="h4">{acte.nomLong}</Header>*/}
          <Form>
            <Form.Dropdown
              label="Activité"
              placeholder="Sélectionner une activité"
              onChange={(e, d) => {
                this.setState({ currentActivite: d.value });
                this.tarif(
                  this.props.codActe,
                  d.value,
                  this.state.currentPhase,
                  this.state.currentGrille,
                  this.props.date,
                  this.state.currentDom,
                  this.state.selectedModif
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
                this.setState({ currentGrille: d.value });
                this.tarif(
                  this.props.codActe,
                  this.state.currentActivite,
                  this.state.currentPhase,
                  d.value,
                  this.props.date,
                  this.state.currentDom,
                  this.state.selectedModif
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
                this.setState({ currentPhase: d.value });
                this.tarif(
                  this.props.codActe,
                  this.state.currentActivite,
                  d.value,
                  this.state.currentGrille,
                  this.props.date,
                  this.state.currentDom,
                  this.state.selectedModif
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
                this.setState({ currentDom: d.value });
                this.tarif(
                  this.props.codActe,
                  this.state.currentActivite,
                  this.state.currentPhase,
                  this.state.currentGrille,
                  this.props.date,
                  d.value,
                  this.state.selectedModif
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
                  checked={_.isEmpty(this.state.selectedModif)}
                  onChange={() => {
                    if (!_.isEmpty(this.state.selectedModif)) {
                      this.setState({ selectedModif: [] });
                      this.tarif(
                        this.props.codActe,
                        this.state.currentActivite,
                        this.state.currentPhase,
                        this.state.currentGrille,
                        this.props.date,
                        this.state.currentDom,
                        []
                      );
                    }
                  }}
                />
                {!_.isEmpty(listModificateurs) ? (
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
          <Header as="h2">
            Tarif :{" "}
            {!_.isEmpty(this.state.tarif)
              ? this.state.tarif.pu + " €"
              : "Inconnu"}
          </Header>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
