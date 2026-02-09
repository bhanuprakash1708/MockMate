import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const createSamplePDF = async (): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();
  
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const page = pdfDoc.addPage([612, 792]); // Standard letter size
  
  const { width, height } = page.getSize();
  
  // Title
  page.drawText('The Science of Artificial Intelligence', {
    x: 50,
    y: height - 100,
    size: 24,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Content
  const content = `
Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

Machine Learning is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it to learn for themselves.

Deep Learning is a subset of machine learning that uses artificial neural networks with multiple layers (hence "deep") to model and understand complex patterns in data. It has been particularly successful in areas such as image recognition, natural language processing, and speech recognition.

Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret and manipulate human language. NLP draws from many disciplines, including computer science and computational linguistics.

Computer Vision is a field of AI that trains computers to interpret and understand the visual world. Using digital images from cameras and videos and deep learning models, machines can accurately identify and classify objects.

The future of AI holds tremendous potential for transforming various industries including healthcare, finance, transportation, and education. However, it also raises important questions about ethics, privacy, and the impact on employment.

Key AI technologies include:
- Neural Networks
- Expert Systems
- Fuzzy Logic
- Genetic Algorithms
- Robotics
- Computer Vision
- Natural Language Processing

AI applications are everywhere in modern life, from recommendation systems on streaming platforms to autonomous vehicles, virtual assistants, and medical diagnosis systems.
`;

  const lines = content.trim().split('\n');
  let yPosition = height - 150;
  
  for (const line of lines) {
    if (yPosition < 50) {
      // Add new page if needed
      const newPage = pdfDoc.addPage([612, 792]);
      yPosition = height - 50;
      
      newPage.drawText(line.trim(), {
        x: 50,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      });
    } else {
      page.drawText(line.trim(), {
        x: 50,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      });
    }
    yPosition -= 20;
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const downloadSamplePDF = async () => {
  const pdfBlob = await createSamplePDF();
  const url = URL.createObjectURL(pdfBlob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-ai-document.pdf';
  a.click();
  
  URL.revokeObjectURL(url);
};
