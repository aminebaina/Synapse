# Feuille de Route & Architecture Pédagogique — AlgoAcadémie

---

## 🏛️ La Charte Pédagogique : « Zéro Présupposé » (First Principles)

Notre ambition est de construire une référence mondiale d'apprentissage interactif des mathématiques et de l'informatique (au niveau de Brilliant.org et Khan Academy), fondée sur la rigueur absolue de **Richard Feynman** :

1. **Règle du Graphe de Dépendance Strict (DAG)** :
   * Une notion $B$ n'est **jamais** introduite si la notion $A$ dont elle découle n'a pas fait l'objet d'un **exercice interactif dédié** où l'apprenant l'a manipulée de ses propres mains.
   * On ne suppose **jamais** qu'un apprenant sait quelque chose si nous ne l'avons pas explicité et mis en scène dans un exercice interactif.
2. **Élimination totale des faux « Évidences »** :
   * Bannir les *"Il est évident que..."* ou *"On voit bien que..."*. Chaque opération (un ratio, une division par 2, un décalage d'index mémoire, un saut de boucle) est décomposée et incarnée visuellement.
3. **Le Pont Mathématiques $\leftrightarrow$ Machine Permanent** :
   * Tout concept mathématique abstrait possède sa contrepartie physique concrète dans la machine (Booléen $\leftrightarrow$ Bit & Interrupteur, Variable $\leftrightarrow$ Case RAM physique, Fonction $\leftrightarrow$ Cadre sur la Call Stack, Ensembles $\leftrightarrow$ Filtres de données).
4. **Boucle de Retour & Orientation Guidée** :
   * Sous chaque exercice : incitation bienveillante à donner son avis (1 à 5 étoiles, tags de déclic visuel, mode anonyme ou email).
   * Guidage permanent : chaque notion indique le **pourquoi cognitif** de la notion suivante avec un bouton d'action `NEXT` vert bien visible.

---

## 🏆 ÉTAT DES LIEUX : NIVEAU 1 — Fondations Déterministes & Discrètes [100% OPÉRATIONNEL ✅]

Toutes les briques fondamentales débutantes sont en place, sans aucun bug de compilation ni d'exécution :

### 1. Mathématiques & Logique Symbolique
- ✅ **1. Algèbre de Boole & Tables de Vérité** (`logic-gates` · *Commencer ici*) : Portes ET, OU, NON, XOR, circuit électrique dynamique, ampoule témoin et table de vérité interactive.
- ✅ **2. Arithmétique Modulo & Ensembles Finis** (`modulo-arithmetic`) : L'analogie du cadran d'horloge circulaire, formule euclidienne $a = q \times n + r$, parité et domaines finis.
- ✅ **3. Ensembles & Diagrammes de Venn** (`sets-venn`) : Appartenance ($x \in S$), Union ($A \cup B$), Intersection ($A \cap B$), Complémentaire.

### 2. Systèmes & Modèle Mémoire
- ✅ **4. Codage Binaire & Hexadécimal** (`binary-hex`) : Les 8 interrupteurs physiques d'un octet (128 à 1), décomposition en 2 quartets (nibbles) colorés pour conversion immédiate en hexadécimal (`0x..`), code ASCII, mode défi interactif.
- ✅ **5. Variables, Adresses Physiques & Pointeurs** (`memory-model`) : Rack physique de RAM, adresses hexadécimales (`0x1000`...), nom vs adresse vs type vs valeur, déréférencement `*ptr`.
- ✅ **6. Le Pont Pédagogique : Exécution Séquentielle & `if / else`** (`sequential-exec`) : Mise à jour de l'état mémoire pas-à-pas selon l'évaluation de propositions booléennes.
- ✅ **7. Les Boucles (`while` / `for`) & l'Accumulateur** (`loop-control`) : Trilogie de Böhm-Jacopini complète, instruction de saut `JUMP`, compteur d'itération $i$, registre accumulateur de somme et invariant de boucle.
- ✅ **8. Fonctions & Pile d'Appels (Call Stack)** (`call-stack`) : Cadres mémoire (*Stack Frames* empilés puis détruits au `return`), passage de paramètres par valeur, portée locale des variables (*scope*).

### 3. Structures Linéaires & Algorithmique de Base
- ✅ **9. Recherche Linéaire** (`linear-search`) : Inspection séquentielle case par case dans un tableau à 5 cases synchronisée avec les 5 lignes exactes de pseudo-code, synthèse audio harmonique.
- ✅ **10. Recherche du Maximum / Minimum (Extrema)** (`find-extrema`) : Métaphore du champion avec trophée animé, comparaison élément par élément lors du parcours séquentiel.
- ✅ **11. Liste Chaînée vs Tableau Contigu** (`linked-list`) : Mémoire contiguë vs nœuds dispersés reliés par pointeur `next`, parcours séquentiel, insertion en tête en $O(1)$.
- ✅ **12. Pile (Stack - LIFO)** (`stack`) : Dernier Entré, Premier Sorti avec tube vertical interactif, `push`, `pop`, `peek`, gestion de l'overflow et de l'underflow.
- ✅ **13. File (Queue - FIFO)** (`queue`) : Premier Entré, Premier Sorti, file d'attente avec entrée à l'arrière (*Enqueue*) et sortie au guichet (*Dequeue*).

### 4. Moteur de Rétention, Mode Python & Viralité Local-First (0 € Serveur)
- ✅ **Mode Syntaxe Python 🐍 & Pseudo-code 📝** :
  - Commutateur global dans l'en-tête et sur chaque boîte de code.
  - Déclinaison 100% Python pour vos 120 étudiants (`for i in range(len(arr)):`, `while i <= n:`, `if/else`, `def f(x):`) reliée en temps réel aux visualisations physiques de la machine (RAM, pointeurs, Call Stack).
- ✅ **Suivi de progression Local-First (`localStorage`)** : Coche verte `✓` sur chaque notion maîtrisée, statistiques d'avancement dynamiques (`X/13 · Y%`).
- ✅ **Bouton d'action « Marquer comme maîtrisée »** sous chaque exercice avec bascule instantanée.
- ✅ **Export & Import JSON sans serveur** (`algo_progression.json`) pour emporter ses progrès d'un PC à un smartphone.
- ✅ **Certificat Officiel d'Accomplissement Niveau 1** :
  - Nom & Prénom de l'apprenant personnalisable en 1 clic.
  - Génération d'image haute définition **PNG 1920x1080** directement dans le navigateur via Canvas HTML5 (zéro coût cloud).
  - Partage en 1 clic sur **LinkedIn** et **X (Twitter)** avec texte d'accomplissement pré-rempli.
  - Sceau officiel doré, ID de vérification cryptographique et date de délivrance.

---

## 🚀 ÉTAPES SUIVANTES : LES PALIERS INTERMÉDIAIRES SANS RACCOURCI

Pour respecter notre engagement « Zéro Présupposé », nous ne sautons aucun palier avant le Niveau 2 :

### 🎯 Palier 1.5 : Arithmétique Discrète, Ratios & Aléatoire Contrôlé
*Ce palier intermédiaire est indispensable avant d'aborder les tables de hachage, le tri rapide et les structures probabilistes.*

1. **Dénombrement & Cardinalité d'un Ensemble Fini** :
   * Compter les éléments $|E|$ dans une urne ou collection sans doublon.
2. **Ratios, Proportions & Fractions Visuelles** :
   * Comparer visuellement des sous-ensembles (ex: 3 boules rouges sur 10) : la fraction comme portion mesurable d'un tout.
3. **L'Expérience Aléatoire & Le Tirage Uniforme (L'Urne de Boules)** :
   * Tirage à l'aveugle : cas favorables sur cas possibles ($P(A) = \frac{|A|}{|\Omega|}$), notion d'équiprobabilité.
