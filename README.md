# Discord Stalker Bot

## 🔐 Configuration
1. Remplacez `DISCORD_TOKEN` dans `.env` par votre token Discord bot.
2. Configurez `GUILD_ID_OWNER` avec votre ID de serveur propriétaire.
3. Déployez le bot sur plusieurs serveurs via `scripts/deploy.sh`.

## 📋 Commandes

### **Stalking**
- `!stalk @utilisateur` → Crée un salon privé pour stalker l'utilisateur.
- `!antistalk @utilisateur` → Désactive le stalk pour un utilisateur (seul l'owner peut faire ça).
- `!antistalk list` → Liste des utilisateurs bloqués.
- `!restalk @utilisateur` → Réactive le stalk pour un utilisateur bloqué.

### **Personnalisation**
- `!say u` → Écrit "u" au lieu du bot (seul l'owner).
- `!play` → Permet de jouer des commandes au bot (ex: `!play echo "Bonjour"`).

## 📂 Structure du Projet
- `src/` → Contient les commandes et événements.
- `assets/` → Embeds et fichiers statiques.
- `logs/` → Logs du bot.

## 🚀 Déploiement
