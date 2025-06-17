import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfNotificationService } from '../../services/ProfNotificationService.service';

@Component({
  selector: 'app-prof-navbar',
  standalone: true,
  imports: [CommonModule], // Permet d'utiliser *ngIf, *ngFor, etc.
  templateUrl: './prof-navbar.component.html',
  styleUrls: ['./prof-navbar.component.scss']
})
export class ProfNavbarComponent implements OnInit {
  username: string = 'Utilisateur';
  notifications: any[] = [];
  showNotifications: boolean = false;

  private authService = inject(AuthService);
  private notificationService = inject(ProfNotificationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();
  }

  loadUserData(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
  }

  loadNotifications(): void {
    this.notificationService.getProfNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        console.log('✅ Notifications chargées :', this.notifications);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des notifications:', error);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  /**
   * ✅ Gérer le clic sur une notification
   * - Redirige vers la page concernée
   * - Supprime la notification après consultation
   */
  handleNotificationClick(notification: any): void {
    const projetId = notification.projet?.id;

    // ✅ Supprimer la notification après le clic
    this.notificationService.deleteProfNotification(notification.id).subscribe({
      next: () => {
        console.log(`🗑️ Notification supprimée: ${notification.id}`);
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression de la notification:', err);
      }
    });
    if (projetId) {
      this.router.navigate([`/prof-projet/${projetId}`]);
    }

    this.showNotifications = false;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
