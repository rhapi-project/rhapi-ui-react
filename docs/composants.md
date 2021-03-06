# CCAM
# Actes
# Shared
# Documents

## Detail
Aperçu du détail d'un acte tarifé
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| detail | object | Objet contenant le détail d'un acte. Toutes les informations sur un acte tarifé, la date, l'activité, la grille de tarification, les modificateurs appliqués, la phase et le tarif. |

## Search
Composant pour la recherche des actes en CCAM (par code CCAM ou mot-clé). Le résultat de la recherche est une liste des actes sous forme d'un tableau d'objets JSON. 
La recherche n'est pas effectuée si la date ou la localisation sont NULL.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| date | string | Date effective de l'acte au format ISO. Par défaut date du jour |
| executant | string | Limiter la recherche aux seuls actes d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| limit | number | Valeur de pagination |
| localisation | string | Limiter la recherche aux actes concernant les dents renseignées selon la norme internationale ISO-3950, sans séparateur entre les numéros des dents (par exemple localisation=1121 pour les deux incisives centrales maxillaires ou localisation=18 pour la dent de sagesse maxillaire droite) |
| onClear | func | Callback d'une ràz |
| onLoadActes | func | Callback résultat de la recherche |
| onSelectionChange | func | Callback pour retourner l'acte sélectionné |
| search | object | Documentation semantic-ui-react [Search](https://react.semantic-ui.com/modules/search) |
| searchInputLength | number | Nombre minimum de caractères pour déclencher la recherche d'actes |

## Tarification
Tarification d'un acte CCAM
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| codActe | string | Code de l'acte CCAM |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| date | string | Date de la tarification de l'acte, au format ISO. Par défaut la date du jour |
| dynamic | bool | Affichage de l'interface dynamique de tarification, par défaut "false" |
| error | string, func | Message d'erreur ou Callback acte non tarifé à la date donnée |
| hidden | bool | Cacher l'interface du composant de tarification |
| modificateurs | string | Modificateurs appliqués à l'acte, par défaut une chaîne de caractères vide |
| success | func | Callback succès de la tarification |

## Table
Composant montrant sous forme d'un tableau les actes obtenus après une recherche par mot clé.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| actes | array | Actes CCAM à afficher |
| headers | array | En-têtes du tableau |
| informations | object | Se référer à la documentation RHAPI sur la pagination |
| onSelection | func | Callback à la sélection d'un acte |
| onPageSelect | func | Callback changement de page |
| showPagination | bool | Afficher les options de paginations, par défaut "false" |
| table | object | Documentation semantic-ui-react [Table](https://react.semantic-ui.com/collections/table) |
| btnFirstContent | string | Texte du bouton pour aller à la première page, par défaut "" |
| btnLastContent | string | Texte du bouton pour aller à la dernière page, par défaut "" |
| btnMoreContent | string | Texte du bouton pour afficher plus de résutats, par défaut "Plus de résultats" |
| btnNextContent | string | Texte du bouton pour aller à la page suivante, par défaut "" |
| btnPrevContent | string | Texte du bouton pour aller à la page précédente, par défaut "" |
| btnFirstIcon | string | Icon semantic du bouton pour aller à la première page, par défaut "fast backward" |
| btnLastIcon | string | Icon semantic du bouton pour aller à la dernière page, par défaut "fast forward" |
| btnMoreIcon | string | Icon semantic du bouton pour afficher plus de résultats, par défaut "" |
| btnNextIcon | string | Icon semantic du bouton pour aller à la page suivante, par défaut "step forward" |
| btnPrevIcon | string | Icon semantic du bouton pour aller à la page précédente, par défaut "step backward" |
| btnFirst | object | Props semantic du bouton pour aller à la première page, par défaut un objet vide "{}" |
| btnLast | object | Props semantic du bouton pour aller à la dernière page, par défaut un objet vide "{}" |
| btnNext | object | Props semantic du bouton pour aller à la page suivante, par défaut un objet vide "{}" |
| btnPrev | object | Props semantic du bouton pour aller à la page précédente, par défaut un objet vide "{}" |
| btnMore | object | Props semantic du bouton pour afficher plus de résultats, par défaut un objet vide "{}" |
| mode | string | mode de pagination 'pages' ou 'more', par défaut "pages" |

## Actions
Menu d'actions à effectuer
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| actions | array | Tableau contenant une liste d'actions |
| dropdown | object | Documentation semantic-ui-react [Dropdown](https://react.semantic-ui.com/modules/dropdown) |
| id | any | Identifiant de la ligne sur laquelle une action est effectuée |

## DateRange
Période, début et fin d'une période
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| open | bool | Ouverture de la modal |
| startAt | string | Date de début de la période. Par défaut la date du jour. |
| endAt | string | Date de fin de la période. Par défaut une semaine après la date du jour. |
| onRangeChange | func | Callback au changement de la période |
| onClose | func | Callback à la fermeture de la modal |

## Localisations
Grille de saisie des localisations dentaires
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| dents | string | Liste des dents sélectionnées, séparées par des espaces. Par défaut "" |
| modal | object | Documentation semantic-ui-react [Modal](https://react.semantic-ui.com/modules/modal) |
| onSelection | func | Callback à la selection d'une liste de dents |

## Montant
Input de saisie d'un montant au format français
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| input | object | Documentation semantic-ui-react [Input](https://react.semantic-ui.com/elements/input) |
| montant | number | Montant affiché |
| onChange | func | Callback au changement du montant |

## Periode
Période, début et fin d'une période
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| labelDate | string | Label de la période |
| labelYear | string | Label de l'année de la période |
| startYear | number | La première année qui sera affichée. Par défaut l'année en cours |
| onPeriodeChange | func | Callback au changement de la période. C'est une fonction qui prend 2 paramètres, début et fin de la période (inclus).
Les valeurs de ces paramètres sont NULL si la durée est indéterminée. |

## Edition
Edition d'un acte validé pour un patient
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| id | number | Id de l'acte à éditer. Par défaut id = 0 |
| openEdit | bool | La modale s'ouvre si la valeur de 'open' est égale à true. Par défaut, open = false |
| onCloseEdit | func | Callback à la fermeture de la modal |
| onUpdate | func | Callback à la modification de l'acte sélectionné. Elle prend en paramètre l'acte modifié |

## Favoris
Modal semantic de lecture et de configuration des actes en favoris
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| codActivite | string | Code de l'activité, par défaut '1' |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| executant | string | Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| index | number | Indice de la ligne (dans la grille de saisie des actes) à partir de laquelle le composant Actes.Favoris a été appelé. |
| open | bool | Ouverture de la modal |
| onClose | func | Callback à la fermeture de la modal |
| onSelection | func | Callback à la selection et validation d'un acte. Cette fonction prend en 1er paramètre l'indice de la ligne et en 2ème paramètre l'objet acte sélectionné. |

## ModalActeTitre
Modal de changement de titre d'un devis avant sa validation
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| open | bool | Ouverture de la modal |
| titre | string | Titre de l'acte |
| onClose | func | Callback à la fermeture de la modal |
| onChangeTitre | func | Callback au changement du titre. Ce callback prend en paramètre le nouveau titre. |

## Historique
Affichage de l'historique des actes d'un patient
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | Id du patient, par défaut 0 (Aucun patient) |
| id | number | Id de l'acte sélectionné par un click, un double click ou par une édition |
| actions | array | Tableau d'objet contenant des actions à effectuer (en plus des actions par défaut). Exemple [{icon:"add",text:"Ajouter",action:fonction de l'action ajouter}] |
| startAt | string | Filtre sur le début d'une période (incluse). Par défaut "" |
| endAt | string | Filtre sur la fin d'une période (incluse). Par défaut "" |
| localisation | string | Filtre sur une liste de dents sélectionnées, séparées par des espaces. Par défaut "" |
| table | object | Documentation semantic-ui-react [Table](https://react.semantic-ui.com/collections/table) |
| limit | number | Valeur de pagination, par défaut 5 |
| sort | string | Le champs sur lequel le tri va être effectué. Par défaut, le tri se fait sur la date (doneAt) |
| order | string | Le tri est ascendant (ASC) ou descendant (DESC). Par défaut, le tri est descendant (DESC) |
| openNoteTodo | bool | Ouvre la modal pour l'édition des notes ou todos. Par défaut openNoteTodo = false |
| typeNoteTodo | string | Permet de savoir si c'est une note ou todo. Par défaut, typeNoteTodo = "" |
| onActeClick | func | Retourne en paramètre l'id de l'acte sélectionné sur un click |
| onActeDoubleClick | func | Retourne en paramètre l'id l'acte sélectionné sur un double click |
| onSelectionChange | func | Retourne en paramètre la liste des id des actes sélectionnés (multi-sélection possible par CTRL+click) |
| onEditActeClick | func | Retourne en paramètre l'id d'un #DEVIS ou d'une #FSE lorsque l'on édite |
| onOpenNoteTodo | func | Callback à l'ouverture de la note |
| onCloseNoteTodo | func | Callback à la fermeture de la note |
| showPagination | bool | Affiche les options de paginations, par défaut "true" |
| btnFirstContent | string | Texte du bouton pour aller à la première page, par défaut "" |
| btnLastContent | string | Texte du bouton pour aller à la dernière page, par défaut "" |
| btnMoreContent | string | Texte du bouton pour afficher plus de résutats, par défaut "Plus de résultats" |
| btnNextContent | string | Texte du bouton pour aller à la page suivante, par défaut "" |
| btnPrevContent | string | Texte du bouton pour aller à la page précédente, par défaut "" |
| btnFirstIcon | string | Icon semantic du bouton pour aller à la première page, par défaut "fast backward" |
| btnLastIcon | string | Icon semantic du bouton pour aller à la dernière page, par défaut "fast forward" |
| btnMoreIcon | string | Icon semantic du bouton pour afficher plus de résultats, par défaut "" |
| btnNextIcon | string | Icon semantic du bouton pour aller à la page suivante, par défaut "step forward" |
| btnPrevIcon | string | Icon semantic du bouton pour aller à la page précédente, par défaut "step backward" |
| btnFirst | object | Props semantic du bouton pour aller à la première page, par défaut un objet vide "{}" |
| btnLast | object | Props semantic du bouton pour aller à la dernière page, par défaut un objet vide "{}" |
| btnNext | object | Props semantic du bouton pour aller à la page suivante, par défaut un objet vide "{}" |
| btnPrev | object | Props semantic du bouton pour aller à la page précédente, par défaut un objet vide "{}" |
| btnMore | object | Props semantic du bouton pour afficher plus de résultats, par défaut un objet vide "{}" |
| mode | string | Mode de pagination "pages" ou "more", par défaut "pages" |

## ModalSelectActes
Modal de sélection des actes. Ces actes seront utilisés par exemple pour générer un document.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | identifiant du patient |
| open | bool | ouverture de la modal |
| onClose | func | callback à la fermeture de la modal |
| onDocumentGeneration | func | callback de la fin de sélection |

## ModalSearch
Ce composant est une modal Semantic de recherche d'un acte. Il intègre un date picker, les composants CCAM.Search, CCAM.Table et Shared.Localisations
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| code | string | Code de l'acte CCAM sélectionné. Par défaut "" |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| cotation | number | Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif) |
| date | string | Date effective de l'acte au format ISO. Par défaut date du jour |
| description | string | Description de l'acte sélectionné. Par défaut "" |
| localisation | string | Liste des dents sélectionnées, séparées par des espaces. Par défaut "" |
| executant | string | Limiter la recherche aux seuls actes d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| specialite | number | Code spécialité du praticien |
| localisationPicker | bool | Affichage de la grille de saisie des localisations dentaires |
| open | bool | Ouverture de la modal |
| onClose | func | Callback à la fermeture de la modal |
| rowIndex | number | Indice de la ligne sur laquelle on a cliqué dans le tableau de saisie des actes |
| ngap | array | Liste des codes NGAP |
| allModificateurs | array | Tous les modificateurs (obtenus avec une requête CCAM contextes) |
| modificateurs | string | Modificateurs appliqués à l'acte sélectionné. Par défaut "" |
| qualificatifs | string | Qualificatifs |
| montant | number | Montant de l'acte sélectionné |
| onValidation | func | Callback à la validation. Paramètres : index de la ligne; code de l'acte sélectionné; description de l'acte;date au format ISO; localisation; cotation; modificateurs; qualificatifs; montant |

## Note
Ajout d'une nouvelle << Note >> ou << Todo >> dans l'historique des actes d'un patient
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| id | number | id de l'acte sélectionné. Par défaut, id = 0 |
| idPatient | number | Id du patient. Par défaut, idPatient = 0 |
| open | bool | La modale s'ouvre si la valeur de 'open' est égale à true. Par défaut, open = false |
| type | string | Type de l'acte ('NOTE' ou 'TODO'). Par défaut, type = '' |
| onCreate | func | Callback à la création de la nouvelle 'note' ou 'todo'. L'acte créé est passé en paramètre |
| onUpdate | func | Callback à la mise à jour d'une 'note' ou 'todo'. L'acte modifié est passé en paramètre |
| onClose | func | Callback à la fermeture de la modal. |

## Saisie
Tableau de saisie des actes pour les dentistes
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idActe | any, isRequired | Identifiant de l'acte principal |
| lignes | number | Nombre de lignes à afficher pour ce tableau. Par défaut 5 |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| editable | bool | Un acte peut être éditable ou pas |
| executant | string | Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| specialite | number | Code spécialité du praticien |
| onError | func | Callback en cas d'erreur |
| actions | array | Liste d'actions à effectuer (en plus des actions par défaut) |
| addToFSE | func | Callback ajout d'un acte dans une FSE (à partir d'un #DEVIS) |
| acteToAdd | object | Acte à ajouter dans une FSE |
| onForceReload | func | Callback appelé pour forcer le rechargement |

## SaisieDentaire
Composant correspondant à une ligne du tableau de saisie des actes pour les dentistes
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| type | string | Type d'acte (#DEVIS ou #FSE). Par défaut c'est une #FSE |
| index | number | Indice de la ligne |
| acte | object | Acte sur la ligne courante |
| actions | array | Liste d'actions à effectuer (en plus des actions par défaut) |
| code | string | Code de l'Acte sélectionné |
| cotation | number | Cotation/coefficient applicable au code (significatif uniquement en NGAP, 0 si non significatif) |
| description | string | Description de l'acte |
| date | string | Date effective de l'acte au format ISO. Par défaut date du jour |
| editable | bool | Définir si une ligne va être éditable ou pas. Par défaut elle est éditable si elle n'est pas désactivée. Voir la props 'disabled'. |
| localisation | string | Liste des dents sélectionnées, séparées par des espaces. Par défaut "" |
| modificateurs | string | Modificateurs appliqués à l'acte sélectionné. Par défaut "" |
| qualificatifs | string | Les qualificatifs |
| disabled | bool | Désactivation de la ligne |
| montant | number | Le moment pour cet acte |
| onClick | func | Callback au clic sur une ligne |
| onClickDate | func | Callback au clic sur la colonne de la date |
| onClickLocalisation | func | Callback au clic sur la colonne Localisation |
| onDelete | func | Callback à la suppression de la ligne |
| onDuplicate | func | Callback à la duplication de la ligne |
| onEdit | func | Callback action de recherche en CCAM |
| onInsertion | func | Callback à l'insertion d'un nouvel acte |
| onSearchFavoris | func | Callback au clic sur la colonne libellé (Recherche d'un acte dans les favoris) |
| onMoveToFSE | func | Callback déplacement d'un acte de #DEVIS vers #FSE |

## SaisieValidation
Composant de saisie et validation des actes
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | Identifiant du patient |
| idActe | number | Identifiant de l'acte à lire. Par défaut cette valeur est à NULL. |
| acteCopy | bool | Si cette propriété est à TRUE, une copie de l'acte d'identifiant 'idActe' sera créée. |
| typeActe | string | Type d'acte à saisir ou à valider : #FSE ou #DEVIS |
| acteTitre | string | Titre de l'acte qui sera créé |
| codActivite | string | Code de l'activité, par défaut "1" |
| codDom | number | Code du DOM, par défaut c'est la métropole. Code 0 |
| codGrille | number | Code grille, par défaut 0 |
| codPhase | number | Code phase, par défaut 0 |
| executant | string | Code d'une profession de santé. Exemple : D1(dentistes), SF(sages-femmes) |
| specialite | number | Code spécialité du praticien |
| actions | array | Liste d'actions à effectuer (en plus des actions par défaut) |
| lignes | number | Nombre de lignes à afficher pour ce tableau. Par défaut 5 |
| user | string | identifiant du praticien |

## ValidationActes
Modal de confirmation de la validation d'un acte
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idActe | number | identifiant de l'acte à valider |
| acteTitre | string | titre de l'acte à valider |
| modeleDocument | string | type de modèle à utiliser pour la génération d'un document |
| open | bool | ouverture de la modal |
| onClose | func | callback à la fermeture de la modal |
| onDocumentGeneration | func | callback à la confirmation de la génération d'un document |

## DocumentArchives
Liste des documents d'un patient (archives)
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | ID du patient. Si idPatient = 0, le document est partagé par tous les patients (ex. un modèle de document) |

## DocumentEditor
Composant d'édition d'un document texte
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| document | object | Objet document à manipuler |
| onClose | func | Callback à la fermeture de l'édition |
| onEditDocument | func | Callback à l'édition du contenu d'un document. Ce callback prend en paramètre le nouveau contenu du document |

## DocumentFromActes
Modal de chargement à la création d'un document à partir des Actes.
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | identifiant d'un patient |
| arrayIdActes | array | liste d'identifiants d'actes pour lesquels il faut générer des documents |
| idModele | number | identifiant du modèle à utiliser. Si cette valeur est renseignée, ce sera le document correspondant à cet identifiant qui sera utilisé |
| open | bool | ouverture de la modal |
| onClose | func | callback à la fermeture de la modal |
| onDocumentGeneration | func | Callback à la fin de la génération d'un document. Prend en paramètre l'identifiant du document qui vient d'être généré. |
| user | string | identifiant du praticien |
| typeDocument | string | type de document à produire : DEVIS ou FACTURE |
| visualisation | bool | visualisation du document généré |

## DocumentModeles
Composant de gestion des modèles appartenant à un ou plusieurs praticiens
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| idPatient | number | identifiant du patient nécessaire si l'on souhaite créer un document à partir d'un modèle |
| user | string | identifiant du praticien |

## ListeDocument
Tableau contenant la liste des documents d'un patient (ou modèles de documents)
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| documents | array | liste de documents |
| onDocumentClick | func | Retourne en paramètre l'id d'un document sur un click |
| onDocumentDoubleClick | func | Retourne en paramètre l'id d'un document sur un double click |
| onSelectionChange | func | Retourne en paramètre la liste des id des documents sélectionnés (multi-sélection possible par CTRL+click) |
| actions | array | Tableau d'objet contenant des actions à effectuer (en plus des actions par défaut) |
| showActions | bool | Permet d'afficher la colonne des actions. Par défaut, showAction prend la valeur true |
| showCheckbox | bool | Permet d'afficher la colonne de sélection (Checkbox). Par défaut, showCheckbox prend la valeur false |

## PropertiesModele
Modal de changement des propriétés d'un modèle : usage par défaut du modèle et le nom (ou titre du document généré).
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| id | number | identifiant du modèle |
| user | string | identifiant du praticien |
| open | bool | ouverture de la modal |
| onClose | func | callback à la fermeture de la modal |

## RecopieModele
Modal de sélection des modèles à recopier (modèles partagés ou appartenant à un autre praticien).
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| client | any, isRequired | [Documentation générale du client RHAPI](https://github.com/rhapi-project/rhapi-client) |
| open | bool | ouverture de la modal |
| onClose | func | callback à la fermeture de la modal |

## RenameDocument
Modal de changement de nom de fichier pour un document
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| fileName | string | nom du document |
| open | bool | ouverture de la modal |
| onClose | func | callback à la fermeture de la modal |
| onRename | func | callback au changement du nom du document |

## TextDocument
Visualiseur d'un document sous format texte
#### Props du composant
| Props | Type | Description |
| ---- | ----- | ------ |
| document | string | contenu d'un document au format texte |
| mode | string | mode d'édition du document : html ou plain |
| onEdit | func | Callback à la modification du texte |
