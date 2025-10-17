
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  toggleSidebar: () => void;
}

// مكون الترويسة العلوية
const Header: React.FC<HeaderProps> = ({ user, toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <div className="flex items-center">
        {/* زر القائمة للظهور في شاشات الجوال */}
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-700 mr-4 hidden md:block">نظام عيادة المخ والأعصاب</h1>
      </div>
      <div className="flex items-center">
        <div className="text-right">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg mr-3">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;
