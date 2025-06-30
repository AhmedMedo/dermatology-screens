export interface Patient {
  id: string;
  name: string;
  age: number;
  photo?: string;
  allergies: string[];
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment?: string;
}

export interface ToothCondition {
  id: string;
  toothNumber: number;
  condition: 'healthy' | 'decay' | 'filling' | 'crown' | 'missing' | 'implant' | 'root-canal';
  severity?: 'mild' | 'moderate' | 'severe';
  notes: string;
  date: string;
  images?: string[];
}

export interface TreatmentRecord {
  id: string;
  date: string;
  procedure: string;
  toothNumbers: number[];
  notes: string;
  cost?: number;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface TreatmentPlan {
  id: string;
  title: string;
  stage: 'pre-op' | 'procedure' | 'follow-up' | 'completed';
  procedures: string[];
  estimatedCost: number;
  startDate: string;
  estimatedCompletion: string;
}

export interface OralHealthAssessment {
  gumHealth: 'excellent' | 'good' | 'fair' | 'poor';
  oralHygiene: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  riskFactors: string[];
  recommendations: string[];
}