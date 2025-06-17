import { Component, OnInit } from '@angular/core';
import { ProfModuleService } from '../../services/prof-module.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfNavbarComponent } from '../../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../../components/prof-sidebar/prof-sidebar.component';


@Component({
  selector: 'app-profmodules',
  templateUrl: './profmodules.component.html',
  styleUrls: ['./profmodules.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule,ProfNavbarComponent, ProfSidebarComponent]
})
export class ProfModulesComponent implements OnInit {
  modules: any[] = [];
  isLoading: boolean = true; // ✅ Indicateur de chargement
  errorMessage: string | null = null; // ✅ Message d'erreur

  constructor(private profModuleService: ProfModuleService) {}

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.profModuleService.getModulesProf().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.modules = data;
        } else {
          this.errorMessage = "Aucun module trouvé.";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des modules:', err);
        if (err.status === 401) {
          this.errorMessage = "⛔ Accès non autorisé. Veuillez vous reconnecter.";
        } else {
          this.errorMessage = "🚨 Une erreur est survenue lors du chargement des modules.";
        }
        this.isLoading = false;
      }
    });
  }
}
