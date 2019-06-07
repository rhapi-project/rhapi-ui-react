import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";

const propDefs = {
  description: "Menu d'actions à effectuer",
  example: "Dropdown",
  propDocs: {
    actions: "Tableau d'actions à afficher"
  },
  propTypes: {
    actions: PropTypes.array
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
        <Dropdown>
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
