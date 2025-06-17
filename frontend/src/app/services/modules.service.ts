import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private apiUrl = 'http://127.0.0.1:8000/api/modules';
  private projetUrl = 'http://127.0.0.1:8000/api/projets';
  private soumissionUrl = 'http://127.0.0.1:8000/api/soumissions';
  private modulesUrl = this.apiUrl;
  constructor(private http: HttpClient) {}

  // ✅ Récupérer les modules pour un étudiant ou un professeur
  getModulesForUser(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('user_id'); 
    const classeId = localStorage.getItem('classe_id'); 

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('❌ Aucun token trouvé. Impossible d\'effectuer la requête.');
      return throwError(() => new Error('Non authentifié.'));
    }

    let url = this.apiUrl;

    if (userRole === 'etudiant' && classeId) {
      url += `?classe=${classeId}`;
    } else if (userRole === 'professeur' && userId) {
      url += `?enseignant=${userId}`;
    }

    return this.http.get<any[]>(url, { headers }).pipe(
      tap(data => console.log('📌 Modules récupérés:', data)),
      catchError(this.handleError)
    );
  }

  getModulesProf(): Observable<any> {
    return this.http.get(`${this.apiUrl}professeur/`);
  }

  // ✅ Récupérer les supports liés à un module
  getSupportsForModule(moduleId: number): Observable<any> {
    const token = localStorage.getItem('token'); // ✅ Récupération du token JWT
    if (!token) {
      console.error('❌ Aucun token trouvé. Impossible de récupérer les supports.');
      return throwError(() => new Error('Non authentifié.'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // ✅ Correction de l'URL (suppression du `/` en trop)
    const url = `${this.apiUrl}/${moduleId}/supports/`;

    return this.http.get(url, { headers }).pipe(
      tap(data => console.log(`✅ Supports récupérés pour le module ${moduleId}: `, data)),
      catchError(error => {
        console.error(`❌ Erreur lors du chargement des supports du module ${moduleId}:`, error);
        return throwError(() => new Error('Erreur lors de la récupération des supports.'));
      })
    );
  }

  // ✅ Récupérer les projets liés aux modules de l'enseignant
  getProjetsForUser(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('user_id');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('❌ Aucun token trouvé. Impossible d\'effectuer la requête.');
      return throwError(() => new Error('Non authentifié.'));
    }

    let url = this.projetUrl;
    if (userRole === 'professeur' && userId) {
      url += `?enseignant=${userId}`;
    }

    return this.http.get<any[]>(url, { headers }).pipe(
      tap(data => console.log('📌 Projets récupérés:', data)),
      catchError(this.handleError)
    );
  }

  // ✅ Récupérer les soumissions des étudiants pour les projets de l'enseignant
  getSoumissionsForUser(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Aucun token trouvé. Impossible d\'effectuer la requête.');
      return throwError(() => new Error('Non authentifié.'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<any[]>(this.soumissionUrl, { headers }).pipe(
      tap(data => console.log('📌 Soumissions récupérées:', data)),
      catchError(this.handleError)
    );
  }

  // 🔹 Gestion des erreurs API
  private handleError(error: any) {
    console.error('❌ Erreur API:', error);
    return throwError(() => new Error('Erreur lors de la récupération des données.'));
  }

  getEtudiantsParClasse(classeId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/api/utilisateurs/?classe=${classeId}&role=etudiant`, 
      { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('📌 Étudiants récupérés:', data)),
      catchError(this.handleError)
    );
  }
   // ✅ Récupérer les headers d'authentification
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('❌ Aucun token trouvé. Impossible d\'effectuer la requête.');
      return new HttpHeaders();
    }
    return headers;
  }

    // 2) Méthode pour la recherche de modules par titre
   // Méthode de recherche
   searchModules(term: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Aucun token trouvé. Impossible de faire la recherche.');
      return throwError(() => new Error('Non authentifié.'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // On appelle désormais /api/modules_search/?q=....
    const url = `http://127.0.0.1:8000/api/modules_search/?q=${term}`;
  
    return this.http.get<any[]>(url, { headers }).pipe(
      tap(data => console.log(`🔎 Résultats pour "${term}":`, data)),
      catchError(this.handleError)
    );
  }
  

  // ...

}
