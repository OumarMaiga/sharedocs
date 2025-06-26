import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProjetSubmissionService {
  // URL de base de votre API Django
  private apiUrl = `${API_BASE_URL}/api`;

  constructor(private http: HttpClient) {}

  /**
   * Prépare les en-têtes d'authentification pour une requête.
   * Pour les requêtes multipart/form-data, on ne définit PAS le Content-Type.
   */
  private getAuthHeaders(isFormData = false): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  /**
   * Envoie la soumission du projet.
   * @param projetId - L'ID du projet auquel l'étudiant est assigné.
   * @param file - Le fichier à soumettre.
   * @returns Un Observable avec la réponse de l’API.
   */
  submitProject(projetId: number, file: File): Observable<any> {
    const formData = new FormData();
    // La clé "fichier" doit correspondre à request.FILES.get("fichier") côté Django
    formData.append('fichier', file, file.name);
    const url = `${this.apiUrl}/projets/${projetId}/soumettre/`;
    return this.http.post(url, formData, this.getAuthHeaders(true));
  }
}
