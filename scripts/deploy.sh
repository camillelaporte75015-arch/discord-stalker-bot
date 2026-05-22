#!/bin/bash

# Configuration
TOKEN="votre_token_bot_here"
GUILD_ID_OWNER="14343376448286720"
SERVER_IDS=("serveur1_id" "serveur2_id" "serveur3_id")  # Remplacez par vos IDs de serveurs

# Fonction pour déployer le bot sur un serveur
deploy_on_server() {
  local server_id=$1
  echo "🔧 Déployant sur le serveur ID: $server_id"

  # Vérifie si le serveur existe
  if ! curl -s -X GET "https://discord.com/api/v10/guilds/$server_id" | grep -q '"id":"'$server_id'"'; then
    echo "❌ Serveur $server_id introuvable."
    return 1
  fi

  # Crée un fichier .env personnalisé pour le serveur
  echo "DISCORD_TOKEN=$TOKEN" > ".env.server"
  echo "GUILD_ID_OWNER=$GUILD_ID_OWNER" >> ".env.server"
  echo "SERVER_ID=$server_id" >> ".env.server"

  # Déploie le bot sur le serveur
  node src/bot.js --server-id=$server_id
}

# Déploiement sur tous les serveurs
for server_id in "${SERVER_IDS[@]}"; do
  deploy_on_server "$server_id"
done

echo "🎉 Déploiement terminé sur tous les serveurs."
