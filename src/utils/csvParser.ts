
export interface CSVParseResult {
  headers: string[];
  data: Record<string, string>[];
  errors: string[];
}

export const parseCSV = (csvContent: string): CSVParseResult => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];
  const errors: string[] = [];

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
  }

  return { headers, data, errors };
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
  });
  
  return errors;
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
