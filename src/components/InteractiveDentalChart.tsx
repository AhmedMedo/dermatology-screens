import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { ToothCondition } from '../types/dental';

interface InteractiveDentalChartProps {
  toothConditions: ToothCondition[];
  onConditionUpdate: (condition: ToothCondition) => void;
  onConditionDelete: (id: string) => void;
}

export const InteractiveDentalChart: React.FC<InteractiveDentalChartProps> = ({
  toothConditions,
  onConditionUpdate,
  onConditionDelete,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCondition, setEditingCondition] = useState<ToothCondition | null>(null);

  // Upper teeth (8 per quadrant, 32 total - but we'll show simplified version)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => i + 17);

  const getToothCondition = (toothNumber: number) => {
    return toothConditions.find(c => c.toothNumber === toothNumber);
  };

  const getToothColor = (toothNumber: number) => {
    const condition = getToothCondition(toothNumber);
    if (!condition) return '#ffffff';
    
    switch (condition.condition) {
      case 'decay': return '#ef4444';
      case 'filling': return '#3b82f6';
      case 'crown': return '#eab308';
      case 'missing': return '#6b7280';
      case 'implant': return '#10b981';
      case 'root-canal': return '#8b5cf6';
      default: return '#ffffff';
    }
  };

  const handleToothClick = (toothNumber: number) => {
    const existingCondition = getToothCondition(toothNumber);
    if (existingCondition) {
      setEditingCondition(existingCondition);
    } else {
      setEditingCondition({
        id: Date.now().toString(),
        toothNumber,
        condition: 'healthy',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setSelectedTooth(toothNumber);
    setShowModal(true);
  };

  const handleSaveCondition = () => {
    if (editingCondition) {
      onConditionUpdate(editingCondition);
      setShowModal(false);
      setEditingCondition(null);
      setSelectedTooth(null);
    }
  };

  const handleDeleteCondition = () => {
    if (editingCondition && editingCondition.id !== Date.now().toString()) {
      onConditionDelete(editingCondition.id);
      setShowModal(false);
      setEditingCondition(null);
      setSelectedTooth(null);
    }
  };

  const ToothSVG = ({ toothNumber, isUpper }: { toothNumber: number; isUpper: boolean }) => (
    <div
      onClick={() => handleToothClick(toothNumber)}
      className="relative cursor-pointer group"
    >
      <svg
        width="40"
        height="50"
        viewBox="0 0 40 50"
        className="transition-transform group-hover:scale-110"
      >
        {isUpper ? (
          // Upper tooth shape
          <path
            d="M8 45 C8 45, 8 20, 12 10 C16 5, 24 5, 28 10 C32 20, 32 45, 32 45 C30 47, 25 48, 20 48 C15 48, 10 47, 8 45 Z"
            fill={getToothColor(toothNumber)}
            stroke="#374151"
            strokeWidth="1"
          />
        ) : (
          // Lower tooth shape
          <path
            d="M8 5 C8 5, 8 30, 12 40 C16 45, 24 45, 28 40 C32 30, 32 5, 32 5 C30 3, 25 2, 20 2 C15 2, 10 3, 8 5 Z"
            fill={getToothColor(toothNumber)}
            stroke="#374151"
            strokeWidth="1"
          />
        )}
      </svg>
      
      {getToothCondition(toothNumber) && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
          <AlertCircle className="w-2 h-2 text-white" />
        </div>
      )}
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium">
        {toothNumber}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Interactive Dental Chart</h2>
      
      <div className="space-y-8">
        {/* Upper Teeth */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Upper Jaw</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-8 gap-2">
              {upperTeeth.map(toothNumber => (
                <ToothSVG key={toothNumber} toothNumber={toothNumber} isUpper={true} />
              ))}
            </div>
          </div>
        </div>

        {/* Lower Teeth */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Lower Jaw</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-8 gap-2">
              {lowerTeeth.map(toothNumber => (
                <ToothSVG key={toothNumber} toothNumber={toothNumber} isUpper={false} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Condition Legend</h4>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Decay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Filling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Crown</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>Missing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Implant</span>
          </div>
        </div>
      </div>

      {/* Modal for editing tooth condition */}
      {showModal && editingCondition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Tooth #{selectedTooth} Condition</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={editingCondition.condition}
                  onChange={(e) => setEditingCondition({
                    ...editingCondition,
                    condition: e.target.value as ToothCondition['condition']
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="healthy">Healthy</option>
                  <option value="decay">Decay</option>
                  <option value="filling">Filling</option>
                  <option value="crown">Crown</option>
                  <option value="missing">Missing</option>
                  <option value="implant">Implant</option>
                  <option value="root-canal">Root Canal</option>
                </select>
              </div>

              {editingCondition.condition !== 'healthy' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={editingCondition.severity || 'mild'}
                    onChange={(e) => setEditingCondition({
                      ...editingCondition,
                      severity: e.target.value as ToothCondition['severity']
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editingCondition.date}
                  onChange={(e) => setEditingCondition({
                    ...editingCondition,
                    date: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingCondition.notes}
                  onChange={(e) => setEditingCondition({
                    ...editingCondition,
                    notes: e.target.value
                  })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveCondition}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              {editingCondition.id !== Date.now().toString() && (
                <button
                  onClick={handleDeleteCondition}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
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