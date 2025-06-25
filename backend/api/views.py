from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Notification,EmploiDuTemps, EmploiDuTempsNotification, User
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import generics, status  # ✅ Importation correcte
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Utilisateur, Filiere, Niveau, Classe, Module, SupportCours, Projet, Soumission,Notification,ProfNotification,Projet, EspaceCollaboration
from .serializers import (
    UtilisateurSerializer, FiliereSerializer, NiveauSerializer, ClasseSerializer,
    ModuleSerializer, SupportCoursSerializer, ProjetSerializer, SoumissionSerializer ,NotificationSerializer,MessageSerializer
    ,EmploiDuTempsSerializer
)
from rest_framework import permissions

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from django.shortcuts import get_object_or_404
from .serializers import ProfNotificationSerializer
from .models import Projet, Soumission, ProfNotification
from .serializers import EspaceCollaborationSerializer














#---------------superuser----------------




class IsSuperUser(permissions.BasePermission):
    """
    Autorise l'accès uniquement aux utilisateurs ayant is_superuser=True.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)




from rest_framework import generics, permissions
from .models import EmploiDuTemps, EmploiDuTempsNotification
from .serializers import EmploiDuTempsSerializer, EmploiDuTempsNotificationSerializer

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# ✅ Ajouter un emploi du temps (Super Admin uniquement)
class EmploiDuTempsCreateView(generics.CreateAPIView):
    queryset = EmploiDuTemps.objects.all()
    serializer_class = EmploiDuTempsSerializer
    permission_classes = [IsSuperUser]

# ✅ Lister tous les emplois du temps
class EmploiDuTempsListView(generics.ListAPIView):
    queryset = EmploiDuTemps.objects.all().order_by('-date_ajout')
    serializer_class = EmploiDuTempsSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Lister les notifications d'un utilisateur
class EmploiDuTempsNotificationListView(generics.ListAPIView):
    serializer_class = EmploiDuTempsNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmploiDuTempsNotification.objects.filter(utilisateur=self.request.user).order_by('-date_creation')

# ✅ Envoyer une notification automatique à tous les utilisateurs après l'ajout d'un emploi du temps
@receiver(post_save, sender=EmploiDuTemps)
def creer_notifications_emploi_du_temps(sender, instance, created, **kwargs):
    if created:
        utilisateurs = User.objects.all()
        for utilisateur in utilisateurs:
            EmploiDuTempsNotification.objects.create(
                utilisateur=utilisateur,
                message=f"Un nouvel emploi du temps a été ajouté le {instance.date_ajout.strftime('%d-%m-%Y')}.",
            )







@api_view(["GET"])
@permission_classes([IsSuperUser])
def get_all_modules(request):
    """
    Retourne tous les modules sans filtrage basé sur le rôle.
    Accessible uniquement aux administrateurs.
    """
    modules = Module.objects.all().order_by('-date_creation')
    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data, status=200)
#------------------------------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated, IsSuperUser])
def admin_create_user(request):
    """
    Crée un utilisateur (professeur ou étudiant) via le dashboard superadmin.
    Champs attendus dans le payload JSON :
      - username (obligatoire)
      - password (obligatoire)
      - role (optionnel, par défaut 'etudiant')
      - classe_id (optionnel, applicable pour les étudiants)
    """
    data = request.data
    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "etudiant")
    classe_id = data.get("classe_id")

    if not username or not password:
        return Response(
            {"error": "Les champs 'username' et 'password' sont requis."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if Utilisateur.objects.filter(username=username).exists():
        return Response(
            {"error": f"L'utilisateur '{username}' existe déjà."},
            status=status.HTTP_400_BAD_REQUEST
        )

    new_user = Utilisateur(username=username, role=role)
    new_user.set_password(password)

    if role == "etudiant" and classe_id:
        try:
            classe = Classe.objects.get(id=classe_id)
            new_user.classe = classe
        except Classe.DoesNotExist:
            return Response({"error": "Classe introuvable."}, status=status.HTTP_404_NOT_FOUND)

    new_user.save()
    serializer = UtilisateurSerializer(new_user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)





from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Utilisateur, Filiere, Niveau, Classe, Module, SupportCours, Projet, Soumission

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_statistics(request):
    """
    Retourne des statistiques globales sur l'application :
    - Nombre total de modules
    - Nombre total d'étudiants
    - Nombre total de professeurs
    - Nombre total de filières
    - Nombre total de niveaux
    - Nombre total de classes
    - Nombre total de supports de cours
    - Nombre total de projets
    - Nombre total de soumissions
    """
    total_modules = Module.objects.count()
    total_etudiants = Utilisateur.objects.filter(role="etudiant").count()
    total_professeurs = Utilisateur.objects.filter(role="professeur").count()
    total_filieres = Filiere.objects.count()
    total_niveaux = Niveau.objects.count()
    total_classes = Classe.objects.count()
    total_supports = SupportCours.objects.count()
    total_projets = Projet.objects.count()
    total_soumissions = Soumission.objects.count()

    data = {
        "modules_count": total_modules,
        "etudiants_count": total_etudiants,
        "professeurs_count": total_professeurs,
        "filieres_count": total_filieres,
        "niveaux_count": total_niveaux,
        "classes_count": total_classes,
        "supports_count": total_supports,
        "projets_count": total_projets,
        "soumissions_count": total_soumissions,
    }
    return Response(data, status=200)




#----------------------------------------------------------

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsSuperUser])
def admin_update_user(request, user_id):
    """
    Met à jour un utilisateur (modification du rôle, de la classe ou du mot de passe).
    Champs possibles dans le payload JSON :
      - role
      - classe_id
      - password
    """
    try:
        user = Utilisateur.objects.get(id=user_id)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    role = data.get("role")
    classe_id = data.get("classe_id")
    new_password = data.get("password")

    if role:
        user.role = role

    if new_password:
        user.set_password(new_password)

    if classe_id:
        # Pour un étudiant, on associe la classe
        if user.role == "etudiant":
            try:
                from .models import Classe
                classe = Classe.objects.get(id=classe_id)
                user.classe = classe
            except Classe.DoesNotExist:
                return Response({"error": "Classe introuvable."}, status=status.HTTP_404_NOT_FOUND)
        else:
            user.classe = None

    user.save()
    serializer = UtilisateurSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)












@api_view(["POST"])
@permission_classes([IsAuthenticated, IsSuperUser])
def create_user(request):
    """
    Crée un utilisateur.
    - Si le rôle est "étudiant", le champ "classe" est obligatoire.
    - Si le rôle est "professeur", le champ classe est mis à None.
    """
    data = request.data.copy()
    role = data.get("role")

    if role == "etudiant":
        # Vérifier que le champ classe est fourni
        classe_id = data.get("classe")
        if not classe_id:
            return Response(
                {"error": "Pour un étudiant, il faut sélectionner une classe."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Vérifier que la classe existe
        try:
            Classe.objects.get(id=classe_id)
        except Classe.DoesNotExist:
            return Response(
                {"error": "Classe non trouvée."},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        # Pour un professeur, on force classe à None
        data["classe"] = None

    serializer = UtilisateurSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




#----------------------------------------------------------

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsSuperUser])
def admin_delete_user(request, user_id):
    """
    Supprime un utilisateur identifié par son user_id.
    """
    try:
        user = Utilisateur.objects.get(id=user_id)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response({"message": "Utilisateur supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)


#------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsSuperUser])
def admin_list_users(request):
    """
    Retourne la liste de tous les utilisateurs.
    """
    from .models import Utilisateur
    users = Utilisateur.objects.all()
    serializer = UtilisateurSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)





#-------------superuser----------------



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_modules(request):
    q = request.GET.get("q", "")
    modules = Module.objects.filter(titre__icontains=q)
    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data, status=200)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def etudiant_dashboard(request):
    user = request.user

    # 1) Vérification du rôle
    if user.role != 'etudiant':
        return Response({"detail": "Accès refusé : vous n'êtes pas un étudiant."}, status=403)

    # 2) Calcul des stats

    # a) Nombre total de modules dans la classe de l'étudiant
    #    (on suppose qu'un étudiant n'appartient qu'à une seule classe via user.classe)
    modules_count = 0
    if user.classe:
        modules_count = user.classe.modules.count()

    # b) Nombre total de projets auxquels cet étudiant est assigné
    projets_count = user.projets_assignes.count()

    # c) Nombre total de soumissions faites par cet étudiant
    soumissions_count = user.soumissions.count()

    # d) Vous pouvez rajouter d’autres stats (nombre de notifications non lues, etc.)
    notifications_non_lues = user.notifications.filter(lu=False).count()

    # 3) Retour des statistiques
    data = {
        "modules_count": modules_count,
        "projets_count": projets_count,
        "soumissions_count": soumissions_count,
        "notifications_non_lues": notifications_non_lues,
    }
    return Response(data, status=200)





@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_projects(request):
    user = request.user
    projets = Projet.objects.filter(etudiants=user) | Projet.objects.filter(enseignant=user)
    serializer = ProjetSerializer(projets, many=True)
    return Response(serializer.data, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def creer_espace_collaboration(request, projet_id):
    projet = get_object_or_404(Projet, id=projet_id)
    if request.user not in projet.etudiants.all() and request.user != projet.enseignant:
        return Response({"error": "Accès refusé."}, status=403)

    espace, created = EspaceCollaboration.objects.get_or_create(projet=projet)
    if created:
        espace.membres.set(list(projet.etudiants.all()) + [projet.enseignant])

    serializer = EspaceCollaborationSerializer(espace)
    return Response(serializer.data, status=201)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def envoyer_message(request, espace_id):
    print(f"🔍 Espace ID reçu: {espace_id}")  # Vérifier l'ID de l'espace
    print("📨 Données reçues dans la requête:", request.data)
    print("📂 Fichiers reçus:", request.FILES)

    espace = get_object_or_404(EspaceCollaboration, id=espace_id)
    if request.user not in espace.membres.all():
        return Response({"error": "Accès refusé."}, status=403)

    data = {
        "auteur": request.user.id,
        "espace": espace.id,
        "texte": request.data.get("texte", ""),
        "fichier": request.FILES.get("fichier"),
        "audio": request.FILES.get("audio"),
    }

    print("🛠️ Données avant sérialisation:", data)  # Voir ce qui est envoyé au sérialiseur

    serializer = MessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    print("❌ Erreur de validation :", serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, espace_id):
    espace = get_object_or_404(EspaceCollaboration, id=espace_id)
    if request.user not in espace.membres.all():
        return Response({"error": "Accès refusé."}, status=403)

    messages = espace.messages.all().order_by("date_envoi")
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_professor_classes_and_modules(request):
    """
    Récupère les classes dans lesquelles le professeur connecté enseigne
    ainsi que les modules associés dans chacune de ces classes.
    """
    professeur = request.user
    if professeur.role != "professeur":
        return Response(
            {"error": "Seuls les professeurs peuvent accéder à cette information."},
            status=403
        )
    
    # Récupérer tous les modules dispensés par ce professeur
    modules = Module.objects.filter(enseignant=professeur)
    
    # Regrouper les modules par classe
    classes_dict = {}
    for module in modules:
        classe = module.classe
        if classe.id not in classes_dict:
            classes_dict[classe.id] = {
                "id": classe.id,
                "nom": str(classe),  # ou classe.nom si vous préférez
                "filiere": FiliereSerializer(classe.filiere).data,
                "niveau": NiveauSerializer(classe.niveau).data,
                "modules": []
            }
        classes_dict[classe.id]["modules"].append(ModuleSerializer(module).data)
    
    result = list(classes_dict.values())
    return Response(result, status=200)





















@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_submissions_for_prof_module(request, module_id):
    """
    Récupère les soumissions pour un module donné,
    pour tous les projets de ce module dont l'enseignant est le prof connecté.
    """
    prof = request.user
    if prof.role != "professeur":
        return Response(
            {"error": "Seuls les professeurs peuvent accéder à ces soumissions."},
            status=status.HTTP_403_FORBIDDEN
        )
    # Filtrer les soumissions dont le projet appartient à un module enseigné par le prof
    submissions = Soumission.objects.filter(projet__module__id=module_id, projet__enseignant=prof)
    serializer = SoumissionSerializer(submissions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)








@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_submissions_for_prof(request):
    """
    Récupère toutes les soumissions pour les projets des modules du professeur connecté.
    """
    prof = request.user
    if prof.role != "professeur":
        return Response(
            {"error": "Seuls les professeurs peuvent accéder à ces soumissions."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Récupère toutes les soumissions dont le projet est géré par le professeur connecté
    submissions = Soumission.objects.filter(projet__enseignant=prof)
    serializer = SoumissionSerializer(submissions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)







@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_submissions_for_project(request, projet_id):
    """
    Récupère les soumissions de l'étudiant connecté pour un projet donné.
    """
    student = request.user
    if student.role != "etudiant":
        return Response(
            {"error": "Seuls les étudiants peuvent accéder à leurs soumissions."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Récupérer les soumissions pour le projet donné
    submissions = Soumission.objects.filter(etudiant=student, projet_id=projet_id)
    serializer = SoumissionSerializer(submissions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)







@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_soumissions_professeur(request):
    """
    Récupère toutes les soumissions des projets dont l'enseignant (du projet) est l'utilisateur connecté.
    """
    # Vérifier que l'utilisateur est bien un professeur
    if getattr(request.user, 'role', '') != 'professeur':
        return Response({"error": "Seuls les professeurs peuvent accéder à ces soumissions."},
                        status=status.HTTP_403_FORBIDDEN)
    
    # Filtrer les soumissions dont le projet est géré par le professeur connecté
    soumissions = Soumission.objects.filter(projet__enseignant=request.user)
    serializer = SoumissionSerializer(soumissions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_prof_notification(request, notif_id):
    """
    Supprime une notification du professeur connecté.
    """
    notification = get_object_or_404(ProfNotification, id=notif_id, professeur=request.user)
    
    # Supprimer la notification
    notification.delete()

    # ✅ Retourner une réponse correcte
    return Response({"message": "Notification supprimée avec succès."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_prof_notifications(request):
    """
    Récupère les notifications non lues pour le professeur connecté avec l'ID du projet associé.
    """
    professeur = request.user
    notifications = ProfNotification.objects.filter(professeur=professeur, lu=False).order_by('-date_creation')

    serializer = ProfNotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_espace_collaboration(request, projet_id):
    """
    Endpoint permettant à un étudiant de créer un espace de collaboration
    pour un projet auquel il est assigné.
    """
    projet = get_object_or_404(Projet, id=projet_id)

    # Vérifier si l'utilisateur est un étudiant du projet
    if request.user.role != 'etudiant' or not projet.etudiants.filter(id=request.user.id).exists():
        return Response({"error": "Vous n'avez pas les permissions pour créer un espace pour ce projet."}, status=403)

    # Vérifier si un espace existe déjà
    if hasattr(projet, 'espace_collaboration'):
        return Response({"error": "Un espace de collaboration existe déjà pour ce projet."}, status=400)

    serializer = EspaceCollaborationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        espace = serializer.save()
        return Response({
            "message": "Espace de collaboration créé avec succès !",
            "espace": EspaceCollaborationSerializer(espace).data
        }, status=201)
    
    return Response(serializer.errors, status=400)




@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def soumettre_travail(request, projet_id):
    """
    Permet à un étudiant de soumettre son projet :
    - Incrémente la version si une soumission existe déjà.
    - Crée une notification pour le professeur du projet.
    """
    # Vérifier que l'utilisateur est un étudiant
    etudiant = request.user
    if getattr(etudiant, 'role', '') != 'etudiant':
        return Response(
            {"error": "Seuls les étudiants peuvent soumettre un travail."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Récupérer le projet et vérifier que l'étudiant y est assigné
    projet = get_object_or_404(Projet, id=projet_id, etudiants=etudiant)

    # Récupérer le fichier envoyé dans la requête
    fichier = request.FILES.get("fichier")
    if not fichier:
        return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

    # Si une soumission existe déjà, incrémenter la version ; sinon, créer une nouvelle soumission
    try:
        soumission_existante = Soumission.objects.get(projet=projet, etudiant=etudiant)
        soumission_existante.version += 1
        soumission_existante.fichier = fichier
        soumission_existante.save()
        soumission = soumission_existante
    except Soumission.DoesNotExist:
        soumission = Soumission.objects.create(
            projet=projet,
            etudiant=etudiant,
            fichier=fichier
        )

    # ✅ Création d'une notification pour le professeur du projet avec l'ID du projet
    professeur = projet.enseignant  
    ProfNotification.objects.create(
        professeur=professeur,
        message=f"L'étudiant {etudiant.username} a soumis son travail pour le projet '{projet.titre}' (v{soumission.version}).",
        projet=projet  # ✅ On associe bien le projet ici
    )

    return Response(
        {"message": "Travail soumis avec succès.", "soumission_id": soumission.id},
        status=status.HTTP_201_CREATED
    )









@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_etudiants_par_classe(request, classe_id):
    """
    ✅ Récupère la liste des étudiants d'une classe donnée.
    """
    classe = get_object_or_404(Classe, id=classe_id)
    etudiants = Utilisateur.objects.filter(classe=classe, role="etudiant")

    if not etudiants.exists():
        return Response({"message": "Aucun étudiant trouvé dans cette classe."}, status=404)

    serializer = UtilisateurSerializer(etudiants, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_modules_professeur(request):
    """
    ✅ Récupère les modules enseignés par le professeur connecté.
    """
    professeur = request.user

    if professeur.role != "professeur":
        return Response({"error": "Seuls les professeurs peuvent accéder à leurs modules."}, status=403)

    modules = Module.objects.filter(enseignant=professeur)

    if not modules.exists():
        return Response({"message": "Aucun module trouvé pour ce professeur."}, status=404)

    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data, status=200)


# ✅ Récupérer les étudiants d'une classe# ✅ Créer un projet


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_projet(request):
    """
    ✅ Un professeur crée un projet et l’attribue aux étudiants sélectionnés.
    """
    professeur = request.user
    if professeur.role != "professeur":
        return Response({"error": "Seuls les professeurs peuvent créer un projet."}, status=status.HTTP_403_FORBIDDEN)

    # 📌 Ajoute ceci pour voir les données reçues dans la requête
    print("📥 Données reçues :", request.data)

    titre = request.data.get("titre")
    description = request.data.get("description")
    date_limite = request.data.get("date_limite")
    module_id = request.data.get("module")

    # ✅ Vérification et récupération des étudiants
    if isinstance(request.data.get("etudiants"), list):
        etudiant_ids = request.data.get("etudiants")
    else:
        etudiant_ids = request.data.getlist("etudiants[]")  # ✅ Essaye d'obtenir sous ce format

    print("🎯 Étudiants reçus :", etudiant_ids)

    if not etudiant_ids:
        return Response({"error": "Aucun étudiant sélectionné."}, status=status.HTTP_400_BAD_REQUEST)

    module = get_object_or_404(Module, id=module_id, enseignant=professeur)
    etudiants = Utilisateur.objects.filter(id__in=etudiant_ids, classe=module.classe, role="etudiant")

    if not etudiants.exists():
        return Response({"error": "Aucun étudiant valide sélectionné."}, status=status.HTTP_400_BAD_REQUEST)

    # Création du projet
    projet = Projet.objects.create(
        titre=titre,
        description=description,
        date_limite=date_limite,
        module=module,
        enseignant=professeur
    )
    projet.etudiants.set(etudiants)  # ✅ Assignation des étudiants

    return Response(ProjetSerializer(projet).data, status=status.HTTP_201_CREATED)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_projets_etudiant(request):
#     """
#     Récupère les projets attribués à un étudiant.
#     """
#     etudiant = request.user
#     if etudiant.role != "etudiant":
#         return Response({"error": "Seuls les étudiants peuvent voir leurs projets."}, status=status.HTTP_403_FORBIDDEN)

