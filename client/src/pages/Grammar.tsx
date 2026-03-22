import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

interface CaseEndings {
  mascSg: string[]
  mascPl: string[]
  femSg: string[]
  femPl: string[]
}

interface Preposition {
  word: string
  meaning: string
  example: string
  exampleEn: string
}

interface CaseData {
  id: string
  ltName: string
  enName: string
  number: number
  color: string
  bgColor: string
  borderColor: string
  usage: string[]
  examples: { lt: string; en: string }[]
  prepositions: Preposition[]
  endings: CaseEndings
  tip: string
}

const CASES: CaseData[] = [
  {
    id: 'vardininkas',
    ltName: 'Vardininkas',
    enName: 'Nominative',
    number: 1,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    usage: [
      'Sakinio veiksnys (subject of a sentence)',
      'Atsakymas į klausimą: Kas? Kas yra? (Who? What?)',
      'Vardas ar pavadinimas (names and titles)',
    ],
    examples: [
      { lt: 'Draugas dirba mokykloje.', en: 'The friend works at school.' },
      { lt: 'Mama valgo pietus.', en: 'Mom is eating lunch.' },
      { lt: 'Vilnius yra sostinė.', en: 'Vilnius is the capital.' },
    ],
    prepositions: [],
    endings: {
      mascSg: ['-as (draugas)', '-is (brolis)', '-us (sūnus)', '-ys (vagis)'],
      mascPl: ['-ai (draugai)', '-iai (broliai)', '-ūs (sūnūs)', '-ys (vagys)'],
      femSg: ['-a (mama)', '-ė (sesė)', '-is (moteris)', '-us (duktė)'],
      femPl: ['-os (mamos)', '-ės (sesės)', '-ys (moterys)', '-erys (dukterys)'],
    },
    tip: 'Vardininkas is the "dictionary form" — how you find a word in a dictionary.',
  },
  {
    id: 'kilmininkas',
    ltName: 'Kilmininkas',
    enName: 'Genitive',
    number: 2,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    usage: [
      'Priklausomybė (possession): kieno? — whose?',
      'Dalies reikšmė (partial amount): daug, mažai, kiek + kilmininkas',
      'Po neiginio (after negation): Aš neturiu draugo.',
      'Atsakymas į klausimą: Kieno? Ko? Iš ko?',
    ],
    examples: [
      { lt: 'Mamos knyga yra ant stalo.', en: "Mom's book is on the table." },
      { lt: 'Aš neturiu laiko.', en: 'I don\'t have time.' },
      { lt: 'Puodelis kavos, prašom.', en: 'A cup of coffee, please.' },
      { lt: 'Vilniaus gatvės yra labai gražios.', en: "Vilnius's streets are very beautiful." },
    ],
    prepositions: [
      { word: 'be', meaning: 'without', example: 'Kava be cukraus.', exampleEn: 'Coffee without sugar.' },
      { word: 'iš', meaning: 'from / out of', example: 'Aš esu iš Lietuvos.', exampleEn: 'I am from Lithuania.' },
      { word: 'iki', meaning: 'until / up to / as far as', example: 'Dirbu iki vakaro.', exampleEn: 'I work until evening.' },
      { word: 'nuo', meaning: 'from / since / off', example: 'Nuo ryto iki vakaro.', exampleEn: 'From morning until evening.' },
      { word: 'pas', meaning: 'at / to someone\'s place', example: 'Einu pas draugą.', exampleEn: "I'm going to my friend's place." },
      { word: 'prie', meaning: 'near / at / next to / by', example: 'Stoviu prie namų.', exampleEn: 'I am standing near the house.' },
      { word: 'po', meaning: 'after (time)', example: 'Po darbo eisiu namo.', exampleEn: 'After work I will go home.' },
      { word: 'dėl', meaning: 'because of / due to / for the sake of', example: 'Dėl ligos negaliu ateiti.', exampleEn: 'Because of illness I cannot come.' },
      { word: 'tarp', meaning: 'between / among', example: 'Tarp stalo ir lango.', exampleEn: 'Between the table and the window.' },
      { word: 'ant', meaning: 'on / on top of (location)', example: 'Knyga yra ant stalo.', exampleEn: 'The book is on the table.' },
      { word: 'už', meaning: 'behind / beyond / for (price)', example: 'Namas yra už miško.', exampleEn: 'The house is behind the forest.' },
      { word: 'virš', meaning: 'above / over', example: 'Lėktuvas skrido virš miesto.', exampleEn: 'The plane flew above the city.' },
      { word: 'po (apačioje)', meaning: 'below / beneath (static)', example: 'Po kalno yra upė.', exampleEn: 'Below the mountain there is a river.' },
      { word: 'šalia', meaning: 'beside / alongside / next to', example: 'Šalia manęs sėdi draugas.', exampleEn: 'A friend is sitting beside me.' },
      { word: 'link', meaning: 'towards / in the direction of', example: 'Einu link namų.', exampleEn: 'I am going towards the house.' },
      { word: 'ties', meaning: 'at / right by / at the level of', example: 'Sustokite ties raudonuoju namu.', exampleEn: 'Stop right by the red house.' },
      { word: 'aplink', meaning: 'around / surrounding (static)', example: 'Aplink miesto daug miškai.', exampleEn: 'There are many forests around the city.' },
      { word: 'netoli', meaning: 'not far from / near', example: 'Gyvenu netoli centro.', exampleEn: 'I live not far from the centre.' },
      { word: 'arti', meaning: 'close to / near', example: 'Arti stoties yra kavinė.', exampleEn: 'Near the station there is a café.' },
      { word: 'dėka', meaning: 'thanks to / owing to', example: 'Dėka draugo pagalbos išlaikiau.', exampleEn: 'Thanks to my friend\'s help I passed.' },
      { word: 'ligi / lig', meaning: 'until / up to (archaic/formal)', example: 'Laukiau ligi vakaro.', exampleEn: 'I waited until evening.' },
      { word: 'priešais', meaning: 'opposite / facing', example: 'Priešais parduotuvės yra parkas.', exampleEn: 'Opposite the shop there is a park.' },
    ],
    endings: {
      mascSg: ['-o (draugo)', '-io (brolio)', '-aus (sūnaus)', '-io (vagio)'],
      mascPl: ['-ų (draugų)', '-ių (brolių)', '-ų (sūnų)', '-ių (vagių)'],
      femSg: ['-os (mamos)', '-ės (sesės)', '-ies (moters)', '-ers (dukters)'],
      femPl: ['-ų (mamų)', '-ių (sesių)', '-ų (moterų)', '-erų (dukterų)'],
    },
    tip: 'Remember: after neturiu, nėra, nerandu — always use Kilmininkas!',
  },
  {
    id: 'naudininkas',
    ltName: 'Naudininkas',
    enName: 'Dative',
    number: 3,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    usage: [
      'Netiesioginis papildinys (indirect object): kam? — to whom? for whom?',
      'Po veiksmažodžių: duoti, pasakyti, padėti, rašyti + naudininkas',
      'Savybinis reikšmė (possession with "yra"): Man yra...',
      'Poreikis / jausmas (need/feeling): Man reikia, Man patinka, Man šalta',
    ],
    examples: [
      { lt: 'Aš daviau knygą draugui.', en: 'I gave the book to a friend.' },
      { lt: 'Man patinka muzika.', en: 'I like music.' },
      { lt: 'Parašyk man laišką.', en: 'Write me a letter.' },
      { lt: 'Man reikia pagalbos.', en: 'I need help.' },
    ],
    prepositions: [
      { word: 'dėka', meaning: 'thanks to / owing to', example: 'Dėka jo pagalbos išlaikiau egzaminą.', exampleEn: 'Thanks to his help I passed the exam.' },
      { word: 'link (+ Naudininkas)', meaning: 'towards (in some expressions)', example: 'Jis nusisuko man.', exampleEn: 'He turned towards me. (indirect)' },
    ],
    endings: {
      mascSg: ['-ui (draugui)', '-iui (broliui)', '-ui (sūnui)', '-iui (vagiui)'],
      mascPl: ['-ams (draugams)', '-iams (broliams)', '-ums (sūnums)', '-iams (vagiams)'],
      femSg: ['-ai (mamai)', '-ei (sesei)', '-iai (moteriai)', '-eriai (dukteriai)'],
      femPl: ['-oms (mamoms)', '-ėms (sesėms)', '-ims (moterims)', '-erims (dukterims)'],
    },
    tip: '"Man patinka" (I like), "Man reikia" (I need), "Man šalta" (I am cold) — all use Naudininkas!',
  },
  {
    id: 'galininkas',
    ltName: 'Galininkas',
    enName: 'Accusative',
    number: 4,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    usage: [
      'Tiesioginis papildinys (direct object): ką? — what? whom?',
      'Po veiksmažodžių: turiu, matau, myliu, pirkti + galininkas',
      'Kryptis su judesio veiksmažodžiais po "į" (direction with motion)',
      'Laikotarpis (time duration): visą dieną, porą metų',
    ],
    examples: [
      { lt: 'Aš matau draugą.', en: 'I see a friend.' },
      { lt: 'Ji perka naują suknelę.', en: 'She is buying a new dress.' },
      { lt: 'Einu į parduotuvę.', en: 'I am going to the shop.' },
      { lt: 'Mokiausi visą naktį.', en: 'I studied all night.' },
    ],
    prepositions: [
      { word: 'į', meaning: 'into / to (direction, motion)', example: 'Einu į mokyklą.', exampleEn: 'I am going to school.' },
      { word: 'per', meaning: 'through / across / during / for (time duration)', example: 'Ėjome per mišką.', exampleEn: 'We walked through the forest.' },
      { word: 'pro', meaning: 'past / through / by (passing alongside)', example: 'Važiuojame pro Kauną.', exampleEn: 'We are driving past Kaunas.' },
      { word: 'apie', meaning: 'about / concerning / approximately', example: 'Kalbame apie darbą.', exampleEn: 'We are talking about work.' },
      { word: 'prieš', meaning: 'before (time) / against / ago', example: 'Atvykau prieš savaitę.', exampleEn: 'I arrived a week ago.' },
      { word: 'aplink', meaning: 'around / encircling (with motion)', example: 'Bėgame aplink ežerą.', exampleEn: 'We run around the lake.' },
      { word: 'po', meaning: 'under / below (motion downward)', example: 'Pakišk ranką po stalą.', exampleEn: 'Put your hand under the table.' },
      { word: 'už', meaning: 'for / in exchange for / in favour of', example: 'Mokėjau už bilietą 10 eurų.', exampleEn: 'I paid 10 euros for the ticket.' },
      { word: 'per', meaning: 'for (time span)', example: 'Išmokau lietuviškai per metus.', exampleEn: 'I learned Lithuanian in (for) a year.' },
      { word: 'ties', meaning: 'at / right at (exact point, motion to)', example: 'Pasukite ties bažnyčia.', exampleEn: 'Turn right at the church.' },
    ],
    endings: {
      mascSg: ['-ą (draugą)', '-į (brolį)', '-ų (sūnų)', '-į (vagį)'],
      mascPl: ['-us (draugus)', '-ius (brolius)', '-us (sūnus)', '-ius (vagius)'],
      femSg: ['-ą (mamą)', '-ę (sesę)', '-į (moterį)', '-erį (dukterį)'],
      femPl: ['-as (mamas)', '-es (seses)', '-is (moteris)', '-eris (dukteries)'],
    },
    tip: '"Ką matai? Ką pirkti?" — if the question is "what/whom" as object, use Galininkas.',
  },
  {
    id: 'inagininkas',
    ltName: 'Įnagininkas',
    enName: 'Instrumental',
    number: 5,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    usage: [
      'Priemonė ar būdas (means or manner): kuo? — with what? how?',
      'Po "su" (with): kartu su draugu',
      'Tapti / būti kuo (becoming): Jis tapo mokytoju.',
      'Kryptis žemyn / statika (static "under/behind"): po, prieš + įnagininkas',
    ],
    examples: [
      { lt: 'Einu su draugu.', en: 'I am going with a friend.' },
      { lt: 'Rašau pieštuku.', en: 'I am writing with a pencil.' },
      { lt: 'Jis dirba mokytoju.', en: 'He works as a teacher.' },
      { lt: 'Katė slepiasi po stalu.', en: 'The cat is hiding under the table.' },
    ],
    prepositions: [
      { word: 'su', meaning: 'with / together with', example: 'Einu su mama į parduotuvę.', exampleEn: 'I am going to the shop with mom.' },
      { word: 'po', meaning: 'under / below (static position)', example: 'Katė miega po stalu.', exampleEn: 'The cat is sleeping under the table.' },
      { word: 'prieš', meaning: 'in front of / facing (static position)', example: 'Stoviu prieš namu.', exampleEn: 'I am standing in front of the house.' },
      { word: 'už', meaning: 'behind / at the back of (static)', example: 'Jis sėdi už manęs.', exampleEn: 'He is sitting behind me.' },
      { word: 'virš', meaning: 'above / over (static, = on top of)', example: 'Virš lango kabo paveikslas.', exampleEn: 'A picture hangs above the window.' },
    ],
    endings: {
      mascSg: ['-u (draugu)', '-iu (broliu)', '-umi (sūnumi)', '-iu (vagiu)'],
      mascPl: ['-ais (draugais)', '-iais (broliais)', '-umis (sūnumis)', '-iais (vagiais)'],
      femSg: ['-a (mama)', '-e (sese)', '-imi (moterimai)', '-eria (dukterimi)'],
      femPl: ['-omis (mamomis)', '-ėmis (sesėmis)', '-imis (moterimis)', '-erimis (dukterimis)'],
    },
    tip: '"Kuo?" (With what? By what means?) — use Įnagininkas. Also always after "su" (with).',
  },
  {
    id: 'vietininkas',
    ltName: 'Vietininkas',
    enName: 'Locative',
    number: 6,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    usage: [
      'Vieta (location): kur? — where? (at/in/on a place)',
      'Laikas (time context): kada? — when? (in a period)',
      'Abstrakti vieta (abstract location): galvoje, širdyje',
      'Naudojamas be prielinksnio (used without a preposition)',
    ],
    examples: [
      { lt: 'Gyvenu Vilniuje.', en: 'I live in Vilnius.' },
      { lt: 'Knyga yra ant stalo.', en: 'The book is on the table.' },
      { lt: 'Vasaroje važiuosime prie jūros.', en: 'In summer we will go to the sea.' },
      { lt: 'Dirbu biure.', en: 'I work in an office.' },
    ],
    prepositions: [
      { word: '(no preposition)', meaning: 'Vietininkas is mostly used WITHOUT a preposition', example: 'Gyvenu Vilniuje.', exampleEn: 'I live in Vilnius.' },
      { word: 'po (+ Kilm.)', meaning: 'after — temporal (Kilmininkas, not Vietininkas!)', example: 'Po pietų eisiu namo.', exampleEn: 'After lunch I will go home.' },
    ],
    endings: {
      mascSg: ['-e (drauge)', '-yje (brolyje)', '-uje (sūnuje)', '-yje (vagyje)'],
      mascPl: ['-uose (drauguose)', '-iuose (broliuose)', '-uose (sūnuose)', '-iuose (vagiuose)'],
      femSg: ['-oje (mamoje)', '-ėje (sesėje)', '-yje (moteryje)', '-eryje (dukteryje)'],
      femPl: ['-ose (mamose)', '-ėse (sesėse)', '-yse (moteryse)', '-eryse (dukteryse)'],
    },
    tip: '"Kur?" (Where?) without movement — always Vietininkas. "Vilniuje", "namuose", "mokykloje".',
  },
  {
    id: 'sauksmininkas',
    ltName: 'Šauksmininkas',
    enName: 'Vocative',
    number: 7,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    usage: [
      'Tiesioginis kreipinys (direct address): calling someone by name',
      'Vartojamas pasisveikinant ir atsisveikiant (greetings and farewells)',
      'Oficialiuose ir neoficialiuose laiškuose (formal and informal letters)',
    ],
    examples: [
      { lt: 'Labas, Tomai!', en: 'Hello, Tomas!' },
      { lt: 'Mama, ateik čia!', en: 'Mom, come here!' },
      { lt: 'Gerbiamas pone Petraitai,', en: 'Dear Mr. Petraitis,' },
      { lt: 'Mielasis drauge,', en: 'Dear friend,' },
    ],
    prepositions: [],
    endings: {
      mascSg: ['-e (drauge)', '-ie (brolie)', '-au (sūnau)', '-ie (vagie)'],
      mascPl: ['same as Vardininkas plural', '-iai (broliai)', '-ūs (sūnūs)', ''],
      femSg: ['-a (mama)', '-e (sese)', '-ie (moterie)', ''],
      femPl: ['same as Vardininkas plural', '', '', ''],
    },
    tip: 'Šauksmininkas is mainly used when speaking directly TO someone: "Labas, Tomai!" not "Tomas".',
  },
]

