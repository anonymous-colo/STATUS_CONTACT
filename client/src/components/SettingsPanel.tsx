import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminSettings, useSettingsMutations } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const generalSettingsSchema = z.object({
  contactEmail: z.string().email("Email invalide"),
  whatsappNumber: z.string().min(1, "Numéro WhatsApp requis"),
  currentSuffix: z.string().min(1, "Suffixe requis"),
  groupWhatsappLink: z.string().url("URL invalide"),
});

const socialSettingsSchema = z.object({
  facebookUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  twitterUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  instagramUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;
type SocialSettingsData = z.infer<typeof socialSettingsSchema>;

export function SettingsPanel() {
  const { data: settings, isLoading } = useAdminSettings();
  const { updateSettings, testEmail } = useSettingsMutations();

  const generalForm = useForm<GeneralSettingsData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: settings ? {
      contactEmail: settings.contactEmail,
      whatsappNumber: settings.whatsappNumber,
      currentSuffix: settings.currentSuffix,
      groupWhatsappLink: settings.groupWhatsappLink,
    } : undefined,
  });

  const socialForm = useForm<SocialSettingsData>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: settings ? {
      facebookUrl: settings.facebookUrl || "",
      twitterUrl: settings.twitterUrl || "",
      instagramUrl: settings.instagramUrl || "",
      linkedinUrl: settings.linkedinUrl || "",
    } : undefined,
  });

  // Update form values when settings load
  React.useEffect(() => {
    if (settings) {
      generalForm.reset({
        contactEmail: settings.contactEmail,
        whatsappNumber: settings.whatsappNumber,
        currentSuffix: settings.currentSuffix,
        groupWhatsappLink: settings.groupWhatsappLink,
      });

      socialForm.reset({
        facebookUrl: settings.facebookUrl || "",
        twitterUrl: settings.twitterUrl || "",
        instagramUrl: settings.instagramUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
      });
    }
  }, [settings, generalForm, socialForm]);

  const onSubmitGeneral = (data: GeneralSettingsData) => {
    updateSettings.mutate(data);
  };

  const onSubmitSocial = (data: SocialSettingsData) => {
    updateSettings.mutate(data);
  };

  const handleTestEmail = () => {
    testEmail.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Paramètres du système
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-4">
              <div>
                <Label className="mb-2">Email de contact</Label>
                <Input
                  {...generalForm.register("contactEmail")}
                  type="email"
                  data-testid="input-contact-email"
                />
                {generalForm.formState.errors.contactEmail && (
                  <p className="text-sm text-red-500 mt-1">
                    {generalForm.formState.errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2">Numéro WhatsApp</Label>
                <Input
                  {...generalForm.register("whatsappNumber")}
                  type="tel"
                  data-testid="input-whatsapp-number"
                />
                {generalForm.formState.errors.whatsappNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {generalForm.formState.errors.whatsappNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2">Suffixe actuel</Label>
                <Input
                  {...generalForm.register("currentSuffix")}
                  data-testid="input-current-suffix"
                />
                {generalForm.formState.errors.currentSuffix && (
                  <p className="text-sm text-red-500 mt-1">
                    {generalForm.formState.errors.currentSuffix.message}
                  </p>
                )}
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  ⚠️ N'affecte que les nouvelles inscriptions
                </p>
              </div>

              <div>
                <Label className="mb-2">Lien groupe WhatsApp</Label>
                <Input
                  {...generalForm.register("groupWhatsappLink")}
                  type="url"
                  data-testid="input-group-whatsapp"
                />
                {generalForm.formState.errors.groupWhatsappLink && (
                  <p className="text-sm text-red-500 mt-1">
                    {generalForm.formState.errors.groupWhatsappLink.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600"
                data-testid="button-save-general"
              >
                {updateSettings.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Sauvegarde...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="fas fa-save mr-2" />
                    Sauvegarder les paramètres
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Media Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Réseaux sociaux et Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={socialForm.handleSubmit(onSubmitSocial)} className="space-y-4">
              <div>
                <Label className="mb-2">Facebook</Label>
                <Input
                  {...socialForm.register("facebookUrl")}
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  data-testid="input-facebook"
                />
                {socialForm.formState.errors.facebookUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {socialForm.formState.errors.facebookUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2">Twitter</Label>
                <Input
                  {...socialForm.register("twitterUrl")}
                  type="url"
                  placeholder="https://twitter.com/yourhandle"
                  data-testid="input-twitter"
                />
                {socialForm.formState.errors.twitterUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {socialForm.formState.errors.twitterUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2">Instagram</Label>
                <Input
                  {...socialForm.register("instagramUrl")}
                  type="url"
                  placeholder="https://instagram.com/yourprofile"
                  data-testid="input-instagram"
                />
                {socialForm.formState.errors.instagramUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {socialForm.formState.errors.instagramUrl.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2">LinkedIn</Label>
                <Input
                  {...socialForm.register("linkedinUrl")}
                  type="url"
                  placeholder="https://linkedin.com/company/yourcompany"
                  data-testid="input-linkedin"
                />
                {socialForm.formState.errors.linkedinUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {socialForm.formState.errors.linkedinUrl.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="w-full bg-green-500 hover:bg-green-600"
                data-testid="button-save-social"
              >
                {updateSettings.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Sauvegarde...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="fas fa-save mr-2" />
                    Sauvegarder les liens
                  </div>
                )}
              </Button>
            </form>

            {/* Test Email */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test SMTP</h4>
              <Button
                onClick={handleTestEmail}
                disabled={testEmail.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600"
                data-testid="button-test-email"
              >
                {testEmail.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Test en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="fas fa-paper-plane mr-2" />
                    Tester l'envoi d'email
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
