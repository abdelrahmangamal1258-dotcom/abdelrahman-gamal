
import React, { useState } from 'react';
import { api } from '../services/api';
import { VISIT_TYPE_OPTIONS } from '../constants';
import { VisitType } from '../types';

interface BookingPageProps {
    onBookingSuccess: () => void;
    onAdminLoginClick?: () => void;
}

// صفحة حجز المواعيد للزوار
const BookingPage: React.FC<BookingPageProps> = ({ onBookingSuccess, onAdminLoginClick }) => {
  // حالات لتخزين بيانات النموذج
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [visitType, setVisitType] = useState<VisitType>(VisitType.Checkup);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !date || !time) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.addAppointment({ patientName: fullName, phone, date, time, visitType, notes });
      setSuccess(true);
      // إعادة تعيين النموذج بعد الحجز الناجح
      setFullName('');
      setPhone('');
      setDate('');
      setTime('');
      setVisitType(VisitType.Checkup);
      setNotes('');
      onBookingSuccess();
    } catch (err) {
      setError('حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
       <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-teal-600">نظام حجز مواعيد عيادة المخ والأعصاب</h1>
            <p className="text-gray-600 mt-2">يرجى ملء النموذج التالي لتأكيد حجزكم</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
            {success && (
                <div className="bg-green-100 border-r-4 border-green-500 text-green-700 p-4 rounded-lg mb-6" role="alert">
                    <p className="font-bold">تم حجز الموعد بنجاح ✅</p>
                    <p>سنتصل بكم قريبًا لتأكيد الموعد. شكرًا لكم.</p>
                </div>
            )}
            {error && <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg mb-6">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل</label>
                <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
                </div>
                <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">رقم الهاتف</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
                </div>
                <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">تاريخ الموعد</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
                </div>
                <div>
                <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-1">الوقت</label>
                <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
                </div>
            </div>
            <div>
                <label htmlFor="visitType" className="block text-sm font-semibold text-gray-700 mb-1">نوع الزيارة</label>
                <select id="visitType" value={visitType} onChange={e => setVisitType(e.target.value as VisitType)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition bg-white">
                {VISIT_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات إضافية</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"></textarea>
            </div>
            <div>
                <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105 disabled:bg-teal-300">
                {loading ? 'جارِ الحجز...' : 'تأكيد الحجز'}
                </button>
            </div>
            </form>
        </div>
        {onAdminLoginClick && (
            <div className="text-center mt-6">
                <button onClick={onAdminLoginClick} className="text-sm text-gray-500 hover:text-teal-600 underline">
                    تسجيل دخول الموظفين
                </button>
            </div>
        )}
       </div>
    </div>
  );
};

export default BookingPage;
