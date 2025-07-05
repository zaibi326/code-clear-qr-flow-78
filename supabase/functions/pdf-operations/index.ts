
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
  console.log(`📡 Making ${operation} API request to PDF.co:`, { url, requestBody });
  
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
    console.log(`📥 PDF.co response (${response.status}):`, responseText);

    if (!response.ok) {
      return {
        success: false,
        error: `PDF.co API returned ${response.status}: ${responseText}`,
        statusCode: response.status,
        debugInfo: {
          url,
          requestBody,
          responseBody: responseText,
          responseHeaders: Object.fromEntries(response.headers.entries())
        }
      };
    }

    const result = JSON.parse(responseText);
    
    if (result.error) {
      console.error(`❌ PDF.co API error for ${operation}:`, result);
      return {
        success: false,
        error: result.message || `PDF.co API error: ${result.error}`,
        statusCode: response.status,
        debugInfo: {
          pdfcoError: result,
          url,
          requestBody
        }
      };
    }

    return {
      success: true,
      ...result,
      statusCode: response.status,
      debugInfo: {
        operation,
        requestBody,
        responseStatus: response.status
      }
    };
  } catch (error: any) {
    console.error(`💥 ${operation} API request failed:`, error);
    return {
      success: false,
      error: `Network error: ${error.message}`,
      statusCode: 500,
      debugInfo: {
        operation,
        url,
        requestBody,
        errorStack: error.stack
      }
    };
  }
}

async function extractTextFromPDF(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('📄 Extracting text from PDF with options:', options);
  
  if (!fileUrl && !fileData) {
    throw new Error('Either fileUrl or fileData must be provided');
  }
  
  const requestBody: any = {
    pages: options?.pages || "1-",
    ocrLanguage: options?.ocrLanguage || "eng",
    async: false
  };

  // Use fileUrl if available, otherwise use fileData
  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  console.log('📋 Text extraction request body:', {
    hasUrl: !!requestBody.url,
    hasFile: !!requestBody.file,
    pages: requestBody.pages,
    ocrLanguage: requestBody.ocrLanguage
  });

  const result = await makeApiRequest(
    'https://api.pdf.co/v1/pdf/convert/to/text',
    apiKey,
    requestBody,
    'text extraction'
  );

  if (result.success) {
    return {
      success: true,
      text: result.body,
      pages: result.pageCount,
      url: result.url,
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

async function editPDFText(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('✏️ Editing PDF text with options:', options);
  
  if (!options?.searchStrings || !options?.replaceStrings) {
    throw new Error('Search and replace strings are required for text editing');
  }

  const requestBody: any = {
    searchStrings: options.searchStrings,
    replaceStrings: options.replaceStrings,
    caseSensitive: options.caseSensitive || false,
    async: false
  };

  // Use fileUrl if available, otherwise use fileData
  if (fileUrl) {
    requestBody.url = fileUrl;
  } else if (fileData) {
    requestBody.file = fileData;
  }

  console.log('📋 Text editing request body:', {
    hasUrl: !!requestBody.url,
    hasFile: !!requestBody.file,
    searchCount: requestBody.searchStrings.length,
    replaceCount: requestBody.replaceStrings.length,
    caseSensitive: requestBody.caseSensitive
  });

  const result = await makeApiRequest(
    'https://api.pdf.co/v1/pdf/edit/replace-text',
    apiKey,
    requestBody,
    'text editing'
  );

  if (result.success) {
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

async function addPDFAnnotations(apiKey: string, fileUrl?: string, fileData?: string, options?: any) {
  console.log('🎨 Adding PDF annotations with options:', options);
  
  if (!options?.annotations || !Array.isArray(options.annotations)) {
    throw new Error('Annotations array is required');
  }

  // Transform annotations to PDF.co format
  const annotations = options.annotations.map((annotation: any) => {
    const baseAnnotation = {
      x: Math.round(annotation.x || 100),
      y: Math.round(annotation.y || 100),
      width: Math.round(annotation.width || 100),
      height: Math.round(annotation.height || 100),
      pages: annotation.pages || "1"
    };

    switch (annotation.type) {
      case 'highlight':
        return {
          ...baseAnnotation,
          type: "highlight",
          color: annotation.color || { r: 1, g: 1, b: 0 }
        };
      case 'rectangle':
        return {
          ...baseAnnotation,
          type: "rectangle",
          fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
          strokeColor: annotation.strokeColor || annotation.color || { r: 0, g: 0, b: 1 },
          strokeWidth: annotation.strokeWidth || 2
        };
      case 'circle':
        return {
          ...baseAnnotation,
          type: "ellipse",
          fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
          strokeColor: annotation.strokeColor || annotation.color || { r: 0, g: 0, b: 1 },
          strokeWidth: annotation.strokeWidth || 2
        };
      default:
        return {
          ...baseAnnotation,
          type: "rectangle",
          fillColor: annotation.fillColor || { r: 0.8, g: 0.8, b: 1 },
          strokeColor: annotation.strokeColor || annotation.color || { r: 0, g: 0, b: 1 },
          strokeWidth: annotation.strokeWidth || 2
        };
    }
  });

  const requestBody: any = {
    annotations: annotations,
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
  console.log('📱 Adding QR code to PDF with options:', options);
  
  if (!options?.qrText) {
    throw new Error('QR code text is required');
  }

  const qrAnnotation = {
    type: "qrcode",
    text: options.qrText,
    x: Math.round(options.x || 100),
    y: Math.round(options.y || 100),
    size: Math.round(options.size || 100),
    pages: options.pages || "1",
    foregroundColor: options.foregroundColor || "#000000",
    backgroundColor: options.backgroundColor || "#FFFFFF"
  };

  const requestBody: any = {
    annotations: [qrAnnotation],
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
    'https://api.pdf.co/v1/pdf/edit/add',
    apiKey,
    requestBody,
    'QR code insertion'
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