// ── Textbook-style endings comparison ───────────────────────────────────────

type DeclForm = { end: string; word: string }
type DeclCase = { sg: DeclForm; pl: DeclForm }

const DECL_CLASSES = [
  { key: 'm_as', label: '-as', nomWord: 'studentas', gender: 'm' as const },
  { key: 'm_is', label: '-is', nomWord: 'lietuvis',  gender: 'm' as const },
  { key: 'm_us', label: '-us', nomWord: 'sūnus',     gender: 'm' as const },
  { key: 'f_a',  label: '-a',  nomWord: 'mergina',   gender: 'f' as const },
  { key: 'f_e',  label: '-ė',  nomWord: 'studentė',  gender: 'f' as const },
]

const CASE_FORMS: Record<string, Record<string, DeclCase>> = {
  vardininkas: {
    m_as: { sg: { end: '-as', word: 'studentas'  }, pl: { end: '-ai',  word: 'studentai'  } },
    m_is: { sg: { end: '-is', word: 'lietuvis'   }, pl: { end: '-iai', word: 'lietuviai'  } },
    m_us: { sg: { end: '-us', word: 'sūnus'      }, pl: { end: '-ūs',  word: 'sūnūs'     } },
    f_a:  { sg: { end: '-a',  word: 'mergina'    }, pl: { end: '-os',  word: 'merginos'   } },
    f_e:  { sg: { end: '-ė',  word: 'studentė'   }, pl: { end: '-ės',  word: 'studentės'  } },
  },
  kilmininkas: {
    m_as: { sg: { end: '-o',   word: 'studento'  }, pl: { end: '-ų',   word: 'studentų'   } },
    m_is: { sg: { end: '-io',  word: 'lietuvio'  }, pl: { end: '-ių',  word: 'lietuvių'   } },
    m_us: { sg: { end: '-aus', word: 'sūnaus'    }, pl: { end: '-ų',   word: 'sūnų'       } },
    f_a:  { sg: { end: '-os',  word: 'merginos'  }, pl: { end: '-ų',   word: 'merginų'    } },
    f_e:  { sg: { end: '-ės',  word: 'studentės' }, pl: { end: '-ių',  word: 'studentių'  } },
  },
  naudininkas: {
    m_as: { sg: { end: '-ui',  word: 'studentui' }, pl: { end: '-ams',  word: 'studentams' } },
    m_is: { sg: { end: '-iui', word: 'lietuviui' }, pl: { end: '-iams', word: 'lietuviams' } },
    m_us: { sg: { end: '-ui',  word: 'sūnui'     }, pl: { end: '-ums',  word: 'sūnums'    } },
    f_a:  { sg: { end: '-ai',  word: 'merginai'  }, pl: { end: '-oms',  word: 'merginoms'  } },
    f_e:  { sg: { end: '-ei',  word: 'studentei' }, pl: { end: '-ėms',  word: 'studentėms' } },
  },
  galininkas: {
    m_as: { sg: { end: '-ą',  word: 'studentą'   }, pl: { end: '-us',  word: 'studentus'  } },
    m_is: { sg: { end: '-į',  word: 'lietuvį'    }, pl: { end: '-ius', word: 'lietuvius'  } },
    m_us: { sg: { end: '-ų',  word: 'sūnų'       }, pl: { end: '-us',  word: 'sūnus'      } },
    f_a:  { sg: { end: '-ą',  word: 'merginą'    }, pl: { end: '-as',  word: 'merginas'   } },
    f_e:  { sg: { end: '-ę',  word: 'studentę'   }, pl: { end: '-es',  word: 'studentes'  } },
  },
  inagininkas: {
    m_as: { sg: { end: '-u',   word: 'studentu'  }, pl: { end: '-ais',  word: 'studentais'  } },
    m_is: { sg: { end: '-iu',  word: 'lietuviu'  }, pl: { end: '-iais', word: 'lietuviais'  } },
    m_us: { sg: { end: '-umi', word: 'sūnumi'    }, pl: { end: '-umis', word: 'sūnumis'     } },
    f_a:  { sg: { end: '-a',   word: 'mergina'   }, pl: { end: '-omis', word: 'merginomis'  } },
    f_e:  { sg: { end: '-e',   word: 'studente'  }, pl: { end: '-ėmis', word: 'studentėmis' } },
  },
  vietininkas: {
    m_as: { sg: { end: '-e',   word: 'studente'   }, pl: { end: '-uose',  word: 'studentuose'  } },
    m_is: { sg: { end: '-yje', word: 'lietuvyje'  }, pl: { end: '-iuose', word: 'lietuviuose'  } },
    m_us: { sg: { end: '-uje', word: 'sūnuje'     }, pl: { end: '-uose',  word: 'sūnuose'      } },
    f_a:  { sg: { end: '-oje', word: 'merginoje'  }, pl: { end: '-ose',   word: 'merginose'    } },
    f_e:  { sg: { end: '-ėje', word: 'studentėje' }, pl: { end: '-ėse',   word: 'studentėse'   } },
  },
  sauksmininkas: {
    m_as: { sg: { end: '-e',  word: 'studente'  }, pl: { end: '-ai',  word: 'studentai'  } },
    m_is: { sg: { end: '-ie', word: 'lietuvie'  }, pl: { end: '-iai', word: 'lietuviai'  } },
    m_us: { sg: { end: '-au', word: 'sūnau'     }, pl: { end: '-ūs',  word: 'sūnūs'     } },
    f_a:  { sg: { end: '-a',  word: 'mergina'   }, pl: { end: '-os',  word: 'merginos'   } },
    f_e:  { sg: { end: '-e',  word: 'studente'  }, pl: { end: '-ės',  word: 'studentės'  } },
  },
}

