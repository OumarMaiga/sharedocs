import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetService } from '../services/projet.service';

@Component({
  selector: 'app-ajout-projet',
  standalone: true,
  templateUrl: './ajout-projet.component.html',
  styleUrls: ['./ajout-projet.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AjoutProjetComponent implements OnInit {
  titre: string = '';
  description: string = '';
  date_limite: string = '';
  moduleId: number = 0;
  etudiantsSelectionnes: number[] = [];
  modules: any[] = [];
  etudiants: any[] = [];

  private projetService = inject(ProjetService); // ✅ Injection Angular 19
  private router = inject(Router);

  ngOnInit() {
    this.chargerModules();
  }

  // ✅ Charger les modules du professeur connecté
  chargerModules() {
    this.projetService.getModulesProf().subscribe({
      next: (data) => {
        this.modules = data;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des modules', err);
      }
    });
  }

  // ✅ Charger les étudiants lorsqu'un module est sélectionné
  chargerEtudiants() {
    if (!this.moduleId) return;

    this.projetService.getEtudiantsParClasse(this.moduleId).subscribe({
      next: (data) => {
        this.etudiants = data;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des étudiants', err);
      }
    });
  }

  // ✅ Mettre à jour la liste des étudiants sélectionnés
  toggleEtudiantSelection(event: Event, etudiantId: number) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.etudiantsSelectionnes.push(etudiantId);
    } else {
      this.etudiantsSelectionnes = this.etudiantsSelectionnes.filter(id => id !== etudiantId);
    }
  }

  // ✅ Création du projet
  creerProjet() {
    if (!this.titre || !this.description || !this.date_limite || !this.moduleId || this.etudiantsSelectionnes.length === 0) {
      alert('Veuillez remplir tous les champs et sélectionner au moins un étudiant.');
      return;
    }

    const projetData = {
      titre: this.titre,
      description: this.description,
      date_limite: this.date_limite,
      module: this.moduleId,
      etudiants: this.etudiantsSelectionnes
    };

    this.projetService.creerProjet(projetData).subscribe({
      next: () => {
        alert('✅ Projet ajouté avec succès !');
        this.router.navigate(['/projets']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création du projet', err);
      }
    });
  }
}
