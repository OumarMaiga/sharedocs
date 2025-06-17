import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { ProfNavbarComponent } from '../../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../../components/prof-sidebar/prof-sidebar.component';
import { Location } from '@angular/common'; // <-- Import
@Component({
  selector: 'app-creer-projet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgIf, NgFor,ProfNavbarComponent,ProfSidebarComponent],
  templateUrl: './creer-projet.component.html',
  styleUrls: ['./creer-projet.component.css']
})
export class CreerProjetComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private location = inject(Location);

  modules: any[] = [];
  etudiants: any[] = [];
  projetForm: FormGroup;
  isLoading = false;
  message = '';

  constructor() {
    // On utilise "module" et "etudiants" pour harmoniser avec le template et le backend.
    this.projetForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      date_limite: ['', Validators.required],
      module: [null, Validators.required],     // Contrôle "module" (et non module_id)
      etudiants: [[]],                         // Contrôle "etudiants" (et non etudiants_ids)
      fichier_instruction: [null]
    });
  }

  ngOnInit(): void {
    this.chargerModules();
  }

  chargerModules(): void {
    this.apiService.getModulesProfesseur().subscribe(
      data => {
        this.modules = data;
        console.log("✅ Modules chargés :", this.modules);
      },
      error => console.error('❌ Erreur lors du chargement des modules', error)
    );
  }

  onModuleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const moduleId = Number(selectElement.value);
    console.log("📌 Module sélectionné ID:", moduleId);

    if (!moduleId) {
      console.warn("❌ Aucune sélection de module");
      return;
    }

    const selectedModule = this.modules.find(m => m.id === moduleId);
    if (!selectedModule) {
      console.warn("❌ Aucun module trouvé avec cet ID");
      return;
    }

    console.log("✅ Module trouvé :", selectedModule);
    // Mise à jour du FormGroup avec "module"
    this.projetForm.patchValue({ module: moduleId });
    console.log("📌 Module mis à jour dans le formulaire :", this.projetForm.value.module);

    this.apiService.getEtudiantsParClasse(selectedModule.classe.id).subscribe(
      data => {
        this.etudiants = data;
        console.log("📌 Étudiants récupérés :", this.etudiants);
      },
      error => console.error("❌ Erreur lors du chargement des étudiants :", error)
    );
  }

  onEtudiantCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const id = Number(input.value);
    let etudiantsSelectionnes: number[] = [...this.projetForm.value.etudiants];

    if (input.checked) {
      if (!etudiantsSelectionnes.includes(id)) {
        etudiantsSelectionnes.push(id);
      }
    } else {
      etudiantsSelectionnes = etudiantsSelectionnes.filter(etudiantId => etudiantId !== id);
    }

    this.projetForm.patchValue({ etudiants: etudiantsSelectionnes });
    console.log("📌 Étudiants sélectionnés (IDs corrects) :", etudiantsSelectionnes);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.projetForm.patchValue({ fichier_instruction: input.files[0] });
      console.log("📁 Fichier sélectionné :", input.files[0]);
    }
  }

  soumettreProjet(): void {
    if (this.projetForm.invalid) {
      console.warn("❌ Formulaire invalide");
      console.log("🔍 Champs invalides :", this.projetForm.controls);
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    // Parcours des clés du FormGroup et ajout dans le FormData
    Object.entries(this.projetForm.value).forEach(([key, value]) => {
      if (key === 'etudiants' && Array.isArray(value) && value.length > 0) {
        // IMPORTANT : Utilisez la clé "etudiants" (sans les crochets) pour que Django puisse récupérer la liste
        value.forEach(val => formData.append('etudiants', val.toString()));
      } else if (key === 'module') {
        formData.append('module', String(value));
      } else if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    console.log("🚀 Données envoyées :", this.projetForm.value);
    console.log("🚀 Envoi du projet (FormData):");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.apiService.creerProjet(formData).subscribe(
      response => {
        this.message = "✅ Projet créé avec succès !";
        this.projetForm.reset();
        this.isLoading = false;
        this.etudiants = [];
        console.log("🎉 Projet créé avec succès !");
        this.location.back();
      },
      error => {
        console.error('❌ Erreur lors de la création du projet', error);
        if (error.error && error.error.detail) {
          this.message = `❌ Erreur : ${error.error.detail}`;
        } else {
          this.message = "❌ Erreur lors de la création du projet.";
        }
        this.isLoading = false;
      }
    );
  }
 
}
