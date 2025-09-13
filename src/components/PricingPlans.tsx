import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PricingPlans() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out our quiz generation features",
      priceMonthly: 0,
      priceYearly: 0,
      priceText: "₹0",
      popular: false,
      features: [
        { text: "10 quizzes per month", included: true },
        { text: "5 questions per quiz", included: true },
        { text: "Basic question formats", included: true },
        { text: "PDF export", included: true },
        { text: "Difficulty level selection", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Multi-user access", included: false },
        { text: "Priority support", included: false }
      ],
      cta: "Get Started Free",
      color: "border-gray-200"
    },
    {
      name: "Pro",
      description: "Ideal for teachers and small coaching institutes",
      priceMonthly: 499,
      priceYearly: 4990,
      priceText: billingPeriod === 'monthly' ? "₹499/month" : "₹4990/year",
      savings: billingPeriod === 'yearly' ? "Save ₹1,098/year" : null,
      popular: true,
      features: [
        { text: "Unlimited quizzes & questions", included: true },
        { text: "All question formats (MCQ, Fill in Blanks, etc.)", included: true },
        { text: "Complete difficulty control (Easy, Medium, Hard)", included: true },
        { text: "PDF, Word, and printable exports", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Student progress tracking", included: true },
        { text: "Email and priority support", included: true },
        { text: "Up to 5 team members", included: true }
      ],
      cta: "Start Free Trial",
      color: "border-blue-500 ring-2 ring-blue-500"
    },
    {
      name: "Institution",
      description: "For schools, universities, and large coaching chains",
      priceText: "Custom Pricing",
      priceSubtext: "Contact for quote",
      popular: false,
      features: [
        { text: "Everything in Pro plan", included: true },
        { text: "Unlimited team members", included: true },
        { text: "Institutional dashboard", included: true },
        { text: "Bulk quiz generation", included: true },
        { text: "Advanced reporting & analytics", included: true },
        { text: "White-label solutions", included: true },
        { text: "24/7 phone support", included: true },
        { text: "Custom integrations", included: true }
      ],
      cta: "Contact Sales",
      color: "border-purple-500"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start with our free plan or upgrade to unlock unlimited quiz generation capabilities
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`absolute inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm flex items-center ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                Save 18%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl border-2 transform hover:-translate-y-2 ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>

                  <div className="mt-6 mb-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.priceText}
                    </div>
                    {plan.priceSubtext && (
                      <div className="text-sm text-gray-600">{plan.priceSubtext}</div>
                    )}
                    {plan.savings && (
                      <div className="text-sm text-green-600 font-medium mt-1">{plan.savings}</div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                        feature.included ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <svg
                          className={`w-3 h-3 ${
                            feature.included ? 'text-green-600' : 'text-gray-400'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {feature.included ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                      </div>
                      <span className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <button onClick={plan.name === 'Free' || plan.name === 'Pro' ? () => navigate('/login') : undefined} className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : plan.name === 'Free'
                      ? 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Got questions? Check our{" "}
            <a href="#faq" className="text-blue-600 hover:text-blue-800 font-medium">
              detailed FAQ
            </a>{" "}
            or contact our support team for personalized recommendations.
          </p>
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 font-medium">30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