4. **Le Pont Machine : Le Pseudo-Aléatoire (PRNG - `rand()`)** :
   * Comment un processeur purement déterministe simule le tirage d'une boule au hasard via une suite arithmétique modulo (générateur congruentiel linéaire).

---

### 🌲 Niveau 2 : Structures Hiérarchiques & Diviser pour Régner
*Construit directement sur la Call Stack et les Pointeurs du Niveau 1.*

1. **La Récursion & l'Arbre d'Appels** :
   * Cas de base (condition d'arrêt) vs appel inductif, visualiser l'arbre d'appels qui grandit et se résout sur la pile.
2. **La Recherche Binaire (Dichotomie)** :
   * Diviser l'espace de recherche par 2 à chaque étape sur tableau trié ($O(\log n)$).
3. **L'Arbre Binaire de Recherche (BST)** :
   * Évolution naturelle de la liste chaînée : un nœud avec deux pointeurs (`left`, `right`), invariant de recherche.
4. **La Table de Hachage (Hash Map)** :
   * Fusion de l'Arithmétique Modulo (Niveau 1) et des Tableaux : fonction de hachage, calcul d'index, et gestion des collisions (chaînage vs adressage ouvert).
5. **Algorithmes de Tri Efficaces** :
   * Tri par Sélection (fondé sur les extrema du Niveau 1).
   * Tri Fusion (*MergeSort* - fondé sur la récursion et la division).
   * Tri Rapide (*QuickSort* - fondé sur le pivot aléatoire et la partition).

---

### 🌐 Niveau 3 : Graphes, Réseaux & Optimisation
1. **Graphes : Matrices & Listes d'Adjacence** (modélisation de réseaux).
2. **Parcours en Largeur (BFS - fondé sur la Queue FIFO)** et **Parcours en Profondeur (DFS - fondé sur la Stack LIFO & Récursion)**.
3. **Algorithme de Dijkstra** (plus court chemin).
4. **Introduction à la Programmation Dynamique** (mémoïsation sur la table de hachage).
