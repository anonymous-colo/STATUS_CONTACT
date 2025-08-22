# STATUS CONTACTS🇭🇹 - Plateforme Professionnelle de Collecte de Contacts

Une plateforme full-stack moderne et sophistiquée pour la collecte et la gestion de contacts WhatsApp avec interface multilingue et dashboard administrateur.

## 🚀 Fonctionnalités

### Site Public
- ✅ Formulaire d'inscription avec validation internationale des numéros de téléphone
- ✅ Compteurs dynamiques temps réel (vues statut WhatsApp, personnes en ligne)
- ✅ Système de suffixes avec snapshot lors de l'inscription
- ✅ Témoignages avec statistiques de croissance des contacts
- ✅ FAQ interactives et section contact dynamique
- ✅ Mode sombre/clair avec persistance
- ✅ Support multilingue (FR/EN/ES) avec i18next
- ✅ Design responsive et animations fluides

### Dashboard Administrateur
- ✅ Authentification sécurisée (admin/kerventz2025)
- ✅ Gestion complète des contacts (CRUD, recherche, filtres)
- ✅ Export VCF et CSV protégés
- ✅ Système de broadcast email avec envoi de fichiers VCF
- ✅ Statistiques et graphiques d'inscription
- ✅ Paramètres système avec gestion des réseaux sociaux
- ✅ Test de configuration SMTP

### Technique
- ✅ Intégration Supabase complète avec Drizzle ORM
- ✅ Validation téléphone internationale (libphonenumber-js)
- ✅ API REST sécurisée avec middleware d'authentification
- ✅ Génération automatique de fichier ZIP du projet
- ✅ Support SMTP pour confirmations email
- ✅ Session admin 24h avec option "se souvenir"

## 🛠 Tech Stack

### Frontend
- **React** + **Vite** - Framework et build tool moderne
- **Tailwind CSS** + **Shadcn UI** - Design system et composants
- **React Query** - Gestion d'état et cache des données
- **React Hook Form** + **Zod** - Gestion des formulaires et validation
- **i18next** - Internationalisation (FR/EN/ES)
- **libphonenumber-js** - Validation des numéros de téléphone
- **Wouter** - Routage léger

### Backend
- **Express.js** - Serveur API REST
- **Drizzle ORM** - ORM moderne pour PostgreSQL
- **Supabase** - Base de données PostgreSQL hébergée
- **express-session** - Gestion des sessions
- **nodemailer** - Envoi d'emails SMTP
- **JSZip** - Génération automatique de ZIP

### Utilitaires
- **VCard.js** - Export des contacts en format VCF
- **CSV Writer** - Export des données en CSV
- **bcryptjs** - Hachage des mots de passe
- **CORS** - Configuration des politiques d'origine croisée

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Compte Supabase avec base de données PostgreSQL

### 1. Cloner le projet
```bash
git clone <repository-url>
cd status-contacts
