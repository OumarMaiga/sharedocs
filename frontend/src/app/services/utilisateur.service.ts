import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${API_BASE_URL}/api/utilisateurs/`;

  constructor(private http: HttpClient) {}

  // ✅ Récupérer les étudiants d'une classe via le module
  getEtudiantsParClasse(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}etudiants-classe/?module_id=${moduleId}`);
  }
}
