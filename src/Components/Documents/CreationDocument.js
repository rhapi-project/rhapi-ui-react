import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Message, Modal } from "semantic-ui-react";

import _ from "lodash";

const propDefs = {
  description: "Modal Semantic contenant les options de création d'un document",
  example: "",
  propDocs: {
    idPatient:
      "identifiant du patient pour qui l'on souhaite créer un document",
    open: "ouverture de la modal",
    onClose: "Callback à la fermeture de la modal"
  },
  propTypes: {
    client: PropTypes.any.isRequired,
    idPatient: PropTypes.number,
    onClose: PropTypes.func,
    open: PropTypes.bool
  }
};

export default class CreationDocument extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    open: false
  };

  state = {
    fileName: "Nouveau document",
    model: false,
    modelCheckboxDisabled: false,
    mimeType: "text/html",
    content: "",
    creationSuccess: false
  };

  generateFilename = () => {
    let getExtension = () => {
      return this.state.mimeType.split("/")[1];
    };
    let filenameHasExtension = () => {
      let parts = this.state.fileName.split(".");
      if (parts.length > 1) {
        return true;
      }
      return false;
    };
    return filenameHasExtension()
      ? this.state.fileName
      : this.state.fileName + "." + getExtension();
  };

  importer = event => {
    if (_.get(event.target.files, "length") !== 0) {
      let file = _.get(event.target.files, "0");
      let fileReader = new FileReader();
      if (_.split(file.type, "/")[0] !== "text") {
        // conversion en base64
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          this.setState({
            fileName: file.name,
            content: fileReader.result,
            mimeType: file.type,
            model: false,
            modelCheckboxDisabled: true
          });
        };
      } else {
        fileReader.readAsText(file);
        fileReader.onload = e => {
          this.setState({
            fileName: file.name,
            content: e.target.result,
            mimeType: file.type,
            model:
              file.type.split("/")[1] !== "html" ? false : this.state.model,
            modelCheckboxDisabled:
              file.type.split("/")[1] !== "html"
                ? true
                : this.state.modelCheckboxDisabled
          });
        };
        fileReader.onerror = () => {
          return;
        };
      }
    }
  };

  createDocument = () => {
    if (_.isEmpty(this.state.fileName)) {
      return;
    }
    let idPatient = _.isNull(this.props.idPatient) ? 0 : this.props.idPatient;
    this.props.client.Documents.create(
      {
        fileName: this.generateFilename(),
        idPatient: idPatient,
        mimeType: this.state.model
          ? "text/x-html-template"
          : this.state.mimeType,
        document: this.state.content
      },
      result => {
        //console.log(result);
        this.props.client.Actes.create(
          {
            code: "#DOC_" + _.toUpper(result.mimeType.split("/")[1]),
            etat: 0,
            idPatient: idPatient,
            description: result.fileName,
            idDocument: result.id
          },
          res => {
            //console.log(res);
            this.setState({ creationSuccess: true });
          },
          err => {
            console.log(err);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <Modal size="tiny" open={this.props.open}>
          <Modal.Header>Création d'un document</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Nom du document"
                placeholder="Entrer le nom du document"
                value={this.state.fileName}
                onChange={(e, d) => this.setState({ fileName: d.value })}
              />
              <Form.Checkbox
                label="Utiliser comme modèle"
                disabled={this.state.modelCheckboxDisabled}
                checked={this.state.model}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Importer"
              onClick={() => {
                document.getElementById("file").click();
              }}
            />
            <Button content="Créer" onClick={() => this.createDocument()} />
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.setState({
                    fileName: "Nouveau document",
                    mimeType: "text/html",
                    model: false,
                    modelCheckboxDisabled: false
                  });
                  this.props.onClose();
                }
              }}
            />
          </Modal.Actions>
        </Modal>

        {/* upload d'un document */}
        <input id="file" type="file" hidden={true} onChange={this.importer} />

        <Modal size="tiny" open={this.state.creationSuccess}>
          <Modal.Content>
            <Message
              positive={true}
              icon="check"
              header="Création d'un document"
              content={
                "Le document '" +
                this.state.fileName +
                "' a été créé avec succès"
              }
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="OK"
              onClick={() => {
                this.setState({
                  fileName: "Nouveau document",
                  mimeType: "text/html",
                  creationSuccess: false,
                  model: false,
                  modelCheckboxDisabled: false
                });
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
