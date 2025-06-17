import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  username: string = 'Utilisateur';
  role: string = '';
  notifications: any[] = [];
  showNotifications: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();
  }

  loadUserData(): void {
    this.username = localStorage.getItem('username') || 'Utilisateur';
    this.role = localStorage.getItem('role') || '';
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (error) => {
        console.error("❌ Erreur lors de la récupération des notifications :", error);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  handleNotificationClick(notification: any): void {
    console.log("🔍 Notification reçue :", notification);
  
    if (!notification.module_id) {
      console.error("❌ Erreur : module_id est manquant dans la notification.", notification);
      alert("Erreur : cette notification ne contient pas de module ID.");
      return;
    }
  
    this.notificationService.deleteNotification(notification.id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== notification.id);
      this.router.navigate([`/etudiantsupportmodule/${notification.module_id}`], {
        queryParams: notification.support_id ? { support: notification.support_id } : {}
      });
    });
  
    this.showNotifications = false;
  }
  

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
