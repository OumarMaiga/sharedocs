import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  modules: Module[] = [];
  errorMessage = '';

  // Pagination
  page = 1;
  pageSize = 5;

  constructor(
    private adminModulesService: AdminModulesService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    // Utilisation de getAllModules() pour un administrateur
    this.adminModulesService.getAllModules().subscribe({
      next: (data) => {
        this.modules = data;
        console.log('Modules loaded:', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des modules:', err);
        this.errorMessage = err;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.modules.length / this.pageSize);
  }

  get displayedModules(): Module[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.modules.slice(startIndex, startIndex + this.pageSize);
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
      this.adminModulesService.deleteModule(module.id).subscribe({
        next: () => {
          console.log("Module supprimé:", module);
          this.loadModules();
        },
        error: (err) => {
          console.error("Erreur lors de la suppression:", err);
          this.errorMessage = err;
        }
      });
    }
  }
}
