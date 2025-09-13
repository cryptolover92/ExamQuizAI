import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ocrService } from '../OCRService'
import { pdfToImages } from '../pdfUtils'
import { 
  Home, 
  FileText, 
  GraduationCap, 
  Building2, 
  School, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Download,
  Edit3
} from 'lucide-react'
import KidsSchoolWorkflow from '../components/KidsSchoolWorkflow'

// Header types
interface PremadeHeader { template: string }
interface CustomHeader { title: string; subheading: string; instructions: string; font: string }
interface UploadHeader { image: string }
type HeaderData = PremadeHeader | CustomHeader | UploadHeader

// Type guards
const isPremadeHeader = (data: HeaderData): data is PremadeHeader => {
  return (data as PremadeHeader).template !== undefined
}

const isCustomHeader = (data: HeaderData): data is CustomHeader => {
  return (data as CustomHeader).title !== undefined
}

const isUploadHeader = (data: HeaderData): data is UploadHeader => {
  return (data as UploadHeader).image !== undefined
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('') // Renamed to extractedText
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [model, setModel] = useState('mistralai/mistral-small-3.2-24b-instruct:free')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New states for workflow
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'kids' | 'college' | 'coaching' | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [questionType, setQuestionType] = useState('MCQ')
  const [headerConfig, setHeaderConfig] = useState<{ type: 'premade' | 'custom' | 'upload'; data: HeaderData }>({ 
    type: 'premade', 
    data: { template: 'default' } as PremadeHeader 
  })
  const [extractedText, setExtractedText] = useState('') // From OCR

  // Category labels
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'kids': return 'Kids / School - Fun Learning!'
      case 'college': return 'College - Academic Excellence'
      case 'coaching': return 'Coaching / Institute - Professional Prep'
      default: return ''
    }
  }

  // Mock preview data based on category and type
  const getMockQuestions = () => {
    const baseQuestions = extractedText ? extractedText.split('\n').slice(0, 5).map((q, i) => ({ id: i+1, text: q })) : []
    // Mock options for MCQ, etc.
    return baseQuestions.map(q => ({
      ...q,
      options: questionType === 'MCQ' ? ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'] : [],
      type: questionType
    }))
  }

  // Existing upload handlers
  const handleFileSelect = async (file: File) => {
    setLoading(true)
    setExtractedText('')
    setError('')
    setProgress('')

    try {
      let images: string[]
      if (file.type === 'application/pdf') {
        setProgress('Converting PDF to images...')
        images = await pdfToImages(file)
      } else {
        const reader = new FileReader()
        images = [await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })]
      }

      setProgress(`Processing ${images.length} page(s) with ${model}...`)

      let combinedText = ''
      for (let i = 0; i < images.length; i++) {
        setProgress(`Processing page ${i + 1} of ${images.length}...`)
        const text = await ocrService.extractText([images[i]], 0)
        combinedText += text + '\n\n'
      }

      setExtractedText(combinedText.trim())
      setProgress('')
      if (currentStep === 1) setCurrentStep(2) // Advance to Step 2
    } catch (err) {
      console.error('OCR Error:', err)
      setError('OCR extraction failed. Please try again or switch to a different AI model.')
      setProgress('')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Reset user state or redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  // Reset workflow on category change
  useEffect(() => {
    if (selectedCategory) {
      setCurrentStep(1)
      setQuestionType('MCQ')
      setHeaderConfig({ type: 'premade', data: { template: 'default' } as PremadeHeader })
      setExtractedText('')
    }
  }, [selectedCategory])

  // Sidebar JSX
  const Sidebar = () => (
    <div className={`bg-indigo-600 text-white transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1 rounded hover:bg-indigo-500"
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        {!isSidebarCollapsed && (
          <div className="flex items-center">
            <span className="text-xl font-bold">ExamQuizAI</span>
          </div>
        )}
      </div>
      <nav className="mt-4">
        {/* Dashboard */}
        <div className={`p-3 cursor-pointer flex items-center ${!isSidebarCollapsed ? 'pl-4' : ''}`}>
          <Home size={20} className="mr-3" />
          {!isSidebarCollapsed && <span>🏠 Dashboard</span>}
        </div>

        {/* Question Paper Format Section */}
        {!isSidebarCollapsed && <div className="px-4 py-2 text-indigo-200 font-semibold">✍️ Question Paper Format</div>}
        
        {/* Kids / School */}
        <div
          className={`p-3 cursor-pointer flex items-center hover:bg-indigo-500 ${
            selectedCategory === 'kids' ? 'bg-indigo-500' : ''
          } ${!isSidebarCollapsed ? 'pl-4' : ''}`}
          onClick={() => setSelectedCategory('kids')}
        >
          <GraduationCap size={20} className="mr-3" />
          {!isSidebarCollapsed && <span>Kids / School</span>}
        </div>

        {/* College */}
        <div
          className={`p-3 cursor-pointer flex items-center hover:bg-indigo-500 ${
            selectedCategory === 'college' ? 'bg-indigo-500' : ''
          } ${!isSidebarCollapsed ? 'pl-4' : ''}`}
          onClick={() => setSelectedCategory('college')}
        >
          <Building2 size={20} className="mr-3" />
          {!isSidebarCollapsed && <span>College</span>}
        </div>

        {/* Coaching / Institute */}
        <div
          className={`p-3 cursor-pointer flex items-center hover:bg-indigo-500 ${
            selectedCategory === 'coaching' ? 'bg-indigo-500' : ''
          } ${!isSidebarCollapsed ? 'pl-4' : ''}`}
          onClick={() => setSelectedCategory('coaching')}
        >
          <School size={20} className="mr-3" />
          {!isSidebarCollapsed && <span>Coaching / Institute</span>}
        </div>
      </nav>
    </div>
  )

  // Stepper
  const Stepper = () => (
    <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep > step ? 'bg-blue-500 text-white' :
            currentStep === step ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' :
            'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 3 && <div className={`w-12 h-1 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} />}
          <span className={`text-sm ${currentStep === step ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
            {step === 1 && 'Upload Handwritten Content'}
            {step === 2 && 'Choose Question Type'}
            {step === 3 && 'Select Header'}
          </span>
        </div>
      ))}
    </div>
  )

  // Step 1: Upload (Existing)
  const Step1 = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Upload className="mr-2" size={20} />
          Upload Your Handwritten Question Paper
        </h2>
        {selectedCategory && <p className="text-blue-100 mt-1">{getCategoryLabel(selectedCategory)}</p>}
      </div>
      <div className="p-6">
        <div
          className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-white"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Drop your files here or click to browse
          </h3>
          <p className="text-gray-500 mb-4">
            Supports: Images (JPG, PNG, WebP) and PDFs with multiple pages
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {loading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-4"></div>
              <div>
                <p className="font-medium text-blue-800">Processing Your Upload</p>
                <p className="text-sm text-blue-600">{progress}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-medium text-red-800">Processing Failed</p>
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again with a different AI model
                </button>
              </div>
            </div>
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-green-800">
                  Successfully extracted {extractedText.split(/\s+/).length} words of text!
                </span>
              </div>
            </div>
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Extracted Text</h3>
                <button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                >
                  Copy All
                </button>
              </div>
              <div className="bg-white p-4 rounded border text-sm font-mono text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto shadow-sm">
                {extractedText}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Next: Choose Question Type
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Step 2: Question Type
  const Step2 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Question Type</h2>
      <p className="text-gray-600 mb-6">{getCategoryLabel(selectedCategory || '')} Let's format your questions!</p>
      <select
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value as any)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="MCQ">MCQ (Multiple Choice)</option>
        <option value="Fill in the Blanks">Fill in the Blanks</option>
        <option value="True/False">True/False</option>
        <option value="Matching">Matching</option>
        <option value="Mixed">Mixed</option>
      </select>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          disabled={!questionType}
        >
          Next: Select Header
        </button>
      </div>
    </div>
  )

  // Step 3: Header Selection
  const Step3 = () => {
    const templates = {
      kids: ['Fun Cartoon Header', 'Colorful School Badge', 'Playful Worksheet'],
      college: ['Formal University Crest', 'Academic Paper Header', 'Professional Syllabus'],
      coaching: ['Institute Logo Banner', 'Coaching Center Header', 'Exam Prep Title']
    }

    const categoryTemplates = templates[selectedCategory || 'kids'] as string[]

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Header for Question Paper</h2>
        <p className="text-gray-600 mb-6">Choose a header style that fits your {getCategoryLabel(selectedCategory || '').toLowerCase()}</p>

        {/* Option A: Pre-made */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3">A: Pre-made Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryTemplates.map((temp, i) => (
              <label key={i} className="cursor-pointer">
                <input
                  type="radio"
                  name="template"
                  className="sr-only"
                  checked={headerConfig.type === 'premade' && isPremadeHeader(headerConfig.data) && headerConfig.data.template === temp.toLowerCase().replace(/\s+/g, '-')}
                  onChange={() => setHeaderConfig({ type: 'premade', data: { template: temp.toLowerCase().replace(/\s+/g, '-') } as PremadeHeader })}
                />
            <div className={`border-2 rounded-lg p-4 hover:border-blue-300 ${
              headerConfig.type === 'premade' && isPremadeHeader(headerConfig.data) && headerConfig.data.template === temp.toLowerCase().replace(/\s+/g, '-') 
                ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
                  <div className="h-20 bg-gray-100 rounded mb-2 flex items-center justify-center font-bold text-sm">
                    {temp}
                  </div>
                  <p className="text-sm text-gray-600">{temp}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Option B: Create Template */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3">B: Create Template</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title (e.g., Math Quiz Grade 5)"
              className="w-full p-3 border border-gray-300 rounded-lg"
              onChange={(e) => setHeaderConfig({ type: 'custom', data: { title: e.target.value, subheading: '', instructions: '', font: 'Arial' } })}
            />
            <input type="text" placeholder="Subheading" className="w-full p-3 border border-gray-300 rounded-lg" />
            <textarea placeholder="Instructions (e.g., Answer all questions)" className="w-full p-3 border border-gray-300 rounded-lg h-20" />
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option>Font: Arial</option>
              <option>Times New Roman</option>
              <option>Comic Sans (for Kids)</option>
            </select>
          </div>
          <button
            onClick={() => setHeaderConfig({ type: 'custom', data: { title: 'Custom Title', subheading: '', instructions: '', font: 'Arial' } })}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Use Custom
          </button>
        </div>

        {/* Option C: Upload Header */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-3">C: Upload Header Image/Banner</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-300">
            <p className="text-gray-600">Drag or click to upload JPG, PNG, or SVG</p>
            {headerConfig.type === 'upload' && headerConfig.data.image && (
              <img src={headerConfig.data.image} alt="Header" className="mt-4 max-h-24 mx-auto" />
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Preview Question Paper
          </button>
        </div>
      </div>
    )
  }

  // Preview
  const Preview = () => {
    const questions = getMockQuestions()
    const headerStyle = selectedCategory === 'kids' ? 'bg-yellow-100 text-green-800' : 
                        selectedCategory === 'college' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100 text-indigo-800'

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Mode</h2>
          <p className="text-gray-600">Scroll to view your full question paper. {getCategoryLabel(selectedCategory || '')}</p>
        </div>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className={`p-6 rounded-lg mb-6 ${headerStyle} text-center`}>
            {headerConfig.type === 'upload' && isUploadHeader(headerConfig.data) ? (
              <img src={headerConfig.data.image} alt="Header" className="w-full h-32 object-contain mb-4" />
            ) : headerConfig.type === 'custom' && isCustomHeader(headerConfig.data) ? (
              <>
                <h1 className="text-2xl font-bold">{headerConfig.data.title}</h1>
                <p className="text-lg mt-2">{headerConfig.data.subheading}</p>
                <p className="text-sm mt-4">{headerConfig.data.instructions}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{getCategoryLabel(selectedCategory || '')} Question Paper</h1>
                <p className="text-lg mt-2">Practice Quiz</p>
                <p className="text-sm mt-4">Answer all questions below.</p>
              </>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">Question {q.id}: {q.text}</h3>
                {q.options.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {q.options.map((opt, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-6">{String.fromCharCode(65 + i)})</span> {opt}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === 'Fill in the Blanks' && <p className="mt-2 text-sm italic">_____ </p>}
                {q.type === 'True/False' && <div className="mt-2 flex space-x-4"><label>True</label><label>False</label></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Bottom Actions
  const BottomActions = () => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
      <button 
        onClick={() => setCurrentStep(1)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg flex items-center"
      >
        <Edit3 size={20} className="mr-2" /> Edit Again
      </button>
      <button 
        onClick={() => {
          // Mock download
          window.print()
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg flex items-center"
      >
        <Download size={20} className="mr-2" /> Download as PDF
      </button>
    </div>
  )

  // Main content based on state
  const MainContent = () => {
    if (!selectedCategory) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Dashboard</h2>
            <p className="text-gray-600 mb-6">Select a category from the sidebar to start creating your question paper.</p>
          </div>
        </div>
      )
    }

    // Render Kids/School workflow when selected
    if (selectedCategory === 'kids') {
      return (
        <div className="flex-1 p-8 overflow-y-auto">
          <KidsSchoolWorkflow />
        </div>
      );
    }

    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {currentStep <= 3 && <Stepper />}
          
          <div className="mb-8">
            {user ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {getDisplayName()}! 🎉
                </h1>
                <p className="text-lg text-gray-600">
                  Creating question paper for {getCategoryLabel(selectedCategory)}.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to ExamQuizAI OCR Tool! 🚀
                </h1>
                <p className="text-lg text-gray-600">
                  You're in test mode. Select category and upload to extract text.
                </p>
              </>
            )}
          </div>

          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Preview />}

          {/* Existing model selection can be optional or removed; keeping for now */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select AI Model (Optional)</h2>
            {/* Reuse existing model selection radio buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ... existing model radios ... */}
              <label className="relative">
                <input
                  type="radio"
                  name="model"
                  value="mistralai/mistral-small-3.2-24b-instruct:free"
                  checked={model === 'mistralai/mistral-small-3.2-24b-instruct:free'}
                  onChange={(e) => setModel(e.target.value)}
                  className="sr-only"
                />
                <div className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                  model === 'mistralai/mistral-small-3.2-24b-instruct:free'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-blue-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Mistral Small</h3>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <p className="text-sm text-gray-600">Fast and reliable for most OCR tasks</p>
                </div>
              </label>
              {/* Add other models similarly if needed */}
            </div>
          </div>

          {/* Existing stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Files Processed</div>
            </div>
            {/* ... other stats ... */}
          </div>
        </div>
        {currentStep === 4 && <BottomActions />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Existing Top Nav */}
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ExamQuizAI Dashboard</span>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-gray-700">
                      Welcome, {getDisplayName()}!
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <a 
                    href="/login" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Sign In
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <MainContent />
      </div>
    </div>
  )
}
