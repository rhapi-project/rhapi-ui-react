import React from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Modal, Table } from "semantic-ui-react";
import _ from "lodash";
import moment from "moment";

const propDefs = {
  description:
    "Modal de sélection des actes. Ces actes seront utilisés par exemple pour générer un document.",
  example: "",
  propDocs: {
    idPatient: "identifiant du patient",
    open: "ouverture de la modal",
    onClose: "callback à la fermeture de la modal",
    onDocumentGeneration: "callback de la fin de sélection"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onDocumentGeneration: PropTypes.func
  }
};

export default class ModalSelectActes extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    actes: [],
    selectedActes: [],
    selectedAll: false
  };

  componentDidUpdate(prevProps) {
    if (this.props.open && this.props.open !== prevProps.open) {
      this.loadActes();
    }
  }

  loadActes = () => {
    this.props.client.Actes.readAll(
      {
        q1: "AND,idPatient,Equal," + this.props.idPatient,
        q2: "AND,code,NotLike,#*",
        q3: "AND,etat,Equal,0", // actes en historique
        limit: 1000,
        sort: "modifiedAt",
        order: "DESC"
      },
      actes => {
        let selectedActes = [];
        if (!_.isEmpty(actes.results)) {
          let recentDay = moment(actes.results[0].modifiedAt);
          _.forEach(actes.results, acte => {
            if (
              moment(acte.modifiedAt).get("date") === recentDay.get("date") &&
              moment(acte.modifiedAt).get("month") === recentDay.get("month") &&
              moment(acte.modifiedAt).get("year") === recentDay.get("year")
            ) {
              selectedActes.push(acte.id);
            }
          });
        }
        this.setState({
          actes: actes.results,
          selectedAll: false,
          selectedActes: selectedActes
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  indexOfSelectedActe = idActe => {
    return _.findIndex(this.state.selectedActes, id => id === idActe);
  };

  render() {
    return (
      <React.Fragment>
        <Modal open={this.props.open} size="small">
          <Modal.Header>Sélection des actes</Modal.Header>
          <Modal.Content>
            {!_.isEmpty(this.state.actes) ? (
              <div style={{ overflowY: "auto", height: "400px" }}>
                <Table celled={true} selectable={true}>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell collapsing={true}>
                        Dernière modification
                      </Table.HeaderCell>
                      <Table.HeaderCell collapsing={true}>
                        <Checkbox
                          checked={this.state.selectedAll}
                          onChange={() => {
                            if (this.state.selectedAll) {
                              this.setState({
                                selectedActes: [],
                                selectedAll: false
                              });
                            } else {
                              let selectedActes = [];
                              _.forEach(this.state.actes, acte =>
                                selectedActes.push(acte.id)
                              );
                              this.setState({
                                selectedActes: selectedActes,
                                selectedAll: true
                              });
                            }
                          }}
                        />
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {_.map(this.state.actes, (acte, index) => (
                      <Table.Row
                        key={index}
                        active={this.indexOfSelectedActe(acte.id) !== -1}
                      >
                        <Table.Cell>{acte.description}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {moment(acte.modifiedAt).format("L")}{" "}
                          {moment(acte.modifiedAt).format("LT")}
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox
                            checked={this.indexOfSelectedActe(acte.id) !== -1}
                            onChange={() => {
                              let selectedActes = this.state.selectedActes;
                              let i = this.indexOfSelectedActe(acte.id);
                              if (i === -1) {
                                selectedActes.push(acte.id);
                              } else {
                                selectedActes.splice(i, 1);
                              }
                              this.setState({
                                selectedActes: selectedActes,
                                selectedAll: false
                              });
                            }}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>Aucun acte</div>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
            <Button
              disabled={_.isEmpty(this.state.selectedActes)}
              content="Générer un document"
              onClick={() => {
                if (this.props.onDocumentGeneration) {
                  this.props.onDocumentGeneration(this.state.selectedActes);
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
