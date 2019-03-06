import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";

import _ from "lodash";

import Pagination from "./Pagination";

const styles = {
  coveredTableRow: {
    cursor: "pointer",
    fontWeight: "bold"
  }
};

const propDefs = {
  description: "Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.",
  propDocs: {
    actes: "actes CCAM à afficher",
    client: "auto documenté",
    headers: "en-têtes du tableau",
    informations: "informations sur les requêtes de pagination",
    onSelection: "callback à la sélection d'un acte",
    pagination: "options de pagination",
    showPagination: "afficher les options de paginations",
    table: "semantic.collections"
  },
  propTypes: {
    actes: PropTypes.array,
    client: PropTypes.any.isRequired,
    headers: PropTypes.array,
    informations: PropTypes.object,
    onSelection: PropTypes.func,
    pagination: PropTypes.object,
    showPagination: PropTypes.bool,
    table: PropTypes.object
  }
};

export default class Table2 extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actes: [],
    headers: [],
    informations: {},
    pagination: {},
    showPagination: false,
    table: {}
  };
  componentWillMount() {
    this.setState({
      actes: this.props.actes,
      informations: this.props.informations,
      mouseOverItem: {}
    });
  };

  componentWillReceiveProps(next) {
    this.setState({
      actes: next.actes,
      informations: next.informations
    });
  };

  displayValue = (champ, value) => {
    if (_.isNull(value)) {
      return "";
    }

    let dates = ["dtArrete", "dtCreatio", "dtEffet", "dtFin", "dtJo", "dtModif"];
    if (_.includes(dates, champ)) {
      let d = new Date(value);
      return d.toLocaleDateString("fr-FR");
    } else {
      return value;
    }
  };

  onSelection = acte => {
    if (!_.isUndefined(this.props.onSelection)) {
      this.props.onSelection(acte);
    }
  };

  onPageSelect = query => {
    this.props.client.CCAM.readAll(
      query,
      results => {
        if (!_.isUndefined(this.props.onPageSelect)) {
          let obj = {};
          obj.actes = results.results;
          obj.informations = results.informations;
          this.props.onPageSelect(obj);
        } else {
          console.log("Callback onPageSelect non défini");
          console.log(results);
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    let noHeaders = _.isEmpty(this.props.headers);
    let showPagination = this.props.showPagination;
    if (!_.isEmpty(this.props.actes)) {
      return(
        <React.Fragment>
          <Table {...this.props.table}>
            {noHeaders
              ? <Table.Header />
              : <Table.Header>
                  <Table.Row>
                    {_.map(this.props.headers, header =>
                      <Table.HeaderCell key={header.champ}>
                        {header.title}
                      </Table.HeaderCell>
                    )}
                  </Table.Row>
                </Table.Header>
            }

            <Table.Body>
              {noHeaders
                ? _.map(this.props.actes, acte =>
                    <Table.Row
                      key={acte.codActe}
                      onClick={(e, d) => this.onSelection(acte)}
                      onMouseOver={(e) => {this.setState({ mouseOverItem: acte })}}
                      onMouseOut={(e) => {this.setState({ mouseOverItem: {} })}}
                      style={acte === this.state.mouseOverItem ? styles.coveredTableRow : {}}
                    >
                      <Table.Cell>{acte.codActe}</Table.Cell>
                      <Table.Cell>{acte.nomLong}</Table.Cell>
                    </Table.Row>
                  )
                : _.map(this.props.actes, acte =>
                    <Table.Row
                      key={acte.codActe}
                      onClick={(e, d) => this.onSelection(acte)}
                      onMouseOver={(e) => {this.setState({ mouseOverItem: acte })}}
                      onMouseOut={(e) => {this.setState({ mouseOverItem: {} })}}
                      style={acte === this.state.mouseOverItem ? styles.coveredTableRow : {}}  
                    >
                      {_.map(this.props.headers, header =>
                        <Table.Cell key={header.champ}>
                          {this.displayValue(header.champ, _.get(acte, [header.champ]))}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  )
              }
            </Table.Body>
          </Table>
          <div style={{ textAlign: "center" }}>
            {showPagination
              ? <Pagination
                  informations={this.state.informations}
                  onPageSelect={this.onPageSelect}
                  {...this.props.pagination}
                />
              : ""
            }
          </div>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
