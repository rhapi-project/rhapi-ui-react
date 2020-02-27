import React from "react";
//import PropTypes from "prop-types";
//import jsPDF from "jspdf";

export default class PDFDocument extends React.Component {
  render() {
    /*let html = "<body><div><h2>Un petit titre pour tester le HTML</h2></div></body>";
    let doc = new jsPDF();
    doc.fromHTML(html, 15, 5, {});*/
    //console.log(doc);
    //doc.save("test.pdf");
    //doc.output('pdfobjectnewwindow', { filename: "test.pdf" });
    //doc.output("pdfjsnewwindow");

    //let base64 = doc.output('datauristring', { filename: "test.pdf" });
    /*let pdfWindow = window.open("#", "_blank");
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='" + base64 + "'></iframe>"
    );*/
    //let win = window.open("#", "_blank");
    //win.document.write(base64);
    return (
      <React.Fragment>
        {/*<iframe 
          width="100%"
          height="100%"
          src={base64}
        />*/}
        Prévisualisation des documents PDF à implémenter ici
      </React.Fragment>
    );
  }
}
