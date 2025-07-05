import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFOperationRequest {
  operation: 'extract-text' | 'edit-text' | 'add-annotations' | 'fill-form' | 'add-qr-code' | 'export-pdf' | 'extract-for-editing' | 'replace-with-edited' | 'extract-form-fields';
  fileUrl?: string;
  fileData?: string;
  options?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('PDF operations function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, fileUrl, fileData, options }: PDFOperationRequest = await req.json();
    const apiKey = Deno.env.get('PDFCO_API_KEY');

    if (!apiKey) {
      throw new Error('PDF.co API key not configured');
    }

    console.log(`Processing PDF operation: ${operation}`);

    let result;
    switch (operation) {
      case 'extract-text':
        result = await extractTextFromPDF(apiKey, fileUrl, fileData, options);
        break;
      case 'extract-for-editing':
        result = await extractForRichEditing(apiKey, fileUrl, fileData, options);
        break;
      case 'replace-with-edited':
        result = await replaceWithEditedText(apiKey, fileUrl, fileData, options);
        break;
      case 'edit-text':
        result = await editPDFText(apiKey, fileUrl, fileData, options);
        break;
      case 'add-annotations':
        result = await addPDFAnnotations(apiKey, fileUrl, fileData, options);
        break;
      case 'fill-form':
        result = await fillPDFForm(apiKey, fileUrl, fileData, options);
        break;
      case 'extract-form-fields':
        result = await extractFormFields(apiKey, fileUrl, fileData, options);
        break;
      case 'add-qr-code':
        result = await addQRCodeToPDF(apiKey, fileUrl, fileData, options);
        break;
      case 'export-pdf':
        result = await exportPDF(apiKey, fileUrl, fileData, options);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in PDF operations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function extractTextFromPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Extracting text from PDF');
  
  const requestBody: any = {
    pages: options?.pages || "1-",
    ocrLanguage: options?.ocrLanguage || "eng",
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Text extraction result:', result);

  if (!result.error) {
    return {
      success: true,
      text: result.body,
      pages: result.pageCount,
      url: result.url
    };
  } else {
    throw new Error(result.message || 'Failed to extract text from PDF');
  }
}

async function extractForRichEditing(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Extracting text for rich editing');
  
  // Use the same text extraction but with additional formatting preservation
  const requestBody: any = {
    pages: options?.pages || "1-",
    ocrLanguage: options?.ocrLanguage || "eng",
    preserveFormatting: true,
    includeTextFormatting: true,
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Rich text extraction result:', result);

  if (!result.error) {
    return {
      success: true,
      text: result.body,
      extractedContent: result,
      pages: result.pageCount,
      url: result.url
    };
  } else {
    throw new Error(result.message || 'Failed to extract text for editing');
  }
}

async function replaceWithEditedText(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Replacing PDF content with edited text');
  
  // For now, we'll use the text replacement API
  // In a full implementation, this would involve more sophisticated text layout preservation
  const requestBody: any = {
    searchStrings: [""], // Replace all content
    replaceStrings: [options?.editedContent || ""],
    caseSensitive: false,
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/edit/replace-text', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Text replacement result:', result);

  if (!result.error) {
    return {
      success: true,
      url: result.url,
      replacements: result.replacements
    };
  } else {
    throw new Error(result.message || 'Failed to replace text in PDF');
  }
}

async function editPDFText(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Editing PDF text');
  
  const requestBody: any = {
    searchStrings: options?.searchStrings || [],
    replaceStrings: options?.replaceStrings || [],
    caseSensitive: options?.caseSensitive || false,
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/edit/replace-text', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Text editing result:', result);

  if (!result.error) {
    return {
      success: true,
      url: result.url,
      replacements: result.replacements
    };
  } else {
    throw new Error(result.message || 'Failed to edit PDF text');
  }
}

async function addPDFAnnotations(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Adding PDF annotations and shapes');
  
  // Transform annotations and shapes into PDF.co format
  const annotations = (options?.annotations || []).map((annotation: any) => {
    if (annotation.type === 'highlight') {
      return {
        type: "highlight",
        x: annotation.x,
        y: annotation.y,
        width: annotation.width,
        height: annotation.height,
        pages: annotation.pages || "1",
        color: annotation.color || { r: 1, g: 1, b: 0 }
      };
    } else if (annotation.type === 'rectangle') {
      return {
        type: "rectangle",
        x: annotation.x,
        y: annotation.y,
        width: annotation.width,
        height: annotation.height,
        pages: annotation.pages || "1",
        fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
        strokeColor: annotation.strokeColor || { r: 0, g: 0, b: 1 },
        strokeWidth: annotation.strokeWidth || 2
      };
    } else if (annotation.type === 'circle') {
      return {
        type: "ellipse",
        x: annotation.x,
        y: annotation.y,
        width: annotation.width,
        height: annotation.height,
        pages: annotation.pages || "1",
        fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
        strokeColor: annotation.strokeColor || { r: 0, g: 0, b: 1 },
        strokeWidth: annotation.strokeWidth || 2
      };
    } else {
      // Default to rectangle for unknown types
      return {
        type: "rectangle",
        x: annotation.x,
        y: annotation.y,
        width: annotation.width || 100,
        height: annotation.height || 100,
        pages: annotation.pages || "1",
        fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
        strokeColor: annotation.strokeColor || { r: 0, g: 0, b: 1 },
        strokeWidth: annotation.strokeWidth || 2
      };
    }
  });

  const requestBody: any = {
    annotations: annotations,
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/edit/add', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Annotation result:', result);

  if (!result.error) {
    return {
      success: true,
      url: result.url
    };
  } else {
    throw new Error(result.message || 'Failed to add annotations to PDF');
  }
}

async function extractFormFields(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Extracting form fields from PDF');
  
  const requestBody: any = {
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/info', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Form fields extraction result:', result);

  if (!result.error) {
    // Extract form fields from the PDF info
    const formFields = result.fields || [];
    return {
      success: true,
      formFields: formFields.map((field: any, index: number) => ({
        name: field.name || `Field_${index}`,
        type: getFormFieldType(field.type),
        required: field.required || false,
        options: field.options || [],
        value: field.value || '',
        x: field.rect ? field.rect[0] : 0,
        y: field.rect ? field.rect[1] : 0,
        width: field.rect ? field.rect[2] - field.rect[0] : 100,
        height: field.rect ? field.rect[3] - field.rect[1] : 30
      }))
    };
  } else {
    throw new Error(result.message || 'Failed to extract form fields from PDF');
  }
}

function getFormFieldType(pdfFieldType: string): string {
  switch (pdfFieldType) {
    case 'Tx': return 'text';
    case 'Btn': return 'checkbox';
    case 'Ch': return 'select';
    default: return 'text';
  }
}

async function fillPDFForm(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Filling PDF form');
  
  // Convert form data to PDF.co format
  const annotations = Object.entries(options?.fields || {}).map(([fieldName, value], index) => ({
    type: "textbox",
    text: String(value),
    x: 100 + (index * 20), // Simple positioning - in real implementation, use actual field positions
    y: 100 + (index * 30),
    width: 200,
    height: 25,
    pages: "1",
    fontName: "Helvetica",
    fontSize: 12
  }));

  const requestBody: any = {
    annotations: annotations,
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/edit/add', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('Form filling result:', result);

  if (!result.error) {
    return {
      success: true,
      url: result.url
    };
  } else {
    throw new Error(result.message || 'Failed to fill PDF form');
  }
}

async function addQRCodeToPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Adding QR code to PDF');
  
  const requestBody: any = {
    annotations: [{
      type: "qrcode",
      text: options?.qrText || "https://example.com",
      x: options?.x || 100,
      y: options?.y || 100,
      size: options?.size || 100,
      pages: options?.pages || "1",
      foregroundColor: options?.foregroundColor || "#000000",
      backgroundColor: options?.backgroundColor || "#FFFFFF"
    }],
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const response = await fetch('https://api.pdf.co/v1/pdf/edit/add', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('QR code addition result:', result);

  if (!result.error) {
    return {
      success: true,
      url: result.url
    };
  } else {
    throw new Error(result.message || 'Failed to add QR code to PDF');
  }
}

async function exportPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Exporting PDF');
  
  // For export, we'll just return the processed PDF URL
  return {
    success: true,
    url: fileUrl || fileData,
    format: options?.format || 'pdf'
  };
}

serve(handler);
