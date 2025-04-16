
// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  imageUrl?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSIONAL = 'PROFESSIONAL',
  STAFF = 'STAFF',
}

// Professional-related types
export interface Professional {
  id: string;
  userId: string;
  specialty: string;
  services: Service[];
  availableHours: AvailabilitySchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilitySchedule {
  id: string;
  professionalId: string;
  dayOfWeek: number; // 0-6, 0 is Sunday
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  isAvailable: boolean;
}

// Service-related types
export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // In minutes
  requiresInventory: boolean;
  inventoryItems?: InventoryItem[];
  price?: number; // Optional, for NGOs that charge some services
  color?: string; // For calendar display
  createdAt: Date;
  updatedAt: Date;
}

// Appointment-related types
export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  serviceId: string;
  date: Date;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// Patient-related types
export interface Patient {
  id: string;
  name: string;
  documentId?: string;
  birthDate?: Date;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory-related types
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  currentStock: number;
  minStock: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

// Medical Record-related types (basic structure, expandable)
export interface MedicalRecord {
  id: string;
  patientId: string;
  professionalId: string;
  appointmentId?: string;
  date: Date;
  diagnosis?: string;
  notes: string;
  treatmentPlan?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
