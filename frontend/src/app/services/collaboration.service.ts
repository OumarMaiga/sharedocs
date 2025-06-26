import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = `${API_BASE_URL}/api/collaboration/`;

  constructor(private http: HttpClient) {}

  // ✅ Fonction pour récupérer les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  

  // ✅ Récupérer les projets de l'utilisateur
  getUserProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}user-projects/`, { headers: this.getAuthHeaders() });
  }

  // ✅ Récupérer les messages d'un espace de collaboration
// CollaborationService
getMessages(espaceId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}${espaceId}/messages/`, {
    headers: this.getAuthHeaders(),
  });
}


  // ✅ Envoyer un message (texte, fichier ou audio)
  sendMessage(espaceId: number, data: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post(`${this.apiUrl}${espaceId}/envoyer/`, data, { headers });
  }
  
  }
  

