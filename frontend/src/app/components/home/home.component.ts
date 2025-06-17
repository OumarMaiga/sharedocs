import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardService } from '../../services/dashboard.service';

// Chart.js
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  // On référence chacun des canvas grâce à ViewChild
  @ViewChild('modulesChart') modulesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projetsChart') projetsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('soumissionsChart') soumissionsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('notificationsChart') notificationsChartRef!: ElementRef<HTMLCanvasElement>;

  // Variables pour les stats
  modulesCount = 0;
  projetsCount = 0;
  soumissionsCount = 0;
  notificationsNonLues = 0;

  constructor(private dashboardService: DashboardService) {
    // Nécessaire pour que Chart.js reconnaisse toutes les fonctionnalités
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    // Récupération des données réelles depuis l'API
    this.dashboardService.getEtudiantDashboard().subscribe({
      next: (data) => {
        this.modulesCount = data.modules_count;
        this.projetsCount = data.projets_count;
        this.soumissionsCount = data.soumissions_count;
        this.notificationsNonLues = data.notifications_non_lues;

        // Création de 4 charts doughnut
        this.createDoughnutChart(this.modulesChartRef.nativeElement, this.modulesCount, '#3b82f6');
        this.createDoughnutChart(this.projetsChartRef.nativeElement, this.projetsCount, '#10b981');
        this.createDoughnutChart(this.soumissionsChartRef.nativeElement, this.soumissionsCount, '#f59e0b');
        this.createDoughnutChart(this.notificationsChartRef.nativeElement, this.notificationsNonLues, '#ef4444');
      },
      error: (err) => {
        console.error('Erreur de chargement du dashboard étudiant :', err);
      },
    });
  }

  /**
   * Crée un graphique en anneau (doughnut) avec 2 parts :
   * - La valeur actuelle (color)
   * - Le "reste" en gris
   */
  createDoughnutChart(canvas: HTMLCanvasElement, value: number, color: string) {
    // Si on veut représenter un ratio sur 100
    const total = value > 100 ? value : 100;

    new Chart(canvas.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: ['Part', 'Rest'],
        datasets: [
          {
            data: [value, total - value],
            backgroundColor: [color, '#e5e7eb'],
            borderWidth: 0
          }
        ]
      },
      options: {
        cutout: '70%', // Agrandir le trou au centre
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  logout(): void {
    console.log('Déconnexion...');
    // Intégrez ici votre logique de déconnexion (par ex. via un AuthService)
  }
}
