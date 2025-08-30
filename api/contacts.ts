import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'contacts.json');

// Fonction qui s'assure que le dossier et le fichier existent
function ensureStorage() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify([]));
  }
}

// Handler principal
export default function handler(req: VercelRequest, res: VercelResponse) {
  ensureStorage();

  if (req.method === 'POST') {
    const { nom, prenom, telephone } = req.body;

    // Vérification des champs
    if (!nom || !prenom || !telephone) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // Lecture des contacts existants
    const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    const newContact = {
      id: Date.now(),
      nom,
      prenom,
      telephone,
      date: new Date().toISOString(),
    };

    // Sauvegarde du nouveau contact
    data.push(newContact);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));

    return res.status(201).json({
      message: 'Inscription réussie ✅',
      contact: newContact,
    });
  }

  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    return res.status(200).json(data);
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
                       }
