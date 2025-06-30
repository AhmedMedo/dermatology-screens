import React, { useState } from 'react';
import { Clock, Plus, FileText, DollarSign, Calendar } from 'lucide-react';
import { TreatmentRecord } from '../types/dental';

interface TreatmentHistoryProps {
  treatments: TreatmentRecord[];
  onTreatmentAdd: (treatment: TreatmentRecord) => void;
}

export const TreatmentHistory: React.FC<TreatmentHistoryProps> = ({
  treatments,
  onTreatmentAdd,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTreatment, setNewTreatment] = useState<Partial<TreatmentRecord>>({
    date: new Date().toISOString().split('T')[0],
    procedure: '',
    toothNumbers: [],
    notes: '',
    cost: 0,
    status: 'completed',
  });

  const handleAddTreatment = () => {
    if (newTreatment.procedure && newTreatment.date) {
      onTreatmentAdd({
        id: Date.now().toString(),
        date: newTreatment.date!,
        procedure: newTreatment.procedure!,
        toothNumbers: newTreatment.toothNumbers || [],
        notes: newTreatment.notes || '',
        cost: newTreatment.cost,
        status: newTreatment.status || 'completed',
      });
      setNewTreatment({
        date: new Date().toISOString().split('T')[0],
        procedure: '',
        toothNumbers: [],
        notes: '',
        cost: 0,
        status: 'completed',
      });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status: TreatmentRecord['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedTreatments = [...treatments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Treatment History & Notes
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Treatment
        </button>
      </div>

      {sortedTreatments.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedTreatments.map((treatment) => (
            <div key={treatment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{treatment.procedure}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(treatment.date).toLocaleDateString()}
                    </span>
                    {treatment.toothNumbers.length > 0 && (
                      <span>Teeth: {treatment.toothNumbers.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(treatment.status)}`}>
                    {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1).replace('-', ' ')}
                  </span>
                  {treatment.cost && treatment.cost > 0 && (
                    <p className="text-sm font-medium text-green-600 mt-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {treatment.cost.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              {treatment.notes && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    {treatment.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No treatment history recorded</p>
          <p className="text-sm">Click "Add Treatment" to add the first entry</p>
        </div>
      )}

      {/* Add Treatment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Add Treatment Record</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                <input
                  type="text"
                  value={newTreatment.procedure}
                  onChange={(e) => setNewTreatment({ ...newTreatment, procedure: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Cleaning, Filling, Root Canal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newTreatment.date}
                  onChange={(e) => setNewTreatment({ ...newTreatment, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newTreatment.status}
                  onChange={(e) => setNewTreatment({
                    ...newTreatment,
                    status: e.target.value as TreatmentRecord['status']
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tooth Numbers (comma separated)</label>
                <input
                  type="text"
                  value={newTreatment.toothNumbers?.join(', ')}
                  onChange={(e) => setNewTreatment({
                    ...newTreatment,
                    toothNumbers: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 14, 15, 16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  value={newTreatment.cost}
                  onChange={(e) => setNewTreatment({ ...newTreatment, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newTreatment.notes}
                  onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Add any additional notes about the treatment..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddTreatment}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Treatment
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