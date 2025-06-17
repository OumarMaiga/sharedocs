import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FilieresService, Filiere } from '../../services/filieres.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-filieres-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-filieres-list.component.html',
  styleUrls: ['./admin-filieres-list.component.scss']
})
export class AdminFilieresListComponent implements OnInit {
  filieres: Filiere[] = []; // Liste complète
  filteredFilieres: Filiere[] = [];    // Liste filtrée
  errorMessage = '';
  searchTerm: string = '';

  // Pagination
  page = 1;
  pageSize = 5;

  constructor(
    private filieresService: FilieresService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadFilieres();
  }

  loadFilieres(): void {
    this.filieresService.getFilieres().subscribe({
      next: (data) => {
        this.filieres = data; // On garde la liste originale
        this.filteredFilieres = data;    // On initialise la liste filtrée
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des filières:', err);
        this.errorMessage = err;
      }
    });
  }

  // Méthode de recherche avec préservation des données
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.page = 1; // On revient à la première page

    this.filteredFilieres = this.filieres.filter(filiere =>
      filiere.nom.toLowerCase().includes(this.searchTerm) ||
      (filiere.description && filiere.description.toLowerCase().includes(this.searchTerm))
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFilieres.length / this.pageSize);
  }

  get displayedFilieres(): Filiere[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.filteredFilieres.slice(startIndex, startIndex + this.pageSize);
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  onEdit(filiere: Filiere): void {
    this.router.navigate(['/admin/filteredFilieres/edit', filiere.id]);
  }

  onDelete(filiere: Filiere): void {
    if (confirm(`Voulez-vous vraiment supprimer la filière ${filiere.nom} ?`)) {
      this.filieresService.deleteFiliere(filiere.id).subscribe({
        next: () => {
          console.log('Filière supprimée:', filiere);
          this.loadFilieres();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.errorMessage = err;
        }
      });
    }
  }
}
