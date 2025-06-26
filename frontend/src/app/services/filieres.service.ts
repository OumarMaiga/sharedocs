import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Filiere {
  id: number;
  nom: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilieresService {
  private apiUrl = 'http://192.168.2.67:8000/api/filieres/';

  constructor(private http: HttpClient) {}

  getFilieres(): Observable<Filiere[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Filiere[]>(this.apiUrl, { headers }).pipe(
      tap(data => console.log('Filieres retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving filieres')))
    );
  }

  getFiliere(id: number): Observable<Filiere> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Filiere>(`${this.apiUrl}${id}/`, { headers }).pipe(
      tap(data => console.log('Filiere retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving filiere')))
    );
  }

  createFiliere(filiere: Partial<Filiere>): Observable<Filiere> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Filiere>(this.apiUrl, filiere, { headers }).pipe(
      tap(data => console.log('Filiere created:', data)),
      catchError(error => throwError(() => new Error('Error creating filiere')))
    );
  }

  updateFiliere(id: number, filiere: Partial<Filiere>): Observable<Filiere> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Filiere>(`${this.apiUrl}${id}/`, filiere, { headers }).pipe(
      tap(data => console.log('Filiere updated:', data)),
      catchError(error => throwError(() => new Error('Error updating filiere')))
    );
  }

  deleteFiliere(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}${id}/`, { headers }).pipe(
      tap(data => console.log('Filiere deleted:', data)),
      catchError(error => throwError(() => new Error('Error deleting filiere')))
    );
  }
}
