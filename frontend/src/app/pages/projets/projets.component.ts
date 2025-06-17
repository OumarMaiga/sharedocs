// import { Component, OnInit } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';  // ✅ Ajout de DatePipe pour le formatage des dates
// import { RouterModule } from '@angular/router';  // ✅ Ajout de RouterModule pour routerLink
// import { ProjetService } from '../../services/projet.service'

// @Component({
//   selector: 'app-projets',
//   templateUrl: './projets.component.html',
//   styleUrls: ['./projets.component.scss'],
//   standalone: true,  // ✅ Composant autonome Angular 16+
//   imports: [CommonModule, RouterModule, DatePipe]  // ✅ Ajout des modules nécessaires
// })
// export class ProjetsComponent implements OnInit {
//   projets: any[] = [];
//   role: string = '';

//   constructor(private projetService: ProjetService) {}

//   ngOnInit() {
//     this.role = localStorage.getItem('role') || '';

//     if (this.role === 'professeur') {
//       this.getProjetsProf();
//     } else {
//       this.getProjetsEtudiant();
//     }
//   }

// //   getProjetsProf() {
// //     this.projetService.getProjetsProf().subscribe({
// //       next: (data) => {
// //         this.projets = data;
// //       },
// //       error: (err) => {
// //         console.error('Erreur lors du chargement des projets du professeur', err);
// //       }
// //     });
// //   }

//   getProjetsEtudiant() {
//     this.projetService.getProjetsEtudiant().subscribe({
//       next: (data) => {
//         this.projets = data;
//       },
//       error: (err) => {
//         console.error('Erreur lors du chargement des projets de l\'étudiant', err);
//       }
//     });
//   }
// }
