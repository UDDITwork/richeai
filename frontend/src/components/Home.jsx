import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-lg mb-8 bg-white/10 backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-white tracking-wide">RICHIEAT</h1>
        </div>
        <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Welcome to RICHIEAT
        </h2>
        <p className="text-xl text-white opacity-90 mb-8">
          Your Financial Advisory Platform for SEBI-registered advisors
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition duration-300 transform hover:scale-105"
          >
            Create Account
          </Link>
        </div>
        
        <div className="mt-12 text-white/80 text-sm">
          <p>For SEBI-registered financial advisors in India</p>
        </div>
      </div>
    </div>
  )
}

export default Home