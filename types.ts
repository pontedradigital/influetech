
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
  trackingCode: string;
  productName: string;
  buyer: string;
  date: string;
  status: 'Entregue' | 'Em trânsito' | 'Enviado' | 'Cancelado';
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
