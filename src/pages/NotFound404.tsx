import { Link } from 'react-router-dom'

export default function NotFound404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Strona nie znaleziona</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Przepraszamy, szukana strona nie istnieje.
        </p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  )
}
