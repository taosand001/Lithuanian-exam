import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

const PERSONS: [string, string][] = [
  ['aš', 'I'],
  ['tu', 'you (sg.)'],
  ['jis / ji', 'he / she'],
  ['mes', 'we'],
  ['jūs', 'you (pl.)'],
  ['jie / jos', 'they'],
]

interface VerbEntry {
  infinitive: string
  en: string
  present: [string, string, string, string, string, string]
  past: [string, string, string, string, string, string]
  note?: string
}

interface ConjGroup {
  id: string
  groupLabel: string
  endingLabel: string
  presentEnd: string
  pastEnd: string
  presentEndings: [string, string, string, string, string, string]
  pastEndings: [string, string, string, string, string, string]
  color: string
  bgColor: string
  borderColor: string
  badgeColor: string
  description: string
  tip: string
  verbs: VerbEntry[]
}

const GROUPS: ConjGroup[] = [
  {
    id: 'a-o',
    groupLabel: 'Group 1',
    endingLabel: '-a / -o',
    presentEnd: '-a',
    pastEnd: '-o',
    presentEndings: ['-u', '-i', '-a', '-ame', '-ate', '-a'],
    pastEndings: ['-au', '-ai', '-o', '-ome', '-ote', '-o'],
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    badgeColor: 'bg-blue-600',
    description:
      'The largest and most common conjugation group in Lithuanian. The 3rd person (jis/ji and jie/jos) ends in **-a** in the present tense and **-o** in the past simple. The 1st person singular adds **-u** in the present and **-au** in the past. Recognise these verbs by their clean consonant stems.',
    tip: '📝 Infinitive tip: ends in -ti after a plain consonant (e.g. dirb-ti, gyven-ti, skambin-ti). Does NOT end in -yti, -ėti, or -uoti.',
    verbs: [
      {
        infinitive: 'dirbti',
        en: 'to work',
        present: ['dirbu', 'dirbi', 'dirba', 'dirbame', 'dirbate', 'dirba'],
        past: ['dirbau', 'dirbai', 'dirbo', 'dirbome', 'dirbote', 'dirbo'],
      },
      {
        infinitive: 'gyventi',
        en: 'to live',
        present: ['gyvenu', 'gyveni', 'gyvena', 'gyvenam', 'gyvenate', 'gyvena'],
        past: ['gyvenau', 'gyvenai', 'gyveno', 'gyvenome', 'gyvenote', 'gyveno'],
      },
      {
        infinitive: 'skambinti',
        en: 'to call / to ring',
        present: ['skambinu', 'skambini', 'skambina', 'skambiname', 'skambinate', 'skambina'],
        past: ['skambinau', 'skambinai', 'skambino', 'skambinome', 'skambinote', 'skambino'],
      },
      {
        infinitive: 'bėgti',
        en: 'to run',
        present: ['bėgu', 'bėgi', 'bėga', 'bėgame', 'bėgate', 'bėga'],
        past: ['bėgau', 'bėgai', 'bėgo', 'bėgome', 'bėgote', 'bėgo'],
      },
      {
        infinitive: 'rasti',
        en: 'to find',
        present: ['randu', 'randi', 'randa', 'randame', 'randate', 'randa'],
        past: ['radau', 'radai', 'rado', 'radome', 'radote', 'rado'],
        note: 'Stem change in present: rast- → rand-',
      },
      {
        infinitive: 'miegoti',
        en: 'to sleep',
        present: ['miegu', 'miegi', 'miega', 'miegame', 'miegate', 'miega'],
        past: ['miegojau', 'miegojai', 'miegojo', 'miegojome', 'miegojote', 'miegojo'],
        note: '-oti verbs: past tense inserts -oj- (miegojo, not miego)',
      },
    ],
  },
  {
    id: 'o-e',
    groupLabel: 'Group 2',
    endingLabel: '-o / -ė',
    presentEnd: '-o',
    pastEnd: '-ė',
    presentEndings: ['-au', '-ai', '-o', '-ome', '-ote', '-o'],
    pastEndings: ['-iau', '-ei', '-ė', '-ėme', '-ėte', '-ė'],
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    badgeColor: 'bg-orange-600',
    description:
      'Verbs where the 3rd person ends in **-o** (present) and **-ė** (past). Note carefully: the 1st person singular uses **-au** in the PRESENT (not just in the past as in Group 1). Past 1st person uses **-iau**. The -y- of the infinitive disappears in all conjugated forms.',
    tip: '📝 Infinitive tip: very commonly ends in -yti (rašyti, skaityti, mokyti, valgyti). The vowel -y- drops in the conjugated stem.',
    verbs: [
      {
        infinitive: 'rašyti',
        en: 'to write',
        present: ['rašau', 'rašai', 'rašo', 'rašome', 'rašote', 'rašo'],
        past: ['rašiau', 'rašei', 'rašė', 'rašėme', 'rašėte', 'rašė'],
      },
      {
        infinitive: 'skaityti',
        en: 'to read',
        present: ['skaitau', 'skaitai', 'skaito', 'skaitome', 'skaitote', 'skaito'],
        past: ['skaičiau', 'skaitei', 'skaitė', 'skaitėme', 'skaitėte', 'skaitė'],
        note: '1sg past: skaičiau — the -t- softens to -č- before -iau',
      },
      {
        infinitive: 'valgyti',
        en: 'to eat',
        present: ['valgau', 'valgai', 'valgo', 'valgome', 'valgote', 'valgo'],
        past: ['valgiau', 'valgei', 'valgė', 'valgėme', 'valgėte', 'valgė'],
      },
      {
        infinitive: 'mokyti',
        en: 'to teach',
        present: ['mokau', 'mokai', 'moko', 'mokome', 'mokote', 'moko'],
        past: ['mokiau', 'mokei', 'mokė', 'mokėme', 'mokėte', 'mokė'],
      },
      {
        infinitive: 'žinoti',
        en: 'to know (a fact)',
        present: ['žinau', 'žinai', 'žino', 'žinome', 'žinote', 'žino'],
        past: ['žinojau', 'žinojai', 'žinojo', 'žinojome', 'žinojote', 'žinojo'],
        note: '-oti verbs: present follows Group 2 (-o), but past adds -oj- (žinojo not žinė)',
      },
      {
        infinitive: 'matyti',
        en: 'to see',
        present: ['matau', 'matai', 'mato', 'matome', 'matote', 'mato'],
        past: ['mačiau', 'matei', 'matė', 'matėme', 'matėte', 'matė'],
        note: '1sg past: mačiau — t → č softening',
      },
    ],
  },
  {
    id: 'ia-e',
    groupLabel: 'Group 3',
    endingLabel: '-ia / -ė',
    presentEnd: '-ia',
    pastEnd: '-ė',
    presentEndings: ['-iu', '-i', '-ia', '-iame', '-iate', '-ia'],
    pastEndings: ['-iau', '-ei', '-ė', '-ėme', '-ėte', '-ė'],
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    badgeColor: 'bg-purple-600',
    description:
      'Verbs where the 3rd person ends in **-ia** in the present tense and **-ė** in the past. The -i- before endings is a softening marker. First person singular uses **-iu** (present) and **-iau** (past). This group often involves consonant cluster stems (-kt, -st, -zt).',
    tip: '📝 Infinitive tip: ends in -ti after consonant clusters (-kt, -st, -zt, -nk). Examples: laukti, jausti, traukti.',
    verbs: [
      {
        infinitive: 'laukti',
        en: 'to wait',
        present: ['laukiu', 'lauki', 'laukia', 'laukiame', 'laukiate', 'laukia'],
        past: ['laukiau', 'laukei', 'laukė', 'laukėme', 'laukėte', 'laukė'],
      },
      {
        infinitive: 'jausti',
        en: 'to feel / to sense',
        present: ['jaučiu', 'jauti', 'jaučia', 'jaučiame', 'jaučiate', 'jaučia'],
        past: ['jautiau', 'jautei', 'jautė', 'jautėme', 'jautėte', 'jautė'],
        note: 'st → č in present (jaust- → jauč-). A common consonant alternation.',
      },
      {
        infinitive: 'traukti',
        en: 'to pull / to attract',
        present: ['traukiu', 'trauki', 'traukia', 'traukiame', 'traukiate', 'traukia'],
        past: ['traukiau', 'traukei', 'traukė', 'traukėme', 'traukėte', 'traukė'],
      },
      {
        infinitive: 'klausti',
        en: 'to ask',
        present: ['klausiu', 'klausi', 'klausia', 'klausiame', 'klausiate', 'klausia'],
        past: ['klausiau', 'klausei', 'klausė', 'klausėme', 'klausėte', 'klausė'],
      },
    ],
  },
  {
    id: 'i-ejo',
    groupLabel: 'Group 4',
    endingLabel: '-i / -ėjo',
    presentEnd: '-i',
    pastEnd: '-ėjo',
    presentEndings: ['-iu', '-i', '-i', '-ime', '-ite', '-i'],
    pastEndings: ['-ėjau', '-ėjai', '-ėjo', '-ėjome', '-ėjote', '-ėjo'],
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    badgeColor: 'bg-green-600',
    description:
      'Verbs where the 3rd person ends in **-i** in both singular and plural present tense. The past tense is recognisable by the **-ėj-** infix before personal endings. First person: **-iu** (present) and **-ėjau** (past). All forms in 3rd person present are identical: jis nori = ji nori = jie nori.',
    tip: '📝 Infinitive tip: ends in -ėti (norėti, mylėti, turėti, galėti). The -ė- reappears in the past tense endings.',
    verbs: [
      {
        infinitive: 'norėti',
        en: 'to want',
        present: ['noriu', 'nori', 'nori', 'norime', 'norite', 'nori'],
        past: ['norėjau', 'norėjai', 'norėjo', 'norėjome', 'norėjote', 'norėjo'],
      },
      {
        infinitive: 'mylėti',
        en: 'to love',
        present: ['myliu', 'myli', 'myli', 'mylime', 'mylite', 'myli'],
        past: ['mylėjau', 'mylėjai', 'mylėjo', 'mylėjome', 'mylėjote', 'mylėjo'],
      },
      {
        infinitive: 'turėti',
        en: 'to have',
        present: ['turiu', 'turi', 'turi', 'turime', 'turite', 'turi'],
        past: ['turėjau', 'turėjai', 'turėjo', 'turėjome', 'turėjote', 'turėjo'],
      },
      {
        infinitive: 'galėti',
        en: 'to be able to / can',
        present: ['galiu', 'gali', 'gali', 'galime', 'galite', 'gali'],
        past: ['galėjau', 'galėjai', 'galėjo', 'galėjome', 'galėjote', 'galėjo'],
      },
      {
        infinitive: 'tikėti',
        en: 'to believe',
        present: ['tikiu', 'tiki', 'tiki', 'tikime', 'tikite', 'tiki'],
        past: ['tikėjau', 'tikėjai', 'tikėjo', 'tikėjome', 'tikėjote', 'tikėjo'],
      },
    ],
  },
]

