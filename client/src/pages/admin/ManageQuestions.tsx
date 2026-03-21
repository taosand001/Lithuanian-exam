import { useEffect, useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../../api/axios'
import { Exam, Question } from '../../types'
import Layout from '../../components/layout/Layout'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge, { skillVariant } from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

const skillLabels: Record<string, string> = {
  READING: 'Skaitymas', LISTENING: 'Klausymas', WRITING: 'Rašymas', SPEAKING: 'Kalbėjimas', GRAMMAR: 'Gramatika',
}
const emptyForm = { examId: '', type: 'MULTIPLE_CHOICE', skill: 'READING', content: '', passage: '', audioUrl: '', explanation: '', points: 1, order: 0, options: [{ content: '', isCorrect: true }, { content: '', isCorrect: false }, { content: '', isCorrect: false }, { content: '', isCorrect: false }] }

export default function ManageQuestions() {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExam, setSelectedExam] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => { api.get('/api/admin/exams').then(({ data }) => setExams(data.exams)) }, [])

  const loadQuestions = (examId: string) => {
    setLoading(true)
    api.get(`/api/admin/questions/${examId}`).then(({ data }) => setQuestions(data.questions)).finally(() => setLoading(false))
  }

  const handleSelectExam = (id: string) => { setSelectedExam(id); loadQuestions(id) }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/api/admin/questions', { ...form, examId: selectedExam })
      setShowModal(false); loadQuestions(selectedExam)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ištrinti šį klausimą?')) return
    await api.delete(`/api/admin/questions/${id}`); loadQuestions(selectedExam)
  }

  const setOption = (i: number, field: string, value: string | boolean) => {
    setForm(f => ({ ...f, options: f.options.map((o, idx) => idx === i ? { ...o, [field]: value } : field === 'isCorrect' && value ? { ...o, isCorrect: false } : o) }))
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Klausimų valdymas</h1>
          {selectedExam && <Button size="sm" onClick={() => { setForm({ ...emptyForm, examId: selectedExam }); setShowModal(true) }}>
            <Plus size={16} /> Naujas klausimas
          </Button>}
        </div>

        <div className="mb-6">
          <label className="label">Pasirinkite egzaminą</label>
          <select className="input-field max-w-sm" value={selectedExam} onChange={e => handleSelectExam(e.target.value)}>
            <option value="">— Pasirinkite —</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : selectedExam && (
          <div className="space-y-3">
            <div className="text-sm text-slate-500 mb-4">{questions.length} klausimai</div>
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs font-bold text-slate-400 w-6">{idx + 1}</span>
                  <Badge label={skillLabels[q.skill] || q.skill} variant={skillVariant(q.skill)} size="sm" />
                  <span className="text-sm text-slate-700 flex-1 truncate">{q.content}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setExpanded(p => { const n = new Set(p); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n })}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                      {expanded.has(q.id) ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
                  </div>
                </div>
                {expanded.has(q.id) && (
                  <div className="px-4 pb-4 space-y-2 border-t border-slate-50 pt-3">
                    {q.passage && <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">{q.passage}</div>}
                    {q.options.map((o, i) => (
                      <div key={o.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${o.isCorrect ? 'bg-green-50 text-green-800 font-medium' : 'text-slate-600'}`}>
                        <span className="font-bold">{String.fromCharCode(65 + i)}.</span> {o.content}
                        {o.isCorrect && <span className="ml-auto text-green-600 text-xs">✓ Teisingas</span>}
                      </div>
                    ))}
                    {q.explanation && <div className="bg-violet-50 text-violet-700 text-xs rounded-lg p-3">💡 {q.explanation}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Naujas klausimas" maxWidth="max-w-2xl">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Tipas</label>
                <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'TEXT_INPUT'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="label">Įgūdis</label>
                <select className="input-field" value={form.skill} onChange={e => setForm(f => ({ ...f, skill: e.target.value }))}>
                  {['READING', 'LISTENING', 'WRITING', 'SPEAKING', 'GRAMMAR'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div><label className="label">Tekstas (pasažas)</label><textarea className="input-field resize-none" rows={3} value={form.passage} onChange={e => setForm(f => ({ ...f, passage: e.target.value }))} /></div>
            <div><label className="label">Klausimas</label><textarea className="input-field resize-none" rows={2} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
            {(form.type === 'MULTIPLE_CHOICE' || form.type === 'TRUE_FALSE') && (
              <div>
                <label className="label">Atsakymų variantai</label>
                <div className="space-y-2">
                  {form.options.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="radio" name="correct" checked={o.isCorrect} onChange={() => setOption(i, 'isCorrect', true)} className="accent-violet-600" />
                      <input type="text" value={o.content} onChange={e => setOption(i, 'content', e.target.value)}
                        placeholder={`Variantas ${String.fromCharCode(65 + i)}`} className="input-field flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div><label className="label">Paaiškinimas (neprivaloma)</label><input className="input-field" value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} /></div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Atšaukti</Button>
              <Button onClick={handleSave} loading={saving} className="flex-1">Išsaugoti</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  )
}
