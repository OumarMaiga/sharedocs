import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ProfSubmissionService } from '../services/prof-submission.service';
import { ProfNavbarComponent } from '../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../components/prof-sidebar/prof-sidebar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prof-submissions',
  standalone: true,
  templateUrl: './prof-submissions.component.html',
  styleUrls: ['./prof-submissions.component.scss'],
  imports: [CommonModule, NgIf, NgFor, RouterModule, FormsModule, ProfNavbarComponent, ProfSidebarComponent]
})
export class ProfSubmissionsComponent implements OnInit {
  moduleId!: number;
  submissions: any[] = [];
  isLoading = false;
  errorMessage: string = '';

  private route = inject(ActivatedRoute);
  private profSubmissionService = inject(ProfSubmissionService);

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.moduleId) {
      this.fetchSubmissions(this.moduleId);
    } else {
      this.errorMessage = "ID de module invalide.";
    }
  }

  fetchSubmissions(moduleId: number): void {
    this.isLoading = true;
    this.profSubmissionService.getSubmissionsForModule(moduleId)
      .subscribe({
        next: (data) => {
          this.submissions = data.map((submission: any) => ({
            ...submission,
            newNote: null,
            newFeedback: ''
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des soumissions:", err);
          this.errorMessage = "Erreur lors de la récupération des soumissions.";
          this.isLoading = false;
        }
      });
  }

  noterSoumission(submission: any): void {
    if (submission.newNote === null || submission.newFeedback.trim() === '') {
      alert("Veuillez saisir une note et un feedback.");
      return;
    }

    this.profSubmissionService.noterSoumission(submission.id, submission.newNote, submission.newFeedback)
      .subscribe({
        next: () => {
          submission.note = submission.newNote;
          submission.feedback = submission.newFeedback;
          submission.newNote = null;
          submission.newFeedback = '';
        },
        error: (err) => {
          console.error("Erreur lors de l'envoi de la note:", err);
          alert("Erreur lors de l'envoi de la note.");
        }
      });
  }
}
