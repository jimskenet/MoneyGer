import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmplAstSwitchBlockCase } from '@angular/compiler';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../interfaces/role';
import { CompanyRequest } from '../interfaces/company-request';
import { CompanyJoin } from '../interfaces/company-join';
import { AuthService } from './auth.service';
import { EmployeeRequest } from '../interfaces/employee-request';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  apiUrl:string = environment.apiBaseUrl;
  
  constructor(private http:HttpClient, private authService: AuthService) { }

  createCompany(data: CompanyRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/Company`, data, { headers });
  }

  joinCompany(data: CompanyJoin): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/Company/AssignCompany`, data, { headers });
  }

  getEmployees(): Observable<EmployeeRequest[]> { // Change the return type to match the expected array of Employees
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<EmployeeRequest[]>(`${this.apiUrl}/Company/Employee`, { headers });
  }

  deleteEmployees(employeeIds: string[]): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.request<AuthResponse>('delete', `${this.apiUrl}/Company/DeleteEmployee`, {
      body: employeeIds,
      headers: headers
    });
  }

  addEmployee(data: string): Observable<AuthResponse> {
    const headers = new HttpHeaders('content-type: application/json').set('Authorization', `Bearer ${this.authService.getToken()}`);
    const body = JSON.stringify(data);
    return this.http.post<AuthResponse>(`${this.apiUrl}/Company/Invite`, body, { headers });
  }

  clearCompanyData(): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.request<AuthResponse>('put', `${this.apiUrl}/Company/ClearCompanyData`, {
      headers: headers
    });
  }

  deleteCompany(): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.request<AuthResponse>('delete', `${this.apiUrl}/Company/DeleteCompany`, {
      headers: headers
    });
  }
}
