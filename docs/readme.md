# CCAM

## Pagination
Options de pagination
#### Props du composant
* btnFirstContent (string) : Contenu textuel du bouton - première page
* btnLastContent (string) : Contenu textuel du bouton - dernière page
* btnNextContent (string) : Contenu textuel du bouton - page suivante
* btnPrevContent (string) : Contenu textuel du bouton - page précédente
* btnFirstIcon (string) : Semantic Icon
* btnLastIcon (string) : Semantic Icon
* btnNextIcon (string) : Semantic Icon
* btnPrevIcon (string) : Semantic Icon
* client (any, isRequired) : auto documenté
* actes (array) : Un tableau contenant les actes
* informations (object) : Informations sur la pagination sous forme d'objet
* onLoadResult (func) : Callback résultat obtenu

## Search
Composant pour la recherche des actes en CCAM retourne la liste des actes au format etc...
#### Props du composant
* client (any, isRequired) : Documentation générale pour la prop client...
* onClear (func) : callback d'une ràz
* onLoadActes (func) : 
* onSelectionChange (func) : callback pour retourner les actes sélectionnés
* search (object) : documentation semantic-ui-react [Search](https://react.semantic-ui.com/modules/search)
* searchInputLength (number) : nombre minimum de caractères pour déclencher une requête

## Table
Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.
#### Props du composant
* actes (array) : Tableau d'actes CCAM
* headers (array) : Tableau décrivant les champs à retourner dans le résultat
* onSelectionItem (func) : callback à la sélection d'un acte
* table (object) : documentation semantic-ui-react [Table](https://react.semantic-ui.com/modules/table)
