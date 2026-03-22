import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

interface VerbEntry {
  lt: string
  en: string
  governs: string
  exampleLt: string
  exampleEn: string
  note?: string
}

interface SampleQuestion {
  lt: string
  en: string
}

interface VerbCategory {
  caseId: string
  caseLt: string
  caseEn: string
  governs: string
  color: string
  bgColor: string
  borderColor: string
  badgeColor: string
  description: string
  verbs: VerbEntry[]
}

const VERB_CATEGORIES: VerbCategory[] = [
  {
    caseId: 'vardininkas',
    caseLt: 'Vardininkas',
    caseEn: 'Nominative',
    governs: 'kas?',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    badgeColor: 'bg-blue-600',
    description:
      'Nominative is the **subject case** — it identifies WHO or WHAT performs the action. It is the dictionary form of every noun. Every sentence\'s subject is in nominative. Ask "kas?" (who?) or "kas tai?" (what is this?). It is also used for names, titles, and after the verb "yra" (is/are) when identifying.',
    verbs: [],
  },
  {
    caseId: 'galininkas',
    caseLt: 'Galininkas',
    caseEn: 'Accusative',
    governs: 'ką?',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    badgeColor: 'bg-orange-600',
    description:
      'Accusative marks the **direct object** of a transitive verb — the thing or person directly receiving the action. Most "doing" verbs in Lithuanian take the accusative. Ask yourself: What is being [verb]ed? If the answer is a person or thing, use accusative. After negation, the direct object often shifts to genitive.',
    verbs: [
      { lt: 'matyti / pamatyti', en: 'to see / to catch sight of', governs: 'ką?', exampleLt: 'Matau draugą.', exampleEn: 'I see my friend.', note: 'Most common with animate objects too' },
      { lt: 'skaityti / perskaityti', en: 'to read / to finish reading', governs: 'ką?', exampleLt: 'Skaitau knygą.', exampleEn: 'I am reading a book.' },
      { lt: 'rašyti / parašyti', en: 'to write (something)', governs: 'ką?', exampleLt: 'Rašau laišką.', exampleEn: 'I am writing a letter.', note: 'Note: "rašyti kam?" (dative) means to write TO someone' },
      { lt: 'pirkti / nupirkti', en: 'to buy', governs: 'ką?', exampleLt: 'Perku bilietą.', exampleEn: 'I am buying a ticket.' },
      { lt: 'valgyti / suvalgyti', en: 'to eat / to eat up', governs: 'ką?', exampleLt: 'Valgau obuolį.', exampleEn: 'I am eating an apple.' },
      { lt: 'gerti / išgerti', en: 'to drink', governs: 'ką?', exampleLt: 'Geriu kavą.', exampleEn: 'I am drinking coffee.' },
      { lt: 'turėti', en: 'to have', governs: 'ką?', exampleLt: 'Turiu namą.', exampleEn: 'I have a house.' },
      { lt: 'mylėti', en: 'to love', governs: 'ką?', exampleLt: 'Myliu tave.', exampleEn: 'I love you.' },
      { lt: 'žinoti', en: 'to know (a fact/thing)', governs: 'ką?', exampleLt: 'Žinau atsakymą.', exampleEn: 'I know the answer.', note: 'Use "pažinti" for knowing a person' },
      { lt: 'mėgti', en: 'to like / to prefer', governs: 'ką?', exampleLt: 'Mėgstu sportą.', exampleEn: 'I like sport.', note: 'Different from "patikti" (dative)!' },
      { lt: 'nešti / nunešti', en: 'to carry / to bring', governs: 'ką?', exampleLt: 'Nešu lagaminą.', exampleEn: 'I am carrying a suitcase.' },
      { lt: 'imti / paimti', en: 'to take', governs: 'ką?', exampleLt: 'Imu obuolį.', exampleEn: 'I take an apple.' },
      { lt: 'daryti / padaryti', en: 'to do / to make', governs: 'ką?', exampleLt: 'Darau namų darbus.', exampleEn: 'I am doing homework.' },
      { lt: 'statyti / pastatyti', en: 'to build / to park', governs: 'ką?', exampleLt: 'Stato namą. / Stato mašiną.', exampleEn: 'They are building a house. / They are parking a car.' },
      { lt: 'pamiršti / užmiršti', en: 'to forget', governs: 'ką?', exampleLt: 'Pamiršau raktus.', exampleEn: 'I forgot my keys.' },
      { lt: 'prisiminti', en: 'to remember', governs: 'ką?', exampleLt: 'Prisimenu tave.', exampleEn: 'I remember you.' },
      { lt: 'stebėti', en: 'to watch / to observe', governs: 'ką?', exampleLt: 'Stebi vaiką.', exampleEn: 'She watches the child.' },
      { lt: 'pažinti / atpažinti', en: 'to know (a person) / to recognise', governs: 'ką?', exampleLt: 'Pažįstu šį žmogų.', exampleEn: 'I know this person.' },
      { lt: 'sutikti', en: 'to meet', governs: 'ką?', exampleLt: 'Sutikau draugą.', exampleEn: 'I met a friend.' },
      { lt: 'kviesti / pakviesti', en: 'to invite', governs: 'ką?', exampleLt: 'Kviečia jus.', exampleEn: 'He invites you.' },
      { lt: 'siųsti / išsiųsti', en: 'to send', governs: 'ką?', exampleLt: 'Siunčiu laišką.', exampleEn: 'I am sending a letter.' },
      { lt: 'spręsti / išspręsti', en: 'to solve / to decide', governs: 'ką?', exampleLt: 'Sprendžia problemą.', exampleEn: 'She solves the problem.' },
      { lt: 'laikyti', en: 'to hold / to keep', governs: 'ką?', exampleLt: 'Laiko dokumentą.', exampleEn: 'He holds the document.', note: '"Laikyti kuo?" (instrumental) means "to consider as"' },
      { lt: 'kelti / pakelti', en: 'to lift / to raise', governs: 'ką?', exampleLt: 'Kelia ranką.', exampleEn: 'She raises her hand.' },
      { lt: 'mokyti', en: 'to teach (someone)', governs: 'ką?', exampleLt: 'Moko vaikus.', exampleEn: 'She teaches the children.', note: '"Mokytis ko?" (genitive, reflexive) = to learn something' },
      { lt: 'rodyti / parodyti', en: 'to show', governs: 'ką?', exampleLt: 'Rodo kelią.', exampleEn: 'He shows the way.' },
      { lt: 'sakyti / pasakyti', en: 'to say / to tell (something)', governs: 'ką?', exampleLt: 'Sako tiesą.', exampleEn: 'She tells the truth.', note: '"Pasakyti kam?" (dative) = to tell TO someone' },
      { lt: 'kalbėti', en: 'to speak (a language)', governs: 'ką?', exampleLt: 'Kalba lietuvių kalbą.', exampleEn: 'She speaks Lithuanian.' },
      { lt: 'mesti / numesti', en: 'to throw / to drop', governs: 'ką?', exampleLt: 'Meta kamuolį.', exampleEn: 'He throws the ball.' },
      { lt: 'žaisti', en: 'to play', governs: 'ką?', exampleLt: 'Žaidžia futbolą.', exampleEn: 'They play football.' },
      { lt: 'palaikyti', en: 'to support', governs: 'ką?', exampleLt: 'Palaiko draugą.', exampleEn: 'She supports her friend.' },
      { lt: 'leisti / išleisti', en: 'to allow / to publish', governs: 'ką?', exampleLt: 'Leidžia knygą.', exampleEn: 'They publish a book.' },
    ],
  },
  {
    caseId: 'naudininkas',
    caseLt: 'Naudininkas',
    caseEn: 'Dative',
    governs: 'kam?',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    badgeColor: 'bg-yellow-600',
    description:
      'Dative marks the **indirect object** — the person TO whom or FOR whom something is done. It also appears with impersonal expressions like "man patinka" (I like), "man reikia" (I need), "man atrodo" (it seems to me), and "man sekasi" (I am doing well). Think of dative as the "beneficiary" or "experiencer" of the action.',
    verbs: [
      { lt: 'skambinti', en: 'to call / to phone', governs: 'kam?', exampleLt: 'Skambinu tėvui.', exampleEn: 'I am calling my father.', note: 'One of the most common — always use dative for "calling someone"' },
      { lt: 'padėti', en: 'to help', governs: 'kam?', exampleLt: 'Padeda draugui.', exampleEn: 'He helps his friend.' },
      { lt: 'duoti / atiduoti', en: 'to give / to give back', governs: 'kam?', exampleLt: 'Duoda knygą draugui.', exampleEn: 'He gives the book to his friend.', note: 'Takes both dative (to whom) and accusative (what)' },
      { lt: 'pasakyti / sakyti', en: 'to say / to tell TO someone', governs: 'kam?', exampleLt: 'Pasakė man tiesą.', exampleEn: 'He told me the truth.' },
      { lt: 'atsakyti', en: 'to answer / reply to', governs: 'kam?', exampleLt: 'Atsako mokytojui.', exampleEn: 'She answers the teacher.' },
      { lt: 'rašyti', en: 'to write TO someone', governs: 'kam?', exampleLt: 'Rašo draugui laišką.', exampleEn: 'She writes a letter to her friend.', note: '"Rašyti ką?" (accusative) = to write something' },
      { lt: 'patikti', en: 'to please / (I) like', governs: 'kam?', exampleLt: 'Man patinka muzika.', exampleEn: 'I like music. (lit: music pleases me)', note: 'Very common — use dative for the person who likes' },
      { lt: 'tikti', en: 'to suit / to fit', governs: 'kam?', exampleLt: 'Tau tinka ši suknelė.', exampleEn: 'This dress suits you.' },
      { lt: 'atrodyti', en: 'to seem / to appear', governs: 'kam?', exampleLt: 'Jam atrodo gerai.', exampleEn: 'It seems good to him.' },
      { lt: 'priklausyti', en: 'to belong to', governs: 'kam?', exampleLt: 'Ši knyga priklauso man.', exampleEn: 'This book belongs to me.' },
      { lt: 'drausti', en: 'to forbid', governs: 'kam?', exampleLt: 'Draudžia vaikui.', exampleEn: 'He forbids the child.' },
      { lt: 'leisti', en: 'to allow / to let', governs: 'kam?', exampleLt: 'Leidžia jam išeiti.', exampleEn: 'He allows him to leave.', note: '"Leisti ką?" (acc) = to publish' },
      { lt: 'kenkti', en: 'to harm', governs: 'kam?', exampleLt: 'Rūkymas kenkia sveikatai.', exampleEn: 'Smoking harms health.' },
      { lt: 'dėkoti / padėkoti', en: 'to thank', governs: 'kam?', exampleLt: 'Dėkoja mokytojui.', exampleEn: 'She thanks the teacher.' },
      { lt: 'priminti', en: 'to remind', governs: 'kam?', exampleLt: 'Primena man.', exampleEn: 'He reminds me.', note: '"Priminti ką?" = to remind what' },
      { lt: 'skirti', en: 'to dedicate / to assign', governs: 'kam?', exampleLt: 'Skyrė man laiko.', exampleEn: 'She dedicated time to me.' },
      { lt: 'trukdyti', en: 'to disturb / to bother', governs: 'kam?', exampleLt: 'Trukdo man.', exampleEn: 'He disturbs me.' },
      { lt: 'pavykti', en: 'to succeed / to manage', governs: 'kam?', exampleLt: 'Man pavyko.', exampleEn: 'I succeeded. (lit: it worked out for me)', note: 'Impersonal — always with dative person' },
      { lt: 'sektis', en: 'to go well for', governs: 'kam?', exampleLt: 'Man gerai sekasi.', exampleEn: 'I am doing well.', note: 'Impersonal — dative person + reflexive' },
      { lt: 'reikėti', en: 'to need (person)', governs: 'kam?', exampleLt: 'Man reikia pagalbos.', exampleEn: 'I need help.', note: 'Person is dative; the needed thing is genitive!' },
      { lt: 'šypsotis', en: 'to smile at', governs: 'kam?', exampleLt: 'Šypsosi man.', exampleEn: 'She smiles at me.' },
    ],
  },
  {
    caseId: 'kilmininkas',
    caseLt: 'Kilmininkas',
    caseEn: 'Genitive',
    governs: 'ko?',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    badgeColor: 'bg-purple-600',
    description:
      'Genitive follows verbs expressing **desire, fear, waiting, avoiding, searching, or lacking**. The question is "ko?" (of what? / of whom?). Genitive also replaces accusative after **negation** — if the sentence is negative, the direct object usually shifts from accusative to genitive.',
    verbs: [
      { lt: 'norėti / panorėti', en: 'to want / to feel like', governs: 'ko?', exampleLt: 'Noriu kavos.', exampleEn: 'I want coffee.' },
      { lt: 'prašyti / paprašyti', en: 'to ask for / to request', governs: 'ko?', exampleLt: 'Prašo pagalbos.', exampleEn: 'She asks for help.', note: 'Different from "klausti" (to ask a question)' },
      { lt: 'bijoti', en: 'to be afraid of', governs: 'ko?', exampleLt: 'Bijau šuns.', exampleEn: 'I am afraid of a dog.' },
      { lt: 'laukti / palaukti', en: 'to wait for', governs: 'ko?', exampleLt: 'Laukiu draugo.', exampleEn: 'I am waiting for my friend.' },
      { lt: 'tikėtis', en: 'to hope for / to expect', governs: 'ko?', exampleLt: 'Tikisi sėkmės.', exampleEn: 'She hopes for success.' },
      { lt: 'siekti', en: 'to strive for / to aim for', governs: 'ko?', exampleLt: 'Siekia tikslo.', exampleEn: 'He strives for the goal.' },
      { lt: 'ieškoti', en: 'to search for', governs: 'ko?', exampleLt: 'Ieško darbo.', exampleEn: 'She is looking for work.' },
      { lt: 'vengti', en: 'to avoid', governs: 'ko?', exampleLt: 'Vengia problemų.', exampleEn: 'He avoids problems.' },
      { lt: 'klausyti / paklausyti', en: 'to listen to', governs: 'ko?', exampleLt: 'Klauso muzikos.', exampleEn: 'He listens to music.' },
      { lt: 'klausti / paklausti', en: 'to ask (about something)', governs: 'ko?', exampleLt: 'Klausia adreso.', exampleEn: 'She asks for the address.' },
      { lt: 'trūkti', en: 'to lack / to be missing', governs: 'ko?', exampleLt: 'Trūksta pinigų.', exampleEn: 'There is a lack of money.', note: 'Impersonal — subject is in genitive' },
      { lt: 'mokytis', en: 'to learn / to study', governs: 'ko?', exampleLt: 'Mokosi lietuvių kalbos.', exampleEn: 'She is learning Lithuanian.', note: 'Reflexive of "mokyti"' },
      { lt: 'reikėti (the thing needed)', en: 'to need (the thing)', governs: 'ko?', exampleLt: 'Reikia laiko.', exampleEn: 'Time is needed.', note: 'The needed thing is genitive; person needing is dative' },
      { lt: 'gauti (after negation)', en: 'to not get', governs: 'ko?', exampleLt: 'Negavo laiško.', exampleEn: 'He did not get the letter.', note: 'Negation shifts accusative → genitive' },
      { lt: 'pirkti (after negation)', en: 'to not buy', governs: 'ko?', exampleLt: 'Nepirko bilietų.', exampleEn: 'She did not buy tickets.', note: 'Negation rule in action' },
    ],
  },
  {
    caseId: 'inagininkas',
    caseLt: 'Įnagininkas',
    caseEn: 'Instrumental',
    governs: 'kuo?',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    badgeColor: 'bg-indigo-600',
    description:
      'Instrumental answers "kuo?" (with what? / as what? / by what means?). It is used with **reflexive verbs ending in -tis** that express emotions, interests, and activities. It is also used to express **becoming or being something** (a profession or role). Think of it as "I am engaged WITH this" or "I am becoming THIS."',
    verbs: [
      { lt: 'tapti / pasidaryti', en: 'to become', governs: 'kuo?', exampleLt: 'Tapo gydytoju.', exampleEn: 'He became a doctor.', note: 'Used for permanent transformation' },
      { lt: 'dirbti', en: 'to work as', governs: 'kuo?', exampleLt: 'Dirba mokytoju.', exampleEn: 'She works as a teacher.', note: 'Profession in instrumental!' },
      { lt: 'vadinti / pavadinti', en: 'to call / to name (as)', governs: 'kuo?', exampleLt: 'Vadina jį draugu.', exampleEn: 'They call him a friend.' },
      { lt: 'laikyti', en: 'to consider as / to regard as', governs: 'kuo?', exampleLt: 'Laiko jį savo draugu.', exampleEn: 'She considers him her friend.', note: 'Different sense from "laikyti ką?" (to hold)' },
      { lt: 'domėtis', en: 'to be interested in', governs: 'kuo?', exampleLt: 'Domisi muzika.', exampleEn: 'She is interested in music.', note: 'Reflexive -tis verb' },
      { lt: 'naudotis', en: 'to use / to make use of', governs: 'kuo?', exampleLt: 'Naudojasi telefonu.', exampleEn: 'He uses the phone.', note: 'Reflexive -tis verb' },
      { lt: 'džiaugtis', en: 'to be happy about / to rejoice', governs: 'kuo?', exampleLt: 'Džiaugiasi sėkme.', exampleEn: 'She is happy about her success.', note: 'Reflexive -tis verb' },
      { lt: 'rūpintis', en: 'to take care of / to look after', governs: 'kuo?', exampleLt: 'Rūpinasi vaikais.', exampleEn: 'She takes care of the children.', note: 'Reflexive -tis verb' },
      { lt: 'žavėtis', en: 'to be fascinated by / to admire', governs: 'kuo?', exampleLt: 'Žavisi menu.', exampleEn: 'He admires art.', note: 'Reflexive -tis verb' },
      { lt: 'didžiuotis', en: 'to be proud of', governs: 'kuo?', exampleLt: 'Didžiuojasi vaiku.', exampleEn: 'She is proud of her child.', note: 'Reflexive -tis verb' },
      { lt: 'gėrėtis', en: 'to admire / to enjoy looking at', governs: 'kuo?', exampleLt: 'Gėrisi gamta.', exampleEn: 'He admires nature.', note: 'Reflexive -tis verb' },
      { lt: 'užsiimti', en: 'to be engaged in / to pursue', governs: 'kuo?', exampleLt: 'Užsiima sportu.', exampleEn: 'She pursues sport.', note: 'Reflexive -tis verb' },
      { lt: 'sirgti', en: 'to be sick with', governs: 'kuo?', exampleLt: 'Serga gripu.', exampleEn: 'He is sick with flu.', note: 'Non-reflexive but takes instrumental' },
      { lt: 'pasitikėti', en: 'to trust', governs: 'kuo?', exampleLt: 'Pasitiki draugu.', exampleEn: 'She trusts her friend.', note: 'Reflexive -tis verb' },
      { lt: 'krimstis', en: 'to worry / to brood about', governs: 'kuo?', exampleLt: 'Krimtasi nesėkme.', exampleEn: 'He broods over his failure.', note: 'Reflexive -tis verb' },
    ],
  },
  {
    caseId: 'vietininkas',
    caseLt: 'Vietininkas',
    caseEn: 'Locative',
    governs: 'kur?',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    badgeColor: 'bg-rose-600',
    description:
      'Locative answers "kur?" (where?) and expresses **location within or at a place**. It is formed directly from nouns without a preposition (unlike English "in", "at", "on"). The most common use is with city names and locations: "Vilniuje" (in Vilnius), "mokykloje" (at school), "namuose" (at home). Some verbs inherently imply location.',
    verbs: [
      { lt: 'gyventi', en: 'to live (somewhere)', governs: 'kur?', exampleLt: 'Gyvenu Vilniuje.', exampleEn: 'I live in Vilnius.' },
      { lt: 'dirbti', en: 'to work (somewhere)', governs: 'kur?', exampleLt: 'Dirba biure.', exampleEn: 'He works in an office.' },
      { lt: 'mokytis / studijuoti', en: 'to study (somewhere)', governs: 'kur?', exampleLt: 'Mokosi mokykloje.', exampleEn: 'She studies at school.' },
      { lt: 'būti', en: 'to be (somewhere)', governs: 'kur?', exampleLt: 'Esu namuose.', exampleEn: 'I am at home.' },
      { lt: 'lankytis', en: 'to visit (a place)', governs: 'kur?', exampleLt: 'Lankosi muziejuje.', exampleEn: 'She visits the museum.' },
      { lt: 'apsistoti', en: 'to stay (somewhere)', governs: 'kur?', exampleLt: 'Apsistojo viešbutyje.', exampleEn: 'He stayed at a hotel.' },
      { lt: 'susitikti', en: 'to meet (somewhere)', governs: 'kur?', exampleLt: 'Susitinka kavinėje.', exampleEn: 'They meet at a café.' },
      { lt: 'vykti / važiuoti', en: 'to go/travel (being at a place)', governs: 'kur?', exampleLt: 'Yra oro uoste.', exampleEn: 'He is at the airport.' },
    ],
  },
]

