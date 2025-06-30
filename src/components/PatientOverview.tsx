import React, { useState } from 'react';
import { User, Calendar, AlertTriangle, Phone, Mail, Edit3 } from 'lucide-react';
import { Patient } from '../types/dental';

interface PatientOverviewProps {
  patient: Patient;
  onPatientUpdate: (patient: Patient) => void;
}

export const PatientOverview: React.FC<PatientOverviewProps> = ({ patient, onPatientUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleSave = () => {
    onPatientUpdate(editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Patient Overview
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          {patient.photo ? (
            <img
              src={patient.photo}
              alt={patient.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-blue-600" />
          )}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editedPatient.name}
            onChange={(e) => setEditedPatient({...editedPatient, name: e.target.value})}
            className="text-xl font-bold text-center border-b-2 border-blue-300 focus:border-blue-600 outline-none bg-transparent"
          />
        ) : (
          <h3 className="text-xl font-bold text-gray-800">{patient.name}</h3>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Age</label>
            {isEditing ? (
              <input
                type="number"
                value={editedPatient.age}
                onChange={(e) => setEditedPatient({...editedPatient, age: parseInt(e.target.value)})}
                className="block w-full text-lg font-semibold mt-1 border rounded-md px-2 py-1"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{patient.age}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedPatient.phone}
                onChange={(e) => setEditedPatient({...editedPatient, phone: e.target.value})}
                className="block w-full text-sm mt-1 border rounded-md px-2 py-1"
              />
            ) : (
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {patient.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={editedPatient.email}
              onChange={(e) => setEditedPatient({...editedPatient, email: e.target.value})}
              className="block w-full text-sm mt-1 border rounded-md px-2 py-1"
            />
          ) : (
            <p className="text-sm text-gray-700 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {patient.email}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Allergies
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedPatient.allergies.join(', ')}
              onChange={(e) => setEditedPatient({
                ...editedPatient, 
                allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
              })}
              placeholder="Separate allergies with commas"
              className="block w-full text-sm mt-1 border rounded-md px-2 py-1"
            />
          ) : (
            <div className="mt-1">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No known allergies</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Last Visit
          </label>
          <p className="text-sm text-gray-700 mt-1">{patient.lastVisit}</p>
        </div>

        {patient.nextAppointment && (
          <div>
            <label className="text-sm font-medium text-gray-500">Next Appointment</label>
            <p className="text-sm font-medium text-blue-600 mt-1">{patient.nextAppointment}</p>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};