import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import Note from "./Note";
import Montant from "../Shared/Montant";
import Localisations from "../Shared/Localisations";
import {
  tarif,
  secteur03,
  secteur04,
  secteur05,
  secteur06,
  secteur07,
  secteur08
} from "../lib/Helpers";
import Actions from "../Shared/Actions";

import {
  Button,
  Dropdown,
  Icon,
  Input,
  Label,
  Modal,
  Ref,
  Table
} from "semantic-ui-react";

import _ from "lodash";
import moment from "moment";

import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

import { toISOLocalisation } from "../lib/Helpers";

const propDefs = {
  description: "Historique des actes d'un patient",
  example: "Tableau",
  propDocs: {
    idPatient: "Id du patient, par défaut 0 (Aucun patient)",
    id:
      "Id de l'acte sélectionné par un click, un double click ou par une édition",
    actions:
      'Tableau d\'objet contenant des actions à effectuer (en plus des actions par défaut). Exemple [{icon:"add",text:"Ajouter",action:fonction de l\'action ajouter}]',
    startAt: 'Filtre sur le début d\'une période (incluse). Par défaut ""',
    endAt: 'Filtre sur la fin d\'une période (incluse). Par défaut ""',
    localisation:
      'Filtre sur une liste de dents sélectionnées, séparées par des espaces. Par défaut ""',
    table: "semantic.collections",
    limit: "Valeur de pagination, par défaut 5",
    sort:
      "Le champs sur lequel le tri va être effectué. Par défaut, le tri se fait sur la date (doneAt)",
    order:
      "Le tri est ascendant (ASC) ou descendant (DESC). Par défaut, le tri est descendant (DESC)",
    openNoteTodo:
      "Ouvre la modal pour l'édition des notes ou todos. Par défaut openNoteTodo = false",
    typeNoteTodo:
      'Permet de savoir si c\'est une note ou todo. Par défaut, typeNoteTodo = ""',
    onActeClick:
      "Retourne en paramètre l'id de l'acte sélectionné sur un click",
    onActeDoubleClick:
      "Retourne en paramètre l'id l'acte sélectionné sur un double click",
    onSelectionChange:
      "Retourne en paramètre la liste des id des actes sélectionnés (multi-sélection possible par CTRL+click)",
    onEditActeClick:
      "Retourne en paramètre l'id d'un #DEVIS ou d'une #FSE lorsque l'on édite",
    onOpenNoteTodo: "Callback à l'ouverture de la note",
    onCloseNoteTodo: "Callback à la fermeture de la note",
    showPagination: 'Affiche les options de paginations, par défaut "true"',
    btnFirstContent:
      'Texte du bouton pour aller à la première page, par défaut ""',
    btnLastContent:
      'Texte du bouton pour aller à la dernière page, par défaut ""',
    btnMoreContent:
      'Texte du bouton pour afficher plus de résutats, par défaut "Plus de résultats"',
    btnNextContent:
      'Texte du bouton pour aller à la page suivante, par défaut ""',
    btnPrevContent:
      'Texte du bouton pour aller à la page précédente, par défaut ""',
    btnFirstIcon:
      'Icon semantic du bouton pour aller à la première page, par défaut "fast backward"',
    btnLastIcon:
      'Icon semantic du bouton pour aller à la dernière page, par défaut "fast forward"',
    btnMoreIcon:
      'Icon semantic du bouton pour afficher plus de résultats, par défaut ""',
    btnNextIcon:
      'Icon semantic du bouton pour aller à la page suivante, par défaut "step forward"',
    btnPrevIcon:
      'Icon semantic du bouton pour aller à la page précédente, par défaut "step backward"',
    btnFirst:
      'Props semantic du bouton pour aller à la première page, par défaut un objet vide "{}"',
    btnLast:
      'Props semantic du bouton pour aller à la dernière page, par défaut un objet vide "{}"',
    btnNext:
      'Props semantic du bouton pour aller à la page suivante, par défaut un objet vide "{}"',
    btnPrev:
      'Props semantic du bouton pour aller à la page précédente, par défaut un objet vide "{}"',
    btnMore:
      'Props semantic du bouton pour afficher plus de résultats, par défaut un objet vide "{}"',
    mode: 'Mode de pagination "pages" ou "more", par défaut "pages"'
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    id: PropTypes.number,
    actions: PropTypes.array,
    startAt: PropTypes.string,
    endAt: PropTypes.string,
    localisation: PropTypes.string,
    table: PropTypes.object,
    limit: PropTypes.number,
    sort: PropTypes.string,
    order: PropTypes.string,
    openNoteTodo: PropTypes.bool,
    typeNoteTodo: PropTypes.string,
    onActeClick: PropTypes.func,
    onActeDoubleClick: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onEditActeClick: PropTypes.func,
    onOpenNoteTodo: PropTypes.func,
    onCloseNoteTodo: PropTypes.func,
    showPagination: PropTypes.bool,
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
    mode: PropTypes.string
  }
};

