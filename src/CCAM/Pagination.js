import React from "react";
import PropTypes from "prop-types";
import { Button } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Options de pagination (passées au tableau sous forme d'objet)",
  propDocs: {
    btnFirstContent: "contenu textuel du bouton (première page)",
    btnLastContent: "contenu textuel du bouton (dernière page)",
    btnMoreContent: "contenu textuel du bouton (plus de résutats)",
    btnNextContent: "contenu textuel du bouton (page suivante)",
    btnPrevContent: "contenu textuel du bouton (page précédente)",
    btnFirstIcon: "Semantic Icon",
    btnLastIcon: "Semantic Icon",
    btnMoreIcon: "Semantic Icon",
    btnNextIcon: "Semantic Icon",
    btnPrevIcon: "Semantic Icon",
    btnFirst: "Props semantic bouton",
    btnLast: "Props semantic bouton",
    btnNext: "Props semantic bouton",
    btnPrev: "Props semantic bouton",
    btnMore: "Props semantic bouton",
    informations: "Informations sur la pagination sous forme d'objet",
    mode: "mode de pagination ('pages' ou 'more')",
    onPageSelect: "Callback changement de page" // à voir comment documenter
  },
  propTypes: {
    btnFirstContent: PropTypes.string,
    btnLastContent: PropTypes.string,
    btnMoreContent: PropTypes.string,
    btnNextContent: PropTypes.string,
    btnPrevContent: PropTypes.string,
    btnFirstIcon: PropTypes.string,
    btnLastIcon: PropTypes.string,
    btnMoreIcon: PropTypes.string,
    btnNextIcon: PropTypes.string,
    btnPrevIcon: PropTypes.string,
    btnFirst: PropTypes.object,
    btnLast: PropTypes.object,
    btnNext: PropTypes.object,
    btnPrev: PropTypes.object,
    btnMore: PropTypes.object,
    informations: PropTypes.object,
    mode: PropTypes.string,
    onPageSelect: PropTypes.func // à voir
  }
};
export default class Pagination extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    btnFirstContent: "Début",
    btnLastContent: "Fin",
    btnMoreContent: "Plus de résultats",
    btnNextContent: "",
    btnPrevContent: "",
    btnFirstIcon: "",
    btnLastIcon: "",
    btnMoreIcon: "",
    btnNextIcon: "arrow right",
    btnPrevIcon: "arrow left",
    btnFirst: {},
    btnLast: {},
    btnNext: {},
    btnPrev: {},
    btnMore: {},
    informations: {},
    mode: "pages"
  };

  handleClick = query => {
    this.props.onPageSelect(query);
  };

  loadMoreQuery = query => {
    let pageSize = this.props.informations.pageSize;
    let q = query;
    q.offset += pageSize;
    return q;
  };

  btnSemanticProps = propsObj => {
    let obj = propsObj;
    _.unset(obj, "disabled");
    _.unset(obj, "icon");
    _.unset(obj, "content");
    _.unset(obj, "labelPosition");
    _.unset(obj, "onClick");
    return obj;
  };

  render() {
    let informations = this.props.informations;
    let show = !_.isUndefined(informations.queries);
    let btnFirst = this.btnSemanticProps(this.props.btnFirst);
    let btnLast = this.btnSemanticProps(this.props.btnLast);
    let btnNext = this.btnSemanticProps(this.props.btnNext);
    let btnPrev = this.btnSemanticProps(this.props.btnPrev);
    let btnMore = this.btnSemanticProps(this.props.btnMore);
    //console.log(informations);
    if (show && (this.props.mode === "pages")) {
      return(
        <React.Fragment>
          <Button
            disabled={_.isUndefined(informations.queries.prev)}
            icon={this.props.btnFirstIcon !== "" ? this.props.btnFirstIcon : null}
            content={this.props.btnFirstContent !== "" ? this.props.btnFirstContent : null}
            labelPosition={this.props.btnFirstContent !== "" && this.props.btnFirstIcon !== "" ? "left" : null}
            onClick={() => this.handleClick(informations.queries.first)}
            {...btnFirst}
          />
          <Button
            disabled={_.isUndefined(informations.queries.prev)}
            icon={this.props.btnPrevIcon !== "" ? this.props.btnPrevIcon : null}
            content={this.props.btnPrevContent !== "" ? this.props.btnPrevContent : null}
            labelPosition={this.props.btnPrevContent !== "" && this.props.btnPrevIcon !== "" ? "left" : null}
            onClick={() => this.handleClick(informations.queries.prev)}
            {...btnPrev}
          />
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnNextIcon !== "" ? this.props.btnNextIcon : null}
            content={this.props.btnNextContent !== "" ? this.props.btnNextContent : null}
            labelPosition={this.props.btnNextContent !== "" && this.props.btnNextIcon !== "" ? "right" : null}
            onClick={() => this.handleClick(informations.queries.next)}
            {...btnNext}
          />
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnLastIcon !== "" ? this.props.btnLastIcon : null}
            content={this.props.btnLastContent !== "" ? this.props.btnLastContent : null}
            labelPosition={this.props.btnLastContent !== "" && this.props.btnLastIcon !== "" ? "right" : null}
            onClick={() => this.handleClick(informations.queries.last)}
            {...btnLast}
          />
        </React.Fragment>
      );
    } else if (show && (this.props.mode === "more")) {
      return (
        <React.Fragment>
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnMoreIcon !== "" ? this.props.btnMoreIcon : null}
            content={this.props.btnMoreContent !== "" ? this.props.btnMoreContent : null}
            labelPosition={this.props.btnMoreContent !== "" && this.props.btnMoreIcon !== "" ? "right" : null}
            onClick={() => {
              let query = this.loadMoreQuery(informations.queries.next);
              this.handleClick(query);
            }}
            {...btnMore}
          />
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}