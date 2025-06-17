import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminTimetableService } from '../../services/admin-timetable.service';

@Component({
  selector: 'app-admin-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-timetable.component.html',
  styleUrls: ['./admin-timetable.component.scss']
})
export class AdminTimetableComponent implements OnInit {
  timetableForm!: FormGroup;
  message: string = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private adminTimetableService: AdminTimetableService) {}

  ngOnInit(): void {
    this.timetableForm = this.fb.group({
      fichier: [null, Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.timetableForm.patchValue({ fichier: input.files[0] });
    }
  }

  onSubmit(): void {
    if (this.timetableForm.invalid) {
      this.message = 'Veuillez sélectionner un fichier.';
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    formData.append('fichier', this.timetableForm.get('fichier')?.value);
    
    this.adminTimetableService.addTimetable(formData).subscribe({
      next: (response) => {
        this.message = 'Emploi du temps ajouté avec succès !';
        this.isLoading = false;
        this.timetableForm.reset();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'emploi du temps:', error);
        this.message = error.message;
        this.isLoading = false;
      }
    });
  }
}
