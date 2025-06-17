import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfSubmissionService {
  // URL de base de votre API Django
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Prépare les en-têtes d'authentification
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  // Récupère les soumissions pour un module donné pour le professeur connecté
  getSubmissionsForModule(moduleId: number): Observable<any> {
    const url = `${this.apiUrl}/soumissions/prof/module/${moduleId}/`;
    return this.http.get(url, this.getAuthHeaders());
  }
  noterSoumission(soumissionId: number, note: number, feedback: string): Observable<any> {
    const url = `${this.apiUrl}/soumissions/${soumissionId}/noter/`;
    const body = { note, feedback };
    return this.http.post(url, body, this.getAuthHeaders());
  }
}
