export default function LoadingSpinner({ size = 'md', text = '' }) {
  const s = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8'
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${s} animate-spin rounded-full border-4 border-slate-200 border-t-blue-600`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
}
