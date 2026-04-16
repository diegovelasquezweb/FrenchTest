import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type PersonForms = {
  je: string;
  tu: string;
  ilElle: string;
  nous: string;
  vous: string;
  ilsElles: string;
};

interface TenseBlock {
  label: string;
  forms: PersonForms;
  exampleFr: string;
  exampleEs: string;
}

interface EssentialVerb {
  infinitive: string;
  translationEn: string;
  translationEs: string;
  tenses: TenseBlock[];
  imperative: { tu: string; nous: string; vous: string; exampleFr: string; exampleEs: string };
}

const ESSENTIAL_VERBS: EssentialVerb[] = [
  {
    infinitive: "être",
    translationEn: "to be",
    translationEs: "ser / estar",
    tenses: [
      { label: "Présent", forms: { je: "suis", tu: "es", ilElle: "est", nous: "sommes", vous: "êtes", ilsElles: "sont" }, exampleFr: "Je suis prêt pour l'examen.", exampleEs: "Estoy listo para el examen." },
      { label: "Passé composé", forms: { je: "ai été", tu: "as été", ilElle: "a été", nous: "avons été", vous: "avez été", ilsElles: "ont été" }, exampleFr: "Nous avons été très motivés.", exampleEs: "Hemos estado muy motivados." },
      { label: "Imparfait", forms: { je: "étais", tu: "étais", ilElle: "était", nous: "étions", vous: "étiez", ilsElles: "étaient" }, exampleFr: "Quand j'étais petit, j'étais timide.", exampleEs: "Cuando era pequeño, era tímido." },
      { label: "Futur simple", forms: { je: "serai", tu: "seras", ilElle: "sera", nous: "serons", vous: "serez", ilsElles: "seront" }, exampleFr: "Demain, je serai à Montréal.", exampleEs: "Mañana estaré en Montreal." },
      { label: "Conditionnel présent", forms: { je: "serais", tu: "serais", ilElle: "serait", nous: "serions", vous: "seriez", ilsElles: "seraient" }, exampleFr: "Ce serait une bonne idée.", exampleEs: "Sería una buena idea." },
      { label: "Subjonctif présent", forms: { je: "sois", tu: "sois", ilElle: "soit", nous: "soyons", vous: "soyez", ilsElles: "soient" }, exampleFr: "Il faut que tu sois à l'heure.", exampleEs: "Hace falta que llegues a tiempo." },
    ],
    imperative: { tu: "sois", nous: "soyons", vous: "soyez", exampleFr: "Sois patient.", exampleEs: "Sé paciente." },
  },
  {
    infinitive: "avoir",
    translationEn: "to have",
    translationEs: "tener / haber",
    tenses: [
      { label: "Présent", forms: { je: "ai", tu: "as", ilElle: "a", nous: "avons", vous: "avez", ilsElles: "ont" }, exampleFr: "J'ai une question.", exampleEs: "Tengo una pregunta." },
      { label: "Passé composé", forms: { je: "ai eu", tu: "as eu", ilElle: "a eu", nous: "avons eu", vous: "avez eu", ilsElles: "ont eu" }, exampleFr: "Ils ont eu un problème.", exampleEs: "Tuvieron un problema." },
      { label: "Imparfait", forms: { je: "avais", tu: "avais", ilElle: "avait", nous: "avions", vous: "aviez", ilsElles: "avaient" }, exampleFr: "Nous avions peu de temps.", exampleEs: "Teníamos poco tiempo." },
      { label: "Futur simple", forms: { je: "aurai", tu: "auras", ilElle: "aura", nous: "aurons", vous: "aurez", ilsElles: "auront" }, exampleFr: "Vous aurez les résultats demain.", exampleEs: "Tendrán los resultados mañana." },
      { label: "Conditionnel présent", forms: { je: "aurais", tu: "aurais", ilElle: "aurait", nous: "aurions", vous: "auriez", ilsElles: "auraient" }, exampleFr: "J'aurais besoin d'aide.", exampleEs: "Necesitaría ayuda." },
      { label: "Subjonctif présent", forms: { je: "aie", tu: "aies", ilElle: "ait", nous: "ayons", vous: "ayez", ilsElles: "aient" }, exampleFr: "Il faut que vous ayez ce document.", exampleEs: "Es necesario que tengan este documento." },
    ],
    imperative: { tu: "aie", nous: "ayons", vous: "ayez", exampleFr: "Ayez confiance.", exampleEs: "Tengan confianza." },
  },
  {
    infinitive: "faire",
    translationEn: "to do / to make",
    translationEs: "hacer",
    tenses: [
      { label: "Présent", forms: { je: "fais", tu: "fais", ilElle: "fait", nous: "faisons", vous: "faites", ilsElles: "font" }, exampleFr: "Je fais mes devoirs.", exampleEs: "Hago mi tarea." },
      { label: "Passé composé", forms: { je: "ai fait", tu: "as fait", ilElle: "a fait", nous: "avons fait", vous: "avez fait", ilsElles: "ont fait" }, exampleFr: "On a fait un bon choix.", exampleEs: "Hicimos una buena elección." },
      { label: "Imparfait", forms: { je: "faisais", tu: "faisais", ilElle: "faisait", nous: "faisions", vous: "faisiez", ilsElles: "faisaient" }, exampleFr: "Il faisait froid hier.", exampleEs: "Hacía frío ayer." },
      { label: "Futur simple", forms: { je: "ferai", tu: "feras", ilElle: "fera", nous: "ferons", vous: "ferez", ilsElles: "feront" }, exampleFr: "Je ferai cela ce soir.", exampleEs: "Haré eso esta noche." },
      { label: "Conditionnel présent", forms: { je: "ferais", tu: "ferais", ilElle: "ferait", nous: "ferions", vous: "feriez", ilsElles: "feraient" }, exampleFr: "Je le ferais autrement.", exampleEs: "Lo haría de otra manera." },
      { label: "Subjonctif présent", forms: { je: "fasse", tu: "fasses", ilElle: "fasse", nous: "fassions", vous: "fassiez", ilsElles: "fassent" }, exampleFr: "Il faut qu'il fasse un effort.", exampleEs: "Hace falta que él haga un esfuerzo." },
    ],
    imperative: { tu: "fais", nous: "faisons", vous: "faites", exampleFr: "Fais attention.", exampleEs: "Presta atención." },
  },
  {
    infinitive: "aller",
    translationEn: "to go",
    translationEs: "ir",
    tenses: [
      { label: "Présent", forms: { je: "vais", tu: "vas", ilElle: "va", nous: "allons", vous: "allez", ilsElles: "vont" }, exampleFr: "Je vais au travail.", exampleEs: "Voy al trabajo." },
      { label: "Passé composé", forms: { je: "suis allé(e)", tu: "es allé(e)", ilElle: "est allé(e)", nous: "sommes allé(e)s", vous: "êtes allé(e)(s)", ilsElles: "sont allé(e)s" }, exampleFr: "Nous sommes allés au centre-ville.", exampleEs: "Fuimos al centro." },
      { label: "Imparfait", forms: { je: "allais", tu: "allais", ilElle: "allait", nous: "allions", vous: "alliez", ilsElles: "allaient" }, exampleFr: "J'allais souvent chez ma grand-mère.", exampleEs: "Iba seguido a casa de mi abuela." },
      { label: "Futur simple", forms: { je: "irai", tu: "iras", ilElle: "ira", nous: "irons", vous: "irez", ilsElles: "iront" }, exampleFr: "Ils iront demain.", exampleEs: "Ellos irán mañana." },
      { label: "Conditionnel présent", forms: { je: "irais", tu: "irais", ilElle: "irait", nous: "irions", vous: "iriez", ilsElles: "iraient" }, exampleFr: "J'irais avec toi.", exampleEs: "Iría contigo." },
      { label: "Subjonctif présent", forms: { je: "aille", tu: "ailles", ilElle: "aille", nous: "allions", vous: "alliez", ilsElles: "aillent" }, exampleFr: "Il faut que tu ailles à la banque.", exampleEs: "Hace falta que vayas al banco." },
    ],
    imperative: { tu: "va", nous: "allons", vous: "allez", exampleFr: "Allez, on y va !", exampleEs: "Vamos, ¡vámonos!" },
  },
  {
    infinitive: "venir",
    translationEn: "to come",
    translationEs: "venir",
    tenses: [
      { label: "Présent", forms: { je: "viens", tu: "viens", ilElle: "vient", nous: "venons", vous: "venez", ilsElles: "viennent" }, exampleFr: "Tu viens avec nous ?", exampleEs: "¿Vienes con nosotros?" },
      { label: "Passé composé", forms: { je: "suis venu(e)", tu: "es venu(e)", ilElle: "est venu(e)", nous: "sommes venu(e)s", vous: "êtes venu(e)(s)", ilsElles: "sont venu(e)s" }, exampleFr: "Elle est venue hier.", exampleEs: "Ella vino ayer." },
      { label: "Imparfait", forms: { je: "venais", tu: "venais", ilElle: "venait", nous: "venions", vous: "veniez", ilsElles: "venaient" }, exampleFr: "Je venais plus tôt avant.", exampleEs: "Antes venía más temprano." },
      { label: "Futur simple", forms: { je: "viendrai", tu: "viendras", ilElle: "viendra", nous: "viendrons", vous: "viendrez", ilsElles: "viendront" }, exampleFr: "Nous viendrons samedi.", exampleEs: "Vendremos el sábado." },
      { label: "Conditionnel présent", forms: { je: "viendrais", tu: "viendrais", ilElle: "viendrait", nous: "viendrions", vous: "viendriez", ilsElles: "viendraient" }, exampleFr: "Je viendrais plus souvent.", exampleEs: "Vendría más seguido." },
      { label: "Subjonctif présent", forms: { je: "vienne", tu: "viennes", ilElle: "vienne", nous: "venions", vous: "veniez", ilsElles: "viennent" }, exampleFr: "Il faut qu'ils viennent à l'heure.", exampleEs: "Hace falta que ellos vengan a tiempo." },
    ],
    imperative: { tu: "viens", nous: "venons", vous: "venez", exampleFr: "Viens ici, s'il te plaît.", exampleEs: "Ven aquí, por favor." },
  },
];

