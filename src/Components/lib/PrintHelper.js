import _ from "lodash";

// component    : composant à partir duquel on fait l'impression (this)
// window       : fenêtre à imprimer (window de javascript)
// afterPrint   : callback après impression
// windowClose  : callback de fermeture de fenêtre après impression (peut être undefined)
// isPrinting   : état de l'impression (peut être undefined)
// printStatus  : callback de changement d'état de l'impression (peut être undefined)
const print = (
  component,
  window,
  afterPrint,
  windowClose,
  isPrinting,
  printStatus
) => {
  if (!isPrinting) {
    setTimeout(() => {
      if (window.qWebChannel) {
        printStatus(true);
        window.qWebChannel.webEnginePagePrint(() => {
          setTimeout(() => {
            printStatus(false);
            afterPrint();
          }, 1000);
        });
      } else {
        window.print();
      }
    }, 1000);
  }

  let mediaQueryList = window.matchMedia("print");

  // Safari mediaQueryList.addListener
  if (mediaQueryList) {
    mediaQueryList.addListener(mql => {
      if (!mql.matches) {
        if (windowClose) {
          windowClose();
        }
        afterPrint();
      }
    });
  }

  // Microsoft Internet Explorer ou Edge
  if (
    navigator.userAgent.indexOf("Edge/") !== -1 ||
    navigator.userAgent.indexOf("Trident") !== -1
  ) {
    // l'attribut "Trident" de navigator.userAgent existe
    // uniquement sur les navigateurs IE (pas Edge)
    component.browserDelay = _.isUndefined(component.browserDelay) ? 1500 : 500;

    window.onafterprint = () => {
      afterPrint();
    };
    _.delay(() => {
      window.print();
    }, component.browserDelay);
    return;
  }

  if (navigator.userAgent.indexOf("Firefox") === -1) {
    /*
    Delay requis par les navigateurs autres que Firefox :
    Firefox déclenche onload lorsque le DOM ET les CSS sont complètement chargés.
    Les autres navigateurs chargent le CSS de manière asynchrone parallèlement au DOM.
    Le trigger onload est déclenché à la fin du chargement du DOM. Le CSS semantic -
    plus volumineux - n'est alors pas toujours totalement chargé et il 
    n'est pas encore en cache à la première impression...
    => delay plus important la première fois (chargement en cache)
    */

    component.browserDelay = _.isUndefined(component.browserDelay) ? 1500 : 500;

    window.onload = () => {
      _.delay(() => {
        window.print();
      }, component.browserDelay);
    };
  } else {
    // Firefox (no delay)

    window.onload = () => {
      window.print();
    };

    // bloc à supprimer éventuellement
    window.onafterprint = () => {
      if (!_.isUndefined(windowClose)) {
        windowClose();
      }
      afterPrint();
    };
  }
};

export { print };
