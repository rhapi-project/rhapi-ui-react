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

  input = null;

  state = {
    montant: tarif(this.props.montant)
  };

  componentDidMount() {
    let input = this.input.firstChild;
    input.style.textAlign = "right";
    input.addEventListener("keypress", this.validation);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.montant !== this.props.montant) {
      this.setState({ montant: tarif(this.props.montant) });
    }
  }

  componentWillUnmount() {
    let input = this.input.firstChild;
    input.removeEventListener("keypress", this.validation);
  }

  handleChange = montant => {
    if (this.props.onChange) {
      let montantFloat = parseFloat(tarifDotNotation(montant));
      if (_.isNaN(montantFloat)) {
        return;
      }
      this.props.onChange(montantFloat);
    }
  };
  validation = event => {
    if (event.key === "Enter") {
      this.handleChange(this.state.montant);
    }
  };

  render() {
    let propsInput = this.props.input;
    _.unset(propsInput, "id");
    _.unset(propsInput, "value");
    _.unset(propsInput, "onChange");
    let montant = this.state.montant;
    return (
      <Ref innerRef={node => (this.input = node)}>
        <Input
          {...propsInput}
          value={this.state.montant}
          onFocus={() => {
            let input = this.input.firstChild;
            input.select();
          }}
          onBlur={() => this.handleChange(montant)}
          onChange={(e, d) => {
            this.setState({ montant: d.value });
          }}
        />
      </Ref>
    );
  }
}
