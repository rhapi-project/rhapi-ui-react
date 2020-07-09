import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Icon, Table } from "semantic-ui-react";
import _ from "lodash";
import moment from "moment";
import Actions from "../Shared/Actions";
import { codesDocs } from "../lib/Helpers";

const propDefs = {
  description:
    "Tableau contenant la liste des documents d'un patient (ou modèles de documents)",
  example: "Tableau",
  propDocs: {
    documents: "liste de documents",
    onDocumentClick: "Retourne en paramètre l'id d'un document sur un click",
    onDocumentDoubleClick:
      "Retourne en paramètre l'id d'un document sur un double click",
    onSelectionChange:
      "Retourne en paramètre la liste des id des documents sélectionnés (multi-sélection possible par CTRL+click)",
    actions:
      "Tableau d'objet contenant des actions à effectuer (en plus des actions par défaut)",
    showActions:
      "Permet d'afficher la colonne des actions. Par défaut, showAction prend la valeur true",
    showCheckbox:
      "Permet d'afficher la colonne de sélection (Checkbox). Par défaut, showCheckbox prend la valeur false"
  },
  propTypes: {
    documents: PropTypes.array,
    onDocumentClick: PropTypes.func,
    onDocumentDoubleClick: PropTypes.func,
    onSelectionChange: PropTypes.func,
    actions: PropTypes.array,
    showActions: PropTypes.bool,
    showCheckbox: PropTypes.bool
  }
};

export default class ListeDocument extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    documents: [],
    actions: [],
    showActions: true,
    showCheckbox: false
  };

  state = {
    documentsSelected: [],
    selectedAll: false
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.documents, this.props.documents)) {
      this.setState({
        selectedAll: false
      });
    }
  }

  onDocumentClick = (e, doc) => {
    if (_.findIndex(this.state.documentsSelected, id => id === doc.id) === -1) {
      let ds = [doc.id];
      this.setState({
        documentsSelected: ds,
        selectedAll: false
      });
      if (this.props.onDocumentClick) {
        this.props.onDocumentClick(doc.id);
      }
      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(ds);
      }
    }
  };

  onDocumentDoubleClick = (e, doc) => {
    this.setState({
      documentsSelected: [doc.id],
      selectedAll: false
    });
    if (this.props.onDocumentDoubleClick) {
      this.props.onDocumentDoubleClick(doc.id);
    }
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange([doc.id]);
    }
  };

  selectAll = () => {
    let ds = [];
    _.forEach(this.props.documents, doc => ds.push(doc.id));
    this.setState({
      selectedAll: true,
      documentsSelected: ds
    });
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(ds);
    }
  };

  unselectAll = () => {
    this.setState({
      selectedAll: false,
      documentsSelected: []
    });
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange([]);
    }
  };

  render() {
    if (_.isEmpty(this.props.documents)) {
      return null;
    }

    return (
      <React.Fragment>
        <Table celled={true} selectable={true}>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>Nom</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>
                Dernière modification
              </Table.HeaderCell>
              {this.props.showActions ? (
                <Table.HeaderCell collapsing={true}>Action</Table.HeaderCell>
              ) : null}
              {this.props.showCheckbox ? (
                <Table.HeaderCell collapsing={true}>
                  <Checkbox
                    checked={this.state.selectedAll}
                    onClick={() => {
                      if (this.state.selectedAll) {
                        this.unselectAll();
                      } else {
                        this.selectAll();
                      }
                    }}
                  />
                </Table.HeaderCell>
              ) : null}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {_.map(this.props.documents, (document, index) => (
              <Ligne
                key={index}
                document={document}
                selected={
                  _.findIndex(
                    this.state.documentsSelected,
                    id => id === document.id
                  ) !== -1
                }
                actions={this.props.actions}
                showActions={this.props.showActions}
                showCheckbox={this.props.showCheckbox}
                onLineClick={this.onDocumentClick}
                onLineDoubleClick={this.onDocumentDoubleClick}
                onChangeCheckbox={() => {
                  let ds = this.state.documentsSelected;
                  let i = _.findIndex(ds, id => document.id === id);
                  if (i === -1) {
                    ds.push(document.id);
                    this.setState({ documentsSelected: ds });
                  } else {
                    ds.splice(i, 1);
                    this.setState({
                      selectedAll: false,
                      documentsSelected: ds
                    });
                  }
                  if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(ds);
                  }
                }}
              />
            ))}
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

class Ligne extends React.Component {
  timeout = null; // gestion du double clic

  onLineClick = e => {
    e.preventDefault();
    e.persist();
    if (this.timeout === null) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.props.onLineClick(e, this.props.document);
      }, 300);
    }
  };

  onLineDoubleClick = e => {
    e.preventDefault();
    clearTimeout(this.timeout);
    this.timeout = null;
    this.props.onLineDoubleClick(e, this.props.document);
  };

  render() {
    return (
      <React.Fragment>
        <Table.Row active={this.props.selected}>
          <Table.Cell
            onClick={this.onLineClick}
            onDoubleClick={this.onLineDoubleClick}
          >
            <Icon
              name={
                codesDocs[
                  _.findIndex(
                    codesDocs,
                    i => this.props.document.mimeType === i.mimeType
                  ) !== -1
                    ? _.findIndex(
                        codesDocs,
                        i => this.props.document.mimeType === i.mimeType
                      )
                    : _.findIndex(codesDocs, i => i.mimeType === "default")
                ].icon
              }
            />
            {this.props.document.fileName}
          </Table.Cell>
          <Table.Cell
            onClick={this.onLineClick}
            onDoubleClick={this.onLineDoubleClick}
            style={{ textAlign: "center" }}
          >
            {
              codesDocs[
                _.findIndex(
                  codesDocs,
                  i => this.props.document.mimeType === i.mimeType
                ) !== -1
                  ? _.findIndex(
                      codesDocs,
                      i => this.props.document.mimeType === i.mimeType
                    )
                  : _.findIndex(codesDocs, i => i.mimeType === "default")
              ].type
            }
          </Table.Cell>
          <Table.Cell
            onClick={this.onLineClick}
            onDoubleClick={this.onLineDoubleClick}
            style={{ textAlign: "center" }}
          >
            {moment(this.props.document.modifiedAt).format("L")}{" "}
            {moment(this.props.document.modifiedAt).format("LT")}
          </Table.Cell>
          {this.props.showActions ? (
            <Table.Cell>
              <Actions
                actions={this.props.actions}
                id={this.props.document.id}
                dropdown={{ direction: "left" }}
              />
            </Table.Cell>
          ) : null}
          {this.props.showCheckbox ? (
            <Table.Cell onClick={() => {}}>
              <Checkbox
                checked={this.props.selected}
                onChange={this.props.onChangeCheckbox}
              />
            </Table.Cell>
          ) : null}
        </Table.Row>
      </React.Fragment>
    );
  }
}
