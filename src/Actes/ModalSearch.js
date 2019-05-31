import React from "react";
import PropTypes from "prop-types";
import { Accordion, Button, Divider, Form, Header, Icon, Input, Modal, Table } from "semantic-ui-react";
import Search2 from "../CCAM/Search";
import Table2 from "../CCAM/Table";
import Localisations from "../Shared/Localisations";
import Tarification from "../CCAM/Tarification";

import moment from "moment";

const propDefs = {
  description:
    "Ce composant est une modal Semantic de recherche d'un acte. Il intègre " +
    "un date picker, les composants CCAM.Search, CCAM.Table et Shared.Localisations",
  example: "ModalSearch",
  propDocs: {
    cotation:
      "Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif)",
    date: "Date effective de l'acte au format ISO. Par défaut date du jour",
    localisation:
      'Liste des dents sélectionnées, séparées par des espaces. Par défaut ""',
    executant:
      "Limiter la recherche aux seuls actes d'une profession de santé. " +
      "Exemple : D1(dentistes), SF(sages-femmes)",
    localisationPicker:
      "Affichage de la grille de saisie des localisations dentaires",
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal",
    rowIndex:
      "Indice de la ligne sur laquelle on a cliqué dans le tableau de saisie des actes"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    cotation: PropTypes.number,
    date: PropTypes.string,
    localisation: PropTypes.string,
    executant: PropTypes.string,
    localisationPicker: PropTypes.bool,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    rowIndex: PropTypes.number
  }
};

export default class ModalSearch extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    date: moment().toISOString(),
    localisation: "",
    cotation: 0,
    executant: "",
    localisationPicker: false
  };

  componentWillMount() {
    this.setState({
      acte: {},
      actes: [],
      date: this.props.date,
      localisation: this.props.localisation,
      openLocalisation: false,
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

  errorTarification = () => {};

  onSelection = acte => {
    this.setState({
      acte: acte
    });
  };

  successTarification = detail => {
    this.props.onSelectionActe(
      this.props.rowIndex,
      detail.acte,
      detail.date,
      this.state.localisation,
      this.props.cotation,
      detail.tarif
    );
    this.props.onClose();
  };

  openLocalisation = () => {
    this.setState({
      openLocalisation: !this.state.openLocalisation
    });
  };

  render() {
    let localisation = this.props.localisationPicker ? (
      <Localisations
        dents={this.state.localisation}
        onSelection={dents => this.setState({ localisation: dents })}
      />
    ) : null;
    let tableProps = {
      celled: true,
      style: { width: "100%" }
    };

    return (
      <Modal open={this.props.open} onClose={this.onClose} size="large">
        <Modal.Content>
          <Table basic="very" style={{ marginBottom: "0px" }}>
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Recherche d'un acte">
                      <Search2
                        client={this.props.client}
                        date={this.state.date}
                        executant={this.props.executant}
                        limit={7}
                        localisation={this.state.localisation}
                        onLoadActes={this.onLoadActes}
                      />
                    </Form.Input>
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Date"/>
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Localisation"/>
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Modificateurs"/>
                  </Form>
                </Table.Cell>
                <Table.Cell collapsing={true}>
                  <Form>
                    <Form.Input label="Montant"/>
                  </Form>
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell colSpan={4}>
                    <Input fluid={true}/>
                </Table.Cell>
                <Table.Cell>
                  <Input fluid={true}/>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Accordion styled={true} fluid={true}>
            <Accordion.Title active={this.state.openLocalisation} onClick={this.openLocalisation}>
              <Icon name="dropdown" />
              Localisation
            </Accordion.Title>
            <Accordion.Content active={this.state.openLocalisation}>
              {localisation}
            </Accordion.Content>
          </Accordion>
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
          <Tarification
            client={this.props.client}
            codActe={this.state.acte.codActe}
            date={this.state.date}
            dynamic={false}
            hidden={true}
            success={this.successTarification}
            error={this.errorTarification}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button 
            content="Annuler"
            onClick={this.onClose}
          />
          <Button 
            content="Valider"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
