import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Import de FormsModule
import { ActivatedRoute } from '@angular/router';
import { ProfModuleService } from '../../services/prof-module.service';
import { CommonModule } from '@angular/common';
import { ProfNavbarComponent } from '../../components/prof-navbar/prof-navbar.component';
import { ProfSidebarComponent } from '../../components/prof-sidebar/prof-sidebar.component';

@Component({
  selector: 'app-ajout-support',
  templateUrl: './ajout-support.component.html',
  styleUrls: ['./ajout-support.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,ProfNavbarComponent, ProfSidebarComponent], // ✅ Ajout de FormsModule
})
export class AjoutSupportComponent implements OnInit {
  moduleId!: number;
  titre: string = '';
  description: string = '';
  fichier!: File;

  constructor(
    private route: ActivatedRoute,
    private profModuleService: ProfModuleService
  ) {}

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(`📌 Module ID récupéré : ${this.moduleId}`);
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.fichier = event.target.files[0];
    }
  }

  ajouterSupport(): void {
    if (!this.moduleId) {
      console.error('❌ Aucun module sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.titre);
    formData.append('description', this.description);
    formData.append('fichier', this.fichier);

    this.profModuleService.ajouterSupport(this.moduleId, formData).subscribe({
      next: (response) => {
        console.log('✅ Support ajouté avec succès :', response);
      },
      error: (error) => {
        console.error('❌ Erreur lors de l\'ajout du support :', error);
      }
    });
  }
}
