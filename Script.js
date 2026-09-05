'use strict';

/* ════════════════════════════════════════════════════════
   DONNÉES DES PROJETS
   Toute la matière des anciens modals/sous-modals/vidéos
   est regroupée ici. Le rendu se fait dynamiquement dans
   le panneau "Vue projet" (sidebar + contenu), donc plus
   besoin d'ouvrir popup sur popup pour retrouver une info.
════════════════════════════════════════════════════════ */
const PROJECTS = {

  /* ───────────────────────── ANIMAL'AND CHAT ───────────────────────── */
  animaland: {
    icon: 'images/lg.png',
    type: "Application Mobile — Chat Temps Réel",
    title: "Animal'and Chat",
    description: "Animal'and Chat est une application mobile de messagerie instantanée développée avec Flutter. Le backend est déployé sur un serveur OVH via <strong>Termius SSH</strong>, la base de données est PostgreSQL, et les notifications sont gérées par Firebase Messaging.",
    tags: ['Flutter', 'Dart', 'Socket.io', 'Firebase Messaging', 'PostgreSQL', 'OVH', 'Termius SSH'],
    features: [
      {
        id: 'inscription', icon: '🔑', title: 'Inscription & Accès',
        desc: "L'accès à l'application n'est pas ouvert à tous. Chaque nouvelle inscription passe par un processus de validation avant que l'utilisateur puisse se connecter.",
        steps: [
          { text: "L'utilisateur remplit un formulaire d'inscription avec ses informations (nom, email, mot de passe).", media: 'videos/inscription.gif' },
          { text: "La demande est enregistrée en base PostgreSQL avec le statut <strong>« en attente »</strong>. L'accès est bloqué jusqu'à validation.", media: 'images/screen-en-attente.png' },
          { text: "Un administrateur reçoit la demande dans son panel et peut <strong>accepter ou refuser</strong> le compte.", media: 'videos/accept_inscription.gif' },
          { text: "Une fois accepté, l'utilisateur peut se connecter et <strong>créer des conversations</strong> avec d'autres membres.", media: 'videos/creation_conversation_membre.gif' },
          { text: "La création de <strong>groupes</strong> est réservée aux administrateurs uniquement.", media: 'images/screen_admin.png' }
        ]
      },
      {
        id: 'chat', icon: '💬', title: 'Chat en temps réel',
        desc: "Le cœur de l'application repose sur une messagerie instantanée via <strong>Socket.io</strong> : une connexion permanente (WebSocket) entre le serveur et l'application. Contrairement au HTTP classique, le serveur pousse instantanément les données dès qu'un événement se produit — sans rechargement, sans délai. Les messages sont persistés en PostgreSQL et distribués en temps réel.",
        steps: [
          { text: "L'utilisateur sélectionne une conversation et rédige son message." },
          { text: "À l'envoi, le message est <strong>enregistré en base PostgreSQL</strong> pour garantir la persistance.", media: 'images/messages_bdd.png' },
          { text: "<strong>Si le destinataire est connecté</strong>, il reçoit le message <strong>instantanément via Socket.io</strong>.", media: 'videos/test_message_tempsréel.gif' },
          { text: "<strong>Si le destinataire est absent</strong>, une <strong>notification push Firebase Messaging</strong> est déclenchée.", media: 'videos/test_notif.gif' },
          { text: "Chaque message affiche l'auteur, le contenu et <strong>l'horodatage précis</strong> de l'envoi.", media: 'images/screen_horodatage.png' },
          { text: "<strong>Indicateur de frappe :</strong> lorsqu'un utilisateur écrit, un message « X est en train d'écrire... » s'affiche en temps réel.", media: 'videos/test_message_accueil.gif' }
        ]
      },
      {
        id: 'notif', icon: '🔔', title: 'Notifications push',
        desc: "Grâce à Firebase Cloud Messaging (FCM), les utilisateurs sont alertés des nouveaux messages même lorsqu'ils n'ont pas l'application ouverte.",
        steps: [
          { text: "Lors de la connexion, l'application récupère le <strong>token FCM</strong> de l'appareil et l'enregistre en base.", media: 'images/fcm_token.png' },
          { text: "Quand un message est envoyé, le backend <strong>déclenche une notification FCM</strong> vers les membres du salon.", media: 'images/fcm_log.png' },
          { text: "La notification apparaît même si l'application est <strong>fermée ou en arrière-plan</strong>.", media: 'videos/test_notif.gif' },
          { text: "Un tap sur la notification <strong>ouvre directement le salon</strong> concerné." }
        ]
      },
      {
        id: 'salons', icon: '🐾', title: 'Conversations & Groupes',
        desc: "L'application distingue deux types d'espaces : les <strong>conversations</strong> créées librement, et les <strong>groupes</strong> réservés aux administrateurs.",
        steps: [
          { text: "<strong>Conversations (utilisateurs) :</strong> chaque utilisateur peut créer une conversation en choisissant un ou plusieurs contacts.", media: 'videos/creation_conversation_membre.gif' },
          { text: "<strong>Groupes (admins uniquement) :</strong> seuls les administrateurs peuvent créer des groupes visibles par tous.", media: 'videos/creation_de_groupe.gif' },
          { text: "L'<strong>historique complet</strong> est chargé à l'ouverture et les nouveaux messages arrivent en temps réel via Socket.io.", media: 'videos/test_group_et_conversation.gif' },
          { text: "Un indicateur de <strong>présence en ligne</strong> permet de savoir quels membres sont connectés.", media: 'images/screen_presence.png' },
          { text: "<strong>Suppression automatique :</strong> les messages de plus de <strong>6 mois</strong> sont supprimés de la base PostgreSQL.", media: 'images/screen_suppression.png' }
        ]
      },
      {
        id: 'sondages', icon: '📊', title: 'Sondages',
        desc: "Les utilisateurs peuvent animer leur salon en créant des sondages interactifs. Les votes et résultats sont visibles en temps réel.",
        steps: [
          { text: "N'importe quel membre peut créer un sondage en définissant une <strong>question et plusieurs options</strong>.", media: 'videos/test_sondage.gif' },
          { text: "Le sondage est enregistré en PostgreSQL et diffusé via <strong>Socket.io</strong> à tous les membres.", media: 'images/polls_bdd.png' },
          { text: "Chaque membre vote une seule fois. <strong>Un seul vote par utilisateur</strong> est autorisé." },
          { text: "Les <strong>résultats se mettent à jour en direct</strong> avec le pourcentage de votes pour chaque option.", media: 'videos/test_sondage.gif' }
        ]
      },
      {
        id: 'perso', icon: '🎨', title: 'Personnalisation',
        desc: "Chaque utilisateur peut personnaliser son expérience visuelle en choisissant un fond d'écran selon ses goûts.",
        steps: [
          { text: "Dans les paramètres, l'utilisateur accède à une <strong>liste de fonds d'écran prédéfinis</strong>.", media: 'videos/test_fond_ecran.gif' },
          { text: "Il peut également choisir une <strong>image personnalisée depuis sa galerie locale</strong>." },
          { text: "Le fond d'écran est stocké <strong>uniquement en local sur l'appareil</strong> — jamais envoyé au serveur." },
          { text: "L'interface <strong>s'adapte immédiatement</strong> avec le fond d'écran choisi." }
        ]
      },
      {
        id: 'admin', icon: '🛡️', title: 'Panel administrateur',
        desc: "Un espace dédié aux administrateurs permet de gérer entièrement la communauté depuis l'application.",
        steps: [
          { text: "<strong>Validation des inscriptions :</strong> l'admin accepte ou refuse en un tap.", media: 'videos/accept_inscription.gif' },
          { text: "<strong>Modification des rôles :</strong> l'admin peut promouvoir un utilisateur en modérateur ou administrateur.", media: 'videos/test_role_suppresion.gif' },
          { text: "<strong>Bannissement :</strong> l'admin peut bannir un compte. L'utilisateur banni ne peut plus se connecter.", media: 'videos/test_role_suppresion.gif' },
          { text: "<strong>Suppression de compte :</strong> l'admin peut supprimer définitivement un compte et toutes ses données." }
        ]
      },
      {
        id: 'bdd', icon: '🗄️', title: 'Base de données & Code',
        desc: "L'ensemble des données est stocké dans une base PostgreSQL hébergée sur un serveur OVH, déployé via Termius SSH — choisi pour sa robustesse et sa gestion avancée des données relationnelles, sans dépendance à un service tiers.",
        steps: [
          { text: "<strong>MCD complet</strong> de l'application avec 18 tables relationnelles.", media: 'images/mcd_animaland.png' },
          { text: "📡 <strong>WebSocket temps réel</strong> — socket-service.js : gère la connexion permanente et la diffusion instantanée des messages.", media: 'images/code/animaland_websocket_explication.png' },
          { text: "🔔 <strong>Notifications push Firebase</strong> — notification-service.js : déclenche les alertes FCM vers les membres absents.", media: 'images/code/animaland_firebase_explication.png' },
          { text: "🔄 <strong>Transaction SQL avec ROLLBACK</strong> — cleanupService.js : purge sécurisée des messages de plus de 6 mois.", media: 'images/code/animaland_transaction_explication.png' }
        ]
      }
    ]
  },

  /* ───────────────────────── ANIMAL'VEST ───────────────────────── */
  animalvest: {
    icon: 'images/logo_animalvest.png',
    type: "Application Mobile — Boutique Privée",
    title: "Animal'vest",
    description: "Animal'vest est la boutique privée de l'association, réservée à ses membres. Elle repose sur Flutter côté mobile, une base MySQL/PostgreSQL côté données, et Firebase pour les notifications — totalement indépendante d'Animal'and Chat.",
    tags: ['Flutter', 'Dart', 'Firebase', 'MySQL / PostgreSQL', 'Emails automatiques', 'OVH'],
    features: [
      {
        id: 'acces', icon: '🔐', title: 'Accès membres uniquement',
        desc: "Animal'vest utilise un système d'accès unique : les membres se connectent sans identifiants grâce à un <strong>compte temporaire généré automatiquement</strong>.",
        steps: [
          { text: "Quand un membre ouvre l'application, un <strong>compte temporaire est généré automatiquement</strong>.", media: 'videos/Authentification.gif' },
          { text: "Dès que le membre <strong>ferme l'application</strong>, le compte temporaire est <strong>supprimé automatiquement</strong>.", media: 'images/screen_guest_log.png' },
          { text: "Si l'application reste ouverte, le compte est <strong>supprimé au bout de 24h</strong>.", media: 'images/screen_guest_log.png' },
          { text: "Seules l'email, l'adresse postale et le téléphone sont conservés, <strong>supprimés au bout de 6 mois</strong>." },
          { text: "<strong>Seul l'administrateur</strong> dispose d'un compte permanent avec identifiants.", media: 'videos/connexion_admin.gif' }
        ]
      },
      {
        id: 'catalogue', icon: '🛍️', title: 'Catalogue de produits',
        desc: "Les membres accèdent à un catalogue complet des articles proposés, avec filtrage par catégorie et sélection de taille.",
        steps: [
          { text: "La boutique affiche les <strong>produits disponibles</strong> en grille 2 colonnes.", media: 'videos/Boutique.gif' },
          { text: "Un <strong>carousel de catégories</strong> permet de filtrer les produits instantanément.", media: 'videos/2_-_Boutique.gif' },
          { text: "Chaque article possède une <strong>fiche détaillée</strong> avec tailles vêtements (XS–XXL) et chaussures (37–45)." }
        ]
      },
      {
        id: 'galerie', icon: '🖼️', title: 'Galerie multi-photos',
        desc: "Chaque produit peut disposer de plusieurs photos pour mieux présenter l'article sous tous ses angles.",
        steps: [
          { text: "L'administrateur peut ajouter <strong>jusqu'à 8 photos</strong> par produit.", media: 'videos/2_-_Boutique.gif' },
          { text: "Chaque carte produit affiche un <strong>mini-carousel</strong> avec indicateurs et compteur X/Y.", media: 'videos/galerie_etape2.gif' },
          { text: "Un tap sur l'image ouvre une <strong>visionneuse plein écran</strong>." }
        ]
      },
      {
        id: 'categories', icon: '📋', title: 'Catégories & Unités',
        desc: "L'écran d'accueil affiche une grille d'unités représentant les différents groupes de l'association.",
        steps: [
          { text: "La page d'accueil présente une <strong>grille d'unités en 2 colonnes</strong>.", media: 'videos/Accueil.gif' },
          { text: "Taper une catégorie <strong>redirige directement</strong> vers la boutique filtrée.", media: 'videos/category_accueil.gif' },
          { text: "Les admins voient un bouton <strong>···</strong> pour gérer les unités.", media: 'videos/test_cate_accueil.gif' }
        ]
      },
      {
        id: 'panier', icon: '🛒', title: 'Panier & Commandes',
        desc: "Les membres peuvent composer leur panier et passer commande en renseignant leurs informations de livraison.",
        steps: [
          { text: "Le membre ajoute les articles à son <strong>panier</strong>.", media: 'videos/Panier.gif' },
          { text: "En validant, un <strong>formulaire de commande</strong> s'ouvre." },
          { text: "Le membre reçoit un <strong>email automatique à chaque changement de statut</strong>.", media: 'images/emails_automatiques_montage.png' }
        ]
      },
      {
        id: 'admin', icon: '🛡️', title: 'Panel administrateur',
        desc: "L'administrateur dispose d'un espace complet pour gérer la boutique, les commandes et les membres.",
        steps: [
          { text: "<strong>Statistiques en temps réel.</strong>", media: 'images/panelrh.PNG' },
          { text: "<strong>Suivi des commandes :</strong> liste filtrable avec fiche client.", media: 'images/screen_commandes_fiche.jpg' },
          { text: "<strong>Traitement manuel :</strong> changement de statut et ajout d'une <strong>note interne</strong>." },
          { text: "<strong>Gestion des admins.</strong>", media: 'images/screen_admin_list.jpg' },
          { text: "<strong>Création de compte admin.</strong>", media: 'images/screen_admin_create.jpg' }
        ]
      },
      {
        id: 'colis', icon: '📦', title: 'Numéro de colis obligatoire',
        desc: "Le passage au statut « expédiée » est bloqué tant qu'un numéro de colis valide n'est pas saisi.",
        steps: [
          { text: "Vue d'ensemble de la gestion des commandes et du champ numéro de colis.", media: 'images/montage_commandes.png' },
          { text: "Le bouton reste <strong>grisé et bloqué</strong> tant que le numéro n'est pas valide." },
          { text: "Le numéro doit contenir <strong>exactement 8 chiffres</strong>, avec un indicateur du nombre de chiffres restants en temps réel." },
          { text: "Le numéro est <strong>enregistré avec la commande</strong> et un email de suivi est automatiquement envoyé." }
        ]
      },
      {
        id: 'notif', icon: '🔔', title: 'Notifications push',
        desc: "Firebase Cloud Messaging alerte l'administrateur en temps réel.",
        steps: [
          { text: "Dès qu'un membre valide une commande, une <strong>notification push FCM</strong> est envoyée à l'administrateur." },
          { text: "La notification est reçue <strong>même si l'app est fermée</strong>." },
          { text: "Un tap <strong>ouvre directement</strong> le détail de la commande." }
        ]
      },
      {
        id: 'mail', icon: '✉️', title: 'Emails automatiques',
        desc: "À chaque étape du traitement de sa commande, le membre reçoit automatiquement un email de suivi, déclenché côté serveur.",
        steps: [
          { text: "Aperçu des différents emails envoyés à chaque changement de statut.", media: 'images/emails_automatiques_montage.png' },
          { text: "Commande <strong>confirmée</strong> : email de récapitulatif." },
          { text: "Statut <em>« traitée »</em> : email en cours de préparation." },
          { text: "Statut <em>« expédiée »</em> : email avec le <strong>numéro de colis</strong>." },
          { text: "Statut <em>« livrée »</em> : email de <strong>confirmation</strong>." }
        ]
      },
      {
        id: 'securite', icon: '🔒', title: 'Sécurité & Mot de passe',
        desc: "L'application intègre plusieurs mécanismes de sécurité.",
        steps: [
          { text: "<strong>Politique commune :</strong> minimum 8 caractères, majuscule, chiffre, caractère spécial." },
          { text: "<strong>Indicateur de force en temps réel</strong> et formatters de saisie." },
          { text: "<strong>Rate limiter :</strong> 5 tentatives max en 2 minutes." },
          { text: "<strong>FlutterSecureStorage</strong> pour les tokens JWT." }
        ]
      },
      {
        id: 'bdd', icon: '🗄️', title: 'Base de données & Code',
        desc: "Architecture Flutter, base relationnelle MySQL/PostgreSQL, Firebase pour les notifications. Un singleton <strong>ApiService</strong> injecte automatiquement le token JWT dans chaque requête.",
        steps: [
          { text: "<strong>MCD complet</strong> de l'application avec toutes les tables relationnelles.", media: 'images/mcd_animalvest.png' },
          { text: "✉️ <strong>Emails transactionnels</strong> — emailService.js.", media: 'images/code/animavest_email_explication.png' },
          { text: "🔔 <strong>Notifications push admins</strong> — fcmService.js.", media: 'images/code/animavest_fcm_explication.png' },
          { text: "🔒 <strong>Authentification sécurisée</strong> — secure-auth.js.", media: 'images/code/secure-auth-simple.png' }
        ]
      }
    ]
  },

  /* ───────────────────────── GESTION DE PROJET ───────────────────────── */
  taskmanager: {
    icon: null,
    type: "Application Web — Gestion de Projet",
    title: "Gestion de Projet",
    description: "Application web de gestion de tâches séquentielles avec sous-tâches. La progression est <strong>conditionnelle</strong> : impossible d'avancer sans avoir validé toutes les sous-tâches en cours. La 3ᵉ tâche inclut un système de <strong>validation de quittancement</strong> qui génère un PDF envoyé automatiquement par email.",
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'PDF', 'Email'],
    features: [
      {
        id: 'liste', icon: '📋', title: 'Liste de tâches & sous-tâches',
        desc: "À l'arrivée sur la page, l'utilisateur est accueilli par une interface claire présentant l'ensemble des tâches à réaliser, chacune accompagnée de ses sous-tâches.",
        steps: [
          { text: "Vue initiale — la 1ʳᵉ tâche est active.", media: 'images/etape1.png' },
          { text: "La page affiche une <strong>liste de tâches principales</strong>, chacune contenant plusieurs sous-tâches à réaliser." },
          { text: "Chaque sous-tâche est accompagnée d'une <strong>case à cocher</strong> permettant de la marquer comme réalisée." },
          { text: "Seule la <strong>tâche en cours</strong> est active ; les suivantes sont verrouillées jusqu'à validation complète." }
        ]
      },
      {
        id: 'modifier', icon: '✏️', title: 'Fonctionnalité Modifier',
        desc: "Le bouton « Modifier » permet d'éditer le contenu d'une tâche et de ses sous-tâches via un modal dédié, directement depuis l'interface principale.",
        steps: [
          { text: "Un clic sur le bouton <strong>« Modifier »</strong> ouvre un <strong>modal d'édition</strong> contextuel." },
          { text: "Le modal permet de modifier à la fois le <strong>libellé de la tâche principale</strong> et ceux de toutes ses <strong>sous-tâches associées</strong>." },
          { text: "Les modifications sont <strong>enregistrées et appliquées immédiatement</strong> dans l'interface principale sans rechargement de page." }
        ]
      },
      {
        id: 'suivant', icon: '➡️', title: 'Navigation Suivant',
        desc: "Le bouton « Suivant » permet de progresser dans la liste des tâches, mais uniquement lorsque toutes les sous-tâches de la tâche en cours sont entièrement validées.",
        steps: [
          { text: "Le bouton <strong>« Suivant »</strong> est présent sur chaque tâche active de l'interface." },
          { text: "Il est <strong>impossible de passer à la tâche suivante</strong> sans avoir coché <em>toutes</em> les sous-tâches de la tâche en cours." },
          { text: "Par exemple, pour accéder à la 2ᵉ tâche, <strong>toutes les sous-tâches de la 1ʳᵉ</strong> doivent obligatoirement être cochées." },
          { text: "Ce mécanisme garantit une progression <strong>séquentielle et contrôlée</strong>, évitant tout saut non autorisé dans le workflow." }
        ]
      },
      {
        id: 't2', icon: '⚠️', title: 'Particularité de la 2ᵉ tâche',
        desc: "La 2ᵉ tâche introduit un comportement conditionnel renforcé : elle disparaît automatiquement si une sous-tâche de la 1ʳᵉ tâche est décochée a posteriori.",
        steps: [
          { text: "Le fonctionnement est <strong>identique à la 1ʳᵉ tâche</strong> en termes de validation et de navigation conditionnelle." },
          { text: "<strong>Exception importante :</strong> si une sous-tâche de la 1ʳᵉ tâche est <strong>décochée</strong> après coup, la 2ᵉ tâche <strong>disparaît automatiquement</strong> de l'interface." },
          { text: "Pour la faire réapparaître, il faut d'abord <strong>re-cocher la sous-tâche</strong> décochée dans la 1ʳᵉ tâche, puis cliquer à nouveau sur <strong>« Suivant »</strong>." }
        ]
      },
      {
        id: 't3', icon: '📄', title: 'Validation de quittancement',
        desc: "La 3ᵉ tâche ajoute une étape finale de validation officielle : un bouton de quittancement permettant de clôturer l'ensemble du workflow et d'envoyer un document PDF par email.",
        steps: [
          { text: "Étape 2 — Tâches 1 & 2 visibles.", media: 'images/etape2.png' },
          { text: "Étape 3 — Les 3 tâches complètes, bouton de quittancement actif.", media: 'images/etape3.png' },
          { text: "Une <strong>confirmation préalable</strong> est demandée à l'utilisateur avant la validation finale, afin de prévenir toute erreur de manipulation.", media: 'images/validation.png' },
          { text: "Après validation, le gestionnaire <strong>envoie automatiquement un email</strong> contenant le quittancement en <strong>pièce jointe PDF</strong>." }
        ]
      },
      {
        id: 'mcd', icon: '🗄️', title: 'Base de données — MCD',
        desc: "La base de données repose sur <strong>5 tables relationnelles</strong> structurant les tâches, sous-tâches, quittances et utilisateurs.",
        steps: [
          { text: "Table <strong>Taches</strong> : identifiant, nom, date de prévision, état et clé étrangère vers Quittance." },
          { text: "Table <strong>SousTaches</strong> : liée à Taches et Quittance, avec état et dates de début/validation." },
          { text: "Table <strong>Quittance</strong> : libellé, dates, et clés étrangères vers SousTaches et Users." },
          { text: "Table <strong>Users</strong> : nom, prénom, email et rôle enum <em>(gestionnaire / admin / comptable)</em>." },
          { text: "MCD complet avec les 5 tables et leurs relations.", media: 'images/mcd_gestion_projet.png' }
        ]
      }
    ]
  },

  /* ───────────────────────── GSB — GESTION DES CONGÉS ───────────────────────── */
  'gsb-conges': {
    icon: null,
    type: "Application Windows — GSB Mission 1",
    title: "GSB Gestion des Congés",
    description: "Application C# Windows développée dans le cadre du projet AP GSB. Elle permet aux praticiens de soumettre des demandes de congés et au responsable RH de les valider ou refuser, avec gestion automatique des soldes et notifications à la connexion.",
    tags: ['C#', 'Windows Forms', 'Laravel', 'MySQL', 'API REST'],
    features: [
      {
        id: 'connexion', icon: '🔑', title: 'Connexion & Comptes',
        desc: "L'application propose deux types de comptes avec des interfaces et des droits distincts selon le rôle.",
        steps: [
          { text: "Deux rôles : <strong>Praticien</strong> et <strong>Responsable RH</strong>.", media: 'images/gsb/schema.png' },
          { text: "Le <strong>compte praticien</strong> donne accès au formulaire de demande et à l'historique." },
          { text: "Le <strong>compte RH</strong> donne accès à la liste complète des demandes." }
        ]
      },
      {
        id: 'demande', icon: '📅', title: 'Demande de congés',
        desc: "Le praticien peut soumettre une demande de congés. L'application vérifie automatiquement son solde avant d'autoriser la demande.",
        steps: [
          { text: "Sélection de la <strong>date de début</strong> et <strong>date de fin</strong>.", media: 'images/gsb/demandecongés.png' },
          { text: "Le solde disponible s'affiche en cliquant sur « Voir mes jours restants ».", media: 'images/gsb/notifconnexion2.png' },
          { text: "Si le solde est suffisant, la demande est <strong>soumise et enregistrée</strong> en base.", media: 'images/gsb/attente.png' },
          { text: "Si refusée, une notification s'affiche à la prochaine connexion.", media: 'images/gsb/notifconnexion.png' }
        ]
      },
      {
        id: 'rh', icon: '🛡️', title: 'Panel RH',
        desc: "Le responsable RH dispose d'un espace dédié pour consulter et traiter toutes les demandes.",
        steps: [
          { text: "Le RH voit la <strong>liste de toutes les demandes</strong> en attente.", media: 'images/gsb/panelrh.png' },
          { text: "Le RH peut <strong>accepter ou refuser</strong> en un clic. Le solde est mis à jour automatiquement." }
        ]
      },
      {
        id: 'notif', icon: '🔔', title: 'Notifications à la connexion',
        desc: "Lors de chaque connexion, le praticien est automatiquement informé de l'état de ses demandes en cours.",
        steps: [
          { text: "Dès la connexion, une <strong>notification s'affiche</strong> si des demandes ont été traitées." },
          { text: "Le praticien peut consulter l'<strong>historique complet</strong> de ses demandes avec leur statut." }
        ]
      },
      {
        id: 'bdd', icon: '🗄️', title: 'Base de données & Code',
        desc: "L'application C# communique avec un backend Laravel via une API REST. Les données sont en MySQL.",
        steps: [
          { text: "🔑 <strong>Authentification C#</strong> — Connexion &amp; routage des rôles : une requête SQL sélectionne id, login, mdp, rôle et id_prat dans la table utilisateur. Si aucune ligne n'est retournée, une erreur s'affiche. Sinon, le champ rôle (0 = praticien, 1 = RH) détermine le formulaire à ouvrir.", media: 'images/gsb/CodeConnexion.png' },
          { text: "📅 <strong>Demande de congés</strong> — Vérification du solde &amp; insertion en BDD : le nombre de jours demandés est calculé puis comparé au solde disponible. Si suffisant, un INSERT INTO demandeconge est exécuté.", media: 'images/gsb/CodeDemandeConges.png' },
          { text: "🛡️ <strong>Panel RH</strong> — Récupération de la demande (1/3) : un SELECT récupère id_praticien, dates et état pour la demande sélectionnée.", media: 'images/gsb/CodeGestionConges1.png' },
          { text: "🛡️ <strong>Panel RH</strong> — Calcul du delta de jours (2/3) : selon la transition d'état, le solde du praticien est ajusté directement en SQL (UPDATE praticien SET jours_conges_restants...).", media: 'images/gsb/CodeGestionConges2.png' },
          { text: "🛡️ <strong>Panel RH</strong> — Mise à jour de l'état &amp; rafraîchissement (3/3) : un UPDATE demandeconge applique le nouvel état, puis la liste est rechargée immédiatement.", media: 'images/gsb/CodeGestionConges3.png' }
        ]
      }
    ]
  },

  /* ───────────────────────── GSB — GESTION DES SALAIRES ───────────────────────── */
  'gsb-salaires': {
    icon: null,
    type: "Application Web — GSB Mission 2",
    title: "GSB Gestion des Salaires",
    description: "Application web développée avec Laravel permettant au service RH de consulter et modifier les salaires des praticiens hospitaliers. Les salaires sont calculés automatiquement selon l'échelon attribué en fonction de l'ancienneté du praticien.",
    tags: ['Laravel', 'PHP', 'MySQL', 'Blade', 'MVC'],
    features: [
      {
        id: 'connexion', icon: '🔑', title: 'Connexion & Droits RH',
        desc: "L'accès à l'application est restreint au service RH. L'authentification est gérée par Laravel et un message d'erreur s'affiche si les identifiants sont incorrects ou si un compte sans droits RH tente de se connecter.",
        steps: [
          { text: "Page de connexion dédiée avec les champs Login et Mot de passe.", media: 'images/gsb/Connexion.png' },
          { text: "Authentification gérée par <strong>Laravel Auth</strong> avec sessions sécurisées." },
          { text: "Si les identifiants ne correspondent pas à un compte RH, un message d'erreur rouge s'affiche : « Accès réservé aux RH ».", media: 'images/gsb/ConnexionRefus.png' },
          { text: "Une fois connecté, le responsable accède au tableau de bord listant tous les praticiens avec leurs informations salariales." }
        ]
      },
      {
        id: 'grille', icon: '📊', title: 'Grille tarifaire & Échelons',
        desc: "La rémunération des praticiens suit une grille officielle de 13 échelons définie dans le cahier des charges.",
        steps: [
          { text: "<strong>13 échelons</strong> définis selon l'ancienneté : échelons 1 à 8 durent 2 ans chacun, échelons 9 à 12 durent 4 ans, l'échelon 13 est le palier maximum (32 ans et plus)." },
          { text: "Salaires bruts mensuels allant de <strong>4 633,98 €</strong> (échelon 1) à <strong>9 368,05 €</strong> (échelon 13)." },
          { text: "L'échelon est affiché en couleur cyan et le salaire en vert dans le tableau pour faciliter la lecture.", media: 'images/gsb/InterfaceAppli.png' }
        ]
      },
      {
        id: 'anciennete', icon: '⏳', title: "Calcul automatique de l'ancienneté",
        desc: "L'échelon est déterminé automatiquement à partir de l'ancienneté saisie par le responsable RH grâce à deux <strong>triggers SQL</strong> sur la table praticien : l'un se déclenche en BEFORE UPDATE si l'ancienneté change, l'autre en BEFORE INSERT à la création. Les deux recherchent la ligne correspondante dans grille_salaire via la condition <code>anciennete_min &lt;= ancienneté &lt;= anciennete_max</code>.",
        steps: [
          { text: "Un clic sur « Modifier » ouvre un formulaire affichant nom, prénom, échelon et salaire en cours.", media: 'images/gsb/ModificationPrat.png' },
          { text: "Le responsable RH saisit la <strong>nouvelle ancienneté</strong> (en années)." },
          { text: "Trigger <strong>BEFORE UPDATE</strong> — se déclenche si l'ancienneté est modifiée.", media: 'images/gsb/Trigger1.png' },
          { text: "Trigger <strong>BEFORE INSERT</strong> — se déclenche à la création d'un praticien.", media: 'images/gsb/Trigger2.png' },
          { text: "Un bandeau vert de confirmation s'affiche : « Ancienneté de [Prénom Nom] mise à jour avec succès. »", media: 'images/gsb/NotifSuccès.png' },
          { text: "Le tableau est mis à jour immédiatement avec la nouvelle ancienneté, le nouvel échelon et le nouveau salaire.", media: 'images/gsb/InterfaceAppli.png' }
        ]
      },
      {
        id: 'interface', icon: '🖥️', title: 'Interface RH',
        desc: "Interface web complète permettant au service RH de consulter, rechercher et mettre à jour les informations salariales de l'ensemble des praticiens.",
        steps: [
          { text: "Liste complète des praticiens : nom, prénom, ancienneté, échelon et salaire brut mensuel.", media: 'images/gsb/InterfaceAppli.png' },
          { text: "Barre de recherche : filtrage instantané par nom, prénom ou nom complet, avec pagination.", media: 'images/gsb/BarreRecherche.png' },
          { text: "Vues <strong>Blade de Laravel</strong> pour le rendu dynamique, pagination de 100 praticiens par page." },
          { text: "Bouton « Réinitialiser » pour effacer le filtre, et bouton « Déconnexion » toujours accessible." }
        ]
      },
      {
        id: 'bdd', icon: '🗄️', title: 'Base de données & Code',
        desc: "La base MySQL a été adaptée pour intégrer la gestion des anciennetés, des échelons et des salaires des praticiens : tables grille_salaire, praticien, utilisateur, ville/département/région, demandeconge et Notif.",
        steps: [
          { text: "MCD — GSB Gestion des Salaires.", media: 'images/gsb/mcd.png' },
          { text: "🖥️ <strong>PraticienController.php</strong> — Gestion web : index() liste et filtre les praticiens, edit() charge le formulaire, update() valide l'ancienneté et déclenche les triggers SQL au moment de la sauvegarde.", media: 'images/gsb/PratController.png' },
          { text: "📡 <strong>Api/PraticienController.php</strong> — Endpoints REST pour l'app Flutter : index() calcule les moyennes de notes via jointures, show() retourne un praticien, avisClients() renvoie les avis filtrés.", media: 'images/gsb/APIController.png' }
        ]
      }
    ]
  },

  /* ───────────────────────── GSB — NOTES PRATICIENS ───────────────────────── */
  'gsb-notes': {
    icon: null,
    type: "Application Mobile — GSB Mission 3",
    title: "GSB Notes Praticiens",
    description: "Application mobile Flutter développée dans le cadre de la Mission 5 AP3-4. Elle permet aux clients de consulter la liste des praticiens GSB de la région, d'afficher leurs deux notes (clientèle et expert sur 5), de trier le classement et de consulter le détail des avis avec commentaires. Le backend repose sur l'API REST Laravel déjà mise en place lors de la Mission 2.",
    tags: ['Flutter', 'Dart', 'Laravel', 'MySQL', 'API REST', 'JSON'],
    features: [
      {
        id: 'liste', icon: '📋', title: 'Liste des praticiens',
        desc: "L'écran principal affiche l'ensemble des praticiens GSB de la région avec leurs deux notes sur 5 et un bouton pour accéder au détail.",
        steps: [
          { text: "Chaque ligne affiche le nom du praticien, sa note clientèle et sa note expert (étoiles /5).", media: 'images/gsb/trieexpert.PNG' },
          { text: "Un bouton « Détail » est présent sur chaque ligne. La barre de recherche permet de filtrer par nom ou prénom.", media: 'images/gsb/BarreDeRecherche.PNG' },
          { text: "La liste est scrollable verticalement pour parcourir l'ensemble des praticiens." }
        ]
      },
      {
        id: 'notes', icon: '⭐', title: 'Deux types de notes',
        desc: "Chaque praticien dispose de deux notes distinctes sur 5, correspondant à deux types d'évaluateurs.",
        steps: [
          { text: "<strong>Note clientèle :</strong> moyenne calculée à partir des avis laissés par les patients.", media: 'images/gsb/trieclient.PNG' },
          { text: "<strong>Note expert :</strong> note unique attribuée par une équipe mandatée par GSB.", media: 'images/gsb/TrieExpertmeilleur.PNG' },
          { text: "Les deux notes sont visibles dans la liste principale et reprises en détail dans la fiche praticien.", media: 'images/gsb/PageProfil.png' }
        ]
      },
      {
        id: 'tri', icon: '🔄', title: 'Classement & Tri',
        desc: "L'application propose de trier la liste des praticiens selon les notes pour faciliter le choix de l'utilisateur.",
        steps: [
          { text: "Tri par <strong>note clientèle</strong> : les praticiens les mieux notés par leurs patients en premier.", media: 'images/gsb/trieclient.PNG' },
          { text: "Tri par <strong>note expert</strong> : priorité à l'évaluation professionnelle de l'équipe GSB.", media: 'images/gsb/trieexpert.PNG' },
          { text: "Le tri est décroissant ou croissant au choix, et le classement se met à jour instantanément sans rechargement.", media: 'images/gsb/TrieExpertmeilleur.PNG' }
        ]
      },
      {
        id: 'detail', icon: '🔍', title: 'Fiche détail praticien',
        desc: "En appuyant sur « Détail », l'utilisateur accède à la fiche complète avec informations, note expert et commentaires clients.",
        steps: [
          { text: "La fiche affiche nom, prénom, adresse, ancienneté, échelon et salaire.", media: 'images/gsb/PageProfil.png' },
          { text: "La note expert sur 5 est affichée avec étoiles et commentaires de l'équipe d'experts.", media: 'images/gsb/PageProfil.png' },
          { text: "La note clientèle globale sur 5 est affichée, suivie de la liste détaillée des avis clients, scrollable indépendamment.", media: 'images/gsb/PageProfil.png' }
        ]
      },
      {
        id: 'commentaires', icon: '💬', title: 'Commentaires clients',
        desc: "Dans la fiche détail, l'utilisateur consulte la liste complète des avis clients avec note individuelle et commentaire.",
        steps: [
          { text: "Chaque avis affiche une note individuelle sur 5 et le texte du commentaire.", media: 'images/gsb/PageProfil.png' },
          { text: "La liste est scrollable verticalement dans une zone dédiée de la fiche détail." },
          { text: "Les commentaires sont chargés via l'API REST et filtrés par identifiant praticien." }
        ]
      },
      {
        id: 'api', icon: '📱', title: 'API REST Laravel',
        desc: "L'application Flutter consomme l'API REST Laravel de la Mission 2. De nouveaux endpoints ont été ajoutés pour les notes et commentaires.",
        steps: [
          { text: "<strong>GET /praticiens</strong> : liste complète avec notes clientèle et expert au format JSON." },
          { text: "<strong>GET /praticiens/{id}/commentaires</strong> : commentaires clients liés à un praticien précis." },
          { text: "Flutter utilise le package http pour les requêtes et dart:convert pour parser le JSON.", media: 'images/gsb/Codeflutter.PNG' },
          { text: "Routes dans routes/api.php, sérialisées via des API Resources dédiées." }
        ]
      },
      {
        id: 'bdd', icon: '🗄️', title: 'Base de données & Code',
        desc: "La base MySQL GSB existante a été enrichie pour stocker les notes et commentaires, en s'appuyant sur les praticiens de la Mission 2 (migrations Laravel + seeders de test).",
        steps: [
          { text: "Table <strong>notes_clients</strong> : note individuelle sur 5 et commentaire par client et par praticien." },
          { text: "Table <strong>notes_experts</strong> : note sur 5 attribuée par l'équipe GSB pour chaque praticien." },
          { text: "Les deux tables utilisent une clé étrangère vers la table praticiens." },
          { text: "📡 Fetch praticiens — praticiens_page.dart : construction d'URL dynamique avec recherche, tri et pagination.", media: 'images/code/flutter_praticiens_explication.png' },
          { text: "🃏 Widget item — Row( avatar + étoiles + bouton Détail ), navigation vers PraticienDetail.", media: 'images/code/flutter_widget_item_explication.png' }
        ]
      }
    ]
  },

  /* ───────────────────────── LEAGUE OF LEGENDS ───────────────────────── */
  lol: {
    icon: null,
    type: "Projet Web — Personnel",
    title: "League of Legends",
    description: "Projet web immersif inspiré de l'univers de League of Legends. Affichage de données de jeu, design thématique et intégration d'une base de données pour gérer les champions et statistiques.",
    tags: ['HTML', 'CSS', 'PHP', 'MySQL'],
    features: [
      {
        id: 'fonctionnalites', icon: '⚔️', title: 'Fonctionnalités',
        desc: "Un projet personnel pour explorer un design thématique fort couplé à une base de données de jeu.",
        steps: [
          { text: "Affichage et recherche de champions." },
          { text: "Base de données MySQL des personnages." },
          { text: "Design thématique inspiré du jeu." },
          { text: "Interface web responsive en PHP/HTML/CSS." }
        ]
      }
    ]
  }
};

