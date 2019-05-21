import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import _ from "lodash";

import moment from "moment";

// TODO : mettre les props nécessaires
//        => dont l'id du patient, le nbre max de lignes par page (si pagination)...
//        documenter le Component
const propDefs = {
  description: "Composant correspondant à l'historique des actes d'un patient",
  example: "Tableau",
  propDocs: {
    idPatient: "Id du patient (0 si inconnu en bdd)"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number
  }
};

export default class Historique extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: 0
  };

  componentWillMount() {
    this.setState({
      actes: []
    });

    this.props.client.Actes.readAll(
      {
        _idPatient: this.props.idPatient,
        limit: 20,
        offset: 0,
        sort: "doneAt",
        order: "DESC"
      }, // TODO : Introduire des filtres (dont le principal est celui du patient),
      // de la pagination, ordonner... Exclure le champ patientJO du résultat...
      result => {
        // console.log(result);
        this.setState({
          actes: result.results
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    let noActe = _.isNull(this.state) || _.isEmpty(this.state.actes);

    let actes = [];
    if (!noActe) {
      actes = this.state.actes;
    }

    return (
      <Table celled={true} striped={true} selectable={true}>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Localisation</Table.HeaderCell>
            <Table.HeaderCell>Code/Type</Table.HeaderCell>
            <Table.HeaderCell>Cotation</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Montant</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(actes, acte => {
            // Ne pas afficher les codes en # mais colorer la ligne
            // => ex. vert pour #FSE, jaune pour #note, etc...
            // Revoir le rendu de chaque champ (avec moment pour la date, un montant avec ','...)
            let couleur = "";
            let code = "";
            if (_.isEqual(acte.code, "#NOTE")) {
              couleur = "Yellow";
              code = "";
            } else if (_.isEqual(acte.code, "#TODO")) {
              couleur = "Red";
              code = "";
            } else if (_.isEqual(acte.code, "#FSE")) {
              couleur = "Green";
              code = "";
            } else {
              couleur = "";
              code = acte.code;
            }

            return (
              <Table.Row key={acte.id}>
                <Table.Cell style={{ backgroundColor: couleur }}>
                  {moment(acte.doneAt).format("L")}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: couleur }}>
                  {acte.localisation}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: couleur }}>
                  {code}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: couleur }}>
                  {acte.cotation}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: couleur }}>
                  {acte.description}
                </Table.Cell>
                <Table.Cell
                  style={{ backgroundColor: couleur }}
                  textAlign="right"
                >
                  {acte.montant.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
