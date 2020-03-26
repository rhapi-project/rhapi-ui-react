import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Icon, Table } from "semantic-ui-react";
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
    actions:
      "Tableau d'objet contenant des actions à effectuer (en plus des actions par défaut)",
    showAction:
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
    showAction: PropTypes.bool,
    showCheckbox: PropTypes.bool
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
    actions: [],
    showAction: true,
    showCheckbox: false
  };

  state = {
    documentsSelected: [],
    checkedAll: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        checkedAll: false
      });
    }
  }

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

    this.setState({
      documentsSelected: documentsSelected,
      checkedAll:
        _.size(documentsSelected) === _.size(this.props.documents)
          ? true
          : false
    });
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

    this.setState({
      documentsSelected: documentsSelected,
      checkedAll:
        _.size(documentsSelected) === _.size(this.props.documents)
          ? true
          : false
    });
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
              {this.props.showAction ? (
                <Table.HeaderCell collapsing={true}>Action</Table.HeaderCell>
              ) : (
                <React.Fragment />
              )}
              {this.props.showCheckbox ? (
                <Table.HeaderCell collapsing={true}>
                  <Checkbox
                    checked={this.state.checkedAll}
                    onClick={() => {
                      if (this.state.checkedAll) {
                        this.setState({
                          documentsSelected: [],
                          checkedAll: false
                        });
                        return;
                      }

                      let documentsSelected = [];

                      _.map(this.props.documents, document => {
                        documentsSelected.push(document.id);
                      });

                      if (this.props.onSelectionChange) {
                        this.props.onSelectionChange(documentsSelected);
                      }

                      this.setState({
                        documentsSelected: documentsSelected,
                        checkedAll: true
                      });
                    }}
                  />
                </Table.HeaderCell>
              ) : (
                <React.Fragment />
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.props.documents, (document, index) => {
              let rowSelected = _.includes(
                this.state.documentsSelected,
                document.id
              );

              let actions = this.props.actions;

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
                    {this.props.showAction ? (
                      <Table.Cell>
                        <Actions
                          actions={actions}
                          id={document.id}
                          dropdown={dropdown}
                        />
                      </Table.Cell>
                    ) : (
                      <React.Fragment />
                    )}
                    {this.props.showCheckbox ? (
                      <Table.Cell>
                        <Checkbox checked={rowSelected} />
                      </Table.Cell>
                    ) : (
                      <React.Fragment />
                    )}
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
