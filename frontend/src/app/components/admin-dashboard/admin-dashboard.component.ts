import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { UtilisateurService } from '../../services/utilisateur.service';
import { FilieresService } from '../../services/filieres.service';
import { NiveauxService } from '../../services/niveaux.service';
import { ClassesService } from '../../services/classes.service';
import { ModulesService } from '../../services/modules.service';
import { AdminUser, AdminUserService } from '../../services/admin-user.service';
import { AdminModulesService } from '../../services/admin-modules.service';
import { API_BASE_URL } from '../../../config/api.config';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  // Structure pour stocker les statistiques
  metrics = {
    modules_count: 0,
    etudiants_count: 0,
    professeurs_count: 0,
    filieres_count: 0,
    niveaux_count: 0,
    classes_count: 0,
    supports_count: 0,
    projets_count: 0,
    soumissions_count: 0
  };

  private apiUrl = `${API_BASE_URL}/stats/`;
  chart: Chart | null = null;
  currentYear: number = new Date().getFullYear();

  userCount = 0;
  filiereCount = 0;
  niveauCount = 0;
  classeCount = 0;
  moduleCount = 0;
  
  constructor(private http: HttpClient,
        public router: Router,
        private utilisateursService: AdminUserService,
        private filieresService: FilieresService,
        private niveauxService: NiveauxService,
        private classesService: ClassesService,
        private modulesService: AdminModulesService
    
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadCounts();
  }

  ngAfterViewInit(): void {
    // Tentative de rendu initial, qui sera mis à jour une fois les données chargées
    this.renderChart();
  }
  
  loadCounts(): void {
    this.utilisateursService.getUsers().subscribe(users => this.userCount = users.length);
    this.filieresService.getFilieres().subscribe(filieres => this.filiereCount = filieres.length);
    this.niveauxService.getNiveaux().subscribe(niveaux => this.niveauCount = niveaux.length);
    this.classesService.getClasses().subscribe(classes => this.classeCount = classes.length);
    this.modulesService.getAllModules().subscribe(modules => this.moduleCount = modules.length);
  }

  loadStatistics(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: data => {
        // Mappage des données récupérées aux propriétés du dashboard
        this.metrics.modules_count = data.modules_count;
        this.metrics.etudiants_count = data.etudiants_count;
        this.metrics.professeurs_count = data.professeurs_count;
        this.metrics.filieres_count = data.filieres_count;
        this.metrics.niveaux_count = data.niveaux_count;
        this.metrics.classes_count = data.classes_count;
        this.metrics.supports_count = data.supports_count;
        this.metrics.projets_count = data.projets_count;
        this.metrics.soumissions_count = data.soumissions_count;
        // Une fois les données chargées, on réaffiche le graphique
        this.renderChart();
      },
      error: err => {
        console.error('Erreur lors du chargement des statistiques :', err);
      }
    });
  }

  renderChart(): void {
    // Récupérer l'élément canvas par son ID
    const canvas = document.getElementById('statsChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    // Détruire le graphique existant s'il existe déjà
    if (this.chart) {
      this.chart.destroy();
    }

    // Préparer les labels et les données à afficher
    const labels = [
      'Modules', 'Étudiants', 'Professeurs', 'Filières', 
      'Niveaux', 'Classes', 'Supports', 'Projets', 'Soumissions'
    ];
    const data = [
      this.metrics.modules_count,
      this.metrics.etudiants_count,
      this.metrics.professeurs_count,
      this.metrics.filieres_count,
      this.metrics.niveaux_count,
      this.metrics.classes_count,
      this.metrics.supports_count,
      this.metrics.projets_count,
      this.metrics.soumissions_count
    ];

    // Création du graphique en barres
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Statistiques',
          data: data,
          backgroundColor: [
            '#4f46e5', '#10B981', '#3B82F6',
            '#EC4899', '#EF4444', '#F59E0B',
            '#8B5CF6', '#14B8A6', '#F97316'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#374151' },
            grid: { color: '#e5e7eb' }
          },
          x: {
            ticks: { color: '#374151' },
            grid: { color: '#e5e7eb' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#374151' }
          }
        }
      }
    });
  }
}
