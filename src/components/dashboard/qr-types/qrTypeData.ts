
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
  Star
} from 'lucide-react';
import { QRType } from './QRTypeCard';

export const frequentlyUsedQRTypes: QRType[] = [
  {
    id: 'url',
    title: 'URL/Link',
    description: 'Paste link to a website, video, form, or any URL you have',
    icon: Link,
    color: 'bg-blue-500',
    popular: true
  },
  {
    id: 'multi-link',
    title: 'Multi-link QR Codes',
    description: 'Create a Linkpage with a list of links and share it with a QR Code',
    icon: Share2,
    color: 'bg-purple-500',
    badge: 'NEW'
  },
  {
    id: 'pdf',
    title: 'PDF',
    description: 'Link a PDF document and distribute it efficiently',
    icon: FileText,
    color: 'bg-red-500',
    popular: true
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Point to any location on Google Maps',
    icon: MapPin,
    color: 'bg-green-500'
  }
];

export const moreQRTypes: QRType[] = [
  {
    id: 'restaurant-menu',
    title: 'Restaurant Menu',
    description: 'Organize all your QR menus in one digital location',
    icon: Building,
    color: 'bg-orange-500'
  },
  {
    id: 'form',
    title: 'Form',
    description: 'Design a form and get responses through scans',
    icon: FormInput,
    color: 'bg-indigo-500',
    badge: 'NEW'
  },
  {
    id: 'smart-rules',
    title: 'Smart Rules',
    description: 'Create smarter QR Codes that redirect based on logical conditions',
    icon: Star,
    color: 'bg-yellow-500'
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Link to your social media channels for more engagement',
    icon: Users,
    color: 'bg-pink-500'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Build a mobile-optimized webpage to interact with your audience',
    icon: Globe,
    color: 'bg-cyan-500'
  },
  {
    id: 'mobile-app',
    title: 'Mobile App',
    description: 'Redirect to app download or in-app pages for Android and iOS users',
    icon: Smartphone,
    color: 'bg-emerald-500'
  },
  {
    id: 'coupon-code',
    title: 'Coupon Code',
    description: 'Route to a page displaying coupon code details',
    icon: Gift,
    color: 'bg-rose-500'
  },
  {
    id: 'geolocation-redirect',
    title: 'Geolocation Redirect',
    description: "Show a specific website URL based on the scanner's country",
    icon: Globe,
    color: 'bg-teal-500'
  },
  {
    id: 'facebook-page',
    title: 'Facebook Page',
    description: 'Redirect to the "like" button of your Facebook page',
    icon: Facebook,
    color: 'bg-blue-600'
  },
  {
    id: 'business-page',
    title: 'Business Page',
    description: 'Link to a page containing your business details',
    icon: Building,
    color: 'bg-gray-600'
  },
  {
    id: 'image',
    title: 'Image',
    description: 'Show a photo',
    icon: Image,
    color: 'bg-violet-500'
  },
  {
    id: 'mp3',
    title: 'MP3',
    description: 'Play an audio file',
    icon: Music,
    color: 'bg-amber-500'
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Link to receive email messages',
    icon: Mail,
    color: 'bg-blue-400'
  },
  {
    id: 'call',
    title: 'Call',
    description: 'Link to your phone number for quick calls',
    icon: Phone,
    color: 'bg-green-600'
  },
  {
    id: 'sms',
    title: 'SMS',
    description: 'Redirect to your mobile number to receive SMS',
    icon: MessageSquare,
    color: 'bg-purple-600'
  }
];
