import React from "react";
import PropTypes from "prop-types";
import { Button } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Options de pagination",
  propDocs: {
    btnFirstContent: "Contenu textuel du bouton - première page",
    btnLastContent: "Contenu textuel du bouton - dernière page",
    btnNextContent: "Contenu textuel du bouton - page suivante",
    btnPrevContent: "Contenu textuel du bouton - page précédente",
    btnFirstIcon: "Semantic Icon",
    btnLastIcon: "Semantic Icon",
    btnNextIcon: "Semantic Icon",
    btnPrevIcon: "Semantic Icon",
    client: "auto documenté",
    actes: "Un tableau contenant les actes",
    informations: "Informations sur la pagination sous forme d'objet",
    onLoadResult: "Callback résultat obtenu"
  },
  propTypes: {
    btnFirstContent: PropTypes.string,
    btnLastContent: PropTypes.string,
    btnNextContent: PropTypes.string,
    btnPrevContent: PropTypes.string,
    btnFirstIcon: PropTypes.string,
    btnLastIcon: PropTypes.string,
    btnNextIcon: PropTypes.string,
    btnPrevIcon: PropTypes.string,
    client: PropTypes.any.isRequired,
    actes: PropTypes.array,
    informations: PropTypes.object,
    onLoadResult: PropTypes.func
  }
};
export default class Pagination extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    btnFirstContent: "Début",
    btnLastContent: "Fin",
    btnNextContent: "",
    btnPrevContent: "",
    btnFirstIcon: "",
    btnLastIcon: "",
    btnNextIcon: "arrow right",
    btnPrevIcon: "arrow left",
    actes: [],
    informations: {}
  }

  handleClick = query => {
    this.props.client.CCAM.readAll(
      query,
      results => {
        let actesToLoad = [];
        let actes = results.results;
        for (let i = 0 ; i < actes.length ; i++) {
          if (!_.includes(this.props.actes, actes[i])) {
            actesToLoad.push(actes[i]);
          }
        }
        let obj = {
          actes: actesToLoad,
          informations: results.informations
        };
        this.props.onLoadResult(obj);
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    let informations = this.props.informations;
    let show = !_.isUndefined(informations.queries);
    if (show) {
      return(
        <React.Fragment>
          <Button 
            icon={this.props.btnFirstIcon !== "" ? this.props.btnFirstIcon : false}
            content={this.props.btnFirstContent !== "" ? this.props.btnFirstContent : null}
            onClick={(e, d) => this.handleClick(informations.queries.first)}
          />
          {!_.isUndefined(informations.queries.prev)
            ? <Button 
                icon={this.props.btnPrevIcon !== "" ? this.props.btnPrevIcon : false}
                content={this.props.btnPrevContent !== "" ? this.props.btnPrevContent : null}
                onClick={(e, d) => this.handleClick(informations.queries.prev)}
              />
            : ""
          }
          {!_.isUndefined(informations.queries.next)
            ? <Button 
                icon={this.props.btnNextIcon !== "" ? this.props.btnNextIcon : false}
                content={this.props.btnNextContent !== "" ? this.props.btnNextContent : null}
                onClick={(e, d) => this.handleClick(informations.queries.next)}
              />
            : ""
          }
          <Button 
            icon={this.props.btnLastIcon !== "" ? this.props.btnLastIcon : false}
            content={this.props.btnLastContent !== "" ? this.props.btnLastContent : null}
            onClick={(e, d) => this.handleClick(informations.queries.last)}
          />
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}