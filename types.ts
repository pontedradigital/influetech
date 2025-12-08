
export interface Product {
  id: string;
  name: string;
  category: string;
  company: string;
  receiveDate: string;
  status: 'Em análise' | 'Post Agendado' | 'Aguardando Envio' | 'Publicado' | 'Vendido' | 'Enviado';
  image: string;
  price?: number;
}

export interface Company {
  id: string;
  name: string;
  contact: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  email: string;
}

export interface Shipment {
  id: string;
  userId?: string;
  saleId?: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderCep: string;
  senderCpfCnpj?: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientCep: string;
  recipientCpfCnpj?: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  declaredValue?: number;
  carrier: string;
  price: number;
  deliveryTime: number;
  contentDescription?: string;
  contentQuantity?: number;
  trackingCode?: string;
  status: string;
  labelGenerated?: boolean;
  declarationGenerated?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BazarRecommendation {
  id: string;
  title: string;
  score: number;
  revenueRange: string;
  date: string;
  insights: string[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'Receita' | 'Despesa';
  amount: number;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  category: string;
  affiliateLink: string;
  shortLink?: string;
  commission: number; // Percentage
  price: number;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  clicks: number;
  conversions: number;
  revenue: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  isPublicProfile: boolean;
  bio?: string;
  niche?: string;
  location?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  socialTikTok?: string;
  socialWhatsapp?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'COLLAB' | 'JOB' | 'EVENT' | 'PARTNERSHIP';
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  userId: string;
  userName?: string;
  userIsPublic?: boolean;
}

export interface ScheduledPost {
  id: string;
  userId: string;
  productId?: string;
  product?: Product;
  title: string;
  caption?: string;
  platforms: string; // JSON array
  scheduledFor: string;
  status: 'SCHEDULED' | 'PUBLISHED' | 'CANCELLED';
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'CONTENT' | 'EDITING' | 'RESPOND' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'PRODUCT_ARRIVING' | 'POST_UPCOMING' | 'TASK_DUE' | 'PRODUCT_NO_POST';
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}
