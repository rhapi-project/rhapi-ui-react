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

const mimeTypes = [
  { text: "text/x-html-template", value: "text/x-html-template" },
  { text: "text/plain", value: "text/plain" }
];

const extensions = [
  { text: "html", value: "html" },
  { text: "txt", value: "txt" }
];

export default class CreationDocument extends React.Component {
  static propTypes = propDefs.propTypes;
  static defaultProps = {
    open: false
  };

  state = {
    fileName: "",
    extension: "html",
    mimeType: "text/x-html-template",
    content: "", // contenu en base64 si c'est un fichier binaire
    creationSuccess: false
  };

  createDocument = () => {
    if (_.isEmpty(this.state.fileName)) {
      return;
    }
    if (
      this.state.mimeType !== "text/x-html-template" &&
      _.isNull(this.props.idPatient)
    ) {
      return;
    }
    this.props.client.Documents.create(
      {
        fileName: this.state.fileName + "." + this.state.extension,
        idPatient:
          this.state.mimeType === "text/x-html-template"
            ? 0
            : this.props.idPatient,
        mimeType: this.state.mimeType,
        document: this.state.content
      },
      result => {
        //console.log(result);
        this.setState({ creationSuccess: true });
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
              <Form.Group widths="equal">
                <Form.Dropdown
                  label="Type - document"
                  selection={true}
                  options={mimeTypes}
                  onChange={(e, d) => this.setState({ mimeType: d.value })}
                  value={this.state.mimeType}
                />
                <Form.Dropdown
                  label="Extension"
                  selection={true}
                  options={extensions}
                  onChange={(e, d) => this.setState({ extension: d.value })}
                  value={this.state.extension}
                />
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Parcourir"
              onClick={() => {
                document.getElementById("file").click();
              }}
            />
            <Button content="Créer" onClick={() => this.createDocument()} />
            <Button
              content="Annuler"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            />
          </Modal.Actions>
        </Modal>

        {/* upload d'un document */}
        <input
          id="file"
          type="file"
          //accept="image/*"
          hidden={true}
          onChange={e => {
            if (_.get(e.target.files, "length") !== 0) {
              let file = _.get(e.target.files, "0");
              //console.log(file);
              let content = "";
              let fileReader = new FileReader();

              // TODO : gérer plusieurs types de fichiers
              // par exemple les document textuels
              // html ou plain text etc.
              if (_.split(file.type, "/")[0] === "application") {
                //console.log("on passe ici car application");
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                  //console.log("conversion en base64");
                  content = fileReader.result;
                  //console.log(content);
                };
              } /* else if (_.split(file.type, "/")[0] === "text") {

              }*/

              this.setState({
                fileName: file.name,
                mimeType: file.type,
                extension: _.split(file.type, "/")[1],
                document: content
              });
            }
          }}
        />

        <Modal size="tiny" open={this.state.creationSuccess}>
          <Modal.Content>
            <Message
              positive={true}
              icon="check"
              header="Création d'un document"
              content={
                "Le document '" +
                this.state.fileName +
                "." +
                this.state.extension +
                "' a été créé avec succès"
              }
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="OK"
              onClick={() => {
                this.setState({ fileName: "", creationSuccess: false });
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
