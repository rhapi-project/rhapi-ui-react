import React from "react";
import PropTypes from "prop-types";
import { Divider, Form, Header, Icon, Input, Modal } from "semantic-ui-react";
import Search2 from "./Search";
import Table2 from "./Table";

import _ from "lodash";
import moment from "moment";

const propDefs = {
  description:
    "Composant pour la recherche des actes en CCAM. Retourne la liste des actes sous forme d'un tableau " +
    "d'objets JSON.",
  example: "Code",
  propDocs: {
    date: "Date effective de l'acte. Par défaut date du jour",
    executant: "Limiter la recherche aux seuls actes d'une profession de santé. "
      + "Exemple : D1(dentistes), SF(sages-femmes)",
    limit: "Valeur de pagination",
    localisation: "Limiter la recherche aux actes concernant les dents renseignées "
      + "selon la norme internationale ISO-3950, sans séparateur entre les numéros des dents "
      + "(par exemple localisation=1121 pour les deux incisives centrales maxillaires ou "
      + "localisation=18 pour la dent de sagesse maxillaire droite)",
    onSelection: "Callback à la sélection d'un acte"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    executant: PropTypes.string,
    limit: PropTypes.number,
    localisation: PropTypes.string,
    onSelection: PropTypes.func,
  }
};

export default class Code extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    date: moment().toISOString(),
    executant: "",
    localisation: "",
    limit: 7
  };
  componentWillMount() {
    this.setState({
      acte: {},
      actes: [],
      code: "",
      informations: {},
      open: false
    });
  };

  close = () => {
    this.setState({ open: false });
  };

  onClearSearch = () => {
    this.setState({ actes: [], informations: {} });
  }

  onLoadActes = obj => {
    this.setState({ actes: obj.results, informations: obj.informations });
  };

  onPageSelect = obj => {
    this.setState({
      actes: obj.actes,
      informations: obj.informations
    });
  };

  onSelection = acte => {
    this.setState({ code: acte.codActe, open: false });
    if (!_.isUndefined(this.props.onSelection)) {
      this.props.onSelection(acte);
    }
  };

  render() {
    let tableProps = {
      celled: true,
      style: { width: "100%" }
    };
    return (
      <React.Fragment>
        <Input
          onClick={(e, d) => this.setState({ open: true })}
          value={this.state.code}
        />
        <Modal open={this.state.open} onClose={this.close}>
          <Modal.Content>
            <Form>
              <Form.Input>
                <Search2
                  client={this.props.client}
                  code={this.state.code}
                  date={this.props.date}
                  executant={this.props.executant}
                  limit={this.props.limit}
                  localisation={this.props.localisation}
                  onLoadActes={this.onLoadActes}
                />
              </Form.Input>
            </Form>
            <Divider />
            <div style={{ height: "350px", overflow: "auto" }}>
              {_.isEmpty(this.state.actes)
                ? <div style={{ textAlign: "center" }}> 
                    <Header as="h3" icon={true} style={{ marginTop: "10%", verticalAlign: "middle" }}>
                      <Icon name="search" />
                      Recherche d'un acte en CCAM
                    </Header>
                  </div>
                : null
              }
              <Table2 
                client={this.props.client}
                actes={this.state.actes}
                informations={this.state.informations}
                onPageSelect={this.onPageSelect}
                onSelection={this.onSelection}
                table={tableProps}
                showPagination={true}
              />
            </div>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}