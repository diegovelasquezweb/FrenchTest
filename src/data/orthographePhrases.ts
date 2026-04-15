export interface OrthographePhrase {
  /** Sentence shown to the user. Use ___  to mark the blank. */
  sentence: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  /** Brief explanation shown after answering */
  explanation: string;
}

export const ORTHOGRAPHE_PHRASES: OrthographePhrase[] = [
  // ── a / à ──────────────────────────────────────────────────────────────
  {
    sentence: "Il ___ beaucoup travaillé pour réussir cet examen.",
    options: ["a", "à", "as", "â"],
    correctIndex: 0,
    explanation: "\"a\" : si ça marche, c'est \"a\".",
  },
  {
    sentence: "Je vais ___ Paris la semaine prochaine.",
    options: ["à", "a", "as", "â"],
    correctIndex: 0,
    explanation: "\"à\" = préposition de lieu. \"a\" = verbe avoir. Astuce : \"à\" ne se remplace pas par \"avait\".",
  },

  // ── ou / où ─────────────────────────────────────────────────────────────
  {
    sentence: "Je ne sais pas ___ il est allé ce matin.",
    options: ["où", "ou", "oû", "oux"],
    correctIndex: 0,
    explanation: "\"où\" : si ça ne marche pas, c'est \"où\".",
  },
  {
    sentence: "Tu préfères le café ___ le thé ?",
    options: ["ou", "où", "oû", "oux"],
    correctIndex: 0,
    explanation: "\"ou\" exprime un choix. \"où\" indique un lieu.",
  },

  // ── est / et / ait / ai ─────────────────────────────────────────────────
  {
    sentence: "Marie ___ très contente de son résultat.",
    options: ["est", "et", "ait", "ai"],
    correctIndex: 0,
    explanation: "\"est\" : si ça marche, c'est \"est\".",
  },
  {
    sentence: "Le rapport ___ terminé depuis hier.",
    options: ["est", "et", "ait", "ai"],
    correctIndex: 0,
    explanation: "\"est\" = verbe être. \"et\" = conjonction (relie deux éléments). \"ait\" = subjonctif. \"ai\" = 1ʳᵉ personne du singulier.",
  },
  {
    sentence: "J'___ rencontré son directeur ce matin.",
    options: ["ai", "est", "ait", "et"],
    correctIndex: 0,
    explanation: "\"ai\" = verbe avoir, 1ʳᵉ personne (j'ai). Jamais \"est\" ni \"et\" avec le pronom \"j'\".",
  },

  // ── on / ont ────────────────────────────────────────────────────────────
  {
    sentence: "Ils ___ décidé de remettre la réunion à jeudi.",
    options: ["ont", "on", "onts", "ons"],
    correctIndex: 0,
    explanation: "\"ont\" : si ça marche, c'est \"ont\".",
  },
  {
    sentence: "___ m'a dit que la réunion était annulée.",
    options: ["On", "Ont", "Ons", "Onts"],
    correctIndex: 0,
    explanation: "\"On\" : ne s'emploie pas seul en début de phrase.",
  },

  // ── son / sont ──────────────────────────────────────────────────────────
  {
    sentence: "Les enfants ___ fatigués après la longue journée.",
    options: ["sont", "son", "sonts", "sons"],
    correctIndex: 0,
    explanation: "\"sont\" = verbe être, 3ᵉ pl. \"son\" = adjectif possessif (son livre). Astuce : remplacez par \"étaient\".",
  },
  {
    sentence: "Elle a retrouvé ___ passeport dans le tiroir.",
    options: ["son", "sont", "sons", "sonts"],
    correctIndex: 0,
    explanation: "\"son\" = possessif masc. sing. (son passeport). \"sont\" = verbe être.",
  },

  // ── c'est / s'est / ces / ses ───────────────────────────────────────────
  {
    sentence: "___ une excellente opportunité de carrière.",
    options: ["C'est", "S'est", "Ces", "Ses"],
    correctIndex: 0,
    explanation: "\"C'est\" = c'est + attribut. \"S'est\" = pronom réfléchi + être (il s'est levé). \"Ces\" = démonstratif pl. \"Ses\" = possessif pl.",
  },
  {
    sentence: "Il ___ trompé de chemin en revenant du bureau.",
    options: ["s'est", "c'est", "ses", "ces"],
    correctIndex: 0,
    explanation: "\"s'est\" = pronom se + verbe être (il s'est trompé = verbe pronominal). \"c'est\" ne suit pas un pronom sujet comme \"il\".",
  },
  {
    sentence: "___ documents doivent être signés avant demain.",
    options: ["Ces", "Ses", "C'est", "S'est"],
    correctIndex: 0,
    explanation: "\"Ces\" = démonstratif pluriel (ces documents-ci). \"Ses\" = possessif pluriel (ses propres documents).",
  },

  // ── se / ce ─────────────────────────────────────────────────────────────
  {
    sentence: "Il ___ lève toujours à six heures du matin.",
    options: ["se", "ce", "s'e", "cé"],
    correctIndex: 0,
    explanation: "\"se\" = pronom réfléchi (il se lève). \"ce\" = démonstratif (ce livre).",
  },

  // ── leur / leurs ────────────────────────────────────────────────────────
  {
    sentence: "Les étudiants ont remis ___ travaux en avance.",
    options: ["leurs", "leur", "lures", "leurres"],
    correctIndex: 0,
    explanation: "\"leurs\" = possessif pluriel (plusieurs travaux). \"leur\" = possessif singulier ou pronom COI.",
  },
  {
    sentence: "Je ___ ai envoyé le compte rendu hier soir.",
    options: ["leur", "leurs", "lure", "leurre"],
    correctIndex: 0,
    explanation: "\"leur\" = pronom COI invariable (je leur ai envoyé). On ne met pas de \"s\" au pronom.",
  },

  // ── lui / leur (pronom COI singulier vs pluriel) ───────────────────────
  {
    sentence: "Les clients étaient mécontents ; je ___ ai expliqué la situation calmement.",
    options: ["leur", "lui", "les", "le"],
    correctIndex: 0,
    explanation: "\"leur\" = pronom COI pluriel (à eux/à elles). \"lui\" = COI singulier (à lui/à elle). \"les clients\" est pluriel → \"leur\".",
  },
  {
    sentence: "Mon collègue n'avait pas compris ; je ___ ai tout réexpliqué.",
    options: ["lui", "leur", "le", "les"],
    correctIndex: 0,
    explanation: "\"lui\" = COI singulier (à lui/à elle). \"leur\" = COI pluriel. \"mon collègue\" est singulier → \"lui\".",
  },
  {
    sentence: "J'ai rencontré tes sœurs hier ; je ___ ai transmis ton message.",
    options: ["leur", "lui", "les", "la"],
    correctIndex: 0,
    explanation: "\"leur\" = COI pluriel (transmettre à elles). \"lui\" = COI singulier. \"tes sœurs\" est pluriel → \"leur\".",
  },

  // ── les (COD) vs leur (COI) ─────────────────────────────────────────────
  {
    sentence: "Elle avait oublié ses clés ; son mari ___ a apportées au bureau.",
    options: ["les", "leur", "lui", "la"],
    correctIndex: 0,
    explanation: "\"les\" = COD pluriel (apporter quoi ? les clés). \"leur\" = COI pluriel (à eux). Ici le verbe \"apporter\" a un COD → \"les\".",
  },
  {
    sentence: "Nous avons reçu les nouveaux stagiaires et nous ___ avons présenté l'équipe.",
    options: ["leur", "les", "lui", "y"],
    correctIndex: 0,
    explanation: "\"présenter à qqn\" → COI → \"leur\" (à eux). \"les\" serait le COD si on présentait les stagiaires à quelqu'un d'autre.",
  },

  // ── le / la (COD) vs lui (COI) ──────────────────────────────────────────
  {
    sentence: "Le directeur avait une annonce ; il ___ a faite devant toute l'équipe.",
    options: ["l'", "lui", "leur", "les"],
    correctIndex: 0,
    explanation: "\"l'\" (= la) = COD féminin (faire quoi ? l'annonce). On ne dit pas \"lui a faite\" : \"faire\" appelle un COD ici, pas un COI.",
  },
  {
    sentence: "Je n'avais pas vu mon chef ; je ___ ai croisé dans le couloir.",
    options: ["l'", "lui", "leur", "les"],
    correctIndex: 0,
    explanation: "\"l'\" (= le) = COD masculin (croiser qui ? lui). \"croiser\" appelle un COD → \"le/l'\", pas un COI.",
  },

  // ── leur / leurs (possessif) ─────────────────────────────────────────────
  {
    sentence: "Les deux associés ont signé ___ contrat ce matin.",
    options: ["leur", "leurs", "lures", "leurres"],
    correctIndex: 0,
    explanation: "\"leur\" = possessif singulier (un seul contrat partagé). \"leurs\" = pluriel. Un contrat commun → \"leur contrat\".",
  },
  {
    sentence: "Les enfants rangeaient ___ affaires avant de partir à l'école.",
    options: ["leurs", "leur", "lures", "leurres"],
    correctIndex: 0,
    explanation: "\"leurs\" = possessif pluriel (plusieurs affaires). \"leur\" = singulier. Plusieurs objets → \"leurs affaires\".",
  },

  // ── -er / -é / -ez ──────────────────────────────────────────────────────
  {
    sentence: "Vous devez ___ ce formulaire avant vendredi.",
    options: ["remplir", "rempli", "remplît", "remplis"],
    correctIndex: 0,
    explanation: "Après \"devez\" (verbe conjugué), on utilise l'infinitif. Ici \"remplir\" est l'infinitif du verbe.",
  },
  {
    sentence: "Il a ___ tous ses messages avant de partir.",
    options: ["supprimé", "supprimer", "supprimez", "suprimé"],
    correctIndex: 0,
    explanation: "Après \"a\" (auxiliaire avoir), on utilise le participe passé : \"supprimé\". \"Supprimer\" est l'infinitif.",
  },
  {
    sentence: "Vous ___ vos congés avant le 31 décembre.",
    options: ["posez", "poser", "posé", "posée"],
    correctIndex: 0,
    explanation: "\"posez\" = présent, 2ᵉ pl. (vous posez). \"poser\" = infinitif. \"posé\" = participe passé.",
  },

  // ── -ais / -ait / -ai ───────────────────────────────────────────────────
  {
    sentence: "Quand j'étais enfant, j'___ souvent à la bibliothèque.",
    options: ["allais", "allai", "allait", "allez"],
    correctIndex: 0,
    explanation: "\"allais\" = imparfait, 1ʳᵉ personne (j'allais). \"allait\" = imparfait 3ᵉ pers. \"allai\" = passé simple.",
  },

  // ── plutôt / plus tôt ───────────────────────────────────────────────────
  {
    sentence: "Partons ___ pour éviter les embouteillages.",
    options: ["plus tôt", "plutôt", "plutot", "plus tot"],
    correctIndex: 0,
    explanation: "\"plus tôt\" = earlier (notion de temps). \"plutôt\" = rather / de préférence. Astuce : \"plutôt\" = de préférence.",
  },
  {
    sentence: "Je préfère rester ici ___ que de sortir sous la pluie.",
    options: ["plutôt", "plus tôt", "plutot", "plus tot"],
    correctIndex: 0,
    explanation: "\"plutôt\" = de préférence / rather. \"plus tôt\" = avant dans le temps.",
  },

  // ── davantage / d'avantage ──────────────────────────────────────────────
  {
    sentence: "Elle travaille ___ depuis qu'elle a eu cette promotion.",
    options: ["davantage", "d'avantage", "d'avantages", "davantages"],
    correctIndex: 0,
    explanation: "\"davantage\" = more (adverbe, s'écrit en un mot). \"d'avantage\" n'existe pas. \"avantage\" est un nom.",
  },

  // ── quand / quant / qu'en ───────────────────────────────────────────────
  {
    sentence: "___ partez-vous en vacances cette année ?",
    options: ["Quand", "Quant", "Qu'en", "Qu'and"],
    correctIndex: 0,
    explanation: "\"Quand\" introduit le temps. \"Quant\" s'utilise dans « quant à ». \"Qu'en\" correspond à « que + en ».",
  },

  // ── ma / m'a ────────────────────────────────────────────────────────────
  {
    sentence: "Elle ___ téléphoné hier pour confirmer le rendez-vous.",
    options: ["m'a", "ma", "m'as", "m'à"],
    correctIndex: 0,
    explanation: "\"m'a\" = me + a (elle m'a téléphoné). \"ma\" = adjectif possessif féminin (ma valise).",
  },

  // ── tout / tous / toute / toutes ────────────────────────────────────────
  {
    sentence: "___ les candidats devront se présenter avec une pièce d'identité.",
    options: ["Tous", "Tout", "Toutes", "Toute"],
    correctIndex: 0,
    explanation: "\"Tous\" = adjectif pluriel masc. (tous les candidats). \"Tout\" = sing. masc. \"Toutes\" = pl. fém.",
  },
  {
    sentence: "Elle a répondu à ___ les questions du formulaire.",
    options: ["toutes", "tous", "tout", "toute"],
    correctIndex: 0,
    explanation: "\"toutes\" = pluriel féminin (toutes les questions). \"Tous\" = masc. pl. \"Tout\" = masc. sing.",
  },

  // ── s'y / si ────────────────────────────────────────────────────────────
  {
    sentence: "Il aime beaucoup ce café et ___ retrouve ses collègues chaque vendredi.",
    options: ["s'y", "si", "sy", "s'i"],
    correctIndex: 0,
    explanation: "\"s'y\" = se + y (il se retrouve là-bas). \"si\" = condition ou intensité.",
  },

  // ── n'y / ni ────────────────────────────────────────────────────────────
  {
    sentence: "Je ___ suis jamais allé, mais j'aimerais visiter ce pays.",
    options: ["n'y", "ni", "ny", "n'i"],
    correctIndex: 0,
    explanation: "\"n'y\" = ne + y (je n'y suis pas allé). \"ni\" = neither/nor (ni l'un ni l'autre).",
  },

  // ── quelle / qu'elle / quel ─────────────────────────────────────────────
  {
    sentence: "___ est la durée prévue pour ce projet ?",
    options: ["Quelle", "Qu'elle", "Quel", "Quels"],
    correctIndex: 0,
    explanation: "\"Quelle\" = adjectif interrogatif féminin (la durée). \"Qu'elle\" = que + elle. \"Quel\" = masc. sing.",
  },
];
