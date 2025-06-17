import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfModuleService } from '../../services/prof-module.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfNavbarComponent } from '../../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../../components/prof-sidebar/prof-sidebar.component';

@Component({
  selector: 'app-profmoduledetails',
  templateUrl: './profmoduledetails.component.html',
  styleUrls: ['./profmoduledetails.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ProfNavbarComponent, ProfSidebarComponent]
})
export class ProfModuleDetailsComponent implements OnInit {
  moduleDetails: any = null; // ✅ Initialisation pour éviter les erreurs undefined
  moduleId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private profModuleService: ProfModuleService
  ) {}

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.moduleId) {
      this.loadModuleDetails(this.moduleId);
    }
  }

  loadModuleDetails(id: number): void {
    this.profModuleService.getModuleById(id).subscribe(
      (data) => {
        this.moduleDetails = data;
        this.isLoading = false;
      },
      (error) => {
        console.error("❌ Erreur lors du chargement des détails du module :", error);
        this.errorMessage = "Impossible de charger les détails du module.";
        this.isLoading = false;
      }
    );
  }
}
