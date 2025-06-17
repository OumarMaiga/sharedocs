from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UtilisateurViewSet, FiliereViewSet, NiveauViewSet, ClasseViewSet,
    ModuleViewSet, SupportCoursViewSet, ProjetViewSet, SoumissionViewSet,
    get_user_info, ajouter_support, get_notifications, 
    creer_projet, soumettre_travail, noter_travail,
    delete_notification, view_notification,get_etudiants_par_classe, get_modules_professeur ,get_projets_etudiant,get_prof_notifications,get_soumissions_professeur,get_student_submissions_for_project,
    get_submissions_for_prof,get_submissions_for_prof_module ,get_professor_classes_and_modules,delete_prof_notification,creer_espace_collaboration, envoyer_message, get_messages ,get_user_projects,etudiant_dashboard,search_modules, create_user,
    admin_update_user,
    admin_delete_user,
    admin_list_users, get_statistics,get_all_modules,EmploiDuTempsCreateView
  

)
from .views import EmploiDuTempsCreateView, EmploiDuTempsListView, EmploiDuTempsNotificationListView

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateur')
router.register(r'filieres', FiliereViewSet, basename='filiere')
router.register(r'niveaux', NiveauViewSet, basename='niveau')
router.register(r'classes', ClasseViewSet, basename='classe')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'supports', SupportCoursViewSet, basename='supportcours')
router.register(r'projets', ProjetViewSet, basename='projet')
router.register(r'soumissions', SoumissionViewSet, basename='soumission')

urlpatterns = [
    path('', include(router.urls)),

    # Authentification JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Gestion des utilisateurs
    path('utilisateur/me/', get_user_info, name='get_user_info'),

    # Gestion des notifications
    path('notifications/', get_notifications, name='get_notifications'),
    path('notifications/<int:notification_id>/delete/', delete_notification, name='delete_notification'),
    path('notifications/<int:notification_id>/view/', view_notification, name='view_notification'),
    path("etudiant/dashboard/", etudiant_dashboard, name="etudiant_dashboard"),
    # Gestion des projets
    # path('projets/creer/', creer_projet, name='creer_projet'),
    path('projets_etudiant/', get_projets_etudiant, name='get_projets_etudiant'),
    # Gestion des soumissions
    # path('projets/<int:projet_id>/soumettre/', soumettre_travail, name='soumettre_travail'),
    # path('soumissions/<int:soumission_id>/noter/', noter_travail, name='noter_travail'),

    # Récupérer les étudiants d'une classe
    # path('utilisateurs/classe/<int:classe_id>/', get_etudiants_par_classe, name='get_etudiants_par_classe'),

    # Gestion des supports
    path('modules/<int:module_id>/ajouter-support/', ajouter_support, name='ajouter_support'),


    # Récupérer les étudiants d'une classe
    path('classes/<int:classe_id>/etudiants/', get_etudiants_par_classe, name='get_etudiants_par_classe'),
    
    # Récupérer les modules du professeur connecté
    path('professeur/modules/', get_modules_professeur, name='get_modules_professeur'),

    # Créer un projet
    path('projets/creer/', creer_projet, name='creer_projet'),
     path('projets/<int:projet_id>/soumettre/', soumettre_travail, name='soumettre_travail'),

     path('notifications/prof/', get_prof_notifications, name='get_prof_notifications'),
path('soumissions_professeur/', get_soumissions_professeur, name='get_soumissions_professeur'),
#  path('soumissions/module/<int:module_id>/', get_student_submissions_for_module, name='get_student_submissions_for_module'),
 path('soumissions/projet/<int:projet_id>/', get_student_submissions_for_project, name='get_student_submissions_for_project'),
path('soumissions_professeur/', get_submissions_for_prof, name='get_submissions_for_prof'),
  path('soumissions/prof/module/<int:module_id>/', get_submissions_for_prof_module, name='get_submissions_for_prof_module'),
   path('prof/classes/', get_professor_classes_and_modules, name='get_professor_classes_and_modules'),
   path('notifications/prof/delete/<int:notif_id>/', delete_prof_notification, name='delete_prof_notification'),


    path("collaboration/user-projects/", get_user_projects, name="get_user_projects"),
    #path("collaboration/projet/<int:projet_id>/", creer_espace_collaboration, name="creer_espace_collaboration"),
    path("collaboration/<int:espace_id>/messages/", get_messages, name="get_messages"),
    path("collaboration/<int:espace_id>/envoyer/", envoyer_message, name="envoyer_message"),
   
    path('projets/<int:projet_id>/creer-espace/', creer_espace_collaboration, name="creer_espace"),
  path('modules_search/', search_modules, name='modules_search'),

   path('admin/users/create/', create_user, name='create_user'), path('admin/users/<int:user_id>/update/', admin_update_user, name='admin_update_user'),
    path('admin/users/<int:user_id>/delete/', admin_delete_user, name='admin_delete_user'),
    path('admin/users/list/', admin_list_users, name='admin_list_users'),
   
    path('admin/modules/all/', get_all_modules, name='admin_modules_all'),
 path('stats/', get_statistics, name='get_statistics'),
 
path("emplois-du-temps/ajouter/", EmploiDuTempsCreateView.as_view(), name="ajouter_emploi_du_temps"),
    path("emplois-du-temps/", EmploiDuTempsListView.as_view(), name="liste_emplois_du_temps"),
    path("notifications/", EmploiDuTempsNotificationListView.as_view(), name="notifications_emploi_du_temps"),
]

