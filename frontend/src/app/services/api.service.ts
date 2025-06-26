import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${API_BASE_URL}/api`;  // URL de l'API Django

  constructor(private http: HttpClient) {}

  // ✅ Récupérer les modules d'un professeur
  getModulesProfesseur(): Observable<any> {
    return this.http.get(`${this.apiUrl}/professeur/modules/`, this.getAuthHeaders());
  }

  // ✅ Récupérer les étudiants d'une classe
  getEtudiantsParClasse(classeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/classes/${classeId}/etudiants/`, this.getAuthHeaders());
  }

  // ✅ Créer un projet avec FormData (supporte l'upload de fichiers)
  creerProjet(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/projets/creer/`, data, this.getAuthHeaders(true));
  }

  // ✅ Générer les en-têtes d'authentification avec le token JWT
  private getAuthHeaders(isFormData = false): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');  // Token JWT stocké après connexion
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return { headers };
  }
}
