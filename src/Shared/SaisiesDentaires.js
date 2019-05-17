import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import SaisieDentaire from "./SaisieDentaire";
import _ from "lodash";

import moment from "moment";

const propDefs = {
  description: "Tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    lignes: "Nombre de lignes à afficher pour ce tableau. Par défaut 5"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    lignes: PropTypes.number
  }
};

export default class SaisiesDentaires extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    lignes: 5
  };

  componentWillMount() {
    this.setState({
      activeRow: 0,
      saisies: []
    });
  };

  notExistSaisie = index => {
    return _.isUndefined(this.state.saisies[index]);
  };

  onSelectionActe = (rowKey, acte, date, localisation) => {
    let obj = {};
    obj.acte = acte;
    obj.date = date;
    obj.localisation = localisation;
    let s = this.state.saisies;
    if (rowKey === this.state.activeRow) {
      s.push(obj);
      this.setState({ activeRow: rowKey + 1, saisies: s });
    } else {
      s[rowKey] = obj;
      this.setState({ saisies: s });
    }
  };
  
  render() {
    return (
      <Table celled={true} striped={true} selectable={true}>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Localisation</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Libellé</Table.HeaderCell>
            <Table.HeaderCell>Montant</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.times(this.props.lignes, i => 
            <SaisieDentaire
              key={i}
              index={i}
              client={this.props.client}
              acte={
                this.notExistSaisie(i)
                  ? {}
                  : this.state.saisies[i].acte
              }
              date={
                this.notExistSaisie(i) ? moment().toISOString() : this.state.saisies[i].date
              }
              localisation={
                this.notExistSaisie(i) ? "" : this.state.saisies[i].localisation
              }
              moment={
                this.notExistSaisie(i) ? "" : this.state.saisies[i].montant
              }
              disabled={this.state.activeRow < i}
              onSelectionActe={this.onSelectionActe}
            />
          )}
        </Table.Body>
      </Table>
    );
  }
}