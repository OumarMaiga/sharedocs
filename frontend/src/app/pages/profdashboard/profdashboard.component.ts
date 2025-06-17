import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfNavbarComponent } from '../../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../../components/prof-sidebar/prof-sidebar.component';
import { ModulesService } from '../../services/modules.service';
import Chart from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-prof-dashboard',
  templateUrl: './profdashboard.component.html',
  styleUrls: ['./profdashboard.component.scss'],
  imports: [CommonModule, ProfNavbarComponent, ProfSidebarComponent]
})
export class ProfDashboardComponent implements OnInit, AfterViewInit {
  modules: any[] = [];
  classes: any[] = [];
  projets: any[] = [];
  soumissions: any[] = [];
  username: string | null = null;

  // Références vers nos 4 charts
  modulesChart: Chart | null = null;
  classesChart: Chart | null = null;
  projetsChart: Chart | null = null;
  soumissionsChart: Chart | null = null;

  constructor(private modulesService: ModulesService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.loadData();
  }

  ngAfterViewInit(): void {
    // On initialise les charts après la vue.
    this.renderAllCharts();
  }

  loadData(): void {
    this.modulesService.getModulesForUser().subscribe({
      next: (data) => {
        // Exemples d'assignation
        this.modules = data; // modules
        this.classes = [...new Set(data.map(mod => mod.classe.nom))]; // classes uniques
        this.projets = [];    // TODO: Récupérer via un autre service
        this.soumissions = []; // TODO: Récupérer via un autre service

        this.renderAllCharts(); // Mettre à jour les charts
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
      }
    });
  }

  // Méthode pour tout initialiser
  renderAllCharts(): void {
    // Vérifier que la vue est chargée
    const modCtx = document.getElementById('modulesChart') as HTMLCanvasElement;
    const clsCtx = document.getElementById('classesChart') as HTMLCanvasElement;
    const prjCtx = document.getElementById('projetsChart') as HTMLCanvasElement;
    const soumCtx = document.getElementById('soumissionsChart') as HTMLCanvasElement;
    if (!modCtx || !clsCtx || !prjCtx || !soumCtx) return;

    // Valeurs
    const modulesVal = this.modules.length;
    const classesVal = this.classes.length;
    const projetsVal = this.projets.length;
    const soumVal = this.soumissions.length;

    // Ex : si tu veux un anneau complet = 10, tu peux ajuster la logique
    // On affiche la partie "valeur" et la partie "restante"
    const max = 10; // A adapter
    const modulesData = [modulesVal, Math.max(0, max - modulesVal)];
    const classesData = [classesVal, Math.max(0, max - classesVal)];
    const projetsData = [projetsVal, Math.max(0, max - projetsVal)];
    const soumData = [soumVal, Math.max(0, max - soumVal)];

    // Config générique
    const doughnutOptions = {
      cutout: '70%',   // Espace intérieur
      borderWidth: 0,  // Pas de bord
    };

    // 1) Chart Modules
    if (this.modulesChart) this.modulesChart.destroy(); // Détruit l'ancien
    this.modulesChart = new Chart(modCtx, {
      type: 'doughnut',
      data: {
        labels: ['Valeur', 'Reste'],
        datasets: [{
          data: modulesData,
          backgroundColor: ['#d4af37', '#e5e7eb'] // or autre palette
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        ...doughnutOptions
      }
    });

    // 2) Chart Classes
    if (this.classesChart) this.classesChart.destroy();
    this.classesChart = new Chart(clsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Valeur', 'Reste'],
        datasets: [{
          data: classesData,
          backgroundColor: ['#d4af37', '#e5e7eb']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        ...doughnutOptions
      }
    });

    // 3) Chart Projets
    if (this.projetsChart) this.projetsChart.destroy();
    this.projetsChart = new Chart(prjCtx, {
      type: 'doughnut',
      data: {
        labels: ['Valeur', 'Reste'],
        datasets: [{
          data: projetsData,
          backgroundColor: ['#d4af37', '#e5e7eb']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        ...doughnutOptions
      }
    });

    // 4) Chart Soumissions
    if (this.soumissionsChart) this.soumissionsChart.destroy();
    this.soumissionsChart = new Chart(soumCtx, {
      type: 'doughnut',
      data: {
        labels: ['Valeur', 'Reste'],
        datasets: [{
          data: soumData,
          backgroundColor: ['#d4af37', '#e5e7eb']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        ...doughnutOptions
      }
    });
  }
}
