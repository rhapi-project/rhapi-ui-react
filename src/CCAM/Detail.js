import React from "react";
import PropTypes from "prop-types";
import { Header, Table } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Détail d'un acte tarifé",
  example: "Détail",
  propDocs: {
    detail:
      "Objet contenant le détail d'un acte. Toutes les informations sur un acte tarifé, " +
      "la date, l'activité, la grille de tarification, les modificateurs appliqués, la phase et le tarif."
  },
  propTypes: {
    detail: PropTypes.object
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    detail: {}
  };

  convertDate = dateStr => {
    return new Date(dateStr).toLocaleDateString();
  }

  render() {
    if (_.isEmpty(this.props.detail)) {
      return "";
    }
    
    let acte = _.isUndefined(this.props.detail.acte) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Acte"/></Table.Cell>
        <Table.Cell>
          <strong>Code : </strong> {_.isUndefined(this.props.detail.acte.codActe) ? "" : this.props.detail.acte.codActe} <br />
          <strong>Nom : </strong> {_.isUndefined(this.props.detail.acte.nomLong) ? "" : this.props.detail.acte.nomLong} <br />
        </Table.Cell>
      </Table.Row>
    );

    let activite = _.isUndefined(this.props.detail.activite) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Activite"/></Table.Cell>
        <Table.Cell>
          <strong>Code : </strong>
            {_.isUndefined(this.props.detail.activite.codActiv)
              ? _.isUndefined(this.props.detail.activite.value)
                ? "" :  this.props.detail.activite.value
              : this.props.detail.activite.codActiv} <br />
          <strong>Libellé : </strong> {_.isUndefined(this.props.detail.activite.libelle) ? "" : this.props.detail.activite.libelle}
        </Table.Cell>
      </Table.Row>
    );

    let date = _.isUndefined(this.props.detail.date) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Date"/></Table.Cell>
        <Table.Cell>{this.convertDate(this.props.detail.date)}</Table.Cell>
      </Table.Row>
    );

    let grille = _.isUndefined(this.props.detail.grille) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Grille"/></Table.Cell>
        <Table.Cell>
          <strong>Code : </strong>
            {_.isUndefined(this.props.detail.grille.codGrille)
              ? _.isUndefined(this.props.detail.grille.value)
                ? "" :  this.props.detail.grille.value
              : this.props.detail.grille.codGrille} <br />
            <strong>Définition : </strong> {_.isUndefined(this.props.detail.grille.definition) ? "" : this.props.detail.grille.definition} <br />
            <strong>Libellé : </strong> {_.isUndefined(this.props.detail.grille.libelle) ? "" : this.props.detail.grille.libelle}
        </Table.Cell>
      </Table.Row>
    );

    let modificateurs = _.isEmpty(this.props.detail.modificateurs) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Modificateurs"/></Table.Cell>
        <Table.Cell>
          <Table basic="very" celled={true}>
            <Table.Body>
              {_.map(this.props.detail.modificateurs, modificateur =>
                <Table.Row key={modificateur.codModifi}>
                  <Table.Cell>
                    <strong>Code modificateur : </strong> {modificateur.codModifi} <br />
                    <strong>Coefficient : </strong> {modificateur.coef} <br />
                    <strong>Date début : </strong> {_.isNull(modificateur.dtDebut) ? "Indéterminée" : this.convertDate(modificateur.dtDebut)} <br />
                    <strong>Date fin : </strong> {_.isNull(modificateur.dtFin) ? "Indéterminée" : this.convertDate(modificateur.dtFin)} <br />
                    <strong>Forfait : </strong> {modificateur.forfait} <br />
                    <strong>Code de la grille : </strong> {modificateur.grilleCod} <br />
                    <strong>Libellé : </strong> {modificateur.libelle}
                  </Table.Cell>
                </Table.Row>  
              )}
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );

    let phase = _.isUndefined(this.props.detail.phase) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Phase"/></Table.Cell>
        <Table.Cell>
          <strong>Code : </strong>
            {_.isUndefined(this.props.detail.phase.codPhase)
              ? _.isUndefined(this.props.detail.phase.value)
                ? "" :  this.props.detail.phase.value
              : this.props.detail.phase.codPhase} <br />
            <strong>Libellé : </strong> {_.isUndefined(this.props.detail.phase.libelle) ? "" : this.props.detail.phase.libelle}
        </Table.Cell>
      </Table.Row>
    );

    let tarif = _.isUndefined(this.props.detail.tarif) ? null : (
      <Table.Row>
        <Table.Cell><Header as="h3" content="Tarif"/></Table.Cell>
        <Table.Cell>
          <strong>Pu base : </strong> {_.isUndefined(this.props.detail.tarif.puBase) ? "" : this.props.detail.tarif.puBase.toFixed(2) + " €"} <br />
          <strong>Pu : </strong> {_.isUndefined(this.props.detail.tarif.pu) ? "" : this.props.detail.tarif.pu.toFixed(2) + " €"} <br />
        </Table.Cell>
      </Table.Row>
    );

    return (
      <React.Fragment>
        <Table celled={true}>
          <Table.Body>
            {acte}
            {activite}
            {date}
            {grille}
            {modificateurs}
            {phase}
            {tarif}
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}