/* ════════════════════════════════════════════════════════
   MOTEUR DE LA "VUE PROJET" (sidebar + contenu)
   Remplace l'ancien empilement modal → sous-modal → popup
   vidéo : tout se navigue au clic, dans le même panneau.
════════════════════════════════════════════════════════ */
let _pvProjectId = null;

function openProject(id) {
  const p = PROJECTS[id];
  if (!p) return;
  _pvProjectId = id;

  const iconEl = document.getElementById('pvIcon');
  if (p.icon) { iconEl.src = p.icon; iconEl.style.display = ''; }
  else { iconEl.style.display = 'none'; }

  document.getElementById('pvType').textContent = p.type;
  document.getElementById('pvTitle').textContent = p.title;
  document.getElementById('pvTags').innerHTML = p.tags.map(function (t) {
    return '<span class="pv-tag">' + t + '</span>';
  }).join('');

  renderSidebar(p);
  selectFeature('overview');

  document.getElementById('pvOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderSidebar(p) {
  var html = '<button class="pv-nav-item" data-fid="overview" onclick="selectFeature(\'overview\')">' +
    '<span class="pv-nav-icon">&#x2756;</span><span>Vue d\'ensemble</span></button>';
  p.features.forEach(function (f) {
    html += '<button class="pv-nav-item" data-fid="' + f.id + '" onclick="selectFeature(\'' + f.id + '\')">' +
      '<span class="pv-nav-icon">' + f.icon + '</span><span>' + f.title + '</span></button>';
  });
  document.getElementById('pvSidebar').innerHTML = html;
}

function selectFeature(fid) {
  var p = PROJECTS[_pvProjectId];
  if (!p) return;

  document.querySelectorAll('.pv-nav-item').forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-fid') === fid);
  });

  var content = document.getElementById('pvContent');

  if (fid === 'overview') {
    content.innerHTML = '<p class="pv-desc pv-desc-lead">' + p.description + '</p>' +
      '<div class="pv-overview-grid">' + p.features.map(function (f) {
        return '<button class="pv-overview-card" onclick="selectFeature(\'' + f.id + '\')">' +
          '<span class="pv-overview-icon">' + f.icon + '</span>' +
          '<span class="pv-overview-title">' + f.title + '</span></button>';
      }).join('') + '</div>';
  } else {
    var f = p.features.filter(function (x) { return x.id === fid; })[0];
    if (!f) return;
    var html = '<p class="pv-desc">' + f.desc + '</p><div class="pv-steps">';
    f.steps.forEach(function (s, i) {
      html += '<div class="pv-step">' +
        '<div class="pv-step-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="pv-step-body"><p>' + s.text + '</p>' +
        (s.media ? renderMedia(s.media) : '') +
        '</div></div>';
    });
    html += '</div>';
    content.innerHTML = html;
  }
  content.scrollTop = 0;
  _pvInitMedia();
}

