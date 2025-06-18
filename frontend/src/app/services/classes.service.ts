import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Classe {
  id: number;
  nom: string;
  filiere: { id: number; nom: string; };
  niveau: { id: number; nom: string; };
}

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private apiUrl = 'http://127.0.0.1:8000/api/classes/';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<Classe[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Classe[]>(this.apiUrl, { headers }).pipe(
      tap(data => console.log('Classes retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving classes')))
    );
  }

  getClasse(id: number): Observable<Classe> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Classe>(`${this.apiUrl}${id}/`, { headers }).pipe(
      tap(data => console.log('Classe retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving classe')))
    );
  }

  createClasse(classe: { filiere_id: number; niveau_id: number; nom: string }): Observable<Classe> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Classe>(this.apiUrl, classe, { headers }).pipe(
      tap(data => console.log('Classe created:', data)),
      catchError(error => throwError(() => new Error('Error creating classe')))
    );
  }

  updateClasse(id: number, classe: { filiere_id: number; niveau_id: number; nom: string }): Observable<Classe> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<Classe>(`${this.apiUrl}${id}/`, classe, { headers }).pipe(
      tap(data => console.log('Classe updated:', data)),
      catchError(error => throwError(() => new Error('Error updating classe')))
    );
  }

  deleteClasse(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.apiUrl}${id}/`, { headers }).pipe(
      tap(() => console.log('Classe deleted')),
      catchError(error => throwError(() => new Error('Error deleting classe')))
    );
  }
}
