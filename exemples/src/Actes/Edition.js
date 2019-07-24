import React from "react";
import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";
import { Button, Divider, Input, Label, Table } from "semantic-ui-react";

import moment from "moment";
import _ from "lodash";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesEdition extends React.Component {
  componentWillMount(){
    this.setState({
      acte: null,
      id: 0,
      open: false
    })
  }

  displayActe = (id) => {
    if (!id) {
      this.setState({ 
        acte: null,
        id: 0
      });
    } else {
      client.Actes.read(
        id,
        {},
        acte => {
          this.setState({ 
            acte: acte,
            id: acte.id,
            open: false
          });
        },
        error => {
          this.setState({ 
            acte: null,
            id: 0,
            open: false
          });
        }
      )
    }
  }

  tarif = number => {
    return number.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  onEdit = () => {
    this.setState({ open: true });
  }

  onClose = (close) => {
    this.setState({ open: close });
  }

  onUpdate = acte => {
    this.setState({
      acte: acte,
      open: false
    })
  }

  style = (acte) => {
    // code de l'acte passé en paramètre
    let deco = {
      color: "",
      icon: "",
      code: ""
    };

    // Un acte CCAM ou NGAP : fond par défaut sans icône, le code est affiché
    if (!_.startsWith(acte.code, "#")) {
      deco.code = acte.code;
      return deco;
    }

    // Une ligne autre qu'un acte : fond coloré et icône, le code n'est pas affiché
    if (acte.code === "#NOTE") {
      deco.color = "yellow";
      deco.icon = "sticky note outline";
    } else if (acte.code === "#TODO") {
      deco.color = "pink";
      deco.icon = "list";
    } else if (acte.code === "#FSE") {
      deco.color = "lightgreen";
      deco.icon = "check";
    }

    return deco;
  };

  render() {
    let acte = this.state.acte;
    let deco = this.style(acte);

    return (
      <React.Fragment>
        <p>
          Le composant <b>Actes.Edition</b> permet d'éditer un acte validé pour un patient.
        </p>
        <Divider hidden={true} />
        <Input
          focus={true}
          placeholder="Saisir l'id d'un acte"
          onChange={(e,d) => this.displayActe(d.value)}
        />
        <Divider hidden={true} />
        {
          !_.isEmpty(acte)?
          <React.Fragment>
            <Table celled={true} striped={false} selectable={false} sortable={true}>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell
                    sorted={this.state.sorted}
                    onClick={() => this.onSort()}
                    collapsing={true}
                  >
                    Date
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>
                    Localisation
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Code/Type</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Cotation</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Montant</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{moment(acte.doneAt).format("L")}</Table.Cell>
                  <Table.Cell>{acte.localisation}</Table.Cell>
                  <Table.Cell>{acte.code}</Table.Cell>
                  <Table.Cell>
                    {_.isEqual(acte.cotation, 0) ? "" : acte.cotation}
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.tarif(acte.montant)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Divider hidden={true} />
            <Button
              content="Editer"
              color="green"
              size="medium"
              onClick={() => this.onEdit()}
            />
            <Actes.Edition
              client={client}
              id={this.state.id}
              open={this.state.open}
              onClose={this.onClose}
              onUpdate={this.onUpdate}
            />
          </React.Fragment>
        : ""
        }
      </React.Fragment>
    );
  }
}