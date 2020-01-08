import React from "react";

//import "jodit";
//import "jodit/build/jodit.min.css";
//import JoditEditor from "jodit-react";

// Require Editor JS files.
//import 'froala-editor/js/froala_editor.pkgd.min.js';
//import "froala-editor/css/froala_editor.pkgd.min.css";

// Require Editor CSS files.
//import 'froala-editor/css/froala_style.min.css';
//import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
//import 'font-awesome/css/font-awesome.css';

//import FroalaEditor from 'react-froala-wysiwyg';

//import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

// CKeditor 4
import CKEditor from "ckeditor4-react";

export default class Document extends React.Component {
  state = {
    data: ""
  }
  
  /*updateContent = value => {
		this.setState({ content: value });
  };

  jodit;
  setRef = jodit => (this.jodit = jodit);
  
  config = {
		readonly: false // all options from https://xdsoft.net/jodit/doc/
	};*/
  //editor = React.createRef();
  render() {
    /*const editor = useRef(null);
    const [content, setContent] = useState('');
    
    const config = {
      readonly: false // all options from https://xdsoft.net/jodit/doc/
    }
    try {
      
      const jodit = (
        <JoditEditor
          //ref={editor}
          editorRef={}
          value={content}
          config={config}
		      tabIndex={1} // tabIndex of textarea
		      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={newContent => setContent(newContent)}
        />
      );
      //jodit.ref = undefined;
      //console.log(jodit.ref);
      return (
        <React.Fragment>
          {jodit}
        </React.Fragment>
      )
    } catch (error) {
      console.log("affichage de l'erreur");
      console.log(error);
    }*/

    console.log(this.state.data);
    
    return (
      <React.Fragment>
        {/*<JoditEditor
          editorRef={this.setRef}
          value={this.state.content}
          config={this.config}
          onChange={this.updateContent}
          styleName="textarea"
          Name="body"
        />*/}
        {/*<FroalaEditor
          //language="fr"
          //id="froala-editor"
          //toolbarButtons={['bold', 'italic', 'html']}
          document={true}
          modes={{
            documentReady: true
          }}
        />*/}
        <div style={{ marginTop: "40px" }}/>
        {/*<CKEditor
          id="doc"
          editor={DecoupledEditor}
          onInit={ editor => {
            console.log(editor);
            editor.locale.uiLanguage = "fr";
            editor.locale.contentLanguage = "fr";
            // Insert the toolbar before the editable area.
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
          }}
          onChange={ ( event, editor ) => console.log( { event, editor } ) }
          data="<p>Hello from CKEditor 5's DecoupledEditor!</p>"
          uiLanguage="fr"
          language={{ ui: "fr", content: "fr" }}
        />*/}
        

        <CKEditor 
          data={this.state.content}
          onChange={e => {
            this.setState({ data: e.editor.getData() });
          }}
        />
      </React.Fragment>
    );
  }
}
