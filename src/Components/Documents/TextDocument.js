// CKeditor 4
import CKEditor from "ckeditor4-react";
import _ from "lodash";
import Mustache from "mustache"; // moteur de template
import PropTypes from "prop-types";
import React from "react";
import { Form, TextArea } from "semantic-ui-react";

const propDefs = {
  description: "Manupulation d'un document sous format texte",
  example: "",
  propDocs: {
    data:
      "un objet qui contient les données à utiliser pour le remplissage automatique des champs dynamiques",
    document: "contenu d'un document au format texte",
    mode: "mode d'édition du document : html|plain|rtf",
    onEdit: "Callback à la modification du texte"
  },
  propTypes: {
    data: PropTypes.object,
    document: PropTypes.string,
    mode: PropTypes.string,
    onEdit: PropTypes.func
  }
};

// custom CKEditor toolbar
// https://ckeditor.com/latest/samples/toolbarconfigurator/index.html#advanced

export default class TextDocument extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    data: {}
  };

  componentDidMount() {
    this.setState({ document: this.props.document });
  }

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
            data={
              !_.isEmpty(this.props.data)
                ? Mustache.render(this.props.document, this.props.data)
                : this.props.document
            }
            onChange={e => {
              if (this.props.onEdit) {
                this.props.onEdit(e.editor.getData());
              }
            }}
            config={{
              //toolbar: toolbarConfig
              // https://ckeditor.com/docs/ckeditor4/latest/guide/dev_acf.html
              allowedContent: true
            }}
          />
        ) : this.props.mode === "rtf" ? (
          <React.Fragment>{this.props.document}</React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}
