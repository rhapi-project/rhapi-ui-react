import html2canvas from "html2canvas";
import jsPDF from "jspdf";

class Functions {
  BinaryFiles = {
    download: (base64, filename) => {
      let a = document.createElement("a");
      a.href = base64;
      a.download = filename;
      a.click();
    }
  };

  PDF = {
    download: (content, filename) => {
      let doc = new jsPDF();
      doc.fromHTML(content, 15, 5, {});
      doc.save(filename + ".pdf");
    },
    // output dans un autre onglet
    // attention : ne fonctionne pas sur Windows Edge
    output: content => {
      let doc = new jsPDF();
      doc.fromHTML(content, 15, 5, {});
      let base64 = doc.output("datauristring", { filename: "output.pdf" });
      let pdfWindow = window.open("#", "_blank");
      pdfWindow.document.write(
        "<iframe width='100%' height='100%' src='" + base64 + "'></iframe>"
      );
    },
    toBase64: content => {
      let doc = new jsPDF();
      doc.fromHTML(content, 15, 5, {});
      return doc.output("datauristring");
    },
    experimentalDownload: (content, filename) => {
      let doc = document.createElement("div");
      doc.innerHTML = content;

      html2canvas(doc, {
        /*onclone: document => {
          console.warn(document);
        },*/
        /*allowTaint: true,*/
        onrendered: canvas => {
          const imgData = canvas.toDataURL("image/png");
          const docu = new jsPDF("p", "mm", [297, 210]); //210mm wide and 297mm high - A4

          docu.addImage(imgData, "PNG", 10, 10);
          docu.save(filename + ".pdf");
        }
      });

      /*html2canvas(doc, {
        onclone: document => {
          console.log(document);
        }
      })
      .then(canvas => {
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(img, "PNG", 10, 10);
        pdf.save(filename + ".pdf");
      });*/
    }
  };
}

export default Functions;
