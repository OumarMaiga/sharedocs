import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiTokenUrl = 'http://192.168.2.67:8000/api/token/';
  private userInfoUrl = 'http://192.168.2.67:8000/api/utilisateur/me/';
  private professorModulesUrl = 'http://192.168.2.67:8000/api/modules/professeur/';

  constructor(private http: HttpClient, private router: Router) {}

  // Connexion et récupération des informations utilisateur
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiTokenUrl, { username, password }).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('token', response.access);
          localStorage.setItem('username', username);
          this.fetchUserInfo();
        }
      })
    );
  }

  // Récupération des informations utilisateur
  private fetchUserInfo(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(this.userInfoUrl, { headers }).subscribe(
      user => {
        // Si l'utilisateur est superuser, on force le rôle 'admin'
        if (user.is_superuser) {
          localStorage.setItem('role', 'admin');
          localStorage.setItem('user_id', user.id.toString());
          this.router.navigate(['/admin/dashboard']); // Dashboard admin
        } else {
          localStorage.setItem('role', user.role);
          localStorage.setItem('user_id', user.id.toString());
          if (user.role === 'etudiant' && user.classe) {
            localStorage.setItem('classe_id', user.classe.toString());
            this.router.navigate(['/home']); // Dashboard étudiant
          } else if (user.role === 'professeur') {
            this.router.navigate(['/prof-dashboard']); // Dashboard professeur
          } else {
            this.router.navigate(['/login']); // Cas inconnu
          }
        }
      },
      error => {
        console.error("Erreur lors de la récupération des infos utilisateur :", error);
        this.router.navigate(['/login']);
      }
    );
  }

  // Déconnexion
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Récupérer les modules du professeur connecté
  getProfessorModules(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Aucun token trouvé, accès refusé.");
      return new Observable(observer => observer.error("Utilisateur non authentifié"));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.professorModulesUrl, { headers }).pipe(
      tap(data => console.log("Modules du professeur récupérés :", data))
    );
  }
}