/* -- Médias différés : ne charge/joue un screen ou un gif QUE quand il
   entre dans la zone visible du panneau, et coupe la lecture des vidéos
   quand elles en ressortent. Evite de faire tourner 5-6 gifs/vidéos en
   même temps, qui est la cause du ralentissement dans les modals. -- */
function renderMedia(src) {
  var ext = src.split('?')[0].split('.').pop().toLowerCase();
  var isVideo = (ext === 'mp4' || ext === 'webm');
  return '<div class="pv-media" data-media-src="' + src.replace(/"/g, '&quot;') + '" data-media-type="' + (isVideo ? 'video' : 'image') + '" onclick="_pvMediaClick(this)">' +
    '<div class="pv-media-skeleton"><span>&#x1F5BC;</span></div>' +
    '<span class="pv-media-zoom">&#x1F50D; Agrandir</span></div>';
}

function _pvMediaClick(el) {
  var src = el.getAttribute('data-media-src');
  if (src) openLightbox(src);
}

var _pvMediaObserver = null;
function _pvInitMedia() {
  if (_pvMediaObserver) _pvMediaObserver.disconnect();
  var root = document.getElementById('pvContent');
  _pvMediaObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      if (entry.isIntersecting) {
        if (!el.dataset.loaded) { _pvLoadMedia(el); }
        else {
          var vid = el.querySelector('video');
          if (vid) vid.play().catch(function () {});
        }
      } else {
        var vid2 = el.querySelector('video');
        if (vid2) vid2.pause();
      }
    });
  }, { root: root, rootMargin: '150px 0px', threshold: 0.01 });

  root.querySelectorAll('.pv-media[data-media-src]').forEach(function (el) {
    _pvMediaObserver.observe(el);
  });
}

