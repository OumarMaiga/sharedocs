import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminTimetableService {
  private apiUrl = 'http://192.168.2.67:8000/api';

  constructor(private http: HttpClient) {}

  // Prépare les en-têtes d'authentification sans forcer le Content-Type
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('access_token'); 
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }

  // Méthode pour ajouter un emploi du temps (upload d'un fichier)
  addTimetable(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/emplois-du-temps/ajouter/`, formData, this.getAuthHeaders())
      .pipe(
        tap(response => console.log('Emploi du temps ajouté', response)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMsg = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Erreur: ${error.error.message}`;
    } else {
      errorMsg = `Erreur ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
