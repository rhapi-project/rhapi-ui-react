import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import SaisieDentaire from "./SaisieDentaire";
import _ from "lodash";

import moment from "moment";

import { tarif } from "../lib/Helpers";

const propDefs = {
  description: "Tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    idPatient: "Identifiant du patient dans la base de données",
    lignes: "Nombre de lignes à afficher pour ce tableau. Par défaut 5"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    lignes: PropTypes.number
  }
};

export default class Saisie extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: 0,
    lignes: 5
  };

  componentWillMount() {
    this.setState({
      activeRow: 0,
      actes: []
    });
  }

  existActe = index => {
    return !_.isUndefined(this.state.actes[index]);
  };

  onSelectionActe = (rowKey, acte, date, localisation, tarif) => {
    let obj = {};
    obj.acte = acte;
    obj.date = date;
    obj.localisation = localisation;
    obj.tarif = tarif;
    let a = this.state.actes;
    if (rowKey === this.state.activeRow) {
      a.push(obj);
      this.setState({ activeRow: rowKey + 1, actes: a });
    } else {
      if (
        _.isEqual(acte, a[rowKey].acte) &&
        _.isEqual(date, a[rowKey].date) &&
        _.isEqual(localisation, a[rowKey].localisation) &&
        _.isEqual(tarif, a[rowKey].tarif)
      ) {
        return;
      }
      a[rowKey] = obj;
      this.setState({ actes: a });
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
            <Table.HeaderCell>Cotation</Table.HeaderCell>
            <Table.HeaderCell>Libellé</Table.HeaderCell>
            <Table.HeaderCell>Montant</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.times(this.props.lignes, i => (
            <SaisieDentaire
              key={i}
              index={i}
              client={this.props.client}
              acte={this.existActe(i) ? this.state.actes[i].acte : {}}
              date={
                this.existActe(i)
                  ? this.state.actes[i].date
                  : moment().toISOString()
              }
              localisation={
                this.existActe(i) ? this.state.actes[i].localisation : ""
              }
              montant={
                this.existActe(i) ? tarif(this.state.actes[i].tarif.pu) : ""
              }
              disabled={this.state.activeRow < i}
              onSelectionActe={this.onSelectionActe}
            />
          ))}
        </Table.Body>
      </Table>
    );
  }
}
