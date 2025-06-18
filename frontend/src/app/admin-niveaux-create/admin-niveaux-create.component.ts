import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NiveauxService } from '../services/niveaux.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-niveaux-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-niveaux-create.component.html',
  styleUrls: ['./admin-niveaux-create.component.css']
})
export class AdminNiveauxCreateComponent {

  niveauForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private niveauService: NiveauxService,
    public router: Router
  ) {
    this.niveauForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.niveauForm.valid) {
      this.niveauService.createNiveau(this.niveauForm.value).subscribe({
        next: () => this.router.navigate(['/admin/niveaux']),
        error: () => this.errorMessage = 'Erreur lors de la création.'
      });
    }
  }
}
