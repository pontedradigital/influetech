
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