interface SpecialVerb extends VerbEntry {
  why: string
}

const SPECIAL_VERBS: SpecialVerb[] = [
  {
    infinitive: 'būti',
    en: 'to be',
    present: ['esu', 'esi', 'yra', 'esame', 'esate', 'yra'],
    past: ['buvau', 'buvai', 'buvo', 'buvome', 'buvote', 'buvo'],
    why: 'Completely irregular — two different stems (es- in present, buv- in past). The 3rd person present "yra" (is/are) is unique and does not follow any group.',
    note: '"Yra" is used for BOTH 3rd singular and 3rd plural: "jis yra" and "jie yra".',
  },
  {
    infinitive: 'eiti',
    en: 'to go (on foot)',
    present: ['einu', 'eini', 'eina', 'einame', 'einate', 'eina'],
    past: ['ėjau', 'ėjai', 'ėjo', 'ėjome', 'ėjote', 'ėjo'],
    why: 'Present follows Group 1 (-a pattern: eina). Past is irregular — the stem completely changes from ein- to ėj-.',
    note: 'Prefix compounds follow the same pattern: ateiti (to arrive) → ateina / atėjo; išeiti (to leave) → išeina / išėjo.',
  },
  {
    infinitive: 'kalbėti',
    en: 'to speak / to talk',
    present: ['kalbu', 'kalbi', 'kalba', 'kalbame', 'kalbate', 'kalba'],
    past: ['kalbėjau', 'kalbėjai', 'kalbėjo', 'kalbėjome', 'kalbėjote', 'kalbėjo'],
    why: 'Mixed pattern: present follows Group 1 (-a: kalba), but past follows Group 4 (-ėjo: kalbėjo). Several -ėti verbs with consonant stems behave this way.',
    note: 'Other verbs like this: skubėti (to hurry) → skuba / skubėjo; tikėti... wait, tikėti is regular Group 4.',
  },
  {
    infinitive: 'galvoti',
    en: 'to think',
    present: ['galvoju', 'galvoji', 'galvoja', 'galvojame', 'galvojate', 'galvoja'],
    past: ['galvojau', 'galvojai', 'galvojo', 'galvojome', 'galvojote', 'galvojo'],
    why: '-oti / -uoti verbs: the stem gets -oj- in all forms. Present 3sg ends in -oja (not -a or -o). Past 3sg ends in -ojo (not -o or -ė).',
    note: 'Same pattern: žinoti → žino (pres) / žinojo (past); dainuoti → dainuoja (pres) / dainavo (past).',
  },
]

