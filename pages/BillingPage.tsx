
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Invoice, Patient, PaymentMethod } from '../types';
import { PAYMENT_METHOD_OPTIONS } from '../constants';

// صفحة الفواتير والحسابات
const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // حالات لنموذج الفاتورة الجديدة
  const [patientName, setPatientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // حالة لترشيح الفواتير
  const [filterDate, setFilterDate] = useState('');

  // دالة لجلب البيانات الأولية (الفواتير والمرضى)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesData, patientsData] = await Promise.all([api.getInvoices(), api.getPatients()]);
      setInvoices(invoicesData);
      setPatients(patientsData);
    } catch (err) {
      setError('فشل في تحميل البيانات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // معالجة إنشاء فاتورة جديدة
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !serviceType || amount <= 0) {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
        return;
    }
    setIsSubmitting(true);
    try {
        const newInvoiceData = { patientName, serviceType, amount, paymentMethod, date: new Date().toISOString().split('T')[0] };
        const newInvoice = await api.addInvoice(newInvoiceData);
        setInvoices(prev => [newInvoice, ...prev]);
        // إعادة تعيين النموذج
        setPatientName('');
        setServiceType('');
        setAmount(0);
    } catch (err) {
        setError('فشل في إنشاء الفاتورة.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // ترشيح الفواتير بناءً على التاريخ
  const filteredInvoices = useMemo(() => {
    if (!filterDate) return invoices;
    return invoices.filter(invoice => invoice.date === filterDate);
  }, [invoices, filterDate]);

  if (loading) return <div className="text-center">جارِ التحميل...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* نموذج إنشاء فاتورة */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">إنشاء فاتورة جديدة</h2>
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">اسم المريض</label>
            <select value={patientName} onChange={e => setPatientName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white">
              <option value="" disabled>اختر مريضًا</option>
              {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">نوع الخدمة</label>
            <input type="text" value={serviceType} onChange={e => setServiceType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">المبلغ</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">طريقة الدفع</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white">
              {PAYMENT_METHOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-teal-300">
            {isSubmitting ? 'جارِ الحفظ...' : 'حفظ الفاتورة'}
          </button>
        </form>
      </div>

      {/* قائمة الفواتير */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-2xl font-bold text-gray-800">قائمة الفواتير</h2>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="p-2 border rounded-md" />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-sm font-semibold text-gray-600">اسم المريض</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">الخدمة</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">المبلغ</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">طريقة الدفع</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">التاريخ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map(inv => (
                        <tr key={inv.id}>
                            <td className="p-3">{inv.patientName}</td>
                            <td className="p-3">{inv.serviceType}</td>
                            <td className="p-3 font-mono">{inv.amount.toFixed(2)} ر.س</td>
                            <td className="p-3">{inv.paymentMethod}</td>
                            <td className="p-3">{inv.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredInvoices.length === 0 && <p className="text-center p-4 text-gray-500">لا توجد فواتير.</p>}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
