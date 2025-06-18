import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Filiere, FilieresService } from '../services/filieres.service';
import { ClassesService } from '../services/classes.service';
import { Niveau, NiveauxService } from '../services/niveaux.service';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-classes-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-classes-create.component.html'
})
export class AdminClassesCreateComponent implements OnInit {
  classeForm: FormGroup;
  filieres: Filiere[] = [];
  niveaux: Niveau[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private classesService: ClassesService,
    private filieresService: FilieresService,
    private niveauxService: NiveauxService,
    public router: Router
  ) {
    this.classeForm = this.fb.group({
      filiere_id: ['', Validators.required],
      niveau_id: ['', Validators.required],
      nom: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFilieres();
    this.getNiveaux();
  }

  getFilieres(): void {
    this.filieresService.getFilieres().subscribe({
      next: (data) => this.filieres = data,
      error: () => this.errorMessage = 'Erreur lors du chargement des filières.'
    });
  }

  getNiveaux(): void {
    this.niveauxService.getNiveaux().subscribe({
      next: (data) => this.niveaux = data,
      error: () => this.errorMessage = 'Erreur lors du chargement des niveaux.'
    });
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      this.classesService.createClasse(this.classeForm.value).subscribe({
        next: () => this.router.navigate(['/admin/classes']),
        error: () => this.errorMessage = 'Erreur lors de la création de la classe.'
      });
    }
  }
}
