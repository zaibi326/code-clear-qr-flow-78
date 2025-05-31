
import { 
  Link, 
  FileText, 
  MapPin, 
  Users, 
  FormInput, 
  Share2, 
  Smartphone, 
  Gift, 
  Globe, 
  Facebook, 
  Building, 
  Image, 
  Music, 
  Mail, 
  Phone, 
  MessageSquare,
  Star,
  UtensilsCrossed,
  CreditCard,
  Wifi,
  Type
} from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';

export const dynamicQRTypes: QRCodeType[] = [
  {
    id: 'url',
    title: 'URL/Link',
    description: 'Open a website URL',
    icon: Link,
    color: 'bg-blue-500',
    category: 'dynamic'
  },
  {
    id: 'multi-link',
    title: 'Linkpage',
    description: 'Show a list of links',
    icon: Share2,
    color: 'bg-purple-500',
    category: 'dynamic',
    badge: 'NEW'
  },
  {
    id: 'pdf',
    title: 'PDF',
    description: 'Show a PDF',
    icon: FileText,
    color: 'bg-red-500',
    category: 'dynamic'
  },
  {
    id: 'restaurant-menu',
    title: 'Restaurant Menu',
    description: 'Display a restaurant or bar menu',
    icon: UtensilsCrossed,
    color: 'bg-orange-500',
    category: 'dynamic'
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Share your social links',
    icon: Users,
    color: 'bg-pink-500',
    category: 'dynamic'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Create a mobile-friendly page',
    icon: Globe,
    color: 'bg-cyan-500',
    category: 'dynamic'
  },
  {
    id: 'mobile-app',
    title: 'Mobile App',
    description: 'Redirect to your mobile app',
    icon: Smartphone,
    color: 'bg-emerald-500',
    category: 'dynamic'
  },
  {
    id: 'facebook-page',
    title: 'Facebook Page',
    description: 'Share your Facebook profile',
    icon: Facebook,
    color: 'bg-blue-600',
    category: 'dynamic'
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Show an image',
    icon: Image,
    color: 'bg-violet-500',
    category: 'dynamic'
  }
];

export const staticQRTypes: QRCodeType[] = [
  {
    id: 'website-static',
    title: 'Website',
    description: 'Open a website URL',
    icon: Globe,
    color: 'bg-blue-500',
    category: 'static'
  },
  {
    id: 'business-card-static',
    title: 'Digital Business Card',
    description: 'Share contact details',
    icon: CreditCard,
    color: 'bg-gray-700',
    category: 'static'
  },
  {
    id: 'email-static',
    title: 'Email',
    description: 'Send an email',
    icon: Mail,
    color: 'bg-blue-400',
    category: 'static'
  },
  {
    id: 'sms-static',
    title: 'SMS',
    description: 'Send a text message',
    icon: MessageSquare,
    color: 'bg-green-600',
    category: 'static'
  },
  {
    id: 'call-static',
    title: 'Call',
    description: 'Place a quick call',
    icon: Phone,
    color: 'bg-emerald-600',
    category: 'static'
  },
  {
    id: 'plain-text-static',
    title: 'Plain Text',
    description: 'Display a short message',
    icon: Type,
    color: 'bg-gray-500',
    category: 'static'
  }
];