const QUICK_REF = [
  { question: 'Kas? (Who/What — subject)', case: 'Vardininkas', example: 'Draugas ateina.' },
  { question: 'Kieno? Ko? (Whose? Of what?)', case: 'Kilmininkas', example: 'Draugo knyga.' },
  { question: 'Kam? (To whom? For whom?)', case: 'Naudininkas', example: 'Daviau draugui.' },
  { question: 'Ką? (What? Whom? — object)', case: 'Galininkas', example: 'Matau draugą.' },
  { question: 'Kuo? (With what? By what?)', case: 'Įnagininkas', example: 'Einu su draugu.' },
  { question: 'Kur? (Where? — location)', case: 'Vietininkas', example: 'Vilniuje.' },
  { question: 'Kreipinys (Direct address)', case: 'Šauksmininkas', example: 'Labas, drauge!' },
]

// ── Pronoun declension table ────────────────────────────────────────────────

const PRONOUN_ROWS = [
  { pron: 'aš',       en: 'I / me'          },
  { pron: 'tu',       en: 'you (sg)'         },
  { pron: 'jis',      en: 'he / him'         },
  { pron: 'ji',       en: 'she / her'        },
  { pron: 'mes',      en: 'we / us'          },
  { pron: 'jūs',      en: 'you (pl/formal)'  },
  { pron: 'jie',      en: 'they (m)'         },
  { pron: 'jos',      en: 'they (f)'         },
]

