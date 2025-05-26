
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
  file: z.instanceof(File, { message: "Please upload a template file." }),
});

export const campaignSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters." }),
  template: z.string().min(1, { message: "Please select a template." }),
  qrCodes: z.array(
    z.object({
      content: z.string().url({ message: "Please enter a valid URL." })
    })
  ).min(1, { message: "You must add at least one QR code." }),
});

export const csvSchema = z.object({
  file: z.instanceof(File, { message: "Please upload a CSV file." }).refine(
    (file) => file.type === "text/csv",
    { message: "File must be a CSV." }
  )
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  attachments: z.array(z.instanceof(File)).optional(),
  priority: z.enum(["low", "medium", "high"]),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;
export type CampaignFormData = z.infer<typeof campaignSchema>;
export type CSVFormData = z.infer<typeof csvSchema>;
export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