function _pvLoadMedia(container) {
  container.dataset.loaded = '1';
  var src = container.getAttribute('data-media-src');
  var type = container.getAttribute('data-media-type');
  var safe = _safeSrc(src);
  var skeleton = container.querySelector('.pv-media-skeleton');
  var el;
  if (type === 'video') {
    el = document.createElement('video');
    el.muted = true; el.loop = true; el.playsInline = true; el.preload = 'metadata';
    el.src = safe;
    el.addEventListener('loadeddata', function () { el.play().catch(function () {}); });
  } else {
    el = document.createElement('img');
    el.loading = 'lazy';
    el.alt = '';
    el.src = safe;
  }
  el.addEventListener('error', function () {
    container.innerHTML = '<div class="pv-media-error">&#x26A0; Fichier introuvable<br>' + src + '</div>';
  });
  container.insertBefore(el, skeleton);
  if (skeleton) skeleton.remove();
}

function closeProject() {
  document.getElementById('pvOverlay').classList.remove('active');
  document.body.style.overflow = '';
  if (_pvMediaObserver) { _pvMediaObserver.disconnect(); }
  document.querySelectorAll('#pvContent video').forEach(function (v) { v.pause(); });
}
function closeProjectOverlay(e) { if (e.target === e.currentTarget) closeProject(); }

