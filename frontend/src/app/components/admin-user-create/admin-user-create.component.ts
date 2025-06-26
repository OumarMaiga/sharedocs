import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminUserService } from '../../services/admin-user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { API_BASE_URL } from '../../../config/api.config';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-user-create.component.html',
  styleUrls: ['./admin-user-create.component.scss']
})
export class AdminUserCreateComponent implements OnInit {
  userForm: FormGroup;
  errorMessage = '';
  // Liste des classes récupérées depuis l'API
  classes: any[] = [];

  // Endpoint pour récupérer les classes (à adapter selon votre configuration)
  private classesApiUrl = `${API_BASE_URL}/api/classes/`;

  constructor(
    private fb: FormBuilder,
    private adminUserService: AdminUserService,
    private http: HttpClient,
    public router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['etudiant', Validators.required],
      // Pour les étudiants, on choisira l'id de la classe
      classe: ['']
    });
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    // Vous pouvez adapter cet appel en fonction de l'endpoint de vos classes
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(this.classesApiUrl, { headers }).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
        this.errorMessage = "Erreur lors du chargement des classes.";
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    const formData = { ...this.userForm.value };

    // Pour un professeur, on force le champ classe à null
    if (formData.role !== 'etudiant') {
      formData.classe = null;
    }

    this.adminUserService.createUser(formData).subscribe({
      next: (user) => {
        console.log('Utilisateur créé:', user);
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error("Erreur lors de la création de l'utilisateur:", err);
        this.errorMessage = "Erreur lors de la création de l'utilisateur.";
      }
    });
  }
}
