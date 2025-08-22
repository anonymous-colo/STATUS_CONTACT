import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      // Header
      "hero-subtitle": "Plateforme professionnelle de collecte de contacts pour vos statuts WhatsApp",
      
      // Stats
      "whatsapp-views": "Vues de statut WhatsApp",
      "online-users": "Personnes en ligne",
      "my-stats": "Statistiques de mon statut",
      
      // Registration Form
      "register-title": "Rejoignez notre communauté",
      "register-subtitle": "Inscrivez-vous pour accéder aux contacts de statut WhatsApp",
      "name-label": "Nom complet",
      "name-placeholder": "Votre nom...",
      "name-suffix-note": "Votre nom sera enregistré avec le suffixe actuel.",
      "phone-label": "Numéro de téléphone",
      "phone-placeholder": "Votre numéro...",
      "email-label": "Email (optionnel)",
      "email-placeholder": "votre.email@exemple.com",
      "register-button": "S'inscrire maintenant",
      
      // Success Message
      "success-title": "MERCI",
      "success-message": "Vous avez été enregistré avec succès. Maintenant je vous prie de bien vouloir entrer dans le groupe WhatsApp là où tu trouveras le folder VCF qui aura tous les contacts enregistrés pour que tu puisses le télécharger. Merci !",
      "join-whatsapp": "Rejoindre le groupe WhatsApp",
      
      // Sections
      "recent-registrations": "Dernières inscriptions",
      "testimonials-title": "Témoignages de nos membres",
      "faq-title": "Questions Fréquentes",
      "contact-title": "Contactez-nous",
      
      // FAQ
      "faq-1-q": "Comment fonctionne la collecte de contacts ?",
      "faq-1-a": "Vous vous inscrivez avec votre nom et numéro, puis rejoignez notre groupe WhatsApp où vous pouvez télécharger le fichier VCF contenant tous les contacts de la communauté.",
      "faq-2-q": "Mes données personnelles sont-elles sécurisées ?",
      "faq-2-a": "Absolument ! Nous utilisons un cryptage de niveau bancaire et respectons strictement les réglementations de protection des données. Vos informations ne sont jamais vendues ou partagées avec des tiers.",
      "faq-3-q": "Combien de contacts puis-je obtenir ?",
      "faq-3-a": "Le nombre de contacts disponibles grandit constamment avec notre communauté. Actuellement, plus de 45,000 contacts sont accessibles, et ce nombre augmente chaque jour.",
      "faq-4-q": "L'inscription est-elle vraiment gratuite ?",
      "faq-4-a": "Oui, l'inscription et l'accès aux contacts sont entièrement gratuits. Notre objectif est de créer la plus grande communauté de partage de contacts au monde.",
      "faq-5-q": "Puis-je supprimer mes informations plus tard ?",
      "faq-5-a": "Bien sûr ! Vous pouvez demander la suppression de vos données à tout moment en nous contactant. Nous traiterons votre demande dans les 48 heures.",
      
      // Contact
      "whatsapp-contact": "WhatsApp",
      "whatsapp-contact-desc": "Contactez-nous directement sur WhatsApp",
      "email-contact": "Email",
      "email-contact-desc": "Envoyez-nous un email pour toute question",
      
      // Footer
      "footer-desc": "La plateforme professionnelle pour développer votre réseau de contacts WhatsApp et booster votre business.",
      "footer-links": "Liens rapides",
      "footer-home": "Accueil",
      "footer-about": "À propos",
      "footer-contact": "Contact",
      "footer-privacy": "Confidentialité",
      "footer-contact-info": "Contact",
      "footer-copyright": "© 2025 STATUS CONTACTS🇭🇹. Tous droits réservés.",
      
      // Validation Messages
      "error-phone-invalid": "Numéro de téléphone invalide",
      "error-phone-exists": "Ce numéro est déjà enregistré",
      "error-network": "Erreur de connexion. Veuillez réessayer.",
    },
  },
  en: {
    translation: {
      // Header
      "hero-subtitle": "Professional contact collection platform for your WhatsApp statuses",
      
      // Stats
      "whatsapp-views": "WhatsApp Status Views",
      "online-users": "People Online",
      "my-stats": "My Status Statistics",
      
      // Registration Form
      "register-title": "Join Our Community",
      "register-subtitle": "Sign up to access WhatsApp status contacts",
      "name-label": "Full Name",
      "name-placeholder": "Your name...",
      "name-suffix-note": "Your name will be saved with the current suffix.",
      "phone-label": "Phone Number",
      "phone-placeholder": "Your number...",
      "email-label": "Email (optional)",
      "email-placeholder": "your.email@example.com",
      "register-button": "Sign Up Now",
      
      // Success Message
      "success-title": "THANK YOU",
      "success-message": "You have been successfully registered. Now please join the WhatsApp group where you will find the VCF folder that has all registered contacts for you to download. Thank you!",
      "join-whatsapp": "Join WhatsApp Group",
      
      // Sections
      "recent-registrations": "Recent Registrations",
      "testimonials-title": "Member Testimonials",
      "faq-title": "Frequently Asked Questions",
      "contact-title": "Contact Us",
      
      // FAQ
      "faq-1-q": "How does contact collection work?",
      "faq-1-a": "You sign up with your name and number, then join our WhatsApp group where you can download the VCF file containing all community contacts.",
      "faq-2-q": "Is my personal data secure?",
      "faq-2-a": "Absolutely! We use bank-level encryption and strictly comply with data protection regulations. Your information is never sold or shared with third parties.",
      "faq-3-q": "How many contacts can I get?",
      "faq-3-a": "The number of available contacts grows constantly with our community. Currently, over 45,000 contacts are accessible, and this number increases daily.",
      "faq-4-q": "Is registration really free?",
      "faq-4-a": "Yes, registration and access to contacts are completely free. Our goal is to create the world's largest contact sharing community.",
      "faq-5-q": "Can I delete my information later?",
      "faq-5-a": "Of course! You can request deletion of your data at any time by contacting us. We will process your request within 48 hours.",
      
      // Contact
      "whatsapp-contact": "WhatsApp",
      "whatsapp-contact-desc": "Contact us directly on WhatsApp",
      "email-contact": "Email",
      "email-contact-desc": "Send us an email for any questions",
      
      // Footer
      "footer-desc": "The professional platform to develop your WhatsApp contact network and boost your business.",
      "footer-links": "Quick Links",
      "footer-home": "Home",
      "footer-about": "About",
      "footer-contact": "Contact",
      "footer-privacy": "Privacy",
      "footer-contact-info": "Contact",
      "footer-copyright": "© 2025 STATUS CONTACTS🇭🇹. All rights reserved.",
      
      // Validation Messages
      "error-phone-invalid": "Invalid phone number",
      "error-phone-exists": "This number is already registered",
      "error-network": "Connection error. Please try again.",
    },
  },
  es: {
    translation: {
      // Header
      "hero-subtitle": "Plataforma profesional de recolección de contactos para tus estados de WhatsApp",
      
      // Stats
      "whatsapp-views": "Visualizaciones de Estado WhatsApp",
      "online-users": "Personas en Línea",
      "my-stats": "Estadísticas de mi Estado",
      
      // Registration Form
      "register-title": "Únete a Nuestra Comunidad",
      "register-subtitle": "Regístrate para acceder a los contactos de estado de WhatsApp",
      "name-label": "Nombre Completo",
      "name-placeholder": "Tu nombre...",
      "name-suffix-note": "Tu nombre se guardará con el sufijo actual.",
      "phone-label": "Número de Teléfono",
      "phone-placeholder": "Tu número...",
      "email-label": "Email (opcional)",
      "email-placeholder": "tu.email@ejemplo.com",
      "register-button": "Registrarse Ahora",
      
      // Success Message
      "success-title": "GRACIAS",
      "success-message": "Has sido registrado exitosamente. Ahora por favor únete al grupo de WhatsApp donde encontrarás la carpeta VCF que tiene todos los contactos registrados para que puedas descargar. ¡Gracias!",
      "join-whatsapp": "Unirse al Grupo WhatsApp",
      
      // Sections
      "recent-registrations": "Registros Recientes",
      "testimonials-title": "Testimonios de Miembros",
      "faq-title": "Preguntas Frecuentes",
      "contact-title": "Contáctanos",
      
      // FAQ
      "faq-1-q": "¿Cómo funciona la recolección de contactos?",
      "faq-1-a": "Te registras con tu nombre y número, luego te unes a nuestro grupo de WhatsApp donde puedes descargar el archivo VCF que contiene todos los contactos de la comunidad.",
      "faq-2-q": "¿Están seguros mis datos personales?",
      "faq-2-a": "¡Absolutamente! Utilizamos encriptación de nivel bancario y cumplimos estrictamente con las regulaciones de protección de datos. Tu información nunca se vende o comparte con terceros.",
      "faq-3-q": "¿Cuántos contactos puedo obtener?",
      "faq-3-a": "El número de contactos disponibles crece constantemente con nuestra comunidad. Actualmente, más de 45,000 contactos son accesibles, y este número aumenta diariamente.",
      "faq-4-q": "¿Es realmente gratuito el registro?",
      "faq-4-a": "Sí, el registro y el acceso a los contactos son completamente gratuitos. Nuestro objetivo es crear la comunidad de intercambio de contactos más grande del mundo.",
      "faq-5-q": "¿Puedo eliminar mi información más tarde?",
      "faq-5-a": "¡Por supuesto! Puedes solicitar la eliminación de tus datos en cualquier momento contactándonos. Procesaremos tu solicitud dentro de 48 horas.",
      
      // Contact
      "whatsapp-contact": "WhatsApp",
      "whatsapp-contact-desc": "Contáctanos directamente en WhatsApp",
      "email-contact": "Email",
      "email-contact-desc": "Envíanos un email para cualquier pregunta",
      
      // Footer
      "footer-desc": "La plataforma profesional para desarrollar tu red de contactos de WhatsApp y impulsar tu negocio.",
      "footer-links": "Enlaces Rápidos",
      "footer-home": "Inicio",
      "footer-about": "Acerca de",
      "footer-contact": "Contacto",
      "footer-privacy": "Privacidad",
      "footer-contact-info": "Contacto",
      "footer-copyright": "© 2025 STATUS CONTACTS🇭🇹. Todos los derechos reservados.",
      
      // Validation Messages
      "error-phone-invalid": "Número de teléfono inválido",
      "error-phone-exists": "Este número ya está registrado",
      "error-network": "Error de conexión. Por favor inténtalo de nuevo.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
