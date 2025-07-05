import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFOperationRequest {
  operation: 'extract-text' | 'edit-text' | 'add-annotations' | 'fill-form' | 'add-qr-code' | 'export-pdf' | 'extract-for-editing' | 'replace-with-edited' | 'extract-form-fields' | 'finalize-pdf' | 'test-api-key';
  fileUrl?: string;
  fileData?: string;
  options?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 PDF operations function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, fileUrl, fileData, options }: PDFOperationRequest = await req.json();
    const apiKey = Deno.env.get('PDFCO_API_KEY');

    console.log('📋 Request details:', {
      operation,
      hasFileUrl: !!fileUrl,
      hasFileData: !!fileData,
      fileUrlLength: fileUrl?.length || 0,
      fileDataLength: fileData?.length || 0,
      options,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0
    });

    if (!apiKey) {
      console.error('❌ PDF.co API key not configured');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'PDF.co API key not configured. Please add PDFCO_API_KEY to your environment variables.',
          statusCode: 500,
          debugInfo: {
            operation,
            timestamp: new Date().toISOString(),
            issue: 'Missing API key'
          }
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`🔄 Processing PDF operation: ${operation}`);

    let result;
    switch (operation) {
      case 'test-api-key':
        result = await testApiKey(apiKey);
        break;
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
      case 'finalize-pdf':
        result = await finalizePDF(apiKey, fileUrl, fileData, options);
        break;
      case 'export-pdf':
        result = await exportPDF(apiKey, fileUrl, fileData, options);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    console.log('✅ Operation completed successfully:', { operation, success: result.success });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('💥 Error in PDF operations function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        statusCode: 500,
        debugInfo: {
          timestamp: new Date().toISOString(),
          errorStack: error.stack,
          errorName: error.name
        }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function testApiKey(apiKey: string) {
  console.log('🧪 Testing PDF.co API key');
  
  try {
    const response = await fetch('https://api.pdf.co/v1/info', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      }
    });

    const responseText = await response.text();
    console.log(`📥 API key test response (${response.status}):`, responseText);

    if (!response.ok) {
      return {
        success: false,
        error: `API key test failed: ${response.status} ${response.statusText}`,
        statusCode: response.status,
        debugInfo: {
          responseBody: responseText,
          headers: Object.fromEntries(response.headers.entries())
        }
      };
    }

    const result = JSON.parse(responseText);
    return {
      success: true,
      message: 'PDF.co API key is valid',
      debugInfo: {
        apiInfo: result,
        statusCode: response.status
      }
    };
  } catch (error: any) {
    console.error('💥 API key test failed:', error);
    return {
      success: false,
      error: `API key test error: ${error.message}`,
      statusCode: 500,
      debugInfo: { errorStack: error.stack }
    };
  }
}

