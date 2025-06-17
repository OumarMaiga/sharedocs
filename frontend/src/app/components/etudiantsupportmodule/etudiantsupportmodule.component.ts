import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModulesService } from '../../services/modules.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-etudiantsupportmodule',
  templateUrl: './etudiantsupportmodule.component.html',
  styleUrls: ['./etudiantsupportmodule.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent]
})
export class EtudiantSupportModuleComponent implements OnInit {
  moduleId!: number;
  supports: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  // Pagination
  pageIndex = 0;
  pageSize = 5; // Nombre de supports par page
  totalPages = 0;
  paginatedSupports: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private modulesService: ModulesService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du module depuis l'URL
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.moduleId) {
      this.errorMessage = "ID de module invalide.";
      this.isLoading = false;
      return;
    }

    // Charger les supports du module
    this.modulesService.getSupportsForModule(this.moduleId).subscribe({
      next: (data) => {
        this.supports = data;
        this.isLoading = false;
        this.updatePagination();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.supports.length / this.pageSize);
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedSupports = this.supports.slice(start, end);
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.updatePagination();
    }
  }
}
