export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Upload Your Content",
      description: "Simply upload handwritten notes, book pages, PDF documents, or even YouTube video links. Our AI automatically processes the content.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600",
      visual: (
        <div className="bg-white rounded-lg p-4 shadow-lg border">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
              📝
            </div>
            <span className="text-sm font-medium text-gray-700">handwritten_notes.pdf</span>
          </div>
          <div className="w-full bg-blue-100 h-2 rounded">
            <div className="bg-blue-500 h-2 rounded animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      )
    },
    {
      step: "2",
      title: "Generate Questions",
      description: "AI analyzes your content and instantly generates MCQs, Fill in the Blanks, Matching questions, and full Question Papers.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600",
      visual: (
        <div className="bg-white rounded-lg p-4 shadow-lg border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Q</span>
              <div className="w-full bg-gray-100 h-2 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</span>
              <div className="w-3/4 bg-gray-100 h-2 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</span>
              <div className="w-2/3 bg-gray-100 h-2 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: "3",
      title: "Use Instantly",
      description: "Download your question sets, print them, or share directly with students. Your quiz is ready to use immediately!",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-600",
      visual: (
        <div className="bg-white rounded-lg p-4 shadow-lg border">
          <div className="flex items-center justify-center mb-3">
            <span className="text-2xl">📄</span>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium text-center">
            Ready to Download
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your content into engaging question papers in just three simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 opacity-20"></div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((stepData, index) => (
              <div key={index} className="relative">
                {/* Step number circle */}
                <div className="flex justify-center mb-8">
                  <div className={`w-20 h-20 ${stepData.color} bg-gradient-to-r rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300`}>
                    {stepData.icon}
                  </div>
                </div>

                {/* Visual preview */}
                <div className="flex justify-center mb-6">
                  {stepData.visual}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {stepData.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {stepData.description}
                  </p>
                </div>

                {/* Arrow indicator (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-action */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Try It Now - It's Free!
          </button>
          <p className="text-gray-500 mt-3 text-sm">
            No credit card required • Instant setup
          </p>
        </div>
      </div>
    </section>
  );
}
