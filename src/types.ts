export type LanguageType = 'en-US' | 'he-IL' | 'ru-RU';
export type LocaleType = 'en' | 'he' | 'ru';

export interface NavItem {
  text: string;
  scrollId?: ScrollItems;
  url?: string;
  form?: 'main' | 'event';
  icon?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavItem[];
}

export interface HowToUseItem {
  imagePath: string;
  text: string;
}

export interface LanguageSwitchItem {
  imageUrl: string;
  url: string;
}

export interface SolutionItem {
  imageUrl: string;
  title: string;
  text: string[];
  column?: boolean;
}

export type NameTypeMain = 'name' | 'email' | 'phone' | 'profession';
export type NameTypeEvent = 'name' | 'email' | 'phone' | 'idNumber';

export interface FormDataType {
  name: { value: string; isValid: boolean };
  email: { value: string; isValid: boolean };
  phone: { value: string; isValid: boolean };
}

export interface MainFormDataType extends FormDataType {
  profession: { value: string; isValid: boolean };
}

export interface EventFormDataType extends FormDataType {
  idNumber: { value: string; isValid: boolean };
  totalPrice?: string;
  discount?: number;
  quantity?: string | number;
  lang?: string;
}

export type DiscountModifier = 0.9 | 1 | 0.01;

export enum ScrollItems {
  gallery = 'gallery',
  solution = 'solution',
  mission = 'mission',
  about = 'about',
  moreInfo = 'faq',
  contactUs = 'contact',
  agenda = 'agenda',
  clinic = 'clinic',
}

export type ModalType = 'privatePolicy' | 'accessibility';

export interface ReviewType {
  name: string;
  rating: number;
  text: string;
}

export interface EventBulletItem {
  imagePath: string;
  text: string;
}

export interface FaqItemProps {
  item: string;
  time?: boolean;
}

export interface CenterItemData {
  name: string;
  city: string;
  contact: string;
}

// Enhanced User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'professional' | 'partner';
  status: 'active' | 'inactive' | 'suspended';
  membershipTier: 'basic' | 'premium' | 'vip';
  createdAt: string;
  lastLogin: string;
  profile: UserProfile;
}

export interface UserProfile {
  phone?: string;
  clinic?: string;
  profession?: string;
  address?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  certificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  certificationLevel?: 'basic' | 'advanced' | 'expert';
  partnerStatus?: PartnerStatus;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  language: LocaleType;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    eventInvites: boolean;
    educationContent: boolean;
  };
  privacy: {
    profileVisible: boolean;
    certificateVisible: boolean;
    contactInfoVisible: boolean;
  };
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  coursesCompleted: number;
  certificatesEarned: number;
  eventsAttended: number;
  joinedDate: string;
  lastOrderDate?: string;
}

// Partner System Types
export interface PartnerStatus {
  isPartner: boolean;
  partnerLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  discountRate: number;
  minimumOrder: number;
  approvedBy?: string;
  approvedDate?: string;
  specialAccess: string[];
}

// Product & Ordering Types
export interface Product {
  id: string;
  slug: string;
  name: string;
  nameTranslations: Record<LocaleType, string>;
  description: string;
  descriptionTranslations: Record<LocaleType, string>;
  shortDescription?: string;
  price: number;
  partnerPrice?: number;
  stock: number;
  minimumOrder: number;
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  barcode?: string;
  weight: number;
  dimensions: string;
  ingredients: string[];
  instructions: string;
  benefits: string[];
  contraindications: string;
  certificationRequired: boolean;
  certificationLevel: 'none' | 'basic' | 'advanced' | 'expert';
  partnerOnly: boolean;
  images: ProductImage[];
  videos?: ProductVideo[];
  documents?: ProductDocument[];
  specifications: Record<string, string>;
  tags: string[];
  flags: ProductFlags;
  pricing: ProductPricing;
  availability: ProductAvailability;
  seo: ProductSEO;
  analytics: ProductAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVideo {
  id: string;
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
}

export interface ProductDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image';
  description?: string;
}

export interface ProductFlags {
  isActive: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  onSale: boolean;
  comingSoon: boolean;
  discontinued: boolean;
}

export interface ProductPricing {
  basePrice: number;
  salePrice?: number;
  partnerPrice?: number;
  bulkPricing: BulkPricing[];
  currency: string;
}

export interface BulkPricing {
  minQuantity: number;
  price: number;
  discountPercent: number;
}

export interface ProductAvailability {
  inStock: boolean;
  stockCount: number;
  lowStockThreshold: number;
  backorderAllowed: boolean;
  estimatedRestockDate?: string;
  availableRegions: string[];
}

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface ProductAnalytics {
  views: number;
  orders: number;
  revenue: number;
  averageRating: number;
  reviewCount: number;
}

