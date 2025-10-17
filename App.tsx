
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import BillingPage from './pages/BillingPage';
import ReportsPage from './pages/ReportsPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import { Page } from './types';
import { User, UserRole } from './types';

// الواجهة الرئيسية للتطبيق
// هذا المكون هو المسؤول عن عرض الصفحات المختلفة بناءً على اختيار المستخدم
const App: React.FC = () => {
  // حالة لتتبع الصفحة النشطة حاليًا
  const [activePage, setActivePage] = useState<Page>('booking');
  // حالة لتتبع المستخدم الذي قام بتسجيل الدخول
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // حالة لإدارة رؤية الشريط الجانبي على الأجهزة المحمولة
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // دالة لمعالجة تسجيل الدخول الناجح
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActivePage('dashboard'); // الانتقال إلى لوحة التحكم بعد تسجيل الدخول
  };

  // دالة لمعالجة تسجيل الخروج
  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('booking'); // العودة إلى صفحة الحجز بعد تسجيل الخروج
  };

  // دالة لعرض المكون المناسب بناءً على الصفحة النشطة
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'patients':
        return <PatientsPage />;
      case 'billing':
        return <BillingPage />;
      case 'reports':
        return <ReportsPage />;
      case 'booking':
        return <BookingPage onBookingSuccess={() => alert('تم حجز الموعد بنجاح ✅')} />;
      default:
        return <DashboardPage />;
    }
  };

  // إذا لم يقم المستخدم بتسجيل الدخول، يتم عرض صفحة تسجيل الدخول
  if (!currentUser) {
    // يمكن السماح بالوصول إلى صفحة الحجز للزوار
    return (
      <div className="bg-gray-50 min-h-screen text-gray-800">
          {activePage === 'booking' ? (
              <BookingPage onBookingSuccess={() => alert('تم حجز الموعد بنجاح ✅')} onAdminLoginClick={() => setActivePage('login')} />
          ) : (
              <LoginPage onLogin={handleLogin} onGuestClick={() => setActivePage('booking')} />
          )}
      </div>
    );
  }

  // إذا قام المستخدم بتسجيل الدخول، يتم عرض الواجهة الرئيسية للعيادة
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} isOpen={isSidebarOpen} setOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
