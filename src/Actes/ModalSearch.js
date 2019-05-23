import React from "react";
import PropTypes from "prop-types";
import { Divider, Form, Header, Icon, Modal } from "semantic-ui-react";
import Search2 from "../CCAM/Search";
import Table2 from "../CCAM/Table";
import Localisations from "../Shared/Localisations";
import Tarification from "../CCAM/Tarification";

import moment from "moment";

import { toISOLocalisation } from "../lib/Helpers";

const propDefs = {
  description:
    "Ce composant est une modal Semantic de recherche d'un acte. Il intègre " +
    "un date picker, les composants CCAM.Search, CCAM.Table et Shared.Localisations",
  example: "ModalSearch",
  propDocs: {
    acte: "Acte sélectionné",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    dents:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    executant:
      "Limiter la recherche aux seuls actes d'une profession de santé. " +
      "Exemple : D1(dentistes), SF(sages-femmes)",
    localisationPicker:
      "Affichage de la grille de saisie des localisations dentaires",
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    acte: PropTypes.object,
    date: PropTypes.string,
    dents: PropTypes.string,
    executant: PropTypes.string,
    localisationPicker: PropTypes.bool,
    open: PropTypes.bool,
    onClose: PropTypes.func
  }
};

export default class ModalSearch extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    acte: {},
    date: moment().toISOString(),
    dents: "",
    executant: "",
    localisationPicker: false
  };

  componentWillMount() {
    this.setState({
      acte: this.props.acte,
      actes: [],
      date: this.props.date,
      dents: this.props.dents,
      informations: {}
    });
  }

  onClose = () => {
    if (!_.isUndefined(this.props.onClose)) {
      this.props.onClose();
    }
  };

  onLoadActes = obj => {
    this.setState({
      actes: obj.results,
      acte: {},
      informations: obj.informations
    });
  };

  onPageSelect = obj => {
    this.setState({
      actes: obj.actes,
      informations: obj.informations
    });
  };

  onSelection = acte => {
    this.props.onSelectionActe(
      this.props.rowIndex,
      acte,
      this.state.date,
      this.state.dents
    );
    this.props.onClose();
  };

  /*onSelection = acte => {
    this.setState({
      acte: acte
    });
  };

  successTarification = detail => {
    this.props.onSelectionActe(
      this.props.rowIndex,
      detail.acte,
      detail.date,
      this.state.dents,
      detail.tarif
    );
    this.props.onClose();
  };*/

  render() {
    let localisation = this.props.localisationPicker ? (
      <Localisations
        dents={this.state.dents}
        onSelection={dents => this.setState({ dents: dents })}
      />
    ) : null;
    let tableProps = {
      celled: true,
      style: { width: "100%" }
    };

    return (
      <Modal open={this.props.open} onClose={this.onClose} size="large">
        <Modal.Content>
          {localisation}
          <Divider />
          <Search2
            client={this.props.client}
            date={this.state.date}
            executant={this.props.executant}
            limit={7}
            localisation={toISOLocalisation(this.state.dents)}
            onLoadActes={this.onLoadActes}
          />
          <Divider hidden={true} />
          <div style={{ height: "350px", overflow: "auto" }}>
            {_.isEmpty(this.state.actes) ? (
              <div style={{ textAlign: "center" }}>
                <Header
                  as="h3"
                  icon={true}
                  style={{ marginTop: "10%", verticalAlign: "middle" }}
                >
                  <Icon name="search" />
                  Recherche d'un acte en CCAM
                </Header>
              </div>
            ) : null}
            <Table2
              client={this.props.client}
              actes={this.state.actes}
              informations={this.state.informations}
              onPageSelect={this.onPageSelect}
              onSelection={this.onSelection}
              table={tableProps}
              showPagination={true}
            />
          </div>
          {/*<Tarification
            client={this.props.client}
            codActe={this.state.acte.codActe}
            date={this.state.date}
            dynamic={false}
            hidden={false}
            success={this.successTarification}
          />*/}
        </Modal.Content>
      </Modal>
    );
  }
}
