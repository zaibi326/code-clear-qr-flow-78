
import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  })
});

export const templateSchema = z.object({
  name: z.string().min(3, { message: "Template name must be at least 3 characters." }),
  file: z.instanceof(File, { message: "Please upload a template file." })
    .refine((file) => file.size <= 10 * 1024 * 1024, { message: "File size must be less than 10MB." })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      { message: "File must be JPG, PNG, or PDF." }
    ),
});

export const campaignSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters." }),
  template: z.string().min(1, { message: "Please select a template." }),
  qrCodes: z.array(
    z.object({
      content: z.string().url({ message: "Please enter a valid URL." }),
      name: z.string().optional(),
      description: z.string().optional()
    })
  ).min(1, { message: "You must add at least one QR code." }),
  settings: z.object({
    qrSize: z.number().min(50).max(500).default(200),
    qrColor: z.string().regex(/^#[0-9A-F]{6}$/i).default('#000000'),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).default('#FFFFFF')
  }).optional()
});

export const csvSchema = z.object({
  file: z.instanceof(File, { message: "Please upload a CSV file." })
    .refine((file) => file.type === "text/csv" || file.name.endsWith('.csv'), { message: "File must be a CSV." })
    .refine((file) => file.size <= 5 * 1024 * 1024, { message: "CSV file must be less than 5MB." })
});

export const bulkCampaignSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters." }),
  template: z.string().min(1, { message: "Please select a template." }),
  csvFile: z.instanceof(File, { message: "Please upload a CSV file." }),
  urlColumn: z.string().min(1, { message: "Please select the URL column." }),
  nameColumn: z.string().optional(),
  emailColumn: z.string().optional()
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  category: z.enum(['technical', 'billing', 'feature-request', 'general'], {
    message: "Please select a valid category."
  }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  attachments: z.array(z.instanceof(File)).optional(),
  priority: z.enum(["low", "medium", "high"]),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional()
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;
export type CampaignFormData = z.infer<typeof campaignSchema>;
export type CSVFormData = z.infer<typeof csvSchema>;
export type BulkCampaignFormData = z.infer<typeof bulkCampaignSchema>;
export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return loginSchema.shape.email.safeParse(email).success;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const result = registerSchema.shape.password.safeParse(password);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.issues.map(issue => issue.message)
  };
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
