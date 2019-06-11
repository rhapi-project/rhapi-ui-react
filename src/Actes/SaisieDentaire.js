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
    actions: "Liste d'actions à effectuer",
    code: "Code de l'Acte sélectionné",
    cotation:
      "Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif)",
    description: "Description de l'acte",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    modificateurs:
      'Modificateurs appliqués à l\'acte sélectionné. Par défaut ""',
    disabled: "Désactivation de la ligne",
    montant: "Le moment pour cet acte"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    actions: PropTypes.array,
    code: PropTypes.string,
    cotation: PropTypes.number,
    description: PropTypes.string,
    date: PropTypes.string,
    localisation: PropTypes.string,
    modificateurs: PropTypes.string,
    disabled: PropTypes.bool,
    montant: PropTypes.number
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

  onCloseModalSearch = () => {
    this.setState({ modalSearchOpen: false });
  };

  render() {
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
          <Table.Cell collapsing={true}/>
          <Table.Cell collapsing={true} textAlign="right">
            {_.isEmpty(this.props.code) ? "" : tarif(this.props.montant)}
          </Table.Cell>
          <Table.Cell>
            {_.isEmpty(this.props.code) ? null : (
              <Actions actions={this.props.actions} />
            )}
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  }
}
