import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_PASSWORD = "kerventz2007"; // 🔑 mot de passe admin

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Mot de passe requis" });
  }

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, message: "Connexion réussie ✅" });
  } else {
    return res.status(401).json({ success: false, message: "Mot de passe incorrect ❌" });
  }
}
