export default function UseCasesSection() {
  const useCases = [
    {
      title: "Educational Institutes",
      subtitle: "Schools & Universities",
      description: "Schools can upload textbooks, lesson plans, or faculty notes to generate question papers for exams, entrance tests, and daily quizzes. Ideal for semester exams and weekly assessments.",
      users: "Principals, Teachers, Exam Controllers",
      benefits: ["Standardized assessment generation", "Quick question paper preparation", "Consistent difficulty levels"],
      icon: "🏫",
      color: "from-indigo-500 to-blue-600",
      features: [
        { text: "Entrance exam question banks", icon: "📋" },
        { text: "Class & board exam papers", icon: "🎯" },
        { text: "Weekly class assessments", icon: "📝" },
        { text: "Seminar & project evaluations", icon: "🎓" }
      ]
    },
    {
      title: "Coaching Institutes",
      subtitle: "Tuition Centers & Learning Centers",
      description: "Coaching centers can create unlimited test series, mock exams, and personalized practice sets. Perfect for competitive exam preparation like JEE, NEET, UPSC, and more.",
      users: "Directors, Faculty, Tutors",
      benefits: ["Customized test series", "Competitive exam preparation", "Student progress tracking"],
      icon: "🎊",
      color: "from-purple-500 to-pink-600",
      features: [
        { text: "JEE/NEET/UPSC test series", icon: "🧮" },
        { text: "Mock exam generation", icon: "⚗️" },
        { text: "Topic-wise assessments", icon: "🔬" },
        { text: "Monthly performance tests", icon: "📊" }
      ]
    },
    {
      title: "Independent Teachers",
      subtitle: "Individual Educators & Tutors",
      description: "Private tutors can easily convert their teaching notes into structured question papers. Great for home tuition, online teaching, and private coaching.",
      users: "Private Tutors, Individual Teachers",
      benefits: ["Quick lesson planning", "Professional question papers", "Shareable assessment materials"],
      icon: "👨‍🏫",
      color: "from-green-500 to-teal-600",
      features: [
        { text: "Homework assignments", icon: "📚" },
        { text: "Class test papers", icon: "📄" },
        { text: "Practice worksheets", icon: "✏️" },
        { text: "Progress evaluation", icon: "✅" }
      ]
    },
    {
      title: "Students",
      subtitle: "Self-Study & Practice",
      description: "Students can upload their class notes, textbook pages, or online study materials to generate practice questions. Perfect for exam preparation and self-assessment.",
      users: "School Students, College Students",
      benefits: ["Personalized study questions", "Exam preparation aids", "Fill knowledge gaps"],
      icon: "🎓",
      color: "from-red-500 to-orange-600",
      features: [
        { text: "Revision test papers", icon: "🔄" },
        { text: "Practice question sets", icon: "📝" },
        { text: "Self-assessment quizzes", icon: "🧠" },
        { text: "Board exam preparation", icon: "📖" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for Educators & Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Join thousands of educators using ExamQuizAI to streamline their assessment creation and enhance learning outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="flex items-start mb-6">
                <div className={`w-16 h-16 ${useCase.color} bg-gradient-to-r rounded-2xl flex items-center justify-center shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{useCase.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-blue-600 font-medium text-sm">{useCase.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {useCase.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                    <span className="text-lg">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Perfect for:</p>
                <p className="text-sm text-gray-600">{useCase.users}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <span key={benefitIndex} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Trusted by 10,000+ Educators Worldwide
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold">10K+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">2M+</div>
                <div className="text-blue-100">Quizzes Created</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-blue-100">User Satisfaction</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span className="opacity-90">4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span className="opacity-90">No credit card required for free plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-300">⚡</span>
                <span className="opacity-90">Setup in under 2 minutes</span>
              </div>
            </div>

            <button className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Join the Success Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
