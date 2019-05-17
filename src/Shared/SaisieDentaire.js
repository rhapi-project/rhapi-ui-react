import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import ModalSearch from "../CCAM/ModalSearch";

import _ from "lodash";
import moment from "moment";
import "moment/locale/fr";

const propDefs = {
  description: "Composant correspondant à une ligne du tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    acte: "Acte sélectionné",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    localisation: 'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    disabled: "Désactivation de la ligne",
    montant: "Le moment pour cet acte",
    onSelectionActe: "Callback à la sélection d'un acte"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    acte: PropTypes.object,
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
    acte: {},
    date: moment().toISOString(),
    localisation: "",
    disabled: true,
    montant: ""
  };
  componentWillMount() {
    this.setState({
      acte: this.props.acte,
      date: this.props.date,
      localisation: this.props.localisation,
      montant: this.props.montant,
      modalSearchOpen: false
    });
  };

  componentWillReceiveProps(next) {
    this.setState({
      acte: next.acte,
      date: next.date,
      localisation: next.localisation,
      montant: next.montant,
    });
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
          onClick={() => this.setState({ modalSearchOpen: true })}
        >
          <Table.Cell collapsing={true} style={{ minWidth: "100px" }}>
            { _.isEmpty(this.state.acte) ? "" : moment(this.state.date).format("L") }
          </Table.Cell>
          <Table.Cell collapsing={true}>
            {this.state.localisation}
          </Table.Cell>
          <Table.Cell collapsing={true} style={{ minWidth: "90px" }}>
            {_.isEmpty(this.state.acte) ? "" : this.state.acte.codActe}
          </Table.Cell>
          <Table.Cell textAlign="left">
            {_.isEmpty(this.state.acte) ? "" : this.state.acte.nomLong}
          </Table.Cell>
          <Table.Cell collapsing={true} textAlign="right">
            {" "}
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