import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_BASE_URL } from '../../config/api.config';

export interface Module {
  id: number;
  titre: string;
  description: string;
  enseignant: { id: number; username: string };
  classe: { id: number; nom: string };
  date_creation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminModulesService {
  // Utilisation de l'URL dédiée pour le superadmin
  private apiUrl = `${API_BASE_URL}/api/admin/modules/all/`;

  constructor(private http: HttpClient) {}

  // Récupère tous les modules (pour l'administrateur)
  getAllModules(): Observable<Module[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Module[]>(this.apiUrl, { headers }).pipe(
      tap(data => console.log('Modules (admin) retrieved:', data)),
      catchError(error => throwError(() => new Error('Error retrieving modules')))
    );
  }

  // Méthode pour créer un module
  createModule(moduleData: any): Observable<Module> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Ici, on suppose que le backend gère la création à l'URL /api/modules/
    return this.http.post<Module>(`${API_BASE_URL}/api/modules/`, moduleData, { headers }).pipe(
      tap(data => console.log('Module created:', data)),
      catchError(error => throwError(() => new Error('Error creating module')))
    );
  }

  // Méthode pour mettre à jour un module
  updateModule(id: number, moduleData: any): Observable<Module> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Module>(`${API_BASE_URL}/modules/${id}/`, moduleData, { headers }).pipe(
      tap(data => console.log('Module updated:', data)),
      catchError(error => throwError(() => new Error('Error updating module')))
    );
  }

  // Méthode pour supprimer un module
  deleteModule(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${API_BASE_URL}/modules/${id}/`, { headers }).pipe(
      tap(data => console.log('Module deleted:', data)),
      catchError(error => throwError(() => new Error('Error deleting module')))
    );
  }
}
