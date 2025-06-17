import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngIf, *ngFor, et les pipes
import { ApiService, Module } from '../../services/api.service';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss'],
  standalone: true,
  imports: [CommonModule] // Ajout de CommonModule ici
})
export class ModuleListComponent implements OnInit {
  modules: Module[] = [];
  errorMessage: string = ''; // Déclarer la propriété errorMessage

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getModules().subscribe({
      next: (data) => this.modules = data,
      error: (error) => {
         console.error('Erreur lors de la récupération des modules:', error);
         this.errorMessage = "Erreur lors de la récupération des modules.";
      }
    });
  }
}
