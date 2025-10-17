
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ReportStats } from '../types';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// صفحة التقارير والإحصائيات
const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب بيانات الإحصائيات عند تحميل المكون
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.getReportStats();
        setStats(data);
      } catch (err) {
        setError('فشل في تحميل الإحصائيات.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center">جارِ تحميل التقارير...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">التقارير والإحصائيات</h2>
      
      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="عدد المواعيد اليومية">
          <p className="text-4xl font-bold text-teal-600">{stats.dailyAppointments}</p>
        </Card>
        <Card title="عدد المرضى الجدد (هذا الشهر)">
          <p className="text-4xl font-bold text-teal-600">{stats.newPatients}</p>
        </Card>
        <Card title="إجمالي الفواتير">
          <p className="text-4xl font-bold text-teal-600">{stats.totalInvoices}</p>
        </Card>
      </div>

      {/* الرسم البياني للحالات الشائعة */}
      <Card title="أكثر الحالات شيوعًا">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={stats.mostCommonCases}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#374151' }} />
              <Tooltip
                cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                contentStyle={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Cairo, sans-serif' }} />
              <Bar dataKey="value" name="عدد الحالات" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
