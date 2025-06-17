import { Component, OnInit, inject } from '@angular/core';
import { ProfessorClassesService } from '../../services/professor-class-module.service';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfNavbarComponent } from '../../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../../components/prof-sidebar/prof-sidebar.component';

@Component({
  selector: 'app-professor-classes',
  standalone: true,
  templateUrl: './professor-classes.component.html',
  styleUrl: './professor-classes.component.scss',
  imports: [CommonModule, NgIf, NgFor, RouterModule, ProfNavbarComponent, ProfSidebarComponent]
})
export class ProfessorClassesComponent implements OnInit {
  classes: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private professorClassesService = inject(ProfessorClassesService);

  ngOnInit(): void {
    this.loadProfessorClasses();
  }

  loadProfessorClasses(): void {
    this.professorClassesService.getProfessorClassesAndModules().subscribe({
      next: (data) => {
        console.log("✅ Classes et modules reçus :", data);
        this.classes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des classes et modules:', err);
        this.errorMessage = 'Erreur lors du chargement des classes et modules.';
        this.isLoading = false;
      }
    });
  }
}
