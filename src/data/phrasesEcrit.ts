import type { OrthographePhrase } from "./orthographePhrases";

export const PHRASES_ECRIT: OrthographePhrase[] = [
  // ── OUVERTURES ───────────────────────────────────────────────────────────
  {
    sentence: "« Je me ___ de vous contacter au sujet de votre offre d'emploi. »",
    options: ["permets", "permet", "permis", "permettrai"],
    correctIndex: 0,
    explanation: "\"Je me permets de + infinitif\" est une ouverture formelle standard. Conjugaison correcte : « je me permets » (et non « permet » ou « permis »).",
  },
  {
    sentence: "« Je vous écris ___ d'obtenir des informations sur les conditions d'accès au programme. »",
    options: ["donc", "afin", "pour que", "bien que"],
    correctIndex: 1,
    explanation: "\"Afin de + infinitif\" exprime le but dans un registre formel. « Afin que » exigerait le subjonctif.",
  },
  {
    sentence: "« ___ dans votre annonce, le poste requiert une expérience de trois ans. »",
    options: ["Comme indiqué", "Comme dit", "Ainsi que dit", "Tel qu'écrit"],
    correctIndex: 0,
    explanation: "\"Comme indiqué dans votre annonce\" est une formule de référence claire et adaptée au TEF écrit.",
  },
  {
    sentence: "« Je vous écris pour ___ un problème concernant ma commande du 5 avril. »",
    options: ["signaler", "dire", "raconter", "expliquer un"],
    correctIndex: 0,
    explanation: "\"Signaler un problème\" est la formulation attendue dans une lettre de réclamation.",
  },
  {
    sentence: "« Je ___ obtenir des renseignements sur les modalités d'inscription. »",
    options: ["souhaiterais", "souhaitais", "souhaiterai", "souhaite"],
    correctIndex: 0,
    explanation: "\"Je souhaiterais\" = conditionnel de politesse, très adapté au TEF écrit. Les autres formes changent le temps ou le registre.",
  },

  // ── EXPRIMER UN BESOIN / DEMANDE ─────────────────────────────────────────
  {
    sentence: "« ___ me préciser les conditions d'accès à cette formation ? »",
    options: ["Pourriez-vous", "Pouvez-vous", "Voudriez vous", "Sauriez vous"],
    correctIndex: 0,
    explanation: "\"Pourriez-vous + infinitif\" est une forme interrogative polie au conditionnel, plus formelle que « pouvez-vous ».",
  },
  {
    sentence: "« ___-il possible de reporter le rendez-vous au 20 mai ? »",
    options: ["Serait", "Sera", "Est", "Était"],
    correctIndex: 0,
    explanation: "\"Serait-il possible de\" = formule de demande polie au conditionnel, recommandée au TEF écrit.",
  },
  {
    sentence: "« J'___ obtenir davantage d'informations sur les tarifs pratiqués. »",
    options: ["aimerais", "aime", "aimais", "aimerai"],
    correctIndex: 0,
    explanation: "\"J'aimerais\" correspond au conditionnel de politesse. Synonymes possibles : « je souhaiterais », « je voudrais ».",
  },
  {
    sentence: "« Je ___ savoir si des places sont encore disponibles pour la session de juin. »",
    options: ["souhaiterais", "veux", "dois", "peux"],
    correctIndex: 0,
    explanation: "\"Je souhaiterais savoir si\" est une formule de demande d'information fréquente en écrit formel.",
  },
  {
    sentence: "« ___, pourriez-vous m'indiquer le délai de traitement des dossiers ? »",
    options: ["Par ailleurs", "Pourtant", "Car", "Donc"],
    correctIndex: 0,
    explanation: "\"Par ailleurs, pourriez-vous m'indiquer\" permet d'enchaîner une deuxième demande dans la même lettre.",
  },
  {
    sentence: "« Je ___ également savoir si un hébergement est inclus dans le programme. »",
    options: ["voudrais", "veux", "voulais", "voudrai"],
    correctIndex: 0,
    explanation: "\"Je voudrais + infinitif\" est un conditionnel de politesse, proche de « je souhaiterais ».",
  },

  // ── STRUCTURER LE CORPS DE LA LETTRE ────────────────────────────────────
  {
    sentence: "« ___, je cherche un poste dans le secteur de la communication digitale. »",
    options: ["Actuellement", "Récemment", "Autrefois", "Jadis"],
    correctIndex: 0,
    explanation: "\"Actuellement\" : situe la situation dans le temps présent. Très utile pour présenter sa situation au TEF.",
  },
  {
    sentence: "« ___, j'ai constaté que les délais de livraison n'étaient pas respectés. »",
    options: ["Récemment", "Autrefois", "Jadis", "Naguère"],
    correctIndex: 0,
    explanation: "\"Récemment\" : situe l'événement dans un passé proche. Indispensable pour les lettres de réclamation.",
  },
  {
    sentence: "« ___, je souhaite vous soumettre ma candidature pour ce poste. »",
    options: ["C'est pourquoi", "Pourtant", "Cependant", "En revanche"],
    correctIndex: 0,
    explanation: "\"C'est pourquoi\" : conséquence logique. Enchaîne la raison avec la démarche dans une lettre de motivation.",
  },
  {
    sentence: "« ___, je souhaite obtenir un remboursement ou un échange du produit. »",
    options: ["De ce fait", "Pourtant", "En revanche", "Certes"],
    correctIndex: 0,
    explanation: "\"De ce fait\" introduit une conséquence dans un registre formel, comme « par conséquent ».",
  },
  {
    sentence: "« ___, je vous joins les justificatifs nécessaires à l'étude de mon dossier. »",
    options: ["Ainsi", "Cependant", "Or", "Néanmoins"],
    correctIndex: 0,
    explanation: "\"Ainsi\" introduit une conséquence ou une action qui découle de ce qui précède.",
  },

  // ── CONNECTEURS FORMELS ──────────────────────────────────────────────────
  {
    sentence: "« Par avance, je vous remercie de l'intérêt que vous porterez à ma candidature. »",
    options: ["porterez", "portez", "porteriez", "avez porté"],
    correctIndex: 0,
    explanation: "\"Je vous remercie par avance\" + futur (\"vous porterez\") = formulation standard en lettre formelle.",
  },
  {
    sentence: "« ___, j'ai exercé pendant cinq ans en tant que chef de projet dans une agence parisienne. »",
    options: ["Premièrement", "Pourtant", "Certes", "En revanche"],
    correctIndex: 0,
    explanation: "\"Premièrement\" : structure le premier argument. À enchaîner avec \"deuxièmement\" ou \"ensuite\".",
  },
  {
    sentence: "« ___, j'aimerais vous demander si une période d'essai est prévue avant la titularisation. »",
    options: ["De plus", "Pourtant", "Car", "Certes"],
    correctIndex: 0,
    explanation: "\"De plus\" : ajoute une demande supplémentaire. Synonymes dans une lettre : en outre, par ailleurs.",
  },
  {
    sentence: "« ___, je voudrais connaître les possibilités d'évolution au sein de votre entreprise. »",
    options: ["En outre", "Pourtant", "Cependant", "Car"],
    correctIndex: 0,
    explanation: "\"En outre\" : addition formelle légèrement plus soutenue que « de plus ». Très apprécié dans les lettres TEF.",
  },
  {
    sentence: "« Le poste m'intéresse beaucoup. ___, je souhaite m'assurer que le télétravail est possible. »",
    options: ["Néanmoins", "Donc", "Car", "De plus"],
    correctIndex: 0,
    explanation: "\"Néanmoins\" : concession polie. Permet d'exprimer une réserve sans être négatif dans une lettre formelle.",
  },
  {
    sentence: "« Ce produit ne correspond pas à ma commande. ___, il présente un défaut visible. »",
    options: ["De surcroît", "Cependant", "En revanche", "Pourtant"],
    correctIndex: 0,
    explanation: "\"De surcroît\" : renforce une accumulation de problèmes, avec plus d'emphase que « de plus ».",
  },

  // ── OPINIONS ET POSITIONS ────────────────────────────────────────────────
  {
    sentence: "« ___, les conditions proposées dans votre contrat sont particulièrement attractives. »",
    options: ["À mon avis", "Pourtant", "Donc", "Car"],
    correctIndex: 0,
    explanation: "\"À mon avis\" introduit un point de vue personnel de manière claire.",
  },
  {
    sentence: "« ___ que votre entreprise représente un environnement idéal pour développer mes compétences. »",
    options: ["Je suis convaincu", "Je suis convaincu que", "J'estime", "Il me semble"],
    correctIndex: 1,
    explanation: "\"Je suis convaincu(e) que + indicatif\" exprime une certitude forte, plus affirmée que « il me semble que ».",
  },
  {
    sentence: "« ___ que ce poste correspond parfaitement à mon profil et à mes aspirations professionnelles. »",
    options: ["Pourtant", "Il me semble", "De plus", "Cependant"],
    correctIndex: 1,
    explanation: "\"Il me semble que\" exprime une opinion nuancée, moins catégorique que « je suis convaincu ».",
  },
  {
    sentence: "« ___, cette expérience m'a permis de développer des compétences solides en gestion de projet. »",
    options: ["Selon moi", "Donc", "Car", "Certes"],
    correctIndex: 0,
    explanation: "\"Selon moi\" introduit un point de vue personnel. Synonymes : « à mon avis », « à mes yeux », « d'après moi ».",
  },

  // ── CLÔTURES ─────────────────────────────────────────────────────────────
  {
    sentence: "« Dans l'___ de votre réponse, je reste disponible pour tout renseignement complémentaire. »",
    options: ["attente", "espoir", "arrivée", "optique"],
    correctIndex: 0,
    explanation: "\"Dans l'attente de votre réponse\" est une formule de clôture classique en lettre formelle.",
  },
  {
    sentence: "« Je vous remercie par ___ de l'attention que vous porterez à ma demande. »",
    options: ["avance", "anticipation", "avancement", "avant"],
    correctIndex: 0,
    explanation: "\"Je vous remercie par avance\" est une formule de clôture polie. Variante : « Je vous remercie par avance de votre aide ».",
  },
  {
    sentence: "« Je reste à votre ___ pour toute information complémentaire. »",
    options: ["disposition", "service", "disponibilité", "portée"],
    correctIndex: 0,
    explanation: "\"Je reste à votre disposition\" est une formule de disponibilité standard en clôture formelle.",
  },
  {
    sentence: "« Je vous remercie pour ___ que vous porterez à cette lettre. »",
    options: ["l'attention", "le temps", "la lecture", "l'intérêt"],
    correctIndex: 0,
    explanation: "\"Je vous remercie pour l'attention que vous porterez\" = formule de clôture polie et très fréquente au TEF écrit.",
  },

  // ── FORMULES DE POLITESSE ────────────────────────────────────────────────
  {
    sentence: "Pour clore une lettre très formelle : « Veuillez ___, Madame, Monsieur, l'expression de mes salutations distinguées. »",
    options: ["agréer", "accepter", "recevoir", "prendre"],
    correctIndex: 0,
    explanation: "\"Veuillez agréer\" est la formulation consacrée dans la politesse finale ; le verbe « agréer » ne se remplace pas ici.",
  },
  {
    sentence: "Pour une lettre formelle mais moins protocolaire, on peut conclure avec : « ___ »",
    options: ["Cordialement", "Bisous", "Amicalement", "À bientôt"],
    correctIndex: 0,
    explanation: "\"Cordialement\" : clôture professionnelle standard. \"Bien cordialement\" est légèrement plus chaleureux.",
  },
  {
    sentence: "Pour un email professionnel légèrement plus personnel : « ___ »",
    options: ["Bien cordialement", "Veuillez agréer mes salutations distinguées", "Bisous", "Amicalement à toi"],
    correctIndex: 0,
    explanation: "\"Bien cordialement\" : plus chaleureux que \"cordialement\", moins formel que la formule avec \"agréer\". Très courant au TEF.",
  },

  // ── EN CONCLUSION ────────────────────────────────────────────────────────
  {
    sentence: "« ___, je vous serais très reconnaissant(e) de bien vouloir étudier ma candidature. »",
    options: ["En conclusion", "Car", "Pourtant", "Cependant"],
    correctIndex: 0,
    explanation: "\"En conclusion\" annonce explicitement la fin du développement.",
  },
  {
    sentence: "« ___, je pense que mon profil correspond aux exigences de ce poste et je serais ravi(e) de vous rencontrer. »",
    options: ["En résumé", "Pourtant", "Car", "En revanche"],
    correctIndex: 0,
    explanation: "\"En résumé\" sert à synthétiser avant la conclusion. Synonymes : « en somme », « pour conclure », « en définitive ».",
  },

  // ── NUANCES ET PIÈGES ────────────────────────────────────────────────────
  {
    sentence: "« ___ à votre offre d'emploi publiée sur le site LinkedIn le 10 avril. »",
    options: ["Suite", "À la suite", "En référence", "Concernant"],
    correctIndex: 1,
    explanation: "\"À la suite de\" renvoie à un document ou un événement précédent ; c'est la forme recommandée en écrit formel.",
  },
  {
    sentence: "« Je me tiens à votre ___ pour un entretien à votre convenance. »",
    options: ["disposition", "service", "place", "disponible"],
    correctIndex: 0,
    explanation: "\"Se tenir à disposition\" est une formule formelle pour proposer un entretien ou une rencontre.",
  },
  {
    sentence: "« ___, j'ai rencontré un problème lors de la livraison de ma commande numéro 4521. »",
    options: ["Malheureusement", "Heureusement", "Pourtant", "Certes"],
    correctIndex: 0,
    explanation: "\"Malheureusement\" : introduit le problème dans une lettre de réclamation. Permet d'adopter un ton poli malgré le mécontentement.",
  },
  {
    sentence: "Pour indiquer ce que vous envoyez avec la lettre : « Vous ___ ci-joint une copie de mon contrat. »",
    options: ["trouverez", "trouvez", "avez", "voyez"],
    correctIndex: 0,
    explanation: "\"Vous trouverez ci-joint\" est la formule standard pour annoncer une pièce jointe.",
  },
  {
    sentence: "« N'hésitez pas à me ___ si vous avez besoin de renseignements supplémentaires. »",
    options: ["contacter", "contacter me", "écrire pour me", "appeler si"],
    correctIndex: 0,
    explanation: "\"N'hésitez pas à me contacter\" est une invitation formelle à reprendre contact.",
  },
  {
    sentence: "Pour exprimer sa motivation : « Ce poste ___ particulièrement en raison de ses missions variées. »",
    options: ["m'intéresse", "me plaît beaucoup", "m'attire très", "m'enthousiasme"],
    correctIndex: 0,
    explanation: "\"Ce poste m'intéresse\" : expression directe et professionnelle pour la lettre de motivation au TEF.",
  },
  {
    sentence: "« Je souhaite ___ ma candidature au poste de chargé de communication. »",
    options: ["soumettre", "envoyer pour vous", "déposer pour", "présenter ma"],
    correctIndex: 0,
    explanation: "\"Soumettre sa candidature\" est une formulation formelle. Synonymes : « postuler à », « présenter sa candidature pour ».",
  },
  {
    sentence: "« ___ des raisons personnelles, je me vois dans l'obligation de reporter notre rendez-vous. »",
    options: ["En raison de", "Grâce à", "Malgré", "À cause que"],
    correctIndex: 0,
    explanation: "\"En raison de\" exprime une cause de manière formelle avec un nom. « À cause de » est plus familier ; « grâce à » implique une cause positive.",
  },
];
