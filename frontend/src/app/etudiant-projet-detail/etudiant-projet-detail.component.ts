import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EtudiantProjetService } from '../services/etudiantprojet.service';
import { StudentSubmissionService } from '../services/student-submission.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CommonModule, NgIf, NgFor } from '@angular/common';
//import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';
import { CollaborationComponent } from '../components/collaboration/collaboration.component'; // ✅ Importer le composant
import { CollaborationService } from '../services/collaboration.service';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-etudiant-projet-detail',
  templateUrl: './etudiant-projet-detail.component.html',
  styleUrls: ['./etudiant-projet-detail.component.css'],
  imports: [CommonModule, NgIf, NgFor, SidebarComponent, NavbarComponent, RouterModule,CollaborationComponent]
})
export class EtudiantProjetDetailComponent implements OnInit {
  projet: any;
  submissions: any[] = [];
  isLoading = false;
  errorMessage = '';
 // Utilisation de "inject" pour récupérer DomSanitizer
 private sanitizer: DomSanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private etudiantProjetService = inject(EtudiantProjetService);
  private studentSubmissionService = inject(StudentSubmissionService);

  ngOnInit(): void {
    const projetId = Number(this.route.snapshot.paramMap.get('id'));
    if (projetId) {
      this.fetchProjetDetail(projetId);
      this.fetchSubmissions(projetId);
    } else {
      this.errorMessage = 'ID de projet invalide';
    }
  }

  fetchProjetDetail(projetId: number): void {
    this.isLoading = true;
    this.etudiantProjetService.getProjetDetail(projetId).subscribe({
      next: (data) => {
        this.projet = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du projet', error);
        this.errorMessage = 'Erreur lors de la récupération du projet';
        this.isLoading = false;
      }
    });
  }

  fetchSubmissions(projetId: number): void {
    this.studentSubmissionService.getStudentSubmissionsForProject(projetId).subscribe({
      next: (data) => {
        this.submissions = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des soumissions', error);
        this.errorMessage = 'Erreur lors de la récupération des soumissions';
      }
    });
  }

  viewSubmissionDetails(submission: any): void {
    // Implémentez la navigation ou l'affichage des détails d'une soumission
    console.log('Détails de la soumission', submission);
  }
    // Méthode pour créer une URL sécurisée
    // Utilisez bypassSecurityTrustResourceUrl au lieu de bypassSecurityTrustUrl
  getSafeFileUrl(filePath: string): SafeResourceUrl {
    const fullUrl = `${API_BASE_URL}` + filePath;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }
}
