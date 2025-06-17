import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfNotificationService {
  private apiUrl = 'http://127.0.0.1:8000/api';

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
