import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfModuleService {
  private apiUrl = 'http://127.0.0.1:8000/api/modules/professeur/';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer les headers avec un token valide
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('❌ Aucun token trouvé, l\'utilisateur doit se reconnecter.');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Récupérer les modules du professeur connecté
  getModulesProf(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error("❌ Erreur lors de la récupération des modules :", error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Ajouter un support à un module
  ajouterSupport(moduleId: number, formData: FormData): Observable<any> {
    const url = `http://127.0.0.1:8000/api/modules/${moduleId}/ajouter-support/`;
    return this.http.post<any>(url, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error("❌ Erreur lors de l'ajout du support :", error);
        return throwError(() => error);
      })
    );
  }
}
