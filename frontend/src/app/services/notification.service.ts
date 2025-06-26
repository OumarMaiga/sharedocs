import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://192.168.2.67:8000/api/notifications/';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer les notifications
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error("❌ Erreur lors de la récupération des notifications :", error);
        return throwError(error);
      })
    );
  }

  // ✅ Consulter une notification et récupérer le lien du support
  viewNotification(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/view/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error(`❌ Erreur lors de la consultation de la notification ID ${id} :`, error);
        return throwError(error);
      })
    );
  }

  // ✅ Supprimer une notification après consultation
  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/delete/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error(`❌ Erreur lors de la suppression de la notification ID ${id} :`, error);
        return throwError(error);
      })
    );
  }

  // ✅ Marquer toutes les notifications comme lues
  markAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}read/`, {}, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error("❌ Erreur lors du marquage des notifications comme lues :", error);
        return throwError(error);
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
