import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { ContactForm } from "@/components/ContactForm";
import { StatsCards } from "@/components/StatsCards";
import { useRecentContacts } from "@/hooks/useContacts";
import { usePublicSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const { data: settings } = usePublicSettings();
  const { data: recentContacts } = useRecentContacts();

  const handleRegistrationSuccess = (name: string) => {
    setSuccessName(name);
    setShowSuccessMessage(true);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const testimonials = [
    {
      name: "Marc Antoine",
      role: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      before: 75,
      after: 520,
      increase: 693,
      text: "Avant : 75 contacts. Après : 520 contacts ! Une croissance de 693%. Incroyable plateforme pour développer son réseau."
    },
    {
      name: "Sophie Martin",
      role: "Consultante",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b05b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      before: 45,
      after: 387,
      increase: 860,
      text: "J'avais seulement 45 contacts business. Maintenant j'en ai 387 ! Une augmentation de 860%. Mes ventes ont explosé."
    },
    {
      name: "David Charles",
      role: "Coach Business",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      before: 120,
      after: 842,
      increase: 702,
      text: "De 120 à 842 contacts en quelques semaines ! 702% d'augmentation. Cette plateforme a transformé mon business."
    },
    {
      name: "Lisa Rodriguez",
      role: "Marketing Digital",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      before: 89,
      after: 654,
      increase: 735,
      text: "Résultats exceptionnels ! Passée de 89 à 654 contacts, soit 735% d'augmentation. Mes campagnes touchent plus de monde."
    },
    {
      name: "Pierre Morel",
      role: "Développeur",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      before: 156,
      after: 987,
      increase: 632,
      text: "Interface intuitive, résultats immédiats ! De 156 à 987 contacts. Une croissance de 632% qui a boosté ma freelance."
    },
    {
      name: "Anna Williams",
      role: "Responsable Ventes",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      before: 203,
      after: 1456,
      increase: 717,
      text: "Impressionnant ! Mon réseau est passé de 203 à 1456 contacts, soit 717% d'augmentation. Mes objectifs de vente dépassés."
    }
  ];

  const faqItems = [
    {
      question: t("faq-1-q"),
      answer: t("faq-1-a")
    },
    {
      question: t("faq-2-q"),
      answer: t("faq-2-a")
    },
    {
      question: t("faq-3-q"),
      answer: t("faq-3-a")
    },
    {
      question: t("faq-4-q"),
      answer: t("faq-4-a")
    },
    {
      question: t("faq-5-q"),
      answer: t("faq-5-a")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
          data-testid="button-theme-toggle"
        >
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-slate-600 dark:text-slate-300`} />
        </button>
      </div>

      {/* Language Selector */}
      <div className="fixed top-4 left-4 z-50">
        <Select value={currentLanguage} onValueChange={changeLanguage}>
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700" data-testid="select-language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">🇫🇷 Français</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
            <SelectItem value="es">🇪🇸 Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              STATUS CONTACTS🇭🇹
              <span className="block text-3xl md:text-4xl mt-4 text-yellow-300">🚀🔥</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t("hero-subtitle")}
            </p>
            
            {/* Stats Cards */}
            <div className="mt-12">
              <StatsCards />
            </div>
          </div>
        </div>
      </header>

      {/* Registration Form Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          {!showSuccessMessage ? (
            <ContactForm onSuccess={handleRegistrationSuccess} />
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-700">
                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 text-xl mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        {t("success-title")} {successName}!
                      </h4>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        {t("success-message")}
                      </p>
                      <a
                        href={settings?.groupWhatsappLink || "https://chat.whatsapp.com/CsVWRycnwNHFhqVLEtFyZv"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        data-testid="link-whatsapp-group"
                      >
                        <i className="fab fa-whatsapp text-xl mr-2" />
                        {t("join-whatsapp")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Registrations */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("recent-registrations")}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="space-y-4" data-testid="recent-contacts-list">
                  {recentContacts?.map((contact: any, index: number) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-600 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {contact.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900 dark:text-white">{contact.fullName}</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">{contact.phoneDisplay}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {new Date(contact.createdAt).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )) || Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-600 rounded-xl animate-pulse">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-slate-500 rounded-full" />
                        <div className="ml-3">
                          <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-32 mb-1" />
                          <div className="h-3 bg-gray-300 dark:bg-slate-500 rounded w-24" />
                        </div>
                      </div>
                      <div className="h-3 bg-gray-300 dark:bg-slate-500 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("testimonials-title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-slate-300 mb-4">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <span className="text-sm text-red-500 font-medium">Avant: {testimonial.before}</span>
                  <i className="fas fa-arrow-right text-gray-400 mx-2" />
                  <span className="text-sm text-green-500 font-medium">
                    Après: {testimonial.after} (+{testimonial.increase}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("faq-title")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                  data-testid={`button-faq-${index}`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.question}</h3>
                  <i className={`fas fa-chevron-down text-gray-500 transform transition-transform duration-200 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-slate-300">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("contact-title")}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* WhatsApp Contact */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4">
                  <i className="fab fa-whatsapp text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("whatsapp-contact")}
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-4">
                  {t("whatsapp-contact-desc")}
                </p>
                <a
                  href={`https://wa.me/${settings?.whatsappNumber?.replace('+', '') || '18495849472'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  data-testid="link-whatsapp-contact"
                >
                  <i className="fab fa-whatsapp mr-2" />
                  {settings?.whatsappNumber || '+1 (849) 584-9472'}
                </a>
              </div>

              {/* Email Contact */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
                  <i className="fas fa-envelope text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t("email-contact")}
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-4">
                  {t("email-contact-desc")}
                </p>
                <a
                  href={`mailto:${settings?.contactEmail || 'contact.kerventzweb@gmail.com'}`}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  data-testid="link-email-contact"
                >
                  <i className="fas fa-envelope mr-2" />
                  {settings?.contactEmail || 'contact.kerventzweb@gmail.com'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">STATUS CONTACTS🇭🇹</h3>
              <p className="text-gray-300 mb-4">
                {t("footer-desc")}
              </p>
              <div className="flex space-x-4">
                {settings?.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <i className="fab fa-facebook text-xl" />
                  </a>
                )}
                {settings?.twitterUrl && (
                  <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <i className="fab fa-twitter text-xl" />
                  </a>
                )}
                {settings?.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <i className="fab fa-instagram text-xl" />
                  </a>
                )}
                {settings?.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <i className="fab fa-linkedin text-xl" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("footer-links")}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t("footer-home")}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t("footer-about")}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t("footer-contact")}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t("footer-privacy")}</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("footer-contact-info")}</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <i className="fab fa-whatsapp mr-2" />
                  {settings?.whatsappNumber || '+1 (849) 584-9472'}
                </p>
                <p className="flex items-center">
                  <i className="fas fa-envelope mr-2" />
                  {settings?.contactEmail || 'contact.kerventzweb@gmail.com'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              {t("footer-copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
