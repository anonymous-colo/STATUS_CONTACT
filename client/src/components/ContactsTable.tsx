import React, { useState } from "react";
import { useContacts, useContactMutations } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Trash2, Edit, Users } from "lucide-react";

interface ContactFilters {
  search: string;
  from: string;
  to: string;
  withEmail: boolean;
}

export function ContactsTable() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ContactFilters>({
    search: "",
    from: "",
    to: "",
    withEmail: false,
  });
  const [editingContact, setEditingContact] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const { data: contacts, isLoading } = useContacts(filters);
  const { updateContact, deleteContact, deleteAllContacts } = useContactMutations();

  const handleExportVCF = async () => {
    try {
      const response = await fetch("/api/admin/export/vcf", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `status-contacts-${new Date().toISOString().slice(0, 10)}.vcf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'export VCF",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/admin/export/csv", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `status-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'export CSV",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tous les contacts ? Cette action est irréversible.")) {
      deleteAllContacts.mutate();
    }
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setEditForm({
      name: contact.name,
      email: contact.email || "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingContact) return;

    updateContact.mutate({
      id: editingContact.id,
      updates: editForm,
    });
    setEditingContact(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Gestion des contacts
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleExportVCF}
            className="bg-green-500 hover:bg-green-600 text-white"
            data-testid="button-export-vcf"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger VCF
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            data-testid="button-export-csv"
          >
            <FileText className="w-4 h-4 mr-2" />
            Télécharger CSV
          </Button>
          <Button
            onClick={handleDeleteAll}
            variant="destructive"
            disabled={deleteAllContacts.isPending}
            data-testid="button-delete-all"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer tous
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2">Rechercher</Label>
              <Input
                placeholder="Nom ou numéro..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                data-testid="input-search"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Date de début</Label>
              <Input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                data-testid="input-date-from"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2">Date de fin</Label>
              <Input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                data-testid="input-date-to"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.withEmail}
                  onChange={(e) => setFilters({ ...filters, withEmail: e.target.checked })}
                  className="rounded border-gray-300"
                  data-testid="checkbox-with-email"
                />
                <span className="text-sm">Avec email seulement</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Nom complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                {(contacts || []).map((contact: any) => (
                  <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {contact.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {contact.phoneE164}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {contact.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => handleEditContact(contact)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            data-testid={`button-edit-${contact.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier le contact</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Nom</Label>
                              <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                data-testid="input-edit-name"
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                data-testid="input-edit-email"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={handleSaveEdit}
                                disabled={updateContact.isPending}
                                data-testid="button-save-edit"
                              >
                                Sauvegarder
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <button
                        onClick={() => {
                          if (window.confirm("Supprimer ce contact ?")) {
                            deleteContact.mutate(contact.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        data-testid={`button-delete-${contact.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