const QUICK_TABLE = [
  { question: 'kas?', caseEn: 'Nominative', caseLt: 'Vardininkas', example: 'subject of a sentence', color: 'text-blue-700', bg: 'bg-blue-100' },
  { question: 'ką?', caseEn: 'Accusative', caseLt: 'Galininkas', example: 'direct object', color: 'text-orange-700', bg: 'bg-orange-100' },
  { question: 'kam?', caseEn: 'Dative', caseLt: 'Naudininkas', example: 'indirect object / beneficiary', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  { question: 'ko?', caseEn: 'Genitive', caseLt: 'Kilmininkas', example: 'desire / fear / negation', color: 'text-purple-700', bg: 'bg-purple-100' },
  { question: 'kuo?', caseEn: 'Instrumental', caseLt: 'Įnagininkas', example: 'means / profession / -tis verbs', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  { question: 'kur?', caseEn: 'Locative', caseLt: 'Vietininkas', example: 'location / place', color: 'text-rose-700', bg: 'bg-rose-100' },
]

const SAMPLE_QUESTIONS: Record<string, SampleQuestion[]> = {
  vardininkas: [
    { lt: 'Kas tai yra?', en: 'What is this/that?' },
    { lt: 'Kas čia gyvena?', en: 'Who lives here?' },
    { lt: 'Kas jis yra?', en: 'Who is he?' },
    { lt: 'Kas yra jūsų vardas?', en: 'What is your name?' },
    { lt: 'Kas nutiko?', en: 'What happened?' },
    { lt: 'Kas ateina šiandien?', en: 'Who is coming today?' },
    { lt: 'Kas yra Lietuvos sostinė?', en: 'What is the capital of Lithuania?' },
    { lt: 'Kas kalba lietuviškai?', en: 'Who speaks Lithuanian?' },
    { lt: 'Kas yra jūsų mėgstamiausias dalykas?', en: 'What is your favourite thing?' },
    { lt: 'Kas ten yra?', en: 'Who/what is there?' },
    { lt: 'Kas dirba šioje parduotuvėje?', en: 'Who works in this shop?' },
    { lt: 'Kas tave moko?', en: 'Who teaches you?' },
  ],
  galininkas: [
    { lt: 'Ką jūs matote?', en: 'What do you see?' },
    { lt: 'Ką perkat?', en: 'What are you buying?' },
    { lt: 'Ką valgote šiandien?', en: 'What are you eating today?' },
    { lt: 'Ką skaitote?', en: 'What are you reading?' },
    { lt: 'Ką darote laisvalaikiu?', en: 'What do you do in your free time?' },
    { lt: 'Ką geriate rytą?', en: 'What do you drink in the morning?' },
    { lt: 'Ką rašote?', en: 'What are you writing?' },
    { lt: 'Ką žaidžiate?', en: 'What do you play?' },
    { lt: 'Ką kviečiate į vakarėlį?', en: 'Who are you inviting to the party?' },
    { lt: 'Ką mylite labiausiai?', en: 'What/whom do you love most?' },
    { lt: 'Ką matėte vakar vakare?', en: 'What did you see last night?' },
    { lt: 'Ką norite nupirkti?', en: 'What do you want to buy?' },
  ],
  naudininkas: [
    { lt: 'Kam skambinate?', en: 'Who are you calling?' },
    { lt: 'Kam padedote?', en: 'Who are you helping?' },
    { lt: 'Kam rašote laišką?', en: 'Who are you writing a letter to?' },
    { lt: 'Kam patinka ši muzika?', en: 'Who likes this music?' },
    { lt: 'Kam reikia pagalbos?', en: 'Who needs help?' },
    { lt: 'Kam atsakote?', en: 'Who are you answering?' },
    { lt: 'Kam priklauso šis namas?', en: 'Who does this house belong to?' },
    { lt: 'Kam dėkojate?', en: 'Who are you thanking?' },
    { lt: 'Kam pavyko išlaikyti egzaminą?', en: 'Who managed to pass the exam?' },
    { lt: 'Kam sekasi gerai?', en: 'Who is doing well?' },
    { lt: 'Kam pasakysite šią naujieną?', en: 'Who will you tell this news to?' },
    { lt: 'Kam trukdote?', en: 'Who are you disturbing?' },
  ],
  kilmininkas: [
    { lt: 'Ko norite gerti?', en: 'What do you want to drink?' },
    { lt: 'Ko bijote?', en: 'What are you afraid of?' },
    { lt: 'Ko laukiate?', en: 'What/whom are you waiting for?' },
    { lt: 'Ko ieškote?', en: 'What are you looking for?' },
    { lt: 'Ko jums reikia?', en: 'What do you need?' },
    { lt: 'Kieno tai yra?', en: 'Whose is this?' },
    { lt: 'Ko jums trūksta?', en: 'What do you lack?' },
    { lt: 'Ko vengiate?', en: 'What do you avoid?' },
    { lt: 'Ko prašote?', en: 'What are you asking for?' },
    { lt: 'Ko mokotės?', en: 'What are you learning?' },
    { lt: 'Ko klausote dažniausiai?', en: 'What do you listen to most often?' },
    { lt: 'Ko tikitės iš šio kurso?', en: 'What do you expect from this course?' },
  ],
  inagininkas: [
    { lt: 'Kuo domitės?', en: 'What are you interested in?' },
    { lt: 'Kuo dirbate?', en: 'What do you work as?' },
    { lt: 'Kuo džiaugiatės šiandien?', en: 'What are you happy about today?' },
    { lt: 'Kuo naudojatės kasdien?', en: 'What do you use every day?' },
    { lt: 'Kuo rūpinatės?', en: 'Who/what do you take care of?' },
    { lt: 'Kuo žavitės?', en: 'What do you admire?' },
    { lt: 'Kuo didžiuojatės?', en: 'What are you proud of?' },
    { lt: 'Kuo norite tapti?', en: 'What do you want to become?' },
    { lt: 'Kuo sergate?', en: 'What are you sick with?' },
    { lt: 'Kuo užsiimate laisvalaikiu?', en: 'What do you do in your free time (hobby)?' },
    { lt: 'Kuo pasitikite labiausiai?', en: 'Who do you trust most?' },
    { lt: 'Kuo gėritės gamtoje?', en: 'What do you admire in nature?' },
  ],
  vietininkas: [
    { lt: 'Kur gyvenate?', en: 'Where do you live?' },
    { lt: 'Kur dirbate?', en: 'Where do you work?' },
    { lt: 'Kur mokotės?', en: 'Where do you study?' },
    { lt: 'Kur esate dabar?', en: 'Where are you now?' },
    { lt: 'Kur apsistojote?', en: 'Where are you staying?' },
    { lt: 'Kur susitinkate su draugais?', en: 'Where do you meet your friends?' },
    { lt: 'Kur praleidžiate vasarą?', en: 'Where do you spend the summer?' },
    { lt: 'Kur yra artimiausias autobusų stotelė?', en: 'Where is the nearest bus stop?' },
    { lt: 'Kur gimėte?', en: 'Where were you born?' },
    { lt: 'Kur norėtumėte gyventi?', en: 'Where would you like to live?' },
    { lt: 'Kur lankotės savaitgaliais?', en: 'Where do you go at weekends?' },
    { lt: 'Kur stovėjo jūsų mašina?', en: 'Where was your car parked?' },
  ],
}

function renderDescription(desc: string) {
  const parts = desc.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function VerbPatterns() {
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()

  const filtered: VerbCategory[] = VERB_CATEGORIES.map((cat) => ({
    ...cat,
    verbs: query
      ? cat.verbs.filter(
          (v) =>
            v.lt.toLowerCase().includes(query) ||
            v.en.toLowerCase().includes(query) ||
            v.exampleLt.toLowerCase().includes(query) ||
            v.exampleEn.toLowerCase().includes(query)
        )
      : cat.verbs,
  })).filter((cat) => !query || cat.verbs.length > 0)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/grammar"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          <span>←</span>
          <span>Grįžti į gramatiką</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🔤 Veiksmažodžių valdomi linksniai
          </h1>
          <p className="text-slate-500 text-base">
            Which case does each verb require? — Complete verb-case reference with English descriptions
          </p>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-3">📘 How Lithuanian verb governance works</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            In Lithuanian, every verb <strong>governs</strong> a specific grammatical case for its object. Unlike
            English (where word order determines meaning), Lithuanian uses case endings on nouns to show their role in the
            sentence. When you learn a verb, you must also learn <em>which case it requires</em>. Ask the diagnostic
            question: <strong>ką?</strong> (what? whom?), <strong>kam?</strong> (to/for whom?),{' '}
            <strong>ko?</strong> (of/from what?), <strong>kuo?</strong> (with/as what?), or <strong>kur?</strong>{' '}
            (where?).
          </p>

          {/* Negation rule */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-5">
            <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Negation rule: Accusative → Genitive</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              When a transitive verb is <strong>negated</strong>, the direct object usually shifts from{' '}
              <strong>accusative</strong> to <strong>genitive</strong>:
            </p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white rounded-lg px-3 py-2 border border-amber-200">
                <span className="text-xs text-slate-400 block">Affirmative (accusative)</span>
                <span className="font-mono text-sm text-orange-700">Turiu knygą.</span>
                <span className="text-xs text-slate-500 ml-2">I have a book.</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-amber-200">
                <span className="text-xs text-slate-400 block">Negative (genitive)</span>
                <span className="font-mono text-sm text-purple-700">Neturiu knygos.</span>
                <span className="text-xs text-slate-500 ml-2">I don't have a book.</span>
              </div>
            </div>
          </div>

          {/* Quick lookup table */}
          <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Quick lookup: Verb → Which case?</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Question</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Case (EN)</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Linksnis (LT)</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Typical use</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_TABLE.map((row) => (
                  <tr key={row.question} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 border border-slate-200">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white ${row.bg.replace('bg-', 'bg-').replace('-100', '-600')}`}>
                        {row.question}
                      </span>
                    </td>
                    <td className={`px-3 py-2 border border-slate-200 font-semibold ${row.color}`}>{row.caseEn}</td>
                    <td className="px-3 py-2 border border-slate-200 text-slate-700 font-mono">{row.caseLt}</td>
                    <td className="px-3 py-2 border border-slate-200 text-slate-500">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search verbs in Lithuanian or English…"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition"
          />
          {query && (
            <p className="mt-1.5 text-xs text-slate-400">
              {filtered.reduce((sum, c) => sum + c.verbs.length, 0)} result(s) across{' '}
              {filtered.length} case section(s)
            </p>
          )}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-400 text-sm">No verbs matched "<span className="text-slate-600">{search}</span>".</p>
          </div>
        )}

        {/* Category sections */}
        <div className="space-y-8">
          {filtered.map((cat, catIdx) => (
            <section
              key={cat.caseId}
              className={`rounded-2xl border-2 ${cat.borderColor} overflow-hidden shadow-sm`}
            >
              {/* Section header */}
              <div className={`${cat.bgColor} px-6 py-4 border-b ${cat.borderColor}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {catIdx + 1}.
                  </span>
                  <h2 className={`text-xl font-bold ${cat.color}`}>
                    {cat.caseLt}
                    <span className="text-slate-400 font-normal"> ({cat.caseEn})</span>
                  </h2>
                  <span
                    className={`${cat.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}
                  >
                    {cat.governs}
                  </span>
                  <span className="text-xs text-slate-500 font-mono ml-auto hidden sm:inline">
                    {cat.verbs.length} verb{cat.verbs.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 bg-white border-b border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {renderDescription(cat.description)}
                </p>
              </div>

              {/* Verb grid */}
              {cat.verbs.length > 0 && (
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.verbs.map((verb) => (
                    <div
                      key={verb.lt}
                      className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                    >
                      {/* Lithuanian verb */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className={`font-bold text-sm leading-snug ${cat.color} font-mono`}>
                          {verb.lt}
                        </p>
                        <span
                          className={`shrink-0 ${cat.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}
                        >
                          {verb.governs}
                        </span>
                      </div>

                      {/* English meaning */}
                      <p className="text-xs text-slate-600 mb-3">{verb.en}</p>

                      {/* Example */}
                      <div className="rounded-lg bg-slate-50 px-3 py-2 mb-2">
                        <p className={`text-xs italic font-mono ${cat.color} font-medium`}>
                          {verb.exampleLt}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{verb.exampleEn}</p>
                      </div>

                      {/* Note */}
                      {verb.note && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5">
                          <p className="text-[11px] text-amber-700 leading-snug">
                            💡 {verb.note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Sample Questions */}
              {!query && (SAMPLE_QUESTIONS[cat.caseId] || []).length > 0 && (
                <div className={`px-6 pb-6 bg-white border-t border-slate-100`}>
                  <h3 className={`text-sm font-bold ${cat.color} mt-5 mb-3 flex items-center gap-2`}>
                    <span>💬</span>
                    <span>Sample Questions — {cat.caseLt} ({cat.governs})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(SAMPLE_QUESTIONS[cat.caseId] || []).map((q, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border ${cat.borderColor} bg-white px-3 py-2.5 flex flex-col gap-0.5`}
                      >
                        <span className={`text-sm font-semibold font-mono ${cat.color}`}>{q.lt}</span>
                        <span className="text-xs text-slate-400">{q.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-slate-400">
          Verb governance reference for Lithuanian learners · Cases: Vardininkas · Galininkas · Naudininkas · Kilmininkas · Įnagininkas · Vietininkas
        </p>
      </div>
    </Layout>
  )
}
