import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Book floating animation */}
        <div className="absolute top-20 right-10 transform rotate-12">
          <div className="w-16 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-lg shadow-lg flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-green-700 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* Pencil floating animation */}
        <div className="absolute top-40 left-1/4 animate-pulse">
          <div className="w-12 h-6 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>

        {/* Question mark animation */}
        <div className="absolute top-3/4 left-10 transform -rotate-12 animate-bounce">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-3xl text-purple-700 font-bold">?</span>
          </div>
        </div>

        {/* Teacher with notebook */}
        <div className="absolute bottom-20 right-1/4 animate-pulse">
          <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-xl">
            <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-yellow-800 font-medium">Handwritten Notes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Create Question Papers & Quizzes
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Instantly
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Subheadline */}
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
            Turn your handwritten notes, books, PDFs, or videos into ready-to-use
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> question sets </span>
            in seconds.
          </p>
          <p className="text-lg text-gray-600 mt-4 font-medium italic">
            From handwritten notes to question paper — in 1 click.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start for Free
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-8 py-4 border-2 border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            See How It Works
          </button>
        </div>

        {/* Process visual */}
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Upload Content</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Generate Questions</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>Use Instantly</span>
          </div>
        </div>
      </div>


    </section>
  )
}
