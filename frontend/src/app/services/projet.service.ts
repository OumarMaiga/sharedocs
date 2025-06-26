import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = 'http://192.168.2.67:8000/api/'; // S'assure que l'URL API est correcte

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    });
  }

  getEtudiantsParClasse(classeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}utilisateurs/classe/${classeId}/`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('📌 Étudiants récupérés:', data)),
        catchError(err => {
          console.error('❌ Erreur API:', err);
          return throwError(() => new Error('Erreur lors de la récupération des étudiants.'));
        })
      );
  }

  creerProjet(projetData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}projets/creer/`, projetData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log('✅ Projet créé avec succès')),
        catchError(err => {
          console.error('❌ Erreur lors de la création du projet:', err);
          return throwError(() => new Error('Erreur de création du projet.'));
        })
      );
  }

  getModulesProf(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}professeur/modules/`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('📌 Modules récupérés:', data)),
        catchError(err => {
          console.error('❌ Erreur API:', err);
          return throwError(() => new Error('Erreur lors de la récupération des modules.'));
        })
      );
  }
}
