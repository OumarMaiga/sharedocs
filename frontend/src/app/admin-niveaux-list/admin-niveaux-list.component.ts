import { Component, OnInit } from '@angular/core';
import { NiveauxService, Niveau } from '../services/niveaux.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-niveaux-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-niveaux-list.component.html',
  styleUrls: ['./admin-niveaux-list.component.css']
})
export class AdminNiveauxListComponent implements OnInit {
niveaux: Niveau[] = [];
  displayedNiveaux: Niveau[] = [];
  errorMessage: string | null = null;

  searchQuery = '';
  page = 1;
  pageSize = 5;

  constructor(
    private niveauxService: NiveauxService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getNiveaux();
  }

  getNiveaux(): void {
    this.niveauxService.getNiveaux().subscribe({
      next: (data) => {
        this.niveaux = data;
        this.updateDisplayedNiveaux();
      },
      error: () => this.errorMessage = 'Erreur lors du chargement des niveaux.'
    });
  }

  updateDisplayedNiveaux(): void {
    const filtered = this.niveaux.filter(niveau =>
      niveau.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedNiveaux = filtered.slice(startIndex, endIndex);
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.page = 1;
    this.updateDisplayedNiveaux();
  }

  get totalPages(): number {
    return Math.ceil(
      this.niveaux.filter(niveau =>
        niveau.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).length / this.pageSize
    );
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedNiveaux();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateDisplayedNiveaux();
    }
  }

  onEdit(niveau: Niveau): void {
    this.router.navigate(['/admin/niveaux/edit', niveau.id]);
  }

  onDelete(niveau: Niveau): void {
    if (confirm('Voulez-vous vraiment supprimer ce niveau ?')) {
      this.niveauxService.deleteNiveau(niveau.id).subscribe({
        next: () => {
          this.niveaux = this.niveaux.filter(n => n.id !== niveau.id);
          this.updateDisplayedNiveaux();
        },
        error: () => this.errorMessage = 'Erreur lors de la suppression du niveau.'
      });
    }
  }
}
