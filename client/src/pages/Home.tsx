import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CheckCircle, Clock, BarChart2, BookOpen, Headphones, PenLine, Mic, Brain, Smartphone, ArrowRight, Star } from 'lucide-react'
import api from '../api/axios'
import { Exam } from '../types'
import Badge, { levelVariant } from '../components/ui/Badge'
import Layout from '../components/layout/Layout'
import { useTranslations } from '../context/LanguageContext'

const SOURCE = {
  heroTag: '🇱🇹 Oficialus egzamino formatas · NŠA stilius',
  heroH1a: 'Pasiruošk',
  heroH1b: 'lietuvių kalbos',
  heroH1c: 'egzaminui',
  heroPara: 'Platforma su daugiau nei 1000 klausimų visose sekcijose — skaitymas, klausymas, rašymas, kalbėjimas ir gramatika. A2, B1 ir Konstitucijos egzaminai.',
  heroBtn1: 'Pradėti nemokamai',
  heroBtn2: 'Peržiūrėti egzaminus',
  stat1: 'Klausimai',
  stat2: 'Egzaminų tipai',
  stat3: 'Lygiai',
  skill1: 'Skaitymas',
  skill2: 'Klausymas',
  skill3: 'Rašymas',
  skill4: 'Kalbėjimas',
  skill5: 'Gramatika',
  examH2: 'Pasirinkite egzaminą',
  examSub: 'Pradėkite su nemokamais klausimais arba prisijunkite pilnai prieigai',
  examQLabel: 'Klausimai',
  examTimeLabel: 'Laikas',
  examPassLabel: 'Išlaikymui',
  examLevelLabel: 'Lygis',
  examBtn: 'Pradėti egzaminą →',
  featH2: 'Kodėl LT Egzaminai?',
  featSub: 'Viskas ko reikia sėkmingam pasiruošimui',
  feat1T: 'Tikras egzamino formatas',
  feat1D: 'Klausimai sukurti pagal oficialų NŠA egzamino formatą',
  feat2T: 'Daugiau nei 1000 klausimų',
  feat2D: 'Skaitymas, klausymas, rašymas, kalbėjimas ir gramatika',
  feat3T: 'Progreso stebėjimas',
  feat3D: 'Matykite savo rezultatus pagal įgūdžių sritis',
  feat4T: 'Tikras laikmatis',
  feat4D: 'Pratinkitės su tikru egzamino laiko limitu',
  feat5T: 'Momentiniai rezultatai',
  feat5D: 'Gaukite grįžtamąjį ryšį iškart po egzamino',
  feat6T: 'Veikia mobiliajame',
  feat6D: 'Mokykitės bet kur ir bet kada',
  howH2: 'Kaip tai veikia?',
  step1T: 'Registruokitės',
  step1D: 'Sukurkite nemokamą paskyrą ir gaukite prieigą prie egzaminų',
  step2T: 'Pasirinkite egzaminą',
  step2D: 'Pasirinkite A2, B1 arba Konstitucijos egzaminą',
  step3T: 'Gaukite rezultatus',
  step3D: 'Matykite rezultatus pagal skiltis ir tobulinkite silpnąsias vietas',
  testH2: 'Ką sako naudotojai?',
  test1: 'Klausimai labai panašūs į tikrąjį egzaminą. Puikiai pasiruošiau per 2 savaites!',
  test2: 'Geriausia platforma lietuvių kalbai mokytis. Klausymo pratimai ypač naudingi.',
  test3: 'Suprantamas formatas, greitai gaunu rezultatus. Išlaikiau A2 iš pirmo karto!',
  ctaH2: 'Pradėk ruoštis šiandien',
  ctaPara: 'Prisijunk ir gaukite prieigą prie daugiau nei 1000 egzaminų klausimų nemokamai',
  ctaBtn: 'Registruotis nemokamai',
  levelA2: 'Reikalingas leidimui gyventi ir darbui su klientais',
  levelB1: 'Reikalingas pilietybei ir aukštesnioms pareigoms',
  levelConst: 'Konstitucijos egzaminas nuolatiniam leidimui ir pilietybei',
}

const levelColors: Record<string, string> = {
  A2: 'from-amber-400 to-amber-500',
  B1: 'from-violet-500 to-violet-600',
  CONSTITUTION: 'from-slate-600 to-slate-700',
}
const levelEn: Record<string, string> = {
  A2: 'Beginner-Intermediate', B1: 'Intermediate', CONSTITUTION: 'Constitution Exam',
}

