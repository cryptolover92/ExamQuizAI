// Utility functions for PDF processing
import * as pdfjsLib from 'pdfjs-dist'

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

export async function pdfToImages(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
  const images: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const scale = 2 // Adjust for quality
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) throw new Error('Canvas context not available')

    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderContext = {
      canvasContext: context,
      viewport,
      canvas
    }

    await page.render(renderContext).promise

    const imageData = canvas.toDataURL('image/png')
    images.push(imageData)
  }

  return images
}
