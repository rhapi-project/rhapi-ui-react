import React from "react";
import PropTypes from "prop-types";
import { Form } from "semantic-ui-react";
import DateRange from "./DateRange";

import moment from "moment";
import "moment/locale/fr";

const propDefs = {
  description: "Période, début et fin d'une période",
  example: "Periode",
  propDocs: {
    startYear:
      "La première année qui sera affichée. Par défaut l'année en cours",
    onPeriodeChange:
      "Callback au changement de la période. C'est une fonction qui prend 2 paramètres, " +
      "début et fin de la période (inclus).\nLes valeurs de ces paramètres sont NULL si la durée est indéterminée."
  },
  propTypes: {
    startYear: PropTypes.number,
    onPeriodeChange: PropTypes.func
  }
};

export default class Periode extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    startYear: moment().year()
  };

  componentWillMount() {
    this.setState({
      currentOption: null,
      currentYear: moment().year(),
      rangeStart: undefined,
      rangeEnd: undefined,
      rangeOpen: false
    });
  }

  allYears = startYear => {
    let array = [];
    for (let i = startYear; i <= moment().year(); i++) {
      let obj = {
        text: i.toString(),
        value: i
      };
      array.push(obj);
    }
    return array.reverse();
  };

  months = year => {
    let array = [];
    let m = moment()._locale._months;
    let limit =
      year === moment().year()
        ? moment().month()
        : m.length - 1;
    for (let i = 0; i <= limit; i++) {
      let obj = {
        text: _.upperFirst(m[i] + " " + year),
        value: i
      };
      array.push(obj);
    }
    return array;
  };

  onPeriodeChange = (option, year) => {
    this.setState({ currentOption: option });
    let startAt = null;
    let endAt = null;
    if (_.isNumber(option)) {
      startAt = moment()
        .year(year)
        .month(option)
        .startOf("month");
      endAt = moment()
        .year(year)
        .month(option)
        .endOf("month");
    } else {
      switch (option) {
        case null:
          break;
        case "today":
          startAt = moment().startOf("day");
          endAt = moment().endOf("day");
          break;
        case "yesterday":
          startAt = moment()
            .add(-1, "days")
            .startOf("day");
          endAt = moment()
            .add(-1, "days")
            .endOf("day");
          break;
        case "thisWeek":
          startAt = moment().startOf("week");
          endAt = moment().endOf("week");
          break;
        case "lastWeek":
          startAt = moment()
            .add(-1, "weeks")
            .startOf("week");
          endAt = moment()
            .add(-1, "weeks")
            .endOf("week");
          break;
        case "civilYear":
          if (year === moment().year()) {
            startAt = moment().startOf("year");
            endAt = moment().endOf("month");
          } else {
            startAt = moment()
              .year(year)
              .startOf("year");
            endAt = moment()
              .year(year)
              .endOf("year");
          }
          break;
        case "glissanteYear":
          startAt = moment()
            .add(-1, "years")
            .startOf("day");
          endAt = moment().endOf("day");
          break;
        case "range":
          this.setState({ rangeOpen: true });
          break;
        default:
          break;
      }
    }
    this.setState({
      currentYear: endAt ? endAt.year() : null,
      rangeStart: undefined,
      rangeEnd: undefined
    });
    if (this.props.onPeriodeChange) {
      this.props.onPeriodeChange(
        startAt ? startAt.toISOString() : null,
        endAt ? endAt.toISOString() : null
      );
    }
  };

  render() {
    let printedYear = this.state.currentYear ? this.state.currentYear : moment().year();
    let years = this.allYears(this.props.startYear);
    let opt1 = [{ text: "Toujours", value: null }];
    let opt2 = [
      { text: "Aujourd'hui", value: "today" },
      { text: "Hier", value: "yesterday" },
      { text: "Cette semaine", value: "thisWeek" },
      { text: "La semaine précédente", value: "lastWeek" }
    ];
    let opt3 = [
      {
        text:
          !this.state.rangeStart || !this.state.rangeEnd
            ? "Du ../../.... au ../../.... "
            : "Du " +
              moment(this.state.rangeStart).format("DD/MM/YYYY") +
              " au " +
              moment(this.state.rangeEnd).format("DD/MM/YYYY"),
        value: "range"
      },
      { text: "Année " + printedYear, value: "civilYear" },
      {
        text: "Année glissante au " + moment().format("DD/MM"),
        value: "glissanteYear"
      }
    ];

    let periodeOptions =
      this.state.currentYear && this.state.currentYear !== moment().year()
        ? opt1.concat(opt3)
        : opt1.concat(opt2).concat(opt3);
    return (
      <React.Fragment>
        <Form>
          <Form.Group>
            <Form.Dropdown
              width={6}
              selection={true}
              options={periodeOptions.concat(this.months(printedYear))}
              value={this.state.currentOption}
              onChange={(e, d) =>
                this.onPeriodeChange(d.value, printedYear)
              }
            />
            <Form.Dropdown
              width={1}
              selection={true}
              options={years}
              value={this.state.currentYear}
              onChange={(e, d) => {
                this.setState({ currentYear: d.value });
                let option =
                  d.value === moment().year() ? "today" : "civilYear";
                this.onPeriodeChange(option, d.value);
              }}
            />
          </Form.Group>
        </Form>
        <DateRange
          open={this.state.rangeOpen}
          startAt={this.state.rangeStart}
          endAt={this.state.rangeEnd}
          onRangeChange={(startAt, endAt) => {
            this.setState({
              rangeStart: startAt,
              rangeEnd: endAt,
              currentYear: moment(endAt).year()
            });
            if (this.props.onPeriodeChange && startAt && endAt) {
              this.props.onPeriodeChange(
                moment(startAt).toISOString(),
                moment(endAt).toISOString()
              );
            }
          }}
          onClose={() => this.setState({ rangeOpen: false })}
        />
      </React.Fragment>
    );
  }
}