export default function Home() {
  const [exams, setExams] = useState<Exam[]>([])
  const t = useTranslations(SOURCE)

  useEffect(() => {
    api.get('/api/exams').then(({ data }) => setExams(data.exams)).catch(() => {})
  }, [])

  const skills = [
    { icon: <BookOpen size={20} />, label: t.skill1, color: 'bg-sky-100 text-sky-700' },
    { icon: <Headphones size={20} />, label: t.skill2, color: 'bg-purple-100 text-purple-700' },
    { icon: <PenLine size={20} />, label: t.skill3, color: 'bg-emerald-100 text-emerald-700' },
    { icon: <Mic size={20} />, label: t.skill4, color: 'bg-orange-100 text-orange-700' },
    { icon: <Brain size={20} />, label: t.skill5, color: 'bg-pink-100 text-pink-700' },
  ]

  const features = [
    { icon: <CheckCircle size={22} className="text-violet-600" />, title: t.feat1T, desc: t.feat1D },
    { icon: <Brain size={22} className="text-violet-600" />, title: t.feat2T, desc: t.feat2D },
    { icon: <BarChart2 size={22} className="text-violet-600" />, title: t.feat3T, desc: t.feat3D },
    { icon: <Clock size={22} className="text-violet-600" />, title: t.feat4T, desc: t.feat4D },
    { icon: <CheckCircle size={22} className="text-violet-600" />, title: t.feat5T, desc: t.feat5D },
    { icon: <Smartphone size={22} className="text-violet-600" />, title: t.feat6T, desc: t.feat6D },
  ]

  const levelDesc: Record<string, string> = {
    A2: t.levelA2, B1: t.levelB1, CONSTITUTION: t.levelConst,
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              {t.heroTag}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t.heroH1a}<br />
              <span className="text-amber-400">{t.heroH1b}</span><br />
              {t.heroH1c}
            </h1>
            <p className="text-violet-100 text-lg leading-relaxed mb-8 max-w-xl">{t.heroPara}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold py-3.5 px-7 rounded-xl transition-all duration-200 shadow-lg shadow-amber-400/30">
                {t.heroBtn1} <ArrowRight size={18} />
              </Link>
              <Link to="/exams" className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold py-3.5 px-7 rounded-xl transition-all duration-200">
                {t.heroBtn2}
              </Link>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[['1,000+', t.stat1], ['3', t.stat2], ['A2 · B1 · Konst.', t.stat3]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-xl sm:text-2xl font-bold text-amber-400">{val}</div>
                  <div className="text-xs sm:text-sm text-violet-200">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills strip */}
      <section className="border-b border-slate-100 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((s) => (
              <span key={s.label} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${s.color}`}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Exam cards */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{t.examH2}</h2>
            <p className="text-slate-500">{t.examSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group">
                <div className={`bg-gradient-to-r ${levelColors[exam.level] || 'from-violet-500 to-violet-600'} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <Badge label={exam.level === 'CONSTITUTION' ? 'KONSTITUCIJA' : exam.level} variant={levelVariant(exam.level)} />
                    <span className="text-white/80 text-xs font-medium">{levelEn[exam.level]}</span>
                  </div>
                  <h3 className="text-xl font-bold">{exam.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-500 text-sm mb-4">{exam.description || levelDesc[exam.level]}</p>
                  <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-400 mb-0.5">{t.examQLabel}</div>
                      <div className="font-bold text-slate-700">{exam._count?.questions || 0}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-400 mb-0.5">{t.examTimeLabel}</div>
                      <div className="font-bold text-slate-700">{exam.timeLimit} min</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-400 mb-0.5">{t.examPassLabel}</div>
                      <div className="font-bold text-slate-700">{exam.passingScore}%</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-400 mb-0.5">{t.examLevelLabel}</div>
                      <div className="font-bold text-slate-700">{exam.level === 'CONSTITUTION' ? 'Konst.' : exam.level}</div>
                    </div>
                  </div>
                  <Link to={`/exam/${exam.id}`} className="btn-primary w-full text-center block text-sm py-2.5 rounded-xl">
                    {t.examBtn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{t.featH2}</h2>
            <p className="text-slate-500">{t.featSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-50 rounded-2xl p-6 hover:bg-violet-50 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:shadow-violet-100">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{t.howH2}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t.step1T, desc: t.step1D },
              { num: '2', title: t.step2T, desc: t.step2D },
              { num: '3', title: t.step3T, desc: t.step3D },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-violet-200">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{t.testH2}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Olena K.', country: '🇺🇦 Ukraina', text: t.test1, rating: 5 },
              { name: 'Murat A.', country: '🇹🇷 Turkija', text: t.test2, rating: 5 },
              { name: 'Ayesha R.', country: '🇵🇰 Pakistanas', text: t.test3, rating: 5 },
            ].map((rev) => (
              <div key={rev.name} className="bg-slate-50 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">"{rev.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">{rev.name}</div>
                    <div className="text-slate-400 text-xs">{rev.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-700 to-violet-800 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.ctaH2}</h2>
          <p className="text-violet-200 mb-8">{t.ctaPara}</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-violet-900/30">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
