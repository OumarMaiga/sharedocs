import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FilieresService } from '../../services/filieres.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-filieres-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-filieres-create.component.html',
  styleUrls: ['./admin-filieres-create.component.scss']
})
export class AdminFilieresCreateComponent implements OnInit {
  filiereForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private filieresService: FilieresService,
    public router: Router
  ) {
    this.filiereForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.filiereForm.invalid) return;
    const formData = this.filiereForm.value;
    this.filieresService.createFiliere(formData).subscribe({
      next: (data) => {
        console.log('Filière créée:', data);
        this.router.navigate(['/admin/filieres']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la filière:', err);
        this.errorMessage = "Erreur lors de la création de la filière.";
      }
    });
  }
}