async function makeApiRequest(url: string, apiKey: string, requestBody: any, operation: string) {
  console.log(`📡 Making ${operation} API request to PDF.co:`, { 
    url, 
    hasUrl: !!requestBody.url,
    hasFile: !!requestBody.file,
    bodySize: JSON.stringify(requestBody).length,
    requestBody: { ...requestBody, file: requestBody.file ? '[base64 data]' : undefined }
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log(`📥 PDF.co response (${response.status}) for ${operation}:`, {
      status: response.status,
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 500)
    });

    if (!response.ok) {
      console.error(`❌ HTTP error ${response.status} for ${operation}:`, responseText);
      return {
        success: false,
        error: `PDF.co API returned ${response.status}: ${responseText}`,
        statusCode: response.status,
        debugInfo: {
          operation,
          url,
          requestBodyKeys: Object.keys(requestBody),
          responseBody: responseText,
          responseHeaders: Object.fromEntries(response.headers.entries())
        }
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON response for ${operation}:`, parseError);
      return {
        success: false,
        error: `Invalid JSON response from PDF.co API: ${responseText.substring(0, 200)}`,
        statusCode: response.status,
        debugInfo: {
          operation,
          parseError: parseError.message,
          responseText: responseText.substring(0, 500)
        }
      };
    }
    
    if (result.error) {
      console.error(`❌ PDF.co API error for ${operation}:`, result);
      return {
        success: false,
        error: result.message || `PDF.co API error: ${result.error}`,
        statusCode: response.status,
        debugInfo: {
          pdfcoError: result,
          operation,
          url,
          requestBodyKeys: Object.keys(requestBody)
        }
      };
    }

    console.log(`✅ ${operation} completed successfully:`, {
      hasUrl: !!result.url,
      hasBody: !!result.body,
      pageCount: result.pageCount
    });

    return {
      success: true,
      ...result,
      statusCode: response.status,
      debugInfo: {
        operation,
        requestBodyKeys: Object.keys(requestBody),
        responseStatus: response.status
      }
    };
  } catch (error: any) {
    console.error(`💥 ${operation} API request failed:`, error);
    return {
      success: false,
      error: `Network error during ${operation}: ${error.message}`,
      statusCode: 500,
      debugInfo: {
        operation,
        url,
        requestBodyKeys: Object.keys(requestBody || {}),
        errorStack: error.stack
      }
    };
  }
}

async function extractTextFromPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('📄 Extracting text from PDF with enhanced OCR options:', options);
  
  if (!fileUrl && !fileData) {
    throw new Error('Either fileUrl or fileData must be provided');
  }
  
  const requestBody: any = {
    pages: options?.pages || "1-",
    ocrLanguage: options?.ocrLanguage || "eng",
    // Force OCR processing for better text extraction
    ocr: true,
    ocrAccuracy: "balanced",
    ocrWorker: "auto",
    inline: true,
    async: false
  };

  // Use fileUrl if available, otherwise use fileData
  if (fileUrl) {
    requestBody.url = fileUrl;
    console.log('📋 Using URL for text extraction:', fileUrl.substring(0, 100) + '...');
  } else if (fileData) {
    requestBody.file = fileData;
    console.log('📋 Using base64 file data for text extraction, length:', fileData.length);
  }

  console.log('📋 Text extraction request details:', {
    hasUrl: !!requestBody.url,
    hasFile: !!requestBody.file,
    pages: requestBody.pages,
    ocrLanguage: requestBody.ocrLanguage,
    ocrAccuracy: requestBody.ocrAccuracy,
    ocrWorker: requestBody.ocrWorker,
    ocr: requestBody.ocr,
    inline: requestBody.inline
  });

  const result = await makeApiRequest(
    'https://api.pdf.co/v1/pdf/convert/to/text',
    apiKey,
    requestBody,
    'text extraction'
  );

  if (result.success) {
    console.log('✅ Text extraction successful:', {
      textLength: result.body?.length || 0,
      pageCount: result.pageCount
    });
    
    return {
      success: true,
      text: result.body || '',
      pages: result.pageCount || 0,
      url: result.url,
      statusCode: result.statusCode,
      debugInfo: result.debugInfo
    };
  }

  return result;
}

async function editPDFText(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('✏️ Editing PDF text with enhanced options:', {
    hasSearchStrings: !!options?.searchStrings,
    hasReplaceStrings: !!options?.replaceStrings,
    searchCount: options?.searchStrings?.length || 0,
    replaceCount: options?.replaceStrings?.length || 0,
    caseSensitive: options?.caseSensitive,
    matchCase: options?.matchCase,
    replaceAll: options?.replaceAll
  });
  
  if (!options?.searchStrings || !options?.replaceStrings) {
    throw new Error('Search and replace strings are required for text editing');
  }

  // Validate search/replace arrays
  if (!Array.isArray(options.searchStrings) || !Array.isArray(options.replaceStrings)) {
    throw new Error('Search and replace strings must be arrays');
  }

  if (options.searchStrings.length !== options.replaceStrings.length) {
    throw new Error('Search and replace arrays must have the same length');
  }

  // Filter out empty search strings and validate
  const validPairs = options.searchStrings
    .map((search: string, index: number) => ({ 
      search: String(search || '').trim(), 
      replace: String(options.replaceStrings[index] || '') 
    }))
    .filter((pair: any) => pair.search.length > 0);

  if (validPairs.length === 0) {
    throw new Error('At least one non-empty search string is required');
  }

  console.log('📋 Validated search/replace pairs:', validPairs.map(p => ({
    search: p.search.substring(0, 50),
    replace: p.replace.substring(0, 50)
  })));

  const requestBody: any = {
    searchStrings: validPairs.map((pair: any) => pair.search),
    replaceStrings: validPairs.map((pair: any) => pair.replace),
    caseSensitive: options.caseSensitive || false,
    matchCase: options.matchCase !== false,
    wholeWordsOnly: false,
    replaceAll: true,
    async: false
  };

  // Use fileUrl if available, otherwise use fileData
  if (fileUrl) {
    requestBody.url = fileUrl;
    console.log('📋 Using URL for text editing:', fileUrl.substring(0, 100) + '...');
  } else if (fileData) {
    requestBody.file = fileData;
    console.log('📋 Using base64 file data for text editing, length:', fileData.length);
  }

  console.log('📋 Text editing request details:', {
    hasUrl: !!requestBody.url,
    hasFile: !!requestBody.file,
    searchCount: requestBody.searchStrings.length,
    replaceCount: requestBody.replaceStrings.length,
    caseSensitive: requestBody.caseSensitive,
    matchCase: requestBody.matchCase,
    wholeWordsOnly: requestBody.wholeWordsOnly,
    replaceAll: requestBody.replaceAll
  });

  const result = await makeApiRequest(
    'https://api.pdf.co/v1/pdf/edit/replace-text',
    apiKey,
    requestBody,
    'text editing'
  );

  if (result.success) {
    console.log('✅ Text editing successful:', {
      replacements: result.replacements || 0,
      hasUrl: !!result.url
    });
    
    return {
      success: true,
      url: result.url,
      replacements: result.replacements || 0,
      statusCode: result.statusCode,
      debugInfo: result.debugInfo
    };
  }

  return result;
}

async function extractForRichEditing(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('📝 Extracting text for rich editing');
  
  const requestBody: any = {
    pages: options?.pages || "1-",
    ocrLanguage: options?.ocrLanguage || "eng",
    preserveFormatting: true,
    includeTextFormatting: true,
    async: false,
    url: fileUrl,
    file: fileData
  };

  // Remove undefined values
  Object.keys(requestBody).forEach(key => {
    if (requestBody[key] === undefined) {
      delete requestBody[key];
    }
  });

  const result = await makeApiRequest(
    'https://api.pdf.co/v1/pdf/convert/to/text',
    apiKey,
    requestBody,
    'rich text extraction'
  );

  if (result.success) {
    return {
      success: true,
      text: result.body,
      extractedContent: result,
      pages: result.pageCount,
      url: result.url,
      statusCode: result.statusCode,
      debugInfo: result.debugInfo
    };
  }

  return result;
}

async function addPDFAnnotations(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('🎨 Adding PDF annotations with options:', options);
  
  if (!options?.annotations || !Array.isArray(options.annotations)) {
    throw new Error('Annotations array is required');
  }

  // Simplified annotation format for PDF.co API
  const annotations = options.annotations.map((annotation: any) => {
    const baseAnnotation = {
      x: Number(annotation.x || 100),
      y: Number(annotation.y || 100),
      width: Number(annotation.width || 100),
      height: Number(annotation.height || 100),
      pages: String(annotation.pages || "1")
    };

    // Use simple annotation format
    switch (annotation.type) {
      case 'highlight':
        return {
          ...baseAnnotation,
          type: "highlight",
          color: "yellow"
        };
      case 'rectangle':
        return {
          ...baseAnnotation,
          type: "rectangle",
          fillColor: "lightblue",
          strokeColor: "blue"
        };
      case 'circle':
      case 'ellipse':
        return {
          ...baseAnnotation,
          type: "ellipse",
          fillColor: "lightgreen",
          strokeColor: "green"
        };
      default:
        return {
          ...baseAnnotation,
          type: "rectangle",
          fillColor: "lightgray",
          strokeColor: "black"
        };
    }
  });

  console.log('📋 Formatted annotations for PDF.co:', annotations);

  const requestBody: any = {
    annotations: annotations,
    async: false
  };

  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  const result = await makeApiRequest(
    'https://api.pdf.co/v1/pdf/edit/add',
    apiKey,
    requestBody,
    'annotations'
  );

  if (result.success) {
    return {
      success: true,
      url: result.url,
      statusCode: result.statusCode,
      debugInfo: result.debugInfo
    };
  }

  return result;
}

async function addQRCodeToPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('📱 Adding QR code to PDF with simplified approach:', options);
  
  if (!options?.qrText) {
    throw new Error('QR code text is required');
  }

  // Use a much simpler approach for QR code insertion
  const requestBody: any = {
    url: fileUrl,
    file: fileData,
    async: false,
    // Simplified QR code parameters that are more likely to work
    qrCodeText: String(options.qrText).trim(),
    qrCodeX: Number(options.x || 100),
    qrCodeY: Number(options.y || 100),
    qrCodeSize: Number(options.size || 100),
    pages: String(options.pages || "1")
  };

  // Remove undefined values to avoid API issues
  Object.keys(requestBody).forEach(key => {
    if (requestBody[key] === undefined) {
      delete requestBody[key];
    }
  });

  console.log('📋 Simplified QR request for PDF.co:', requestBody);

  try {
    // Try the dedicated QR code endpoint first
    let response = await fetch('https://api.pdf.co/v1/pdf/edit/add-qr-code', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    let responseText = await response.text();
    console.log(`📥 QR code endpoint response (${response.status}):`, responseText);

    // If the dedicated endpoint doesn't exist, fall back to the general add endpoint
    if (response.status === 404 || responseText.includes('not found')) {
      console.log('🔄 Falling back to general add endpoint');
      
      const fallbackBody = {
        url: fileUrl,
        file: fileData,
        async: false,
        annotations: [{
          type: "qrcode",
          text: String(options.qrText).trim(),
          x: Number(options.x || 100),
          y: Number(options.y || 100),
          size: Number(options.size || 100),
          pages: String(options.pages || "1")
        }]
      };

      // Remove undefined values
      Object.keys(fallbackBody).forEach(key => {
        if (fallbackBody[key] === undefined) {
          delete fallbackBody[key];
        }
      });

      response = await fetch('https://api.pdf.co/v1/pdf/edit/add', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackBody),
      });

      responseText = await response.text();
      console.log(`📥 Fallback response (${response.status}):`, responseText);
    }

    if (!response.ok) {
      console.error(`❌ HTTP error ${response.status} for QR code:`, responseText);
      return {
        success: false,
        error: `PDF.co API returned ${response.status}: ${responseText}`,
        statusCode: response.status,
        debugInfo: {
          operation: 'QR code insertion',
          requestBodyKeys: Object.keys(requestBody),
          responseBody: responseText,
          responseHeaders: Object.fromEntries(response.headers.entries())
        }
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON response for QR code:`, parseError);
      return {
        success: false,
        error: `Invalid JSON response from PDF.co API: ${responseText.substring(0, 200)}`,
        statusCode: response.status,
        debugInfo: {
          operation: 'QR code insertion',
          parseError: parseError.message,
          responseText: responseText.substring(0, 500)
        }
      };
    }
    
    if (result.error) {
      console.error(`❌ PDF.co API error for QR code:`, result);
      return {
        success: false,
        error: result.message || `PDF.co API error: ${result.error}`,
        statusCode: response.status,
        debugInfo: {
          pdfcoError: result,
          operation: 'QR code insertion',
          requestBodyKeys: Object.keys(requestBody)
        }
      };
    }

    console.log(`✅ QR code insertion completed successfully:`, {
      hasUrl: !!result.url,
      hasBody: !!result.body
    });

    return {
      success: true,
      url: result.url,
      statusCode: response.status,
      debugInfo: {
        operation: 'QR code insertion',
        requestBodyKeys: Object.keys(requestBody),
        responseStatus: response.status
      }
    };
  } catch (error: any) {
    console.error(`💥 QR code insertion API request failed:`, error);
    return {
      success: false,
      error: `Network error during QR code insertion: ${error.message}`,
      statusCode: 500,
      debugInfo: {
        operation: 'QR code insertion',
        requestBodyKeys: Object.keys(requestBody || {}),
        errorStack: error.stack
      }
    };
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

async function finalizePDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Finalizing PDF with all modifications');
  
  const modifications = options || {};
  const annotations: any[] = [];
  
  // Add text modifications as annotations
  if (modifications.textChanges && modifications.textChanges.length > 0) {
    console.log('Processing text changes:', modifications.textChanges.length);
    // For now, we'll handle text changes through the existing text replacement API
    // In a production environment, you'd want more sophisticated text positioning
  }
  
  // Add shape and annotation modifications
  if (modifications.annotations && modifications.annotations.length > 0) {
    console.log('Processing annotations:', modifications.annotations.length);
    annotations.push(...modifications.annotations.map((annotation: any) => ({
      type: annotation.type || "rectangle",
      x: annotation.x || 100,
      y: annotation.y || 100,
      width: annotation.width || 100,
      height: annotation.height || 100,
      pages: annotation.pages || "1",
      fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
      strokeColor: annotation.strokeColor || { r: 0, g: 0, b: 1 },
      strokeWidth: annotation.strokeWidth || 2
    })));
  }
  
  // Add QR code modifications
  if (modifications.qrCodes && modifications.qrCodes.length > 0) {
    console.log('Processing QR codes:', modifications.qrCodes.length);
    annotations.push(...modifications.qrCodes.map((qr: any) => ({
      type: "qrcode",
      text: qr.content || "https://example.com",
      x: qr.x || 100,
      y: qr.y || 100,
      size: qr.size || 100,
      pages: qr.pages || "1",
      foregroundColor: qr.foregroundColor || "#000000",
      backgroundColor: qr.backgroundColor || "#FFFFFF"
    })));
  }
  
  // Apply all annotations if any exist
  if (annotations.length > 0) {
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
    console.log('Finalization result:', result);

    if (!result.error) {
      return {
        success: true,
        url: result.url,
        downloadUrl: result.url,
        fileName: 'finalized-document.pdf',
        fileSize: result.fileSize
      };
    } else {
      throw new Error(result.message || 'Failed to finalize PDF');
    }
  } else {
    // No modifications, return original file
    return {
      success: true,
      url: fileUrl || fileData,
      downloadUrl: fileUrl || fileData,
      fileName: 'document.pdf'
    };
  }
}

async function exportPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('Exporting PDF with options:', options);
  
  const format = options?.format || 'pdf';
  const fileName = options?.fileName || 'exported-document';
  const quality = options?.quality || 90;
  const compression = options?.compression !== false;
  
  if (format === 'pdf') {
    // For PDF export, we can apply compression if requested
    if (compression) {
      const requestBody: any = {
        async: false,
        compress: true
      };

      if (fileUrl) {
        requestBody.url = fileUrl;
      } else if (fileData) {
        requestBody.file = fileData;
      }

      try {
        const response = await fetch('https://api.pdf.co/v1/pdf/optimize', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        console.log('PDF compression result:', result);

        if (!result.error) {
          return {
            success: true,
            url: result.url,
            downloadUrl: result.url,
            fileName: `${fileName}.pdf`,
            format: 'pdf',
            fileSize: result.fileSize
          };
        }
      } catch (error) {
        console.log('Compression failed, returning original:', error);
      }
    }
    
    // Return original PDF
    return {
      success: true,
      url: fileUrl || fileData,
      downloadUrl: fileUrl || fileData,
      fileName: `${fileName}.pdf`,
      format: 'pdf'
    };
  } else {
    // Convert to image format (PNG/JPG)
    const requestBody: any = {
      async: false,
      outputFormat: format.toUpperCase(),
      imageQuality: quality
    };

    if (fileUrl) {
      requestBody.url = fileUrl;
    } else if (fileData) {
      requestBody.file = fileData;
    }

    const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/png', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log('Image export result:', result);

    if (!result.error) {
      return {
        success: true,
        url: result.url,
        downloadUrl: result.url,
        fileName: `${fileName}.${format}`,
        format: format,
        fileSize: result.fileSize
      };
    } else {
      throw new Error(result.message || `Failed to export as ${format.toUpperCase()}`);
    }
  }
}

serve(handler);
