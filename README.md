# ExamQuizAI

A simple web app for extracting text from images and PDFs using OCR via OpenRouter API.

## Features

- Upload images (JPG, PNG, WebP) or PDFs for OCR
- Automatic fallback between OCR models (Mistral → Gemini → Qwen)
- Clean, responsive UI with TailwindCSS
- Copy to clipboard functionality
- Progress indicators for PDF processing

## Setup

### Prerequisites

- Node.js v18 or higher
- OpenRouter API key

### Installation

1. Clone or download the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

   Replace `your_openrouter_api_key_here` with your actual OpenRouter API key.

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview  # To preview the production build
```

## Project Structure

- `src/App.tsx` - Main UI component
- `src/OCRService.ts` - OpenRouter API integration with fallback logic
- `src/pdfUtils.ts` - PDF to images conversion utility
- `src/main.tsx` - Application entry point
- `src/index.css` - TailwindCSS styles

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS 4
- PDF.js for PDF processing

## Usage

1. Click on the upload area or drag & drop an image or PDF file
2. The app will process the file and display the extracted text
3. Click "Copy to Clipboard" to copy the results

For PDFs, each page is processed individually with progress updates.

## API Fallback Logic

The app tries OCR models in this order:
1. Mistral Small 3.2 (free tier)
2. Gemini Flash 2.0 (free tier)
3. Qwen 2.5 VL 72B (free tier)

If one model fails, it automatically switches to the next.

## Note

Make sure to add your OpenRouter API key to the `.env` file before running the app. The PDF processing is done entirely client-side for privacy.
