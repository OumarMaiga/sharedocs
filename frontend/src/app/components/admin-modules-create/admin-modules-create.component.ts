import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminModulesService } from '../../services/admin-modules.service';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-modules-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-modules-create.component.html',
  styleUrls: ['./admin-modules-create.component.scss']
})
export class AdminModulesCreateComponent implements OnInit {
  moduleForm: FormGroup;
  errorMessage = '';
  enseignants: any[] = [];
  classes: any[] = [];

  // Endpoints pour récupérer les listes (à adapter selon votre API)
  private enseignantsUrl = 'http://127.0.0.1:8000/api/utilisateurs/?role=professeur';
  private classesUrl = 'http://127.0.0.1:8000/api/classes/';

  constructor(
    private fb: FormBuilder,
    private adminModulesService: AdminModulesService,
    private http: HttpClient,
    public router: Router
  ) {
    this.moduleForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      enseignant_id: ['', Validators.required],
      classe_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEnseignants();
    this.loadClasses();
  }

  loadEnseignants(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(this.enseignantsUrl, { headers }).subscribe({
      next: (data) => {
        this.enseignants = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des enseignants:', err);
      }
    });
  }

  loadClasses(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(this.classesUrl, { headers }).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.moduleForm.invalid) return;
    const formData = this.moduleForm.value;
    this.adminModulesService.createModule(formData).subscribe({
      next: (data) => {
        console.log('Module créé:', data);
        this.router.navigate(['/admin/modules']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du module:', err);
        this.errorMessage = "Erreur lors de la création du module.";
      }
    });
  }
}
