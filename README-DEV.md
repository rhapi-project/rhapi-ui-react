# rhapi-ui-react

## Organisation du projet

```bash
rhapi-ui-react
|-- dist # Répertoire 'build' où les sources des composants
|        # sont compilés au format Javascript standard.
|        # C'est ce répertoire qui est mis sur la registry NPM.
|-- docs # Résultat de la documentation automatique des composants.
|-- exemples # Structure d'un répertoire d'application React
|            # obtenu par un create-react-app.
|            # Exemples d'utilisation des composants rhapi-ui-react
|            # dans une application.
|-- scripts
|   |-- makedocs.js # Script de production automatique de documentation
|   |               # des composants.
|-- src
|   |-- Groupe_de_composants_1
|   |   |-- Composant1.js # Code source JSX d'un composant
|   |   |-- Composant2.js
|   |   |-- ... # Autres composants
|   |   |-- index.js # Export des composants du groupe
|   |-- Groupe_de_composants_2
|   |-- lib # Fonctions et constantes utilisées par plusieurs
|   |       # composants de plusieurs groupes
|   |-- ... # Autres groupes
|   |-- index.js # Export de tous les groupes
|-- .babelrc # Configuration Babel
|-- .eslintrc # Configuration du Linter utilisé dans ce projet (ESLint)
|-- LICENCE
|-- package.json
|-- rollup.config.js # Configuration Rollup
```

Les sources des composants **rhapi-ui-react** se trouvent dans le répertoire `src`. Les composants React de cette librairie sont organisés par groupes (répertoires) selon les fonctionnalités qu'ils offrent.
Par exemple, les composants de gestion des actes se trouvent dans le répertoire `src/Actes` et ceux de gestion des documents dans le répertoire `src/Documents`.

Chaque groupe de composants comporte un fichier `index.js`, fichier d'exportation des composants de ce groupe. Tous les groupes sont quant à eux exportés dans le fichier `src/index.js`.
Ceci permet d'utiliser (dans les exemples ou dans votre application) les composants à la manière suivante :

```jsx
import React from "react";
import { Groupe } from "rhapi-ui-react";
... // autres import s'il y en a

export default class App extends React.Component {
  ...
  render() {
    return (
      <React.Fragment>
        {/* utilisation d'un composant rhapi-ui-react appartenant à un groupe */}
        <Groupe.Composant />
      </React.Fragment>
    );
  }
}
```

## Ajout d'un composant dans un groupe

Les composants sont organisés par fichier (un composant par fichier). Cependant, il est possible d'écrire plusieurs composants dans un seul fichier.
Lors de la création d'un nouveau composant, il faut s'assurer qu'il soit bien importé dans le fichier `index.js` du groupe et le groupe sera à son tour exporté dans `src/index.js`.

Chaque groupe devra systématiquement comporter un fichier `index.js`.

## Outils

### Babel

[Babel](https://babeljs.io/docs/en/) est un outil qui permet de compiler un code Javascript `ECMAScript2015+` en code Javascript standard interprété par les navigateurs.
Le code **JSX** des composants sera compilé en Javascript standard par **Babel**.

`.babelrc` est le fichier (par défaut) de configuration de **Babel**.

### Rollup

[Rollup](https://rollupjs.org/guide/en/) est un outil qui permet ici de compiler les composants en modules exportables et utilisables comme éléments d'une librairie.