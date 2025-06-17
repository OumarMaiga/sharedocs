# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Pour simplifier, on va utiliser un groupe commun.
        # En production, vous pouvez créer des groupes par utilisateur.
        self.group_name = "notifications"

        # Accepter la connexion
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Cette méthode est appelée pour recevoir un message du groupe
    async def send_notification(self, event):
        # Le contenu du message est stocké dans event['message']
        message = event['message']
        # Envoyer le message sur le WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
