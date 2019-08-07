import React from "react";
import { Client } from "rhapi-client";
import { Actes, Shared} from "rhapi-ui-react";
import { Button, Divider, Form, Icon } from "semantic-ui-react";

import moment from "moment";

// Instanciation du client RHAPI sans authentification
const client = new Client("https://demo.rhapi.net/demo01");
const patients = [
  { text: "Aucun patient", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 },
  { text: "5", value: 5 },
  { text: "6", value: 6 },
  { text: "7", value: 7 },
  { text: "8", value: 8 },
]

export default class ActesHistorique extends React.Component {
  componentWillMount() {
    this.setState({
      idPatient : 1,
      id: 0,
      localisation: "",
      openLocalisations: false,
      startAt: "",
      endAt: "",
      open: false,
      type: "",
      acte: []
    });
  }

  onPatientChange = id => {
    this.setState({ idPatient: id });
  };

  onActeClick = id => {
    // l'id de l'acte en paramètre
    console.log(`onActeClick ${id}`);
  }

  onActeDoubleClick = id => {
    // l'id de l'acte en paramètre
    console.log(`onActeDoubleClick ${id}`);
  }

  onSelectionChange = ids => {
    // array des id des actes en paramètre
    let actes = ids.join(",");
    console.log(`onSelectionChange ${actes}`);
  }

  onEditActeClick = id => {
    // l'id de l'acte en paramètre
    console.log(`onEditActeClick ${id}`);
  }

  onAction = (id, action) => {
    // l'id de l'acte et l'action passés en paramètres
    if (action === "Autre action") {
      console.log(`${id} - Action : ${action}`);
    }
  };

  close = () => {
    this.setState({ openLocalisations: false });
  };

  onOpen = (type) => {
    this.setState({
      id: 0, 
      open: true,
      type: type
    });
  };

  render() {
    let iconNote = (
      <Icon name="sticky note outline" />
    );

    let iconTodo = (
      <Icon name="list" />
    );

    return (
      <React.Fragment>
        <p>
          Utilisation du composant <b>Actes.Historique</b> pour l'historique des actes d'un patient.
        </p>
        <Divider hidden={true} />
        <Form>
          <Form.Dropdown
            width={2}
            label="ID du patient"
            placeholder="Sélectionner un patient"
            selection={true}
            options={patients}
            onChange={(e, d) => this.onPatientChange(d.value)}
            value={this.state.idPatient}
          />
          <Form.Group>
            <Shared.Periode
              labelDate="Période"
              labelYear="&nbsp;"
              startYear={2015}
              onPeriodeChange={(startAt, endAt) => {
                if (startAt && endAt) {
                  console.log("Du : " + moment(startAt).format("LLL"));
                  console.log("Au : " + moment(endAt).format("LLL"));
                  this.setState({
                    startAt: startAt,
                    endAt: endAt
                  });
                } else {
                  console.log("Durée indéterminée");
                  this.setState({
                    startAt: "",
                    endAt: ""
                  });
                }
              }}
            />
            <Form.Input
              label="Localisation"
              width={5}
              placeholder="Localisation"
              onClick={() => this.setState({ openLocalisations: true })}
              value={this.state.localisation}
            />
          </Form.Group>
          <Button
            animated
            size="large"
            color="yellow"
            onClick={() => this.onOpen("note")}
          >
            <Button.Content visible={true}>{iconNote}</Button.Content>
            <Button.Content hidden={true}>Note</Button.Content>
          </Button>
          <Button
            animated
            size="large"
            color="red"
            onClick={() => this.onOpen("todo")}
          >
            <Button.Content visible={true}>{iconTodo}</Button.Content>
            <Button.Content hidden={true}>Todo</Button.Content>
          </Button>
        </Form>
        <Divider hidden={true} />
        <Shared.Localisations 
          dents={this.state.localisation}
          onSelection={localisation => {
            this.setState({ localisation: localisation });
          }}
          modal={{
            size: "large",
            open: this.state.openLocalisations,
            onClose: this.close
          }}
        />
        <Divider hidden={true} />
        <Actes.Historique
          client={client}
          idPatient={this.state.idPatient}
          id={this.state.id}
          onActeClick={this.onActeClick}
          onActeDoubleClick={this.onActeDoubleClick}
          onSelectionChange={this.onSelectionChange}
          onEditActeClick={this.onEditActeClick}
          limit={20}
          actions={[
            {
              icon: "question circle",
              text: "Autre action",
              action: (id) => this.onAction(id,"Autre action")
            }
          ]}
          localisation={this.state.localisation}
          startAt={this.state.startAt}
          endAt={this.state.endAt}
          openNoteTodo={this.state.open}
          typeNoteTodo={this.state.type}
          onOpenNoteTodo={(id, type) => {
            this.setState({
              id: id,
              open: true,
              type: type
            });
          }}
          onCloseNoteTodo={() => {
            this.setState({ 
              open: false,
              type: ""
            });
          }}
        />
      </React.Fragment>
    );
  }
}