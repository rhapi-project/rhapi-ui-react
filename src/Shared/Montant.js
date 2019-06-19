import React from "react";
import PropTypes from "prop-types";
import { Input, Ref } from "semantic-ui-react";
import { tarif, tarifDotNotation } from "../lib/Helpers";

import _ from "lodash";

const propDefs = {
  description: "Input de saisie d'un montant au format français",
  example: "Montant",
  propDocs: {
    input: "semantic.elements",
    montant: "Montant affiché",
    onChange: "Callback au changement du montant"
  },
  propTypes: {
    input: PropTypes.object,
    montant: PropTypes.number,
    onChange: PropTypes.func
  }
};

export default class Montant extends React.Component {
  static propTypes = propDefs.input;
  static defaultProps = {
    montant: 0
  };
  componentWillMount() {
    this.setState({
      montant: tarif(this.props.montant)
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      montant: tarif(next.montant)
    });
  }

  componentDidMount() {
    let input = document.getElementById("inputMontant");
    input.addEventListener("keypress", this.validation);
    //document.addEventListener("mousedown", this.validation);
  }

  componentWillUnmount() {
    let input = document.getElementById("inputMontant");
    input.removeEventListener("keypress", this.validation);
    //document.removeEventListener("mousedown", this.validation);
  }

  handleChange = () => {
    if (this.props.onChange) {
      let montantFloat = parseFloat(tarifDotNotation(this.state.montant));
      if (_.isNaN(montantFloat)) {
        return;
      }
      this.props.onChange(montantFloat);
    }
  };
  validation = event => {
    if (event.key === "Enter") {
      this.handleChange();
    }
  };

  render() {
    let propsInput = this.props.input;
    _.unset(propsInput, "id");
    _.unset(propsInput, "value");
    _.unset(propsInput, "onChange");
    return (
      <Ref
        innerRef={node => {
          node.firstChild.style.textAlign = "right";
        }}
      >
        <Input
          id="inputMontant"
          {...propsInput}
          value={this.state.montant}
          onFocus={() => {
            let input = document.getElementById("inputMontant");
            input.select();
          }}
          onBlur={() => this.handleChange()}
          onChange={(e, d) => {
            this.setState({ montant: d.value });
          }}
        />
      </Ref>
    );
  }
}
