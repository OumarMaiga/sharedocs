import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProfNotificationService {
  private apiUrl = `${API_BASE_URL}/api`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // ✅ Récupérer les notifications du professeur
  getProfNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications/prof/`, { headers: this.getAuthHeaders() });
  }

  // ✅ Supprimer une notification du professeur
  deleteProfNotification(notifId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/prof/delete/${notifId}/`, { 
      headers: this.getAuthHeaders() 
    });
  }
  
}
