import React from "react";
import PropTypes from "prop-types";
import { Icon, Table } from "semantic-ui-react";
import _ from "lodash";
import moment from "moment";
import Actions from "../Shared/Actions";
import { codesDocs } from "../lib/Helpers";

const propDefs = {
  description: "Liste des documents d'un patient",
  example: "Tableau",
  propDocs: {
    documents: "liste de documents",
    onDocumentClick: "Retourne en paramètre l'id d'un document sur un click",
    onDocumentDoubleClick:
      "Retourne en paramètre l'id d'un document sur un double click",
    onSelectionChange:
      "Retourne en paramètre la liste des id des documents sélectionnés (multi-sélection possible par CTRL+click)",
    onActionClick: "Retourne en paramètre l'id et l'action d'un document",
    actions:
      "Tableau d'objet contenant des actions à effectuer (en plus des actions par défaut)"
  },
  propTypes: {
    documents: PropTypes.array,
    onDocumentClick: PropTypes.func,
    onDocumentDoubleClick: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onActionClick: PropTypes.func,
    actions: PropTypes.array
  }
};

export default class ListeDocument extends React.Component {
  // variable utilisé pour éviter le click lors d'un double click
  timeout = null;
  // variables utilisées pour la multi-sélection avec la touche 'shift'
  firstClick = "";
  secondClick = "";

  static propTypes = propDefs.propTypes;
  static defaultProps = {
    documents: [],
    actions: []
  };

  state = {
    documentsSelected: []
  };

  onClick = (id, action) => {
    if (this.props.onActionClick) {
      this.props.onActionClick(id, action);
    }
  };

  onDocumentClick = (e, document) => {
    let id = document.id;
    let documentsSelected = [];

    if (e.ctrlKey || e.metaKey) {
      documentsSelected = this.state.documentsSelected;
      if (_.includes(documentsSelected, id)) {
        documentsSelected.splice(_.indexOf(documentsSelected, id), 1);
      } else {
        documentsSelected.push(id);
      }
    } else if (e.shiftKey) {
      this.secondClick = id;
      let first = _.findIndex(
        this.props.documents,
        document => document.id === this.firstClick
      );
      let last = _.findIndex(
        this.props.documents,
        document => document.id === this.secondClick
      );

      // Permutation entre first et last si le "secondClick" est situé au-dessus du "firstClick"
      if (first > last) {
        let tmp = first;
        first = last;
        last = tmp;
      }

      for (let i = first; i <= last; i++) {
        documentsSelected.push(this.props.documents[i].id);
      }
    } else {
      documentsSelected.push(id);
      this.firstClick = id;
    }

    if (this.props.onDocumentClick) {
      this.props.onDocumentClick(id);
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(documentsSelected);
    }

    this.setState({ documentsSelected: documentsSelected });
  };

  onDocumentDoubleClick = (e, document) => {
    let documentsSelected = [];
    let id = document.id;

    documentsSelected.push(id);

    if (this.props.onDocumentDoubleClick) {
      this.props.onDocumentDoubleClick(id);
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(documentsSelected);
    }

    this.setState({ documentsSelected: documentsSelected });
  };

  render() {
    let dropdown = {
      direction: "left"
    };

    if (_.isEmpty(this.props.documents)) {
      return null;
    }

    return (
      <React.Fragment>
        <Table celled={true} striped={false} selectable={true} sortable={true}>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>Nom</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>
                Dernière modification
              </Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.props.documents, (document, index) => {
              let rowSelected = _.includes(
                this.state.documentsSelected,
                document.id
              );

              let actions = [
                {
                  icon: "trash",
                  text: "Supprimer",
                  action: id => this.onClick(id, "supprimer")
                }
              ];

              // Ajout des actions (props)
              if (this.props.actions) {
                actions = _.concat(actions, this.props.actions);
              }

              return (
                <React.Fragment key={index}>
                  <Table.Row
                    onClick={e => {
                      e.preventDefault();
                      e.persist();
                      if (this.timeout === null) {
                        this.timeout = setTimeout(() => {
                          this.timeout = null;
                          this.onDocumentClick(e, document);
                        }, 300);
                      }
                    }}
                    onDoubleClick={e => {
                      e.preventDefault();
                      clearTimeout(this.timeout);
                      this.timeout = null;
                      this.onDocumentDoubleClick(e, document);
                    }}
                    active={rowSelected}
                  >
                    <Table.Cell>
                      <Icon
                        name={
                          codesDocs[
                            _.findIndex(
                              codesDocs,
                              i => document.mimeType === i.mimeType
                            ) !== -1
                              ? _.findIndex(
                                  codesDocs,
                                  i => document.mimeType === i.mimeType
                                )
                              : _.findIndex(
                                  codesDocs,
                                  i => i.mimeType === "default"
                                )
                          ].icon
                        }
                      />
                      {document.fileName}
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      {
                        codesDocs[
                          _.findIndex(
                            codesDocs,
                            i => document.mimeType === i.mimeType
                          ) !== -1
                            ? _.findIndex(
                                codesDocs,
                                i => document.mimeType === i.mimeType
                              )
                            : _.findIndex(
                                codesDocs,
                                i => i.mimeType === "default"
                              )
                        ].type
                      }
                    </Table.Cell>
                    <Table.Cell style={{ textAlign: "center" }}>
                      {moment(document.modifiedAt).format("L")}{" "}
                      {moment(document.modifiedAt).format("LT")}
                    </Table.Cell>
                    <Table.Cell>
                      <Actions
                        actions={actions}
                        id={document.id}
                        dropdown={dropdown}
                      />
                    </Table.Cell>
                  </Table.Row>
                </React.Fragment>
              );
            })}
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}
