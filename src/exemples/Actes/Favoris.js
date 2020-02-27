import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "../../Components";
import { Button, Divider, Table } from "semantic-ui-react";

import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesFavoris extends React.Component {
  state = {
    openFavoris: false,
    actes: []
  };

  render() {
    return (
      <React.Fragment>
        <p>Lecture et configuration des actes stockés dans les favoris</p>
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
          onSelection={(index, actes) => this.setState({ actes: actes })}
        />
        <Divider hidden={true} />
        {_.map(this.state.actes, acte => (
          <Acte key={acte.code} acte={acte} />
        ))}
      </React.Fragment>
    );
  }
}

class Acte extends React.Component {
  render() {
    return (
      <React.Fragment>
        {_.isEmpty(this.props.acte) ? null : (
          <Table celled={true}>
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing={true}>Description</Table.Cell>
                <Table.Cell>{this.props.acte.description}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Code</Table.Cell>
                <Table.Cell>{this.props.acte.code}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Cotation</Table.Cell>
                <Table.Cell>{this.props.acte.cotation}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Localisation</Table.Cell>
                <Table.Cell>{this.props.acte.localisation}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Modificateurs</Table.Cell>
                <Table.Cell>{this.props.acte.modificateurs}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Qualificatifs</Table.Cell>
                <Table.Cell>{this.props.acte.qualificatifs}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Montant</Table.Cell>
                <Table.Cell>{this.props.acte.montant}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
      </React.Fragment>
    );
  }
}
