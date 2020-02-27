# rhapi-ui-react

[![NPM](https://img.shields.io/npm/v/rhapi-ui-react?color=brightgreen&logo=npm)](https://www.npmjs.com/package/rhapi-ui-react)

## Organisation du projet

```bash
rhapi-ui-react
├── dist # Répertoire où les sources des composants
|        # sont compilés au format Javascript standard.
|        # C'est ce répertoire qui est mis sur la registry NPM.
├── docs
|   └── composants.md # Résultat de la documentation automatique des composants
├── public
|   ├── ...
|   └── index.html
├── scripts
|   └── makedocs.js # Script NODE de production automatique de documentation
|                   # des composants.
├── src
|   ├── Components
|   |   ├── Groupe_de_composants_1
|   |   |   ├── Composant1.js # Code source JSX d'un composant
|   |   |   ├── Composant2.js
|   |   |   ├── ... # Autres composants
|   |   |   └── index.js # Export des composants du groupe
|   |   ├── Groupe_de_composants_2
|   |   ├── ... # Autres groupes
|   |   ├── lib # Fonctions et constantes utilisées par plusieurs
|   |   |       # composants de plusieurs groupes
|   |   └── index.js # Export de tous les groupes
|   ├── exemples
|   |   ├── Exemples_groupe_1
|   |   |   ├── Exemple1.js
|   |   |   ├── Exemple2.js
|   |   |   └── ... # Autres exemples d'utilisation des composants du
|   |   |           # groupe 1
|   |   ├── Exemples_groupe_2
|   |   ├── ... # Autres exemples
|   |   └── App.js # Composant principal - point d'entrée sur tous les exemples
|   └── index.js
├── .babelrc # Configuration Babel
├── .eslintrc # Configuration du Linter utilisé dans ce projet (ESLint)
└── package.json
```

Les sources des composants **rhapi-ui-react** se trouvent dans le répertoire `src/Components`. Les composants React de cette librairie sont organisés par groupes (répertoires) selon les fonctionnalités qu'ils offrent.
Par exemple, les composants de gestion des actes se trouvent dans le répertoire `src/Components/Actes` et ceux de gestion des documents dans le répertoire `src/Components/Documents`.

Pour ajouter les composants dans le répertoire `dist` :
```bash
npm run build
```

Chaque groupe de composants comporte un fichier `index.js`, fichier d'exportation des composants de ce groupe. Tous les groupes sont quant à eux exportés dans le fichier `src/Components/index.js`.
Ceci permet d'utiliser les composants dans votre application à la manière suivante :

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

### win-node-env (dépendance optionnelle)

Par défaut la variable d'environnement `NODE_ENV` n'est pas reconnue sur **Windows** (voir dans `package.json` le script *build*).
Cette dépendence ne sera installée que si l'on se trouve sur un Système d'exploitation Windows pour pallier le problème.

Plus sur cet outil : [win-node-env](https://github.com/laggingreflex/win-node-env).

## Publication sur NPM

```bash
cd rhapi-ui-react-master
npm install
npm run build
# npm login # s'authentifier sur NPM
npm publish
```
