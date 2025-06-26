import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProfModuleService {
  private apiUrl = `${API_BASE_URL}/api/modules/`; // ✅ Base de l'API

  constructor(private http: HttpClient) {}

  // ✅ Récupérer le token JWT stocké localement et générer les en-têtes d'autorisation
  private getAuthHeaders(isFileUpload: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Aucun token JWT trouvé. Redirection nécessaire.');
      return new HttpHeaders();
    }

    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    if (!isFileUpload) {
      headers = headers.set('Content-Type', 'application/json'); // ✅ Ajouter uniquement pour JSON
    }

    return headers;
  }

  // ✅ Récupérer les modules du professeur connecté
  getModulesProf(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}professeur/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => this.handleError(error, "Erreur lors de la récupération des modules"))
    );
  }

  // ✅ Récupérer les détails d’un module par ID
  getModuleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => this.handleError(error, "Erreur lors de la récupération du module"))
    );
  }

  // ✅ Récupérer les supports d’un module spécifique
  refreshModuleSupports(moduleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${moduleId}/supports/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => this.handleError(error, "Erreur lors de la récupération des supports"))
    );
  }

  // ✅ Ajouter un support à un module (FormData pour fichiers)
  ajouterSupport(moduleId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${moduleId}/ajouter-support/`, 
      formData, 
      { headers: this.getAuthHeaders(true) } // ✅ `true` pour ne pas mettre `Content-Type`
    ).pipe(
      catchError((error) => this.handleError(error, "Erreur lors de l'ajout du support"))
    );
  }

  // ✅ Supprimer un support
  supprimerSupport(supportId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}supports/${supportId}/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => this.handleError(error, "Erreur lors de la suppression du support"))
    );
  }

  // ✅ Gestion des erreurs centralisée
  private handleError(error: any, message: string) {
    console.error(`❌ ${message} :`, error);
    
    if (error.status === 401) {
      console.error("🔴 Le token JWT est invalide ou expiré. Redirection vers la page de connexion...");
      // Rediriger vers la page de connexion si nécessaire
    } else if (error.status === 404) {
      console.error("🔍 Ressource non trouvée.");
    } else {
      console.error("⚠️ Erreur serveur inconnue.");
    }

    return throwError(() => error);
  }
}
