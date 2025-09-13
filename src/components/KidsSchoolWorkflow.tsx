import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Upload, Download, Edit3, FileText, Image, Palette } from 'lucide-react';
import { ocrService } from '../OCRService';
import { pdfToImages } from '../pdfUtils';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

interface Question {
  id: number;
  text: string;
  type: string;
  options?: string[];
}

interface HeaderTemplate {
  logo?: string;
  schoolName: string;
  examTitle?: string;
  class: string;
  subject: string;
  date: string;
  marks: string;
  time?: string;
}

export default function KidsSchoolWorkflow(): React.ReactElement {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [selectedModel, setSelectedModel] = useState('mistralai/mistral-small-3.2-24b-instruct:free');
  const [extractedText, setExtractedText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [headerTemplate, setHeaderTemplate] = useState<HeaderTemplate>({
    schoolName: '',
    class: '',
    subject: '',
    date: '',
    marks: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerType, setHeaderType] = useState<'readymade' | 'custom' | 'upload'>('readymade');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadedHeader, setUploadedHeader] = useState<string | null>(null);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // OCR Models
  const ocrModels = [
    { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 3.2 24B' },
    { id: 'gemini/gemini-2.0-flash-exp:free', name: 'Gemini Flash 2.0 OCR' },
    { id: 'qwen/qwen2.5-vl-72b-instruct:free', name: 'Qwen 2.5 VL OCR' }
  ];

  // Question Formatting Models
  const formattingModels = [
    { id: 'openai/gpt-4o-mini', name: 'ChatGPT 4o Mini' },
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'qwen/qwen2-72b-instruct', name: 'Qwen 2 72B Instruct' }
  ];

  // Handle file upload
  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError('');
    setProgress('');

    try {
      let images: string[];
      if (file.type === 'application/pdf') {
        setProgress('Converting PDF to images...');
        images = await pdfToImages(file);
      } else {
        const reader = new FileReader();
        images = [await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })];
      }

      setProgress(`Processing ${images.length} page(s) with selected model...`);
      
      // Use the selected model directly instead of fallback
      const text = await ocrService.extractText([images[0]], ocrModels.findIndex(m => m.id === selectedModel));
      
      setExtractedText(text);
      setProgress('');
    } catch (err) {
      console.error('OCR Error:', err);
      setError('OCR extraction failed. Please try again.');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // State for formatted questions text
  const [formattedQuestionsText, setFormattedQuestionsText] = useState('');

  // Process questions after OCR
  const processQuestions = async () => {
    if (!extractedText) return;
    
    setLoading(true);
    setError('');
    setProgress('Analyzing questions...');
    
    try {
      // Enhanced formatting request with specific horizontal option formatting
      const enhancedPrompt = `Format the following text into properly structured questions with these specific requirements:

1. Each question should start with "Q.1", "Q.2", etc.
2. For Multiple Choice Questions (MCQ), format options HORIZONTALLY on the same line like this:
   Q.1 What is the capital of India?
   A) Mumbai  B) Delhi  C) Kolkata  D) Chennai

3. For Fill in the blanks, use underscores: _____
4. For True/False questions, add (True/False) at the end
5. Keep questions concise and well-formatted
6. Maintain original language (Hindi/English) as given
7. Options should be on the same line as much as possible, separated by spaces

Text to format:
${extractedText}`;

      // Call the formatQuestions API with enhanced formatting
      const formattedText = await ocrService.formatQuestions(
        enhancedPrompt, 
        formattingModels.findIndex(m => m.id === selectedFormattingModel)
      );
      
      // Set the formatted text to state for display in Step 2
      setFormattedQuestionsText(formattedText);
      setProgress('');
      setLoading(false);
      // Stay in Step 2 to display the formatted text
    } catch (err) {
      console.error('Formatting Error:', err);
      setError('Question formatting failed. Please try again.');
      setProgress('');
      setLoading(false);
    }
  };

  // Handle header template save
  const saveCustomHeader = () => {
    // In a real app, this would save to localStorage or a database
    setCurrentStep(4);
  };

  // Handle header image upload
  const handleHeaderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedHeader(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stable handlers outside of component to prevent re-creation
  const handleSchoolNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, schoolName: e.target.value}));
  }, []);

  const handleExamTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, examTitle: e.target.value}));
  }, []);

  const handleClassChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, class: e.target.value}));
  }, []);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, subject: e.target.value}));
  }, []);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, date: e.target.value}));
  }, []);

  const handleMarksChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, marks: e.target.value}));
  }, []);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHeaderTemplate(prev => ({...prev, time: e.target.value}));
  }, []);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderTemplate({...headerTemplate, logo: e.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  // Enhanced function to render text as image with improved Unicode support
  const renderTextAsImage = (text: string, fontSize: number = 12): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Canvas context not available');
        return '';
      }

      // Set higher DPI for better quality
      const dpr = window.devicePixelRatio || 1;
      const maxWidth = 700;
      canvas.width = (maxWidth + 100) * dpr;
      
      // Scale context for high DPI
      ctx.scale(dpr, dpr);
      
      // Use comprehensive font stack with better fallbacks
      const fontStack = [
        '"Noto Sans Devanagari"',
        '"Mangal"',
        '"Aparajita"',
        '"Kokila"',
        '"Utsaah"',
        '"Arial Unicode MS"',
        '"Lucida Sans Unicode"',
        'Arial',
        'sans-serif'
      ].join(', ');
      
      ctx.font = `${fontSize}px ${fontStack}`;
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Better text wrapping algorithm
      const lines = [];
      const words = text.split(/(\s+)/); // Keep spaces
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine.trim()) {
          lines.push(currentLine.trim());
          currentLine = word.trim() + ' ';
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine.trim()) lines.push(currentLine.trim());
      
      const lineHeight = fontSize * 1.4;
      const padding = 20;
      canvas.height = (Math.max(50, lines.length * lineHeight + padding * 2)) * dpr;

      // Clear and set white background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Reset text styles after canvas resize
      ctx.scale(dpr, dpr);
      ctx.font = `${fontSize}px ${fontStack}`;
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Render each line with proper spacing
      lines.forEach((line, index) => {
        const y = padding + (index * lineHeight);
        ctx.fillText(line, padding, y);
      });

      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error in renderTextAsImage:', error);
      return '';
    }
  };

  // Helper function to detect if text contains Hindi characters
  const containsHindi = (text: string): boolean => {
    // Check for Devanagari Unicode range (0900-097F)
    return /[\u0900-\u097F]/.test(text);
  };

  // Enhanced PDF download with proper question formatting and spacing
  const downloadAsPDF = async () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      let questionCount = 0;

      // Add logo if available
      if (headerTemplate.logo && headerType === 'custom') {
        try {
          doc.addImage(headerTemplate.logo, 'JPEG', 15, 15, 25, 25);
          yPosition = Math.max(yPosition, 45);
        } catch (logoError) {
          console.warn('Could not add logo to PDF:', logoError);
        }
      }

      // Add header
      if (headerType === 'upload' && uploadedHeader) {
        try {
          doc.addImage(uploadedHeader, 'JPEG', 15, 15, 180, 40);
          yPosition += 50;
        } catch (headerError) {
          console.warn('Could not add header image to PDF:', headerError);
          doc.setFontSize(16);
          doc.text('School Header Image', 105, yPosition, { align: 'center' });
          yPosition += 20;
        }
      } else if (headerType === 'custom') {
        try {
          doc.setFontSize(16);
          const schoolName = headerTemplate.schoolName || 'School Name';
          
          // For header text, try direct rendering first, then fallback to image
          try {
            doc.text(schoolName, 105, yPosition, { align: 'center' });
          } catch (headerTextError) {
            // Render header as image for Unicode support
            const headerImage = renderTextAsImage(schoolName, 16);
            if (headerImage) {
              doc.addImage(headerImage, 'PNG', 50, yPosition - 5, 100, 20);
            }
          }
          yPosition += 15;
          
          if (headerTemplate.examTitle) {
            doc.setFontSize(12);
            try {
              doc.text(headerTemplate.examTitle, 105, yPosition, { align: 'center' });
            } catch (titleError) {
              const titleImage = renderTextAsImage(headerTemplate.examTitle, 12);
              if (titleImage) {
                doc.addImage(titleImage, 'PNG', 50, yPosition - 5, 100, 15);
              }
            }
            yPosition += 12;
          }
          
          doc.setFontSize(10);
          const classText = `Class: ${headerTemplate.class || '__________'}`;
          const subjectText = `Subject: ${headerTemplate.subject || '__________'}`;
          
          try {
            doc.text(classText, 20, yPosition);
            doc.text(subjectText, 120, yPosition);
          } catch (detailsError) {
            const detailsImage = renderTextAsImage(`${classText}        ${subjectText}`, 10);
            if (detailsImage) {
              doc.addImage(detailsImage, 'PNG', 15, yPosition - 5, 170, 12);
            }
          }
          yPosition += 12;
          
          const dateText = `Date: ${headerTemplate.date || '__________'}`;
          const marksText = `Marks: ${headerTemplate.marks || '__________'}`;
          
          try {
            doc.text(dateText, 20, yPosition);
            doc.text(marksText, 120, yPosition);
          } catch (detailsError2) {
            const detailsImage2 = renderTextAsImage(`${dateText}        ${marksText}`, 10);
            if (detailsImage2) {
              doc.addImage(detailsImage2, 'PNG', 15, yPosition - 5, 170, 12);
            }
          }
          yPosition += 12;
          
          if (headerTemplate.time) {
            try {
              doc.text(`Time: ${headerTemplate.time}`, 120, yPosition);
            } catch (timeError) {
              const timeImage = renderTextAsImage(`Time: ${headerTemplate.time}`, 10);
              if (timeImage) {
                doc.addImage(timeImage, 'PNG', 115, yPosition - 5, 80, 12);
              }
            }
            yPosition += 12;
          }
          yPosition += 10;
        } catch (headerError) {
          console.warn('Error adding custom header:', headerError);
          doc.setFontSize(16);
          doc.text('Question Paper', 105, yPosition, { align: 'center' });
          yPosition += 20;
        }
      } else {
        // Default readymade template
        doc.setFontSize(16);
        doc.text('School Name', 105, yPosition, { align: 'center' });
        yPosition += 15;
        doc.setFontSize(10);
        doc.text('Class: __________', 20, yPosition);
        doc.text('Subject: __________', 120, yPosition);
        yPosition += 12;
        doc.text('Date: __________', 20, yPosition);
        doc.text('Marks: __________', 120, yPosition);
        yPosition += 12;
        doc.setFontSize(12);
        doc.text('Practice Worksheet', 105, yPosition, { align: 'center' });
        yPosition += 20;
      }

      // Enhanced question processing with proper formatting
      const lines = formattedQuestionsText.split('\n').filter(line => line.trim() !== '');
      let currentQuestionLines: string[] = [];
      let isCollectingQuestion = false;

      // Parse questions properly
      const questionBlocks: string[][] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this is the start of a new question
        if (/^Q\.\d+/.test(line)) {
          // Save previous question if exists
          if (currentQuestionLines.length > 0) {
            questionBlocks.push([...currentQuestionLines]);
          }
          // Start new question
          currentQuestionLines = [line];
          isCollectingQuestion = true;
        } else if (isCollectingQuestion && line) {
          // Add continuation lines to current question
          currentQuestionLines.push(line);
        }
      }
      
      // Don't forget the last question
      if (currentQuestionLines.length > 0) {
        questionBlocks.push([...currentQuestionLines]);
      }

      console.log('Parsed', questionBlocks.length, 'question blocks');

      // Process each question block
      for (let blockIndex = 0; blockIndex < questionBlocks.length; blockIndex++) {
        const questionBlock = questionBlocks[blockIndex];
        const questionLine = questionBlock[0]; // First line is the question
        const optionLines = questionBlock.slice(1); // Rest are options/answers
        
        // Check if we need a new page (accounting for question + options space)
        const estimatedHeight = containsHindi(questionLine) ? 20 : 12; // Question height
        const optionsHeight = optionLines.length * (containsHindi(optionLines.join('')) ? 8 : 6); // Options height
        const totalQuestionHeight = estimatedHeight + optionsHeight + 15; // Including spacing
        
        if (yPosition + totalQuestionHeight > 270) {
          doc.addPage();
          yPosition = 20;
          questionCount = 0;
        }

        // Render question text
        if (containsHindi(questionLine)) {
          // Use larger font for Hindi questions (14px instead of 11px)
          console.log('Hindi question detected:', questionLine);
          try {
            const questionImage = renderTextAsImage(questionLine, 14); // Larger font for Hindi
            if (questionImage) {
              const imageHeight = Math.max(16, Math.ceil(questionLine.length / 60) * 16);
              doc.addImage(questionImage, 'PNG', 15, yPosition, 170, imageHeight);
              yPosition += imageHeight + 2; // No extra space, options will be close
            } else {
              doc.setFontSize(14);
              doc.text('[Hindi content - please check original]', 20, yPosition);
              yPosition += 16;
            }
          } catch (hindiError) {
            console.error('Hindi question rendering failed:', hindiError);
            doc.setFontSize(14);
            doc.text('[Hindi content could not be displayed]', 20, yPosition);
            yPosition += 16;
          }
        } else {
          // English question - normal font size
          doc.setFontSize(12);
          try {
            doc.text(questionLine, 20, yPosition);
            yPosition += 12;
          } catch (englishError) {
            console.warn('English question rendering failed, trying image fallback:', englishError);
            try {
              const questionImage = renderTextAsImage(questionLine, 12);
              if (questionImage) {
                const imageHeight = Math.max(12, Math.ceil(questionLine.length / 70) * 12);
                doc.addImage(questionImage, 'PNG', 15, yPosition, 170, imageHeight);
                yPosition += imageHeight + 2;
              } else {
                doc.text('[Content could not be rendered]', 20, yPosition);
                yPosition += 12;
              }
            } catch (imageError) {
              doc.text('[Text content - see original file]', 20, yPosition);
              yPosition += 12;
            }
          }
        }

        // Process options horizontally if they exist
        if (optionLines.length > 0) {
          // Check if these are MCQ options (A), B), C), D))
          const mcqOptions = optionLines.filter(line => /^[A-Da-d]\)/.test(line.trim()));
          
          if (mcqOptions.length > 0) {
            // Format MCQ options horizontally
            const optionsText = mcqOptions.join('  ');
            
            if (containsHindi(optionsText)) {
              // Hindi options with larger font
              console.log('Hindi options detected:', optionsText);
              try {
                const optionsImage = renderTextAsImage(optionsText, 12); // Larger font for Hindi options
                if (optionsImage) {
                  const imageHeight = Math.max(12, Math.ceil(optionsText.length / 80) * 12);
                  doc.addImage(optionsImage, 'PNG', 25, yPosition, 160, imageHeight);
                  yPosition += imageHeight + 3;
                } else {
                  doc.setFontSize(12);
                  doc.text('[Hindi options - please check original]', 25, yPosition);
                  yPosition += 12;
                }
              } catch (hindiOptionsError) {
                console.error('Hindi options rendering failed:', hindiOptionsError);
                doc.setFontSize(12);
                doc.text('[Hindi options could not be displayed]', 25, yPosition);
                yPosition += 12;
              }
            } else {
              // English options
              doc.setFontSize(10);
              try {
                doc.text(optionsText, 25, yPosition);
                yPosition += 10;
              } catch (englishOptionsError) {
                console.warn('English options rendering failed, trying image fallback:', englishOptionsError);
                try {
                  const optionsImage = renderTextAsImage(optionsText, 10);
                  if (optionsImage) {
                    const imageHeight = Math.max(10, Math.ceil(optionsText.length / 90) * 10);
                    doc.addImage(optionsImage, 'PNG', 25, yPosition, 160, imageHeight);
                    yPosition += imageHeight + 2;
                  } else {
                    doc.text('[Options could not be rendered]', 25, yPosition);
                    yPosition += 10;
                  }
                } catch (imageError) {
                  doc.text('[Options - see original file]', 25, yPosition);
                  yPosition += 10;
                }
              }
            }
          } else {
            // Handle other types of option lines (not MCQ format)
            for (const optionLine of optionLines) {
              if (containsHindi(optionLine)) {
                try {
                  const optionImage = renderTextAsImage(optionLine, 11);
                  if (optionImage) {
                    const imageHeight = Math.max(10, Math.ceil(optionLine.length / 70) * 11);
                    doc.addImage(optionImage, 'PNG', 25, yPosition, 160, imageHeight);
                    yPosition += imageHeight + 2;
                  } else {
                    doc.setFontSize(11);
                    doc.text('[Hindi content]', 25, yPosition);
                    yPosition += 11;
                  }
                } catch (error) {
                  doc.setFontSize(11);
                  doc.text('[Hindi content]', 25, yPosition);
                  yPosition += 11;
                }
              } else {
                doc.setFontSize(10);
                try {
                  doc.text(optionLine, 25, yPosition);
                  yPosition += 8;
                } catch (error) {
                  doc.text('[Content]', 25, yPosition);
                  yPosition += 8;
                }
              }
            }
          }
        }

        // Add spacing between questions (1 line as requested)
        yPosition += 12;
        questionCount++;
        
        console.log(`Processed question ${questionCount}, yPosition: ${yPosition}`);
      }

      // Save and download the PDF
      doc.save('question-paper.pdf');
      console.log('PDF downloaded successfully!');
      alert('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try a different approach or contact support.');
    }
  };

  // Download as Word - Most compatible approach for docx 9.5.1
  const downloadAsWord = () => {
    if (!formattedQuestionsText || formattedQuestionsText.trim() === '') {
      alert('No questions available to download. Please complete the steps first.');
      return;
    }

    try {
      console.log('Starting Word document creation with basic approach...');

      // Prepare content strings
      const schoolName = headerType === 'custom' && headerTemplate.schoolName ? 
                         headerTemplate.schoolName : 'School Name';
      const examTitle = headerType === 'custom' && headerTemplate.examTitle ? 
                        headerTemplate.examTitle : '';
      const classText = headerType === 'custom' && headerTemplate.class ? 
                       headerTemplate.class : '__________';
      const subjectText = headerType === 'custom' && headerTemplate.subject ? 
                         headerTemplate.subject : '__________';
      const dateText = headerType === 'custom' && headerTemplate.date ? 
                      headerTemplate.date : '__________';
      const marksText = headerType === 'custom' && headerTemplate.marks ? 
                       headerTemplate.marks : '__________';
      const timeText = headerType === 'custom' && headerTemplate.time ? 
                      headerTemplate.time : '';

      console.log('Creating basic document structure...');

      // Create very simple document structure
      const children = [];

      // School name
      children.push(new Paragraph({
        children: [new TextRun({ text: schoolName, bold: true })],
        alignment: AlignmentType.CENTER
      }));

      // Exam title if available
      if (examTitle) {
        children.push(new Paragraph({
          children: [new TextRun({ text: examTitle, bold: true })],
          alignment: AlignmentType.CENTER
        }));
      }

      // Empty line
      children.push(new Paragraph({
        children: [new TextRun({ text: '' })]
      }));

      // Class and subject
      children.push(new Paragraph({
        children: [new TextRun({ text: `Class: ${classText}` })]
      }));
      
      children.push(new Paragraph({
        children: [new TextRun({ text: `Subject: ${subjectText}` })]
      }));

      // Date and marks
      children.push(new Paragraph({
        children: [new TextRun({ text: `Date: ${dateText}` })]
      }));
      
      children.push(new Paragraph({
        children: [new TextRun({ text: `Marks: ${marksText}` })]
      }));

      // Time if available
      if (timeText) {
        children.push(new Paragraph({
          children: [new TextRun({ text: `Time: ${timeText}` })]
        }));
      }

      // Empty lines
      children.push(new Paragraph({
        children: [new TextRun({ text: '' })]
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: '' })]
      }));

      // Add questions - split and filter lines
      const questionLines = formattedQuestionsText.trim().split('\n')
        .filter(line => line.trim() !== '');

      questionLines.forEach(line => {
        if (line.trim()) {
          children.push(new Paragraph({
            children: [new TextRun({ text: line.trim() })]
          }));
        }
      });

      console.log('Document structure created with', children.length, 'paragraphs');

      // Create document with minimal configuration
      const doc = new Document({
        sections: [{
          children: children
        }]
      });

      console.log('Generating buffer...');

      // Use Promise-based approach with better error handling
      Packer.toBuffer(doc)
        .then(buffer => {
          console.log('Buffer generated successfully, size:', buffer.byteLength);
          
          // Create and download file - Convert buffer to proper type
          const uint8Array = new Uint8Array(buffer);
          const blob = new Blob([uint8Array], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'question-paper.docx';
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log('Word document downloaded successfully!');
          alert('Word document downloaded successfully!');
        })
        .catch((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          const errorStack = error instanceof Error ? error.stack : '';
          
          console.error('Word generation error:', error);
          console.error('Error details:', errorMessage, errorStack);
          
          // Fallback to text file
          console.log('Word failed, creating text file fallback...');
          
          const textContent = `${schoolName}\n` +
                             (examTitle ? `${examTitle}\n` : '') +
                             '\n' +
                             `Class: ${classText}\n` +
                             `Subject: ${subjectText}\n` +
                             `Date: ${dateText}\n` +
                             `Marks: ${marksText}\n` +
                             (timeText ? `Time: ${timeText}\n` : '') +
                             '\n\n' +
                             formattedQuestionsText;
          
          const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'question-paper.txt';
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          alert(`Word document generation failed: ${errorMessage}. Text file downloaded instead.`);
        });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : '';
      
      console.error('Complete error in downloadAsWord:', error);
      console.error('Error details:', errorMessage, errorStack);
      
      // Final fallback
      try {
        const textContent = `${headerTemplate.schoolName || 'School Name'}\n\n` +
                           `Class: ${headerTemplate.class || '__________'}\n` +
                           `Subject: ${headerTemplate.subject || '__________'}\n` +
                           `Date: ${headerTemplate.date || '__________'}\n` +
                           `Marks: ${headerTemplate.marks || '__________'}\n` +
                           (headerTemplate.time ? `Time: ${headerTemplate.time}\n` : '') +
                           '\n\n' +
                           formattedQuestionsText;
        
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'question-paper.txt';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert(`Word document creation failed completely: ${errorMessage}. Text file downloaded instead.`);
      } catch (fallbackError: unknown) {
        const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown error occurred';
        console.error('All download methods failed:', fallbackError);
        alert(`Download failed completely. Error: ${errorMessage}`);
      }
    }
  };

  // Update question text
  const updateQuestionText = (id: number, text: string) => {
    setEditedQuestions(prev => 
      prev.map(q => q.id === id ? {...q, text} : q)
    );
  };

  // Update question type
  const updateQuestionType = (id: number, type: string) => {
    setEditedQuestions(prev => 
      prev.map(q => q.id === id ? {...q, type} : q)
    );
  };

  // Update option text
  const updateOptionText = (questionId: number, optionIndex: number, text: string) => {
    setEditedQuestions(prev => 
      prev.map(q => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = text;
          return {...q, options: newOptions};
        }
        return q;
      })
    );
  };

  // Render Step 1: Upload File
  const Step1 = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Upload className="mr-2" size={20} />
          Step 1: Upload Your Handwritten Worksheet
        </h2>
        <p className="text-blue-100 mt-1">Upload an image or PDF of your handwritten questions</p>
      </div>
      <div className="p-6">
        {/* OCR Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select OCR Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {ocrModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        
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
            Supports: Images (JPG, PNG, WebP) and PDFs
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
                  Try again
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
                  onClick={() => navigator.clipboard.writeText(extractedText)}
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
                Continue to Question Formatting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const [selectedFormattingModel, setSelectedFormattingModel] = useState('openai/gpt-4o-mini');

  // Render Step 2: Auto Question Formatting
  const Step2 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Auto Question Formatting</h2>
      <p className="text-gray-600 mb-6">Your questions have been automatically formatted</p>
      
      {loading && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-4"></div>
            <div>
              <p className="font-medium text-blue-800">Processing Your Questions</p>
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
                onClick={() => {
                  setError('');
                  processQuestions();
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {formattedQuestionsText ? (
        <div className="mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-green-800">
                Successfully formatted your questions!
              </span>
            </div>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Formatted Questions</h3>
              <button
                onClick={() => navigator.clipboard.writeText(formattedQuestionsText)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
              >
                Copy All
              </button>
            </div>
            <div className="bg-white p-4 rounded border text-sm font-mono text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto shadow-sm">
              {formattedQuestionsText}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                // Parse the formatted text into questions for the next steps
                const lines = formattedQuestionsText.split('\n').filter(line => line.trim() !== '');
                const parsedQuestions: Question[] = [];
                let currentQuestion: Question | null = null;
                let options: string[] = [];
                
                lines.forEach((line) => {
                  // Check if this line is a new question (starts with Q. or Question)
                  if (/^Q\.\d+/.test(line.trim())) {
                    // If we have a previous question, save it
                    if (currentQuestion) {
                      if (options.length > 0) {
                        (currentQuestion as Question).options = [...options];
                      }
                      parsedQuestions.push(currentQuestion);
                    }
                    
                    // Start a new question
                    currentQuestion = {
                      id: parsedQuestions.length + 1,
                      text: line.trim(),
                      type: 'Short Answer' // Default type, will be detected below
                    } as Question;
                    
                    // Reset options for new question
                    options = [];
                    
                    // Detect question type from the question text
                    if (/\b_____/.test(line)) {
                      (currentQuestion as Question).type = 'Fill in the blanks';
                    } else if (/\(True\/False\)/i.test(line)) {
                      (currentQuestion as Question).type = 'True/False';
                    }
                    // MCQs will be detected by the presence of options in subsequent lines
                  } 
                  // Check if this line contains options for an MCQ
                  else if (currentQuestion && /^[A-Da-d]\)/.test(line.trim())) {
                    // If it's an option line, add it to options
                    options.push(line.trim());
                    // Set question type to MCQ if not already set
                    if ((currentQuestion as Question).type === 'Short Answer') {
                      (currentQuestion as Question).type = 'MCQ';
                    }
                  }
                  // For other lines that are not options, add them to the question text
                  else if (currentQuestion && line.trim() !== '') {
                    // This shouldn't happen with the new formatting, but just in case
                    // we'll add any additional text to the question
                    (currentQuestion as Question).text += ' ' + line.trim();
                  }
                });
                
                // Don't forget the last question
                if (currentQuestion) {
                  if (options.length > 0) {
                    (currentQuestion as Question).options = [...options];
                  }
                  parsedQuestions.push(currentQuestion);
                }
                
                setQuestions(parsedQuestions);
                setEditedQuestions(parsedQuestions);
                setCurrentStep(3);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Choose Header
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Successfully extracted text from your worksheet. AI is now analyzing and formatting the questions.
            </p>
          </div>
          
          {/* Question Formatting Model Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Question Formatting Model</label>
            <select
              value={selectedFormattingModel}
              onChange={(e) => setSelectedFormattingModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {formattingModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={processQuestions}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Process Questions
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Render Step 3: Choose Header Template
  const Step3 = React.memo(() => {
    // Use refs for uncontrolled inputs to prevent page jumping
    const schoolNameRef = useRef<HTMLInputElement>(null);
    const examTitleRef = useRef<HTMLInputElement>(null);
    const classRef = useRef<HTMLInputElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const marksRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    // Initialize refs with current values
    React.useEffect(() => {
      if (schoolNameRef.current) schoolNameRef.current.value = headerTemplate.schoolName || '';
      if (examTitleRef.current) examTitleRef.current.value = headerTemplate.examTitle || '';
      if (classRef.current) classRef.current.value = headerTemplate.class || '';
      if (subjectRef.current) subjectRef.current.value = headerTemplate.subject || '';
      if (dateRef.current) dateRef.current.value = headerTemplate.date || '';
      if (marksRef.current) marksRef.current.value = headerTemplate.marks || '';
      if (timeRef.current) timeRef.current.value = headerTemplate.time || '';
    }, []);

    // Function to collect all input values when needed
    const collectFormData = React.useCallback(() => {
      setHeaderTemplate({
        ...headerTemplate,
        schoolName: schoolNameRef.current?.value || '',
        examTitle: examTitleRef.current?.value || '',
        class: classRef.current?.value || '',
        subject: subjectRef.current?.value || '',
        date: dateRef.current?.value || '',
        marks: marksRef.current?.value || '',
        time: timeRef.current?.value || ''
      });
    }, [headerTemplate]);

    if (isPreviewMode) {
      // Preview Mode - Show the completed header
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Header Preview</h2>
          <p className="text-gray-600 mb-6">Review your question paper header design</p>

          {/* Full Header Preview */}
          <div className="bg-gray-50 p-6 rounded-lg border mb-8">
            <div className="flex flex-col">
              {/* Top Row with Logo and Title */}
              <div className="flex items-start gap-4 mb-4">
                {/* Logo Section (Top Left) */}
                <div className="flex-shrink-0">
                  {headerTemplate.logo ? (
                    <img
                      src={headerTemplate.logo}
                      alt="School Logo"
                      className="w-20 h-20 object-contain border border-gray-300 rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-gray-400 rounded flex items-center justify-center bg-white">
                      <Palette className="text-gray-400" size={24} />
                    </div>
                  )}
                </div>

                {/* School Name and Exam Title */}
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {headerTemplate.schoolName || 'School Name'}
                  </h1>
                  {headerTemplate.examTitle && (
                    <h2 className="text-xl font-semibold text-gray-700">
                      {headerTemplate.examTitle}
                    </h2>
                  )}
                </div>
              </div>

              {/* Bottom Row with Fields */}
              <div className="grid grid-cols-2 gap-8 text-lg">
                <div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Class: </span>
                    <span className="text-gray-600">{headerTemplate.class || '__________'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subject: </span>
                    <span className="text-gray-600">{headerTemplate.subject || '__________'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Date: </span>
                    <span className="text-gray-600">{headerTemplate.date || '__________'}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Marks: </span>
                    <span className="text-gray-600">{headerTemplate.marks || '__________'}</span>
                  </div>
                  {headerTemplate.time && (
                    <div>
                      <span className="font-medium text-gray-700">Time: </span>
                      <span className="text-gray-600">{headerTemplate.time}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="px-6 py-3 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                Edit Header
              </button>
              <button
                onClick={() => {
                  setHeaderType('custom');
                  setCurrentStep(4);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue to Questions
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Form Mode - Fill all fields first
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Create Custom Header Template</h2>
        <p className="text-gray-600 mb-6">Fill in all the header fields, then preview your design</p>

        {/* Form Fields */}
        <div className="w-full max-w-none mx-auto space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              School Logo (80×80px recommended)
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex-shrink-0"
              >
                <Image size={32} className="text-gray-400" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-medium">Click to upload school logo</p>
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image for best results</p>
              </div>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {headerTemplate.logo && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Logo uploaded successfully
              </div>
            )}
          </div>

          {/* School Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name *
            </label>
            <input
              ref={schoolNameRef}
              type="text"
              placeholder="Enter your school name (e.g., ABC International School)"
              className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              style={{ width: '100%', boxSizing: 'border-box' }}
              onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
            />
          </div>

          {/* Exam Title (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Title (Optional)
            </label>
            <input
              ref={examTitleRef}
              type="text"
              placeholder="e.g., Unit Test, Final Exam, Practice Paper..."
              className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              style={{ width: '100%', boxSizing: 'border-box' }}
              onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
            />
          </div>

          {/* Left Side Fields */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Left Side Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <input
                  ref={classRef}
                  type="text"
                  placeholder="e.g., Grade 5, Class VIII, Standard IX..."
                  className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  ref={subjectRef}
                  type="text"
                  placeholder="e.g., Mathematics, Science, Social Studies..."
                  className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
            </div>
          </div>

          {/* Right Side Fields */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Right Side Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  ref={dateRef}
                  type="text"
                  placeholder="e.g., 15th March 2024, Monday 20 Jan..."
                  className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks *
                </label>
                <input
                  ref={marksRef}
                  type="text"
                  placeholder="e.g., 50, 100, Out of 25..."
                  className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time (Optional)
                </label>
                <input
                  ref={timeRef}
                  type="text"
                  placeholder="e.g., 2 Hours, 90 Minutes, 3:30 to 5:00..."
                  className="w-full min-w-0 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => {
              collectFormData();
              setIsPreviewMode(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Preview Header Design
          </button>
        </div>
      </div>
    );
  });

  // Render Step 4: Real-time Question Paper Preview with Editing
  const Step4 = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Step 4: Question Paper Preview & Edit</h2>
        <p className="text-blue-100 mt-1">Review and edit your formatted question paper in real-time</p>
      </div>
      <div className="p-6">
        {/* Header Preview */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg h-48 overflow-hidden">
          {headerType === 'upload' && uploadedHeader ? (
            <img src={uploadedHeader} alt="Header" className="w-full max-h-48 object-contain mx-auto" />
          ) : headerType === 'custom' ? (
            <div className="h-full flex flex-col">
              {/* Top Row with Logo and Title */}
              <div className="flex items-start gap-4 mb-2">
                {/* Logo Section (Top Left) */}
                <div className="flex-shrink-0">
                  {headerTemplate.logo ? (
                    <img
                      src={headerTemplate.logo}
                      alt="School Logo"
                      className="w-16 h-16 object-contain border border-gray-300 rounded"
                      style={{ minWidth: '64px', minHeight: '64px' }}
                    />
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded flex items-center justify-center bg-white">
                      <Palette className="text-gray-400" size={20} />
                    </div>
                  )}
                </div>

                {/* School Name and Exam Title */}
                <div className="flex-1 text-center">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {headerTemplate.schoolName || 'School Name'}
                  </h1>
                  {headerTemplate.examTitle && (
                    <h2 className="text-base font-semibold text-gray-700">
                      {headerTemplate.examTitle}
                    </h2>
                  )}
                </div>
              </div>

              {/* Bottom Row with Fields */}
              <div className="flex justify-between text-sm mt-auto">
                <div>
                  <div className="mb-1">
                    <span className="font-medium text-gray-700">Class: </span>
                    <span className="text-gray-600">{headerTemplate.class || '__________'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subject: </span>
                    <span className="text-gray-600">{headerTemplate.subject || '__________'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1">
                    <span className="font-medium text-gray-700">Date: </span>
                    <span className="text-gray-600">{headerTemplate.date || '__________'}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-medium text-gray-700">Marks: </span>
                    <span className="text-gray-600">{headerTemplate.marks || '__________'}</span>
                  </div>
                  {headerTemplate.time && (
                    <div>
                      <span className="font-medium text-gray-700">Time: </span>
                      <span className="text-gray-600">{headerTemplate.time}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">School Name</h1>
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div>Class: __________</div>
                  <div>Subject: __________</div>
                </div>
                <div className="text-right">
                  <div>Date: __________</div>
                  <div>Marks: __________</div>
                </div>
              </div>
              <div className="text-center text-sm mt-4 font-semibold">Practice Worksheet</div>
            </div>
          )}
        </div>
        
        {/* Questions Preview with Editing */}
        <div className="space-y-6">
          {editedQuestions.map((question) => (
            <div key={question.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-start mb-2">
                {/* Editable question text */}
                <span className="font-medium mr-2">Q.{question.id}</span>
                <input
                  type="text"
                  value={question.text.replace(/^Q\.\d+\s*/, '')}
                  onChange={(e) => updateQuestionText(question.id, `Q.${question.id} ${e.target.value}`)}
                  className="flex-1 font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1"
                />
              </div>
              
              {/* Editable options based on question type */}
              {question.type === 'MCQ' && (
                <div className="mt-2 ml-4 flex flex-wrap gap-4">
                  {question.options && question.options.map((option, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="mr-1 font-medium min-w-[20px] text-sm">{String.fromCharCode(65 + idx)})</span>
                      <input
                        type="text"
                        value={option.replace(/^[A-D]\)\s*/, '')}
                        onChange={(e) => updateOptionText(question.id, idx, `${String.fromCharCode(65 + idx)}) ${e.target.value}`)}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1 text-sm min-w-[80px] max-w-[120px]"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'Fill in the blanks' && (
                <div className="mt-2 ml-4">
                  <span className="text-sm">Answer: </span>
                  <input
                    type="text"
                    placeholder="______"
                    className="border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1 w-32"
                  />
                </div>
              )}
              
              {question.type === 'True/False' && (
                <div className="mt-2 ml-4 flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name={`trueFalse-${question.id}`} className="mr-1" />
                    True
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name={`trueFalse-${question.id}`} className="mr-1" />
                    False
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(3)}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Header Selection
          </button>
          <button
            onClick={() => setCurrentStep(5)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue to Download
          </button>
        </div>
      </div>
    </div>
  );

  // Render Step 5: Download Options
  const Step5 = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 5: Download Your Question Paper</h2>
      <p className="text-gray-600 mb-6">Choose your preferred format for downloading</p>
      
      <div className="flex flex-col items-center py-8">
        <div className="bg-gray-100 rounded-full p-4 mb-6">
          <FileText size={48} className="text-blue-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Question Paper is Ready!</h3>
        <p className="text-gray-600 text-center mb-8">
          Download your formatted question paper in your preferred format
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={downloadAsPDF}
            className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Download className="mr-2" size={20} />
            Download as PDF
          </button>
          <button
            onClick={downloadAsWord}
            className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Download className="mr-2" size={20} />
            Download as Word
          </button>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(4)}
          className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Preview & Edit
        </button>
        <button
          onClick={() => setCurrentStep(1)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <Edit3 className="mr-2" size={18} />
          Create Another Paper
        </button>
      </div>
    </div>
  );


  // Stepper component
  const Stepper = () => (
    <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep > step ? 'bg-blue-500 text-white' :
            currentStep === step ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' :
            'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 5 && <div className={`w-12 h-1 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} />}
          <span className={`text-sm ml-2 ${currentStep === step ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
            {step === 1 && 'Upload'}
            {step === 2 && 'Format'}
            {step === 3 && 'Header'}
            {step === 4 && 'Questions'}
            {step === 5 && 'Download'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kids/School Question Paper Generator
        </h1>
        <p className="text-lg text-gray-600">
          Create formatted question papers from handwritten worksheets
        </p>
      </div>
      
      <Stepper />
      
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
      {currentStep === 4 && <Step4 />}
      {currentStep === 5 && <Step5 />}
    </div>
  );
}
