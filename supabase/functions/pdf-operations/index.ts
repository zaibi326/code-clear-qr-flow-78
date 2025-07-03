
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFOperationRequest {
  operation: 'extract-text' | 'edit-text' | 'add-annotations' | 'fill-form' | 'add-qr-code' | 'export-pdf';
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
      case 'edit-text':
        result = await editPDFText(apiKey, fileUrl, fileData, options);
        break;
      case 'add-annotations':
        result = await addPDFAnnotations(apiKey, fileUrl, fileData, options);
        break;
      case 'fill-form':
        result = await fillPDFForm(apiKey, fileUrl, fileData, options);
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
  console.log('Adding PDF annotations');
  
  const requestBody: any = {
    annotations: options?.annotations || [],
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

async function fillPDFForm(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Filling PDF form');
  
  const requestBody: any = {
    fields: options?.fields || {},
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
      pages: options?.pages || "1"
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
