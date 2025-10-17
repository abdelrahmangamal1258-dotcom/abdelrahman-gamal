
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Appointment, AppointmentStatus } from '../types';
import { STATUS_COLORS } from '../constants';

// صفحة لوحة التحكم الرئيسية
const DashboardPage: React.FC = () => {
  // حالات لتخزين المواعيد، التحميل، الأخطاء، ونص البحث
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // دالة لجلب المواعيد من الواجهة البرمجية
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (err) {
      setError('فشل في تحميل المواعيد.');
    } finally {
      setLoading(false);
    }
  };

  // جلب المواعيد عند تحميل المكون لأول مرة
  useEffect(() => {
    fetchAppointments();
  }, []);

  // دالة لتحديث حالة الموعد
  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    // تحديث واجهة المستخدم فورًا لتجربة أفضل
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    try {
      await api.updateAppointmentStatus(id, status);
      // يمكن إعادة جلب البيانات للتأكد من التحديث، لكن التحديث المحلي أسرع
      // fetchAppointments(); 
    } catch (err) {
      setError('فشل في تحديث حالة الموعد.');
      // إعادة الحالة السابقة عند حدوث خطأ
      fetchAppointments(); 
    }
  };

  // ترشيح المواعيد بناءً على نص البحث
  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.date.includes(searchTerm)
    );
  }, [appointments, searchTerm]);

  if (loading) return <div className="flex justify-center items-center h-full"><p>جارِ تحميل المواعيد...</p></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">مواعيد اليوم</h2>
      
      {/* شريط البحث */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="ابحث باسم المريض أو التاريخ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {/* جدول المواعيد */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الاسم</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">رقم الهاتف</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">التاريخ</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الوقت</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">نوع الزيارة</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الحالة</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">{app.patientName}</td>
                  <td className="p-4 whitespace-nowrap">{app.phone}</td>
                  <td className="p-4 whitespace-nowrap">{app.date}</td>
                  <td className="p-4 whitespace-nowrap">{app.time}</td>
                  <td className="p-4 whitespace-nowrap">{app.visitType}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-center space-x-2 space-x-reverse">
                    <button onClick={() => handleUpdateStatus(app.id, AppointmentStatus.Attended)} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition">تم الحضور</button>
                    <button onClick={() => handleUpdateStatus(app.id, AppointmentStatus.Postponed)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">تأجيل</button>
                    <button onClick={() => handleUpdateStatus(app.id, AppointmentStatus.Canceled)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition">إلغاء</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAppointments.length === 0 && <p className="text-center p-6 text-gray-500">لا توجد مواعيد تطابق بحثك.</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
