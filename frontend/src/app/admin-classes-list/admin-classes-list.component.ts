import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Classe, ClassesService } from '../services/classes.service';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-classes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-classes-list.component.html'
})
export class AdminClassesListComponent implements OnInit {
  classes: Classe[] = [];
  displayedClasses: Classe[] = [];
  errorMessage: string | null = null;

  searchQuery = '';

  constructor(
    private classesService: ClassesService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.classesService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.updateDisplayedClasses();
      },
      error: () => this.errorMessage = 'Erreur lors du chargement des classes.'
    });
  }

  updateDisplayedClasses(): void {
    this.displayedClasses = this.classes.filter(classe =>
      classe.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.updateDisplayedClasses();
  }

  onDelete(classe: Classe): void {
    if (confirm('Voulez-vous vraiment supprimer cette classe ?')) {
      this.classesService.deleteClasse(classe.id).subscribe({
        next: () => {
          this.classes = this.classes.filter(c => c.id !== classe.id);
          this.updateDisplayedClasses();
        },
        error: () => this.errorMessage = 'Erreur lors de la suppression de la classe.'
      });
    }
  }
}