/* ---- Lightbox (zoom + pan + mode grand écran) ---- */
var _lb = { scale: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, big: false, pinchDist: 0 };
var LB_MIN = 1, LB_MAX = 4, LB_STEP = 0.5;

function openLightbox(src) {
  var safe = _safeSrc(src);
  var ext = src.split('?')[0].split('.').pop().toLowerCase();
  var isVideo = (ext === 'mp4' || ext === 'webm');
  var box = document.getElementById('lightboxMedia');
  var errDiv = document.getElementById('lightboxErr');
  errDiv.style.display = 'none';
  box.innerHTML = isVideo
    ? '<video src="' + safe + '" autoplay loop muted playsinline controls></video>'
    : '<img src="' + safe + '" alt="" draggable="false">';
  var media = box.querySelector('img,video');
  var onErr = function () {
    box.innerHTML = '';
    errDiv.querySelector('#lightboxErrPath').textContent = src;
    errDiv.style.display = 'block';
  };
  if (media) media.addEventListener('error', onErr);

  _lbReset();
  document.getElementById('lightbox').classList.add('active');
  _lbBindViewportEvents();
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('.lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('active');
  document.getElementById('lightboxMedia').innerHTML = '';
  var inner = document.getElementById('lightboxInner');
  if (inner) inner.classList.remove('big');
  var bigBtn = document.getElementById('lightboxBigBtn');
  if (bigBtn) bigBtn.classList.remove('active');
  _lbReset();
}

/* -- Mode grand écran : agrandit la fenêtre pour zoomer sans perdre en netteté -- */
function toggleLightboxBig(e) {
  if (e) e.stopPropagation();
  _lb.big = !_lb.big;
  var inner = document.getElementById('lightboxInner');
  var btn = document.getElementById('lightboxBigBtn');
  if (inner) inner.classList.toggle('big', _lb.big);
  if (btn) btn.classList.toggle('active', _lb.big);
}

/* -- Zoom (boutons +/-, molette, pincement tactile) + déplacement (drag) -- */
function _lbApply() {
  var box = document.getElementById('lightboxMedia');
  var media = box && box.querySelector('img,video');
  if (!media) return;
  media.style.transform = 'translate(' + _lb.x + 'px,' + _lb.y + 'px) scale(' + _lb.scale + ')';
  var viewport = document.getElementById('lightboxViewport');
  if (viewport) viewport.classList.toggle('zoomed', _lb.scale > 1);
  var level = document.getElementById('lightboxZoomLevel');
  if (level) level.textContent = Math.round(_lb.scale * 100) + '%';
}

function _lbReset() {
  _lb.scale = 1; _lb.x = 0; _lb.y = 0; _lb.dragging = false;
  _lbApply();
}

function lightboxReset(e) {
  if (e) e.stopPropagation();
  _lbReset();
}

function lightboxZoom(e, dir) {
  if (e) e.stopPropagation();
  var viewport = document.getElementById('lightboxViewport');
  if (!viewport) return;
  _lbZoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, dir * LB_STEP);
}

