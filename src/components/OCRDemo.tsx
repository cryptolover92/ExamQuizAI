import { useState, useRef } from 'react'
import { ocrService } from '../OCRService'
import { pdfToImages } from '../pdfUtils'

export default function OCRDemo() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setLoading(true)
    setResult('')
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

      setProgress(`Processing ${images.length} page(s)...`)
      let combinedText = ''
      for (let i = 0; i < images.length; i++) {
        setProgress(`Processing page ${i + 1} of ${images.length}...`)
        const text = await ocrService.extractText([images[i]], 0)
        combinedText += text + '\n\n'
      }
      setResult(combinedText.trim())
      setProgress('')
    } catch (err) {
      setError('OCR extraction failed. Please try again.')
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
    navigator.clipboard.writeText(result)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Try OCR Extraction</h2>
        <p className="text-lg text-gray-600">Upload an image or PDF to extract text instantly</p>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Your File</h3>
        <p className="text-gray-500 mb-4">
          Drag and drop your image or PDF here, or click to browse files
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
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-sm text-gray-600">{progress || 'Processing...'}</p>
        </div>
      )}

      {error && (
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto border">
              {result}
            </div>
            <button
              onClick={copyToClipboard}
              className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <svg className="inline h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