const GROUP_SUMMARY = [
  { label: 'Group 1', present: '-a', past: '-o', example: 'dirba / dirbo', color: 'text-blue-700', bg: 'bg-blue-100' },
  { label: 'Group 2', present: '-o', past: '-ė', example: 'rašo / rašė', color: 'text-orange-700', bg: 'bg-orange-100' },
  { label: 'Group 3', present: '-ia', past: '-ė', example: 'laukia / laukė', color: 'text-purple-700', bg: 'bg-purple-100' },
  { label: 'Group 4', present: '-i', past: '-ėjo', example: 'nori / norėjo', color: 'text-green-700', bg: 'bg-green-100' },
]

function renderDesc(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  )
}

function ConjTable({
  verb,
  color,
}: {
  verb: VerbEntry
  color: string
}) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-500 border border-slate-200 w-28">Person</th>
          <th className={`px-2 py-1.5 text-left text-xs font-semibold border border-slate-200 ${color}`}>Present</th>
          <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-600 border border-slate-200">Past</th>
        </tr>
      </thead>
      <tbody>
        {PERSONS.map(([lt, en], i) => (
          <tr
            key={lt}
            className={`border-b border-slate-100 ${i === 2 ? 'bg-amber-50 font-semibold' : 'hover:bg-slate-50'}`}
          >
            <td className="px-2 py-1.5 border border-slate-200">
              <span className="font-mono text-slate-700">{lt}</span>
              <span className="text-slate-400 text-xs ml-1">({en})</span>
            </td>
            <td className={`px-2 py-1.5 border border-slate-200 font-mono ${color}`}>
              {verb.present[i]}
            </td>
            <td className="px-2 py-1.5 border border-slate-200 font-mono text-slate-700">
              {verb.past[i]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function VerbConjugation() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const query = search.trim().toLowerCase()

  const filtered = query
    ? GROUPS.map((g) => ({
        ...g,
        verbs: g.verbs.filter(
          (v) =>
            v.infinitive.toLowerCase().includes(query) ||
            v.en.toLowerCase().includes(query)
        ),
      })).filter((g) => g.verbs.length > 0)
    : GROUPS

  function toggle(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/grammar"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          ← Grįžti į gramatiką
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🔄 Veiksmažodžių asmenavimas
          </h1>
          <p className="text-slate-500 text-base">
            Verb Conjugation — Present &amp; Past Tense (all persons)
          </p>
        </div>

        {/* Intro / summary box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-3">📘 How to use this guide</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Lithuanian verbs are grouped by their <strong>3rd person singular</strong> ending (jis/ji) — this
            is the key diagnostic form. Once you identify whether the 3rd person ends in <em>-a</em>, <em>-o</em>,{' '}
            <em>-ia</em>, or <em>-i</em>, you know the entire conjugation pattern. Highlighted rows (yellow) show the
            3rd person — the most important form to learn first.
          </p>

          {/* Quick summary table */}
          <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">At a glance: 4 conjugation groups</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Group</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">3sg Present</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">3sg Past</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">1sg Present</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">1sg Past</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">Example</th>
                </tr>
              </thead>
              <tbody>
                {GROUP_SUMMARY.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className={`px-3 py-2 border border-slate-200 font-semibold ${row.color}`}>{row.label}</td>
                    <td className="px-3 py-2 border border-slate-200">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white ${row.bg.replace('-100', '-600')}`}>
                        {row.present}
                      </span>
                    </td>
                    <td className="px-3 py-2 border border-slate-200">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-slate-600 text-white">
                        {row.past}
                      </span>
                    </td>
                    <td className={`px-3 py-2 border border-slate-200 font-mono text-xs ${row.color}`}>
                      {row.label === 'Group 1' ? '-u' : row.label === 'Group 2' ? '-au' : '-iu'}
                    </td>
                    <td className="px-3 py-2 border border-slate-200 font-mono text-xs text-slate-600">
                      {row.label === 'Group 4' ? '-ėjau' : row.label === 'Group 2' ? '-iau' : '-au'}
                    </td>
                    <td className={`px-3 py-2 border border-slate-200 font-mono text-sm ${row.color}`}>{row.example}</td>
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
        </div>

        {/* Group sections */}
        <div className="space-y-10">
          {filtered.map((group) => (
            <section
              key={group.id}
              className={`rounded-2xl border-2 ${group.borderColor} overflow-hidden shadow-sm`}
            >
              {/* Header */}
              <div className={`${group.bgColor} px-6 py-4 border-b ${group.borderColor}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className={`text-xl font-bold ${group.color}`}>
                    {group.groupLabel}
                    <span className="text-slate-400 font-normal text-base ml-2">— {group.endingLabel} endings</span>
                  </h2>
                  <span className={`${group.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                    3sg present: {group.presentEnd}
                  </span>
                  <span className="bg-slate-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    3sg past: {group.pastEnd}
                  </span>
                </div>
              </div>

              {/* Description + tip */}
              <div className="px-6 py-4 bg-white border-b border-slate-100 space-y-2">
                <p className="text-sm text-slate-600 leading-relaxed">{renderDesc(group.description)}</p>
                <p className="text-sm text-slate-500 italic">{group.tip}</p>
              </div>

              <div className="p-6 bg-white space-y-6">
                {/* Endings table + primary verb side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Endings table */}
                  <div>
                    <h3 className={`text-sm font-bold ${group.color} mb-2 uppercase tracking-wide`}>
                      Ending Pattern
                    </h3>
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-500 border border-slate-200">Person</th>
                          <th className={`px-2 py-1.5 text-left text-xs font-semibold border border-slate-200 ${group.color}`}>
                            Present ending
                          </th>
                          <th className="px-2 py-1.5 text-left text-xs font-semibold text-slate-600 border border-slate-200">
                            Past ending
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {PERSONS.map(([lt, en], i) => (
                          <tr
                            key={lt}
                            className={`border-b border-slate-100 ${i === 2 ? 'bg-amber-50 font-semibold' : ''}`}
                          >
                            <td className="px-2 py-1.5 border border-slate-200">
                              <span className="font-mono text-slate-700 text-xs">{lt}</span>
                              <span className="text-slate-400 text-xs ml-1">({en})</span>
                            </td>
                            <td className={`px-2 py-1.5 border border-slate-200 font-mono font-bold ${group.color}`}>
                              {group.presentEndings[i]}
                            </td>
                            <td className="px-2 py-1.5 border border-slate-200 font-mono font-bold text-slate-700">
                              {group.pastEndings[i]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Primary verb full conjugation */}
                  {group.verbs[0] && (
                    <div>
                      <h3 className={`text-sm font-bold ${group.color} mb-2 uppercase tracking-wide`}>
                        Example: {group.verbs[0].infinitive}{' '}
                        <span className="text-slate-400 font-normal normal-case">
                          "{group.verbs[0].en}"
                        </span>
                      </h3>
                      <ConjTable verb={group.verbs[0]} color={group.color} />
                    </div>
                  )}
                </div>

                {/* Additional verbs */}
                {group.verbs.length > 1 && (
                  <div>
                    <h3 className={`text-sm font-bold ${group.color} mb-3 uppercase tracking-wide`}>
                      More verbs in this group
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.verbs.slice(1).map((verb) => {
                        const key = `${group.id}-${verb.infinitive}`
                        const isOpen = !!expanded[key]
                        return (
                          <div
                            key={verb.infinitive}
                            className={`rounded-xl border-2 ${group.borderColor} overflow-hidden`}
                          >
                            {/* Card header */}
                            <div className={`${group.bgColor} px-3 py-2.5 flex items-start justify-between gap-2`}>
                              <div>
                                <p className={`font-bold text-sm font-mono ${group.color}`}>{verb.infinitive}</p>
                                <p className="text-xs text-slate-500">{verb.en}</p>
                              </div>
                              <button
                                onClick={() => toggle(key)}
                                className={`shrink-0 text-xs px-2 py-1 rounded-lg font-semibold transition-colors ${group.badgeColor} text-white`}
                              >
                                {isOpen ? '▲ Hide' : '▼ Full'}
                              </button>
                            </div>

                            {/* Compact key forms (always visible) */}
                            <div className="px-3 py-2 bg-white text-xs grid grid-cols-2 gap-x-2 gap-y-0.5">
                              <div>
                                <span className="text-slate-400">aš (pres):</span>{' '}
                                <span className={`font-mono font-semibold ${group.color}`}>{verb.present[0]}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">aš (past):</span>{' '}
                                <span className="font-mono font-semibold text-slate-700">{verb.past[0]}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">jis/ji (pres):</span>{' '}
                                <span className={`font-mono font-semibold ${group.color}`}>{verb.present[2]}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">jis/ji (past):</span>{' '}
                                <span className="font-mono font-semibold text-slate-700">{verb.past[2]}</span>
                              </div>
                            </div>

                            {/* Note */}
                            {verb.note && (
                              <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-200">
                                <p className="text-[11px] text-amber-700">💡 {verb.note}</p>
                              </div>
                            )}

                            {/* Expanded full table */}
                            {isOpen && (
                              <div className="px-3 pb-3 bg-white border-t border-slate-100 pt-2">
                                <ConjTable verb={verb} color={group.color} />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Special / irregular verbs */}
        {!query && (
          <section className="mt-10 rounded-2xl border-2 border-amber-300 overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-300">
              <h2 className="text-xl font-bold text-amber-800">
                ⚠️ Special &amp; Irregular Verbs
              </h2>
              <p className="text-sm text-amber-700 mt-1">
                These common verbs do not follow one of the 4 standard groups — learn them individually.
              </p>
            </div>

            <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
              {SPECIAL_VERBS.map((verb) => {
                const key = `special-${verb.infinitive}`
                const isOpen = !!expanded[key]
                return (
                  <div key={verb.infinitive} className="rounded-xl border border-amber-200 overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-amber-800 font-mono text-base">{verb.infinitive}</p>
                        <p className="text-xs text-amber-600">{verb.en}</p>
                      </div>
                      <button
                        onClick={() => toggle(key)}
                        className="shrink-0 text-xs px-2 py-1 rounded-lg font-semibold bg-amber-600 text-white"
                      >
                        {isOpen ? '▲ Hide' : '▼ Full table'}
                      </button>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <p className="text-xs text-amber-800 mb-2 font-semibold">Why special:</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{verb.why}</p>

                      {/* compact key forms */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
                        <div>
                          <span className="text-slate-400">aš (pres):</span>{' '}
                          <span className="font-mono font-semibold text-amber-700">{verb.present[0]}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">aš (past):</span>{' '}
                          <span className="font-mono font-semibold text-slate-700">{verb.past[0]}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">jis/ji (pres):</span>{' '}
                          <span className="font-mono font-semibold text-amber-700">{verb.present[2]}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">jis/ji (past):</span>{' '}
                          <span className="font-mono font-semibold text-slate-700">{verb.past[2]}</span>
                        </div>
                      </div>

                      {verb.note && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 mb-2">
                          <p className="text-[11px] text-amber-700">💡 {verb.note}</p>
                        </div>
                      )}

                      {isOpen && <ConjTable verb={verb} color="text-amber-700" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-slate-400">
          Lithuanian verb conjugation reference · Group 1 (-a/-o) · Group 2 (-o/-ė) · Group 3 (-ia/-ė) · Group 4 (-i/-ėjo)
        </p>
      </div>
    </Layout>
  )
}
