import React from "react";
import PropTypes from "prop-types";
import { Button, Grid, Icon } from "semantic-ui-react";

import Localisation from "./Localisation";

import _ from "lodash";

const propDefs = {
  description:
    "Grille de saisie des localisations dentaires",
  example: "Grille",
  propDocs: {
    dents: "Liste des dents sélectionnées. Par défaut \"\"",
    onSelection: "Callback à la selection d'une liste de dents"
  },
  propTypes: {
    dents: PropTypes.string,
    onSelection: PropTypes.func
  }
};

export default class Localisations extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    dents: ""
  };

  componentWillMount() {
    this.setState({
      multSelection: !_.isEmpty(this.props.dents),
      selected: _.split(this.props.dents, " ")
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
    if (!_.isUndefined(this.props.onSelection)) {
      this.setState({ multSelection: false, selected: [] });
      this.props.onSelection(res);
    }
  };

  render() {
    let padding = "3px";
    let clean = (
      <div>
        <Button icon={true} onClick={(e, d) => { this.setState({ selected: [] })}}>
          <Icon name="ban" color="red"/>
        </Button>
      </div>
    );
    let check = (
      <div>
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
    );
    return(
      <React.Fragment>
        <Grid>
          {/* 1ère ligne */}
          <Grid.Row stretched={true} centered={true} style={{ padding: padding }}>
            <Grid.Column>{clean}</Grid.Column>
            <Grid.Column>
              <Localisation content="01" isSelected={this.isSelected("01")} onClick={d => this.selection(d)}/>
            </Grid.Column>
            <Grid.Column>{check}</Grid.Column>  
          </Grid.Row>

          {/* Quadrant */}
          <Grid.Row divided={true} stretched={true} centered={true} style={{ padding: padding }}>
            {_.map(["10","20"], num => 
              <Grid.Column key={num} textAlign="center" width={5}>
                <Localisation content={num} isSelected={this.isSelected(num)} onClick={d => this.selection(d)} />
              </Grid.Column>
            )}
          </Grid.Row>

          {/* Sextant */}
          <Grid.Row divided={true} stretched={true} centered={true} style={{ padding: padding }}>
            <Grid.Column textAlign="center" width={3}>
              <Localisation content="03" isSelected={this.isSelected("03")} onClick={d => this.selection(d)} />
            </Grid.Column>
            <Grid.Column textAlign="center" width={4}>
              <Localisation content="04" isSelected={this.isSelected("04")} onClick={d => this.selection(d)} />
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <Localisation content="05" isSelected={this.isSelected("05")} onClick={d => this.selection(d)} />
            </Grid.Column>
          </Grid.Row>

          {/* Intérieur 18-28 */}
          <Grid.Row divided={true} centered={true} style={{ padding: padding }}>
            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["18","17","16","15","14"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["13","12","11"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["21","22","23"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["24","25","26","27","28"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* 55-65 */}
          <Grid.Row divided={true} centered={true} style={{ padding: padding }}>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["55","54"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["53","52","51"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["61","62","63"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["64","65"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* 85-75 */}
          <Grid.Row divided={true} centered={true} style={{ padding: padding }}>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["85","84"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["83","82","81"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["71","72","73"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["74","75"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Intérieur 48-38 */}
          <Grid.Row divided={true} centered={true} style={{ padding: padding }}>
            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["48","47","46","45","44"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["43","42","41"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={2}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["31","32","33"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
            <Grid.Column textAlign="center" width={4}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {_.map(["34","35","36","37","38"], num =>
                  <Localisation
                    key={num}
                    content={num}
                    isSelected={this.isSelected(num)}
                    onClick={d => this.selection(d)}
                  />
                )}
              </div>
            </Grid.Column>
          </Grid.Row>

          {/* Sextant */}
          <Grid.Row divided={true} stretched={true} centered={true} style={{ padding: padding }}>
            <Grid.Column textAlign="center" width={3}>
              <Localisation content="08" isSelected={this.isSelected("08")} onClick={d => this.selection(d)} />
            </Grid.Column>
            <Grid.Column textAlign="center" width={4}>
              <Localisation content="07" isSelected={this.isSelected("07")} onClick={d => this.selection(d)} />
            </Grid.Column>
            <Grid.Column textAlign="center" width={3}>
              <Localisation content="06" isSelected={this.isSelected("06")} onClick={d => this.selection(d)} />
            </Grid.Column>
          </Grid.Row>

          {/* Quadrant */}
          <Grid.Row divided={true} stretched={true} centered={true} style={{ padding: padding }}>
            {_.map(["40","30"], num => 
              <Grid.Column key={num} textAlign="center" width={5}>
                <Localisation content={num} isSelected={this.isSelected(num)} onClick={d => this.selection(d)} />
              </Grid.Column>
            )}
          </Grid.Row>

          {/* Dernière ligne */}
          <Grid.Row stretched={true} centered={true} style={{ padding: padding }}>
            <Localisation content="02" isSelected={this.isSelected("02")} onClick={d => this.selection(d)}/>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )  
  }

}