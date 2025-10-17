
import { VisitType, PaymentMethod, UserRole, AppointmentStatus } from './types';

// هذا الملف يحتوي على الثوابت المستخدمة في التطبيق لتسهيل التعديل المستقبلي

// خيارات أنواع الزيارة المستخدمة في نموذج الحجز
export const VISIT_TYPE_OPTIONS = [
  VisitType.Checkup,
  VisitType.FollowUp,
  VisitType.Emergency,
];

// خيارات طرق الدفع المستخدمة في نموذج الفواتير
export const PAYMENT_METHOD_OPTIONS = [
  PaymentMethod.Cash,
  PaymentMethod.Card,
  PaymentMethod.Transfer,
];

// روابط التنقل في الشريط الجانبي مع أيقوناتها
export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: 'M3 10a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10zM3 7l9-4 9 4' },
  { id: 'patients', label: 'إدارة المرضى', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.803' },
  { id: 'billing', label: 'الفواتير والحسابات', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'reports', label: 'التقارير والإحصائيات', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'booking', label: 'حجز موعد جديد', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

// ألوان مخصصة لحالات المواعيد المختلفة
export const STATUS_COLORS: { [key in AppointmentStatus]: string } = {
  [AppointmentStatus.Confirmed]: 'bg-blue-100 text-blue-800',
  [AppointmentStatus.Attended]: 'bg-green-100 text-green-800',
  [AppointmentStatus.Postponed]: 'bg-yellow-100 text-yellow-800',
  [AppointmentStatus.Canceled]: 'bg-red-100 text-red-800',
};
