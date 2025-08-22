import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  isAdmin?: boolean;
}

export function StatsCards({ isAdmin = false }: StatsCardsProps) {
  const [whatsappViews, setWhatsappViews] = useState(45763);
  const [onlineUsers, setOnlineUsers] = useState(1847);

  // Dynamic counters for public site
  useEffect(() => {
    if (!isAdmin) {
      const interval = setInterval(() => {
        // WhatsApp views increase by 1-4 every 2 seconds
        setWhatsappViews((prev) => prev + Math.floor(Math.random() * 4) + 1);

        // Online users fluctuate between 1274 and 2370
        setOnlineUsers((prev) => {
          const change = (Math.random() - 0.5) * 20; // -10 to +10
          return Math.max(1274, Math.min(2370, prev + Math.floor(change)));
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  // Get real stats for admin
  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAdmin,
  });

  const { data: publicStats } = useQuery({
    queryKey: ["/api/stats/public"],
    enabled: !isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isAdmin && adminStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <i className="fas fa-users text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-slate-400">Total des contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-contacts">
                  {adminStats.total.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <i className="fas fa-calendar-day text-2xl text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-slate-400">Contacts aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-today-contacts">
                  {adminStats.today.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <i className="fas fa-envelope text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-slate-400">Avec email</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-email-contacts">
                  {adminStats.withEmail.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Public stats cards with dynamic counters
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* WhatsApp Views */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center">
          <i className="fab fa-whatsapp text-4xl text-green-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-white">Vues de statut WhatsApp</h3>
          <div className="text-3xl font-bold text-white count-up" data-testid="text-whatsapp-views">
            {whatsappViews.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Online Users */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center">
          <i className="fas fa-users text-4xl text-blue-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-white">Personnes en ligne</h3>
          <div className="text-3xl font-bold text-white count-up" data-testid="text-online-users">
            {onlineUsers.toLocaleString()}
          </div>
        </div>
      </div>

      {/* My Status Stats */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="text-center">
          <i className="fas fa-chart-line text-4xl text-yellow-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-white">Statistiques de mon statut</h3>
          <div className="text-3xl font-bold text-white count-up">
            {whatsappViews.toLocaleString()} <span className="text-sm">vues</span>
          </div>
        </div>
      </div>
    </div>
  );
}
