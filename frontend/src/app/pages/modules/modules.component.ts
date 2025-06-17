import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ModulesService } from '../../services/modules.service';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  imports: [CommonModule, NgIf, NgFor, NavbarComponent, FormsModule, SidebarComponent,RouterModule] 
})
export class ModulesComponent implements OnInit {
  modules: any[] = [];
  errorMessage: string = '';
  userRole: string | null = null;
  username: string | null = null;
  isLoading: boolean = true;
 // Bar de recherche
 searchTerm = '';
  constructor(private modulesService: ModulesService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role');
    this.loadModules();
  }

  loadModules(): void {
    this.modulesService.getModulesForUser().subscribe({
      next: async (data) => {
        console.log("📌 Modules récupérés:", data);
        this.modules = data.length > 0 ? data : [];
        
        if (this.modules.length > 0) {
          await this.loadSupportsForModules();
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des modules:', err);
        this.errorMessage = 'Impossible de récupérer les modules.';
        this.isLoading = false;
      }
    });
  }

  async loadSupportsForModules(): Promise<void> {
    const promises = this.modules.map(module =>
      this.modulesService.getSupportsForModule(module.id).toPromise()
        .then(supports => module.supports = supports)
        .catch(err => {
          console.error(`❌ Erreur lors du chargement des supports du module ${module.id}:`, err);
          module.supports = [];
        })
    );

    await Promise.all(promises);
  }
  // Rechercher des modules
  searchModules(): void {
    this.isLoading = true;
    this.modulesService.searchModules(this.searchTerm).subscribe({
      next: async (results) => {
        console.log(`🔎 Résultats pour "${this.searchTerm}":`, results);
        this.modules = results;
        if (this.modules.length > 0) {
          await this.loadSupportsForModules();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la recherche:', err);
        this.errorMessage = 'Erreur lors de la recherche.';
        this.isLoading = false;
      }
    });
  }
}