const PRONOUN_FORMS: Record<string, { forms: string[]; reflexive: string; note: string }> = {
  vardininkas: {
    forms: ['aš', 'tu', 'jis', 'ji', 'mes', 'jūs', 'jie', 'jos'],
    reflexive: '—',
    note: 'Nominative is the subject form — who is doing the action.',
  },
  kilmininkas: {
    forms: ['manęs', 'tavęs', 'jo', 'jos', 'mūsų', 'jūsų', 'jų', 'jų'],
    reflexive: 'savęs',
    note: '"Jo/jos" are short forms. Full forms "manęs/tavęs" are used after prepositions: "be manęs" (without me), "apie tavęs" → "apie tave" (acc preferred). After negation: "Manęs nėra namuose" (I am not at home).',
  },
  naudininkas: {
    forms: ['man', 'tau', 'jam', 'jai', 'mums', 'jums', 'jiems', 'joms'],
    reflexive: 'sau',
    note: '"Man patinka" = I like (lit. "to me it pleases"). Dative is key with: patikti, reikėti, atrodyti, tikti, pavykti, sekti(s).',
  },
  galininkas: {
    forms: ['mane', 'tave', 'jį', 'ją', 'mus', 'jus', 'juos', 'jas'],
    reflexive: 'save',
    note: 'Accusative pronouns are the direct object. "Jį/ją" have a distinct form with the nasal tail (ą/į). "Aš myliu tave" (I love you).',
  },
  inagininkas: {
    forms: ['manimi', 'tavimi', 'juo', 'ja', 'mumis', 'jumis', 'jais', 'jomis'],
    reflexive: 'savimi',
    note: 'Used with reflexive -tis verbs: domėtis, rūpintis, džiaugtis, didžiuotis, žavėtis. E.g. "Domisi juo" (She is interested in him).',
  },
  vietininkas: {
    forms: ['manyje', 'tavyje', 'jame', 'joje', 'mumyse', 'jumyse', 'juose', 'jose'],
    reflexive: 'savyje',
    note: 'Locative pronouns are often figurative: "manyje" = within me/inside me. "Jis suranda stiprybę savyje" (He finds strength within himself).',
  },
  sauksmininkas: {
    forms: ['—', '—', '—', '—', '—', '—', '—', '—'],
    reflexive: '—',
    note: 'Personal pronouns have no Vocative form. Vocative is only used for nouns and names: "Labas, Tomai!" not "Labas, jis!".',
  },
}

