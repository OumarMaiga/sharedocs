import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://192.168.2.67:8000/api/utilisateurs/';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer les étudiants d'une classe via le module
  getEtudiantsParClasse(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}etudiants-classe/?module_id=${moduleId}`);
  }
}