function _lbZoomAt(offsetX, offsetY, delta) {
  var newScale = Math.min(LB_MAX, Math.max(LB_MIN, Math.round((_lb.scale + delta) * 100) / 100));
  if (newScale === _lb.scale) return;
  var viewport = document.getElementById('lightboxViewport');
  var cx = offsetX - viewport.clientWidth / 2;
  var cy = offsetY - viewport.clientHeight / 2;
  var ratio = newScale / _lb.scale;
  _lb.x = cx - (cx - _lb.x) * ratio;
  _lb.y = cy - (cy - _lb.y) * ratio;
  _lb.scale = newScale;
  if (_lb.scale === LB_MIN) { _lb.x = 0; _lb.y = 0; }
  _lbApply();
}

function _lbTouchDist(touches) {
  var dx = touches[0].clientX - touches[1].clientX;
  var dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

var _lbEventsBound = false;
function _lbBindViewportEvents() {
  if (_lbEventsBound) return;
  _lbEventsBound = true;
  var viewport = document.getElementById('lightboxViewport');
  if (!viewport) return;

  /* Molette = zoom centré sur le curseur */
  viewport.addEventListener('wheel', function (e) {
    if (!document.querySelector('#lightboxMedia img,#lightboxMedia video')) return;
    e.preventDefault();
    var rect = viewport.getBoundingClientRect();
    _lbZoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? LB_STEP : -LB_STEP);
  }, { passive: false });

  /* Double-clic = zoom rapide sur le point cliqué, ou retour à 100% */
  viewport.addEventListener('dblclick', function (e) {
    var rect = viewport.getBoundingClientRect();
    if (_lb.scale > 1) { _lbReset(); }
    else { _lbZoomAt(e.clientX - rect.left, e.clientY - rect.top, LB_STEP * 3); }
  });

  /* Souris : déplacement (drag) une fois zoomé */
  viewport.addEventListener('mousedown', function (e) {
    if (_lb.scale <= 1) return;
    e.preventDefault();
    _lb.dragging = true;
    _lb.startX = e.clientX - _lb.x;
    _lb.startY = e.clientY - _lb.y;
    viewport.classList.add('dragging');
  });
  window.addEventListener('mousemove', function (e) {
    if (!_lb.dragging) return;
    _lb.x = e.clientX - _lb.startX;
    _lb.y = e.clientY - _lb.startY;
    _lbApply();
  });
  window.addEventListener('mouseup', function () {
    _lb.dragging = false;
    viewport.classList.remove('dragging');
  });

  /* Tactile : pincement à deux doigts + déplacement à un doigt une fois zoomé */
  viewport.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      _lb.pinchDist = _lbTouchDist(e.touches);
    } else if (e.touches.length === 1 && _lb.scale > 1) {
      _lb.dragging = true;
      _lb.startX = e.touches[0].clientX - _lb.x;
      _lb.startY = e.touches[0].clientY - _lb.y;
    }
  }, { passive: true });
  viewport.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      var dist = _lbTouchDist(e.touches);
      var rect = viewport.getBoundingClientRect();
      var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      _lbZoomAt(midX, midY, (dist - _lb.pinchDist) / 120);
      _lb.pinchDist = dist;
    } else if (e.touches.length === 1 && _lb.dragging) {
      e.preventDefault();
      _lb.x = e.touches[0].clientX - _lb.startX;
      _lb.y = e.touches[0].clientY - _lb.startY;
      _lbApply();
    }
  }, { passive: false });
  viewport.addEventListener('touchend', function () { _lb.dragging = false; });
}

