import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prof-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prof-sidebar.component.html',
  styleUrls: ['./prof-sidebar.component.scss']
})
export class ProfSidebarComponent {
  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
