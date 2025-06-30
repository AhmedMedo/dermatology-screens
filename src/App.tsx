import React, { useState } from 'react';
import { PatientOverview } from './components/PatientOverview';
import { InteractiveDentalChart } from './components/InteractiveDentalChart';
import { TreatmentPlanComponent } from './components/TreatmentPlan';
import { TreatmentHistory } from './components/TreatmentHistory';
import { OralHealthAssessmentComponent } from './components/OralHealthAssessment';
import { Patient, ToothCondition, TreatmentRecord, TreatmentPlan, OralHealthAssessment } from './types/dental';

function App() {
  // Sample patient data
  const [patient, setPatient] = useState<Patient>({
    id: '1',
    name: 'John Smith',
    age: 45,
    allergies: ['Amoxicillin'],
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-15',
  });

  // Tooth conditions state
  const [toothConditions, setToothConditions] = useState<ToothCondition[]>([
    {
      id: '1',
      toothNumber: 19,
      condition: 'decay',
      severity: 'moderate',
      notes: 'Large cavity on mesial surface, requires filling',
      date: '2024-01-15',
    },
    {
      id: '2',
      toothNumber: 30,
      condition: 'filling',
      notes: 'Amalgam filling in good condition',
      date: '2023-08-20',
    },
  ]);

  // Treatment plans state
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([
    {
      id: '1',
      title: 'Comprehensive Restoration',
      stage: 'procedure',
      procedures: ['Tooth #19 Filling', 'Professional Cleaning', 'Fluoride Treatment'],
      estimatedCost: 850,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-02-15',
    },
  ]);

  // Treatment history state
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      procedure: 'Comprehensive Exam',
      toothNumbers: [],
      notes: 'Initial examination, X-rays taken. Identified decay on tooth #19.',
      cost: 150,
      status: 'completed',
    },
    {
      id: '2',
      date: '2023-08-20',
      procedure: 'Routine Cleaning',
      toothNumbers: [],
      notes: 'Professional cleaning completed. Good oral hygiene maintained.',
      cost: 120,
      status: 'completed',
    },
    {
      id: '3',
      date: '2023-02-10',
      procedure: 'Filling Replacement',
      toothNumbers: [30],
      notes: 'Replaced old composite filling with new amalgam filling.',
      cost: 250,
      status: 'completed',
    },
  ]);

  // Oral health assessment state
  const [oralHealthAssessment, setOralHealthAssessment] = useState<OralHealthAssessment>({
    gumHealth: 'good',
    oralHygiene: 'fair',
    issues: ['Gum inflammation', 'Plaque buildup', 'Cavity on tooth #19'],
    riskFactors: ['Coffee consumption', 'Irregular flossing'],
    recommendations: [
      'Increase flossing frequency to daily',
      'Use fluoride mouthwash',
      'Schedule cleaning every 6 months',
      'Complete filling on tooth #19',
    ],
  });

  // Handler functions
  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  };

  const handleConditionUpdate = (condition: ToothCondition) => {
    setToothConditions(prev => {
      const existingIndex = prev.findIndex(c => c.id === condition.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = condition;
        return updated;
      }
      return [...prev, condition];
    });
  };

  const handleConditionDelete = (id: string) => {
    setToothConditions(prev => prev.filter(c => c.id !== id));
  };

  const handleTreatmentPlanUpdate = (plan: TreatmentPlan) => {
    setTreatmentPlans(prev => {
      const existingIndex = prev.findIndex(p => p.id === plan.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = plan;
        return updated;
      }
      return [...prev, plan];
    });
  };

  const handleTreatmentPlanAdd = (plan: TreatmentPlan) => {
    setTreatmentPlans(prev => [...prev, plan]);
  };

  const handleTreatmentAdd = (treatment: TreatmentRecord) => {
    setTreatmentHistory(prev => [...prev, treatment]);
  };

  const handleAssessmentUpdate = (assessment: OralHealthAssessment) => {
    setOralHealthAssessment(assessment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dental Diagnosis System</h1>
          <p className="text-gray-600">Comprehensive patient dental care management</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Patient Info */}
          <div className="space-y-8">
            <PatientOverview
              patient={patient}
              onPatientUpdate={handlePatientUpdate}
            />
            <OralHealthAssessmentComponent
              assessment={oralHealthAssessment}
              onAssessmentUpdate={handleAssessmentUpdate}
            />
          </div>

          {/* Middle Column - Dental Chart & Treatment Plan */}
          <div className="space-y-8">
            <TreatmentPlanComponent
              treatmentPlans={treatmentPlans}
              onPlanUpdate={handleTreatmentPlanUpdate}
              onPlanAdd={handleTreatmentPlanAdd}
            />
            <InteractiveDentalChart
              toothConditions={toothConditions}
              onConditionUpdate={handleConditionUpdate}
              onConditionDelete={handleConditionDelete}
            />
          </div>

          {/* Right Column - Treatment History */}
          <div className="space-y-8">
            <TreatmentHistory
              treatments={treatmentHistory}
              onTreatmentAdd={handleTreatmentAdd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;