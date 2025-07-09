import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-32">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
            <div className="text-8xl mb-6 filter grayscale opacity-60">📱</div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Phone Not Found</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              The phone you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ← Back to Browse
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}