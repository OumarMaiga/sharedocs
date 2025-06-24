import { Routes, provideRouter } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfDashboardComponent } from './pages/profdashboard/profdashboard.component';
import { AuthGuard } from './services/auth.guard';
import { ModulesComponent } from './pages/modules/modules.component';
import { ProfModulesComponent } from './pages/profmodules/profmodules.component';
import { ProfModuleDetailsComponent } from './pages/profmoduledetails/profmoduledetails.component';
import { AjoutSupportComponent } from './components/ajout-support/ajout-support.component';
import { EtudiantSupportModuleComponent } from './components/etudiantsupportmodule/etudiantsupportmodule.component';
// import { ProjetsComponent } from './pages/projets/projets.component';
import { EtudiantProjetsComponent } from './etudiant-projets/etudiant-projets.component';
import { EtudiantProjetDetailComponent } from './etudiant-projet-detail/etudiant-projet-detail.component';
import { SoumissionProjetComponent } from './soumission-projet/soumission-projet.component';
import { CollaborationListComponent } from './components/collaboration-list/collaboration-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { AdminUserCreateComponent } from './components/admin-user-create/admin-user-create.component';
import { AdminUserEditComponent } from './components/admin-user-edit/admin-user-edit.component';
import { AdminFilieresListComponent } from './components/admin-filieres-list/admin-filieres-list.component';
import { AdminFilieresCreateComponent } from './components/admin-filieres-create/admin-filieres-create.component';
import { AdminModulesListComponent } from './components/admin-modules-list/admin-modules-list.component';
import { AdminModulesCreateComponent } from './components/admin-modules-create/admin-modules-create.component';
import { AdminTimetableComponent } from './components/admin-timetable/admin-timetable.component';


import { CreerProjetComponent } from './components/creer-projet/creer-projet.component';
import { ProfSubmissionsComponent } from './prof-submissions/prof-submissions.component';
import { ProfessorClassesComponent } from './components/professor-classes/professor-classes.component';
import { CollaborationComponent } from './components/collaboration/collaboration.component'
import { AdminNiveauxListComponent } from './admin-niveaux-list/admin-niveaux-list.component';
import { AdminNiveauxCreateComponent } from './admin-niveaux-create/admin-niveaux-create.component';
import { AdminClassesListComponent } from './admin-classes-list/admin-classes-list.component';
import { AdminClassesCreateComponent } from './admin-classes-create/admin-classes-create.component';
//import { AjoutProjetComponent } from './pages/projets/ajout-projet/ajout-projet.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'prof-modules', component: ProfModulesComponent },
  { path: 'prof-modules/:id', component: ProfModuleDetailsComponent },
  { path: 'prof-modules/:id/ajouter-support', component: AjoutSupportComponent },
  { path: 'modules', component: ModulesComponent },
  { path: 'etudiantsupportmodule/:id', component: EtudiantSupportModuleComponent },

  // Dashboards sécurisés
  { path: 'student-dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'prof-dashboard', component: ProfDashboardComponent, canActivate: [AuthGuard] },

  // Redirection par défaut
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'projets', component: ProjetsComponent },
  // { path: 'projets/ajouter', component: AjoutProjetComponent },
  
  { path: 'creer-projet', component: CreerProjetComponent },
  { path: 'etudiant-projets', component: EtudiantProjetsComponent, canActivate: [AuthGuard] },
  { path: 'etudiant-projet-detail/:id', component: EtudiantProjetDetailComponent, canActivate: [AuthGuard] },
   // Soumission pour un projet spécifique (avec l'id du projet dans l'URL)
   { path: 'soumission-projet/:id', component: SoumissionProjetComponent },
   { path: 'prof/soumissions', component: ProfSubmissionsComponent },
   {
    path: 'soumissions/projet/:id',
    component: EtudiantProjetDetailComponent
  },
  { path: 'prof-submissions/module/:id', component: ProfSubmissionsComponent },
  { path: 'prof-classes', component: ProfessorClassesComponent }, 
  { path: 'collaboration', component: CollaborationListComponent }, 
  { path: 'collaboration/:id', component: CollaborationComponent },
  { path: 'admin/users', component: AdminUserListComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUserListComponent },
  { path: 'admin/users/create', component: AdminUserCreateComponent },
  { path: 'admin/users/edit/:id', component: AdminUserEditComponent },
  { path: 'admin/filieres', component: AdminFilieresListComponent },
  { path: 'admin/filieres/create', component: AdminFilieresCreateComponent },
  { path: 'admin/modules', component: AdminModulesListComponent },
  { path: 'admin/modules/create', component: AdminModulesCreateComponent },
  { path: 'admin/timetable', component: AdminTimetableComponent },
  { path: 'admin/emplois-du-temps', component: AdminTimetableComponent }, 
  { path: 'admin/niveaux', component: AdminNiveauxListComponent },
  { path: 'admin/niveaux/create', component: AdminNiveauxCreateComponent },
  { path: 'admin/classes', component: AdminClassesListComponent },
  { path: 'admin/classes/create', component: AdminClassesCreateComponent },
];


export const AppRoutingModule = provideRouter(routes); // ✅ Nouvelle façon de gérer les routes en Angular 16+
