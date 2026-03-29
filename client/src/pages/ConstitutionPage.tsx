import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Article {
  number: number
  en: string
  lt?: string
}

interface Chapter {
  id: string
  titleEn: string
  titleLt: string
  articles: Article[]
  color: string
  badge: string
}

// ─── Constitution data ────────────────────────────────────────────────────────

const PREAMBLE = {
  en: `The Lithuanian Nation — having created the Lithuanian State many centuries ago, having preserved its spirit, native language, writing and customs, having embodied the right to self-determination of the Lithuanian Nation in the Act of Independence of Lithuania of February 16, 1918, and in the Reconstitution of the Independent State of Lithuania of March 11, 1990 — having enacted this Constitution.`,
  lt: `Lietuvių Tauta — prieš daugelį amžių sukūrusi Lietuvos valstybę, turėjusi jos teisines tradicijas, išsaugojusi savo dvasią, gimtąją kalbą, raštą ir papročius, įkūnydama prigimtinę žmogaus ir Tautos teisę laisvai gyventi ir kurti savo tėvų ir protėvių žemėje — nepriklausomoje Lietuvos valstybėje, puoselėjant tautinę santarvę Lietuvos žemėje, siekiant atviros, teisingos, darnios pilietinės visuomenės ir teisinės valstybės, atgimusios Lietuvos valstybės valią išreiškusi 1918 m. vasario 16 d. Nepriklausomybės aktu ir 1990 m. kovo 11 d. Nepriklausomybės Aktu — priima ir skelbia šią Konstituciją.`,
}

