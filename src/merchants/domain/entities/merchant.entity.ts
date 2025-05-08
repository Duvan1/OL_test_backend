export interface IMerchant {
  id: number;
  name: string;
  document_type: string;
  document_number: string;
  phone: string;
  email: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  establishments?: IEstablishment[];
}

export interface IEstablishment {
  id: number;
  name: string;
  revenue: number;
  employee_count: number;
  municipality?: IMunicipality;
}

export interface IMunicipality {
  id: number;
  name: string;
} 