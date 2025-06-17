import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';


@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.css'],
  imports: [CommonModule,FormsModule ,NavbarComponent, SidebarComponent] 
})
export class CollaborationComponent implements OnInit {
  espaceId!: number;
  messages: any[] = [];
  newMessage = '';
  isLoading = true;
  errorMessage = '';
  selectedFile: File | null = null;
selectedAudio: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private collaborationService: CollaborationService
  ) {}

  ngOnInit(): void {
    this.espaceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMessages();
  }

  loadMessages(): void {
    this.collaborationService.getMessages(this.espaceId).subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des messages.";
        this.isLoading = false;
      }
    });
  }
  onFileSelected(event: any, type: string) {
    if (event.target.files.length > 0) {
      if (type === 'file') {
        this.selectedFile = event.target.files[0];
      } else if (type === 'audio') {
        this.selectedAudio = event.target.files[0];
      }
    }
  }
  

  envoyerMessage() {
    if (!this.newMessage.trim() && !this.selectedFile && !this.selectedAudio) {
      alert("⚠️ Vous devez entrer un message ou joindre un fichier/audio !");
      return;
    }
  
    const formData = new FormData();
    formData.append('texte', this.newMessage.trim());
    formData.append('espace', this.espaceId.toString());
  
    if (this.selectedFile) {
      formData.append('fichier', this.selectedFile, this.selectedFile.name);
    }
    if (this.selectedAudio) {
      formData.append('audio', this.selectedAudio, this.selectedAudio.name);
    }
  
    this.collaborationService.sendMessage(this.espaceId, formData).subscribe({
      next: (message) => {
        console.log("✅ Message envoyé :", message);
        this.messages.push(message);
        this.newMessage = '';
        this.selectedFile = null;
        this.selectedAudio = null;
        alert("📨 Message envoyé avec succès !");
      },
      error: (err) => {
        console.error("❌ Erreur lors de l'envoi :", err);
        alert("⚠️ Une erreur est survenue !");
      }
    });
  }
  
  
  
  
}
