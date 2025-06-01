
export interface Agent {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  sectors: string[];
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  agentOfInterest?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  agentOfInterest?: string;
}

export interface AgentFormData {
  name: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  sectors: string[];
  imageUrl: string;
  status: 'active' | 'inactive';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