function _safeSrc(src) {
  return src.split('').map(function (c) {
    return c.charCodeAt(0) > 127 ? encodeURIComponent(c) : c;
  }).join('');
}

/* ════════════════════════════════════════════════════════
   PROJETS PERSONNELS (afficher / cacher)
════════════════════════════════════════════════════════ */
function togglePersoProjects() {
  var grid = document.getElementById('persoGrid');
  var btn = document.getElementById('persoTeaserBtn');
  if (!grid) return;
  var open = grid.classList.toggle('open');
  if (btn) btn.classList.toggle('open', open);
}

/* ════════════════════════════════════════════════════════
   CARTE "À PROPOS"
════════════════════════════════════════════════════════ */
function handleFlip() {}
function closeCard() {}

/* ════════════════════════════════════════════════════════
   NAV — surlignage du lien de la section visible au scroll
════════════════════════════════════════════════════════ */
(function () {
  var navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  var sections = Array.from(document.querySelectorAll('section, #about, #timeline, #skills, #projects, #projet-ap, #contact-section'));
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var s = window.scrollY, active = '';
      for (var i = 0; i < sections.length; i++) {
        if (s >= sections[i].offsetTop - 220) active = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active);
      });
      ticking = false;
    });
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════
   CHARGEMENT DES ICÔNES (data-src → src)
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
});

/* ════════════════════════════════════════════════════════
   ÉCHAP — ferme la fenêtre la plus "au-dessus"
   (lightbox > vue projet)
════════════════════════════════════════════════════════ */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;

  var lightbox = document.getElementById('lightbox');
  if (lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
    return;
  }

  var pvOverlay = document.getElementById('pvOverlay');
  if (pvOverlay && pvOverlay.classList.contains('active')) {
    closeProject();
    return;
  }
});

/* ════════════════════════════════════════════════════════
   THEME (sombre / clair crème)
════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.classList.toggle('light-mode', theme === 'light');
  localStorage.setItem('portfolio-theme', theme);
}
function toggleTheme() {
  var isLight = document.documentElement.classList.contains('light-mode');
  applyTheme(isLight ? 'dark' : 'light');
}
document.addEventListener('DOMContentLoaded', function () {
  var savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);
});

/* ════════════════════════════════════════════════════════
   MODE GRAND — zoome automatiquement TOUT le site (pas juste
   une image) : reste actif sur toutes les pages/sections tant
   qu'on ne le désactive pas, et se souvient du choix.
════════════════════════════════════════════════════════ */
function applyBigMode(on) {
  document.documentElement.classList.toggle('big-mode', on);
  document.body.classList.toggle('big-mode', on);
  var btn = document.getElementById('bigModeBtn');
  if (btn) btn.classList.toggle('toolbar-btn-active', on);
  localStorage.setItem('portfolio-bigmode', on ? '1' : '0');
}
function toggleBigMode() {
  var isOn = document.body.classList.contains('big-mode');
  applyBigMode(!isOn);
}
document.addEventListener('DOMContentLoaded', function () {
  applyBigMode(localStorage.getItem('portfolio-bigmode') === '1');
});

