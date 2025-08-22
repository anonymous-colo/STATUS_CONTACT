import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatsCards } from "./StatsCards";
import { ContactsTable } from "./ContactsTable";
import { BroadcastPanel } from "./BroadcastPanel";
import { SettingsPanel } from "./SettingsPanel";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BarChart3, Users, Radio, Settings, ExternalLink, LogOut } from "lucide-react";

type TabType = "dashboard" | "contacts" | "broadcast" | "settings";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      onLogout();
    },
    onError: () => {
      // Even if logout fails, redirect to login
      onLogout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const tabConfig = {
    dashboard: {
      icon: BarChart3,
      label: "Tableau de bord",
      component: <div><StatsCards isAdmin /><div className="mt-8"><RecentActivity /></div></div>,
    },
    contacts: {
      icon: Users,
      label: "Contacts",
      component: <ContactsTable />,
    },
    broadcast: {
      icon: Radio,
      label: "Broadcast",
      component: <BroadcastPanel />,
    },
    settings: {
      icon: Settings,
      label: "Paramètres",
      component: <SettingsPanel />,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-lg border-b border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                STATUS CONTACTS ADMIN🚀🔥
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.open("/", "_blank")}
                variant="ghost"
                className="text-gray-600 dark:text-slate-300"
                data-testid="button-public-site"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Site public
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {Object.entries(tabConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                className={`py-4 px-2 border-b-2 font-medium ${
                  activeTab === key
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                }`}
                data-testid={`tab-${key}`}
              >
                <config.icon className="w-4 h-4 mr-2" />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {tabConfig[activeTab].component}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="container mx-auto px-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Activité récente
        </h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {String.fromCharCode(65 + i)}{String.fromCharCode(66 + i)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Nouveau contact inscrit
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Il y a {2 * (i + 1)} minutes
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                Nouveau
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
