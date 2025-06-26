import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class StudentSubmissionService {
  // URL de base de votre API Django
  private apiUrl = `${API_BASE_URL}/api`;

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

  // Récupère le détail d'un projet
  getProjetDetail(projetId: number): Observable<any> {
    const url = `${this.apiUrl}/projets/${projetId}/`;
    return this.http.get(url, this.getAuthHeaders());
  }

  // Récupère les soumissions de l'étudiant pour un projet donné
  getStudentSubmissionsForProject(projetId: number): Observable<any> {
    const url = `${this.apiUrl}/soumissions/projet/${projetId}/`;
    return this.http.get(url, this.getAuthHeaders());
  }
}
