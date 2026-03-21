import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldOff, Search } from 'lucide-react'
import api from '../../api/axios'
import Layout from '../../components/layout/Layout'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

interface AdminUser {
  id: string; name: string; email: string; role: string; createdAt: string; _count: { attempts: number }
}

export default function ManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => api.get('/api/admin/users').then(({ data }) => setUsers(data.users)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const toggleRole = async (u: AdminUser) => {
    const newRole = u.role === 'ADMIN' ? 'STUDENT' : 'ADMIN'
    if (!confirm(`Pakeisti ${u.name} rolę į ${newRole}?`)) return
    await api.put(`/api/admin/users/${u.id}/role`, { role: newRole }); load()
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Vartotojų valdymas</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Ieškoti..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Vardas', 'El. paštas', 'Rolė', 'Bandymai', 'Registracija', 'Veiksmai'].map(h =>
                  <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">{u.name}</td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4"><Badge label={u.role === 'ADMIN' ? 'Administratorius' : 'Studentas'} variant={u.role === 'ADMIN' ? 'b1' : 'default'} /></td>
                    <td className="py-3 px-4 text-slate-600">{u._count.attempts}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString('lt-LT')}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleRole(u)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${u.role === 'ADMIN' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-violet-200 text-violet-600 hover:bg-violet-50'}`}>
                        {u.role === 'ADMIN' ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                        {u.role === 'ADMIN' ? 'Pašalinti admin' : 'Suteikti admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
