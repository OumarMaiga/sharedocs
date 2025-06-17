from rest_framework import serializers
from api.models import (
    Utilisateur, Filiere, Niveau, Classe, Module, 
    SupportCours, Projet, Soumission,ProfNotification,Message, EspaceCollaboration,EmploiDuTemps
)


class ProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = ['id', 'titre'] 

class ProfNotificationSerializer(serializers.ModelSerializer):
    projet = ProjetSerializer(read_only=True)  # Sérialiser le projet pour récupérer son ID et son titre

    class Meta:
        model = ProfNotification
        fields = ['id', 'professeur', 'message', 'date_creation', 'lu', 'projet']


# ------------------------------
# Serializer pour Utilisateur
# ------------------------------
class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'


# ------------------------------
# Serializer pour Filiere
# ------------------------------
class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = '__all__'


# ------------------------------
# Serializer pour Niveau
# ------------------------------
class NiveauSerializer(serializers.ModelSerializer):
    class Meta:
        model = Niveau
        fields = '__all__'


# ------------------------------
# Serializer pour Classe
# ------------------------------
class ClasseSerializer(serializers.ModelSerializer):
    filiere = FiliereSerializer(read_only=True)
    niveau = NiveauSerializer(read_only=True)

    filiere_id = serializers.PrimaryKeyRelatedField(
        queryset=Filiere.objects.all(), source='filiere', write_only=True
    )
    niveau_id = serializers.PrimaryKeyRelatedField(
        queryset=Niveau.objects.all(), source='niveau', write_only=True
    )

    class Meta:
        model = Classe
        fields = ['id', 'nom', 'filiere', 'niveau', 'filiere_id', 'niveau_id']


# ------------------------------
# Serializer pour SupportCours
# ------------------------------
class SupportCoursSerializer(serializers.ModelSerializer):
    module_id = serializers.PrimaryKeyRelatedField(
        queryset=Module.objects.all(), source='module', write_only=True
    )

    class Meta:
        model = SupportCours
        fields = [
            'id', 'titre', 'description', 'fichier',
            'module', 'module_id',
            'version', 'date_creation'
        ]


# ------------------------------
# Serializer pour Module (avec supports inclus)
# ------------------------------
class ModuleSerializer(serializers.ModelSerializer):
    enseignant = UtilisateurSerializer(read_only=True)
    classe = ClasseSerializer(read_only=True)
    
    # ✅ Ajout des supports dans les détails du module
    supports = SupportCoursSerializer(many=True, read_only=True)

    enseignant_id = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(role='professeur'),
        source='enseignant',
        write_only=True
    )
    classe_id = serializers.PrimaryKeyRelatedField(
        queryset=Classe.objects.all(), source='classe', write_only=True
    )

    class Meta:
        model = Module
        fields = [
            'id', 'titre', 'description',
            'enseignant', 'enseignant_id',
            'classe', 'classe_id',
            'supports',  # ✅ Ajout pour voir les supports directement
            'date_creation'
        ]


# ------------------------------
# Serializer pour Projet
# ------------------------------
class ProjetSerializer(serializers.ModelSerializer):
    module = ModuleSerializer(read_only=True)
    module_id = serializers.PrimaryKeyRelatedField(
        queryset=Module.objects.all(), source='module', write_only=True
    )
    enseignant = UtilisateurSerializer(read_only=True)
    enseignant_id = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(role='professeur'),
        source='enseignant', write_only=True
    )
    espace_id = serializers.PrimaryKeyRelatedField(
        source='espace_collaboration',  # = le related_name de la OneToOne dans EspaceCollaboration
        read_only=True
    )
    etudiants = UtilisateurSerializer(many=True, read_only=True)
    etudiants_ids = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(role='etudiant'),
        many=True, source='etudiants', write_only=True
    )

    class Meta:
        model = Projet
        fields = [
            'id', 'titre', 'description', 'date_limite',
            'module', 'module_id',
            'enseignant', 'enseignant_id',
            'etudiants', 'etudiants_ids',
            'fichier_instruction', 'date_creation','espace_id'
        ]


# ------------------------------
# Serializer pour Soumission
# ------------------------------
class SoumissionSerializer(serializers.ModelSerializer):
    projet = ProjetSerializer(read_only=True)
    projet_id = serializers.PrimaryKeyRelatedField(
        queryset=Projet.objects.all(), source='projet', write_only=True
    )
    etudiant = UtilisateurSerializer(read_only=True)
    etudiant_id = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(role='etudiant'),
        source='etudiant', write_only=True
    )

    class Meta:
        model = Soumission
        fields = '__all__'


# ------------------------------
# Serializer pour afficher un simple message
# ------------------------------
class HelloSerializer(serializers.Serializer):
    message = serializers.CharField()
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    module_id = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'message', 'date_creation', 'lu', 'module_id']

    def get_module_id(self, obj):
        return obj.module.id if obj.module else None
    


# ✅ Serializer pour les messages envoyés dans l'espace de collaboration
class MessageSerializer(serializers.ModelSerializer):
    auteur_username = serializers.CharField(source="auteur.username", read_only=True)
    espace = serializers.PrimaryKeyRelatedField(queryset=EspaceCollaboration.objects.all())

    class Meta:
        model = Message
        fields = "__all__"



class EspaceCollaborationSerializer(serializers.ModelSerializer):
    projet = serializers.PrimaryKeyRelatedField(queryset=Projet.objects.all())
    membres = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(role='etudiant'), 
        many=True
    )

    class Meta:
        model = EspaceCollaboration
        fields = ['id', 'projet', 'membres']

    def validate(self, data):
        """
        Validation pour s'assurer que :
        - L'étudiant appartient bien au projet
        - Les membres ajoutés font partie du projet
        """
        projet = data.get('projet')
        user = self.context['request'].user

        # Vérifier si l'utilisateur est un étudiant et appartient au projet
        if user.role != 'etudiant' or not projet.etudiants.filter(id=user.id).exists():
            raise serializers.ValidationError("Vous ne pouvez créer un espace que pour un projet auquel vous participez.")

        # Vérifier que tous les membres ajoutés font partie du projet
        for membre in data.get('membres', []):
            if not projet.etudiants.filter(id=membre.id).exists():
                raise serializers.ValidationError(f"L'étudiant {membre.username} ne fait pas partie du projet.")

        return data

    def create(self, validated_data):
        """
        Création de l'espace et ajout automatique du créateur comme membre.
        """
        membres = validated_data.pop('membres', [])
        espace = EspaceCollaboration.objects.create(**validated_data)
        espace.membres.add(*membres)
        espace.membres.add(self.context['request'].user)  # Ajoute le créateur automatiquement
        return espace
from rest_framework import serializers
from .models import EmploiDuTemps, EmploiDuTempsNotification

class EmploiDuTempsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploiDuTemps
        fields = "__all__"

class EmploiDuTempsNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploiDuTempsNotification
        fields = "__all__"
