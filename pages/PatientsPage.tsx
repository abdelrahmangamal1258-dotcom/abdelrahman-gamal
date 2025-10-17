
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Patient } from '../types';

// مكون لعرض تفاصيل المريض
const PatientDetails: React.FC<{ patient: Patient; onAddNote: (note: string) => Promise<void>; onClose: () => void }> = ({ patient, onAddNote, onClose }) => {
    const [newNote, setNewNote] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

    const handleAddNote = async () => {
        if (newNote.trim()) {
            setIsAddingNote(true);
            await onAddNote(newNote);
            setNewNote('');
            setIsAddingNote(false);
        }
    };
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
                 <h3 className="text-2xl font-bold text-teal-600">{patient.name}</h3>
                 <button onClick={onClose} className="text-gray-500 hover:text-red-600">&times;</button>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><strong className="text-gray-600">العمر:</strong> {patient.age}</p>
                <p><strong className="text-gray-600">رقم الهاتف:</strong> {patient.phone}</p>
            </div>
            <div><strong className="text-gray-600">التاريخ المرضي:</strong> <p className="text-gray-800 bg-gray-50 p-2 rounded-md">{patient.medicalHistory}</p></div>
            <div><strong className="text-gray-600">التشخيص:</strong> <p className="text-gray-800 bg-gray-50 p-2 rounded-md">{patient.diagnosis}</p></div>
            <div><strong className="text-gray-600">الأدوية:</strong> <p className="text-gray-800 bg-gray-50 p-2 rounded-md">{patient.medications.join(', ')}</p></div>
            
            <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">ملاحظات الطبيب</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {patient.doctorNotes.length > 0 ? patient.doctorNotes.map((note, index) => (
                        <div key={index} className="bg-teal-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">{note.date}</p>
                            <p>{note.note}</p>
                        </div>
                    )) : <p className="text-gray-400">لا توجد ملاحظات.</p>}
                </div>

                <div className="mt-4">
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={2} placeholder="إضافة ملاحظة جديدة..." className="w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"></textarea>
                    <button onClick={handleAddNote} disabled={isAddingNote} className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-teal-300">
                        {isAddingNote ? 'جارِ الإضافة...' : 'إضافة ملاحظة جديدة'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// صفحة إدارة المرضى
const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب المرضى عند تحميل المكون
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await api.getPatients();
        setPatients(data);
      } catch (err) {
        setError('فشل في تحميل بيانات المرضى.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // إضافة ملاحظة للمريض المحدد
  const handleAddNote = async (note: string) => {
    if (!selectedPatient) return;
    try {
        const updatedPatient = await api.addPatientNote(selectedPatient.id, note);
        // تحديث قائمة المرضى والمريض المحدد
        setSelectedPatient(updatedPatient);
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    } catch (err) {
        setError('فشل في إضافة الملاحظة.');
    }
  };

  if (loading) return <div className="text-center">جارِ تحميل المرضى...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* قائمة المرضى */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">قائمة المرضى</h2>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
          {patients.map((patient) => (
            <li key={patient.id}>
              <button
                onClick={() => setSelectedPatient(patient)}
                className={`w-full text-right p-3 rounded-lg text-lg transition ${selectedPatient?.id === patient.id ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'}`}
              >
                {patient.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* تفاصيل المريض المحدد */}
      <div className="lg:col-span-2">
        {selectedPatient ? (
          <PatientDetails patient={selectedPatient} onAddNote={handleAddNote} onClose={() => setSelectedPatient(null)} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-xl">الرجاء اختيار مريض لعرض التفاصيل</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
