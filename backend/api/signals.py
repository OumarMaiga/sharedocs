from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Projet, EspaceCollaboration
from .models import EmploiDuTemps, EmploiDuTempsNotification
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EmploiDuTemps, EmploiDuTempsNotification
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
@receiver(post_save, sender=Projet)
def creer_espace_collaboration_auto(sender, instance, created, **kwargs):
    """
    Crée automatiquement un espace de collaboration lorsqu'un projet est créé.
    """
    if created:
        print(f"🔄 Création automatique de l'espace pour {instance.titre}...")
        espace, _ = EspaceCollaboration.objects.get_or_create(projet=instance)
        # Ajouter l'enseignant et les étudiants déjà présents
        espace.membres.set(list(instance.etudiants.all()) + [instance.enseignant])
        print(f"✅ Espace de collaboration créé pour {instance.titre} avec {espace.membres.count()} membres.")

@receiver(m2m_changed, sender=Projet.etudiants.through)
def ajouter_etudiants_dans_espace(sender, instance, action, **kwargs):
    """
    Ajoute les étudiants dans l'espace de collaboration lorsqu'ils sont assignés à un projet.
    """
    if action in ["post_add", "post_remove", "post_clear"]:
        try:
            espace = EspaceCollaboration.objects.get(projet=instance)
            espace.membres.set(list(instance.etudiants.all()) + [instance.enseignant])
            print(f"🔄 Mise à jour des membres de l'espace pour {instance.titre}. Total membres : {espace.membres.count()}")
        except EspaceCollaboration.DoesNotExist:
            print("🚨 L'espace de collaboration n'existe pas encore pour ce projet.")


User = get_user_model()  # Récupérer le bon modèle utilisateur

@receiver(post_save, sender=EmploiDuTemps)
def creer_notifications_emploi_du_temps(sender, instance, created, **kwargs):
    if created:
        utilisateurs = User.objects.all()  # Utiliser get_user_model() au lieu de User
        for utilisateur in utilisateurs:
            EmploiDuTempsNotification.objects.create(
                utilisateur=utilisateur,
                message=f"Un nouvel emploi du temps a été ajouté le {instance.date_ajout.strftime('%d-%m-%Y')}.",
            )