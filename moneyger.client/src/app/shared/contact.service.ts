import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactRequest } from '../interfaces/contact-request'; // Make sure to import the interface for Contacts
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  apiUrl: string = environment.apiBaseUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  getContacts(): Observable<ContactRequest[]> { // Change the return type to match the expected array of Contacts
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<ContactRequest[]>(`${this.apiUrl}/Contact/AllCompany`, { headers });
  }
}