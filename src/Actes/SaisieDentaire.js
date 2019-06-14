import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import Actions from "../Shared/Actions";

import _ from "lodash";
import moment from "moment";
import "moment/locale/fr";

import { tarif } from "../lib/Helpers";

const propDefs = {
  description:
    "Composant correspondant à une ligne du tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    index: "Indice de la ligne",
    actions: "Liste d'actions à effectuer (en plus des actions par défaut)",
    code: "Code de l'Acte sélectionné",
    cotation:
      "Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif)",
    description: "Description de l'acte",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    modificateurs:
      'Modificateurs appliqués à l\'acte sélectionné. Par défaut ""',
    qualificatifs: "Les qualificatifs",
    disabled: "Désactivation de la ligne",
    montant: "Le moment pour cet acte",
    onClick: "Callback au clic sur une ligne",
    onDelete: "Callback à la suppression de la ligne",
    onDuplicate: "Callback à la duplication de la ligne",
    onEdit: "Callback action de recherche en CCAM",
    onInsertion: "Callback à l'insertion d'un nouvel acte"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    index: PropTypes.number,
    actions: PropTypes.array,
    code: PropTypes.string,
    cotation: PropTypes.number,
    description: PropTypes.string,
    date: PropTypes.string,
    localisation: PropTypes.string,
    modificateurs: PropTypes.string,
    qualificatifs: PropTypes.string,
    disabled: PropTypes.bool,
    montant: PropTypes.number,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    onDuplicate: PropTypes.func,
    onEdit: PropTypes.func,
    onInsertion: PropTypes.func
  }
};

export default class SaisieDentaire extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actions: [],
    code: "",
    cotation: 0,
    description: "",
    date: moment().toISOString(),
    localisation: "",
    disabled: true,
    montant: 0
  };

  render() {
    let actions = [
      {
        icon: "edit",
        text: "Editer",
        action: index => {
          if (this.props.onEdit) {
            this.props.onEdit(index);
          }
        }
      },
      {
        icon: "search",
        text: "Recherche par favoris",
        action: index => {}
      },
      {
        icon: "add",
        text: "Insérer",
        action: index => {
          if (this.props.onInsertion) {
            this.props.onInsertion(index);
          }
        }
      },
      {
        icon: "copy",
        text: "Dupliquer",
        action: index => {
          if (this.props.onDuplicate) {
            this.props.onDuplicate(index);
          }
        }
      },
      {
        icon: "trash",
        text: "Supprimer",
        action: index => {
          if (this.props.onDelete) {
            this.props.onDelete(index);
          }
        }
      }
    ];

    if (this.props.actions) {
      _.forEach(this.props.actions, a => {
        actions.push(a);
      });
    }

    return (
      <React.Fragment>
        <Table.Row
          disabled={this.props.disabled}
          textAlign="center"
          style={{ height: "35px" }}
          onClick={() => this.props.onClick(this.props.index)}
        >
          <Table.Cell collapsing={true} style={{ minWidth: "100px" }}>
            {_.isEmpty(this.props.code)
              ? ""
              : moment(this.props.date).format("L")}
          </Table.Cell>
          <Table.Cell collapsing={true}>{this.props.localisation}</Table.Cell>
          <Table.Cell collapsing={true} style={{ minWidth: "90px" }}>
            {this.props.code}
          </Table.Cell>
          <Table.Cell collapsing={true} textAlign="right">
            {_.isEmpty(this.props.code) ? "" : this.props.cotation}
          </Table.Cell>
          <Table.Cell textAlign="left">{this.props.description}</Table.Cell>
          <Table.Cell textAlign="center" collapsing={true}>
            {this.props.modificateurs}
          </Table.Cell>
          <Table.Cell collapsing={true}>
            {_.isEmpty(this.props.code) ? "" : this.props.qualificatifs}
          </Table.Cell>
          <Table.Cell collapsing={true} textAlign="right">
            {_.isEmpty(this.props.code) ? "" : tarif(this.props.montant)}
          </Table.Cell>
          <Table.Cell collapsing={true}>
            {this.props.disabled ? null : (
              <Actions actions={actions} id={this.props.index} />
            )}
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  }
}
