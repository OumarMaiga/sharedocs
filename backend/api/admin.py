from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
from .models import Utilisateur, Filiere, Niveau, Classe, Notification, Module, SupportCours, Projet, Soumission,ProfNotification,EspaceCollaboration,Message, Notification

# Enregistrement des modèles normaux
admin.site.register(Utilisateur)
admin.site.register(Filiere)
admin.site.register(Niveau)
admin.site.register(Classe)
admin.site.register(Module)
admin.site.register(SupportCours)
admin.site.register(Soumission)
admin.site.register(EspaceCollaboration)
admin.site.register(Message)


class ProjetAdminForm(forms.ModelForm):
    class Meta:
        model = Projet
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        module = cleaned_data.get('module')
        etudiants = cleaned_data.get('etudiants')  # Ce champ est déjà un QuerySet ou une liste

        if module and module.classe and etudiants:
            classe_du_module = module.classe
            for etudiant in etudiants:  # Pas besoin d'appeler .all() ici
                if etudiant.classe != classe_du_module:
                    raise ValidationError(
                        f"L'étudiant {etudiant.username} n'appartient pas à la classe du module ({classe_du_module})."
                    )
        return cleaned_data

class ProjetAdmin(admin.ModelAdmin):
    form = ProjetAdminForm
    list_display = ('titre', 'module', 'enseignant', 'date_limite')
    filter_horizontal = ('etudiants',)  # Pour faciliter la sélection des étudiants

admin.site.register(Projet, ProjetAdmin)


# ✅ Ajout des notifications à l'administration
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'message', 'date_creation', 'lu')  # ✅ Affichage dans la liste
    list_filter = ('lu', 'date_creation')  # ✅ Filtres dans l'admin
    search_fields = ('message', 'utilisateur__username')  # ✅ Recherche
    ordering = ('-date_creation',)  # ✅ Trier par date décroissante
    


@admin.register(ProfNotification)
class ProfNotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'message', 'date_creation', 'lu', 'professeur')
    list_filter = ('lu', 'date_creation', 'professeur')
    search_fields = ('message', 'professeur__username')  