// OCR service using OpenRouter API with fallback logic
const API_KEY = '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';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// OCR Models
const ocrModels = [
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'gemini/gemini-2.0-flash-exp:free',
  'qwen/qwen2.5-vl-72b-instruct:free'
]

// Question Formatting Models
const formattingModels = [
  'openai/gpt-4o-mini',
  'google/gemini-pro',
  'deepseek/deepseek-chat',
  'qwen/qwen2-72b-instruct'
]

interface OCRResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

class OCRService {
  async extractText(images: string[], modelIndex = 0): Promise<string> {
    if (modelIndex >= ocrModels.length) {
      throw new Error('All OCR models failed.')
    }

    const model = ocrModels[modelIndex]
    try {
      const messageContent: Array<any> = [
        {
          type: 'text',
          text: 'Extract and return the text from this image. Do not include any additional text or commentary.'
        }
      ]

      images.forEach(image => {
        messageContent.push({
          type: 'image_url',
          image_url: { url: image }
        })
      })

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: messageContent
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data: OCRResponse = await response.json()
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content
      } else {
        throw new Error('No response from OCR model')
      }
    } catch (error) {
      console.error(`OCR Model ${model} failed:`, error)
      if (modelIndex < ocrModels.length - 1) {
        return this.extractText(images, modelIndex + 1)
      }
      throw error
    }
  }

  async formatQuestions(text: string, modelIndex = 0): Promise<string> {
    if (modelIndex >= formattingModels.length) {
      throw new Error('All formatting models failed.')
    }

    const model = formattingModels[modelIndex]
    try {
      const messageContent = `You are an expert at formatting question papers for kids/school students. Analyze the following text and extract only the actual questions (not answers or extra text). For each question, identify its type and format it properly.

CRITICAL FORMATTING RULES - MUST FOLLOW EXACTLY:
1. Each question MUST be on its own line
2. For MCQs:
   - Question text MUST be on one line starting with "Q.[number] "
   - Each option MUST be on a separate line starting with "A) ", "B) ", "C) ", or "D) "
   - Example format:
     Q.1 What is the capital of France?
     A) Berlin
     B) Madrid
     C) Paris
     D) Rome
3. For Fill in the Blanks:
   - Question text MUST be on one line with "_____" for blanks
   - Example format:
     Q.2 Complete the sentence: The sky is _____
4. For True/False:
   - Question text MUST be on one line followed by "(True/False)"
   - Example format:
     Q.3 The earth is flat. (True/False)
5. Number questions sequentially (Q.1, Q.2, etc.)
6. Remove any extra text that is not part of the question
7. Keep the formatting clean and readable for kids
8. Return only the formatted questions with their options, one question per section
9. Ensure there is a blank line between each question

Text to format: ${text}`;

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: messageContent
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data: OCRResponse = await response.json()
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content
      } else {
        throw new Error('No response from formatting model')
      }
    } catch (error) {
      console.error(`Formatting Model ${model} failed:`, error)
      if (modelIndex < formattingModels.length - 1) {
        return this.formatQuestions(text, modelIndex + 1)
      }
      throw error
    }
  }
}

export const ocrService = new OCRService()
