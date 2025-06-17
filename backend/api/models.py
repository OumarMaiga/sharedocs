from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
# ======================================================
# 1. Utilisateur personnalisé
# ======================================================
class Utilisateur(AbstractUser):
    ROLES = (
        ('etudiant', 'Étudiant'),
        ('professeur', 'Professeur'),
    )
    role = models.CharField(max_length=20, choices=ROLES)
    # Pour les étudiants, association à la classe dans laquelle ils sont inscrits
    classe = models.ForeignKey(
        'Classe',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='etudiants'
    )

    def __str__(self):
        return self.username


# ======================================================
# 2. Filière
# ======================================================
class Filiere(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.nom


# ======================================================
# 3. Niveau
# ======================================================
class Niveau(models.Model):
    nom = models.CharField(max_length=100)  # Exemple : "Licence 1", "Licence 2", "Master 1", etc.
    description = models.TextField(blank=True)

    def __str__(self):
        return self.nom


# ======================================================
# 4. Classe
# ======================================================
class Classe(models.Model):
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, related_name='classes')
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE, related_name='classes')
    nom = models.CharField(max_length=100)  # Exemple : "A", "B", "2023-A", etc.

    def __str__(self):
        # La relation inverse 'etudiants' dans Utilisateur permet de récupérer les étudiants inscrits
        return f"{self.filiere.nom} - {self.niveau.nom} - {self.nom}"


# ======================================================
# 5. Module
# ======================================================
class Module(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Le module est dispensé par un professeur
    enseignant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'professeur'},
        related_name='modules_dispenses'
    )
    # Le module est destiné à une classe spécifique
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name='modules')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} ({self.classe})"


# ======================================================
# 6. Support de cours
# ======================================================
class SupportCours(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    fichier = models.FileField(upload_to='supports/')
    # Chaque support est lié à un module
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='supports')
    version = models.IntegerField(default=1)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} (v{self.version})"


# ======================================================
# 7. Projet
# ======================================================
class Projet(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField()
    date_limite = models.DateTimeField()
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='projets')
    enseignant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'professeur'},
        related_name='projets_crees'
    )
    etudiants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='projets_assignes',
        limit_choices_to={'role': 'etudiant'}
    )
    fichier_instruction = models.FileField(upload_to='projets/instructions/', blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def clean(self):
        """
        Validation : s'assurer que chaque étudiant assigné appartient bien à la classe du module.
        Cette vérification est réalisée uniquement sur des instances déjà sauvegardées.
        """
        if self.pk and self.module and self.module.classe:
            for etudiant in self.etudiants.all():
                if etudiant.classe != self.module.classe:
                    raise ValidationError(
                        f"L'étudiant {etudiant.username} n'appartient pas à la classe du module ({self.module.classe})."
                    )

    def __str__(self):
        return self.titre


# ======================================================
# 8. Soumission
# ======================================================
class Soumission(models.Model):
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='soumissions')
    # Seuls les utilisateurs ayant le rôle "étudiant" peuvent soumettre un travail
    etudiant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'etudiant'},
        related_name='soumissions'
    )
    fichier = models.FileField(upload_to='soumissions/')
    date_soumission = models.DateTimeField(auto_now_add=True)
    note = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    version = models.IntegerField(default=1)

    def __str__(self):
        return f"Soumission de {self.etudiant} pour {self.projet}"
#--------------------NOTIFICATION SUPPORT--------------------------------------
class Notification(models.Model):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications'
    )
    message = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)  # ✅ Statut de lecture
    module = models.ForeignKey(
        'Module',  # Référence au module concerné
        on_delete=models.CASCADE,
        null=True,  # Il peut être null si la notification n'est pas liée à un module
        blank=True,
        related_name='notifications'
    )

    def __str__(self):
        return f"Notification pour {self.utilisateur.username} - {self.message[:50]}"




class ProfNotification(models.Model):
    message = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)
    professeur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="prof_notifications"
    )
    projet = models.ForeignKey(  # ✅ Ajout du champ projet
        Projet,
        on_delete=models.CASCADE,
        related_name="notifications_prof",
        null=True,  # ✅ Permet d'éviter des erreurs avec les anciennes notifications
        blank=True
    )

    def __str__(self):
        return f"Notification (Prof: {self.professeur.username}) - {self.message}"



class EspaceCollaboration(models.Model):
    projet = models.OneToOneField(
        "Projet", on_delete=models.CASCADE, related_name="espace_collaboration"
    )
    membres = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="collaborations"
    )

    def __str__(self):
        return f"Espace de collaboration pour {self.projet.titre}"


class Message(models.Model):
    espace = models.ForeignKey(
        EspaceCollaboration, on_delete=models.CASCADE, related_name="messages"
    )
    auteur = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="messages_envoyes"
    )
    texte = models.TextField(blank=True, null=True)
    fichier = models.FileField(upload_to="messages_fichiers/", blank=True, null=True)
    audio = models.FileField(upload_to="messages_audios/", blank=True, null=True)
    date_envoi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message de {self.auteur.username} dans {self.espace.projet.titre}"




from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class EmploiDuTemps(models.Model):
    fichier = models.FileField(upload_to='emplois_du_temps/')
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Emploi du temps {self.date_ajout.strftime('%d-%m-%Y')}"

class EmploiDuTempsNotification(models.Model):
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    lue = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification Emploi du Temps pour {self.utilisateur.username}"