// Order System Types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  orderDate: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isPartnerPrice: boolean;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
  appliedCoupons: string[];
  estimatedTax: number;
  estimatedShipping: number;
}

// Event System Types
export interface Event {
  id: string;
  title: string;
  titleTranslations: Record<LocaleType, string>;
  description: string;
  descriptionTranslations: Record<LocaleType, string>;
  shortDescription?: string;
  type: EventType;
  category: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location: EventLocation;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  price: number;
  partnerPrice?: number;
  currency: string;
  requiresCertification: boolean;
  certificationLevel?: 'basic' | 'advanced' | 'expert';
  status: EventStatus;
  visibility: EventVisibility;
  images: string[];
  videos?: string[];
  documents?: EventDocument[];
  agenda: EventAgendaItem[];
  speakers: EventSpeaker[];
  sponsors?: EventSponsor[];
  tags: string[];
  registrationSettings: EventRegistrationSettings;
  liveStreamUrl?: string;
  recordingUrl?: string;
  feedback: EventFeedback[];
  analytics: EventAnalytics;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 'workshop' | 'webinar' | 'conference' | 'training' | 'product_launch' | 'networking';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventVisibility = 'public' | 'members_only' | 'partners_only' | 'invitation_only';

export interface EventLocation {
  type: 'physical' | 'virtual' | 'hybrid';
  venue?: string;
  address?: Address;
  virtualLink?: string;
  virtualPlatform?: string;
}

export interface EventDocument {
  id: string;
  name: string;
  url: string;
  type: 'agenda' | 'presentation' | 'handout' | 'certificate';
  description?: string;
  accessLevel: 'public' | 'registered' | 'attendees';
}

export interface EventAgendaItem {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  speaker?: string;
  type: 'presentation' | 'break' | 'qa' | 'networking';
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company?: string;
  bio: string;
  avatar?: string;
  socialLinks?: Record<string, string>;
}

export interface EventSponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
  level: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export interface EventRegistrationSettings {
  isOpen: boolean;
  openDate?: string;
  closeDate?: string;
  requiresApproval: boolean;
  maxRegistrations?: number;
  waitlistEnabled: boolean;
  refundPolicy?: string;
  cancellationDeadline?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'waitlist' | 'cancelled' | 'attended' | 'no_show';
  registrationDate: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  notes?: string;
  checkInTime?: string;
  feedbackSubmitted: boolean;
}

export interface EventFeedback {
  id: string;
  userId: string;
  rating: number;
  comments?: string;
  categories: Record<string, number>;
  submittedAt: string;
}

export interface EventAnalytics {
  views: number;
  registrations: number;
  attendance: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
}

// Education System Types
export interface Course {
  id: string;
  title: string;
  titleTranslations: Record<LocaleType, string>;
  description: string;
  descriptionTranslations: Record<LocaleType, string>;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in minutes
  price: number;
  partnerPrice?: number;
  currency: string;
  isFree: boolean;
  requiresCertification: boolean;
  certificationLevel?: 'basic' | 'advanced' | 'expert';
  thumbnail: string;
  previewVideo?: string;
  lessons: Lesson[];
  resources: CourseResource[];
  prerequisites: string[];
  learningObjectives: string[];
  tags: string[];
  instructor: Instructor;
  status: 'draft' | 'published' | 'archived';
  enrollmentCount: number;
  completionRate: number;
  averageRating: number;
  reviewCount: number;
  certificateTemplate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session';
  content: LessonContent;
  duration: number;
  order: number;
  isPreview: boolean;
  resources?: LessonResource[];
}

export interface LessonContent {
  videoUrl?: string;
  textContent?: string;
  quizId?: string;
  assignmentId?: string;
  liveSessionId?: string;
}

export interface LessonResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link';
  url: string;
  description?: string;
}

export interface CourseResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'template';
  url: string;
  description?: string;
  accessLevel: 'enrolled' | 'completed';
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  rating: number;
  courseCount: number;
  studentCount: number;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  enrollmentDate: string;
  completionDate?: string;
  progress: number;
  completedLessons: string[];
  timeSpent: number;
  lastAccessDate: string;
  certificateIssued: boolean;
  certificateId?: string;
}

// Certificate System Types
export interface Certificate {
  id: string;
  userId: string;
  type: 'course' | 'event' | 'certification';
  title: string;
  description?: string;
  issuedDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl: string;
  issuerName: string;
  issuerLogo?: string;
  templateId: string;
  metadata: Record<string, any>;
  status: 'active' | 'expired' | 'revoked';
}

// Legacy Types (kept for compatibility)
export interface LeadData {
  name?: string;
  phone: string;
  email?: string;
  source: string;
  timestamp: string;
  conversationSummary?: string;
}

export interface ExtractedInfo {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  confidence?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showForm?: boolean;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
}
