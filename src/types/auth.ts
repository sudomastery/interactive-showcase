export type UserRole = 'field_agent' | 'administrator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  lat: number;
  lon: number;
  mpesaPhone: string;
  address: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  agentName: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  distance: number;
  location: { lat: number; lon: number };
}

export type PaymentStatus = 'idle' | 'locating' | 'verifying' | 'processing' | 'success' | 'failed';
