import type { OrthographePhrase } from "./orthographePhrases";

export const PHRASES_ORAL: OrthographePhrase[] = [
  // ── Ouverture / Introduction ───────────────────────────────────────────
  {
    sentence: "Je ___ voir votre annonce concernant vos cours de français.",
    options: ["viens de", "venais de", "suis venu de", "viens à"],
    correctIndex: 0,
    explanation: "\"Je viens de + infinitif\" exprime le passé récent. « Venais de » relève de l'imparfait ; « suis venu de » indique une provenance ; « viens à » est incorrect ici.",
  },
  {
    sentence: "Je me ___ de vous contacter au sujet de votre offre de formation.",
    options: ["permets", "permet", "permis", "permettrais"],
    correctIndex: 0,
    explanation: "\"je me permets de + inf.\" = formule de politesse pour s'excuser de déranger. 1ʳᵉ pers. sing. → \"permets\". \"Permettrais\" serait conditionnel (moins courant).",
  },
  {
    sentence: "Je vous appelle au sujet ___ votre annonce parue cette semaine.",
    options: ["de", "à", "pour", "sur"],
    correctIndex: 0,
    explanation: "\"Au sujet de\" introduit le thème et se construit toujours avec « de ». La forme « au sujet à » est incorrecte.",
  },
  {
    sentence: "Je ___ intéressé(e) par votre offre de stage à l'étranger.",
    options: ["serais", "suis", "sois", "serai"],
    correctIndex: 0,
    explanation: "\"serais intéressé(e)\" = conditionnel de politesse. \"Suis intéressé\" (présent) est plus direct. \"Sois\" = subjonctif. \"Serai\" = futur simple.",
  },
  {
    sentence: "Je ___ plus d'informations sur vos services.",
    options: ["souhaiterais obtenir", "m'intéresse", "suis intéressé de", "m'intéresse de"],
    correctIndex: 0,
    explanation: "\"Je souhaiterais obtenir\" = formulation claire et polie pour demander des renseignements (très utile au TEF oral partie 1).",
  },

  // ── Demander des renseignements ─────────────────────────────────────────
  {
    sentence: "J'___ avoir des informations sur les modalités d'inscription.",
    options: ["aimerais", "aimerai", "aimais", "aime bien"],
    correctIndex: 0,
    explanation: "\"aimerais\" = conditionnel de politesse. \"Aimerai\" = futur simple. \"Aimais\" = imparfait (hors contexte). \"Aime bien\" = présent familier.",
  },
  {
    sentence: "___ me donner des renseignements sur le programme ?",
    options: ["Pourriez-vous", "Voulez-vous", "Vous voulez", "Vous pourrez"],
    correctIndex: 0,
    explanation: "\"Pourriez-vous\" = conditionnel → registre formel. \"Voulez-vous\" = moins poli. \"Vous voulez\" / \"vous pourrez\" ne sont pas des formules interrogatives polies.",
  },
  {
    sentence: "De quoi ___ au juste cette formation en ligne ?",
    options: ["s'agit-il", "il s'agit", "s'agit", "agit-il"],
    correctIndex: 0,
    explanation: "\"De quoi s'agit-il ?\" = interrogation formelle avec inversion. \"Il s'agit de\" est affirmatif. \"S'agit\" seul est incomplet. \"Agit-il\" = autre verbe.",
  },
  {
    sentence: "Pouvez-vous ___ les conditions d'accès à ce programme ?",
    options: ["préciser", "précisez", "précisé", "précisant"],
    correctIndex: 0,
    explanation: "Après \"pouvez-vous\", on utilise l'infinitif : \"préciser\". \"Précisez\" = impératif. \"Précisé\" = participe passé. \"Précisant\" = gérondif.",
  },
  {
    sentence: "Comment ___ en pratique pour s'inscrire au programme ?",
    options: ["cela se passe-t-il", "ça se passe", "cela passe-t-il", "il se passe"],
    correctIndex: 0,
    explanation: "\"Comment cela se passe-t-il ?\" = interrogation formelle avec inversion. \"Ça se passe\" = oral familier. \"Cela passe-t-il\" = différent sens.",
  },
  {
    sentence: "Pourriez-vous me faire ___ d'une brochure par courrier électronique ?",
    options: ["parvenir", "parvenu", "parvenant", "parvenez"],
    correctIndex: 0,
    explanation: "\"Faire parvenir\" est une tournure formelle pour demander un envoi. Après « faire », on emploie l'infinitif ; « parvenu » et « parvenant » ne conviennent pas ici.",
  },
  {
    sentence: "Merci de me ___ dès que vous aurez les informations disponibles.",
    options: ["recontacter", "recontactez", "recontacté", "recontactant"],
    correctIndex: 0,
    explanation: "\"Merci de + infinitif\" = formule polie pour demander une action. \"Recontacter\" est naturel dans un contexte de suivi.",
  },

  // ── Prix et promotions ──────────────────────────────────────────────────
  {
    sentence: "___ est le tarif pour une séance individuelle d'une heure ?",
    options: ["Quel", "Quelle", "Quels", "Qu'elle"],
    correctIndex: 0,
    explanation: "\"Quel\" s'accorde avec \"le tarif\" (masculin singulier). \"Quelle\" = féminin. \"Quels\" = pluriel. \"Qu'elle\" = que + elle (homonyme).",
  },
  {
    sentence: "Combien cela ___ pour un abonnement mensuel ?",
    options: ["coûte-t-il", "coûte", "coûte-il", "coûtera"],
    correctIndex: 0,
    explanation: "\"Combien cela coûte-t-il ?\" = inversion formelle recommandée au TEF. \"Coûte\" seul est plus oral/familier.",
  },
  {
    sentence: "Est-ce que le prix ___ les frais de matériel ?",
    options: ["comprend", "comprend de", "inclut à", "contient de"],
    correctIndex: 0,
    explanation: "Le verbe « comprendre » s'emploie sans préposition : « le prix comprend + complément ». « Comprend de » et « inclut à » sont fautifs.",
  },
  {
    sentence: "Y a-t-il des frais ___ à prévoir en dehors du tarif de base ?",
    options: ["supplémentaires", "supplémentaire", "en plus", "additionnels"],
    correctIndex: 0,
    explanation: "\"Frais supplémentaires\" est la formulation standard. « Supplémentaire » est au singulier ; « en plus » est trop familier ; « additionnels » est à éviter ici.",
  },
  {
    sentence: "Y a-t-il ___ pour essayer le service avant de s'abonner ?",
    options: ["une période d'essai gratuite", "un période d'essai gratuite", "une période d'essai gratuit", "un essai gratuité"],
    correctIndex: 0,
    explanation: "\"une période d'essai gratuite\" = formulation naturelle et utile pour demander les conditions d'essai.",
  },
  {
    sentence: "Est-ce qu'il y a ___ en ce moment pour les nouvelles inscriptions ?",
    options: ["une promotion", "un promotion", "un promotionnel", "une promotional"],
    correctIndex: 0,
    explanation: "\"promotion\" est féminin → \"une promotion\". \"Un promotion\" est une erreur de genre. \"Promotionnel\" = adjectif.",
  },
  {
    sentence: "Y a-t-il ___ pour les étudiants ou les moins de 26 ans ?",
    options: ["un tarif réduit", "un tarif moins cher", "une réduction de tarif", "un tarif amoindri"],
    correctIndex: 0,
    explanation: "\"un tarif réduit\" : expression fixe standard. \"Moins cher\" = familier. \"Réduction de tarif\" = moins idiomatique. \"Amoindri\" = registre littéraire.",
  },
  {
    sentence: "Proposez-vous ___ avant de souscrire à l'offre ?",
    options: ["une période d'essai", "un période d'essai", "une essai", "un essai gratuite"],
    correctIndex: 0,
    explanation: "\"une période d'essai\" est la formulation standard pour demander un essai avant engagement.",
  },
  {
    sentence: "Outre les frais d'inscription, y a-t-il des coûts ___ ?",
    options: ["supplémentaires", "supplément", "en plus", "supplémentaire"],
    correctIndex: 0,
    explanation: "\"Coûts supplémentaires\" est la forme correcte au pluriel. « Supplémentaire » est singulier, « supplément » est un nom, et « en plus » reste familier.",
  },

  // ── Durée et calendrier ─────────────────────────────────────────────────
  {
    sentence: "Combien de temps ___ la formation complète ?",
    options: ["dure-t-elle", "dure-t-il", "dure", "est-elle durée"],
    correctIndex: 0,
    explanation: "\"dure-t-elle\" = inversion + accord féminin (\"la formation\"). \"Dure-t-il\" = masc. \"Dure\" = sans inversion (familier). \"Est durée\" n'existe pas.",
  },
  {
    sentence: "___ quand la prochaine session est-elle prévue ?",
    options: ["À partir de", "Depuis", "Dès", "À partir"],
    correctIndex: 0,
    explanation: "\"À partir de quand\" introduit un point de départ dans le futur. \"Depuis quand\" renvoie à une action commencée dans le passé. \"Dès quand\" est rare, et \"à partir\" seul est incomplet.",
  },
  {
    sentence: "Jusqu'à ___ les inscriptions sont-elles ouvertes ?",
    options: ["quand", "quoi", "où", "quel"],
    correctIndex: 0,
    explanation: "\"Jusqu'à quand\" porte sur une limite temporelle. \"Jusqu'à quoi\" est maladroit ici, et \"jusqu'où\" renvoie à une limite spatiale.",
  },

  // ── Horaires ────────────────────────────────────────────────────────────
  {
    sentence: "Quels sont ___ de votre centre ?",
    options: ["les horaires", "les heurs", "les horairies", "les temps"],
    correctIndex: 0,
    explanation: "\"Les horaires\" est le terme standard. « Heurs » et « horairies » n'existent pas ; « les temps » ne convient pas pour parler d'heures d'ouverture.",
  },
  {
    sentence: "Êtes-vous ___ les jours fériés et le week-end ?",
    options: ["ouverts", "ouvert", "ouverte", "ouvrant"],
    correctIndex: 0,
    explanation: "\"ouverts\" s'accorde avec \"vous\" (pluriel). \"Ouvert\" = masc. sing. \"Ouvrant\" = participe présent.",
  },

  // ── Conditions et disponibilité ─────────────────────────────────────────
  {
    sentence: "Y a-t-il des conditions ___ pour participer à ce programme ?",
    options: ["particulières", "particuliers", "particulier", "particulièrement"],
    correctIndex: 0,
    explanation: "\"conditions\" est féminin pluriel → \"particulières\". \"Particuliers\" = masc. pl. \"Particulier\" = sing. \"Particulièrement\" = adverbe.",
  },
  {
    sentence: "Faut-il ___ des documents pour valider l'inscription ?",
    options: ["fournir", "fournissez", "fourni", "fournissant"],
    correctIndex: 0,
    explanation: "\"Il faut + infinitif\" → \"fournir\". \"Faut-il fournir\" = structure correcte. \"Fournissez\" = impératif. \"Fourni\" = participe passé.",
  },
  {
    sentence: "Est-ce qu'il ___ des places disponibles pour la session de mars ?",
    options: ["reste", "restent", "y reste", "restes"],
    correctIndex: 0,
    explanation: "\"Il reste des places\" est la tournure impersonnelle correcte (verbe au singulier). « Restent » exigerait « les places restent » ; « il y reste » est fautif ici.",
  },
  {
    sentence: "Ce service est-il ___ aux personnes à mobilité réduite ?",
    options: ["accessible", "accédable", "accédé", "accessibles"],
    correctIndex: 0,
    explanation: "\"accessible\" s'accorde avec \"ce service\" (masc. sing.). \"Accédable\" n'existe pas. \"Accédé\" = participe passé. \"Accessibles\" = pluriel.",
  },

  // ── Localisation ────────────────────────────────────────────────────────
  {
    sentence: "Où ___ votre centre de formation exactement ?",
    options: ["êtes-vous situés", "vous êtes situés", "situez-vous", "êtes-vous situé"],
    correctIndex: 0,
    explanation: "\"êtes-vous situés\" = inversion + accord pluriel (\"vous\"). \"Vous êtes situés\" est affirmatif. \"Situez-vous\" ne s'emploie pas ainsi.",
  },
  {
    sentence: "Comment ___ accéder à vos locaux en transports en commun ?",
    options: ["peut-on", "peut-il", "peut-on à", "pouvons-on"],
    correctIndex: 0,
    explanation: "\"Comment peut-on + inf.\" = formule impersonnelle standard. \"Peut-il\" exige un sujet défini. \"Peut-on à\" est incorrect.",
  },
  {
    sentence: "Y a-t-il ___ à proximité de votre établissement ?",
    options: ["un parking", "une parking", "un parkinge", "une parkinge"],
    correctIndex: 0,
    explanation: "\"parking\" est masculin → \"un parking\". \"Une parking\" est une erreur de genre.",
  },

  // ── Clôture ─────────────────────────────────────────────────────────────
  {
    sentence: "Je ___ réserver une place pour la prochaine session disponible.",
    options: ["souhaiterais", "souhaite", "souhaiterai", "souhaitais"],
    correctIndex: 0,
    explanation: "\"souhaiterais\" = conditionnel de politesse. \"Souhaite\" (présent) est correct mais moins formel. \"Souhaiterai\" = futur. \"Souhaitais\" = imparfait.",
  },
  {
    sentence: "___ m'envoyer une brochure détaillée par courriel ?",
    options: ["Pourriez-vous", "Pourrez-vous", "Voudriez vous", "Pouvez vous"],
    correctIndex: 0,
    explanation: "\"Pourriez-vous\" = conditionnel → registre formel et poli. \"Pourrez-vous\" = futur (moins poli). \"Voudriez vous\" / \"Pouvez vous\" sans trait d'union sont incorrects.",
  },
  {
    sentence: "Je ___ vous rappeler demain matin si vous avez d'autres informations.",
    options: ["pourrais", "peux", "pourrai", "pouvais"],
    correctIndex: 0,
    explanation: "\"pourrais\" = conditionnel de politesse → proposition de rappel. \"Peux\" = présent (moins formel). \"Pourrai\" = futur (assertif). \"Pouvais\" = imparfait.",
  },
  {
    sentence: "Seriez-vous ___ de me recevoir cette semaine pour une présentation ?",
    options: ["disponible", "disponibles", "disponiblement", "en disponibilité"],
    correctIndex: 0,
    explanation: "\"seriez-vous disponible\" avec \"vous\" de politesse = singulier. \"Disponibles\" = pluriel (si interlocuteur collectif). \"Disponiblement\" n'existe pas.",
  },
];
