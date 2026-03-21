import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import api from '../../api/axios'
import { Exam } from '../../types'
import Layout from '../../components/layout/Layout'
import Badge, { levelVariant } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const emptyExam = { title: '', titleEn: '', description: '', level: 'A2', category: 'LANGUAGE', timeLimit: 90, passingScore: 60, isPublished: false }

export default function ManageExams() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Exam | null>(null)
  const [form, setForm] = useState(emptyExam)
  const [saving, setSaving] = useState(false)

  const load = () => api.get('/api/admin/exams').then(({ data }) => setExams(data.exams)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyExam); setShowModal(true) }
  const openEdit = (e: Exam) => { setEditing(e); setForm({ title: e.title, titleEn: e.titleEn || '', description: e.description || '', level: e.level, category: e.category, timeLimit: e.timeLimit, passingScore: e.passingScore, isPublished: e.isPublished }); setShowModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) await api.put(`/api/admin/exams/${editing.id}`, form)
      else await api.post('/api/admin/exams', form)
      setShowModal(false); load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį egzaminą?')) return
    await api.delete(`/api/admin/exams/${id}`); load()
  }

  const handleTogglePublish = async (e: Exam) => {
    await api.put(`/api/admin/exams/${e.id}`, { isPublished: !e.isPublished }); load()
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Egzaminų valdymas</h1>
          <Button onClick={openCreate} size="sm"><Plus size={16} /> Naujas egzaminas</Button>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Pavadinimas', 'Lygis', 'Klausimai', 'Laikas', 'Būsena', 'Veiksmai'].map(h =>
                  <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4"><div className="font-medium text-slate-700">{e.title}</div>{e.titleEn && <div className="text-xs text-slate-400">{e.titleEn}</div>}</td>
                    <td className="py-3 px-4"><Badge label={e.level} variant={levelVariant(e.level)} /></td>
                    <td className="py-3 px-4 text-slate-600">{(e as Exam & { _count?: { questions: number } })._count?.questions || 0}</td>
                    <td className="py-3 px-4 text-slate-600">{e.timeLimit} min</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleTogglePublish(e)} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${e.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {e.isPublished ? <Eye size={12} /> : <EyeOff size={12} />} {e.isPublished ? 'Paskelbta' : 'Nepaskelbta'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(e)} className="p-1.5 hover:bg-violet-50 rounded-lg text-slate-400 hover:text-violet-600 transition-colors"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(e.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Redaguoti egzaminą' : 'Naujas egzaminas'} maxWidth="max-w-lg">
          <div className="space-y-4">
            <div><label className="label">Pavadinimas (LT)</label><input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><label className="label">Pavadinimas (EN)</label><input className="input-field" value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} /></div>
            <div><label className="label">Aprašymas</label><textarea className="input-field resize-none" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Lygis</label>
                <select className="input-field" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'CONSTITUTION'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div><label className="label">Kategorija</label>
                <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['LANGUAGE', 'CONSTITUTION', 'PRACTICE'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="label">Laikas (min)</label><input type="number" className="input-field" value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: Number(e.target.value) }))} /></div>
              <div><label className="label">Išlaikymui (%)</label><input type="number" className="input-field" value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: Number(e.target.value) }))} /></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 accent-violet-600" />
              <span className="text-sm font-medium text-slate-700">Skelbti viešai</span>
            </label>
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
