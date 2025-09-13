import { useState } from 'react';

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState('all');

  const features = [
    {
      id: 'notes',
      title: "Convert Handwritten Notes",
      description: "Turn your messy handwritten notes into clean, digital question papers instantly. No more deciphering your own handwriting!",
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      image: (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 h-40 flex flex-col justify-center">
          <div className="flex space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
              📝
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-3">
              <div className="w-3/4 h-2 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="w-1/2 h-2 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            ✨ Processed by AI
          </div>
        </div>
      )
    },
    {
      id: 'unlimited',
      title: "Create Unlimited Question Papers",
      description: "Generate as many question papers as you need from your books, PDFs, or YouTube links. Save hours of manual work.",
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      image: (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 h-40 flex flex-col justify-center">
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">Q1</div>
              <div className="text-sm text-gray-600">Multiple Choice Questions</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">Q2</div>
              <div className="text-sm text-gray-600">Fill in the Blanks</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">Q3</div>
              <div className="text-sm text-gray-600">Matching Questions</div>
            </div>
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            💡 Smart AI Generation
          </div>
        </div>
      ),
      category: 'teachers'
    },
    {
      id: 'difficulty',
      title: "Control Difficulty Level",
      description: "Choose between Easy, Medium, or Hard difficulty levels. Adapt questions to your students' learning level.",
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: "from-green-500 to-green-600",
      image: (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 h-40 flex flex-col justify-center">
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Hard</span>
              <div className="flex-1 bg-red-100 h-2 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Medium</span>
              <div className="flex-1 bg-yellow-100 h-2 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Easy</span>
              <div className="flex-1 bg-green-100 h-2 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            🎯 Personalized Learning
          </div>
        </div>
      ),
      category: 'teachers'
    },
    {
      id: 'formats',
      title: "Multiple Question Formats",
      description: "Generate MCQs, Fill in the Blanks, Matching questions, True/False, and Long Answer questions.",
      icon: (
        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      image: (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-6 h-40 flex flex-col justify-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">A</span>
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">B</span>
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">C</span>
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">D</span>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
              📚 Choose Question Format
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'instant',
      title: "One-Click Instant Quiz Generator",
      description: "For coaching institutes and schools: Generate complete weekly tests, monthly exams, or class assessments in seconds.",
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-red-500 to-red-600",
      image: (
        <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-6 h-40 flex flex-col justify-center">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto">
              ⚡
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
              🔄 Instant Generation
            </div>
          </div>
        </div>
      ),
      category: 'coaching'
    },
    {
      id: 'export',
      title: "Export & Share Anywhere",
      description: "Download as PDF, Word document, or print. Share directly with students via email or classroom platforms.",
      icon: (
        <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-teal-500 to-teal-600",
      image: (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl p-6 h-40 flex flex-col justify-center">
          <div className="flex justify-center space-x-3 mb-4">
            <div className="bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              📄 PDF
            </div>
            <div className="bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              📝 Word
            </div>
            <div className="bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              🖨️ Print
            </div>
          </div>
          <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium text-center">
            📤 Export & Share Instantly
          </div>
        </div>
      )
    }
  ];

  const filteredFeatures = activeTab === 'all'
    ? features
    : features.filter(feature => feature.category === activeTab);

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your teaching materials into engaging assessments with AI-powered intelligence
          </p>

          {/* Tab navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'teachers'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              For Teachers
            </button>
            <button
              onClick={() => setActiveTab('coaching')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'coaching'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              For Coaching
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
              <div className="mb-4">
                <div className={`w-16 h-16 ${feature.color} bg-gradient-to-r rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
              <div className="mt-6">
                {feature.image}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              From handwritten notes to question paper — in 1 click.
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of educators who are already using ExamQuizAI
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
