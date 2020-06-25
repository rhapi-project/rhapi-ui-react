// CKeditor 4
import CKEditor from "ckeditor4-react";
import PropTypes from "prop-types";
import React from "react";
import { Form, TextArea } from "semantic-ui-react";

const propDefs = {
  description: "Visualiseur d'un document sous format texte",
  example: "",
  propDocs: {
    document: "contenu d'un document au format texte",
    mode: "mode d'édition du document : html ou plain",
    onEdit: "Callback à la modification du texte"
  },
  propTypes: {
    document: PropTypes.string,
    mode: PropTypes.string,
    onEdit: PropTypes.func
  }
};

// custom CKEditor toolbar
// https://ckeditor.com/latest/samples/toolbarconfigurator/index.html#advanced

export default class TextDocument extends React.Component {
  static propTypes = propDefs.propTypes;

  render() {
    return (
      <React.Fragment>
        {this.props.mode === "plain" ? (
          <Form>
            <TextArea
              value={this.props.document}
              rows={6}
              onChange={(e, d) => {
                if (this.props.onEdit) {
                  this.props.onEdit(d.value);
                }
              }}
            />
          </Form>
        ) : this.props.mode === "html" ? (
          <CKEditor
            onBeforeLoad={editor => {
              // https://github.com/ckeditor/ckeditor4-react/issues/57#issuecomment-520377696
              editor.disableAutoInline = true;
            }}
            data={this.props.document}
            onChange={e => {
              if (this.props.onEdit) {
                this.props.onEdit(e.editor.getData());
              }
            }}
            type="full"
            config={{
              //toolbar: toolbarConfig
              // https://ckeditor.com/docs/ckeditor4/latest/guide/dev_acf.html
              allowedContent: true,
              height: window.screen.height / 2
            }}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
