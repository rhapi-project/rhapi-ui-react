import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import ModalSearch from "./ModalSearch";
import Tarification from "../CCAM/Tarification";

import _ from "lodash";
import moment from "moment";
import "moment/locale/fr";

const propDefs = {
  description:
    "Composant correspondant à une ligne du tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    codActe: "Code de l'Acte sélectionné",
    description: "Description de l'acte",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    disabled: "Désactivation de la ligne",
    montant: "Le moment pour cet acte",
    onSelectionActe: "Callback à la sélection d'un acte"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    codActe: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    localisation: PropTypes.string,
    disabled: PropTypes.bool,
    montant: PropTypes.string,
    onSelectionActe: PropTypes.func
  }
};

export default class SaisieDentaire extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    codActe: "",
    description: "",
    date: moment().toISOString(),
    localisation: "",
    disabled: true,
    montant: ""
  };
  componentWillMount() {
    this.setState({
      codActe: this.props.codActe,
      date: this.props.date,
      localisation: this.props.localisation,
      montant: this.props.montant,
      modalSearchOpen: false
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      codActe: next.codActe,
      date: next.date,
      localisation: next.localisation,
      montant: next.montant
    });
  }

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
          onClick={() => this.setState({ modalSearchOpen: true })}
        >
          <Table.Cell collapsing={true} style={{ minWidth: "100px" }}>
            {_.isEmpty(this.state.codActe)
              ? ""
              : moment(this.state.date).format("L")}
          </Table.Cell>
          <Table.Cell collapsing={true}>{this.state.localisation}</Table.Cell>
          <Table.Cell collapsing={true} style={{ minWidth: "90px" }}>
            {this.state.codActe}
          </Table.Cell>
          <Table.Cell collapsing={true}> </Table.Cell>
          <Table.Cell textAlign="left">{this.props.description}</Table.Cell>
          <Table.Cell collapsing={true} textAlign="right">
            {this.state.montant}
          </Table.Cell>
        </Table.Row>
        <ModalSearch
          client={this.props.client}
          executant="D1"
          date={this.state.date}
          dents={this.state.localisation}
          localisationPicker={true}
          open={this.state.modalSearchOpen}
          onClose={this.onCloseModalSearch}
          onSelectionActe={this.props.onSelectionActe}
          rowIndex={this.props.index}
        />
      </React.Fragment>
    );
  }
}
