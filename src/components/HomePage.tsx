import { useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import HeroSection from './HeroSection'
import HowItWorks from './HowItWorks'
import FeaturesSection from './FeaturesSection'
import UseCasesSection from './UseCasesSection'
import PricingPlans from './PricingPlans'
import FAQSection from './FAQSection'
import Footer from './Footer'

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <HeroSection />

      <div id="how-it-works" className="bg-gradient-to-br from-gray-50 to-white">
        <HowItWorks />
      </div>

      <FeaturesSection />
      <UseCasesSection />
      <PricingPlans />

      <div id="demo" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Try ExamQuizAI Now</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your handwritten notes, PDFs, or textbook pages to instantly generate professional question papers
          </p>
          <button onClick={() => navigate('/login')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Start Creating Quizzes
          </button>
          <p className="text-gray-500 mt-4">No signup required • Free forever plan available</p>
        </div>
      </div>

      <FAQSection />
      <Footer />
    </div>
  )
}