export default function Grammar() {
  const [activeCase, setActiveCase] = useState('vardininkas')
  const [activeTab, setActiveTab] = useState<'usage' | 'endings' | 'prepositions' | 'pronouns'>('usage')

  const current = CASES.find(c => c.id === activeCase)!
  const pronounData = PRONOUN_FORMS[current.id]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">🇱🇹 Lietuvių kalbos linksniai</h1>
          <p className="text-slate-500 text-base">Lithuanian Noun Cases — complete reference guide with endings, usage and examples</p>
        </div>

        {/* Case selector tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CASES.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveCase(c.id); setActiveTab('usage') }}
              className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                activeCase === c.id
                  ? `${c.bgColor} ${c.borderColor} ${c.color}`
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="text-xs opacity-60 mr-1">{c.number}.</span>
              {c.ltName}
              <span className="ml-1 text-xs font-normal opacity-70">({c.enName})</span>
            </button>
          ))}
        </div>

        {/* Case detail card */}
        <div className={`rounded-2xl border-2 ${current.borderColor} ${current.bgColor} p-6 mb-6`}>
          {/* Case header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className={`text-2xl font-bold ${current.color}`}>{current.ltName}</h2>
              <p className="text-slate-500 text-sm font-medium">{current.enName} Case · Klausimas: <span className="font-bold text-slate-700">{QUICK_REF[CASES.indexOf(current)].question}</span></p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${current.bgColor} ${current.color} border ${current.borderColor}`}>
              {current.number}. linksnis
            </div>
          </div>

          {/* Tip box */}
          <div className="bg-white/70 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-sm text-slate-700">
            💡 <span className="font-semibold">Patarimas:</span> {current.tip}
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['usage', 'endings', 'prepositions', 'pronouns'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? `bg-white shadow ${current.color} border ${current.borderColor}`
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'usage' ? '📖 Vartojimas' : tab === 'endings' ? '🔤 Galūnės' : tab === 'prepositions' ? '🔗 Prielinksniai' : '👤 Įvardžiai'}
              </button>
            ))}
          </div>

          {/* Tab: Usage */}
          {activeTab === 'usage' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Kada vartoti</h3>
                <ul className="space-y-2">
                  {current.usage.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full ${current.bgColor} ${current.color} border ${current.borderColor} flex items-center justify-center text-xs font-bold mt-0.5`}>{i + 1}</span>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Pavyzdžiai</h3>
                <div className="space-y-2">
                  {current.examples.map((ex, i) => (
                    <div key={i} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{ex.lt}</p>
                      <p className="text-xs text-slate-500 italic">{ex.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Endings — textbook-style comparison grid */}
          {activeTab === 'endings' && (() => {
            const nomForms = CASE_FORMS['vardininkas']
            const thisForms = CASE_FORMS[current.id] ?? nomForms
            const isNom = current.id === 'vardininkas'
            return (
              <div>
                {/* Instruction banner */}
                <div className="bg-white/80 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-sm text-slate-700">
                  💡 <strong>Kaip keičiasi galūnė:</strong> Paimkite{' '}
                  <span className="font-bold text-blue-700">Vardininko</span> galūnę, nuimkite ją ir pridėkite{' '}
                  <span className={`font-bold ${current.color}`}>{current.ltName}</span> galūnę.
                </div>

                {/* Comparison grid */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm border-collapse">
                    {/* Column headers */}
                    <thead>
                      <tr>
                        <th className="px-3 py-2.5 bg-slate-100 border border-slate-200 text-left text-xs font-semibold text-slate-500 min-w-[110px]">
                          Linksnis
                        </th>
                        {DECL_CLASSES.map(dc => (
                          <th key={dc.key} colSpan={2} className={`px-2 py-2.5 border border-slate-200 text-center ${dc.gender === 'm' ? 'bg-blue-50' : 'bg-pink-50'}`}>
                            <div className={`text-base font-bold ${dc.gender === 'm' ? 'text-blue-600' : 'text-pink-600'}`}>
                              {dc.gender === 'm' ? '♂' : '♀'} <span className="font-mono">{dc.label}</span>
                            </div>
                            <div className="text-xs font-normal text-slate-500 italic">{dc.nomWord}</div>
                          </th>
                        ))}
                      </tr>
                      <tr>
                        <th className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-400"></th>
                        {DECL_CLASSES.map(dc => (
                          <React.Fragment key={dc.key}>
                            <th className="px-2 py-1 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-400 text-center">sg.</th>
                            <th className="px-2 py-1 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-400 text-center">pl.</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Vardininkas row — always shown as the BASE */}
                      <tr className="bg-blue-50/60">
                        <td className="px-3 py-2.5 border border-slate-200">
                          <div className="font-bold text-blue-700 text-xs">Vardininkas</div>
                          <div className="text-xs text-slate-400">Kas? (base)</div>
                        </td>
                        {DECL_CLASSES.map(dc => {
                          const f = nomForms[dc.key]
                          return (
                            <React.Fragment key={dc.key}>
                              <td className="px-2 py-2.5 border border-slate-200 text-center">
                                <div className="font-bold text-blue-600 font-mono text-sm">{f.sg.end}</div>
                                <div className="text-xs text-slate-500 italic mt-0.5">{f.sg.word}</div>
                              </td>
                              <td className="px-2 py-2.5 border border-slate-200 text-center">
                                <div className="font-bold text-blue-500 font-mono text-sm">{f.pl.end}</div>
                                <div className="text-xs text-slate-500 italic mt-0.5">{f.pl.word}</div>
                              </td>
                            </React.Fragment>
                          )
                        })}
                      </tr>

                      {/* Current case row(s) — highlighted */}
                      {!isNom && (
                        <tr className={`${current.bgColor}`}>
                          <td className="px-3 py-2.5 border border-slate-200">
                            <div className={`font-bold ${current.color} text-xs`}>{current.ltName}</div>
                            <div className="text-xs text-slate-400">{QUICK_REF[CASES.indexOf(current)].question.split('(')[0].trim()}</div>
                          </td>
                          {DECL_CLASSES.map(dc => {
                            const f = thisForms[dc.key]
                            return (
                              <React.Fragment key={dc.key}>
                                <td className={`px-2 py-2.5 border ${current.borderColor} text-center`}>
                                  <div className={`font-bold font-mono text-sm ${current.color}`}>{f.sg.end}</div>
                                  <div className="text-xs text-slate-600 font-semibold mt-0.5">{f.sg.word}</div>
                                </td>
                                <td className={`px-2 py-2.5 border ${current.borderColor} text-center`}>
                                  <div className={`font-bold font-mono text-sm ${current.color}`}>{f.pl.end}</div>
                                  <div className="text-xs text-slate-600 font-semibold mt-0.5">{f.pl.word}</div>
                                </td>
                              </React.Fragment>
                            )
                          })}
                        </tr>
                      )}

                      {/* If Vardininkas is active, show ALL other cases for full reference */}
                      {isNom && Object.entries(CASE_FORMS).filter(([id]) => id !== 'vardininkas').map(([caseId, forms]) => {
                        const caseData = CASES.find(c => c.id === caseId)!
                        return (
                          <tr key={caseId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2.5 border border-slate-200">
                              <div className={`font-bold text-xs ${caseData.color}`}>{caseData.ltName}</div>
                              <div className="text-xs text-slate-400">{QUICK_REF[CASES.indexOf(caseData)].question.split('(')[0].trim()}</div>
                            </td>
                            {DECL_CLASSES.map(dc => {
                              const f = forms[dc.key]
                              return (
                                <React.Fragment key={dc.key}>
                                  <td className="px-2 py-2 border border-slate-200 text-center">
                                    <div className={`font-bold font-mono text-xs ${caseData.color}`}>{f.sg.end}</div>
                                    <div className="text-xs text-slate-500 italic">{f.sg.word}</div>
                                  </td>
                                  <td className="px-2 py-2 border border-slate-200 text-center">
                                    <div className={`font-bold font-mono text-xs ${caseData.color}`}>{f.pl.end}</div>
                                    <div className="text-xs text-slate-500 italic">{f.pl.word}</div>
                                  </td>
                                </React.Fragment>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                  <span>♂ = Vyriška (Masculine)</span>
                  <span>♀ = Moteriška (Feminine)</span>
                  <span>sg. = vienaskaita (singular)</span>
                  <span>pl. = daugiskaita (plural)</span>
                </div>
              </div>
            )
          })()}

          {/* Tab: Prepositions */}
          {activeTab === 'prepositions' && (
            <div>
              {current.prepositions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-4xl mb-2">🔗</p>
                  <p className="font-semibold">Nėra bendrų prielinksnių</p>
                  <p className="text-sm">{current.ltName} is typically used without a preposition.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.prepositions.map((p, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${current.bgColor} ${current.color} border ${current.borderColor}`}>{p.word}</span>
                        <span className="text-xs text-slate-500">= {p.meaning}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{p.example}</p>
                      <p className="text-xs text-slate-400 italic">{p.exampleEn}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Pronouns */}
          {activeTab === 'pronouns' && (
            <div>
              <div className="bg-white/70 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-sm text-slate-700">
                💡 {pronounData.note}
              </div>

              {/* Pronoun table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-3 py-2.5 text-left font-semibold text-slate-500 border border-slate-200 text-xs">Pronoun (Nom.)</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-slate-500 border border-slate-200 text-xs">English</th>
                      <th className={`px-3 py-2.5 text-left font-bold ${current.color} border border-slate-200 text-xs`}>{current.ltName} form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRONOUN_ROWS.map((row, i) => (
                      <tr key={row.pron} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-3 py-2 border border-slate-200 font-bold text-slate-700">{row.pron}</td>
                        <td className="px-3 py-2 border border-slate-200 text-slate-500 text-xs italic">{row.en}</td>
                        <td className={`px-3 py-2 border border-slate-200 font-bold font-mono ${
                          pronounData.forms[i] === '—' ? 'text-slate-400' : current.color
                        }`}>{pronounData.forms[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reflexive pronoun */}
              <div className={`rounded-xl border ${current.borderColor} ${current.bgColor} p-4`}>
                <div className="flex items-start gap-3 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Reflexive pronoun</span>
                  <span className={`px-3 py-1 rounded-full font-mono font-bold text-sm ${current.bgColor} ${current.color} border ${current.borderColor}`}>
                    {pronounData.reflexive}
                  </span>
                  {pronounData.reflexive !== '—' && (
                    <p className="text-xs text-slate-600 italic w-full mt-1">
                      Used when the subject and object refer to the same person — e.g. "Jis rūpinasi <strong>savimi</strong>" (He takes care of <em>himself</em>).
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verb Patterns link */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-slate-800 text-base">🔤 Veiksmažodžių valdomi linksniai</p>
            <p className="text-sm text-slate-500 mt-0.5">Which case does each verb require? — Accusative, Dative, Genitive, Instrumental & more</p>
          </div>
          <Link to="/verbs" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0">
            Open Verb Patterns →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-700 mb-1">🔄 Linksnių palyginimas su Vardininku</h2>
          <p className="text-sm text-slate-500 mb-4">
            How the same noun changes across all 7 cases — Vardininkas (Nominative) is the base form used in dictionaries.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600 border border-slate-200">#</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600 border border-slate-200">Linksnis</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-slate-600 border border-slate-200">Klausimas</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-blue-700 border border-slate-200">brolis <span className="font-normal text-xs text-slate-400">(m. sg)</span></th>
                  <th className="text-left px-3 py-2.5 font-semibold text-blue-500 border border-slate-200">broliai <span className="font-normal text-xs text-slate-400">(m. pl)</span></th>
                  <th className="text-left px-3 py-2.5 font-semibold text-pink-700 border border-slate-200">mama <span className="font-normal text-xs text-slate-400">(f. sg)</span></th>
                  <th className="text-left px-3 py-2.5 font-semibold text-pink-500 border border-slate-200">mamos <span className="font-normal text-xs text-slate-400">(f. pl)</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { case: 'Vardininkas', num: 1, q: 'Kas?', mSg: 'brolis', mPl: 'broliai', fSg: 'mama', fPl: 'mamos', highlight: true, color: 'bg-blue-50' },
                  { case: 'Kilmininkas', num: 2, q: 'Ko? Kieno?', mSg: 'brolio', mPl: 'brolių', fSg: 'mamos', fPl: 'mamų', highlight: false, color: 'bg-green-50' },
                  { case: 'Naudininkas', num: 3, q: 'Kam?', mSg: 'broliui', mPl: 'broliams', fSg: 'mamai', fPl: 'mamoms', highlight: false, color: 'bg-yellow-50' },
                  { case: 'Galininkas', num: 4, q: 'Ką?', mSg: 'brolį', mPl: 'brolius', fSg: 'mamą', fPl: 'mamas', highlight: false, color: 'bg-orange-50' },
                  { case: 'Įnagininkas', num: 5, q: 'Kuo?', mSg: 'broliu', mPl: 'broliais', fSg: 'mama', fPl: 'mamomis', highlight: false, color: 'bg-purple-50' },
                  { case: 'Vietininkas', num: 6, q: 'Kur?', mSg: 'brolyje', mPl: 'broliuose', fSg: 'mamoje', fPl: 'mamose', highlight: false, color: 'bg-rose-50' },
                  { case: 'Šauksmininkas', num: 7, q: 'Kreipinys!', mSg: 'brolie!', mPl: 'broliai!', fSg: 'mama!', fPl: 'mamos!', highlight: false, color: 'bg-indigo-50' },
                ].map(row => (
                  <tr
                    key={row.case}
                    onClick={() => { setActiveCase(row.case.toLowerCase()); setActiveTab('usage'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`border-b border-slate-100 cursor-pointer hover:opacity-90 transition-opacity ${row.color}`}
                  >
                    <td className="px-3 py-2.5 font-bold text-slate-500 border border-slate-200">{row.num}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-700 border border-slate-200">
                      {row.case}
                      {row.highlight && <span className="ml-2 text-xs font-normal text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">žodyno forma</span>}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs border border-slate-200">{row.q}</td>
                    <td className={`px-3 py-2.5 border border-slate-200 font-mono font-semibold ${row.highlight ? 'text-blue-700 text-base' : 'text-slate-800'}`}>{row.mSg}</td>
                    <td className={`px-3 py-2.5 border border-slate-200 font-mono ${row.highlight ? 'text-blue-600 text-base' : 'text-slate-600'}`}>{row.mPl}</td>
                    <td className={`px-3 py-2.5 border border-slate-200 font-mono font-semibold ${row.highlight ? 'text-pink-700 text-base' : 'text-slate-800'}`}>{row.fSg}</td>
                    <td className={`px-3 py-2.5 border border-slate-200 font-mono ${row.highlight ? 'text-pink-600 text-base' : 'text-slate-600'}`}>{row.fPl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">💡 Click any row to jump to that case's full detail. Notice how Šauksmininkas (vocative) plural is the same as Vardininkas plural.</p>

          {/* More noun examples */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'draugas (m.) — friend',
                rows: [
                  ['Vardininkas', 'draugas', 'draugai'],
                  ['Kilmininkas', 'draugo', 'draugų'],
                  ['Naudininkas', 'draugui', 'draugams'],
                  ['Galininkas', 'draugą', 'draugus'],
                  ['Įnagininkas', 'draugu', 'draugais'],
                  ['Vietininkas', 'drauguje', 'drauguose'],
                  ['Šauksmininkas', 'drauge!', 'draugai!'],
                ],
              },
              {
                title: 'sesė (f.) — sister',
                rows: [
                  ['Vardininkas', 'sesė', 'sesės'],
                  ['Kilmininkas', 'sesės', 'seserų'],
                  ['Naudininkas', 'sesei', 'sesėms'],
                  ['Galininkas', 'sesę', 'seses'],
                  ['Įnagininkas', 'sese', 'sesėmis'],
                  ['Vietininkas', 'sesėje', 'sesėse'],
                  ['Šauksmininkas', 'sese!', 'sesės!'],
                ],
              },
            ].map(noun => (
              <div key={noun.title} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 uppercase tracking-wide">{noun.title}</div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="text-left px-3 py-1.5 font-semibold text-slate-500">Linksnis</th>
                      <th className="text-left px-3 py-1.5 font-semibold text-slate-500">Vienaskaita</th>
                      <th className="text-left px-3 py-1.5 font-semibold text-slate-500">Daugiskaita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noun.rows.map(([caseName, sg, pl], i) => (
                      <tr key={caseName} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="px-3 py-1.5 text-slate-500">{caseName}</td>
                        <td className="px-3 py-1.5 font-mono font-semibold text-slate-800">{sg}</td>
                        <td className="px-3 py-1.5 font-mono text-slate-600">{pl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4">📋 Greita nuoroda — Visi linksniai</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">#</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">Linksnis</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">English</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">Klausimas</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-600">Pavyzdys</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c, i) => (
                  <tr
                    key={c.id}
                    onClick={() => { setActiveCase(c.id); setActiveTab('usage'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`border-b border-slate-100 cursor-pointer transition-colors hover:${c.bgColor} ${activeCase === c.id ? c.bgColor : ''}`}
                  >
                    <td className={`px-4 py-2 font-bold ${c.color}`}>{i + 1}</td>
                    <td className={`px-4 py-2 font-semibold ${c.color}`}>{c.ltName}</td>
                    <td className="px-4 py-2 text-slate-500">{c.enName}</td>
                    <td className="px-4 py-2 text-slate-600 text-xs">{QUICK_REF[i].question}</td>
                    <td className="px-4 py-2 text-slate-700 italic text-xs">{QUICK_REF[i].example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Master Preposition Lookup Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-700 mb-1">🔗 Visi prielinksniai ir jų linksniai</h2>
          <p className="text-sm text-slate-500 mb-4">All prepositions with the case(s) they govern — click a row to jump to that case</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 w-24">Prielinksnis</th>
                  <th className="text-left px-3 py-2 font-semibold text-slate-600 w-32">Linksnis</th>
                  <th className="text-left px-3 py-2 font-semibold text-slate-600">Reikšmė (Meaning)</th>
                  <th className="text-left px-3 py-2 font-semibold text-slate-600">Pavyzdys</th>
                </tr>
              </thead>
              <tbody>
                {[
                  // Genitive
                  { prep:'ant', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'on / on top of (location)', example:'Knyga ant stalo.' },
                  { prep:'be', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'without', example:'Kava be cukraus.' },
                  { prep:'dėl', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'because of / due to', example:'Dėl ligos neatėjau.' },
                  { prep:'dėka', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'thanks to', example:'Dėka draugo išlaikiau.' },
                  { prep:'iki', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'until / up to / as far as', example:'Dirbu iki vakaro.' },
                  { prep:'iš', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'from / out of', example:'Esu iš Vilniaus.' },
                  { prep:'ligi', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'until / up to (archaic)', example:'Laukiau ligi ryto.' },
                  { prep:'link', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'towards / in the direction of', example:'Einu link namų.' },
                  { prep:'netoli', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'not far from / near', example:'Gyvenu netoli centro.' },
                  { prep:'nuo', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'from / since / off', example:'Nuo ryto iki vakaro.' },
                  { prep:'pas', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:"at / to someone's place", example:'Einu pas draugą.' },
                  { prep:'po (laikas)', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'after (time)', example:'Po darbo eisiu namo.' },
                  { prep:'prie', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'near / at / next to', example:'Stoviu prie namų.' },
                  { prep:'priešais', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'opposite / across from', example:'Priešais mokyklos yra parkas.' },
                  { prep:'šalia', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'beside / alongside', example:'Šalia manęs sėdi draugas.' },
                  { prep:'tarp', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'between / among', example:'Tarp stalo ir kėdės.' },
                  { prep:'ties', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'right at / at the level of', example:'Sustokite ties raudonuoju namu.' },
                  { prep:'už (vieta)', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'behind / beyond (location)', example:'Namas yra už miško.' },
                  { prep:'virš', caseId:'kilmininkas', caseLabel:'Kilmininkas', caseColor:'text-purple-700', caseBg:'bg-purple-50', meaning:'above / over', example:'Lėktuvas virš miesto.' },
                  // Accusative
                  { prep:'apie', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'about / concerning', example:'Kalbame apie darbą.' },
                  { prep:'aplink', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'around (motion)', example:'Bėgame aplink ežerą.' },
                  { prep:'į', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'into / to (direction, motion)', example:'Einu į mokyklą.' },
                  { prep:'per (vieta)', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'through / across', example:'Einame per mišką.' },
                  { prep:'per (laikas)', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'for (time duration)', example:'Išmokau per metus.' },
                  { prep:'po (judėjimas)', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'under (motion downward)', example:'Pakišk ranką po stalą.' },
                  { prep:'prieš (laikas)', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'before / ago (time)', example:'Atvykau prieš savaitę.' },
                  { prep:'pro', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'past / through / by (passing)', example:'Važiuojame pro Kauną.' },
                  { prep:'už (mainai)', caseId:'galininkas', caseLabel:'Galininkas', caseColor:'text-orange-700', caseBg:'bg-orange-50', meaning:'for (exchange / price)', example:'Mokėjau 10 € už bilietą.' },
                  // Instrumental
                  { prep:'po (statika)', caseId:'inagininkas', caseLabel:'Įnagininkas', caseColor:'text-teal-700', caseBg:'bg-teal-50', meaning:'under / below (static)', example:'Katė miega po stalu.' },
                  { prep:'prieš (statika)', caseId:'inagininkas', caseLabel:'Įnagininkas', caseColor:'text-teal-700', caseBg:'bg-teal-50', meaning:'in front of (static position)', example:'Stoviu prieš namu.' },
                  { prep:'su', caseId:'inagininkas', caseLabel:'Įnagininkas', caseColor:'text-teal-700', caseBg:'bg-teal-50', meaning:'with / together with', example:'Einu su draugu.' },
                  { prep:'už (statika)', caseId:'inagininkas', caseLabel:'Įnagininkas', caseColor:'text-teal-700', caseBg:'bg-teal-50', meaning:'behind (static position)', example:'Jis sėdi už manęs.' },
                  { prep:'virš (statika)', caseId:'inagininkas', caseLabel:'Įnagininkas', caseColor:'text-teal-700', caseBg:'bg-teal-50', meaning:'above / over (static)', example:'Paveikslas kabo virš lango.' },
                ].map((row, i) => (
                  <tr key={i} onClick={() => { setActiveCase(row.caseId); setActiveTab('prepositions'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-bold text-slate-800 font-mono">{row.prep}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.caseBg} ${row.caseColor}`}>{row.caseLabel}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-xs">{row.meaning}</td>
                    <td className="px-3 py-2 text-slate-700 italic text-xs">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">💡 Note: <strong>po</strong>, <strong>prieš</strong>, <strong>už</strong>, and <strong>virš</strong> can take different cases depending on whether they express static location (Įnagininkas) or motion/time (Kilmininkas/Galininkas).</p>
        </div>
      </div>
    </Layout>
  )
}