const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    titleEn: 'Chapter I: The State of Lithuania',
    titleLt: 'I skyrius: Lietuvos valstybė',
    color: 'border-violet-400',
    badge: 'bg-violet-600',
    articles: [
      { number: 1, en: 'The State of Lithuania shall be an independent democratic republic.', lt: 'Lietuvos valstybė yra nepriklausoma demokratinė respublika.' },
      { number: 2, en: 'The State of Lithuania shall be created by the Nation. Sovereignty shall belong to the Nation.', lt: 'Lietuvos valstybę kuria Tauta. Suverenumas priklauso Tautai.' },
      { number: 3, en: 'No one may restrict or limit the sovereignty of the Nation or make claims to the sovereign powers belonging to the entire Nation. The Nation and each citizen shall have the right to resist anyone who encroaches on the independence, territorial integrity, and constitutional order of the State of Lithuania by force.' },
      { number: 4, en: 'The Nation shall execute its supreme sovereign power either directly or through its democratically elected representatives.' },
      { number: 5, en: 'In Lithuania, State power shall be executed by the Seimas, the President of the Republic and the Government, and the Judiciary. The scope of power shall be limited by the Constitution. State institutions shall serve the people.', lt: 'Valstybės valdžią Lietuvoje vykdo Seimas, Respublikos Prezidentas ir Vyriausybė, Teismas.' },
      { number: 6, en: 'The Constitution shall be an integral and directly applicable act. Everyone may defend his rights by invoking the Constitution.' },
      { number: 7, en: 'Any law or other act, which is contrary to the Constitution, shall be invalid. Only laws which are published shall be valid. Ignorance of the law shall not exempt one from liability.' },
      { number: 8, en: 'Seizure of State power or of its institution by force shall be considered anti-constitutional actions, which are unlawful and invalid.' },
      { number: 9, en: 'The most significant issues concerning the life of the State and the Nation shall be decided by referendum. A referendum shall also be announced if not less than 300,000 citizens with the electoral right so request.' },
      { number: 10, en: 'The territory of the State of Lithuania shall be integral and shall not be divided into any State-like formations. The State boundaries may be altered only by an international treaty after it has been ratified by 4/5 of all Members of the Seimas.' },
      { number: 11, en: 'The administrative units of the territory of the State of Lithuania and their boundaries shall be established by law.' },
      { number: 12, en: 'Citizenship of the Republic of Lithuania shall be acquired by birth and other grounds established by law. With the exception of individual cases provided for by law, no one may be a citizen of both the Republic of Lithuania and another state at the same time.' },
      { number: 13, en: 'The State of Lithuania shall protect its citizens abroad. It shall be prohibited to extradite a citizen of the Republic of Lithuania to another state unless an international treaty establishes otherwise.' },
      { number: 14, en: 'Lithuanian shall be the State language.', lt: 'Valstybinė kalba – lietuvių kalba.' },
      { number: 15, en: 'The colours of the State flag shall be yellow, green, and red. The Coat-of-Arms of the State shall be a white Vytis on a red field.', lt: 'Valstybinės vėliavos spalvos – geltona, žalia ir raudona.' },
      { number: 16, en: 'The anthem of the State shall be "Tautiška giesmė" by Vincas Kudirka.' },
      { number: 17, en: 'The capital of the State of Lithuania shall be the city of Vilnius, the long-standing historical capital of Lithuania.', lt: 'Lietuvos Respublikos sostinė – Vilnius.' },
    ],
  },
  {
    id: 'ch2',
    titleEn: 'Chapter II: The Human Being and the State',
    titleLt: 'II skyrius: Žmogus ir valstybė',
    color: 'border-blue-400',
    badge: 'bg-blue-600',
    articles: [
      { number: 18, en: 'Human rights and freedoms shall be innate.', lt: 'Žmogaus teisės ir laisvės yra prigimtinės.' },
      { number: 19, en: 'The right to life of a human being shall be protected by law.' },
      { number: 20, en: 'The freedom of a human being shall be inviolable. No one may be arbitrarily detained or held arrested. A person detained in flagrante delicto must, within 48 hours, be brought before a court.' },
      { number: 21, en: 'The person of the human being shall be inviolable. The dignity of the human being shall be protected by law. It shall be prohibited to torture, injure a human being, degrade his dignity. No human being may be subjected to scientific or medical experimentation without his knowledge and free consent.' },
      { number: 22, en: 'The private life of a human being shall be inviolable. Information concerning the private life of a person may be collected only upon a justified court decision.' },
      { number: 23, en: 'Property shall be inviolable. The rights of ownership shall be protected by laws. Property may be taken over only for the needs of society according to the procedure established by law and shall be justly compensated for.' },
      { number: 24, en: 'The home of a human being shall be inviolable. Without the consent of the resident, entrance into his home shall not be permitted otherwise than by a court decision or the procedure established by law.' },
      { number: 25, en: 'The human being shall have the right to have his own convictions and freely express them. Freedom to express convictions and to impart information shall be incompatible with criminal actions—incitement of national, racial, religious, or social hatred, violence and discrimination.' },
      { number: 26, en: 'Freedom of thought, conscience and religion shall not be restricted. Each human being shall have the right to freely choose any religion or belief.' },
      { number: 27, en: "A human being's convictions, practiced religion or belief may not serve as justification for a crime or for failure to execute laws." },
      { number: 28, en: 'While implementing his rights and freedoms, the human being must observe the Constitution and the laws of the Republic of Lithuania and must not restrict the rights and freedoms of other people.' },
      { number: 29, en: 'All persons shall be equal before the law, the court, and other State institutions and officials. The rights of the human being may not be restricted on the ground of gender, race, nationality, language, origin, social status, belief, convictions, or views.', lt: 'Įstatymui, teismui ir kitoms valstybės institucijoms ar pareigūnams visi asmenys lygūs.' },
      { number: 30, en: 'The person whose constitutional rights or freedoms are violated shall have the right to apply to court.' },
      { number: 31, en: 'A person shall be presumed innocent until proved guilty according to the procedure established by law and declared guilty by an effective court judgement. Punishment may be imposed only on the grounds established by law. No one may be punished for the same crime a second time.', lt: 'Asmuo laikomas nekaltu, kol jo kaltumas neįrodytas įstatymo nustatyta tvarka.' },
      { number: 32, en: 'A citizen may move and choose his place of residence in Lithuania freely and may leave Lithuania freely. A citizen may not be prohibited from returning to Lithuania.' },
      { number: 33, en: 'Citizens shall have the right to participate in the governance of their State both directly and through their democratically elected representatives.' },
      { number: 34, en: 'Citizens who, on the day of election, have reached 18 years of age, shall have the electoral right. Citizens who are recognised incapable by court shall not participate in elections.' },
      { number: 35, en: 'Citizens shall be guaranteed the right to freely form societies, political parties and associations, provided that the aims and activities thereof are not contrary to the Constitution and laws.' },
      { number: 36, en: 'Citizens may not be prohibited or hindered from assembling unarmed in peaceful meetings.' },
      { number: 37, en: 'Citizens belonging to ethnic communities shall have the right to foster their language, culture, and customs.' },
    ],
  },
  {
    id: 'ch3',
    titleEn: 'Chapter III: Society and the State',
    titleLt: 'III skyrius: Visuomenė ir valstybė',
    color: 'border-emerald-400',
    badge: 'bg-emerald-600',
    articles: [
      { number: 38, en: 'The family shall be the basis of society and the State. Marriage shall be concluded upon the free mutual consent of man and woman. In the family, the rights of spouses shall be equal.' },
      { number: 39, en: 'The State shall take care of families that raise and bring up children at home.' },
      { number: 40, en: 'State and municipal establishments of teaching and education shall be secular. Schools of higher education shall be granted autonomy.' },
      { number: 41, en: 'Education shall be compulsory for persons under the age of 16. Education at State and municipal schools shall be free of charge.' },
      { number: 42, en: 'Culture, science and research, and teaching shall be free.' },
      { number: 43, en: 'The State shall recognise the churches and religious organizations that are traditional in Lithuania. There shall not be a State religion in Lithuania.' },
      { number: 44, en: 'Censorship of mass information shall be prohibited. The State, political parties, and other institutions may not monopolise the mass media.' },
      { number: 45, en: 'Ethnic communities of citizens shall independently manage the affairs of their ethnic culture, education, charity, and mutual assistance.' },
    ],
  },
  {
    id: 'ch4',
    titleEn: 'Chapter IV: National Economy and Labour',
    titleLt: 'IV skyrius: Nacionalinis ūkis ir darbas',
    color: 'border-amber-400',
    badge: 'bg-amber-600',
    articles: [
      { number: 46, en: "Lithuania's economy shall be based on the right of private ownership, freedom of individual economic activity and initiative. The law shall prohibit monopolisation of production and the market and shall protect freedom of fair competition." },
      { number: 47, en: 'The underground, internal waters, forests, parks, roads, historical, archaeological and cultural objects of State importance shall belong by the right of exclusive ownership to the Republic of Lithuania.' },
      { number: 48, en: 'Each human being may freely choose a job or business, and shall have the right to have proper, safe and healthy conditions at work, to receive fair pay for work and social security in the event of unemployment. Forced labour shall be prohibited.' },
      { number: 49, en: 'Each working human being shall have the right to rest and leisure as well as to an annual paid leave.' },
      { number: 50, en: 'Trade unions shall be freely established and shall function independently. All trade unions shall have equal rights.' },
      { number: 51, en: 'While defending their economic and social interests, employees shall have the right to strike.' },
      { number: 52, en: 'The State shall guarantee to citizens the right to receive old age and disability pensions as well as social assistance in the event of unemployment, sickness, widowhood, loss of the breadwinner.' },
      { number: 53, en: "The State shall take care of people's health and shall guarantee medical aid and services. The State and each person must protect the environment from harmful influences." },
      { number: 54, en: 'The State shall take care of the protection of the natural environment, wildlife and plants. The destruction of land and the underground, the pollution of water and air shall be prohibited by law.' },
    ],
  },
  {
    id: 'ch5',
    titleEn: 'Chapter V: The Seimas',
    titleLt: 'V skyrius: Seimas',
    color: 'border-indigo-400',
    badge: 'bg-indigo-600',
    articles: [
      { number: 55, en: 'The Seimas shall consist of 141 Members elected for a four-year term on the basis of universal, equal, and direct suffrage by secret ballot. The Seimas shall be deemed elected when not less than 3/5 of the Members have been elected.', lt: 'Seimą sudaro Tautos atstovai – 141 Seimo narys, kurie renkami ketveriems metams.' },
      { number: 56, en: 'Any citizen of the Republic of Lithuania who, on the election day, is not younger than 25 years of age and permanently resides in Lithuania, may be elected a Member of the Seimas.' },
      { number: 57, en: 'Regular elections to the Seimas shall be held on the second Sunday of October in the year of expiration of powers.' },
      { number: 58, en: 'Pre-term elections to the Seimas may be held on the decision of the Seimas adopted by not less than 3/5 majority vote of Members.' },
      { number: 59, en: 'Powers, immunity, and cessation of Member powers are established by law.' },
      { number: 64, en: 'Every year, the Seimas shall convene for two regular sessions — spring (March 10 to June 30) and autumn (September 10 to December 23).' },
      { number: 67, en: 'The Seimas shall pass laws; adopt the State Budget; call elections for the President; approve the Prime Minister candidature; supervise the Government; approve the State Budget.' },
      { number: 68, en: 'The right of legislative initiative belongs to Members of the Seimas, the President, and the Government. 50,000 citizens with the electoral right may also submit a draft law to the Seimas.' },
      { number: 74, en: 'The President, Constitutional Court justices, Supreme Court justices, and Members of the Seimas may be removed from office by 3/5 majority vote through impeachment proceedings.' },
    ],
  },
  {
    id: 'ch6',
    titleEn: 'Chapter VI: The President of the Republic',
    titleLt: 'VI skyrius: Respublikos Prezidentas',
    color: 'border-rose-400',
    badge: 'bg-rose-600',
    articles: [
      { number: 77, en: 'The President of the Republic shall be Head of State.' },
      { number: 78, en: 'A Lithuanian citizen by origin, who has lived in Lithuania for not less than the last three years, if he has reached the age of not less than 40 prior to the election day, may be elected President. The President shall be elected for a five-year term. The same person may not be elected President for more than two consecutive terms.' },
      { number: 79, en: 'Any citizen who meets the conditions of Art 78 and has collected the signatures of not less than 20,000 voters shall be registered as a presidential candidate.' },
      { number: 80, en: 'Regular elections of the President shall be held on the last Sunday two months before the expiration of the term of office.' },
      { number: 82, en: 'The elected President takes an oath in Vilnius in the presence of the Members of the Seimas.' },
      { number: 84, en: 'Powers of the President include: conducting foreign policy; appointing PM with Seimas assent; appointing ministers; appointing judges; granting pardons; signing and promulgating laws; declaring martial law.' },
      { number: 86, en: 'The person of the President shall be inviolable while in office. The President may be removed only for gross violation of the Constitution or breach of oath.' },
      { number: 88, en: 'Powers of the President cease upon: expiration of term; resignation; death; removal by impeachment; incapacity certified by 3/5 of Seimas.' },
      { number: 89, en: 'In case of vacancy, office temporarily held by Speaker of Seimas. New election must be within 2 months.' },
    ],
  },
  {
    id: 'ch7',
    titleEn: 'Chapter VII: The Government',
    titleLt: 'VII skyrius: Vyriausybė',
    color: 'border-teal-400',
    badge: 'bg-teal-600',
    articles: [
      { number: 91, en: 'The Government shall consist of the Prime Minister and Ministers.' },
      { number: 92, en: 'The Prime Minister shall, with the assent of the Seimas, be appointed and dismissed by the President of the Republic. Ministers shall be appointed and dismissed by the President upon the submission of the Prime Minister.' },
      { number: 94, en: 'Powers of Government: administer the country; execute laws; prepare State Budget; draft legislation; establish diplomatic relations.' },
      { number: 96, en: 'The Government shall be jointly and severally responsible to the Seimas for its general activities.' },
      { number: 101, en: 'Government must resign when: Seimas twice refuses its programme; Seimas expresses no-confidence by absolute majority; PM resigns or dies; after Seimas elections.' },
    ],
  },
  {
    id: 'ch8',
    titleEn: 'Chapter VIII: The Constitutional Court',
    titleLt: 'VIII skyrius: Konstitucinis Teismas',
    color: 'border-purple-400',
    badge: 'bg-purple-600',
    articles: [
      { number: 102, en: 'The Constitutional Court shall decide whether laws and acts of the Seimas, President, and Government are in conflict with the Constitution.' },
      { number: 103, en: 'The Constitutional Court shall consist of 9 justices, each appointed for a single nine-year term. Every three years, one-third of the Court shall be reconstituted. Three justices are submitted by the President, three by the President of the Seimas, three by the President of the Supreme Court.' },
      { number: 104, en: 'Justices of the Constitutional Court shall be independent and follow only the Constitution.' },
      { number: 107, en: 'Decisions of the Constitutional Court shall be final and not subject to appeal.' },
    ],
  },
  {
    id: 'ch9',
    titleEn: 'Chapter IX: The Courts',
    titleLt: 'IX skyrius: Teismai',
    color: 'border-cyan-400',
    badge: 'bg-cyan-600',
    articles: [
      { number: 109, en: 'In the Republic of Lithuania, justice shall be administered only by courts.' },
      { number: 111, en: 'The courts shall be: the Supreme Court of Lithuania, the Court of Appeal of Lithuania, regional courts and local courts. Specialised courts (administrative, labour, family) may be established.' },
      { number: 112, en: 'Only citizens of the Republic of Lithuania may be judges. Justices of the Supreme Court are appointed by the Seimas upon submission of the President.' },
      { number: 114, en: 'Interference with a judge or court shall be prohibited.' },
      { number: 117, en: 'Court proceedings shall be conducted in the State language. Persons without command of Lithuanian are guaranteed the right to a translator.' },
    ],
  },
  {
    id: 'ch10',
    titleEn: 'Chapter X: Local Self-Government and Governance',
    titleLt: 'X skyrius: Vietos savivalda',
    color: 'border-lime-400',
    badge: 'bg-lime-600',
    articles: [
      { number: 119, en: 'The right to self-government is guaranteed to administrative units. Municipal council members are elected for a four-year term.' },
      { number: 120, en: 'The State shall support municipalities. Municipalities shall act freely and independently within their competence.' },
      { number: 121, en: 'Municipalities shall draft and approve their own budget.' },
    ],
  },
  {
    id: 'ch11',
    titleEn: 'Chapter XI: Finances and the State Budget',
    titleLt: 'XI skyrius: Finansai ir valstybės biudžetas',
    color: 'border-yellow-400',
    badge: 'bg-yellow-500',
    articles: [
      { number: 125, en: 'The Bank of Lithuania shall be the central bank belonging to the State.' },
      { number: 126, en: 'The Chairman of the Bank of Lithuania shall be appointed for a five-year term by the Seimas upon the submission of the President.' },
      { number: 127, en: 'State budget revenue shall be raised from taxes, compulsory payments, and other income.' },
      { number: 129, en: 'The budget year shall start on 1 January and end on 31 December.' },
      { number: 130, en: 'The Government shall present the draft State Budget to the Seimas not later than 75 days before the end of the budget year.' },
    ],
  },
  {
    id: 'ch12',
    titleEn: 'Chapter XII: State Control',
    titleLt: 'XII skyrius: Valstybės kontrolė',
    color: 'border-orange-400',
    badge: 'bg-orange-600',
    articles: [
      { number: 133, en: 'The State Control shall be headed by the State Controller who shall be appointed for a five-year term by the Seimas upon submission of the President.' },
      { number: 134, en: 'The State Control shall supervise the lawfulness of the possession and use of State property and the execution of the State Budget.' },
    ],
  },
  {
    id: 'ch13',
    titleEn: 'Chapter XIII: Foreign Policy and National Defence',
    titleLt: 'XIII skyrius: Užsienio politika ir nacionalinė gynyba',
    color: 'border-red-400',
    badge: 'bg-red-600',
    articles: [
      { number: 135, en: 'Lithuania shall follow universally recognised principles and norms of international law. War propaganda shall be prohibited.' },
      { number: 137, en: 'There may not be any weapons of mass destruction and foreign military bases on the territory of Lithuania.' },
      { number: 138, en: 'The Seimas shall ratify international treaties on state boundaries, political cooperation, defence, peace, and participation in international organisations.' },
      { number: 139, en: 'The defence of Lithuania shall be the right and duty of each citizen. Citizens must perform military or alternative national defence service.' },
      { number: 140, en: 'State Defence Council consists of: President, Prime Minister, Speaker of Seimas, Minister of National Defence, Commander of Armed Forces. Headed by President. The President shall be Commander-in-Chief of the Armed Forces.' },
      { number: 142, en: 'The Seimas shall impose martial law, announce mobilisation.' },
      { number: 145, en: 'After martial law or state of emergency, certain rights may be temporarily limited.' },
    ],
  },
  {
    id: 'ch14',
    titleEn: 'Chapter XIV: Alteration of the Constitution',
    titleLt: 'XIV skyrius: Konstitucijos keitimas',
    color: 'border-slate-400',
    badge: 'bg-slate-600',
    articles: [
      { number: 147, en: 'A motion to alter the Constitution may be submitted by a group of not less than 1/4 of all Members of the Seimas or not less than 300,000 voters. The Constitution may not be amended during a state of emergency or martial law.' },
      { number: 148, en: 'Article 1 ("independent democratic republic") may only be altered by referendum if not less than 3/4 of citizens with electoral right vote in favour. The provisions of Chapter I and Chapter XIV may be altered only by referendum. Other amendments must be voted at the Seimas twice with a break of not less than 3 months between votes.' },
    ],
  },
]

