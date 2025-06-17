import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; // 📌 Importation du RouterModule
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-collaboration-list',
  templateUrl: './collaboration-list.component.html',
  styleUrls: ['./collaboration-list.component.scss'],
  imports: [CommonModule, RouterModule,NavbarComponent,SidebarComponent],
})
export class CollaborationListComponent implements OnInit {
  projets: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private collaborationService: CollaborationService) {}

  ngOnInit(): void {
    this.collaborationService.getUserProjects().subscribe({
      next: (data) => {
        this.projets = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des projets.";
        this.isLoading = false;
      }
    });
  }
}
