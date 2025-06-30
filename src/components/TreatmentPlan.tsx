import React, { useState } from 'react';
import { Calendar, DollarSign, Plus, Edit, CheckCircle } from 'lucide-react';
import { TreatmentPlan } from '../types/dental';

interface TreatmentPlanProps {
  treatmentPlans: TreatmentPlan[];
  onPlanUpdate: (plan: TreatmentPlan) => void;
  onPlanAdd: (plan: TreatmentPlan) => void;
}

export const TreatmentPlanComponent: React.FC<TreatmentPlanProps> = ({
  treatmentPlans,
  onPlanUpdate,
  onPlanAdd,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<TreatmentPlan>>({
    title: '',
    stage: 'pre-op',
    procedures: [],
    estimatedCost: 0,
    startDate: '',
    estimatedCompletion: '',
  });

  const activePlan = treatmentPlans.find(plan => plan.stage !== 'completed') || treatmentPlans[0];

  const getStageColor = (stage: TreatmentPlan['stage']) => {
    switch (stage) {
      case 'pre-op': return 'bg-yellow-100 text-yellow-800';
      case 'procedure': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageProgress = (stage: TreatmentPlan['stage']) => {
    switch (stage) {
      case 'pre-op': return 25;
      case 'procedure': return 50;
      case 'follow-up': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const handleAddPlan = () => {
    if (newPlan.title && newPlan.startDate) {
      onPlanAdd({
        id: Date.now().toString(),
        title: newPlan.title,
        stage: newPlan.stage || 'pre-op',
        procedures: newPlan.procedures || [],
        estimatedCost: newPlan.estimatedCost || 0,
        startDate: newPlan.startDate,
        estimatedCompletion: newPlan.estimatedCompletion || '',
      });
      setNewPlan({
        title: '',
        stage: 'pre-op',
        procedures: [],
        estimatedCost: 0,
        startDate: '',
        estimatedCompletion: '',
      });
      setShowAddModal(false);
    }
  };

  const handleStageUpdate = (planId: string, newStage: TreatmentPlan['stage']) => {
    const plan = treatmentPlans.find(p => p.id === planId);
    if (plan) {
      onPlanUpdate({ ...plan, stage: newStage });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Treatment Plan</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      {activePlan ? (
        <div className="space-y-6">
          {/* Current Treatment */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900">{activePlan.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(activePlan.stage)}`}>
                {activePlan.stage.charAt(0).toUpperCase() + activePlan.stage.slice(1).replace('-', ' ')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{getStageProgress(activePlan.stage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getStageProgress(activePlan.stage)}%` }}
                ></div>
              </div>
            </div>

            {/* Stage Timeline */}
            <div className="relative">
              <div className="flex justify-between items-center">
                {(['pre-op', 'procedure', 'follow-up', 'completed'] as const).map((stage, index) => {
                  const isActive = stage === activePlan.stage;
                  const isCompleted = getStageProgress(stage) <= getStageProgress(activePlan.stage);
                  
                  return (
                    <div key={stage} className="flex flex-col items-center relative">
                      <button
                        onClick={() => handleStageUpdate(activePlan.id, stage)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500'
                        } ${isActive ? 'ring-4 ring-blue-200' : ''}`}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </button>
                      <span className="text-xs text-gray-600 mt-1 capitalize">
                        {stage.replace('-', ' ')}
                      </span>
                      {index < 3 && (
                        <div
                          className={`absolute top-4 left-8 w-16 h-0.5 ${
                            getStageProgress(stage) < getStageProgress(activePlan.stage)
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Treatment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Timeline
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Start: {new Date(activePlan.startDate).toLocaleDateString()}</p>
                {activePlan.estimatedCompletion && (
                  <p>Est. Completion: {new Date(activePlan.estimatedCompletion).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Cost Estimate
              </h4>
              <p className="text-lg font-semibold text-green-600">
                ${activePlan.estimatedCost.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Procedures */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Planned Procedures</h4>
            <div className="space-y-2">
              {activePlan.procedures.map((procedure, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">{procedure}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No active treatment plan</p>
          <p className="text-sm">Click "New Plan" to create one</p>
        </div>
      )}

      {/* Add Treatment Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Create Treatment Plan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Root Canal Treatment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion</label>
                <input
                  type="date"
                  value={newPlan.estimatedCompletion}
                  onChange={(e) => setNewPlan({ ...newPlan, estimatedCompletion: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                <input
                  type="number"
                  value={newPlan.estimatedCost}
                  onChange={(e) => setNewPlan({ ...newPlan, estimatedCost: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Procedures</label>
                <textarea
                  value={newPlan.procedures?.join('\n')}
                  onChange={(e) => setNewPlan({
                    ...newPlan,
                    procedures: e.target.value.split('\n').filter(p => p.trim())
                  })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter each procedure on a new line"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddPlan}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Plan
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};