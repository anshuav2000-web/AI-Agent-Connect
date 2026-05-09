export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-6xl font-bold text-emerald-400 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-white/40 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-semibold transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}
