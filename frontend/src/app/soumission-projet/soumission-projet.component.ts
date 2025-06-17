import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ProjetSubmissionService } from '../services/soumission-projet.service';

@Component({
  selector: 'app-soumission-projet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './soumission-projet.component.html',
  styleUrls: ['./soumission-projet.component.scss']
})
export class SoumissionProjetComponent implements OnInit {
  submissionForm!: FormGroup;
  selectedFile: File | null = null;
  message: string = '';
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private submissionService = inject(ProjetSubmissionService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Récupère l'ID du projet depuis l'URL (ex: /soumission-projet/1)
    const projetId = Number(this.route.snapshot.paramMap.get('id'));
    this.submissionForm = this.fb.group({
      projetId: [projetId, Validators.required],
      fichier: [null, Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.submissionForm.patchValue({ fichier: this.selectedFile });
      console.log('📁 Fichier sélectionné :', this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.submissionForm.invalid || !this.selectedFile) {
      this.errorMessage = 'Veuillez remplir le formulaire et sélectionner un fichier.';
      return;
    }

    const projetId = Number(this.submissionForm.value.projetId);
    console.log('🚀 Données envoyées :', this.submissionForm.value);

    this.submissionService.submitProject(projetId, this.selectedFile)
      .subscribe({
        next: (response) => {
          this.message = 'Projet soumis avec succès !';
          this.errorMessage = '';
          this.submissionForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('❌ Erreur lors de la soumission :', err);
          this.errorMessage = 'Erreur lors de la soumission du projet.';
        }
      });
  }
}
