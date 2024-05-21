import { User } from "../entities/user-entity";
import { Pagination } from "./pagination";

export interface EmployeeRequest {
  companyId: string;
  pagination: Pagination;
}

export interface EmployeeWithHours {
  id: string;
  hourlyWage: number;
  nisPis?: string
}

export interface NearbyProps {
  company: {
    address: {
      lat: string | number;
      lng: string | number;
    };
    id: string;
    user: User
    addressId: string;
    categoryId: string;
    socialName: string;
    document: string;
    phone: string;
    employeeQuantity: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface DeactivateEmployeeProps {
  id: string,
  companyId: string,
  isActive?: boolean
}
