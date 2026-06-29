export default function Navbar({ title }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      <p className="text-sm text-slate-400">{dateStr}</p>
    </header>
  )
}
