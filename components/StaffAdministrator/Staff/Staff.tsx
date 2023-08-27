
export interface Staff {
    id: string;
    name: string;
    lastName1: string;
    lastName2: string | null;
    phone: string;
    salary: number;
    position: string;
    address: string;
    email: string;
    dateBirth: string;
    dateStart: string;
    dateFinish: string | null;
    status: boolean;
    cedula: string;
    bankAccount: string;
    AccountType: string;
    currency: string;
    bankRoute: string;
    idCity: string;
  }
  
  export interface Professor {
    id: string;
    academicCategory: string;
    idStaff: string;
  }
  
