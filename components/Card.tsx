
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

// مكون البطاقة القابل لإعادة الاستخدام
const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-500 mb-4">{title}</h3>
      <div className="text-gray-800">
        {children}
      </div>
    </div>
  );
};

export default Card;
