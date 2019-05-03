import React from "react";
import PropTypes from "prop-types";
import { Button } from "semantic-ui-react";

export default class Localisation extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }
  render() {
    return(
      <div>
        <Button
          basic={!this.props.isSelected}
          primary={this.props.isSelected}
          content={this.props.content}
          icon={true}
          onClick={(e, d) => this.props.onClick(d.content)}
        />
      </div>
    )
  }
}