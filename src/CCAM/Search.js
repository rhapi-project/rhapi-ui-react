import React from "react";
import PropTypes from "prop-types";
import { Search } from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

const propDefs = {
  description:
    "Composant pour la recherche des actes en CCAM. Retourne la liste des actes sous forme d'un tableau " +
    "d'objets JSON.",
  example: "SearchBasic",
  propDocs: {
    date: "Date effective de l'acte. Par défaut date du jour",
    executant: "Limiter la recherche d'actes à un domaine",
    localisation: "Limiter la recherche aux seuls concernant les dents renseignées",
    onClear: "Callback d'une ràz",
    onLoadActes: "Callback résultat de la recherche",
    onSelectionChange: "Callback pour retourner l'acte sélectionné",
    search: "semantic.modules",
    searchInputLength:
      "Nombre minimum de caractères pour déclencher la recherche d'actes"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    executant: PropTypes.string,
    localisation: PropTypes.string,
    onClear: PropTypes.func,
    onLoadActes: PropTypes.func,
    onSelectionChange: PropTypes.func,
    search: PropTypes.object,
    searchInputLength: PropTypes.number
  }
};

export default class Search2 extends React.Component {
  static propTypes = propDefs.propTypes; // peut s'utiliser comme ceci
  // https://reactjs.org/docs/typechecking-with-proptypes.html

  static defaultProps = {
    date: moment().toISOString(),
    executant: "",
    localisation: ""
  };

  componentWillMount() {
    this.setState({
      typeSearch: "keyword",
      results: [], // mots clés résultat de la recherche
      search: _.isUndefined(this.props.search)
        ? this.getSemanticSearchProps({})
        : this.getSemanticSearchProps(this.props.search),
      value: ""
    });
  };

  getSemanticSearchProps = search => {
    let obj = search;
    obj.placeholder = _.get(search, "placeholder", "Recherche d'un acte");
    obj.showNoResults = _.get(search, "showNoResults", false);
    return obj;
  };

  // Au moment de la recherche des actes, un appel de la
  // fonction this.props.getActesObject est faite (si elle est définie)
  // Cette fonction est sensée renvoyer le résultat de la recherche au composant parent.
  loadActes = inputVal => {
    let params = {
      texte: inputVal,
      date: this.props.date,
      executant: this.props.executant,
      localisation: this.props.localisation
    };
    if (_.isEmpty(params.executant)) {
      _.unset(params, "executant");
    }
    if (_.isEmpty(params.localisation)) {
      _.unset(params, "localisation");
    }
    this.props.client.CCAM.readAll(
      params,
      actes => {
        //console.log(actes);
        let keywords = [];
        for (let i = 0; i < actes.keywords.length; i++) {
          let obj = {};
          obj.title = actes.keywords[i];
          keywords.push(obj);
        }
        this.setState({ results: keywords });
        if (!_.isUndefined(this.props.onLoadActes)) {
          this.props.onLoadActes(actes);
        } else {
          console.log("RESULTAT DE LA RECHERCHE");
          console.log(actes);
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  // Pour pouvoir lancer une recherche, il faut que la longueur de la saisie
  // soit >= à this.props.searchInputLenght.
  // Sinon par défaut, la longeur de la saisie nécessaire pour lancer une recherche
  // est de 1
  search = inputVal => {
    this.setState({ value: inputVal });
    let searchInputLength = _.isUndefined(this.props.searchInputLength)
      ? 1
      : this.props.searchInputLength;
    if (inputVal.length >= searchInputLength) {
      if (this.state.typeSearch === "keyword") {
        this.loadActes(inputVal);
      }
    }

    // Si la saisie est vide, vider les mots clé
    // + appel à la fonction this.props.clearSearch (si elle est définie)
    if (_.isEmpty(inputVal)) {
      this.setState({ results: [] }); // vider les mots clé
      if (!_.isUndefined(this.props.onClear)) {
        this.props.onClear();
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <Search
          onSearchChange={(e, d) => this.search(d.value)}
          onResultSelect={(e, d) => this.search(d.result.title)}
          results={this.state.results}
          value={this.state.value}
          {...this.state.search}
        />
      </React.Fragment>
    );
  }
}
