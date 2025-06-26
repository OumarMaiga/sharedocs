// src/app/services/admin-user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_BASE_URL } from '../../config/api.config';

export interface AdminUser {
  id: number;
  username: string;
  role: string;
  classe?: string | null;
  // classe?: number | null;
  // Ajoutez d'autres champs si nécessaire
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private baseUrl = `${API_BASE_URL}/api`;
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createUser(userData: any): Observable<AdminUser> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<AdminUser>(`${this.baseUrl}/admin/users/create/`, userData, { headers }).pipe(
      tap(data => console.log('User created:', data)),
      catchError(error => throwError(() => new Error('Error creating user')))
    );
  }

  // Récupérer la liste de tous les utilisateurs
  getUsers(): Observable<AdminUser[]> {
    const url = `${this.baseUrl}/admin/users/list/`;
    return this.http.get<AdminUser[]>(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('Users retrieved:', data)),
        catchError(error => throwError(() => new Error('Error retrieving users')))
      );
  }

  
  // Récupérer la liste de tous les utilisateurs
  getEnseignants(): Observable<AdminUser[]> {
    const url = `${this.baseUrl}/utilisateurs/?role=professeur`;
    return this.http.get<AdminUser[]>(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('Users retrieved:', data)),
        catchError(error => throwError(() => new Error('Error retrieving users')))
      );
  }

  // Créer un nouvel utilisateur
 
  // Mettre à jour un utilisateur
  updateUser(userId: number, userData: any): Observable<AdminUser> {
    const url = `${this.baseUrl}/admin/users/${userId}/update/`;
    return this.http.patch<AdminUser>(url, userData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(data => console.log('User updated:', data)),
        catchError(error => throwError(() => new Error('Error updating user')))
      );
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/admin/users/${userId}/delete/`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log('User deleted:', userId)),
        catchError(error => throwError(() => new Error('Error deleting user')))
      );
  }
}
