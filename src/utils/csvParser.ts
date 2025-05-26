
export interface CSVParseResult {
  headers: string[];
  data: Record<string, string>[];
  errors: string[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

export const parseCSV = (csvContent: string): CSVParseResult => {
  const lines = csvContent.trim().split('\n');
  if (lines.length === 0) {
    return {
      headers: [],
      data: [],
      errors: ['CSV file is empty'],
      summary: { totalRows: 0, validRows: 0, invalidRows: 0 }
    };
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];
  const errors: string[] = [];
  let validRows = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
      continue;
    }

    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index] || '';
    });
    
    data.push(rowData);
    validRows++;
  }

  return { 
    headers, 
    data, 
    errors,
    summary: {
      totalRows: lines.length - 1,
      validRows,
      invalidRows: (lines.length - 1) - validRows
    }
  };
};

export const validateCSVData = (data: Record<string, string>[], requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
    
    // Validate email format if email field exists
    if (row.email && !isValidEmail(row.email)) {
      errors.push(`Row ${index + 1}: Invalid email format "${row.email}"`);
    }
    
    // Validate URL format if url field exists
    if (row.url && !isValidURL(row.url)) {
      errors.push(`Row ${index + 1}: Invalid URL format "${row.url}"`);
    }

    // Validate phone format if phone field exists
    if (row.phone && !isValidPhone(row.phone)) {
      errors.push(`Row ${index + 1}: Invalid phone format "${row.phone}"`);
    }
  });
  
  return errors;
};

export const sanitizeCSVData = (data: Record<string, string>[]): Record<string, string>[] => {
  return data.map(row => {
    const sanitized: Record<string, string> = {};
    Object.keys(row).forEach(key => {
      // Remove potentially harmful content
      sanitized[key] = row[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    });
    return sanitized;
  });
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const generateSampleCSV = (): string => {
  return `name,email,url,company,phone
John Doe,john@example.com,https://johndoe.com,Tech Corp,+1234567890
Jane Smith,jane@example.com,https://janesmith.com,Design LLC,+0987654321
Bob Johnson,bob@example.com,https://bobjohnson.com,Marketing Inc,+1122334455`;
};
