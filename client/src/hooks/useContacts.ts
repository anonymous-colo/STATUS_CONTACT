import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContactFilters {
  search?: string;
  from?: string;
  to?: string;
  withEmail?: boolean;
  page?: number;
  limit?: number;
}

export function useContacts(filters: ContactFilters = {}) {
  const queryKey = ["/api/admin/contacts", filters];

  return useQuery({
    queryKey,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useRecentContacts() {
  return useQuery({
    queryKey: ["/api/contacts/recent"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });
}

export function useContactMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateContact = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return apiRequest("PATCH", `/api/admin/contacts/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Contact mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Échec de la mise à jour du contact";
      toast({
        title: "Erreur de mise à jour",
        description: `Impossible de modifier le contact : ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Échec de la suppression du contact";
      toast({
        title: "Erreur de suppression",
        description: `Impossible de supprimer le contact : ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  const deleteAllContacts = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/admin/contacts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Tous les contacts supprimés",
        description: "La base de données a été vidée",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || "Échec de la suppression des contacts";
      toast({
        title: "Erreur de suppression",
        description: `Impossible de supprimer tous les contacts : ${errorMessage}`,
        variant: "destructive",
      });
    },
  });

  return {
    updateContact,
    deleteContact,
    deleteAllContacts,
  };
}