#     projets = Projet.objects.filter(etudiants=etudiant)
#     return Response(ProjetSerializer(projets, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_projets_etudiant(request):
    """
    Récupère les projets attribués à un étudiant connecté.
    """
    etudiant = request.user
    if etudiant.role != "etudiant":
        return Response(
            {"error": "Seuls les étudiants peuvent voir leurs projets."},
            status=status.HTTP_403_FORBIDDEN
        )

    projets = Projet.objects.filter(etudiants=etudiant)
    serializer = ProjetSerializer(projets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)






# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def soumettre_travail(request, projet_id):
#     """
#     L'étudiant soumet un fichier pour un projet.
#     """
#     etudiant = request.user
#     if etudiant.role != "etudiant":
#         return Response({"error": "Seuls les étudiants peuvent soumettre un travail."}, status=status.HTTP_403_FORBIDDEN)

#     projet = get_object_or_404(Projet, id=projet_id, etudiants=etudiant)

#     fichier = request.FILES.get("fichier")

#     if not fichier:
#         return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

#     # Création de la soumission
#     soumission = Soumission.objects.create(
#         projet=projet,
#         etudiant=etudiant,
#         fichier=fichier
#     )

#     # ✅ Notification au professeur
#     Notification.objects.create(
#         utilisateur=projet.enseignant,
#         message=f"L'étudiant {etudiant.username} a soumis son travail pour le projet '{projet.titre}'."
#     )

