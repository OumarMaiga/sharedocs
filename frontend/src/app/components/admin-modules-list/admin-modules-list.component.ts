import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminModulesService, Module } from '../../services/admin-modules.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-modules-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-modules-list.component.html',
  styleUrls: ['./admin-modules-list.component.scss']
})
export class AdminModulesListComponent implements OnInit {
  modules: Module[] = []; // Liste complète
  filteredModules: Module[] = []; // Liste filtrée
  errorMessage = '';
  searchTerm: string = '';

  // Pagination
  page = 1;
  pageSize = 5;

  constructor(
    private modulesService: AdminModulesService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    this.modulesService.getAllModules().subscribe({
      next: (data) => {
        this.modules = data;
        this.filteredModules = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des modules:', err);
        this.errorMessage = err;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.page = 1;

    this.filteredModules = this.modules.filter(module =>
      module.titre.toLowerCase().includes(this.searchTerm) ||
      (module.description && module.description.toLowerCase().includes(this.searchTerm)) ||
      module.enseignant.username.toLowerCase().includes(this.searchTerm) ||
      module.classe.nom.toLowerCase().includes(this.searchTerm)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredModules.length / this.pageSize);
  }

  get displayedModules(): Module[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.filteredModules.slice(startIndex, startIndex + this.pageSize);
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  onEdit(module: Module): void {
    this.router.navigate(['/admin/modules/edit', module.id]);
  }

  onDelete(module: Module): void {
    if (confirm(`Voulez-vous vraiment supprimer le module ${module.titre} ?`)) {
      this.modulesService.deleteModule(module.id).subscribe({
        next: () => {
          console.log('Module supprimé:', module);
          this.loadModules();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.errorMessage = err;
        }
      });
    }
  }
}
