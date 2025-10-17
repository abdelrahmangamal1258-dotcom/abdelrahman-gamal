
import React, { SVGProps } from 'react';
import { Page } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

// أيقونة SVG بسيطة
const Icon: React.FC<{ path: string } & SVGProps<SVGSVGElement>> = ({ path, ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// مكون الشريط الجانبي للتنقل
const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, isOpen, setOpen }) => {
  const handleNavClick = (page: Page) => {
    setActivePage(page);
    if(window.innerWidth < 1024) { // إغلاق الشريط عند اختيار صفحة على الجوال
      setOpen(false);
    }
  }

  return (
    <>
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setOpen(false)}></div>
    <aside className={`absolute lg:relative flex flex-col w-64 bg-white text-gray-700 shadow-xl h-full transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
      <div className="flex items-center justify-center p-6 border-b">
        <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span className="ml-4 text-2xl font-bold text-teal-600">عيادتي</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id as Page);
            }}
            className={`flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
              activePage === item.id ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-teal-50 hover:text-teal-600'
            }`}
          >
            <Icon path={item.icon} className="w-6 h-6 ml-4" />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-4 py-4 border-t">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 text-red-500 hover:bg-red-50"
        >
          <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-6 h-6 ml-4" />
          تسجيل الخروج
        </a>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
