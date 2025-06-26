// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private dashboardUrl = `${API_BASE_URL}/api/etudiant/dashboard/`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getEtudiantDashboard(): Observable<any> {
    return this.http.get<any>(this.dashboardUrl, {
      headers: this.getAuthHeaders(),
    });
  }
}
