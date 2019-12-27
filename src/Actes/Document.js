import React from "react";

//import "jodit";
//import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";
export default class Document extends React.Component {
  editor = React.createRef();
  render() {
    return (
      <React.Fragment>
        {/*<JoditEditor
          //ref={this.editor}
          //value
          config={{
            readonly: false
          }}
          onChange={() => {}}
        />*/}
        Composant Document...
      </React.Fragment>
    );
  }
}
