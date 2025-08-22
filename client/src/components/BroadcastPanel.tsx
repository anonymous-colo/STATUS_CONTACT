import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const broadcastSchema = z.object({
  subject: z.string().min(1, "Sujet requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type BroadcastFormData = z.infer<typeof broadcastSchema>;

export function BroadcastPanel() {
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const form = useForm<BroadcastFormData>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: BroadcastFormData) => {
      return apiRequest("POST", "/api/admin/broadcast/message", data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Message envoyé",
        description: `Envoyé à ${data.sent} destinataires`,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Échec de l'envoi du message",
        variant: "destructive",
      });
    },
  });

  const sendVCFMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/broadcast/vcf");
    },
    onSuccess: (data: any) => {
      toast({
        title: "VCF envoyé",
        description: `Fichier envoyé à ${data.sent} destinataires`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'envoi VCF",
        description: error.message || "Échec de l'envoi du fichier",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BroadcastFormData) => {
    sendMessageMutation.mutate(data);
  };

  const handleSendVCF = () => {
    if (window.confirm("Envoyer le fichier VCF à tous les contacts avec email ?")) {
      sendVCFMutation.mutate();
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Broadcast Email</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Message */}
        <Card>
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label className="mb-2">Sujet</Label>
                <Input
                  {...form.register("subject")}
                  placeholder="Sujet du message..."
                  data-testid="input-subject"
                />
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2">Message</Label>
                <Textarea
                  {...form.register("message")}
                  rows={6}
                  placeholder="Votre message..."
                  data-testid="textarea-message"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={sendMessageMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600"
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="fas fa-paper-plane mr-2" />
                    Envoyer le message
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Send VCF */}
        <Card>
          <CardHeader>
            <CardTitle>Envoyer le fichier VCF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center">
                <i className="fas fa-info-circle text-blue-500 mr-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Cette action enverra le fichier VCF contenant tous les contacts à toutes les
                  personnes ayant fourni un email.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Nombre de destinataires avec email :
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-email-recipients">
                {stats?.withEmail?.toLocaleString() || "0"}
              </p>
            </div>

            <Button
              onClick={handleSendVCF}
              disabled={sendVCFMutation.isPending}
              className="w-full bg-green-500 hover:bg-green-600"
              data-testid="button-send-vcf"
            >
              {sendVCFMutation.isPending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <i className="fas fa-file-export mr-2" />
                  Envoyer le VCF par email
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