const PRONOUNS: Array<keyof PersonForms> = ["je", "tu", "ilElle", "nous", "vous", "ilsElles"];
const PRONOUN_LABEL: Record<keyof PersonForms, string> = {
  je: "je", tu: "tu", ilElle: "il / elle", nous: "nous", vous: "vous", ilsElles: "ils / elles",
};

export function EssentialVerbsGuide() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <Accordion.Root type="single" collapsible className="rounded-(--radius-card) overflow-hidden border border-(--color-ink)/10 bg-(--color-surface) shadow-sm">
        {ESSENTIAL_VERBS.map((verb, i) => (
          <Accordion.Item
            key={verb.infinitive}
            value={verb.infinitive}
            className={i > 0 ? "border-t border-(--color-ink)/8" : ""}
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left">
                <div>
                  <span className="text-base font-bold text-(--color-ink)" lang="fr">{verb.infinitive}</span>
                  <span className="ml-2 text-xs text-(--color-muted)">{verb.translationEn} · {verb.translationEs}</span>
                </div>
                <ChevronDown size={16} className="shrink-0 text-(--color-muted) transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
              <div className="px-5 pb-5">
                <div className="grid gap-3 md:grid-cols-2">
                  {verb.tenses.map((tense) => (
                    <div key={tense.label} className="rounded border border-(--color-ink)/10 p-3">
                      <p className="text-sm font-semibold text-(--color-ink)">{tense.label}</p>
                      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        {PRONOUNS.map((p) => (
                          <div key={p} className="flex items-baseline gap-1">
                            <span className="text-(--color-muted)">{PRONOUN_LABEL[p]}</span>
                            <span className="font-medium text-(--color-ink)">{tense.forms[p]}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-(--color-muted)" lang="fr">{tense.exampleFr}</p>
                      <p className="text-xs text-(--color-muted)" lang="es">{tense.exampleEs}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded border border-(--color-ink)/10 p-3">
                  <p className="text-sm font-semibold text-(--color-ink)">Impératif</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span><span className="text-(--color-muted)">tu </span><span className="font-medium text-(--color-ink)">{verb.imperative.tu}</span></span>
                    <span><span className="text-(--color-muted)">nous </span><span className="font-medium text-(--color-ink)">{verb.imperative.nous}</span></span>
                    <span><span className="text-(--color-muted)">vous </span><span className="font-medium text-(--color-ink)">{verb.imperative.vous}</span></span>
                  </div>
                  <p className="mt-2 text-xs text-(--color-muted)" lang="fr">{verb.imperative.exampleFr}</p>
                  <p className="text-xs text-(--color-muted)" lang="es">{verb.imperative.exampleEs}</p>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
