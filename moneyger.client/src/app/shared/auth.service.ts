import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmplAstSwitchBlockCase } from '@angular/compiler';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { UserCompanyDetail } from '../interfaces/user-company-detail';
import { EditProfile } from '../interfaces/edit-profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl:string = environment.apiBaseUrl;
  private tokenKey = 'token'

  constructor(private http:HttpClient) { }

  login(data:LoginRequest):Observable<AuthResponse>{
    return this.http
    .post<AuthResponse>(`${this.apiUrl}/moneyger_users/Login`, data)
    .pipe(
      map((response)=>{
        if(response.isSuccess){
          localStorage.setItem(this.tokenKey,response.token);
        }
          return response;
      })
    )
  }

  isLoggedIn=():boolean=>{
    const token = this.getToken();
    if(!token) return false;

    return !this.isTokenExpired();
  }

  private isTokenExpired(){
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']!*1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout=():void=>{
    localStorage.removeItem(this.tokenKey);
  };

  public getToken = ():string|null => localStorage.getItem(this.tokenKey) || '';

  getUserDetail=()=>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken:any = jwtDecode(token);
    const userDetail = {
      id:decodedToken.nameid,
      fullname: decodedToken.name,
      firstname: decodedToken.firstname,
      lastname: decodedToken.lastname,
      email: decodedToken.email,
      company: decodedToken.company,
      phonenumber: decodedToken.phonenumber,
      facebook: decodedToken.facebook,
      twitter: decodedToken.twitter,
      instagram: decodedToken.instagram
    };

    return userDetail;
  }
  
  getUserCompany(): Observable<UserCompanyDetail> { // Change the return type to match the expected array of Contacts
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<UserCompanyDetail>(`${this.apiUrl}/moneyger_users/UserDetail`, { headers });
  }

  performRequest(method: string, url: string, body?: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.request(method, url, { body, headers });
  }
  
  register(data:RegisterRequest):Observable<AuthResponse>{
    return this.http
    .post<AuthResponse>(`${this.apiUrl}/moneyger_users/Register`, data)
  }

  deleteAccount(): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.request<AuthResponse>('delete', `${this.apiUrl}/moneyger_users  `, {
      headers: headers
    });
  }

  forgotPassword = (email:string) : Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/moneyger_users/ForgotPassword`,{email});

  resetPassword = (data:ResetPasswordRequest) : Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}/moneyger_users/ResetPassword`,data);

  editProfile(data:EditProfile): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/moneyger_users/EditProfile`, data, {headers});
  }


}