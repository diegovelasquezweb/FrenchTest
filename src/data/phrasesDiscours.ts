import type { OrthographePhrase } from "./orthographePhrases";

export const PHRASES_DISCOURS: OrthographePhrase[] = [
  // ── CONNECTEURS D'OPPOSITION ─────────────────────────────────────────────
  {
    sentence: "Il aime beaucoup voyager. ___, il n'a jamais quitté son pays.",
    options: ["Pourtant", "De plus", "Car", "Ainsi"],
    correctIndex: 0,
    explanation: "\"Pourtant\" : opposition avec nuance de surprise. \"De plus\" ajoute, \"Car\" cause, \"Ainsi\" conséquence.",
  },
  {
    sentence: "Cette solution est coûteuse. ___, elle reste la plus efficace à long terme.",
    options: ["Donc", "Cependant", "Car", "En outre"],
    correctIndex: 1,
    explanation: "\"Cependant\" : opposition formelle. Synonymes : néanmoins, toutefois, en revanche. Très apprécié à l'écrit TEF.",
  },
  {
    sentence: "Je comprends votre point de vue. ___, je ne peux pas partager entièrement votre opinion.",
    options: ["Ainsi", "De plus", "Néanmoins", "Puisque"],
    correctIndex: 2,
    explanation: "\"Néanmoins\" : opposition formelle. Astuce TEF : néanmoins / cependant / toutefois sont interchangeables à l'écrit.",
  },
  {
    sentence: "Les transports en commun polluent moins. ___, beaucoup de gens préfèrent encore conduire.",
    options: ["Par conséquent", "En outre", "Grâce à cela", "En revanche"],
    correctIndex: 3,
    explanation: "\"En revanche\" : oppose deux réalités de valeur égale, sans jugement de supériorité.",
  },
  {
    sentence: "Il travaille énormément. ___, ses résultats restent insuffisants.",
    options: ["Toutefois", "Donc", "Car", "De plus"],
    correctIndex: 0,
    explanation: "\"Toutefois\" : synonyme formel de cependant. Parfait pour structurer une concession à l'écrit.",
  },
  {
    sentence: "___ les progrès technologiques sont indéniables, ils soulèvent aussi des questions éthiques.",
    options: ["Certes,", "Donc", "Car", "Ensuite,"],
    correctIndex: 0,
    explanation: "\"Certes\" : structure de concession : je reconnais X, mais Y. Indispensable pour nuancer un argument au TEF.",
  },
  {
    sentence: "La réforme a été adoptée ___ les vives protestations des syndicats.",
    options: ["grâce à", "en raison de", "afin de", "malgré"],
    correctIndex: 3,
    explanation: "\"Malgré\" : opposition avec un nom. \"Grâce à\" = cause positive, \"En raison de\" = cause neutre/négative.",
  },
  {
    sentence: "___ cette politique présente des avantages indéniables, elle comporte aussi des risques.",
    options: ["Donc", "S'il est vrai que", "Car", "Puisque"],
    correctIndex: 1,
    explanation: "\"S'il est vrai que\" : structure de concession sophistiquée, très efficace au TEF écrit.",
  },

  // ── CONNECTEURS D'ADDITION ───────────────────────────────────────────────
  {
    sentence: "Ce quartier est bien desservi par les transports. ___, les loyers y sont abordables.",
    options: ["De plus", "Cependant", "Car", "Pourtant"],
    correctIndex: 0,
    explanation: "\"De plus\" : ajoute un argument supplémentaire allant dans le même sens.",
  },
  {
    sentence: "La formation est gratuite. ___, elle offre une certification reconnue à l'international.",
    options: ["En revanche", "En outre", "Pourtant", "C'est pourquoi"],
    correctIndex: 1,
    explanation: "\"En outre\" : addition formelle, légèrement plus soutenu que \"de plus\". Idéal à l'écrit TEF.",
  },
  {
    sentence: "Ce dispositif améliore la productivité. ___, il réduit considérablement les coûts.",
    options: ["Cependant", "Néanmoins", "Par ailleurs", "Car"],
    correctIndex: 2,
    explanation: "\"Par ailleurs\" : ajoute un élément sous un angle différent ou complémentaire.",
  },
  {
    sentence: "Cet auteur est reconnu dans son pays. Il est ___ traduit dans plus de vingt langues.",
    options: ["pourtant", "donc", "certes", "également"],
    correctIndex: 3,
    explanation: "\"Également\" : addition simple qui s'insère facilement au milieu d'une phrase.",
  },

  // ── CONNECTEURS DE CAUSE ─────────────────────────────────────────────────
  {
    sentence: "Il n'a pas pu assister à la réunion ___ il était en déplacement professionnel.",
    options: ["car", "donc", "cependant", "de plus"],
    correctIndex: 0,
    explanation: "\"Car\" : introduit une cause. Différence : \"car\" ne peut pas commencer une phrase, contrairement à \"puisque\".",
  },
  {
    sentence: "___ la demande est en forte hausse, l'entreprise a décidé de recruter massivement.",
    options: ["Ainsi", "Étant donné que", "Cependant", "En outre"],
    correctIndex: 1,
    explanation: "\"Étant donné que\" : cause formelle très appréciée à l'écrit TEF. Synonyme : vu que, dans la mesure où.",
  },
  {
    sentence: "Ce projet a été abandonné ___ un manque de financement.",
    options: ["grâce à", "afin d'", "en raison d'", "à condition d'"],
    correctIndex: 2,
    explanation: "\"En raison de\" : cause avec un nom. \"Grâce à\" = cause positive. \"Afin de\" = but/objectif.",
  },
  {
    sentence: "___ les résultats sont positifs, le directeur a reconduit le programme pour un an.",
    options: ["Pourtant", "En revanche", "De plus", "Puisque"],
    correctIndex: 3,
    explanation: "\"Puisque\" : cause considérée comme connue ou évidente. \"Car\" introduit une cause nouvelle.",
  },

  // ── CONNECTEURS DE CONSÉQUENCE ───────────────────────────────────────────
  {
    sentence: "Il a beaucoup travaillé. ___, il a obtenu d'excellents résultats.",
    options: ["C'est pourquoi", "Cependant", "En revanche", "Car"],
    correctIndex: 0,
    explanation: "\"C'est pourquoi\" : conséquence directe. Structure très fréquente au TEF pour enchaîner les arguments.",
  },
  {
    sentence: "Les ressources sont limitées. ___, nous devons prioriser nos actions.",
    options: ["Pourtant", "Par conséquent", "De plus", "Certes"],
    correctIndex: 1,
    explanation: "\"Par conséquent\" : conséquence formelle. Incontournable à l'écrit TEF.",
  },
  {
    sentence: "La loi a changé. ___, toutes les entreprises doivent adapter leurs pratiques.",
    options: ["En revanche", "Car", "Dès lors", "En outre"],
    correctIndex: 2,
    explanation: "\"Dès lors\" : conséquence formelle avec notion de point de départ.",
  },
  {
    sentence: "Il a refusé de collaborer, ___ le projet a finalement échoué.",
    options: ["cependant", "car", "en outre", "si bien que"],
    correctIndex: 3,
    explanation: "\"Si bien que\" : conséquence directe qui s'insère dans la phrase sans ponctuation forte.",
  },

  // ── INITIATEURS DE PARAGRAPHE ────────────────────────────────────────────
  {
    sentence: "___ la politique économique, plusieurs réformes importantes sont attendues cette année.",
    options: ["En ce qui concerne", "Grâce à", "Afin de", "À condition que"],
    correctIndex: 0,
    explanation: "\"En ce qui concerne\" : introduit un nouveau paragraphe ou thème. Essentiel au TEF écrit et oral.",
  },
  {
    sentence: "___ la question environnementale, les avis des experts restent très partagés.",
    options: ["En raison de", "S'agissant de", "Afin de", "Bien que"],
    correctIndex: 1,
    explanation: "\"S'agissant de\" : initiateur de paragraphe formel, très apprécié à l'écrit et à l'oral TEF.",
  },
  {
    sentence: "___ l'emploi des jeunes, le gouvernement a annoncé de nouvelles mesures.",
    options: ["En dépit de", "À la suite de", "Quant à", "En guise de"],
    correctIndex: 2,
    explanation: "\"Quant à\" : reprend un thème ou introduit un nouveau point. Très usité à l'oral TEF.",
  },
  {
    sentence: "___ l'éducation, des investissements massifs ont été décidés par le gouvernement.",
    options: ["Malgré", "Grâce à", "En dépit de", "Pour ce qui est de"],
    correctIndex: 3,
    explanation: "\"Pour ce qui est de\" : initiateur de paragraphe formel, synonyme de \"en ce qui concerne\".",
  },

  // ── STRUCTURES D'ARGUMENTATION ───────────────────────────────────────────
  {
    sentence: "___, certains défendent la semaine de quatre jours, tandis que d'autres estiment qu'elle nuirait à la productivité.",
    options: ["D'une part", "Certes", "D'abord", "Premièrement"],
    correctIndex: 0,
    explanation: "\"D'une part... d'autre part\" : structure d'opposition binaire, incontournable au TEF.",
  },
  {
    sentence: "Il faut ___ que l'accès à l'éducation reste inégal selon les régions.",
    options: ["donc admettre", "néanmoins admettre", "reconnaître", "force est de constater"],
    correctIndex: 3,
    explanation: "\"Force est de constater\" : expression impersonnelle formelle, très efficace à l'écrit TEF.",
  },
  {
    sentence: "Ce phénomène soulève des enjeux ___ économiques ___ sociaux.",
    options: ["à la fois... et", "certes... mais", "soit... soit", "non seulement... mais aussi"],
    correctIndex: 3,
    explanation: "\"Non seulement... mais aussi\" : structure d'addition renforcée, très efficace au TEF.",
  },

  // ── EXPRESSIONS D'OPINION ────────────────────────────────────────────────
  {
    sentence: "___, cette réforme représente une avancée majeure pour l'économie nationale.",
    options: ["À mon avis", "En revanche", "Car", "Pourtant"],
    correctIndex: 0,
    explanation: "\"À mon avis\" : indispensable pour l'expression orale et écrite au TEF. Synonymes : selon moi, à mes yeux.",
  },
  {
    sentence: "___ que les nouvelles technologies simplifient notre vie, elles créent aussi de nouvelles dépendances.",
    options: ["C'est pourquoi", "En outre", "Il me semble", "Certes"],
    correctIndex: 2,
    explanation: "\"Il me semble que\" : opinion nuancée très appréciée à l'oral TEF. Plus modeste que \"j'estime que\".",
  },
  {
    sentence: "___ cette politique manque de cohérence et ne répond pas aux besoins réels de la population.",
    options: ["C'est pourquoi", "En revanche", "De plus", "J'estime que"],
    correctIndex: 3,
    explanation: "\"J'estime que\" : opinion affirmée. Synonymes : je considère que, je suis convaincu(e) que.",
  },

  // ── REFORMULATION ────────────────────────────────────────────────────────
  {
    sentence: "Ce projet est trop ambitieux. ___, il dépasse largement nos capacités actuelles.",
    options: ["Autrement dit", "De plus", "Pourtant", "Car"],
    correctIndex: 0,
    explanation: "\"Autrement dit\" : reformule ce qui vient d'être dit de façon plus claire ou plus directe.",
  },
  {
    sentence: "Il s'agit d'un problème structurel, ___ d'une difficulté profonde et durable.",
    options: ["c'est pourquoi", "c'est-à-dire", "en revanche", "certes"],
    correctIndex: 1,
    explanation: "\"C'est-à-dire\" : précise ou explicite. S'utilise autant à l'oral qu'à l'écrit TEF.",
  },
  {
    sentence: "___, nous pouvons affirmer que cette initiative est un véritable succès.",
    options: ["En revanche", "Pourtant", "En d'autres termes", "Car"],
    correctIndex: 2,
    explanation: "\"En d'autres termes\" : reformulation formelle, alternative à \"autrement dit\".",
  },

  // ── CONCLUSION ───────────────────────────────────────────────────────────
  {
    sentence: "___, cette expérience m'a permis de développer des compétences essentielles.",
    options: ["En somme", "Cependant", "De plus", "Car"],
    correctIndex: 0,
    explanation: "\"En somme\" : synthétise avant de conclure. Très utilisé à l'oral et à l'écrit TEF.",
  },
  {
    sentence: "___, je dirais que les avantages de cette mesure l'emportent sur ses inconvénients.",
    options: ["En outre", "Pour conclure", "Cependant", "Puisque"],
    correctIndex: 1,
    explanation: "\"Pour conclure\" : marque explicitement la fin du développement. Indispensable à l'oral TEF.",
  },
  {
    sentence: "___, cette approche représente la meilleure solution disponible à ce jour.",
    options: ["De plus", "Car", "En définitive", "En revanche"],
    correctIndex: 2,
    explanation: "\"En définitive\" : conclusion formelle. Synonymes : en fin de compte, tout compte fait.",
  },
  {
    sentence: "___, on peut affirmer que le numérique a profondément transformé notre rapport au travail.",
    options: ["Pourtant", "Car", "Cependant", "Ainsi"],
    correctIndex: 3,
    explanation: "\"Ainsi\" : peut introduire une conclusion ou une conséquence. Très fréquent en début de conclusion.",
  },

  // ── EXPRESSIONS TYPIQUES DE L'ORAL ──────────────────────────────────────
  {
    sentence: "Je voudrais ___ la question du réchauffement climatique et de ses conséquences.",
    options: ["aborder", "traiter avec", "parler avec", "concerner"],
    correctIndex: 0,
    explanation: "\"Aborder une question\" : expression clé pour introduire un sujet à l'oral TEF.",
  },
  {
    sentence: "Il ___ de souligner que cette réforme a eu des effets largement inattendus.",
    options: ["convient", "faut dire", "vaut mieux", "mérite"],
    correctIndex: 0,
    explanation: "\"Il convient de\" : formule impersonnelle formelle très appréciée à l'oral TEF.",
  },
  {
    sentence: "C'est ___ ce contexte que les nouvelles politiques d'intégration ont été adoptées.",
    options: ["en", "sous", "dans", "avec"],
    correctIndex: 2,
    explanation: "\"C'est dans ce contexte que\" : cadre la suite de l'argumentation à l'oral.",
  },
  {
    sentence: "Je tiens à ___ que cette décision a été prise de manière entièrement concertée.",
    options: ["noter avec", "dire avec", "signaler avec", "préciser"],
    correctIndex: 3,
    explanation: "\"Je tiens à préciser que\" : souligne l'importance d'une information à l'oral TEF.",
  },

  // ── NUANCES AVANCÉES ─────────────────────────────────────────────────────
  {
    sentence: "Nous avons réussi ___ votre aide précieuse et votre expertise.",
    options: ["malgré", "grâce à", "en dépit de", "en raison de"],
    correctIndex: 1,
    explanation: "\"Grâce à\" : cause positive. \"Malgré\" et \"en dépit de\" expriment une opposition. \"En raison de\" = cause neutre.",
  },
  {
    sentence: "___ améliorer les conditions de travail, l'entreprise a investi dans de nouveaux équipements.",
    options: ["Grâce à", "En raison d'", "Afin d'", "Malgré"],
    correctIndex: 2,
    explanation: "\"Afin de\" : exprime le but/l'objectif. Synonymes : pour (moins formel), dans le but de (plus formel).",
  },
  {
    sentence: "Je suis favorable à ce projet, ___ certaines conditions soient respectées.",
    options: ["afin que", "pour que", "à condition que", "bien que"],
    correctIndex: 2,
    explanation: "\"À condition que\" : pose une condition. Suivi du subjonctif. Très utile pour nuancer une position.",
  },
  {
    sentence: "___ les difficultés rencontrées, l'équipe a réussi à livrer le projet dans les délais.",
    options: ["En raison de", "Grâce à", "En dépit de", "Afin de"],
    correctIndex: 2,
    explanation: "\"En dépit de\" : synonyme formel de \"malgré\". Légèrement plus soutenu, idéal à l'écrit TEF.",
  },
];