#     return Response({"message": "Travail soumis avec succès."}, status=status.HTTP_201_CREATED)









@api_view(['POST'])
@permission_classes([IsAuthenticated])
def noter_travail(request, soumission_id):
    """
    Le professeur attribue une note et un feedback à une soumission.
    """
    professeur = request.user
    if professeur.role != "professeur":
        return Response({"error": "Seuls les professeurs peuvent noter un travail."}, status=status.HTTP_403_FORBIDDEN)

    soumission = get_object_or_404(Soumission, id=soumission_id, projet__enseignant=professeur)

    note = request.data.get("note")
    feedback = request.data.get("feedback", "")

    if note is None:
        return Response({"error": "La note est requise."}, status=status.HTTP_400_BAD_REQUEST)

    soumission.note = note
    soumission.feedback = feedback
    soumission.save()

    # ✅ Notification à l'étudiant
    Notification.objects.create(
        utilisateur=soumission.etudiant,
        message=f"Votre travail pour '{soumission.projet.titre}' a été corrigé. Note : {note}."
    )

    return Response({"message": "Note et feedback enregistrés."}, status=status.HTTP_200_OK)















# ✅ Récupérer les notifications non lues
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(utilisateur=request.user, lu=False).order_by('-date_creation')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=200)


# ✅ Supprimer une notification spécifique après consultation
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, utilisateur=request.user)
    notification.delete()
    return Response({'message': 'Notification supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)

# ✅ Gérer le clic sur une notification pour rediriger vers le support
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_notification(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, utilisateur=request.user)

    # Trouver le support correspondant au message de la notification
    try:
        module_title = notification.message.split("au module ")[1]
        module = Module.objects.get(titre=module_title)
        support = SupportCours.objects.filter(module=module).order_by('-date_creation').first()
        
        if not support:
            return Response({"message": "Aucun support trouvé pour ce module."}, status=status.HTTP_404_NOT_FOUND)

        # Supprimer la notification après consultation
        notification.delete()
        
        return Response({
            "message": "Notification lue et supprimée.",
            "redirect_url": f"/supports/{support.id}"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": "Erreur lors de la récupération du support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from rest_framework.decorators import action

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == "professeur":
                return Module.objects.filter(enseignant=user)
            elif user.role == "etudiant" and user.classe:
                return Module.objects.filter(classe=user.classe)
        return Module.objects.none()

    queryset = Module.objects.all()

    # ✅ Endpoint pour récupérer les supports d'un module spécifique


# ✅ Endpoint pour récupérer les supports d'un module spécifique
@action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
def supports(self, request, pk=None):
    """
    Retourne tous les supports de cours associés à un module.
    """
    try:
        module = get_object_or_404(Module, pk=pk)
        print(f"🔍 Recherche des supports pour le module : {module}")

        # Vérifier si l'utilisateur peut accéder aux supports de ce module
        user = request.user
        if user.role == "etudiant" and module.classe != user.classe:
            return Response(
                {"message": "Accès interdit. Vous n'êtes pas dans la classe associée à ce module."},
                status=status.HTTP_403_FORBIDDEN
            )

        supports = SupportCours.objects.filter(module=module)
        print(f"📌 Supports trouvés : {supports}")

        serializer = SupportCoursSerializer(supports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"❌ Erreur dans supports : {str(e)}")
        return JsonResponse({"error": "Erreur interne du serveur"}, status=500)
















# ✅ API pour récupérer les modules du professeur connecté
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_professor_modules(request):
    """
    Retourne les modules enseignés par le professeur connecté.
    """
    if not hasattr(request.user, "role") or request.user.role != 'professeur':
        return Response({'message': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

    modules = Module.objects.filter(enseignant=request.user)
    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ API pour ajouter un support à un module spécifique


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ajouter_support(request, module_id):
    """
    Ajoute un support de cours à un module spécifique et envoie une notification aux étudiants.
    """
    module = get_object_or_404(Module, id=module_id, enseignant=request.user)

    fichier = request.FILES.get('fichier')
    titre = request.data.get('titre', 'Support de cours')
    description = request.data.get('description', '')

    if not fichier:
        return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

    # Récupérer la dernière version et incrémenter
    dernier_support = SupportCours.objects.filter(module=module).order_by('-version').first()
    nouvelle_version = dernier_support.version + 1 if dernier_support else 1

    support = SupportCours.objects.create(
        titre=titre,
        description=description,
        fichier=fichier,
        module=module,
        version=nouvelle_version
    )

    # ✅ Envoi des notifications aux étudiants de la classe du module avec `module`
    etudiants = module.classe.etudiants.all()
    for etudiant in etudiants:
        Notification.objects.create(
            utilisateur=etudiant,
            message=f"Nouveau support ajouté au module {module.titre} : {titre}",
            module=module  # ✅ Correction ici pour inclure le module
        )

    serializer = SupportCoursSerializer(support)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# ✅ API pour récupérer les informations de l'utilisateur connecté
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """
    Retourne les informations de l'utilisateur actuellement connecté.
    """
    user = request.user
    serializer = UtilisateurSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Gestion des utilisateurs
class UtilisateurViewSet(viewsets.ModelViewSet):
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_superuser:  
    #         return Utilisateur.objects.all()
    #     return Utilisateur.objects.filter(id=user.id) 
    def get_queryset(self):
        user = self.request.user
        queryset = Utilisateur.objects.all() if user.is_superuser else Utilisateur.objects.filter(id=user.id)

        # Récupérer le paramètre "role" depuis l'URL
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)

        return queryset

# ✅ Gestion des filières
class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ Gestion des niveaux
class NiveauViewSet(viewsets.ModelViewSet):
    queryset = Niveau.objects.all()
    serializer_class = NiveauSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ Gestion des classes
class ClasseViewSet(viewsets.ModelViewSet):
    queryset = Classe.objects.all()
    serializer_class = ClasseSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ Gestion des modules avec filtrage dynamique et ajout de support
class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if getattr(user, "role", "") == "professeur":
                return Module.objects.filter(enseignant=user)
            elif getattr(user, "role", "") == "etudiant" and hasattr(user, "classe"):
                return Module.objects.filter(classe=user.classe)
        return Module.objects.none()

    queryset = Module.objects.all()

    # ✅ Endpoint pour ajouter un support de cours via ViewSet
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], parser_classes=[MultiPartParser, FormParser])
    def ajouter_support(self, request, pk=None):
        """
        Ajoute un support de cours à un module via un endpoint dédié.
        """
        module = get_object_or_404(Module, pk=pk, enseignant=request.user)

        fichier = request.FILES.get('fichier')
        titre = request.data.get('titre', 'Support de cours')
        description = request.data.get('description', '')

        if not fichier:
            return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

        # Récupérer la dernière version du support pour ce module et incrémenter
        dernier_support = SupportCours.objects.filter(module=module).order_by('-version').first()
        nouvelle_version = dernier_support.version + 1 if dernier_support else 1

        support = SupportCours.objects.create(
            titre=titre,
            description=description,
            fichier=fichier,
            module=module,
            version=nouvelle_version
        )

        serializer = SupportCoursSerializer(support)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    # ✅ Endpoint pour récupérer les modules du professeur connecté directement depuis le ViewSet
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def professeur(self, request):
        """
        Récupère les modules enseignés par le professeur connecté.
        """
        if not hasattr(request.user, "role") or request.user.role != 'professeur':
            return Response({'message': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

        modules = Module.objects.filter(enseignant=request.user)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ✅ Endpoint pour ajouter un support de cours via ViewSet
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], parser_classes=[MultiPartParser, FormParser])
    def ajouter_support(self, request, pk=None):
        """
        Ajoute un support de cours à un module via un endpoint dédié.
        """
        module = get_object_or_404(Module, pk=pk, enseignant=request.user)

        fichier = request.FILES.get('fichier')
        titre = request.data.get('titre', 'Support de cours')
        description = request.data.get('description', '')

        if not fichier:
            return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

        support = SupportCours.objects.create(
            titre=titre,
            description=description,
            fichier=fichier,
            module=module
        )

        serializer = SupportCoursSerializer(support)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def supports(self, request, pk=None):
        """
        Retourne tous les supports de cours associés à un module.
        """
        try:
            module = get_object_or_404(Module, pk=pk)

            # 🔍 Vérifier si l'utilisateur peut accéder aux supports
            user = request.user
            if user.role == "etudiant" and module.classe and module.classe != user.classe:
                return Response(
                    {"message": "Accès interdit. Vous n'êtes pas dans la classe associée à ce module."},
                    status=status.HTTP_403_FORBIDDEN
                )

            supports = SupportCours.objects.filter(module=module)
            if not supports.exists():
                return Response({"message": "Aucun support trouvé pour ce module."}, status=status.HTTP_404_NOT_FOUND)

            serializer = SupportCoursSerializer(supports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"❌ Erreur dans supports: {str(e)}")
            return Response({"error": "Erreur interne du serveur"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   

# ✅ Gestion des supports de cours
class SupportCoursViewSet(viewsets.ModelViewSet):
    queryset = SupportCours.objects.all()
    serializer_class = SupportCoursSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ Gestion des projets
class ProjetViewSet(viewsets.ModelViewSet):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def creer(self, request):
        """
        ✅ Un professeur crée un projet et l’attribue aux étudiants sélectionnés.
        """
        professeur = request.user
        if professeur.role != "professeur":
            return Response({"error": "Seuls les professeurs peuvent créer un projet."}, status=status.HTTP_403_FORBIDDEN)

        titre = request.data.get("titre")
        description = request.data.get("description")
        date_limite = request.data.get("date_limite")
        module_id = request.data.get("module")
        etudiant_ids = request.data.getlist("etudiants", [])
        fichier_instruction = request.FILES.get('fichier_instruction')
        
        module = get_object_or_404(Module, id=module_id, enseignant=professeur)
        etudiants = Utilisateur.objects.filter(id__in=etudiant_ids, classe=module.classe, role="etudiant")

        if not etudiants.exists():
            return Response({"error": "Aucun étudiant valide sélectionné."}, status=status.HTTP_400_BAD_REQUEST)

        projet = Projet.objects.create(
            titre=titre,
            description=description,
            date_limite=date_limite,
            module=module,
            fichier_instruction=fichier_instruction,
            enseignant=professeur
        )

        projet.etudiants.set(etudiants) 

        return Response(ProjetSerializer(projet).data, status=status.HTTP_201_CREATED)

# ✅ Gestion des soumissions
class SoumissionViewSet(viewsets.ModelViewSet):
    queryset = Soumission.objects.all()
    serializer_class = SoumissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ✅ Ajouter une note à une soumission
    @action(detail=True, methods=['POST'])
    def noter(self, request, pk=None):
        soumission = get_object_or_404(Soumission, pk=pk)

        if request.user.role != 'professeur':  # Vérification du rôle
            return Response({'message': 'Seul un professeur peut noter une soumission.'},
                            status=status.HTTP_403_FORBIDDEN)

        note = request.data.get('note')
        feedback = request.data.get('feedback', '')

        try:
            note = float(note)
            if note < 0 or note > 20:  # ✅ Vérification de la note entre 0 et 20
                return Response({'message': 'La note doit être entre 0 et 20.'}, 
                                status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'message': 'La note doit être un nombre valide.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # ✅ Mise à jour de la soumission
        soumission.note = note
        soumission.feedback = feedback
        soumission.save()

        return Response({'message': 'Note attribuée avec succès.', 'note': note, 'feedback': feedback},
                        status=status.HTTP_200_OK)
