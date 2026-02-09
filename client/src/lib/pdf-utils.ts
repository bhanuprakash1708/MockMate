export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // First try to extract text using a simple approach
    const text = await extractPDFTextSimple(arrayBuffer);
    
    if (text && text.length > 100) {
      return text;
    }
    
    // If simple extraction fails, inform user
    throw new Error('Could not extract text from this PDF. Please ensure the PDF contains selectable text (not scanned images).');
    
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the PDF contains readable text and try again.');
  }
};

const extractPDFTextSimple = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Try to extract text using basic PDF parsing
    let text = '';
    
    // Look for text streams in the PDF
    const decoder = new TextDecoder('latin1');
    const pdfData = decoder.decode(uint8Array);
    
    // Basic regex to find text content between stream objects
    const streamRegex = /stream[\s\S]*?endstream/g;
    const streams = pdfData.match(streamRegex) || [];
    
    for (const stream of streams) {
      // Look for text operators like BT...ET (Begin Text...End Text)
      const textRegex = /BT[\s\S]*?ET/g;
      const textBlocks = stream.match(textRegex) || [];
      
      for (const block of textBlocks) {
        // Extract text from Tj operators
        const tjRegex = /\((.*?)\)\s*Tj/g;
        let match;
        while ((match = tjRegex.exec(block)) !== null) {
          text += match[1] + ' ';
        }
        
        // Extract text from TJ operators (text array)
        const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
        while ((match = tjArrayRegex.exec(block)) !== null) {
          // Parse the array and extract strings
          const arrayContent = match[1];
          const stringRegex = /\((.*?)\)/g;
          let stringMatch;
          while ((stringMatch = stringRegex.exec(arrayContent)) !== null) {
            text += stringMatch[1] + ' ';
          }
        }
      }
    }
    
    // Clean up the extracted text
    text = text
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\s+/g, ' ')
      .trim();
    
    return text;
  } catch (error) {
    throw new Error('Failed to parse PDF content');
  }
};

// Alternative: If the above doesn't work well, we can use FileReader to read as text
export const extractTextFromPDFAlternative = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        
        if (!result) {
          reject(new Error('Could not read file content'));
          return;
        }
        
        // Basic text extraction from PDF string
        let text = result;
        
        // Remove PDF headers and binary content
        text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, '');
        
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length < 50) {
          reject(new Error('Could not extract sufficient text from PDF'));
          return;
        }
        
        resolve(text);
      } catch (error) {
        reject(new Error('Error processing PDF content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file, 'utf-8');
  });
};
