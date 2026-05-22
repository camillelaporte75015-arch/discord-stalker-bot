const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.stalkers = new Map(); // { userId: { targetId: { salonId: string, mention: boolean } } }
    this.antistalk = new Set(); // { userId: string }
    this.owner = process.env.GUILD_ID_OWNER;
  }

  // Sauvegarde des données dans un fichier JSON
  save() {
    const data = {
      stalkers: Array.from(this.stalkers.entries()).reduce((acc, [userId, stalkData]) => {
        acc[userId] = stalkData;
        return acc;
      }, {}),
      antistalk: Array.from(this.antistalk),
    };
    fs.writeFileSync(path.join(__dirname, '../logs/stalker_data.json'), JSON.stringify(data, null, 2));
  }

  // Chargement des données depuis le fichier JSON
  load() {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../logs/stalker_data.json'), 'utf-8'));
      this.stalkers = new Map(Object.entries(data.stalkers));
      this.antistalk = new Set(data.antistalk);
    } catch (err) {
      console.log('No existing data found. Starting fresh.');
    }
  }

  // Ajouter un stalker
  addStalker(userId, targetId, mention) {
    if (!this.stalkers.has(userId)) {
      this.stalkers.set(userId, { [targetId]: { salonId: null, mention } });
    } else {
      const stalkData = this.stalkers.get(userId);
      if (!stalkData[targetId]) {
        stalkData[targetId] = { salonId: null, mention };
      }
    }
    this.save();
  }

  // Supprimer un stalker
  removeStalker(userId, targetId) {
    if (this.stalkers.has(userId)) {
      const stalkData = this.stalkers.get(userId);
      delete stalkData[targetId];
      if (Object.keys(stalkData).length === 0) {
        this.stalkers.delete(userId);
      }
      this.save();
    }
  }

  // Vérifier si un utilisateur est en antistalk
  isAntistalk(userId) {
    return this.antistalk.has(userId);
  }

  // Ajouter un utilisateur en antistalk
  addAntistalk(userId) {
    this.antistalk.add(userId);
    this.save();
  }

  // Supprimer un utilisateur de antistalk
  removeAntistalk(userId) {
    this.antistalk.delete(userId);
    this.save();
  }

  // Lister les utilisateurs en antistalk
  listAntistalk() {
    return Array.from(this.antistalk);
  }
}

module.exports = new Database();
