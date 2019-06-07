import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";

const propDefs = {
  description: "Menu d'actions à effectuer",
  example: "Dropdown",
  propDocs: {
    actions: "Tableau d'actions à afficher",
    onClick: "Action clic"
  },
  propTypes: {
    actions: PropTypes.array,
    onClick: PropTypes.func
  }
};

export default class Actions extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actions: []
  };

  render() {
    return (
      <React.Fragment>
        <Dropdown onClick={this.props.onClick}>
          <Dropdown.Menu>
            {_.map(this.props.actions, action => (
              <Dropdown.Item
                key={action.text}
                icon={action.icon}
                text={action.text}
                onClick={action.action}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    );
  }
}
