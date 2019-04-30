import React from "react";
import PropTypes from "prop-types";
import { Button, Grid, Icon } from "semantic-ui-react";

import _ from "lodash";
import { isUndefined } from "util";

const propDefs = {
  description:
    "Grille de saisie des localisations dentaires",
  example: "Grille",
  propDocs: {
    onSelection: "Callback à la selection d'une liste de dents"
  },
  propTypes: {
    onSelection: PropTypes.func
  }
};

export default class GrilleDents extends React.Component {
  componentWillMount() {
    this.setState({
      multSelection: false,
      selected: []
    });
  };

  isSelected = val => {
    return _.includes(this.state.selected, val);
  };

  selection = val => {
    let s = this.state.selected;
    if (this.isSelected(val)) {
      let i = _.indexOf(s, val);
      s.splice(i, 1);
      this.setState({
        selected: s
      });
    } else {
      s.push(val);
      this.setState({ selected: s });
      if (!this.state.multSelection) {
        this.finish();
      }
    }
  };

  finish = () => {
    let res = this.state.selected.join(" ");
    if (!isUndefined(this.props.onSelection)) {
      this.setState({ multSelection: false, selected: [] });
      this.props.onSelection(res);
    }
  };

  render() {
    return(
      <React.Fragment>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
          <Button icon={true} onClick={(e, d) => { this.setState({ selected: [] })}}>
            <Icon name="ban" color="red"/>
          </Button>
          <Button
            icon={true}
            onClick={(e, d) => {
              if (this.state.multSelection) {
                this.finish();
              } else {
                this.setState({ multSelection: true });
              }
            }}>
            {this.state.multSelection
              ? <Icon name="check" color="green"/>
              : <Icon name="add"/>
            }
          </Button>
        </div>
        <Grid>
          {/* 1ère ligne */}
          <Grid.Row stretched={true} centered={true}>
            <Grid.Column textAlign="center">
              <div>
                <Button
                  basic={!this.isSelected("01")}
                  primary={this.isSelected("01")}
                  content="01"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Quadrant */}
          <Grid.Row divided={true} stretched={true} centered={true}>
            <Grid.Column textAlign="center" width={5}>
              <div>
                <Button
                  basic={!this.isSelected("10")}
                  primary={this.isSelected("10")}
                  content="10"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={5}>
              <div>
                <Button
                  basic={!this.isSelected("20")}
                  primary={this.isSelected("20")}
                  content="20"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Sextant */}
          <Grid.Row divided={true} stretched={true} centered={true}>
            <Grid.Column textAlign="center" width={3}>
              <div>
                <Button
                  basic={!this.isSelected("03")}
                  primary={this.isSelected("03")}
                  content="03"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={4}>
              <div>
                <Button
                  basic={!this.isSelected("04")}
                  primary={this.isSelected("04")}
                  content="04"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <div>
                <Button
                  basic={!this.isSelected("05")}
                  primary={this.isSelected("05")}
                  content="05"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Intérieur 18-28 */}
          <Grid.Row divided={true} centered={true}>
            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("18")}
                  primary={this.isSelected("18")}
                  content="18"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("17")}
                  primary={this.isSelected("17")}
                  content="17"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("16")}
                  primary={this.isSelected("16")}
                  content="16"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("15")}
                  primary={this.isSelected("15")}
                  content="15"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("14")}
                  primary={this.isSelected("14")}
                  content="14"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("13")}
                  primary={this.isSelected("13")}
                  content="13"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("12")}
                  primary={this.isSelected("12")}
                  content="12"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("11")}
                  primary={this.isSelected("11")}
                  content="11"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("21")}
                  primary={this.isSelected("21")}
                  content="21"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("22")}
                  primary={this.isSelected("22")}
                  content="22"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("23")}
                  primary={this.isSelected("23")}
                  content="23"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("24")}
                  primary={this.isSelected("24")}
                  content="24"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("25")}
                  primary={this.isSelected("25")}
                  content="25"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("26")}
                  primary={this.isSelected("26")}
                  content="26"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("27")}
                  primary={this.isSelected("27")}
                  content="27"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("28")}
                  primary={this.isSelected("28")}
                  content="28"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* 55-65 */}
          <Grid.Row divided={true} centered={true}>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("55")}
                  primary={this.isSelected("55")}
                  content="55"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("54")}
                  primary={this.isSelected("54")}
                  content="54"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("53")}
                  primary={this.isSelected("53")}
                  content="53"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("52")}
                  primary={this.isSelected("52")}
                  content="52"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("51")}
                  primary={this.isSelected("51")}
                  content="51"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("61")}
                  primary={this.isSelected("61")}
                  content="61"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("62")}
                  primary={this.isSelected("62")}
                  content="62"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("63")}
                  primary={this.isSelected("63")}
                  content="63"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("64")}
                  primary={this.isSelected("64")}
                  content="64"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("65")}
                  primary={this.isSelected("65")}
                  content="65"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* 85-75 */}
          <Grid.Row divided={true} centered={true}>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("85")}
                  primary={this.isSelected("85")}
                  content="85"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("84")}
                  primary={this.isSelected("84")}
                  content="84"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("83")}
                  primary={this.isSelected("83")}
                  content="83"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("82")}
                  primary={this.isSelected("82")}
                  content="82"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("81")}
                  primary={this.isSelected("81")}
                  content="81"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("71")}
                  primary={this.isSelected("71")}
                  content="71"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("72")}
                  primary={this.isSelected("72")}
                  content="72"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("73")}
                  primary={this.isSelected("73")}
                  content="73"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("74")}
                  primary={this.isSelected("74")}
                  content="74"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("75")}
                  primary={this.isSelected("75")}
                  content="75"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Intérieur 48-38 */}
          <Grid.Row divided={true} centered={true}>
            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("48")}
                  primary={this.isSelected("48")}
                  content="48"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("47")}
                  primary={this.isSelected("47")}
                  content="47"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("46")}
                  primary={this.isSelected("46")}
                  content="46"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("45")}
                  primary={this.isSelected("45")}
                  content="45"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("44")}
                  primary={this.isSelected("44")}
                  content="44"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("43")}
                  primary={this.isSelected("43")}
                  content="43"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("42")}
                  primary={this.isSelected("42")}
                  content="42"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("41")}
                  primary={this.isSelected("41")}
                  content="41"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("31")}
                  primary={this.isSelected("31")}
                  content="31"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("32")}
                  primary={this.isSelected("32")}
                  content="32"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("33")}
                  primary={this.isSelected("33")}
                  content="33"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>

            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  basic={!this.isSelected("34")}
                  primary={this.isSelected("34")}
                  content="34"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("35")}
                  primary={this.isSelected("35")}
                  content="35"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("36")}
                  primary={this.isSelected("36")}
                  content="36"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("37")}
                  primary={this.isSelected("37")}
                  content="37"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
                <Button
                  basic={!this.isSelected("38")}
                  primary={this.isSelected("38")}
                  content="38"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Sextant */}
          <Grid.Row divided={true} stretched={true} centered={true}>
            <Grid.Column textAlign="center" width={3}>
              <div>
                <Button
                  basic={!this.isSelected("08")}
                  primary={this.isSelected("08")}
                  content="08"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={4}>
              <div>
                <Button
                  basic={!this.isSelected("07")}
                  primary={this.isSelected("07")}
                  content="07"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <div>
                <Button
                  basic={!this.isSelected("06")}
                  primary={this.isSelected("06")}
                  content="06"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Quadrant */}
          <Grid.Row divided={true} stretched={true} centered={true}>
            <Grid.Column textAlign="center" width={5}>
              <div>
                <Button
                  basic={!this.isSelected("40")}
                  primary={this.isSelected("40")}
                  content="40"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={5}>
              <div>
                <Button
                  basic={!this.isSelected("30")}
                  primary={this.isSelected("30")}
                  content="30"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Dernière ligne */}
          <Grid.Row stretched={true} centered={true}>
            <Grid.Column textAlign="center">
              <div>
                <Button
                  basic={!this.isSelected("02")}
                  primary={this.isSelected("02")}
                  content="02"
                  icon={true}
                  onClick={(e, d) => this.selection(d.content)}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )  
  }

}