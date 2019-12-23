import React from "react";

import { Client } from "rhapi-client";
import { Actes, Shared } from "rhapi-ui-react";

import { Button, Divider, Icon, Label, Table } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesNote extends React.Component {
  state = {
    id: 0,
    open: false,
    type: "",
    acte: []
  };

  onOpen = type => {
    this.setState({
      id: 0,
      open: true,
      type: type
    });
  };

  onEdit = (id, type) => {
    let newType = _.lowerCase(_.trimStart(type,'#'));

    this.setState({
      id: id,
      open: true,
      type: newType //note ou todo
    });
  }

  onCreate = (acte) => {
    let newActe = this.state.acte;
    newActe.push(acte);

    this.setState({ 
      open: false, 
      type: "",
      acte: newActe
    });
  };

  onUpdate = (newActe) => {
    let currentActes = this.state.acte;
    let index = _.findIndex(currentActes, acte => (acte.id === newActe.id && acte.lockRevision < newActe.lockRevision));

    currentActes[index] = newActe;

    this.setState({ 
      open: false, 
      type: "",
      acte: currentActes
    });
  }

  onClose = (bool, type) => {
    this.setState({ 
      open: bool, 
      type: type
    });
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
    let iconNote = (
      <Icon
        name="sticky note outline"
        size="large"
      />
    );

    let iconTodo = (
      <Icon
        name="list"
        size="large"
      />
    );

    let dropdown = {
      direction: "left"
    };

    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Note</b> pour ajouter de nouvelles notes ou "Todo".
        </p>
        <Divider hidden={true} />
        <Button
          animated
          size="big"
          color="yellow"
          onClick={() => this.onOpen("note")}
        >
          <Button.Content visible={true}>{iconNote}</Button.Content>
          <Button.Content hidden={true}>Note</Button.Content>
        </Button>
        <Button
          animated
          size="big"
          color="red"
          onClick={() => this.onOpen("todo")}
        >
          <Button.Content visible={true}>{iconTodo}</Button.Content>
          <Button.Content hidden={true}>Todo</Button.Content>
        </Button>
        <Divider hidden={true} />
        {
          (this.state.acte.length !== 0)?(
            <Table celled={true} striped={false} selectable={false} sortable={true}>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell collapsing={true}>Date</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Localisation</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Code/Type</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Cotation</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Montant</Table.HeaderCell>
                  <Table.HeaderCell collapsing={true}>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  _.map(this.state.acte, acte => {
                    let deco = this.style(acte);
                    let actions = [
                      {
                        icon: "edit",
                        text: "Editer",
                        action: id => this.onEdit(id, acte.code)
                      }
                    ];

                    return (
                      <React.Fragment key={acte.id}>
                        <Table.Row
                          key={acte.id}
                          style={{
                            backgroundColor: deco.color
                          }}
                        >
                          <Table.Cell>{moment(acte.doneAt).format("L")}</Table.Cell>
                          <Table.Cell>{acte.localisation}</Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>
                            {
                              (acte.couleur === "")?(
                                <Icon name={deco.icon} />
                              ):(
                                <Label circular color={acte.couleur} empty />
                              )
                            }
                            {" " + acte.description}
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>
                            <Shared.Actions
                              actions={actions}
                              id={acte.id}
                              dropdown={dropdown}
                            />
                          </Table.Cell>
                        </Table.Row>
                      </React.Fragment>
                    );
                  })
                }
              </Table.Body>
            </Table>
          ):""
        }
        <Actes.Note 
          client={client}
          id={this.state.id}
          idPatient={1}
          open={this.state.open} 
          type={this.state.type}
          onCreate={this.onCreate}
          onUpdate={this.onUpdate}
          onClose={this.onClose}
        />
      </React.Fragment>
    );
  }
}