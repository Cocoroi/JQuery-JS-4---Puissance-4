# JQuery-JS-4---Puissance-4

Partie 1 : Réaliser un puissance 4 en version client uniquement

Voici l’ordre dans lequel vous devrez procéder pour faire ce travail :

1) Créez la page html, et créez votre puissance 4 sous forme d’un tableau (rappel, le puissance 4 dispose de 7 colonnes sur 6 lignes).
   Vous devriez pour vous aider donner des id différents à chaque ligne et à chaque colonne, par exemple (case_2_4) pour la case ligne 2 colonne 4. 
   En en-tête vous pouvez mettre les informations du jeux (joueur 1 / joueur 2) avec qui est en train de jouer.
   
2) Les jetons des joueurs sont rouges et jaunes, vous pouvez par exemple colorer la case en utilisant une classe (css) spécifique pour le faire.

3) Ecrivez une fonction d’initialisation en javascript/jquery qui remet la partie à zero.

4) N’oubliez pas de lancer le jeux en lançant la fonction d’initialisation en utilisant le document-ready de JQuery.

5) Programmez un événement sur le survol du tableau et mettez un indicateur sur l’en-tête de colonne pour connaitre la colonne en cours de survol qui        sera prise en compte par le clique (vous pouvez gérer ça avec les coordonnées de la souris par rapport à la taille des colonnes par exemple)
   exemple : td de 200px, je suis en 1345px donc ceil(1345/200) = 6 donc je serais sur la 6é colonnes (en partant de 0)

6) Programmez les évènements de click sur les td du tableau puissance 4, pour détecter un clique sur une case.
   Lors du clique sur cette case, il faudra faires des contrôles et des interactions :
    - Est-ce que la colonne sur laquelle on clique est pleine (si oui on ne peut pas jouer cette colonne)
    - Faite une mini animation (en Jquery avec animate) qui représente la descente du jeton
    
   A la fin de l’animation, on effectue les contrôles suivants :
    - Est-ce que j’ai fais un puissance 4 ?
    - Est-ce que le tableau est plein ? (match nul)
    
7) Lors de la fin de la partie sur victoire / nul : on affiche un message à l’utilisateur pour signaler la victoire. On modifie les informations du          joueurs pour incrémenter son nombre de victoire, on incrémente le nombres de partie joués. Puis on lui propose de relancer une nouvelle partie, qui      pourra lancer la fonction reset (la même qu’au début)


Partie 2 : Ajouter des “interactions” serveurs

1) Créer une base de donnée (simple) qui contiendra les tables suivantes :
    a) partie_en_cours
    b) scores
    
2) A la fin de la partie, vous mettrez à jour la table des scores avec une requête ajax ($.ajax, $.get ou $.post)

3) Maintenant on va essayer de sauvegarder la partie en temps réel, chaque fois qu’un joueur joue un coup, envoyer une requête ajax, contenant l’état de    la partie.
4) Lorsqu’on charge la page, si une partie est en cours, rechargez la avec les données qui sont contenus en base de données


⚠️ BDD faites avec MariaDB ⚠️
