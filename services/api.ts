
import { Appointment, Patient, Invoice, ReportStats, VisitType, AppointmentStatus, PaymentMethod, User, UserRole } from '../types';

// هذا الملف يحاكي واجهة برمجة تطبيقات (API) للتعامل مع البيانات
// في تطبيق حقيقي، سيتم استبدال هذا الكود بطلبات حقيقية إلى خادم (مثل Firebase أو Google Apps Script)

// بيانات أولية وهمية
let mockAppointments: Appointment[] = [
  { id: '1', patientName: 'أحمد محمود', phone: '0501234567', date: new Date().toISOString().split('T')[0], time: '10:00', visitType: VisitType.Checkup, status: AppointmentStatus.Confirmed, notes: 'يعاني من صداع نصفي.' },
  { id: '2', patientName: 'فاطمة الزهراء', phone: '0559876543', date: new Date().toISOString().split('T')[0], time: '10:30', visitType: VisitType.FollowUp, status: AppointmentStatus.Confirmed },
  { id: '3', patientName: 'خالد عبد العزيز', phone: '0533211234', date: new Date().toISOString().split('T')[0], time: '11:00', visitType: VisitType.Emergency, status: AppointmentStatus.Attended },
];

let mockPatients: Patient[] = [
  { id: 'p1', name: 'أحمد محمود', age: 45, phone: '0501234567', medicalHistory: 'ارتفاع ضغط الدم', diagnosis: 'صداع نصفي مزمن', medications: ['مسكنات', 'مضادات الاكتئاب'], doctorNotes: [{ date: '2023-10-15', note: 'بدأ المريض يشعر بتحسن مع العلاج الجديد.' }] },
  { id: 'p2', name: 'فاطمة الزهراء', age: 32, phone: '0559876543', medicalHistory: 'لا يوجد', diagnosis: 'قلق وتوتر', medications: ['مهدئات خفيفة'], doctorNotes: [] },
];

let mockInvoices: Invoice[] = [
  { id: 'inv1', patientName: 'خالد عبد العزيز', serviceType: 'كشف طارئ', amount: 500, paymentMethod: PaymentMethod.Card, date: new Date().toISOString().split('T')[0] },
];

let mockUsers: User[] = [
    { id: 'u1', email: 'doctor@clinic.com', name: 'د. محمد علي', role: UserRole.Doctor },
    { id: 'u2', email: 'assistant@clinic.com', name: 'سارة', role: UserRole.Assistant },
]

// دالة محاكاة للتأخير في الشبكة
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// واجهة برمجة التطبيقات الوهمية
export const api = {
  // دالة لمحاكاة عملية تسجيل الدخول
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    // كلمة المرور هنا وهمية لأغراض العرض فقط
    if (user && password === '123456') {
      return user;
    }
    return null;
  },

  // جلب جميع المواعيد
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(500);
    return [...mockAppointments];
  },

  // إضافة موعد جديد
  addAppointment: async (appointmentData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    await delay(500);
    const newAppointment: Appointment = {
      id: String(Date.now()),
      ...appointmentData,
      status: AppointmentStatus.Confirmed,
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },

  // تحديث حالة موعد
  updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<Appointment> => {
    await delay(300);
    const appointmentIndex = mockAppointments.findIndex(a => a.id === id);
    if (appointmentIndex > -1) {
      mockAppointments[appointmentIndex].status = status;
      return mockAppointments[appointmentIndex];
    }
    throw new Error('Appointment not found');
  },

  // جلب جميع المرضى
  getPatients: async (): Promise<Patient[]> => {
    await delay(500);
    return [...mockPatients];
  },
  
  // إضافة ملاحظة جديدة للمريض
  addPatientNote: async (patientId: string, note: string): Promise<Patient> => {
    await delay(400);
    const patientIndex = mockPatients.findIndex(p => p.id === patientId);
    if(patientIndex > -1) {
        mockPatients[patientIndex].doctorNotes.push({ date: new Date().toISOString().split('T')[0], note });
        return mockPatients[patientIndex];
    }
    throw new Error('Patient not found');
  },

  // جلب جميع الفواتير
  getInvoices: async (): Promise<Invoice[]> => {
    await delay(500);
    return [...mockInvoices];
  },

  // إضافة فاتورة جديدة
  addInvoice: async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
    await delay(500);
    const newInvoice: Invoice = {
      id: `inv${Date.now()}`,
      ...invoiceData,
    };
    mockInvoices.push(newInvoice);
    return newInvoice;
  },

  // جلب إحصائيات التقارير
  getReportStats: async (): Promise<ReportStats> => {
    await delay(700);
    return {
      dailyAppointments: mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
      newPatients: 5, // قيمة وهمية
      totalInvoices: mockInvoices.length,
      mostCommonCases: [
        { name: 'صداع نصفي', value: 40 },
        { name: 'صرع', value: 30 },
        { name: 'جلطة دماغية', value: 15 },
        { name: 'زهايمر', value: 10 },
      ],
    };
  },
};
