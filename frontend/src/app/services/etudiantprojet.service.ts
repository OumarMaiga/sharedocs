import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EtudiantProjetService {
  // URL de l'API Django
  private apiUrl = `${API_BASE_URL}/api`;

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les en-têtes d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    console.log('🔍 Token récupéré:', token); // Affiche le token dans la console

    // Prépare les en-têtes avec Content-Type et l'Authorization en utilisant Bearer
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  
  // Récupère la liste des projets assignés à l'étudiant connecté
  getProjetsEtudiant(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projets_etudiant/`, { headers: this.getAuthHeaders() });
  }

  // Récupère le détail d'un projet spécifique
  getProjetDetail(projetId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projets/${projetId}/`, { headers: this.getAuthHeaders() });
  }
}