const KEY_FACTS = [
  { label: 'Adopted', value: 'October 25, 1992', sub: 'by referendum', icon: '📅', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  { label: 'Total Articles', value: '154', sub: 'Art. 1–154', icon: '📄', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { label: 'Total Chapters', value: '14', sub: 'I–XIV', icon: '📚', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { label: 'State Language', value: 'Lithuanian', sub: 'Art. 14', icon: '🗣️', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { label: 'Capital', value: 'Vilnius', sub: 'Art. 17', icon: '🏛️', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  { label: 'Flag', value: 'Yellow, Green, Red', sub: 'Art. 15', icon: '🇱🇹', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  { label: 'Anthem', value: '"Tautiška giesmė"', sub: 'Vincas Kudirka · Art. 16', icon: '🎵', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
  { label: 'Voting Age', value: '18 years', sub: 'Art. 34', icon: '🗳️', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
  { label: 'Seimas', value: '141 members', sub: '4-year term · Art. 55', icon: '🏛️', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { label: 'President', value: 'min 40 years old', sub: '5-year term · Art. 78', icon: '👤', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConstitutionPage() {
  const [lang, setLang] = useState<'en' | 'lt'>('en')
  const [search, setSearch] = useState('')
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({ preamble: true, ch1: true })

  const toggleChapter = (id: string) =>
    setOpenChapters(prev => ({ ...prev, [id]: !prev[id] }))

  const expandAll = () => {
    const all: Record<string, boolean> = { preamble: true }
    CHAPTERS.forEach(c => { all[c.id] = true })
    setOpenChapters(all)
  }

  const collapseAll = () => setOpenChapters({})

  const query = search.trim().toLowerCase()

  const filteredChapters = useMemo(() => {
    if (!query) return CHAPTERS
    return CHAPTERS.map(ch => ({
      ...ch,
      articles: ch.articles.filter(a =>
        String(a.number).includes(query) ||
        a.en.toLowerCase().includes(query) ||
        (a.lt ?? '').toLowerCase().includes(query)
      ),
    })).filter(ch =>
      ch.articles.length > 0 ||
      ch.titleEn.toLowerCase().includes(query) ||
      ch.titleLt.toLowerCase().includes(query)
    )
  }, [query])

  const showPreamble = !query || 'preamble'.includes(query) || PREAMBLE.en.toLowerCase().includes(query) || PREAMBLE.lt.toLowerCase().includes(query)

  const totalMatches = filteredChapters.reduce((s, c) => s + c.articles.length, 0)

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">

        {/* ── Hero banner ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-red-700 via-red-800 to-yellow-700 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-5xl mb-3">📜</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
              Lietuvos Respublikos Konstitucija
            </h1>
            <p className="text-red-100 text-sm mb-1">Priimta 1992 m. spalio 25 d.</p>
            <p className="text-yellow-200 font-semibold text-lg">
              Constitution of the Republic of Lithuania
            </p>
            <p className="text-red-200 text-sm">Adopted October 25, 1992</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

          {/* ── Key facts ────────────────────────────────────────────────── */}
          <section>
            <h2 className="text-lg font-bold text-slate-700 mb-4">
              📊 {lang === 'en' ? 'Key Facts' : 'Pagrindiniai faktai'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {KEY_FACTS.map(f => (
                <div key={f.label} className={`rounded-xl border ${f.border} ${f.bg} p-3 flex flex-col gap-1`}>
                  <div className="text-2xl">{f.icon}</div>
                  <div className={`font-bold text-sm ${f.text}`}>{f.value}</div>
                  <div className="text-xs text-slate-500 leading-tight">{f.label}</div>
                  <div className="text-xs text-slate-400">{f.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Controls ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search articles by number or text…' : 'Ieškoti straipsnių pagal numerį ar tekstą…'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
              {query && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>
              )}
            </div>

            {/* Lang toggle */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden shrink-0">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${lang === 'en' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang('lt')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${lang === 'lt' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                🇱🇹 LT
              </button>
            </div>

            {/* Expand / collapse */}
            <div className="flex gap-2 shrink-0">
              <button onClick={expandAll} className="text-xs px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                {lang === 'en' ? 'Expand all' : 'Atskleisti viską'}
              </button>
              <button onClick={collapseAll} className="text-xs px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                {lang === 'en' ? 'Collapse all' : 'Sutraukti viską'}
              </button>
            </div>
          </div>

          {/* Search result count */}
          {query && (
            <p className="text-sm text-slate-500">
              {totalMatches === 0
                ? (lang === 'en' ? 'No articles found.' : 'Straipsnių nerasta.')
                : (lang === 'en' ? `${totalMatches} article(s) found.` : `Rasta ${totalMatches} straipsnis(-ių).`)}
            </p>
          )}

          {/* ── Preamble ─────────────────────────────────────────────────── */}
          {showPreamble && (
            <ChapterBlock
              id="preamble"
              open={!!openChapters['preamble']}
              onToggle={() => toggleChapter('preamble')}
              titleEn="Preamble"
              titleLt="Preambulė"
              badge="bg-red-700"
              border="border-red-400"
              articleCount={null}
            >
              <div className="bg-white rounded-xl border border-slate-100 p-5">
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  {lang === 'lt' ? PREAMBLE.lt : PREAMBLE.en}
                </p>
              </div>
            </ChapterBlock>
          )}

          {/* ── Chapters ─────────────────────────────────────────────────── */}
          {filteredChapters.map(ch => (
            <ChapterBlock
              key={ch.id}
              id={ch.id}
              open={!!openChapters[ch.id]}
              onToggle={() => toggleChapter(ch.id)}
              titleEn={ch.titleEn}
              titleLt={ch.titleLt}
              badge={ch.badge}
              border={ch.color}
              articleCount={ch.articles.length}
            >
              <div className="space-y-3">
                {ch.articles.map(a => (
                  <ArticleRow key={a.number} article={a} lang={lang} highlight={query} />
                ))}
              </div>
            </ChapterBlock>
          ))}

          {/* ── Exam banner ──────────────────────────────────────────────── */}
          <Link
            to="/exams"
            className="block rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 transition-all shadow-md text-white p-6 text-center group"
          >
            <div className="text-3xl mb-2">🎓</div>
            <p className="font-bold text-lg">
              {lang === 'en' ? 'Prepare for the Exam →' : 'Pasirengti egzaminui →'}
            </p>
            <p className="text-teal-100 text-sm mt-1">
              {lang === 'en'
                ? 'Test your knowledge of the Lithuanian Constitution'
                : 'Patikrinkite savo žinias apie Lietuvos Konstituciją'}
            </p>
          </Link>

        </div>
      </div>
    </Layout>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ChapterBlockProps {
  id: string
  open: boolean
  onToggle: () => void
  titleEn: string
  titleLt: string
  badge: string
  border: string
  articleCount: number | null
  children: React.ReactNode
}

function ChapterBlock({ open, onToggle, titleEn, titleLt, badge, border, articleCount, children }: ChapterBlockProps) {
  return (
    <div className={`rounded-2xl border-l-4 ${border} bg-white shadow-sm overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`${badge} text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0`}>
            {articleCount !== null ? `${articleCount} art.` : 'Preamble'}
          </span>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm leading-snug">{titleEn}</p>
            <p className="text-xs text-slate-400 truncate">{titleLt}</p>
          </div>
        </div>
        <span className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

interface ArticleRowProps {
  article: Article
  lang: 'en' | 'lt'
  highlight: string
}

function ArticleRow({ article, lang, highlight }: ArticleRowProps) {
  const text = lang === 'lt'
    ? (article.lt ?? null)
    : article.en

  const noLt = lang === 'lt' && !article.lt

  return (
    <div className="flex gap-3 text-sm">
      <span className="shrink-0 font-bold text-violet-600 w-10 pt-0.5">Art. {article.number}</span>
      <span className="text-slate-700 leading-relaxed flex-1">
        {noLt
          ? <span className="italic text-slate-400">Lietuviška versija šiame straipsnyje neteikiama. / <span className="not-italic text-slate-500">{highlight ? <Highlighted text={article.en} query={highlight} /> : article.en}</span></span>
          : (text ? (highlight ? <Highlighted text={text} query={highlight} /> : text) : article.en)
        }
      </span>
    </div>
  )
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
          : part
      )}
    </>
  )
}
