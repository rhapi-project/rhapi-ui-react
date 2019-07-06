import React from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  Modal,
  Table
} from "semantic-ui-react";
import Search2 from "../CCAM/Search";
import Table2 from "../CCAM/Table";
//import Montant from "../Shared/Montant";
import _ from "lodash";

import { tarif } from "../lib/Helpers";

const propDefs = {
  description:
    "Modal Semantic de lecture et de configuration des actes favoris",
  example: "Favoris",
  propDocs: {
    index:
      "Indice de la ligne (dans la grille de saisie des actes) à partir de laquelle le composant Actes.Favoris a été appelé.",
    open: "Ouverture de la modal",
    onClose: "Callback à la fermeture de la modal",
    onSelection:
      "Callback à la selection et validation d'un acte. Cette fonction prend en 1er " +
      "paramètre l'indice de la ligne et en 2ème paramètre l'objet acte sélectionné."
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    index: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelection: PropTypes.func
  }
};

export default class Favoris extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    actes: [],
    configuration: false,
    favoris: {},
    selectedIndex: null
  };

  componentWillMount() {
    // faire la requête ici pour la lecture des actes favoris
    this.props.client.Configuration.read(
      "actesFavoris",
      result => {
        this.setState({ favoris: result });
      },
      error => {
        console.log(error);
      }
    );
  }
  componentWillReceiveProps(next) {
    // faire l'ouverture de la modal
  }

  renderChapitre = (chapitre, level) => {
    let active = chapitre.active;
    return (
      <Accordion
        key={chapitre.titre + Math.random() /* unique key */}
        style={{ marginLeft: level, marginTop: 0, marginBottom: 0 }}
      >
        <Accordion.Title
          active={active}
          onClick={(e, d) => {
            // Pour Divin :
            // - chapitre est une référence à this.state.favoris[le-chapitre-concerné]
            // - toute modification sur chapitre est une modification sur this.state.favoris[le-chapitre-concerné]
            // - il faudra simplement penser à ne pas sauvegarder les valeurs 'active' présentes
            //   dans l'objet favoris, lors de sa validation vers configuration (faire des _unset)
            // !!! Commentaire à supprimer une fois lu !!!
            chapitre.active = !active;
            this.setState({}); // force a new render
          }}
        >
          <Icon name="dropdown" />
          <b>{chapitre.titre ? chapitre.titre : "FAVORIS"}</b>
        </Accordion.Title>
        <Accordion.Content active={active}>
          {_.map(chapitre.chapitres, (chapitre, key) => {
            return this.renderChapitre(chapitre, level + 10); // indentation de 10 px
          })}
          <Table
            basic="very"
            style={{ marginLeft: 22 }} // alignement du texte (largeur de l'icône dropdown du titre)
            size="small"
            selectable={true}
          >
            <Table.Body>
              {_.map(chapitre.actes, (acte, key) => (
                <Acte
                  key={key}
                  index={key}
                  code={acte.code}
                  cotation={acte.cotation}
                  configuration={this.state.configuration}
                  description={acte.description}
                  montant={acte.montant}
                  /*onSelection={index =>
                    this.setState({ selectedIndex: index })
                  }*/
                  //selected={i === this.state.selectedIndex}
                />
              ))}
            </Table.Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    );
  };

  render() {
    let open = this.props.open ? this.props.open : false;
    let actes = [
      {
        code: "HBJD001",
        description: "Détartrage",
        cotation: 1,
        montant: 28.92
      },
      { code: "C", description: "Consultation", cotation: 1, montant: 23 },
      {
        code: "HBJD002",
        description: "Acte exemple 2",
        cotation: 1,
        montant: 50.45
      },
      {
        code: "HBJD003",
        description: "Acte exemple 3",
        cotation: 1,
        montant: 50.45
      },
      {
        code: "HBJD004",
        description: "Acte exemple 4",
        cotation: 1,
        montant: 50.45
      },
      {
        code: "HBJD005",
        description: "Acte exemple 5",
        cotation: 1,
        montant: 50.45
      },
      {
        code: "HBJD006",
        description: "Un acte CCAM comme exemple",
        cotation: 1,
        montant: 50.45
      },
      {
        code: "HBJD007",
        description: "Description d'un acte à titre d'exemple",
        cotation: 1,
        montant: 100.74
      }
    ];

    let selectedActe = _.isNull(this.state.selectedIndex)
      ? {}
      : actes[this.state.selectedIndex];
    let edition = !_.isEmpty(selectedActe) && this.state.configuration;

    return (
      <React.Fragment>
        <Modal open={open} size="small">
          <Modal.Content style={{ height: "450px", overflow: "auto" }}>
            {edition ? (
              <Edit client={this.props.client} />
            ) : (
              <div>
                {!_.isEmpty(this.state.favoris) ? (
                  <div>{this.renderChapitre(this.state.favoris, 0)}</div>
                ) : null}
              </div>
            )}
          </Modal.Content>
          {this.state.configuration ? (
            <Modal.Actions>
              <Button content="Ajouter un chapitre" />
              <Button content="Ajouter un acte" />
              <Button content="Supprimer un acte" />
            </Modal.Actions>
          ) : null}
          <Modal.Actions>
            <Checkbox
              style={{ float: "left" }}
              label="Mode configuration"
              checked={this.state.configuration}
              onChange={() =>
                this.setState({
                  configuration: !this.state.configuration,
                  selectedIndex: null
                })
              }
              toggle={true}
            />
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
            <Button
              content="Valider"
              onClick={() => {
                if (this.props.onSelection) {
                  this.props.onSelection(this.props.index, selectedActe);
                }
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

class Chapitre extends React.Component {
  static defaultProps = {
    chapitre: {},
    level: 0
  };
  render() {
    return (
      <React.Fragment>
        {!_.isEmpty(this.props.chapitre) ? "" : null}
        <Table.Row>
          <Table.Cell collapsing={true}>
            <Icon name="triangle right" />
          </Table.Cell>
          <Table.Cell textAlign="left">
            <strong>{this.props.chapitre.titre}</strong>
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  }
}

class Acte extends React.Component {
  static defaultProps = {
    code: "",
    cotation: 1,
    description: "",
    index: 0,
    montant: 0,
    selected: false /*,
    configuration: false*/
  };
  render() {
    return (
      <React.Fragment>
        <Table.Row
          onClick={() => {
            if (this.props.onSelection) {
              this.props.onSelection(this.props.index);
            }
          }}
          style={{
            //padding: 0,
            backgroundColor: this.props.selected ? "#E88615" : "inherit",
            color: this.props.selected ? "white" : "black"
          }}
        >
          <Table.Cell>{this.props.description}</Table.Cell>
          <Table.Cell
            collapsing={true}
            textAlign="center"
            style={{ minWidth: "90px" }}
          >
            {this.props.code}
          </Table.Cell>
          <Table.Cell collapsing={true} textAlign="center">
            {this.props.cotation}
          </Table.Cell>
          <Table.Cell
            collapsing={true}
            textAlign="right"
            style={{ minWidth: "80px" }}
          >
            {tarif(this.props.montant)}
          </Table.Cell>
        </Table.Row>
      </React.Fragment>
    );
  }
}

class Edit extends React.Component {
  componentWillMount() {
    this.setState({
      acte: {},
      actes: [],
      cotation: 1,
      informations: {}
    });
  }
  render() {
    return (
      <React.Fragment>
        {/*<Form unstackable={true}>
          <Form.Group widths="equal">
            <Form.Input label="Description" />
          </Form.Group>
          <Form.Group>
            <Form.Input label="CCAM">
              <Search2
                client={this.props.client}
                limit={5}
                onLoadActes={obj =>
                  this.setState({
                    actes: obj.results,
                    acte: {},
                    informations: obj.informations
                  })
                }
              />
            </Form.Input>
            <Form.Dropdown
              label="Code"
              placeholder="Code de l'acte"
              search={true}
              selection={true}
              options={[]}
              noResultsMessage="Aucun acte trouvé"
            />
          </Form.Group>
        </Form>
        <Table2
          client={this.props.client}
          actes={this.state.actes}
          informations={this.state.informations}
          onPageSelect={obj =>
            this.setState({
              actes: obj.actes,
              informations: obj.informations
            })
          }
          onSelection={acte => {}}
          table={{ celled: true, style: { width: "100%" } }}
          showPagination={true}
        />*/}
      </React.Fragment>
    );
  }
}
