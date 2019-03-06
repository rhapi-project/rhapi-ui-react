import React from "react";
import PropTypes from "prop-types";
import { Header } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Détail de la facturation d'un acte",
  propDocs: {
    acte: "Acte CCAM sélectionné",
    client: "auto documenté"
  },
  propTypes: {
    acte: PropTypes.object,
    client: PropTypes.any.isRequired
  }
};

export default class Tarification extends React.Component {
  static propTypes = propDefs.propTypes;

  state = {
    contextes: {}
  }

  componentWillMount() {
    this.loadContextes();
  };

  loadContextes = () => {
    this.props.client.CCAM.contextes(
      results => {
        console.log(results);
        this.setState({ contextes: results });
      },
      error => {
        console.log(error);
      }
    );
  };

  show = () => {
    return (
      !_.isUndefined(this.props.acte) && !_.isEmpty(this.props.acte) && !_.isEmpty(this.state.contextes)
    );
  };

  render() {
    let show = this.show();
    if (show) {
      let acte = this.props.acte;
      return (
        <React.Fragment>
          <div>
            <Header as="h3">{acte.codActe}</Header>
            <Header as="h4">{acte.nomLong}</Header>
          </div>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}
