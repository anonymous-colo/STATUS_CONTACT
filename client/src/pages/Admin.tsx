import React, { useState } from "react";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          {!isLoggedIn ? (
            <AdminLogin onSuccess={handleLoginSuccess} />
          ) : (
            <AdminDashboard onLogout={handleLogout} />
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
