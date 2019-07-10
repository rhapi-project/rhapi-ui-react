import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Button, Divider, Table } from "semantic-ui-react";

import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesFavoris extends React.Component {
  componentWillMount() {
    this.setState({
      openFavoris: false,
      selectedActe: {}
    });
  };
  render() {
    return (
      <React.Fragment>
        <p>
          Lecture et configuration des actes stockés dans les favoris
        </p>
        <Divider hidden={true} />
        <Button 
          content="Ouvrir les favoris"
          onClick={() => this.setState({ openFavoris: true })}
        />
        <Actes.Favoris
          client={client}
          codGrille={13} // chirurgiens-dentistes - par défaut c'est à 0
          open={this.state.openFavoris}
          onClose={() => this.setState({ openFavoris: false })}
          onSelection={(index, acte) => this.setState({ selectedActe: acte })}
        />
        <Divider hidden={true} />
        {!_.isEmpty(this.state.selectedActe)
          ? <Table celled={true}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing={true}>Description</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.description}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Code</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.code}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Cotation</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.cotation}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Localisation</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.localisation}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Modificateurs</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.modificateurs}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Qualificatifs</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.qualificatifs}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Montant</Table.Cell>
                  <Table.Cell>{this.state.selectedActe.montant}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          : null
        }
      </React.Fragment>
    )
  }
}