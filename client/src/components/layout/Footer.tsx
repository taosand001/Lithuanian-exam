import { Link } from 'react-router-dom'
import { BookOpen, Mail, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <BookOpen size={22} />
              <span>LT Egzaminai</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Platforma skirta lietuvių kalbos ir Konstitucijos egzaminų pasiruošimui. Autentiški klausimai, tikras egzamino formatas.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="mailto:info@ltegzaminai.lt" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                <Mail size={14} /> info@ltegzaminai.lt
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Egzaminai</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/exams" className="text-slate-400 hover:text-white transition-colors">A2 Lietuvių kalba</Link></li>
              <li><Link to="/exams" className="text-slate-400 hover:text-white transition-colors">B1 Lietuvių kalba</Link></li>
              <li><Link to="/exams" className="text-slate-400 hover:text-white transition-colors">Konstitucijos egzaminas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Paskyra</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Registruotis</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Prisijungti</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Valdymo panelė</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs">© 2025 LT Egzaminai. Visos teisės saugomos.</p>
          <p className="text-slate-600 text-xs">Sukurta remiantis NŠA egzaminų formatu</p>
        </div>
      </div>
    </footer>
  )
}
