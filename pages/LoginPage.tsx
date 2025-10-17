
import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onGuestClick: () => void;
}

// صفحة تسجيل الدخول
const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // معالجة إرسال نموذج تسجيل الدخول
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
    } catch (err) {
      setError('حدث خطأ ما. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-teal-600">تسجيل الدخول</h2>
            <p className="mt-2 text-gray-600">للوصول إلى لوحة تحكم العيادة</p>
        </div>
        
        {error && <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
              placeholder="doctor@clinic.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:bg-teal-300"
          >
            {loading ? 'جارِ التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
         <div className="text-center">
            <button onClick={onGuestClick} className="text-sm text-gray-600 hover:text-teal-600 underline">
                أو المتابعة كزائر لحجز موعد
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
