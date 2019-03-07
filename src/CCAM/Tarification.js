import React from "react";
import PropTypes from "prop-types";
import { Form, Header, Label } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Détail de la facturation d'un acte",
  example: "Tarification",
  propDocs: {
    acte: "Acte CCAM sélectionné",
    client: "auto documenté"
  },
  propTypes: {
    acte: PropTypes.object,
    client: PropTypes.any.isRequired
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    activites: [],
    contextes: {},
    doms: [],
    currentActivite: "1",
    currentDom: 0,
    currentGrille: 0,
    currentPhase: 0,
    grilles: [],
    phases: []
  }

  componentWillMount() {
    this.loadContextes();
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

  loadContextes = () => {
    this.props.client.CCAM.contextes(
      results => {
        //console.log(results);
        this.setState({
          contextes: results,
          activites: results.activite,
          doms: results.dom,
          grilles: results.tb23,
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

  render() {
    console.log(this.state);
    let show = this.show();
    if (show) {
      let acte = this.props.acte;
      let optionsActivites = this.optionsActivites(this.state.activites);
      let optionsGrilles = this.optionsGrilles(this.state.grilles);
      let phases = this.state.phases;
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
              <Form.Group
                inline={true}
                //widths="equal"
              >
                <label>Phase</label>
                {_.map(this.state.phases, phase =>
                  <Form.Radio
                    key={phase.codPhase}
                    label={phase.libelle}
                    checked={this.state.currentPhase === phase.codPhase}
                    onChange={() => this.setState({ currentPhase: phase.codPhase })}
                    toggle={true}
                  />  
                )}
              </Form.Group>
              <Form.Group
                inline={true}
                //widths="equal"
              >
                <label>DOM</label>
                {_.map(this.state.doms, dom =>
                  <Form.Radio
                    key={dom.codDom}
                    label={dom.libelle}
                    checked={this.state.currentDom === dom.codDom}
                    onChange={() => this.setState({ currentDom: dom.codDom })}
                    toggle={true}
                  />  
                )}
              </Form.Group>
            </Form>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
