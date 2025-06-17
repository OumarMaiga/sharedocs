import { Component, OnInit } from '@angular/core';
import { EtudiantProjetService } from '../services/etudiantprojet.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-etudiant-projets',
  templateUrl: './etudiant-projets.component.html',
  styleUrls: ['./etudiant-projets.component.css'],
  imports: [NgFor, NgIf, NavbarComponent, SidebarComponent],
})
export class EtudiantProjetsComponent implements OnInit {
  projets: any[] = [];
  isLoading = false;
  errorMessage = '';
  showNotifications = false;

  // Pagination
  pageIndex = 0;
  pageSize = 5; // Nombre d'éléments par page

  constructor(
    private etudiantProjetService: EtudiantProjetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProjets();
  }

  fetchProjets(): void {
    this.isLoading = true;
    this.etudiantProjetService.getProjetsEtudiant().subscribe({
      next: (data) => {
        this.projets = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des projets', error);
        this.errorMessage = 'Erreur lors de la récupération des projets';
        this.isLoading = false;
      }
    });
  }

  // Navigue vers le détail du projet
  viewProjetDetail(projet: any): void {
    this.router.navigate(['/etudiant-projet-detail', projet.id]);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Retourne les projets pour la page actuelle
  get paginatedProjets(): any[] {
    const start = this.pageIndex * this.pageSize;
    return this.projets.slice(start, start + this.pageSize);
  }

  // Calcule le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.projets.length / this.pageSize);
  }

  // Passe à la page suivante
  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
    }
  }

  // Passe à la page précédente
  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }
}
