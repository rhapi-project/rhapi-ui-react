import React from "react";
import PropTypes from "prop-types";
import { Button, Message, Modal, Table } from "semantic-ui-react";
import SaisieDentaire from "./SaisieDentaire";
import _ from "lodash";

import moment from "moment";

const propDefs = {
  description: "Tableau de saisie des actes pour les dentistes",
  example: "Tableau",
  propDocs: {
    idActe: "Identifiant de l'acte principal",
    lignes: "Nombre de lignes à afficher pour ce tableau. Par défaut 5",
    onError: "Callback en cas d'erreur"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idActe: PropTypes.any.isRequired,
    lignes: PropTypes.number,
    onError: PropTypes.func
  }
};

export default class Saisie extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    lignes: 5
  };

  state = {
    fse: {}
  };

  componentWillMount() {
    if (this.props.idActe) {
      this.reload(this.props.idActe);
    }
  }

  componentWillReceiveProps(next) {
    if (next.idActe) {
      this.reload(next.idActe);
    }
  }

  reload = idActe => {
    this.props.client.Actes.read(
      idActe,
      {},
      result => {
        this.setState({
          fse: result,
          actes: _.get(result, "contentJO.actes", []),
          activeRow: _.get(result, "contentJO.actes", []).length,
          error: 0
        });
      },
      error => {
        console.log(error);
        this.setState({ fse: {} });
      }
    );
  };

  existActe = index => {
    return !_.isUndefined(this.state.actes[index]);
  };

  onSelectionActe = (rowKey, acte, date, localisation, cotation, tarif) => {
    this.props.client.Actes.read(
      this.props.idActe,
      {},
      result => {
        if (result.etat === 0) {
          this.setState({ error: 1 });
          return;
        }
        if (result.lockRevision === this.state.fse.lockRevision) {
          let obj = {};
          obj.code = acte.codActe;
          obj.date = date;
          obj.localisation = localisation;
          obj.cotation = cotation;
          obj.description = acte.nomLong;
          obj.montant = tarif.pu;
          let actes = this.state.actes;
          if (rowKey === this.state.activeRow) {
            actes.push(obj);
            this.update(actes);
          } else {
            if (
              _.isEqual(acte.codActe, actes[rowKey].code) &&
              _.isEqual(date, actes[rowKey].date) &&
              _.isEqual(localisation, actes[rowKey].localisation) &&
              _.isEqual(tarif.pu, actes[rowKey].montant)
            ) {
              return;
            }
            actes[rowKey] = obj;
            this.update(actes);
          }
        } else {
          this.setState({ error: 2 });
        }
      },
      error => {
        // peut-être que l'acte a été déjà supprimé
        console.log(error);
        this.setState({ error: 3 });
      }
    );
  };

  update = actes => {
    let obj = {};
    obj.actes = actes;
    this.props.client.Actes.update(
      this.props.idActe,
      { contentJO: obj, montant: _.sumBy(actes, "montant") },
      result => {
        this.setState({
          fse: result,
          actes: _.get(result, "contentJO.actes", []),
          activeRow: _.get(result, "contentJO.actes", []).length,
          error: 0
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    if (!_.isEmpty(this.state.fse)) {
      return (
        <React.Fragment>
          <Table celled={true} striped={true} selectable={true}>
            <Table.Header>
              <Table.Row textAlign="center">
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Localisation</Table.HeaderCell>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Cotation</Table.HeaderCell>
                <Table.HeaderCell>Libellé</Table.HeaderCell>
                <Table.HeaderCell>Modificateurs</Table.HeaderCell>
                <Table.HeaderCell>Montant</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.times(this.props.lignes, i => (
                <SaisieDentaire
                  key={i}
                  index={i}
                  client={this.props.client}
                  code={this.existActe(i) ? this.state.actes[i].code : ""}
                  cotation={
                    this.existActe(i) ? this.state.actes[i].cotation : 1
                  }
                  date={
                    this.existActe(i)
                      ? this.state.actes[i].date
                      : moment().toISOString()
                  }
                  description={
                    this.existActe(i) ? this.state.actes[i].description : ""
                  }
                  localisation={
                    this.existActe(i) ? this.state.actes[i].localisation : ""
                  }
                  montant={this.existActe(i) ? this.state.actes[i].montant : 0}
                  disabled={this.state.activeRow < i}
                  onSelectionActe={this.onSelectionActe}
                />
              ))}
            </Table.Body>
          </Table>
          <Modal size="mini" open={this.state.error !== 0}>
            <Modal.Header>Mise à jour de l'acte</Modal.Header>
            <Modal.Content>
              <Message warning={true}>
                {this.state.error === 1
                  ? "Cet acte a déjà été validé. Vous ne pouvez pas faire de modifications !"
                  : this.state.error === 2
                  ? "Des modifications ont été apportées à cet acte. Voulez-vous la recharger et continuer ?"
                  : this.state.error === 3
                  ? "Une erreur est survenue au moment de la lecture de cette acte. Les modifications n'ont pas été prises en compte !"
                  : ""}
              </Message>
            </Modal.Content>
            <Modal.Actions>
              {this.state.error === 1 || this.state.error === 3 ? (
                <Button
                  content="OK"
                  onClick={() => {
                    this.setState({ error: 0, fse: {} });
                    if (!_.isUndefined(this.props.onError)) {
                      this.props.onError();
                    }
                  }}
                />
              ) : this.state.error === 2 ? (
                <Button
                  content="Recharger"
                  onClick={() => {
                    this.reload(this.state.fse.id);
                  }}
                />
              ) : null}
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}
