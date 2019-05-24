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
    fse: "Feuille de Soin Electronique en cours",
    idPatient: "Identifiant du patient dans la base de données",
    lignes: "Nombre de lignes à afficher pour ce tableau. Par défaut 5",
    onUpdate: "Callback mise à jour de la feuille de soin"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    fse: PropTypes.object,
    lignes: PropTypes.number,
    onUpdate: PropTypes.func
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
      actes: _.get(this.props.fse, "contentJO.actes", [])
    });
  }

  componentWillReceiveProps(next) {
    console.log(next.fse);
    this.setState({
      activeRow: _.get(next.fse, "contentJO.actes", []).length,
      actes: _.get(next.fse, "contentJO.actes", [])
    });
  }

  existActe = index => {
    return !_.isUndefined(this.state.actes[index]);
  };

  onSelectionActe = (rowKey, acte, date, localisation, tarif) => {
    //console.log("Saisie on selection acte ");
    //console.log("rowkey " + rowKey);
    //console.log("this.state.activeRow " + this.state.activeRow);
    let obj = {};
    obj.date = date;
    obj.localisation = localisation;
    obj.codActe = acte.codActe;
    obj.description = acte.nomLong;
    obj.montant = tarif.pu;
    let a = this.state.actes;
    if (rowKey === this.state.activeRow) {
      a.push(obj);
      if (!_.isUndefined(this.props.onUpdate)) {
        this.props.onUpdate(a);
      } else {
        this.setState({ activeRow: rowKey + 1, actes: a });
      }
    } else {
      //console.log("on another rowKey");
      //console.log(acte);
      /*if (_.isEmpty(acte)) {
        return;
      }*/
      if (
        _.isEqual(acte.codActe, a[rowKey].codActe) &&
        _.isEqual(date, a[rowKey].date) &&
        _.isEqual(localisation, a[rowKey].localisation) &&
        _.isEqual(tarif.pu, a[rowKey].montant)
      ) {
        return;
      }
      a[rowKey] = obj;
      if (!_.isUndefined(this.props.onUpdate)) {
        this.props.onUpdate(a);
      } else {
        this.setState({ actes: a });
      }
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
              codActe={this.existActe(i) ? this.state.actes[i].codActe : ""}
              date={
                this.existActe(i)
                  ? this.state.actes[i].date
                  : moment().toISOString()
              }
              description={
                this.existActe(i) ? this.state.actes[i].description : ""
              }
              localisation={
                this.existActe(i) ? this.state.actes[i].localisation : ""
              }
              montant={
                this.existActe(i) ? tarif(this.state.actes[i].montant) : ""
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
