import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  role: string = '';

  menuItems = [
    // { label: 'Supports de Cours', link: '/etudiantsupportmodule', icon: 'fas fa-book-open' },
    { label: 'Projets', link: '/etudiant-projets', icon: 'fas fa-folder-open' },
    // { label: 'Soumissions', link: '/soumissions', icon: 'fas fa-upload' },
    { label: 'Mes Modules', link: '/modules', icon: 'fas fa-book' },
    { label: 'Collaboration', link: '/collaboration', icon: 'fas fa-users' }
  ];

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
