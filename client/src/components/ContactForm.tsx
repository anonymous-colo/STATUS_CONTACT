import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageProvider";
import { apiRequest } from "@/lib/queryClient";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(5, "Numéro de téléphone requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  countryCode: z.string(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess: (name: string) => void;
}

const countryCodes = [
  { code: "+509", flag: "🇭🇹", name: "Haiti" },
  { code: "+1", flag: "🇺🇸", name: "USA/Canada" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
];

export function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState("+509");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      countryCode: "+509",
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Validate phone number
      const fullPhone = `${data.countryCode}${data.phone}`;
      if (!isValidPhoneNumber(fullPhone)) {
        throw new Error(t("error-phone-invalid"));
      }

      return apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      const name = form.getValues("name");
      onSuccess(name);
      form.reset();
    },
    onError: (error: any) => {
      const message = error.message || t("error-network");
      if (message.includes("déjà enregistré") || message.includes("already registered")) {
        toast({
          title: "Erreur",
          description: t("error-phone-exists"),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: ContactFormData) => {
    createContactMutation.mutate({
      ...data,
      countryCode: selectedCountry,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("register-title")}
          </h2>
          <p className="text-gray-600 dark:text-slate-300">
            {t("register-subtitle")}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-slate-300">
              {t("name-label")}
            </Label>
            <Input
              {...form.register("name")}
              placeholder={t("name-placeholder")}
              className="px-4 py-3 rounded-xl"
              data-testid="input-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {t("name-suffix-note")}
            </p>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-slate-300">
              {t("phone-label")}
            </Label>
            <div className="flex rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus-within:ring-2 focus-within:ring-blue-500">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-32 border-none rounded-l-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                {...form.register("phone")}
                type="tel"
                placeholder={t("phone-placeholder")}
                className="flex-1 border-none rounded-r-xl focus-visible:ring-0"
                data-testid="input-phone"
              />
            </div>
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-slate-300">
              {t("email-label")}
            </Label>
            <Input
              {...form.register("email")}
              type="email"
              placeholder={t("email-placeholder")}
              className="px-4 py-3 rounded-xl"
              data-testid="input-email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createContactMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            data-testid="button-submit"
          >
            {createContactMutation.isPending ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Inscription en cours...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <i className="fas fa-user-plus mr-2" />
                {t("register-button")}
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
