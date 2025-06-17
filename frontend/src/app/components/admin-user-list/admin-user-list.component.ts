import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminUserService, AdminUser } from '../../services/admin-user.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  searchTerm: string = '';
  errorMessage = '';

  // Pagination
  page = 1;
  pageSize = 5;

  constructor(
    private adminUserService: AdminUserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminUserService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        this.errorMessage = err?.message || 'Erreur inattendue lors de la récupération des utilisateurs.';
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get displayedUsers(): AdminUser[] {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm) ||
      user.role.toLowerCase().includes(this.searchTerm) ||
      // (user.classe && user.classe.toLowerCase().includes(this.searchTerm)) ||
      user.id.toString().includes(this.searchTerm) // Correction ici
    );

    this.page = 1; // On remet la pagination à la première page
  }


  onEdit(user: AdminUser): void {
    console.log("Modifier l'utilisateur:", user);
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  onDelete(user: AdminUser): void {
    if (confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.username} ?`)) {
      this.adminUserService.deleteUser(user.id).subscribe({
        next: () => {
          console.log("Utilisateur supprimé:", user);
          // Suppression directe sans recharger toute la liste
          this.users = this.users.filter(u => u.id !== user.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);

          // Réajuster la pagination
          if (this.page > this.totalPages && this.totalPages > 0) {
            this.page = this.totalPages;
          }
        },
        error: (err) => {
          console.error("Erreur lors de la suppression:", err);
          this.errorMessage = err?.message || 'Erreur inattendue lors de la suppression.';
        }
      });
    }
  }
}
