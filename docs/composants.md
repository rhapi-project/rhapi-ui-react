# CCAM

## Tarification
Détail de la facturation d'un acte
#### Props du composant
| Props | Description |
| ---- | ------ |
| codActe (string) | code Acte CCAM |
| codActivite (string) | code de l'activité |
| codDom (number) | code DOM |
| codGrille (number) | code grille |
| codPhase (number) | code phase |
| client (any, isRequired) | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| date (instanceOf(Date)) | date de la tarification |
| dynamic (bool) | activation de la tarification dynamique |

## Search
Composant pour la recherche des actes en CCAM. Retourne la liste des actes sous forme d'un tableau d'objets JSON.
#### Props du composant
| Props | Description |
| ---- | ------ |
| client (any, isRequired) | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| onClear (func) | callback d'une ràz |
| onLoadActes (func) | callback résultat de la recherche |
| onSelectionChange (func) | callback pour retourner l'acte sélectionné |
| search (object) | documentation semantic-ui-react [Search](https://react.semantic-ui.com/modules/search) |
| searchInputLength (number) | nombre minimum de caractères pour déclencher la recherche d'actes |

## Table
Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.
#### Props du composant
| Props | Description |
| ---- | ------ |
| actes (array) | actes CCAM à afficher |
| client (any, isRequired) | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| headers (array) | en-têtes du tableau |
| informations (object) | se référer à la documentation RHAPI sur la pagination |
| onSelection (func) | callback à la sélection d'un acte |
| onPageSelect (func) | callback changement de page |
| showPagination (bool) | afficher les options de paginations |
| table (object) | documentation semantic-ui-react [Table](https://react.semantic-ui.com/collections/table) |
