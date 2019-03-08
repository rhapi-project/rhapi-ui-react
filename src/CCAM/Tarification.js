import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Divider, Form, Header, Segment } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Détail de la facturation d'un acte",
  example: "Tarification",
  propDocs: {
    acte: "Acte CCAM sélectionné",
    activite: "code de l'activité",
    dom: "code DOM",
    grille: "code grille",
    phase: "code phase"
  },
  propTypes: {
    acte: PropTypes.object,
    activite: PropTypes.string,
    client: PropTypes.any.isRequired,
    dom: PropTypes.number,
    grille: PropTypes.number,
    phase: PropTypes.number
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    activite: "1",
    dom: 0,
    grille: 0,
    phase: 0
  };

  state = {
    activites: [],
    contextes: {},
    doms: [],
    grilles: [],
    modificateurs: [],
    phases: []
  }

  componentWillMount() {
    this.loadContextes();
    this.setState({
      currentActivite: this.props.activite,
      currentDom: this.props.dom,
      currentGrille: this.props.grille,
      currentPhase: this.props.phase
    });
  };

  optionsActivites = activites => {
    let opt = [];
    for (let i = 0 ; i < activites.length ; i++) {
      let obj = {};
      obj.text = activites[i].libelle;
      obj.value = activites[i].codActiv;
      opt.push(obj);
    }
    return opt;
  };

  optionsGrilles = grilles => {
    let opt = [];
    for (let i = 0 ; i < grilles.length ; i++) {
      let obj = {};
      obj.text = grilles[i].libelle;
      obj.value = grilles[i].codGrille;
      opt.push(obj);
    }
    return opt;
  };

  defGrille = (codGrille, grilles) => {
    for (let i = 0 ; i < grilles.length ; i++) {
      if (codGrille === grilles[i].codGrille) {
        return grilles[i].definition;
      }
    }
    return "";
  };

  listModificateurs = (modificateurs, currentGrille) => {
    let m = [];
    _.map(modificateurs, modif => {
      if (modif.grilleCod === currentGrille) {
        m.push(modif);
      }
    });
    return m;
  };

  loadContextes = () => {
    this.props.client.CCAM.contextes(
      results => {
        //console.log(results);
        this.setState({
          contextes: results,
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

  show = () => {
    return (
      !_.isUndefined(this.props.acte) && !_.isEmpty(this.props.acte) && !_.isEmpty(this.state.contextes)
    );
  };

  tarif = () => {
    let params = {
      activite: this.state.currentActivite,
      phase: this.state.currentPhase,
      grille: this.state.currentGrille,
      //dom: this.state.currentDom
    }
    this.props.client.CCAM.tarif(
      this.props.acte.codActe,
      params,
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    //console.log(this.state);
    let show = this.show();
    if (show) {
      let acte = this.props.acte;
      let optionsActivites = this.optionsActivites(this.state.activites);
      let optionsGrilles = this.optionsGrilles(this.state.grilles);
      let listModificateurs = this.listModificateurs(this.state.modificateurs, this.state.currentGrille);
      //let phases = this.state.phases;
      //let tarif = this.tarif();
      //console.log(tarif);
      //console.log(listModificateurs);
      return (
        <React.Fragment>
          <Header as="h3">{acte.codActe}</Header>
          <Header as="h4">{acte.nomLong}</Header>
          <Form>
            <Form.Dropdown
              label={"Grille " + "(" + this.defGrille(this.state.currentGrille, this.state.grilles) + ")"}
              placeholder="Sélectionner une grille"
              onChange={(e, d) => {this.setState({ currentGrille: d.value })}}
              options={optionsGrilles}
              selection={true}
              value={this.state.currentGrille}
            />

            <Form.Dropdown
              label="Activité"
              placeholder="Sélectionner une activité"
              onChange={(e, d) => {this.setState({ currentActivite: d.value })}}
              options={optionsActivites}
              selection={true}
              value={this.state.currentActivite}
            />

            <Form.Group widths="equal">
              <Form.Input label="Phase">
                <div>
                  {_.map(this.state.phases, phase =>
                    <div key={phase.codPhase}>
                      <Checkbox
                        //key={phase.codPhase}
                        label={phase.libelle}
                        checked={this.state.currentPhase === phase.codPhase}
                        onChange={() => this.setState({ currentPhase: phase.codPhase })}
                      />
                    </div>
                  )}
                </div>
              </Form.Input>
              <Form.Input label="DOM">
                <div>
                  {_.map(this.state.doms, dom =>
                    <div key={dom.codDom}>
                      <Checkbox
                        label={dom.libelle}
                        checked={this.state.currentDom === dom.codDom}
                        onChange={() => this.setState({ currentDom: dom.codDom })}
                      />
                    </div>
                  )}
                </div>
              </Form.Input>
            </Form.Group>

            <Form.Input label="Modificateurs">
              <div>
                <Checkbox 
                  label="Aucun modificateur"
                />
                {!_.isEmpty(listModificateurs)
                  ? <Segment>
                      <div style={{ overflow:"auto", height: "220px" }}>
                        {_.map(listModificateurs, modif =>
                          <div key={modif.libelle + "" + modif.coef}>
                            <Checkbox
                              label={modif.libelle}
                            />
                          </div>
                        )}
                      </div>
                    </Segment>
                  : ""
                }
              </div>              
            </Form.Input>
          </Form>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
