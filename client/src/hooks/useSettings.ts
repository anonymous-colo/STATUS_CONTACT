import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePublicSettings() {
  return useQuery({
    queryKey: ["/api/settings/public"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["/api/admin/settings"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSettingsMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateSettings = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest("PATCH", "/api/admin/settings", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/public"] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Échec de la mise à jour des paramètres";
      toast({
        title: "Erreur de configuration",
        description: `Impossible de sauvegarder les paramètres : ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  const testEmail = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/test-email");
    },
    onSuccess: () => {
      toast({
        title: "Test réussi",
        description: "La configuration SMTP fonctionne correctement",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Erreur de configuration SMTP";
      toast({
        title: "Test SMTP échoué",
        description: `Configuration email incorrecte : ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  return {
    updateSettings,
    testEmail,
  };
}
