import type { OrthographePhrase } from "./orthographePhrases";

export const PHRASES_ORAL: OrthographePhrase[] = [
  // ── Ouverture / Introduction ───────────────────────────────────────────
  {
    sentence: "Je ___ voir votre annonce concernant vos cours de français.",
    options: ["viens de", "venais de", "suis venu de", "viens à"],
    correctIndex: 0,
    explanation: "\"je viens de + inf.\" = passé récent (I just...). \"Venais de\" = imparfait (contexte passé narratif). \"Suis venu de\" = déplacement. \"Viens à\" n'existe pas ici.",
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
    explanation: "\"au sujet de\" = regarding. Toujours suivi de \"de\". \"Au sujet à\" n'existe pas.",
  },
  {
    sentence: "Je ___ intéressé(e) par votre offre de stage à l'étranger.",
    options: ["serais", "suis", "sois", "serai"],
    correctIndex: 0,
    explanation: "\"serais intéressé(e)\" = conditionnel de politesse. \"Suis intéressé\" (présent) est plus direct. \"Sois\" = subjonctif. \"Serai\" = futur simple.",
  },
  {
    sentence: "Je ___ à obtenir plus d'informations sur vos services.",
    options: ["m'intéresse", "suis intéressé de", "suis intéressé à", "m'intéresse de"],
    correctIndex: 0,
    explanation: "\"je m'intéresse à + nom\" = I am interested in. \"Je suis intéressé(e) par\" est aussi correct. Jamais \"intéressé de\" ni \"intéressé à\".",
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
    explanation: "\"faire parvenir\" = to send / to forward (formule formelle). Après \"faire\", toujours l'infinitif. \"Parvenu\" = participe passé. \"Parvenant\" = gérondif.",
  },
  {
    sentence: "Merci de me ___ dès que vous aurez les informations disponibles.",
    options: ["rappeler", "rappelez", "rappelé", "rappelant"],
    correctIndex: 0,
    explanation: "\"Merci de + inf.\" = please do X. \"Merci de rappeler\" = thank you for calling back. \"Rappelez\" = impératif (moins formel). \"Rappelé\" = participe passé.",
  },

  // ── Prix et promotions ──────────────────────────────────────────────────
  {
    sentence: "___ est le tarif pour une séance individuelle d'une heure ?",
    options: ["Quel", "Quelle", "Quels", "Qu'elle"],
    correctIndex: 0,
    explanation: "\"Quel\" s'accorde avec \"le tarif\" (masculin singulier). \"Quelle\" = féminin. \"Quels\" = pluriel. \"Qu'elle\" = que + elle (homonyme).",
  },
  {
    sentence: "Est-ce que le prix ___ les frais de matériel ?",
    options: ["comprend", "comprend de", "inclut à", "contient de"],
    correctIndex: 0,
    explanation: "\"comprend\" = includes. Pas de préposition : \"le prix comprend + COD\". \"Comprend de\" et \"inclut à\" sont grammaticalement incorrects.",
  },
  {
    sentence: "Y a-t-il des frais ___ à prévoir en dehors du tarif de base ?",
    options: ["supplémentaires", "supplémentaire", "en plus", "additionnels"],
    correctIndex: 0,
    explanation: "\"frais supplémentaires\" = expression fixe (additional fees). \"Supplémentaire\" = singulier. \"En plus\" = familier. \"Additionnels\" = anglicisme.",
  },
  {
    sentence: "L'accès à l'espace coworking est-il ___ pour les membres ?",
    options: ["gratuit", "gratuite", "gratuitement", "gratis"],
    correctIndex: 0,
    explanation: "\"gratuit\" s'accorde avec \"l'accès\" (masculin). \"Gratuite\" = féminin. \"Gratuitement\" = adverbe. \"Gratis\" = familier.",
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
    explanation: "\"un tarif réduit\" = discounted rate — expression fixe standard. \"Moins cher\" = familier. \"Réduction de tarif\" = moins idiomatique. \"Amoindri\" = registre littéraire.",
  },
  {
    sentence: "Proposez-vous ___ pour tester le produit avant de l'acheter ?",
    options: ["un échantillon gratuit", "un échantillon de gratuité", "une démonstration gratis", "un essai gratuite"],
    correctIndex: 0,
    explanation: "\"un échantillon gratuit\" = free sample — expression fixe commerciale. Les autres formulations sont maladroites ou incorrectes.",
  },
  {
    sentence: "Outre les frais d'inscription, y a-t-il des coûts ___ ?",
    options: ["supplémentaires", "supplément", "en plus", "supplémentaire"],
    correctIndex: 0,
    explanation: "\"coûts supplémentaires\" = additional costs (pluriel). \"Supplémentaire\" = singulier. \"Supplément\" = nom. \"En plus\" = familier.",
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
    explanation: "\"À partir de quand\" = from when (futur). \"Depuis quand\" = since when (passé). \"Dès quand\" est rare. \"À partir\" seul est incomplet.",
  },
  {
    sentence: "Jusqu'à ___ les inscriptions sont-elles ouvertes ?",
    options: ["quand", "quoi", "où", "quel"],
    correctIndex: 0,
    explanation: "\"Jusqu'à quand\" = until when. \"Jusqu'à quoi\" = jusqu'à quelle chose. \"Jusqu'où\" = jusqu'à quel endroit.",
  },

  // ── Horaires ────────────────────────────────────────────────────────────
  {
    sentence: "Quels sont ___ de votre centre ?",
    options: ["les horaires", "les heurs", "les horairies", "les temps"],
    correctIndex: 0,
    explanation: "\"les horaires\" = opening hours — terme standard. \"Les heurs\" n'existe pas. \"Horairies\" n'existe pas. \"Les temps\" = époques ou formes verbales.",
  },
  {
    sentence: "Êtes-vous ___ les jours fériés et le weekend ?",
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
    explanation: "\"Il reste des places\" = there are still spots (impersonnel + verbe sing.). \"Restent\" → \"les places restent\". \"Il y reste\" = doublon avec \"il\".",
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
