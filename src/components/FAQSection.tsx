import { useState } from 'react';

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "Can I upload handwritten notes?",
      answer: "Absolutely! ExamQuizAI is specifically designed to work with handwritten notes, textbook pages, and informal study materials. Simply upload your handwritten notes, lessons, or assignments, and our AI will digitally process them to generate clean, professional question papers."
    },
    {
      question: "What formats of questions can I generate?",
      answer: "You can generate MCQs (Multiple Choice Questions), Fill in the Blanks, Matching questions, True/False, and Short Answer questions. Our AI analyzes your content and automatically creates the most suitable question types for optimal learning outcomes."
    },
    {
      question: "Can I control the difficulty level of questions?",
      answer: "Yes! You have full control over question difficulty with Easy, Medium, and Hard settings. This ensures your assessments are appropriately challenging for your students' learning level."
    },
    {
      question: "Do I need any technical skills to use ExamQuizAI?",
      answer: "Not at all! ExamQuizAI is designed to be ultra-simple. Just upload your content (handwritten notes, PDFs, textbooks), select your preferences, and click generate. The entire process takes less than 2 minutes."
    },
    {
      question: "What file types can I upload?",
      answer: "You can upload PDF files, images (JPG, PNG, WebP), or even YouTube video links. Our AI processes everything automatically and extracts relevant educational content to create questions."
    },
    {
      question: "Can I use it for multiple subjects?",
      answer: "Yes! ExamQuizAI works perfectly for all subjects - Mathematics, Science, Social Studies, Languages, Commerce, or any other field. The AI adapts to your content regardless of the subject matter."
    },
    {
      question: "How many quizzes can I create?",
      answer: "Free plan: 10 quizzes per month\nPro plan: Unlimited quizzes and questions\nInstitution plan: Unlimited with team collaboration\nYou can create as many variations as needed for comprehensive assessment coverage."
    },
    {
      question: "Can I share quizzes with my students?",
      answer: "Absolutely! You can export quizzes as PDF, Word documents, or printable formats and share them via email, Google Classroom, or any other platform. Pro users also get the ability to share quizzes securely with their classroom."
    },
    {
      question: "What if the generated questions aren't perfect?",
      answer: "You have full editing control! Review, modify, or add more questions before using your quiz. The AI generates initial content, but you maintain complete authority over your final assessments."
    },
    {
      question: "Is my content secure?",
      answer: "100% secure! Your uploaded content is processed temporarily and never stored on our servers except for your edited quizzes in your account. We prioritize educational content security and privacy."
    },
    {
      question: "Can coaching institutes use this?",
      answer: "Absolutely! This is perfect for:\n• JEE/NEET/UPSC coaching institutes\n• Test prep centers\n• School tuition classes\n• Individual subject coaching\nWe offer special institutional plans for bulk usage."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! You can try ExamQuizAI with our free plan (10 quizzes/month) or start a 30-day free trial of the Pro plan. No credit card required for the free trial - experience all Pro features risk-free."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about creating amazing question papers with ExamQuizAI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-blue-600 transform transition-transform duration-200 flex-shrink-0 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 text-gray-700 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Can't find your answer section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our friendly support team is here to help <br />
            with personalized assistance for your specific needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center space-x-3 bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">Live Chat Support</div>
                <div className="text-xs text-gray-600">Available 24/7</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">Email Support</div>
                <div className="text-xs text-gray-600">Within 2 hours</div>
              </div>
            </div>
          </div>

          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
