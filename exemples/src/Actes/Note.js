import React from "react";

import { Client } from "rhapi-client";
import { Actes } from "rhapi-ui-react";

import { Button, Divider, Icon, Table } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");

export default class ActesNote extends React.Component {
  componentWillMount() {
    this.setState({
      open: false,
      type: "",
      acte: []
    });
  };

  onOpen = (type) => {
    this.setState({ 
      open: true,
      type: type
    });
  };

  onCreate = (acte) => {
    let newActe = this.state.acte;
    newActe.push(acte);

    this.setState({ 
      open: false, 
      type: "",
      acte: newActe
    });
  };

  decoration = code => {
    // code de l'acte passé en paramètre
    let deco = {
      color: "",
      icon: "",
      code: ""
    };

    // Un acte CCAM ou NGAP : fond par défaut sans icône, le code est affiché
    if (!_.startsWith(code, "#")) {
      deco.code = code;
      return deco;
    }

    // Une ligne autre qu'un acte : fond coloré et icône, le code n'est pas affiché
    if (code === "#NOTE") {
      deco.color = "yellow";
      deco.icon = "sticky note outline";
    } else if (code === "#TODO") {
      deco.color = "lightgrey";
      deco.icon = "list";
    } else if (code === "#FSE") {
      deco.color = "lightgreen";
      deco.icon = "check";
    }

    return deco;
  };

  render() {
    let iconNote = (
      <Icon
        name="sticky note outline"
        color="white"
        onClick={() => this.onOpen("note")}
      />
    );

    let iconTodo = (
      <Icon
        name="list"
        color="white"
        onClick={() => this.onOpen("todo")}
      />
    );

    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Note</b> pour ajouter de nouvelles notes ou "Todo".
        </p>
        <Divider hidden={true} />
        <Button
          icon={iconNote}
          size="massive"
          color="yellow"
          onClick={() => this.onOpen("note")}
        />
        <Button
          icon={iconTodo}
          size="massive"
          color="red"
          onClick={() => this.onOpen("todo")}
        />
        <Divider hidden={true} />
        <Actes.Note 
          client={client}
          idPatient={1}
          open={this.state.open} 
          type={this.state.type}
          onCreate={this.onCreate}
        />
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
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  _.map(this.state.acte, acte => {
                    let deco = this.decoration(acte.code);

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
                            {_.isEmpty(deco.icon) ? "" : <Icon name={deco.icon} />}
                            {acte.description}
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                        </Table.Row>
                      </React.Fragment>
                    );
                  })
                }
              </Table.Body>
            </Table>
          ):""
        }
      </React.Fragment>
    );
  }
}