/* ════════════════════════════════════════════════════════
   TRADUCTIONS (FR / EN) — inchangé pour le reste du site
════════════════════════════════════════════════════════ */
var TRANSLATIONS = {
  fr: {
    "nav.about":"A propos","nav.timeline":"Parcours","nav.skills":"Competences",
    "nav.projects":"Projets","nav.ap":"Projet AP","nav.contact":"Contact","nav.bigmode":"Grand",
    "hero.subtitle":"Etudiant","hero.cta1":"Voir mes projets",
    "hero.cta2":"&#x2B07; Telecharger CV","hero.scroll":"Defiler",
    "btn.open":"&#x2756; Ouvrir",
    "about.title":"A propos","about.flipHint":"&#x2756; Cliquer pour decouvrir &#x2756;",
    "about.text1":"Bonjour, je m'appelle Corentin, j'ai 21 ans. Je vais vous presenter mon parcours et vous expliquer comment je me suis oriente vers un BTS informatique, alors qu'a la base j'etais en Bac professionnel MELEC.",
    "about.text2":"J'ai commence par un CAP MELEC pendant 2 ans — ce n'etait pas vraiment un choix, j'y ai ete oriente par defaut car je n'avais pas fait mes voeux. J'ai quand meme decide de continuer avec un Bac Pro MELEC, obtenu apres 2 annees supplementaires. Au fil de ces 4 ans, j'ai progressivement realise que ce domaine ne me correspondait pas. J'ai donc reflechi a mon avenir, echange avec des professionnels du secteur, et me suis naturellement tourne vers l'informatique. J'ai integre un BTS SIO option SLAM au lycee Henry Wallon, et des le debut j'ai retrouve la motivation. J'apprecie particulierement le developpement d'applications et la satisfaction de voir concretement le resultat de mon travail.",
    "about.projects":"Projets","about.apps":"Apps Play Store",
    "timeline.title":"Parcours",
    "tl1.title":"BTS SIO — 2eme annee","tl1.sub":"Option SLAM",
    "tl1.desc":"Approfondissement des competences, realisation de projets concrets dont Animal'and publie sur le Play Store.",
    "tl1.badge":"&#x2756; En cours",
    "tl2.title":"BTS SIO — 1ere annee","tl2.sub":"Option SLAM",
    "tl2.desc":"Apprentissage des fondamentaux du developpement web et mobile. Premiers projets Flutter, PHP et MySQL.",
    "tl2.badge":"Valide",
    "tl3.title":"Lycee","tl3.sub":"Bac Pro MELEC",
    "tl3.desc":"Obtention du Bac Pro Metiers de l'Electricite et de ses Environnements Connectes.",
    "tl3.badge":"Diplome",
    "tl4.title":"CAP MELEC","tl4.sub":"Metiers de l'Electricite",
    "tl4.desc":"Formation obtenue par orientation par defaut. Point de depart d'un parcours qui m'a progressivement conduit vers l'informatique.",
    "tl4.badge":"Diplome",
    "skills.title":"Competences","skill1.name":"Developpement",
    "skill2.name":"Donnees","skill2.tag4":"Modelisation BDD","skill2.tag5":"SQL avance",
    "skill3.name":"Outils &amp; Methodes","skill3.tag4":"Methode Agile","skill3.tag5":"Tests &amp; Recette",
    "skill4.name":"Bloc 1 — Support","skill4.tag1":"Gestion patrimoine","skill4.tag2":"Support &amp; incidents","skill4.tag3":"Deploiement service","skill4.tag4":"Mode projet","skill4.tag5":"Veille techno",
    "skill5.name":"Bloc 2 — SLAM","skill5.tag1":"Conception applicative","skill5.tag2":"Maintenance corrective","skill5.tag3":"Maintenance evolutive","skill5.tag4":"Architecture logicielle","skill5.tag5":"UML / Modelisation",
    "skill6.name":"Bloc 3 — Cybersecurite","skill6.tag1":"RGPD / CNIL","skill6.tag2":"Gestion des acces","skill6.tag3":"Securite applicative","skill6.tag4":"Analyse logs","skill6.tag5":"Prevention attaques",
    "projects.title":"Projets","projects.personal":"Voir mes projets personnels",
    "p1.type":"Application Mobile — Chat Temps Reel",
    "p1.desc":"Application de messagerie instantanee Flutter avec chat en temps reel, notifications push et panel administrateur.",
    "p2.type":"Application Mobile","p2.type2":"Application Mobile — Boutique Privee",
    "p2.desc":"Application compagnon d'Animal'and dediee a la gestion des equipements et accessoires pour animaux.",
    "p3.type":"Projet Web — Personnel",
    "p3.desc":"Projet web autour de l'univers de League of Legends avec affichage de donnees et design immersif.",
    "ap.title":"Projet AP",
    "contact.title":"Me contacter",
    "contact.email":"&#x2709; Email","contact.linkedin":"&#x25C8; LinkedIn","contact.cv":"&#x2B07; CV PDF",
    "footer.text":"&#169; 2026 Corentin Mesure — BTS SIO SLAM",
    "video.notfound":"Fichier introuvable :"
  },
  en: {
    "nav.about":"About","nav.timeline":"Journey","nav.skills":"Skills",
    "nav.projects":"Projects","nav.ap":"AP Project","nav.contact":"Contact","nav.bigmode":"Large",
    "hero.subtitle":"Student","hero.cta1":"View my projects",
    "hero.cta2":"&#x2B07; Download CV","hero.scroll":"Scroll",
    "btn.open":"&#x2756; Open",
    "about.title":"About","about.flipHint":"&#x2756; Click to discover &#x2756;",
    "about.text1":"Hi, my name is Corentin. Let me tell you about my journey and how I ended up studying IT, even though I originally started in an Electrical Engineering vocational program.",
    "about.text2":"I completed a vocational Bac Pro in Electrical Engineering and Connected Environments, but after two years I realized it was no longer the right fit for me. So I decided to pivot to IT, enrolled in a BTS SIO with a SLAM specialization, and honestly fell in love with it from day one. Today I build mobile and web applications.",
    "about.projects":"Projects","about.apps":"Play Store Apps",
    "timeline.title":"Journey",
    "tl1.title":"BTS SIO — 2nd year","tl1.sub":"SLAM track",
    "tl1.desc":"Deepened skills and completed real-world projects including Animal'and published on the Play Store.",
    "tl1.badge":"&#x2756; In progress",
    "tl2.title":"BTS SIO — 1st year","tl2.sub":"SLAM track",
    "tl2.desc":"Learned web and mobile development fundamentals. First Flutter, PHP and MySQL projects.",
    "tl2.badge":"Validated",
    "tl3.title":"High School","tl3.sub":"Vocational Bac — MELEC",
    "tl3.desc":"Obtained the Vocational Baccalaureate in Electrical Engineering and Connected Environments.",
    "tl3.badge":"Graduated",
    "tl4.title":"MELEC Certificate","tl4.sub":"Electrical Trades",
    "tl4.desc":"Obtained through default orientation. Starting point of a journey that gradually led me towards IT.",
    "tl4.badge":"Graduated",
    "skills.title":"Skills","skill1.name":"Development",
    "skill2.name":"Data","skill2.tag4":"DB Modeling","skill2.tag5":"Advanced SQL",
    "skill3.name":"Tools &amp; Methods","skill3.tag4":"Agile Method","skill3.tag5":"Testing &amp; QA",
    "skill4.name":"Block 1 — Support","skill4.tag1":"Asset management","skill4.tag2":"Support &amp; incidents","skill4.tag3":"Service deployment","skill4.tag4":"Project mode","skill4.tag5":"Tech watch",
    "skill5.name":"Block 2 — SLAM","skill5.tag1":"App design","skill5.tag2":"Corrective maintenance","skill5.tag3":"Evolutive maintenance","skill5.tag4":"Software architecture","skill5.tag5":"UML / Modeling",
    "skill6.name":"Block 3 — Cybersecurity","skill6.tag1":"GDPR / CNIL","skill6.tag2":"Access management","skill6.tag3":"App security","skill6.tag4":"Log analysis","skill6.tag5":"Attack prevention",
    "projects.title":"Projects","projects.personal":"View my personal projects",
    "p1.type":"Mobile App — Real-Time Chat",
    "p1.desc":"Flutter instant messaging app with real-time chat, push notifications and admin panel.",
    "p2.type":"Mobile App","p2.type2":"Mobile App — Private Shop",
    "p2.desc":"Companion app to Animal'and dedicated to managing equipment and accessories for animals.",
    "p3.type":"Web Project — Personal",
    "p3.desc":"Web project set in the League of Legends universe with data display and immersive design.",
    "ap.title":"AP Project",
    "contact.title":"Get in touch",
    "contact.email":"&#x2709; Email","contact.linkedin":"&#x25C8; LinkedIn","contact.cv":"&#x2B07; CV PDF",
    "footer.text":"&#169; 2026 Corentin Mesure — BTS SIO SLAM",
    "video.notfound":"File not found:"
  }
};

var currentLang = localStorage.getItem('portfolio-lang') || 'fr';

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('portfolio-lang', lang);
  var dict = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
}
function toggleLang() { applyLang(currentLang === 'fr' ? 'en' : 'fr'); }

document.addEventListener('DOMContentLoaded', function () {
  applyLang(currentLang);
});
