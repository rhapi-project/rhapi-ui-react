# CCAM

## Table
Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.
#### Props du composant
* actes (array) : actes CCAM à afficher
* client (any, isRequired) : auto documenté
* headers (array) : en-têtes du tableau
* informations (object) : informations sur les requêtes de pagination
* onSelection (func) : callback à la sélection d'un acte
* pagination (object) : options de pagination
* showPagination (bool) : afficher les options de paginations
* table (object) : documentation semantic-ui-react [Table](https://react.semantic-ui.com/collections/table)

## Search
Composant pour la recherche des actes en CCAM retourne la liste des actes au format etc...
#### Props du composant
* client (any, isRequired) : Documentation générale pour la prop client...
* onClear (func) : callback d'une ràz
* onLoadActes (func) : 
* onSelectionChange (func) : callback pour retourner les actes sélectionnés
* search (object) : documentation semantic-ui-react [Search](https://react.semantic-ui.com/modules/search)
* searchInputLength (number) : nombre minimum de caractères pour déclencher une requête

## Pagination
Options de pagination (passées au tableau sous forme d'objet)
#### Props du composant
* btnFirstContent (string) : contenu textuel du bouton (première page)
* btnLastContent (string) : contenu textuel du bouton (dernière page)
* btnMoreContent (string) : contenu textuel du bouton (plus de résutats)
* btnNextContent (string) : contenu textuel du bouton (page suivante)
* btnPrevContent (string) : contenu textuel du bouton (page précédente)
* btnFirstIcon (string) : Semantic Icon
* btnLastIcon (string) : Semantic Icon
* btnMoreIcon (string) : Semantic Icon
* btnNextIcon (string) : Semantic Icon
* btnPrevIcon (string) : Semantic Icon
* btnFirst (object) : Props semantic bouton
* btnLast (object) : Props semantic bouton
* btnNext (object) : Props semantic bouton
* btnPrev (object) : Props semantic bouton
* btnMore (object) : Props semantic bouton
* informations (object) : Informations sur la pagination sous forme d'objet
* mode (string) : mode de pagination ('pages' ou 'more')
* onPageSelect (func) : Callback changement de page

## Tarification
Détail de la facturation d'un acte
#### Props du composant
* acte (object) : Acte CCAM sélectionné
* client (any, isRequired) : auto documenté
