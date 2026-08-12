// Bursary/Finance Types

export interface BursaryStats {
  totalReceipts: number;
  transactionsThisMonth: number;
  totalCollected: number;
  totalOutstanding: number;
  studentsOwing: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  academicYear: string;
  term: string;
  scope: "ALL_STUDENTS" | "BY_CLASS" | "BY_STUDENT";
  intakeType?: string;
  classes?: BillClass[];
  students?: BillStudent[];
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface BillClass {
  class: {
    id: string;
    name: string;
  };
}

export interface BillStudent {
  studentId: string;
}

export interface FeeCollection {
  id: string;
  invoiceNumber: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
  };
  amount: number;
  amountPaid: number;
  balance: number;
  status: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
  paymentDate?: string;
  dueDate: string;
  description: string;
  academicYear: string;
  term: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  student: {
    firstName: string;
    lastName: string;
    admissionNumber: string;
  };
  billId: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
  dueDate: string;
  description: string;
  academicYear: string;
  term: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeRecord {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookPrice {
  id: string;
  bookName: string;
  className: string;
  price: number;
  academicYear: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
