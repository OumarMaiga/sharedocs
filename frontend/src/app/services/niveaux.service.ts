import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_BASE_URL } from '../../config/api.config';

export interface Niveau {
  id: number;
  nom: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NiveauxService {
  private apiUrl = `${API_BASE_URL}/api/niveaux/`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // 🔹 Récupérer tous les niveaux
  getNiveaux(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Niveaux retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving niveaux')))
    );
  }

  // 🔹 Récupérer un niveau par ID
  getNiveau(id: number): Observable<Niveau> {
    return this.http.get<Niveau>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Niveau retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving niveau')))
    );
  }

  // 🔹 Créer un niveau
  createNiveau(niveau: Partial<Niveau>): Observable<Niveau> {
    return this.http.post<Niveau>(this.apiUrl, niveau, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Niveau created:', data)),
      catchError(error => throwError(() => new Error('Error creating niveau')))
    );
  }

  // 🔹 Mettre à jour un niveau
  updateNiveau(id: number, niveau: Partial<Niveau>): Observable<Niveau> {
    return this.http.put<Niveau>(`${this.apiUrl}${id}/`, niveau, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Niveau updated:', data)),
      catchError(error => throwError(() => new Error('Error updating niveau')))
    );
  }

  // 🔹 Supprimer un niveau
  deleteNiveau(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() }).pipe(
      tap(data => console.log('Niveau deleted:', data)),
      catchError(error => throwError(() => new Error('Error deleting niveau')))
    );
  }
}
