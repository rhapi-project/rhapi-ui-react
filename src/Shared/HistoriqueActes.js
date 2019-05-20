import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import _ from "lodash";

import moment from "moment";

// TODO : mettre les props nécessaires
//        => dont l'id du patient, le nbre max de lignes par page (si pagination)...
//        documenter le Component
const propDefs = {
  description: "Historique des actes",
  example: "Tableau",
  propDocs: {},
  propTypes: {
    client: PropTypes.any.isRequired
  }
};

export default class HistoriqueActes extends React.Component {
  static propTypes = propDefs.propTypes;

  componentWillMount() {
    this.setState({
      actes: []
    });
    this.props.client.Actes.readAll(
      {}, // TODO : Introduire des filtres (dont le principal est celui du patient),
          // de la pagination, ordonner... Exclure le champ patientJO du résultat...
      result => {
        //console.log(result);
        this.setState({ actes: result.results });
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    return (
      <Table celled={true} striped={true} selectable={true}>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Localisation</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Libellé</Table.HeaderCell>
            <Table.HeaderCell>Montant</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(this.state.actes, acte => {
            // Ne pas afficher les codes en # mais colorer la ligne
            // => ex. vert pour #FSE, jaune pour #note, etc...
            // Revoir le rendu de chaque champ (avec moment pour la date, un montant avec ','...)
            return (
              <Table.Row key={acte.id}>
                <Table.Cell>{acte.doneAt}</Table.Cell>
                <Table.Cell>{acte.localisation}</Table.Cell>
                <Table.Cell>{acte.code}</Table.Cell>
                <Table.Cell>{acte.description}</Table.Cell>
                <Table.Cell>{acte.montant}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
