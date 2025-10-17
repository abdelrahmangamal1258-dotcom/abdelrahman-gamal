
// تعريف الأنواع المختلفة المستخدمة في التطبيق لضمان تناسق البيانات

// أنواع الزيارات الممكنة
export enum VisitType {
  Checkup = 'كشف',
  FollowUp = 'متابعة',
  Emergency = 'طارئة',
}

// حالات المواعيد الممكنة
export enum AppointmentStatus {
  Confirmed = 'مؤكد',
  Attended = 'تم الحضور',
  Postponed = 'مؤجل',
  Canceled = 'ملغي',
}

// طرق الدفع الممكنة
export enum PaymentMethod {
  Cash = 'نقدًا',
  Card = 'بطاقة',
  Transfer = 'تحويل بنكي',
}

// أدوار المستخدمين في النظام
export enum UserRole {
  Doctor = 'طبيب',
  Assistant = 'مساعد',
  Receptionist = 'موظف استقبال',
}

// واجهة بيانات الموعد
export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  visitType: VisitType;
  notes?: string;
  status: AppointmentStatus;
}

// واجهة بيانات المريض
export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  medicalHistory: string;
  diagnosis: string;
  medications: string[];
  doctorNotes: { date: string; note: string }[];
}

// واجهة بيانات الفاتورة
export interface Invoice {
  id: string;
  patientName: string;
  serviceType: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
}

// واجهة بيانات المستخدم
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// نوع لتمثيل الصفحات المختلفة في التطبيق
export type Page = 'dashboard' | 'patients' | 'billing' | 'reports' | 'booking' | 'login';

// واجهة لبيانات التقارير والإحصائيات
export interface ReportStats {
  dailyAppointments: number;
  newPatients: number;
  totalInvoices: number;
  mostCommonCases: { name: string; value: number }[];
}
