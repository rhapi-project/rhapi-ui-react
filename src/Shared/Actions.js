import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Menu d'actions à effectuer",
  example: "Dropdown",
  propDocs: {
    actions: "Tableau contenant une liste d'actions",
    dropdown: "semantic.modules",
    id: "Identifiant de la ligne sur laquelle une action est effectuée"
  },
  propTypes: {
    actions: PropTypes.array,
    dropdown: PropTypes.object,
    id: PropTypes.any
  }
};

export default class Actions extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    actions: [],
    dropdown: {},
    id: 0
  };

  render() {
    return (
      <React.Fragment>
        <Dropdown {...this.props.dropdown}>
          <Dropdown.Menu>
            {_.map(this.props.actions, action => (
              <Dropdown.Item
                key={action.text}
                icon={action.icon}
                text={action.text}
                onClick={() => {
                  if (!_.isUndefined(this.props.id)) {
                    action.action(this.props.id);
                  }
                }}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    );
  }
}