const LIMIT = 1000;

const optionsTag = [
  {
    key: "",
    value: "",
    text: <Icon name="close" size="small" />
  },
  {
    key: "red",
    value: "red",
    text: <Label circular color="red" empty />
  },
  {
    key: "orange",
    value: "orange",
    text: <Label circular color="orange" empty />
  },
  {
    key: "yellow",
    value: "yellow",
    text: <Label circular color="yellow" empty />
  },
  {
    key: "green",
    value: "green",
    text: <Label circular color="green" empty />
  },
  {
    key: "blue",
    value: "blue",
    text: <Label circular color="blue" empty />
  },
  {
    key: "purple",
    value: "purple",
    text: <Label circular color="purple" empty />
  },
  {
    key: "grey",
    value: "grey",
    text: <Label circular color="grey" empty />
  }
];

export default class Historique extends React.Component {
  // variables utilisées pour la multi-sélection avec la touche 'shift'
  firstClick = "";
  secondClick = "";
  // variables utilisées pour la suppresion des actes
  id = ""; // id de l'acte sélectionné
  idDocument = ""; // idDocument de l'acte sélectionné
  reponseCancel = false;
  reponseConfirm = false;
  isFSE = false;
  isDEVIS = false;
  // variable utilisé pour éviter le click lors d'un double click
  timeout = null;
  // Props
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    idPatient: 0,
    id: 0,
    table: {},
    limit: 5,
    sort: "doneAt",
    order: "DESC",
    actions: [],
    startAt: "",
    endAt: "",
    localisation: "",
    openNoteTodo: false,
    typeNoteTodo: "",
    // props pour le composant de pagination
    showPagination: true,
    btnFirstContent: "",
    btnLastContent: "",
    btnMoreContent: "Plus de résultats",
    btnNextContent: "",
    btnPrevContent: "",
    btnFirstIcon: "angle double left",
    btnLastIcon: "angle double right",
    btnMoreIcon: "",
    btnNextIcon: "angle right",
    btnPrevIcon: "angle left",
    btnFirst: {},
    btnLast: {},
    btnNext: {},
    btnPrev: {},
    btnMore: {},
    informations: {},
    mode: "pages"
  };

  componentWillMount() {
    this.setState({
      idPatient: this.props.idPatient,
      idEditer: 0,
      limit: this.props.limit,
      actes: [],
      actesSelected: [],
      informations: {},
      offset: 0,
      sort: this.props.sort,
      order: this.props.order,
      sorted: _.isEqual(this.props.order, "DESC") ? "descending" : "ascending",
      lockRevision: "",
      startAt: this.props.startAt,
      endAt: this.props.endAt,
      localisation: this.props.localisation,
      showConfirm: false,
      message: "",
      showInput: false,
      dateInput: null,
      localisationInput: "",
      codeInput: "",
      cotationInput: -1,
      descriptionInput: "",
      couleurTagInput: "",
      montantInput: -1,
      openLocalisation: false,
      showDatePicker: false
    });

    this.reload(
      this.props.idPatient,
      this.props.limit,
      0,
      this.props.sort,
      this.props.order,
      this.props.startAt,
      this.props.endAt,
      this.props.localisation
    );
  }

  componentWillReceiveProps(next) {
    this.reload(
      next.idPatient,
      this.state.limit,
      0, // offset
      this.state.sort,
      this.state.order,
      next.startAt,
      next.endAt,
      next.localisation.trim()
    );
  }

  componentDidMount() {
    document.addEventListener("click", this.onClickOutside); // Outside click du composant
    this.interval = setInterval(() => {
      // Reload des données toutes les 15 secondes
      this.reload(
        this.state.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        this.state.order,
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    }, 15000);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickOutside);
    clearInterval(this.interval);
  }

  onClickOutside = event => {
    const domNode = ReactDOM.findDOMNode(this);

    if (!event.ctrlKey) {
      if (!domNode.contains(event.target)) {
        if (!_.isEmpty(this.state.actesSelected)) {
          this.setState({ actesSelected: [] });
        }
      }
    }
  };

  query = (
    idPatient,
    limit,
    offset,
    sort,
    order,
    startAt,
    endAt,
    localisation
  ) => {
    let n = 0; // pour incrémenter les champs q1,q2,...
    let params = {};

    if (localisation) {
      let dents = localisation.split(" ");

      _.forEach(dents, dent => {
        if (dent === "01") {
          _.set(params, "q" + ++n, "OR,localisation,Like,1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*03*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*04*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*05*");
        } else if (dent === "02") {
          _.set(params, "q" + ++n, "OR,localisation,Like,3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*06*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*07*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*08*");
        } else if (dent === "03") {
          _.forEach(secteur03, dent03 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent03 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*03*");
        } else if (dent === "04") {
          _.forEach(secteur04, dent04 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent04 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*04*");
        } else if (dent === "05") {
          _.forEach(secteur05, dent05 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent05 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*05*");
        } else if (dent === "06") {
          _.forEach(secteur06, dent06 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent06 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*06*");
        } else if (dent === "07") {
          _.forEach(secteur07, dent07 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent07 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*07*");
        } else if (dent === "08") {
          _.forEach(secteur08, dent08 => {
            _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent08 + "*");
          });
          _.set(params, "q" + ++n, "OR,localisation,Like,*08*");
        } else if (dent === "10") {
          _.set(params, "q" + ++n, "OR,localisation,Like,1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 1*");
          _.set(params, "q" + ++n, "OR,localisation,Like,5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 5*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*03*");
        } else if (dent === "20") {
          _.set(params, "q" + ++n, "OR,localisation,Like,2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 2*");
          _.set(params, "q" + ++n, "OR,localisation,Like,6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 6*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*05*");
        } else if (dent === "30") {
          _.set(params, "q" + ++n, "OR,localisation,Like,3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 3*");
          _.set(params, "q" + ++n, "OR,localisation,Like,7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 7*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*06*");
        } else if (dent === "40") {
          _.set(params, "q" + ++n, "OR,localisation,Like,4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 4*");
          _.set(params, "q" + ++n, "OR,localisation,Like,8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,* 8*");
          _.set(params, "q" + ++n, "OR,localisation,Like,*08*");
        } else {
          _.set(params, "q" + ++n, "OR,localisation,Like,*" + dent + "*");
        }
      });
    }

    if (startAt && endAt) {
      _.set(params, "q" + ++n, "AND,doneAt,Between," + startAt + "," + endAt);
    }

    _.set(params, "q" + ++n, "AND,idPatient,Equal," + idPatient);
    _.set(params, "q" + ++n, "AND,etat,Equal,0");
    _.set(params, "limit", limit);
    _.set(params, "offset", offset);
    _.set(params, "sort", sort);
    _.set(params, "order", order);
    _.set(params, "modifiedSince", this.state ? this.state.lockRevision : "");

    return params;
  };

  reload = (
    idPatient,
    limit,
    offset,
    sort,
    order,
    startAt,
    endAt,
    localisation
  ) => {
    let params = this.query(
      idPatient,
      limit,
      offset,
      sort,
      order,
      startAt,
      endAt,
      localisation
    );

    this.props.client.Actes.readAll(
      params,
      result => {
        // Affichage des todos en premiers
        let oldActes = result.results;
        let todos = _.remove(oldActes, acte => {
          return acte.code === "#TODO";
        });

        // Trie des todos de la plus récente à la plus ancienne
        todos.sort((acte1, acte2) => {
          return acte2.doneAt - acte1.doneAt;
        });

        let newActes = todos.concat(oldActes);

        this.setState({
          idPatient: Number(idPatient),
          limit: limit,
          actes: newActes,
          informations: result.informations,
          offset: offset,
          sort: sort,
          order: order,
          sorted: _.isEqual(order, "DESC") ? "descending" : "ascending",
          lockRevision: result.informations.lockRevision,
          startAt: startAt,
          endAt: endAt,
          localisation: localisation
        });
      },
      error => {}
    );
  };

  // Callbacks de la pagination
  onPageSelect = query => {
    this.reload(
      this.state.idPatient,
      query.limit,
      query.offset,
      query.sort,
      query.order,
      this.state.startAt,
      this.state.endAt,
      this.state.localisation
    );
  };

  onSort = () => {
    // trier l'historique
    if (_.isEqual(this.state.order, "DESC")) {
      this.reload(
        this.state.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        "ASC",
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    } else {
      this.reload(
        this.state.idPatient,
        this.state.limit,
        this.state.offset,
        this.state.sort,
        "DESC",
        this.state.startAt,
        this.state.endAt,
        this.state.localisation
      );
    }
  };

  style = acte => {
    // l'acte passé en paramètre
    let deco = {
      color: "",
      icon: "",
      code: "",
      description: ""
    };

    // Un acte CCAM ou NGAP : fond par défaut sans icône, le code est affiché
    if (!_.startsWith(acte.code, "#")) {
      deco.code = acte.code;
      deco.description =
        acte.couleur === "" ? (
          ""
        ) : (
          <Label circular color={acte.couleur} empty />
        );
      return deco;
    }

    // Une ligne autre qu'un acte : fond coloré et icône, le code n'est pas affiché
    if (acte.code === "#NOTE") {
      deco.color = "yellow";
      deco.icon = "sticky note outline";
      deco.description =
        acte.couleur === "" ? (
          <Icon name="sticky note outline" />
        ) : (
          <Label circular color={acte.couleur} empty />
        );
    } else if (acte.code === "#TODO") {
      deco.color = "pink";
      deco.icon = "list";
      deco.description =
        acte.couleur === "" ? (
          <Icon name="list" />
        ) : (
          <Label circular color={acte.couleur} empty />
        );
    } else if (acte.code === "#FSE") {
      deco.color = "lightgreen";
      deco.icon = "check";
      deco.description =
        acte.couleur === "" ? (
          <Icon name="check" />
        ) : (
          <Label circular color={acte.couleur} empty />
        );
    } else if (acte.code === "#DEVIS") {
      deco.color = "orange";
      deco.icon = "file";
      deco.description =
        acte.couleur === "" ? (
          <Icon name="file" />
        ) : (
          <Label circular color={acte.couleur} empty />
        );
    }

    return deco;
  };

  onActeClick = (e, acte) => {
    let id = acte.id;
    let code = acte.code;
    let actesSelected = [];

    if (code === "#NOTE" || code === "#TODO") {
      this.switchNoteTodo(id);
      this.setState({ actesSelected: actesSelected });
    } else {
      if (e.ctrlKey || e.metaKey) {
        actesSelected = this.state.actesSelected;
        if (_.includes(actesSelected, id)) {
          actesSelected.splice(_.indexOf(actesSelected, id), 1);
        } else {
          actesSelected.push(id);
        }
      } else if (e.shiftKey) {
        this.secondClick = id;
        let first = _.findIndex(
          this.state.actes,
          acte => acte.id === this.firstClick
        );
        let last = _.findIndex(
          this.state.actes,
          acte => acte.id === this.secondClick
        );

        // Permutation entre first et last si le "secondClick" est situé au-dessus du "firstClick"
        if (first > last) {
          let tmp = first;
          first = last;
          last = tmp;
        }

        for (let i = first; i <= last; i++) {
          actesSelected.push(this.state.actes[i].id);
        }
      } else {
        actesSelected.push(id);
        this.firstClick = id;
      }

      this.setState({ actesSelected: actesSelected });
    }

    if (this.props.onActeClick) {
      this.props.onActeClick(id);
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(actesSelected);
    }
  };

  onActeDoubleClick = (e, acte) => {
    let actesSelected = [];
    let id = acte.id;

    actesSelected.push(id);
    this.setState({ actesSelected: actesSelected });

    // Double click, ouvre l'édition d'une note ou todo
    this.props.client.Actes.read(
      id,
      {},
      resultActe => {
        let type = resultActe.code;
        if (type === "#NOTE" || type === "#TODO") {
          let newType = "";

          if (type === "#NOTE") {
            newType = "note";
          } else if (type === "#TODO") {
            newType = "todo";
          } else {
            newType = "";
          }

          if (this.props.onOpenNoteTodo) {
            this.props.onOpenNoteTodo(resultActe.id, newType);
          }

          return false;
        }
      },
      error => {}
    );

    if (this.props.onActeDoubleClick) {
      this.props.onActeDoubleClick(id);
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(actesSelected);
    }
  };

  switchNoteTodo = id => {
    this.props.client.Actes.read(
      id,
      {},
      acte => {
        if (acte.code === "#TODO") {
          this.props.client.Actes.update(
            id,
            {
              code: "#NOTE",
              doneAt: moment().toISOString()
            },
            result => {
              this.reload(
                this.state.idPatient,
                this.state.limit,
                this.state.offset,
                this.state.sort,
                this.state.order,
                this.state.startAt,
                this.state.endAt,
                this.state.localisation
              );
            },
            error => {}
          );
        } else if (acte.code === "#NOTE") {
          this.props.client.Actes.update(
            id,
            {
              code: "#TODO"
            },
            result => {
              this.reload(
                this.state.idPatient,
                this.state.limit,
                this.state.offset,
                this.state.sort,
                this.state.order,
                this.state.startAt,
                this.state.endAt,
                this.state.localisation
              );
            },
            error => {}
          );
        } else {
          return "";
        }
      },
      error => {}
    );
  };

  onEdit = (id, acte) => {
    let type = acte.code;

    if (type === "#NOTE" || type === "#TODO") {
      let newType = "";

      if (type === "#NOTE") {
        newType = "note";
      } else if (type === "#TODO") {
        newType = "todo";
      } else {
        newType = "";
      }

      if (this.props.onOpenNoteTodo) {
        this.props.onOpenNoteTodo(id, newType);
      }

      return;
    }

    if (this.props.onEditActeClick) {
      this.props.onEditActeClick(id);
    }
  };

  onUpdate = acte => {
    this.props.client.Actes.update(
      acte.id,
      {
        doneAt: this.state.dateInput,
        localisation: this.state.localisationInput,
        code: this.state.codeInput,
        cotation: this.state.codeInput,
        description: this.state.descriptionInput,
        montant: this.state.montant
      },
      result => {
        this.reload(
          this.state.idPatient,
          this.state.limit,
          this.state.offset,
          this.state.sort,
          this.state.order,
          this.state.startAt,
          this.state.endAt,
          this.state.localisation
        );

        this.setState({
          idEditer: 0,
          showInput: false
        });
      },
      error => {
        this.setState({
          idEditer: 0,
          showInput: false
        });
      }
    );
  };

  onDelete = (id, acte) => {
    // l'id et le code de l'acte sélectionné passés en paramètres
    this.reponseCancel = false;
    this.reponseConfirm = true;
    this.id = id;
    let code = acte.code;

    _.map(this.state.actes, acte => {
      if (this.id === acte.id) {
        this.idDocument = acte.idDocument;
        return false;
      }
    });
    this.isFSE = false;
    this.isDEVIS = false;

    // Suppression des actes sans #
    if (!_.startsWith(code, "#")) {
      this.setState({
        showConfirm: true,
        message:
          "Souhaitez-vous également supprimer l'ensemble des actes associés ainsi que la FSE correspondante ?"
      });
      return false;
    }

    // Suppression des actes avec # => #FSE, #DEVIS ...
    if (code === "#FSE") {
      this.isFSE = true;
      this.setState({
        showConfirm: true,
        message:
          "Souhaitez-vous également supprimer les actes associés à cette FSE ?"
      });
      return false;
    } else if (code === "#DEVIS") {
      this.isDEVIS = true;
      this.setState({
        showConfirm: true,
        message: "Vous confirmez la suppression de ce DEVIS ?"
      });
      return false;
    }

    // #NOTE, #TODO ...
    this.destroy(this.id);
  };

  onCancel = () => {
    if (!this.isDEVIS) {
      if (!this.reponseCancel && this.reponseConfirm) {
        this.setState({
          message: this.isFSE
            ? "Souhaitez-vous supprimer uniquement la FSE sélectionnée ?"
            : "Souhaitez-vous supprimer uniquement l'acte sélectionné ?"
        });
      } else {
        this.setState({ showConfirm: false });
      }

      this.reponseCancel = true;
      this.reponseConfirm = false;
    } else {
      this.setState({ showConfirm: false });
    }
  };

  onConfirm = () => {
    if (!this.isDEVIS) {
      if (this.reponseCancel && !this.reponseConfirm) {
        this.setState({ showConfirm: false, message: "" });
        this.destroy(this.id);
      } else if (!this.reponseCancel && this.reponseConfirm) {
        this.setState({
          message: this.isFSE
            ? "Vous confirmez la suppression de cette FSE ainsi que les actes associés ?"
            : "Vous confirmez la suppression des actes associés ainsi que la FSE correspondante ?"
        });

        this.reponseConfirm = true;
      } else {
        this.setState({ showConfirm: false });

        if (!this.isFSE) {
          this.props.client.Actes.readAll(
            {
              _idPatient: this.state.idPatient,
              _etat: 0,
              limit: LIMIT
            },
            result => {
              _.map(result.results, acte => {
                if (this.idDocument === acte.idDocument) {
                  this.destroy(acte.id);
                }

                if (this.idDocument === acte.id) {
                  this.destroy(acte.id);
                }
              });
            },
            error => {}
          );
        } else {
          this.props.client.Actes.readAll(
            {
              _idPatient: this.state.idPatient,
              _etat: 0,
              limit: LIMIT
            },
            result => {
              _.map(result.results, acte => {
                if (this.id === acte.idDocument) {
                  this.destroy(acte.id);
                }
              });
              this.destroy(this.id);
              this.isFSE = false;
            },
            error => {}
          );
        }
      }

      this.reponseCancel = true;
    } else {
      this.setState({ showConfirm: false, message: "" });
      this.destroy(this.id);
    }
  };

  destroy = id => {
    // Suppression d'un acte dont l'id de l'acte est passé en paramètre
    this.props.client.Actes.destroy(
      id,
      result => {
        this.reload(
          this.state.idPatient,
          this.state.limit,
          this.state.offset,
          this.state.sort,
          this.state.order,
          this.state.startAt,
          this.state.endAt,
          this.state.localisation
        );
      },
      error => {
        console.log(`Erreur destroy`);
      }
    );
  };

  onModify = (id, acte) => {
    this.setState({
      idEditer: id,
      showInput: true,
      dateInput: moment(acte.doneAt).toDate(),
      localisationInput: acte.localisation,
      codeInput: acte.code,
      cotationInput: acte.cotation,
      descriptionInput: acte.description,
      couleurTagInput: acte.couleur,
      montantInput: acte.montant
    });
  };

  onCreateUpdateNoteTodo = acte => {
    if (this.props.onCloseNoteTodo) {
      this.props.onCloseNoteTodo();
    }

    this.reload(
      acte.idPatient,
      this.state.limit,
      this.state.offset,
      this.state.sort,
      this.state.order,
      this.state.startAt,
      this.state.endAt,
      this.state.localisation
    );
  };

  onOpenLocalisation = () => {
    this.setState({
      openLocalisation: !this.state.openLocalisation
    });
  };

  render() {
    let showPagination = this.props.showPagination;

    let pagination = {
      btnFirstContent: this.props.btnFirstContent,
      btnLastContent: this.props.btnLastContent,
      btnMoreContent: this.props.btnMoreContent,
      btnNextContent: this.props.btnNextContent,
      btnPrevContent: this.props.btnPrevContent,
      btnFirstIcon: this.props.btnFirstIcon,
      btnLastIcon: this.props.btnLastIcon,
      btnMoreIcon: this.props.btnMoreIcon,
      btnNextIcon: this.props.btnNextIcon,
      btnPrevIcon: this.props.btnPrevIcon,
      btnFirst: this.props.btnFirst,
      btnLast: this.props.btnLast,
      btnNext: this.props.btnNext,
      btnPrev: this.props.btnPrev,
      btnMore: this.props.btnMore,
      mode: this.props.mode
    };

    let dropdown = {
      direction: "right"
    };

    let dateInput = this.state.dateInput;
    let localisationInput = this.state.localisationInput;
    let codeInput = this.state.codeInput;
    let cotationInput = this.state.cotationInput;
    let descriptionInput = this.state.descriptionInput;
    let montantInput = this.state.montantInput;

    return (
      <React.Fragment>
        {/* la maj de l'affichage de la sélection ne sera pas gérée par semantic */}
        <Table celled={true} striped={false} selectable={false} sortable={true}>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell
                sorted={this.state.sorted}
                onClick={() => this.onSort()}
                collapsing={true}
              >
                Date
              </Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>
                Localisation
              </Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Code/Type</Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Cotation</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell
                collapsing={true}
                style={{
                  minWidth: this.state.showInput ? "100px" : undefined
                }}
              >
                Montant
              </Table.HeaderCell>
              <Table.HeaderCell collapsing={true}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.state.actes, acte => {
              let deco = this.style(acte);
              let rowSelected = _.includes(this.state.actesSelected, acte.id);

              // Les actions possibles des #FSE, #DEVIS, #NOTE, #TODO et CCAM ou NGAP
              let actions = [];

              if (acte.code === "#NOTE" || acte.code === "#TODO") {
                actions = [
                  {
                    icon: "edit",
                    text: "Éditer",
                    action: id => this.onEdit(id, acte)
                  },
                  {
                    icon: "trash",
                    text: "Supprimer",
                    action: id => this.onDelete(id, acte)
                  }
                ];
              } else {
                actions = [
                  {
                    icon: "edit",
                    text: "Éditer",
                    action: id => this.onEdit(id, acte)
                  },
                  {
                    icon: "pencil",
                    text: "Modifier cette ligne",
                    action: id => this.onModify(id, acte)
                  },
                  {
                    icon: "trash",
                    text: "Supprimer",
                    action: id => this.onDelete(id, acte)
                  }
                ];
              }

              let actionTag = [
                {
                  icon: "tag",
                  text: (
                    <Dropdown text="Tags" pointing="left" className="link item">
                      <Dropdown.Menu>
                        {_.map(optionsTag, action => (
                          <Dropdown.Item
                            key={action.key}
                            text={action.text}
                            onClick={() => {
                              this.props.client.Actes.update(
                                acte.id,
                                {
                                  couleur: action.value
                                },
                                result => {
                                  this.reload(
                                    this.state.idPatient,
                                    this.state.limit,
                                    this.state.offset,
                                    this.state.sort,
                                    this.state.order,
                                    this.state.startAt,
                                    this.state.endAt,
                                    this.state.localisation
                                  );
                                },
                                error => {}
                              );
                            }}
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  ),
                  action: id => {}
                }
              ];

              if (
                acte.code === "#NOTE" ||
                acte.code === "#TODO" ||
                !_.startsWith(acte.code, "#")
              ) {
                actions = _.concat(actions, actionTag);
              }

              // Ajout des actions (props) de l'utilisateur
              if (!_.isEmpty(this.props.actions)) {
                actions = _.concat(actions, this.props.actions);
              }

              // La ligne en modification
              if (this.state.idEditer === acte.id && this.state.showInput) {
                return (
                  <React.Fragment key={acte.id}>
                    <Table.Row
                      key={acte.id}
                      style={{
                        backgroundColor: rowSelected ? "#E88615" : deco.color,
                        color: rowSelected ? "white" : "black"
                      }}
                      textAlign="center"
                    >
                      <Table.Cell
                        onClick={() => {
                          this.setState({ showDatePicker: true });
                        }}
                      >
                        {moment(dateInput).format("L")}
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          fluid={true}
                          value={localisationInput}
                          error={
                            toISOLocalisation(localisationInput).length % 2 !==
                            0
                          }
                          onClick={() =>
                            this.setState({ openLocalisation: true })
                          }
                          style={{ margin: 0 }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          fluid={true}
                          value={codeInput}
                          onChange={(e, d) =>
                            this.setState({ codeInput: d.value })
                          }
                          style={{ margin: 0 }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          fluid={true}
                          value={cotationInput}
                          onChange={(e, d) =>
                            this.setState({ cotationInput: d.value })
                          }
                          style={{ margin: 0 }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          value={descriptionInput}
                          fluid={true}
                          onChange={(e, d) => {
                            this.setState({ descriptionInput: d.value });
                          }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Montant
                          montant={montantInput}
                          onChange={montant => {
                            this.setState({ montantInput: montant });
                          }}
                          input={{ fluid: true }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <span>
                          <Button
                            icon="save"
                            positive={true}
                            onClick={() => this.onUpdate(acte)}
                            size="mini"
                          />
                          <Button
                            icon="cancel"
                            negative={true}
                            onClick={() => {
                              this.setState({
                                idEditer: 0,
                                showInput: false,
                                dateInput: null,
                                localisationInput: "",
                                codeInput: "",
                                cotationInput: -1,
                                descriptionInput: "",
                                couleurTagInput: "",
                                montantInput: -1
                              });
                            }}
                            size="mini"
                          />
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment key={acte.id}>
                    <Table.Row
                      key={acte.id}
                      onClick={e => {
                        e.preventDefault();
                        e.persist();
                        if (this.timeout === null) {
                          this.timeout = setTimeout(() => {
                            this.timeout = null;
                            if (
                              this.props.onActeClick &&
                              this.props.onSelectionChange
                            ) {
                              this.onActeClick(e, acte);
                            }
                          }, 300);
                        }
                      }}
                      onDoubleClick={e => {
                        e.preventDefault();
                        clearTimeout(this.timeout);
                        this.timeout = null;
                        if (!_.startsWith(acte.code, "#")) {
                          this.onModify(acte.id, acte);
                        } else {
                          if (this.props.onActeDoubleClick) {
                            this.onActeDoubleClick(e, acte);
                          }
                        }
                      }}
                      style={{
                        backgroundColor: rowSelected ? "#E88615" : deco.color,
                        color: rowSelected ? "white" : "black"
                      }}
                    >
                      <Table.Cell>
                        {_.isEqual(acte.code, "#TODO") ? (
                          <b>{_.capitalize(moment(acte.doneAt).fromNow())}</b>
                        ) : (
                          moment(acte.doneAt).format("L")
                        )}
                      </Table.Cell>
                      <Table.Cell>{acte.localisation}</Table.Cell>
                      <Table.Cell>{deco.code}</Table.Cell>
                      <Table.Cell>
                        {_.isEqual(acte.cotation, 0) ? "" : acte.cotation}
                      </Table.Cell>
                      <Table.Cell>
                        {deco.description}
                        {" " + acte.description}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {_.isEqual(acte.code, "#TODO") ||
                        _.isEqual(acte.code, "#NOTE")
                          ? ""
                          : tarif(acte.montant)}
                      </Table.Cell>
                      <Table.Cell>
                        <Actions
                          actions={actions}
                          id={acte.id}
                          dropdown={dropdown}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                );
              }
            })}
          </Table.Body>
        </Table>
        <div style={{ textAlign: "center" }}>
          {showPagination ? (
            <Pagination
              informations={this.state.informations}
              onPageSelect={this.onPageSelect}
              {...pagination}
            />
          ) : (
            ""
          )}
        </div>
        {/* Modal de supression */}
        <Modal size="tiny" open={this.state.showConfirm}>
          <Modal.Content>
            <p>{this.state.message}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onCancel}>
              <Icon name="ban" color="red" />
              Non
            </Button>
            <Ref
              innerRef={node => {
                if (this.state.showConfirm) {
                  node.focus();
                }
              }}
            >
              <Button color="blue" onClick={this.onConfirm}>
                <Icon name="check" color="green" />
                Oui
              </Button>
            </Ref>
          </Modal.Actions>
        </Modal>
        {/* Modal Note */}
        <Note
          client={this.props.client}
          id={this.props.id}
          idPatient={this.state.idPatient}
          open={this.props.openNoteTodo}
          type={this.props.typeNoteTodo}
          onCreate={this.onCreateUpdateNoteTodo}
          onUpdate={this.onCreateUpdateNoteTodo}
          onClose={() => {
            if (this.props.onCloseNoteTodo) {
              this.props.onCloseNoteTodo();
            }
          }}
        />
        {/* Modal Localisation */}
        <Localisations
          dents={localisationInput}
          onSelection={dents => {
            this.setState({ localisationInput: dents });
          }}
          modal={{
            size: "large",
            open: this.state.openLocalisation,
            onClose: () => {
              this.setState({ openLocalisation: false });
            }
          }}
        />
        {/* DatePicker au moment de la modification d'un acte */}
        {this.state.showDatePicker ? (
          <DatePicker
            fixedHeight={true}
            withPortal={true}
            inline={true}
            dateFormat="dd/MM/yyyy"
            selected={_.isNull(dateInput) ? moment().toDate() : dateInput}
            onChange={date => {
              if (date) {
                this.setState({
                  dateInput: moment(date).toDate(),
                  showDatePicker: false
                });
              }
            }}
            locale={fr}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

class Pagination extends React.Component {
  state = {
    loadingMore: false
  };

  componentWillReceiveProps() {
    if (this.props.mode === "more") {
      this.setState({
        loadingMore: false
      });
    }
  }

  handleClick = query => {
    this.props.onPageSelect(query);
  };

  loadMoreQuery = query => {
    let pageSize = this.props.informations.pageSize;
    let limit = 10;
    let q = query;
    q.offset = 0; // recommencer au début pour l'affichage
    if (_.isUndefined(q.limit)) {
      q.limit = pageSize;
    }
    q.limit += limit;
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
    if (show && this.props.mode === "pages") {
      return (
        <React.Fragment>
          <Button
            disabled={_.isUndefined(informations.queries.prev)}
            icon={
              this.props.btnFirstIcon !== "" ? this.props.btnFirstIcon : null
            }
            content={
              this.props.btnFirstContent !== ""
                ? this.props.btnFirstContent
                : null
            }
            labelPosition={
              this.props.btnFirstContent !== "" &&
              this.props.btnFirstIcon !== ""
                ? "left"
                : null
            }
            onClick={() => this.handleClick(informations.queries.first)}
            {...btnFirst}
          />
          <Button
            disabled={_.isUndefined(informations.queries.prev)}
            icon={this.props.btnPrevIcon !== "" ? this.props.btnPrevIcon : null}
            content={
              this.props.btnPrevContent !== ""
                ? this.props.btnPrevContent
                : null
            }
            labelPosition={
              this.props.btnPrevContent !== "" && this.props.btnPrevIcon !== ""
                ? "left"
                : null
            }
            onClick={() => this.handleClick(informations.queries.prev)}
            {...btnPrev}
          />
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnNextIcon !== "" ? this.props.btnNextIcon : null}
            content={
              this.props.btnNextContent !== ""
                ? this.props.btnNextContent
                : null
            }
            labelPosition={
              this.props.btnNextContent !== "" && this.props.btnNextIcon !== ""
                ? "right"
                : null
            }
            onClick={() => this.handleClick(informations.queries.next)}
            {...btnNext}
          />
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnLastIcon !== "" ? this.props.btnLastIcon : null}
            content={
              this.props.btnLastContent !== ""
                ? this.props.btnLastContent
                : null
            }
            labelPosition={
              this.props.btnLastContent !== "" && this.props.btnLastIcon !== ""
                ? "right"
                : null
            }
            onClick={() => this.handleClick(informations.queries.last)}
            {...btnLast}
          />
        </React.Fragment>
      );
    } else if (show && this.props.mode === "more") {
      return (
        <React.Fragment>
          <Button
            disabled={_.isUndefined(informations.queries.next)}
            icon={this.props.btnMoreIcon !== "" ? this.props.btnMoreIcon : null}
            content={
              this.props.btnMoreContent !== ""
                ? this.props.btnMoreContent
                : null
            }
            labelPosition={
              this.props.btnMoreContent !== "" && this.props.btnMoreIcon !== ""
                ? "right"
                : null
            }
            loading={this.state.loadingMore}
            onClick={() => {
              this.setState({ loadingMore: true });
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
