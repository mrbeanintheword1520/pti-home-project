// =============================================
// PTI HOME – MODEL: Lead (Khách hàng tiềm năng)
// =============================================

export interface Lead {
  id?: string;
  phone: string;
  name?: string;
  email?: string;
  purpose: LeadPurpose;
  budget?: number;           // VND
  investmentTime?: string;   // Ví dụ: '3-6 tháng', '1 năm'
  notes?: string;
  score?: number;            // Smart Lead System: 0–100
  status: LeadStatus;
  sessionId?: string;
  createdAt?: Date;
}

export type LeadPurpose = 'buy-to-live' | 'invest' | 'rent' | 'explore';
export type LeadStatus = 'hot' | 'warm' | 'cold' | 'unqualified';
